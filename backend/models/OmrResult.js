const mongoose = require("mongoose");

const AnswerKeySchema = new mongoose.Schema({
  name: { type: String, required: true },
  numQuestions: { type: Number, required: true },
  numOptions: { type: Number, required: true },
  answers: { type: Object, required: true }, // { 1: "A", 2: "B", ... }
});

module.exports = mongoose.model("AnswerKey", AnswerKeySchema);
