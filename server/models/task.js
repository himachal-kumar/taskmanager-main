import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    priority: {
      type: String,
      default: "normal",
      enum: ["high", "medium", "normal", "low"],
    },
    stage: {
      type: String,
      default: "todo",
      enum: ["todo", "in progress", "completed"],
    },
    team: [{
      type: Schema.Types.ObjectId,
      ref: "User"
    }],
    assets: {
      type: [String],
      default: []
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    isTrashed: { type: Boolean, default: false },
    activities: [
      {
        type: {
          type: String,
          default: "assigned",
          enum: ["assigned", "started", "in progress", "bug", "completed", "commented"],
        },
        activity: String,
        date: { type: Date, default: Date.now },
        by: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    subTasks: [
      {
        title: String,
        date: Date,
        tag: String,
      },
    ]
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
