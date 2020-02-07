const SerialPort = require("serialport");
const SerialPortParser = require("@serialport/parser-readline");
const GPS = require("gps");
const Request = require("request-promise");
import { connect } from "./database";
import trafficStatsSchema from "./models/Route";
import dotenv from "dotenv";
dotenv.config();
connect();

// Proximity
const { Board, Proximity, Led } = require("johnny-five");
const board = new Board();

const port = new SerialPort("/dev/ttyS0", { baudRate: 9600 });
const gps = new GPS();
const parser = port.pipe(new SerialPortParser());
const MIN_CENTIMETERS = 20;
const MAX_CENTIMETERS = 100;
const SENSOR_ONE = "one";
const SENSOR_TWO = "two";

board.on("ready", () => {
  let lat = 0;
  let lon = 0;

  gps.on("data", data => {
    if (data.type == "GGA") {
      if (data.quality != null) {
        lat = data.lat;
        lon = data.lon;
        //console.log(" [" + data.lat + ", " + data.lon + "]");
      } else {
        //console.log("no gps fix available");
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

  const proximityTwo = new Proximity({
    controller: "HCSR04",
    pin: 12
  });

  const proximityOne = new Proximity({
    controller: "HCSR04",
    pin: 13
  });

  let firstSensor = "";
  let personIn = false;
  let personOut = false;
  let ready = false;

  proximityTwo.on("change", () => {
    const { centimeters } = proximityTwo;
    //console.log(SENSOR_TWO, " -> ", centimeters);
    const ledIn = new Led(8);
    if(!personOut && !ready){
      if (centimeters >= MIN_CENTIMETERS && centimeters <= MAX_CENTIMETERS) {
        if (firstSensor.length == 0) {
          ledIn.on();
          firstSensor = SENSOR_TWO;
          console.log('El usuario va a entrar')
          personIn= true;
          ready = true;
          addMarker(process.env.OPERATION_IN, ledIn);
        }
          
      } else {
        firstSensor = "";
      }
    }
  });

  proximityOne.on("change", () => {
    const { centimeters } = proximityOne;
    //console.log(SENSOR_ONE, " -> ", centimeters, '---');
    const ledIn = new Led(7);
    if(!personIn && !ready){
      if (centimeters >= MIN_CENTIMETERS && centimeters <= MAX_CENTIMETERS) {
        if (firstSensor.length == 0){
          ledIn.on();
          firstSensor = SENSOR_ONE;
          personOut = true;
          ready = true;
          console.log('El usuario va a salir')
          addMarker(process.env.OPETATION_OUT, ledIn);
        } 
      } else {
        firstSensor = "";
      }
    }
    
  });

  // El primer valor es el que yo valido con el segundo, suponiendo que el segundo si esta activado define si subio o bajo
  async function addMarker(operation, led) {
    const values = {
      license_plate: process.env.LICENCE_PLATE,
      route: process.env.ROUTE,
      date: Date.now(),
      latitude: lat || process.env.LAT,
      longitude: lon || process.env.LON,
      operation: operation
    };
    const newValue = new trafficStatsSchema(values);
    await newValue.save();
    console.log(newValue);
    setTimeout(() => {
      led.off()
      personIn = false
      personOut = false
      ready = false
    }, 3000);
    firstSensor = "";
  }
});
