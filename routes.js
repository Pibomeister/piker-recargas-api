const express = require('express');
const _ = require('lodash');

const router = express.Router();

const Recarga = require('./models/recarga');
const User = require('./models/user');
const authenticate = require('./middleware/authenticate');
const enviarSoap = require('./middleware/soap');


router.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

router.get("/", (req, res) => {
    res.send('Bienvenidos a mi servidorcito');
});

router.route("/recargas")
    .get(authenticate, (req, res) => {
        Recarga.find({userId: req.user._id}).then((recargas) => {
            res.json(recargas);
        }, (err) => {
            res.status(400).send(err)
        })
    })
    .post([authenticate, enviarSoap], (req, res) => {
        console.log(req.user);
        console.log('SOAP RESPONSE', req.soap);
        let rec = new Recarga({
            number: req.body.number,
            amount: req.body.amount,
            userId: req.user._id
        });
        return rec.save().then((rec) => {
            console.log('Guardando, ', req.body);
            res.json(rec);
        }, (err) => {
            res.status(400).send(err);
        });
    });

router.post("/users", (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);

    user.save().then(() => {
        console.log('Mexicano');
        return user.generateAuthToken();
    }).then(token => {
        console.log('Token there: ', token);
        res.header('x-auth', token);
        res.send(user);
    }).catch((err) => {
        console.log('Obviamente');
        res.status(400).send(err);
    });

});

router.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});





module.exports = router;
