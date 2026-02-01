import "tsconfig-paths/register";
import { Server, Socket } from "socket.io";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import * as path from "path";
import { folderStructureData } from "@shared/types"; 

// Point to the server/.env folder (Flask backend)
dotenv.config({ path: path.resolve(__dirname, "../server/.env") });

const io = new Server(5002, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
  }
});

// Middleware to verify Flask-issued JWT cookies
io.use((socket: Socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;
  
    const token = cookieHeader
      ?.split('; ')
      .find(row => row.startsWith('access_token_cookie='))
      ?.split('=')[1];
  
    if (!token) {
      return next(new Error("401: Unauthorized"));
    }
  
    try {
      // 2. Ensure your secret is exactly what Flask uses
      const secret = process.env.JWT_SECRET_KEY || "your_flask_secret_key_here"; 
      const decoded = jwt.verify(token, secret) as any;
      (socket as any).userId = decoded.sub; 
      next();
    } catch (err) {
      next(new Error("401: Invalid Token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).userId;
  
    socket.on("join-project", (projectId: string) => {
        socket.join(`project-${projectId}`);
    });

    // Broadcast code changes to all users in the project room
    socket.on("code-change", (data: { projectId: string, fileId: number, content: string }) => {
        // This sends to everyone in the room EXCEPT the sender
        socket.to(`project-${data.projectId}`).emit("code-update", data);
    });

    socket.on("disconnect", () => console.log(`User ${userId} disconnected`));
});

console.log("Socket Server listening on Port 5002");