import React from "react";

const TodoItem = ({ id, content, isDone, createDate, onUpdate, onDelete }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "28px 1fr 120px 70px",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px dashed rgba(0,0,0,0.15)",
        background: "transparent",
        fontSize: "18px",
      }}
    >

      {/* 체크박스 - 초미니멀 */}
      <input
        type="checkbox"
        checked={isDone}
        onChange={() => onUpdate(id)}
        style={{
          width: "18px",
          height: "18px",
          cursor: "pointer",
          accentColor: "#333",     // 시스템 체크 스타일로 가장 깔끔함
        }}
      />

      {/* 내용 */}
      <div
        style={{
          paddingLeft: "10px",
          textDecoration: isDone ? "line-through" : "none",
          opacity: isDone ? 0.55 : 1,
          color: "#2F2F2F",
        }}
      >
        {content}
      </div>

      {/* 날짜 */}
      <div
        style={{
          fontSize: "16px",
          opacity: 0.6,
          textAlign: "right",
          paddingRight: "8px",
        }}
      >
        {new Date(createDate).toLocaleDateString()}
      </div>

      {/* 삭제 버튼 - 아주 심플 */}
      <button
        onClick={() => onDelete(id)}
        style={{
          background: "transparent",
          border: "1px solid rgba(0,0,0,0.25)",
          padding: "8px 14px",
          fontSize: "15px",
          cursor: "pointer",
          borderRadius: "5px",
          color: "#333",
        }}
      >
        삭제
      </button>

    </div>
  );
};

export default React.memo(TodoItem);
