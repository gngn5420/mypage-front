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
  { id: 1, name: '미라클 모닝 05:30', emoji: '☀️' },
  { id: 2, name: '운동하기', emoji: '💪' },
  { id: 3, name: '책 읽기', emoji: '📚' },
];
const LOCAL_STORAGE_KEY = 'habitTrackerData';
const AVAILABLE_EMOJIS = ['✨', '📌', '💻', '📚', '💧', '🏃🏻'];


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


  // 그래프 데이터 & UI 설정 (Chart.js)
  // const chartData = {
  //   labels: weekDates.map(date => date.substring(5)), // 월-일만 표시
  //   datasets: [
  //     {
  //       label: 'Daily Progress (%)',
  //       data: progressData, 
  //       borderColor: 'rgb(75, 192, 192)',
  //       backgroundColor: 'rgba(75, 192, 192, 0.2)',
  //       fill: true,
  //       tension: 0.4,
  //     },
  //   ],
  // };

  const chartData = {
    labels: weekDates.map(date => date.substring(5)),
    datasets: [
      {
        label: 'Progress (%)',
        data: progressData,
        borderColor: '#4a5568', // 진회색 라인 (뉴스 톤)
        backgroundColor: 'rgba(74, 85, 104, 0.15)', // 연한 회색 배경
        borderWidth: 2,
        fill: true,
        tension: 0.35, // 자연스러운 곡선
        // pointRadius: 3, // 동그란 점
        // pointBackgroundColor: '#4a5568',
        // pointHoverRadius: 5,
      }
    ]
  };

  // 차트 옵션
  // const chartOptions = {
  //   responsive: true,
  //   scales: {
  //     y: {
  //       min: 0,
  //       max: 100,
  //       title: { display: true, text: 'Progress (%)' }
  //     }
  //   },
  //   plugins: {
  //       title: { display: true, text: 'Weekly Habit Progress' }
  //   }
  // };

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false, // 라벨 숨기기
      },
      tooltip: {
        titleColor: '#333',
        bodyColor: '#444',
        backgroundColor: 'white',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
      }
    },

    scales: {
      x: {
        grid: {
          display: false, // X축 그리드 제거
        },
        ticks: {
          color: '#666',
          font: { size: 12 }
        },
      },
      y: {
        grid: {
          color: '#eee', // 아주 연한 회색
        },
        ticks: {
          color: '#666',
          font: { size: 12 },
          callback: (value) => `${value}%`
        },
        min: 0,
        max: 100
      }
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
            style={{ padding: '10px 15px', backgroundColor: '#3dd176ff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Add Habit
          </button>
        </div>
      </div>


      {/* 📋 습관 체크 테이블 */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
          textAlign: 'center',
          fontSize: '14px',
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: '#fafafa',
              borderBottom: '1px solid #eee',
            }}
          >
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                minWidth: '200px',
                fontWeight: '600',
                color: '#444',
              }}
            >
              My habits
            </th>

            {weekDates.map((date) => (
              <th
                key={date}
                style={{
                  padding: '12px 6px',
                  color: '#777',
                  fontSize: '12px',
                  borderLeft: '1px solid #f0f0f0',
                  fontWeight: '500',
                }}
              >
                {new Date(date).toLocaleString('en-us', { weekday: 'short' })}
                <br />
                <span style={{ fontSize: '11px' }}>{date.slice(5)}</span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {habits.map((habit) => (
            <tr
              key={habit.id}
              style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                border: '1px solid #e5e5e5',
              }}
            >
              {/* 습관 이름 */}
              <td
                style={{
                  padding: '14px',
                  textAlign: 'left',
                  fontWeight: '500',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRight: '1px solid #f5f5f5',
                }}
              >
                <div style={{ color: '#333' }}>
                  {habit.emoji} {habit.name}
                </div>

                <button
                  onClick={() => handleRemoveHabit(habit.id)}
                  title="Remove Habit"
                  style={{
                    background: 'none',
                    border: '1px solid #ddd',
                    color: '#b33',
                    padding: '3px 7px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  &times;
                </button>
              </td>

              {/* 체크박스 열 */}
              {weekDates.map((date) => (
                <td key={date} style={{ padding: '14px 0' }}>
                  <input
                    type="checkbox"
                    checked={!!checkedState[`${habit.id}-${date}`]}
                    onChange={() => handleCheck(habit.id, date)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      accentColor: '#444', // 체크박스 색감 뉴스 톤과 맞춤
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        {/* 진행률 */}
        <tfoot>
          <tr
            style={{
              backgroundColor: '#fafafa',
              borderTop: '1px solid #eee',
            }}
          >
            <td
              style={{
                padding: '14px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#444',
              }}
            >
              📊 진행률(%)
            </td>

            {progressData.map((progress, index) => (
              <td key={index} style={{ padding: '14px', fontWeight: '600' }}>
                <span
                  style={{
                    color:
                      progress >= 70
                        ? '#48c184ff'
                        : progress > 0
                          ? '#ff802bff'
                          : '#999',
                  }}
                >
                  {Math.round(progress)}%
                </span>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>


      <hr style={{ margin: '50px 0' }} />

      {/* 📈 그래프 영역 */}
      <div style={{ height: '350px' }}>
        <h2>📈 Weekly Progress Chart</h2>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* <div style={{
        height: '350px',
        padding: '25px',
        backgroundColor: 'white',
        border: '1px solid #eee',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '15px'
        }}>
          📈 Weekly Progress Chart
        </h2>
        <Line data={chartData} options={chartOptions} />
      </div> */}
    </div>
  );
}

export default HabitTracker;