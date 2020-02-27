const Firestore = require('@google-cloud/firestore');
const {PROJECT_ID} = require('../config/env');

const db = new Firestore({
  projectId: PROJECT_ID,
});

const devicesRef = db.collection('devices');

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
