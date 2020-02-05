import { Schema, model } from "mongoose";

const facultySchema = new Schema(
  {
    placa: {
      type: String,
      require: true
    },
    date: {
      type: { type: Date, default: Date.now },
      require: true
    },
    latitude: {
      type: Number,
      require: true
    },
    longitude: {
      type: String,
      require: true
    }
  },
  {
    collection: "ROUTES"
  }
);

export default model("Faculty", facultySchema);
