'use strict';
const dweetClient = require("./node-dweetio-local");
const dweetio = new dweetClient();

// Set dweet data source endpoint url
let setDweetDataSource = (value) => {
  let dweetDataSource = value ? 'https://thingspace.io:443' : 'https://dweet.io:443';
  dweetio.set_server(dweetDataSource);
}

// Return latest dweet for a given deivce
let latestDweetForDevice = (dweetName, dweetSource) => {
  return new Promise((resolve, reject) => {
    setDweetDataSource(dweetSource);
    dweetio.get_latest_dweet_for(dweetName, (err, dweet) => {
      let dweetDevice = dweet[0];
      let response;

      if (err) {
        console.log('Dweet error!');
        response = { error: 'No device found!!!' }
      } else if (dweetDevice) {
        response = dweetDevice;
      }
      resolve(response);
    });
  });
}

// Listen for dweets for a given deivce
let listenForDeviceDweets = (dweetName, dweetSource, callback) => {
  setDweetDataSource(dweetSource);
  dweetio.listen_for(dweetName, (dweet) => {
    console.log(`${dweet.thing}: ${dweet.created}`);
    console.log('---------------------------------')
    callback(dweet);
  });
}

// Stop listening for dweets for a given deivce
let stopListeningForDeviceDweets = (dweetName, dweetSource) => {
  return new Promise((resolve, reject) => {
    setDweetDataSource(dweetSource);
    dweetio.stop_listening_for(dweetName);
    resolve(true);
  });
}

// Stop listening to all devices
let stopListeningToAllDweets = (dweetSource) => {
  setDweetDataSource(dweetSource);
  dweetio.stop_listening();
}

module.exports = {
  latestDweetForDevice,
  listenForDeviceDweets,
  stopListeningForDeviceDweets,
  stopListeningToAllDweets
}
