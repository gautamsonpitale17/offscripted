import React, { useEffect, useRef, useState } from "react";

const questionBanks = {
  API: [
    "What is an API?",
    "What is the difference between REST and SOAP?",
    "What are HTTP methods?",
    "What is the difference between PUT and PATCH?",
    "What is JWT?",
  ],

  Framer: [
    "What is Framer?",
    "What is Framer Motion?",
    "How does animation work in Framer?",
    "What are motion components?",
    "What are variants in Framer Motion?",
  ],

  "Next.js": [
    "What is Next.js?",
    "Why is Next.js used?",
    "What is server-side rendering in Next.js?",
    "What is static site generation?",
    "What are Server Components?",
  ],

  MongoDB: [
    "What is MongoDB?",
    "What is a document in MongoDB?",
    "What is a collection?",
    "What is the difference between SQL and MongoDB?",
    "What are indexes in MongoDB?",
  ],

  CSS: [
    "What is CSS?",
    "What is the CSS box model?",
    "What is Flexbox?",
    "What is CSS Grid?",
    "What is the difference between relative, absolute, fixed and sticky positioning?",
  ],

  "Node.js": [
    "What is Node.js?",
    "Why is Node.js used for backend development?",
    "What is the event loop in Node.js?",
    "What is npm?",
    "What is middleware in Node.js?",
  ],

  "Postgres SQL": [
    "What is PostgreSQL?",
    "What is a primary key?",
    "What is a foreign key?",
    "What are joins?",
    "What is normalization?",
  ],

  Python: [
    "What is Python and what are its key features?",
    "What are mutable and immutable types in Python?",
    "What is the difference between list, tuple, set, and dictionary?",
    "What are Python decorators?",
    "What is the Global Interpreter Lock (GIL)?",
  ],

  "React.js": [
    "What is React and why is it used?",
    "What are React components?",
    "What is JSX?",
    "What are props in React?",
    "What is state in React?",
  ],

  "React Router": [
    "What is React Router?",
    "What is client-side routing?",
    "What is BrowserRouter?",
    "What is useNavigate?",
    "What is nested routing?",
  ],

  SQL: [
    "What is SQL?",
    "What is a primary key?",
    "What is a foreign key?",
    "What are SQL joins?",
    "What is normalization?",
  ],

  "Tailwind CSS": [
    "What is Tailwind CSS?",
    "Why is Tailwind CSS called a utility-first framework?",
    "What are utility classes?",
    "What are responsive utilities in Tailwind?",
    "What are arbitrary values in Tailwind?",
  ],

  DSA: [
    "What is a data structure?",
    "What is an algorithm?",
    "What is time complexity?",
    "What is space complexity?",
    "What is Big O notation?",
  ],

  "Express.js": [
    "What is Express.js?",
    "Why is Express.js used with Node.js?",
    "What is middleware in Express?",
    "What is routing in Express?",
    "What are route parameters?",
  ],

  HTML: [
    "What is HTML?",
    "What is semantic HTML?",
    "What are HTML attributes?",
    "What is the difference between div and section?",
    "What is accessibility in HTML?",
  ],
};

const topics = Object.keys(questionBanks);

export default function App() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("offscript_settings");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }

    return {
      speakMinutes: 1,
      researchMinutes: 10,
      muted: false,
      topic: "Python",
    };
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [currentText, setCurrentText] = useState("READY");
  const [timerState, setTimerState] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [timerDuration, setTimerDuration] = useState(0);
  const [viewMode, setViewMode] = useState("idle");

  const audioCtxRef = useRef(null);
  const touchStartRef = useRef(0);

  useEffect(() => {
    localStorage.setItem("offscript_settings", JSON.stringify(settings));
  }, [settings]);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const playTick = (intensity = 1) => {
    if (settings.muted || !audioCtxRef.current) return;

    const now = audioCtxRef.current.currentTime;
    const oscillator = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(420, now);
    oscillator.frequency.exponentialRampToValueAtTime(180, now + 0.045);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(
      Math.max(0.025, intensity * 0.055),
      now + 0.005
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    oscillator.connect(gain);
    gain.connect(audioCtxRef.current.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.05);
  };

  const playCompletionSound = () => {
    if (settings.muted) return;

    initAudio();

    const now = audioCtxRef.current.currentTime;
    const oscillator = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(520, now);
    oscillator.frequency.exponentialRampToValueAtTime(720, now + 0.18);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    oscillator.connect(gain);
    gain.connect(audioCtxRef.current.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.32);
  };

  const getRandomQuestion = (topic) => {
    const questions = questionBanks[topic];

    return questions[
      Math.floor(Math.random() * questions.length)
    ];
  };

  const spin = async () => {
    if (isSpinning) return;

    setIsSpinning(true);
    initAudio();
    setViewMode("spinning");

    const finalTopic = settings.topic;
    const finalQuestion = getRandomQuestion(finalTopic);
    const totalTicks = 28 + Math.floor(Math.random() * 12);

    for (let i = 0; i < totalTicks; i++) {
      const question =
        i === totalTicks - 1
          ? finalQuestion
          : getRandomQuestion(
              topics[Math.floor(Math.random() * topics.length)]
            );

      setCurrentText(question);

      const progress = i / totalTicks;
      playTick(1 - progress * 0.25);

      await new Promise((resolve) =>
        setTimeout(resolve, 45 + Math.pow(progress, 3) * 390)
      );
    }

    setSelectedTopic(finalTopic);
    setSelectedQuestion(finalQuestion);
    setCurrentText(finalQuestion);
    setIsSpinning(false);
    setViewMode("selected");
  };

  useEffect(() => {
    if (!timerState) return;

    const interval = setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous <= 1) {
          clearInterval(interval);
          playCompletionSound();

          if (timerState === "research") {
            setTimerState("speakReady");
          } else {
            setTimerState(null);
            setViewMode("complete");
          }

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState]);

  const startTimer = (mode) => {
    const duration =
      (mode === "research"
        ? settings.researchMinutes
        : settings.speakMinutes) * 60;

    setTimerDuration(duration);
    setRemainingSeconds(duration);
    setTimerState(mode);
    setViewMode("activeTimer");
  };

  const finishResearch = () => {
    const duration = settings.speakMinutes * 60;

    setTimerDuration(duration);
    setRemainingSeconds(duration);
    setTimerState("speak");
    setViewMode("activeTimer");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(remaining).padStart(2, "0")
    );
  };

  const resetToMain = () => {
    setTimerState(null);
    setViewMode(selectedQuestion ? "selected" : "idle");
  };

  const spinAgain = () => {
    setSelectedTopic(null);
    setSelectedQuestion(null);
    setCurrentText("READY");
    setRemainingSeconds(0);
    setTimerDuration(0);
    setTimerState(null);
    setViewMode("idle");
  };

  const changeValue = (type, direction) => {
    setSettings((current) => {
      if (type === "speakMinutes") {
        return {
          ...current,
          speakMinutes: Math.min(
            10,
            Math.max(1, current.speakMinutes + direction)
          ),
        };
      }

      if (type === "researchMinutes") {
        return {
          ...current,
          researchMinutes: Math.min(
            30,
            Math.max(1, current.researchMinutes + direction)
          ),
        };
      }

      const index = topics.indexOf(current.topic);
      const nextIndex =
        (index + direction + topics.length) % topics.length;

      return {
        ...current,
        topic: topics[nextIndex],
      };
    });
  };

  const handleWheel = (event, type) => {
    if (Math.abs(event.deltaY) < 2) return;

    event.preventDefault();
    changeValue(type, event.deltaY > 0 ? -1 : 1);
  };

  const handleTouchStart = (event) => {
    touchStartRef.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event, type) => {
    const end = event.changedTouches[0].clientY;
    const difference = touchStartRef.current - end;

    if (Math.abs(difference) > 15) {
      changeValue(type, difference > 0 ? 1 : -1);
    }
  };

  const selectorEvents = (type) => ({
    onWheel: (event) => handleWheel(event, type),
    onTouchStart: handleTouchStart,
    onTouchEnd: (event) => handleTouchEnd(event, type),
    style: { touchAction: "none" },
  });

  return (
    <div className="w-full h-screen flex flex-col bg-[#050505] text-[#f5f5f5] selection:bg-neutral-800">

      <header className="h-[78px] px-[34px] flex items-center justify-between shrink-0">
        <div className="text-[18px] font-extrabold tracking-tight select-none">
          offScripted<span className="text-[#5c5c5c] font-medium">.</span>
        </div>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-[42px] h-[42px] border border-transparent rounded-full bg-transparent text-[#8b8b8b] grid place-items-center cursor-pointer transition-all hover:text-white hover:bg-[#111] hover:border-[#242424]"
          aria-label="Open settings"
        >
          <svg
            className="w-[19px] h-[19px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 7h10" />
            <path d="M18 7h2" />
            <path d="M4 17h2" />
            <path d="M10 17h10" />
            <circle cx="16" cy="7" r="2" />
            <circle cx="8" cy="17" r="2" />
          </svg>
        </button>
      </header>

      <main className="flex-1 min-h-0 w-full flex items-center justify-center p-[20px_24px_35px]">
        <div className="w-full max-w-[1100px] flex flex-col items-center justify-center text-center">

          {viewMode !== "activeTimer" &&
            viewMode !== "spinning" &&
            viewMode !== "complete" && (
              <div className="text-[#777] text-[10px] font-bold tracking-[0.22em] uppercase mb-[30px] min-h-[12px]">
                {selectedTopic || "YOUR TOPIC"}
              </div>
            )}

          {viewMode !== "activeTimer" && viewMode !== "complete" && (
            <div className="w-full min-h-[190px] flex items-center justify-center overflow-hidden relative">
              <div
                className={`max-w-full px-[20px] break-words ${
                  viewMode === "idle"
                    ? "text-[clamp(68px,9vw,118px)] font-mono font-black tracking-[-0.08em] leading-none text-[#858585]"
                    : viewMode === "spinning"
                    ? "text-[#d7d7d7] blur-[0.15px] text-[clamp(42px,7vw,94px)] font-extrabold tracking-[-0.075em]"
                    : "text-[clamp(40px,6.5vw,88px)] font-extrabold tracking-[-0.075em] text-white animate-topic-reveal"
                }`}
              >
                {currentText}
              </div>
            </div>
          )}

          {viewMode !== "activeTimer" &&
            viewMode !== "spinning" &&
            viewMode !== "complete" && (
              <div className="mt-[48px] flex flex-col items-center justify-center gap-[14px] w-full">
                <div className="flex items-center justify-center gap-[8px]">

                  <button
                    onClick={spin}
                    disabled={isSpinning}
                    className={`min-w-[150px] h-[52px] px-[28px] border border-white rounded-full bg-white text-[#080808] text-[12px] font-extrabold tracking-[0.1em] cursor-pointer transition-all hover:translate-y-[-2px] hover:bg-[#d8d8d8] active:translate-y-0 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed ${
                      selectedTopic
                        ? "opacity-35 border-[#555] bg-[#161616] text-[#777]"
                        : ""
                    }`}
                  >
                    SPIN
                  </button>

                  <button
                    onClick={() => startTimer("research")}
                    disabled={!selectedQuestion}
                    className={`w-[150px] h-[52px] px-[28px] border rounded-full text-[11px] font-bold tracking-[0.08em] cursor-pointer transition-all ${
                      selectedQuestion
                        ? "border-white bg-white text-[#080808] hover:bg-[#d8d8d8] hover:translate-y-[-1px]"
                        : "border-[#242424] bg-[#111] text-[#8b8b8b] opacity-25 cursor-pointer pointer-events-none"
                    }`}
                  >
                    RESEARCH
                  </button>

                </div>
              </div>
            )}

          {viewMode === "activeTimer" && (
            <div className="flex flex-col items-center justify-center w-full">

              <div className="max-w-[900px] text-[clamp(14px,2.2vw,22px)] font-bold text-white text-center mb-[30px]">
                {selectedQuestion || selectedTopic}
              </div>

              {timerState === "research" && (
                <div className="text-[12px] font-light text-[#8b8b8b] tracking-[0.15em] uppercase text-center mb-[24px]">
                  RESEARCHING
                </div>
              )}

              {timerState === "speak" && (
                <div className="text-[12px] font-light text-[#8b8b8b] tracking-[0.15em] uppercase text-center mb-[24px]">
                  SPEAKING
                </div>
              )}

              <div className="h-[22px]" />

              <div className="relative w-[260px] h-[260px] rounded-full flex flex-col items-center justify-center">

                <svg className="absolute top-0 left-0 w-full h-full -rotate-90 overflow-visible">
                  <circle
                    className="fill-none stroke-[#303030]"
                    cx="130"
                    cy="130"
                    r="126"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  <circle
                    className="fill-none stroke-white transition-all duration-1000 linear"
                    cx="130"
                    cy="130"
                    r="126"
                    strokeWidth="6"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: 2 * Math.PI * 126,
                      strokeDashoffset:
                        2 *
                        Math.PI *
                        126 *
                        (1 - remainingSeconds / timerDuration),
                    }}
                  />
                </svg>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[56px] font-extrabold tracking-[-0.05em] leading-none tabular-nums z-10">
                  {formatTime(remainingSeconds)}
                </div>

              </div>

              <div className="h-[58px]" />

              <div className="flex items-center justify-center gap-[12px]">

                {timerState === "research" && (
                  <button
                    onClick={finishResearch}
                    className="w-[150px] h-[52px] px-[28px] border border-white rounded-full bg-white text-[#080808] text-[12px] font-extrabold tracking-[0.1em] cursor-pointer hover:bg-[#d8d8d8]"
                  >
                    DONE
                  </button>
                )}

                {timerState === "speakReady" && (
                  <button
                    onClick={() => startTimer("speak")}
                    className="min-w-[150px] h-[52px] px-[28px] border border-white rounded-full bg-white text-[#080808] text-[12px] font-extrabold tracking-[0.1em] cursor-pointer hover:bg-[#d8d8d8]"
                  >
                    SPEAK
                  </button>
                )}

                <button
                  onClick={resetToMain}
                  className="w-[150px] h-[52px] px-[28px] border border-[#303030] rounded-full bg-[#111] text-[#777] text-[12px] font-extrabold tracking-[0.1em] cursor-pointer transition-all hover:text-white hover:border-[#555] hover:bg-[#181818]"
                >
                  CLOSE
                </button>

              </div>
            </div>
          )}

          {viewMode === "complete" && (
            <div className="flex flex-col items-center justify-center text-center w-full">

              <div className="text-[#8b8b8b] text-[10px] font-bold tracking-[0.2em] uppercase mb-[25px]">
                Session complete
              </div>

              <div className="max-w-[900px] text-[clamp(40px,6.5vw,82px)] leading-[0.95] font-extrabold tracking-[-0.07em]">
                {selectedTopic}
              </div>

              <div className="text-[#8b8b8b] mt-[20px] text-[13px]">
                Ready for another topic?
              </div>

              <button
                onClick={spinAgain}
                className="mt-[40px] h-[48px] px-[25px] border border-white rounded-full bg-white text-[#050505] text-[11px] font-extrabold tracking-[0.1em] cursor-pointer hover:bg-[#d8d8d8]"
              >
                SPIN AGAIN
              </button>

            </div>
          )}

        </div>
      </main>

      <footer className="h-[58px] shrink-0 flex items-center justify-center text-[#777] text-[10px] tracking-[0.04em]">
        <a
          className="inline-flex items-center gap-[6px] text-[#bdbdbd] no-underline font-bold transition-colors hover:text-white"
          href="https://www.instagram.com/__gautam17/"
          target="_blank"
          rel="noopener noreferrer"
        >
          made by @__gautam17

          <svg
            className="w-[14px] h-[14px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" />
          </svg>
        </a>
      </footer>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/72 backdrop-blur-[14px] flex items-center justify-center p-[20px]">

          <div className="w-full max-w-[430px] max-h-[90vh] overflow-y-auto bg-[#0d0d0d] border border-[#242424] rounded-[20px] p-[23px]">

            <div className="flex justify-between items-center mb-[27px]">
              <div className="text-[21px] font-extrabold tracking-[-0.05em]">
                Settings
              </div>

              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-[32px] h-[32px] border border-[#242424] rounded-full bg-transparent text-[#8b8b8b] cursor-pointer text-[18px] leading-none hover:text-white hover:bg-[#181818]"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-[10px]">

              <div className="text-center p-[4px_8px_8px]">
                <div className="text-[#8b8b8b] text-[10px] font-extrabold tracking-[0.18em] uppercase mb-[25px]">
                  SPEECH
                </div>

                <div
                  {...selectorEvents("speakMinutes")}
                  className="h-[96px] flex items-center justify-center gap-[6px] select-none relative cursor-ns-resize"
                >
                  <div className="w-[66px] text-right text-[40px] leading-none font-bold tracking-[-0.06em] tabular-nums">
                    {settings.speakMinutes}
                  </div>

                  <div className="text-[#5c5c5c] text-[11px] font-bold self-center">
                    min
                  </div>

                  <div className="absolute left-1/2 -top-[6px] -translate-x-1/2 w-[120px] h-[108px] pointer-events-none">
                    <button
                      onClick={() => changeValue("speakMinutes", 1)}
                      className="absolute left-1/2 -translate-x-1/2 w-[40px] h-[25px] border-none bg-transparent text-[#444] cursor-pointer pointer-events-auto grid place-items-center -top-[2px] hover:text-white"
                    >
                      ▲
                    </button>

                    <button
                      onClick={() => changeValue("speakMinutes", -1)}
                      className="absolute left-1/2 -translate-x-1/2 w-[40px] h-[25px] border-none bg-transparent text-[#444] cursor-pointer pointer-events-auto grid place-items-center bottom-[2px] hover:text-white"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center p-[4px_8px_8px]">
                <div className="text-[#8b8b8b] text-[10px] font-extrabold tracking-[0.18em] uppercase mb-[25px]">
                  RESEARCH
                </div>

                <div
                  {...selectorEvents("researchMinutes")}
                  className="h-[96px] flex items-center justify-center gap-[6px] select-none relative cursor-ns-resize"
                >
                  <div className="w-[66px] text-right text-[40px] leading-none font-bold tracking-[-0.06em] tabular-nums">
                    {settings.researchMinutes}
                  </div>

                  <div className="text-[#5c5c5c] text-[11px] font-bold self-center">
                    min
                  </div>

                  <div className="absolute left-1/2 -top-[6px] -translate-x-1/2 w-[120px] h-[108px] pointer-events-none">
                    <button
                      onClick={() => changeValue("researchMinutes", 1)}
                      className="absolute left-1/2 -translate-x-1/2 w-[40px] h-[25px] border-none bg-transparent text-[#444] cursor-pointer pointer-events-auto grid place-items-center -top-[2px] hover:text-white"
                    >
                      ▲
                    </button>

                    <button
                      onClick={() => changeValue("researchMinutes", -1)}
                      className="absolute left-1/2 -translate-x-1/2 w-[40px] h-[25px] border-none bg-transparent text-[#444] cursor-pointer pointer-events-auto grid place-items-center bottom-[2px] hover:text-white"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-[22px] flex items-center justify-between px-[3px]">
              <span className="text-[#8b8b8b] text-[11px] font-bold tracking-[0.08em] uppercase">
                Sound Effect
              </span>

              <button
                onClick={() =>
                  setSettings((current) => ({
                    ...current,
                    muted: !current.muted,
                  }))
                }
                className={`w-[46px] h-[25px] p-[2px] border rounded-full cursor-pointer relative transition-all ${
                  !settings.muted
                    ? "bg-white border-white"
                    : "bg-[#151515] border-[#333]"
                }`}
              >
                <div
                  className={`w-[19px] h-[19px] rounded-full transition-all ${
                    !settings.muted
                      ? "translate-x-[21px] bg-[#080808]"
                      : "bg-[#666]"
                  }`}
                />
              </button>
            </div>

            <div className="mt-[22px] text-center">
              <div className="text-[#8b8b8b] text-[10px] font-extrabold tracking-[0.18em] uppercase mb-[25px]">
                TOPIC
              </div>

              <div
                {...selectorEvents("topic")}
                className="h-[96px] flex items-center justify-center gap-[6px] select-none relative cursor-ns-resize"
              >
                <div className="min-w-[150px] max-w-[230px] text-center text-[32px] leading-none font-bold tracking-[-0.06em] whitespace-nowrap overflow-hidden text-ellipsis">
                  {settings.topic}
                </div>

                <div className="absolute left-1/2 -top-[6px] -translate-x-1/2 w-[180px] h-[108px] pointer-events-none">
                  <button
                    onClick={() => changeValue("topic", 1)}
                    className="absolute left-1/2 -translate-x-1/2 w-[40px] h-[25px] border-none bg-transparent text-[#444] cursor-pointer pointer-events-auto grid place-items-center -top-[2px] hover:text-white"
                  >
                    ▲
                  </button>

                  <button
                    onClick={() => changeValue("topic", -1)}
                    className="absolute left-1/2 -translate-x-1/2 w-[40px] h-[25px] border-none bg-transparent text-[#444] cursor-pointer pointer-events-auto grid place-items-center bottom-[2px] hover:text-white"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-[27px]">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="h-[40px] px-[17px] border-none rounded-[9px] bg-white text-[#080808] text-[10px] font-extrabold tracking-[0.08em] cursor-pointer hover:bg-[#d8d8d8]"
              >
                SAVE CHANGES
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}