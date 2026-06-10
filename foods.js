// ===== מאגר מזון מובנה =====
// ערכים תזונתיים לכל מנה/יחידה מקובלת (לא ל-100 גרם).
// calories=קלוריות, protein=חלבון(ג'), carbs=פחמימה(ג'), fat=שומן(ג'), unit=תיאור היחידה.

const FOOD_DB = [
  // לחם ודגנים
  { name: "פרוסת לחם לבן", unit: "פרוסה", calories: 75, protein: 2.5, carbs: 14, fat: 1 },
  { name: "פרוסת לחם מלא", unit: "פרוסה", calories: 70, protein: 3.5, carbs: 12, fat: 1 },
  { name: "פרוסת לחם קל", unit: "פרוסה", calories: 40, protein: 2, carbs: 7, fat: 0.5 },
  { name: "פרוסת לחם כוסמין", unit: "פרוסה", calories: 80, protein: 3, carbs: 15, fat: 1 },
  { name: "פיתה", unit: "יחידה", calories: 165, protein: 5.5, carbs: 33, fat: 1 },
  { name: "לחמנייה", unit: "יחידה", calories: 200, protein: 7, carbs: 38, fat: 2.5 },
  { name: "אורז לבן מבושל", unit: "כוס", calories: 205, protein: 4.3, carbs: 45, fat: 0.4 },
  { name: "אורז מלא מבושל", unit: "כוס", calories: 215, protein: 5, carbs: 45, fat: 1.8 },
  { name: "פסטה מבושלת", unit: "כוס", calories: 220, protein: 8, carbs: 43, fat: 1.3 },
  { name: "קוואקר (שיבולת שועל)", unit: "חצי כוס יבש", calories: 150, protein: 5, carbs: 27, fat: 3 },
  { name: "פתיתים מבושלים", unit: "כוס", calories: 180, protein: 6, carbs: 37, fat: 0.5 },
  { name: "קוסקוס מבושל", unit: "כוס", calories: 175, protein: 6, carbs: 36, fat: 0.3 },
  { name: "בורקס גבינה", unit: "יחידה", calories: 280, protein: 7, carbs: 24, fat: 17 },
  { name: "קרואסון חמאה", unit: "יחידה", calories: 240, protein: 5, carbs: 26, fat: 12 },
  { name: "טורטייה", unit: "יחידה", calories: 150, protein: 4, carbs: 25, fat: 4 },
  { name: "קורנפלייקס", unit: "כוס", calories: 100, protein: 2, carbs: 24, fat: 0.1 },
  { name: "גרנולה", unit: "חצי כוס", calories: 210, protein: 5, carbs: 36, fat: 6 },
  { name: "קינואה מבושלת", unit: "כוס", calories: 222, protein: 8, carbs: 39, fat: 3.6 },

  // חלבונים
  { name: "ביצה קשה", unit: "יחידה", calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
  { name: "חביתה מ-2 ביצים", unit: "מנה", calories: 180, protein: 13, carbs: 1, fat: 14 },
  { name: "חזה עוף בגריל", unit: "100 גרם", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "שניצל עוף מטוגן", unit: "יחידה", calories: 290, protein: 22, carbs: 14, fat: 16 },
  { name: "סטייק בקר", unit: "150 גרם", calories: 380, protein: 39, carbs: 0, fat: 24 },
  { name: "פילה סלמון", unit: "150 גרם", calories: 280, protein: 34, carbs: 0, fat: 16 },
  { name: "טונה במים", unit: "קופסה", calories: 110, protein: 25, carbs: 0, fat: 1 },
  { name: "טופו", unit: "100 גרם", calories: 76, protein: 8, carbs: 1.9, fat: 4.8 },
  { name: "קציצת בקר", unit: "יחידה", calories: 230, protein: 17, carbs: 6, fat: 15 },
  { name: "נקניקייה", unit: "יחידה", calories: 150, protein: 6, carbs: 2, fat: 13 },
  { name: "הודו הודו בגריל", unit: "100 גרם", calories: 135, protein: 29, carbs: 0, fat: 1 },
  { name: "בשר טחון", unit: "100 גרם", calories: 250, protein: 26, carbs: 0, fat: 17 },
  { name: "שניצל הודו בתנור", unit: "יחידה", calories: 220, protein: 24, carbs: 12, fat: 8 },
  { name: "דג אמנון בתנור", unit: "150 גרם", calories: 240, protein: 30, carbs: 0, fat: 13 },
  { name: "ביצה מטוגנת (עין)", unit: "יחידה", calories: 90, protein: 6.3, carbs: 0.6, fat: 7 },
  { name: "חזה הודו (פרוסות)", unit: "100 גרם", calories: 110, protein: 18, carbs: 3, fat: 3 },

  // קטניות
  { name: "עדשים מבושלות", unit: "כוס", calories: 230, protein: 18, carbs: 40, fat: 0.8 },
  { name: "חומוס (גרגירים)", unit: "כוס", calories: 270, protein: 15, carbs: 45, fat: 4 },
  { name: "ממרח חומוס", unit: "100 גרם", calories: 177, protein: 8, carbs: 20, fat: 8 },
  { name: "שעועית מבושלת", unit: "כוס", calories: 225, protein: 15, carbs: 40, fat: 0.9 },
  { name: "פלאפל", unit: "כדור", calories: 60, protein: 2.5, carbs: 5, fat: 3.5 },
  { name: "אדמה (פול סויה)", unit: "כוס", calories: 190, protein: 17, carbs: 14, fat: 8 },
  { name: "אפונה ירוקה מבושלת", unit: "כוס", calories: 130, protein: 8, carbs: 25, fat: 0.4 },
  { name: "גרגירי חומוס קלויים", unit: "חצי כוס", calories: 120, protein: 6, carbs: 20, fat: 2 },

  // ירקות
  { name: "מלפפון", unit: "יחידה", calories: 30, protein: 1.3, carbs: 7, fat: 0.2 },
  { name: "עגבנייה", unit: "יחידה", calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2 },
  { name: "גזר", unit: "יחידה", calories: 25, protein: 0.6, carbs: 6, fat: 0.1 },
  { name: "תפוח אדמה אפוי", unit: "יחידה", calories: 160, protein: 4.3, carbs: 37, fat: 0.2 },
  { name: "בטטה אפויה", unit: "יחידה", calories: 115, protein: 2, carbs: 27, fat: 0.1 },
  { name: "סלט ירקות", unit: "קערה", calories: 70, protein: 2, carbs: 10, fat: 3 },
  { name: "אבוקדו", unit: "חצי יחידה", calories: 160, protein: 2, carbs: 8.5, fat: 15 },
  { name: "פלפל אדום", unit: "יחידה", calories: 37, protein: 1.2, carbs: 7, fat: 0.4 },
  { name: "ברוקולי מבושל", unit: "כוס", calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
  { name: "תירס מבושל", unit: "חצי כוס", calories: 80, protein: 2.5, carbs: 19, fat: 1 },
  { name: "חסה", unit: "כוס קצוץ", calories: 8, protein: 0.6, carbs: 1.5, fat: 0.1 },
  { name: "בצל", unit: "יחידה", calories: 44, protein: 1.2, carbs: 10, fat: 0.1 },
  { name: "ציפס תנור", unit: "מנה", calories: 320, protein: 4, carbs: 42, fat: 15 },
  { name: "תפוחי אדמה מטוגנים", unit: "מנה", calories: 365, protein: 4, carbs: 48, fat: 17 },

  // פירות
  { name: "תפוח", unit: "יחידה", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: "בננה", unit: "יחידה", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: "תפוז", unit: "יחידה", calories: 62, protein: 1.2, carbs: 15, fat: 0.2 },
  { name: "ענבים", unit: "כוס", calories: 104, protein: 1.1, carbs: 27, fat: 0.2 },
  { name: "אבטיח", unit: "פרוסה", calories: 85, protein: 1.7, carbs: 21, fat: 0.4 },
  { name: "תות שדה", unit: "כוס", calories: 49, protein: 1, carbs: 12, fat: 0.5 },
  { name: "אגס", unit: "יחידה", calories: 100, protein: 0.6, carbs: 27, fat: 0.2 },
  { name: "אפרסק", unit: "יחידה", calories: 58, protein: 1.4, carbs: 14, fat: 0.4 },
  { name: "שזיף", unit: "יחידה", calories: 30, protein: 0.5, carbs: 8, fat: 0.2 },
  { name: "מלון", unit: "פרוסה", calories: 60, protein: 1.5, carbs: 15, fat: 0.3 },
  { name: "מנגו", unit: "יחידה", calories: 200, protein: 2.8, carbs: 50, fat: 1.3 },
  { name: "רימון", unit: "יחידה", calories: 105, protein: 1.7, carbs: 26, fat: 0.5 },
  { name: "תמרים", unit: "2 יחידות", calories: 110, protein: 1, carbs: 30, fat: 0 },
  { name: "אוכמניות", unit: "כוס", calories: 84, protein: 1.1, carbs: 21, fat: 0.5 },

  // מוצרי חלב
  { name: "כוס חלב 3%", unit: "כוס", calories: 150, protein: 8, carbs: 12, fat: 8 },
  { name: "יוגורט טבעי", unit: "גביע", calories: 100, protein: 6, carbs: 12, fat: 3 },
  { name: "יוגורט יווני", unit: "גביע", calories: 130, protein: 11, carbs: 7, fat: 5 },
  { name: "גבינה צהובה", unit: "פרוסה", calories: 80, protein: 5.5, carbs: 0.5, fat: 6 },
  { name: "גבינה לבנה 5%", unit: "100 גרם", calories: 90, protein: 11, carbs: 4, fat: 5 },
  { name: "קוטג' 5%", unit: "100 גרם", calories: 103, protein: 11, carbs: 4, fat: 5 },
  { name: "גבינת שמנת", unit: "כף", calories: 50, protein: 1, carbs: 1, fat: 5 },
  { name: "גבינת פטה", unit: "100 גרם", calories: 264, protein: 14, carbs: 4, fat: 21 },
  { name: "גבינת מוצרלה", unit: "100 גרם", calories: 280, protein: 22, carbs: 2, fat: 21 },
  { name: "שוקו (משקה)", unit: "כוס", calories: 190, protein: 8, carbs: 26, fat: 6 },
  { name: "חמאה", unit: "כף", calories: 102, protein: 0.1, carbs: 0, fat: 11.5 },
  { name: "גלידה וניל", unit: "כדור", calories: 137, protein: 2.3, carbs: 16, fat: 7 },

  // אגוזים וממרחים
  { name: "חמאת בוטנים", unit: "כף", calories: 95, protein: 4, carbs: 3, fat: 8 },
  { name: "שקדים", unit: "חופן (28ג')", calories: 164, protein: 6, carbs: 6, fat: 14 },
  { name: "אגוזי מלך", unit: "חופן (28ג')", calories: 185, protein: 4.3, carbs: 4, fat: 18 },
  { name: "טחינה גולמית", unit: "כף", calories: 89, protein: 2.6, carbs: 3, fat: 8 },
  { name: "אגוזי קאשיו", unit: "חופן (28ג')", calories: 157, protein: 5, carbs: 9, fat: 12 },
  { name: "פיסטוקים", unit: "חופן (28ג')", calories: 159, protein: 6, carbs: 8, fat: 13 },
  { name: "גרעיני דלעת", unit: "חופן (28ג')", calories: 151, protein: 7, carbs: 5, fat: 13 },
  { name: "נוטלה", unit: "כף", calories: 100, protein: 1, carbs: 11, fat: 6 },
  { name: "ריבת תותים", unit: "כף", calories: 56, protein: 0.1, carbs: 14, fat: 0 },
  { name: "דבש", unit: "כף", calories: 64, protein: 0.1, carbs: 17, fat: 0 },

  // רטבים, ממרחים ותוספות
  { name: "קטשופ", unit: "כף", calories: 17, protein: 0.2, carbs: 4.5, fat: 0 },
  { name: "מיונז", unit: "כף", calories: 94, protein: 0.1, carbs: 0.6, fat: 10 },
  { name: "חרדל", unit: "כף", calories: 10, protein: 0.7, carbs: 1, fat: 0.6 },
  { name: "רסק עגבניות", unit: "כף", calories: 13, protein: 0.7, carbs: 3, fat: 0.1 },
  { name: "רוטב עגבניות", unit: "כף", calories: 9, protein: 0.4, carbs: 2, fat: 0.1 },
  { name: "זיתים ירוקים", unit: "10 יחידות", calories: 50, protein: 0.4, carbs: 1.3, fat: 5 },
  { name: "זיתים שחורים", unit: "10 יחידות", calories: 60, protein: 0.5, carbs: 3, fat: 5.5 },
  { name: "חמאה", unit: "כף", calories: 102, protein: 0.1, carbs: 0, fat: 11.5 },
  { name: "שמן זית", unit: "כף", calories: 119, protein: 0, carbs: 0, fat: 13.5 },
  { name: "קצפת", unit: "כף", calories: 52, protein: 0.3, carbs: 0.4, fat: 5.5 },
  { name: "סילאן", unit: "כף", calories: 60, protein: 0.2, carbs: 15, fat: 0 },

  // מנות מוכנות / רחוב
  { name: "פיצה", unit: "משולש", calories: 285, protein: 12, carbs: 36, fat: 10 },
  { name: "המבורגר", unit: "מנה", calories: 350, protein: 20, carbs: 30, fat: 17 },
  { name: "שווארמה בפיתה", unit: "מנה", calories: 600, protein: 30, carbs: 50, fat: 30 },
  { name: "סושי", unit: "8 חתיכות", calories: 350, protein: 12, carbs: 60, fat: 6 },
  { name: "מרק עוף", unit: "קערה", calories: 120, protein: 9, carbs: 10, fat: 4 },
  { name: "פאד תאי", unit: "מנה", calories: 400, protein: 14, carbs: 50, fat: 15 },
  { name: "לזניה", unit: "מנה", calories: 380, protein: 20, carbs: 33, fat: 18 },
  { name: "סנדוויץ גבינה", unit: "יחידה", calories: 300, protein: 14, carbs: 30, fat: 14 },
  { name: "כריך אבוקדו", unit: "יחידה", calories: 320, protein: 8, carbs: 35, fat: 16 },
  { name: "כריך טונה", unit: "יחידה", calories: 350, protein: 20, carbs: 32, fat: 15 },
  { name: "לאפה עם קבב", unit: "מנה", calories: 650, protein: 32, carbs: 60, fat: 30 },
  { name: "חציל מטוגן", unit: "מנה", calories: 180, protein: 2, carbs: 10, fat: 15 },
  { name: "אורז מטוגן (סיני)", unit: "כוס", calories: 240, protein: 5, carbs: 45, fat: 4 },
  { name: "נודלס", unit: "מנה", calories: 380, protein: 10, carbs: 55, fat: 13 },

  // משקאות וחטיפים
  { name: "קפה הפוך", unit: "כוס", calories: 90, protein: 5, carbs: 9, fat: 4 },
  { name: "קולה", unit: "פחית (330מל)", calories: 139, protein: 0, carbs: 35, fat: 0 },
  { name: "מיץ תפוזים", unit: "כוס", calories: 112, protein: 1.7, carbs: 26, fat: 0.5 },
  { name: "חטיף שוקולד", unit: "יחידה", calories: 230, protein: 3, carbs: 28, fat: 12 },
  { name: "במבה", unit: "שקית קטנה", calories: 130, protein: 3, carbs: 13, fat: 8 },
  { name: "עוגיית שוקולד צ'יפס", unit: "יחידה", calories: 140, protein: 1.5, carbs: 19, fat: 7 },
  { name: "תה (ללא סוכר)", unit: "כוס", calories: 2, protein: 0, carbs: 0.5, fat: 0 },
  { name: "קפה שחור", unit: "כוס", calories: 5, protein: 0.3, carbs: 0, fat: 0 },
  { name: "בירה", unit: "בקבוק (330מל)", calories: 145, protein: 1.6, carbs: 11, fat: 0 },
  { name: "יין אדום", unit: "כוס", calories: 125, protein: 0.1, carbs: 4, fat: 0 },
  { name: "אנרג'י (חטיף)", unit: "יחידה", calories: 200, protein: 5, carbs: 30, fat: 7 },
  { name: "ביסקוויטים", unit: "2 יחידות", calories: 100, protein: 1.5, carbs: 16, fat: 3.5 },
  { name: "וופלים", unit: "יחידה", calories: 130, protein: 1, carbs: 18, fat: 6 },
  { name: "פופקורן", unit: "קערה", calories: 100, protein: 3, carbs: 20, fat: 1.2 },
  { name: "חטיף חלבון (חלבון בר)", unit: "יחידה", calories: 200, protein: 20, carbs: 22, fat: 7 },
];

// ===== ניתוח טקסט מקומי (ללא AI / ללא מפתח) =====
// מזהה מאכלים מהמאגר בתוך משפט חופשי בעברית, כולל כמויות ומספרים.

// מילים נרדפות -> שם פריט במאגר (כדי לזהות גם ניסוחים מקוצרים)
const FOOD_ALIASES = {
  "לחם": "פרוסת לחם לבן",
  "לחם לבן": "פרוסת לחם לבן",
  "לחם מלא": "פרוסת לחם מלא",
  "לחם קל": "פרוסת לחם קל",
  "פרוסת לחם קל": "פרוסת לחם קל",
  "לחם דיאטטי": "פרוסת לחם קל",
  "לחם כוסמין": "פרוסת לחם כוסמין",
  "כוסמין": "פרוסת לחם כוסמין",
  "פרוסת לחם": "פרוסת לחם לבן",
  "ביצה": "ביצה קשה",
  "ביצים": "ביצה קשה",
  "חביתה": "חביתה מ-2 ביצים",
  "עוף": "חזה עוף בגריל",
  "חזה עוף": "חזה עוף בגריל",
  "שניצל": "שניצל עוף מטוגן",
  "סטייק": "סטייק בקר",
  "בשר": "סטייק בקר",
  "סלמון": "פילה סלמון",
  "טונה": "טונה במים",
  "אורז": "אורז לבן מבושל",
  "פסטה": "פסטה מבושלת",
  "קוואקר": "קוואקר (שיבולת שועל)",
  "שיבולת שועל": "קוואקר (שיבולת שועל)",
  "פתיתים": "פתיתים מבושלים",
  "קוסקוס": "קוסקוס מבושל",
  "עדשים": "עדשים מבושלות",
  "חומוס": "ממרח חומוס",
  "שעועית": "שעועית מבושלת",
  "מלפפון": "מלפפון",
  "עגבנייה": "עגבנייה",
  "עגבניה": "עגבנייה",
  "גזר": "גזר",
  "תפוח אדמה": "תפוח אדמה אפוי",
  "בטטה": "בטטה אפויה",
  "סלט": "סלט ירקות",
  "אבוקדו": "אבוקדו",
  "תפוח": "תפוח",
  "בננה": "בננה",
  "תפוז": "תפוז",
  "ענבים": "ענבים",
  "אבטיח": "אבטיח",
  "תות": "תות שדה",
  "תותים": "תות שדה",
  "חלב": "כוס חלב 3%",
  "יוגורט": "יוגורט טבעי",
  "יוגורט יווני": "יוגורט יווני",
  "גבינה צהובה": "גבינה צהובה",
  "גבינה לבנה": "גבינה לבנה 5%",
  "קוטג": "קוטג' 5%",
  "חמאת בוטנים": "חמאת בוטנים",
  "שקדים": "שקדים",
  "אגוזים": "אגוזי מלך",
  "אגוזי מלך": "אגוזי מלך",
  "טחינה": "טחינה גולמית",
  "קטשופ": "קטשופ",
  "קטצ'ופ": "קטשופ",
  "מיונז": "מיונז",
  "מיונית": "מיונז",
  "חרדל": "חרדל",
  "רסק עגבניות": "רסק עגבניות",
  "רסק": "רסק עגבניות",
  "רוטב עגבניות": "רוטב עגבניות",
  "זיתים": "זיתים ירוקים",
  "זית": "זיתים ירוקים",
  "זיתים ירוקים": "זיתים ירוקים",
  "זיתים שחורים": "זיתים שחורים",
  "חמאה": "חמאה",
  "שמן זית": "שמן זית",
  "קצפת": "קצפת",
  "סילאן": "סילאן",
  "פיצה": "פיצה",
  "המבורגר": "המבורגר",
  "שווארמה": "שווארמה בפיתה",
  "סושי": "סושי",
  "מרק": "מרק עוף",
  "מרק עוף": "מרק עוף",
  "קפה": "קפה הפוך",
  "קפה הפוך": "קפה הפוך",
  "קולה": "קולה",
  "מיץ": "מיץ תפוזים",
  "מיץ תפוזים": "מיץ תפוזים",
  "שוקולד": "חטיף שוקולד",
  "במבה": "במבה",
  "עוגייה": "עוגיית שוקולד צ'יפס",
  "עוגיה": "עוגיית שוקולד צ'יפס",
  "פיתה": "פיתה",
  "לחמנייה": "לחמנייה",
  "פלאפל": "פלאפל",
  "נקניקייה": "נקניקייה",
  "טופו": "טופו",
  "קציצה": "קציצת בקר",
  "הודו": "הודו הודו בגריל",
  "חזה הודו": "חזה הודו (פרוסות)",
  "בשר טחון": "בשר טחון",
  "קימה": "בשר טחון",
  "אמנון": "דג אמנון בתנור",
  "דג": "דג אמנון בתנור",
  "ביצת עין": "ביצה מטוגנת (עין)",
  "ביצה מטוגנת": "ביצה מטוגנת (עין)",
  "קרואסון": "קרואסון חמאה",
  "טורטייה": "טורטייה",
  "קורנפלקס": "קורנפלייקס",
  "גרנולה": "גרנולה",
  "קינואה": "קינואה מבושלת",
  "בורקס": "בורקס גבינה",
  "אדממה": "אדמה (פול סויה)",
  "אפונה": "אפונה ירוקה מבושלת",
  "פלפל": "פלפל אדום",
  "פלפל אדום": "פלפל אדום",
  "ברוקולי": "ברוקולי מבושל",
  "תירס": "תירס מבושל",
  "חסה": "חסה",
  "בצל": "בצל",
  "ציפס": "ציפס תנור",
  "צ'יפס": "תפוחי אדמה מטוגנים",
  "אגס": "אגס",
  "אפרסק": "אפרסק",
  "שזיף": "שזיף",
  "מלון": "מלון",
  "מנגו": "מנגו",
  "רימון": "רימון",
  "תמר": "תמרים",
  "תמרים": "תמרים",
  "אוכמניות": "אוכמניות",
  "שמנת": "גבינת שמנת",
  "גבינת שמנת": "גבינת שמנת",
  "פטה": "גבינת פטה",
  "מוצרלה": "גבינת מוצרלה",
  "שוקו": "שוקו (משקה)",
  "חמאה": "חמאה",
  "גלידה": "גלידה וניל",
  "קאשיו": "אגוזי קאשיו",
  "פיסטוקים": "פיסטוקים",
  "גרעינים": "גרעיני דלעת",
  "נוטלה": "נוטלה",
  "ריבה": "ריבת תותים",
  "דבש": "דבש",
  "פאד תאי": "פאד תאי",
  "לזניה": "לזניה",
  "סנדוויץ": "סנדוויץ גבינה",
  "סנדביץ": "סנדוויץ גבינה",
  "כריך אבוקדו": "כריך אבוקדו",
  "כריך טונה": "כריך טונה",
  "לאפה עם קבב": "לאפה עם קבב",
  "לאפה קבב": "לאפה עם קבב",
  "קבב בלאפה": "לאפה עם קבב",
  "חציל": "חציל מטוגן",
  "נודלס": "נודלס",
  "תה": "תה (ללא סוכר)",
  "קפה שחור": "קפה שחור",
  "בירה": "בירה",
  "יין": "יין אדום",
  "פופקורן": "פופקורן",
  "ביסקוויטים": "ביסקוויטים",
  "וופלים": "וופלים",
  "חטיף חלבון": "חטיף חלבון (חלבון בר)",
  "חלבון בר": "חטיף חלבון (חלבון בר)",
};

// מספרים במילים בעברית -> ערך
const HEBREW_NUMBERS = {
  "חצי": 0.5,
  "אחד": 1, "אחת": 1, "יחיד": 1,
  "שני": 2, "שתי": 2, "שניים": 2, "שתיים": 2, "זוג": 2,
  "שלוש": 3, "שלושה": 3,
  "ארבע": 4, "ארבעה": 4,
  "חמש": 5, "חמישה": 5,
  "שש": 6, "שישה": 6,
  "שבע": 7, "שבעה": 7,
  "שמונה": 8,
  "תשע": 9, "תשעה": 9,
  "עשר": 10, "עשרה": 10,
};

// ערכים תזונתיים ל-100 גרם — לזיהוי כמויות במשקל (למשל "150 גרם עוף")
const FOOD_PER_100G = {
  "חזה עוף בגריל": { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  "הודו הודו בגריל": { calories: 135, protein: 29, carbs: 0, fat: 1 },
  "חזה הודו (פרוסות)": { calories: 110, protein: 18, carbs: 3, fat: 3 },
  "סטייק בקר": { calories: 250, protein: 26, carbs: 0, fat: 16 },
  "בשר טחון": { calories: 250, protein: 26, carbs: 0, fat: 17 },
  "פילה סלמון": { calories: 185, protein: 22, carbs: 0, fat: 11 },
  "דג אמנון בתנור": { calories: 128, protein: 26, carbs: 0, fat: 2.7 },
  "טופו": { calories: 76, protein: 8, carbs: 1.9, fat: 4.8 },
  "טונה במים": { calories: 116, protein: 26, carbs: 0, fat: 1 },
  "אורז לבן מבושל": { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  "אורז מלא מבושל": { calories: 123, protein: 2.7, carbs: 26, fat: 1 },
  "פסטה מבושלת": { calories: 158, protein: 5.8, carbs: 31, fat: 0.9 },
  "קוסקוס מבושל": { calories: 112, protein: 3.8, carbs: 23, fat: 0.2 },
  "עדשים מבושלות": { calories: 116, protein: 9, carbs: 20, fat: 0.4 },
  "ממרח חומוס": { calories: 177, protein: 8, carbs: 20, fat: 8 },
  "תפוח אדמה אפוי": { calories: 93, protein: 2.5, carbs: 21, fat: 0.1 },
  "בטטה אפויה": { calories: 90, protein: 2, carbs: 21, fat: 0.1 },
  "גבינה צהובה": { calories: 350, protein: 25, carbs: 2, fat: 27 },
  "גבינה לבנה 5%": { calories: 90, protein: 11, carbs: 4, fat: 5 },
  "קוטג' 5%": { calories: 103, protein: 11, carbs: 4, fat: 5 },
  "גבינת פטה": { calories: 264, protein: 14, carbs: 4, fat: 21 },
  "גבינת מוצרלה": { calories: 280, protein: 22, carbs: 2, fat: 21 },
  "שקדים": { calories: 579, protein: 21, carbs: 22, fat: 50 },
  "אגוזי מלך": { calories: 654, protein: 15, carbs: 14, fat: 65 },
  "אגוזי קאשיו": { calories: 553, protein: 18, carbs: 30, fat: 44 },
  "פיסטוקים": { calories: 562, protein: 20, carbs: 28, fat: 45 },
  "אבוקדו": { calories: 160, protein: 2, carbs: 8.5, fat: 15 },
  "טחינה גולמית": { calories: 595, protein: 17, carbs: 21, fat: 53 },
  "חמאת בוטנים": { calories: 588, protein: 25, carbs: 20, fat: 50 },
};


// בניית מפת חיפוש: שם -> פריט מהמאגר
function _buildLookup() {
  const map = new Map();
  FOOD_DB.forEach((f) => map.set(f.name, f));
  return map;
}
const _FOOD_BY_NAME = _buildLookup();

// ביטויי החיפוש ממוינים מהארוך לקצר כדי להעדיף התאמות ספציפיות
const _SEARCH_TERMS = [
  ...FOOD_DB.map((f) => ({ term: f.name, target: f.name })),
  ...Object.entries(FOOD_ALIASES).map(([term, target]) => ({ term, target })),
].sort((a, b) => b.term.length - a.term.length);

// מילות יחידת מידה (כולל צורות רבים) שעשויות להופיע בין המספר למאכל
// למשל "3 כפות טחינה", "2 כוסות אורז", "חופן שקדים".
const UNIT_WORDS = new Set([
  "כף", "כפות", "כפית", "כפיות",
  "כוס", "כוסות",
  "חופן", "חופנים",
  "פרוסה", "פרוסות",
  "יחידה", "יחידות",
  "גביע", "גביעים",
  "כדור", "כדורים",
  "קופסה", "קופסת", "קופסאות",
  "פחית", "פחיות",
  "קערה", "קערות",
  "צלחת", "צלחות",
  "מנה", "מנות",
  "משולש", "משולשים",
  "שקית", "שקיות",
  "בקבוק", "בקבוקים",
  "חתיכה", "חתיכות",
  "פרי",
]);

// מחזיר כמות שמופיעה ממש לפני המאכל בטקסט (מספר ספרתי או מילולי), ברירת מחדל 1.
// תומך גם בניסוח "<מספר> <יחידה> <מאכל>" (למשל "3 כפות טחינה").
function _findQuantityBefore(text, index) {
  const before = text.slice(0, index).trim();
  const words = before.split(/\s+/);

  // דילוג על המילה "של" (למשל "כוס של אורז")
  let i = words.length - 1;
  if (words[i] === "של") i--;

  let last = words[i] || "";

  // אם המילה הצמודה היא יחידת מידה — לדלג עליה ולחפש מספר לפניה
  if (UNIT_WORDS.has(last)) {
    const prev = words[i - 1] || "";
    const numMatch = prev.match(/^(\d+(?:\.\d+)?)$/);
    if (numMatch) return parseFloat(numMatch[1]);
    if (HEBREW_NUMBERS[prev] !== undefined) return HEBREW_NUMBERS[prev];
    return 1; // יחידה בודדת ללא מספר (למשל "חופן שקדים")
  }

  const numMatch = last.match(/^(\d+(?:\.\d+)?)$/);
  if (numMatch) return parseFloat(numMatch[1]);
  if (HEBREW_NUMBERS[last] !== undefined) return HEBREW_NUMBERS[last];
  return 1;
}

// מזהה משקל בגרמים שמופיע לפני המאכל (למשל "150 גרם", "150 גר'", "150 ג'")
// מחזיר מספר הגרמים, או null אם אין משקל.
function _findGramsBefore(text, index) {
  const before = text.slice(0, index).trim();
  // תופס: <מספר> [רווח] גרם/גרמים/גר'/ג'/ג
  const m = before.match(/(\d+(?:\.\d+)?)\s*(?:גרם|גרמים|גר['׳]?|ג['׳])\s*(?:של\s*)?$/);
  if (m) return parseFloat(m[1]);
  return null;
}

// ניתוח טקסט מקומי -> רשימת פריטים { name, calories, protein, carbs, fat }
function analyzeTextLocally(text) {
  let remaining = " " + text.replace(/[,.;\n]/g, " ") + " ";
  const found = [];
  const usedRanges = [];

  for (const { term, target } of _SEARCH_TERMS) {
    let searchFrom = 0;
    let idx;
    while ((idx = remaining.indexOf(term, searchFrom)) !== -1) {
      searchFrom = idx + term.length;
      // לוודא שזו מילה שלמה (גבולות רווח/קצה), עם תמיכה בקידומות עברית (ו/ה/ב/ל/מ/ש/כ)
      const beforeCh = remaining[idx - 1];
      const before2Ch = remaining[idx - 2];
      const afterCh = remaining[idx + term.length];
      const isPrefixLetter = beforeCh !== undefined && "והבלמשכ".includes(beforeCh);
      const boundaryBefore =
        beforeCh === undefined ||
        /\s/.test(beforeCh) ||
        (isPrefixLetter && (before2Ch === undefined || /\s/.test(before2Ch)));
      const boundaryAfter = afterCh === undefined || /\s/.test(afterCh);
      if (!boundaryBefore || !boundaryAfter) continue;

      // לדלג אם הטווח כבר נתפס ע"י מאכל ארוך יותר
      const overlap = usedRanges.some(
        (r) => idx < r.end && idx + term.length > r.start
      );
      if (overlap) continue;

      const food = _FOOD_BY_NAME.get(target);
      if (!food) continue;

      // זיהוי משקל בגרמים -> חישוב לפי ערכים ל-100 גרם (אם קיימים)
      const grams = _findGramsBefore(remaining, idx);
      const per100 = FOOD_PER_100G[target];
      if (grams !== null && per100) {
        const factor = grams / 100;
        found.push({
          name: `${food.name} (${grams} גרם)`,
          calories: per100.calories * factor,
          protein: per100.protein * factor,
          carbs: per100.carbs * factor,
          fat: per100.fat * factor,
        });
        usedRanges.push({ start: idx, end: idx + term.length });
        continue;
      }

      const qty = _findQuantityBefore(remaining, idx);
      found.push({
        name: qty === 1 ? `${food.name} (${food.unit})` : `${food.name} (${qty} × ${food.unit})`,
        calories: food.calories * qty,
        protein: food.protein * qty,
        carbs: food.carbs * qty,
        fat: food.fat * qty,
      });
      usedRanges.push({ start: idx, end: idx + term.length });
    }
  }

  return found;
}

