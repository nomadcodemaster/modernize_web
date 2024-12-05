import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

async function analyzeWebsite(url) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: "networkidle0" });
    const html = await page.content();
    const screenshot = await page.screenshot({ 
      fullPage: true,
      encoding: "base64"
    });

    const $ = cheerio.load(html);
    
    // Extract components
    const components = [];
    
    // Detect header/navigation
    if ($('header, nav').length) {
      components.push({
        type: "header",
        content: $('header, nav').first().text().trim(),
        html: $('header, nav').first().html()
      });
    }

    // Detect hero section
    if ($('main section:first-child, div:first-child').length) {
      components.push({
        type: "hero",
        content: $('main section:first-child, div:first-child').first().text().trim(),
        html: $('main section:first-child, div:first-child').first().html()
      });
    }

    // Extract colors
    const styles = await page.evaluate(() => {
      const colors = new Set();
      const elements = document.querySelectorAll('*');
      
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        colors.add(style.color);
        colors.add(style.backgroundColor);
      });

      return {
        colors: Array.from(colors).filter(c => c !== 'rgba(0, 0, 0, 0)'),
        fonts: Array.from(new Set(Array.from(elements).map(el => 
          window.getComputedStyle(el).fontFamily
        )))
      };
    });

    await browser.close();

    return {
      title: $('title').text(),
      description: $('meta[name="description"]').attr('content'),
      components,
      styles,
      preview: screenshot
    };
  } catch (error) {
    await browser.close();
    throw error;
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeWebsite(body.url);
    return NextResponse.json(analysis);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to analyze website" },
      { status: 500 }
    );
  }
}