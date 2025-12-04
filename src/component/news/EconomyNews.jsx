import React, { useState, useEffect } from "react";
import {
  Settings,
  Search,
  RefreshCw,
  FileText,
  Copy,
  Zap,
  Activity,
  BookOpen,
} from "lucide-react";

const EconomyNews = () => {
  // ⭐️ 1. 상태 정의 (Hooks) - 컴포넌트 최상단에 위치해야 합니다.
  const [showSettings, setShowSettings] = useState(false); // 설정 창 토글 상태
  const [config, setConfig] = useState({ googleKey: "" }); // googleAPI 키 저장
  const [selectedModel, setSelectedModel] = useState(""); // AI 모델 이름 
  const [isProcessing, setIsProcessing] = useState(false); // 뉴스 분석 중인지 표시
  const [statusMsg, setStatusMsg] = useState("준비 완료"); // 현재 상태 메세지
  const [toast, setToast] = useState({ show: false, msg: "" }); // 작은 알람 메시지 표시
  const [newsData, setNewsData] = useState({ kr: [], us: [], coin: [] }); // 뉴스데이터 (한국, 미국, 코인)
  const [activeTab, setActiveTab] = useState("kr"); // 현재 선택된 뉴스 탭

  // 각 섹터별로 뉴스 검색 조건과 언어 설정 (뉴스 갱신을 위해 when:12h 추가)
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


  // 2. 설정 토글 함수 정의
  const toggleSettings = () => {
    setShowSettings(prev => !prev);
  };

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
        `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
      );
      const data = await res.json();

      if (data.error) throw new Error(data.error.message);

      const validModels =
        data.models?.filter((m) =>
          m.supportedGenerationMethods?.includes("generateContent")
        ) || [];

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
    if (!selectedModel) return alert("설정(⚙️)에서 키를 저장하고 스캔해주세요.");

    setIsProcessing(true);
    setNewsData({ kr: [], us: [], coin: [] });

    for (const sector of sectors) {
      setStatusMsg(`🔎 ${sector.name} 중요 뉴스 수집 중...`);

      try {
        // ⭐️ 캐시 무력화를 위해 Google News RSS URL에 cachebuster 파라미터를 추가했습니다.
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

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 flex justify-center pb-10 relative">

      {/* 토스트 */}
      {toast.show && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-stone-800 text-white px-4 py-2 rounded-full shadow-xl text-xs font-bold">
            {toast.msg}
          </div>
        </div>
      )}

      {/* 메인 박스 */}
      <div className="w-full max-w-md bg-white shadow-xl min-h-screen flex flex-col border-x border-stone-200">

        {/* 헤더 */}
        <header className="px-6 pt-6 pb-4 bg-white sticky top-0 z-30 border-b border-stone-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                <BookOpen className="text-amber-600" /> 모닝경제
              </h1>
              {/* 'Premium Edition' 텍스트 삭제 완료 */}
            </div>

            {/* 설정 */}
            <div className="relative group">
              <button
                onClick={toggleSettings} // ⭐️ 클릭 토글 기능 추가
                className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors"
              >
                <Settings size={18} className="text-stone-600" />
              </button>

              {/* ⭐️ showSettings 상태에 따라 block/hidden을 결정하도록 수정 */}
              <div className={`absolute right-0 mt-2 w-72 bg-white border border-stone-200 shadow-xl rounded-xl p-4 z-30 ${showSettings ? "block" : "hidden"
                }`}>
                <label className="text-[10px] font-bold text-stone-500 mb-1 block">
                  Google API Key
                </label>

                <input
                  type="password"
                  value={config.googleKey}
                  onChange={(e) => setConfig({ googleKey: e.target.value })}
                  className="w-full p-2 border rounded text-xs mb-2 outline-none bg-stone-50"
                  placeholder="AIza..."
                />

                <button
                  onClick={scanAndSave}
                  className="w-full py-2 bg-stone-800 text-white text-xs font-bold rounded hover:bg-black flex items-center justify-center gap-2"
                >
                  <Search size={12} /> 저장 및 모델 스캔
                </button>

                {selectedModel && (
                  <div className="mt-2 p-2 bg-green-50 text-green-700 rounded text-[10px] font-bold text-center border border-green-100">
                    ✅ 연결됨: {selectedModel.replace("models/", "")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* 상태창 & 버튼 */}
        <div className="px-6 py-4">
          <div
            className={`mb-4 p-3 rounded-xl text-center text-xs font-bold border ${isProcessing
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
            className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg flex items-center justify-center gap-2 ${isProcessing
                ? "bg-stone-300"
                : "bg-gradient-to-r from-amber-600 to-orange-600 hover:shadow-amber-200"
              }`}
          >
            {isProcessing ? (
              "뉴스 분석 중..."
            ) : (
              <>
                <FileText size={18} /> 브리핑 시작
              </>
            )}
          </button>
        </div>

        {/* 탭 */}
        <div className="px-6 mt-2 flex gap-2 border-b border-stone-100">
          {sectors.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 ${activeTab === s.id
                  ? "text-stone-900 border-stone-900"
                  : "text-stone-400 border-transparent hover:text-stone-600"
                }`}
            >
              {s.name}
              <span className="text-[10px] bg-stone-100 px-1.5 rounded-full ml-1 text-stone-500">
                {newsData[s.id].length}
              </span>
            </button>
          ))}
        </div>

        {/* 뉴스 리스트 */}
        <div className="flex-1 bg-stone-50 p-4 overflow-y-auto">
          {newsData[activeTab].length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-stone-300">
              <FileText size={48} className="mb-2 opacity-20" />
              <p className="text-xs">
                {isProcessing ? "뉴스를 가져오는 중입니다..." : "버튼을 눌러 시작하세요."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {newsData[activeTab].map((news, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100"
                >
                  <h3 className="text-md font-bold text-stone-800 mb-3">
                    {news.title}
                  </h3>

                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <p className="text-xs text-stone-600 whitespace-pre-wrap leading-relaxed">
                      {news.summary}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleCopyLink(news.link)}
                      className="flex items-center gap-1 text-[11px] font-bold text-white bg-stone-800 hover:bg-black px-4 py-2 rounded-lg"
                    >
                      <Copy size={12} /> 링크 복사
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EconomyNews;