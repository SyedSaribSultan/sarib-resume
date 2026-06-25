#!/usr/bin/env python3
"""
Resume data editor — a tiny Tkinter GUI that edits the resume's content and
regenerates src/app/components/resume-data.ts.

Data flow:
    seed_data.json  (first-run bootstrap)
        -> resume_data.json  (the working file the GUI loads/saves)
        -> resume-data.ts    (generated; what the React app actually imports)

No dependencies beyond the Python 3 standard library.

Run:  python3 editor.py
"""

import json
import re
import sys
import tkinter as tk
from pathlib import Path
from tkinter import messagebox, ttk

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

HERE = Path(__file__).resolve().parent
PROJECT_ROOT = HERE.parent
SEED_JSON = HERE / "seed_data.json"
WORKING_JSON = HERE / "resume_data.json"
TS_OUTPUT = PROJECT_ROOT / "src" / "app" / "components" / "resume-data.ts"

# ---------------------------------------------------------------------------
# Load / save data
# ---------------------------------------------------------------------------


def load_data() -> dict:
    """Load the working JSON, bootstrapping from the seed on first run."""
    src = WORKING_JSON if WORKING_JSON.exists() else SEED_JSON
    with open(src, "r", encoding="utf-8") as f:
        return json.load(f)


def save_working(data: dict) -> None:
    with open(WORKING_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def slugify(text: str) -> str:
    """Make a stable, kebab-case id from a title."""
    text = (text or "").strip().lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-") or "item"


def clean(value):
    """Trim strings; turn empty strings into None so optional fields drop out."""
    if isinstance(value, str):
        value = value.strip()
        return value or None
    return value


# ---------------------------------------------------------------------------
# TypeScript code generation
# ---------------------------------------------------------------------------

TS_HEADER = """export interface LabeledBullet {
  label: string;
  text: string;
}

export interface Role {
  label: string;
  text: string;
  description?: string;
}

export interface ResumeEntry {
  id: string;
  period: string;
  title: string;
  subtitle?: string;
  meta?: string;
  description?: string;
  bullets?: string[];
  sections?: LabeledBullet[];
  roles?: Role[];
  href?: string;
  tag?: string;
}

export interface LabeledLink {
  id: string;
  label: string;
  value: string;
  href?: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  value: string;
}
"""

# Field order for ResumeEntry output (matches the original file's style).
ENTRY_FIELD_ORDER = [
    "id",
    "period",
    "title",
    "subtitle",
    "href",
    "meta",
    "tag",
    "description",
    "bullets",
    "sections",
    "roles",
]


def ts_string(value: str) -> str:
    """Emit a single-quoted TS string literal, escaping as needed.

    Switches to double quotes automatically when the value contains a single
    quote/apostrophe (e.g. "company's"), matching the original file's style and
    avoiding ugly backslash escapes.
    """
    if "'" in value and '"' not in value:
        return '"' + value.replace("\\", "\\\\") + '"'
    escaped = value.replace("\\", "\\\\").replace("'", "\\'")
    return "'" + escaped + "'"


def emit_entry(entry: dict, indent: str = "  ") -> str:
    """Render one ResumeEntry object literal."""
    inner = indent + "  "
    lines = [indent + "{"]
    for key in ENTRY_FIELD_ORDER:
        if key not in entry:
            continue
        val = entry[key]
        if val is None:
            continue
        if key == "bullets":
            if not val:
                continue
            items = ",\n".join(inner + "  " + ts_string(b) for b in val)
            lines.append(f"{inner}bullets: [\n{items},\n{inner}],")
        elif key == "sections":
            if not val:
                continue
            sec_lines = []
            for sec in val:
                sec_lines.append(
                    f"{inner}  {{ label: {ts_string(sec['label'])}, "
                    f"text: {ts_string(sec['text'])} }}"
                )
            joined = ",\n".join(sec_lines)
            lines.append(f"{inner}sections: [\n{joined},\n{inner}],")
        elif key == "roles":
            if not val:
                continue
            role_lines = []
            for r in val:
                fields = [
                    f"{inner}    label: {ts_string(r['label'])},",
                    f"{inner}    text: {ts_string(r['text'])},",
                ]
                desc = clean(r.get("description"))
                if desc:
                    fields.append(f"{inner}    description: {ts_string(desc)},")
                role_lines.append(
                    f"{inner}  {{\n" + "\n".join(fields) + f"\n{inner}  }}"
                )
            joined = ",\n".join(role_lines)
            lines.append(f"{inner}roles: [\n{joined},\n{inner}],")
        else:
            lines.append(f"{inner}{key}: {ts_string(str(val))},")
    lines.append(indent + "}")
    return "\n".join(lines)


def emit_entry_array(name: str, ts_type: str, entries: list) -> str:
    if not entries:
        return f"export const {name}: {ts_type}[] = [];\n"
    body = ",\n".join(emit_entry(e) for e in entries)
    return f"export const {name}: {ts_type}[] = [\n{body},\n];\n"


def emit_profile(profile: dict) -> str:
    fields = ["name", "title", "location", "site", "siteHref", "about"]
    lines = ["export const profile = {"]
    for key in fields:
        val = profile.get(key, "")
        if key == "about":
            # Keep about on its own indented line like the original.
            lines.append(f"  about:\n    {ts_string(val)},")
        else:
            lines.append(f"  {key}: {ts_string(val)},")
    lines.append("};")
    return "\n".join(lines) + "\n"


def emit_labeled_links(contacts: list) -> str:
    if not contacts:
        return "export const contacts: LabeledLink[] = [];\n"
    rows = []
    for c in contacts:
        parts = [
            f"id: {ts_string(c['id'])}",
            f"label: {ts_string(c['label'])}",
            f"value: {ts_string(c['value'])}",
        ]
        if clean(c.get("href")):
            parts.append(f"href: {ts_string(c['href'])}")
        rows.append("  { " + ", ".join(parts) + " }")
    return "export const contacts: LabeledLink[] = [\n" + ",\n".join(rows) + ",\n];\n"


def emit_skills(skills: list) -> str:
    if not skills:
        return "export const skills: SkillGroup[] = [];\n"
    rows = []
    for s in skills:
        rows.append(
            f"  {{\n    id: {ts_string(s['id'])},\n"
            f"    label: {ts_string(s['label'])},\n"
            f"    value: {ts_string(s['value'])},\n  }}"
        )
    return "export const skills: SkillGroup[] = [\n" + ",\n".join(rows) + ",\n];\n"


def generate_ts(data: dict) -> str:
    parts = [
        TS_HEADER,
        emit_profile(data["profile"]),
        emit_labeled_links(data["contacts"]),
        emit_entry_array("experience", "ResumeEntry", data["experience"]),
        emit_skills(data["skills"]),
        emit_entry_array("volunteering", "ResumeEntry", data["volunteering"]),
        emit_entry_array("education", "ResumeEntry", data["education"]),
    ]
    return "\n".join(parts)


# ---------------------------------------------------------------------------
# GUI
# ---------------------------------------------------------------------------


class ScrollFrame(ttk.Frame):
    """A vertically scrollable frame (canvas + inner frame)."""

    def __init__(self, parent):
        super().__init__(parent)
        self.canvas = tk.Canvas(self, highlightthickness=0)
        vbar = ttk.Scrollbar(self, orient="vertical", command=self.canvas.yview)
        self.body = ttk.Frame(self.canvas)
        self.body.bind(
            "<Configure>",
            lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all")),
        )
        self.win = self.canvas.create_window((0, 0), window=self.body, anchor="nw")
        self.canvas.bind(
            "<Configure>", lambda e: self.canvas.itemconfig(self.win, width=e.width)
        )
        self.canvas.configure(yscrollcommand=vbar.set)
        self.canvas.pack(side="left", fill="both", expand=True)
        vbar.pack(side="right", fill="y")
        # Mouse-wheel scrolling (cross-platform).
        self.canvas.bind_all("<MouseWheel>", self._on_wheel)
        self.canvas.bind_all("<Button-4>", self._on_wheel)
        self.canvas.bind_all("<Button-5>", self._on_wheel)

    def _on_wheel(self, event):
        if event.num == 4:
            delta = -1
        elif event.num == 5:
            delta = 1
        else:
            delta = -1 if event.delta > 0 else 1
        self.canvas.yview_scroll(delta, "units")


def labeled_entry(parent, label, value="", width=60):
    row = ttk.Frame(parent)
    row.pack(fill="x", pady=2)
    ttk.Label(row, text=label, width=12, anchor="w").pack(side="left")
    var = tk.StringVar(value=value or "")
    ent = ttk.Entry(row, textvariable=var, width=width)
    ent.pack(side="left", fill="x", expand=True)
    return var


def labeled_text(parent, label, value="", height=4):
    row = ttk.Frame(parent)
    row.pack(fill="x", pady=2)
    ttk.Label(row, text=label, width=12, anchor="nw").pack(side="left", anchor="n")
    txt = tk.Text(row, height=height, wrap="word")
    txt.insert("1.0", value or "")
    txt.pack(side="left", fill="x", expand=True)
    return txt


class EntryCard(ttk.LabelFrame):
    """Editor for one ResumeEntry (experience / volunteering / education)."""

    def __init__(self, parent, section, entry, on_delete, on_move):
        super().__init__(parent, text=entry.get("title") or "(untitled)")
        self.section = section
        self.on_delete = on_delete
        self.on_move = on_move

        toolbar = ttk.Frame(self)
        toolbar.pack(fill="x", pady=(2, 6))
        ttk.Button(toolbar, text="▲", width=3, command=lambda: on_move(self, -1)).pack(side="left")
        ttk.Button(toolbar, text="▼", width=3, command=lambda: on_move(self, 1)).pack(side="left", padx=(2, 0))
        ttk.Button(toolbar, text="Delete", command=lambda: on_delete(self)).pack(side="right")

        self.id_var = labeled_entry(self, "id", entry.get("id", ""))
        self.title_var = labeled_entry(self, "title", entry.get("title", ""))
        self.title_var.trace_add("write", lambda *_: self.configure(text=self.title_var.get() or "(untitled)"))
        self.period_var = labeled_entry(self, "period", entry.get("period", ""))
        self.subtitle_var = labeled_entry(self, "subtitle", entry.get("subtitle", ""))
        self.meta_var = labeled_entry(self, "meta", entry.get("meta", ""))
        self.href_var = labeled_entry(self, "href", entry.get("href", ""))
        self.tag_var = labeled_entry(self, "tag", entry.get("tag", ""))
        self.desc_txt = labeled_text(self, "description", entry.get("description", ""), height=3)

        # Bullets (one per line).
        self.bullets_txt = labeled_text(
            self, "bullets", "\n".join(entry.get("bullets", []) or []), height=3
        )
        ttk.Label(
            self, text="    (one bullet per line)", foreground="#888"
        ).pack(anchor="w")

        # Sections (label | text, one per line).
        sec_lines = [f"{s['label']} | {s['text']}" for s in entry.get("sections", []) or []]
        self.sections_txt = labeled_text(
            self, "sections", "\n".join(sec_lines), height=4
        )
        ttk.Label(
            self,
            text="    (one per line, format:  Label | the text)",
            foreground="#888",
        ).pack(anchor="w")

        # Roles (one per line) — sub-positions in one company, rendered as a
        # dot + connector-line timeline (newest first). Optional 3rd field for a
        # per-phase description:  Role | dates | description
        role_lines = []
        for r in entry.get("roles", []) or []:
            parts = [r.get("label", ""), r.get("text", "")]
            if clean(r.get("description")):
                parts.append(r["description"])
            role_lines.append(" | ".join(parts))
        self.roles_txt = labeled_text(self, "roles", "\n".join(role_lines), height=5)
        ttk.Label(
            self,
            text="    (one per line:  Role | dates · type | optional description)",
            foreground="#888",
        ).pack(anchor="w")

    def collect(self) -> dict:
        title = self.title_var.get().strip()
        out = {
            "id": self.id_var.get().strip() or slugify(title),
            "period": self.period_var.get().strip(),
            "title": title,
        }
        for key, var in [
            ("subtitle", self.subtitle_var),
            ("meta", self.meta_var),
            ("href", self.href_var),
            ("tag", self.tag_var),
        ]:
            v = clean(var.get())
            if v:
                out[key] = v
        desc = clean(self.desc_txt.get("1.0", "end"))
        if desc:
            out["description"] = desc
        bullets = [b.strip() for b in self.bullets_txt.get("1.0", "end").splitlines() if b.strip()]
        if bullets:
            out["bullets"] = bullets
        sections = []
        for line in self.sections_txt.get("1.0", "end").splitlines():
            line = line.strip()
            if not line:
                continue
            if "|" in line:
                label, text = line.split("|", 1)
                sections.append({"label": label.strip(), "text": text.strip()})
            else:
                sections.append({"label": "", "text": line})
        if sections:
            out["sections"] = sections
        roles = []
        for line in self.roles_txt.get("1.0", "end").splitlines():
            line = line.strip()
            if not line:
                continue
            parts = [p.strip() for p in line.split("|")]
            role = {"label": parts[0] if parts else "", "text": parts[1] if len(parts) > 1 else ""}
            if len(parts) > 2 and parts[2]:
                role["description"] = parts[2]
            roles.append(role)
        if roles:
            out["roles"] = roles
        return out


class SimpleCard(ttk.LabelFrame):
    """Editor for a contact (LabeledLink) or skill (SkillGroup)."""

    def __init__(self, parent, kind, item, on_delete, on_move):
        super().__init__(parent, text=item.get("label") or "(untitled)")
        self.kind = kind  # "contact" | "skill"
        self.on_delete = on_delete
        self.on_move = on_move

        toolbar = ttk.Frame(self)
        toolbar.pack(fill="x", pady=(2, 6))
        ttk.Button(toolbar, text="▲", width=3, command=lambda: on_move(self, -1)).pack(side="left")
        ttk.Button(toolbar, text="▼", width=3, command=lambda: on_move(self, 1)).pack(side="left", padx=(2, 0))
        ttk.Button(toolbar, text="Delete", command=lambda: on_delete(self)).pack(side="right")

        self.id_var = labeled_entry(self, "id", item.get("id", ""))
        self.label_var = labeled_entry(self, "label", item.get("label", ""))
        self.label_var.trace_add("write", lambda *_: self.configure(text=self.label_var.get() or "(untitled)"))
        if kind == "contact":
            self.value_var = labeled_entry(self, "value", item.get("value", ""))
            self.href_var = labeled_entry(self, "href", item.get("href", ""))
        else:
            self.value_txt = labeled_text(self, "value", item.get("value", ""), height=3)

    def collect(self) -> dict:
        label = self.label_var.get().strip()
        out = {
            "id": self.id_var.get().strip() or slugify(label),
            "label": label,
        }
        if self.kind == "contact":
            out["value"] = self.value_var.get().strip()
            href = clean(self.href_var.get())
            if href:
                out["href"] = href
        else:
            out["value"] = clean(self.value_txt.get("1.0", "end")) or ""
        return out


class ListTab(ttk.Frame):
    """A tab holding an add-able, reorderable list of cards."""

    def __init__(self, parent, make_card, blank_item, add_label):
        super().__init__(parent)
        self.make_card = make_card
        self.blank_item = blank_item
        self.cards = []

        top = ttk.Frame(self)
        top.pack(fill="x", padx=8, pady=8)
        ttk.Button(top, text=add_label, command=self.add_blank).pack(side="left")

        self.scroll = ScrollFrame(self)
        self.scroll.pack(fill="both", expand=True, padx=8, pady=(0, 8))

    def load(self, items):
        for c in self.cards:
            c.destroy()
        self.cards = []
        for item in items:
            self._add(item)

    def _add(self, item):
        card = self.make_card(self.scroll.body, item, self.delete_card, self.move_card)
        card.pack(fill="x", pady=6, ipady=4)
        self.cards.append(card)
        return card

    def add_blank(self):
        card = self._add(dict(self.blank_item))
        self.scroll.canvas.update_idletasks()
        self.scroll.canvas.yview_moveto(1.0)

    def delete_card(self, card):
        if not messagebox.askyesno("Delete", "Remove this entry?"):
            return
        self.cards.remove(card)
        card.destroy()

    def move_card(self, card, direction):
        i = self.cards.index(card)
        j = i + direction
        if 0 <= j < len(self.cards):
            self.cards[i], self.cards[j] = self.cards[j], self.cards[i]
            for c in self.cards:
                c.pack_forget()
            for c in self.cards:
                c.pack(fill="x", pady=6, ipady=4)

    def collect(self):
        return [c.collect() for c in self.cards]


class App(tk.Tk):
    def __init__(self, data):
        super().__init__()
        self.title("Resume Editor")
        self.geometry("820x720")
        self.data = data

        nb = ttk.Notebook(self)
        nb.pack(fill="both", expand=True)

        # --- Profile tab ---
        prof = ttk.Frame(nb)
        nb.add(prof, text="Profile")
        p = data["profile"]
        box = ttk.Frame(prof)
        box.pack(fill="x", padx=16, pady=16)
        self.p_name = labeled_entry(box, "name", p.get("name", ""))
        self.p_title = labeled_entry(box, "title", p.get("title", ""))
        self.p_location = labeled_entry(box, "location", p.get("location", ""))
        self.p_site = labeled_entry(box, "site", p.get("site", ""))
        self.p_siteHref = labeled_entry(box, "siteHref", p.get("siteHref", ""))
        self.p_about = labeled_text(box, "about", p.get("about", ""), height=8)

        # --- Contacts tab ---
        self.contacts_tab = ListTab(
            nb,
            make_card=lambda parent, item, d, m: SimpleCard(parent, "contact", item, d, m),
            blank_item={"id": "", "label": "", "value": "", "href": ""},
            add_label="+ Add contact",
        )
        nb.add(self.contacts_tab, text="Contacts")
        self.contacts_tab.load(data["contacts"])

        # --- Experience tab ---
        self.experience_tab = ListTab(
            nb,
            make_card=lambda parent, item, d, m: EntryCard(parent, "experience", item, d, m),
            blank_item={"id": "", "period": "", "title": ""},
            add_label="+ Add experience",
        )
        nb.add(self.experience_tab, text="Experience")
        self.experience_tab.load(data["experience"])

        # --- Skills tab ---
        self.skills_tab = ListTab(
            nb,
            make_card=lambda parent, item, d, m: SimpleCard(parent, "skill", item, d, m),
            blank_item={"id": "", "label": "", "value": ""},
            add_label="+ Add skill group",
        )
        nb.add(self.skills_tab, text="Skills")
        self.skills_tab.load(data["skills"])

        # --- Volunteering tab ---
        self.volunteering_tab = ListTab(
            nb,
            make_card=lambda parent, item, d, m: EntryCard(parent, "volunteering", item, d, m),
            blank_item={"id": "", "period": "", "title": ""},
            add_label="+ Add volunteering",
        )
        nb.add(self.volunteering_tab, text="Volunteering")
        self.volunteering_tab.load(data["volunteering"])

        # --- Education tab ---
        self.education_tab = ListTab(
            nb,
            make_card=lambda parent, item, d, m: EntryCard(parent, "education", item, d, m),
            blank_item={"id": "", "period": "", "title": ""},
            add_label="+ Add education",
        )
        nb.add(self.education_tab, text="Education")
        self.education_tab.load(data["education"])

        # --- Bottom bar ---
        bar = ttk.Frame(self)
        bar.pack(fill="x", padx=12, pady=10)
        self.status = ttk.Label(bar, text="", foreground="#2a7")
        self.status.pack(side="left")
        ttk.Button(bar, text="Save → resume-data.ts", command=self.save).pack(side="right")

    def collect(self) -> dict:
        return {
            "profile": {
                "name": self.p_name.get().strip(),
                "title": self.p_title.get().strip(),
                "location": self.p_location.get().strip(),
                "site": self.p_site.get().strip(),
                "siteHref": self.p_siteHref.get().strip(),
                "about": self.p_about.get("1.0", "end").strip(),
            },
            "contacts": self.contacts_tab.collect(),
            "experience": self.experience_tab.collect(),
            "skills": self.skills_tab.collect(),
            "volunteering": self.volunteering_tab.collect(),
            "education": self.education_tab.collect(),
        }

    def save(self):
        try:
            data = self.collect()
            save_working(data)
            ts = generate_ts(data)
            with open(TS_OUTPUT, "w", encoding="utf-8") as f:
                f.write(ts)
            self.status.configure(
                text=f"Saved ✓  wrote {TS_OUTPUT.name} + resume_data.json"
            )
        except Exception as exc:  # noqa: BLE001 — surface any failure to the user
            messagebox.showerror("Save failed", str(exc))


def main():
    if not SEED_JSON.exists():
        print(f"Missing seed file: {SEED_JSON}", file=sys.stderr)
        sys.exit(1)
    App(load_data()).mainloop()


if __name__ == "__main__":
    main()
