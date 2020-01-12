const bcrypt = require('bcryptjs');
const _ = require('lodash');
const defaultTasks = require('./defaultObjects/defaultTasks');
const defaultItems = require('./defaultObjects/defaultItems');

const transactional = initializer => async (model, models, idCatalog) => {
  let result;
  const session = await model.startSession();
  await session.withTransaction(async () => {
    result = await initializer(models, idCatalog);
  });
  return result;
};

const hashPassword = async password => await bcrypt.hash(password, await bcrypt.genSalt(10));

const createModelBatch = async (model, data) => {
  const createdDocuments = [];
  for (let modelData of data) {
    const createdDocument = new model(modelData);
    createdDocuments.push(createdDocument);
    await createdDocument.save();
  }
  // return createdDocuments;
  const idArray = [];
  createdDocuments.forEach(element => {
    idArray.push(element._id);
  });
  return idArray;
};

const arrayWithCount = count => fn => [...Array(count).keys()].map(fn);

const createUsers = async (prefix, count, models, characterCatalog) => {
  const userPassword = await hashPassword(process.env.USER_PASSWORD);
  const adminPassword = await hashPassword(process.env.ADMIN_PASSWORD);
  const adminEmail = process.env.ADMIN_EMAIL;
  const userData = arrayWithCount(count)(x => {
    if (x === 0) {
      return {
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        character_id: characterCatalog[x] === undefined ? null : characterCatalog[x],
        isAdmin: true,
        isVerified: true,
      };
    }
    return {
      name: 'User',
      email: prefix + x + '@email.com',
      password: userPassword,
      character_id: characterCatalog[x] === undefined ? null : characterCatalog[x],
      isAdmin: false,
      isVerified: true,
    };
  });
  return await createModelBatch(models.user, userData);
};

const createCharacters = async (prefix, count, models, questbookCatalog, inventoryCatalog) => {
  const characterData = arrayWithCount(count)(x => {
    return {
      name: prefix + x,
      level: 1 + x,
      maxHealth: 100 * (x + 1),
      health: 50 * (x + 1),
      expRequired: 120 * (x + 1),
      exp_points: 100 * (x + 1),
      physical_power: 15 + x,
      magical_power: 20 + x,
      charClass: 'Druid',
      avatar: 'http://icons.iconarchive.com/icons/chanut/role-playing/256/Villager-icon.png',
      questbook_id: questbookCatalog[x] === undefined ? null : questbookCatalog[x],
      inventory_id: inventoryCatalog[x] === undefined ? null : inventoryCatalog[x],
    };
  });
  return await createModelBatch(models.character, characterData);
};

const createInventories = async (count, models, itemCatalog) => {
  const inventoryData = arrayWithCount(count)(x => {
    return {
      backpack: [
        itemCatalog[(x + 1) * 1] === undefined ? null : itemCatalog[(x + 1) * 1],
        itemCatalog[(x + 1) * 2] === undefined ? null : itemCatalog[(x + 1) * 2],
        itemCatalog[(x + 1) * 3] === undefined ? null : itemCatalog[(x + 1) * 3],
      ],
      gold: (x + 1) * 500,
      equippedItems: [],
    };
  });
  return await createModelBatch(models.inventory, inventoryData);
};

const createItem = async (prefix, count, models) => {
  const itemData = arrayWithCount(count)(x => {
    if (defaultItems[x] !== undefined) {
      return defaultItems[x];
    } else {
      return {
        name: prefix + x,
        slot: 'Weapon',
        description: 'item description' + x,
        effect: 'Magic_power',
        effect_value: x,
        price: 100 * x,
        equipped: false,
        picture: '',
      };
    }
  });
  return await createModelBatch(models.item, itemData);
};

const createQuestbook = async (count, models, taskCatalog) => {
  const Task = models.task;
  const questbookData = arrayWithCount(count)(x => {
    tasks = [];
    tasks.push(taskCatalog[(x + 1) * 1] === undefined ? null : new Task(defaultTasks[(x + 1) * 1]));
    tasks.push(taskCatalog[(x + 1) * 2] === undefined ? null : new Task(defaultTasks[(x + 1) * 2]));
    tasks.push(taskCatalog[(x + 1) * 3] === undefined ? null : new Task(defaultTasks[(x + 1) * 3]));
    return {
      tasks,
    };
  });
  return await createModelBatch(models.questbook, questbookData);
};

const createTask = async (prefix, count, models) => {
  const taskData = arrayWithCount(count)(x => {
    if (defaultTasks[x] !== undefined) {
      return defaultTasks[x];
    } else {
      return {
        name: prefix + x,
        description: 'Task description' + x,
        type: 'Utility',
        category: 'Daily',
        duration: x + 1,
        exp: 100 + x,
        gold: 50 + x,
        penalty: 5 + x,
        status: '',
      };
    }
  });
  return await createModelBatch(models.task, taskData);
};

const userInitializer = async (models, idCatalog) => {
  const prefix = 'user';
  return await createUsers(prefix, 4, models, idCatalog['character']);
};

const characterInitializer = async (models, idCatalog) => {
  const prefix = 'Character_';
  return await createCharacters(prefix, 4, models, idCatalog['questbook'], idCatalog['inventory']);
};

const inventoryInitializer = async (models, idCatalog) => {
  return await createInventories(4, models, idCatalog['item']);
};

const itemInitializer = async (models, idCatalog) => {
  const prefix = 'Item_';
  return await createItem(prefix, defaultItems.length, models);
};

const questbookInitializer = async (models, idCatalog) => {
  return await createQuestbook(Math.floor(defaultTasks.length / 3), models, idCatalog['task']);
};

const taskInitializer = async (models, idCatalog) => {
  const prefix = 'Task_';
  return await createTask(prefix, defaultTasks.length, models);
};

const defaultInitializers = new Map([
  ['task', taskInitializer],
  ['questbook', questbookInitializer],
  ['item', itemInitializer],
  ['inventory', inventoryInitializer],
  ['character', characterInitializer],
  ['user', userInitializer],
]);

const initOrder = ['task', 'questbook', 'item', 'inventory', 'character', 'user'];

const initialize = async (models, initializers = defaultInitializers) => {
  let idCatalog = [];
  for (let modelName of initOrder) {
    if (!initializers.has(modelName)) {
      console.log(`[MongoDB] Could not find initializer for ${modelName}`);
      continue;
    }
    console.log(`[MongoDB] Initializing data for ${modelName}`);
    const initializer = initializers.get(modelName);
    idCatalog[modelName] = await transactional(initializer)(models[modelName], models, idCatalog);
  }
};

module.exports = initialize;
