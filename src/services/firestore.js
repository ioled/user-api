const Firestore = require('@google-cloud/firestore');
const {PROJECT_ID} = require('../config/env');

const db = new Firestore({
  projectId: PROJECT_ID,
});

const devicesRef = db.collection('devices');
const usersRef = db.collection('users');

exports.addDevice = async (device) => {
  try {
    const ref = await devicesRef.add(device);

    console.log('[Firestore Service] [Save Device] New Device Added:', ref);
    return ref;
  } catch (error) {
    console.log('[Firestore Service] [Save Device] [Error] There was an error saving the new device', error);
    throw new Error(error);
  }
};

exports.setUserToDevice = async (deviceId, userId) => {
  try {
    const deviceRef = devicesRef.doc(deviceId);
    const updatedDevice = await deviceRef.update({user: userId});

    console.log('[Firestore Service] [Set User to Device] New Device Linked:', updatedDevice);
    return 'OK';
  } catch (error) {
    console.log(
      '[Firestore Service] [Set User to Device] [Error] There was an error setting the user to the device',
      error,
    );
    throw new Error(error);
  }
};

exports.getUser = async (googleID) => {
  try {
    const snapshot = await usersRef.where('googleID', '==', googleID).get();
    if (snapshot.empty) {
      console.log('[Gateway-API][Firestore][getUser] No matching documents');
      return null;
    } else {
      let userId, user;
      snapshot.forEach((doc) => {
        userId = doc.id;
        user = doc.data();
      });
      return {userId, user};
    }
  } catch (error) {
    console.log('[Firestore Service][getUser]', error);
    return null;
  }
};

exports.getDevices = async (userID) => {
  try {
    const snapshot = await devicesRef.where('user', '==', userID).get();
    const devices = snapshot.docs.map((doc) => doc.data()); // Not tested yet
    return devices;
  } catch (error) {
    console.log('[Firestore Service][getDevices]', error);
    return null;
  }
};
