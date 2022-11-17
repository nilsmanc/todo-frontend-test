import { TodoType } from '../../types'
import styles from './Todo.module.scss'

type TodoProps = {
  todo: TodoType
}

export const Todo: React.FC<TodoProps> = ({ todo }) => {
  return (
    <div>
      <div className={styles.title}>{todo.title}</div>
      <div>{todo.description}</div>
      <div>{todo.date}</div>
    </div>
  )
}
