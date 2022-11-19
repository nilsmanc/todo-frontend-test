import { TodoType } from '../../types'
import { Todo } from '../Todo'

import styles from './List.module.scss'

type ListProps = {
  todos: TodoType[]
  setTodoId: (id: string) => void
  isAdding: boolean
}

export const List: React.FC<ListProps> = ({ todos, setTodoId, isAdding }) => {
  const clickHandler = (id: string) => {
    if (!isAdding) setTodoId(id)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Todo</div>
      {todos.map((todo: TodoType) => (
        <Todo key={todo._id} clickHandler={clickHandler} todo={todo} />
      ))}
    </div>
  )
}
