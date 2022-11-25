const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Category = require('../../models/model.category');

router.post('/create/category', auth, async (req, res) => {
  try {
    if (req.admin) {
      const checkUri = await Category.findOne({ slug: req.body.slug });

      if (checkUri) {
        res.status(400).send({ err: `Slug ${req.body.slug} is available. Please choose another unique slug` });
      }

      //create new category
      const objCategory = {
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        html: req.body.html,
        metaTags: req.body.metaTags,
        mainCategory: req.body.mainCategory
      }
      if (req.body.mainCategory) {
        let categoryUrl = [];
        const mainCategory = await Category.findById(req.body.mainCategory);
        if (!mainCategory) {
          return res.status(400).send({ err: 'main category not found' });
        }
        let currentMainCategory = mainCategory;

        while (currentMainCategory.mainCategory) {
          categoryUrl.unshift(currentMainCategory.slug);
          currentMainCategory = await Category.findById(currentMainCategory.mainCategory);
        }
        categoryUrl.unshift('/' + currentMainCategory.slug);
        categoryUrl.push(req.body.slug);

        objCategory.url = categoryUrl.join('/');
        const category = new Category(objCategory);
        await category.save();

        await Category.findByIdAndUpdate(
          mainCategory._id,
          { $addToSet: { subCategories: category._id } },
          { new: true, useFindAndModify: false }
        );

        res.status(201).send(category);
      } else {
        objCategory.url = '/' + req.body.slug;
        const category = new Category(objCategory);
        await category.save();
        res.status(201).send(category);
      }

    }
    res.status(403).send();
  } catch (e) {
    res.status(400).send({ err: e });
  }
});

module.exports = router;