const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Category = require('../../models/model.category');
const Url = require('../../models/model.url');
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

    const mainCategory = await Category.findById(req.body.mainCategory);

    if (!mainCategory && req.body.mainCategory) {
      return res.status(400).send({ err: 'main category not found' });
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

    const objUrl = {};

    if (mainCategory) {
      const firstUrl = await Url.findById(mainCategory.url);
      const firstAndLastSlug = firstUrl.urlStructureArr[1] ? firstUrl.urlStructureArr[0] + '/' + mainCategory.slug : mainCategory.slug;
      const url = await Url.findOne({ firstAndLastSlug });
      const urlStructure = await createUrl(url, req.body.slug);

      objUrl.urlStructureArr = urlStructure[0];
      objUrl.urlStructureObj = urlStructure[1];
      objUrl.firstAndLastSlug = mainCategory.slug + '/' + req.body.slug;
      objUrl.url = urlStructure[0].join('/');

    } else {
      objUrl.urlStructureArr = [req.body.slug];
      objUrl.urlStructureObj = { [req.body.slug]: [req.body.slug, 0] };
      objUrl.firstAndLastSlug = req.body.slug;
      objUrl.url = req.body.slug;
    }
    const category = new Category(objCategory);
    const url = new Url(objUrl);
    await url.save();
    category.url = url;
    await category.save();
    if (mainCategory) {
      await Category.findByIdAndUpdate(
        mainCategory._id,
        { $addToSet: { subCategories: category._id } },
        { new: true, useFindAndModify: false }
      );
    }
    res.status(201).send(category);
  } catch (e) {
    return res.status(500).send({ err: 'Please check required fields', message: e });
  }
});

module.exports = router;