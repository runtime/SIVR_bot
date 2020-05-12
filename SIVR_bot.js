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
let ref = db.ref('/calls/');

let call = {};

app.intent('SIVR-get-name', (conv, {name}) => {
    conv.data.name = name;
    call.name = conv.data.name;
    console.log('call.name: ' + call.name);
    return conv.ask(`thank you ${name}, can you let me know about where you are?`);
});

app.intent('SIVR-get-users-location', (conv, {location}) => {
    conv.data.location = location;
  	call.location = conv.data.location.
  	console.log(conv.data.location);
    //return conv.ask('i understand that you are at got you');
    return conv.ask(`got it you're around, ${location.street_address}, can you tell me briefly what your situation is?`);
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



