const express = require('express');
const router = express.Router();
const { validateTask } = require('../models/task');

//add new task
router.post('/', async (req, res) => {
  const Task = res.locals.models.task;
  const { error } = validateTask(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let task = new Task(req.body);
  await task.save();

  res.send(task);
});

//get all tasks
router.get('/', async (req, res) => {
  const Task = res.locals.models.task;
  const tasks = await Task.find().sort('name');
  res.send(tasks);
});

router.get('/:category&:type&:tags?', async (req, res) => {
  const Task = res.locals.models.task;

  const categoryParam = req.params.category;
  const typeParam = req.params.type;
  const tagsArray = req.params.tags ? req.params.tags.split('_') : '';

  const searchObj = () => {
    if (categoryParam != 'All' && typeParam != 'All') return { category: categoryParam, type: typeParam };
    else if (categoryParam != 'All') return { category: categoryParam };
    else if (typeParam != 'All') return { type: typeParam };
    else return;
  };

  const tasks = await Task.find(searchObj()).sort('name');

  const result = filterByValue(tasks, tagsArray);

  res.send(result);
});

//get task by id
router.get('/:id', (req, res) => {
  const Task = res.locals.models.task;

  getTasks(Task, req.params.id).then(result => {
    if (!result) {
      res.status(404).send(`Task with this id: ${req.params.id} not found`);
    } else {
      res.send(result);
    }
  });
});

//change task duration
router.put('/:id/duration', (req, res) => {
  const Task = res.locals.models.task;
  getTasks(Task, req.params.id).then(result => {
    if (!result) {
      res.status(404).send(`Task with this id: ${req.params.id} not found`);
    } else {
      Task.findByIdAndUpdate(
        req.params.id,
        {
          duration: req.body.duration,
        },
        { new: true },
      ).then(
        r => {
          res.send(`Duration time updated for task: ${r.name}:\n${r}`);
        },
        err => {
          console.log(err.errmsg);
          res.status(403).send('Bad request!');
        },
      );
    }
  });
});

//change task status
router.put('/:id/status', (req, res) => {
  const Task = res.locals.models.task;
  getTasks(Task, req.params.id).then(result => {
    if (!result) {
      res.status(404).send(`Task with this id: ${req.params.id} not found`);
    } else {
      Task.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
        },
        { new: true },
      ).then(
        r => {
          res.send(`Staus updated for task: ${r.name}:\n${r}`);
        },
        err => {
          console.log(err.errmsg);
          res.status(403).send('Bad request!');
        },
      );
    }
  });
});

function filterByValue(tasks, tags) {
  if (!tags) return tasks;
  return tasks.filter(o => {
    return tags.every(t => {
      return o.name
        .concat(o.description, o.type, o.category)
        .toLowerCase()
        .includes(t);
    });
  });
}

function filterByCategory(tasks) {
  return tasks.filter(task => {
    if (task.category === 'Daily') {
      return new Date() - task.creationTime >= 86400000;
    } else if (task.category === 'Weekly') {
      return new Date() - task.creationTime >= 604800000;
    } else if (task.category === 'Monthly') {
      return new Date() - task.creationTime >= 2629743830;
    } else {
      return true;
    }
  });
}

async function getTasks(Task, id) {
  if (id) {
    return await Task.find({ _id: id }).then(
      result => {
        return result[0];
      },
      err => console.log('Something went wrong...', err),
    );
  } else {
    return await Task.find().then(
      result => {
        return result;
      },
      err => console.log('Something went wrong...', err),
    );
  }
}

module.exports = router;
