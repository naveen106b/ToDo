import express from 'express'
import { addTodo, deleteTask, getAllTask, updteTask } from '../controller/todoController.js'

const router = express.Router()

// create a new todo
router.post('/', addTodo)

// get all todos
router.get('/', getAllTask)

// update one todo by id
router.put('/:id', updteTask)

// delete one todo by id
router.delete('/:id', deleteTask)

export default router
