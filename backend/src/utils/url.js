const Category = require('../models/model.category');

const createUrl = async (mainCategory) => {
  let itemUrl = [];
  let currentMainCategory = mainCategory;

  while (currentMainCategory.mainCategory) {
    itemUrl.unshift(currentMainCategory.slug);
    currentMainCategory = await Category.findById(currentMainCategory.mainCategory);
  }

  itemUrl.unshift('/' + currentMainCategory.slug);
  return itemUrl;
};

module.exports = { createUrl };