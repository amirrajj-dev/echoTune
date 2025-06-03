import express, { Request, Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";
//routes
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import songRoutes from "./routes/song.route";
import albumRoutes from "./routes/album.route";
import statRoutes from "./routes/stat.route";
import adminRoutes from "./routes/admin.route";
import playListRoutes from "./routes/playlist.route";
//db
import { connectToDb } from "./db/connectToDb";
//middlewares
import errorMiddleware from "./middlewares/error.middleware";
import { clerkMiddleware } from "@clerk/express";
import path from "path";
import fs from "fs";
//cron
import cron from "node-cron";
import { createServer } from "http";
import { initializeSocket } from "./socket/socket";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const httpServer = createServer(app);

initializeSocket(httpServer);

app.use(express.json());
// add auth to request so that we can get this possible => req.auth.userId
app.use(
  clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  })
);
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "temp"),
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for simplicity
  })
);
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const tmpDir = path.join(__dirname, "temp");
// Delete files in tmpDir every day
cron.schedule("0 * * * *", () => {
  fs.readdir(tmpDir, (err, files) => {
    if (err) {
      throw err;
    }
    files.forEach((file) => {
      fs.unlink(path.join(tmpDir, file), (err) => {
        if (err) {
          throw err;
        }
      });
    });
  });
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);
app.use('/api/playlists' , playListRoutes)

app.use(errorMiddleware);

httpServer.listen(port, async () => {
  await connectToDb();
  console.log(`Server running on http://localhost:${port}`);
});
