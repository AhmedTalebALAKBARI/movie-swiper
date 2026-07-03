// rooms.js
// In-memory storage for active rooms. No database needed - rooms are
// short-lived (a group decides on a movie in one sitting, then the
// room is pointless), so keeping this in memory is a deliberate
// simplicity choice, not a shortcut.
//
// Shape of a room:
// {
//   code: "7F3K",
//   movies: [...],                 // the shared deck everyone swipes through
//   participants: {
//     [socketId]: { nickname, likedMovieIds: Set<number> }
//   }
// }

const rooms = new Map();

function generateRoomCode() {
  // 4 uppercase letters/numbers, easy to read aloud and type on a phone
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1 - avoids confusion
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function createRoom(movies) {
  let code = generateRoomCode();
  // Extremely unlikely to collide, but guard anyway
  while (rooms.has(code)) {
    code = generateRoomCode();
  }

  rooms.set(code, {
    code,
    movies,
    participants: {},
  });

  return code;
}

export function getRoom(code) {
  return rooms.get(code);
}

export function addParticipant(code, socketId, nickname) {
  const room = rooms.get(code);
  if (!room) return null;

  room.participants[socketId] = {
    nickname,
    likedMovieIds: new Set(),
  };

  return room;
}

export function removeParticipant(code, socketId) {
  const room = rooms.get(code);
  if (!room) return;

  delete room.participants[socketId];

  // Clean up empty rooms so memory doesn't grow forever
  if (Object.keys(room.participants).length === 0) {
    rooms.delete(code);
  }
}

export function recordLike(code, socketId, movieId) {
  const room = rooms.get(code);
  if (!room || !room.participants[socketId]) return null;

  room.participants[socketId].likedMovieIds.add(movieId);

  return room;
}

export function getParticipantList(room) {
  return Object.entries(room.participants).map(([socketId, data]) => ({
    socketId,
    nickname: data.nickname,
    likedCount: data.likedMovieIds.size,
  }));
}

// A movie is a "match" once every current participant has liked it.
// This will be used in Step 4, but lives here since it's room logic.
export function checkForMatch(room, movieId) {
  const participantIds = Object.keys(room.participants);
  if (participantIds.length === 0) return false;

  return participantIds.every((id) =>
    room.participants[id].likedMovieIds.has(movieId)
  );
}
