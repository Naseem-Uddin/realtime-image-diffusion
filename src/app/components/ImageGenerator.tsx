"use client";

import { useState } from "react";
import { generateImage } from "../actions/generateImage";

interface ImageGeneratorProps{
    generateImage:(
        text: string
    ) => Promise<{success: boolean; imageUrl?: string; error?: string}>;
}

export default function ImageGenerator({ generateImage }: ImageGeneratorProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setImageURL(null);

    try {
      const result = await generateImage(inputText);

      if (!result.success) {
        throw new Error(result.error || "Failed to generate image");
      }

      if (result.imageUrl){
        const img = new Image();
        const url = result.imageUrl;
        img.onload = () => {
          setImageURL(url);
        };
        img.src = url;
      }
      else {
        throw new Error("No image URL recieved");
      }

      setInputText("");
    } 
    
    catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate image",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-8 bg-gradient-to-r from-blue-500 to-purple-500">
      <main className="flex-1 flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold text-white">Image Generator</h1>
        {isLoading && (
          <div className="loader"></div> // Loading spinner
        )}
        {imageURL && (
          <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-lg bg-white">
            <img 
              src={imageURL}
              alt="Generated artwork"
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
      </main>

      <footer className="w-full max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-black/[.05] dark:bg-white/[.06] border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Describe the image you want to generate..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-6 py-3 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
      </footer>

      <style jsx>{`
        .loader {
          border: 8px solid rgba(255, 255, 255, 0.3);
          border-top: 8px solid white;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}