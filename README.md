# For the Empire: co-op server

This small server lets you and your friends play together from **any network** using a short room code (like `MINE-4471`).
All game messages go through it, so strict school/work/phone networks are fine.

There are two ways to run it. **Option A (free, always online)** is the easiest for friends.

---

## Option A: put it online for free with Render

You only do this once.

1. **Make a GitHub account** at https://github.com (free) if you don't have one.
2. **Create a new repository**: click **+** (top right), then **New repository**. Name it `fte-server`, choose **Public**, and click **Create repository**.
3. On the new repository page, click **uploading an existing file**. Drag in the three files from this folder: `server.js`, `package.json` and `README.md`. Click **Commit changes**.
4. **Make a Render account** at https://render.com and sign in with GitHub.
5. In Render, click **New +**, then **Web Service**, then pick your `fte-server` repository.
6. Fill in:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
7. Click **Create Web Service** and wait until it says **Live** (a minute or two).
8. Copy the address at the top. It looks like `https://fte-server-abcd.onrender.com`.

> On the free plan, the server goes to sleep after about 15 minutes with nobody connected. The first connection after that can take up to a minute while it wakes up. If HOST ONLINE says the server didn't answer, wait a moment and press it again.

---

## Option B: run it on your own PC

1. Install **Node.js** (LTS) from https://nodejs.org.
2. Open a terminal in this folder and run:
   ```
   npm install
   npm start
   ```
   It says `listening on port 8080`.
3. Friends outside your house can't reach your PC directly, so use a free tunnel:
   - Install **cloudflared** (https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) and run
     `cloudflared tunnel --url http://localhost:8080`
     It prints an address like `https://something.trycloudflare.com`. That's your server address.
   - (Or open port 8080 on your router and use `your-public-ip:8080`.)

Keep the terminal windows open while you play.

---

## Playing

1. Everyone uses the **same version** of `For the Empire.html`. Open the downloaded file; online play may be blocked inside the claude.ai viewer.
2. Open **CO-OP & TRANSFER** from the main menu or the pause menu (Esc/Tab).
3. Paste your server address into the **Online server** box (for example `fte-server-abcd.onrender.com`). Everyone pastes the same address. It's remembered after that.
4. **Host:** press **HOST ONLINE** and read out the room code.
5. **Friends:** press **JOIN ONLINE**, type the code (just the 4 digits is fine) and press **JOIN**.

Up to 4 players per shift.
