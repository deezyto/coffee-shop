const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models/model.user');
const Category = require('../src/models/model.category');
const { setupDataBase } = require('./fixtures/db');

beforeAll(setupDataBase);

test('Should admin create parent category', async () => {
  const obj = {
    title: 'Computers',
    slug: 'computers'
  };
  const admin = await User.findOne({ role: 'admin' });
  const response = await request(app)
    .post('/create/category')
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send(obj)
    .expect(201);
  expect(response.body.url).toEqual('/computers');
});

test('Should admin create sub category', async () => {
  const mainCategory = await Category.findOne({ slug: 'computers' });
  const obj = {
    title: 'Notebooks',
    slug: 'notebooks',
    mainCategory: mainCategory._id
  };
  const admin = await User.findOne({ role: 'admin' });
  const response = await request(app)
    .post('/create/category')
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send(obj)
    .expect(201);
  expect(response.body.url).toEqual('/computers/notebooks');
});

test('Should admin create sub category', async () => {
  const mainCategory = await Category.findOne({ slug: 'notebooks' });
  const obj = {
    title: 'Notebooks for learning',
    slug: 'for-learning',
    mainCategory: mainCategory._id
  };
  const admin = await User.findOne({ role: 'admin' });
  const response = await request(app)
    .post('/create/category')
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send(obj)
    .expect(201);
  expect(response.body.url).toEqual('/computers/notebooks/for-learning');
});