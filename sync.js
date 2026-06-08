// ===== סנכרון ענן (Firebase Firestore) =====
// מאפשר שהנתונים יופיעו בכל מכשיר לפי "קוד סנכרון" אישי.
// כל מכשיר שמזין את אותו קוד יראה את אותם נתונים, בזמן אמת.

// 👇👇👇 הדבק כאן את ההגדרות מפרויקט ה-Firebase שלך (פעם אחת) 👇👇👇
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAE-e6EOBJdmyA325FN5HcLVIed9h918E0",
  authDomain: "calorie-tracker-13b61.firebaseapp.com",
  projectId: "calorie-tracker-13b61",
  storageBucket: "calorie-tracker-13b61.firebasestorage.app",
  messagingSenderId: "497951059833",
  appId: "1:497951059833:web:e49671f5774a75546249a8",
};
// 👆👆👆 עד כאן ההגדרות של Firebase 👆👆👆

const SYNC_CODE_KEY = "syncCode";
const LAST_WRITE_KEY = "lastLocalWrite";
const SYNC_LOG_PREFIX = "calorieLog_";
const SYNC_GOAL_KEY = "calorieGoal";

let _db = null;
let _docRef = null;
let _unsub = null;
let _applyingRemote = false;
let _pushTimer = null;
let _firestore = null;
let _seeded = false;

function syncConfigured() {
  return FIREBASE_CONFIG && !String(FIREBASE_CONFIG.apiKey).includes("PASTE");
}

function getSyncCode() {
  return (localStorage.getItem(SYNC_CODE_KEY) || "").trim();
}

function syncActive() {
  return !!_docRef;
}

function collectLocalData() {
  const days = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(SYNC_LOG_PREFIX)) {
      try {
        days[key] = JSON.parse(localStorage.getItem(key));
      } catch {
        /* ignore */
      }
    }
  }
  return {
    days,
    goal: localStorage.getItem(SYNC_GOAL_KEY) || null,
    profile: localStorage.getItem("calorieProfile") || null,
    updatedAt: Date.now(),
  };
}

function applyRemoteData(data) {
  if (!data || typeof data.days !== "object") return;
  _applyingRemote = true;
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(SYNC_LOG_PREFIX))
      .forEach((k) => localStorage.removeItem(k));

    Object.entries(data.days).forEach(([k, v]) => {
      if (k.startsWith(SYNC_LOG_PREFIX) && Array.isArray(v)) {
        localStorage.setItem(k, JSON.stringify(v));
      }
    });
    if (data.goal) localStorage.setItem(SYNC_GOAL_KEY, data.goal);
    if (data.profile) localStorage.setItem("calorieProfile", data.profile);
    if (typeof window.onCloudData === "function") window.onCloudData();
  } finally {
    _applyingRemote = false;
  }
}

// נקרא מ-app.js אחרי כל שינוי מקומי
function pushSoon() {
  localStorage.setItem(LAST_WRITE_KEY, String(Date.now()));
  if (!_docRef || _applyingRemote) return;
  clearTimeout(_pushTimer);
  _pushTimer = setTimeout(pushNow, 600);
}

async function pushNow() {
  if (!_docRef || !_firestore) return;
  try {
    await _firestore.setDoc(_docRef, collectLocalData());
  } catch (e) {
    console.warn("Cloud push failed:", e);
  }
}

async function startSync() {
  stopSync();
  const code = getSyncCode();
  if (!code) return { ok: false, reason: "no-code" };
  if (!syncConfigured()) return { ok: false, reason: "not-configured" };

  try {
    const { initializeApp } = await import(
      "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
    );
    const fs = await import(
      "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
    );
    _firestore = fs;
    const app = initializeApp(FIREBASE_CONFIG);
    _db = fs.getFirestore(app);
    _docRef = fs.doc(_db, "calorieUsers", code);

    _unsub = fs.onSnapshot(
      _docRef,
      (snap) => {
        if (snap.metadata.hasPendingWrites) return; // הד של כתיבה מקומית
        const remote = snap.exists() ? snap.data() : null;

        if (!remote) {
          // אין נתונים בענן -> זרע מהמכשיר הזה
          if (!_seeded) {
            _seeded = true;
            pushNow();
          }
          return;
        }

        const remoteTime = Number(remote.updatedAt) || 0;
        const localTime = Number(localStorage.getItem(LAST_WRITE_KEY)) || 0;

        if (!_seeded) {
          _seeded = true;
          // בחיבור ראשון: אם המקומי חדש יותר -> דחוף, אחרת -> קבל מהענן
          if (localTime > remoteTime) {
            pushNow();
          } else {
            applyRemoteData(remote);
          }
        } else {
          // עדכון משבמכשיר אחר
          applyRemoteData(remote);
        }
      },
      (err) => console.warn("Cloud sync error:", err)
    );

    return { ok: true };
  } catch (e) {
    console.warn("Cloud sync init failed:", e);
    _docRef = null;
    return { ok: false, reason: "error", error: e };
  }
}

function stopSync() {
  if (_unsub) {
    try {
      _unsub();
    } catch {
      /* ignore */
    }
  }
  _unsub = null;
  _docRef = null;
  _seeded = false;
  clearTimeout(_pushTimer);
}

window.CloudSync = {
  start: startSync,
  stop: stopSync,
  pushSoon,
  isActive: syncActive,
  isConfigured: syncConfigured,
  getCode: getSyncCode,
};
