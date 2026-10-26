import type { Lang } from './types';

/** The site's own fixed labels (controls, not content). Content comes from the published document. */
const UI = {
  nav: { shop: ['المتجر', 'Store'], import: ['الاستيراد', 'Import'], calc: ['الحاسبة', 'Calculator'], journey: ['رحلة الطلب', 'Order journey'], tracking: ['التتبع', 'Tracking'], blog: ['المدونة', 'Blog'], gov: ['الجهات الحكومية', 'Government'], faq: ['الأسئلة الشائعة', 'FAQ'], containers: ['الحاويات', 'Containers'], clients: ['عملاؤنا', 'Clients'], rfq: ['اطلب عرض سعر', 'Request a quote'] },
  menu: ['القائمة', 'Menu'], darkMode: ['الوضع الليلي', 'Dark mode'], lightMode: ['الوضع النهاري', 'Light mode'], langSwitch: ['Switch to English', 'التبديل إلى العربية'], langLabel: ['EN', 'ع'],
  sar: ['ر.س', 'SAR'], days: ['يوماً', 'days'], perUnit: ['للوحدة', 'per unit'], arrivesIn: ['الوصول خلال ', 'Arrives in '], about: ['أي ', 'About '],
  calc: {
    value: ['قيمة البضاعة (ر.س، سعر المصنع)', 'Goods value (SAR, factory price)'], qty: ['الكمية (وحدة، اختياري)', 'Quantity (units, optional)'], category: ['القسم', 'Category'], mode: ['طريقة الشحن', 'Freight'],
    volume: ['الحجم (م³)', 'Volume (m³)'], weight: ['الوزن (كجم)', 'Weight (kg)'], port: ['منفذ الوصول', 'Port of entry'], insurance: ['تأمين الشحنة', 'Freight insurance'], duty: ['رسوم ', 'duty '],
    landed: ['التكلفة التقديرية واصلةً إلى مستودعك', 'Estimated landed cost at your warehouse'],
    rows: { goods: ['قيمة البضاعة', 'Goods'], freight: ['الشحن الدولي', 'Freight'], insurance: ['التأمين', 'Insurance'], duty: ['الرسوم الجمركية', 'Customs duty'], clearance: ['التخليص والمناولة', 'Clearance and handling'], inland: ['النقل الداخلي', 'Inland transport'], service: ['رسوم خدمة برايم', 'Prime service fee'], vat: ['ضريبة القيمة المضافة', 'VAT'], total: ['الإجمالي شاملاً الضريبة', 'Total incl. VAT'] },
    rfq: ['اطلب عرض سعر بهذه البيانات', 'Request a quote with these figures'], compare: ['قارن جوي / بحري', 'Compare air vs sea'], hide: ['إخفاء المقارنة', 'Hide comparison'],
    air: ['جوي', 'Air'], sea: ['بحري', 'Sea'], inclVat: ['شاملاً الضريبة', 'incl. VAT'], freightAlone: ['الشحن وحده: ', 'Freight alone: '],
    container: { lcl: ['شحنة مجمّعة', 'LCL'], c20: ['حاوية 20 قدماً', "20' container"], c40hc: ['حاوية 40 قدماً مرتفعة', "40' high cube"], air: ['جوي · {n} كجم محسوب', 'air · {n} kg chargeable'], land: ['بري', 'land'] },
  },
  journey: { time: ['المدة', 'Time'], receive: ['ما يصلك', 'What you receive'], prev: ['→ السابقة', '← Previous'], next: ['التالية ←', 'Next →'], step: ['STEP', 'STEP'] },
  box: { size: ['الأبعاد الداخلية', 'Internal size'], capacity: ['السعة', 'Capacity'], payload: ['أقصى حمولة', 'Max payload'], pallets: ['منصات قياسية (1.2×1 م)', 'Standard pallets (1.2×1 m)'], share: ['حسب حصتك', 'Per your share'], byVolume: ['حسب الحجم', 'By volume'], yours: ['بضاعتك', 'Your goods'], others: ['بضائع عملاء آخرين', 'Other shippers'], pallet: ['منصة قياسية. القيم والرسم تقريبية', 'Standard pallet. Values and drawing are approximate'] },
  clients: { all: ['الكل', 'All'] },
  tracking: { placeholder: ['SF-2026-00000', 'SF-2026-00000'], track: ['تتبّع', 'Track'], notFound: ['لم نجد هذا الرقم', 'Reference not found'], hint: ['تأكد من الرقم كما ورد في رسالة التأكيد، أو تواصل معنا عبر واتساب.', 'Check the number as it appears in your confirmation, or message us on WhatsApp.'] },
  rfq: {
    orgType: ['نوع الجهة', 'Organisation type'], name: ['اسم المسؤول', 'Contact name'], org: ['اسم الجهة', 'Organisation'], phone: ['رقم الجوال', 'Mobile'], email: ['البريد الإلكتروني', 'Email'], category: ['القسم', 'Category'],
    tender: ['رقم المنافسة في منصة اعتماد (اختياري)', 'Etimad tender number (optional)'], product: ['المنتج والكمية', 'Product and quantity'], urgency: ['درجة الاستعجال', 'Urgency'],
    urgencies: [['عادي · 7–14 يوماً', 'Standard · 7–14 days'], ['عاجل · 3–5 أيام', 'Urgent · 3–5 days'], ['عاجل جداً · 24–48 ساعة (+20%)', 'Very urgent · 24–48 h (+20%)']],
    send: ['أرسل طلب عرض السعر', 'Send quote request'], sending: ['جارٍ الإرسال…', 'Sending…'],
    needName: ['اكتب اسم المسؤول حتى نعرف من نخاطب.', 'Enter a contact name so we know who to reply to.'], needPhone: ['رقم الجوال يبدأ بـ 05 ويتكوّن من 10 أرقام.', 'The mobile number starts with 05 and has 10 digits.'], needProduct: ['اكتب المنتج والكمية.', 'Describe the product and quantity.'],
    done: ['استلمنا طلبك. رقمك المرجعي: ', 'We received your request. Your reference: '], doneHint: ['سيتواصل معك أخصائي المشتريات خلال يوم عمل. احتفظ بالرقم لمتابعة طلبك.', 'A procurement specialist will contact you within a working day. Keep the reference to follow up.'],
    failed: ['تعذّر إرسال الطلب الآن. حاول مرة أخرى أو راسلنا على واتساب.', 'The request could not be sent right now. Try again or message us on WhatsApp.'], tooMany: ['أرسلت طلبات كثيرة خلال وقت قصير. انتظر قليلاً ثم أعد المحاولة.', 'Too many requests in a short time. Wait a little and try again.'],
  },
  assistant: {
    open: ['اسأل المساعد', 'Ask the assistant'], close: ['إغلاق', 'Close'], send: ['أرسل', 'Send'], placeholder: ['اكتب سؤالك هنا…', 'Type your question…'],
    status: ['يجيب من قاعدة معرفة الشركة فقط', "Answers only from the company's knowledge base"], note: ['الأرقام تقديرية، والعرض النهائي يؤكده فريقنا.', 'Figures are estimates. The final quote is confirmed by our team.'],
    welcome: ['أهلاً بك. أنا مساعد برايم، أجيب عن أسئلتك في حدود ما زوّدتنا به الشركة عن خدماتها وشحنها ودفعها، وأقدّر لك تكلفة الاستيراد واصلةً إلى مستودعك. ماذا تريد أن تعرف؟', 'Welcome. I am the Prime assistant. I answer within what the company has provided about its services, freight and payment, and estimate your landed import cost. What would you like to know?'],
    chips: [['كم تكلفة استيراد بضاعة بقيمة 50,000 ر.س حجمها 12 م³ بحراً؟', 'What does importing SAR 50,000 of goods, 12 m³ by sea, cost?'], ['ما الفرق بين الشحن الجوي والبحري؟', 'Air or sea freight: what is the difference?'], ['كيف أدفع في الاستيراد؟', 'How do I pay for an import order?']],
    fromKb: ['من قاعدة معرفة الشركة.', 'From the company knowledge base.'], openedRfq: ['فتحت لك نموذج طلب عرض السعر أسفل الصفحة.', 'I have opened the quote request form at the bottom of the page.'],
    estimateIntro: ['هذا تقدير أولي لبضاعة بقيمة {v} ر.س{vol}{kg} بالشحن {mode} عبر {port}. الأرقام تقديرية ويؤكدها الفريق في عرض السعر.', 'A first estimate for goods worth SAR {v}{vol}{kg}, by {mode} via {port}. Figures are indicative and confirmed in the quote.'],
    wantQuote: ['تريد عرض سعر بهذه البيانات؟ اكتب «اطلب عرض سعر».', 'Want a quote with these figures? Type "request a quote".'],
    estTotal: ['الإجمالي التقديري', 'Estimated total'], estRows: { goods: ['البضاعة', 'Goods'], freight: ['الشحن', 'Freight'], duty: ['الجمارك', 'Duty'], clearance: ['التخليص والنقل', 'Clearance and transport'], service: ['رسوم الخدمة', 'Service fee'], vat: ['الضريبة', 'VAT'] },
    noAnswer: ['لا أملك هذه المعلومة حالياً، فأنا أجيب فقط مما زوّدتنا به الشركة. تواصل مع فريق المشتريات عبر واتساب أو نموذج طلب عرض السعر، وسيجيبك خلال يوم عمل.', 'I do not have that information yet; I only answer from what the company has provided. Contact the procurement team on WhatsApp or through the quote form and they will reply within a working day.'],
  },
  wa: { open: ['راسلنا واتساب', 'WhatsApp us'], title: ['راسلنا على واتساب', 'Message us on WhatsApp'], copy: ['نسخ', 'Copy'], copied: ['تم نسخ الرقم', 'Number copied'], go: ['افتح واتساب', 'Open WhatsApp'], placeholder: ['الرقم يُضاف من إدارة المتجر.', 'The number is added from the store builder.'] },
  footer: { contact: ['تواصل معنا', 'Contact'], mobile: ['الجوال:', 'Mobile:'], email: ['البريد:', 'Email:'], cr: ['السجل التجاري:', 'CR no.:'], hours: ['ساعات العمل:', 'Hours:'], partners: ['شركاء توصيل المتجر', 'Store delivery partners'] },
  blog: { guide: ['GUIDE', 'GUIDE'], by: ['فريق المشتريات، برايم كونتينرز', 'Procurement team, Prime Containers'], minRead: ['دقائق قراءة', 'min read'], back: ['المدونة', 'Blog'], home: ['الرئيسية', 'Home'], ctaTitle: ['تريد رقماً لشحنتك أنت؟', 'Want a number for your own shipment?'], ctaText: ['الحاسبة تعطيك تقديراً فورياً، والمساعد يجيب عن أسئلتك.', 'The calculator gives an instant estimate, and the assistant answers your questions.'], openCalc: ['افتح الحاسبة', 'Open the calculator'], read: ['اقرأ', 'Read'] },
  shop: { enter: ['ادخل المتجر', 'Enter the store'], soon: ['المتجر يفتح قريباً. حتى ذلك الحين، اطلب عرض سعر لأي منتج.', 'The store opens soon. Until then, request a quote for any product.'], featured: ['منتجات مختارة', 'Featured products'], inclVat: ['شامل الضريبة', 'incl. VAT'] },
  notFound: { code: ['ERROR 404 · CONTAINER NOT FOUND', 'ERROR 404 · CONTAINER NOT FOUND'], title: ['هذه الحاوية ضلّت طريقها', 'This container drifted off course'], lead: ['الصفحة التي طلبتها غير موجودة أو انتقلت. أما طلبك فهو في مكانه تماماً.', 'The page you asked for does not exist or has moved. Your order, though, is exactly where it should be.'], track: ['تتبّع طلبك', 'Track your order'], home: ['الرئيسية', 'Home'], rfq: ['اطلب عرض سعر', 'Request a quote'] },
  offline: { title: ['الموقع غير متاح حالياً', 'The site is not available right now'], lead: ['نعدّ شيئاً جديداً. عد قريباً.', 'We are preparing something new. Come back soon.'] },
} as const;

type Pair = readonly [string, string];
export function u(pair: Pair, lang: Lang): string { return lang === 'en' ? pair[1] : pair[0]; }
export const ui = UI;
export function dirOf(lang: Lang): 'rtl' | 'ltr' { return lang === 'en' ? 'ltr' : 'rtl'; }
export function href(lang: Lang, path = ''): string { return `/${lang}${path}`; }
