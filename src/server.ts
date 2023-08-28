import bodyParser from "body-parser";
import express from "express";

import connectDB from "../config/database";
import project from "./routes/api/projects";
import contribution from "./routes/api/contributions";

const app = express();

// Connect to MongoDB
connectDB();

// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// @route   GET /
// @desc    Test Base API
// @access  Public

app.get("/", (_req: express.Request, res: express.Response) => {
  res.send("API Running");
});

app.use("/api/projects", project);
app.use("/api/contributions", contribution);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;
