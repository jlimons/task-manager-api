const express = require('express')
const router = new express.Router()
const Task = require('../models/task.js')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
  
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })

  try {
    const result = await task.save()
    res.status(201).send(result)
  } catch (error) {
    res.status(400).send(error)
  }

})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
  const match = {}
  const sort = {}

  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    // const tasks = await Task.find({ owner: req.user._id })
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.send(req.user.tasks)
  } catch (error) {
    res.status(400).send(error)
  }

})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findOne({_id, owner: req.user._id})

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (error) {
    res.status(500).send(error)
  }

})

router.patch('/tasks/:id', auth, async (req, res) => {

  const _id = req.params.id
  const updateObject = req.body

  const updates = Object.keys(updateObject)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation || !updateObject) {
    return res.status(400).send({ error: 'Invalid updates' })
  }

  try {
    
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    updates.forEach(update => task[update] = updateObject[update])
    task.save()

    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router