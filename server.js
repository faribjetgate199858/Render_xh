import http from "http";
import httpProxy from "http-proxy";

const TARGET_DOMAIN =
  process.env.TARGET_DOMAIN ||
  "https://example.com:443";

const proxy = httpProxy.createProxyServer({
  target: TARGET_DOMAIN,
  changeOrigin: true,
  ws: true,
  secure: false
});

proxy.on("error", (err, req, res) => {
  console.error("Proxy Error:", err);

  if (res && !res.headersSent) {
    res.writeHead(502, {
      "Content-Type": "text/plain"
    });
  }

  if (res) {
    res.end("Proxy Error");
  }
});

const server = http.createServer((req, res) => {
  proxy.web(req, res);
});

server.on("upgrade", (req, socket, head) => {
  proxy.ws(req, socket, head);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Proxy running on ${PORT}`);
});
