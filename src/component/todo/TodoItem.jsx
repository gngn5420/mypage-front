import React, { useState, useEffect } from "react";

const TodoItem = ({
  todoId,
  content,
  complete,
  regDate,
  onToggle,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content ?? "");
  const [enterPressed, setEnterPressed] = useState(false);

  useEffect(() => {
    setEditValue(content ?? "");
  }, [content]);

  const finishEdit = () => {
    if (enterPressed) return;

    setIsEditing(false);
    const trimmed = (editValue ?? "").trim();

    if (trimmed && trimmed !== (content ?? "").trim()) {
      onUpdate(todoId, trimmed);
    }
  };

  const safeDate = regDate ? new Date(regDate) : null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "28px 1fr 150px 70px",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px dashed rgba(0,0,0,0.15)",
        background: "transparent",
        fontSize: "18px",
      }}
    >
      {/* 체크박스(Controlled) */}
      <input
        type="checkbox"
        id={`todo-checkbox-${todoId}`}
        checked={!!complete}
        onChange={() => onToggle(todoId)}
        style={{
          width: "18px",
          height: "18px",
          cursor: "pointer",
          accentColor: "#333",
        }}
      />

      {/* 내용 */}
      <div
        style={{
          paddingLeft: "10px",
          textDecoration: complete ? "line-through" : "none",
          opacity: complete ? 0.55 : 1,
          cursor: "pointer",
        }}
        onClick={() => setIsEditing(true)}
      >
        {isEditing ? (
          <input
            value={editValue}
            autoFocus
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={finishEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEnterPressed(true);
                setIsEditing(false);

                const trimmed = (editValue ?? "").trim();
                if (trimmed && trimmed !== (content ?? "").trim()) {
                  onUpdate(todoId, trimmed);
                }

                setTimeout(() => setEnterPressed(false), 0);
              }
            }}
            style={{
              width: "100%",
              fontSize: "18px",
              border: "none",
              background: "transparent",
              outline: "none",
            }}
          />
        ) : (
          editValue
        )}
      </div>

      {/* 날짜 */}
      <div
        style={{
          fontSize: "16px",
          opacity: 0.6,
          textAlign: "right",
          paddingRight: "14px",
        }}
      >
        {safeDate
          ? safeDate.toLocaleDateString("ko-KR", {
              month: "long",
              day: "2-digit",
            })
          : ""}
      </div>

      {/* 삭제 */}
      <button
        onClick={() => onDelete(todoId)}
        style={{
          background: "transparent",
          border: "1px solid rgba(0,0,0,0.25)",
          padding: "8px 14px",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        삭제
      </button>
    </div>
  );
};

export default TodoItem;
