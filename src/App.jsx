import React, { useEffect, useRef, useState } from "react";

const questionBanks = {
  HTML: [
    "Document Structure",
    "DOCTYPE",
    "HTML Elements",
    "HTML Attributes",
    "Semantic Elements",
    "Headings",
    "Paragraphs",
    "Text Formatting",
    "Links",
    "Images",
    "Lists",
    "Tables",
    "Forms",
    "Input Types",
    "Form Validation",
    "Buttons",
    "Select and Option",
    "Audio and Video",
    "Iframes",
    "Canvas",
    "SVG",
    "Meta Tags",
    "Accessibility",
    "ARIA",
    "SEO",
  ],

  CSS: [
    "Selectors",
    "Specificity",
    "Cascade",
    "Inheritance",
    "Box Model",
    "Display",
    "Positioning",
    "Z-Index",
    "Overflow",
    "Flexbox",
    "Grid",
    "Responsive Design",
    "Media Queries",
    "Units",
    "Colors",
    "Typography",
    "Pseudo-Classes",
    "Pseudo-Elements",
    "Transitions",
    "Transforms",
    "Animations",
    "Variables",
    "Functions",
    "BEM",
    "Accessibility",
  ],

  JavaScript: [
    "Variables",
    "Data Types",
    "Operators",
    "Type Coercion",
    "Conditionals",
    "Loops",
    "Functions",
    "Arrow Functions",
    "Scope",
    "Hoisting",
    "Closures",
    "this Keyword",
    "Objects",
    "Arrays",
    "Destructuring",
    "Spread and Rest Operators",
    "Template Literals",
    "Array Methods",
    "Higher-Order Functions",
    "Promises",
    "Async and Await",
    "Event Loop",
    "DOM Manipulation",
    "Event Handling",
    "ES Modules",
  ],

  TypeScript: [
    "Type Annotations",
    "Type Inference",
    "Primitive Types",
    "Arrays and Tuples",
    "Enums",
    "Union Types",
    "Intersection Types",
    "Literal Types",
    "Type Aliases",
    "Interfaces",
    "Interface Extension",
    "Optional Properties",
    "Readonly Properties",
    "Function Types",
    "Optional Parameters",
    "Generics",
    "Generic Constraints",
    "Type Guards",
    "Type Assertions",
    "Keyof Operator",
    "Typeof Operator",
    "Utility Types",
    "Mapped Types",
    "Conditional Types",
    "Modules",
  ],

  React: [
    "Components",
    "JSX",
    "Props",
    "State",
    "Event Handling",
    "Conditional Rendering",
    "List Rendering",
    "Keys",
    "Forms",
    "Controlled Components",
    "Uncontrolled Components",
    "useState",
    "useEffect",
    "useRef",
    "useMemo",
    "useCallback",
    "useContext",
    "Custom Hooks",
    "Component Lifecycle",
    "Lifting State Up",
    "Prop Drilling",
    "Context API",
    "React Router",
    "Performance Optimization",
    "Error Boundaries",
  ],

  "Next.js": [
    "App Router",
    "Pages Router",
    "File-Based Routing",
    "Dynamic Routes",
    "Nested Routes",
    "Route Groups",
    "Layouts",
    "Loading UI",
    "Error Handling",
    "Server Components",
    "Client Components",
    "Server Actions",
    "Data Fetching",
    "Caching",
    "Revalidation",
    "Static Rendering",
    "Dynamic Rendering",
    "Incremental Static Regeneration",
    "Middleware",
    "Route Handlers",
    "API Routes",
    "Metadata",
    "Image Optimization",
    "Font Optimization",
    "Authentication",
  ],

  Angular: [
    "Components",
    "Templates",
    "Data Binding",
    "Interpolation",
    "Property Binding",
    "Event Binding",
    "Two-Way Binding",
    "Directives",
    "Structural Directives",
    "Attribute Directives",
    "Pipes",
    "Services",
    "Dependency Injection",
    "Modules",
    "Standalone Components",
    "Routing",
    "Route Parameters",
    "Guards",
    "Reactive Forms",
    "Template-Driven Forms",
    "Form Validation",
    "Observables",
    "RxJS",
    "HTTP Client",
    "Lifecycle Hooks",
  ],

  Vue: [
    "Components",
    "Templates",
    "Directives",
    "Data Binding",
    "Event Handling",
    "Computed Properties",
    "Watchers",
    "Conditional Rendering",
    "List Rendering",
    "Props",
    "Emits",
    "Slots",
    "Component Lifecycle",
    "Composition API",
    "Options API",
    "Reactive State",
    "ref",
    "reactive",
    "computed",
    "watch",
    "Composables",
    "Vue Router",
    "Pinia",
    "Forms",
    "Transitions",
  ],

  Svelte: [
    "Components",
    "Svelte Syntax",
    "Reactive Statements",
    "Reactive Declarations",
    "Props",
    "Event Handling",
    "Conditional Rendering",
    "List Rendering",
    "Bindings",
    "Class Directives",
    "Style Directives",
    "Slots",
    "Component Lifecycle",
    "Stores",
    "Writable Stores",
    "Derived Stores",
    "Context API",
    "Actions",
    "Transitions",
    "Animations",
    "Motion",
    "SvelteKit",
    "Routing",
    "Server-Side Rendering",
    "Form Actions",
  ],

  "Node.js": [
    "Runtime Architecture",
    "V8 Engine",
    "Event Loop",
    "Non-Blocking I/O",
    "Asynchronous Programming",
    "Callbacks",
    "Promises",
    "Async/Await",
    "Event Emitters",
    "Streams",
    "Buffers",
    "File System",
    "Path Module",
    "HTTP Module",
    "URL Module",
    "Process Object",
    "Environment Variables",
    "CommonJS Modules",
    "ES Modules",
    "NPM",
    "Package Management",
    "package.json",
    "Middleware",
    "Error Handling",
    "Child Processes",
  ],

  "Express.js": [
    "Application Setup",
    "Routing",
    "Route Parameters",
    "Query Parameters",
    "Request Object",
    "Response Object",
    "Middleware",
    "Application Middleware",
    "Router Middleware",
    "Built-in Middleware",
    "Error Handling",
    "Error Middleware",
    "Request Validation",
    "Response Handling",
    "HTTP Methods",
    "Route Handlers",
    "Router",
    "Nested Routers",
    "Static Files",
    "Template Engines",
    "CORS",
    "Cookies",
    "Sessions",
    "Authentication",
    "API Development",
  ],

  NestJS: [
    "Modules",
    "Controllers",
    "Providers",
    "Services",
    "Dependency Injection",
    "Decorators",
    "Middleware",
    "Guards",
    "Interceptors",
    "Pipes",
    "Exception Filters",
    "Request Lifecycle",
    "Routing",
    "Route Parameters",
    "Query Parameters",
    "Request Validation",
    "DTOs",
    "Class Validators",
    "Custom Decorators",
    "Configuration",
    "Environment Variables",
    "Authentication",
    "Authorization",
    "JWT",
    "Database Integration",
  ],

  Python: [
    "Variables",
    "Data Types",
    "Operators",
    "Type Conversion",
    "Conditional Statements",
    "Loops",
    "Functions",
    "Lambda Functions",
    "Scope",
    "Arguments and Parameters",
    "Lists",
    "Tuples",
    "Sets",
    "Dictionaries",
    "List Comprehensions",
    "String Manipulation",
    "Exception Handling",
    "File Handling",
    "Modules",
    "Packages",
    "Object-Oriented Programming",
    "Iterators",
    "Generators",
    "Decorators",
    "Context Managers",
  ],

  Django: [
    "Project Structure",
    "Apps",
    "URL Routing",
    "Views",
    "Templates",
    "Template Inheritance",
    "Models",
    "Model Fields",
    "Migrations",
    "Django ORM",
    "QuerySets",
    "Model Relationships",
    "Forms",
    "Form Validation",
    "Middleware",
    "Authentication",
    "Authorization",
    "Sessions",
    "Cookies",
    "Static Files",
    "Media Files",
    "Admin Interface",
    "Class-Based Views",
    "REST Framework",
    "Caching",
  ],

  FastAPI: [
    "Application Setup",
    "Path Operations",
    "Path Parameters",
    "Query Parameters",
    "Request Body",
    "Response Models",
    "Pydantic Models",
    "Data Validation",
    "Type Hints",
    "Dependency Injection",
    "Dependencies",
    "Middleware",
    "Exception Handling",
    "Custom Exceptions",
    "HTTP Status Codes",
    "Headers",
    "Cookies",
    "File Uploads",
    "Form Data",
    "Authentication",
    "Authorization",
    "OAuth2",
    "JWT Authentication",
    "Background Tasks",
    "Async Endpoints",
  ],

  Java: [
    "Variables",
    "Data Types",
    "Operators",
    "Type Casting",
    "Conditional Statements",
    "Loops",
    "Methods",
    "Method Overloading",
    "Classes and Objects",
    "Constructors",
    "Inheritance",
    "Polymorphism",
    "Abstraction",
    "Encapsulation",
    "Interfaces",
    "Abstract Classes",
    "Access Modifiers",
    "Static Keyword",
    "Final Keyword",
    "Exception Handling",
    "Collections Framework",
    "Generics",
    "Multithreading",
    "Streams",
    "Lambda Expressions",
  ],

  "Spring Boot": [
    "Project Structure",
    "Application Configuration",
    "Spring Boot Starters",
    "Dependency Injection",
    "Inversion of Control",
    "Beans",
    "Component Scanning",
    "Annotations",
    "Controllers",
    "REST APIs",
    "Request Mapping",
    "Request Parameters",
    "Request Body",
    "Response Entities",
    "Exception Handling",
    "Validation",
    "Profiles",
    "Configuration Properties",
    "Spring Data JPA",
    "Entities",
    "Repositories",
    "Database Relationships",
    "Transactions",
    "Spring Security",
    "Actuator",
  ],

  "C#": [
    "Variables",
    "Data Types",
    "Operators",
    "Type Casting",
    "Conditional Statements",
    "Loops",
    "Methods",
    "Method Overloading",
    "Classes and Objects",
    "Constructors",
    "Inheritance",
    "Polymorphism",
    "Encapsulation",
    "Abstraction",
    "Interfaces",
    "Abstract Classes",
    "Properties",
    "Access Modifiers",
    "Static Members",
    "Exception Handling",
    "Collections",
    "Generics",
    "Delegates",
    "LINQ",
    "Async and Await",
  ],

  ".NET": [
    "Runtime",
    "CLR",
    "CTS",
    "CLS",
    "Assemblies",
    "Namespaces",
    "Dependency Injection",
    "Configuration",
    "Middleware",
    "Routing",
    "Controllers",
    "Minimal APIs",
    "Web APIs",
    "Model Binding",
    "Model Validation",
    "Entity Framework Core",
    "LINQ",
    "Authentication",
    "Authorization",
    "Exception Handling",
    "Logging",
    "Caching",
    "Async Programming",
    "Background Services",
    "Application Configuration",
  ],

  Go: [
    "Variables",
    "Data Types",
    "Constants",
    "Operators",
    "Type Conversion",
    "Conditional Statements",
    "Loops",
    "Functions",
    "Multiple Return Values",
    "Pointers",
    "Structs",
    "Methods",
    "Interfaces",
    "Embedding",
    "Packages",
    "Modules",
    "Error Handling",
    "Goroutines",
    "Channels",
    "Select Statement",
    "Concurrency",
    "Mutexes",
    "Context",
    "Generics",
    "Reflection",
  ],

  PHP: [
    "Variables",
    "Data Types",
    "Operators",
    "Type Conversion",
    "Conditional Statements",
    "Loops",
    "Functions",
    "Anonymous Functions",
    "Closures",
    "Scope",
    "Arrays",
    "Strings",
    "Classes and Objects",
    "Constructors",
    "Inheritance",
    "Interfaces",
    "Traits",
    "Namespaces",
    "Exception Handling",
    "Error Handling",
    "Sessions",
    "Cookies",
    "File Handling",
    "Database Connectivity",
    "Composer",
  ],

  Laravel: [
    "Application Structure",
    "Routing",
    "Controllers",
    "Middleware",
    "Requests",
    "Responses",
    "Blade Templates",
    "Blade Components",
    "Forms",
    "Validation",
    "Sessions",
    "Cookies",
    "Authentication",
    "Authorization",
    "Service Container",
    "Service Providers",
    "Facades",
    "Eloquent ORM",
    "Models",
    "Migrations",
    "Relationships",
    "Query Builder",
    "Queues",
    "Events and Listeners",
    "API Resources",
  ],

  Ruby: [
    "Variables",
    "Data Types",
    "Operators",
    "Type Conversion",
    "Conditional Statements",
    "Loops",
    "Methods",
    "Blocks",
    "Procs",
    "Lambdas",
    "Arrays",
    "Hashes",
    "Strings",
    "Symbols",
    "Classes and Objects",
    "Inheritance",
    "Modules",
    "Mixins",
    "Encapsulation",
    "Exception Handling",
    "Iterators",
    "Enumerables",
    "Gems",
    "Metaprogramming",
    "Garbage Collection",
  ],

  SQL: [
    "SELECT Queries",
    "WHERE Clause",
    "ORDER BY Clause",
    "GROUP BY Clause",
    "HAVING Clause",
    "Aggregate Functions",
    "String Functions",
    "Date Functions",
    "NULL Values",
    "DISTINCT",
    "LIMIT and OFFSET",
    "Joins",
    "INNER JOIN",
    "LEFT JOIN",
    "RIGHT JOIN",
    "FULL JOIN",
    "Subqueries",
    "Common Table Expressions",
    "Window Functions",
    "CASE Expressions",
    "Primary Keys",
    "Foreign Keys",
    "Constraints",
    "Indexes",
    "Transactions",
  ],

  "Postgres SQL": [
    "Database and Schema",
    "Tables",
    "Data Types",
    "Constraints",
    "Primary Keys",
    "Foreign Keys",
    "Sequences",
    "Indexes",
    "Composite Indexes",
    "Partial Indexes",
    "Unique Indexes",
    "Views",
    "Materialized Views",
    "Functions",
    "Stored Procedures",
    "Triggers",
    "Transactions",
    "Isolation Levels",
    "Locks",
    "MVCC",
    "JSON and JSONB",
    "Array Data Types",
    "Common Table Expressions",
    "Window Functions",
    "Full-Text Search",
  ],

  MySQL: [
    "Database and Schema",
    "Tables",
    "Data Types",
    "Constraints",
    "Primary Keys",
    "Foreign Keys",
    "Unique Constraints",
    "Indexes",
    "Composite Indexes",
    "Views",
    "Stored Procedures",
    "Functions",
    "Triggers",
    "Transactions",
    "Isolation Levels",
    "Locks",
    "ACID Properties",
    "Joins",
    "Subqueries",
    "Common Table Expressions",
    "Window Functions",
    "JSON Data",
    "Normalization",
    "Query Optimization",
    "EXPLAIN",
  ],

  SQLite: [
    "Database Files",
    "Tables",
    "Data Types",
    "Constraints",
    "Primary Keys",
    "Foreign Keys",
    "Indexes",
    "Composite Indexes",
    "Unique Constraints",
    "Views",
    "Triggers",
    "Transactions",
    "ACID Properties",
    "Journaling",
    "WAL Mode",
    "Querying",
    "Joins",
    "Subqueries",
    "Common Table Expressions",
    "Window Functions",
    "Aggregate Functions",
    "JSON Functions",
    "Full-Text Search",
    "Query Optimization",
    "SQLite Pragmas",
  ],

  MongoDB: [
    "Databases",
    "Collections",
    "Documents",
    "BSON",
    "Data Types",
    "CRUD Operations",
    "Insert Operations",
    "Query Operations",
    "Update Operations",
    "Delete Operations",
    "Query Operators",
    "Array Operators",
    "Projection",
    "Sorting",
    "Pagination",
    "Indexes",
    "Compound Indexes",
    "Text Indexes",
    "Aggregation",
    "Aggregation Pipeline",
    "Aggregation Operators",
    "Lookup",
    "Schema Design",
    "Transactions",
    "Replication",
  ],

  Redis: [
    "Key-Value Data Model",
    "Strings",
    "Lists",
    "Sets",
    "Sorted Sets",
    "Hashes",
    "Streams",
    "Bitmaps",
    "HyperLogLog",
    "Geospatial Data",
    "TTL and Expiration",
    "Persistence",
    "RDB Snapshots",
    "AOF Persistence",
    "Eviction Policies",
    "Memory Management",
    "Transactions",
    "Pipelining",
    "Pub/Sub",
    "Lua Scripting",
    "Distributed Locks",
    "Caching",
    "Session Storage",
    "Rate Limiting",
    "Redis Cluster",
  ],
};

const categoryTopics = {
  Frontend: [
    "React",
    "JavaScript",
    "CSS",
    "TypeScript",
    "HTML",
    "Next.js",
    "Angular",
    "Vue.js",
    "Svelte",
  ],

  Backend: [
    "Node.js",
    "Express.js",
    "NestJS",
    "Python",
    "Django",
    "FastAPI",
    "Java",
    "Spring Boot",
    "C#",
    ".NET",
    "Go",
    "PHP",
    "Laravel",
    "Ruby",
  ],

  Database: [
    "MongoDB",
    "Postgres SQL",
    "MySQL",
    "SQLite",
    "SQL",
    "Redis",
  ],
};

const categories = Object.keys(categoryTopics);

export default function App() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("offscripted_settings");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        const category = categoryTopics[parsed.category]
          ? parsed.category
          : "Frontend";

        const availableTopics = categoryTopics[category];

        const topic = availableTopics.includes(parsed.topic)
          ? parsed.topic
          : availableTopics[0];

        return {
          speakMinutes: parsed.speakMinutes ?? 1,
          researchMinutes: parsed.researchMinutes ?? 10,
          muted: parsed.muted ?? false,
          category,
          topic,
          speakingMode: parsed.speakingMode ?? "normal",
        };
      } catch {
        // fallback to defaults
      }
    }

    return {
      speakMinutes: 1,
      researchMinutes: 10,
      muted: false,
      category: "Frontend",
      topic: "HTML",
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
  const audioMasterRef = useRef(null);
  const audioCompressorRef = useRef(null);

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const videoRef = useRef(null);
  const audioChunksRef = useRef([]);

  const usedQuestionsRef = useRef({});

  const topics =
    categoryTopics[settings.category] ||
    categoryTopics.Frontend;

  useEffect(() => {
    localStorage.setItem(
      "offscripted_settings",
      JSON.stringify(settings)
    );
  }, [settings]);

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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isSettingsOpen) {
        setIsSettingsOpen(false);
        return;
      }

      if (
        event.key === "Enter" &&
        !isSettingsOpen &&
        !isComplete
      ) {
        if (
          viewMode === "idle" &&
          !isSpinning
        ) {
          spin();
        } else if (
          viewMode === "selected" &&
          selectedQuestion &&
          !isSpinning
        ) {
          startResearchTimer();
        } else if (
          timerState === "speakReady"
        ) {
          handleSpeakButton();
        }
      }

      if (
        event.key === "Escape" &&
        isComplete
      ) {
        closeCompletedSession();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    isSettingsOpen,
    isComplete,
    viewMode,
    isSpinning,
    selectedQuestion,
    timerState,
  ]);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    };
  }, [isSettingsOpen, isComplete]);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContextClass) {
        return;
      }

      const ctx = new AudioContextClass();

      audioCtxRef.current = ctx;

      const compressor =
        ctx.createDynamicsCompressor();

      compressor.threshold.setValueAtTime(
        -20,
        ctx.currentTime
      );

      compressor.knee.setValueAtTime(
        18,
        ctx.currentTime
      );

      compressor.ratio.setValueAtTime(
        4,
        ctx.currentTime
      );

      compressor.attack.setValueAtTime(
        0.008,
        ctx.currentTime
      );

      compressor.release.setValueAtTime(
        0.18,
        ctx.currentTime
      );

      const masterGain = ctx.createGain();

      masterGain.gain.setValueAtTime(
        1.65,
        ctx.currentTime
      );

      compressor.connect(masterGain);
      masterGain.connect(ctx.destination);

      audioCompressorRef.current = compressor;
      audioMasterRef.current = masterGain;
    }

    if (
      audioCtxRef.current.state ===
      "suspended"
    ) {
      audioCtxRef.current
        .resume()
        .catch(() => {});
    }

    if (
      audioCtxRef.current.state ===
        "interrupted" &&
      typeof audioCtxRef.current.resume ===
        "function"
    ) {
      audioCtxRef.current
        .resume()
        .catch(() => {});
    }
  };

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

    oscillator.frequency.setValueAtTime(
      560,
      now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      185,
      now + 0.085
    );

    const peak = Math.max(
      0.0001,
      0.075 * intensity
    );

    gain.gain.setValueAtTime(
      0.0001,
      now
    );

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

  /*
    ONLY USE QUESTIONS FROM questionBanks.
    No fallback questions are used.
  */
  const getRandomQuestion = (topic) => {
    const questions = questionBanks[topic];

    if (!questions || !questions.length) {
      return null;
    }

    if (!usedQuestionsRef.current[topic]) {
      usedQuestionsRef.current[topic] = [];
    }

    let used = usedQuestionsRef.current[topic];

    if (used.length >= questions.length) {
      usedQuestionsRef.current[topic] = [];
      used = usedQuestionsRef.current[topic];
    }

    const availableQuestions = questions.filter(
      (question) => !used.includes(question)
    );

    if (!availableQuestions.length) {
      return null;
    }

    const randomQuestion =
      availableQuestions[
        Math.floor(
          Math.random() *
            availableQuestions.length
        )
      ];

    usedQuestionsRef.current[topic].push(
      randomQuestion
    );

    return randomQuestion;
  };

  const spin = async () => {
    if (isSpinning) return;

    initAudio();

    setIsComplete(false);
    setIsSpinning(true);

    setSelectedQuestion(null);
    setCurrentText("READY?");
    setViewMode("spinning");

    const finalTopic = settings.topic;

    const finalQuestion =
      getRandomQuestion(finalTopic);

    if (!finalQuestion) {
      setIsSpinning(false);
      setViewMode("idle");
      setCurrentText("NO QUESTIONS");
      return;
    }

    const totalTicks =
      28 +
      Math.floor(
        Math.random() * 12
      );

    for (
      let i = 0;
      i < totalTicks;
      i++
    ) {
      let currentQuestion;

      if (i === totalTicks - 1) {
        currentQuestion = finalQuestion;
      } else {
        const randomTopic =
          topics[
            Math.floor(
              Math.random() *
                topics.length
            )
          ];

        const randomQuestions =
          questionBanks[randomTopic];

        if (
          randomQuestions &&
          randomQuestions.length
        ) {
          currentQuestion =
            randomQuestions[
              Math.floor(
                Math.random() *
                  randomQuestions.length
              )
            ];
        } else {
          currentQuestion =
            finalQuestion;
        }
      }

      setCurrentText(currentQuestion);

      const progress = i / totalTicks;

      playTick(
        1 - progress * 0.25
      );

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            45 +
              Math.pow(
                progress,
                3
              ) *
                390
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
        setRemainingSeconds(
          (previous) => {
            if (previous <= 1) {
              clearInterval(interval);

              if (
                timerState === "research"
              ) {
                playCompletionSound();

                setTimerState(
                  "speakReady"
                );
              } else {
                playCompletionSound();

                if (
                  recordingMode ===
                    "audio" ||
                  recordingMode ===
                    "video"
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
          }
        );
      }, 1000);
    }

    return () =>
      clearInterval(interval);
  }, [
    timerState,
    recordingMode,
  ]);

  const startResearchTimer = () => {
    if (!selectedQuestion) return;

    initAudio();

    const duration =
      settings.researchMinutes *
      60;

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

    if (
      settings.speakingMode ===
      "normal"
    ) {
      startNormalSpeaking();
    } else if (
      settings.speakingMode ===
      "audio"
    ) {
      await startAudioSpeaking();
    } else if (
      settings.speakingMode ===
      "video"
    ) {
      await startVideoSpeaking();
    }
  };

  const startNormalSpeaking = () => {
    const duration =
      settings.speakMinutes *
      60;

    setRecordingMode("normal");
    setTimerDuration(duration);
    setRemainingSeconds(duration);
    setTimerState("speak");
    setViewMode("activeTimer");
  };

  const createRecorder = (
    stream,
    mode
  ) => {
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
        MediaRecorder.isTypeSupported(
          "video/webm"
        )
      ) {
        options.mimeType =
          "video/webm";
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
        MediaRecorder.isTypeSupported(
          "audio/webm"
        )
      ) {
        options.mimeType =
          "audio/webm";
      }
    }

    const recorder =
      new MediaRecorder(
        stream,
        options
      );

    mediaRecorderRef.current =
      recorder;

    recorder.ondataavailable = (
      event
    ) => {
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

      if (
        mediaStreamRef.current
      ) {
        mediaStreamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

        mediaStreamRef.current =
          null;
      }

      setIsRecording(false);
    };

    recorder.start();

    setIsRecording(true);

    const duration =
      settings.speakMinutes *
      60;

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
        !navigator.mediaDevices
          .getUserMedia
      ) {
        alert(
          "Audio recording is not supported by this browser."
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

      mediaStreamRef.current =
        stream;

      setRecordingMode("audio");

      createRecorder(
        stream,
        "audio"
      );
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
        !navigator.mediaDevices
          .getUserMedia
      ) {
        alert(
          "Video recording is not supported by this browser."
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: true,
            audio: true,
          }
        );

      mediaStreamRef.current =
        stream;

      setRecordingMode("video");

      createRecorder(
        stream,
        "video"
      );
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
      mediaRecorderRef.current
        .state !== "inactive"
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

  const closeCompletedSession =
    () => {
      if (isRecording) {
        stopMediaRecording();
      }

      if (recordingUrl) {
        URL.revokeObjectURL(
          recordingUrl
        );
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
    const minutes =
      Math.floor(seconds / 60);

    const secs = seconds % 60;

    return (
      String(minutes).padStart(
        2,
        "0"
      ) +
      ":" +
      String(secs).padStart(
        2,
        "0"
      )
    );
  };

  const circleLength =
    2 * Math.PI * 126;

  const changeCategory = (
    category
  ) => {
    const firstTopic =
      categoryTopics[
        category
      ][0];

    setSettings((s) => ({
      ...s,
      category,
      topic: firstTopic,
    }));
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] max-h-[100dvh] overflow-hidden overscroll-none flex flex-col bg-[#050505] text-[#f5f5f5] selection:bg-neutral-800">
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

      <main className="flex-1 min-h-0 w-full flex items-center justify-center px-[14px] sm:px-[24px] pb-[20px] sm:pb-[35px] overflow-hidden overscroll-none">
        <div className="w-full max-w-[1100px] flex flex-col items-center justify-center text-center">
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

          {viewMode !== "activeTimer" && (
            <div className="w-full min-h-[160px] sm:min-h-[190px] flex items-center justify-center overflow-hidden relative">
              <div
                className={`max-w-full px-[12px] sm:px-[20px] break-words ${
                  viewMode === "idle"
                    ? "text-[clamp(70px,12vw,150px)] font-black tracking-[-0.09em] text-[#777]"
                    : viewMode ===
                      "spinning"
                    ? "text-[clamp(38px,7vw,88px)] font-extrabold tracking-[-0.075em] text-[#d7d7d7]"
                    : "text-[clamp(38px,7vw,88px)] font-extrabold tracking-[-0.075em] text-white animate-topic-reveal"
                }`}
              >
                {currentText}
              </div>
            </div>
          )}

          {viewMode !==
            "activeTimer" &&
            !isSpinning && (
              <div className="mt-[38px] sm:mt-[48px] flex flex-col items-center justify-center gap-[14px] w-full">
                <div className="flex items-center justify-center gap-[8px]">
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

      {viewMode ===
        "activeTimer" && (
        <main className="fixed inset-0 w-full h-[100dvh] max-h-[100dvh] overflow-hidden flex items-center justify-center px-[14px]">
          <div className="flex flex-col items-center justify-center w-full">
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

            <div className="mt-[28px] sm:mt-[38px] min-h-[70px] flex items-center justify-center">
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
                    onClick={
                      closeTimer
                    }
                    className="w-[130px] sm:w-[150px] h-[46px] sm:h-[52px] px-[20px] sm:px-[28px] border border-[#333] rounded-full bg-transparent text-[#777] text-[10px] sm:text-[12px] font-extrabold tracking-[0.1em] cursor-pointer hover:text-white hover:border-[#666] active:scale-95 transition-transform duration-150"
                  >
                    CLOSE
                  </button>
                </div>
              )}

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
                    onClick={
                      closeTimer
                    }
                    className="w-[130px] sm:w-[150px] h-[46px] sm:h-[52px] px-[20px] sm:px-[28px] border border-[#333] rounded-full bg-transparent text-[#777] text-[10px] sm:text-[12px] font-extrabold tracking-[0.1em] cursor-pointer hover:text-white hover:border-[#666] active:scale-95 transition-transform duration-150"
                  >
                    CLOSE
                  </button>
                </div>
              )}

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
                    onClick={
                      closeTimer
                    }
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
                    const startY =
                      Number(
                        event.currentTarget
                          .dataset.startY
                      );

                    const currentY =
                      event.touches[0].clientY;

                    const diff =
                      startY - currentY;

                    if (
                      Math.abs(diff) >
                      25
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
                    const startY =
                      Number(
                        event.currentTarget
                          .dataset.startY
                      );

                    const currentY =
                      event.touches[0].clientY;

                    const diff =
                      startY - currentY;

                    if (
                      Math.abs(diff) >
                      25
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
                        setSettings((s) => ({
                          ...s,
                          speakingMode:
                            value,
                        }))
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

            <div className="mt-[22px] grid grid-cols-2 gap-[10px]">
              <div className="text-center">
                <div className="text-[#8b8b8b] text-[10px] font-extrabold tracking-[0.18em] uppercase mb-[25px]">
                  CATEGORY
                </div>

                <div className="h-[96px] flex items-center justify-center gap-[6px] select-none relative">
                  <div className="min-w-[150px] max-w-[230px] text-center text-[32px] leading-none font-bold tracking-[-0.06em] whitespace-nowrap overflow-hidden text-ellipsis">
                    {settings.category}
                  </div>

                  <div className="absolute left-1/2 -top-[6px] -translate-x-1/2 w-[180px] h-[108px] pointer-events-none">
                    <button
                      onClick={() => {
                        const index =
                          categories.indexOf(
                            settings.category
                          );

                        const next =
                          categories[
                            (index + 1) %
                              categories.length
                          ];

                        changeCategory(
                          next
                        );
                      }}
                      aria-label="Next category"
                      className="absolute left-1/2 -translate-x-1/2 w-[40px] h-[25px] border-none bg-transparent text-[#444] cursor-pointer pointer-events-auto grid place-items-center -top-[2px] hover:text-white active:scale-90 transition-transform"
                    >
                      ▲
                    </button>

                    <button
                      onClick={() => {
                        const index =
                          categories.indexOf(
                            settings.category
                          );

                        const previous =
                          categories[
                            (index -
                              1 +
                              categories.length) %
                              categories.length
                          ];

                        changeCategory(
                          previous
                        );
                      }}
                      aria-label="Previous category"
                      className="absolute left-1/2 -translate-x-1/2 w-[40px] h-[25px] border-none bg-transparent text-[#444] cursor-pointer pointer-events-auto grid place-items-center bottom-[2px] hover:text-white active:scale-90 transition-transform"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-[#8b8b8b] text-[10px] font-extrabold tracking-[0.18em] uppercase mb-[25px]">
                  TOPIC
                </div>

                <div className="h-[96px] flex items-center justify-center gap-[6px] select-none relative">
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

                        setSettings(
                          (s) => ({
                            ...s,
                            topic: next,
                          })
                        );
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

                        setSettings(
                          (s) => ({
                            ...s,
                            topic: previous,
                          })
                        );
                      }}
                      aria-label="Previous topic"
                      className="absolute left-1/2 -translate-x-1/2 w-[40px] h-[25px] border-none bg-transparent text-[#444] cursor-pointer pointer-events-auto grid place-items-center bottom-[2px] hover:text-white active:scale-90 transition-transform"
                    >
                      ▼
                    </button>
                  </div>
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
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}

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