const Category = require('../models/model.category');
const Item = require('../models/model.item');

const category = async (req, res, next) => {
  try {
    const arraysSubCategoriesSlug = req.params['0'].split('/').filter(item => item.length !== 0);
    const countSlugs = arraysSubCategoriesSlug.length - 1;
    const category = await Category.findOne({ slug: arraysSubCategoriesSlug[0] });
    if (!category || category.mainCategory) {
      return res.status(404).send();
    }
    let i = 0;

    for await (let slug of arraysSubCategoriesSlug) {
      if (i > 0) {
        //find category on slug
        let subCategory = await Category.findOne({ slug });
        //if slug not found in category, check slug in item
        if (!subCategory && i === countSlugs) {
          subCategory = await Item.findOne({ slug });
        }

        if (!subCategory) {
          return res.status(404).send();
        }
        const prevCategory = await Category.findOne({ slug: arraysSubCategoriesSlug[i - 1] });
        if (subCategory.mainCategory.toString() !== prevCategory._id.toString()) {
          return res.status(404).send();
        }
      }
      i++;
    }

    req.category = await Category.findOne({ slug: arraysSubCategoriesSlug[countSlugs] });;
    req.item = await Item.findOne({ slug: arraysSubCategoriesSlug[countSlugs] });;
    next();
  } catch (e) {
    res.status(404).send();
  }
}

module.exports = category;