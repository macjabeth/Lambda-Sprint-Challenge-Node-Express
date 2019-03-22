const Joi = require('joi');
const router = require('express').Router();
const projectDB = require('../helpers/projectModel');

// Schema Validation
const schema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  completed: Joi.boolean()
});

// C - POST
router.post('/', async (req, res) => {
  let { body: project } = req;

  const result = Joi.validate(project, schema, { abortEarly: false });
  if (result.error) {
    const messages = result.error.details.map(err => err.message);
    return res.status(400).json({ error: messages });
  }

  try {
    project = await projectDB.insert(project);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      error: `There was an error while saving the project to the database; ${error}`
    });
  }
});

// R - GET
router.get('/', async (req, res) => {
  try {
    const projects = await projectDB.get();
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
    const project = await projectDB.get(id);
    Boolean(project)
      ? res.status(200).json(project)
      : res.status(404).json({ message: 'The project with the specified ID does not exist.' });
  } catch (error) {
    res.status(500).json({
      message: `The project information could not be retrieved; ${error}`
    });
  }
});

// U - PUT
router.put('/:id', async (req, res) => {
  const { body: changes } = req;
  const { id } = req.params;

  const result = Joi.validate(changes, schema, { abortEarly: false });
  if (result.error) {
    const messages = result.error.details.map(err => err.message);
    return res.status(400).json({ error: messages });
  }

  try {
    const project = await projectDB.update(id, changes);
    Boolean(project)
      ? res.status(200).json(project)
      : res.status(404).json({ message: 'The project with the specified ID does not exist.' });
  } catch (error) {
    res.status(500).json({
      error: `The project information could not be modified; ${error}`
    });
  }
});

// D - DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const count = await projectDB.remove(id);
    Boolean(count)
      ? res.status(200).json({ message: 'The project has been deleted.' })
      : res.status(404).json({ message: 'The project with the specified ID does not exist.' });
  } catch (error) {
    res.status(500).json({
      error: `The project could not be removed; ${error}`
    });
  }
});

module.exports = router;
