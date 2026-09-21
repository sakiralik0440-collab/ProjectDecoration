const axios = require("axios");
const FormData = require("form-data");

const LOCAL_AI_URL =
    process.env.LOCAL_AI_URL || "http://127.0.0.1:8000";

async function generateRoomDesign({
    imageBuffer,
    imageName = "room.jpg",
    roomType,
    designStyle,
}) {
    if (!imageBuffer) {
        throw new Error("Room image is required.");
    }

    const form = new FormData();

    form.append("image", imageBuffer, {
        filename: imageName,
        contentType: "image/jpeg",
    });

    form.append("roomType", roomType || "living room");
    form.append("designStyle", designStyle || "modern");

    const response = await axios.post(
        `${LOCAL_AI_URL}/generate`,
        form,
        {
            headers: {
                ...form.getHeaders(),
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 30 * 60 * 1000,
        }
    );

    return response.data;
}

async function checkLocalAI() {
    const response = await axios.get(
        `${LOCAL_AI_URL}/health`,
        {
            timeout: 5000,
        }
    );

    return response.data;
}

module.exports = {
    generateRoomDesign,
    checkLocalAI,
};