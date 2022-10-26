const Category = require('../models/model.category');

const category = async (req, res, next) => {
  try {
    const arraysSubCategoriesSlug = req.params['0'].split('/').filter(item => item.length !== 0);
    const category = await Category.findOne({slug: arraysSubCategoriesSlug[0]});
    if (!category || category.parentCategories.length) {
      res.status(404).send();
    }

    await (async function() {
      let i = 0;
      for await (let slug of arraysSubCategoriesSlug) {
        if (i > 0) {
          const subCategories = await Category.findOne({slug});
          if (!subCategories) {
            return res.status(404).send();
          }
          const prevCategory = await Category.findOne({slug: arraysSubCategoriesSlug[i - 1]});
          if (!subCategories.parentCategories.find(item => item.toString() === prevCategory._id.toString())) {
            return res.status(404).send();
          }
        }
        i++;
      }
    })();

    req.category = category;
    next();
  } catch (e) {
    res.status(401).send('Please authenticate');
  }
}

module.exports = category;