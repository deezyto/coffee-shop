const express = require('express');
const auth = require('../../middleware/middleware.auth');
const router = new express.Router();

router.put('/users/me', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedFields = ['name', 'lastname', 'surname', 'password', 'address',
      'dateBirth', 'email', 'gender', 'phone', 'postalCode'];
    const isValidUpdates = updates.every(item => allowedFields.includes(item));

    if (!isValidUpdates) {
      return res.status(400).send({ err: 'This updates not allowed' });
    }
    updates.forEach(item => {
      req.user[item] = req.body[item];
    })
    await req.user.save();
    return res.send(req.user);
  } catch {
    return res.status(500).send();
  }
});

module.exports = router;