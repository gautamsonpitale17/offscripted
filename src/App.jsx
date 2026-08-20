import React, { useEffect, useRef, useState } from "react";

const questionBanks = {
  API: [
    "What is an API?",
    "What is the difference between REST and SOAP?",
    "What are HTTP methods?",
    "What is the difference between PUT and PATCH?",
    "What are HTTP status codes?",
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
    "Why is Python considered an interpreted language?",
    "What are Python data types?",
    "What are mutable and immutable types in Python?",
    "What is the difference between list, tuple, set, and dictionary?",
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
    "What are Routes?",
    "What is useNavigate?",
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
    "What is the Tailwind configuration file?",
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
    "What is the difference between block and inline elements?",
  ],
};

const topics = Object.keys(questionBanks);

export default function App() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("offscripted_settings");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        return {
          speakMinutes: parsed.speakMinutes ?? 1,
          researchMinutes: parsed.researchMinutes ?? 10,
          muted: parsed.muted ?? false,
          topic: parsed.topic ?? "Python",
          speakingMode: parsed.speakingMode ?? "normal",
        };
      } catch {
        // fallback
      }
    }

    return {
      speakMinutes: 1,
      researchMinutes: 10,
      muted: false,
      topic: "Python",
      speakingMode: "normal",
    };
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [currentText, setCurrentText] = useState("READY?");
  const [timerState, setTimerState] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [timerDuration, setTimerDuration] = useState(0);

  const [isComplete, setIsComplete] = useState(false);
  const [viewMode, setViewMode] = useState("idle");

  const [recordingMode, setRecordingMode] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const [recordingBlob, setRecordingBlob] = useState(null);

  const audioCtxRef = useRef(null);

  // NEW:
  // Dedicated master audio chain for mobile loudness consistency.
  const audioMasterRef = useRef(null);
  const audioCompressorRef = useRef(null);

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const videoRef = useRef(null);
  const audioChunksRef = useRef([]);

  const usedQuestionsRef = useRef({});

  useEffect(() => {
    localStorage.setItem(
      "offscripted_settings",
      JSON.stringify(settings)
    );
  }, [settings]);

  /*
    COMPLETE PAGE SCROLL LOCK
  */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlHeight = html.style.height;
    const previousHtmlWidth = html.style.width;

    const previousBodyOverflow = body.style.overflow;
    const previousBodyHeight = body.style.height;
    const previousBodyWidth = body.style.width;
    const previousBodyMargin = body.style.margin;

    html.style.overflow = "hidden";
    html.style.height = "100%";
    html.style.width = "100%";

    body.style.overflow = "hidden";
    body.style.height = "100%";
    body.style.width = "100%";
    body.style.margin = "0";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      html.style.height = previousHtmlHeight;
      html.style.width = previousHtmlWidth;

      body.style.overflow = previousBodyOverflow;
      body.style.height = previousBodyHeight;
      body.style.width = previousBodyWidth;
      body.style.margin = previousBodyMargin;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }

      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [recordingUrl]);

  /* KEYBOARD ACCESSIBILITY */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isSettingsOpen) {
        setIsSettingsOpen(false);
        return;
      }

      if (event.key === "Enter" && !isSettingsOpen && !isComplete) {
        if (viewMode === "idle" && !isSpinning) {
          spin();
        } else if (
          viewMode === "selected" &&
          selectedQuestion &&
          !isSpinning
        ) {
          startResearchTimer();
        } else if (timerState === "speakReady") {
          handleSpeakButton();
        }
      }

      if (event.key === "Escape" && isComplete) {
        closeCompletedSession();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isSettingsOpen,
    isComplete,
    viewMode,
    isSpinning,
    selectedQuestion,
    timerState,
  ]);

  /* MODAL SCROLL LOCK */
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    };
  }, [isSettingsOpen, isComplete]);

  /*
    MOBILE AUDIO INITIALIZATION

    The important change is the audio output chain:

    Oscillator
       ↓
    Individual Gain
       ↓
    Compressor
       ↓
    Master Gain
       ↓
    Device speakers

    This allows the sound to be considerably louder while
    keeping the peaks controlled.
  */
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) {
        return;
      }

      const ctx = new AudioContextClass();

      audioCtxRef.current = ctx;

      /*
        Compressor prevents the louder signal from becoming
        excessively harsh or clipping on mobile speakers.
      */
      const compressor = ctx.createDynamicsCompressor();

      compressor.threshold.setValueAtTime(-20, ctx.currentTime);
      compressor.knee.setValueAtTime(18, ctx.currentTime);
      compressor.ratio.setValueAtTime(4, ctx.currentTime);
      compressor.attack.setValueAtTime(0.008, ctx.currentTime);
      compressor.release.setValueAtTime(0.18, ctx.currentTime);

      /*
        Master gain provides the additional loudness.
      */
      const masterGain = ctx.createGain();

      masterGain.gain.setValueAtTime(1.65, ctx.currentTime);

      compressor.connect(masterGain);
      masterGain.connect(ctx.destination);

      audioCompressorRef.current = compressor;
      audioMasterRef.current = masterGain;
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }

    /*
      Some mobile browsers need the resume to happen immediately
      after the user's interaction.
    */
    if (
      audioCtxRef.current.state === "interrupted" &&
      typeof audioCtxRef.current.resume === "function"
    ) {
      audioCtxRef.current.resume().catch(() => {});
    }
  };

  /*
    LOUDER SPINNING SOUND

    Increased from the previous very-low 0.018 peak.

    The attack remains smooth so the sound does not suddenly
    jump loudly.
  */
  const playTick = (intensity = 1) => {
    if (settings.muted) return;

    initAudio();

    const ctx = audioCtxRef.current;
    const master = audioMasterRef.current;

    if (!ctx || !master) return;

    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(560, now);

    oscillator.frequency.exponentialRampToValueAtTime(
      185,
      now + 0.085
    );

    /*
      Much louder than the original.

      Still uses a smooth exponential attack.
    */
    const peak = Math.max(
      0.0001,
      0.075 * intensity
    );

    gain.gain.setValueAtTime(0.0001, now);

    gain.gain.exponentialRampToValueAtTime(
      peak,
      now + 0.022
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.105
    );

    oscillator.connect(gain);
    gain.connect(master);

    oscillator.start(now);
    oscillator.stop(now + 0.11);
  };

  /*
    LOUDER COMPLETION SOUND

    Smooth attack + controlled release.
  */
  const playCompletionSound = () => {
    if (settings.muted) return;

    initAudio();

    const ctx = audioCtxRef.current;
    const master = audioMasterRef.current;

    if (!ctx || !master) return;

    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
      420,
      now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      620,
      now + 0.18
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      760,
      now + 0.38
    );

    /*
      Increased considerably from the original 0.045.

      The attack is still gradual.
    */
    gain.gain.setValueAtTime(
      0.0001,
      now
    );

    gain.gain.exponentialRampToValueAtTime(
      0.13,
      now + 0.055
    );

    gain.gain.exponentialRampToValueAtTime(
      0.075,
      now + 0.20
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.52
    );

    oscillator.connect(gain);
    gain.connect(master);

    oscillator.start(now);
    oscillator.stop(now + 0.55);
  };

  const getRandomQuestion = (topic) => {
    const questions = questionBanks[topic] || [];

    if (!questions.length) {
      return "Tell me everything you know about this technology.";
    }

    if (!usedQuestionsRef.current[topic]) {
      usedQuestionsRef.current[topic] = [];
    }

    let used = usedQuestionsRef.current[topic];

    if (used.length >= questions.length) {
      usedQuestionsRef.current[topic] = [];
      used = [];
    }

    const availableQuestions = questions.filter(
      (question) => !used.includes(question)
    );

    const randomQuestion =
      availableQuestions[
        Math.floor(Math.random() * availableQuestions.length)
      ];

    usedQuestionsRef.current[topic].push(randomQuestion);

    return randomQuestion;
  };

  const spin = async () => {
    if (isSpinning) return;

    /*
      Initialize audio directly from the user's button interaction.
      This is important for mobile autoplay policies.
    */
    initAudio();

    setIsComplete(false);
    setIsSpinning(true);

    setSelectedQuestion(null);
    setCurrentText("READY?");

    setViewMode("spinning");

    const finalTopic = settings.topic;
    const finalQuestion = getRandomQuestion(finalTopic);

    const totalTicks =
      28 + Math.floor(Math.random() * 12);

    for (let i = 0; i < totalTicks; i++) {
      let currentQuestion;

      if (i === totalTicks - 1) {
        currentQuestion = finalQuestion;
      } else {
        const randomTopic =
          topics[
            Math.floor(
              Math.random() * topics.length
            )
          ];

        const randomQuestions =
          questionBanks[randomTopic] || [];

        currentQuestion =
          randomQuestions[
            Math.floor(
              Math.random() * randomQuestions.length
            )
          ];
      }

      setCurrentText(currentQuestion);

      const progress = i / totalTicks;

      playTick(1 - progress * 0.25);

      await new Promise((resolve) =>
        setTimeout(
          resolve,
          45 + Math.pow(progress, 3) * 390
        )
      );
    }

    setSelectedTopic(finalTopic);
    setSelectedQuestion(finalQuestion);
    setCurrentText(finalQuestion);

    setIsSpinning(false);
    setViewMode("selected");
  };

  useEffect(() => {
    let interval = null;

    if (
      timerState === "research" ||
      timerState === "speak"
    ) {
      interval = setInterval(() => {
        setRemainingSeconds((previous) => {
          if (previous <= 1) {
            clearInterval(interval);

            if (timerState === "research") {
              playCompletionSound();
              setTimerState("speakReady");
            } else {
              playCompletionSound();

              if (
                recordingMode === "audio" ||
                recordingMode === "video"
              ) {
                stopMediaRecording();
              }

              setIsComplete(true);
              setTimerState(null);
              setViewMode("idle");
            }

            return 0;
          }

          return previous - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerState, recordingMode]);

  const startResearchTimer = () => {
    if (!selectedQuestion) return;

    /*
      Initialize audio in case the research timer is started
      directly from a user interaction.
    */
    initAudio();

    const duration =
      settings.researchMinutes * 60;

    setTimerDuration(duration);
    setRemainingSeconds(duration);
    setTimerState("research");
    setViewMode("activeTimer");
  };

  const handleDoneResearch = () => {
    setTimerState("speakReady");
    setRecordingMode(null);
  };

  const handleSpeakButton = async () => {
    initAudio();

    if (settings.speakingMode === "normal") {
      startNormalSpeaking();
    } else if (
      settings.speakingMode === "audio"
    ) {
      await startAudioSpeaking();
    } else if (
      settings.speakingMode === "video"
    ) {
      await startVideoSpeaking();
    }
  };

  const startNormalSpeaking = () => {
    const duration =
      settings.speakMinutes * 60;

    setRecordingMode("normal");
    setTimerDuration(duration);
    setRemainingSeconds(duration);
    setTimerState("speak");
    setViewMode("activeTimer");
  };

  const createRecorder = (stream, mode) => {
    audioChunksRef.current = [];

    let options = {};

    if (mode === "video") {
      if (
        MediaRecorder.isTypeSupported(
          "video/webm;codecs=vp9,opus"
        )
      ) {
        options.mimeType =
          "video/webm;codecs=vp9,opus";
      } else if (
        MediaRecorder.isTypeSupported("video/webm")
      ) {
        options.mimeType = "video/webm";
      }
    } else {
      if (
        MediaRecorder.isTypeSupported(
          "audio/webm;codecs=opus"
        )
      ) {
        options.mimeType =
          "audio/webm;codecs=opus";
      } else if (
        MediaRecorder.isTypeSupported("audio/webm")
      ) {
        options.mimeType = "audio/webm";
      }
    }

    const recorder =
      new MediaRecorder(stream, options);

    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(
          event.data
        );
      }
    };

    recorder.onstop = () => {
      const mimeType =
        recorder.mimeType ||
        (mode === "video"
          ? "video/webm"
          : "audio/webm");

      const blob = new Blob(
        audioChunksRef.current,
        {
          type: mimeType,
        }
      );

      const url =
        URL.createObjectURL(blob);

      setRecordingBlob(blob);
      setRecordingUrl(url);

      if (mediaStreamRef.current) {
        mediaStreamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

        mediaStreamRef.current = null;
      }

      setIsRecording(false);
    };

    recorder.start();

    setIsRecording(true);

    const duration =
      settings.speakMinutes * 60;

    setTimerDuration(duration);
    setRemainingSeconds(duration);
    setTimerState("speak");
    setViewMode("activeTimer");
  };

  const startAudioSpeaking = async () => {
    try {
      initAudio();

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        alert(
          "Audio recording is not supported by this browser."
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      mediaStreamRef.current = stream;

      setRecordingMode("audio");

      createRecorder(stream, "audio");
    } catch (error) {
      console.error(error);

      alert(
        "Microphone permission is required for audio recording."
      );

      setRecordingMode(null);
    }
  };

  const startVideoSpeaking = async () => {
    try {
      initAudio();

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        alert(
          "Video recording is not supported by this browser."
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      mediaStreamRef.current = stream;

      setRecordingMode("video");

      createRecorder(stream, "video");
    } catch (error) {
      console.error(error);

      alert(
        "Camera and microphone permission are required for video recording."
      );

      setRecordingMode(null);
    }
  };

  const stopMediaRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !==
        "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const closeTimer = () => {
    if (isRecording) {
      stopMediaRecording();
    }

    setTimerState(null);
    setRecordingMode(null);

    setViewMode(
      selectedQuestion
        ? "selected"
        : "idle"
    );
  };

  /*
    CLOSE AFTER SESSION

    Keep previous topic visible.
    Clear previous question.
  */
  const closeCompletedSession = () => {
    if (isRecording) {
      stopMediaRecording();
    }

    if (recordingUrl) {
      URL.revokeObjectURL(recordingUrl);
    }

    setRecordingUrl(null);
    setRecordingBlob(null);

    setIsComplete(false);

    setSelectedQuestion(null);

    setCurrentText("READY?");

    setTimerState(null);
    setRecordingMode(null);
    setIsRecording(false);

    setViewMode("idle");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const secs = seconds % 60;

    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(secs).padStart(2, "0")
    );
  };

  const circleLength =
    2 * Math.PI * 126;

  return (
    <div className="fixed inset-0 w-full h-[100dvh] max-h-[100dvh] overflow-hidden overscroll-none flex flex-col bg-[#050505] text-[#f5f5f5] selection:bg-neutral-800">

      {/* HEADER */}
      <header className="h-[78px] px-[20px] sm:px-[34px] flex items-center justify-between shrink-0">
        <div className="text-[18px] font-extrabold tracking-tight select-none">
          offScripted
          <span className="text-[#5c5c5c] font-medium">
            .
          </span>
        </div>

        <div className="flex items-center">
          <button
            onClick={() =>
              setIsSettingsOpen(true)
            }
            className="w-[42px] h-[42px] border border-transparent rounded-full bg-transparent text-[#8b8b8b] grid place-items-center cursor-pointer transition-all duration-250 hover:text-white hover:bg-[#111] hover:border-[#242424] active:scale-95"
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
              <circle
                cx="16"
                cy="7"
                r="2"
              />
              <circle
                cx="8"
                cy="17"
                r="2"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 min-h-0 w-full flex items-center justify-center px-[14px] sm:px-[24px] pb-[20px] sm:pb-[35px] overflow-hidden overscroll-none">
        <div className="w-full max-w-[1100px] flex flex-col items-center justify-center text-center">

          {/* YOUR TOPIC / SELECTED TOPIC */}
          {viewMode !== "activeTimer" && (
            <div
              className={`text-[#777] text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase mb-[22px] sm:mb-[30px] min-h-[12px] transition-opacity duration-300 ${
                isSpinning
                  ? "opacity-0"
                  : "opacity-100"
              }`}
            >
              {selectedTopic ||
                "YOUR TOPIC"}
            </div>
          )}

          {/* MAIN TEXT */}
          {viewMode !== "activeTimer" && (
            <div className="w-full min-h-[160px] sm:min-h-[190px] flex items-center justify-center overflow-hidden relative">
              <div
                className={`max-w-full px-[12px] sm:px-[20px] break-words ${
                  viewMode === "idle"
                    ? "text-[clamp(70px,12vw,150px)] font-black tracking-[-0.09em] text-[#777]"
                    : viewMode === "spinning"
                    ? "text-[clamp(38px,7vw,88px)] font-extrabold tracking-[-0.075em] text-[#d7d7d7]"
                    : "text-[clamp(38px,7vw,88px)] font-extrabold tracking-[-0.075em] text-white animate-topic-reveal"
                }`}
              >
                {currentText}
              </div>
            </div>
          )}

          {/* BUTTONS */}
          {viewMode !== "activeTimer" &&
            !isSpinning && (
              <div className="mt-[38px] sm:mt-[48px] flex flex-col items-center justify-center gap-[14px] w-full">
                <div className="flex items-center justify-center gap-[8px]">

                  {/* SPIN */}
                  <button
                    onClick={spin}
                    disabled={isSpinning}
                    aria-label="Spin"
                    className={`min-w-[118px] sm:min-w-[150px] h-[46px] sm:h-[52px] px-[20px] sm:px-[28px] border rounded-full text-[10px] sm:text-[12px] font-extrabold tracking-[0.1em] cursor-pointer transition-all duration-200 hover:translate-y-[-2px] active:translate-y-0 active:scale-95 ${
                      selectedQuestion
                        ? "border-[#333] bg-transparent text-[#777] hover:text-white hover:border-[#666]"
                        : "border-white bg-white text-[#080808] hover:bg-[#d8d8d8]"
                    }`}
                  >
                    SPIN
                  </button>

                  {/* RESEARCH */}
                  <button
                    onClick={
                      startResearchTimer
                    }
                    disabled={
                      !selectedQuestion ||
                      isSpinning
                    }
                    aria-label="Research"
                    className={`min-w-[118px] sm:min-w-[150px] h-[46px] sm:h-[52px] px-[20px] sm:px-[28px] border rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.08em] transition-all duration-200 active:scale-95 ${
                      selectedQuestion &&
                      !isSpinning
                        ? "border-white bg-white text-[#080808] hover:bg-[#d8d8d8] hover:translate-y-[-1px] cursor-pointer"
                        : "border-[#242424] bg-[#111] text-[#8b8b8b] opacity-25 cursor-not-allowed pointer-events-none"
                    }`}
                  >
                    RESEARCH
                  </button>
                </div>
              </div>
            )}
        </div>
      </main>

      {/* TIMER */}
      {viewMode ===
        "activeTimer" && (
        <main className="fixed inset-0 w-full h-[100dvh] max-h-[100dvh] overflow-hidden flex items-center justify-center px-[14px]">
          <div className="flex flex-col items-center justify-center w-full">

            {/* CONTENT ABOVE CIRCLE */}
            <div className="flex flex-col items-center justify-center min-h-[80px] mb-[24px] sm:mb-[35px]">

              <div className="max-w-[900px] px-[15px] text-[clamp(14px,2.2vw,22px)] font-bold text-white text-center">
                {selectedQuestion ||
                  selectedTopic}
              </div>

              {timerState ===
                "research" && (
                <div className="mt-[12px] text-[10px] sm:text-[12px] font-light text-[#8b8b8b] tracking-[0.15em] uppercase text-center">
                  RESEARCHING
                </div>
              )}

              {timerState ===
                "speak" &&
                recordingMode ===
                  "audio" && (
                  <div className="mt-[12px] text-[10px] sm:text-[12px] font-light text-[#8b8b8b] tracking-[0.15em] uppercase text-center">
                    {isRecording
                      ? "RECORDING"
                      : "AUDIO"}
                  </div>
                )}

              {timerState ===
                "speak" &&
                recordingMode ===
                  "video" && (
                  <div className="mt-[12px] text-[10px] sm:text-[12px] font-light text-[#8b8b8b] tracking-[0.15em] uppercase text-center">
                    {isRecording
                      ? "RECORDING"
                      : "VIDEO"}
                  </div>
                )}
            </div>

            {/* COUNTDOWN CIRCLE */}
            <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] rounded-full flex flex-col items-center justify-center shrink-0">

              <svg
                className="absolute top-0 left-0 w-full h-full -rotate-90 overflow-visible"
                viewBox="0 0 260 260"
              >
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
                    strokeDasharray:
                      circleLength,

                    strokeDashoffset:
                      circleLength *
                      (1 -
                        remainingSeconds /
                          timerDuration),
                  }}
                />
              </svg>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[48px] sm:text-[56px] font-extrabold tracking-[-0.05em] leading-none tabular-nums m-0 text-center z-10">
                {formatTime(
                  remainingSeconds
                )}
              </div>
            </div>

            {/* CONTENT BELOW CIRCLE */}
            <div className="mt-[28px] sm:mt-[38px] min-h-[70px] flex items-center justify-center">

              {/* RESEARCH DONE */}
              {timerState ===
                "research" && (
                <div className="flex items-center justify-center gap-[12px]">

                  <button
                    onClick={
                      handleDoneResearch
                    }
                    className="w-[130px] sm:w-[150px] h-[46px] sm:h-[52px] px-[20px] sm:px-[28px] border border-white rounded-full bg-white text-[#080808] text-[10px] sm:text-[12px] font-extrabold tracking-[0.1em] cursor-pointer hover:bg-[#d8d8d8] active:scale-95 transition-transform duration-150"
                  >
                    DONE
                  </button>

                  <button
                    onClick={closeTimer}
                    className="w-[130px] sm:w-[150px] h-[46px] sm:h-[52px] px-[20px] sm:px-[28px] border border-[#333] rounded-full bg-transparent text-[#777] text-[10px] sm:text-[12px] font-extrabold tracking-[0.1em] cursor-pointer hover:text-white hover:border-[#666] active:scale-95 transition-transform duration-150"
                  >
                    CLOSE
                  </button>
                </div>
              )}

              {/* SPEAK BUTTON */}
              {timerState ===
                "speakReady" && (
                <div className="flex items-center justify-center gap-[12px]">

                  <button
                    onClick={
                      handleSpeakButton
                    }
                    className="w-[130px] sm:w-[150px] h-[46px] sm:h-[52px] px-[20px] sm:px-[28px] border border-white rounded-full bg-white text-[#080808] text-[10px] sm:text-[12px] font-extrabold tracking-[0.1em] cursor-pointer hover:bg-[#d8d8d8] active:scale-95 transition-transform duration-150"
                  >
                    SPEAK
                  </button>

                  <button
                    onClick={closeTimer}
                    className="w-[130px] sm:w-[150px] h-[46px] sm:h-[52px] px-[20px] sm:px-[28px] border border-[#333] rounded-full bg-transparent text-[#777] text-[10px] sm:text-[12px] font-extrabold tracking-[0.1em] cursor-pointer hover:text-white hover:border-[#666] active:scale-95 transition-transform duration-150"
                  >
                    CLOSE
                  </button>
                </div>
              )}

              {/* SPEAKING TIMER */}
              {timerState ===
                "speak" && (
                <div className="flex items-center justify-center gap-[12px]">

                  <button
                    onClick={() => {
                      if (
                        recordingMode ===
                          "audio" ||
                        recordingMode ===
                          "video"
                      ) {
                        stopMediaRecording();
                      }

                      setTimerState(null);
                      setIsComplete(true);
                      setViewMode("idle");
                    }}
                    className="w-[130px] sm:w-[150px] h-[46px] sm:h-[52px] px-[20px] sm:px-[28px] border border-white rounded-full bg-white text-[#080808] text-[10px] sm:text-[12px] font-extrabold tracking-[0.1em] cursor-pointer hover:bg-[#d8d8d8] active:scale-95 transition-transform duration-150"
                  >
                    DONE
                  </button>

                  <button
                    onClick={closeTimer}
                    className="w-[130px] sm:w-[150px] h-[46px] sm:h-[52px] px-[20px] sm:px-[28px] border border-[#333] rounded-full bg-transparent text-[#777] text-[10px] sm:text-[12px] font-extrabold tracking-[0.1em] cursor-pointer hover:text-white hover:border-[#666] active:scale-95 transition-transform duration-150"
                  >
                    CLOSE
                  </button>

                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className="h-[58px] shrink-0 flex items-center justify-center text-[#777] text-[10px] tracking-[0.04em]">

        <a
          className="inline-flex items-center gap-[6px] text-[#bdbdbd] no-underline font-semibold transition-colors hover:text-white"
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
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="5"
            />

            <circle
              cx="12"
              cy="12"
              r="4"
            />

            <circle
              cx="17.5"
              cy="6.5"
              r="1"
            />
          </svg>
        </a>
      </footer>

      {/* SETTINGS */}
      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/72 backdrop-blur-[14px] flex items-center justify-center p-[20px] overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Settings"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setIsSettingsOpen(false);
            }
          }}
        >
          <div className="w-full max-w-[430px] max-h-[90dvh] overflow-hidden bg-[#0d0d0d] border border-[#242424] rounded-[20px] p-[23px]">

            <div className="flex justify-between items-center mb-[27px]">

              <div className="text-[21px] font-extrabold tracking-[-0.05em]">
                Settings
              </div>

              <button
                onClick={() =>
                  setIsSettingsOpen(false)
                }
                aria-label="Close settings"
                className="w-[32px] h-[32px] border border-[#242424] rounded-full bg-transparent text-[#8b8b8b] cursor-pointer text-[18px] leading-none hover:text-white hover:bg-[#181818] active:scale-95 transition-transform duration-150"
              >
                ×
              </button>

            </div>

            <div className="grid grid-cols-2 gap-[10px]">

              {/* SPEECH */}
              <div className="text-center p-[4px_8px_8px]">

                <div className="text-[#8b8b8b] text-[10px] font-extrabold tracking-[0.18em] uppercase mb-[25px]">
                  SPEECH
                </div>

                <div
                  className="h-[96px] flex items-center justify-center gap-[6px] select-none relative"
                  onWheel={(event) => {
                    event.preventDefault();

                    setSettings((s) => ({
                      ...s,
                      speakMinutes:
                        Math.max(
                          1,
                          Math.min(
                            10,
                            s.speakMinutes +
                              (event.deltaY < 0
                                ? 1
                                : -1)
                          )
                        ),
                    }));
                  }}
                  onTouchStart={(event) => {
                    event.currentTarget.dataset.startY =
                      event.touches[0].clientY;
                  }}
                  onTouchMove={(event) => {
                    const startY = Number(
                      event.currentTarget.dataset
                        .startY
                    );

                    const currentY =
                      event.touches[0].clientY;

                    const diff =
                      startY - currentY;

                    if (
                      Math.abs(diff) > 25
                    ) {
                      setSettings((s) => ({
                        ...s,
                        speakMinutes:
                          Math.max(
                            1,
                            Math.min(
                              10,
                              s.speakMinutes +
                                (diff > 0
                                  ? 1
                                  : -1)
                            )
                          ),
                      }));

                      event.currentTarget.dataset.startY =
                        currentY;
                    }
                  }}
                >
                  <div className="w-[66px] text-right text-[40px] leading-none font-bold tracking-[-0.06em] tabular-nums">
                    {settings.speakMinutes}
                  </div>

                  <div className="text-[#5c5c5c] text-[11px] font-bold self-center">
                    min
                  </div>

                  <div className="absolute left-1/2 -top-[6px] -translate-x-1/2 w-[120px] h-[108px] pointer-events-none">

                    <button
                      onClick={() =>
                        setSettings((s) => ({
                          ...s,
                          speakMinutes:
                            Math.min(
                              10,
                              s.speakMinutes +
                                1
                            ),
                        }))
                      }
                      aria-label="Increase speaking time"
                      className="absolute left-1/2 -translate-x-1/2 w-[40px] h-[25px] border-none bg-transparent text-[#444] cursor-pointer pointer-events-auto grid place-items-center -top-[2px] hover:text-white active:scale-90 transition-transform"
                    >
                      ▲
                    </button>

                    <button
                      onClick={() =>
                        setSettings((s) => ({
                          ...s,
                          speakMinutes:
                            Math.max(
                              1,
                              s.speakMinutes -
                                1
                            ),
                        }))
                      }
                      aria-label="Decrease speaking time"
                      className="absolute left-1/2 -translate-x-1/2 w-[40px] h-[25px] border-none bg-transparent text-[#444] cursor-pointer pointer-events-auto grid place-items-center bottom-[2px] hover:text-white active:scale-90 transition-transform"
                    >
                      ▼
                    </button>

                  </div>
                </div>
              </div>

              {/* RESEARCH */}
              <div className="text-center p-[4px_8px_8px]">

                <div className="text-[#8b8b8b] text-[10px] font-extrabold tracking-[0.18em] uppercase mb-[25px]">
                  RESEARCH
                </div>

                <div
                  className="h-[96px] flex items-center justify-center gap-[6px] select-none relative"
                  onWheel={(event) => {
                    event.preventDefault();

                    setSettings((s) => ({
                      ...s,
                      researchMinutes:
                        Math.max(
                          1,
                          Math.min(
                            30,
                            s.researchMinutes +
                              (event.deltaY < 0
                                ? 1
                                : -1)
                          )
                        ),
                    }));
                  }}
                  onTouchStart={(event) => {
                    event.currentTarget.dataset.startY =
                      event.touches[0].clientY;
                  }}
                  onTouchMove={(event) => {
                    const startY = Number(
                      event.currentTarget.dataset
                        .startY
                    );

                    const currentY =
                      event.touches[0].clientY;

                    const diff =
                      startY - currentY;

                    if (
                      Math.abs(diff) > 25
                    ) {
                      setSettings((s) => ({
                        ...s,
                        researchMinutes:
                          Math.max(
                            1,
                            Math.min(
                              30,
                              s.researchMinutes +
                                (diff > 0
                                  ? 1
                                  : -1)
                            )
                          ),
                      }));

                      event.currentTarget.dataset.startY =
                        currentY;
                    }
                  }}
                >
                  <div className="w-[66px] text-right text-[40px] leading-none font-bold tracking-[-0.06em] tabular-nums">
                    {settings.researchMinutes}
                  </div>

                  <div className="text-[#5c5c5c] text-[11px] font-bold self-center">
                    min
                  </div>

                  <div className="absolute left-1/2 -top-[6px] -translate-x-1/2 w-[120px] h-[108px] pointer-events-none">

                    <button
                      onClick={() =>
                        setSettings((s) => ({
                          ...s,
                          researchMinutes:
                            Math.min(
                              30,
                              s.researchMinutes +
                                1
                            ),
                        }))
                      }
                      aria-label="Increase research time"
                      className="absolute left-1/2 -translate-x-1/2 w-[40px] h-[25px] border-none bg-transparent text-[#444] cursor-pointer pointer-events-auto grid place-items-center -top-[2px] hover:text-white active:scale-90 transition-transform"
                    >
                      ▲
                    </button>

                    <button
                      onClick={() =>
                        setSettings((s) => ({
                          ...s,
                          researchMinutes:
                            Math.max(
                              1,
                              s.researchMinutes -
                                1
                            ),
                        }))
                      }
                      aria-label="Decrease research time"
                      className="absolute left-1/2 -translate-x-1/2 w-[40px] h-[25px] border-none bg-transparent text-[#444] cursor-pointer pointer-events-auto grid place-items-center bottom-[2px] hover:text-white active:scale-90 transition-transform"
                    >
                      ▼
                    </button>

                  </div>
                </div>
              </div>
            </div>

            {/* SOUND */}
            <div className="mt-[22px] flex items-center justify-between px-[3px]">

              <span className="text-[#8b8b8b] text-[11px] font-bold tracking-[0.08em] uppercase">
                Sound Effect
              </span>

              <button
                onClick={() =>
                  setSettings((s) => ({
                    ...s,
                    muted: !s.muted,
                  }))
                }
                aria-label={
                  settings.muted
                    ? "Enable sound"
                    : "Mute sound"
                }
                className={`w-[46px] h-[25px] p-[2px] border rounded-full cursor-pointer relative transition-all active:scale-95 ${
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

            {/* SPEAKING MODE */}
            <div className="mt-[22px]">

              <div className="text-[#8b8b8b] text-[10px] font-extrabold tracking-[0.18em] uppercase mb-[14px] text-center">
                SPEAKING MODE
              </div>

              <div className="grid grid-cols-3 gap-[7px]">

                {[
                  ["normal", "NORMAL"],
                  ["audio", "AUDIO"],
                  ["video", "VIDEO"],
                ].map(
                  ([value, label]) => (
                    <button
                      key={value}
                      onClick={() =>
                        setSettings(
                          (s) => ({
                            ...s,
                            speakingMode:
                              value,
                          })
                        )
                      }
                      className={`h-[42px] rounded-full border text-[9px] font-extrabold tracking-[0.08em] cursor-pointer transition-all active:scale-95 ${
                        settings.speakingMode ===
                        value
                          ? "border-white bg-white text-[#080808]"
                          : "border-[#333] bg-transparent text-[#777] hover:text-white hover:border-[#666]"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}

              </div>
            </div>

            {/* TOPIC */}
            <div className="mt-[22px] text-center">

              <div className="text-[#8b8b8b] text-[10px] font-extrabold tracking-[0.18em] uppercase mb-[25px]">
                TOPIC
              </div>

              <div
                className="h-[96px] flex items-center justify-center gap-[6px] select-none relative"
                onWheel={(event) => {
                  event.preventDefault();

                  const currentIndex =
                    topics.indexOf(
                      settings.topic
                    );

                  const nextIndex =
                    event.deltaY < 0
                      ? (currentIndex + 1) %
                        topics.length
                      : (currentIndex -
                          1 +
                          topics.length) %
                        topics.length;

                  setSettings((s) => ({
                    ...s,
                    topic:
                      topics[nextIndex],
                  }));
                }}
                onTouchStart={(event) => {
                  event.currentTarget.dataset.startY =
                    event.touches[0].clientY;
                }}
                onTouchMove={(event) => {
                  const startY = Number(
                    event.currentTarget.dataset
                      .startY
                  );

                  const currentY =
                    event.touches[0].clientY;

                  const diff =
                    startY - currentY;

                  if (
                    Math.abs(diff) > 25
                  ) {
                    const currentIndex =
                      topics.indexOf(
                        settings.topic
                      );

                    const nextIndex =
                      diff > 0
                        ? (currentIndex + 1) %
                          topics.length
                        : (currentIndex -
                            1 +
                            topics.length) %
                          topics.length;

                    setSettings((s) => ({
                      ...s,
                      topic:
                        topics[nextIndex],
                    }));

                    event.currentTarget.dataset.startY =
                      currentY;
                  }
                }}
              >
                <div className="min-w-[150px] max-w-[230px] text-center text-[32px] leading-none font-bold tracking-[-0.06em] whitespace-nowrap overflow-hidden text-ellipsis">
                  {settings.topic}
                </div>

                <div className="absolute left-1/2 -top-[6px] -translate-x-1/2 w-[180px] h-[108px] pointer-events-none">

                  <button
                    onClick={() => {
                      const index =
                        topics.indexOf(
                          settings.topic
                        );

                      const next =
                        topics[
                          (index + 1) %
                            topics.length
                        ];

                      setSettings((s) => ({
                        ...s,
                        topic: next,
                      }));
                    }}
                    aria-label="Next topic"
                    className="absolute left-1/2 -translate-x-1/2 w-[40px] h-[25px] border-none bg-transparent text-[#444] cursor-pointer pointer-events-auto grid place-items-center -top-[2px] hover:text-white active:scale-90 transition-transform"
                  >
                    ▲
                  </button>

                  <button
                    onClick={() => {
                      const index =
                        topics.indexOf(
                          settings.topic
                        );

                      const previous =
                        topics[
                          (index -
                            1 +
                            topics.length) %
                            topics.length
                        ];

                      setSettings((s) => ({
                        ...s,
                        topic: previous,
                      }));
                    }}
                    aria-label="Previous topic"
                    className="absolute left-1/2 -translate-x-1/2 w-[40px] h-[25px] border-none bg-transparent text-[#444] cursor-pointer pointer-events-auto grid place-items-center bottom-[2px] hover:text-white active:scale-90 transition-transform"
                  >
                    ▼
                  </button>

                </div>
              </div>
            </div>

            <div className="flex justify-end mt-[27px]">

              <button
                onClick={() =>
                  setIsSettingsOpen(false)
                }
                className="h-[40px] px-[17px] border-none rounded-[9px] bg-white text-[#080808] text-[10px] font-extrabold tracking-[0.08em] cursor-pointer hover:bg-[#d8d8d8] active:scale-95 transition-transform duration-150"
              >
                SAVE CHANGES
              </button>

            </div>
          </div>
        </div>
      )}

      {/* SESSION COMPLETE */}
      {isComplete && (
        <div
          className="fixed inset-0 z-[150] bg-[rgba(5,5,5,0.97)] flex items-center justify-center text-center p-[20px] sm:p-[30px] overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Session complete"
        >
          <div className="flex flex-col items-center max-w-full max-h-full overflow-hidden">

            <div className="text-[#8b8b8b] text-[10px] font-bold tracking-[0.2em] uppercase mb-[25px]">
              Session complete
            </div>

            {/* AUDIO RECORDING PLAYBACK */}
            {recordingMode ===
              "audio" &&
              recordingUrl && (
                <div className="mt-[5px] flex items-center justify-center">
                  <audio
                    src={recordingUrl}
                    controls
                    className="h-[40px] max-w-[280px]"
                  />
                </div>
              )}

            {/* VIDEO RECORDING PLAYBACK */}
            {recordingMode ===
              "video" &&
              recordingUrl && (
                <div className="mt-[5px] flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={recordingUrl}
                    controls
                    playsInline
                    className="w-[min(520px,80vw)] max-h-[55dvh] rounded-[12px] border border-[#242424] object-contain"
                  />
                </div>
              )}

            {/* NORMAL MODE: NO MESSAGE */}

            {/* CLOSE */}
            <button
              onClick={
                closeCompletedSession
              }
              aria-label="Close session"
              className="mt-[40px] h-[48px] min-w-[130px] px-[25px] border border-[#333] rounded-full bg-transparent text-[#777] text-[11px] font-extrabold tracking-[0.1em] cursor-pointer hover:text-white hover:border-[#666] active:scale-95 transition-all duration-150"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* GLOBAL STYLES */}
      <style>{`
        html,
        body,
        #root {
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden !important;
        }

        html {
          overscroll-behavior: none;
        }

        body {
          overscroll-behavior: none;
          overflow: hidden !important;
          touch-action: manipulation;
        }

        #root {
          overflow: hidden !important;
        }

        * {
          box-sizing: border-box;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes modalScaleIn {
          from {
            opacity: 0;
            transform: scale(0.97);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

