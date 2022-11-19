import dayjs from 'dayjs'
import { TodoType } from '../../types'

import styles from './Todo.module.scss'

type TodoProps = {
  todo: TodoType
  clickHandler: (id: string) => void
}

export const Todo: React.FC<TodoProps> = ({ todo, clickHandler }) => {
  /**
   * Получение текущей даты и ее форматирование
   */
  const today = dayjs().format('YYYY MM D')
  /**
   * Форматирование даты полученной из объекта туду
   */
  const formattedDate = dayjs(todo.date).format('YYYY MM D')
  /**
   * Оборачивание для возможности сравнения дат
   */
  const now = dayjs(today)
  const deadline = dayjs(formattedDate)
  /**
   * Сравнение дат, с разницей в днях. Если разница больше ноля, появляется надпись expired
   */
  const difference = now.diff(deadline, 'day')

  return (
    <div onClick={() => clickHandler(todo._id)} className={styles.wrapper}>
      {difference > 0 && <div className={styles.status}>expired</div>}
      {todo.done && <div className={styles.done}>done</div>}
      <div className={styles.title}>{todo.title}</div>
    </div>
  )
}
