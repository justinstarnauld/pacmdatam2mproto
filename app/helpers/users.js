'use strict';
const User = require('../db/user');

// find a device by a given name
let findUserByAuth0Id = auth0Id => {
  return new Promise((resolve, reject) => {
    User.findOne({'auth0Data.id': auth0Id}, (error, user) => {
      if (error) {
        reject(error)
      } else {
        resolve(user);
      }
    });
  });
}

// find a device by a given name
let findDeviceByName = (usersDevicesArray, device) => {
  let findDeviceIndex = usersDevicesArray.findIndex((element, index, array) => {
    return element.title === device.title ? true : false;
  });
  if (findDeviceIndex > -1) {
    let deviceObj = usersDevicesArray[findDeviceIndex]
    return deviceObj;
  } else {
    return undefined;
  }
}

// add a given device to the user's savedDevices array
let addDeviceToUserAndSave = (user, device) => {
  // check to see if this device already exists in the array
  let getDevice = findDeviceByName(user.savedDevices, device);
  if (getDevice !== undefined) {
    // remove device from array
    user.savedDevices.splice(getDevice, 1);

    // push the device onto the allDevices array
    user.savedDevices.push(device);
    // return the updated devices array
    user.save();
    return user;
  } else {
    // just push the device onto the allDevices array
    user.savedDevices.push(device);
    // return the updated devices array
    user.save();
    return user;
  }
}

// find and remove the device from user's savedDevices array
let removeSavedDeviceFromUser = (user, device) => {
  return new Promise((resolve, reject) => {
    // find the device
    let findDevice = user.savedDevices.findIndex((element, index, array) => {
      return element.title === device ? true : false;
    });
    // if found, remove it from the array and resolve the promise passing back the updated user object
    if (findDevice > -1) {
      user.savedDevices.splice(findDevice, 1);
      user.save();
      resolve(user);
    }
  });
}

module.exports = {
  findUserByAuth0Id,
  addDeviceToUserAndSave,
  removeSavedDeviceFromUser
}
