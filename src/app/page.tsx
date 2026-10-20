"use client";

import { useState, FormEvent } from "react";
import { Loader2, Wand2, Download, AlertCircle, Sparkles } from "lucide-react";

const SAMPLE_PROMPTS = [
  "A serene Japanese garden in autumn with vibrant red maple leaves",
  "A futuristic cyberpunk neon city street at night in rain",
  "A cute astronaut cat floating in deep space, digital art",
  "A majestic dragon perched on a misty mountain peak at sunrise",
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setImage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setErrorMessage(data.error || "Failed to generate image.");
      } else if (data.url) {
        setImage(data.url);
      } else {
        setErrorMessage("No image received from server.");
      }
    } catch (e: any) {
      setErrorMessage(e?.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-zinc-950 text-white">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-amber-400" /> AI Image Generator
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base">
            Type a detailed description or pick a sample prompt to generate an image using Flux.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              className="flex-1 p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              placeholder="Describe the image you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              title={!prompt.trim() ? "Type a prompt first" : "Generate Image"}
              className="p-3.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate
                </>
              )}
            </button>
          </div>
        </form>

        {/* Sample Prompts */}
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(sample)}
                className="text-xs px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition text-left"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-lg bg-red-950/50 border border-red-800 text-red-200 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Generation Failed</p>
              <p className="text-red-300/90">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Display Area */}
        {loading && (
          <div className="aspect-square w-full rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
            <p className="text-sm font-medium animate-pulse">Creating your masterpiece with Flux AI...</p>
          </div>
        )}

        {image && !loading && (
          <div className="relative border border-zinc-800 rounded-xl overflow-hidden group bg-zinc-900">
            <img src={image} alt={prompt} className="w-full h-auto object-cover max-h-[600px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-between p-4">
              <p className="text-xs text-zinc-300 line-clamp-2 max-w-[80%]">{prompt}</p>
              <a
                href={image}
                target="_blank"
                rel="noopener noreferrer"
                download="generated-image.png"
                className="p-2.5 bg-amber-500 text-black rounded-lg hover:bg-amber-400 font-medium transition flex items-center gap-1.5 text-xs shrink-0"
              >
                <Download className="w-4 h-4" /> Download
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
