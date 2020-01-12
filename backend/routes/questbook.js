const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { validateTask } = require('../models/task');
const { validateQuestbook } = require('../models/questbook');
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
  const Questbook = res.locals.models.questbook;

  const { error } = validateQuestbook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let questbook = new Questbook(req.body);
  await questbook.save();
  res.send(questbook);
});

router.get('/count', async (req, res) => {
  const Questbook = res.locals.models.questbook;
  const questbooks = await Questbook.find();

  let counter = 0;
  questbooks.forEach(questbook => {
    questbook.tasks.forEach(task => {
      if (task && task.status === 'completed') counter++;
    });
  });

  res.send(`${counter}`);
});

router.get('/:id/completed', async (req, res) => {
  const Questbook = res.locals.models.questbook;
  const questbook = await Questbook.findById(req.params.id);

  if (!questbook) return res.status(404).send('The questbook with the given ID was not found.');

  const tasks = _.filter(questbook.tasks, task => {
    return task.status == 'completed';
  });

  res.send(tasks);
});

router.get('/:id/uncompleted', async (req, res) => {
  const Questbook = res.locals.models.questbook;
  const questbook = await Questbook.findById(req.params.id);

  if (!questbook) return res.status(404).send('The questbook with the given ID was not found.');

  const tasks = _.filter(questbook.tasks, task => {
    return task.status == 'in_progress' || task.status == 'paused';
  });

  res.send(tasks);
});

router.get('/:id/failed', async (req, res) => {
  const Questbook = res.locals.models.questbook;
  const questbook = await Questbook.findById(req.params.id);

  if (!questbook) return res.status(404).send('The questbook with the given ID was not found.');

  const tasks = _.filter(questbook.tasks, task => {
    return task.status == 'failed';
  });

  res.send(tasks);
});

router.put('/:id/task', async (req, res) => {
  const Questbook = res.locals.models.questbook;
  const Task = res.locals.models.task;
  let task = new Task(req.body);
  const { error } = validateTask(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const questbookHandel = await Questbook.findById(req.params.id, 'tasks', { lean: true });
  task['_doc']['creationTime'] = new Date();
  questbookHandel.tasks.push(task);

  const questbook = await Questbook.findByIdAndUpdate(
    req.params.id,
    {
      tasks: questbookHandel.tasks,
    },
    { new: true },
  );

  if (!questbook) return res.status(404).send('The questbook with the given ID was not found.');
  res.send(questbook);
});

//get all tasks
router.get('/:id/tasks', async (req, res) => {
  const Questbook = res.locals.models.questbook;
  const questbook = await Questbook.findById(req.params.id);

  if (!questbook) return res.status(404).send('The questbook with the given ID was not found.');

  const tasks = _.filter(questbook.tasks);

  res.send(tasks);
});

router.post('/:id/task', async (req, res) => {
  const Questbook = res.locals.models.questbook;
  const Task = res.locals.models.task;
  let task = new Task(req.body);
  const { error } = validateTask(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const questbookHandel = await Questbook.findById(req.params.id, 'tasks', { lean: true });
  questbookHandel.tasks.push(task);

  const questbook = await Questbook.findByIdAndUpdate(
    req.params.id,
    {
      tasks: questbookHandel.tasks,
    },
    { new: true },
  );

  if (!questbook) return res.status(404).send('The questbook with the given ID was not found.');
  res.send(questbook);
});

//start finish task
router.put('/:id/task/:idTask', async (req, res) => {
  const Questbook = res.locals.models.questbook;

  const questbook = await Questbook.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { 'tasks.$[task].status': req.body.status, 'tasks.$[task].startFinishDate': new Date() } },
    {
      arrayFilters: [
        {
          'task._id': new mongoose.Types.ObjectId(req.params.idTask),
        },
      ],
      new: true,
    },
  );

  if (!questbook) return res.status(404).send('The questbook with the given ID was not found.');
  res.send(questbook);
});

//pause task
router.put('/:id/task/:idTask/pause', async (req, res) => {
  const Questbook = res.locals.models.questbook;

  const questbook = await Questbook.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { 'tasks.$[task].status': req.body.status, 'tasks.$[task].pauseDate': new Date() } },
    {
      arrayFilters: [
        {
          'task._id': new mongoose.Types.ObjectId(req.params.idTask),
        },
      ],
      new: true,
    },
  );

  if (!questbook) return res.status(404).send('The questbook with the given ID was not found.');
  res.send(questbook);
});

//unpause task
router.put('/:id/task/:idTask/unpause', async (req, res) => {
  const Questbook = res.locals.models.questbook;

  const questbook = await Questbook.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { 'tasks.$[task].status': req.body.status, 'tasks.$[task].pausedAlready': true } },
    {
      arrayFilters: [
        {
          'task._id': new mongoose.Types.ObjectId(req.params.idTask),
        },
      ],
      new: true,
    },
  );

  if (!questbook) return res.status(404).send('The questbook with the given ID was not found.');
  res.send(questbook);
});

module.exports = router;
