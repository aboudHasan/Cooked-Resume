import OpenAI from "openai";
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
12. If a portfolio website is not linked in the resume, suggest that a portfolio should be developed, even just a simple HTML and CSS static page.
13. Formatting and nomenclature should be consistent throughout the entire resume.
14. There should be no spelling or grammar mistakes throughout the whole resume.
It is imperative and important that you be as strict as possible when following these guidelines. Give a final rating out of 100.
The feedback should be returned along these lines.
"After reviewing your resume and comparing it to a strong set of base guidelines, as well as many resume guides from T20 schools,
your rating for your resume is (rating) out of 100. 
(rest of the feedback, such as removing a professional summary, or clearing up a bullet point)".

Keep your feedback clear and concise as well. Do not use any subjective words. Speak briefly and only use the necessary words to get the point across, like how the guidelines were written.
`;
