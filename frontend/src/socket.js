// socket.js
// A single shared Socket.io connection for the whole app.
// Importing this file anywhere gives you the same connected socket -
// we don't want multiple sockets accidentally opening per component.

import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
});
