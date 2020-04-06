const Firestore = require('@google-cloud/firestore');
const {PROJECT_ID} = require('../config/env');
const {capitalize} = require('../utils/capitalize');

const db = new Firestore({
  projectId: PROJECT_ID,
});

const devicesRef = db.collection('devices');
const usersRef = db.collection('users');

exports.addDevice = async (device) => {
  try {
    const ref = await devicesRef.add(device);

    console.log('[Firestore Service] [Save Device] New Device Added:', ref.id);
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

exports.getAllDevicesWithUserInfo = async () => {
  try {
    const snapshot = await devicesRef.get();
    const data = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {deviceID: data.deviceID, user: data.user};
    });
    for (let index = 0; index < data.length; index++) {
      const device = data[index];
      const userId = device.user;
      if (userId !== '') {
        const doc = await usersRef.where('googleID', '==', userId).get();
        if (doc.empty) {
          console.log('[User-API][Firestore][getAllDevicesWithUserInfo] No user found');
          return null;
        }
        let userInfo;
        doc.forEach((doc) => {
          userInfo = doc.data();
        });
        device.user = {
          name: capitalize(`${userInfo.name} ${userInfo.lastName}`),
          email: userInfo.email,
          photo: userInfo.photo,
        };
      } else {
        device.user = null;
      }
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

exports.getUserByDevice = async (id) => {
  try {
    const snapshot = await devicesRef.where('deviceID', '==', id).get();
    if (snapshot.empty) {
      console.log('[User-API][Firestore][getUserByDevice] Device not found');
      return null;
    }
    let device;
    snapshot.forEach((doc) => {
      device = doc.data();
    });
    const userId = device.user;
    const doc = await usersRef.where('googleID', '==', userId).get();
    if (doc.empty) {
      console.log('[User-API][Firestore][getUserByDevice] No user found');
      return null;
    }
    let user;
    doc.forEach((doc) => {
      user = doc.data();
    });
    return {
      name: capitalize(`${user.name} ${user.lastName}`),
      email: user.email,
      photo: user.photo,
    };
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * @CristianValdivia
 * Update the config of device
 * @description Update config of device in Firestore
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {Function} next Callback function
 */
exports.updateDevice = async (id, config) => {
  try {
    await devicesRef
      .where('deviceID', '==', id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          devicesRef.doc(doc.id).update(config);
        });
      });
    console.log('[Firestore Service] [updateDevice] Update config:', config);
  } catch (error) {
    console.log('[Firestore Service] [updateDevice] [Error] There was an error update config', error);
    throw new Error(error);
  }
};
