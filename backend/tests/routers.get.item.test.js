const request = require('supertest');
const app = require('../src/app');

test('Should get category', async () => {
  await request(app)
    .get('/computers')
    .expect(200);
});

test('Should get sub category', async () => {
  await request(app)
    .get('/computers/notebooks')
    .expect(200);
});

test('Should get items from category', async () => {
  await request(app)
    .get('/computers/notebooks/hp-model-1')
    .expect(200);
});

test('Should dont get sub category if not correct url', async () => {
  await request(app)
    .get('/notebooks/computers')
    .expect(404);
});

test('Should dont get items from category if not correct url', async () => {
  await request(app)
    .get('/computers/hp-model-1')
    .expect(404);
});