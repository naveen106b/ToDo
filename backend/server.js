import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js';
import todoRoutes from './routes/todoRoutes.js'


dotenv.config() 



const app = express()
connectDb()

app.use(express.json())
app.use('/api/todos', todoRoutes)

app.get('/', (req, res) => {
  res.send('Todo app backend is running')
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
