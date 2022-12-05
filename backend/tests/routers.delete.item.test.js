const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models/model.user');
const Category = require('../src/models/model.category');
const Item = require('../src/models/model.item');

test('Should admin delete item', async () => {
  const item = await Item.findOne({ slug: 'hp-model-work-1' })
  const admin = await User.findOne({ role: 'admin' });
  await request(app)
    .delete(`/delete/item/${item._id}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .expect(200);
  const checkItem = await Item.findById(item._id);
  expect(checkItem).toBeNull();
  for await (let id of item.parentCategories) {
    const category = await Category.findById(id);
    if (category.mainItems.find(id => id === item._id)) throw new Error;
    if (category.items.find(id => id === item._id)) throw new Error;
  }
});