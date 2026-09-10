# Barrier EX

**Travel lighter. Go further.**

Travel money, your way. Clear prices, simple ordering and support that works for you.

An accessible holiday money website concept. Formerly AccessGo, ITER and KITE Travel Money.

## Brand

- Journey Blue: `#2457E6`
- Midnight Navy: `#10213A`
- Sunshine Yellow: `#FFD84D`
- Cloud: `#F4F7FC`
- White: `#FFFFFF`
- Typeface: self-hosted Atkinson Hyperlegible Next, weights 200–800.
- Values: independence, clarity, choice and inclusion.

## Website

This is a static HTML, CSS and JavaScript site. GitHub Pages serves the repository root. No build step or external font service is required.

The calculator is first on mobile and in the document reading order. The desktop travel photograph is hidden at widths of 900px and below. Text size, contrast, keyboard navigation and reduced-motion preferences are retained.

The `accessgo-` local storage preference keys are retained so existing visitors keep their accessibility settings after the rebrand.

## Prototype limits

Rates and delivery charges are illustrative. The website cannot accept payments. The travel helper uses preset demonstration responses, and live text support and BSL videos are planned. Travelex sponsorship is an example only and is not confirmed.

WHO population estimates are linked on the page. They are not customer numbers, and the groups overlap.

The requested domain is `barrierex.com`. Registration, ownership and connection must be confirmed before changing the live website address. No domain has been purchased or changed as part of this rebrand.

## Font licence

Atkinson Hyperlegible Next is distributed under the SIL Open Font License 1.1. See `font-license.txt`. The unmodified font is from the [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/atkinsonhyperlegiblenext).

## Language and plain English

UK English is the default. The globe menu also offers Spanish, French and Hebrew. Interface text, screen-reader labels, quote messages, help windows and preset chat replies use the selected language.

Hebrew uses right-to-left page layout. Currency codes and the GBP amount input remain easy to read. The language choice is saved in the visitor's browser under `gowithkite-language`; text-size and contrast settings keep their existing keys. All controls continue to work when browser storage is blocked.

`languages.js` contains the four local dictionaries. There is no third-party translation widget or location tracking. Changing language does not change the currencies offered, the illustrative rates, the UK nature of BSL support, or the prototype's no-payment status.

## Compact layout

The photo sits directly below the main message. Cards use their content height. The repeated text/BSL support card has been removed; Help links to the travel chat, and BSL remains in the header.

## Example comparisons

The quote button opens `results.html` with the amount, currency, delivery choice and language in its query string. The input is the total GBP budget: fees are deducted before conversion. The homepage shows Provider A's illustrative calculation; comparison offers may use different rates and fees.

The second page shows three explicitly fictional providers, fee-inclusive foreign amounts, sample ratings (not customer reviews), and fictional collection points. Offers can be sorted by amount or sample rating. Details explain the calculation; there are no purchase links, real branches, location tracking or live offers. Change your quote preserves the entered choices. All four languages, RTL, text size and contrast are supported on both pages.

Foreign amounts are rounded to minor currency units for illustration; real cash denomination requirements are not modelled.
