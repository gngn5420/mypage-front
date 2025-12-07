import React, { useState, useMemo, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // ★★★ 이거 꼭 추가해야 fill이 작동함
);


// 초기 데이터
const initialHabits = [
  { id: 1, name: '미라클 모닝', emoji: '☀️' },
  { id: 2, name: '운동하기', emoji: '💪' },
  { id: 3, name: '책 읽기', emoji: '📚' },
  { id: 4, name: '작업하기', emoji: '💻' },
];

const LOCAL_STORAGE_KEY = 'habitTrackerData';
const AVAILABLE_EMOJIS = ['✨', '📌', '💻', '📚', '💧', '🏃🏻','🍵','🍎','🎨','🛏️'];

// 최근 7일 날짜
const getDates = (count) => {
  const dates = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
};
const weekDates = getDates(7);


// 컴포넌트 시작
function HabitTracker() {
  const loadInitialState = () => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return { habits: initialHabits, checkedState: {} };
  };

  const [data, setData] = useState(loadInitialState);
  const { habits, checkedState } = data;

  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitEmoji, setNewHabitEmoji] = useState('✨');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // 표 날짜 양식
  const formatDisplayDate = (dateString) => {
  const date = new Date(dateString);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const weekday = date.toLocaleDateString('ko', { weekday: 'short' });
  return `${mm}/${dd} (${weekday})`;
};

  // ---------------------------- 로직 ----------------------------
  const handleCheck = (habitId, date) => {
    const key = `${habitId}-${date}`;
    setData((prev) => ({
      ...prev,
      checkedState: { ...prev.checkedState, [key]: !prev.checkedState[key] },
    }));
  };

  const handleAddHabit = () => {
    if (newHabitName.trim() === '') return;

    const newHabit = {
      id: Math.max(...habits.map((h) => h.id), 0) + 1,
      name: newHabitName.trim(),
      emoji: newHabitEmoji,
    };

    setData((prev) => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));

    setNewHabitName('');
    setNewHabitEmoji('✨');
  };

  const handleRemoveHabit = (habitId) => {
    setData((prev) => {
      const newHabits = prev.habits.filter((h) => h.id !== habitId);

      const newCheckedState = Object.keys(prev.checkedState).reduce((acc, key) => {
        if (!key.startsWith(`${habitId}-`)) acc[key] = prev.checkedState[key];
        return acc;
      }, {});

      return {
        habits: newHabits,
        checkedState: newCheckedState,
      };
    });
  };

  const progressData = useMemo(() => {
    if (habits.length === 0) return weekDates.map(() => 0);

    return weekDates.map((date) => {
      let completed = 0;
      habits.forEach((habit) => {
        if (checkedState[`${habit.id}-${date}`]) completed += 1;
      });
      return (completed / habits.length) * 100;
    });
  }, [checkedState, habits]);


// ---------------------------- 그래프 ----------------------------
const chartData = {
  // labels: weekDates.map(d => d.slice(5)),
  labels: weekDates.map((d) => {
  const date = new Date(d);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${mm}/${dd}`;
}),

  datasets: [
    {
      label: "Progress",
      data: progressData,
      borderColor: "#333",
      borderWidth: 3,
      tension: 0.2,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: "#333",
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: "#eee" }, min: 0, max: 100 },
  },
};

  // ---------------------------- 렌더링 ----------------------------
  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '30px 4px',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI'",
      }}
    >
      {/* 제목 */}
      <h1
        style={{
          textAlign: 'center',
          fontWeight: 500,
          fontSize: '40px',
          marginBottom: '40px',
        }}
      >
        🗓️ Habit Tracker
      </h1>

      {/* 새로운 습관 추가 */}
      <h4 style={{ fontSize: '16px', marginBottom: '20px' }}>
        ✏️ 새로운 습관 추가
      </h4>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '70px' }}>
        <select
          value={newHabitEmoji}
          onChange={(e) => setNewHabitEmoji(e.target.value)}
          style={{
            padding: '8px 8px',
            border: '1px solid rgba(0,0,0,0.25)',
            borderRadius: "2px",
            fontSize: '16px',
            backgroundColor: "transparent",
          }}
        >
          {AVAILABLE_EMOJIS.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>

        <input
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="새로운 습관을 입력하세요."
          style={{
            flexGrow: 1,
            padding: '8px 4px',
            fontSize: '16px',
            border: 'none',
            borderBottom: '1px solid rgba(0,0,0,0.25)',
            outline: 'none',
            backgroundColor: "transparent"
          }}
        />

        <button
          onClick={handleAddHabit}
          style={{
            padding: '8px 14px',
            border: '1px solid rgba(0,0,0,0.4)',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '15px',
            borderRadius: "5px"
          }}
        >
          추가
        </button>
      </div>

      {/* 날짜 헤더 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `180px repeat(${weekDates.length}, 1fr) 60px`,
          borderBottom: '1px dashed rgba(0,0,0,0.15)',
          paddingBottom: '12px',
          marginBottom: '10px',
          opacity: 0.7,
          fontSize: '14px',
          textAlign: 'center',
        }}
      >
        <div style={{ textAlign: 'left' }}>습관</div>
        {/* {weekDates.map((d) => (
          <div key={d}>{new Date(d).toLocaleDateString('ko', { weekday: 'short' })}</div>
        ))} */}
        {weekDates.map((d) => (
          <div key={d}>{formatDisplayDate(d)}</div>
        ))}

        <div></div>
      </div>

      {/* 리스트 */}
      {habits.map((habit) => (
        <div
          key={habit.id}
          style={{
            display: 'grid',
            gridTemplateColumns: `180px repeat(${weekDates.length}, 1fr) 60px`,
            alignItems: 'center',
            padding: '14px 0',
            borderBottom: '1px dashed rgba(0,0,0,0.1)',
            fontSize: '16px',
          }}
        >
          {/* 이름 */}
          {/* <div>{habit.emoji} {habit.name}</div> */}
          <div>
            <span style={{ marginRight: "12px" }}>{habit.emoji}</span>
            <span>{habit.name}</span>
          </div>

          {/* 체크박스 */}
          {weekDates.map((d) => (
            <div key={d} style={{ textAlign: 'center' }}>
              <input
                type="checkbox"
                checked={!!checkedState[`${habit.id}-${d}`]}
                onChange={() => handleCheck(habit.id, d)}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#333',
                  cursor: 'pointer',
                }}
              />
            </div>
          ))}

          {/* 삭제 버튼 */}
          <button
            onClick={() => handleRemoveHabit(habit.id)}
            style={{
              padding: '4px 6px',
              border: '1px solid rgba(0,0,0,0.25)',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              borderRadius:"5px"
            }}
          >
            삭제
          </button>
        </div>
      ))}

      <hr style={{ margin: '50px 0' }} />

      {/* 그래프 */}
      <div style={{ height: '350px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '40px', textAlign:"center" }}>📈 Weekly Progress Chart</h2>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default HabitTracker;
