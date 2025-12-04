import { Route } from "lucide-react"
import { Routes } from "react-router-dom"

const TopNavi=()=>{
  return(<>
    <Routes>
      <Route path="/">Home</Route>
      <Route path="/register">Sing up</Route>
      <Route path="/login">Login</Route>
      <Route path="/mypage">My page</Route>
      <Route path="/todo">TodoList</Route>
      <Route path="/habit">Habit Tracker</Route>
      <Route path="/news">Economy News</Route>
    </Routes>
  </>)

}
export default TopNavi