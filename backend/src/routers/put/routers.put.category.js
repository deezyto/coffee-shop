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
        if (id === category._id.toString() || id === category.mainCategory.toString() || id === req.body.mainCategory) {
          return res.status(400).send({ err: 'Sub category not must be a main Category or current category' });
        }
        if (!subCategory) {
          return res.status(400).send({ err: `Sub category ${id} not fount` });
        }
      }
    }

    if (req.body.slug) {
      const checkSlug = await Item.findOne({ slug: req.body.slug });
      if (checkSlug && category.slug !== checkSlug.slug) {
        return res.status(400).send({ err: `Slug ${req.body.slug} is available. Please choise another.` })
      }
    }

    //1) remove subCategories from current category
    const removeSubCategoriesFromMainCategory = async () => {
      await Category.findByIdAndUpdate(
        req.params.id,
        { $pullAll: { subCategories: req.body.removeSubCategories } },
        { new: true, useFindAndModify: false }
      );
    }

    //2) remove current category from field mainCategory in subCategories
    const removeMainCategoryFromSubCategories = async () => {
      req.body.removeSubCategories.forEach(async categoryId => {
        const subCategory = await Category.findById(categoryId);
        await Category.findByIdAndUpdate(
          categoryId,
          {
            $set: {
              mainCategory: undefined,
              //3) change url in subCategories (delete slug current category (mainCategory))
              url: subCategory.url.split('/').filter(slug => slug !== category.slug).join('/')
            }
          },
          { new: true, useFindAndModify: false }
        );
      });
    };
    console.log(req.body.subCategories)
    //4) change url in items if subCategory = mainCategory in item
    const removeSlugSubCategoryFromItems = async () => {
      req.body.removeSubCategories.forEach(async categoryId => {
        const mainItems = await Category.findById(categoryId).mainItems;
        mainItems.forEach(async itemId => {
          const item = await Item.findById(itemId);
          const itemUrl = item.url;
          itemUrl = itemUrl.split('/');
          itemUrl.pop();
          itemUrl.pop();
          itemUrl.push(item.slug);
          itemUrl = itemUrl.join('/');
          await Item.findByIdAndUpdate(
            itemId,
            {
              $set: {
                mainCategory: req.body.mainCategory ? req.body.mainCategory : undefined,
                //3) change url in subCategories (delete slug previous mainCategory)
                url: itemUrl
              }
            },
            { new: true, useFindAndModify: false }
          );
        });
      });
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

    //2) add current category to mainCategory field in subCategories
    const addMainCategoryToSubCategories = async () => {
      req.body.addSubCategories.forEach(async categoryId => {
        const subCategory = await Category.findById(categoryId);
        const categoryUrl = await createUrl(category);
        categoryUrl.push(subCategory.slug);
        await Category.findByIdAndUpdate(
          categoryId,
          {
            $set: {
              mainCategory: req.params.id,
              //change url in subCategories (add slug new mainCategory)
              url: categoryUrl.join('/')
            }
          },
          { new: true, useFindAndModify: false }
        );
      });
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

    const changeUrlInMainItemsCurrentCategory = () => {
      category.mainItems.forEach(async itemId => {
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
      });
    }

    if (req.body.removeSubCategories) {
      //await removeSubCategoriesFromMainCategory();
      //await removeMainCategoryFromSubCategories();
      //await removeSlugSubCategoryFromItems();
    }

    if (req.body.addSubCategories) {
      await addSubCategoriesToMainCategory();
      await addMainCategoryToSubCategories();
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
      changeUrlInMainItemsCurrentCategory();
      //також потрібно змінити url теперішньої категорії замінивши slug попередньої
      //головної категорії на slug нової головної категорії
      const categoryUrl = await createUrl(mainCategory);
      categoryUrl.push(req.body.slug ? req.body.slug : category.slug);
      category.url = categoryUrl.join('/');
    }

    if (req.body.slug) {
      const changeUrl = category.url.split('/');
      changeUrl[changeUrl.length - 1] = req.body.slug;
      category.url = changeUrl.join('/');
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