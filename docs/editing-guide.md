# Editing the website content

This guide is for updating products, free downloads, portfolio pieces and contact details. You won't need to touch any code.

Everything you edit lives in **`src/content/`** (text) and **`public/`** (photos and PDFs).

---

## What you can edit

| To change… | Edit this |
|---|---|
| Products (shop, mindfulness products, prints & paintings) | `src/content/products/` — one file per product |
| Free downloads | `src/content/freebies/` — one file per download |
| Portfolio pieces (the "Gallery" page) | `src/content/works/` — one file per artwork |
| WhatsApp number, catalogue links, email, social links | `src/content/site.json` |

Please ask before changing anything in `rooms/` or `pages/`. Those control the gallery layout.

---

## Adding something new

1. In the right folder, **copy `_example.json`** and rename the copy.
   - Use lowercase words joined by dashes: `blue-journal.json`, `colouring-book-2.json`.
   - The file name becomes the item's ID, so don't change it later.
2. Change the values in your copy. Leave the first `"$schema"` line as it is, because it powers the spell-checking described below.
3. Save, and add the photo (see [Where photos go](#where-photos-go)).

Files whose names start with `_` are never shown on the website, so the examples are safe to leave in place.

To **hide** something without deleting it, set `"published": false`.

### Afrikaans and English

Text that should differ per language looks like this:

```json
"description": { "af": "Kort beskrywing.", "en": "Short description." }
```

If a value is the same in both languages, you can just write it once: `"dimensions": "A5"`.

### Product fields

| Field | What to put | Example |
|---|---|---|
| `category` | `"art"`, `"mindfulness"` or `"c4"` | `"mindfulness"` |
| `price` | Whole rand as a **number**, with no `R` and no quotes. Use `null` for "price on enquiry". | `120` |
| `status` | `"available"`, `"made-to-order"` or `"sold"`. Sold items disappear from the shop. | `"available"` |
| `options` | The available colours or variations, as a list | `["Pink", "Blue"]` |
| `image` | The photo's file name (the photo goes in the folder below) | `"blue-journal.jpg"` |

---

## Where photos go

All file names should be in **English**, lowercase, with dashes instead of spaces.

| Photo of… | Folder |
|---|---|
| Art products (category `art`) | `public/paintings/art/prints-and-paintings/` |
| Mindfulness products | `public/paintings/mindfulness/mindfulness-products/` |
| C4 products | `public/paintings/shop/` |
| Portfolio pieces | `public/paintings/art/gallery/` |
| Freebie covers | `public/paintings/freebies/` |
| Freebie PDFs | `public/downloads/` (or use a full `https://` link in `"file"`) |

### Replacing one of the gallery paintings

The clickable paintings on the walls are named after the page they open. For example, `public/paintings/c4-akademie/speeches.png` opens the Speeches page.

To swap one for a finished painting, **save the new image with exactly the same name in the same folder**. Nothing else needs to change. It can take about 10 minutes before the live site shows it.

---

## Checking your work

- **In VSCodium:** mistakes get a red underline as you type. Hover over the underline to see what's wrong. Typing `"` inside a file suggests the allowed field names.
- **Before publishing,** the website checks every file automatically. If something is wrong, the update **is not published**, so the live site keeps working. The check names the file and the problem, for example:

  ```
  src/content/products/blue-journal.json → "price" must be a number (got "R120"). Example: 120 (whole rand, no "R"), or null
  ```

  Fix that line, save, and it will try again.
- **Warnings** (for example "no image at …, showing the placeholder") don't stop anything. They're reminders.

### JSON rules that cause most mistakes

- Text goes in **double quotes**: `"Blue journal"`. Numbers, `true`, `false` and `null` don't.
- Put a **comma between items**, but not after the last one in a `{ }` or `[ ]`.
- Every `{` needs a matching `}`, and every `[` a matching `]`.
