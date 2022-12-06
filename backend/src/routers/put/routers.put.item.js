const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Item = require('../../models/model.item');
const Category = require('../../models/model.category');
const { createUrl } = require('../../utils/url');

router.put('/update/item/:id', auth, async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(403).send();
    }
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).send({ err: "item not found" });
    }
    console.log(req.body.removeCategories, item.parentCategories)

    const updates = Object.keys(req.body);
    const allowedFields = ['title', 'description', 'slug', 'html', 'metaTags', 'mainCategory', 'removeCategories', 'addCategories'];
    const isValidUpdates = updates.every(field => allowedFields.includes(field));

    if (!isValidUpdates) {
      return res.status(400).send({ err: 'This updates not allowed' });
    }

    const mainCategory = await Category.findById(req.body.mainCategory);
    if (!mainCategory && req.body.mainCategory) {
      return res.status(400).send({ err: 'category not found' });
    }

    if (req.body.slug) {
      const checkSlug = await Item.findOne({ slug: req.body.slug });
      if (checkSlug && item.slug !== checkSlug.slug) {
        return res.status(400).send({ err: `Slug ${req.body.slug} is available. Please choise another.` })
      }
    }

    if (req.body.addCategories) {
      if (!Array.isArray(req.body.addCategories)) {
        return res.status(400).send({ err: 'Parent category must be a array type' });
      }
      for await (let id of req.body.addCategories) {
        const category = await Category.findById(id);
        if (!category) {
          return res.status(400).send({ err: `Parent category ${id} not fount` });
        }
      }
      if (mainCategory) {
        req.body.addCategories.push(mainCategory._id);
      }
    }

    if (!req.body.addCategories && mainCategory) {
      req.body.addCategories = [mainCategory._id];
    }

    const removeCategoriesFromItem = async () => {
      await Item.findByIdAndUpdate(
        req.params.id,
        { $pullAll: { parentCategories: req.body.removeCategories } },
        { new: true, useFindAndModify: false }
      );
    }

    const removeItemFromCategories = async () => {
      for await (let id of req.body.removeCategories) {
        await Category.findByIdAndUpdate(
          id,
          { $pull: { items: req.params.id } },
          { new: true, useFindAndModify: false }
        );
      }
    };

    const addCategoriesToItem = async () => {
      await Item.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { parentCategories: req.body.addCategories } },
        { new: true, useFindAndModify: false }
      );
    }

    const addItemToCategories = async () => {
      for await (let id of req.body.addCategories) {
        await Category.findByIdAndUpdate(
          id,
          { $addToSet: { items: req.params.id } },
          { new: true, useFindAndModify: false }
        );
      }
    }

    const removeItemFromCurrentMainCategory = async () => {
      await Category.findByIdAndUpdate(
        item.mainCategory,
        { $pull: { items: item._id, mainItems: item._id } },
        { new: true, useFindAndModify: false }
      );
    }

    const addItemToNewMainCategory = async () => {
      await Category.findByIdAndUpdate(
        mainCategory._id,
        { $addToSet: { items: item._id, mainItems: item._id } },
        { new: true, useFindAndModify: false }
      );
    }

    if (req.body.removeCategories) {
      req.body.removeCategories = req.body.removeCategories.map((id) => {
        if (id !== req.body.mainCategory && id !== item.mainCategory.toString()) {
          return id;
        }
      });
      await removeCategoriesFromItem();
      await removeItemFromCategories();
    }

    if (req.body.addCategories) {
      await addCategoriesToItem();
      await addItemToCategories();
    }

    if (req.body.mainCategory) {
      await Item.findByIdAndUpdate(
        item._id,
        { $pull: { parentCategories: item.mainCategory } },
        { new: true, useFindAndModify: false }
      );
      await removeItemFromCurrentMainCategory();
      await addItemToNewMainCategory();
      const itemUrl = await createUrl(mainCategory);
      itemUrl.push(req.body.slug ? req.body.slug : item.slug);
      item.url = itemUrl.join('/');
    }

    if (req.body.slug) {
      const changeUrl = item.url.split('/');
      changeUrl[changeUrl.length - 1] = req.body.slug;
      item.url = changeUrl.join('/');
    }

    delete req.body.removeCategories;
    delete req.body.addCategories;
    console.log(req.body)
    updates.forEach(field => {
      item[field] = req.body[field];
    })

    await item.save();
    return res.send(item);
  } catch (e) {
    return res.status(500).send({ err: e });
  }
});

module.exports = router;