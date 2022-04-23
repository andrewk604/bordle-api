/* eslint-disable */
const { Schema, model } = require("mongoose");

const Words = new Schema({
  words: []
});

module.exports = model("Words", Words);
