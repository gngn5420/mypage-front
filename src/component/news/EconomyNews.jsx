import React, { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  FileText,
  Copy,
  Zap,
  ChartNoAxesCombined,
  FileSearchCorner,
} from "lucide-react";

const EconomyNews = () => {
  const [config, setConfig] = useState({ googleKey: "" });
  const [selectedModel, setSelectedModel] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState("준비 완료");
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [newsData, setNewsData] = useState({ kr: [], us: [], coin: [] });
  const [activeTab, setActiveTab] = useState("kr");

  const sectors = [
    { id: "kr", name: "🇰🇷 한국", query: "경제 OR 주식 OR 금융 when:12h", lang: "ko" },
    { id: "us", name: "🇺🇸 미국", query: "US Economy OR Stock Market when:12h", lang: "en" },
    { id: "coin", name: "💰 코인", query: "Bitcoin OR Crypto when:12h", lang: "en" },
  ];

  useEffect(() => {
    try {
      const savedKey = localStorage.getItem("morningFinal_Key");
      const savedModel = localStorage.getItem("morningFinal_Model");
      if (savedKey) setConfig({ googleKey: savedKey });
      if (savedModel) setSelectedModel(savedModel);
    } catch (error) {
      console.error("Local storage access error:", error);
    }
  }, []);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2000);
  };

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

      if (validModels.length === 0) throw new Error("사용 가능한 모델 없음");

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

  const cleanText = (html) => {
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    } catch {
      return "";
    }
  };

  const summarizeNews = async (title, snippet) => {
    if (!selectedModel) return snippet;

    try {
      const modelName = selectedModel.replace("models/", "");
      const prompt = `
Role: Professional Financial Analyst.
Task: Summarize this news into Korean.
Constraints:
1. Korean ONLY.
2. 6~8 bullet points.
3. Start each point with an emoji.
4. No markdown bold.
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
        return txt.replace(/\*\*/g, "").trim();
      }

      return `(AI 응답 없음) ${snippet}`;
    } catch {
      return `(통신 오류) ${snippet}`;
    }
  };

  const startBriefing = async () => {
    if (!selectedModel) return alert("Google API Key를 저장하고 스캔해주세요.");

    setIsProcessing(true);
    setNewsData({ kr: [], us: [], coin: [] });

    for (const sector of sectors) {
      setStatusMsg(`🔎 ${sector.name} 중요 뉴스 수집 중...`);

      try {
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
          sector.query
        )}&hl=${sector.lang === "ko" ? "ko" : "en-US"}&gl=${
          sector.lang === "ko" ? "KR" : "US"
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

  useEffect(() => {
    const lastUpdate = localStorage.getItem("newsLastTime");
    const now = Date.now();

    const cachedData = localStorage.getItem("newsCache");
    if (cachedData) setNewsData(JSON.parse(cachedData));

    if (!lastUpdate || now - Number(lastUpdate) > 21600000) {
      startBriefing();
      localStorage.setItem("newsLastTime", now);
    }
  }, []);

  useEffect(() => {
    if (
      newsData &&
      (newsData.kr.length || newsData.us.length || newsData.coin.length)
    ) {
      localStorage.setItem("newsCache", JSON.stringify(newsData));
    }
  }, [newsData]);

return (
  <div
    style={{
      maxWidth: "900px",
      width: "100%",
      margin: "0 auto",
      // fontFamily 제거 → 사이드바와 동일 폰트 사용
    }}
  >
    {toast.show && (
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-stone-800 text-white px-4 py-2 rounded-full shadow-xl text-xs font-bold">
          {toast.msg}
        </div>
      </div>
    )}

    <div>
      <header>
        <div style={{ textAlign: "center" }}>
          <div>
            <h1
              style={{
                marginBottom: "40px",
                fontWeight: 500, 
                fontSize:"40px",
                marginTop:"65px",
              }}
            >
              {/* <ChartNoAxesCombined style={{ marginRight: "10px"}}/> */}
              📊 오늘의 경제뉴스
            </h1>

            <div className="w-80 border border-stone-200 rounded-xl bg-white p-5 flex flex-col gap-4">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide" style={{ marginRight: "10px" }}>
                Google API Key
              </label>

              <input
                type="password"
                value={config.googleKey}
                onChange={(e) => setConfig({ googleKey: e.target.value })}
                className="w-full p-2 border rounded text-xs outline-none bg-stone-50"
                placeholder="AIza..."
                style={{ marginRight: "5px" }}
              />

              <button
                onClick={scanAndSave}
                className="w-full py-2 bg-stone-900 text-white text-xs font-bold rounded-lg hover:bg-black flex items-center justify-center gap-2 transition-colors"
                style={{ marginBottom: "20px" }}
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

      <main className="mt-10 space-y-10">
        <section
          style={{ textAlign: "center", marginBottom: "20px" }}
          className="space-y-6"
        >
          <div
            className={`p-4 rounded-lg text-center text-xs font-bold border ${
              isProcessing
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
            style={{marginTop:"40px", padding: "8px 10px", fontSize: "18px", background: "#333",color: "white", borderRadius:"6px" }}
            onClick={startBriefing}
            disabled={isProcessing}
            className={`w-full rounded-xl font-bold text-lg shadow-sm flex items-center justify-center gap-3 ${
              isProcessing
                ? "bg-stone-300"
                : "bg-gradient-to-r from-amber-600 to-orange-600 hover:shadow-md"
            } transition-shadow`}
          >
            {isProcessing ? (
              "뉴스 분석 중..."
            ) : (
              <>
                <FileText size={20}/> 브리핑 시작
              </>
            )}
          </button>
        </section>

        <section style={{ textAlign: "center", marginTop:"60px",  marginBottom: "60px"}}>
          <div
            className="flex border-b border-stone-200"
            style={{ justifyContent: "center", gap: "12px" }}
          >
            {sectors.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                className={`pb-3 text-sm font-bold border border-stone-300 rounded-lg transition-colors ${
                  activeTab === s.id
                    ? "text-stone-900 border-stone-900"
                    : "text-stone-400 hover:text-stone-600"
                }`}
                style={{
                  padding: "6px 8px",
                  margin: "0 2px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {s.name}
                <span className="text-[10px] bg-stone-100 px-1.5 rounded-full text-stone-600">
                  {newsData[s.id].length}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="flex-1">
          {newsData[activeTab].length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <FileSearchCorner size={48} style={{ marginRight: "15px" }}/>
              <p
                className="text-xs"
                style={{
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                {isProcessing
                  ? "뉴스를 가져오는 중입니다..."
                  : "브리핑을 시작하세요."}
              </p>

              {/* <p className="text-xs">
                {isProcessing ? "뉴스를 가져오는 중입니다..." : "브리핑을 시작하세요."}
              </p> */}
            </div>
          ) : (
            <div className="space-y-10">
              {newsData[activeTab].map((news, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-stone-200 max-w-3xl mx-auto"
                  style={{
                    marginBottom: "70px",
                  }}
                >
                  <h3
                    className="text-base text-stone-900 mb-3 leading-tight"
                    style={{
                      textAlign: "center",
                      fontWeight: 500, 
                    }}
                  >
                    {news.title}
                  </h3>

                  {/* <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <p className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed">
                      {news.summary}
                    </p>
                  </div> */}

                  <div
                    className="news-summary"
                    style={{
                      maxWidth: "1200px",
                      margin: "0 auto",
                      lineHeight: "1.7",
                    }}
                  >
                      {news.summary}
                  </div>


                  <div
                    className="flex justify-center mt-3"
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    <button
                      style={{padding: "8px 10px", fontSize:"14px", }}
                      onClick={() => handleCopyLink(news.link)}
                      // className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-stone-900 hover:bg-black px-4 py-2 rounded-lg transition-colors"
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

export default EconomyNews;
