const Category = require('../models/model.category');
const Item = require('../models/model.item');
const Url = require('../models/model.url');
const { deleteSlash } = require('../utils/helpers');

const checkUrl = async (req, res, next) => {
  try {
    const lookupCategory = async (url) => {
      const findUrl = await Url.findOne({ url });
      if (!findUrl) {
        return res.status(404).send();
      }
      const findCategory = await Category.findById(findUrl.parent);
      if (!findCategory) {
        return res.status(404).send();
      }
      return findCategory;
    }
    const url = req.params[0];
    const urlWithoutLastSlash = deleteSlash(url, 'last');
    const urlWithoutFirstAndLastSlash = deleteSlash(urlWithoutLastSlash);

    const slugs = url.split('/').filter(slug => slug.length);
    const item = await Item.findOne({ slug: slugs[slugs.length - 1] });
    if (item) {
      let filterSlugs = [...slugs];
      filterSlugs.pop();
      filterSlugs = filterSlugs.join('/');
      const category = await lookupCategory(filterSlugs);
      if (item.mainCategory.toString() !== category._id.toString()) {
        return res.status(404).send();
      }
      if (url[url.length - 1] === '/') {
        return res.redirect(301, urlWithoutLastSlash);
      }
      req.item = item;
      req.category = category;
    } else {
      const category = await lookupCategory(urlWithoutFirstAndLastSlash);
      if (url[url.length - 1] !== '/') {
        return res.redirect(301, url + '/');
      }
      req.category = category;
    }
    next();
  } catch (e) {
    return res.status(500).send();
  }
}

module.exports = checkUrl;