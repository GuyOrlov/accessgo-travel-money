// Every provider and score is fictional. No live rates, reviews or location lookup.
(() => {
  const params = new URLSearchParams(window.location.search);
  const amount = Number(params.get("amount"));
  const currency = params.get("currency");
  const delivery = params.get("delivery");
  const valid = Number.isFinite(amount) && amount >= 75 && amount <= 2500
    && Math.abs(amount * 100 - Math.round(amount * 100)) < 0.000001
    && Object.prototype.hasOwnProperty.call(rates, currency)
    && ["home", "collection"].includes(delivery);
  const examples = [
    { name: "Demo Provider A", multiplier: 1, homeFee: amount < 500 ? 4.99 : 0, rating: 4.6, location: "collectionA" },
    { name: "Demo Provider B", multiplier: 1.006, homeFee: 3.99, rating: 4.9, location: "collectionB" },
    { name: "Demo Provider C", multiplier: 0.99, homeFee: 0, rating: 4.3, location: "collectionC" }
  ];
  const sort = document.querySelector("#sort-offers");
  const offers = document.querySelector("#offers");
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function metric(label, value, prominent = false) {
    const cell = element("div", prominent ? "offer-metric offer-amount" : "offer-metric");
    cell.append(element("dt", "", t(label)), element("dd", "", value));
    return cell;
  }
  function calculate(provider) {
    const fee = delivery === "home" ? provider.homeFee : 0;
    const rate = Number((rates[currency].rate * provider.multiplier).toFixed(4));
    const units = currency === "JPY" ? 1 : 100;
    const received = Math.round(((amount - fee) * rate + Number.EPSILON) * units) / units;
    return { ...provider, fee, rate, received };
  }
  window.renderResults = () => {
    const editParams = new URLSearchParams({ lang: activeLanguage });
    if (valid) {
      editParams.set("amount", amount.toFixed(2));
      editParams.set("currency", currency);
      editParams.set("delivery", delivery);
    }
    const editLink = "index.html?" + editParams.toString() + "#quote";
    document.querySelector("#edit-quote").href = editLink;
    document.querySelectorAll('a[href="index.html#quote"]').forEach(link => { link.href = editLink; link.dataset.quoteLink = "true"; });
    document.querySelectorAll("[data-quote-link]").forEach(link => { link.href = editLink; });
    document.querySelector("#results-error").hidden = valid;
    document.querySelector("#results-content").hidden = !valid;
    document.querySelector("#results-heading").textContent = valid
      ? t("resultsHeading", { budget: formatGBP(amount) }) : t("reviewOrder");
    if (!valid) return;
    const items = examples.map(calculate);
    const best = Math.max(...items.map(item => item.received));
    items.sort((a, b) => sort.value === "rating" ? b.rating - a.rating || b.received - a.received : b.received - a.received);
    document.querySelector("#results-count").textContent = t("resultsCount", {
      count: items.length, currency, method: t(delivery === "home" ? "homeDelivery" : "collection")
    });
    offers.replaceChildren();
    for (const item of items) {
      const card = element("article", "offer-card" + (item.received === best ? " best-offer" : ""));
      const heading = element("div", "offer-provider");
      heading.append(element("span", "offer-caption", t("fictionalProvider")), element("h2", "", item.name));
      if (item.received === best) heading.append(element("span", "best-badge", t("bestAmount")));
      const numbers = element("dl", "offer-numbers");
      const rate = new Intl.NumberFormat(activeLanguage, { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(item.rate);
      numbers.append(metric("youReceive", formatMoney(item.received, currency), true),
        metric("rateLabel", rate + " " + currency + " / GBP"), metric("feeLabel", formatGBP(item.fee)));
      const service = element("div", "offer-service");
      service.append(element("strong", "", t(delivery === "home" ? "homeDelivery" : "collection")),
        element("p", "", t(delivery === "home" ? "homeNote" : item.location)));
      const rating = element("div", "offer-rating");
      rating.append(element("span", "offer-caption", t("ratingLabel")));
      const score = element("strong", "", new Intl.NumberFormat(activeLanguage, { minimumFractionDigits: 1 }).format(item.rating) + " / 5");
      score.dir = "ltr";
      rating.append(score, element("small", "", t("ratingNote")));
      const details = element("details", "offer-details");
      details.append(element("summary", "", t("exampleDetails")),
        element("h3", "", t("calcLabel")),
        element("p", "", t("calcText", { budget: formatGBP(amount), fee: formatGBP(item.fee), rate, cash: formatMoney(item.received, currency) })));
      if (delivery === "collection") details.append(element("h3", "", t("locationLabel")),
        element("p", "", t(item.location)), element("p", "", t("locationNote")));
      details.append(element("p", "", t("demoWarning")));
      card.append(heading, numbers, service, rating, details);
      offers.append(card);
    }
  };
  sort.addEventListener("change", window.renderResults);
  window.renderResults();
})();
