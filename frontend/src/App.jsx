// App.jsx
// Step 3: this now switches between two screens:
// - Landing: enter nickname, create or join a room
// - Room: the actual swiping experience, now shared with others in real time

import { useState } from "react";
import Landing from "./Landing.jsx";
import Room from "./Room.jsx";
import "./App.css";

function App() {
  const [roomData, setRoomData] = useState(null);

  if (!roomData) {
    return <Landing onRoomJoined={setRoomData} />;
  }

  return <Room initialRoomData={roomData} />;
}

export default App;
