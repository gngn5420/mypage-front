import React, { useState, useMemo, useEffect } from 'react';
// Chart.js를 사용하려면 'npm install chart.js react-chartjs-2'를 실행해야 합니다.
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
} from 'chart.js';

// Chart.js 필수 요소 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// ----------------------
// 1. 초기 데이터 및 유틸 함수
// ----------------------
const initialHabits = [
  { id: 1, name: 'Wake up at 05:00', emoji: '☀️' },
  { id: 2, name: 'Gym', emoji: '💪' },
  { id: 3, name: 'Reading/Learning', emoji: '📚' },
];
const LOCAL_STORAGE_KEY = 'habitTrackerData';
const AVAILABLE_EMOJIS = ['✨', '📌', '💻', '📚', '📝','💧','🏃🏻‍➡️'];


// 최근 N일의 날짜를 YYYY-MM-DD 형식으로 가져오는 함수
const getDates = (count) => {
  const dates = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10)); // 'YYYY-MM-DD' 형식
  }
  return dates;
};

const weekDates = getDates(7); // 최근 7일

// ----------------------
// 2. HabitTracker 컴포넌트 시작
// ----------------------
function HabitTracker() {
  // Local Storage에서 초기 상태를 로드하거나, 없으면 기본값 사용
  const loadInitialState = () => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
    return {
      habits: initialHabits,
      checkedState: {},
    };
  };

  const [data, setData] = useState(loadInitialState);
  const { habits, checkedState } = data;
  
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitEmoji, setNewHabitEmoji] = useState('✨'); // 수정된 기본 이모지 반영

  // Local Storage에 데이터 저장 (데이터가 변경될 때마다)
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);
  
// --- 데이터 핸들링 함수 ---

  // 체크박스 핸들러
  const handleCheck = (habitId, date) => {
    const key = `${habitId}-${date}`;
    setData(prevData => ({
      ...prevData,
      checkedState: {
        ...prevData.checkedState,
        [key]: !prevData.checkedState[key], // 토글
      },
    }));
  };

  // 새로운 습관 추가
  const handleAddHabit = () => {
    if (newHabitName.trim() === '') return;

    const newHabit = {
        id: Math.max(...habits.map(h => h.id), 0) + 1,
        name: newHabitName.trim(),
        emoji: newHabitEmoji,
    };

    setData(prevData => ({
      ...prevData,
      habits: [...prevData.habits, newHabit],
    }));
    
    setNewHabitName('');
    setNewHabitEmoji('✨'); 
  };

  // 습관 제거
  const handleRemoveHabit = (habitId) => {
    setData(prevData => {
      // 1. 습관 목록에서 제거
      const newHabits = prevData.habits.filter(habit => habit.id !== habitId);
      
      // 2. 제거된 습관과 관련된 체크 데이터도 제거
      const newCheckedState = Object.keys(prevData.checkedState).reduce((acc, key) => {
        if (!key.startsWith(`${habitId}-`)) {
          acc[key] = prevData.checkedState[key];
        }
        return acc;
      }, {});

      return {
        habits: newHabits,
        checkedState: newCheckedState,
      };
    });
  };


  // 진행률 계산 (데이터가 바뀔 때만 다시 계산)
  const progressData = useMemo(() => {
    if (habits.length === 0) return weekDates.map(() => 0);

    return weekDates.map(date => {
      let completed = 0;
      habits.forEach(habit => {
        if (checkedState[`${habit.id}-${date}`]) {
          completed += 1;
        }
      });
      const total = habits.length;
      return total > 0 ? (completed / total) * 100 : 0;
    });
  }, [checkedState, habits]);


  // 그래프 데이터 설정 (Chart.js)
  const chartData = {
    labels: weekDates.map(date => date.substring(5)), // 월-일만 표시
    datasets: [
      {
        label: 'Daily Progress (%)',
        data: progressData, 
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 100,
        title: { display: true, text: 'Progress (%)' }
      }
    },
    plugins: {
        title: { display: true, text: 'Weekly Habit Progress' }
    }
  };

  // ----------------------
  // 3. 렌더링
  // ----------------------
  return (
    <div className="habit-tracker" style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>🗓️ Habit Tracker</h1>
      
      {/* ➕ 습관 추가 UI (이모지/입력 순서, 스타일 유지) */}
      <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          
          {/* 1. 이모지 선택 창 */}
          <select
            value={newHabitEmoji}
            onChange={(e) => setNewHabitEmoji(e.target.value)}
            style={{ padding: '10px', border: '1px solid #ddd' }}
          >
            {AVAILABLE_EMOJIS.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>

          {/* 2. 습관 이름 입력 칸 */}
          <input
            type="text"
            placeholder="새로운 루틴을 입력하세요."
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            style={{ padding: '10px', flexGrow: 1, border: '1px solid #ddd' }}
          />

          <button 
            onClick={handleAddHabit} 
            style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Add Habit
          </button>
        </div>
      </div>


      {/* 📋 습관 체크 테이블 */}
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 5px', textAlign: 'center' }}>
        <thead>
          <tr style={{ backgroundColor: '#e0e0e0' }}>
            <th style={{ padding: '10px', textAlign: 'left', minWidth: '200px' }}>My Habits</th>
            {weekDates.map(date => (
              <th key={date} style={{ padding: '10px', fontSize: '0.8em', borderLeft: '1px solid #ccc' }}>
                {new Date(date).toLocaleString('en-us', { weekday: 'short' })}
                <br />
                {date.slice(5)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map(habit => (
            <tr key={habit.id} style={{ borderBottom: '1px solid #eee', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              {/* 습관 이름 및 제거 버튼 */}
              <td style={{ padding: '10px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRight: '1px solid #eee' }}>
                <div>{habit.emoji} {habit.name}</div>
                <button 
                  onClick={() => handleRemoveHabit(habit.id)}
                  title="Remove Habit"
                  style={{ background: 'none', border: '1px solid #f44336', color: '#f44336', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8em' }}
                >
                  &times;
                </button>
              </td>
              {/* 날짜별 체크박스 */}
              {weekDates.map(date => (
                <td key={date} style={{ padding: '10px' }}>
                  <input
                    type="checkbox"
                    checked={!!checkedState[`${habit.id}-${date}`]}
                    onChange={() => handleCheck(habit.id, date)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        
        {/* ⬇️ Progress 행을 <tfoot> (테이블 바닥글)로 통합 (요청 반영) */}
        <tfoot>
          <tr style={{ backgroundColor: '#f0f0f0', borderTop: '3px solid #333' }}>
            <td style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Progress (%)</td>
            {progressData.map((progress, index) => (
              <td key={index} style={{ padding: '10px', fontWeight: 'bold' }}>
                <span style={{ color: progress >= 70 ? '#4CAF50' : (progress > 0 ? '#FF9800' : '#757575') }}>
                  {Math.round(progress)}%
                </span>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>

      <hr style={{ margin: '30px 0' }}/>

      {/* 📈 그래프 영역 */}
      <div style={{ height: '350px' }}>
        <h2>📈 Weekly Progress Chart</h2>
        <Line data={chartData} options={chartOptions} />
      </div>

    </div>
  );
}

export default HabitTracker;