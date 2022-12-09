const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Category = require('../../models/model.category');
const Item = require('../../models/model.item');
const { createUrl } = require('../../utils/url');

router.put('/update/category/:id', auth, async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(403).send();
    }
    const category = await Category.findById(req.params.id);
    const updates = Object.keys(req.body);
    const allowedFields = ['title', 'description', 'slug', 'metaTags', 'html', 'mainCategory', 'addSubCategories', 'removeSubCategories'];
    const isValidUpdates = updates.every(elem => allowedFields.includes(elem));

    if (!isValidUpdates) {
      return res.status(400).send({ err: 'This updates not allowed' });
    }

    const mainCategory = await Category.findById(req.body.mainCategory);
    if (!mainCategory && req.body.mainCategory) {
      return res.status(400).send({ err: 'category not found' });
    }

    if (mainCategory && mainCategory._id.toString() === category._id.toString()) {
      return res.status(400).send({ err: 'Main Category not must be a current category' })
    }

    if (req.body.addSubCategories) {
      if (!Array.isArray(req.body.addSubCategories)) {
        return res.status(400).send({ err: 'Parent category must be a array type' });
      }
      for await (let id of req.body.addSubCategories) {
        const subCategory = await Category.findById(id);
        if (id === category._id.toString() || category.mainCategory && id === category.mainCategory.toString() || id === req.body.mainCategory) {
          return res.status(400).send({ err: 'Sub category not must be a main Category or current category' });
        }
        if (!subCategory) {
          return res.status(400).send({ err: `Sub category ${id} not fount` });
        }
      }
    }

    if (req.body.slug) {
      req.body.slug = req.body.slug.toLowerCase();
      const checkSlug = await Item.findOne({ slug: req.body.slug });
      if (checkSlug && category.slug !== checkSlug.slug) {
        return res.status(400).send({ err: `Slug ${req.body.slug} is available. Please choise another.` })
      }
    }

    //щоб видалити субкатегорію потрібно
    //з теперішньої категорії видалити зі списка субкатегорій субкатегорію для видалення
    //із субкатегорії для видалення із поля головна категорія видалити теперішню категорію
    //із items для яких субкатегорія була головною потрібно перезаписати url
    //для субкатегорію потрібно перезаписати url

    //з теперішньої категорії видалити зі списка субкатегорій субкатегорію для видалення
    const removeSubCategoriesFromMainCategory = async () => {
      await Category.findByIdAndUpdate(
        req.params.id,
        { $pullAll: { subCategories: req.body.removeSubCategories } },
        { new: true, useFindAndModify: false }
      );
    }
    //із субкатегорії для видалення із поля головна категорія видалити теперішню категорію
    const removeMainCategoryFromSubCategories = async () => {
      for await (let categoryId of req.body.removeSubCategories) {
        //const subCategory = await Category.findById(categoryId);
        await Category.findByIdAndUpdate(
          categoryId,
          {
            $set: {
              mainCategory: null,
            }
          },
          { new: true, useFindAndModify: false }
        );
      }
    };

    //4) change url in items if subCategory = mainCategory in item
    const removeSlugMainCategoryFromItems = async () => {
      for await (let categoryId of req.body.removeSubCategories) {
        const subCategory = await Category.findById(categoryId);
        for await (let itemId of subCategory.mainItems) {
          const item = await Item.findById(itemId);
          const itemUrl = await createUrl(subCategory);
          itemUrl.push(item.slug);
          await Item.findByIdAndUpdate(
            itemId,
            {
              $set: {
                url: itemUrl.join('/')
              }
            },
            { new: true, useFindAndModify: false }
          );
        }
      }
    };

    //1) add subCategories to current category
    //2) add current main category to mainCategory field in subCategories
    //3) change url in subCategories (add slug new mainCategory)

    //add sub categories
    //1) add subCategories to current category
    const addSubCategoriesToMainCategory = async () => {
      await Category.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { subCategories: req.body.addSubCategories } },
        { new: true, useFindAndModify: false }
      );
    }

    const removeSubCategoryFromPrevMainCategory = async () => {
      for await (let category of req.body.addSubCategories) {
        const subCategory = await Category.findById(category);
        await Category.findByIdAndUpdate(
          subCategory.mainCategory,
          { $pull: { subCategories: subCategory._id } },
          { new: true, useFindAndModify: false }
        );
      }
    }

    //2) add current category to mainCategory field in subCategories
    const addMainCategoryToSubCategories = async () => {
      for await (let categoryId of req.body.addSubCategories) {
        await Category.findByIdAndUpdate(
          categoryId,
          {
            $set: {
              mainCategory: req.params.id
            }
          },
          { new: true, useFindAndModify: false }
        );
        const subCategory = await Category.findById(categoryId);
        const categoryUrl = await createUrl(category);
        categoryUrl.push(subCategory.slug);
        await Category.findByIdAndUpdate(
          categoryId,
          {
            $set: {
              url: categoryUrl.join('/')
            }
          },
          { new: true, useFindAndModify: false }
        );
      }
    }

    const changeUrlInMainItemsForAddSubCategories = async () => {
      for await (let categoryId of req.body.addSubCategories) {
        const subCategory = await Category.findById(categoryId);
        for await (let itemId of subCategory.mainItems) {
          const item = await Item.findById(itemId);
          const itemUrl = await createUrl(subCategory);
          itemUrl.push(item.slug);
          await Item.findByIdAndUpdate(
            itemId,
            {
              $set: {
                url: itemUrl.join('/')
              }
            },
            { new: true, useFindAndModify: false }
          );
        }
      }
    }

    const removeCurrentCategoryFromPreviosMainCategory = async () => {
      await Category.findByIdAndUpdate(
        category.mainCategory,
        { $pull: { subCategories: category._id } },
        { new: true, useFindAndModify: false }
      );
    }

    const addCurrentCategoryToMainCategory = async () => {
      await Category.findByIdAndUpdate(
        req.body.mainCategory,
        { $addToSet: { subCategories: category._id } },
        { new: true, useFindAndModify: false }
      );
    }

    //потрібно із категорій отримати список всіх категорій де в обєкті
    //urlStructureObj є ключ який відповідає slug теперішньої категорії
    //також із item потрібно отримати список всіх item які мають
    //обєкті urlStructureObj ключ який відповідає slug теперішньої категорії
    //при зміні в теперішній категорії mainCategory
    //потрібно перезаписати масив і обєкт у всіх субкатегоріях теперішньої категорії
    //і всіх mainItems на новий
    //якщо міняється slug категорії то знаходимо всі категорії і items в яких в обєкті
    //є відповідний slug, знаходимо urlStructureArr по індексу з обєкта цей слаг
    //змінюєм його на новий, далі видаляємо його з обєкта і записуєм в обєкт новий
    const changeUrlInMainItemsCurrentCategory = async () => {
      for await (let itemId of category.mainItems) {
        const itemUrl = await createUrl(category);
        const item = await Item.findById(itemId);
        itemUrl.push(item.slug);
        await Item.findByIdAndUpdate(
          itemId,
          {
            $set: {
              url: itemUrl.join('/')
            }
          },
          { new: true, useFindAndModify: false }
        );
      }
    }

    const changeUrlInMainItemsInSubCategoriesFromCurrentCategory = async () => {
      for await (let categoryId of category.subCategories) {
        const subCategory = await Category.findById(categoryId);
        const categoryUrl = await createUrl(category);
        categoryUrl.push(subCategory.slug);
        await Category.findByIdAndUpdate(
          categoryId,
          {
            $set: {
              url: categoryUrl.join('/')
            }
          },
          { new: true, useFindAndModify: false }
        );
        for await (let itemId of subCategory.mainItems) {
          const itemUrl = await createUrl(subCategory);
          const item = await Item.findById(itemId);
          itemUrl.push(item.slug);
          await Item.findByIdAndUpdate(
            itemId,
            {
              $set: {
                url: itemUrl.join('/')
              }
            },
            { new: true, useFindAndModify: false }
          );
        }
      }
    }

    if (req.body.removeSubCategories) {
      await removeSubCategoriesFromMainCategory();
      await removeMainCategoryFromSubCategories();
      await removeSlugMainCategoryFromItems();
    }

    if (req.body.addSubCategories) {
      await removeSubCategoryFromPrevMainCategory();
      await addSubCategoriesToMainCategory();
      await addMainCategoryToSubCategories();
      await changeUrlInMainItemsForAddSubCategories();
    }

    if (req.body.mainCategory) {
      //потрібно з поля суб категорій попередньої головної категорії видалити теперішню
      await removeCurrentCategoryFromPreviosMainCategory();
      //потрібно в поле головної категорії в теперішній записати нову головну категорію
      category.mainCategory = req.body.mainCategory;
      await category.save();
      //а в поле суб категорії в головній категорії записати id теперішньої категорії
      await addCurrentCategoryToMainCategory();
      //також в url items які належили до теперішньої категорії
      //потрібно замінити slug попередньої головної категорії на нові
      await changeUrlInMainItemsCurrentCategory();
      //також в url items які належили до субкатегорій теперішньої категорії
      //потрібно замінити slug попередньої головної категорії в теперішній
      await changeUrlInMainItemsInSubCategoriesFromCurrentCategory();
      //також потрібно змінити url теперішньої категорії замінивши slug попередньої
      //головної категорії на slug нової головної категорії
      const categoryUrl = await createUrl(mainCategory);
      categoryUrl.push(req.body.slug ? req.body.slug : category.slug);
      category.url = categoryUrl.join('/');
    }
    if (req.body.mainCategory === null) {
      //видалити теперішню категорію
      console.log('main')
    }

    if (req.body.slug) {
      const changeUrl = category.url.split('/');
      changeUrl[changeUrl.length - 1] = req.body.slug;
      category.url = changeUrl.join('/');
      //потрібно змінити url всі mainItems які належили до теперішньої категорії
      //потрібно змінити url всім субкатегоріям які належили до теперішньої категорії
      //або просто знайти в колекції категорій всі url де є попередній слаг
      //і змінити на новий
      //так само і в items
    }

    delete req.body.removeSubCategories;
    delete req.body.addSubCategories;

    updates.forEach(field => {
      category[field] = req.body[field];
    })

    await category.save();
    return res.send(category);

  } catch (e) {
    return res.status(500).send({ err: e });
  }
});

module.exports = router;