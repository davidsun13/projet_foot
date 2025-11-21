import Fastify from "fastify";

function start_web_server() {
  let web_server = Fastify({ logger: true });

  web_server.get("/", async () => {
    return { message: "hello world" };
  });

  web_server.listen({ port: 1234, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`listening on ${address}`);
    }
  });
}

start_web_server();
