/* eslint-disable */

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./routes/main.routes");
const schedule = require("node-schedule");

const dayWord = require("./models/dayWord");
const Words = require("./models/words");

require("dotenv").config();

const PORT = process.env.PORT || 5000;
const mongoUri = process.env.mongoUri;

const app = express();

app.use(express.json({ extended: true }));
app.use(
  "/api",
  cors({
    origin: process.env.CLIENT_URL
  }),
  router
);

const getWords = async () => {
  try {
    const words = await Words.find();
    return words[0].words;
  } catch (e) {
    return e;
  }
};

const getTodayWord = async () => {
  const words = await getWords();
  const randomWord = words[Math.floor(Math.random() * words.length)];
  const today = new Date();
  const todayDate = `${today.getDate()}-${
    today.getMonth() + 1
  }-${today.getFullYear()}`;
  await dayWord.findOneAndUpdate({ date: todayDate }, { name: randomWord });
};

// For inserting new day words

const insertDayWords = async () => {
  const words = await getWords();
  const today = new Date();

  const asyncLoop = async () => {
    // Before using make sure to change dates in wordDate and also the loop condition, it depends on number of the days in certain month
    for (let i = 1; i < 31; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      const wordDate = `${i}-${today.getMonth() + 3}-${today.getFullYear()}`;
      const newDayWord = new dayWord({ name: randomWord, date: wordDate });
      await newDayWord.save();
    }
  };
  asyncLoop();
};

const start = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
/* eslint-enable */
