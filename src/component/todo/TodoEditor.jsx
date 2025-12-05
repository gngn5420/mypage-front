import { useRef, useState } from "react";

const TodoEditor = ({ onCreate }) => {
  const [content, setContent] = useState("");
  const inputRef = useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 13) onSubmit();
  };

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const onSubmit = () => {
    if (!content) {
      inputRef.current.focus();
      return;
    }
    onCreate(content);
    setContent("");
  };

  return (
    <div
      className="TodoEditor"
      style={{
        backgroundColor: "white",
        border: "1px solid #eee",
        borderRadius: "12px",
        padding: "20px",
        marginTop: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <h4
        style={{
          marginBottom: "15px",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        새로운 Todo 작성하기 ✏️
      </h4>

      <div
        className="editor_wrapper"
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
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
            padding: "10px 8px",
            border: "none",
            borderBottom: "2px solid #eee",
            fontSize: "15px",
            outline: "none",
          }}
        />

        <button
          onClick={onSubmit}
          style={{
            padding: "10px 18px",
            backgroundColor: "#3dd176ff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
            transition: "0.2s",
          }}
        >
          추가
        </button>
      </div>
    </div>
  );
};

export default TodoEditor;
