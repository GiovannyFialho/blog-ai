import http from "node:http";

const { API_HOST, API_PORT, API_PROTOCOL } = process.env;

const posts = [];

const server = http.createServer((req, res) => {
  const { url, method } = req;

  const paths = url.split("?").filter(Boolean);
  const path = paths.at(0) ?? "/";

  if (path === "/posts" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ data: posts }));
  }

  if (path === "/sign-in" && method === "POST") {
    let bodyBuffer = [];
    let body = null;

    req.on("data", (chunk) => bodyBuffer.push(chunk));
    req.on("end", () => {
      body = Buffer.concat(bodyBuffer).toString();
      body = JSON.parse(body);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Sign-in successful", data: body }),
      );
    });

    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  return res.end(JSON.stringify({ message: "Hello World!!" }));
});

server.listen(API_PORT, API_HOST, () => {
  console.log(
    `🎲 Server running at ${API_PROTOCOL}://${API_HOST}:${API_PORT}/`,
  );
  console.log("💡 Press CTRL+C to stop the server");
});
