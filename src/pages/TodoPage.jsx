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


// src/pages/TodoPage.jsx

// import { useEffect, useState } from "react";
// import TodoList from "../component/todo/TodoList";
// import {
//   fetchTodos,
//   createTodo,
//   updateTodo,
//   deleteTodo,
//   toggleTodoComplete,
// } from "../api/todoApi";

// // 🔹 complete 필드를 확실한 boolean 으로 변환
// const normalizeComplete = (value) => {
//   if (value === true) return true;
//   if (value === false || value == null) return false;

//   if (typeof value === "number") {
//     return value !== 0;
//   }

//   if (typeof value === "string") {
//     const v = value.trim().toLowerCase();
//     return v === "1" || v === "y" || v === "yes" || v === "true";
//   }

//   return false;
// };

// const TodoPage = () => {
//   const [todos, setTodos] = useState([]);

//   // 서버에서 Todo 목록 불러오기
//   const loadTodos = async () => {
//     try {
//       const data = await fetchTodos(); 
//       const mapped = data.map((t) => ({
//         id: t.todoId,
//         content: t.content,
//         isDone: normalizeComplete(t.complete), // 🔹 여기서 boolean 강제 변환
//         createDate: t.regDate,
//       }));
//       setTodos(mapped);
//     } catch (err) {
//       console.error("Todo 불러오기 실패:", err);
//     }
//   };

//   useEffect(() => {
//     loadTodos();
//   }, []);

//   // Todo 생성
//   const handleCreate = async (content) => {
//     try {
//       await createTodo(content);
//       await loadTodos();
//     } catch (err) {
//       console.error("Todo 생성 실패:", err);
//     }
//   };

//   // Todo 수정
//   // const handleEdit = async (id, newContent) => {
//   //   try {
//   //     await updateTodo(id, newContent);
//   //     await loadTodos();
//   //   } catch (err) {
//   //     console.error("Todo 수정 실패:", err);
//   //   }
//   // };

//   const handleEdit = async (id, newContent) => {
//     try {
//       await updateTodo(id, newContent);

//       setTodos((prev) =>
//         prev.map((t) =>
//           t.id === id
//             ? { ...t, content: newContent, createDate: Date.now() }
//             : t
//         )
//       );
//     } catch (err) {
//       console.error("Todo 수정 실패:", err);
//     }
//   };



//   // Todo 완료/미완료 토글
//   // const handleToggle = async (id) => {
//   //   try {
//   //     await toggleTodoComplete(id);
//   //     await loadTodos();
//   //   } catch (err) {
//   //     console.error("Todo 상태 변경 실패:", err);
//   //   }
//   // };

//   const handleToggle = async (id) => {
//     try {
//       setTodos((prev) =>
//         prev.map((t) =>
//           t.id === id ? { ...t, isDone: !t.isDone } : t
//         )
//       );

//       await toggleTodoComplete(id);
//       loadTodos();
//     } catch (err) {
//       console.error("Todo 상태 변경 실패:", err);
//     }
//   };




//   // Todo 삭제
//   const handleDelete = async (id) => {
//     try {
//       await deleteTodo(id);
//       await loadTodos();
//     } catch (err) {
//       console.error("Todo 삭제 실패:", err);
//     }
//   };

//   return (
//     <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
//       <TodoList
//         todo={todos}
//         onCreate={handleCreate}
//         onToggle={handleToggle}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//       />
//     </div>
//   );
// };

// export default TodoPage;

// src/pages/TodoPage.jsx
import { useEffect, useState } from "react";
import TodoList from "../component/todo/TodoList";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
} from "../api/todoApi";

// complete 필드를 확실한 boolean으로 변환
const normalizeComplete = (value) => {
  if (value === true) return true;
  if (value === false || value == null) return false;

  if (typeof value === "number") {
    return value !== 0;
  }

  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (v === "1" || v === "y" || v === "yes" || v === "true") return true;
    return false;
  }

  return false;
};

const TodoPage = () => {
  const [todos, setTodos] = useState([]);

  const loadTodos = async () => {
    try {
      const res = await fetchTodos();
      const data = Array.isArray(res) ? res : res.data;

      const mapped = data.map((t) => {
        const completeRaw =
          t.complete ?? t.completed ?? t.isDone ?? t.done ?? t.status;
        return {
          id: t.todoId ?? t.id,
          content: t.content,
          isDone: normalizeComplete(completeRaw),
          createDate: t.regDate ?? t.createDate ?? Date.now(),
        };
      });

      setTodos(mapped);
    } catch (err) {
      console.error("Todo 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleCreate = async (content) => {
    try {
      await createTodo(content);
      await loadTodos();
    } catch (err) {
      console.error("Todo 생성 실패:", err);
    }
  };

  // 수정 시 날짜도 지금 시각으로 갱신
  const handleEdit = async (id, newContent) => {
    try {
      await updateTodo(id, newContent);
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, content: newContent, createDate: Date.now() }
            : t
        )
      );
    } catch (err) {
      console.error("Todo 수정 실패:", err);
    }
  };

  // 체크박스 토글: 먼저 화면에서 토글 → 그다음 서버 동기화
  // const handleToggle = async (id) => {
  //   try {
  //     setTodos((prev) =>
  //       prev.map((t) =>
  //         t.id === id ? { ...t, isDone: !t.isDone } : t
  //       )
  //     );

  //     await toggleTodoComplete(id);
  //     loadTodos();
  //   } catch (err) {
  //     console.error("Todo 상태 변경 실패:", err);
  //   }
  // };

  const handleToggle = async (id) => {
  try {
    // 프론트에서만 즉시 반영
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isDone: !t.isDone } : t
      )
    );

    // 서버가 없으므로 toggleTodoComplete 제거
    // await toggleTodoComplete(id);
    // loadTodos();

  } catch (err) {
    console.error("Todo 상태 변경 실패:", err);
  }
};


  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      await loadTodos();
    } catch (err) {
      console.error("Todo 삭제 실패:", err);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <TodoList
        todo={todos}
        onCreate={handleCreate}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TodoPage;
