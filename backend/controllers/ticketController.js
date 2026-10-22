const fs = require("fs");
const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const analyzeTicket = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Ticket image is required",
      });
    }

    filePath = req.file.path;

    const imageBuffer = fs.readFileSync(
      filePath
    );

    const base64Image =
      imageBuffer.toString("base64");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a railway ticket information extraction system.

Analyze the provided railway ticket image.

Extract ONLY information that is clearly visible.

Do NOT guess or invent information.

Return ONLY valid JSON.

Use this exact structure:

{
  "pnrNumber": "",
  "trainNumber": "",
  "trainName": "",
  "journeyDate": "",
  "passengerName": "",
  "fromStation": "",
  "toStation": "",
  "coach": "",
  "seatNumber": "",
  "ticketClass": ""
}

Rules:

1. Preserve PNR exactly as visible.
2. Preserve train number exactly as visible.
3. If a field is not visible, return an empty string.
4. Do not add explanations.
5. Do not use markdown code fences.
6. Return valid JSON only.
`;

    const result =
      await model.generateContent([
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: base64Image,
          },
        },
        prompt,
      ]);

    let text =
      result.response.text().trim();

    text = text
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    const extractedData =
      JSON.parse(text);

    return res.status(200).json({
      success: true,
      message:
        "Ticket analyzed successfully",
      data: extractedData,
    });

  } catch (error) {
    console.error(
      "Ticket analysis error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to analyze ticket",
      error: error.message,
    });

  } finally {
    if (
      filePath &&
      fs.existsSync(filePath)
    ) {
      try {
        fs.unlinkSync(filePath);
      } catch (deleteError) {
        console.error(
          "Temporary file delete error:",
          deleteError
        );
      }
    }
  }
};

module.exports = {
  analyzeTicket,
};