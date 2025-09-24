import express from "express";
import multer from "multer";
import { reviewResume } from "../controllers/chatgptController.js";
import { downloadGuides } from "../controllers/fileController.js";
import { sendMail } from "../controllers/contactController.js";

const reviewRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

reviewRouter.post("/review-resume", upload.single("resume"), reviewResume);
reviewRouter.post("/contact", upload.single("file"), sendMail);
reviewRouter.get("/download-guides", downloadGuides);

export default reviewRouter;
