# Smart Paste

Smart Paste is an experimental Chrome extension that matches text you explicitly
paste to supported fields in a web form. When you press paste, it splits the text
into candidate passages, reads the form's field labels and context, and inserts
only verified, confident matches. You can undo the result.

## Install

Smart Paste is currently distributed as an unpacked extension:

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select the repository folder.
5. Open Smart Paste settings, add a [TypeSafe](https://typesafe.ai) API key,
   enable matching, and save.

Reload any tabs that were open before installing or updating the extension.
Chrome internal pages, extension pages, and built-in PDF viewers do not allow
content scripts and are therefore unsupported.

## Use

1. Copy text from any source.
2. Focus a supported field in a web form.
3. Press `⌘V` on macOS or `Ctrl+V` on Windows and Linux.
4. Smart Paste fills fields only when it finds confident matches.

Use `⌘J` on macOS or `Ctrl+J` on Windows and Linux to show the toolbar. You can
also open it from the extension button. Smart Paste does not submit forms.

## Supported fields

Smart Paste supports standard visible text, email, telephone, URL, textarea, and basic
contenteditable fields in the top-level page. It can match up to eight fields in
the focused form, dialog, or fieldset while preserving fields that already contain
text.

Password, payment, verification-code, and credential-labelled fields are excluded.
Select menus, checkboxes, date and number inputs, iframe forms, shadow DOM fields,
and some rich-text editors are not currently supported.

## Data and privacy

When matching is enabled, Smart Paste sends the pasted text and limited form
context to [TypeSafe](https://typesafe.ai): the form heading, field labels and
types, and whether fields
are focused or already occupied. Existing field values are not sent.

The API key is stored in Chrome extension storage. Captured text is kept in
extension session storage and cleared when the browser session or extension
restarts. The configured API key is excluded from clipboard capture.

Matches are copied from exact offsets in the source text rather than generated.
The extension verifies proposed values before inserting them and leaves uncertain
fields untouched. Matching is heuristic, so results can vary by text, website, and
model response. Review inserted values before submitting a form.

## Development

Requires Node.js 22 or newer.

```sh
npm install
npm test
```

The automated suite covers matching, exact source spans, protected fields,
settings, paste and undo behavior, request cancellation, and reduced motion.
Network transport and model responses are mocked in tests.

## Project structure

- `content.js` mounts the toolbar and coordinates paste behavior.
- `worker.js` manages settings, requests, and session state.
- `core.js` builds and verifies source candidates.
- `adapters.js` discovers and updates supported form fields.
- `shared-ui.js` renders the toolbar and settings interface.
- `tests/` contains the automated test suite.

Smart Paste is experimental software and is not affiliated with the websites on
which it is used.

## License

Smart Paste is available under the [MIT License](LICENSE). The bundled Inter font
is distributed separately under the [SIL Open Font License](assets/OFL.txt).
