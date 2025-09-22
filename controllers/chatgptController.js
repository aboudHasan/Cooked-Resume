import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";
import pdf from "pdf-parse/lib/pdf-parse.js";

const client = new OpenAI({ apiKey: process.env.API_KEY });
const assistantID = process.env.ASSISTANT_ID;
const guide1 = process.env.FILE_ID_1;
const guide2 = process.env.FILE_ID_2;

export const reviewResume = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      const error = new Error("Problem with resume");
      error.status = 400;
      next(error);
    }

    const pdfBuffer = file.buffer;
    const pdfData = await pdf(pdfBuffer);
    const resumeText = pdfData.text;

    const thread = await client.beta.threads.create();

    await client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: resumeText,
    });

    let run = await client.beta.threads.runs.create(thread.id, {
      assistant_id: assistantID,
    });

    while (run.status === "queued" || run.status === "in_progress") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      run = await client.beta.threads.runs.retrieve(run.id, {
        thread_id: thread.id,
      });
    }

    if (run.status !== "completed") {
      throw new Error("Run failed with status: " + run.status);
    }

    const messages = await client.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data.find(
      (msg) => msg.role === "assistant"
    );

    const feedback =
      assistantMessage?.content[0]?.text?.value || "No feedback was generated.";

    res.json({ feedback });
  } catch (error) {
    next(error);
  }
};
