const rates = {
  EUR: { rate: 1.15 },
  USD: { rate: 1.34 },
  CAD: { rate: 1.84 },
  AUD: { rate: 2.02 },
  JPY: { rate: 198 }
};

const languages = window.KITE_LANGUAGES;
const languageChoice = document.querySelector("#site-language");
const amountInput = document.querySelector("#pay-amount");
const currencySelect = document.querySelector("#receive-currency");
const receiveOutput = document.querySelector("#receive-amount");
const rateCopy = document.querySelector("#rate-copy");
const deliveryFeeOutput = document.querySelector("#delivery-fee");
const totalOutput = document.querySelector("#total-pay");
const amountError = document.querySelector("#amount-error");
const reviewButton = document.querySelector("#review-order");
const textSizeButton = document.querySelector("#text-size");
const contrastButton = document.querySelector("#contrast");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
const chatLog = document.querySelector("#chat-log");
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");

const numberFormats = new Map();
let activeLanguage = "en-GB";

function readPreference(key) {
  try { return localStorage.getItem(key); }
  catch { return null; }
}

function savePreference(key, value) {
  try { localStorage.setItem(key, value); }
  catch { /* The controls still work when browser storage is unavailable. */ }
}

function formatMoney(value, currency) {
  const key = activeLanguage + ":" + currency;
  if (!numberFormats.has(key)) {
    numberFormats.set(key, new Intl.NumberFormat(activeLanguage, {
      style: "currency",
      currency,
      minimumFractionDigits: currency === "JPY" ? 0 : 2,
      maximumFractionDigits: currency === "JPY" ? 0 : 2
    }));
  }
  return numberFormats.get(key).format(value);
}

function formatGBP(value) { return formatMoney(value, "GBP"); }
function formatForeign(value, currency) { return formatMoney(value, currency); }

function t(key, values = {}) {
  const text = languages[activeLanguage].strings[key] ?? languages["en-GB"].strings[key] ?? key;
  const amounts = { min: 75, max: 2500, pound: 1, threshold: 500, fee: 4.99 };
  return text.replace(/\{([a-zA-Z]+)\}/g, (match, name) => {
    if (Object.prototype.hasOwnProperty.call(values, name)) return String(values[name]);
    if (Object.prototype.hasOwnProperty.call(amounts, name)) return formatGBP(amounts[name]);
    return match;
  });
}

function getQuote() {
  const amount = Number(amountInput.value);
  const currency = currencySelect.value;
  const valid = Number.isFinite(amount) && amount >= 75 && amount <= 2500
    && Math.abs(amount * 100 - Math.round(amount * 100)) < 0.000001;
  const delivery = document.querySelector('input[name="delivery"]:checked').value;
  const fee = delivery === "home" && amount < 500 ? 4.99 : 0;
  return { amount, currency, valid, delivery, fee, received: valid ? (amount - fee) * rates[currency].rate : 0 };
}

function updateQuote() {
  if (!amountInput) return;
  const quote = getQuote();
  amountError.hidden = quote.valid;
  amountError.textContent = t("amountError");
  amountInput.setAttribute("aria-invalid", String(!quote.valid));
  if (quote.valid) amountInput.removeAttribute("aria-describedby");
  else amountInput.setAttribute("aria-describedby", "amount-error");
  reviewButton.disabled = !quote.valid;
  receiveOutput.textContent = quote.valid ? formatForeign(quote.received, quote.currency) : "—";
  rateCopy.textContent = t("exampleRate", { rate: formatForeign(rates[quote.currency].rate, quote.currency) });
  deliveryFeeOutput.textContent = quote.valid ? formatGBP(quote.fee) : "—";
  totalOutput.textContent = quote.valid ? formatGBP(quote.amount) : "—";
}

function updatePreferenceLabels() {
  const textLarge = document.documentElement.classList.contains("text-large");
  const contrastHigh = document.documentElement.classList.contains("high-contrast");
  textSizeButton.setAttribute("aria-pressed", String(textLarge));
  textSizeButton.setAttribute("aria-label", t(textLarge ? "textStandard" : "textLarger"));
  contrastButton.setAttribute("aria-pressed", String(contrastHigh));
  contrastButton.setAttribute("aria-label", t(contrastHigh ? "contrastOff" : "contrastOn"));
}

function ensureSeoMeta(attribute, key, content) {
  let meta = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function applySeoCopy() {
  const oldSeoSection = document.querySelector("#seo-travel-money");
  if (activeLanguage !== "en-GB") {
    oldSeoSection?.remove();
    return;
  }

  const title = "Compare Travel Money & Exchange Rates UK | BarrierEx";
  const description = "Compare travel money exchange rates, fees, home delivery and click & collect options in a clear, accessible way. BarrierEx is designed for UK travellers, including Deaf and disabled people.";
  const canonicalUrl = "https://guyorlov.com/accessgo-travel-money/";

  document.title = title;
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.setAttribute("content", description);

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", canonicalUrl);

  ensureSeoMeta("property", "og:title", title);
  ensureSeoMeta("property", "og:description", description);
  ensureSeoMeta("property", "og:type", "website");
  ensureSeoMeta("property", "og:url", canonicalUrl);
  ensureSeoMeta("name", "twitter:card", "summary_large_image");
  ensureSeoMeta("name", "twitter:title", title);
  ensureSeoMeta("name", "twitter:description", description);

  const setText = (selector, text) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
  };

  setText("#quote .section-label", "Compare example travel money rates");
  setText("#quote-heading", "Compare travel money and exchange rates");
  setText(".hero-panel .eyebrow", "Accessible travel money for UK travellers");
  setText(".hero-panel .hero-intro", "Compare exchange rates, fees, home delivery and collection with clear, simple information.");
  setText(".benefits article:nth-child(1) h2", "Clear exchange rates and fees");
  setText(".benefits article:nth-child(1) p", "See example exchange rates, fees and total costs before you decide.");
  setText(".benefits article:nth-child(2) h2", "Simple travel money comparison");
  setText(".benefits article:nth-child(2) p", "Easy steps to compare foreign currency options from quote to review.");
  setText(".benefits article:nth-child(3) h2", "Accessible travel money support");
  setText(".benefits article:nth-child(3) p", "Planned BSL, text and chat support designed around different communication needs.");
  setText("#inclusion-heading", "Travel money designed with Deaf and disabled travellers in mind.");
  setText(".inclusion-section .section-heading > p:last-child", "Everyone deserves clear travel money information, accessible support and more choice when planning a holiday.");
  setText("#how-it-works .steps li:nth-child(1) h3", "Choose your foreign currency");
  setText("#how-it-works .steps li:nth-child(1) p", "Choose euros, US dollars or another available foreign currency and enter your travel money budget.");
  setText("#how-it-works .steps li:nth-child(3) h3", "Check the exchange rate, fees and total cost");
  setText("#how-it-works .steps li:nth-child(3) p", "Review the example exchange rate, delivery option and total cost before continuing. You cannot pay in this demo.");
  setText('.footer-directory a[href="index.html?delivery=home#quote"]', "Foreign currency home delivery");
  setText('.footer-directory a[href="index.html?delivery=collection#quote"]', "Click & collect travel money");
  setText('.product-grid', document.querySelector('.product-grid')?.textContent || "");
  const productGrid = document.querySelector('.product-grid');
  if (productGrid) productGrid.setAttribute('aria-label', 'Accessible UK travel money comparison');

  if (!oldSeoSection) {
    const howSection = document.querySelector("#how-it-works");
    if (howSection) {
      const seoSection = document.createElement("section");
      seoSection.id = "seo-travel-money";
      seoSection.className = "values-section";
      seoSection.setAttribute("aria-labelledby", "seo-travel-money-heading");
      seoSection.innerHTML = `
        <div class="section-heading">
          <p class="eyebrow">Compare foreign currency clearly</p>
          <h2 id="seo-travel-money-heading">Accessible travel money comparison for UK travellers</h2>
          <p>BarrierEx is an accessible travel money comparison concept for people looking to buy euros, buy US dollars, compare foreign currency exchange rates and understand home delivery or click & collect travel money options.</p>
          <p>It is designed with clear language and planned BSL, text and chat support for Deaf and disabled travellers. This demo uses example rates only and does not take payments.</p>
        </div>`;
      howSection.insertAdjacentElement("afterend", seoSection);
    }
  }

  let structuredData = document.querySelector("#barrierex-seo-schema");
  if (!structuredData) {
    structuredData = document.createElement("script");
    structuredData.type = "application/ld+json";
    structuredData.id = "barrierex-seo-schema";
    document.head.appendChild(structuredData);
  }
  structuredData.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BarrierEx",
    url: canonicalUrl,
    description,
    inLanguage: "en-GB",
    about: [
      "travel money comparison",
      "foreign currency exchange rates",
      "accessible travel money",
      "BSL travel money support"
    ]
  });
}

function applyLanguage(locale, save = true) {
  activeLanguage = Object.prototype.hasOwnProperty.call(languages, locale) ? locale : "en-GB";
  document.documentElement.lang = activeLanguage;
  document.documentElement.dir = languages[activeLanguage].dir;
  languageChoice.value = activeLanguage;

  const attributes = [
    ["data-i18n", null],
    ["data-i18n-aria-label", "aria-label"],
    ["data-i18n-placeholder", "placeholder"],
    ["data-i18n-alt", "alt"],
    ["data-i18n-content", "content"]
  ];
  for (const [source, target] of attributes) {
    document.querySelectorAll("[" + source + "]").forEach((element) => {
      const text = t(element.getAttribute(source));
      if (target) element.setAttribute(target, text);
      else element.textContent = text;
    });
  }
  updatePreferenceLabels();
  updateQuote();
  if (window.renderResults) window.renderResults();
  applySeoCopy();
  languageChoice.disabled = false;
  if (save) savePreference("gowithkite-language", activeLanguage);
}

function setPreference(className, active) {
  document.documentElement.classList.toggle(className, active);
  // Retain these keys so returning visitors keep their existing settings.
  savePreference("accessgo-" + className, String(active));
  updatePreferenceLabels();
}

function addMessage(text, sender, translationKey) {
  const message = document.createElement("div");
  message.className = "message " + (sender === "user" ? "user-message" : "bot-message");
  message.dir = "auto";
  message.textContent = text;
  if (translationKey) message.setAttribute("data-i18n", translationKey);
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function replyFor(text) {
  const normal = text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const replies = [
    ["replyCosts", ["cost", "fee", "price", "precio", "coste", "tarifa", "prix", "frais", "cout", "מחיר", "עלות", "עלויות", "עמלה"]],
    ["replyDelivery", ["deliver", "collect", "envio", "entrega", "recog", "livraison", "livrer", "retrait", "משלוח", "איסוף"]],
    ["replyBsl", ["bsl", "sign", "signe", "sena", "סימנים"]],
    ["replyRate", ["rate", "euro", "dollar", "cambio", "taux", "change", "שער", "אירו", "יורו", "דולר"]]
  ];
  for (const [key, words] of replies) {
    if (words.some((word) => normal.includes(word))) return key;
  }
  return "replyDefault";
}

amountInput?.addEventListener("input", updateQuote);
currencySelect?.addEventListener("change", updateQuote);
languageChoice.addEventListener("change", () => applyLanguage(languageChoice.value));

document.querySelectorAll('input[name="delivery"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    document.querySelectorAll(".delivery-option").forEach((option) => option.classList.remove("is-selected"));
    radio.closest(".delivery-option").classList.add("is-selected");
    updateQuote();
  });
});

reviewButton?.addEventListener("click", () => {
  const quote = getQuote();
  if (!quote.valid) return;
  const params = new URLSearchParams({ amount: quote.amount.toFixed(2), currency: quote.currency, delivery: quote.delivery, lang: activeLanguage });
  window.location.href = "results.html?" + params.toString();
});

document.querySelectorAll("[data-open-modal]").forEach((button) => {
  button.addEventListener("click", () => document.getElementById(button.dataset.openModal).showModal());
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

textSizeButton.addEventListener("click", () => {
  setPreference("text-large", !document.documentElement.classList.contains("text-large"));
});
contrastButton.addEventListener("click", () => {
  setPreference("high-contrast", !document.documentElement.classList.contains("high-contrast"));
});

menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
mainNav.addEventListener("click", () => {
  mainNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
});

document.querySelectorAll("[data-chat-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    addMessage(button.textContent.trim(), "user", button.getAttribute("data-i18n"));
    const key = button.dataset.chatAnswer === "costs" ? "replyCosts" : "replyDelivery";
    window.setTimeout(() => addMessage(t(key), "bot", key), 250);
  });
});

chatForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = chatInput.value.trim();
  if (!question) return;
  addMessage(question, "user");
  chatInput.value = "";
  const key = replyFor(question);
  window.setTimeout(() => addMessage(t(key), "bot", key), 250);
});

for (const preference of ["text-large", "high-contrast"]) {
  if (readPreference("accessgo-" + preference) === "true") {
    document.documentElement.classList.add(preference);
  }
}
const quoteParams = new URLSearchParams(window.location.search);
if (amountInput) {
  const restoredAmount = Number(quoteParams.get("amount"));
  if (quoteParams.has("amount") && Number.isFinite(restoredAmount) && restoredAmount >= 75 && restoredAmount <= 2500) amountInput.value = restoredAmount.toFixed(2);
  const restoredCurrency = quoteParams.get("currency");
  if (Object.prototype.hasOwnProperty.call(rates, restoredCurrency)) currencySelect.value = restoredCurrency;
  const restoredDelivery = quoteParams.get("delivery");
  if (restoredDelivery === "home" || restoredDelivery === "collection") {
    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
      radio.checked = radio.value === restoredDelivery;
      radio.closest(".delivery-option").classList.toggle("is-selected", radio.checked);
    });
  }
}
applyLanguage(quoteParams.get("lang") || readPreference("gowithkite-language") || "en-GB", false);
