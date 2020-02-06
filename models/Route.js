import { Schema, model } from "mongoose";
import Double from "@mongoosejs/double";

const trafficStatsSchema = new Schema(
  {
    license_plate: {
      type: String,
      require: true
    },
    route: {
      type: String,
      require: true
    },
    date: {
      type: Date,
      default: Date.now()
    },
    latitude: {
      type: Double,
      require: true
    },
    longitude: {
      type: Double,
      require: true
    },
    operation: {
      type: String,
      require: true
    }
  },
  {
    collection: "TRAFFIC_STATS"
  }
);

export default model("TrafficStats", trafficStatsSchema);
