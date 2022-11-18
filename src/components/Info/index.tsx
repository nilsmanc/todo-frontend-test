import { useEffect, useState } from 'react'
import instance from '../../axios'

import { TodoType } from '../../types'

import styles from './Info.module.scss'

type InfoProps = {
  todoId: string
  setUpdate: any
}

export const Info: React.FC<InfoProps> = ({ todoId, setUpdate }) => {
  const [todo, setTodo] = useState({} as TodoType)

  const [title, setTitle] = useState('')

  const [description, setDescription] = useState('')

  const [imageUrl, setImageUrl] = useState('')

  console.log(imageUrl)

  const [isAdding, setIsAdding] = useState(false)

  const fetchTodo = async (id: string) => {
    const { data } = await instance.get(`/todo/${id}`)
    setTodo(data)
  }

  const deleteHandler = async () => {
    await instance.delete(`/todo/${todoId}`)
    setUpdate((prevState: boolean) => !prevState)
  }

  const toggleCreate = () => {
    setIsAdding(true)
    setTitle('')
    setDescription('')
    setImageUrl('')
  }

  const handleChangeFile = async (event: any) => {
    try {
      const formData = new FormData()
      const file = event.target.files[0]
      formData.append('image', file)
      const { data } = await instance.post('/upload', formData)
      setImageUrl('http://localhost:4444' + data.url)
    } catch (err) {
      console.warn(err)
      alert('Failed to upload file')
    }
  }

  const addHandler = async () => {
    const todo = {
      title,
      description,
      file: imageUrl,
    }

    await instance.post('/todos', todo)

    setImageUrl('')

    setIsAdding(false)
    setUpdate((prevState: boolean) => !prevState)
  }

  const updateHandler = () => {
    const todo = {
      title,
      description,
      file: imageUrl,
    }
    console.log(todo)

    setImageUrl('')
    instance.patch(`/todo/${todoId}`, todo)
  }

  useEffect(() => {
    fetchTodo(todoId)
    setTitle(todo.title)
    setDescription(todo.description)
  }, [todoId, todo.title, todo.description])

  return (
    <div className={styles.wrapper}>
      <textarea value={title} onChange={(e) => setTitle(e.target.value)} className={styles.title} />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={styles.description}
      />
      <img src={todo.file} />

      <button onClick={() => deleteHandler()}>Delete</button>
      <button onClick={() => updateHandler()}>Update</button>
      {!isAdding && <button onClick={() => toggleCreate()}>Create</button>}
      {isAdding && (
        <>
          <img src={imageUrl} />
          <button onClick={() => addHandler()}>Add Todo</button>
          <input type='file' onChange={handleChangeFile} />
        </>
      )}
    </div>
  )
}
