import React, { useState, useEffect } from "react";
import './EconomyNews.css'
import {
  Search,
  RefreshCw,
  FileText,
  Copy,
  Zap,
  BookOpen,
} from "lucide-react";

const EconomyNews = () => {
  // ⭐️ 1. 상태 정의 (Hooks) 
  const [config, setConfig] = useState({ googleKey: "" }); // googleAPI 키 저장
  const [selectedModel, setSelectedModel] = useState(""); // AI 모델 이름 
  const [isProcessing, setIsProcessing] = useState(false); // 뉴스 분석 중인지 표시
  const [statusMsg, setStatusMsg] = useState("준비 완료"); // 현재 상태 메세지
  const [toast, setToast] = useState({ show: false, msg: "" }); // 작은 알람 메시지 표시
  const [newsData, setNewsData] = useState({ kr: [], us: [], coin: [] }); // 뉴스데이터 (한국, 미국, 코인)
  const [activeTab, setActiveTab] = useState("kr"); // 현재 선택된 뉴스 탭

  // 각 섹터별로 뉴스 검색 조건과 언어 설정
  const sectors = [
    { id: "kr", name: "🇰🇷 한국", query: "경제 OR 주식 OR 금융 when:12h", lang: "ko" },
    { id: "us", name: "🇺🇸 미국", query: "US Economy OR Stock Market when:12h", lang: "en" },
    { id: "coin", name: "💰 코인", query: "Bitcoin OR Crypto when:12h", lang: "en" },
  ];

  // 초기로딩 : 로컬 스토로지에서 API 키와 모델 가져오기 
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem("morningFinal_Key");
      const savedModel = localStorage.getItem("morningFinal_Model");

      if (savedKey) setConfig({ googleKey: savedKey });
      if (savedModel) setSelectedModel(savedModel);
    } catch (error) {
      // 로컬 스토리지 접근 오류 방지 및 디버깅용 로그 추가
      console.error("Local storage access error:", error);
    }
  }, []);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2000);
  };

  // 1. 모델 스캔
  const scanAndSave = async () => {
    if (!config.googleKey) return alert("키를 입력하세요.");

    const key = config.googleKey.trim();
    setStatusMsg("📡 모델 찾는 중...");

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      const data = await res.json();

      if (data.error) throw new Error(data.error.message);

      const validModels =
        data.models?.filter((m) =>
          m.supportedGenerationMethods?.includes("generateContent")) || [];

      if (validModels.length === 0)
        throw new Error("사용 가능한 모델 없음");

      const best =
        validModels.find((m) => m.name.includes("flash")) ||
        validModels.find((m) => m.name.includes("pro")) ||
        validModels[0];

      setSelectedModel(best.name);
      localStorage.setItem("morningFinal_Key", key);
      localStorage.setItem("morningFinal_Model", best.name);

      alert(`✅ 연결 성공!\n모델: ${best.name.split("/")[1]}`);
      setStatusMsg("준비 완료");
    } catch (e) {
      alert(`❌ 연결 실패: ${e.message}`);
      setStatusMsg("연결 실패");
    }
  };

  // HTML 태그 제거
  const cleanText = (html) => {
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    } catch {
      return "";
    }
  };

  // 2. AI 요약
  const summarizeNews = async (title, snippet) => {
    if (!selectedModel) return snippet;

    try {
      const modelName = selectedModel.replace("models/", "");
      const prompt = `
Role: Professional Financial Analyst.

Task: Summarize this news into Korean.

Constraints:
1. Language: Korean ONLY.
2. Length: 6 to 8 bullet points.
3. Formatting:
- Start each point with an emoji (📈, 📉, 💰, 🚨, 💡).
- DO NOT use markdown bold (**).
4. Focus on facts and market impact.

Title: "${title}"
Content: "${snippet}"
`;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.googleKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );

      const data = await res.json();

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        let txt = data.candidates[0].content.parts[0].text;
        return txt.replace(/\*\*/g, "").replace(/##/g, "").trim();
      }

      return `(AI 응답 없음) ${snippet}`;
    } catch {
      return `(통신 오류) ${snippet}`;
    }
  };

  // 3. 브리핑 시작
  const startBriefing = async () => {
    if (!selectedModel) return alert("Google API Key를 저장하고 스캔해주세요.");

    setIsProcessing(true);
    setNewsData({ kr: [], us: [], coin: [] });

    for (const sector of sectors) {
      setStatusMsg(`🔎 ${sector.name} 중요 뉴스 수집 중...`);

      try {
        // ⭐️ 캐시 무력화를 위해 Google News RSS URL에 cachebuster 파라미터를 추가.
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
          sector.query
        )}&hl=${sector.lang === "ko" ? "ko" : "en-US"}&gl=${sector.lang === "ko" ? "KR" : "US"
          }&ceid=${sector.lang === "ko" ? "KR:ko" : "US:en"}&cachebuster=${Date.now()}`;

        const res = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
            rssUrl
          )}`
        );
        const data = await res.json();

        if (!data.items) throw new Error("뉴스 없음");

        const current = [];
        let count = 0;

        for (const item of data.items) {
          if (count >= 3) break;

          const cleanSnippet = cleanText(
            item.contentSnippet || item.description || ""
          );
          if (cleanSnippet.length < 10) continue;

          setStatusMsg(`📝 ${sector.name} 분석 (${count + 1}/3)...`);

          const summary = await summarizeNews(item.title, cleanSnippet);

          current.push({
            title: item.title.replace(/\*\*/g, ""),
            link: item.link,
            summary,
          });

          count++;

          await new Promise((r) => setTimeout(r, 1200));
        }

        setNewsData((prev) => ({ ...prev, [sector.id]: current }));
      } catch (e) {
        console.error(e);
        setStatusMsg(`❌ ${sector.name} 오류`);
      }
    }

    setIsProcessing(false);
    setStatusMsg("🎉 브리핑 완료!");
    alert("오늘의 주요 뉴스가 도착했습니다!");
  };

  const handleCopyLink = (url) => {
    const textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      showToast("링크 복사 완료!");
    } catch {
      showToast("복사 실패");
    }
    document.body.removeChild(textArea);
  };

  // 6시간 뒤 자동 업데이트 + 로컬 캐시 로딩
  useEffect(() => {
    const lastUpdate = localStorage.getItem("newsLastTime");
    const now = Date.now();

    // 최신 데이터 캐시가 존재하면 불러오기
    const cachedData = localStorage.getItem("newsCache");
    if (cachedData) {
      setNewsData(JSON.parse(cachedData));
    }

    // 6시간(21600000ms) 지났거나 기록이 없으면 새로 뉴스 요청
    if (!lastUpdate || now - Number(lastUpdate) > 1000 * 60 * 60 * 6) {
      startBriefing();
      localStorage.setItem("newsLastTime", now);
    }
  }, []);

  useEffect(() => {
    // 빈 데이터는 저장하지 않음
    if (newsData && (newsData.kr.length || newsData.us.length || newsData.coin.length)) {
      localStorage.setItem("newsCache", JSON.stringify(newsData));
    }
  }, [newsData]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-stone-800 font-sans">
      {/* 토스트 : 하단의 진행사항 알림 메세지*/}
      {toast.show && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-stone-800 text-white px-4 py-2 rounded-full shadow-xl text-xs font-bold">
            {toast.msg}
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 캔버스 */}
      <div className="w-full max-w-4xl mx-auto min-h-screen bg-white flex flex-col px-12 pb-12">

        {/* 상단 영역 */}
        <header className="pt-12 pb-12 bg-white sticky top-0 z-30 border-b border-stone-200">
          <div className="space-y-4">
            <h3 className="text-[11px] tracking-wider text-stone-400 font-semibold uppercase">
              Daily Briefing
            </h3>

            <div className="flex justify-between items-start gap-10">
              <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2 leading-tight">
                <BookOpen className="text-amber-600" /> 오늘의 경제뉴스
              </h1>

              {/* 설정 박스 - 항상 표시 */}
              <div className="w-80 border border-stone-200 rounded-xl bg-white p-5 flex flex-col gap-4">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">
                  Google API Key
                </label>

                <input
                  type="password"
                  value={config.googleKey}
                  onChange={(e) => setConfig({ googleKey: e.target.value })}
                  className="w-full p-2 border rounded text-xs outline-none bg-stone-50"
                  placeholder="AIza..."
                />

                <button
                  onClick={scanAndSave}
                  className="w-full py-2 bg-stone-900 text-white text-xs font-bold rounded-lg hover:bg-black flex items-center justify-center gap-2 transition-colors"
                >
                  <Search size={12} /> 저장 및 모델 스캔
                </button>

                {selectedModel && (
                  <div className="p-2 bg-green-50 text-green-700 rounded text-[10px] font-bold text-center border border-green-100">
                    연결됨: {selectedModel.replace("models/", "")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* 메인 영역 */}
        <main className="mt-10 space-y-10">

          {/* 상태바 + 버튼 */}
          <section className="space-y-6">
            <div
              className={`p-4 rounded-lg text-center text-xs font-bold border ${isProcessing
                ? "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
                : "bg-stone-50 text-stone-500 border-stone-100"
                }`}
            >
              {isProcessing ? (
                <RefreshCw size={12} className="inline animate-spin mr-2" />
              ) : (
                <Zap size={12} className="inline mr-2" />
              )}
              {statusMsg}
            </div>

            <button
              onClick={startBriefing}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-sm flex items-center justify-center gap-3 ${isProcessing
                ? "bg-stone-300"
                : "bg-gradient-to-r from-amber-600 to-orange-600 hover:shadow-md"
                } transition-shadow`}
            >
              {isProcessing ? (
                "뉴스 분석 중..."
              ) : (
                <>
                  <FileText size={18} /> 브리핑 시작
                </>
              )}
            </button>
          </section>

          {/* 탭 */}
          <section>
            <div className="flex gap-4 border-b border-stone-200">
              {sectors.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveTab(s.id)}
                  className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === s.id
                    ? "text-stone-900 border-stone-900"
                    : "text-stone-400 hover:text-stone-600 border-transparent"
                    }`}
                >
                  {s.name}
                  <span className="text-[10px] bg-stone-100 px-1.5 rounded-full ml-1 text-stone-600">
                    {newsData[s.id].length}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* 뉴스 콘텐츠 */}
          <section className="flex-1">
            {newsData[activeTab].length === 0 ? (
              <div className="h-52 flex flex-col items-center justify-center text-stone-300">
                <FileText size={48} className="mb-2 opacity-20" />
                <p className="text-xs">
                  {isProcessing ? "뉴스를 가져오는 중입니다..." : "브리핑을 시작하세요."}
                </p>
              </div>
            ) : (

              <div className="space-y-10">
                {newsData[activeTab].map((news, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-xl border border-stone-200 max-w-3xl mx-auto"
                  >
                    <h3 className="text-base font-bold text-stone-900 mb-3 leading-tight">
                      {news.title}
                    </h3>

                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <p className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed">
                        {news.summary}
                      </p>
                    </div>

                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => handleCopyLink(news.link)}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-stone-900 hover:bg-black px-4 py-2 rounded-lg transition-colors"
                      >
                        <Copy size={12} /> 링크 복사
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default EconomyNews