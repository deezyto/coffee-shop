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
      return res.status(400).send({ err: 'Main category not found' });
    }

    if (!category) {
      return res.status(404).send();
    }
    //якщо є головна категорія видалити теперішню з її суб категорій
    const removeCategoryFromMainCategory = async () => {
      await Category.findByIdAndUpdate(
        category.mainCategory,
        { $pull: { subCategories: req.params.id } },
        { new: true, useFindAndModify: false }
      )
      //якщо є категорія для заміни видаленої то добавимо її
      await Category.findByIdAndUpdate(
        category.mainCategory,
        { $set: { subCategories: mainCategory ? mainCategory : undefined } },
        { new: true, useFindAndModify: false }
      )
    }
    //якщо є субкатегорії, з кожної видалити теперішню як головну категорію або замінити теперішню
    //на нову категорію
    const removeCategoryFromSubCategories = async () => {
      for await (let categoryId of category.subCategories) {
        await Category.findByIdAndUpdate(
          categoryId,
          { $set: { mainCategory: mainCategory } },
          { new: true, useFindAndModify: false }
        )
        //в кожній субкатегорії змінити url
        const subCategory = await Category.findById(categoryId);
        const subCategoryUrl = await createUrl(subCategory);
        await Category.findByIdAndUpdate(
          categoryId,
          { $set: { url: subCategoryUrl.join('/') } },
          { new: true, useFindAndModify: false }
        )
        //якщо в субкатегорії є mainItems то змінити кожному item url
        for await (let itemId of subCategory.mainItems) {
          const item = await Item.findById(itemId);
          const itemUrl = await createUrl(subCategory);
          itemUrl.push(item.slug);
          await Item.findByIdAndUpdate(
            itemId,
            { $set: { url: itemUrl.join('/') } },
            { new: true, useFindAndModify: false }
          )
        }
      }
    }

    //якщо в теперішній категорії є mainItems то замінити в кожному item теперішню категорію на нову категорію
    const removeCategoryFromMainItems = async () => {
      for await (let id of category.mainItems) {
        await Item.findByIdAndUpdate(
          id,
          { $set: { mainCategory: mainCategory } },
          { new: true, useFindAndModify: false }
        )
        //змінити url кожному item в mainItems
        const item = await Item.findById(id);
        if (mainCategory) {
          const itemUrl = await createUrl(mainCategory);
          itemUrl.push(item.slug);
          await Item.findByIdAndUpdate(
            id,
            { $set: { url: itemUrl.join('/') } },
            { new: true, useFindAndModify: false }
          )
        } else {
          await Item.findByIdAndUpdate(
            id,
            { $set: { url: '/' + item.slug } },
            { new: true, useFindAndModify: false }
          )
        }

      }
    }

    const addMainItemsDeletedCategoryToReplaceCategory = async () => {
      await Category.findByIdAndUpdate(
        mainCategory._id,
        { $addToSet: { mainItems: category.mainItems, items: category.items } },
        { new: true, useFindAndModify: false }
      )
    }

    const addSubCategoriesDeletedCategoryToReplaceCategory = async () => {
      await Category.findByIdAndUpdate(
        mainCategory._id,
        { $addToSet: { subCategories: category.subCategories } },
        { new: true, useFindAndModify: false }
      )
    }

    await removeCategoryFromMainCategory();
    await removeCategoryFromSubCategories();
    await removeCategoryFromMainItems();

    if (mainCategory) {
      await addMainItemsDeletedCategoryToReplaceCategory();
      await addSubCategoriesDeletedCategoryToReplaceCategory();
    }

    category.remove();
    return res.send(category);

  } catch {
    return res.status(500).send();
  }
});

module.exports = router;