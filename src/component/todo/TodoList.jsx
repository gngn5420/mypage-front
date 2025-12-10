// import { useState, useMemo, useEffect } from "react";
// import TodoItem from './TodoItem'
// import TodoEditor from "./TodoEditor";
// import "./TodoList.css";
// import axios from "../../api/axios";

// const TodoList = () => {
//   const [todos, setTodos] = useState([]) // 할 일 목록 상태 
//   const [search, setSearch] = useState("");

//   // 🌟 할 일 목록을 백엔드에서 가져오는 함수 추가
//   useEffect(() => {
//     const fetchTodos = async () => {
//       try {
//         // 경로를 "/api/todo/list"로 수정
//         const response = await axios.get("/api/todo/list");
//         if (Array.isArray(response.data)) {
//           setTodos(response.data); // 가져온 데이터를 상태에 저장
//         } else {
//           console.error("Fetched data is not an array:", response.data);
//           setTodos([]); // 배열이 아니면 빈 배열로 초기화
//         }
//       } catch (error) {
//         console.error("Error fetching todos:", error);
//         setTodos([]); // 오류 발생 시 빈 배열로 초기화
//       }
//     };
//     fetchTodos();
//   }, []);

//   // 새로운 할 일 추가 함수
//   const handleCreate = async (newTodo) => {
//     try {
//       setTodos([...todos, newTodo]);  // 새로 추가된 할 일을 상태에 추가
//     } catch (error) {
//       console.error("Error adding todo:", error);
//     }
//   };


//   // 할 일 토글 함수 
// const handleToggle = async (id) => {
//   try {
//     // 서버로 상태 변경 요청
//     const response = await axios.put(`/api/todo/toggle/${id}`);

//     // 서버 응답 후 로컬 상태 업데이트
//     setTodos(prevTodos =>
//       prevTodos.map(todo =>
//         todo.todoId === id ? { ...todo, complete: response.data.isDone } : todo
//       )
//     );
//   } catch (error) {
//     console.error("Error toggling todo:", error);
//   }
// };

//   // 🌟 할 일 수정 (API 요청으로 수정)
//   const handleUpdate = async (id, content) => {
//     try {
//       const response = await axios.put(`/api/todo/update/${id}`, { content }); // 🌟 수정된 내용을 PUT 요청으로 보내기
//       setTodos(todos.map(todo => todo.id === id ? { ...todo, content: response.data.content } : todo)); // 🌟 수정된 내용으로 상태 업데이트
//     } catch (error) {
//       console.error("Error updating todo:", error);
//       if(error.response)
//         console.error("Server error:", error.response.data)
//     }
//   };

//   // 🌟 할 일 삭제 (API 요청으로 삭제)
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`/api/todo/delete/${id}`); // 서버에서 데이터 삭제 요청 

//       // 삭제 후 서버에서 최신 할 일 목록 다시 가져오기 
//       const response = await axios.get("/api/todo/list")// 최신 데이터 가져오는 get 요청
//       setTodos(response.data) // 최신 데이터를 상태에 저장해 화면에 반영함. 
//     } catch (error) {
//       console.error("Error deleting todo:", error);
//     }
//   };


//   const onChangeSearch = (e) => setSearch(e.target.value);
//   const onClearSearch = () => setSearch("");


//   const getSearchResult = useMemo(() => {
//     // todos가 배열인지 확인하고 필터링
//     if (!Array.isArray(todos)) return []; // todos가 배열이 아니면 빈 배열 반환
//     return search === ""
//       ? todos
//       : todos.filter((it) =>
//         it.content.toLowerCase().includes(search.toLowerCase())
//       );
//   }, [todos, search]); // todos나 search가 변경될 때마다 새로 계산


//   const analyzeTodo = useMemo(() => {
//     const totalCount = todos.length;
//     const doneCount = todos.filter((it) => it.isDone).length;
//     const notDoneCount = totalCount - doneCount;
//     return { totalCount, doneCount, notDoneCount };
//   }, [todos]);

//   const { totalCount, doneCount, notDoneCount } = analyzeTodo;

//   return (
//     <div
//       className="TodoList"
//       style={{
//         width: "100%",
//         maxWidth: "900px",
//         margin: "0 auto",
//         padding: "0",
//       }}
//     >
//       {/* 제목 */}
//       <h1
//         style={{
//           fontSize: "40px",
//           fontWeight: 500,
//           color: "#333",
//           marginBottom: "40px",
//           marginTop: "60px",
//           textAlign: "center",
//         }}
//       >
//         🧃 오늘의 할 일
//       </h1>

//       {/* 요약 카드 */}
//       <div
//         style={{
//           display: "flex",
//           gap: "16px",
//           marginBottom: "70px",
//         }}
//       >
//         <SummaryCard label="총" value={totalCount} />
//         <SummaryCard label="완료" value={doneCount} color="#13d295ff" />
//         <SummaryCard label="미완료" value={notDoneCount} color="#ff9c2bff" />
//       </div>

//       {/* 검색창 */}
//       <div
//         style={{
//           width: "60%",
//           maxWidth: "280px",
//           minWidth: "180px",
//           margin: "0 auto",
//           marginTop: "50px",
//           marginBottom: "40px",
//           position: "relative",
//         }}
//       >
//         <span
//           style={{
//             position: "absolute",
//             left: 0,
//             top: "50%",
//             transform: "translateY(-50%)",
//             opacity: 0.35,
//             fontSize: "15px",
//             pointerEvents: "none",
//           }}
//         >
//           🔍
//         </span>

//         <input
//           value={search}
//           onChange={onChangeSearch}
//           placeholder="  검색어를 입력해주세요."
//           style={{
//             width: "100%",
//             padding: "8px 0px 8px 22px",
//             border: "none",
//             borderBottom: "1px solid rgba(0,0,0,0.15)",
//             background: "transparent",
//             fontSize: "16px",
//             outline: "none",
//           }}
//         />

//         {search && (
//           <button
//             onClick={onClearSearch}
//             style={{
//               position: "absolute",
//               right: 0,
//               top: "50%",
//               transform: "translateY(-50%)",
//               border: "none",
//               background: "transparent",
//               cursor: "pointer",
//               fontSize: "14px",
//               opacity: 0.45,
//             }}
//           >
//             ✕
//           </button>
//         )}
//       </div>

//       {/* 입력 칸 (TodoEditor) */}
//       <div
//         style={{
//           width: "100%",
//           maxWidth: "900px",
//           margin: "0 auto",
//           marginBottom: "40px",
//         }}
//       >
//         <TodoEditor onCreate={handleCreate} />
//       </div>

//       {/* 리스트 */}
//       <div
//         className="list_wrapper"
//         style={{
//           width: "100%",
//           maxWidth: "900px",
//           margin: "0 auto",
//           marginTop: "10px",
//           marginBottom: "80px",
//         }}
//       >
//         {/* {getSearchResult().map((it) => ( */}
//         {getSearchResult.map((it) => (
//           <TodoItem
//             key={it.todoId} // 각 항목을 고유하게 식별하는데 사용함
//             id={it.todoId}
//             content={it.content}
//             isDone={it.complete}
//             createDate={it.regDate}
//             // onToggle={onToggle}
//             // onEdit={onEdit}
//             // onDelete={onDelete}
//             handleToggle={handleToggle} // 🌟 API 호출된 onToggle 함수 전달
//             handleUpdate={handleUpdate} // 🌟 API 호출된 onEdit 함수 전달
//             handleDelete={handleDelete} // 🌟 API 호출된 onDelete 함수 전달
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// const SummaryCard = ({ label, value, color }) => (
//   <div
//     style={{
//       flex: 1,
//       padding: "28px 0",
//       textAlign: "center",
//       background: "#F7F6F2",
//       border: "1px solid rgba(0,0,0,0.08)",
//     }}
//   >
//     <div style={{ fontSize: "14px", opacity: 0.6 }}>{label}</div>
//     <strong style={{ fontSize: "24px", color: color || "#333" }}>
//       {value}
//     </strong>
//   </div>
// );

// export default TodoList;


import { useState, useMemo, useEffect, useCallback } from "react";
import TodoItem from "./TodoItem";
import TodoEditor from "./TodoEditor";
import "./TodoList.css";
import axios from "../../api/axios";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ 목록 불러오기
  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get("/api/todo/list");
      setTodos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // ✅ 생성
  // 가정: TodoEditor에서 서버 생성 후 "생성된 todo 객체"를 onCreate로 넘겨줌
  const handleCreate = async (createdTodo) => {
    if (!createdTodo) return;
    setTodos((prev) => [...prev, createdTodo]);
    // 생성 흐름이 불확실하면 아래로 교체:
    // await fetchTodos();
  };

  // ✅ 토글
  const handleToggle = async (todoId) => {
    try {
      const response = await axios.put(`/api/todo/toggle/${todoId}`);
      const nextComplete = response.data?.complete;

      setTodos((prev) =>
        prev.map((todo) =>
          todo.todoId === todoId
            ? { ...todo, complete: nextComplete ?? !todo.complete }
            : todo
        )
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  // ✅ 수정
  const handleUpdate = async (todoId, content) => {
    try {
      const response = await axios.put(`/api/todo/update/${todoId}`, { content });
      const nextContent = response.data?.content ?? content;

      setTodos((prev) =>
        prev.map((todo) =>
          todo.todoId === todoId ? { ...todo, content: nextContent } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
      if (error.response) console.error("Server error:", error.response.data);
    }
  };

  // ✅ 삭제
  const handleDelete = async (todoId) => {
    try {
      await axios.delete(`/api/todo/delete/${todoId}`);
      // 가장 안전한 동기화
      await fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // ✅ 검색
  const onChangeSearch = (e) => setSearch(e.target.value);
  const onClearSearch = () => setSearch("");

  const filteredTodos = useMemo(() => {
    if (!Array.isArray(todos)) return [];
    const q = search.trim().toLowerCase();
    if (!q) return todos;
    return todos.filter((it) =>
      (it.content ?? "").toLowerCase().includes(q)
    );
  }, [todos, search]);

  // ✅ 집계(complete 기준으로 단일화)
  const analyzeTodo = useMemo(() => {
    const totalCount = todos.length;
    const doneCount = todos.filter((it) => it.complete).length;
    const notDoneCount = totalCount - doneCount;
    return { totalCount, doneCount, notDoneCount };
  }, [todos]);

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
      <div style={{ display: "flex", gap: "16px", marginBottom: "70px" }}>
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
          placeholder="  검색어를 입력해주세요."
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

      {/* 입력 칸 */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          marginBottom: "40px",
        }}
      >
        <TodoEditor onCreate={handleCreate} />
      </div>

      {/* 리스트 */}
      <div
        className="list_wrapper"
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          marginTop: "10px",
          marginBottom: "80px",
        }}
      >
        {filteredTodos.map((it) => (
          <TodoItem
            key={it.todoId}
            todoId={it.todoId}
            content={it.content}
            complete={it.complete}
            regDate={it.regDate}
            onToggle={handleToggle}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, color }) => (
  <div
    style={{
      flex: 1,
      padding: "28px 0",
      textAlign: "center",
      background: "#F7F6F2",
      border: "1px solid rgba(0,0,0,0.08)",
    }}
  >
    <div style={{ fontSize: "14px", opacity: 0.6 }}>{label}</div>
    <strong style={{ fontSize: "24px", color: color || "#333" }}>
      {value}
    </strong>
  </div>
);

export default TodoList;
