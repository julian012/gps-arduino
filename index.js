const SerialPort = require("serialport");
const SerialPortParser = require("@serialport/parser-readline");
const GPS = require("gps");
const Request = require("request-promise");
import { connect } from "./database";
import trafficStatsSchema from "../models/Route";
import dotenv from "dotenv";
dotenv.config();
connect();

// Proximity
const { Board, Proximity, Led } = require('johnny-five');
const board = new Board(); 

const port = new SerialPort("/dev/ttyS0", { baudRate: 9600 });
const gps = new GPS();
const parser = port.pipe(new SerialPortParser());
const MIN_CENTIMETERS = 5
const MAX_CENTIMETERS = 15



board.on('ready', () => {

  gps.on("data", data => {
    if (data.type == "GGA") {
      if (data.quality != null) {
        console.log(" [" + data.lat + ", " + data.lon + "]");
      } else {
        // console.log("no gps fix available");
      }
    }
  });

  parser.on("data", data => {
    try {
      gps.update(data);
    } catch (e) {
      throw e;
    }
  });

  const proximityOne = new Proximity({
    controller: 'HCSR04',
    pin: 12
  });

  const proximityTwo = new Proximity({
    controller: 'HCSR04',
    pin: 11
  });


  let flagOne = false;
  let flagTwo = false;

  proximityTwo.on('change', () => {
    const { centimeters } = proximityOne;
    const ledIn = new Led(13);
    if ()
  })

  proximityOne.on('change', () => {
    const { centimeters } = proximityOne;
    const ledIn = new Led(8);
  });
})
