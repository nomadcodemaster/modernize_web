"use client";

import { useState } from "react";
import Link from "next/link";
import ButtonSignin from "@/components/ButtonSignin";

export default function Page() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setAnalysis(null);

    if (!validateUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze website");
      }

      setAnalysis(data);
      sessionStorage.setItem("websiteAnalysis", JSON.stringify(data));
      window.location.href = "/results";
    } catch (error) {
      setError(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <header className="p-4 flex justify-end max-w-7xl mx-auto">
        <ButtonSignin text="Login" />
      </header>
      <main>
        <section className="flex flex-col items-center justify-center text-center gap-12 px-8 py-24">
          <h1 className="text-3xl md:text-5xl font-extrabold">
            Modernize Your Website ⚡️
          </h1>

          <p className="text-lg opacity-80 max-w-2xl">
            Transform your outdated website into a modern, responsive React application 
            with just one click. Enter your website URL below to get started.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-4">
            <div className="form-control">
              <input 
                type="url" 
                placeholder="Enter your website URL (e.g., https://example.com)"
                className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              {error && (
                <label className="label">
                  <span className="label-text-alt text-error">{error}</span>
                </label>
              )}
            </div>
            <button 
              className={`btn btn-primary ${isAnalyzing ? 'loading' : ''}`}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Website'}
              {!isAnalyzing && !error && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </form>

          <div className="flex gap-4 text-sm opacity-80">
            <Link href="/pricing" className="link link-hover">
              View Pricing
            </Link>
            <span>•</span>
            <Link href="#how-it-works" className="link link-hover">
              How It Works
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
