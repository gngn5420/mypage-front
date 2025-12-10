import React, { useState, useMemo, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { habitApi } from "../../api/habitApi";
import "chart.js/auto";

const AVAILABLE_EMOJIS = [
  "✨", "📌", "✔", "💻", "📚", "🍀", "💧", "🛒", "🥰", "☕",
  "🧘", "🏊", "🛏️", "🎹", "🎻", "🐶", "💰", "⌛", "🥗", "💖"
];

// 최근 N일 날짜 배열 생성
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

function HabitTracker() {
  // ✅ 서버 연동 데이터
  const [data, setData] = useState({ habits: [], checkedState: {} });
  const { habits, checkedState } = data;

  // ✅ 새 습관 추가
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitEmoji, setNewHabitEmoji] = useState("✨");

  // ✅ 이름 수정
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // ✅ 이모지 수정
  const [editingEmojiId, setEditingEmojiId] = useState(null);
  const emojiBoxRef = useRef(null);

  // ✅ 리스트 hover 툴팁
  const [hoveredHabitId, setHoveredHabitId] = useState(null);

  // ✅ 그래프 hover 요약 카드
  const [isChartHover, setIsChartHover] = useState(false);

  // ✅ 습관 + 7일 체크 상태 서버에서 로드
  useEffect(() => {
    const load = async () => {
      const res = await habitApi.getHabitsWithLogs(weekDates);
      const rows = res.data ?? [];

      const nextHabits = rows.map((r) => ({
        id: r.habitId,
        name: r.name,
        emoji: r.emoji,
      }));

      const nextCheckedState = {};
      rows.forEach((r) => {
        const logs = r.logs || {};
        Object.entries(logs).forEach(([date, checked]) => {
          nextCheckedState[`${r.habitId}-${date}`] = !!checked;
        });
      });

      setData({ habits: nextHabits, checkedState: nextCheckedState });
    };

    load();
  }, []);

  // ✅ 외부 클릭 → 이모지 선택창 닫기
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        editingEmojiId !== null &&
        emojiBoxRef.current &&
        !emojiBoxRef.current.contains(e.target)
      ) {
        setEditingEmojiId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingEmojiId]);

  // 날짜 헤더 표시 포맷
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const weekday = date.toLocaleDateString("ko", { weekday: "short" });
    return `${mm}/${dd} (${weekday})`;
  };

  // ✅ 이름 수정 시작
  const startEdit = (habit) => {
    setEditingHabitId(habit.id);
    setEditingName(habit.name);
  };

  // ✅ 체크 토글 서버 연동
  const handleCheck = async (habitId, date) => {
    const res = await habitApi.toggleHabit(habitId, date);
    const updated = res.data;

    const key = `${habitId}-${date}`;
    setData((prev) => ({
      ...prev,
      checkedState: {
        ...prev.checkedState,
        [key]: !!updated.checked,
      },
    }));
  };

  // ✅ 습관 추가 서버 연동
  const handleAddHabit = async () => {
    if (!newHabitName.trim()) return;

    const res = await habitApi.addHabit({
      name: newHabitName.trim(),
      emoji: newHabitEmoji,
    });

    const saved = res.data;

    setData((prev) => ({
      ...prev,
      habits: [
        ...prev.habits,
        { id: saved.habitId, name: saved.name, emoji: saved.emoji },
      ],
    }));

    setNewHabitName("");
    setNewHabitEmoji("✨");
  };

  // ✅ 습관 삭제 서버 연동
  const handleRemoveHabit = async (habitId) => {
    await habitApi.deleteHabit(habitId);

    setData((prev) => {
      const newHabits = prev.habits.filter((h) => h.id !== habitId);

      const newCheckedState = Object.keys(prev.checkedState).reduce(
        (acc, key) => {
          if (!key.startsWith(`${habitId}-`)) acc[key] = prev.checkedState[key];
          return acc;
        },
        {}
      );

      return { habits: newHabits, checkedState: newCheckedState };
    });
  };

  // ✅ 이름 수정 완료 서버 연동
  const applyEdit = async () => {
    if (!editingName.trim()) {
      setEditingHabitId(null);
      return;
    }

    const res = await habitApi.updateHabitName(
      editingHabitId,
      editingName.trim()
    );
    const updated = res.data;

    setData((prev) => ({
      ...prev,
      habits: prev.habits.map((h) =>
        h.id === updated.habitId ? { ...h, name: updated.name } : h
      ),
    }));

    setEditingHabitId(null);
  };

  // ✅ 이모지 변경 서버 연동
  const applyEmoji = async (habitId, emoji) => {
    const res = await habitApi.updateHabitEmoji(habitId, emoji);
    const updated = res.data;

    setData((prev) => ({
      ...prev,
      habits: prev.habits.map((h) =>
        h.id === updated.habitId ? { ...h, emoji: updated.emoji } : h
      ),
    }));

    setEditingEmojiId(null);
  };

  // ✅ 주간 진행률(날짜별) 계산
  const progressData = useMemo(() => {
    if (habits.length === 0) return weekDates.map(() => 0);

    return weekDates.map((date) => {
      let completed = 0;
      habits.forEach((h) => {
        if (checkedState[`${h.id}-${date}`]) completed += 1;
      });
      return (completed / habits.length) * 100;
    });
  }, [checkedState, habits]);

  // ✅ 그래프 hover 요약용 통계
  const weeklyAvg = useMemo(() => {
    if (!progressData.length) return 0;
    const sum = progressData.reduce((a, b) => a + b, 0);
    return Math.round(sum / progressData.length);
  }, [progressData]);

  const weeklyMax = useMemo(() => {
    if (!progressData.length) return { value: 0, index: 0 };
    let idx = 0;
    progressData.forEach((v, i) => {
      if (v > progressData[idx]) idx = i;
    });
    return { value: Math.round(progressData[idx]), index: idx };
  }, [progressData]);

  const weeklyMin = useMemo(() => {
    if (!progressData.length) return { value: 0, index: 0 };
    let idx = 0;
    progressData.forEach((v, i) => {
      if (v < progressData[idx]) idx = i;
    });
    return { value: Math.round(progressData[idx]), index: idx };
  }, [progressData]);

  // ✅ 차트 데이터
  const chartData = useMemo(() => {
    return {
      labels: weekDates.map((d) => {
        const date = new Date(d);
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
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
  }, [progressData]);

  // ✅ 차트 옵션
  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "nearest",
        intersect: true,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: "white",
          titleColor: "#333",
          bodyColor: "#333",
          borderColor: "rgba(0,0,0,0.10)",
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            title: (items) => `날짜 ${items[0].label}`,
            label: (item) => `진행률 ${Math.round(item.parsed.y)}%`,
          },
        },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: { callback: (v) => `${v}%` },
        },
      },
    };
  }, []);

  // ✅ 특정 습관의 기간 진행률
  const getHabitPeriodPercent = (habitId, dates) => {
    if (!dates?.length) return 0;
    const done = dates.reduce((acc, d) => {
      return acc + (checkedState[`${habitId}-${d}`] ? 1 : 0);
    }, 0);
    return Math.round((done / dates.length) * 100);
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "30px 4px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "40px",
          marginBottom: "40px",
          fontWeight: 500,
          color: "#333",
        }}
      >
        🗓️ Habit Tracker
      </h1>

      {/* 새로운 습관 추가 */}
      <h4 style={{ fontSize: "16px", marginBottom: "20px" }}>
        ✏️ 새로운 습관 추가
      </h4>

      <div style={{ display: "flex", gap: "10px", marginBottom: "80px" }}>
        <select
          value={newHabitEmoji}
          onChange={(e) => setNewHabitEmoji(e.target.value)}
          style={{
            padding: "8px",
            border: "1px solid rgba(0,0,0,0.25)",
            background: "transparent",
            borderRadius: "4px",
          }}
        >
          {AVAILABLE_EMOJIS.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>

        <input
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === "Enter") handleAddHabit();
          }}
          placeholder="  새로운 습관을 입력하세요."
          style={{
            flexGrow: 1,
            padding: "8px 4px",
            fontSize: "16px",
            border: "none",
            borderBottom: "1px solid rgba(0,0,0,0.25)",
            background: "transparent",
          }}
        />

        <button
          onClick={handleAddHabit}
          style={{
            padding: "8px 14px",
            border: "1px solid rgba(0,0,0,0.4)",
            background: "transparent",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          추가
        </button>
      </div>

      {/* 날짜 헤더 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `180px repeat(${weekDates.length}, 1fr) 60px`,
          borderBottom: "1px dashed rgba(0,0,0,0.15)",
          paddingBottom: "12px",
          marginBottom: "10px",
          opacity: 0.7,
          fontSize: "15px",
          textAlign: "center",
        }}
      >
        <div
          style={{ textAlign: "left", marginLeft: "5px", fontSize: "16px" }}
        >
          ✷ 습관 목록
        </div>
        {weekDates.map((d) => (
          <div key={d} style={{ textAlign: "center" }}>
            {formatDisplayDate(d)}
          </div>
        ))}
      </div>

      {/* 리스트 */}
      {habits.map((habit) => {
        const habitPercent = getHabitPeriodPercent(habit.id, weekDates);
        const doneCount = weekDates.reduce(
          (acc, d) => acc + (checkedState[`${habit.id}-${d}`] ? 1 : 0),
          0
        );

        return (
          <div
            key={habit.id}
            onMouseEnter={() => setHoveredHabitId(habit.id)}
            onMouseLeave={() => setHoveredHabitId(null)}
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: `180px repeat(${weekDates.length}, 1fr) 60px`,
              alignItems: "center",
              padding: "14px 0",
              borderBottom: "1px dashed rgba(0,0,0,0.1)",
            }}
          >
            {/* ✅ 리스트 hover 툴팁 */}
            {hoveredHabitId === habit.id && (
              <div
                style={{
                  position: "absolute",
                  left: "6px",
                  top: "0px",
                  transform: "translateY(-110%)",
                  background: "#FCFCFC",
                  border: "1px solid rgba(0,0,0,0.12)",
                  boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
                  borderRadius: "10px",
                  padding: "10px 12px",
                  fontSize: "12px",
                  color: "#333",
                  zIndex: 20,
                  minWidth: "190px",
                  pointerEvents: "none",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: "6px" }}>
                  {habit.emoji} {habit.name}
                </div>
                <div>
                  최근 7일 달성률{" "}
                  <span style={{ fontWeight: 700 }}>{habitPercent}%</span>
                </div>
                <div style={{ opacity: 0.7, marginTop: "4px" }}>
                  체크 {doneCount} / {weekDates.length}
                </div>
              </div>
            )}

            {/* 이모지 + 이름 */}
            <div style={{ display: "inline-flex", alignItems: "center" }}>
              {/* 이모지 UI */}
              <div style={{ position: "relative", marginRight: "12px" }}>
                <span
                  onClick={() => setEditingEmojiId(habit.id)}
                  style={{ cursor: "pointer" }}
                >
                  {habit.emoji}
                </span>

                {editingEmojiId === habit.id && (
                  <div
                    ref={emojiBoxRef}
                    style={{
                      position: "absolute",
                      top: "28px",
                      left: 0,
                      background: "white",
                      border: "1px solid rgba(0,0,0,0.15)",
                      borderRadius: "6px",
                      padding: "8px",
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "6px",
                      width: "150px",
                      zIndex: 10,
                      maxHeight: "180px",
                      overflowY: "auto",
                    }}
                  >
                    {AVAILABLE_EMOJIS.map((e) => (
                      <span
                        key={e}
                        onClick={() => applyEmoji(habit.id, e)}
                        style={{
                          cursor: "pointer",
                          fontSize: "20px",
                          textAlign: "center",
                        }}
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 이름 수정 */}
              {editingHabitId === habit.id ? (
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={applyEdit}
                  onKeyDown={(e) => {
                    if (e.nativeEvent.isComposing) return;
                    if (e.key === "Enter") applyEdit();
                  }}
                  autoFocus
                  style={{
                    fontSize: "inherit",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    padding: 0,
                    margin: 0,
                    lineHeight: "inherit",
                  }}
                />
              ) : (
                <span
                  onClick={() => startEdit(habit)}
                  style={{ cursor: "text" }}
                >
                  {habit.name}
                </span>
              )}
            </div>

            {/* 체크박스 */}
            {weekDates.map((d) => (
              <div key={d} style={{ textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={!!checkedState[`${habit.id}-${d}`]}
                  onChange={() => handleCheck(habit.id, d)}
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "#333",
                  }}
                />
              </div>
            ))}

            {/* 삭제 */}
            <button
              onClick={() => handleRemoveHabit(habit.id)}
              style={{
                padding: "6px 6px",
                border: "1px solid rgba(0,0,0,0.25)",
                background: "transparent",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              삭제
            </button>
          </div>
        );
      })}

      {/* ✅ 4번: 표 밑 “진행률 숫자만” 한 줄 */}
      {/* {habits.length > 0 && (
        <div
          style={{
            marginTop: "14px",
            padding: "10px 6px",
            fontSize: "12.5px",
            opacity: 0.75,
            borderBottom: "1px dashed rgba(0,0,0,0.08)",
            textAlign: "left",
          }}
        >
          <span style={{ fontWeight: 700, marginRight: "8px" }}>
            진행률
          </span>
          {progressData.map((v) => Math.round(v)).join(" · ")}
        </div>
      )} */}

      {/* ✅ 진행률 Row: 리스트 그리드와 정확히 정렬 */}
      {habits.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `180px repeat(${weekDates.length}, 1fr) 60px`,
            alignItems: "center",
            padding: "10px 0",
            borderBottom: "1px dashed rgba(0,0,0,0.08)",
            marginTop: "6px",
            fontSize: "15px",
            color: "#1c1c1cff",
            opacity: 0.75,
          }}
        >
          {/* 첫 칸: 라벨 */}
          <div style={{ textAlign: "left", marginLeft: "5px", fontWeight: 500 }}>
            ✷ 진행률
          </div>

          {/* 날짜 칸: 숫자만 */}
          {progressData.map((v, idx) => (
            <div key={weekDates[idx]} style={{ textAlign: "center" }}>
              {Math.round(v)} %
            </div>
          ))}

          {/* 마지막 칸(삭제 컬럼 자리) 비우기 */}
          <div />
        </div>
      )}

      <hr style={{ marginTop: "50px", marginBottom: "80px" }} />

      {/* ✅ 2번: 그래프 hover 요약 카드 */}
      <div
        style={{
          height: "350px",
          marginBottom: "100px",
          position: "relative",
        }}
        onMouseEnter={() => setIsChartHover(true)}
        onMouseLeave={() => setIsChartHover(false)}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "50px",
            color: "#333",
            fontWeight: 600,
          }}
        >
          📈 Weekly Progress Chart
        </h2>

        {/* ✅ 그래프 hover 요약 카드 */}
        {isChartHover && habits.length > 0 && (
          <div
            style={{
              position: "absolute",
              right: "8px",
              top: "46px",
              background: "#FCFCFC",
              border: "1px solid rgba(0,0,0,0.12)",
              boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
              borderRadius: "10px",
              padding: "10px 12px",
              fontSize: "12px",
              color: "#333",
              zIndex: 20,
              minWidth: "160px",
              pointerEvents: "none",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: "6px" }}>
              이번 주 요약
            </div>
            <div>평균 {weeklyAvg}%</div>
            <div style={{ opacity: 0.7, marginTop: "4px" }}>
              최고 {weeklyMax.value}% · 최저 {weeklyMin.value}%
            </div>
          </div>
        )}

        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default HabitTracker;
