const rates = {
  EUR: { rate: 1.15, symbol: "€", locale: "en-IE", name: "euros" },
  USD: { rate: 1.34, symbol: "$", locale: "en-US", name: "US dollars" },
  CAD: { rate: 1.84, symbol: "CA$", locale: "en-CA", name: "Canadian dollars" },
  AUD: { rate: 2.02, symbol: "A$", locale: "en-AU", name: "Australian dollars" },
  JPY: { rate: 198, symbol: "¥", locale: "ja-JP", name: "Japanese yen" }
};

const amountInput = document.querySelector("#pay-amount");
const currencySelect = document.querySelector("#receive-currency");
const receiveOutput = document.querySelector("#receive-amount");
const rateCopy = document.querySelector("#rate-copy");
const deliveryFeeOutput = document.querySelector("#delivery-fee");
const totalOutput = document.querySelector("#total-pay");
const amountError = document.querySelector("#amount-error");
const reviewButton = document.querySelector("#review-order");

function formatGBP(value) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);
}

function formatForeign(value, currency) {
  return new Intl.NumberFormat(rates[currency].locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2
  }).format(value);
}

function getQuote() {
  const amount = Number(amountInput.value);
  const currency = currencySelect.value;
  const valid = Number.isFinite(amount) && amount >= 75 && amount <= 2500;
  const delivery = document.querySelector('input[name="delivery"]:checked').value;
  const fee = delivery === "home" && amount < 500 ? 4.99 : 0;
  return { amount, currency, valid, delivery, fee, received: valid ? amount * rates[currency].rate : 0 };
}

function updateQuote() {
  const quote = getQuote();
  amountError.hidden = quote.valid;
  amountInput.setAttribute("aria-invalid", String(!quote.valid));
  reviewButton.disabled = !quote.valid;
  receiveOutput.textContent = quote.valid ? formatForeign(quote.received, quote.currency) : "—";
  rateCopy.textContent = `Example rate: £1 = ${formatForeign(rates[quote.currency].rate, quote.currency)}`;
  deliveryFeeOutput.textContent = quote.valid ? formatGBP(quote.fee) : "—";
  totalOutput.textContent = quote.valid ? formatGBP(quote.amount + quote.fee) : "—";
}

amountInput.addEventListener("input", updateQuote);
currencySelect.addEventListener("change", updateQuote);

document.querySelectorAll('input[name="delivery"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    document.querySelectorAll(".delivery-option").forEach((option) => option.classList.remove("is-selected"));
    radio.closest(".delivery-option").classList.add("is-selected");
    updateQuote();
  });
});

reviewButton.addEventListener("click", () => {
  const quote = getQuote();
  if (!quote.valid) return;
  document.querySelector("#modal-pay").textContent = formatGBP(quote.amount);
  document.querySelector("#modal-receive").textContent = formatForeign(quote.received, quote.currency);
  document.querySelector("#modal-delivery").textContent = quote.delivery === "home" ? "Home delivery" : "Collection";
  document.querySelector("#modal-total").textContent = formatGBP(quote.amount + quote.fee);
  document.querySelector("#review-modal").showModal();
});

document.querySelectorAll("[data-open-modal]").forEach((button) => {
  button.addEventListener("click", () => document.getElementById(button.dataset.openModal).showModal());
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

const textSizeButton = document.querySelector("#text-size");
const contrastButton = document.querySelector("#contrast");

function setPreference(className, active, button, onLabel, offLabel) {
  document.documentElement.classList.toggle(className, active);
  button.setAttribute("aria-pressed", String(active));
  button.setAttribute("aria-label", active ? onLabel : offLabel);
  localStorage.setItem(`accessgo-${className}`, String(active));
}

textSizeButton.addEventListener("click", () => {
  const active = !document.documentElement.classList.contains("text-large");
  setPreference("text-large", active, textSizeButton, "Return to standard text size", "Increase text size");
});

contrastButton.addEventListener("click", () => {
  const active = !document.documentElement.classList.contains("high-contrast");
  setPreference("high-contrast", active, contrastButton, "Turn high contrast off", "Turn high contrast on");
});

if (localStorage.getItem("accessgo-text-large") === "true") {
  setPreference("text-large", true, textSizeButton, "Return to standard text size", "Increase text size");
}

if (localStorage.getItem("accessgo-high-contrast") === "true") {
  setPreference("high-contrast", true, contrastButton, "Turn high contrast off", "Turn high contrast on");
}

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

mainNav.addEventListener("click", () => {
  mainNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
});

const chatLog = document.querySelector("#chat-log");
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");

const chatAnswers = {
  costs: "The rate and any delivery fee are shown before review. All figures on this prototype are examples, not live prices.",
  delivery: "Choose home delivery or collection. In this demonstration, delivery is free for orders of £500 or more and £4.99 below that amount.",
  bsl: "Select the BSL button for information about planned signed guidance. No live BSL service is connected to this prototype.",
  rate: "The calculator uses fixed demonstration rates. A future currency partner would provide the current rate.",
  default: "I can explain the example costs, delivery choices, accessibility controls or planned BSL support."
};

function addMessage(text, sender) {
  const message = document.createElement("div");
  message.className = `message ${sender === "user" ? "user-message" : "bot-message"}`;
  message.textContent = text;
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function replyFor(text) {
  const normal = text.toLowerCase();
  if (normal.includes("cost") || normal.includes("fee") || normal.includes("price")) return chatAnswers.costs;
  if (normal.includes("deliver") || normal.includes("collect")) return chatAnswers.delivery;
  if (normal.includes("bsl") || normal.includes("sign")) return chatAnswers.bsl;
  if (normal.includes("rate") || normal.includes("euro") || normal.includes("dollar")) return chatAnswers.rate;
  return chatAnswers.default;
}

document.querySelectorAll("[data-chat-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    addMessage(button.textContent.trim(), "user");
    window.setTimeout(() => addMessage(chatAnswers[button.dataset.chatAnswer], "bot"), 250);
  });
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = chatInput.value.trim();
  if (!question) return;
  addMessage(question, "user");
  chatInput.value = "";
  window.setTimeout(() => addMessage(replyFor(question), "bot"), 250);
});

updateQuote();
