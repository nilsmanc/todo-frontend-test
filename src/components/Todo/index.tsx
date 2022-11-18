import { TodoType } from '../../types'
import styles from './Todo.module.scss'

type TodoProps = {
  todo: TodoType
  clickHandler: any
}

export const Todo: React.FC<TodoProps> = ({ todo, clickHandler }) => {
  return (
    <div onClick={() => clickHandler(todo._id)} className={styles.wrapper}>
      <div className={styles.title}>{todo.title}</div>
      <div className={styles.date}>{todo.date}</div>
    </div>
  )
}
