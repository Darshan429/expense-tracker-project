require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const socketService = require("./services/socket.service");
const { sequelize, User } = require("./models/index");

const app = express();
const server = http.createServer(app); // wrap express in http server

// ── Socket.io setup ─────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Store io globally so services can access it
socketService.init(io);

// JWT auth on socket handshake — runs before connection event
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "name", "role", "is_active"],
    });

    if (!user || !user.is_active) return next(new Error("Unauthorized"));

    socket.user = user; // attach user to socket
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.user.id;

  // Each user joins their own private room — only they receive events
  socket.join(`user_${userId}`);
  console.log(`✓ Socket connected: user_${userId}`);

  // Client can manually mark notification as read via socket
  socket.on("mark_read", async ({ notificationId }) => {
    try {
      const { Notification } = require("./models/index");
      await Notification.update(
        { is_read: true },
        { where: { id: notificationId, user_id: userId } },
      );
    } catch (err) {
      console.error("mark_read error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log(`✗ Socket disconnected: user_${userId}`);
  });
});

// ── Express middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/expenses", require("./routes/expense.route"));
app.use("/api/receipt", require("./routes/receipt.route"));
app.use("/api/notifications", require("./routes/notification.route"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal server error" });
});

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log("✓ DB connected");
    // Use server.listen not app.listen — socket.io needs the http server
    server.listen(PORT, () =>
      console.log(`✓ Server + Socket.io running on port ${PORT}`),
    );
  })
  .catch((err) => {
    console.error("✗ DB failed:", err.message);
    process.exit(1);
  });
