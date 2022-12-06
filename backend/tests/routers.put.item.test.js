const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models/model.user');
const Category = require('../src/models/model.category');
const Item = require('../src/models/model.item');
const { setupDataBase } = require('./fixtures/db');

beforeAll(setupDataBase);

test('Should admin change main category in item', async () => {
  const admin = await User.findOne({ role: 'admin' });
  const mainCategory = await Category.findOne({ slug: 'notebooks' });
  let mainCategoryId = mainCategory._id.toString();
  let item = await Item.findOne({ slug: 'hp-model-work-2' });
  let itemId = item._id.toString();
  const response = await request(app)
    .put(`/update/item/${item._id}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send({ mainCategory: mainCategory._id })
    .expect(200);
  expect(response.body.url).toEqual('/computers/notebooks/hp-model-work-2');
  expect(response.body.mainCategory.toString()).toEqual(mainCategoryId);
  const itemAfter = await Item.findById(itemId);
  if (!itemAfter.parentCategories.find(id => id.toString() === mainCategoryId)) { throw new Error() }
  let prevMainCategory = await Category.findById(item.mainCategory);
  if (prevMainCategory.mainItems.find(id => id.toString() === itemId)) { throw new Error() };
  if (prevMainCategory.items.find(id => id.toString() === itemId)) { throw new Error() };
  const mainCategoryAfter = await Category.findById(mainCategoryId);
  if (!mainCategoryAfter.mainItems.find(id => id.toString() === itemId)) {
    throw new Error();
  }
  if (!mainCategoryAfter.items.find(id => id.toString() === itemId)) {
    throw new Error();
  }
});

test('Should admin add category to item', async () => {
  const admin = await User.findOne({ role: 'admin' });
  const category = await Category.findOne({ slug: 'for-learning' });
  const item = await Item.findOne({ slug: 'hp-model-work-2' });
  let mainCategoryId = item.mainCategory.toString();
  let categoryId = category._id.toString();
  let itemId = item._id.toString();
  const response = await request(app)
    .put(`/update/item/${itemId}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send({ addCategories: [categoryId] })
    .expect(200);
  expect(response.body.url).toEqual('/computers/notebooks/hp-model-work-2');
  expect(response.body.mainCategory.toString()).toEqual(mainCategoryId);
  const mainCategoryAfter = await Category.findById(mainCategoryId);
  const itemAfter = await Item.findById(itemId);
  const categoryAfter = await Category.findById(categoryId);
  if (!categoryAfter.items.find(id => id.toString() === itemId)) { throw new Error() };
  if (categoryAfter.mainItems.find(id => id.toString() === itemId)) { throw new Error() };
  if (!itemAfter.parentCategories.find(id => id.toString() === categoryId)) { throw new Error() };
  if (!mainCategoryAfter.mainItems.find(id => id.toString() === itemId)) {
    throw new Error();
  }
  if (!mainCategoryAfter.items.find(id => id.toString() === itemId)) {
    throw new Error();
  }
});

test('Should admin remove category from item', async () => {
  const admin = await User.findOne({ role: 'admin' });
  const category = await Category.findOne({ slug: 'for-learning' });
  const item = await Item.findOne({ slug: 'hp-model-work-2' });
  let mainCategoryId = item.mainCategory.toString();
  let categoryId = category._id.toString();
  let itemId = item._id.toString();
  const response = await request(app)
    .put(`/update/item/${itemId}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send({ removeCategories: [categoryId] })
    .expect(200);
  expect(response.body.url).toEqual('/computers/notebooks/hp-model-work-2');
  expect(response.body.mainCategory.toString()).toEqual(mainCategoryId);
  const mainCategoryAfter = await Category.findById(mainCategoryId);
  const itemAfter = await Item.findById(itemId);
  const categoryAfter = await Category.findById(categoryId);
  if (categoryAfter.items.find(id => id.toString() === itemId)) { throw new Error() };
  if (categoryAfter.mainItems.find(id => id.toString() === itemId)) { throw new Error() };
  if (itemAfter.parentCategories.find(id => id.toString() === categoryId)) { throw new Error() };
  if (!mainCategoryAfter.mainItems.find(id => id.toString() === itemId)) {
    throw new Error();
  }
  if (!mainCategoryAfter.items.find(id => id.toString() === itemId)) {
    throw new Error();
  }
});

test('Should admin add categories to item', async () => {
  const admin = await User.findOne({ role: 'admin' });
  const categories = [await Category.findOne({ slug: 'for-learning' }), await Category.findOne({ slug: 'for-work' })];
  const item = await Item.findOne({ slug: 'hp-model-work-2' });
  let mainCategoryId = item.mainCategory.toString();
  let itemId = item._id.toString();
  const response = await request(app)
    .put(`/update/item/${itemId}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send({ addCategories: [categories[0]._id, categories[1]._id] })
    .expect(200);
  expect(response.body.url).toEqual('/computers/notebooks/hp-model-work-2');
  expect(response.body.mainCategory.toString()).toEqual(mainCategoryId);
  const mainCategoryAfter = await Category.findById(mainCategoryId);
  const itemAfter = await Item.findById(itemId);
  for await (let category of categories) {
    const categoryAfter = await Category.findById(category._id);
    if (categoryAfter.mainItems.find(id => id.toString() === itemId)) { throw new Error() };
    if (!categoryAfter.items.find(id => id.toString() === itemId)) { throw new Error() };
  }
  if (itemAfter.parentCategories.filter(id => id.toString() === categories[0]._id.toString() || id.toString() === categories[1].id.toString()).length !== 2) {
    throw new Error();
  }
  if (!mainCategoryAfter.mainItems.find(id => id.toString() === itemId)) {
    throw new Error();
  }
  if (!mainCategoryAfter.items.find(id => id.toString() === itemId)) {
    throw new Error();
  }
});

test('Should admin remove categories from item', async () => {
  const admin = await User.findOne({ role: 'admin' });
  const categories = [await Category.findOne({ slug: 'for-learning' }), await Category.findOne({ slug: 'for-work' })];
  const item = await Item.findOne({ slug: 'hp-model-work-2' });
  let mainCategoryId = item.mainCategory.toString();
  let itemId = item._id.toString();
  const response = await request(app)
    .put(`/update/item/${itemId}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send({ removeCategories: [categories[0]._id, categories[1]._id] })
    .expect(200);
  expect(response.body.url).toEqual('/computers/notebooks/hp-model-work-2');
  expect(response.body.mainCategory.toString()).toEqual(mainCategoryId);
  const mainCategoryAfter = await Category.findById(mainCategoryId);
  const itemAfter = await Item.findById(itemId);
  for await (let category of categories) {
    const categoryAfter = await Category.findById(category._id);
    if (categoryAfter.mainItems.find(id => id.toString() === itemId)) { throw new Error() };
    if (categoryAfter.items.find(id => id.toString() === itemId)) { throw new Error() };
  }
  if (itemAfter.parentCategories.filter(id => id.toString() === categories[0]._id.toString() || id.toString() === categories[1].id.toString()).length) {
    throw new Error();
  }
  if (!mainCategoryAfter.mainItems.find(id => id.toString() === itemId)) {
    throw new Error();
  }
  if (!mainCategoryAfter.items.find(id => id.toString() === itemId)) {
    throw new Error();
  }
});