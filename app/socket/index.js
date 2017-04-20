'use strict';
const h = require('../helpers');

module.exports = (io, app) => {
  let allDevices = app.locals.devices;
  io.of('/devicedata').on('connection', socket => {

    socket.on('getLatestDweet', data => {
      h.ensureEmptyAllDevicesArray(allDevices, data)
        .then(device => {
          h.stopListeningForDeviceDweets(device.deviceTitle, device.dweetSource);
        })
        // when a device is searched by name return latest dweet first
        .then(h.latestDweetForDevice(data.searchInput, data.toggleInput)
          .then(content => {
            socket.emit('deviceDweetContent', JSON.stringify(content));
          }))
          // after the device is found and content emitted to client, request dweet stream
          .then(h.listenForDeviceDweets(data.searchInput, data.toggleInput, (dweet) => {
            socket.emit('deviceDweetStream', JSON.stringify(dweet));
          }))
          // after all promises have resolved add deivce to locals array for tracking active streams
          .then(h.addDeviceToList(allDevices, data, socket));
    });
    // when leaving the page disconnect the socket for this namespace
    socket.on('disconnect', () => {
      // find the device by socket id as tracked in the locals array
      h.findDeviceNameBySocketID(allDevices, socket)
        .then(deviceObj => {
          // use values from the local array to stop listening to device dweet stream
          h.stopListeningForDeviceDweets(deviceObj.deviceTitle, deviceObj.dweetSource)
        })
        // remove device from locals array
        .then(h.removeDeviceFromList(allDevices, socket));
    });
    // when a user chooses to save a device
    socket.on('saveDeviceToUser', data => {
      // find and return the requesting user
      h.findUserByAuth0Id(data.userId)
        .then(user => {
          // add this device to the user's savedDeviceArray and return the updated user.
          h.addDeviceToUserAndSave(user, data.deviceData);
        });
    });
    // when a user chooses to remove a saved device
    socket.on('removeDeviceFromUser', data => {
      // find and return the requesting user
      h.findUserByAuth0Id(data.userId)
        .then(user => {
          // remove this device from the user's savedDeviceArray and return the updated user.
          h.removeSavedDeviceFromUser(user, data.deviceTitle);
        });
    })
    // check device data for each saved device on page load or refresh button click event
    socket.on('checkForDeviceContent', data => {
      // find and return the requesting user
      h.findUserByAuth0Id(data.userId)
        .then(user => {
          h.updateDeviceStateAndSave(user)
          .then(updatedUser => {
            socket.emit('returnedUsersSavedDevicesState', JSON.stringify(updatedUser.savedDevices));
          });
        });
    });
  });
}
