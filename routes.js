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
        return user.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });

});

router.post("/users/login", (req, res)=> {
    const body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then( user => {
      return user.generateAuthToken().then( token => {
         res.header('x-auth', token).send(user);
      })
    }).catch( err => {
      res.status(400).send();
    });
});

router.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

router.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(()=> {
    res.status(200).send();
  }, ()=> {
    res.status(400).send();
  })
});





module.exports = router;
