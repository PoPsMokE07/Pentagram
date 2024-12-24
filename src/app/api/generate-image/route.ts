import { NextResponse } from "next/server";
import crypto from "crypto";
import { put } from "@vercel/blob";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    // TODO: Call your Image Generation API here
    // For now, we'll just echo back the text
    console.log(text);

    const apiSecret = request.headers.get("X-API-Key");

    if (apiSecret !== process.env.API_KEY) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const url = new URL(process.env.Modal_URL || "");
    url.searchParams.set("prompt", text);

    console.log("Requesting URL",url.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        Accept: "image/jpeg",
      },
    });

    if (!response.ok) {
      const errortext=await response.text();
      console.error("API Response:",errortext);
      throw new Error(
        `HTTP error! status:${response.status},message:${errortext}`
      );
    }


    const imageBuffer = await response.arrayBuffer();

    const filename = `${crypto.randomUUID()}.jpg`

    const blob=await put(filename,imageBuffer,{
      access:"public",
      contentType:"image/jpeg",
    })

    return NextResponse.json({
      success:true,
      imageUrl:blob.url,
      //store the prompt and imageurl in the database
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}