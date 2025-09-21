import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";
import PdfParse from "pdf-parse";

const client = new OpenAI({ apiKey: process.env.API_KEY });

const masterPrompt = `Review the resume below on the following guidelines. 
1. The resume should be clear and concise, and speak for itself. 
2. There should not be a professional summary, the resume should speak for itself.
3. Each bullet point in the resume should follow the STAR (Situation, Task, Action, Result) formula.
4. There should be at least one quantifiable piece of information per bullet point 
5. Bullet points should be about the impact or achievement, not a description
6. In certain contexts, bullet points should describe individual contribution, and never speak about team achievement.
7. The resume should have a skills section, not a coursework section. The skills section should be split into languages, libraries, frameworks, and tools.
8. Under no circumstance should there be any form of a subjective word or an adjective. The points in the resume should be objective, nothing about "fast" or "visually appealing".
9. Education should be a one-liner, that just says the school name, diploma/degree that they're receiving, and start and finish dates formatted as (month, year) - (month, year).
9. Format should follow something like this (from top to bottom): Full name, nav-bar with city, email, and links to linkedin, github, and portfolio (optional), 
skills section as mentioned earlier, education as mentioned earlier, and lastly experience and projects, both of which 
are interchangable in terms of the order, just depends on which is more impressive.
10. Projects should link to a deployed website or a github repo, and some important skills should be mentioned next to each project name
11. Project titles should be specific, example: "suggestion box website for school club" (bad) vs "student organization feedback system" (good).
12. Formatting and nomenclature should be consistent throughout the entire resume.
14. There should be no spelling or grammar mistakes throughout the whole resume.
15. When reviewing, be sure to consider that some things may just be a formatting problem because of the way pdf converts to text, so be a little less strict on that but be sure to still mention it.
16. High school education should not be listed unless it is really impressive or has great achievement, same with anything that is non-technical.
17. GPA/Final grade from school should not be included unless it is anything above 3.9 (on a 4.0 scale), also GPA should always be in a 4.0 scale, even if the school doesn't necessarily follow a 4.0 scale.
Resume guide from University of Waterloo, summarized:
Based on the guide, an effective engineering resume's primary goal is to secure an interview. To achieve this, you should first define a personal objective statement to guide the resume's content, ensuring every part is relevant to the type of role you are seeking. This statement is for your use only and should not be added to the resume itself. It is highly recommended to tailor different versions of your resume for specific industries (e.g., hardware vs. software) rather than for individual companies, as this better demonstrates technical depth. The content should focus on key sections: Education, Skills, Experiences, and Projects. Information to exclude includes high school details, non-technical jobs from before university, summary paragraphs, photos, and irrelevant hobbies.

For appearance and formatting, the guide advises a clean, single-column layout, as two-column formats can cause automated screeners to fail and human readers to miss information. A simple, grayscale color scheme is recommended for its professional and functional look. The resume should be limited to one page for every ten years of experience, which means a single page for almost all undergraduates. Use a minimum font size of 10, with 10-12 being ideal for body text. Professionalism should extend to the PDF file name, which should be simple, such as "FirstName-LastName-Resume," without version numbers or dates.

When writing content, all bullet points for experiences and projects must follow the STAR method (Situation, Task, Action, Result) to describe accomplishments with concrete, quantifiable results. Always be truthful and avoid exaggeration, focusing on your individual contributions rather than just team achievements. If working under a Non-Disclosure Agreement (NDA), describe your specific actions without revealing proprietary company information, and get your bullet points vetted by a manager before you leave. The guide strongly recommends creating a separate portfolio to showcase projects with more detail and images, calling it a "must-have" for technical roles. Finally, seeking feedback on your draft from peers and upper-year students in your target field is critical to ensure its quality before applying.`;

export const reviewResume = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      const error = new Error("Problem with resume");
      error.status = 400;
      next(error);
    }

    const pdfBuffer = await fs.readFile(file.path);
    const pdfData = await PdfParse(pdfBuffer);
    const resumeText = pdfData.text;
    console.log(resumeText);

    const guidePath = path.join(
      process.cwd(),
      "The Sahil and Daniel Co-op Resume Guide (3).txt"
    );

    const messages = [
      {
        role: "system",
        content:
          "You are a career advisor for students applying to internships. " +
          "Review resumes using the provided guide and give clear, structured feedback." +
          "Do not use any subjective words. Remain professional." +
          "It is imperative and important that you be as strict as possible when following these guidelines." +
          "The feedback returned should start with something along these lines. After reviewing your" +
          "resume and comparing it to a strong set of base guidelines, as well as many resume guides from T20 schools, " +
          "here is your feedback" +
          "Do not offer to review again, this interaction with the user will be one-way. Do not use any bolded text. Do not use a point system. Be sure to include a summary of feedback and some actionable steps at the end. Do not include a closing statement. Remember to be less strict on the formatting and links since it could be a matter of conversion between pdf and raw text." +
          "Here is the resume guide: " +
          masterPrompt,
      },
      {
        role: "user",
        content: `------------------------------
        Here is the user's resume: ${resumeText}`,
      },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      messages,
      temperature: 0.3,
    });

    const feedback = completion.choices[0].message.content;

    res.json({ feedback });
  } catch (error) {
    next(error);
  }
};
