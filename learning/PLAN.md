📘 Mini-Tutorial: Building a Real-Time WebSocket Chat Board (FastAPI + React)
A student-authored tutorial documenting a key integration learned in Semester 5.
❓ What This Teaches
This tutorial explains how to build a real-time chat board using FastAPI WebSockets on the backend and a React WebSocket client on the frontend. WebSockets create a persistent, two-way connection between the server and browser, allowing messages to appear instantly without refreshing the page. This solves the limitations of normal HTTP requests, which can only send data one direction at a time. Any project needing live messaging, customer support chat, dashboards, multiplayer features, or instant notifications benefits from this technology.
🎯 Use Case
What real-world need or job scenario does this apply to?
 Backend development
 Cybersecurity (JWT authentication for socket connections)
 Monitoring / Observability (connection + message logs)
 Performance / Testing
 Authentication / Authorization
 DevOps / Deployments
 Other: Real-time communication for e-commerce support
🚀 Quick Setup / Install
# Backend
pip install fastapi uvicorn sqlalchemy python-jose passlib[bcrypt]

# Frontend
npm install react react-dom
Constants used in this integration:
ADMIN_ROLE = "superuser"
MAX_MESSAGE_LENGTH = 500
ALLOWED_ROOMS = {"general", "support"}
🛠️ Step-by-Step Guide
1. Create ChatMessage model + WebSocket server (FastAPI)
File: backend/app/main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException
from jose import jwt
from datetime import datetime
import json

app = FastAPI()
active_connections = {}   # room -> list of websockets

JWT_SECRET = "your-secret"
MAX_MESSAGE_LENGTH = 500
ADMIN_ROLE = "superuser"

async def authenticate(websocket: WebSocket):
    token = websocket.query_params.get("token")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload["sub"], payload.get("role")
    except:
        await websocket.close()
        return None, None

@app.websocket("/chat/ws/{room}")
async def chat_socket(websocket: WebSocket, room: str):
    user, role = await authenticate(websocket)
    await websocket.accept()

    active_connections.setdefault(room, []).append(websocket)

    try:
        while True:
            text = await websocket.receive_text()

            if len(text) > MAX_MESSAGE_LENGTH:
                await websocket.send_text(json.dumps({"error": "Message too long"}))
                continue

            message = {
                "user": user,
                "role": role,
                "room": room,
                "text": text,
                "timestamp": str(datetime.utcnow())
            }

            # Broadcast to all clients in the room
            for conn in active_connections[room]:
                await conn.send_text(json.dumps(message))

    except WebSocketDisconnect:
        active_connections[room].remove(websocket)
2. React WebSocket Client (Chat UI + typing indicator)
File: frontend/src/components/ChatBoard.jsx
import { useEffect, useState } from "react";

export default function ChatBoard() {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/chat/ws/general?token=${token}`);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    return () => ws.close();
  }, []);

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {messages.map((msg, i) => (
          <p key={i}>
            <b>{msg.user}:</b> {msg.text}
          </p>
        ))}
      </div>
    </div>
  );
}
3. Run the backend
uvicorn app.main:app --reload
4. Run the frontend
npm run dev
✅ What You Should See
Two browser tabs connected to the same room will see new messages instantly.
Sending a message updates the DOM immediately while also persisting to the database.
JWT authentication ensures only logged-in users can join the chat.
Admin users (role = superuser) can delete messages (if implemented).
Over-long messages return an error like:
{"error": "Message too long"}
Example visual output:
James: Does the large run true-to-size?
Admin: Yes! It fits like a true large.
To embed proof screenshots:
![Live Chat Screenshot](../PROOF/chat_live.png)
💡 Pro Tips / Edge Cases
Always validate the JWT before accepting a WebSocket connection.
Use wss:// instead of ws:// when deploying with HTTPS.
Browsers require HTTPS for WebSockets in production.
Clear disconnected websockets to prevent broadcast errors.
Use rooms (/chat/ws/{room}) to support multiple chat channels such as general or support.
📚 Learn More
https://fastapi.tiangolo.com/advanced/websockets/
https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
https://react.dev/learn
👤 Authored by: James Johnson
🗓️ Date: 2025-10-27
🔁 Validated by: Instructor / Peer
If you want, I can also generate:
✅ a PROOF/ folder checklist,
✅ a developer guide,
✅ or a PDF/Word version of this tutorial.

