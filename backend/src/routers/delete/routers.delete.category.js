const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Item = require('../../models/model.item');
const Category = require('../../models/model.category');
const { createUrl } = require('../../utils/url');
router.delete('/delete/category/:id', auth, async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(403).send();
    }
    const category = await Category.findById(req.params.id);
    const mainCategory = await Category.findById(req.body.mainCategory);

    if (!mainCategory && req.body.mainCategory) {
      res.status(400).send({ err: 'Main category not found' });
    }
    if (!category) {
      res.status(404).send();
    }
    //якщо є головна категорія видалити теперішню з її суб категорій
    const removeCategoryFromMainCategory = async () => {
      await Category.findByIdAndUpdate(
        category.mainCategory,
        { $pull: { subCategories: req.params.id } },
        //якщо є категорія для заміни видаленої то добавимо її
        { $set: { subCategories: mainCategory ? mainCategory : undefined } },
        { new: true, useFindAndModify: false }
      )
    }
    //якщо є субкатегорії, з кожної видалити теперішню як головну категорію або замінити теперішню
    //на нову категорію
    const removeCategoryFromSubCategories = async () => {
      for await (let id of category.subCategories) {
        await Category.findByIdAndUpdate(
          id,
          { $set: { mainCategory: mainCategory } },
          { new: true, useFindAndModify: false }
        )
        //в кожній субкатегорії змінити url
        const subCategory = await Category.findById(id);
        const subCategoryUrl = await createUrl(subCategory);
        subCategoryUrl.push(subCategory.slug);
        await Category.findByIdAndUpdate(
          id,
          { $set: { url: subCategoryUrl.join('/') } },
          { new: true, useFindAndModify: false }
        )
      }
    }

    //якщо в теперішній категорії є mainItems то замінити в items теперішню категорію на нову категорію
    const removeCategoryFromMainItems = async () => {
      for await (let id of category.mainItems) {
        await Item.findByIdAndUpdate(
          id,
          { $set: { mainCategory: mainCategory } },
          { new: true, useFindAndModify: false }
        )
        //змінити url кожному item в mainItems
        const item = await Item.findById(id);
        const itemUrl = await createUrl(mainCategory);
        itemUrl.push(itemUrl.slug);
        await Item.findByIdAndUpdate(
          id,
          { $set: { url: mainCategory ? subCategoryUrl.join('/') : '/' + item.slug } },
          { new: true, useFindAndModify: false }
        )
      }
    }


    //якщо в субкатегорії є mainItems то змінити кожному item url


    category.remove();
    res.send(category);


  } catch {
    res.status(400).send();
  }
});

module.exports = router;