import { useState, useMemo, useEffect, useCallback } from "react";
import TodoItem from "./TodoItem";
import TodoEditor from "./TodoEditor";
import axios from "../../api/axios";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ 목록 불러오기
  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get("/api/todo/list");
      setTodos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]); // fetchTodos가 바뀌면 실행하라

  // ✅ 생성
  // 가정: TodoEditor에서 서버 생성 후 "생성된 todo 객체"를 onCreate로 넘겨줌
  const handleCreate = async (createdTodo) => {
    if (!createdTodo) return;
    setTodos((prev) => [...prev, createdTodo]);
    // 생성 흐름이 불확실하면 아래로 교체:
    // await fetchTodos();
  };

  // ✅ 토글
  const handleToggle = async (todoId) => {
    try {
      const response = await axios.put(`/api/todo/toggle/${todoId}`);
      const nextComplete = response.data?.complete;

      setTodos((prev) =>
        prev.map((todo) =>
          todo.todoId === todoId
            ? { ...todo, complete: nextComplete ?? !todo.complete }
            : todo
        )
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  // ✅ 수정
  const handleUpdate = async (todoId, content) => {
    try {
      const response = await axios.put(`/api/todo/update/${todoId}`, { content });
      const nextContent = response.data?.content ?? content;

      setTodos((prev) =>
        prev.map((todo) =>
          todo.todoId === todoId ? { ...todo, content: nextContent } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
      if (error.response) console.error("Server error:", error.response.data);
    }
  };

  // ✅ 삭제
  const handleDelete = async (todoId) => {
    try {
      await axios.delete(`/api/todo/delete/${todoId}`);
      // 가장 안전한 동기화
      await fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // ✅ 검색
  const onChangeSearch = (e) => setSearch(e.target.value);
  const onClearSearch = () => setSearch("");

  const filteredTodos = useMemo(() => {
    if (!Array.isArray(todos)) return [];
    const q = search.trim().toLowerCase();
    if (!q) return todos;
    return todos.filter((it) =>
      (it.content ?? "").toLowerCase().includes(q)
    );
  }, [todos, search]);

  // ✅ 집계(complete 기준으로 단일화)
  const analyzeTodo = useMemo(() => {
    const totalCount = todos.length;
    const doneCount = todos.filter((it) => it.complete).length;
    const notDoneCount = totalCount - doneCount;
    return { totalCount, doneCount, notDoneCount };
  }, [todos]);

  const { totalCount, doneCount, notDoneCount } = analyzeTodo;

  return (
    <div
      className="TodoList"
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        padding: "0",
      }}
    >
      {/* 제목 */}
      <h1
        style={{
          fontSize: "40px",
          fontWeight: 500,
          color: "#333",
          marginBottom: "40px",
          marginTop: "60px",
          textAlign: "center",
        }}
      >
        🧃 오늘의 할 일
      </h1>

      {/* 요약 카드 */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "70px" }}>
        <SummaryCard label="총" value={totalCount} />
        <SummaryCard label="완료" value={doneCount} color="#13d295ff" />
        <SummaryCard label="미완료" value={notDoneCount} color="#ff9c2bff" />
      </div>

      {/* 검색창 */}
      <div
        style={{
          width: "60%",
          maxWidth: "280px",
          minWidth: "180px",
          margin: "0 auto",
          marginTop: "50px",
          marginBottom: "40px",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.35,
            fontSize: "15px",
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
          <label
            htmlFor="todo-search"
            style={{
              position: "absolute",
              left: "-9999px", // 화면에서는 숨기고, dom에서는 인식됨.
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          >
            할 일 검색
          </label>
        <input
          id="todo-search"
          name="todoSearch"
          value={search}
          onChange={onChangeSearch}
          placeholder="  검색어를 입력해주세요."
          style={{
            width: "100%",
            padding: "8px 0px 8px 22px",
            border: "none",
            borderBottom: "1px solid rgba(0,0,0,0.15)",
            background: "transparent",
            fontSize: "16px",
            outline: "none",
          }}
        />

        {search && (
          <button
            onClick={onClearSearch}
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "14px",
              opacity: 0.45,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* 입력 칸 */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          marginBottom: "40px",
        }}
      >
        <TodoEditor onCreate={handleCreate} />
      </div>

      {/* 리스트 */}
      <div
        className="list_wrapper"
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          marginTop: "10px",
          marginBottom: "80px",
          padding: "0 4px" 
        }}
      >
        {filteredTodos.map((it) => (
          <TodoItem
            key={it.todoId}
            todoId={it.todoId}
            content={it.content}
            complete={it.complete}
            regDate={it.regDate}
            onToggle={handleToggle}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, color }) => (
  <div
    style={{
      flex: 1,
      padding: "28px 0",
      textAlign: "center",
      background: "#F7F6F2",
      border: "1px solid rgba(0,0,0,0.08)",
    }}
  >
    <div style={{ fontSize: "14px", opacity: 0.6 }}>{label}</div>
    <strong style={{ fontSize: "24px", color: color || "#333" }}>
      {value}
    </strong>
  </div>
);

export default TodoList;
