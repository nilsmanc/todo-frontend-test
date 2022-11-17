import { TodoType } from '../../types'
import { Todo } from '../Todo'

import styles from './List.module.scss'

type ListProps = {
  todos: TodoType[]
  setTodoId: (id: string) => void
}

export const List: React.FC<ListProps> = ({ todos, setTodoId }) => {
  const clickHandler = (id: string) => {
    setTodoId(id)
  }

  return (
    <div className={styles.wrapper}>
      {todos.map((todo: any) => (
        <Todo key={todo._id} clickHandler={clickHandler} todo={todo} />
      ))}
    </div>
  )
}
