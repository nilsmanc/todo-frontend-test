import { useState, useEffect } from 'react'

import instance from './axios'
import { Info } from './components/Info'
import { List } from './components/List'
import { TodoType } from './types'

import styles from './App.module.scss'

function App() {
  const [todos, setTodos] = useState([])

  const [todoId, setTodoId] = useState('')

  const fetchTodos = async () => {
    const { data } = await instance.get('/todos/')
    setTodos(data)
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className={styles.wrapper}>
      <List todos={todos} setTodoId={setTodoId} />
      <Info todoId={todoId} />
    </div>
  )
}

export default App
