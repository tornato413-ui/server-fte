// For the Empire — co-op relay server
// Hands out room codes and relays game messages between the host and up to 3 friends.
// Run:  npm install  then  npm start      (listens on $PORT, default 8080)
const http = require('http');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8080;
const MAX_GUESTS = 3;
const rooms = new Map(); // code -> { host: ws, guests: Map<pid, ws>, next: 1 }

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
  res.end(`For the Empire relay server is running. Rooms open: ${rooms.size}\n`);
});
const wss = new WebSocketServer({ server, maxPayload: 2 * 1024 * 1024 });

function send(ws, obj) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(obj)); }
function newCode() {
  for (let i = 0; i < 1000; i++) {
    const code = 'MINE-' + String(Math.floor(1000 + Math.random() * 9000));
    if (!rooms.has(code)) return code;
  }
  return 'MINE-' + Date.now().toString(36).toUpperCase();
}

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
  ws.role = null; ws.room = null; ws.pid = null;

  ws.on('message', (raw) => {
    let m; try { m = JSON.parse(raw); } catch { return; }
    if (m.t === 'host' && !ws.role) {
      const code = newCode();
      rooms.set(code, { host: ws, guests: new Map(), next: 1 });
      ws.role = 'host'; ws.room = code;
      send(ws, { t: 'room', code });
    } else if (m.t === 'join' && !ws.role) {
      const code = String(m.code || '').trim().toUpperCase();
      const room = rooms.get(code);
      if (!room) return send(ws, { t: 'err', m: 'No shift found with that code' });
      if (room.guests.size >= MAX_GUESTS) return send(ws, { t: 'err', m: 'That shift is full (4 convicts)' });
      const pid = room.next++;
      room.guests.set(pid, ws);
      ws.role = 'guest'; ws.room = code; ws.pid = pid;
      send(ws, { t: 'joined', pid });
      send(room.host, { t: 'peer', pid });
    } else if (m.t === 'to' && ws.room) {
      const room = rooms.get(ws.room); if (!room) return;
      if (ws.role === 'host') send(room.guests.get(m.to), { t: 'msg', from: 'host', d: m.d });
      else send(room.host, { t: 'msg', from: ws.pid, d: m.d });
    }
  });

  ws.on('close', () => {
    const room = rooms.get(ws.room); if (!room) return;
    if (ws.role === 'host') {
      for (const g of room.guests.values()) send(g, { t: 'closed' });
      rooms.delete(ws.room);
    } else if (ws.role === 'guest') {
      room.guests.delete(ws.pid);
      send(room.host, { t: 'left', pid: ws.pid });
    }
  });
});

// keep connections alive and drop dead ones
setInterval(() => {
  for (const ws of wss.clients) {
    if (!ws.isAlive) { ws.terminate(); continue; }
    ws.isAlive = false; try { ws.ping(); } catch {}
  }
}, 25000);

server.listen(PORT, () => console.log(`For the Empire relay listening on port ${PORT}`));
