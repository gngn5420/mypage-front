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
