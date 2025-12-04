import { useState, useMemo } from "react"
import TodoItem from "./TodoItem"
import "./TodoList.css"

const TodoList=({todo, onUpdate, onDelete})=>{
  const [search, setSearch]=useState("")
  const onChangeSearch=(e)=>{
    setSearch(e.target.value)
  }
  const getSearchResult=()=>{
    return search===""
    ? todo
    : todo.filter((it) => it.content.toLowerCase().includes(search.toLowerCase()))
  }
  const onClearSearch=()=>{
    setSearch("")
  }
  const analyzeTodo= useMemo(()=>{
    const totalCount = todo.length;
    const doneCount = todo.filter((it)=> it.isDone).length;
    const notDoneCount = totalCount - doneCount;
    return{
      totalCount, 
      doneCount,
      notDoneCount,
    }
  }, [todo])
  const{totalCount, doneCount, notDoneCount}=analyzeTodo;

  return(
    <div className="TodoList">
      <h4>Todo List 🧃</h4>
      <div>
        <div>총 갯수: {totalCount}</div>
        <div>완료된 할 일: {doneCount}</div>
        <div>아직 완료하지 못한 할 일: {notDoneCount}</div>
      </div>
    <div className="search_wrapper" style={{ position: "relative", marginTop: "10px" }}>
    <input
    value={search}
    onChange={onChangeSearch}  
    className="searchbar" 
    placeholder="검색어를 입력하세요." 
    style={{paddingRight: "30px"}}
    />
    {search && (
      <button
            onClick={onClearSearch}
            style={{
              position: "absolute",
              right: "5px",
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
        X
      </button>
    )}
    </div>
    <div className="list_wrapper">
      {getSearchResult().map((it) => (
        <TodoItem key={it.id} {...it}  onUpdate={onUpdate} onDelete={onDelete}/>
      ))}
    </div>
    </div>
  )
}
export default TodoList