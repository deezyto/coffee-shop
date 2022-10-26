const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Item = require('../../models/model.item');

router.put('/update/item/:id', auth, async (req, res) => {
  try {
    if (req.admin) {
      const item = await Item.findById(req.params.id);
      console.log(item)
      const updates = Object.keys(req.body);
      const copy = {...req.body};
      const allowedFields = ['title', 'description', 'slug', 'images', 'metaTags', 'removeCategories', 'addParentCategories'];
      const isValidUpdates = updates.every(elem => allowedFields.includes(elem));

      if (!isValidUpdates) {
        return res.status(400).send({err: 'This updates not allowed'});
      }

      delete req.body.removeCategories;
      delete req.body.addParentCategories;

      updates.forEach(field => {
        item[field] = req.body[field];
      })

      //remove categories from item
      if (copy.removeCategories) {
        item.removeCategories.forEach(async categoryForRemove => {
          const newArray = item.parentCategories.filter(category => category !== categoryForRemove);;
          item.parentCategories = newArray;
          await item.save();
        });
      }

      //add categories to item
      if (copy.addParentCategories.length) {
        item.parentCategories = item.parentCategories.concat(req.body.addParentCategories);
      }

      await item.save();
      res.send(item);
      }
  } catch {
    res.status(500).send();
  }
});

module.exports = router;