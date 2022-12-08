const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models/model.user');
const Category = require('../src/models/model.category');
const Item = require('../src/models/model.item');
const { setupDataBase } = require('./fixtures/db');

afterEach(setupDataBase);

test('Should admin delete category', async () => {
  const category = await Category.findOne({ slug: 'notebooks' })
  const admin = await User.findOne({ role: 'admin' });
  await request(app)
    .delete(`/delete/category/${category._id}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .expect(200);
  const checkCategory = await Category.findById(category._id);
  expect(checkCategory).toBeNull();
  for await (let itemId of category.mainItems) {
    const item = await Item.findById(itemId);
    expect(item.mainCategory).toBeNull();
    expect(item.url).toEqual(`/${item.slug}`);
  }
  for await (let categoryId of category.subCategories) {
    const category = await Category.findById(categoryId);
    expect(category.mainCategory).toBeNull();
    for await (let itemId of category.mainItems) {
      const item = await Item.findById(itemId);
      expect(item.url).toEqual(`/${category.slug}/${item.slug}`);
    }
  }
});

test('Should admin delete category and replace deleted category', async () => {
  const category = await Category.findOne({ slug: 'notebooks' })
  const replace = await Category.findOne({ slug: 'computers' });
  const admin = await User.findOne({ role: 'admin' });
  await request(app)
    .delete(`/delete/category/${category._id}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send({ mainCategory: replace._id })
    .expect(200);
  const checkCategory = await Category.findById(category._id);
  expect(checkCategory).toBeNull();
  const replaceAfter = await Category.findById(replace._id);

  const subCategoriesDeletedCategory = category.mainItems;
  const subCategoriesReplaceCategory = replaceAfter.mainItems;
  const checkIncludesSubCategoriesDeletedCategory = subCategoriesDeletedCategory.every(elem => subCategoriesReplaceCategory.includes(elem));
  if (!checkIncludesSubCategoriesDeletedCategory) {
    throw new Error();
  }

  const itemsDeletedCategory = category.mainItems;
  const itemsReplaceCategory = replaceAfter.mainItems;
  const checkIncludesItemsDeletedCategory = itemsDeletedCategory.every(elem => itemsReplaceCategory.includes(elem));
  if (!checkIncludesItemsDeletedCategory) {
    throw new Error();
  }
  for await (let itemId of category.mainItems) {
    const item = await Item.findById(itemId);
    expect(item.mainCategory.toString()).toEqual(replace._id.toString());
    expect(item.url).toEqual(`/${replace.slug}/${item.slug}`);
  }
  for await (let subCategoryId of category.subCategories) {
    const subCategory = await Category.findById(subCategoryId);
    expect(subCategory.mainCategory.toString()).toEqual(replace._id.toString());
    expect(subCategory.url).toEqual(`/${replace.slug}/${subCategory.slug}`);
    for await (let itemId of subCategory.mainItems) {
      const item = await Item.findById(itemId);
      expect(item.url).toEqual(`/${replace.slug}/${subCategory.slug}/${item.slug}`);
    }
  }
});