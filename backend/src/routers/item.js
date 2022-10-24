const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const category = require('../middleware/category');
const Item = require('../models/item');
const Category = require('../models/category');
const SubCategory = require('../models/subcategory');

router.get('/:category', async (req, res) => {
  try {
    const category = await Category.findOne({slug: req.params.category});
    const items = await Item.find({categories: category._id});
    const itemsFromCategories = await Category.findById(category._id).populate("items");
    comsole.log(itemsFromCategories, 'itemsFromCategories')
    res.send(items);
  } catch {
    res.status(500).send()
  }
})

router.get('/:category/:subcategory', async (req, res) => {
  try {
    const category = await SubCategory.findOne({slug: req.params.category});
    const items = await Item.find({categories: category._id});
    const mouse = await SubCategory.findById(id).populate("tags");
    res.send(items);
  } catch {
    res.status(500).send()
  }
})

//коли створюється новий item
//потрібно в категорію яку хочеш добавити цей item
//добавити id item, і в item добавити id category
const addItemToCategory = function (categoryId = [], itemId = '') {
  //перебираєм масив з id категорій які має item
  categoryId.forEach(async category => {
    //шукаємо одну із категорій
    await Category.findByIdAndUpdate(
      category,
      //добавляємо створений item
      { $push: { items: itemId } },
      { new: true, useFindAndModify: false }
    );
  });
};

const addCategoryToItem = function (categoryId = [], itemId = '') {
  //перебираємо масив з id категорій які має item
  categoryId.forEach(async id => {
    //при кожному проході категорії з масива
    //шукаємо item в якому повинна бути ця категорія
    await Item.findByIdAndUpdate(
      itemId,
      { $push: { categories: id } },
      { new: true, useFindAndModify: false }
    );
  });
};

//create item in category
router.post('/admin/create/item', auth, async (req, res) => {
  try {
    if (req.admin) {
      //перевіряєм чи є item з вказаним uri
      const checkUri = await Item.findOne({slug: req.body.slug});
      
      //якщо є то вертаєм статус що вже є
      if (checkUri) {
        res.status(400).send({err: `Uri ${req.body.slug} is available. Please choose another unique uri`});
      }

      //створюєм новий item
      const item = new Item(req.body);
      await item.save();

      addItemToCategory(req.body.category, item._id);
      addCategoryToItem(req.body.category, item._id);
      
      res.status(201).send(item);
    }
    res.status(403).send();
  } catch {
    res.status(400).send({err: 'Please check required fields'});
  }
});

//get items from category
router.get('*', async (req, res) => {
  try {
    const params = req.params[0].split('/').filter(item => item.length > 0);
    console.log(params, req.query)
    if (params.length === 1) {
      //шукаємо item по назві uri
      const item = await Item.findOne({uri: params[0]});

      //якщо item має parent категорії
      //значить вона не може бути одна в запиті
      if (!item || item.parentCategories.length) {
        res.status(404).send();
      }

      //якщо item немає категорій значить це article тому вертаєм цей article
      //якщо має то вертаєм її items
      if (!item.categories.length) {
        res.send(item);
      } else {
        const item = item.categories.find({})
        console.log(item, 'category')
      }

      res.send(item);
    }

    for (let i = 0; i < params.length; i++) {
      //if item have categories, item article
      //if not, item = category
      //if item dont have parent category
      //category = first, if have, category = second
      const item = await Item.findOne({uri: params[i]});

      if (!item) {
        res.status(404).send();
      }
      
    }
    const user = await Item.findOne({'categories.category': 'hello-url'});
    console.log(user, 'category')
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
    }

    const category = await Category.findOne({uri: req.params.category});

    if (!category) {
      res.status(404).send();
    }

    console.log(category.items)
    const itemUri = category.items.find(item => item === req.params.uri);

    if (!itemUri) {
      res.status(404).send();
    }

    const itemLength = await Item.find({uri: req.params.uri});

    const item = await Item.find({uri: req.params.uri}, null, {
      limit: parseInt(req.query.limit),
      skip: parseInt(req.query.skip),
      sort
    })

    if (!item.length) {
      res.status(404).send();
    }
    res.send({results: item, length: itemLength.length});
  } catch {
    res.status(500).send()
  }
});


router.delete('/coffee/:id', auth, async (req, res) => {
  try {
    if (req.admin) {
      const item = await Item.findById(req.params.id);
      if (!item) {
        res.status(404).send();
      }
      item.remove();
      res.send(item);
    }
  } catch {
    res.status(400).send();
  }
});

router.put('/coffee/:id', auth, async (req, res) => {
  try {
    if (req.admin) {
      const item = await Item.findById(req.params.id);
      const updates = Object.keys(req.body);
      const allowedFields = ['title', 'description'];
      const isValidUpdates = updates.every(elem => allowedFields.includes(elem));
      if (!isValidUpdates) {
        return res.status(400).send({err: 'This updates not allowed'});
      }

      updates.forEach(field => {
        item[field] = req.body[field];
      })

      await item.save();
      res.send(item);
      }
  } catch {
    res.status(500).send();
  }
});
module.exports = router;