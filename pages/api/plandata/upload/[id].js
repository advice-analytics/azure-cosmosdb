import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Disables automatic body parsing
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        res.status(500).json({ error: "Server error" });
        return;
      }

      const { planId } = fields;

      if (!planId) {
        res.status(400).json({ error: "Missing planId" });
        return;
      }

      const { file } = files;

      if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      const tempPath = file.path;
      const fileName = file.name;
      const uploadDir = path.join(process.cwd(), "uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      const filePath = path.join(uploadDir, fileName);

      try {
        fs.renameSync(tempPath, filePath);
        console.log("File uploaded successfully:", filePath);
        res.status(200).json({ message: "File uploaded successfully" });
        // Implement logic to associate filePath with planId in your database
      } catch (error) {
        console.error("Error saving file:", error);
        res.status(500).json({ error: "Server error" });
      }
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
