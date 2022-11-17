import { useEffect, useState } from 'react'
import instance from '../../axios'

import { TodoType } from '../../types'

type InfoProps = {
  todoId: string
}

export const Info: React.FC<InfoProps> = ({ todoId }) => {
  const [todo, setTodo] = useState({} as TodoType)

  const fetchTodo = async (id: string) => {
    const { data } = await instance.get(`/todos/${id}`)
    setTodo(data)
  }

  useEffect(() => {
    fetchTodo(todoId)
  }, [todoId])

  return (
    <div>
      <div>{todo.title}</div>
      <div>{todo.description}</div>
      <div>{todo.date}</div>
    </div>
  )
}
