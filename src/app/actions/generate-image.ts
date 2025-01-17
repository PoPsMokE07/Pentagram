"use server";

export async function generateImage(text: string) {
  try {
    const response = await fetch(`${process.env.API_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.API_KEY || "",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log("Data:", data);

    return data;
  } catch (error) {
    console.error("Server Error:", error);
    return { success: false, error: error instanceof Error ? error.message: "Failed to generate image", };
  }
}