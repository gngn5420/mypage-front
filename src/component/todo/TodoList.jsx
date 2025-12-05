import { useState, useMemo } from "react";
import TodoItem from "./TodoItem";
import "./TodoList.css";
import TodoEditor from "./TodoEditor";

const TodoList = ({
  todo = [],
  onCreate = () => {},
  onUpdate = () => {},
  onDelete = () => {},
}) => {
  const [search, setSearch] = useState("");

  const onChangeSearch = (e) => setSearch(e.target.value);
  const onClearSearch = () => setSearch("");

  const getSearchResult = () => {
    return search === ""
      ? todo
      : todo.filter((it) =>
          it.content.toLowerCase().includes(search.toLowerCase())
        );
  };

  const analyzeTodo = useMemo(() => {
    const totalCount = todo.length;
    const doneCount = todo.filter((it) => it.isDone).length;
    const notDoneCount = totalCount - doneCount;

    return { totalCount, doneCount, notDoneCount };
  }, [todo]);

  const { totalCount, doneCount, notDoneCount } = analyzeTodo;

  return (
    <div
      className="TodoList"
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "30px" }}>
        🧃 오늘의 할 일
      </h1>

      {/* 요약 카드 */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div className="summary-card">
          <span className="label">총</span>
          <strong>{totalCount}</strong>
        </div>

        <div className="summary-card">
          <span className="label">완료</span>
          <strong style={{ color: "#059669" }}>{doneCount}</strong>
        </div>

        <div className="summary-card">
          <span className="label">미완료</span>
          <strong style={{ color: "#d97706" }}>{notDoneCount}</strong>
        </div>
      </div>

      {/* Todo 입력창 */}
      <TodoEditor onCreate={onCreate} />

      {/* 검색 */}
      <div
        className="search_wrapper"
        style={{ position: "relative", marginTop: "20px" }}
      >
        <input
          value={search}
          onChange={onChangeSearch}
          className="searchbar"
          placeholder="검색어로 할 일을 찾아보세요."
          style={{
            paddingRight: "30px",
            borderBottom: "2px solid #eee",
            paddingBottom: "12px",
            fontSize: "15px",
          }}
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
              color: "#aaa",
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* 리스트 */}
      <div className="list_wrapper" style={{ marginTop: "20px" }}>
        {getSearchResult().map((it) => (
          <div
            key={it.id}
            style={{
              backgroundColor: "white",
              padding: "16px",
              // borderRadius: "10px",
              // border: "1px solid #eee",
              // marginBottom: "3px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              transition: "0.2s",
            }}
            className="todo-card"
          >
            <TodoItem {...it} onUpdate={onUpdate} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
