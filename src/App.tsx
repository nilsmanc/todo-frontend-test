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

  /**
   * Функция для получения массива туду
   */
  const fetchTodos = async () => {
    const { data } = await instance.get('/todos')
    setTodos(data)
  }

  // Получение нового массива при первом и ренедере и изменении update
  useEffect(() => {
    fetchTodos()
  }, [update])

  return (
    <div className={styles.wrapper}>
      <List todos={todos} setTodoId={setTodoId} isAdding={isAdding} />
      <Info
        todoId={todoId}
        update={update}
        setUpdate={setUpdate}
        isAdding={isAdding}
        setIsAdding={setIsAdding}
      />
    </div>
  )
}

export default App
