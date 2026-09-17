import { createApp } from "./app.js";

const { API_HOST, API_PORT, API_PROTOCOL } = process.env;

const server = createApp();

server.listen(API_PORT, API_HOST, () => {
  console.log(
    `🎲 Server running at ${API_PROTOCOL}://${API_HOST}:${API_PORT}/`,
  );
  console.log("💡 Press CTRL+C to stop the server");
});
