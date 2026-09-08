import http from "node:http";

const server = http.createServer((req, res) => {
  const { url, method } = req;

  const path = url.split("?")[0];

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

server.listen(8080, () => {
  console.log("🎲 Server running at http://localhost:8080/");
});
