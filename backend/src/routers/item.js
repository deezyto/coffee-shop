const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Item = require('../models/item');
const Category = require('../models/category');

router.get('/:category', async (req, res) => {
  try {
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

router.post('/:category', auth, async (req, res) => {
  try {
    if (req.admin) {
      const category = await Category.findOne({uri: req.params.category})
      if (!category) {
        res.status(404).send();
      }

      const item = new Item(req.body);
      const findItem = category.items.find(item => item === item.uri);
      if (!findItem) {
        category.items.push(item.uri);
        await category.save();
      }
      await item.save()
      res.status(201).send({item, category});
    }
    res.status(403).send();
  } catch {
    res.status(400).send();
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