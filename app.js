// ===== מעקב קלוריות יומי =====
// אפליקציית web: קלט טקסט או צילום אוכל -> ניתוח קלוריות עם OpenAI -> שמירה מקומית.

const STORAGE_KEY_PREFIX = "calorieLog_";
const SETTINGS_KEY = "calorieSettings";
const GOAL_KEY = "calorieGoal";
const API_KEY_KEY = "openaiApiKey";

// ---- אלמנטים ----
const els = {
  totalCalories: document.getElementById("totalCalories"),
  totalProtein: document.getElementById("totalProtein"),
  totalCarbs: document.getElementById("totalCarbs"),
  totalFat: document.getElementById("totalFat"),
  goalInput: document.getElementById("goalInput"),
  progressFill: document.getElementById("progressFill"),
  remainingText: document.getElementById("remainingText"),
  foodList: document.getElementById("foodList"),
  emptyLog: document.getElementById("emptyLog"),
  statusMsg: document.getElementById("statusMsg"),
  textInput: document.getElementById("textInput"),
  analyzeTextBtn: document.getElementById("analyzeTextBtn"),
  photoInput: document.getElementById("photoInput"),
  previewImg: document.getElementById("previewImg"),
  uploadHint: document.getElementById("uploadHint"),
  analyzePhotoBtn: document.getElementById("analyzePhotoBtn"),
  clearDayBtn: document.getElementById("clearDayBtn"),
  settingsBtn: document.getElementById("settingsBtn"),
  settingsModal: document.getElementById("settingsModal"),
  apiKeyInput: document.getElementById("apiKeyInput"),
  syncCodeInput: document.getElementById("syncCodeInput"),
  saveSettingsBtn: document.getElementById("saveSettingsBtn"),
  closeSettingsBtn: document.getElementById("closeSettingsBtn"),
  searchInput: document.getElementById("searchInput"),
  searchResults: document.getElementById("searchResults"),
  chart: document.getElementById("chart"),
  weekAvg: document.getElementById("weekAvg"),
  exportBtn: document.getElementById("exportBtn"),
  importBtn: document.getElementById("importBtn"),
  importFile: document.getElementById("importFile"),
  loginScreen: document.getElementById("loginScreen"),
  loginUserInput: document.getElementById("loginUserInput"),
  loginBtn: document.getElementById("loginBtn"),
  skipLoginBtn: document.getElementById("skipLoginBtn"),
  userBadge: document.getElementById("userBadge"),
  profileToggle: document.getElementById("profileToggle"),
  profileChevron: document.getElementById("profileChevron"),
  profileBody: document.getElementById("profileBody"),
  profileSex: document.getElementById("profileSex"),
  profileAge: document.getElementById("profileAge"),
  profileWeight: document.getElementById("profileWeight"),
  profileHeight: document.getElementById("profileHeight"),
  profileSteps: document.getElementById("profileSteps"),
  profileTarget: document.getElementById("profileTarget"),
  profileRate: document.getElementById("profileRate"),
  profileResult: document.getElementById("profileResult"),
  prMaintain: document.getElementById("prMaintain"),
  prRecommend: document.getElementById("prRecommend"),
  prGoalLabel: document.getElementById("prGoalLabel"),
  prProtein: document.getElementById("prProtein"),
  prNote: document.getElementById("prNote"),
  applyGoalBtn: document.getElementById("applyGoalBtn"),
};

let selectedImageDataUrl = null;

// ---- עזרי תאריך/אחסון ----
function dateKey(d) {
  return STORAGE_KEY_PREFIX + d.toISOString().slice(0, 10);
}

function todayKey() {
  return dateKey(new Date());
}

function loadLog() {
  try {
    return JSON.parse(localStorage.getItem(todayKey())) || [];
  } catch {
    return [];
  }
}

function saveLog(log) {
  localStorage.setItem(todayKey(), JSON.stringify(log));
  window.CloudSync?.pushSoon();
}

function getApiKey() {
  return localStorage.getItem(API_KEY_KEY) || "";
}

// ---- רינדור ----
function render() {
  const log = loadLog();
  const totals = log.reduce(
    (acc, item) => {
      acc.calories += item.calories || 0;
      acc.protein += item.protein || 0;
      acc.carbs += item.carbs || 0;
      acc.fat += item.fat || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  els.totalCalories.textContent = Math.round(totals.calories);
  els.totalProtein.textContent = Math.round(totals.protein);
  els.totalCarbs.textContent = Math.round(totals.carbs);
  els.totalFat.textContent = Math.round(totals.fat);

  const goal = Number(els.goalInput.value) || 0;
  const pct = goal > 0 ? Math.min((totals.calories / goal) * 100, 100) : 0;
  els.progressFill.style.width = pct + "%";
  els.progressFill.style.background =
    totals.calories > goal && goal > 0 ? "#dc2626" : "#16a34a";

  // צביעת הטבעת לפי אחוז
  const ring = document.querySelector(".calorie-ring");
  if (ring) {
    const deg = (pct / 100) * 360;
    ring.style.background = `conic-gradient(var(--primary) ${deg}deg, #e8f5e9 ${deg}deg)`;
  }

  if (goal > 0) {
    const remaining = goal - totals.calories;
    els.remainingText.textContent =
      remaining >= 0
        ? `נותרו ${Math.round(remaining)} קק"ל`
        : `חריגה של ${Math.round(-remaining)} קק"ל`;
  } else {
    els.remainingText.textContent = "";
  }

  // רשימה
  els.foodList.innerHTML = "";
  els.emptyLog.hidden = log.length > 0;

  log.forEach((item, idx) => {
    const li = document.createElement("li");
    li.className = "food-item";
    li.innerHTML = `
      <div class="food-info">
        <strong></strong>
        <small>ח: ${Math.round(item.protein || 0)}ג' · פ: ${Math.round(
      item.carbs || 0
    )}ג' · ש: ${Math.round(item.fat || 0)}ג'</small>
      </div>
      <span class="food-cal">${Math.round(item.calories || 0)} קק"ל</span>
      <button class="remove-btn" data-idx="${idx}" title="הסרה">✕</button>
    `;
    li.querySelector("strong").textContent = item.name || "פריט";
    els.foodList.appendChild(li);
  });

  renderChart();
}

// ---- גרף היסטוריה שבועית ----
const DAY_NAMES = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"];

function caloriesForDate(d) {
  try {
    const log = JSON.parse(localStorage.getItem(dateKey(d))) || [];
    return log.reduce((sum, it) => sum + (it.calories || 0), 0);
  } catch {
    return 0;
  }
}

function renderChart() {
  if (!els.chart) return;
  const goal = Number(els.goalInput.value) || 0;
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({ date: d, calories: caloriesForDate(d) });
  }

  const maxVal = Math.max(goal, ...days.map((d) => d.calories), 1);
  const total = days.reduce((s, d) => s + d.calories, 0);
  const daysWithData = days.filter((d) => d.calories > 0).length;
  const avg = daysWithData ? Math.round(total / daysWithData) : 0;
  els.weekAvg.textContent = avg ? `ממוצע: ${avg} קק"ל` : "";

  els.chart.innerHTML = "";
  days.forEach((d, idx) => {
    const isToday = idx === days.length - 1;
    const hPct = (d.calories / maxVal) * 100;
    const over = goal > 0 && d.calories > goal;
    const col = document.createElement("div");
    col.className = "chart-bar" + (isToday ? " today" : "");
    col.innerHTML = `
      <span class="bar-val">${d.calories ? Math.round(d.calories) : ""}</span>
      <div class="bar ${over ? "over" : ""}" style="height:${hPct}%"></div>
      <span class="bar-day">${DAY_NAMES[d.date.getDay()]}</span>
    `;
    els.chart.appendChild(col);
  });
}

// ---- חיפוש במאגר המזון ----
function renderSearchResults(query) {
  const q = (query || "").trim();
  els.searchResults.innerHTML = "";
  const list = q
    ? FOOD_DB.filter((f) => f.name.includes(q))
    : FOOD_DB.slice(0, 12);

  if (q && list.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "לא נמצאו תוצאות במאגר.";
    els.searchResults.appendChild(li);
    return;
  }

  list.forEach((food) => {
    const li = document.createElement("li");
    li.className = "search-result";
    li.innerHTML = `
      <div class="sr-info">
        <strong></strong>
        <small></small>
      </div>
      <div class="sr-qty">
        <button class="qty-btn qty-minus" title="פחות">−</button>
        <input type="number" class="qty-input" value="1" min="0.25" step="0.25" />
        <button class="qty-btn qty-plus" title="עוד">+</button>
      </div>
      <span class="sr-cal">${food.calories} קק"ל</span>
      <button class="sr-add" title="הוספה">+</button>
    `;
    li.querySelector("strong").textContent = food.name;
    li.querySelector("small").textContent = food.unit;

    const qtyInput = li.querySelector(".qty-input");
    const calSpan = li.querySelector(".sr-cal");
    const getQty = () => Math.max(Number(qtyInput.value) || 0, 0);

    const updateCal = () => {
      calSpan.textContent = `${Math.round(food.calories * getQty())} קק"ל`;
    };
    li.querySelector(".qty-minus").addEventListener("click", (e) => {
      e.stopPropagation();
      qtyInput.value = Math.max(getQty() - 0.25, 0.25);
      updateCal();
    });
    li.querySelector(".qty-plus").addEventListener("click", (e) => {
      e.stopPropagation();
      qtyInput.value = getQty() + 0.25;
      updateCal();
    });
    qtyInput.addEventListener("input", updateCal);
    qtyInput.addEventListener("click", (e) => e.stopPropagation());

    const add = () => {
      const q = getQty();
      if (q <= 0) return;
      const qtyLabel = q === 1 ? food.unit : `${q} × ${food.unit}`;
      addItem({
        name: `${food.name} (${qtyLabel})`,
        calories: food.calories * q,
        protein: food.protein * q,
        carbs: food.carbs * q,
        fat: food.fat * q,
      });
      setStatus(`נוסף: ${food.name}`, "");
    };
    li.querySelector(".sr-add").addEventListener("click", (e) => {
      e.stopPropagation();
      add();
    });
    li.addEventListener("click", add);
    els.searchResults.appendChild(li);
  });
}

// ---- הוספה/הסרה ----
function addItem(item) {
  const log = loadLog();
  log.push(item);
  saveLog(log);
  render();
}

function removeItem(idx) {
  const log = loadLog();
  log.splice(idx, 1);
  saveLog(log);
  render();
}

// ---- סטטוס ----
function setStatus(msg, type = "") {
  els.statusMsg.textContent = msg;
  els.statusMsg.className = "status" + (type ? " " + type : "");
}

// ---- קריאה ל-OpenAI ----
const SYSTEM_PROMPT = `אתה תזונאי שמעריך ערכים תזונתיים של מנות אוכל.
החזר אך ורק JSON תקין במבנה הבא, ללא טקסט נוסף וללא סימוני קוד:
{"name":"שם המנה בעברית","calories":מספר,"protein":מספר,"carbs":מספר,"fat":מספר}
הערכים הם לכל המנה שתוארה (לא ל-100 גרם). אם יש כמה פריטים סכם אותם יחד.`;

async function callOpenAI(messages) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("חסר מפתח API. פתחו את ההגדרות (⚙️) והזינו מפתח OpenAI.");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages,
      max_tokens: 300,
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `שגיאת שרת (${res.status})`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

function parseNutrition(raw) {
  // ניקוי גדרות קוד אם קיימות
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("לא התקבל מידע תזונתי תקין.");
  const obj = JSON.parse(match[0]);
  return {
    name: obj.name || "פריט",
    calories: Number(obj.calories) || 0,
    protein: Number(obj.protein) || 0,
    carbs: Number(obj.carbs) || 0,
    fat: Number(obj.fat) || 0,
  };
}

// ---- ניתוח טקסט ----
async function analyzeText() {
  const text = els.textInput.value.trim();
  if (!text) {
    setStatus("הזינו תיאור של המזון.", "error");
    return;
  }

  // ללא מפתח API -> ניתוח מקומי חינמי מול מאגר המזון
  if (!getApiKey()) {
    const items = analyzeTextLocally(text);
    if (items.length === 0) {
      setStatus(
        'לא זוהה מזון. נסו ניסוח פשוט יותר (למשל "2 ביצים ופרוסת לחם"), או הוסיפו מהמאגר (🔎).',
        "error"
      );
      return;
    }
    items.forEach(addItem);
    els.textInput.value = "";
    const totalCal = items.reduce((s, i) => s + i.calories, 0);
    setStatus(
      `נוספו ${items.length} פריטים (${Math.round(totalCal)} קק"ל).`,
      ""
    );
    return;
  }

  els.analyzeTextBtn.disabled = true;
  setStatus("מנתח...", "loading");
  try {
    const raw = await callOpenAI([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `הערך את הערכים התזונתיים של: ${text}` },
    ]);
    const item = parseNutrition(raw);
    addItem(item);
    els.textInput.value = "";
    setStatus(`נוסף: ${item.name} (${Math.round(item.calories)} קק"ל)`, "");
  } catch (e) {
    setStatus(e.message, "error");
  } finally {
    els.analyzeTextBtn.disabled = false;
  }
}

// ---- ניתוח תמונה ----
async function analyzePhoto() {
  if (!selectedImageDataUrl) {
    setStatus("בחרו תמונה תחילה.", "error");
    return;
  }
  els.analyzePhotoBtn.disabled = true;
  setStatus("מנתח את התמונה...", "loading");
  try {
    const raw = await callOpenAI([
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: "מהם הערכים התזונתיים של המנה בתמונה?" },
          { type: "image_url", image_url: { url: selectedImageDataUrl } },
        ],
      },
    ]);
    const item = parseNutrition(raw);
    addItem(item);
    setStatus(`נוסף: ${item.name} (${Math.round(item.calories)} קק"ל)`, "");
    resetPhoto();
  } catch (e) {
    setStatus(e.message, "error");
  } finally {
    els.analyzePhotoBtn.disabled = !selectedImageDataUrl;
  }
}

function resetPhoto() {
  selectedImageDataUrl = null;
  els.previewImg.hidden = true;
  els.previewImg.src = "";
  els.uploadHint.hidden = false;
  els.analyzePhotoBtn.disabled = true;
  els.photoInput.value = "";
}

// ---- ייצוא / ייבוא גיבוי ----
function exportData() {
  const data = { version: 1, exportedAt: new Date().toISOString(), days: {}, goal: null };
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
      data.days[key] = JSON.parse(localStorage.getItem(key));
    }
  }
  data.goal = localStorage.getItem(GOAL_KEY);

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `calorie-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  setStatus("הגיבוי יוצא בהצלחה.", "");
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || typeof data.days !== "object") {
        throw new Error("קובץ גיבוי לא תקין.");
      }
      if (!confirm("ייבוא יחליף את כל הנתונים הקיימים. להמשיך?")) return;

      // מחיקת יומנים קיימים
      Object.keys(localStorage)
        .filter((k) => k.startsWith(STORAGE_KEY_PREFIX))
        .forEach((k) => localStorage.removeItem(k));

      // טעינת היומנים מהגיבוי
      Object.entries(data.days).forEach(([key, value]) => {
        if (key.startsWith(STORAGE_KEY_PREFIX) && Array.isArray(value)) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });
      if (data.goal) {
        localStorage.setItem(GOAL_KEY, data.goal);
        els.goalInput.value = data.goal;
      }
      window.CloudSync?.pushSoon();
      render();
      setStatus("הגיבוי יובא בהצלחה.", "");
    } catch (e) {
      setStatus(e.message || "שגיאה בקריאת הקובץ.", "error");
    }
  };
  reader.readAsText(file);
}

// ---- אירועים ----
function initEvents() {
  // טאבים
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
      setStatus("");
      if (tab.dataset.tab === "search") renderSearchResults(els.searchInput.value);
    });
  });

  els.analyzeTextBtn.addEventListener("click", analyzeText);
  els.analyzePhotoBtn.addEventListener("click", analyzePhoto);

  // חיפוש במאגר
  els.searchInput.addEventListener("input", () =>
    renderSearchResults(els.searchInput.value)
  );

  // העלאת תמונה
  els.photoInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      selectedImageDataUrl = reader.result;
      els.previewImg.src = selectedImageDataUrl;
      els.previewImg.hidden = false;
      els.uploadHint.hidden = true;
      els.analyzePhotoBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  });

  // יעד
  els.goalInput.addEventListener("input", () => {
    localStorage.setItem(GOAL_KEY, els.goalInput.value);
    window.CloudSync?.pushSoon();
    render();
  });

  // הסרת פריט
  els.foodList.addEventListener("click", (e) => {
    const btn = e.target.closest(".remove-btn");
    if (btn) removeItem(Number(btn.dataset.idx));
  });

  // ניקוי יום
  els.clearDayBtn.addEventListener("click", () => {
    if (confirm("לנקות את כל היומן של היום?")) {
      saveLog([]);
      render();
    }
  });

  // הגדרות
  els.settingsBtn.addEventListener("click", () => {
    els.apiKeyInput.value = getApiKey();
    if (els.syncCodeInput)
      els.syncCodeInput.value = localStorage.getItem("syncCode") || "";
    els.settingsModal.hidden = false;
  });
  els.closeSettingsBtn.addEventListener("click", () => {
    els.settingsModal.hidden = true;
  });
  els.saveSettingsBtn.addEventListener("click", () => {
    localStorage.setItem(API_KEY_KEY, els.apiKeyInput.value.trim());
    const prevCode = localStorage.getItem("syncCode") || "";
    const newCode = (els.syncCodeInput?.value || "").trim();
    localStorage.setItem("syncCode", newCode);
    els.settingsModal.hidden = true;
    updateUserBadge();
    if (newCode !== prevCode) {
      if (newCode && window.CloudSync?.isConfigured()) {
        setStatus("מתחבר לסנכרון...", "loading");
        window.CloudSync.start().then((r) => {
          if (r.ok) setStatus("הסנכרון הופעל. הנתונים יסתנכרנו בכל מכשיר.", "");
          else if (r.reason === "not-configured")
            setStatus("הסנכרון לא הוגדר עדיין (חסרות הגדרות Firebase).", "error");
          else setStatus("התחברות לסנכרון נכשלה.", "error");
        });
      } else {
        window.CloudSync?.stop();
        setStatus("המפתח נשמר.", "");
      }
    } else {
      setStatus("ההגדרות נשמרו.", "");
    }
  });
  els.settingsModal.addEventListener("click", (e) => {
    if (e.target === els.settingsModal) els.settingsModal.hidden = true;
  });

  // ייצוא / ייבוא גיבוי
  els.exportBtn.addEventListener("click", exportData);
  els.importBtn.addEventListener("click", () => els.importFile.click());
  els.importFile.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) importData(file);
    els.importFile.value = "";
  });

  // כניסת משתמש
  els.loginBtn?.addEventListener("click", () =>
    loginAs(els.loginUserInput.value)
  );
  els.loginUserInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loginAs(els.loginUserInput.value);
  });
  els.skipLoginBtn?.addEventListener("click", () => {
    localStorage.setItem(SKIP_LOGIN_KEY, "1");
    hideLogin();
    setStatus("שימוש מקומי בלבד. ניתן להתחבר בכל עת מההגדרות ⚙️.", "");
  });
  els.userBadge?.addEventListener("click", () => {
    if (confirm("להתנתק ולהחליף משתמש?")) logout();
  });

  // פרופיל
  els.profileToggle?.addEventListener("click", toggleProfile);
  [
    els.profileSex,
    els.profileAge,
    els.profileWeight,
    els.profileHeight,
    els.profileSteps,
    els.profileTarget,
    els.profileRate,
  ].forEach((el) =>
    el?.addEventListener("input", onProfileChange)
  );
  els.applyGoalBtn?.addEventListener("click", () => {
    const cal = Number(els.applyGoalBtn.dataset.cal) || 0;
    if (!cal) return;
    els.goalInput.value = cal;
    localStorage.setItem(GOAL_KEY, String(cal));
    window.CloudSync?.pushSoon();
    render();
    setStatus(`היעד היומי עודכן ל-${cal} קק"ל.`, "");
  });
}

// ---- פרופיל ----
const PROFILE_KEY = "calorieProfile";

function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProfile(p) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  window.CloudSync?.pushSoon();
}

function readProfileInputs() {
  return {
    sex: els.profileSex.value,
    age: Number(els.profileAge.value) || 0,
    weight: Number(els.profileWeight.value) || 0,
    height: Number(els.profileHeight.value) || 0,
    steps: Number(els.profileSteps.value) || 0,
    target: Number(els.profileTarget.value) || 0,
    rate: els.profileRate?.value || "medium",
  };
}

function fillProfileInputs(p) {
  if (p.sex) els.profileSex.value = p.sex;
  if (p.age) els.profileAge.value = p.age;
  if (p.weight) els.profileWeight.value = p.weight;
  if (p.height) els.profileHeight.value = p.height;
  if (p.steps != null && p.steps !== 0) els.profileSteps.value = p.steps;
  if (p.target) els.profileTarget.value = p.target;
  if (p.rate && els.profileRate) els.profileRate.value = p.rate;
}

// רמת פעילות לפי צעדים יומיים -> מקדם
function activityFactor(steps) {
  if (steps < 5000) return 1.2; // יושבני
  if (steps < 7500) return 1.375; // פעילות קלה
  if (steps < 10000) return 1.55; // פעילות בינונית
  if (steps < 12500) return 1.725; // פעילות גבוהה
  return 1.9; // פעילות גבוהה מאוד
}

// חישוב והצגת המלצה קלורית
function computeProfile() {
  const p = readProfileInputs();
  if (!p.age || !p.weight || !p.height) {
    els.profileResult.hidden = true;
    return null;
  }

  // BMR לפי Mifflin-St Jeor
  const bmr =
    10 * p.weight +
    6.25 * p.height -
    5 * p.age +
    (p.sex === "female" ? -161 : 5);
  const maintain = Math.round(bmr * activityFactor(p.steps));

  let recommend = maintain;
  let note = 'כמות זו שומרת על המשקל הנוכחי שלך.';
  let goalLabel = "קלוריות מומלצות ליום";

  // מקדמי קצב: קק"ל ליום לפי קצב שינוי מבוקש (~7700 קק"ל = 1 ק"ג)
  const rateMap = { slow: 275, medium: 500, fast: 825 };
  const rateLabel = { slow: "0.25", medium: "0.5", fast: "0.75" };
  const delta = rateMap[p.rate] || 500;
  const ratePerWeek = rateLabel[p.rate] || "0.5";

  if (p.target && p.weight) {
    const diff = Math.round((p.target - p.weight) * 10) / 10;
    if (Math.abs(diff) >= 0.5) {
      if (diff < 0) {
        // ירידה במשקל: גירעון לפי קצב
        recommend = maintain - delta;
        const floor = p.sex === "female" ? 1200 : 1500;
        if (recommend < floor) recommend = floor;
        goalLabel = "קלוריות לירידה במשקל";
        note = `ליעד ${p.target} ק"ג (ירידה של ${Math.abs(diff)} ק"ג) — גירעון של כ-${delta} קק"ל ליום, כ-${ratePerWeek} ק"ג בשבוע.`;
      } else {
        // עלייה במשקל: עודף (מחצית מהקצב כדי להגביר מסת שריר)
        const surplus = Math.round((delta / 2) / 25) * 25;
        recommend = maintain + surplus;
        goalLabel = "קלוריות לעלייה במשקל";
        note = `ליעד ${p.target} ק"ג (עלייה של ${diff} ק"ג) — עודף של כ-${surplus} קק"ל ליום.`;
      }
    }
  }

  // יעד חלבון: ~1.6 גרם לק"ג משקל (יעד אם הוגדר, אחרת משקל נוכחי)
  const proteinBase = p.target && p.target < p.weight ? p.target : p.weight;
  const proteinG = Math.round(proteinBase * 1.6);
  els.prProtein.textContent = `${proteinG} גרם`;

  els.prMaintain.textContent = `${maintain} קק"ל`;
  els.prRecommend.textContent = `${recommend} קק"ל`;
  els.prGoalLabel.textContent = goalLabel;
  els.prNote.textContent = note;
  els.profileResult.hidden = false;
  els.applyGoalBtn.dataset.cal = recommend;
  return { ...p, maintain, recommend };
}

function onProfileChange() {
  saveProfile(readProfileInputs());
  computeProfile();
}

function toggleProfile() {
  const open = els.profileBody.hidden;
  els.profileBody.hidden = !open;
  els.profileChevron.textContent = open ? "▲" : "▼";
}

// ---- כניסת משתמש ----
const SKIP_LOGIN_KEY = "skipLogin";

function currentUser() {
  return (localStorage.getItem("syncCode") || "").trim();
}

function updateUserBadge() {
  if (!els.userBadge) return;
  const user = currentUser();
  if (user) {
    els.userBadge.textContent = "👤 " + user;
    els.userBadge.hidden = false;
    els.userBadge.title = "התנתקות / החלפת משתמש";
  } else {
    els.userBadge.hidden = true;
  }
}

function showLogin() {
  if (els.loginScreen) els.loginScreen.hidden = false;
}

function hideLogin() {
  if (els.loginScreen) els.loginScreen.hidden = true;
}

function loginAs(name) {
  const user = (name || "").trim();
  if (!user) {
    if (els.loginUserInput) els.loginUserInput.focus();
    return;
  }
  localStorage.setItem("syncCode", user);
  localStorage.removeItem(SKIP_LOGIN_KEY);
  updateUserBadge();
  hideLogin();
  if (window.CloudSync?.isConfigured()) {
    setStatus("מתחבר כ-" + user + "...", "loading");
    window.CloudSync.start().then((r) => {
      if (r.ok)
        setStatus("שלום " + user + "! הנתונים מסונכרנים בכל המכשירים.", "");
      else setStatus("ההתחברות לסנכרון נכשלה (הנתונים נשמרים מקומית).", "error");
    });
  }
}

function logout() {
  window.CloudSync?.stop();
  localStorage.removeItem("syncCode");
  localStorage.removeItem(SKIP_LOGIN_KEY);
  updateUserBadge();
  if (els.loginUserInput) els.loginUserInput.value = "";
  showLogin();
}

// ---- אתחול ----
function init() {
  const savedGoal = localStorage.getItem(GOAL_KEY);
  if (savedGoal) els.goalInput.value = savedGoal;
  initEvents();
  renderSearchResults("");
  render();
  fillProfileInputs(loadProfile());
  computeProfile();

  // עדכון התצוגה כאשר מגיעים נתונים מהענן (ממכשיר אחר)
  window.onCloudData = () => {
    const g = localStorage.getItem(GOAL_KEY);
    if (g) els.goalInput.value = g;
    fillProfileInputs(loadProfile());
    computeProfile();
    render();
  };

  // הפעלת סנכרון ענן אם הוגדר קוד סנכרון
  if (window.CloudSync?.getCode() && window.CloudSync?.isConfigured()) {
    window.CloudSync.start();
  }

  // מסך כניסה: מוצג אם אין משתמש מחובר ולא נבחר "המשך ללא כניסה"
  updateUserBadge();
  if (!currentUser() && !localStorage.getItem(SKIP_LOGIN_KEY)) {
    showLogin();
    els.loginUserInput?.focus();
  } else {
    hideLogin();
  }

  // רישום Service Worker לתמיכה לא-מקוונת (PWA)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
