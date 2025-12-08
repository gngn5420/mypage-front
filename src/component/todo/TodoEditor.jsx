// src/component/todo/TodoEditor.jsx
import { useRef, useState } from "react";

const TodoEditor = ({ onCreate }) => {
  const [content, setContent] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef(null);

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.nativeEvent.isComposing || isComposing) return;
      e.preventDefault();
      onSubmit();
    }
  };

  const onSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    onCreate(trimmed);
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
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={onKeyDown}
          placeholder="  오늘의 할 일을 입력하세요."
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
