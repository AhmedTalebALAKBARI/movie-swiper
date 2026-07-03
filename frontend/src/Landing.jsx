// Landing.jsx
// The very first screen: pick a nickname, then either create a new
// room or join an existing one via its 4-character code.

import { useState } from "react";
import { socket } from "./socket.js";

export default function Landing({ onRoomJoined }) {
  const [nickname, setNickname] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [mode, setMode] = useState(null); // "creating" | "joining" | null
  const [error, setError] = useState(null);

  function handleCreateRoom() {
    if (!nickname.trim()) {
      setError("Enter a nickname first");
      return;
    }
    setError(null);
    setMode("creating");

    socket.emit("create-room", { nickname: nickname.trim() }, (response) => {
      setMode(null);
      if (!response.ok) {
        setError(response.error);
        return;
      }
      onRoomJoined(response);
    });
  }

  function handleJoinRoom() {
    if (!nickname.trim()) {
      setError("Enter a nickname first");
      return;
    }
    if (!joinCode.trim()) {
      setError("Enter a room code");
      return;
    }
    setError(null);
    setMode("joining");

    socket.emit(
      "join-room",
      { code: joinCode.trim().toUpperCase(), nickname: nickname.trim() },
      (response) => {
        setMode(null);
        if (!response.ok) {
          setError(response.error);
          return;
        }
        onRoomJoined(response);
      }
    );
  }

  return (
    <div className="landing">
      <h1>🎬 Movie Swiper</h1>
      <p className="subtitle">Swipe with friends. Match on what to watch.</p>

      <div className="landing-form">
        <input
          type="text"
          placeholder="Your nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
        />

        <div className="landing-actions">
          <button onClick={handleCreateRoom} disabled={mode !== null}>
            {mode === "creating" ? "Creating…" : "Create a room"}
          </button>

          <div className="landing-divider">or</div>

          <div className="landing-join-row">
            <input
              type="text"
              placeholder="Room code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={4}
            />
            <button onClick={handleJoinRoom} disabled={mode !== null}>
              {mode === "joining" ? "Joining…" : "Join"}
            </button>
          </div>
        </div>

        {error && <p className="landing-error">{error}</p>}
      </div>
    </div>
  );
}
