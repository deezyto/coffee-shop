const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { User } = require('../../src/models/model.user.js');
const Category = require('../../src/models/model.category');
const Item = require('../../src/models/model.item');
const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: 'Mike',
  lastname: 'Mike',
  email: 'deezydezyto@gmail.com',
  password: '3289u2eje2ed8Q23$',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
};

const userTwoId = new mongoose.Types.ObjectId();

const userTwo = {
  _id: userTwoId,
  name: 'Andrey',
  lastname: 'Andrey',
  email: 'deezydezyto@example.com',
  password: '3289u2eje2ed82Q3$',
  tokens: [{
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
  }]
};

const create = async (obj, type = 'category') => {
  const admin = await User.findOne({ role: 'admin' });
  const response = await request(app)
    .post(`/create/${type}`)
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .send(obj)
  if (!response.body.url) return `${type} ${obj.title} not created`;
  return response.body;
}

const setupDataBase = async () => {
  //delete users exclude admin
  await User.deleteMany({ role: 'customer' });
  await Category.deleteMany();
  await Item.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();

  //create categories
  const computers = await create({
    title: 'Computers',
    slug: 'computers'
  });

  const notebooks = await create({
    title: 'Notebooks',
    slug: 'notebooks', mainCategory: computers._id
  });

  const forLearning = await create({
    title: 'Notebooks for learning',
    slug: 'for-learning', mainCategory: notebooks._id
  });

  const forWork = await create({
    title: 'Notebooks for work',
    slug: 'for-work', mainCategory: notebooks._id
  });

  //create items
  for (let i = 0; i < 2; i++) {
    await create({
      title: `Hp model ${i + 1}`,
      slug: `hp-model-${i + 1}`,
      mainCategory: notebooks._id
    }, 'item');
    await create({
      title: `Hp model business ${i + 1}`,
      slug: `hp-model-business-${i + 1}`,
      mainCategory: forLearning._id
    }, 'item');
    await create({
      title: `Hp model work ${i + 1}`,
      slug: `hp-model-work-${i + 1}`,
      mainCategory: forWork._id
    }, 'item');
  }
};

module.exports = {
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  setupDataBase,
  jwt,
};