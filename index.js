import { exec } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import voice from "elevenlabs-node";
import express from "express";
import { promises as fs } from "fs";
import Replicate from "replicate";
import OpenAI from "openai";

dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  // dangerouslyAllowBrowser: true,
});

dotenv.config();

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
// const voiceID = "kgG7dCoKCfLehAPWkJOE";
const voiceID = "VR6AewLTigWG4xSOukaG";
// const voiceID = "onwK4e9ZLuTAKqWW03F9";
// const voiceID = "bO9I2VJAR581Kmd746q1";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/voices", async (req, res) => {
  res.send(await voice.getVoices(elevenLabsApiKey));
});

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

const lipSyncMessage = async (message) => {
  const time = new Date().getTime();
  console.log(`Starting conversion for message ${message}`);
  await execCommand(
    `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav`
    // -y to overwrite the file
  );
  console.log(`Conversion done in ${new Date().getTime() - time}ms`);
  await execCommand(
    `./bin/Rhubarb-Lip-Sync-1.13.0-Linux/rhubarb -f json -o audios/message_${message}.json audios/message_${message}.wav -r phonetic`
  );
  // -r phonetic is faster but less accurate
  console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
};

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    res.send({
      messages: [
        {
          text: "Hello and welcome to Open Source Days! I'm your AI Assistant, ready to help.",
          audio: await audioFileToBase64("audios/intro_0.wav"),
          lipsync: await readJsonTranscript("audios/intro_0.json"),
          facialExpression: "smile",
          animation: "Idle",
        },
        {
          text: " Any questions or information you need, just ask. Enjoy the event!",
          audio: await audioFileToBase64("audios/intro_1.wav"),
          lipsync: await readJsonTranscript("audios/intro_1.json"),
          facialExpression: "smile",
          animation: "Bow",
        },
      ],
    });
    return;
  }
  if (!elevenLabsApiKey || openai.apiKey === "-") {
    res.send({
      messages: [
        {
          text: "Please my dear, don't forget to add your API keys!",
          audio: await audioFileToBase64("audios/api_0.wav"),
          lipsync: await readJsonTranscript("audios/api_0.json"),
          facialExpression: "angry",
          animation: "Idle",
        },
      ],
    });
    return;
  }

  // ! THIS IS WHAT NEEDS TO BE CHANGED I THINK

  const completion = await openai.chat.completions.create({
    model: "01-ai/yi-34b-chat",
    messages: [{ role: "user", content: userMessage }],
  });

  let messagesX = completion.choices[0].message.content;
  let messageList = [];
  // if (messages.messages) {
  //   messages = messages.messages; // ChatGPT is not 100% reliable, sometimes it directly returns an array and sometimes a JSON object with a messages property
  // }
  console.log(userMessage);
  console.log(messagesX);
  for (let i = 0; i < 1; i++) {
    const message = {};
    message.text = messagesX;
    // generate audio file
    const fileName = `audios/message_${i}.mp3`; // The name of your audio file
    const textInput = message.text; // The text you wish to convert to speech
    await voice.textToSpeech("113cdea0357ab1743ceea3d89ae34079", voiceID, fileName, textInput);
    // generate lipsync
    await lipSyncMessage(i);
    console.log(message);
    message.audio = await audioFileToBase64(fileName);
    message.lipsync = await readJsonTranscript(`audios/message_${i}.json`);
    message.facialExpression = "smile";
    message.animation = "Idle";
    messageList.push(message);
    console.log(message);
  }
  
  res.send({ messages:messageList });
});

const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString("base64");
};

app.listen(port, () => {
  console.log(`ByteBuddy listening on port ${port}`);
});
