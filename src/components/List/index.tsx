import { TodoType } from '../../types'
import { Todo } from '../Todo'

type ListProps = {
  todos: TodoType[]
  setTodoId: (id: string) => void
}

export const List: React.FC<ListProps> = ({ todos, setTodoId }) => {
  return (
    <div>
      {todos.map((todo: any) => (
        <Todo key={todo._id} todo={todo} />
      ))}
    </div>
  )
}
