import { useState, useEffect } from 'react'

import instance from './axios'
import { Info } from './components/Info'
import { List } from './components/List'
import { TodoType } from './types'

function App() {
  const [todos, setTodos] = useState([])
  console.log(todos)

  const [todoId, setTodoId] = useState('')

  const [todo, setTodo] = useState({} as TodoType)

  const fetchTodos = async () => {
    const { data } = await instance.get('/todos/')
    setTodos(data)
  }

  const fetchTodo = async (id: string) => {
    const { data } = await instance.get(`/todos/${id}`)
    setTodo(data)
  }

  useEffect(() => {
    fetchTodos()
    fetchTodo(todoId)
  }, [todoId])

  return (
    <div>
      <List todos={todos} setTodoId={setTodoId} />
      <Info todo={todo} />
    </div>
  )
}

export default App
