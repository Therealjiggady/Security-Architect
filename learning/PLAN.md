learning/PLAN.md
This is my one-page learning plan for the month. I will complete and commit this file during the 15-minute selection clinic. It records the technology I chose to learn, why I chose it for my capstone, the three focused tasks I will complete, and the proof I will capture to show I did the work.
Student commitment
Name: James
Date created: 2025-10-27
I commit to treat this plan as my personal roadmap: I will keep dates realistic, finish each small task, capture evidence of success, and update this file if anything changes.
Chosen technology
Technology name: Real-time Chat Board (FastAPI WebSockets + React WebSocket client)
Technology version (if applicable): FastAPI ≥0.110, Python 3.11, SQLAlchemy 2.x
Why I chose this technology
I’m adding a real-time chat board to my e-commerce site so customers can ask questions, get sizing help, and build community. This technology lets my backend push live messages to the browser (no refresh), stores conversations, and respects my existing JWT auth/roles.
First-day actions (complete in the 15-minute selection clinic)
Finalize the Chosen technology and Why (done above).
Draft three small integration tasks (below) with dates.
Commit this file to the repo at learning/PLAN.md.
Start Task 1 on branch: feature/chat-ws-backend in backend/.
If scope is too large, I’ll split tasks and update dates here.
My three integration tasks (small, testable, dated)
Task 1 — WebSocket server + message model
Description: Add ChatMessage table (id, user_id, room, body, created_at), and ws://.../chat/{room} WebSocket endpoint in FastAPI that authenticates via JWT and broadcasts to all clients in the room.
Start date: 2025-10-27
Target completion date: 2025-10-31
Success criterion (explicit): Two browser tabs connected to the same room see new messages appear live within 200ms when either tab sends a message.
Proof method:
Screenshot/GIF of two tabs exchanging messages in real time.
DB screenshot of chat_messages rows after sending.
Short snippet of server logs showing user join/leave + message broadcast.
Where I will start Task 1: backend/ on branch feature/chat-ws-backend.
Task 2 — React chat UI + typing indicator
Description: Build ChatBoard React component: message list, input box, “Send” button, and a basic typing indicator using a lightweight “typing” event over the WebSocket.
Start date: 2025-11-01
Target completion date: 2025-11-05
Success criterion (explicit): Sending a message updates the DOM instantly, persists to DB via backend, and appears to all connected clients; typing indicator shows “User is typing…” to others.
Proof method:
Screen recording of sending/receiving messages + typing indicator.
Screenshot of Redux/Context state showing latest messages.
Console log snippet confirming socket open/close and event flow.
Task 3 — Auth + moderation (roles) + docs
Description: Require JWT for chat; allow ADMIN_ROLE = "superuser" users to delete messages; enforce MAX_MESSAGE_LENGTH = 500; add README section with setup, curl/wscat test, and screenshots.
Start date: 2025-11-06
Target completion date: 2025-11-10
Success criterion (explicit):
Non-admin cannot delete; admin can delete and the removal broadcasts to all clients.
Over-length messages are rejected with a visible error.
README shows exact steps to run and test.
Proof method:
Before/after screenshots of a deleted message disappearing from all clients.
Screenshot of rejection toast/error for a >500-char message.
Committed learning/README.md with commands + images.
Risks, assumptions, and blockers (one-line each)
Needs valid JWT from existing auth to join a chat room.
WebSocket testing may require local HTTPS (cert) for some browsers.
Optional Redis pub/sub if I scale to multiple backend processes.
Timeboxing UI polish so I don’t overbuild styling.
My weekly timeline (one-line plan)
Week 1 (Oct 27–Nov 2): Implement WS endpoint + DB model; verify two-tab broadcast.
Week 2 (Nov 3–9): Build React UI + typing indicator; integrate with auth token.
Week 3 (Nov 10–16): Add admin delete, limits, logging; finalize README with proofs.
Week 4 (Nov 17–23): Buffer for bug fixes, screenshots, and rubric alignment.
Constants I will use (for clarity in code)
ADMIN_ROLE = "superuser"
MAX_MESSAGE_LENGTH = 500
ALLOWED_ROOMS = {"general", "support"} (can expand later)
Minimal route/socket sketch (reference)
GET /chat/history?room=general&limit=50 → recent messages (JWT required)
WS /chat/{room} → join room, send/receive {type:"message"|"typing"|"delete", ...} payloads
Admin-only REST: DELETE /chat/messages/{id} → broadcast deletion
