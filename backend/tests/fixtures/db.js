const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { User } = require('../../src/models/model.user.js');
const Category = require('../../src/models/model.category');

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  //створюєм id вручну щоб потім використати його для створення jwt токена
  _id: userOneId,
  name: 'Mike',
  lastname: 'Mike',
  email: 'deezydezyto@gmail.com',
  password: '3289u2eje2ed8Q23$',
  tokens: [{
    //створюєм токен щоб використовувати його для тестів в яких потрібна авторизація
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
};

const userTwoId = new mongoose.Types.ObjectId();

const userTwo = {
  //створюєм id вручну щоб потім використати його для створення jwt токена
  _id: userTwoId,
  name: 'Andrey',
  lastname: 'Andrey',
  email: 'deezydezyto@example.com',
  password: '3289u2eje2ed82Q3$',
  tokens: [{
    //створюєм токен щоб використовувати його для тестів в яких потрібна авторизація
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
  }]
};

const createCategory = async (title, slug, mainCategory = null) => {
  const admin = await User.findOne({ role: 'admin' });
  console.log(admin)
  const obj = {
    title,
    slug,
    mainCategory
  };
  const response = await request(app)
    .post('/create/category')
    .set('Authorization', `Bearer ${admin.tokens[0].token}`)
    .field(obj)
  return response;
}

//console.log(createCategory('Computers', 'computers'));

/* const categoryOne = {
  _id: new mongoose.Types.ObjectId(),
  title: 'Computers',
  slug: 'computers',
  owner: userOne._id
};

const categoryTwo = {
  _id: new mongoose.Types.ObjectId(),
  desc: 'Notebooks',
  slug: 'notebooks',
  owner: userOne._id
};

const categoryThree = {
  _id: new mongoose.Types.ObjectId(),
  desc: 'first task',
  completed: false,
  owner: userOne._id
};

const itemOne = {
  _id: new mongoose.Types.ObjectId(),
  desc: 'first task',
  completed: false,
  owner: userOne._id
};

const itemTwo = {
  _id: new mongoose.Types.ObjectId(),
  desc: 'second task',
  completed: true,
  owner: userTwo._id
}; */

const setupDataBase = async () => {
  //видаляємо всіх користувачів з бази даних крім адміна
  await User.deleteMany({ role: 'customer' });
  await Category.deleteMany();
  //оскільки для тестування запитів на вхід, або оновлення профілю
  //буде пуста база даних (так як ця функція буде запускатись перед кожним тестом)
  //то потрібно створити тестового user зразу після видалення користувачів із бази даних
  await new User(userOne).save();
  await new User(userTwo).save();
  //видаляємо попередні завдання з бази даних
  /* await Task.deleteMany();

  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save(); */
};

module.exports = {
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  setupDataBase,
  jwt,
};