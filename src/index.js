import http from "node:http";

import {
  findAllPosts,
  findPostById,
  insertPost,
} from "./repositories/post-repository.js";
import { createPostDraft } from "./services/create-post-draft.js";

const { API_HOST, API_PORT, API_PROTOCOL } = process.env;

const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  const paths = url.split("?").filter(Boolean);
  const path = paths.at(0) ?? "/";

  if (path === "/posts" && method === "GET") {
    const posts = await findAllPosts();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ data: posts }));

    return;
  }

  const postByMatch = path.match(/^\/posts\/([a-zA-Z0-9-]+)$/);
  if (postByMatch && method === "GET") {
    const postId = postByMatch[1];
    const post = await findPostById(postId);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ data: post }));

    return;
  }

  if (path === "/posts/draft" && method === "POST") {
    const bodyBuffer = [];
    let body = null;

    req.on("data", (chunk) => bodyBuffer.push(chunk));
    req.on("end", async () => {
      try {
        const bodyString = Buffer.concat(bodyBuffer).toString();
        body = JSON.parse(bodyString);

        const draft = await createPostDraft(body.idea);
        const post = await insertPost(draft);

        res.writeHead(201, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ data: post }));
      } catch (error) {
        console.error("❌ Error creating post draft:");
        console.error(error);

        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({
            title: "Error creating post draft",
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          }),
        );
      }
    });

    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  return res.end(JSON.stringify({ message: "Not found" }));
});

server.listen(API_PORT, API_HOST, () => {
  console.log(
    `🎲 Server running at ${API_PROTOCOL}://${API_HOST}:${API_PORT}/`,
  );
  console.log("💡 Press CTRL+C to stop the server");
});
