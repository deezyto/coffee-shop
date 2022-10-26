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

      //remove category from item
      if (copy.removeCategories) {
        const objCategories = {};
        item.parentCategories.forEach(item => {
          objCategories[item] = item;
        });

        copy.removeCategories.forEach(item => {
          delete objCategories[item];
        });

        await Item.findByIdAndUpdate(
          req.params.id,
          { $set: { parentCategories: Object.keys(objCategories) } },
          { new: true, useFindAndModify: false }
        );
      }

      //add categories to item
      if (copy.addParentCategories) {
        const objCategories = {};
        item.parentCategories.forEach(item => {
          objCategories[item] = item;
        });

        copy.addParentCategories.forEach(item => {
          objCategories[item] = item;
        });

        await Item.findByIdAndUpdate(
          req.params.id,
          { $set: { parentCategories: Object.keys(objCategories) } },
          { new: true, useFindAndModify: false }
        );
      }

      await item.save();
      res.send(item);
      }
  } catch (e) {
    res.status(500).send({err: e});
  }
});

module.exports = router;