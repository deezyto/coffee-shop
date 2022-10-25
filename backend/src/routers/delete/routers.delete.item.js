const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Item = require('../../models/model.item');

router.delete('/coffee/:id', auth, async (req, res) => {
  try {
    if (req.admin) {
      const item = await Item.findById(req.params.id);
      if (!item) {
        res.status(404).send();
      }
      item.remove();
      res.send(item);
    }
  } catch {
    res.status(400).send();
  }
});

module.exports = router;