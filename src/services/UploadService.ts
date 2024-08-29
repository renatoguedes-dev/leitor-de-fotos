import { IMeasure } from "../models/Measure";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

class UploadService {
    async processImage(fileMimeType: string, imageBase64: string) {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: fileMimeType,
                    data: imageBase64,
                },
            },
            {
                text: "This is either a water meter or a gas meter. What is the meter reading value in this image? Please respond with only the numeric value.",
            },
        ]);

        const measureValue = parseInt(result.response.text(), 10);

        return measureValue;
    }
}

export default UploadService;
