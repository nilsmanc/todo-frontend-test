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
  const [isDateChanging, setIsDateChanging] = useState(false)
  /**
   * Возвращает имя файла из ссылки
   */
  const filename = fileUrl?.substring(49, fileUrl.length)
  /**
   * Возвращает расширение файла
   */
  const extension = filename?.substring(filename.length - 3, filename.length)
  /**
   * Форматирование даты
   */
  const formattedDate = dayjs(date).format('D-MM-YYYY')
  /**
   * Запрос одного туду
   */
  const fetchTodo = async (id: string) => {
    const { data } = await instance.get(`/todo/${id}`)
    setTodo(data)
  }
  /**
   * Обработчик, отправляющий запрос на удаление туду и изменяющий состояние update, чтобы перерисовать весь список
   */
  const deleteHandler = async () => {
    await instance.delete(`/todo/${todoId}`)
    setUpdate(!update)
  }
  /**
   * Переключатель очищающий состояние для создания нового туду
   */
  const toggleCreate = () => {
    setIsAdding(!isAdding)
    setTitle('')
    setDescription('')
    setDate('')
    setIsDone(false)
    setFileUrl('')
  }
  /**
   * Отправляет файл на сервер и возвращает ссылку на него
   */
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
  /**
   * Собирает данные из стейтов и отправляет на сервер
   */
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
    setTitle('')
    setDescription('')
    setDate('')
    setIsDone(false)
    setIsAdding(false)
    setUpdate(!update)
  }
  /**
   * Собирает данные из стейтов и обновляет туду
   */
  const updateHandler = async () => {
    const todo = {
      title,
      description,
      date,
      file: fileUrl,
      done: isDone,
    }

    await instance.patch(`/todo/${todoId}`, todo)

    setUpdate(!update)
    setIsDateChanging(false)
  }
  /**
   * Переключатель состояния done
   */
  const checkboxHandler = () => {
    setIsDone(!isDone)
  }
  /**
   * Загружает файл с сервера
   */
  const download = (event: React.MouseEvent) => {
    event.preventDefault()

    axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      // создает ссылку на файл в памяти браузера
      const href = URL.createObjectURL(response.data)
      // создает элемент 'a' со ссылкой на файл и клик
      const link = document.createElement('a')
      link.href = href
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      // очистка
      document.body.removeChild(link)
      URL.revokeObjectURL(href)
    })
  }
  /**
   * Запрос туду и заполнение полей
   */
  useEffect(() => {
    fetchTodo(todoId)
    setTitle(todo.title)
    setDescription(todo.description)
    setFileUrl(todo.file)
    setIsDone(todo.done)
    setDate(todo.date)

    return () => {
      setFileUrl('')
    }
  }, [todoId, todo.title, todo.description, todo.file, todo.date])

  return (
    <div className={styles.wrapper}>
      <textarea value={title} onChange={(e) => setTitle(e.target.value)} className={styles.title} />
      {todo.title && !isDateChanging && (
        <div
          onClick={() => {
            setIsDateChanging(true)
          }}
          className={styles.date}>
          Expire date: {formattedDate}
        </div>
      )}
      {isDateChanging && (
        <label>
          <input
            className={styles.hiddenDateInput}
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button onClick={() => setIsDateChanging(false)}>Cancel</button>
        </label>
      )}
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
            {filename && <button onClick={(e) => download(e)}>Download File</button>}
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
            <input type='file' onChange={handleChangeFile} />
            <input type='date' value={date} onChange={(e) => setDate(e.target.value)} />
            <button onClick={() => addHandler()} disabled={!date || !title || !description}>
              Add Todo
            </button>
          </>
        )}
      </div>
      {isAdding && fileUrl && (extension === 'jpg' || extension === 'png') && (
        <img className={styles.preview} src={fileUrl} alt='preview' />
      )}
    </div>
  )
}
