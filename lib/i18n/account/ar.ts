import type { Messages } from "../types";

export const accountAr: Messages["account"] = {
  navLabel: "حساب",
  eyebrow: "حساب",
  title: "نسخ سحابي",
  lead: "سجّل الدخول للوصول إلى مصاريفك ووصفاتك وقائمتك على كل أجهزتك.",
  notConfiguredTitle: "السحابة غير مهيأة",
  notConfiguredBody:
    "يجب إعداد مشروع Supabase والمتغيرات (راجع docs/SUPABASE_SETUP.md). حتى ذلك الحين، البيانات على هذا الجهاز فقط.",
  emailLabel: "البريد",
  emailPlaceholder: "you@example.com",
  sendLink: "إرسال رابط الدخول",
  linkSent: "تم الإرسال — تحقق من بريدك (والرسائل غير المرغوبة).",
  signedInAs: "متصل:",
  syncNow: "مزامنة الآن",
  syncing: "جاري المزامنة…",
  synced: "تمت المزامنة",
  lastSync: "آخر مزامنة:",
  signOut: "تسجيل الخروج",
  syncHint: "التعديلات تُحفظ تلقائياً في السحابة بعد ثوانٍ.",
  errorGeneric: "تعذرت المزامنة. أعد المحاولة.",
};
