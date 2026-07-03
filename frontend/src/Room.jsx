// Room.jsx
// Once you're inside a room: show the room code (to share), the
// swipe deck, who else is in the room and their progress, and a
// celebratory popup the moment a match happens.

import { useEffect, useState } from "react";
import SwipeDeck from "./SwipeDeck.jsx";
import { socket } from "./socket.js";

export default function Room({ initialRoomData }) {
  const [movies, setMovies] = useState(initialRoomData.movies);
  const [participants, setParticipants] = useState(initialRoomData.participants);
  const [match, setMatch] = useState(null);

  const code = initialRoomData.code;

  useEffect(() => {
    function handleParticipantJoined({ participants }) {
      setParticipants(participants);
    }

    function handleParticipantProgress({ participants }) {
      setParticipants(participants);
    }

    function handleParticipantLeft({ participants }) {
      setParticipants(participants);
    }

    function handleMatchFound({ movie }) {
      setMatch(movie);
    }

    socket.on("participant-joined", handleParticipantJoined);
    socket.on("participant-progress", handleParticipantProgress);
    socket.on("participant-left", handleParticipantLeft);
    socket.on("match-found", handleMatchFound);

    return () => {
      socket.off("participant-joined", handleParticipantJoined);
      socket.off("participant-progress", handleParticipantProgress);
      socket.off("participant-left", handleParticipantLeft);
      socket.off("match-found", handleMatchFound);
    };
  }, []);

  function handleDecision(decision, movie) {
    socket.emit("swipe", { code, movieId: movie.id, decision });
    setMovies((prev) => prev.filter((m) => m.id !== movie.id));
  }

  function copyCode() {
    navigator.clipboard.writeText(code);
  }

  return (
    <div className="room">
      <div className="room-header">
        <div className="room-code" onClick={copyCode} title="Click to copy">
          Room code: <strong>{code}</strong> 📋
        </div>
        <ul className="participant-list">
          {participants.map((p) => (
            <li key={p.socketId}>
              {p.nickname} — {p.likedCount} liked
            </li>
          ))}
        </ul>
      </div>

      <SwipeDeck movies={movies} onDecision={handleDecision} />

      {match && (
        <div className="match-overlay" onClick={() => setMatch(null)}>
          <div className="match-card">
            <h2>🎉 It's a Match!</h2>
            {match.posterUrl && <img src={match.posterUrl} alt={match.title} />}
            <p>{match.title}</p>
            <button onClick={() => setMatch(null)}>Keep swiping</button>
          </div>
        </div>
      )}
    </div>
  );
}
