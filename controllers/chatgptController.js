import OpenAI from "openai";
import pdf from "pdf-parse/lib/pdf-parse.js";

const chatgpt = new OpenAI({ apiKey: process.env.API_KEY });
const vectorFile = `${process.env.FILE_ID_1}`;
const vectorFile2 = `${process.env.FILE_ID_2}`;

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

    const response = await chatgpt.responses.create({
      model: "gpt-4.1",
      tools: [
        {
          type: "file_search",
          vector_store_ids: [vectorFile, vectorFile2],
        },
      ],
      input: `You are a career advisor for students applying to their first internships. Review resumes using the attached guides and give clear, structured feedback. Do not use any subjective words. Remain professional. It is imperative and important that you be as strict as possible when following these guidelines. The feedback returned should start with something along these lines. After reviewing your resume following these resume guides: (list the names of the resume guides), here is your feedback. Do not offer to review again, this interaction with the user will be one-way. Do not use any bolded text. Do not use a point system. Be sure to include a summary of feedback and some actionable steps at the end. Do not include a closing statement. Remember to be less strict on the formatting and hyperlinks since it could be a matter of conversion between pdf and raw text.Here is the resume: ${resumeText}`,
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};
