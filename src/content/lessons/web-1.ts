/**
 * Track: web-1 — "Web Basics: HTML & CSS"
 * Written here: wb-1 (HTML), wb-2 (CSS) + checkpoints + course final exam.
 *
 * HTML exercises (language 'html') are rendered in a sandboxed iframe and graded by the checks below,
 * which run in the real browser (src/engine/htmlHarness.ts lists the helpers: $, $$, text, attr, css, px, color).
 * `npm test` can't render pages, so every HTML exercise is verified in Chrome by scripts/e2e/html_checks.py
 * (solution passes, starter fails) and by play_all.py.
 * CSS-only snippets are labeled 'text' (there is no separate CSS label).
 */
import type { AnswerStep, Checkpoint, ChoiceStep, CodeStep, CodeTest, FillStep, Step } from '../types';
import { ans, ansT, ex, fill, mc, mcT, ord } from './_helpers';

const J = JSON.stringify;
const ordT = (prompt: string, lines: string[], explanation: string) => ord(prompt, lines, explanation, 'text');

// ------------------------------------------------------------------ question helpers (HTML-labeled code)
const mcH = (prompt: string, choices: string[], answer: number, explanation: string, code?: string): ChoiceStep => ({
  ...mc(prompt, choices, answer, explanation), ...(code ? { code, language: 'html' as const } : {}),
});
const ansH = (prompt: string, accept: string[], explanation: string, code?: string): AnswerStep => ({
  ...ans(prompt, accept, explanation), ...(code ? { code, language: 'html' as const } : {}),
});
const fillH = (prompt: string, template: string, answers: string[][], explanation: string, bank?: string[]): FillStep => ({
  ...fill(prompt, template, answers, explanation, bank), language: 'html',
});

/** An HTML/CSS exercise. */
const web = (a: Omit<CodeStep, 'kind' | 'language' | 'starter'> & { starter?: string }): CodeStep => ({
  kind: 'code', language: 'html', starter: '', ...a,
});

// ------------------------------------------------------------------ page checks
const has = (sel: string, msg: string): CodeTest => ({ name: `has ${sel}`, code: `assert($(${J(sel)}), ${J(msg)})` });
const textIs = (sel: string, t: string): CodeTest => ({
  name: `${sel} says "${t}"`,
  code: `assert(text(${J(sel)}) === ${J(t)}, ${J(`The ${sel} should say "${t}"`)} + " (now: \\"" + text(${J(sel)}) + "\\")")`,
});
const countIs = (sel: string, n: number, msg: string): CodeTest => ({
  name: `${n} × ${sel}`,
  code: `assert($$(${J(sel)}).length === ${n}, ${J(msg)} + " (found " + $$(${J(sel)}).length + ")")`,
});
const cssIs = (sel: string, prop: string, value: string, msg: string): CodeTest => ({
  name: `${sel} { ${prop}: ${value} }`,
  code: `assert(css(${J(sel)}, ${J(prop)}) === ${J(value)}, ${J(msg)} + " (now: " + (css(${J(sel)}, ${J(prop)}) || "nothing") + ")")`,
});
const colorIs = (sel: string, prop: string, value: string, msg: string): CodeTest => ({
  name: `${sel} { ${prop}: ${value} }`,
  code: `assert(css(${J(sel)}, ${J(prop)}) === color(${J(value)}), ${J(msg)})`,
});
const pxIs = (sel: string, prop: string, n: number, msg: string): CodeTest => ({
  name: `${sel} { ${prop}: ${n}px }`,
  code: `assert(Math.abs(px(${J(sel)}, ${J(prop)}) - ${n}) < 0.5, ${J(msg)} + " (now: " + px(${J(sel)}, ${J(prop)}) + "px)")`,
});

/** A small page with an empty <style> block for CSS exercises. */
const page = (body: string, style = '') =>
  `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <title>Practice</title>\n  <style>\n${style}\n  </style>\n</head>\n<body>\n${body}\n</body>\n</html>\n`;

/** A purple circle as an inline image, so exercises never download anything. */
const PIP_IMG = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><circle cx='30' cy='30' r='28' fill='%237452FF'/></svg>`;

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ wb-1-tags
  'wb-1-tags': [
    ex('The language of web pages', 'Every web page is written in **HTML** (HyperText Markup Language). HTML doesn\'t *do* things like Python does. It **describes** what\'s on the page.\n\nIt uses **tags** in angle brackets:\n\n```html\n<p>Hello, web!</p>\n```\n\n`<p>` opens a paragraph and `</p>` closes it (note the `/`). The opening tag, the content and the closing tag together form an **element**.', 'In this course you\'ll see your page appear live next to your code.'),
    mcH('In this code, which part is the closing tag?', ['</p>', '<p>', 'Hello'], 0, 'Closing tags have a slash after the <.', '<p>Hello</p>'),
    ex('Headings and text', '```html\n<h1>Main title</h1>\n<h2>Section title</h2>\n<p>A paragraph with <strong>important</strong> and <em>emphasized</em> words.</p>\n```\n\n- **`<h1>`** to **`<h6>`** are headings, from most to least important. A page usually has one `<h1>`.\n- **`<p>`** is a paragraph.\n- **`<strong>`** (bold) and **`<em>`** (italic) can go *inside* other elements. That\'s called **nesting**.'),
    mc('Which tag is the most important heading?', ['<h1>', '<h6>', '<head>'], 0, 'h1 is the top level. <head> is something else entirely (next lesson).'),
    ex('Links, images and attributes', 'Tags can have **attributes**: extra settings written as `name="value"` inside the opening tag.\n\n```html\n<a href="https://example.com">Visit Example</a>\n<img src="cat.jpg" alt="A cat asleep on a keyboard">\n```\n\n- `<a>` is a link, and **`href`** is where it goes.\n- `<img>` shows a picture from **`src`**. **`alt`** describes it for people who can\'t see it.\n- `<img>` has **no closing tag**: it has no content inside.'),
    fillH('Complete the link.', '<a ___="https://example.com">Example</a>', [['href']], 'href = "hypertext reference": the address the link points to.', ['href', 'src', 'link', 'alt']),
    mc('Which element has NO closing tag?', ['<img>', '<p>', '<a>'], 0, 'An image has nothing inside it, so it\'s written as one tag.'),
    web({
      prompt: 'Build your first page. Write:\n\n1. an `<h1>` that says **My Page**\n2. a `<p>` with any sentence\n3. a link to `https://example.com` whose text is **Example**\n\nWatch the preview update as you type.',
      starter: '<!-- Write your HTML below -->\n',
      tests: [
        textIs('h1', 'My Page'),
        has('p', 'Add a <p> paragraph'),
        { name: 'link goes to https://example.com', code: 'assert(attr("a", "href") === "https://example.com", "Add <a href=\\"https://example.com\\">…</a>")' },
        textIs('a', 'Example'),
      ],
      hints: ['<h1>My Page</h1>', '<a href="https://example.com">Example</a>'],
      solution: '<h1>My Page</h1>\n<p>This is my first web page.</p>\n<a href="https://example.com">Example</a>\n',
    }),
  ],

  // ------------------------------------------------------------------ wb-1-structure
  'wb-1-structure': [
    ex('The page skeleton', 'A complete HTML page looks like this:\n\n```html\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <title>My site</title>\n</head>\n<body>\n  <h1>Hello!</h1>\n</body>\n</html>\n```\n\n- **`<head>`** holds information *about* the page. The `<title>` shows in the browser tab.\n- **`<body>`** holds everything you **see**.\n- `lang="en"` tells browsers and screen readers the page is in English.'),
    mc('Where does the <title> element go?', ['Inside <head>', 'Inside <body>', 'After </html>'], 0, 'The title is information about the page, so it goes in the head.'),
    ordT('Put the page skeleton in order.', ['<!DOCTYPE html>', '<html lang="en">', '<head>', '<title>My site</title>', '</head>', '<body>', '</body>', '</html>'], 'Doctype, then html, containing head (with the title) and then body.'),
    ex('Semantic tags', '**Semantic** tags say what a part of the page *is*:\n\n| Tag | Meaning |\n|---|---|\n| `<header>` | top of the page or a section |\n| `<nav>` | main navigation links |\n| `<main>` | the main content (one per page) |\n| `<article>`, `<section>` | self-contained pieces, sections |\n| `<footer>` | bottom: copyright, contact |\n\n`<div>` is a plain box with no meaning. Use it only when nothing else fits.', 'Semantic tags help screen readers, search engines and future you.'),
    mc('Which tag should wrap the site\'s main navigation links?', ['<nav>', '<div>', '<link>'], 0, 'nav says "this is navigation". <link> is for connecting files like stylesheets.'),
    ex('Lists', '```html\n<ul>              <!-- unordered: bullets -->\n  <li>Milk</li>\n  <li>Eggs</li>\n</ul>\n\n<ol>              <!-- ordered: 1, 2, 3 -->\n  <li>Preheat</li>\n  <li>Bake</li>\n</ol>\n```\n\nEach item is an **`<li>`** (list item).'),
    mc('You\'re writing step-by-step instructions. Which list?', ['<ol>', '<ul>', '<li>'], 0, 'Order matters, so use an ordered (numbered) list.'),
    web({
      prompt: 'Fill in the `<body>`:\n\n1. a `<header>` containing an `<h1>` that says **Pip\'s Blog**\n2. a `<main>` containing a `<ul>` with **3** `<li>` items\n3. a `<footer>` (with any text)',
      starter: page(''),
      tests: [
        has('header h1', 'Put an <h1> inside a <header>'),
        textIs('header h1', 'Pip\'s Blog'),
        countIs('main ul li', 3, 'Put a <ul> with 3 <li> items inside <main>'),
        has('footer', 'Add a <footer>'),
      ],
      hints: ['<header>\n  <h1>Pip\'s Blog</h1>\n</header>', '<main>\n  <ul>\n    <li>…</li>\n    <li>…</li>\n    <li>…</li>\n  </ul>\n</main>\n<footer>…</footer>'],
      solution: page('<header>\n  <h1>Pip\'s Blog</h1>\n</header>\n<main>\n  <ul>\n    <li>Learning HTML</li>\n    <li>Learning CSS</li>\n    <li>Building a site</li>\n  </ul>\n</main>\n<footer>© Pip</footer>'),
    }),
  ],

  // ------------------------------------------------------------------ wb-1-forms
  'wb-1-forms': [
    ex('Forms', 'Forms collect information from people:\n\n```html\n<form>\n  <label for="email">Email</label>\n  <input id="email" type="email" name="email">\n  <button type="submit">Send</button>\n</form>\n```\n\n- **`<input>`** is a box to type in (no closing tag).\n- **`<label>`** names the input. Its `for` must match the input\'s `id`.\n- **`<button>`** sends the form.'),
    ex('Input types', 'The `type` attribute changes how an input works:\n\n| type | What you get |\n|---|---|\n| `text` | plain text |\n| `email` | checks for an @, and phones show an email keyboard |\n| `password` | hides the characters |\n| `number` | number keyboard and arrows |\n| `checkbox` | a tick box |\n| `date` | a date picker |\n\nAdd **`required`** and the browser won\'t send the form until it\'s filled in.'),
    mc('Which type hides what someone types?', ['password', 'secret', 'hidden-text'], 0, 'type="password" shows dots instead of letters.'),
    mc('Why use type="email" instead of type="text"?', ['Phones show an email keyboard, and the browser checks the format', 'It sends an email', 'It hides the text'], 0, 'The right type gives a better keyboard and free checking.'),
    fillH('Connect the label to the input.', '<label ___="name">Name</label>\n<input id="name">', [['for']], 'The label\'s for points at the input\'s id. Clicking the label then focuses the input, and screen readers read the label.', ['for', 'id', 'name', 'to']),
    mc('What does the `required` attribute do?', ['The browser won\'t submit the form until the field is filled in', 'It makes the label bold', 'It hides the field'], 0, 'Built-in checking, no JavaScript needed. (Servers must still check too!)'),
    web({
      prompt: 'Build a sign-up form inside the `<form>`:\n\n1. a `<label>` with `for="email"` that says **Email**\n2. an `<input>` with `id="email"`, `type="email"` and the `required` attribute\n3. a `<button>` that says **Sign up**',
      starter: '<form>\n\n</form>\n',
      tests: [
        has('form label[for="email"]', 'Add <label for="email"> inside the form'),
        has('form input#email[type="email"]', 'Add <input id="email" type="email"> inside the form'),
        { name: 'email is required', code: 'assert($("#email") && $("#email").hasAttribute("required"), "Add the required attribute to the input")' },
        textIs('form button', 'Sign up'),
      ],
      hints: ['<label for="email">Email</label>', '<input id="email" type="email" required>\n<button type="submit">Sign up</button>'],
      solution: '<form>\n  <label for="email">Email</label>\n  <input id="email" type="email" name="email" required>\n  <button type="submit">Sign up</button>\n</form>\n',
    }),
  ],

  // ------------------------------------------------------------------ wb-1-accessibility
  'wb-1-accessibility': [
    ex('Pages for everyone', '**Accessibility** (often written **a11y**) means everyone can use your page, including people who:\n\n- use a **screen reader** that reads the page aloud\n- use only a **keyboard**\n- have low vision or color blindness\n\nGood news: **semantic HTML does most of the work for free.**', 'About 1 in 4 U.S. adults has a disability. Accessible sites are also easier for everyone, and often required by law.'),
    ex('Alt text', 'Every `<img>` needs an **`alt`** attribute:\n\n- Describe the image\'s **purpose**: `alt="Bar chart: sales doubled in May"`\n- Purely decorative image? Use an **empty** `alt=""` so screen readers skip it.\n- Don\'t start with "image of". Screen readers already say "image".'),
    mc('A logo image links to the home page. What\'s the best alt text?', ['"Loopwise home"', '"image"', '"logo.png"'], 0, 'Describe what it does for the user: it takes them home.'),
    ex('Buttons, links and labels', '- Actions use **`<button>`**. A clickable `<div>` can\'t be reached with the Tab key and isn\'t announced as a button.\n- Going somewhere uses a **link** `<a href>`.\n- Every input needs a **`<label>`**. Placeholder text disappears when you type, so it\'s not a label.'),
    mc('Why use <button> instead of a <div> that responds to clicks?', ['A button works with the keyboard and screen readers automatically', 'A div is better for accessibility', 'There\'s no difference'], 0, 'You get focus, Enter/Space and the right announcement for free.'),
    ex('More good habits', '- Use headings **in order** (h1 → h2 → h3) so the outline makes sense.\n- Use landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`.\n- Text needs enough **contrast** against its background: at least **4.5 : 1** for normal text (the WCAG AA standard).\n- Never use **color alone** to show meaning: add words or icons too.'),
    mc('What\'s the minimum contrast ratio for normal-size text under WCAG AA?', ['4.5 : 1', '2 : 1', '10 : 1'], 0, 'Large text can be 3 : 1, and normal text needs 4.5 : 1.'),
    web({
      prompt: 'This page has three accessibility problems. Fix them:\n\n1. Give the image the alt text **Pip the robot**\n2. Replace the clickable `<div class="btn">` with a real `<button>` that says **Start**\n3. Add a `<label for="q">` that says **Search** for the text box',
      starter: `<img src="${PIP_IMG}">\n<div class="btn">Start</div>\n<input id="q" type="text" placeholder="Search…">\n`,
      tests: [
        { name: 'image has alt text', code: 'assert(attr("img", "alt") === "Pip the robot", "Set alt=\\"Pip the robot\\" on the <img>")' },
        textIs('button', 'Start'),
        { name: 'no clickable div left', code: 'assert(!$("div.btn"), "Remove the <div class=\\"btn\\"> (use the button instead)")' },
        has('label[for="q"]', 'Add <label for="q">Search</label>'),
        textIs('label[for="q"]', 'Search'),
      ],
      hints: [`<img src="…" alt="Pip the robot">`, '<button>Start</button>\n<label for="q">Search</label>'],
      solution: `<img src="${PIP_IMG}" alt="Pip the robot">\n<button>Start</button>\n<label for="q">Search</label>\n<input id="q" type="text" placeholder="Search…">\n`,
    }),
  ],

  // ------------------------------------------------------------------ wb-2-selectors
  'wb-2-selectors': [
    ex('Styling with CSS', 'HTML is the structure; **CSS** (Cascading Style Sheets) is the look. A CSS **rule** picks elements with a **selector**, then sets **properties**:\n\n```css\np {\n  color: navy;\n  font-size: 18px;\n}\n```\n\nFor now, put your CSS in a `<style>` element inside `<head>`.'),
    ex('Selectors', '| Selector | Matches |\n|---|---|\n| `p` | every `<p>` |\n| `.note` | every element with `class="note"` |\n| `#top` | the element with `id="top"` |\n| `nav a` | every `<a>` **inside** a `<nav>` |\n\nA **class** can be used on many elements. An **id** must be unique on the page.'),
    mcT('Which selector matches this element?', ['.note', '#note', 'note'], 0, '. = class, # = id, and a bare word = a tag name.', '<p class="note">Remember!</p>'),
    mc('How do you select every link inside the <nav>?', ['nav a', 'nav.a', 'a nav'], 0, 'A space means "inside". nav.a would mean a <nav> with class "a".'),
    ex('Which rule wins?', 'When two rules set the same property on one element:\n\n1. The more **specific** selector wins: **id** beats **class**, which beats **tag**.\n2. If they\'re equally specific, the one written **later** wins.\n\nThat\'s the "cascade" in Cascading Style Sheets.'),
    mcT('What color is the paragraph?', ['green', 'blue', 'black'], 0, '.note (a class) is more specific than p (a tag), so green wins no matter which rule comes first. Order only matters for ties.', 'p { color: blue; }\n.note { color: green; }\n\n<p class="note">Hi</p>'),
    mc('Which property changes the background color?', ['background-color', 'color', 'bg'], 0, '`color` is the text color.'),
    web({
      prompt: 'Add CSS inside the `<style>` element:\n\n1. make the `h1` text color **navy**\n2. give `.note` a `background-color` of **#ffffcc** (pale yellow)\n3. make `.note` text **bold** (`font-weight: bold`)',
      starter: page('<h1>Shopping list</h1>\n<p>Milk, eggs, bread.</p>\n<p class="note">Don\'t forget the cat food!</p>', '    /* your CSS here */'),
      tests: [
        colorIs('h1', 'color', 'navy', 'Set h1 { color: navy; }'),
        colorIs('.note', 'background-color', '#ffffcc', 'Set .note { background-color: #ffffcc; }'),
        cssIs('.note', 'font-weight', '700', 'Set .note { font-weight: bold; }'),
      ],
      hints: ['h1 {\n  color: navy;\n}', '.note {\n  background-color: #ffffcc;\n  font-weight: bold;\n}'],
      solution: page('<h1>Shopping list</h1>\n<p>Milk, eggs, bread.</p>\n<p class="note">Don\'t forget the cat food!</p>', '    h1 {\n      color: navy;\n    }\n    .note {\n      background-color: #ffffcc;\n      font-weight: bold;\n    }'),
    }),
  ],

  // ------------------------------------------------------------------ wb-2-box-model
  'wb-2-box-model': [
    ex('Every element is a box', 'From the inside out, every element has:\n\n1. **content**: the text or image\n2. **padding**: space *inside* the border\n3. **border**: the edge\n4. **margin**: space *outside*, pushing other boxes away\n\n```css\n.card {\n  padding: 16px;\n  border: 2px solid purple;\n  margin: 24px;\n}\n```'),
    mc('Which property adds space INSIDE the border?', ['padding', 'margin', 'border'], 0, 'Padding is inside; margin is outside.'),
    ex('Shorthands and units', '- `padding: 10px` sets all four sides.\n- `margin: 0 auto` means 0 top/bottom and `auto` left/right. On a box with a set width, that **centers** it.\n- `border: 2px solid black` sets width, style and color.\n\nUnits: **px** (pixels), **rem** (relative to the base font size), **%** (of the parent).'),
    ansT('With the default `box-sizing: content-box`, this box\'s total width is width + padding on both sides + border on both sides. What is it, in px?', ['224', '224px'], '200 + 10 + 10 + 2 + 2 = 224.', '.box {\n  width: 200px;\n  padding: 10px;\n  border: 2px solid black;\n}'),
    ex('box-sizing: border-box', 'That adding-up is confusing, so most sites set:\n\n```css\n* { box-sizing: border-box; }\n```\n\nNow `width` **includes** the padding and border. A `width: 200px` box is exactly 200px wide.'),
    ansT('Same box, but with `box-sizing: border-box`. What is its total width, in px?', ['200', '200px'], 'With border-box, the padding and border fit inside the 200px.', '.box {\n  box-sizing: border-box;\n  width: 200px;\n  padding: 10px;\n  border: 2px solid black;\n}'),
    mc('`margin: 0 auto` on a box with a fixed width…', ['centers it horizontally', 'removes it', 'centers it vertically'], 0, 'auto splits the leftover space evenly on the left and right.'),
    web({
      prompt: 'Style the cards. Give `.card`:\n\n1. `padding` of **16px**\n2. a **2px solid** border in **#7452FF** (Pip purple)\n3. a `margin-bottom` of **24px**',
      starter: page('<div class="card">First card</div>\n<div class="card">Second card</div>', '    /* your CSS here */'),
      tests: [
        pxIs('.card', 'padding-top', 16, 'Set padding: 16px'),
        pxIs('.card', 'padding-left', 16, 'Set padding: 16px on every side'),
        cssIs('.card', 'border-top-style', 'solid', 'Use a solid border'),
        pxIs('.card', 'border-top-width', 2, 'Make the border 2px'),
        colorIs('.card', 'border-top-color', '#7452FF', 'Make the border color #7452FF'),
        pxIs('.card', 'margin-bottom', 24, 'Set margin-bottom: 24px'),
      ],
      hints: ['.card {\n  padding: 16px;\n}', 'border: 2px solid #7452FF;\nmargin-bottom: 24px;'],
      solution: page('<div class="card">First card</div>\n<div class="card">Second card</div>', '    .card {\n      padding: 16px;\n      border: 2px solid #7452FF;\n      margin-bottom: 24px;\n    }'),
    }),
  ],

  // ------------------------------------------------------------------ wb-2-flexbox
  'wb-2-flexbox': [
    ex('Flexbox', 'Put **`display: flex`** on a container, and its children line up in a **row**:\n\n```css\n.nav {\n  display: flex;\n  justify-content: space-between;  /* along the row */\n  align-items: center;             /* across the row */\n  gap: 12px;                       /* space between items */\n}\n```\n\nFlexbox is for laying things out in **one direction**: a row or a column.'),
    mc('Which property spreads items out along the row?', ['justify-content', 'align-items', 'flex-wrap'], 0, 'justify-content works along the main direction; align-items works across it.'),
    ex('More flex controls', '- `flex-direction: column` stacks the children **vertically** instead.\n- `flex-wrap: wrap` lets items flow onto a new line when they run out of room.\n- `flex: 1` on a child makes it **grow** to fill the leftover space.\n\n`justify-content` values: `flex-start`, `center`, `flex-end`, `space-between`, `space-around`.'),
    mc('How do you center a box both horizontally AND vertically inside its container?', ['display: flex; justify-content: center; align-items: center;', 'text-align: center;', 'margin: center;'], 0, 'The famous "how do I center a div" answer.'),
    mc('`flex-direction: column` arranges the children…', ['top to bottom', 'left to right', 'diagonally'], 0, 'Column = stacked vertically.'),
    mc('What does `gap: 16px` do in a flex container?', ['Adds 16px of space between the items', 'Adds 16px of padding around the container', 'Adds a 16px margin to every side of each item'], 0, 'gap only goes between items, never on the outside edges.'),
    web({
      prompt: 'Turn the list into a navigation bar. Style `.nav` with:\n\n1. `display: flex`\n2. `justify-content: space-between`\n3. `align-items: center`\n4. `gap: 12px`',
      starter: page('<nav class="nav">\n  <strong>Loopwise</strong>\n  <a href="#learn">Learn</a>\n  <a href="#practice">Practice</a>\n</nav>', '    /* your CSS here */'),
      tests: [
        cssIs('.nav', 'display', 'flex', 'Set display: flex'),
        cssIs('.nav', 'justify-content', 'space-between', 'Set justify-content: space-between'),
        cssIs('.nav', 'align-items', 'center', 'Set align-items: center'),
        pxIs('.nav', 'column-gap', 12, 'Set gap: 12px'),
      ],
      hints: ['.nav {\n  display: flex;\n}', 'justify-content: space-between;\nalign-items: center;\ngap: 12px;'],
      solution: page('<nav class="nav">\n  <strong>Loopwise</strong>\n  <a href="#learn">Learn</a>\n  <a href="#practice">Practice</a>\n</nav>', '    .nav {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      gap: 12px;\n    }'),
    }),
  ],

  // ------------------------------------------------------------------ wb-2-grid
  'wb-2-grid': [
    ex('CSS Grid', '**Grid** lays things out in **rows and columns at once**:\n\n```css\n.gallery {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 10px;\n}\n```\n\n**fr** means "a fraction of the free space". `1fr 1fr 1fr` = three equal columns. Children fill the cells in order, starting a new row when one is full.'),
    mc('What\'s the main difference between flexbox and grid?', ['Flexbox is one direction (a row or a column); grid is two (rows and columns)', 'They\'re identical', 'Grid only works for text'], 0, 'Use flex for a toolbar, and grid for a photo gallery or a page layout.'),
    ansT('The container is 300px wide and has no gap. How wide is the SECOND column, in px?', ['200', '200px'], '3 fr in total: 1fr = 100px, so 2fr = 200px.', '.box {\n  display: grid;\n  grid-template-columns: 1fr 2fr;\n}'),
    ex('Handy grid tricks', '- `repeat(4, 1fr)` is short for `1fr 1fr 1fr 1fr`.\n- `grid-column: span 2` on a child makes it take up **two** columns.\n- Rows are created automatically as needed.'),
    mc('What does `grid-template-columns: repeat(4, 1fr)` create?', ['4 equal columns', '1 column, 4 times wider', '4 rows'], 0, 'repeat(count, size).'),
    mc('What does `grid-column: span 2` do to an item?', ['It stretches across 2 columns', 'It appears twice', 'It takes 2 rows'], 0, 'Great for a wide "featured" card.'),
    web({
      prompt: 'Make a photo gallery. Style `.gallery` as a **grid** with **3 equal columns** (`repeat(3, 1fr)`) and a **10px** gap.',
      starter: page('<div class="gallery">\n  <div>🐱</div><div>🐶</div><div>🦊</div>\n  <div>🐼</div><div>🐨</div><div>🐸</div>\n</div>', '    .gallery div { background: #eee; padding: 20px; text-align: center; font-size: 2rem; }\n    /* your CSS here */'),
      tests: [
        cssIs('.gallery', 'display', 'grid', 'Set display: grid'),
        { name: '3 equal columns', code: 'const cols = css(".gallery", "grid-template-columns").split(" ");\nassert(cols.length === 3, "Make exactly 3 columns (now " + cols.length + ")");\nassert(Math.abs(parseFloat(cols[0]) - parseFloat(cols[2])) < 1, "Make the columns equal with 1fr")' },
        pxIs('.gallery', 'column-gap', 10, 'Set gap: 10px'),
        pxIs('.gallery', 'row-gap', 10, 'Set gap: 10px (rows too)'),
      ],
      hints: ['.gallery {\n  display: grid;\n}', 'grid-template-columns: repeat(3, 1fr);\ngap: 10px;'],
      solution: page('<div class="gallery">\n  <div>🐱</div><div>🐶</div><div>🦊</div>\n  <div>🐼</div><div>🐨</div><div>🐸</div>\n</div>', '    .gallery div { background: #eee; padding: 20px; text-align: center; font-size: 2rem; }\n    .gallery {\n      display: grid;\n      grid-template-columns: repeat(3, 1fr);\n      gap: 10px;\n    }'),
    }),
  ],

  // ------------------------------------------------------------------ wb-2-responsive
  'wb-2-responsive': [
    ex('One page, every screen', 'A **responsive** page adapts to any screen, from a phone to a big monitor.\n\nStep one is this tag in the `<head>`:\n\n```html\n<meta name="viewport" content="width=device-width, initial-scale=1">\n```\n\nWithout it, phones pretend to be a wide desktop and shrink everything. Then use flexible sizes: `%`, `max-width`, flex and grid.'),
    mcH('What does this tag do?', ['Makes phones use their real screen width instead of zooming out', 'Adds a scroll bar', 'Stops people from zooming'], 0, 'It\'s the first line of every responsive page.', '<meta name="viewport" content="width=device-width, initial-scale=1">'),
    ex('Media queries', 'A **media query** applies CSS only when a condition is true:\n\n```css\n.cards { display: block; }            /* phones: stacked */\n\n@media (min-width: 600px) {           /* 600px and wider */\n  .cards { display: flex; gap: 16px; }\n}\n```\n\n**Mobile first:** write the phone styles first, then add media queries for bigger screens. Phone styles stay simple, and big screens get the extras.'),
    mcT('When does the rule inside apply?', ['When the screen is 600px wide or wider', 'When it\'s narrower than 600px', 'Only when printing'], 0, 'min-width = "at least this wide".', '@media (min-width: 600px) {\n  .cards { display: flex; }\n}'),
    mc('What does "mobile first" mean?', ['Write the phone styles first, then add media queries for larger screens', 'Build the mobile app before the website', 'Only support phones'], 0, 'Start small, then enhance.'),
    mc('What does `img { max-width: 100%; }` do?', ['Images never get wider than their container', 'Images are always 100px wide', 'It hides images'], 0, 'A classic one-liner that stops images from overflowing on phones.'),
    web({
      prompt: 'Make the cards **mobile first**:\n\n- Leave `.cards` stacked (`display: block`) by default.\n- Add a media query for screens **at least 600px wide** that makes `.cards` `display: flex` with a **16px** gap.\n\n(The checker views your page at 800px wide, like a laptop.)',
      starter: page('<div class="cards">\n  <div class="card">One</div>\n  <div class="card">Two</div>\n  <div class="card">Three</div>\n</div>', '    .card { border: 2px solid #7452FF; padding: 12px; margin-bottom: 8px; }\n    .cards { display: block; }\n    /* your media query here */'),
      tests: [
        { name: 'has a min-width media query', code: 'assert(/@media[^{]*min-width\\s*:\\s*600px/.test(__source__), "Add @media (min-width: 600px) { … }")' },
        { name: 'flex is inside the media query', code: 'assert(/@media[^{]*\\{[^}]*\\.cards[^}]*display\\s*:\\s*flex/.test(__source__), "Put .cards { display: flex; } inside the media query")' },
        cssIs('.cards', 'display', 'flex', 'At 800px wide, .cards should be flex'),
        pxIs('.cards', 'column-gap', 16, 'Set gap: 16px inside the media query'),
      ],
      hints: ['@media (min-width: 600px) {\n  …\n}', '@media (min-width: 600px) {\n  .cards { display: flex; gap: 16px; }\n}'],
      solution: page('<div class="cards">\n  <div class="card">One</div>\n  <div class="card">Two</div>\n  <div class="card">Three</div>\n</div>', '    .card { border: 2px solid #7452FF; padding: 12px; margin-bottom: 8px; }\n    .cards { display: block; }\n    @media (min-width: 600px) {\n      .cards { display: flex; gap: 16px; }\n    }'),
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'wb-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Which tag makes a paragraph?', ['<p>', '<para>', '<text>'], 0, '<p>.'),
      fillH('Show an image.', '<img ___="pip.png" alt="Pip">', [['src']], 'src = the image source.', ['src', 'href', 'link']),
      mc('Visible page content goes in…', ['<body>', '<head>', '<title>'], 0, 'The body.'),
      mc('Which tag wraps the page\'s main content?', ['<main>', '<div>', '<body2>'], 0, '<main>.'),
      mc('A label is connected to an input by…', ['label for = input id', 'label name = input name', 'putting them on the same line'], 0, 'for → id.'),
      mc('A decorative image should have…', ['alt=""', 'no alt attribute', 'alt="decoration image"'], 0, 'Empty alt = skip it.'),
      mc('For an action like "Save", use…', ['<button>', '<div>', '<span>'], 0, 'Keyboard + screen reader support.'),
      web({ prompt: 'Write an `<ol>` with exactly **2** items: **Wake up** and **Code**.', starter: '<!-- your list -->\n', tests: [countIs('ol li', 2, 'Make an <ol> with 2 <li> items'), textIs('ol li:first-child', 'Wake up'), textIs('ol li:last-child', 'Code')], solution: '<ol>\n  <li>Wake up</li>\n  <li>Code</li>\n</ol>\n' }),
    ],
  },
  'wb-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mcT('Which selector matches <div id="hero">?', ['#hero', '.hero', 'hero'], 0, '# = id.'),
      mc('Which wins: a class rule or a tag rule?', ['The class rule', 'The tag rule', 'Whichever is shorter'], 0, 'More specific wins.'),
      mc('Space outside the border is…', ['margin', 'padding'], 0, 'Margin.'),
      ansT('content-box: width 100px, padding 5px, border 1px. Total width in px?', ['112', '112px'], '100 + 10 + 2.', '.b { width: 100px; padding: 5px; border: 1px solid; }'),
      mc('Flexbox lays items out in…', ['one direction', 'two directions'], 0, 'Row or column.'),
      mc('`grid-template-columns: 1fr 1fr` makes…', ['2 equal columns', '1 column', '2 rows'], 0, 'Two equal shares.'),
      mcT('Applies on screens…', ['900px and wider', 'narrower than 900px'], 0, 'min-width.', '@media (min-width: 900px) { … }'),
      web({ prompt: 'Center the box: make `.wrap` a flex container with `justify-content: center` and `align-items: center`.', starter: page('<div class="wrap" style="height: 200px; background: #eee;">\n  <div>Centered!</div>\n</div>', '    /* your CSS here */'), tests: [cssIs('.wrap', 'display', 'flex', 'display: flex'), cssIs('.wrap', 'justify-content', 'center', 'justify-content: center'), cssIs('.wrap', 'align-items', 'center', 'align-items: center')], solution: page('<div class="wrap" style="height: 200px; background: #eee;">\n  <div>Centered!</div>\n</div>', '    .wrap {\n      display: flex;\n      justify-content: center;\n      align-items: center;\n    }') }),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  'web-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('HTML describes a page\'s…', ['structure and content', 'colors and layout only', 'server code'], 0, 'CSS does the look.'),
      ansH('What tag name is used for a link?', ['a', '<a>'], '<a href="…">.'),
      mc('The text in the browser tab comes from…', ['<title>', '<h1>', '<header>'], 0, 'The title, in the head.'),
      mc('Which input type gives phones a number keyboard?', ['number', 'text', 'digits'], 0, 'type="number".'),
      mc('Minimum contrast for normal text (WCAG AA)?', ['4.5 : 1', '3 : 1', '1 : 1'], 0, '4.5 : 1.'),
      mcT('What color is the text?', ['red', 'blue'], 0, 'An id beats a class.', '.x { color: blue; }\n#y { color: red; }\n\n<p class="x" id="y">Hi</p>'),
      ansT('border-box: width 150px, padding 20px. Total width in px?', ['150', '150px'], 'border-box includes padding.', '.b { box-sizing: border-box; width: 150px; padding: 20px; }'),
      mc('To put space between flex items, use…', ['gap', 'margin: auto', 'padding'], 0, 'gap.'),
      mc('A page layout with rows AND columns is a job for…', ['grid', 'flexbox only', 'tables'], 0, 'Grid is 2D.'),
      web({ prompt: 'Build a tiny profile card: a `<div class="profile">` containing an `<h2>` that says **Pip**, then style `.profile` with **16px** padding and a **2px solid** border.', starter: page('', '    /* your CSS here */'), tests: [textIs('.profile h2', 'Pip'), pxIs('.profile', 'padding-top', 16, 'padding: 16px'), cssIs('.profile', 'border-top-style', 'solid', 'border: 2px solid …'), pxIs('.profile', 'border-top-width', 2, 'border width 2px')], solution: page('<div class="profile">\n  <h2>Pip</h2>\n</div>', '    .profile {\n      padding: 16px;\n      border: 2px solid #333;\n    }') }),
    ],
  },
};
