const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Category = require('../../models/model.category');

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

    if (req.body.addSubCategories) {
      if (!Array.isArray(req.body.addSubCategories)) {
        return res.status(400).send({ err: 'Parent category must be a array type' });
      }
      for await (let id of req.body.addSubCategories) {
        const category = await Category.findById(id);
        if (!category) {
          return res.status(400).send({ err: `Sub category ${id} not fount` });
        }
      }
      //req.body.addSubCategories.push(mainCategory._id);
    }

    /* if (!req.body.addSubCategories) {
      req.body.addSubCategories = [mainCategory._id];
    } */

    if (req.body.slug) {
      const checkSlug = await Item.findOne({ slug: req.body.slug });
      if (checkSlug && category.slug !== checkSlug.slug) {
        return res.status(400).send({ err: `Slug ${req.body.slug} is available. Please choise another.` })
      }
    }

    //remove sub categories
    //1) remove subCategories from current main category
    //2) remove current main category from mainCategory field in subCategories
    //3) change url in subCategories (delete slug previous mainCategory)
    //4) change url in items if subCategory = mainCategory in item

    //add sub categories
    //1) add subCategories to current main category
    //2) add current main category to mainCategory field in subCategories
    //3) change url in subCategories (add slug new mainCategory)

    //mainCategory
    //1) add mainCategory to current category
    //2) add current category to field subCategories in mainCategory
    //3) change url in current category (add slug new mainCategory)

    //remove sub categories
    //1) remove subCategories from current main category
    const removeSubCategoriesFromMainCategory = async () => {
      await Category.findByIdAndUpdate(
        req.params.id,
        { $pullAll: { subCategories: req.body.removeSubCategories } },
        { new: true, useFindAndModify: false }
      );
    }

    //2) remove current main category from mainCategory field in subCategories
    const removeMainCategoryFromSubCategories = async () => {
      req.body.removeSubCategories.forEach(async categoryId => {
        const category = await Category.findById(categoryId);
        await Category.findByIdAndUpdate(
          categoryId,
          {
            $set: {
              mainCategory: undefined,
              //3) change url in subCategories (delete slug previous mainCategory)
              url: '/' + category.slug
            }
          },
          { new: true, useFindAndModify: false }
        );
      });
    };

    //4) change url in items if subCategory = mainCategory in item
    const removeSlugSubCategoryFromItems = async () => {
      req.body.removeSubCategories.forEach(async categoryId => {
        const mainItems = await Category.findById(categoryId).mainItems;
        mainItems.forEach(async itemId => {
          let itemUrl = [];
          let currentMainCategory = mainCategory;

          while (currentMainCategory.mainCategory) {
            itemUrl.unshift(currentMainCategory.slug);
            currentMainCategory = await Category.findById(currentMainCategory.mainCategory);
          }

          itemUrl.unshift('/' + currentMainCategory.slug);
          itemUrl.push(req.body.slug);

          await Item.findByIdAndUpdate(
            itemId,
            {
              $set: {
                mainCategory: req.body.mainCategory ? req.body.mainCategory : undefined,
                //3) change url in subCategories (delete slug previous mainCategory)
                url: itemUrl.join('/')
              }
            },
            { new: true, useFindAndModify: false }
          );
        });
      });
    };

    //add sub categories
    //1) add subCategories to current main category
    const addSubCategoriesToMainCategory = async () => {
      await Category.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { subCategories: req.body.addSubCategories } },
        { new: true, useFindAndModify: false }
      );
    }

    //2) add current main category to mainCategory field in subCategories
    const addMainCategoryToSubCategories = async () => {
      req.body.addSubCategories.forEach(async categoryId => {
        const category = await Category.findById(categoryId);
        console.log(category.slug, url)
        await Category.findByIdAndUpdate(
          categoryId,
          {
            $set: {
              mainCategory: req.params.id
            }
          },
          { new: true, useFindAndModify: false }
        );
      });
    }

    if (req.body.removeSubCategories) {
      await removeSubCategoriesFromMainCategory();
      await removeMainCategoryFromSubCategories();
      await removeSlugSubCategoryFromItems();
    }

    if (req.body.addSubCategories) {
      await addSubCategoriesToMainCategory();
      await addMainCategoryToSubCategories();
    }

    if (req.body.mainCategory) {
      await addSubCategoriesToMainCategory();
      //await addMainCategoryToSubCategories();
      let categoryUrl = [];

      let currentMainCategory = mainCategory;

      while (currentMainCategory.mainCategory) {
        categoryUrl.unshift(currentMainCategory.slug);
        currentMainCategory = await Category.findById(currentMainCategory.mainCategory);
      }

      categoryUrl.unshift('/' + currentMainCategory.slug);
      categoryUrl.push(req.body.slug ? req.body.slug : category.slug);
      category.url = categoryUrl.join('/');
      console.log(categoryUrl)
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