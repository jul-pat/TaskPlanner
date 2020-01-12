const { character } = require('../models/character');
const { inventory } = require('../models/inventory');
const { item } = require('../models/item');
const { questbook } = require('../models/questbook');
const { task } = require('../models/task');
const { user } = require('../models/user');

module.exports = {
  character,
  inventory,
  item,
  questbook,
  task,
  user,
};
