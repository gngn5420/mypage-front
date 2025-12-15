import React, { useState, useEffect } from "react";

// 할 일 1개를 담당하는 컴포넌트 
// 부모함수에서 받은 데이터 변경 (토글/수정/삭제)

const TodoItem = ({
  todoId,
  content,
  complete,
  regDate,
  onToggle,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false); // 지금 수정 모드인지 여부 
  const [editValue, setEditValue] = useState(content ?? ""); // input에 표시할 편집 중인 텍스트
  const [enterPressed, setEnterPressed] = useState(false); // Enter로 편집 끝낼 때, blur와 중복 호출을 막음 

  useEffect(() => { // 부모에서 content가 바뀌면 editValue도 그걸로 덮여써서 내용이 안 어긋나게 동기화 해줌. 
    setEditValue(content ?? "");
  }, [content]);

  const finishEdit = () => { // input이 blur될 때 (포커스 빠질 때) 호출 
    if (enterPressed) return; // 중복 방지로 return 

    setIsEditing(false); // 수정 종료
    const trimmed = (editValue ?? "").trim(); //

    if (trimmed && trimmed !== (content ?? "").trim()) { // 내용이 있고, 원래 content와 다르면 
      onUpdate(todoId, trimmed); // update 호출 -> 실제 수정은 부모에서 처리 
    }
  };

  const safeDate = regDate ? new Date(regDate) : null; //regdate가 있으면 Date 객체로 변환, 없으면 null 

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
        checked={!!complete} // boolean 강제 변환
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
            id={`todo-edit-${todoId}`}
            name="todoContent"
            value={editValue}
            autoFocus
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={finishEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEnterPressed(true);
                setIsEditing(false);

                const trimmed = (editValue ?? "").trim(); // 앞 뒤 공백이 제거된 내용만 남김
                if (trimmed && trimmed !== (content ?? "").trim()) { // 공백만 있는 값은 없데이트 안하겠다. 
                  onUpdate(todoId, trimmed); // 실제 글자 내용이 같으면 update안하고 기존 내용과 실질적으로 다를 때만 업데이트하겠다.
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
