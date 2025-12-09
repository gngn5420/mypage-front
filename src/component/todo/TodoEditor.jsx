import { useEffect, useRef, useState } from "react";
import todoApi from '../../api/todoApi'
import { useNavigate } from "react-router-dom";

// 날짜 출력 형식 
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

// 입력필드에서 Enter 누르면 oncreate 함수를 호출 -> 새로운 할 일 추가 
const TodoEditor = ({ onCreate }) => {
  const [content, setContent] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [username, setUsername] = useState("") // username 상태 추가 
  const inputRef = useRef(null);
  const navigate = useNavigate()


// 로그인된 사용자 정보 fetch
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");  // 로컬스토리지에서 JWT 토큰 가져오기
        if (!token) {
          console.error("No token found");
          return;
        }

        // 서버에서 로그인된 사용자 정보 받아오기
        const response = await todoApi.get("/api/user/me", {  // 경로 수정: /api/user/me로 수정
          headers: {
            Authorization: `Bearer ${token}`,  // JWT 토큰을 Authorization 헤더에 포함시켜 요청
          },
        });

        setUsername(response.data.username);  // 받아온 username을 상태에 저장
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();  // 컴포넌트 렌더링 시 사용자 정보 가져오기
  }, []);


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

  // 추가 버튼 클릭시 보내는 데이터 
  const onSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
        inputRef.current?.focus();
        return;
    }

    try {
        const token = localStorage.getItem("accessToken");
        const response = await todoApi.post("/api/todo/add", {
            content: trimmed,
            username: username,  // 받아온 username 사용
            complete: false,  // 완료 상태 초기값
            regDate: formatDate(new Date()),  // 날짜를 형식에 맞춰 전송
            updateDate: formatDate(new Date()),
        },
              {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
          },
        }
      );

        onCreate(response.data);  // 부모 컴포넌트로 새로운 할 일 데이터 전달
        setContent("");
        navigate("/todo")
          } catch (error) {
        console.error("Error adding todo:", error.response ? error.response.data : error);
    }
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
