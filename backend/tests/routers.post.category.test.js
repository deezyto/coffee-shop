const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models/model.user');
const Category = require('../src/models/model.category');
const { setupDataBase } = require('./fixtures/db');

beforeAll(setupDataBase);

test('Should admin create parent category', async () => {
  const obj = {
    title: 'Laptop',
    slug: 'laptop'
  };
  const admin = await User.findOne({ role: 'admin' });
  const response = await request(app)
    .post('/create/category')
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send(obj)
    .expect(201);
  expect(response.body.url).toEqual('/laptop');
});

test('Should admin create sub category', async () => {
  const mainCategory = await Category.findOne({ slug: 'laptop' });
  const obj = {
    title: 'HP',
    slug: 'hp-laptop',
    mainCategory: mainCategory._id
  };
  const admin = await User.findOne({ role: 'admin' });
  const response = await request(app)
    .post('/create/category')
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send(obj)
    .expect(201);
  expect(response.body.url).toEqual('/laptop/hp-laptop');
});

test('Should if user not admin category dont created', async () => {
  const obj = {
    title: 'HP',
    slug: 'hp-laptop'
  };
  const user = await User.findOne({ role: 'customer' });
  const response = await request(app)
    .post('/create/category')
    .set('Authorization', `Bearer ${user.tokens[0].token}`)
    .send(obj)
    .expect(403);
  expect(response.body.url).toEqual(undefined);
});