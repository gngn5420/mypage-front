import { useRef, useState } from "react";

const TodoEditor = ({ onCreate }) => {
  const [content, setContent] = useState("");
  const inputRef = useRef();

  const onKeyDown = (e) => {
    if (e.key === "Enter") onSubmit();
  };

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  // const onSubmit = () => {
  //   if (!content.trim()) {
  //     inputRef.current.focus();
  //     return;
  //   }
  //   onCreate(content);
  //   setContent("");
  // };

  const onSubmit = () => {
  if (!content.trim()) return;
  onCreate(content);
  setContent("");
};


  return (
    <div
      className="TodoEditor"
      style={{
        width: "100%",
        margin: "0 auto",
        padding: "12px 0",
        borderBottom: "1px dashed rgba(0,0,0,0.15)",
        background: "transparent",
      }}
    >
      <h4
        style={{
          marginBottom: "12px",
          fontSize: "16px",
          fontWeight: 500,
          color: "#333",
        }}
      >
        ✏️ 새로운 Todo 작성하기
      </h4>

      {/* 입력 박스 */}
      <div
        className="editor_wrapper"
        style={{
          display: "flex",
          gap: "10px",
          width: "100%",
        }}
      >
        <input
          ref={inputRef}
          value={content}
          onChange={onChangeContent}
          onKeyDown={onKeyDown}
          placeholder="오늘의 할 일을 입력하세요."
          style={{
            flexGrow: 1,
            padding: "10px 4px",
            border: "none",
            borderBottom: "1px solid rgba(0,0,0,0.22)",
            fontSize: "16px",
            background: "transparent",
            outline: "none",
          }}
        />

        <button
          onClick={onSubmit}
          style={{
            padding: "8px 14px",
            background: "transparent",
            border: "1px solid rgba(0,0,0,0.3)",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            whiteSpace: "nowrap",
            color: "#333",
          }}
        >
          추가
        </button>
      </div>
    </div>
  );
};

export default TodoEditor;
