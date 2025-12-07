// import { useEffect, useState } from "react";
// import TodoList from "../component/todo/TodoList";
// import {
//   fetchTodos,
//   createTodo,
//   updateTodoContent,
//   toggleTodo,
//   deleteTodo,
// } from "../api/todoApi";

// const TodoPage = () => {
//   const [todos, setTodos] = useState([]);

//   const loadTodos = async () => {
//     const res = await fetchTodos();
//     setTodos(res.data);
//   };

//   useEffect(() => {
//     loadTodos();
//   }, []);

//   const handleCreate = async (content) => {
//     await createTodo(content);
//     loadTodos();
//   };

//   const handleUpdate = async (id) => {
//     const newContent = prompt("수정할 내용을 입력하세요:");
//     if (!newContent) return;
//     await updateTodoContent(id, newContent);
//     loadTodos();
//   };

//   const handleToggle = async (id) => {
//     await toggleTodo(id);
//     loadTodos();
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("삭제할까요?")) return;
//     await deleteTodo(id);
//     loadTodos();
//   };

//   return (
//     <TodoList
//       todo={todos}
//       onCreate={handleCreate}
//       onUpdate={handleUpdate}
//       onToggle={handleToggle}
//       onDelete={handleDelete}
//     />
//   );
// };

// export default TodoPage;

// 📌 TodoPage.jsx (백엔드 없어도 안전하게 동작하는 버전)

import { useEffect, useState } from "react";
import { fetchTodos, createTodo, updateTodo, deleteTodo, toggleTodoComplete } from "../api/todoApi";
import TodoItem from "../component/todo/TodoItem";
import TodoEditor from "../component/todo/TodoEditor";


const TodoPage = () => {
  const [todos, setTodos] = useState([]);

  // 📌 Todo 목록 불러오기
  const loadTodos = async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      console.error("Todo 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  // 📌 Todo 생성
  const handleCreate = async (content) => {
    try {
      const newTodo = await createTodo(content);
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      console.error("Todo 생성 실패:", err);
    }
  };

  // 📌 Todo 수정
  const handleUpdate = async (id, newContent) => {
    try {
      const updated = await updateTodo(id, newContent);
      setTodos((prev) =>
        prev.map((t) => (t.todoId === id ? updated : t))
      );
    } catch (err) {
      console.error("Todo 수정 실패:", err);
    }
  };

  // 📌 Todo 완료/미완료 토글
  const handleToggle = async (id) => {
    try {
      await toggleTodoComplete(id);
      setTodos((prev) =>
        prev.map((t) =>
          t.todoId === id ? { ...t, complete: !t.complete } : t
        )
      );
    } catch (err) {
      console.error("Todo 상태 변경 실패:", err);
    }
  };

  // 📌 Todo 삭제
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.todoId !== id));
    } catch (err) {
      console.error("Todo 삭제 실패:", err);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <h1
        style={{
          fontSize: "40px",
          fontWeight: 500,
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        🧃 오늘의 할 일
      </h1>

      {/* Todo 입력 */}
      <TodoEditor onCreate={handleCreate} />

      {/* Todo 목록 */}
      <div style={{ marginTop: "20px" }}>
        {todos.length === 0 ? (
          <p style={{ opacity: 0.6 }}>할 일이 없습니다.</p>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.todoId}
              id={todo.todoId}
              content={todo.content}
              isDone={todo.complete}
              createDate={todo.regDate}
              onUpdate={(id) => {
                const newContent = prompt("수정할 내용을 입력하세요:", todo.content);
                if (newContent) handleUpdate(id, newContent);
              }}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoPage;
