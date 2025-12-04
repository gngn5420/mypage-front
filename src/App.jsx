import './App.css'
import HabitTracker from './component/habit/HabitTracker';
import FrontView from './component/main/FrontView';
import EconomyNews from './component/news/EconomyNews';
import Header from './component/todo/Header'
// import { useTodo } from './component/todo/TodoData';
import TodoEditor from './component/todo/TodoEditor'
import TodoList from './component/todo/TodoList'

function App() {  
  // const { todo, onCreate, onUpdate, onDelete } = useTodo();
  return (
    <div className='App'>
      {/* <Header/>
      <TodoEditor onCreate={onCreate}/>
      <TodoList todo={todo} onUpdate={onUpdate} onDelete={onDelete}/>
      <EconomyNews/>
      <HabitTracker/> */}
      <FrontView/>
    </div>
  )
}
export default App
