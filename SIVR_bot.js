'use strict';
 
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { dialogflow, Permission } = require('actions-on-google');
const app = dialogflow();

const serviceAccount = {
 // put account keys here
};



admin.initializeApp(
    // add db object initalize here
);

process.env.DEBUG = "dialogflow:debug";

const db = admin.database();
var ref = db.ref('/calls/');


app.intent('SIVR-save-user-data', (conv, params) => {
	//const {conversationdata} = conv.data;
  
  	//const {call} = conv.data;
  	const {coords} = conv.device.location;
    const city = conv.device.location.city;
  
  	return ref.push(coords.latitude).then(() => {
      conv.ask('data saved');
    }).catch(() => {
      conv.ask('could not save data');
    });
});

app.intent('SIVR-get-location', (conv) => {
  
	conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';
  
    return conv.ask(new Permission({
        context: 'to locate you',
        permissions: conv.data.requestedPermission,
      
    }));
   
});

app.intent('SIVR-user-Info', (conv, params, permissionGranted) => {
   
 // return conv.close('SIVR-user-info fired');
  
  if (permissionGranted) {
        const {requestedPermission} = conv.data;
            if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {
    
                const {coordinates} = conv.device.location;
                const city = conv.device.location.city;
              
    			// change to city when we figure this out// or lat/long
                if (coordinates) {
                   //return conv.ask(`I have found you at ${coordinates.longitude}, can you tell me briefly what your situation is?`);
                   return ref.push(coordinates).then(conv.ask(`I have found you at ${coordinates.longitude}, can you tell me briefly what your situation is?`));
                    ////${coordinates.latitude}
                } else {
                    // Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates
                    // and a geocoded address on voice-activated speakers.
                    // Coarse location only works on voice-activated speakers.
                    return conv.ask('Sorry, I could not figure out where you are.');
                }
            }
            
    } else {
        return conv.close('Sorry, permission denied.');
    }
});
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);



