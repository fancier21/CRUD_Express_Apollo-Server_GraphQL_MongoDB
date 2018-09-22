const mongoose = require("mongoose");
//const uuidv1 = require("uuid/v1");
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  // id: { type: String, default: uuidv1() },
  name: String,
  age: Number,
  books: [String]
});

module.exports = mongoose.model("author", authorSchema);
