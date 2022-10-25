const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Item = require('../../models/model.item');

router.put('/coffee/:id', auth, async (req, res) => {
  try {
    if (req.admin) {
      const item = await Item.findById(req.params.id);
      const updates = Object.keys(req.body);
      const allowedFields = ['title', 'description'];
      const isValidUpdates = updates.every(elem => allowedFields.includes(elem));
      if (!isValidUpdates) {
        return res.status(400).send({err: 'This updates not allowed'});
      }

      updates.forEach(field => {
        item[field] = req.body[field];
      })

      await item.save();
      res.send(item);
      }
  } catch {
    res.status(500).send();
  }
});

module.exports = router;