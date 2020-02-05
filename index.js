const SerialPort = require("serialport");
const SerialPortParser = require("@serialport/parser-readline");
const GPS = require("gps");
const Request = require("request-promise");

const port = new SerialPort("/dev/ttyS0", { baudRate: 9600 });
const gps = new GPS();

const APP_ID = "iG1iNSN8iaUINjHcw9LT";
const APP_CODE = "9d_OkPMByNE94ProFpZ4MhOmaXwAnYK7vsWf8EbJOuI";

const parser = port.pipe(new SerialPortParser());

function getAddressInformation(latitude, longitude) {}

gps.on("data", async data => {
    if(data.type == "GGA") {
        if(data.quality != null) {
            let address = await getAddressInformation(data.lat, data.lon);
            console.log(address.Label + " [" + data.lat + ", " + data.lon + "]");
        } else {
            console.log("no gps fix available");
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


function getAddressInformation(latitude, longitude) {
    let address = {};
    return Request({
        uri: "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json",
        qs: {
            "app_id": APP_ID,
            "app_code": APP_CODE,
            "mode": "retrieveAddress",
            "prox": latitude + "," + longitude
        },
        json: true
    }).then(result => {
        if (result.Response.View.length > 0 && result.Response.View[0].Result.length > 0) {
            address = result.Response.View[0].Result[0].Location.Address;
        }
        return address;
    });
}