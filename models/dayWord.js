/* eslint-disable */
const { Schema, model } = require("mongoose");

const dayWord = new Schema({
  name: {
    type: String,
    required: true
  },
  date: String
});

module.exports = model("dayWord", dayWord);
