import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "./middleware/error.js";
import reviewRouter from "./routers/route.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://cooked-resume.vercel.app"]
      : ["http://localhost:8080", "http://localhost:5000"],
  credentials: true,
  methods: ["POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};
const port = process.env.PORT || 5000;
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", reviewRouter);

app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
