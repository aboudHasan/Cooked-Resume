import express from "express";
import multer from "multer";
import { reviewResume } from "../controllers/chatgptController.js";

const reviewRouter = express.Router();

const upload = multer({ dest: "uploads/" });

reviewRouter.post("/review-resume", upload.single("resume"), reviewResume);

export default reviewRouter;
