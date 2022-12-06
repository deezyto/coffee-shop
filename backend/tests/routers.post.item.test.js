const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models/model.user');
const Category = require('../src/models/model.category');
const { setupDataBase } = require('./fixtures/db');

beforeAll(setupDataBase);

test('Should admin create item', async () => {
  const mainCategory = await Category.findOne({ slug: 'notebooks' });
  const parentCategories = [await Category.findOne({ slug: 'for-learning' }), await Category.findOne({ slug: 'for-work' })];
  const obj = {
    title: 'Hp model cool',
    slug: 'model-cool',
    mainCategory: mainCategory._id,
    parentCategories: [parentCategories[0]._id, parentCategories[1]._id]
  };

  const admin = await User.findOne({ role: 'admin' });
  const response = await request(app)
    .post('/create/item')
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send(obj)
    .expect(201);
  expect(response.body.url).toEqual('/computers/notebooks/model-cool');
  const mainCategoryAfter = await Category.findById(mainCategory._id);
  parentCategories.push(mainCategory);
  if (!mainCategoryAfter.mainItems.find(item => item.toString() === response.body._id.toString())) { throw new Error() };
  for await (let category of parentCategories) {
    const parentCategory = await Category.findById(category._id);
    if (parentCategory.mainItems.find(item => item.toString() === response.body._id.toString() && category._id.toString() !== mainCategory._id.toString())) { throw new Error() };
    if (!parentCategory.items.find(item => item.toString() === response.body._id.toString())) { throw new Error() };
  }
});