import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import axios from 'axios'

import instance from '../../axios'
import { TodoType } from '../../types'

import styles from './Info.module.scss'

type InfoProps = {
  todoId: string
  update: boolean
  setUpdate: (update: boolean) => void
  isAdding: boolean
  setIsAdding: (isAdding: boolean) => void
}

export const Info: React.FC<InfoProps> = ({ todoId, update, setUpdate, isAdding, setIsAdding }) => {
  const [todo, setTodo] = useState({} as TodoType)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [isDone, setIsDone] = useState(false)

  const filename = fileUrl?.substring(30, fileUrl.length)
  const extension = filename?.substring(filename.length - 3, filename.length)

  const formattedDate = dayjs(todo.date).format('D-MM-YYYY')

  const fetchTodo = async (id: string) => {
    const { data } = await instance.get(`/todo/${id}`)
    setTodo(data)
  }

  const deleteHandler = async () => {
    await instance.delete(`/todo/${todoId}`)
    setUpdate(!update)
  }

  const toggleCreate = () => {
    setIsAdding(!isAdding)
    setTitle('')
    setDescription('')
    setDate('')
    setIsDone(false)
    setFileUrl('')
  }

  const handleChangeFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const formData = new FormData()
      const file = event.target.files![0]
      formData.append('image', file)
      const { data } = await instance.post('/upload', formData)
      setFileUrl(process.env.REACT_APP_API_URL + data.url)
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
      file: fileUrl,
      done: isDone,
    }

    await instance.post('/todos', todo)

    setFileUrl('')
    setIsAdding(false)
    setUpdate(!update)
  }

  const updateHandler = async () => {
    const todo = {
      title,
      description,
      file: fileUrl,
      done: isDone,
    }

    setFileUrl('')
    await instance.patch(`/todo/${todoId}`, todo)
    setUpdate(!update)
  }

  const checkboxHandler = () => {
    setIsDone(!isDone)
  }

  const download = (event: React.MouseEvent) => {
    event.preventDefault()

    axios({
      url: fileUrl,
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
    setFileUrl(todo.file)
    setIsDone(todo.done)

    return () => {
      setFileUrl('')
    }
  }, [todoId, todo.title, todo.description, todo.file])

  return (
    <div className={styles.wrapper}>
      <textarea value={title} onChange={(e) => setTitle(e.target.value)} className={styles.title} />
      {todo.title && <div className={styles.date}>Expire date: {formattedDate}</div>}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={styles.description}
      />
      <div className={styles.skeleton} />
      {!isAdding && todo.file && (extension === 'jpg' || extension === 'png') && (
        <img className={styles.image} src={todo.file} />
      )}
      <div className={styles.buttons}>
        {!isAdding && (
          <>
            <button onClick={() => deleteHandler()} disabled={!todo.title}>
              Delete
            </button>
            <button onClick={() => updateHandler()} disabled={!todo.title}>
              Update
            </button>
            <button onClick={(e) => download(e)}>Download File</button>
            <div>{filename}</div>
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
      {isAdding && fileUrl && <img className={styles.preview} src={fileUrl} alt='preview' />}
    </div>
  )
}
