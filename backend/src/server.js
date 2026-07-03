// server.js
// Step 3 adds Socket.io on top of the existing Express app.
// Express still handles the plain /api/movies route from Step 1;
// Socket.io handles everything room/real-time related.

import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { getTrendingMovies } from "./tmdb.js";
import {
  createRoom,
  getRoom,
  addParticipant,
  removeParticipant,
  recordLike,
  getParticipantList,
  checkForMatch,
} from "./rooms.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Kept from Step 1 - still useful for quick manual testing via browser/Postman
app.get("/api/movies", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const movies = await getTrendingMovies(page);
    res.json({ movies });
  } catch (error) {
    console.error("Failed to fetch movies:", error.message);
    res.status(500).json({ error: "Could not fetch movies from TMDB" });
  }
});

// --- Socket.io setup ---
// We wrap the Express app in a plain HTTP server, then attach Socket.io
// to that same server. This lets REST routes and WebSocket connections
// share one port.
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }, // fine for a portfolio project; would lock this down for production
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // A host creates a room. We fetch a shared movie deck once here,
  // so every participant swipes through the exact same list in the
  // exact same order - required for "everyone liked the same movie" to work.
  socket.on("create-room", async ({ nickname }, callback) => {
    try {
      const movies = await getTrendingMovies(1);
      const code = createRoom(movies);
      addParticipant(code, socket.id, nickname);
      socket.join(code);

      callback({
        ok: true,
        code,
        movies,
        participants: getParticipantList(getRoom(code)),
      });
    } catch (error) {
      console.error("create-room failed:", error.message);
      callback({ ok: false, error: "Could not create room" });
    }
  });

  socket.on("join-room", ({ code, nickname }, callback) => {
    const room = getRoom(code);

    if (!room) {
      callback({ ok: false, error: "Room not found. Check the code and try again." });
      return;
    }

    addParticipant(code, socket.id, nickname);
    socket.join(code);

    // Tell everyone else in the room a new person joined
    socket.to(code).emit("participant-joined", {
      participants: getParticipantList(room),
    });

    // Tell the joiner what the room looks like
    callback({
      ok: true,
      code,
      movies: room.movies,
      participants: getParticipantList(room),
    });
  });

  socket.on("swipe", ({ code, movieId, decision }) => {
    const room = getRoom(code);
    if (!room) return;

    if (decision === "liked") {
      recordLike(code, socket.id, movieId);

      const isMatch = checkForMatch(room, movieId);
      if (isMatch) {
        const movie = room.movies.find((m) => m.id === movieId);
        io.to(code).emit("match-found", { movie });
      }
    }

    // Let everyone see live progress (e.g. "Sarah: 6 liked")
    io.to(code).emit("participant-progress", {
      participants: getParticipantList(room),
    });
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);

    // Find which room this socket was in and clean up
    for (const room of io.sockets.adapter.rooms.keys()) {
      const existingRoom = getRoom(room);
      if (existingRoom && existingRoom.participants[socket.id]) {
        removeParticipant(room, socket.id);
        socket.to(room).emit("participant-left", {
          participants: getParticipantList(existingRoom),
        });
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Movie Swiper backend running on http://localhost:${PORT}`);
});
