import { io, Socket } from "socket.io-client";

// Connect to the Node.js Socket Service
export const socket: Socket = io("http://localhost:5002", {
  withCredentials: true, // Required to send the JWT cookie to Port 5002
  autoConnect: false
});

export const connectToProject = (projectId: string) => {
  if (!socket.connected) socket.connect();
  socket.emit("join-project", projectId);
};