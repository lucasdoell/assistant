const server = Bun.serve({
  port: process.env.PORT ?? 8080,
  fetch(req) {
    return new Response("Hello World!");
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
