import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { extname, join } from "https://deno.land/std@0.203.0/path/mod.ts";

import { handleApi } from "./api.ts";

const distPath = "./dist"; // path to Vite build output

serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/api")) {
    return handleApi(req);
  }

  let filePath = join(distPath, url.pathname);

  // Serve index.html for root or unknown routes (React SPA fallback)
  try {
    const info = await Deno.stat(filePath);
    if (info.isDirectory) filePath = join(filePath, "index.html");
  } catch {
    filePath = join(distPath, "index.html");
  }

  try {
    const file = await Deno.readFile(filePath);
    const ext = extname(filePath);

    let contentType = "text/plain";
    if (ext === ".html") contentType = "text/html";
    else if (ext === ".js") contentType = "application/javascript";
    else if (ext === ".css") contentType = "text/css";
    else if (ext === ".json") contentType = "application/json";

    return new Response(file, { headers: { "Content-Type": contentType } });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}, { port: 8000 });

console.log("Server running at http://localhost:8000");
