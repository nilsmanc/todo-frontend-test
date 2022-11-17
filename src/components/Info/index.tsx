import { TodoType } from '../../types'

type InfoProps = {
  todo: TodoType
}

export const Info: React.FC<InfoProps> = ({ todo }) => {
  return <div>{todo.title}</div>
}
