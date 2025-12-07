import { useState, useMemo } from "react";
import TodoItem from "./TodoItem";
import TodoEditor from "./TodoEditor";
import "./TodoList.css";

const TodoList = ({
  todo = [],
  onCreate = () => { },
  onUpdate = () => { },
  onDelete = () => { },
}) => {
  const [search, setSearch] = useState("");

  const onChangeSearch = (e) => setSearch(e.target.value);
  const onClearSearch = () => setSearch("");

  const getSearchResult = () =>
    search === ""
      ? todo
      : todo.filter((it) =>
        it.content.toLowerCase().includes(search.toLowerCase())
      );

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
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "70px",
        }}
      >
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

        <input
          value={search}
          onChange={onChangeSearch}
          placeholder=" 검색어를 입력해주세요."
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

      {/* TodoEditor — 폭 정확히 900px 맞춤 */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          marginBottom: "30px",
        }}
      >
        <TodoEditor onCreate={onCreate} />
      </div>

      {/* 리스트 */}
      <div className="list_wrapper"
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          marginTop: "10px"
        }}>
        {getSearchResult().map((it) => (
          <div
            key={it.id}
            style={{
              padding: "12px 2px",
              borderBottom: "1px dashed rgba(0,0,0,0.12)",
            }}
          >
            <TodoItem {...it} onUpdate={onUpdate} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, color }) => (
  <div
    style={{
      flex: 1,
      padding: "14px 0",
      textAlign: "center",
      background: "#F7F6F2",
      border: "1px solid rgba(0,0,0,0.08)",
    }}
  >
    <div style={{ fontSize: "14px", opacity: 0.6 }}>{label}</div>
    <strong style={{ fontSize: "24px", color: color || "#333" }}>{value}</strong>
  </div>
);

export default TodoList;
