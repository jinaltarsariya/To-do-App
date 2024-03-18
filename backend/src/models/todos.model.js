const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

todoSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.title = this.title.replace(/\s+/g, " ").trim();
  }
  if (this.isModified("description")) {
    this.description = this.description.replace(/\s+/g, " ").trim();
  }
  next();
});

const todoModel = mongoose.model("Todo", todoSchema);

module.exports = todoModel;
