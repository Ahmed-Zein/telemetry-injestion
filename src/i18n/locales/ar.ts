// cypod-telemetry
import { en } from "./en.js";

export const ar: Record<keyof typeof en, string> = {
  "auth.token_missing": "فشل المصادقة: رمز الدخول مفقود أو غير صالح.",
  "auth.token_invalid": "رمز الدخول غير صالح أو انتهت صلاحيته.",
  "auth.required": "يجب تسجيل الدخول للوصول إلى هذا المورد.",
  "device.not_found": "لم يتم العثور على الجهاز المطلوب.",
  "device.name_exists": "اسم الجهاز مستخدم بالفعل لهذا المستخدم.",
  "device.invalid_id": "معرّف الجهاز غير صالح.",
  "device.created": "تم إنشاء الجهاز بنجاح.",
  "telemetry.empty_payload": "بيانات القياس عن بعد لا يمكن أن تكون فارغة.",
  "telemetry.invalid_date": "تنسيق التاريخ '{label}' غير صالح: {value}",
  "telemetry.date_out_of_range": "التاريخ '{label}' خارج النطاق المسموح به: {value}",
  "user.already_exists": "هذا المستخدم مسجل بالفعل.",
  "user.invalid_credentials": "بيانات الدخول غير صحيحة.",
  "success.default": "تمت العملية بنجاح.",
  "error.route_not_found": "لم يتم العثور على المسار: {url}",
  "error.internal_server": "حدث خطأ داخلي في الخادم.",
  "error.validation_failed": "فشل في التحقق من صحة البيانات المُدخلة: {details}",
  "error.payload_too_large": "حجم الطلب أكبر من الحد المسموح ({limit}). أرسل دفعة أصغر.",
  "error.malformed_json": "جسم الطلب ليس بصيغة JSON صالحة.",
  "error.rate_limited": "تم تجاوز حد الطلبات: {limit} طلبات كحد أقصى لكل نافذة. أعد المحاولة بعد {retryAfter} ثانية.",
};
