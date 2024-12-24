"use server";

import ImageGenerator from "./components/imageGeneror";
import { generateImage } from "./actions/generate-image";

export default async function Home() {
  return <ImageGenerator generateImage={generateImage} />;
}