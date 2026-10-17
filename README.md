# Medium Free Only

A Chromium browser extension that hides **member-only** (paid) stories on Medium, so story listings only show what you can read for free.

<p align="center">
  <img src="icons/icon128.png" alt="Extension icon" width="96" />
</p>

## Features

- Hides story cards marked as *Member-only* in Medium's feed, search results, profiles and lists.
- Turn it on or off with a switch in the popup, without reloading the page.
- The setting is saved in `chrome.storage.sync`, so it applies to every open tab and syncs across your devices.
- Works with infinite scroll: stories loaded later are filtered too.
- UI in English and Spanish (follows the browser language).
- The popup follows the system light or dark theme.
- No tracking and no network requests. The only permission it asks for is `storage`.

## Installation

The extension is not published in any store yet, so you install it in developer mode:

1. Download or clone this repository.
2. Open `chrome://extensions` (or `edge://extensions`, `brave://extensions`, etc.).
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the project folder.
5. Pin the icon to the toolbar if you want the switch close at hand.

## Usage

1. Go to [medium.com](https://medium.com).
2. Paid stories are hidden automatically (the filter is on by default).
3. To see every story again, open the extension popup and turn off **Hide paid stories**.

## How it works

The content script (`content.js`) and the stylesheet (`styles.css`) are injected into `medium.com` and its subdomains as soon as the page starts loading (`document_start`).

1. **Turning the filter on.** `content.js` reads the `activo` setting (default `true`) and adds or removes the `solo-gratis` class on `<html>`. It also listens to `chrome.storage.onChanged`, so changes to the switch take effect right away.
2. **Hiding with CSS.** `styles.css` uses `:has()` to hide any `article[data-testid="post-preview"]` that contains a button whose `aria-label` includes *Member-only*. Paid stories never appear, not even briefly.
3. **Hiding the wrapper.** Hiding only the `<article>` leaves gaps and empty dividers behind. To avoid this, `content.js` walks up to 4 levels from each paid story to the element that wraps it (stopping before it would include other stories) and marks it with `data-msg-oculta`, which the CSS also hides.
4. **Dynamic content.** A `MutationObserver` watches the DOM and checks new cards as they appear, with a 120 ms debounce so it doesn't slow the page down. Cards already checked are marked with `data-msg-pago` so they are not processed twice.
5. **Infinite scroll.** While the filter is on, `<html>` gets `min-height: 150vh`, so the page stays scrollable and Medium keeps loading more stories even when many have been hidden.

## Project structure

```
FreemiumMedium/
├── manifest.json        # Manifest (Manifest V3)
├── content.js           # Detects and marks paid stories
├── styles.css           # Rules that hide the marked stories
├── popup.html           # Popup UI
├── popup.css            # Popup styles (light / dark)
├── popup.js             # Switch logic and translations
├── icons/               # 16, 32, 48 and 128 px icons
└── _locales/
    ├── en/messages.json # English strings (default language)
    └── es/messages.json # Spanish strings
```

## Adding a language

1. Create `_locales/<code>/messages.json` (for example `_locales/fr/messages.json`).
2. Copy the keys from `_locales/en/messages.json` (`extName`, `extDescription`, `toggleLabel`, `statusOn`, `statusOff`) and translate them.
3. Reload the extension from `chrome://extensions`.

## Limitations

- Detection relies on Medium's current HTML (`data-testid="post-preview"` and the *Member-only* `aria-label`). If Medium changes its markup, the selectors in `content.js` and `styles.css` will need updating.
- It only filters story **listings**. If you open a link to a paid story directly, the page shows as usual.
- Designed for Chromium-based browsers. It requires support for the CSS `:has()` selector.
