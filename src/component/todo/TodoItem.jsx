import React, { useState, useEffect } from "react";


// 할 일 항목 표시, 수정, 완료 여부 토글, 삭제 기능
const TodoItem = ({
  id, // 부모 컴포넌트에서 전달받은 할 일의 고유 ID
  content, // 할 일 내용
  isDone, // 완료 여부 (체크박스 상태)
  createDate, // 생성일
  handleToggle, // 상태 토글 함수
  handleUpdate, // 할 일 수정 함수
  handleDelete, // 할 일 삭제 함수
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
      handleUpdate(id, trimmed);
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
      {/* <input
        type="checkbox"
        id={`todo-checkbox-${id}`} //id 속성
        checked={isDone}
        onChange={() => handleToggle(id)}
        style={{ width: "18px", height: "18px", cursor: "pointer" }}
      /> */}
      <input
          type="checkbox"
          id={`todo-checkbox-${id}`}
          checked={isDone || false}  // `isDone`이 `undefined`일 경우 `false`로 대체
          onChange={() => handleToggle(id)}  // 클릭 시 handleToggle 호출
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
          // <input
          //   value={editValue}
          //   autoFocus
          //   onChange={(e) => setEditValue(e.target.value)}
          //   onBlur={finishEdit}
          //   onKeyDown={(e) => {
          //     if (e.key === "Enter") {
          //       setEnterPressed(true);
          //       setIsEditing(false);

          //       const trimmed = editValue.trim();
          //       if (trimmed && trimmed !== content.trim()) {
          //         handleUpdate(id, trimmed);
          //       }

          //       setTimeout(() => setEnterPressed(false), 0);
          //     }
          //   }}
          //   style={{
          //     width: "100%",
          //     fontSize: "18px",
          //     border: "none",
          //     background: "transparent",
          //     outline: "none",
          //   }}
          // />
          <input
            value={editValue || ""}  // `editValue`가 undefined일 경우 빈 문자열로 대체
            onChange={(e) => setEditValue(e.target.value)}  // 입력값 변경 시 업데이트
            onBlur={finishEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEnterPressed(true);
                setIsEditing(false);

                const trimmed = editValue.trim();
                if (trimmed && trimmed !== content.trim()) {
                  handleUpdate(id, trimmed);
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
        onClick={() => handleDelete(id)}
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
