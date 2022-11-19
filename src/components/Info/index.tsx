import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import instance from '../../axios'
import { TodoType } from '../../types'
import styles from './Info.module.scss'
import axios from 'axios'

type InfoProps = {
  todoId: string
  setUpdate: any
  isAdding: any
  setIsAdding: any
}

export const Info: React.FC<InfoProps> = ({ todoId, setUpdate, isAdding, setIsAdding }) => {
  const [todo, setTodo] = useState({} as TodoType)

  const [title, setTitle] = useState('')

  const [description, setDescription] = useState('')

  const [date, setDate] = useState('')

  const [imageUrl, setImageUrl] = useState('')

  const filename = imageUrl?.substring(30, imageUrl.length)

  const extension = filename?.substring(filename.length - 3, filename.length)

  const [isDone, setIsDone] = useState(false)

  const formattedDate = dayjs(todo.date).format('D-MM-YYYY')

  const fetchTodo = async (id: string) => {
    const { data } = await instance.get(`/todo/${id}`)
    setTodo(data)
  }

  const deleteHandler = async () => {
    await instance.delete(`/todo/${todoId}`)
    setUpdate((prevState: boolean) => !prevState)
  }

  const toggleCreate = () => {
    setIsAdding((prevState: boolean) => !prevState)
    setTitle('')
    setDescription('')
    setDate('')
    setIsDone(false)
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
      date,
      file: imageUrl,
      done: isDone,
    }

    await instance.post('/todos', todo)

    setImageUrl('')

    setIsAdding(false)
    setUpdate((prevState: boolean) => !prevState)
  }

  const updateHandler = async () => {
    const todo = {
      title,
      description,
      file: imageUrl,
      done: isDone,
    }

    setImageUrl('')
    await instance.patch(`/todo/${todoId}`, todo)
    setUpdate((prevState: boolean) => !prevState)
  }

  const checkboxHandler = () => {
    setIsDone(!isDone)
  }

  const download = (e: any) => {
    e.preventDefault()

    axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const href = URL.createObjectURL(response.data)

      const link = document.createElement('a')
      link.href = href
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      URL.revokeObjectURL(href)
    })
  }

  useEffect(() => {
    fetchTodo(todoId)
    setTitle(todo.title)
    setDescription(todo.description)
    setImageUrl(todo.file)
    setIsDone(todo.done)

    return () => {
      setImageUrl('')
    }
  }, [todoId, todo.title, todo.description, todo.file])

  return (
    <div className={styles.wrapper}>
      <button onClick={(e) => download(e)}>Download</button>
      <textarea value={title} onChange={(e) => setTitle(e.target.value)} className={styles.title} />
      {todo.title && <div className={styles.date}>Expire date: {formattedDate}</div>}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={styles.description}
      />

      <div className={styles.skeleton} />
      {!isAdding && todo.file && extension === 'jpg' && (
        <img className={styles.image} src={todo.file} />
      )}
      <div className={styles.buttons}>
        <button onClick={() => deleteHandler()} disabled={!todo.title}>
          Delete
        </button>
        <button onClick={() => updateHandler()} disabled={!todo.title}>
          Update
        </button>

        {!isAdding && (
          <>
            <label>
              Done{' '}
              <input
                type='checkbox'
                checked={isDone}
                disabled={!todo.title}
                onClick={checkboxHandler}
              />
            </label>
            <button onClick={() => toggleCreate()}>Create</button>
          </>
        )}
        {isAdding && (
          <>
            <button onClick={() => toggleCreate()}>Cancel</button>
            <button onClick={() => addHandler()}>Add Todo</button>
            <input type='file' onChange={handleChangeFile} />
            <input type='date' value={date} onChange={(e) => setDate(e.target.value)} />
          </>
        )}
      </div>
      {isAdding && imageUrl && <img className={styles.preview} src={imageUrl} alt='preview' />}
    </div>
  )
}
