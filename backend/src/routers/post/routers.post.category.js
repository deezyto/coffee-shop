const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Category = require('../../models/model.category');
const { createUrl } = require('../../utils/url');

router.post('/create/category', auth, async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(403).send();
    }

    if (req.body.slug) {
      req.body.slug = req.body.slug.toLowerCase();
    }

    const checkSlug = await Category.findOne({ slug: req.body.slug });

    if (checkSlug) {
      return res.status(400).send({ err: `Slug ${req.body.slug} is available. Please choose another unique slug` });
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
      const mainCategory = await Category.findById(req.body.mainCategory);
      if (!mainCategory) {
        return res.status(400).send({ err: 'main category not found' });
      }
      const urlStructure = await createUrl(mainCategory, req.body.slug);
      objCategory.urlStructureArr = urlStructure[0];
      objCategory.urlStructureObj = urlStructure[1];
      const category = new Category(objCategory);
      await category.save();

      await Category.findByIdAndUpdate(
        mainCategory._id,
        { $addToSet: { subCategories: category._id } },
        { new: true, useFindAndModify: false }
      );

      return res.status(201).send(category);
    } else {
      objCategory.urlStructureArr = [req.body.slug];
      objCategory.urlStructureObj = { [req.body.slug]: [req.body.slug, 0] };
      const category = new Category(objCategory);
      await category.save();
      return res.status(201).send(category);
    }
  } catch (e) {
    return res.status(500).send({ err: 'Please check required fields', message: e });
  }
});

module.exports = router;