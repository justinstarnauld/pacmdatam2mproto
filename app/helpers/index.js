'use strict';
const deviceHelpers = require('./devices');
const userHelpers = require('./users');

// empty allDevices array unless the first item name is the same as the search device
let ensureEmptyAllDevicesArray = (allDevices, data) => {
  return new Promise((resolve, reject) => {
    let firstItem = allDevices[0];
    if (firstItem !== undefined && firstItem.deviceTitle !== data.searchInput) {
      allDevices.shift();
      resolve(firstItem);
    }
  });
}

// find a device by a given name
let findDeviceByName = (allDevices, device) => {
  let findDeviceIndex = allDevices.findIndex((element, index, array) => {
    return element.deviceTitle === device ? true : false;
  });
  if (findDeviceIndex > -1) {
    let deviceObj = allDevices[findDeviceIndex]
    return deviceObj;
  } else {
    return undefined;
  }
}

// find a device by the current socket id
let findDeviceNameBySocketID = (allDevices, socket) => {
  return new Promise((resolve, reject) => {
    let socketIdIndex = allDevices.findIndex((element, index, array) => {
      return element.socketID === socket.id ? true : false;
    });

    if (socketIdIndex > -1) {
      let deviceObj = allDevices[socketIdIndex];
      resolve(deviceObj);
    }
  });
}

// Add device info to array when searching/subscribing by device name
let addDeviceToList = (allDevices, data, socket) => {
  // check to see if this device already exists in the array
  let getDevice = findDeviceByName(allDevices, data.searchInput);
  if (getDevice !== undefined) {
    // remove device from array
    allDevices.splice(getDevice, 1);

    // push the device onto the allDevices array
    allDevices.push({
      socketID: socket.id,
      deviceTitle: data.searchInput,
      dweetSource: data.toggleInput
    });
    // return the updated devices array
    return allDevices;
  } else {
    // just push the device onto the allDevices array
    allDevices.push({
      socketID: socket.id,
      deviceTitle: data.searchInput,
      dweetSource: data.toggleInput
    });
    // return the updated devices array
    return allDevices;
  }
}

// find and purge the device when socket disconnects
let removeDeviceFromList = (allDevices, socket) => {
  return new Promise((resolve, reject) => {
    // find the device
    let findDevice = allDevices.findIndex((element, index, array) => {
      return element.socketID === socket.id ? true : false;
    });

    if (findDevice > -1) {
      allDevices.splice(findDevice, 1);
      resolve(allDevices);
    }
  });
}

module.exports = {
  latestDweetForDevice: deviceHelpers.latestDweetForDevice,
  listenForDeviceDweets: deviceHelpers.listenForDeviceDweets,
  stopListeningForDeviceDweets: deviceHelpers.stopListeningForDeviceDweets,
  stopListeningToAllDweets: deviceHelpers.stopListeningToAllDweets,
  findUserByAuth0Id: userHelpers.findUserByAuth0Id,
  addDeviceToUserAndSave: userHelpers.addDeviceToUserAndSave,
  removeSavedDeviceFromUser: userHelpers.removeSavedDeviceFromUser,
  updateDeviceStateAndSave: userHelpers.updateDeviceStateAndSave,
  ensureEmptyAllDevicesArray,
  findDeviceByName,
  findDeviceNameBySocketID,
  addDeviceToList,
  removeDeviceFromList
}
