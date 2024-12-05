"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Results() {
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const data = sessionStorage.getItem("websiteAnalysis");
    if (data) {
      setAnalysis(JSON.parse(data));
    }
  }, []);

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">No analysis data found</h1>
        <Link href="/" className="btn btn-primary">
          Analyze a Website
        </Link>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analysis Results</h1>
        <Link href="/" className="btn btn-ghost">
          New Analysis
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Website Preview</h2>
            {analysis.preview && (
              <img 
                src={`data:image/png;base64,${analysis.preview}`}
                alt="Website Preview"
                className="w-full rounded-lg shadow-lg"
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Detected Components</h2>
              <ul className="space-y-2">
                {analysis.components.map((component, i) => (
                  <li key={i} className="p-2 bg-base-100 rounded">
                    {component.type}: {component.content.substring(0, 50)}...
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Color Palette</h2>
              <div className="flex flex-wrap gap-2">
                {analysis.styles.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}