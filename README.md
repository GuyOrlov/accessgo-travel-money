# HasslePass — Currency Sorted.

Static GitHub Pages concept website at https://guyorlov.com/accessgo-travel-money/.

## September 2026 design

The supplied HasslePass image and partnership proposal inform the pale blue, navy and coral design. `index.html`, `hasslepass.css` and `hasslepass.js` implement the current eVoucher concept. The supplied image is `hasslepass-concept.jpg`.

The quote uses fixed illustrative rates, including GBP/USD 1.30, and an example zero provider fee. It accepts GBP 75–2500 with at most two decimals. The eVoucher modal is explicitly not valid; no payment, email, wallet or ATM integration occurs. Travelex is a proposed partner, not a confirmed service provider. Claims about global coverage, wallet compatibility and validity are identified as unconfirmed.

English, Spanish, French and Hebrew are supported. Hebrew uses RTL layout. Accessibility preferences retain the existing localStorage keys. Native dialogs support Escape and focus return. The helper runs locally with preset replies and does not transmit chat input. World clocks use browser Intl timezone handling and update every 30 seconds.

`results.html` preserves old links by redirecting to the current quote and retaining query parameters. `legal.html` retains the existing four-language notices and legacy CSS/JS dependencies; the old SEO injection no longer overrides its metadata. Legacy comparison code remains available in version history.

No build or dependency installation is needed. Preview with a static HTTP server. The font is self-hosted Atkinson Hyperlegible Next under the SIL Open Font License; see `font-license.txt`.
