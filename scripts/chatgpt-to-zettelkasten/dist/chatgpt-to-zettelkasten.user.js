// ==UserScript==
// @name        ChatGPT to Zettelkasten
// @namespace   https://github.com/a-inacio/violentmonkey
// @match       https://chatgpt.com/*
// @grant       none
// @version     1.0.0
// @author      António Inácio
// @description Generate a prompt to request a zettelkasten summary of the learnings
// @updateURL   https://github.com/a-inacio/violentmonkey/releases/latest/download/chatgpt-to-zettelkasten.user.js
// @downloadURL https://github.com/a-inacio/violentmonkey/releases/latest/download/chatgpt-to-zettelkasten.user.js
// ==/UserScript==

(function () {
  'use strict';

    const currentUri = window.location.href;
    const promptText = `
Write a zettlekasten summary of the learnings on this whole chat, with template, as markdown:
---
- **Tags:** e.g. zettlekasten
- **Topic:** a meaningfull title

---
## Key Insights

-

### Failed attempts

- summary of issues and abandoned attempts, remove section if none

### Takeway

- what needs to be done with this learnings in mind, remove section if not relevant

## Action Items

- [ ] open points requiring followup, remove section if not relevant

## References

- [ChatGPT](${currentUri})
- quoted externals links if any, remove if none or not relevant to the final solution
`;

  // ms per character for textarea/input typing. 0 is fastest (uses setTimeout with 0).
  // Increase if you want a visible typewriter effect.
  const typingDelay = 2;

  function dispatchInput(el) {
    // React listens for 'input' events — make sure it's dispatched
    el.dispatchEvent(new InputEvent('input', { bubbles: true }));
  }

  function escapeHtml(str) {
    return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }

  function placeCaretAtEnd(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // Per-char typer for value-based inputs (textarea/input)
  function typeIntoValueEl(el, text, delay) {
    let i = 0;
    el.focus();
    el.value = '';
    function step() {
      if (i >= text.length) return;
      el.value += text[i++];
      dispatchInput(el);
      setTimeout(step, delay);
    }
    step();
  }

  // Instant-safe insert for contentEditable: preserve newlines -> <br>
  function insertIntoContentEditable(el, text) {
    el.focus();
    // Convert each newline to <br>, escape any HTML in lines
    // Keep trailing newlines as trailing <br>
    const parts = text.split('\n').map(escapeHtml);
    const html = parts.join('<p>');
    el.innerHTML = html;
    placeCaretAtEnd(el);
    dispatchInput(el);
  }

  function insertPrompt() {
    const el = document.activeElement;
    if (!el) {
      console.log('No focused element.');
      return;
    }
    const tag = el.tagName || '';
    if (tag === 'TEXTAREA' || tag === 'INPUT') {
      typeIntoValueEl(el, promptText, Math.max(0, typingDelay));
    } else if (el.isContentEditable) {
      insertIntoContentEditable(el, promptText);
    } else {
      console.log('Focused element is not editable. Click into the input box first.');
    }
  }

  // Hotkey: Cmd (Mac) or Ctrl (Win/Linux) + Shift + Z
  document.addEventListener('keydown', function (e) {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    if (((isMac && e.metaKey) || (!isMac && e.ctrlKey)) && e.shiftKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      insertPrompt();
    }
  });
})();