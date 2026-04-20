import express from "express";
import cors from "cors";
import path from "path";
import { AppDataSource } from "./config/database";
import statisticsRoutes from "./routes/statistics";
import searchRoutes from "./routes/search";

const app = express();
const PORT = process.env.PORT || 5000;

// Get frontend path
const frontendPath = path.resolve(__dirname, "../../frontend");

// Middleware
app.use(cors());
app.use(express.json());

// Log for debugging
console.log("Serving static files from:", frontendPath);

// Serve static files from frontend folder
app.use(express.static(frontendPath));

// Routes
app.use("/api/statistics", statisticsRoutes);
app.use("/api/search", searchRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API is running" });
});

// Serve index.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/index.html"));
});

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
  });

export default app;
