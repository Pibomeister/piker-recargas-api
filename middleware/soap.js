const request = require('request');
const md5 = require('md5');
const parseSOAPresponse = require('./soapResponse.js');

const PosName = '5535592033';
const UserName = 'Bernardo15';
var UserPass = '169058BM';
UserPass = md5(UserPass);

const TABLEVALUES = {
    // Telcel:
    "11": "1", // 20
    "12": "2", // 30
    "13": "3", // 50
    "14": "4", // 100
    "15": "6", // 200
    "16": "7", // 300
    "17": "8", // 500
    // Movistar:
    "21": "38", // 20
    "22": "39", // 30
    "23": "40", // 50
    "24": "42", // 100
    "25": "45", // 200
    "26": "46", // 300
    "27": "47", // 500
    // Unefon:
    "31": "119", // 20
    "32": "116", // 30
    "33": "48", // 50
    "34": "49", // 100
    "35": "51", // 200
    "36": "52", // 300
    "37": "53", // 500
    // Iusacell:
    "41": "120", // 20
    "42": "117", // 30
    "43": "56", // 50
    "44": "57", // 100
    "45": "59", // 200
    "46": "60", // 300
    "47": "61", // 500
    // Nextel:
    "51": "118", // 20
    "52": "82", // 30
    "53": "84", // 50
    "54": "85", // 100
    "55": "87", // 200
    "56": "88", // 300
    "57": "89", // 500
    // Virgin:
    "61": "122", // 20
    "62": "82", // 30
    "63": "84", // 50
    "64": "85", // 100
    "65": "87", // 200
    "66": "88", // 300
    "67": "89", // 500
    // Maztiempo:
    "71": "91", // 20
    "72": "92", // 30
    "73": "93", // 50
    "74": "95", // 100
    "75": "98", // 200
    "76": "99", // 300
    "77": "100", // 500
    // Cierto:
    "81": "101", // 20
    "82": "102", // 30
    "83": "103", // 50
    "84": "104", // 100
    "85": "105", // 200
    "86": "106", // 300
    "87": "107", // 500
}

var logError = function (errorType, jsonResultWS) {
    console.log(errorType);
    console.log(`Succes: ${jsonResultWS.Response.Success[0]}`);
    console.log(`ErrNo: ${jsonResultWS.Response.ErrNo[0]}`);
    console.log(`Error: ${jsonResultWS.Response.Error[0]}`);
};
var logSuccess = function (succesMessage, jsonResultWS) {
    console.log(succesMessage);
    console.log(`Succes: ${jsonResultWS.Response.Success[0]}`);
    console.log(`Fields: ${jsonResultWS.Response.Fields[0]}`);
};

module.exports = (req, res, next) => {
    var TransRef;
    var ReservaTopUpmessage = `<Request>
                                    <PosLogin>
                                        <PosName>${PosName}</PosName>
                                        <UserName>${UserName}</UserName>
                                        <UserPass>${UserPass}</UserPass>
                                    </PosLogin>
                                    <PosMethod>
                                        <MethodName>ReservaTopUp</MethodName>
                                        <Params>
                                            <CountryCode>52</CountryCode>
                                            <PhoneNumber>${req.body.number}</PhoneNumber>
                                            <CardID>${TABLEVALUES[req.body.cardID]}</CardID>
                                        </Params>
                                    </PosMethod>
                                </Request>`;
    console.log('Mandando solicitud ReservaTopUp', ReservaTopUpmessage);
    request.post({
            url: 'http://taecel.com/ConexionCorporativa.php?wsdl',
            body: `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ConexionCorporativa">
                   <soapenv:Header/>
                   <soapenv:Body>
                      <urn:RequestWS soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                         <StringWS xsi:type="xsd:string">
                            ${ReservaTopUpmessage}
                         </StringWS>
                      </urn:RequestWS>
                   </soapenv:Body>
                </soapenv:Envelope>`,
            headers: {
                'Content-Type': 'text/xml'
            }
        },
        (err, response, body) => {
            if (!err && response.statusCode == 200) {
                // Manejo de la respuesta ReservaTopUp.
                var jsonResultWS = parseSOAPresponse(response);
                console.log(jsonResultWS);
                jsonResultWS = JSON.parse(jsonResultWS);
                if (jsonResultWS.Response.Success[0] === '1') {
                    TransRef = jsonResultWS.Response.Fields[0].TransRef[0];
                    var Ticket = 1;
                    var VenderTopUpMessage = `<Request>
                                                <PosLogin>
                                                    <PosName>${PosName}</PosName>
                                                    <UserName>${UserName}</UserName>
                                                    <UserPass>${UserPass}</UserPass>
                                                </PosLogin>
                                                <PosMethod>
                                                    <MethodName>VenderTopUp</MethodName>
                                                    <Params>
                                                        <TransRef>${TransRef}</TransRef>
                                                        <Ticket>${Ticket}</Ticket>
                                                    </Params>
                                                </PosMethod>
                                            </Request>`;
                    console.log('Mandando solicitud VenderTopUp', VenderTopUpMessage);
                    request.post({
                        url: 'http://taecel.com/ConexionCorporativa.php?wsdl',
                        body: `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ConexionCorporativa">
                                    <soapenv:Header/>
                                    <soapenv:Body>
                                        <urn:RequestWS soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                                            <StringWS xsi:type="xsd:string">
                                                ${VenderTopUpMessage}
                                            </StringWS>
                                        </urn:RequestWS>
                                    </soapenv:Body>
                                </soapenv:Envelope>`,
                        headers: {
                            'Content-Type': 'text/xml'
                        }
                    }, (err, response, body) => {
                        if (!err && response.statusCode == 200) {
                            // Manejo de la respuesta de VenderTopUp.
                            var jsonResultWS = parseSOAPresponse(response);
                            console.log(jsonResultWS);
                            jsonResultWS = JSON.parse(jsonResultWS);
                            if (jsonResultWS.Response.Success[0] === '1') {
                                // Transacción exitosa.
                                logSuccess('Transacción exitosa (VenderTopUp).', jsonResultWS);
                                next();
                            } else if (jsonResultWS.Response.Success[0] === '2') {
                                // Transaccion fracasada.
                                logError('Transacción fracasada (VenderTopUp).', jsonResultWS);
                                res.status(500).send('Transacción fracasada (VenderTopUp).');
                            } else if (jsonResultWS.Response.Success[0] === '3') {
                                // CheckStatus.
                                var CheckStatusMessage = `<Request>
                                                            <PosLogin>
                                                                <PosName>${PosName}</PosName>
                                                                <UserName>${UserName}</UserName>
                                                                <UserPass>${UserPass}</UserPass>
                                                            </PosLogin>
                                                            <PosMethod>
                                                                <MethodName>CheckStatus</MethodName>
                                                                <Params>
                                                                    <TransRef>${TransRef}</TransRef>
                                                                </Params>
                                                            </PosMethod>
                                                        </Request>`;
                                console.log('Mandando solicitud CheckStatus');
                                request.post({
                                    url: 'http://taecel.com/ConexionCorporativa.php?wsdl',
                                    body: `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ConexionCorporativa">
                                                <soapenv:Header/>
                                                <soapenv:Body>
                                                    <urn:RequestWS soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                                                        <StringWS xsi:type="xsd:string">
                                                            ${CheckStatusMessage}
                                                        </StringWS>
                                                    </urn:RequestWS>
                                                </soapenv:Body>
                                            </soapenv:Envelope>`,
                                    headers: {
                                        'Content-Type': 'text/xml'
                                    }
                                }, (err, response, body) => {
                                    if (!err && response.statusCode == 200) {
                                        // Manejo de la respuesta CheckStatus.
                                        var jsonResultWS = parseSOAPresponse(response);
                                        console.log(jsonResultWS);
                                        jsonResultWS = JSON.parse(jsonResultWS);
                                        if (jsonResultWS.Response.Success[0] === '1') {
                                            // Transacción exitosa.
                                            logSuccess('Transacción exitosa (CheckStatus).', jsonResultWS);
                                            next();
                                        } else if (jsonResultWS.Response.Success[0] === '2') {
                                            // Transacción fracasada.
                                            logError('La solicitud generó algun error. Transacción fracasada (CheckStatus).', jsonResultWS);
                                            res.status(500).send('La solicitud generó algun error. Transacción fracasada (CheckStatus).');
                                        } else if (jsonResultWS.Response.Success[0] === '0') {
                                            logError('La solicitud generó algun error. Transacción fracasada (CheckStatus).', jsonResultWS);
                                            res.status(500).send('La solicitud generó algun error. Transacción fracasada (CheckStatus).');
                                        }
                                    } else {
                                        // Transacción fracasada.
                                        res.status(500).send(err);
                                    }
                                });
                            } else if (jsonResultWS.Response.Success[0] === '0') {
                                logError('La solicitud generó algun error. Transacción fracasada (VenderTopUp).', jsonResultWS);
                                res.status(500).send('La solicitud generó algun error. Transacción fracasada (VenderTopUp).');
                            }
                        } else {
                            // Transacción fracasada.
                            res.status(500).send(err);
                        }
                    });
                } else if (jsonResultWS.Response.Success[0] === '0') {
                    // Transacción fracasada.
                    logError('La solicitud generó algún error. Transacción fracasada (ReservaTopUp).', jsonResultWS);
                    res.status(500).send('La solicitud generó algún error. Transacción fracasada (ReservaTopUp).');
                }
            } else {
                // Transacción fracasada.
                res.status(500).send(err);
            }
        });
};

