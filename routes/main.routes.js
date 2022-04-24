/* eslint-disable */
const Words = require("../models/words");
const dayWord = require("../models/dayWord");
const Router = require("express");
const router = Router();

const equals = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

const getValue = (part, o) =>
  Object.entries(o).find(([k, v]) => k.startsWith(part))?.[1];

// For all check function, a is needed word, b is given word

const checkSymbols = (a, b) => {
  let arr = [];
  // a.forEach((i, id) => {
  //   if (b.includes(i) && arr.includes(i) === false) {
  //     arr.push(i);
  //   }
  // });
  b.forEach((i, id) => {
    if (a.includes(i)) {
      arr.push(id);
    }
  });
  return arr;
};

const checkPlaces = (a, b) => {
  let arr = [];
  a.forEach((i, id) => {
    if (b[id] == i) {
      arr.push(id);
    }
  });

  return arr;
};

// a = mimsy, b = memes

const checkNotInWord = (a, b) => {
  let arr = [];
  b.forEach((i, id) => {
    if (a.includes(i) === false) {
      arr.push(id);
    }
  });
  return arr;
};

const getWords = async () => {
  try {
    const words = await Words.find();
    return words[0].words;
  } catch (e) {
    return e;
  }
};

const getTodayWord = async () => {
  try {
    const today = new Date();
    const todayDate = `${today.getDate()}-${
      today.getMonth() + 1
    }-${today.getFullYear()}`;
    const word = (await dayWord.findOne({ date: todayDate })).name;
    return word;
  } catch (error) {
    return error;
  }
};

const checkWord = async (word) => {
  // Words for check

  const needed = (await getTodayWord()).split("");
  const given = word.split("");

  // Object when the check results are stored and will be returned then
  // Check if correct in total
  // Check correct symbols
  // Check correct places

  const result = {
    correct: equals(needed, given),
    correctSymbols: checkSymbols(needed, given),
    correctPlaces: checkPlaces(needed, given),
    notCorrect: checkNotInWord(needed, given)
  };

  return result;
};

router.get("/words", async (req, res) => {
  try {
    const words = await Words.find();
    res.json(words[0].words);
  } catch (e) {
    res.json(e);
  }
});

router.get("/todayword", async (req, res) => {
  try {
    const word = await getTodayWord();
    res.json(word);
  } catch (error) {
    res.json(error);
  }
});

router.post("/check", async (req, res) => {
  try {
    const word = req.query.word;
    const words = await getWords();
    if (words.includes(word)) {
      const result = await checkWord(word);
      res.json(result);
    } else {
      res.status(404).json({ message: "The word is not in the dictionary" });
    }
  } catch (e) {
    res.json(e);
  }
});

module.exports = router;
