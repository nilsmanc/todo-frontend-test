import { useState, useEffect } from 'react'

import instance from './axios'
import { Info } from './components/Info'
import { List } from './components/List'

import styles from './App.module.scss'

function App() {
  const [todos, setTodos] = useState([])

  const [todoId, setTodoId] = useState('')

  const [update, setUpdate] = useState(true)

  const [isAdding, setIsAdding] = useState(false)

  const fetchTodos = async () => {
    const { data } = await instance.get('/todos/')
    setTodos(data)
  }

  useEffect(() => {
    fetchTodos()
  }, [update])

  return (
    <div className={styles.wrapper}>
      <List todos={todos} setTodoId={setTodoId} isAdding={isAdding} />
      <Info todoId={todoId} setUpdate={setUpdate} isAdding={isAdding} setIsAdding={setIsAdding} />
    </div>
  )
}

export default App
