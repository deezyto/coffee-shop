const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const auth = require('../../middleware/middleware.auth');
const Category = require('../../models/model.category');
const Url = require('../../models/model.url');
const { createUrl } = require('../../utils/url');

router.post('/*/category', auth, async (req, res) => {
  try {
    console.log(req.params[0])
    if (!req.admin) {
      return res.status(403).send();
    }

    const parentCategory = req.params[0].split('/').filter(item => item.length);

    const mainCategory = await Category.findOne({ slug: parentCategory[parentCategory.length - 1] });

    req.body.slug = req.body.slug.toLowerCase();

    const checkSlug = await Category.find({ slug: req.body.slug });
    for await (let category of checkSlug) {
      if (category && !category.mainCategory || category && category.mainCategory.toString() === mainCategory._id.toString()) {
        return res.status(400).send({ err: `Slug ${req.body.slug} is available. Please choose another unique slug` });
      }
    }
    //якщо є категорія з таким самим самим слагом але його
    //parent категорія не така як прийшла з url, то тоді дозволяєм створити таку категорію

    if (!mainCategory && parentCategory.length) {
      return res.status(400).send({ err: 'main category not found' });
    }
    const categoryId = new mongoose.Types.ObjectId();

    const objCategory = {
      _id: categoryId,
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      html: req.body.html,
      metaTags: req.body.metaTags
    }

    const objUrl = {
      parent: categoryId
    };

    if (mainCategory) {
      objCategory.mainCategory = mainCategory._id;
      const firstUrl = await Url.findById(mainCategory.url);
      const firstAndLastSlug = firstUrl.urlStructureArr[1] ? firstUrl.urlStructureArr[0] + '/' + req.body.slug : req.body.slug;
      const urlStructure = await createUrl(firstUrl, req.body.slug);

      objUrl.urlStructureArr = urlStructure[0];
      objUrl.urlStructureObj = urlStructure[1];
      objUrl.firstAndLastSlug = firstAndLastSlug;
      objUrl.url = urlStructure[0].join('/');

    } else {
      objUrl.urlStructureArr = [req.body.slug];
      objUrl.urlStructureObj = { [req.body.slug]: [req.body.slug, 0] };
      objUrl.firstAndLastSlug = req.body.slug;
      objUrl.url = req.body.slug;
    }
    const url = new Url(objUrl);
    await url.save();
    const category = new Category(objCategory);
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