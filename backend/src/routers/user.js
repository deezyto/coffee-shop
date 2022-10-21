const express = require('express');
const {User} = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

router.get('/users', auth, async (req, res) => {
  try {
    if (req.admin) {
      const sort = {};
      if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
      }
      const userLength = await User.find({});
      const user = await User.find({}, null, {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      })
      if (!user.length) {
        res.status(404).send();
      }
      res.send({results: user, length: userLength.length});
    }
  } catch {
    res.status(500).send();
  }
});

router.post('/users', async (req, res) => {
  try {
    const user = req.body.role === 'customer' ? new User(req.body) : new User({...req.body, role: 'customer'});
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({user, token});
  } catch (e) {
    res.status(400).send({err: e});
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();

    res.send({user, token})
    
  } catch {
    res.status(400).send('Login or email not valid')
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(item => item.token !== req.token)
    await req.user.save();
    res.send({message: 'Logout success'});
  } catch {
    res.status(500).send()
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.find(item => item.token === req.token)
    await req.user.save();
    res.send({message: 'Logout success'});
  } catch {
    res.status(500).send()
  }
});

router.get('/users/me', auth, async (req, res) => {
  console.log(req.user, 'me')
  res.send(req.user);
});

router.put('/users/me', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedFields = ['name', 'lastname', 'surname', 'password', 'address', 
                          'dateBirth', 'email', 'gender', 'phone', 'postalCode'];
    const isValidUpdates = updates.every(item => allowedFields.includes(item));
    console.log(isValidUpdates)
    if (!isValidUpdates) {
      return res.status(400).send({err: 'This updates not allowed'});
    }
    updates.forEach(item => {
      req.user[item] = req.body[item];
    })
    await req.user.save();
    res.send(req.user);
  } catch {
    res.status(500).send();
  }
});


module.exports = router;