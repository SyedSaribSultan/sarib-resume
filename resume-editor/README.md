# Resume Editor

Tiny Tkinter GUI to fill in the resume's content. No dependencies — pure Python 3 stdlib.

## Run

```bash
python3 resume-editor/editor.py
```

(macOS ships Python 3 with Tkinter. If `tkinter` is missing on your system: `brew install python-tk`.)

## How it works

```
seed_data.json  →  (GUI edits)  →  resume_data.json  +  src/app/components/resume-data.ts
```

- **First launch** loads `seed_data.json` (your current resume content).
- You edit across tabs: **Profile · Contacts · Experience · Skills · Volunteering · Education**.
- **Save → resume-data.ts** writes two files:
  - `resume_data.json` — the working data (loaded next time instead of the seed).
  - `../src/app/components/resume-data.ts` — the actual file the React app imports.
- Reload the dev app (`npm run dev`) to see changes.

## Tips

- **id** auto-fills from the title/label if you leave it blank. Keep ids stable (used as React keys).
- **href** optional — leave blank for no link. Use `mailto:` / `tel:` prefixes for email/phone contacts.
- **Experience / Volunteering / Education** entries support:
  - **bullets** — one bullet per line.
  - **sections** — one per line, format `Label | the text` (e.g. `Leadership | Owned the roadmap`). These render as the bold `Label:` paragraphs.
- Use **▲ / ▼** to reorder, **Delete** to remove, **+ Add** to append.
- Empty optional fields are dropped from the output automatically.

## Reset

Delete `resume_data.json` to start over from `seed_data.json`.
