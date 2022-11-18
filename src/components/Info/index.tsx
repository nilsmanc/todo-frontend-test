import { useEffect, useState } from 'react'
import instance from '../../axios'

import { TodoType } from '../../types'

import styles from './Info.module.scss'

type InfoProps = {
  todoId: string
}

export const Info: React.FC<InfoProps> = ({ todoId }) => {
  const [todo, setTodo] = useState({} as TodoType)

  const [title, setTitle] = useState('')

  const [description, setDescription] = useState('')

  const [isAdding, setIsAdding] = useState(false)

  const fetchTodo = async (id: string) => {
    const { data } = await instance.get(`/todos/${id}`)
    setTodo(data)
  }

  const deleteHandler = () => {
    instance.delete(`/todos/${todoId}`)
  }

  const toggleCreate = () => {
    setIsAdding(true)
    setTitle('')
    setDescription('')
  }

  const addHandler = () => {
    const todo = {
      title,
      description,
    }

    console.log(todo)

    instance.post('/todos', todo)

    setIsAdding(false)
  }

  const updateHandler = () => {
    const todo = {
      title,
      description,
    }

    instance.patch(`/todos/${todoId}`, todo)
  }

  useEffect(() => {
    fetchTodo(todoId)
    setTitle(todo.title)
    setDescription(todo.description)
  }, [todoId])

  return (
    <div className={styles.wrapper}>
      <textarea value={title} onChange={(e) => setTitle(e.target.value)} className={styles.title} />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={styles.description}
      />
      <button onClick={() => deleteHandler()}>Delete</button>
      <button onClick={() => updateHandler()}>Update</button>
      {!isAdding && <button onClick={() => toggleCreate()}>Create</button>}
      {isAdding && <button onClick={() => addHandler()}>Add Todo</button>}
    </div>
  )
}
