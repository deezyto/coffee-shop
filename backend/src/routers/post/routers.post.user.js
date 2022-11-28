const express = require('express');
const { User } = require('../../models/model.user');
const auth = require('../../middleware/middleware.auth');
const router = new express.Router();

router.post('/users', async (req, res) => {
  try {
    const user = new User({ ...req.body, role: 'customer' });
    await user.save();
    const token = await user.generateAuthToken();
    return res.status(201).send({ user, token });
  } catch (e) {
    return res.status(400).send({ err: e });
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    return res.send({ user, token })
  } catch {
    return res.status(400).send('Login or email not valid')
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(item => item.token !== req.token)
    await req.user.save();
    return res.send({ message: 'Logout success' });
  } catch {
    return res.status(500).send()
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.find(item => item.token === req.token)
    await req.user.save();
    return res.send({ message: 'Logout success' });
  } catch {
    return res.status(500).send()
  }
});
module.exports = router;