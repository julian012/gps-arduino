const SerialPort = require("serialport");
const SerialPortParser = require("@serialport/parser-readline");
const GPS = require("gps");
const Request = require("request-promise");
import { connect } from "./database";

// Proximity
const { Board, Proximity, Led } = require('johnny-five');
const board = new Board(); 

connect();

const port = new SerialPort("/dev/ttyS0", { baudRate: 9600 });
const gps = new GPS();
const parser = port.pipe(new SerialPortParser());

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

board.on('ready', () => {
  const proximity = new Proximity({
    controller: 'HCSR04',
    pin: 12
  });
  let passangerIn = false;
  let passangerOut = false;
  let walking = false;

  proximity.on('change', () => {
    const { centimeters } = proximity;
    const ledIn = new Led(8);
    const ledOut = new Led(13);

    console.log('cm: ', centimeters);
    if(!walking){
      if (centimeters > 2 && centimeters <= 10) passangerOut = true
      else if (centimeters > 15 && centimeters <= 45) passangerIn = true
      else {
        passangerIn = false;
        passangerOut = false;
      }

      if(passangerIn) {
        ledIn.on()
        ledOut.off()
        walking = true
        setTimeout(() => walking = false, 5000)
      }
      else ledIn.off();

      if(passangerOut) {
        ledOut.on()
        ledIn.off()
        walking = true
        setTimeout(() => walking = false, 5000)
      }
      else ledOut.off()
    }
  });
})
