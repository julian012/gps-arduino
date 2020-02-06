import { connect } from "../database";
import trafficStatsSchema from "../models/Route";
import dotenv from "dotenv";
dotenv.config();
connect();

var values = {
  license_plate: process.env.LICENCE_PLATE,
  route: process.env.ROUTE,
  date: Date.now(),
  latitude: 5.555391833333333,
  longitude: -73.3512705,
  operation: process.env.OPERATION_IN
};

async function test() {
  const newValue = new trafficStatsSchema(values);
  await newValue.save();
  return newValue;
}

console.log(test());
