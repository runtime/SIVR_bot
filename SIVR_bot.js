'use strict';
 
const functions = require('firebase-functions');
const { dialogflow, Permission } = require('actions-on-google');
const app = dialogflow();

app.intent('SIVR-clear-contexts', (conv) => {
    //app.clearContext("SIVR-get-name");

    // app.context.set({
    //     'name': 'SIVR-get-name',
    //     'lifespan': 0
    //   })
});
 
app.intent('SIVR-get-location', (conv) => {

    conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';
    return conv.ask(new Permission({
        context: 'to locate you',
        permissions: conv.data.requestedPermission,
    }));

   
});

app.intent('SIVR-user-Info', (conv, params, permissionGranted) => {
    if (permissionGranted) {
        const {requestedPermission } = conv.data;
            if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {
    
                const {coordinates} = conv.device.location;
                const city = conv.device.location.city;
    			// changer to city when we figure this out// or lat/long
                if (coordinates) {
                    return conv.ask(`I have found you in ${city}, can you tell me briefly what your situation is?`);
                    ////${coordinates.latitude}
                } else {
                    // Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates
                    // and a geocoded address on voice-activated speakers.
                    // Coarse location only works on voice-activated speakers.
                    return conv.close('Sorry, I could not figure out where you are.');
                }
            }
            
    } else {
        return conv.close('Sorry, permission denied.');
    }
});
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);



s