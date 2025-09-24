import path from "path";

export const downloadGuides = (req, res, next) => {
  const filePath = path.resolve("./ResumeGuides.zip");

  res.download(filePath, "ResumeGuides.zip", (err) => {
    if (err) {
      res.json({ error: "Could not download zip file" });
    }
  });
};
