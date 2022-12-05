const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Item = require('../../models/model.item');
const Category = require('../../models/model.category');

router.delete('/delete/item/:id', auth, async (req, res) => {
  try {
    if (!req.admin) return res.status(403).send();
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).send();

    if (item.parentCategories.length) {
      for await (let category of item.parentCategories) {
        await Category.findByIdAndUpdate(
          category,
          { $pull: { mainItems: req.params.id, items: req.params.id } },
          { new: true, useFindAndModify: false }
        )
      }
    }

    item.remove();
    return res.send(item);
  } catch {
    return res.status(500).send();
  }
});

module.exports = router;