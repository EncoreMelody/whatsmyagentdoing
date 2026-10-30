#!/usr/bin/env node
// Read-only LAN access to a running dashboard, for viewing it from a phone.
// The dashboard itself stays on 127.0.0.1; this forwards GET requests to it
// and requires a random token, set as a cookie after the first visit.
//
//   node scripts/lan.js [--port 4546] [--target 4545] [--host <LAN IP>]
//
// Set WMAD_LAN_TOKEN to keep the same link across restarts.
const http = require('http');
const os = require('os');
const crypto = require('crypto');

const arg = (name, def) => {
  const i = process.argv.indexOf(name);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
};
const PORT = Number(arg('--port', 4546));
const TARGET = Number(arg('--target', 4545));
const TOKEN = process.env.WMAD_LAN_TOKEN || crypto.randomBytes(18).toString('base64url');
const COOKIE = 'wmad_lan';

// The Wi-Fi / Ethernet address, skipping virtual adapters and link-local ones.
function lanAddress() {
  for (const [name, addrs] of Object.entries(os.networkInterfaces())) {
    if (/vmware|virtualbox|vethernet|docker|wsl/i.test(name)) continue;
    for (const a of addrs) {
      if (a.family === 'IPv4' && !a.internal && !a.address.startsWith('169.254.')) return a.address;
    }
  }
  return null;
}
const HOST = arg('--host', lanAddress());
if (!HOST) { console.error('No LAN address found; pass --host <ip>.'); process.exit(1); }

const same = (a) => {
  const x = Buffer.from(String(a || '')), y = Buffer.from(TOKEN);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};
const cookieToken = (req) => {
  const m = String(req.headers.cookie || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  return m && m[1];
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://lan');
  if (same(url.searchParams.get('t'))) {
    url.searchParams.delete('t');
    res.writeHead(302, {
      'set-cookie': `${COOKIE}=${TOKEN}; HttpOnly; SameSite=Strict; Path=/; Max-Age=2592000`,
      location: url.pathname + url.search,
    });
    res.end();
    return;
  }
  if (!same(cookieToken(req))) { res.writeHead(401, { 'content-type': 'text/plain' }).end('Open the link with its token.'); return; }
  // Read-only: stop, update and scene installs stay on the computer.
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(403).end(); return; }

  const headers = { ...req.headers, host: `localhost:${TARGET}` };
  delete headers.cookie;
  const up = http.request({ host: '127.0.0.1', port: TARGET, path: req.url, method: req.method, headers }, (r) => {
    res.writeHead(r.statusCode, r.headers);
    r.pipe(res);
  });
  up.on('error', () => { if (!res.headersSent) res.writeHead(502, { 'content-type': 'text/plain' }); res.end('Dashboard is not running.'); });
  req.on('close', () => up.destroy());
  up.end();
});
// Server-Sent Events stay open indefinitely.
server.requestTimeout = 0;
server.headersTimeout = 60000;

server.listen(PORT, HOST, () => {
  console.log(`LAN view → http://${HOST}:${PORT}/?t=${TOKEN}`);
  console.log(`(forwarding read-only to http://localhost:${TARGET}; Ctrl+C to stop)`);
});
