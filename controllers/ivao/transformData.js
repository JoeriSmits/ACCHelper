'use strict';

const https = require('https');

/**
 * Here we get the raw data from IVAO
 */
const getRawData = (callback) => {
  // We fire a https request to the IVAO endpoint
  https.get(process.env.IVAO_ENDPOINT, (res) => {
    // We set the encoding to utf8
    res.setEncoding('utf8');
    // We add each chunk to the rawData buffer
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    // When the data retrieve process has been completed we return the buffer
    res.on('end', () => { callback(rawData); });
  });
};

const transformRawToObject = (callback) => {
  getRawData((data) => {
    // We want the string between !CLIENTS and !AIRPORTS those are the clients connected
    const clients = data.substring(data.indexOf('!CLIENTS') + 8, data.indexOf('!AIRPORTS'))
          .split('\n');
    // We save buffer array where we push the clientObject
    let result = [];
    for(var i in clients) {
      // We loop over each line and split the string on :
      const client = clients[i].split(':');
      // We filter this array and put the information in an object
      const clientObject = {
          callsign: client[0],
          VID: client[1],
          name: client[2],
          clientType: client[3],
          frequency: client[4],
          latitude: client[5],
          longtitude: client[6],
          altitude: client[7],
          groundSpeed: client[8],
          flightplan: {
              aircraft: client[9],
              flightRules: client[21],
              typeOfFlight: client[43],
              revision: client[20],
              departureAerodrome: client[11],
              departureTime: client[22],
              cruisingSpeed: client[10],
              cruisingLevel: client[12],
              route: client[30],
              destinationAerodrome: client[13],
              actualDepartureTime: client[23],
              EETHours: client[24],
              EETMinutes: client[25],
              alternateAerodrome: client[28],
              secondAlternateAerodrome: client[42],
              enduranceHours: client[26],
              enduranceMinutes: client[27],
              personsOnBoard: client[44],
              otherInformation: client[29]
          },
          server: client[14],
          protocol: client[15],
          transponderCode: client[17],
          facilityType: client[18],
          visualRange: client[19],
          atis: client[35],
          atisTime: client[36],
          connectionTime: client[37],
          softwareName: client[38],
          softwareVersion: client[39],
          adminVersion: client[40],
          ATCPilotRating: client[41],
          heading: client[45],
          onGround: client[46],
          simulator: client[47],
          plane: client[48]
      };
      // We push the object to the buffer array
      result.push(clientObject);
    }
    // We return the meaningful object in the callback
    callback(result);
  });
};

exports.result = (callback) => {
  transformRawToObject((data) => {
    callback(data);
  });
};
