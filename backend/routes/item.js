const { validateItemEquipped } = require('../models/item');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const Item = res.locals.models.item;
  const items = await Item.find()
    .sort('slot')
    .catch(err => {
      console.error(`Bad request. ${err}`);
      return null;
    });
  res.send(items);
});

router.get('/:id', async (req, res) => {
  const Item = res.locals.models.item;

  const item = await Item.findById(req.params.id).catch(err => {
    console.error(`Bad request. The given ID: ${req.params.id} was not valid. ${err}`);
    return null;
  });

  if (!item) return res.status(404).send(`The item with the given ID: ${req.params.id} was not found.`);

  res.send(item);
});

router.put('/:id/equipped', async (req, res) => {
  const Item = res.locals.models.item;

  if (req.body.equipped == null) return res.status(400).send('Bad request: none equipped value in body.');

  const { error } = validateItemEquipped(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const item = await Item.findByIdAndUpdate(
    req.params.id,
    {
      equipped: req.body.equipped,
    },
    { new: true },
  ).catch(err => {
    console.error(`Bad request. The given ID: ${req.params.id} was not valid. ${err}`);
    return null;
  });

  if (!item) return res.status(404).send(`The item with the given ID: ${req.params.id} was not found.`);
  res.send(item);
});

module.exports = router;
