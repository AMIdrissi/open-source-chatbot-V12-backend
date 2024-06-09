import { exec } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import voice from "elevenlabs-node";
import express from "express";
import { promises as fs } from "fs";
import axios from "axios";

dotenv.config();
console.log("hello");
dotenv.config();

//! make sure you change these as they no longer work 
const elevenLabsApiKey = "0db7198723df5782880fe3b741a4a832";

// const voiceID = "kgG7dCoKCfLehAPWkJOE";
// const voiceID = "VR6AewLTigWG4xSOukaG"; // not very deep voice
// const voiceID = "fC8dY5CgRJzaqqmhetsm"; // deep voice
const voiceID = "TZ6BLrXGXLibv7LA0cgO"; // mid deep british voice
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
 
  // switch case for all the conferenciers and guests
  switch (userMessage) {
    case "":
      res.send({
        messages: [
          {
            text: "Welcome! I'm Oscar, your AI assistant for the next two days.",
            audio: await audioFileToBase64("audios/intro/intro0.wav"),
            lipsync: await readJsonTranscript("audios/intro/intro0.json"),
            facialExpression: "smile",
            animation: "Bow",
          },
          {
            text: " We're going to have a great time together. Buckle up because our series of surprises starts now.",
            audio: await audioFileToBase64("audios/intro/intro1.wav"),
            lipsync: await readJsonTranscript("audios/intro/intro1.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
          {
            text: " The theme of this edition is 'AI and Computer Vision: Revolution and Responsibility,' representing an exciting convergence between two major technological fields.",
            audio: await audioFileToBase64("audios/intro/intro2.wav"),
            lipsync: await readJsonTranscript("audios/intro/intro2.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
          {
            text: " Artificial intelligence leads to systems capable of learning, reasoning, and decision-making, while computer vision enables machines to understand, analyze, and interact with the visual world around them.",
            audio: await audioFileToBase64("audios/intro/intro3.wav"),
            lipsync: await readJsonTranscript("audios/intro/intro3.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
          {
            text: " This revolutionary combination redefines how we interact with technology, turning human-machine interfaces into more intuitive and immersive experiences. However, this technological revolution also raises ethical questions and challenges related to responsibility",
            audio: await audioFileToBase64("audios/intro/intro4.wav"),
            lipsync: await readJsonTranscript("audios/intro/intro4.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
          {
            text: " It's crucial to consider how these advances can be used ethically and responsibly, ensuring they serve the well-being of society as a whole.",
            audio: await audioFileToBase64("audios/intro/intro5.wav"),
            lipsync: await readJsonTranscript("audios/intro/intro5.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
          {
            text: " Thus, 'AI and Computer Vision: Revolution and Responsibility' not only explores exciting technological advancements but also the ethical implications of these advancements. This event provides a platform to discuss how we can shape a future where technological innovation is accompanied by ethical responsibility, ensuring that these advancements benefit everyone.",
            audio: await audioFileToBase64("audios/intro/intro6.wav"),
            lipsync: await readJsonTranscript("audios/intro/intro6.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
        ],
      });
      return;
    case "1":
      res.send({
        messages: [
          {
            text: " Eminent Expert in Digital Transformation, Executive Advisory, and Associate Researcher at IMREDD, Mohamed Amine El Mahfoudi will enlighten our conference with his captivating talk on the role of artificial intelligence in optimizing operational efficiency for employees in businesses.",
            audio: await audioFileToBase64("audios/day1/conf0.wav"),
            lipsync: await readJsonTranscript("audios/day1/conf0.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
        ],
      });
      return;
    case "2":
      res.send({
        messages: [
          {
            text: "Abdelilah Kadili, Expert in Education Transformation and pioneer in integrating AI into education, host of TV shows, and renowned speaker, will passionately share his experience as President of the Tamkine Foundation during our conference on the exciting theme: Reinventing the educational landscape through Information and Communication Technologies (ICT) and Artificial Intelligence (AI).",
            audio: await audioFileToBase64("audios/day1/conf1.wav"),
            lipsync: await readJsonTranscript("audios/day1/conf1.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
        ],
      });
      return;
    // from here
    case "3":
      res.send({
        messages: [
          //TODO : HAS TO REGENERATE SOUND
          {
            text: "Mr Akram Ougri is an expert in supporting commercial management and specialist in artificial intelligence Akram will lead an engaging workshop on the theme of generative AI and no-code solutions to enhance the customer experience. Join us for a day of insightful exploration and dynamic discussions on how these innovative technologies can revolutionize user experiences.",
            audio: await audioFileToBase64("audios/day1/conf4.wav"),
            lipsync: await readJsonTranscript("audios/day1/conf4.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
        ],
      });
      return;
    case "4":
      res.send({
        messages: [
          {
            text: "Oussama Hamal, teacher-researcher and consultant in information technologies, Najib Hamouti, specialist in career management and governance of training establishments, Lakhdissi Mouhsine, entrepreneur specializing in startups, and Mohammed Jebbar, leader in transforming business practices through innovative solutions, will come together to debate the crucial theme: 'Can artificial intelligence replace engineers in the job market?'",
            audio: await audioFileToBase64("audios/day1/conf2.wav"),
            lipsync: await readJsonTranscript("audios/day1/conf2.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
          {
            text: "This roundtable will be an opportunity to explore diverse perspectives and gain valuable insights into this current topic.",
            audio: await audioFileToBase64("audios/day1/conf3.wav"),
            lipsync: await readJsonTranscript("audios/day1/conf3.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
        ],
      });
      return;
    case "5":
      res.send({
        messages: [
          {
            text: "In parallel, during this event, don't miss the workshop led by Said Wahid, Microsoft MCT consultant. With his expertise in software development and varied experience as a Microsoft training consultant, Said Wahid will shed light on two essential topics: 'How to successfully complete my end-of-studies project' and 'Building an AI Application.'",
            audio: await audioFileToBase64("audios/day1/conf6.wav"),
            lipsync: await readJsonTranscript("audios/day1/conf6.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
        ],
      });
      return;
    case "6":
      res.send({
        messages: [
          {
            text: "Dive into an enriching exploration with Moussab Benious's conference, focused on the crucial theme: 'Keys to Success in your End-of-Studies Project'. Discover practical advice and effective strategies for successfully completing your end-of-studies project. Moussab Benious will share his expertise and offer valuable guidance to students seeking inspiration for their academic project. This conference promises to be an invaluable source of inspiration.",
            audio: await audioFileToBase64("audios/day1/conf5.wav"),
            lipsync: await readJsonTranscript("audios/day1/conf5.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
        ],
      });
      return;
    case "7":
      res.send({
        messages: [
          {
            text: "Brahim Baif, UX Designer at Obytes, presents a conference on 'AI and UX Design: Adapting to the potential and limitations of AI.' Explore with him how AI influences UX design in innovative ways.",
            audio: await audioFileToBase64("audios/day2/conf8.wav"),
            lipsync: await readJsonTranscript("audios/day2/conf8.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
        ],
      });
      return;
    case "8":
      res.send({
        messages: [
          {
            text: "In parallel ,Hassan El Bahi, expert in Deep Learning, Data, and Business Intelligence, as well as a popular YouTube content creator, invites you to participate in his workshop. With a Ph.D. in Artificial Intelligence and Image Processing and as a university professor at ENCG Marrakech, Hassan brings exceptional expertise in designing engaging computer science courses.",
            audio: await audioFileToBase64("audios/day2/conf9.wav"),
            lipsync: await readJsonTranscript("audios/day2/conf9.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
          {
            text: "Discover Hassan El Bahi's workshop. Titled 'From Data to Decisions: Become a Business Analyst with Power BI,' this practical session will guide you through using Power BI to transform data into strategic decisions.",
            audio: await audioFileToBase64("audios/day2/conf10.wav"),
            lipsync: await readJsonTranscript("audios/day2/conf10.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
        ],
      });
      return;
    case "9":
      res.send({
        messages: [
          {
            text: "Najem Mohamad, expert in AI, Agile Methods, and leadership management, brings a wealth of experience as an IT Program Manager, Agile Consultant, coach, trainer, and facilitator. In his conference, Najem will explore the captivating theme of 'How to become an Augmented Leader?'. ",
            audio: await audioFileToBase64("audios/day2/conf11.wav"),
            lipsync: await readJsonTranscript("audios/day2/conf11.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
          {
            text: "This presentation promises to offer unique perspectives on how leaders can effectively integrate artificial intelligence and agile methods into their management practice to successfully navigate a constantly evolving world. Join us for a stimulating exploration of this crucial topic for leadership professionals.",
            audio: await audioFileToBase64("audios/day2/conf12.wav"),
            lipsync: await readJsonTranscript("audios/day2/conf12.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
        ],
      });
      return;
    case "10":
      res.send({
        messages: [
          {
            text: "Hassan Fadili, DevOps consultant, is an expert in visualization with proven experience in the software industry. He has expertise in Windows Communication Foundation (WCF), C sharp, Visual Studio, Scrum, and Team Foundation Server (TFS), as well as strong skills in community and social services, with a degree in Information Technology Engineering from the Hogeschool van Amsterdam. ",
            audio: await audioFileToBase64("audios/day2/conf13.wav"),
            lipsync: await readJsonTranscript("audios/day2/conf13.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
          {
            text: "In his conference, Hassan will explore the exciting theme of 'GitHub Enterprise Adoption & Copilot.' This presentation promises to offer in-depth insights into adopting GitHub Enterprise and using Copilot to optimize software development processes. Join us for an information-rich session full of insights and perspectives.",
            audio: await audioFileToBase64("audios/day2/conf14.wav"),
            lipsync: await readJsonTranscript("audios/day2/conf14.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
        ],
      });
      return;
    case "11":
      res.send({
        messages: [
          {
            text: "The winning team has truly showcased their prowess by fearlessly tackling the challenges presented and ingeniously crafting the optimal solution. Their ability to think outside the box, adapt to unforeseen obstacles, and deliver a solution that not only meets but exceeds expectations is commendable. Their dedication, expertise, and collaborative spirit have undoubtedly set a new standard for innovation. ",
            audio: await audioFileToBase64("audios/special/spec1.wav"),
            lipsync: await readJsonTranscript("audios/special/spec1.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
        ],
      });
      return;
    case "12":
      res.send({
        messages: [
          {
            text: "Congratulations to them for their outstanding achievement.",
            audio: await audioFileToBase64("audios/special/spec2.wav"),
            lipsync: await readJsonTranscript("audios/special/spec2.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
        ],
      });
      return;
    case "13":
      res.send({
        messages: [
          {
            text: "Let's mark our calendars with anticipation and warmth for the next edition of this incredible event, where innovation meets passion! Until then, let's carry spirit of collaboration and creativity in our hearts, eagerly awaiting the opportunity to reunite and witness more groundbreaking achievements. See you all at the next edition, filled with even more love, learning, and laughter! ",
            audio: await audioFileToBase64("audios/special/spec3.wav"),
            lipsync: await readJsonTranscript("audios/special/spec3.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
        ],
      });
      return;
    default:
      break;
  }

  // ! THIS IS WHAT NEEDS TO BE CHANGED I THINK
  console.time("Execution Time");
  const completion = await axios.post(
    "http://0.0.0.0:11434/api/generate",
    {
      model: "llama2:vram-33",
      prompt: userMessage,
      system:
        "You are oscar and you are a virtual assistant for an event called open source days,you're going to answer messages briefly and in a professional way ,without asterisk actions",
      stream: false,
      keep_alive: "600m",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  // .then((resp_message) => {
  //   resp_message.data;
  // });
  console.timeEnd("Execution Time");
  let messagesX = completion.data.response;
  let messageList = [];
  
  console.log(userMessage);
  console.log(messagesX);
  for (let i = 0; i < 1; i++) {
    const message = {};
    message.text = messagesX;
    // generate audio file
    const fileName = `audios/message_${i}.mp3`; // The name of your audio file
    const textInput = message.text; // The text you wish to convert to speech

    await voice.textToSpeech(
      "0db7198723df5782880fe3b741a4a832",
      voiceID,
      fileName,
      textInput,
      0.5,
      0.31,
      "eleven_turbo_v2"
    );

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

  res.send({ messages: messageList });
});

const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString("base64");
};

app.listen(port, "0.0.0.0", () => {
  console.log(`ByteBuddy listening on port ${port}`);
});
