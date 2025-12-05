import { useReducer, useRef, useCallback } from "react";

// 더미 데이터
export const MockTodo = [
  {
    id: 0,
    isDone: false,
    content: "낮잠자기",
    createDate: new Date().getTime(),
  },
  {
    id: 1,
    isDone: false,
    content: "웹툰보기",
    createDate: new Date().getTime(),
  },
  {
    id: 2,
    isDone: false,
    content: "노래 연습하기",
    createDate: new Date().getTime(),
  },
];

// Reducer 함수
function reducer(state, action) {
  switch (action.type) {
    case "CREATE":
      return [action.newItem, ...state];
    case "UPDATE":
      return state.map((it) =>
        it.id === action.targetId ? { ...it, isDone: !it.isDone } : it
      );
    case "DELETE":
      return state.filter((it) => it.id !== action.targetId);
    default:
      return state;
  }
}

// useTodo 커스텀 훅
export function useTodo(initialTodos = MockTodo) {
  /* 아이템이 늘어날 때 마다 Id값 1씩 늘어나도록 함 */
  const idRef = useRef(initialTodos.length);
  const [todo, dispatch] = useReducer(reducer, initialTodos);

  /* 새 할 일 아이템 추가 */
  const onCreate = useCallback((content) => {
    dispatch({
      type: "CREATE",
      newItem: {
        id: idRef.current,
        content,
        isDone: false,
        createDate: new Date().getTime(),
      },
    });
    idRef.current += 1;
  }, []);

  /* 완료/취소 토글 */
  const onUpdate = useCallback((targetId) => {
    dispatch({
      type: "UPDATE",
      targetId,
    });
  }, []);

  /* 삭제 */
  const onDelete = useCallback((targetId) => {
    dispatch({
      type: "DELETE",
      targetId,
    });
  }, []);

  // 반드시 필요한 반환
  return { todo, onCreate, onUpdate, onDelete };
}
