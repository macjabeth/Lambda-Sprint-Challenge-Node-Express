const Joi = require('joi');
const router = require('express').Router();
const actionDB = require('../helpers/actionModel');

// Schema Validation
const schema = Joi.object().keys({
  project_id: Joi.number().integer().required(),
  description: Joi.string().max(128).required(),
  notes: Joi.string().required(),
  completed: Joi.boolean()
});

// C - POST
router.post('/', async (req, res) => {
  let { body: action } = req;

  const result = Joi.validate(action, schema);
  if (result.error) {
    return res.status(400).json({
      error: result.error.details[0].message
    });
  }

  try {
    action = await actionDB.insert(action);
    res.status(201).json(action);
  } catch (error) {
    res.status(500).json({
      error: `There was an error while saving the action to the database; ${error}`
    });
  }
});

// R - GET
router.get('/', async (req, res) => {
  try {
    const projects = await actionDB.get();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      error: `The projects information could not be retrieved; ${error}`
    });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const action = await actionDB.get(id);
    Boolean(action)
      ? res.status(200).json(action)
      : res.status(404).json({ message: 'The action with the specified ID does not exist.' });
  } catch (error) {
    res.status(500).json({
      message: `The action information could not be retrieved; ${error}`
    });
  }
});

// U - PUT
router.put('/:id', async (req, res) => {
  const { body: changes } = req;
  const { id } = req.params;

  const result = Joi.validate(changes, schema);
  if (result.error) {
    return res.status(400).json({
      error: result.error.details[0].message
    });
  }

  try {
    const action = await actionDB.update(id, changes);
    Boolean(action)
      ? res.status(200).json(action)
      : res.status(404).json({ message: 'The action with the specified ID does not exist.' });
  } catch (error) {
    res.status(500).json({
      error: `The action information could not be modified; ${error}`
    });
  }
});

// D - DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const count = await actionDB.remove(id);
    Boolean(count)
      ? res.status(200).json({ message: 'The action has been deleted.' })
      : res.status(404).json({ message: 'The action with the specified ID does not exist.' });
  } catch (error) {
    res.status(500).json({
      error: `The action could not be removed; ${error}`
    });
  }
});

module.exports = router;
