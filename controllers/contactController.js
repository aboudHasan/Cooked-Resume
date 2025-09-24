import nodemailer from "nodemailer";

export const sendMail = async (req, res, next) => {
  const { name, message } = req.body;
  const file = req.file;
  const email_user = process.env.EMAIL;
  const email_pass = process.env.APP_PASSWORD;

  if (!file) {
    const error = new Error("Could not receive PDF");
    error.status = 500;
    next(error);
  }

  if (file.mimetype !== "application/pdf") {
    const error = new Error("Only PDF files are allowed");
    error.status = 400;
    next(error);
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email_user,
        pass: email_pass,
      },
    });

    await transporter.sendMail({
      from: email_user,
      to: email_user,
      subject: `New resume guide ${name ? "from " + name : ""}`,
      text: message || "No message provided",
      attachments: [
        {
          filename: file.originalname,
          content: file.buffer,
          contentType: file.mimetype,
        },
      ],
    });

    res.json({ message: "Resume Guide submitted successfully - Thank you!" });
  } catch (error) {
    next(error);
  }
};
