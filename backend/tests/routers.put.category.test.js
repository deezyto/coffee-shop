const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models/model.user');
const Category = require('../src/models/model.category');

test('Should admin change parent category', async () => {
  const admin = await User.findOne({ role: 'admin' });
  const mainCategory = await Category.findOne({ slug: 'computers' });
  const category = await Category.findOne({ slug: 'for-learning' });
  const response = await request(app)
    .put(`/update/category/${category._id}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send({ mainCategory: mainCategory._id })
    .expect(200);
  expect(response.body.url).toEqual('/computers/for-learning');
});

test('Should admin remove sub category from category', async () => {
  const admin = await User.findOne({ role: 'admin' });
  const removeCategory = await Category.findOne({ slug: 'for-learning' });
  const category = await Category.findOne({ slug: 'computers' });
  const changedCategory = await Category.findOne({ slug: 'for-learning' });
  const response = await request(app)
    .put(`/update/category/${category._id}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send({ removeSubCategories: [removeCategory._id] })
    .expect(200);
  expect(changedCategory.url).toEqual('/for-learning');
});