import { useEffect, useState } from 'react'

interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  userId: number
}

type FilterType = 'all' | 'active' | 'completed'

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] =
    useState<'high' | 'medium' | 'low'>('medium')

  const [search, setSearch] = useState('')
  const [filter, setFilter] =
    useState<FilterType>('all')

  const [editingId, setEditingId] =
    useState<number | null>(null)

  const [editingTitle, setEditingTitle] = useState('')
  const [editingDescription, setEditingDescription] =
    useState('')
  const [editingPriority, setEditingPriority] =
    useState<'high' | 'medium' | 'low'>('medium')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  // =========================
  // ЗАГРУЗКА ЗАДАЧ
  // =========================

  const getTasks = async () => {
    if (!token) {
      window.location.href = '/login'
      return
    }

    try {
      const response = await fetch(
        'http://localhost:3000/tasks',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Не удалось загрузить задачи',
        )
      }

      setTasks(data)
    } catch (error) {
      console.error(error)
      setError('Не удалось загрузить задачи')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTasks()
  }, [])

  // =========================
  // ДОБАВЛЕНИЕ
  // =========================

  const createTask = async () => {
    setError('')

    if (!title.trim()) {
      setError('Введите название задачи')
      return
    }

    if (!token) {
      window.location.href = '/login'
      return
    }

    try {
      const response = await fetch(
        'http://localhost:3000/tasks',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            priority,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        setError(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Не удалось создать задачу',
        )
        return
      }

      setTasks((prev) => [...prev, data])

      setTitle('')
      setDescription('')
      setPriority('medium')
    } catch (error) {
      console.error(error)
      setError('Не удалось подключиться к серверу')
    }
  }

  // =========================
  // ВЫПОЛНЕНИЕ
  // =========================

  const toggleTask = async (task: Task) => {
    if (!token) {
      window.location.href = '/login'
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3000/tasks/${task.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            completed: !task.completed,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        alert(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Не удалось изменить задачу',
        )
        return
      }

      setTasks((prev) =>
        prev.map((item) =>
          item.id === task.id
            ? {
                ...item,
                completed: !item.completed,
              }
            : item,
        ),
      )
    } catch (error) {
      console.error(error)
      alert('Не удалось подключиться к серверу')
    }
  }

  // =========================
  // РЕДАКТИРОВАНИЕ
  // =========================

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditingTitle(task.title)
    setEditingDescription(task.description || '')
    setEditingPriority(task.priority || 'medium')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
    setEditingDescription('')
    setEditingPriority('medium')
  }

  const saveEdit = async () => {
    if (!editingTitle.trim()) {
      alert('Название задачи не может быть пустым')
      return
    }

    if (editingId === null || !token) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3000/tasks/${editingId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editingTitle.trim(),
            description: editingDescription.trim(),
            priority: editingPriority,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        alert(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Не удалось изменить задачу',
        )
        return
      }

      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingId
            ? {
                ...task,
                title: editingTitle.trim(),
                description: editingDescription.trim(),
                priority: editingPriority,
              }
            : task,
        ),
      )

      cancelEdit()
    } catch (error) {
      console.error(error)
      alert('Не удалось подключиться к серверу')
    }
  }

  // =========================
  // УДАЛЕНИЕ
  // =========================

  const deleteTask = async (id: number) => {
    if (!token) {
      window.location.href = '/login'
      return
    }

    const confirmed = window.confirm(
      'Вы действительно хотите удалить эту задачу?',
    )

    if (!confirmed) return

    try {
      const response = await fetch(
        `http://localhost:3000/tasks/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        alert(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Не удалось удалить задачу',
        )
        return
      }

      setTasks((prev) =>
        prev.filter((task) => task.id !== id),
      )
    } catch (error) {
      console.error(error)
      alert('Не удалось подключиться к серверу')
    }
  }

  // =========================
  // ВЫХОД
  // =========================

  const logout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  // =========================
  // ФИЛЬТР
  // =========================

  const filteredTasks = tasks.filter((task) => {
    const searchText = search.toLowerCase().trim()

    const matchesSearch =
      task.title.toLowerCase().includes(searchText) ||
      (task.description || '')
        .toLowerCase()
        .includes(searchText)

    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !task.completed) ||
      (filter === 'completed' && task.completed)

    return matchesSearch && matchesFilter
  })

  const activeCount = tasks.filter(
    (task) => !task.completed,
  ).length

  const completedCount = tasks.filter(
    (task) => task.completed,
  ).length

  // =========================
  // ПРИОРИТЕТ
  // =========================

  const getPriorityText = (
    priority: 'high' | 'medium' | 'low',
  ) => {
    if (priority === 'high') return '🔴 Высокий'
    if (priority === 'low') return '🟢 Низкий'
    return '🟡 Средний'
  }

  const getPriorityClass = (
    priority: 'high' | 'medium' | 'low',
  ) => {
    if (priority === 'high') return 'priority-high'
    if (priority === 'low') return 'priority-low'
    return 'priority-medium'
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="loading">
        Загрузка задач...
      </div>
    )
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="tasks-page">
      <div className="tasks-container">

        {/* HEADER */}

        <div className="tasks-header">
          <div>
            <p className="small-title">
              TASK MANAGER
            </p>

            <h1>Мои задачи</h1>

            <p className="subtitle">
              Организуйте свои дела легко 💙
            </p>
          </div>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Выйти
          </button>
        </div>

        {/* STATISTICS */}

        <div className="stats">

          <div className="stat-card">
            <span>Всего</span>
            <strong>{tasks.length}</strong>
          </div>

          <div className="stat-card">
            <span>Активные</span>
            <strong>{activeCount}</strong>
          </div>

          <div className="stat-card">
            <span>Выполнено</span>
            <strong>{completedCount}</strong>
          </div>

        </div>

        {/* CREATE */}

        <div className="create-card">

          <h2>Новая задача</h2>

          <input
            type="text"
            placeholder="Название задачи"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setError('')
            }}
          />

          <input
            type="text"
            placeholder="Описание задачи"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              setError('')
            }}
          />

          {/* PRIORITY */}

          <div className="priority-section">
            <label>Приоритет задачи</label>

            <div className="priority-buttons">

              <button
                type="button"
                className={
                  priority === 'high'
                    ? 'priority-button selected-high'
                    : 'priority-button'
                }
                onClick={() => setPriority('high')}
              >
                🔴 Высокий
              </button>

              <button
                type="button"
                className={
                  priority === 'medium'
                    ? 'priority-button selected-medium'
                    : 'priority-button'
                }
                onClick={() => setPriority('medium')}
              >
                🟡 Средний
              </button>

              <button
                type="button"
                className={
                  priority === 'low'
                    ? 'priority-button selected-low'
                    : 'priority-button'
                }
                onClick={() => setPriority('low')}
              >
                🟢 Низкий
              </button>

            </div>
          </div>

          {error && (
            <div className="server-error">
              {error}
            </div>
          )}

          <button
            className="create-btn"
            onClick={createTask}
          >
            + Добавить задачу
          </button>

        </div>

        {/* SEARCH */}

        <div className="filters">

          <input
            className="search-input"
            type="text"
            placeholder="🔎 Найти задачу..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <div className="filter-buttons">

            <button
              className={
                filter === 'all'
                  ? 'active-filter'
                  : ''
              }
              onClick={() => setFilter('all')}
            >
              Все
            </button>

            <button
              className={
                filter === 'active'
                  ? 'active-filter'
                  : ''
              }
              onClick={() => setFilter('active')}
            >
              Активные
            </button>

            <button
              className={
                filter === 'completed'
                  ? 'active-filter'
                  : ''
              }
              onClick={() =>
                setFilter('completed')
              }
            >
              Выполненные
            </button>

          </div>

        </div>

        {/* TASKS */}

        <div className="tasks-list">

          <h2>
            Задачи ({filteredTasks.length})
          </h2>

          {filteredTasks.length === 0 ? (

            <div className="empty">
              <p>Задач не найдено 📝</p>

              <span>
                Попробуйте изменить поиск или фильтр
              </span>
            </div>

          ) : (

            filteredTasks.map((task) => (

              <div
                key={task.id}
                className={`task-card ${
                  task.completed
                    ? 'completed'
                    : ''
                }`}
              >

                {editingId === task.id ? (

                  /* EDIT */

                  <div className="edit-form">

                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) =>
                        setEditingTitle(
                          e.target.value,
                        )
                      }
                      placeholder="Название задачи"
                    />

                    <input
                      type="text"
                      value={editingDescription}
                      onChange={(e) =>
                        setEditingDescription(
                          e.target.value,
                        )
                      }
                      placeholder="Описание задачи"
                    />

                    <div className="priority-section">
                      <label>Приоритет</label>

                      <div className="priority-buttons">

                        <button
                          type="button"
                          className={
                            editingPriority === 'high'
                              ? 'priority-button selected-high'
                              : 'priority-button'
                          }
                          onClick={() =>
                            setEditingPriority('high')
                          }
                        >
                          🔴 Высокий
                        </button>

                        <button
                          type="button"
                          className={
                            editingPriority === 'medium'
                              ? 'priority-button selected-medium'
                              : 'priority-button'
                          }
                          onClick={() =>
                            setEditingPriority('medium')
                          }
                        >
                          🟡 Средний
                        </button>

                        <button
                          type="button"
                          className={
                            editingPriority === 'low'
                              ? 'priority-button selected-low'
                              : 'priority-button'
                          }
                          onClick={() =>
                            setEditingPriority('low')
                          }
                        >
                          🟢 Низкий
                        </button>

                      </div>
                    </div>

                    <div className="actions">

                      <button
                        className="save-btn"
                        onClick={saveEdit}
                      >
                        💾 Сохранить
                      </button>

                      <button
                        className="cancel-btn"
                        onClick={cancelEdit}
                      >
                        Отмена
                      </button>

                    </div>

                  </div>

                ) : (

                  /* NORMAL */

                  <>
                    <div className="task-content">

                      <h3>{task.title}</h3>

                      <p>
                        {task.description ||
                          'Без описания'}
                      </p>

                      <div className="task-info">

                        <span
                          className={`priority-badge ${getPriorityClass(
                            task.priority,
                          )}`}
                        >
                          {getPriorityText(
                            task.priority,
                          )}
                        </span>

                        <span
                          className={`status ${
                            task.completed
                              ? 'status-done'
                              : 'status-todo'
                          }`}
                        >
                          {task.completed
                            ? '✓ Выполнено'
                            : '○ В процессе'}
                        </span>

                      </div>

                    </div>

                    <div className="actions">

                      <button
                        className="complete-btn"
                        onClick={() =>
                          toggleTask(task)
                        }
                      >
                        {task.completed
                          ? 'Вернуть'
                          : 'Выполнить'}
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() =>
                          startEdit(task)
                        }
                      >
                        ✏️ Изменить
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteTask(task.id)
                        }
                      >
                        🗑️ Удалить
                      </button>

                    </div>
                  </>

                )}

              </div>

            ))

          )}

        </div>

      </div>
    </div>
  )
}

export default Tasks