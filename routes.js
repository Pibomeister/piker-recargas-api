const express = require('express');
const request = require('request');
const Recarga = require('./models/recarga');

const router = express.Router();

const enviarSoap = (number, amount) => {
  return new Promise ( (fulfill, reject) => {
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
    (err, res, body) => {
      if (!err && res.statusCode == 200) {
        fulfill(body);
      } else {
        reject(err);
      }
    });
});
};

router.use((req, res, next)=>{
  console.log(req.method, req.url);
  next();
});

router.get("/",  (req, res) => {
  res.send('Bienvenidos a mi servidorcito');
});
// Por User ID
// router.route("/recargas/:uid")
// .get((req, res) => {
//   Recarga.find({userId: req.params.uid},
//     (err, recargas)=>{
//       if(err){
//         return res.status(500).send(err);
//       }
//       res.status(200).json(recargas);
//     })
// })
// .post((req, res) => {
//   let rec = new Recarga({
//     number: req.body.number,
//     amount: req.body.amount,
//     userId: req.params.uid
//   });
//   rec.save((err, rec) => {
//     if(err){
//       return res.status(500).send(err);
//     }
//     console.log('Guardando',req.body);
//     res.status(200).json(rec);
//   })
// });

// router.route("/recargas")
//   .get((req, res) => {
//     // recarga.find({}, callback) Para cuando se pidan con user number.
//     res.status(200).json(testDb);
//   })
//   .post((req, res) => {
//     console.log('Guardando',req.body);
//     res.status(200).json(req.body);
//   });

router.route("/recargas")
.get((req, res) => {
  Recarga.find(
    (err, recargas)=>{
      if(err){
        return res.status(500).send(err);
      }
      res.status(200).json(recargas);
    })
})
.post((req, res) => {
  enviarSoap(req.body.number, req.body.amount).then(
    body => {
      console.log('SOAP RESPONSE', body);
      let rec = new Recarga({
        number: req.body.number,
        amount: req.body.amount,
        userId: 'piterlaanguila'
      });
      rec.save((err, rec) => {
        if(err){
          return res.status(500).send(err);
        }
        console.log('Guardando',req.body);
        res.status(200).json(rec);
      })
    }
  ).catch( err => console.log('SOAP ERR', err));

});




module.exports = router;
