


import React, { useState, useEffect } from "react";

const TodoItem = ({
  id,
  content,
  isDone,
  createDate,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const [enterPressed, setEnterPressed] = useState(false);

  useEffect(() => {
    setEditValue(content);
  }, [content]);

  const finishEdit = () => {
    if (enterPressed) return;
    setIsEditing(false);

    const trimmed = editValue.trim();
    if (trimmed && trimmed !== content.trim()) {
      onEdit(id, trimmed);
    }
  };

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
      <input
        type="checkbox"
        checked={isDone}
        onChange={() => onToggle(id)}
        style={{ width: "18px", height: "18px", cursor: "pointer" }}
      />

      <div
        style={{
          paddingLeft: "10px",
          textDecoration: isDone ? "line-through" : "none",
          opacity: isDone ? 0.55 : 1,
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

                const trimmed = editValue.trim();
                if (trimmed && trimmed !== content.trim()) {
                  onEdit(id, trimmed);
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

      <div
        style={{
          fontSize: "16px",
          opacity: 0.6,
          textAlign: "right",
          paddingRight: "14px",
        }}
      >
        {/* {new Date(createDate).toLocaleDateString()} */}
        {new Date(createDate).toLocaleDateString("ko-KR", {
          month: "long",
          day: "2-digit",
        })}


      </div>

      <button
        onClick={() => onDelete(id)}
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
