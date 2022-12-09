const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models/model.user');
const Category = require('../src/models/model.category');
const Item = require('../src/models/model.item');
const { setupDataBase } = require('./fixtures/db');

beforeAll(setupDataBase);

test('Should admin change main category', async () => {
  const admin = await User.findOne({ role: 'admin' });
  const mainCategory = await Category.findOne({ slug: 'computers' });
  const category = await Category.findOne({ slug: 'for-learning' });
  const response = await request(app)
    .put(`/update/category/${category._id}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send({ mainCategory: mainCategory._id })
    .expect(200);
  expect(response.body.url).toEqual('/computers/for-learning');
  expect(response.body.mainCategory.toString()).toEqual(mainCategory._id.toString());
  const mainCategoryAfter = await Category.findById(mainCategory._id);
  if (!mainCategoryAfter.subCategories.find(item => item.toString() === category._id.toString())) {
    throw new Error();
  }
  const items = await Item.find({ mainCategory: category._id });
  if (!items.length) throw new Error();
  for (let item of items) {
    expect(item.url).toEqual(`/computers/for-learning/${item.slug}`);
  }
});

test('Should admin remove sub category from category', async () => {
  const admin = await User.findOne({ role: 'admin' });
  const category = await Category.findOne({ slug: 'computers' });
  const subCategory = await Category.findOne({ slug: 'for-learning' });
  await request(app)
    .put(`/update/category/${category._id}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send({ removeSubCategories: [subCategory._id] })
    .expect(200);
  const removedSubCategory = await Category.findById(subCategory._id);
  expect(removedSubCategory.mainCategory).toBeNull();
  expect(removedSubCategory.url).toEqual('/for-learning');
  const categoryAfter = await Category.findById(category._id);
  if (categoryAfter.subCategories.find(item => item.toString() === removedSubCategory._id.toString())) {
    throw new Error();
  }
  const items = await Item.find({ mainCategory: removedSubCategory._id });
  if (!items.length) throw new Error();
  for (let item of items) {
    expect(item.url).toEqual(`/for-learning/${item.slug}`);
  }
});

test('Should admin add sub category to category', async () => {
  const admin = await User.findOne({ role: 'admin' });
  const category = await Category.findOne({ slug: 'computers' });
  const subCategory = await Category.findOne({ slug: 'for-learning' });
  await request(app)
    .put(`/update/category/${category._id}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send({ addSubCategories: [subCategory._id] })
    .expect(200);
  const addedSubCategory = await Category.findById(subCategory._id);
  expect(addedSubCategory.mainCategory.toString()).toEqual(category._id.toString());
  expect(addedSubCategory.url).toEqual('/computers/for-learning');
  const categoryAfter = await Category.findById(category._id);
  if (!categoryAfter.subCategories.find(item => item.toString() === subCategory._id.toString())) {
    throw new Error();
  }
  const items = await Item.find({ mainCategory: addedSubCategory._id });
  if (!items.length) throw new Error();
  for (let item of items) {
    expect(item.url).toEqual(`/computers/for-learning/${item.slug}`);
  }
});

test('Should admin add sub category to category (1)', async () => {
  const admin = await User.findOne({ role: 'admin' });
  const category = await Category.findOne({ slug: 'notebooks' });
  const subCategory = await Category.findOne({ slug: 'for-learning' });
  await request(app)
    .put(`/update/category/${category._id}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send({ addSubCategories: [subCategory._id] })
    .expect(200);
  const addedSubCategory = await Category.findById(subCategory._id);
  const prevMainCategory = await Category.findById(subCategory.mainCategory);
  if (prevMainCategory.subCategories.find(item => item.toString() === subCategory._id.toString())) {
    throw new Error();
  }
  expect(addedSubCategory.mainCategory.toString()).toEqual(category._id.toString());
  expect(addedSubCategory.url).toEqual('/computers/notebooks/for-learning');
  const categoryAfter = await Category.findById(category._id);
  if (!categoryAfter.subCategories.find(item => item.toString() === addedSubCategory._id.toString())) {
    throw new Error();
  }
  const items = await Item.find({ mainCategory: addedSubCategory._id });
  if (!items.length) throw new Error();
  for (let item of items) {
    expect(item.url).toEqual(`/computers/notebooks/for-learning/${item.slug}`);
  }
});

test('Should admin add sub categories to category', async () => {
  const admin = await User.findOne({ role: 'admin' });
  const category = await Category.findOne({ slug: 'computers' });
  const subCategories = [];
  subCategories.push(await Category.findOne({ slug: 'for-work' }));
  subCategories.push(await Category.findOne({ slug: 'for-learning' }));
  await request(app)
    .put(`/update/category/${category._id}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send({ addSubCategories: [subCategories[0]._id, subCategories[1]._id] })
    .expect(200);

  for await (let subCategory of subCategories) {
    const addedSubCategory = await Category.findById(subCategory._id);
    const prevMainCategory = await Category.findById(subCategory.mainCategory);
    if (prevMainCategory.subCategories.find(item => item.toString() === subCategory._id.toString())) {
      throw new Error();
    }
    expect(addedSubCategory.mainCategory.toString()).toEqual(category._id.toString());
    expect(addedSubCategory.url).toEqual(`/computers/${subCategory.slug}`);
    const categoryAfter = await Category.findById(category._id);
    if (!categoryAfter.subCategories.find(item => item.toString() === addedSubCategory._id.toString())) {
      throw new Error();
    }
    const items = await Item.find({ mainCategory: addedSubCategory._id });
    if (!items.length) throw new Error();
    for (let item of items) {
      expect(item.url).toEqual(`/computers/${subCategory.slug}/${item.slug}`);
    }
  }
});

test('Should admin change category slug', async () => {
  const admin = await User.findOne({ role: 'admin' });
  const category = await Category.findOne({ slug: 'computers' });
  const subCategories = [await Category.findOne({ slug: 'for-work' }), await Category.findOne({ slug: 'for-learning' })];
  await request(app)
    .put(`/update/category/${category._id}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send({ slug: 'computers-new' })
    .expect(200);

  //перевірити що items які належили до категорії мають змінений slug
  //перевірити що субкатегорії які належать до категорії мають змінений slug
  //перевірити що items які належили до субкатегорій мають змінений slug
  //перевірити що субкатегорії яка належать до субкатегорій мають змінений slug
  //перевірити що items які належили до субкатегорій субкатегорій мають змінений slug
  for await (let subCategory of subCategories) {
    const addedSubCategory = await Category.findById(subCategory._id);
    expect(addedSubCategory.mainCategory.toString()).toEqual(category._id.toString());
    expect(addedSubCategory.url).toEqual(`/computers-new/${subCategory.slug}`);
    const categoryAfter = await Category.findById(category._id);
    if (!categoryAfter.subCategories.find(item => item.toString() === addedSubCategory._id.toString())) {
      throw new Error();
    }
    const items = await Item.find({ mainCategory: addedSubCategory._id });
    if (!items.length) throw new Error();
    for (let item of items) {
      expect(item.url).toEqual(`/computers-new/${subCategory.slug}/${item.slug}`);
    }
  }
});

test('Should admin remove sub categories from category', async () => {
  const admin = await User.findOne({ role: 'admin' });
  const category = await Category.findOne({ slug: 'computers-new' });
  const subCategories = [];
  subCategories.push(await Category.findOne({ slug: 'for-work' }));
  subCategories.push(await Category.findOne({ slug: 'for-learning' }));
  await request(app)
    .put(`/update/category/${category._id}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send({ removeSubCategories: [subCategories[0]._id, subCategories[1]._id] })
    .expect(200);

  for await (let subCategory of subCategories) {
    const removedSubCategory = await Category.findById(subCategory._id);
    expect(removedSubCategory.mainCategory).toBeNull();
    expect(removedSubCategory.url).toEqual(`/${subCategory.slug}`);
    const categoryAfter = await Category.findById(category._id);
    if (categoryAfter.subCategories.find(item => item.toString() === removedSubCategory._id.toString())) {
      throw new Error();
    }
    const items = await Item.find({ mainCategory: removedSubCategory._id });
    if (!items.length) throw new Error();
    for (let item of items) {
      expect(item.url).toEqual(`/${subCategory.slug}/${item.slug}`);
    }
  }
});