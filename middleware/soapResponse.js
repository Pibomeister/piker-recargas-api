const xml2js = require('xml2js');

var parseSOAPresponse = (response) => {

    //console.log('\n\nImprimiendo respuesta (raw):\n');
    //console.log(response);

    //console.log('\n\nResponse.body: \n');
    //console.log(response.body);

    var parser = new xml2js.Parser();

    var jsonBody;

    //console.log('\n\nResponse.body: \n');
    //console.log(response.body.substring(0, response.body.length));

    parser.parseString(response.body.substring(0, response.body.length), function (err, result) {
        //console.log('\n\nImprimiendo  result');
        //console.log(result);
        jsonBody = JSON.stringify(result, undefined, 2);
    });

    //console.log('\n\nImprimiendo jsonBody (raw):\n');
    //console.log(jsonBody);

    jsonBody = JSON.parse(jsonBody);

    //console.log('\n\nImprimiendo jsonBody parseado como objeto JSON (raw):\n');
    //console.log(jsonBody);

    var jsonResultWS;
    parser.parseString(jsonBody['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['ns1:RequestWSResponse'][0]['ResultWS'][0]['_'].substring(0, jsonBody['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['ns1:RequestWSResponse'][0]['ResultWS'][0]['_'].length), function (err, result) {
        jsonResultWS = JSON.stringify(result, undefined, 2);
    });

    //console.log('\n\nImprimiendo jsonResultWS (raw):\n');
    //console.log(jsonBody);

    return jsonResultWS;
}

module.exports = parseSOAPresponse;