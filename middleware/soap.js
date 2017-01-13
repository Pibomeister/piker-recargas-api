const request = require('request');

module.exports = enviarSoap = (req, res, next) => {
    request.post({
            url: 'http://www.webservicex.net/geoipservice.asmx?wsdl',
            body: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.webservicex.net/">
                <soapenv:Header/>
                <soapenv:Body>
                    <web:GetGeoIP>
                        <web:IPAddress>74.125.224.72</web:IPAddress>
                    </web:GetGeoIP>
                </soapenv:Body>
            </soapenv:Envelope>`,
            headers: {
                'Content-Type': 'text/xml'
            }
        },
        (err, response, body) => {
            if (!err && response.statusCode == 200) {
                req.soap = body;
                next();
            } else {
                res.status(500).send(err);
            }
        });
};
