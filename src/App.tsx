import { useState, useEffect } from 'react'

import instance from './axios'
import { Info } from './components/Info'
import { List } from './components/List'

import styles from './App.module.scss'

function App() {
  const [todos, setTodos] = useState([])
  console.log(todos)

  const [todoId, setTodoId] = useState('')

  const [update, setUpdate] = useState(true)
  console.log(update)

  const fetchTodos = async () => {
    const { data } = await instance.get('/todos/')
    setTodos(data)
  }

  useEffect(() => {
    fetchTodos()
  }, [update])

  return (
    <div className={styles.wrapper}>
      <List todos={todos} setTodoId={setTodoId} />
      <Info todoId={todoId} setUpdate={setUpdate} />
    </div>
  )
}

export default App
