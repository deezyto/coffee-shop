const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Item = require('../../models/model.item');
const Category = require('../../models/model.category');

router.delete('/delete/item/:id', auth, async (req, res) => {
  try {
    if (req.admin) {
      const item = await Item.findById(req.params.id);
      if (!item) {
        res.status(404).send();
      }

      if (item.parentCategories.length) {
        item.parentCategories.forEach(async category => {
          await Category.findByIdAndUpdate(
            category,
            {$pull: {items: req.params.id } },
            {new: true, useFindAndModify: false}
          )
        });
      }

      item.remove();
      res.send(item);
    }
    
  } catch {
    res.status(400).send();
  }
});

module.exports = router;