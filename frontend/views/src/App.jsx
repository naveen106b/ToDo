import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE = '/api/todos'

const App = () => {
  const [tasks, setTasks] = useState([])
  const [taskName, setTaskName] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const pendingCount = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks]
  )

  const fetchTasks = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(API_BASE)
      if (!response.ok) throw new Error('Unable to load tasks from the server.')
      const data = await response.json()
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = taskName.trim()
    if (!trimmed) return

    setSaving(true)
    setError('')
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskName: trimmed }),
      })
      if (!response.ok) throw new Error('Unable to create the task.')
      setTaskName('')
      await fetchTasks()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleCompleted = async (task) => {
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE}/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      })
      if (!response.ok) throw new Error('Unable to update the task.')
      const updatedTask = await response.json()
      setTasks((current) =>
        current.map((item) => (item._id === updatedTask._id ? updatedTask : item))
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTask = async (id) => {
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Unable to delete the task.')
      setTasks((current) => current.filter((task) => task._id !== id))
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <div className="app-shell">
      <div className="todo-card">
        <header className="todo-header">
          <div>
            <p className="title">Todo App</p>
            <p className="subtitle">Simple task manager connected to the backend.</p>
          </div>
          <div className="stat-pill">
            {loading ? 'Loading…' : `${tasks.length} task${tasks.length === 1 ? '' : 's'}`}
          </div>
        </header>

        <form className="todo-form" onSubmit={handleSubmit}>
          <label htmlFor="taskName">Add a new task</label>
          <div className="form-row">
            <input
              id="taskName"
              value={taskName}
              onChange={(event) => setTaskName(event.target.value)}
              placeholder="Buy groceries, call a friend, or write notes"
              disabled={saving}
            />
            <button type="submit" disabled={!taskName.trim() || saving}>
              {saving ? 'Saving…' : 'Add'}
            </button>
          </div>
        </form>

        {error ? <div className="error-banner">{error}</div> : null}

        <section className="task-section">
          <div className="task-section-header">
            <div>
              <h2>Tasks</h2>
              <p>{pendingCount} pending, {completedTasks.length} completed</p>
            </div>
            <button type="button" className="refresh-button" onClick={fetchTasks} disabled={loading || saving}>
              Refresh
            </button>
          </div>

          {tasks.length === 0 && !loading ? (
            <p className="empty-state">No tasks yet. Create one to get started.</p>
          ) : null}

          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id} className={task.completed ? 'task-item completed' : 'task-item'}>
                <label className="task-row">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleCompleted(task)}
                    disabled={saving}
                  />
                  <span>{task.taskName}</span>
                </label>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDeleteTask(task._id)}
                  disabled={saving}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default App
