const createUrl = async (mainCategory, slug = null) => {
  let itemUrlArr = mainCategory.urlStructureArr;
  let itemUrlObj = mainCategory.urlStructureObj;

  if (slug) {
    slug = slug.toLowerCase();
    itemUrlArr.push(slug);
    itemUrlObj[slug] = [slug, itemUrlArr.length - 1];
  }
  return [itemUrlArr, itemUrlObj];
};

module.exports = { createUrl };