import http from "node:http";

const server = http.createServer((_, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Hello World!!" }));
});

server.listen(8080, () => {
  console.log("🎲 Server running at http://localhost:8080/");
});
