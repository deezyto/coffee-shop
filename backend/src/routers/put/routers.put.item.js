const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Item = require('../../models/model.item');
const Category = require('../../models/model.category');

router.put('/update/item/:id', auth, async (req, res) => {
  try {
    if (req.admin) {
      const item = await Item.findById(req.params.id);
      const updates = Object.keys(req.body);
      const allowedFields = ['title', 'description', 'slug', 'images', 'metaTags', 'removeCategories', 'addCategories'];
      const isValidUpdates = updates.every(elem => allowedFields.includes(elem));

      if (!isValidUpdates) {
        return res.status(400).send({err: 'This updates not allowed'});
      }

      const removeCategoriesFromItem = async () => {
        await Item.findByIdAndUpdate(
          req.params.id,
          { $pullAll: { parentCategories: req.body.removeCategories } },
          { new: true, useFindAndModify: false }
        );
      }

      const removeItemFromCategories = async () => {
        req.body.removeCategories.forEach(async categoryId => {
          await Category.findByIdAndUpdate(
            categoryId,
            { $pull: { items: req.params.id } },
            { new: true, useFindAndModify: false }
          );
        });
      };
      
      const addCategoriesToItem = async () => {
        await Item.findByIdAndUpdate(
          req.params.id,
          { $addToSet: { parentCategories: req.body.addCategories } },
          { new: true, useFindAndModify: false }
        );
      }

      const addItemToCategories = async () => {
        req.body.addCategories.forEach(async categoryId => {
          await Category.findByIdAndUpdate(
            categoryId,
            { $addToSet: { items: req.params.id } },
            { new: true, useFindAndModify: false }
          );
        });
      }

      if (req.body.removeCategories) {
        await removeCategoriesFromItem();
        await removeItemFromCategories();
      } 
      
      if (req.body.addCategories) {
        await addCategoriesToItem();
        await addItemToCategories();
      }

      delete req.body.removeCategories;
      delete req.body.addCategories;

      updates.forEach(field => {
        item[field] = req.body[field];
      })
      
      await item.save();
      res.send(item);
      
      }
  } catch (e) {
    res.status(500).send({err: e});
  }
});

module.exports = router;