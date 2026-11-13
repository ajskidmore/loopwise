/**
 * Track: grad-ready — "Grad School Readiness"
 * Written here: gr-1 (applying), gr-2 (succeeding), gr-3 (capstones) + checkpoints + course final exam.
 *
 * Admissions details (requirements, costs, deadlines) change often, so lessons stay general and send learners
 * to each program's official website instead of stating facts that could go stale.
 * The capstones are multi-step Python projects: an interpreter, a route planner and ML from scratch.
 */
import type { Checkpoint, Step } from '../types';
import { ans, eq, ex, fillT, mc, mcT, ord, py } from './_helpers';

const ordT = (prompt: string, lines: string[], explanation: string) => ord(prompt, lines, explanation, 'text');

const CITY = '{"Home": [("Cafe", 4), ("Park", 2)], "Park": [("Cafe", 1), ("Library", 7)], "Cafe": [("Library", 3)], "Library": [("Home", 10)], "Zoo": []}';

/** The tokenizer from the interpreter capstone, given to learners in the next exercise's starter. */
const TOKENIZE = 'def tokenize(s):\n    tokens = []\n    i = 0\n    while i < len(s):\n        ch = s[i]\n        if ch.isdigit():\n            j = i\n            while j < len(s) and s[j].isdigit():\n                j += 1\n            tokens.append(int(s[i:j]))\n            i = j\n        elif ch in "+-*/()":\n            tokens.append(ch)\n            i += 1\n        else:\n            i += 1   # skip spaces\n    return tokens\n';

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ gr-1-programs
  'gr-1-programs': [
    ex('Your options', 'You can earn a CS master\'s without moving or quitting your job. Several well-known universities run **online** CS master\'s programs (Georgia Tech\'s OMSCS is a famous example), alongside in-person degrees and shorter certificates.\n\nThings to compare:\n\n- total **cost**\n- **admission** requirements\n- **specializations** (machine learning, systems, …)\n- course **format** and pace\n- how long students usually take to finish', 'This course is about getting in and thriving. It ends with three capstone projects that pull together everything you\'ve learned.'),
    mc('Where should you check a program\'s current admission requirements?', ['The program\'s official website', 'A forum post from a few years ago', 'A friend who applied once'], 0, 'Requirements, costs and deadlines change. Always confirm on the official site.'),
    ex('What applications usually ask for', 'Most programs ask for some mix of:\n\n- a **bachelor\'s degree** (some accept any major)\n- **transcripts**\n- a **statement of purpose**\n- **recommendation** letters\n- a **résumé**\n\nIf your degree isn\'t in CS, programs look for **evidence** that you\'re ready: courses (like the ones you\'ve finished here), projects and work experience.'),
    mc('Your degree is in history. How can you show you\'re ready for a CS master\'s?', ['Complete foundational CS coursework and build real projects', 'Leave it out of your application', 'You can\'t'], 0, 'Evidence beats background. Courses plus a portfolio tell a strong story.'),
    ex('Finding your fit', '- **Specialization:** does the program go deep in what you care about?\n- **Pace:** most working students take about **one course per term**, sometimes two.\n- **Community:** forums, study groups, office hours.\n- **Reviews:** current students\' course reviews tell you about workload.'),
    mc('You work full-time. What\'s a sustainable pace for most people?', ['One course per term, sometimes two', 'Five courses per term'], 0, 'Finishing slowly beats burning out. Many students take a few years, and that\'s normal.'),
    py({
      prompt: 'Make a decision matrix. `programs` maps a program name to its scores (1–5) for each factor; `weights` says how much each factor matters to you.\n\nWrite `best_program(programs, weights)` that returns the **name** with the highest weighted total (the sum of score × weight).',
      starter: 'def best_program(programs, weights):\n    pass\n',
      tests: [
        eq('best_program({"A": {"cost": 5, "ml": 2}, "B": {"cost": 3, "ml": 5}}, {"cost": 1, "ml": 2})', '"B"', 'B wins when ML matters more'),
        eq('best_program({"A": {"cost": 5, "ml": 2}, "B": {"cost": 3, "ml": 5}}, {"cost": 3, "ml": 1})', '"A"', 'A wins when cost matters more'),
      ],
      hints: ['def total(scores): return sum(scores[f] * w for f, w in weights.items())', 'return max(programs, key=lambda name: total(programs[name]))'],
      solution: 'def best_program(programs, weights):\n    def total(scores):\n        return sum(scores[f] * w for f, w in weights.items())\n\n    return max(programs, key=lambda name: total(programs[name]))\n',
    }),
  ],

  // ------------------------------------------------------------------ gr-1-statement
  'gr-1-statement': [
    ex('What the statement is for', 'Your **statement of purpose** answers four questions:\n\n1. **Why** this field, and why **now**?\n2. What **evidence** shows you\'ll succeed?\n3. Why **this** program?\n4. What will you **do** with the degree?\n\nIt\'s a story backed by facts, not a list of adjectives.'),
    ex('A simple structure', '1. **Hook:** a specific moment, like the problem that pulled you into CS.\n2. **Evidence:** courses, projects and results, with numbers where you can.\n3. **Goals:** what you want to learn and build.\n4. **Fit:** specific courses or areas in this program that match those goals.\n5. **Close:** tie it back to your story.'),
    mc('Which opening line is strongest?', ['"Last spring I turned my team\'s 6-hour weekly report into a 5-minute Python script, and I wanted to understand how to build much bigger systems."', '"I have always been passionate about computers."', '"Webster\'s dictionary defines computer science as…"'], 0, 'Specific, true and shows initiative. The others could be written by anyone.'),
    mc('"Show, don\'t tell" means…', ['describe what you built and what happened as a result', 'list positive adjectives about yourself'], 0, '"I built X, which cut Y by Z%" beats "I am hard-working".'),
    ex('Handling weak spots', 'A low GPA from years ago? A gap in your résumé? Address it **briefly and honestly**, then point to **recent evidence**: strong grades in recent courses, finished projects, work achievements.\n\nCommon mistakes: generic text you could send anywhere, going over the length limit, and typos. Have someone proofread it.'),
    mc('You had a low GPA years ago. What\'s the best approach?', ['Briefly explain it, then show recent evidence like strong course grades and projects', 'Ignore it and hope nobody notices', 'Spend half the statement apologizing'], 0, 'One honest sentence plus strong recent evidence.'),
    ex('Recommendation letters', 'Choose people who know your **work** closely: a manager, a professor, a technical lead. Ask **early** (weeks ahead), and give them a short list of projects and results they can mention.'),
    mc('Who is usually the best recommender?', ['A manager who watched you lead a technical project', 'A famous person who barely knows you'], 0, 'Specific, first-hand detail matters more than a big name.'),
    py({
      prompt: 'Statements often have word limits. Write `word_count(text)` (count words separated by whitespace) and `fits(text, limit)`, which returns True if the word count is at most `limit`.',
      starter: 'def word_count(text):\n    pass\n\n\ndef fits(text, limit):\n    pass\n',
      tests: [eq('word_count("I build tools that save time.")', '6'), eq('word_count("  spaced   out  ")', '2'), eq('word_count("")', '0'), eq('fits("one two three", 3)', 'True'), eq('fits("one two three", 2)', 'False')],
      hints: ['text.split() splits on any whitespace and ignores extra spaces.', 'word_count: return len(text.split()); fits: return word_count(text) <= limit'],
      solution: 'def word_count(text):\n    return len(text.split())\n\n\ndef fits(text, limit):\n    return word_count(text) <= limit\n',
    }),
  ],

  // ------------------------------------------------------------------ gr-1-portfolio
  'gr-1-portfolio': [
    ex('Proof you can build', 'A **portfolio** shows what you can actually do. **Two or three finished projects** beat twenty copied tutorials.\n\nEach project should have a **README** that says:\n\n- what it does, and why\n- how to install and run it\n- a screenshot or example\n- what you learned, or would do next'),
    mc('Which impresses an admissions committee or employer more?', ['Two finished projects with clear READMEs and tests', 'Twenty half-finished copies of tutorials'], 0, 'Finished, explained and tested shows real skill.'),
    ex('Project ideas', 'You\'ve already learned enough for strong projects. The three capstones in this course are great starters:\n\n- a tiny **interpreter** (parsing, recursion)\n- a **route planner** (graphs, Dijkstra)\n- **machine learning from scratch** (math plus code)\n\nOr build a web app with a SQL database. Pick something **you** would actually use.'),
    ex('GitHub good habits', '- Commits with clear messages (“Add login form validation”, not “stuff”)\n- **Never commit secrets**: keep API keys in a `.env` file listed in `.gitignore`\n- Add tests, and automated checks (CI) if you can\n- Add a license so others know how they may use it'),
    mc('You accidentally pushed an API key to a public repository. What\'s the FIRST thing to do?', ['Revoke or rotate the key right away: deleting the commit isn\'t enough', 'Delete the file and move on', 'Make the repository private and do nothing else'], 0, 'Bots scan public repos for keys within minutes. Assume it\'s already copied.'),
    mc('What must every README include?', ['What the project does and how to run it', 'Your life story'], 0, 'A stranger should be able to try it in a few minutes.'),
    py({
      prompt: 'Write `missing_sections(readme)` that checks a README for the headings `## About`, `## Install` and `## Usage` (any capitalization). Return a list of the **missing** ones, in that order.',
      starter: 'REQUIRED = ["## About", "## Install", "## Usage"]\n\n\ndef missing_sections(readme):\n    pass\n',
      tests: [eq('missing_sections("# Pip\\n## About\\nA bot.\\n## Usage\\nrun it")', '["## Install"]'), eq('missing_sections("## ABOUT\\n## install\\n## usage")', '[]'), eq('missing_sections("")', '["## About", "## Install", "## Usage"]')],
      hints: ['Compare in lowercase: section.lower() in readme.lower()', 'return [s for s in REQUIRED if s.lower() not in readme.lower()]'],
      solution: 'REQUIRED = ["## About", "## Install", "## Usage"]\n\n\ndef missing_sections(readme):\n    text = readme.lower()\n    return [s for s in REQUIRED if s.lower() not in text]\n',
    }),
  ],

  // ------------------------------------------------------------------ gr-2-papers
  'gr-2-papers': [
    ex('Reading research papers', 'Grad courses assign **research papers**. Don\'t read them like a novel. A popular approach is the **three-pass method**:\n\n1. **First pass** (5–10 minutes): title, abstract, introduction, section headings and conclusion. *What is it about? Is it worth reading?*\n2. **Second pass** (about an hour): the main ideas and the figures; skip the proofs.\n3. **Third pass** (only if you need it): every detail. Try to re-create the work yourself.'),
    ordT('Put the three passes in order.', ['Skim the title, abstract, headings and conclusion', 'Read the main ideas and figures, skipping proofs', 'Work through every detail as if re-creating the paper'], 'Each pass goes deeper, and you can stop after any pass.'),
    mc('In the first pass, what do you read?', ['The title, abstract, introduction, headings and conclusion', 'Every proof, line by line'], 0, 'Get the big picture fast, then decide whether to go deeper.'),
    ex('Taking notes', 'For each paper, write down:\n\n- the **problem** it tackles\n- the **method**: its key idea\n- the **results**\n- the **limitations**: what it didn\'t test, and what\'s still open\n\nThose notes become gold for exams, projects and your own research ideas.'),
    mc('Which note is most useful later?', ['The paper\'s main claim, and its limitations', 'How many pages it has'], 0, 'Claim + evidence + limits is the heart of any paper.'),
    ex('Reading critically', 'Ask:\n\n- Is the evidence convincing?\n- What do they compare against (the **baselines**)?\n- What wasn\'t tested?\n\nPapers are arguments, not facts handed down. Your ML course gave you tools to spot weak evaluation.'),
    mc('A paper reports 99% accuracy, measured only on its training data. What\'s the concern?', ['There\'s no held-out test, so the model may simply be overfitting', 'Nothing: 99% is great'], 0, 'Train-only results say little about new data.'),
    py({
      prompt: 'Triage papers faster. Write `keyword_hits(abstract, keywords)` that returns a dict mapping each keyword to how many times it appears in the abstract, **ignoring capitalization**.',
      starter: 'def keyword_hits(abstract, keywords):\n    pass\n',
      tests: [eq('keyword_hits("Graph neural networks. We train a graph model.", ["graph", "train", "proof"])', '{"graph": 2, "train": 1, "proof": 0}'), eq('keyword_hits("", ["x"])', '{"x": 0}')],
      hints: ['text = abstract.lower()', 'return {k: text.count(k.lower()) for k in keywords}'],
      solution: 'def keyword_hits(abstract, keywords):\n    text = abstract.lower()\n    return {k: text.count(k.lower()) for k in keywords}\n',
    }),
  ],

  // ------------------------------------------------------------------ gr-2-latex
  'gr-2-latex': [
    ex('Writing math beautifully', 'Most CS papers and many homework assignments are written in **LaTeX**, a language for typesetting documents with math.\n\n- inline math: `$x^2 + y^2$`\n- powers: `x^2` (use braces for more than one character: `x^{10}`)\n- subscripts: `x_i`\n- fractions: `\\frac{a}{b}`, square roots: `\\sqrt{x}`\n- sums: `\\sum_{i=1}^{n} i`\n- Greek letters: `\\alpha`, `\\lambda`, `\\sigma`'),
    mcT('Which LaTeX produces x²?', ['x^2', 'x_2', 'x**2'], 0, '^ is a superscript. _ is a subscript.'),
    mcT('Which LaTeX produces x with a small i below it (x subscript i)?', ['x_i', 'x^i', 'x[i]'], 0, 'Underscore = subscript.'),
    mcT('Which LaTeX makes the fraction a over b?', ['\\frac{a}{b}', 'a/b{}', '\\div{a}{b}'], 0, '\\frac takes two arguments: the top and the bottom.'),
    mcT('What does this LaTeX mean?', ['1 + 2 + … + n', 'n to the power i', 'i divided by n'], 0, 'A sum of i, for i from 1 to n.', '\\sum_{i=1}^{n} i'),
    ex('A whole document', '```latex\n\\documentclass{article}\n\\begin{document}\n\\section{Results}\nThe loss fell to $0.12$.\n\\end{document}\n```\n\nMany students use **Overleaf**, a website that compiles LaTeX for you and supports group editing.'),
    fillT('Complete the LaTeX for the fraction one half.', '\\___{1}{2}', [['frac']], '\\frac{top}{bottom}.', ['frac', 'sqrt', 'sum', 'div']),
    py({
      prompt: 'Generate LaTeX with code. Write `latex_power(base, exp)` that returns `base^{exp}` as a string. For example, `latex_power("x", 10)` returns `x^{10}`.\n\n(Braces matter: `x^10` would only raise x to the 1!)',
      starter: 'def latex_power(base, exp):\n    pass\n',
      tests: [eq('latex_power("x", 10)', '"x^{10}"'), eq('latex_power("e", "-z")', '"e^{-z}"'), eq('latex_power(2, 3)', '"2^{3}"')],
      hints: ['An f-string needs doubled braces to print a brace: f"{{" prints {', 'return f"{base}^{{{exp}}}"'],
      solution: 'def latex_power(base, exp):\n    return f"{base}^{{{exp}}}"\n',
    }),
  ],

  // ------------------------------------------------------------------ gr-2-time
  'gr-2-time': [
    ex('A degree alongside a job', 'Working students juggle work, family and courses. Weekly workload **varies a lot** from course to course, so read current students\' reviews before you sign up.\n\nThe students who finish usually aren\'t the most brilliant. They\'re the ones with a **sustainable routine**.'),
    ex('A plan that holds up', '- Block **fixed study times** in your calendar, like meetings\n- **Start assignments in the first days**: small daily progress beats all-nighters\n- Leave **buffer** for when work or life explodes\n- Protect your **sleep**. Tired brains learn slowly and write bugs.'),
    mc('An assignment is due in two weeks. What\'s the best plan?', ['Start in the first few days and make steady progress', 'Start the night before'], 0, 'Early starts reveal the hard parts while there\'s still time to ask for help.'),
    ex('Study smarter', '- **Active recall**: test yourself instead of rereading\n- **Spaced repetition**: review on a schedule, just like Loopwise\'s Review mode\n- Use **office hours** and course forums\n- Study groups are great: discuss ideas, but follow each course\'s **collaboration policy** on sharing code'),
    mc('In a study group, what\'s the right approach?', ['Discuss ideas, but follow the course\'s collaboration policy', 'Share your finished code with everyone'], 0, 'Honor codes are taken very seriously. When in doubt, ask the instructor.'),
    mc('You notice you\'re exhausted and falling behind every week. What\'s wise?', ['Scale back, for example with a lighter course load next term', 'Push harder and sleep less'], 0, 'A degree is a marathon. Adjusting the pace is a strategy, not a failure.'),
    ans('A course needs about 15 hours a week. You can study 2 hours each weekday (5 days). How many weekend hours do you need?', ['5'], '15 − 5 × 2 = 5 hours.'),
    py({
      prompt: 'Write `weeks_needed(total_hours, hours_per_week)` that returns how many weeks a project will take, **rounded up** (a partial week still counts). Use `math.ceil`.',
      starter: 'import math\n\n\ndef weeks_needed(total_hours, hours_per_week):\n    pass\n',
      tests: [eq('weeks_needed(40, 10)', '4'), eq('weeks_needed(41, 10)', '5'), eq('weeks_needed(5, 10)', '1')],
      hints: ['return math.ceil(total_hours / hours_per_week)'],
      solution: 'import math\n\n\ndef weeks_needed(total_hours, hours_per_week):\n    return math.ceil(total_hours / hours_per_week)\n',
    }),
  ],

  // ------------------------------------------------------------------ gr-3-capstone-1
  'gr-3-capstone-1': [
    ex('Capstone: build an interpreter', 'Every programming language runs through an **interpreter** or a compiler. Let\'s build one for arithmetic like `(2 + 3) * 4`, in three stages:\n\n1. **Tokenize:** `"2+34"` → `[2, "+", 34]`\n2. **Parse:** the tokens become a structure that follows the grammar (from Theory of Computation)\n3. **Evaluate:** compute the answer\n\nReal languages work exactly like this, just with more rules.', 'Capstones are bigger than normal exercises. Take your time and use the hints.'),
    py({
      prompt: '**Step 1: the tokenizer.** Write `tokenize(s)`, which returns a list of tokens:\n\n- runs of digits become **ints**: `"34"` → `34`\n- each of `+ - * / ( )` becomes a one-character string\n- spaces are skipped\n\n```\ntokenize("2 + 34*(5-1)") → [2, "+", 34, "*", "(", 5, "-", 1, ")"]\n```',
      starter: 'def tokenize(s):\n    pass\n',
      tests: [eq('tokenize("2 + 34*(5-1)")', '[2, "+", 34, "*", "(", 5, "-", 1, ")"]'), eq('tokenize("7")', '[7]'), eq('tokenize("  ")', '[]')],
      hints: ['Walk through s with an index i in a while loop. If s[i] is a digit, move j forward while digits continue, then append int(s[i:j]).', 'elif ch in "+-*/()": append it. Otherwise (a space), just skip it with i += 1.'],
      solution: TOKENIZE,
    }),
    ex('Recursive descent parsing', 'The grammar, with multiplication binding tighter than addition:\n\n```\nexpr   → term   (("+" | "-") term)*\nterm   → factor (("*" | "/") factor)*\nfactor → number | "(" expr ")"\n```\n\n**Recursive descent** = one function per rule, each calling the others. Keep a position `pos` in the token list, and each function moves it forward as it reads tokens.'),
    mc('Why does `expr` handle + and −, while `term` handles * and /?', ['So multiplication groups tighter: 2 + 3 * 4 = 2 + (3 * 4)', 'It\'s just alphabetical', 'It makes the code faster'], 0, 'The grammar\'s structure gives you operator precedence for free.'),
    py({
      prompt: '**Step 2: parse and evaluate.** The tokenizer is provided. Write `evaluate(s)` that computes the value of an expression using recursive descent (expr, term and factor functions).\n\n```\nevaluate("2 + 3 * 4")   → 14\nevaluate("(2 + 3) * 4") → 20\nevaluate("10 - 4 - 3")  → 3     (left to right!)\n```',
      starter: TOKENIZE + '\n\ndef evaluate(s):\n    tokens = tokenize(s)\n    pos = 0\n    # write expr(), term() and factor() inside here\n    pass\n',
      tests: [eq('evaluate("2 + 3 * 4")', '14'), eq('evaluate("(2 + 3) * 4")', '20'), eq('evaluate("10 - 4 - 3")', '3'), eq('evaluate("8 / 2")', '4.0'), eq('evaluate("7")', '7'), eq('evaluate("2 * (3 + (4 - 1))")', '12')],
      hints: [
        'Inside evaluate, define helpers that share pos using `nonlocal pos`:\n\ndef peek(): return tokens[pos] if pos < len(tokens) else None\ndef take():\n    nonlocal pos\n    pos += 1\n    return tokens[pos - 1]',
        'def factor():\n    if peek() == "(":\n        take(); v = expr(); take(); return v\n    return take()\n\ndef term():\n    v = factor()\n    while peek() in ("*", "/"):\n        op = take(); r = factor()\n        v = v * r if op == "*" else v / r\n    return v',
        'expr() is just like term(), but with + and − and calling term(). Finally: return expr()',
      ],
      solution: TOKENIZE + '\n\ndef evaluate(s):\n    tokens = tokenize(s)\n    pos = 0\n\n    def peek():\n        return tokens[pos] if pos < len(tokens) else None\n\n    def take():\n        nonlocal pos\n        pos += 1\n        return tokens[pos - 1]\n\n    def factor():\n        if peek() == "(":\n            take()          # (\n            v = expr()\n            take()          # )\n            return v\n        return take()       # a number\n\n    def term():\n        v = factor()\n        while peek() in ("*", "/"):\n            op = take()\n            r = factor()\n            v = v * r if op == "*" else v / r\n        return v\n\n    def expr():\n        v = term()\n        while peek() in ("+", "-"):\n            op = take()\n            r = term()\n            v = v + r if op == "+" else v - r\n        return v\n\n    return expr()\n',
    }),
    ex('Where to go from here', 'You just built the core of a programming language! To grow it into a portfolio project:\n\n- **variables**: `let x = 5`\n- **comparisons and if**\n- **functions**\n- error messages with line numbers\n\nThat\'s the path from a calculator to a real language. Put it on GitHub with a great README.'),
  ],

  // ------------------------------------------------------------------ gr-3-capstone-2
  'gr-3-capstone-2': [
    ex('Capstone: route planner', 'A map is a **weighted graph**: places are nodes, and roads are edges weighted by travel minutes.\n\n```python\ncity = {\n  "Home":    [("Cafe", 4), ("Park", 2)],\n  "Park":    [("Cafe", 1), ("Library", 7)],\n  "Cafe":    [("Library", 3)],\n  "Library": [("Home", 10)],\n  "Zoo":     [],\n}\n```\n\n**Dijkstra\'s algorithm** (from Algorithms) finds the fastest routes. It uses a **priority queue** (`heapq`) to always expand the closest unfinished place next.'),
    mc('What does Dijkstra\'s algorithm require?', ['No negative edge weights', 'The graph must be a tree', 'Every edge must have the same weight'], 0, 'Negative weights break its "closest first" logic (Bellman–Ford handles those).'),
    py({
      prompt: '**Step 1.** Write `dijkstra(graph, start)` that returns a dict mapping each **reachable** place to its shortest travel time from `start`. Use `heapq`.',
      starter: 'import heapq\n\n\ndef dijkstra(graph, start):\n    pass\n',
      tests: [eq(`dijkstra(${CITY}, "Home")`, '{"Home": 0, "Park": 2, "Cafe": 3, "Library": 6}'), eq(`dijkstra(${CITY}, "Zoo")`, '{"Zoo": 0}')],
      hints: ['dist = {}; heap = [(0, start)]. While heap: d, node = heapq.heappop(heap). If node is already in dist, continue. Otherwise dist[node] = d.', 'Then for each (nxt, cost) in graph[node]: if nxt not in dist, heapq.heappush(heap, (d + cost, nxt)). Return dist.'],
      solution: 'import heapq\n\n\ndef dijkstra(graph, start):\n    dist = {}\n    heap = [(0, start)]\n    while heap:\n        d, node = heapq.heappop(heap)\n        if node in dist:\n            continue\n        dist[node] = d\n        for nxt, cost in graph[node]:\n            if nxt not in dist:\n                heapq.heappush(heap, (d + cost, nxt))\n    return dist\n',
    }),
    ex('Getting the actual route', 'Knowing the time isn\'t enough. People want **directions**! Track where you came from: when you settle a place, remember its `previous` place. Then walk backward from the goal to the start, and reverse the list.'),
    py({
      prompt: '**Step 2.** Write `shortest_path(graph, start, goal)` that returns `(minutes, [path of places])`. If the goal can\'t be reached, return `(None, [])`.',
      starter: 'import heapq\n\n\ndef shortest_path(graph, start, goal):\n    pass\n',
      tests: [eq(`shortest_path(${CITY}, "Home", "Library")`, '(6, ["Home", "Park", "Cafe", "Library"])'), eq(`shortest_path(${CITY}, "Home", "Home")`, '(0, ["Home"])'), eq(`shortest_path(${CITY}, "Home", "Zoo")`, '(None, [])')],
      hints: ['Push (distance, node, previous) onto the heap. When you settle a node, also store prev[node] = previous.', 'When goal is settled: build the path by following prev from goal back to start (prev[start] is None), then reverse it.'],
      solution: 'import heapq\n\n\ndef shortest_path(graph, start, goal):\n    dist, prev = {}, {}\n    heap = [(0, start, None)]\n    while heap:\n        d, node, before = heapq.heappop(heap)\n        if node in dist:\n            continue\n        dist[node] = d\n        prev[node] = before\n        if node == goal:\n            path = []\n            while node is not None:\n                path.append(node)\n                node = prev[node]\n            return (d, path[::-1])\n        for nxt, cost in graph[node]:\n            if nxt not in dist:\n                heapq.heappush(heap, (d + cost, nxt, node))\n    return (None, [])\n',
    }),
    mc('Real map apps handle millions of roads. How do they stay fast?', ['They add smarter searches like A* and precomputed shortcuts on top of Dijkstra-style ideas', 'They try random routes'], 0, 'Same core idea, plus engineering for scale.'),
  ],

  // ------------------------------------------------------------------ gr-3-capstone-3
  'gr-3-capstone-3': [
    ex('Capstone: ML from scratch', 'Train a real classifier with nothing but Python: **logistic regression** with **gradient descent**.\n\nThe plan:\n\n1. **Data:** hours studied (x) and passed or not (y = 1 or 0)\n2. **Model:** p = σ(w·x + b)\n3. **Loss:** log loss\n4. **Gradients** and a training loop\n5. **Evaluate** on data the model hasn\'t seen'),
    ex('The gradients', 'With **log loss**, logistic regression\'s gradients come out beautifully simple. Averaged over all n examples:\n\n- **dw = average of (p − y)·x**\n- **db = average of (p − y)**\n\nwhere p = σ(w·x + b) is the predicted probability. Then step: w ← w − rate·dw, b ← b − rate·db.'),
    mc('Why use log loss instead of MSE for classification?', ['It punishes confident wrong answers hard and gives clean gradients', 'It\'s shorter to type'], 0, 'Being 99% sure and wrong should cost a lot.'),
    py({
      prompt: 'Write `train_logistic(xs, ys, rate, epochs)` for **one** feature. Start at w = 0, b = 0, and each epoch use the gradients from the card. Return `(w, b)`.\n\nThe tests check that your trained model classifies every training example correctly.',
      starter: 'import math\n\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\n\ndef train_logistic(xs, ys, rate, epochs):\n    w, b = 0.0, 0.0\n    # your code here\n    return (w, b)\n',
      tests: [
        { name: 'separates passing from failing', code: 'xs = [1, 2, 3, 6, 7, 8]\nys = [0, 0, 0, 1, 1, 1]\nw, b = train_logistic(xs, ys, 0.1, 3000)\npreds = [1 if sigmoid(w * x + b) >= 0.5 else 0 for x in xs]\nassert preds == ys, f"predictions {preds} should be {ys} (w={w:.2f}, b={b:.2f})"' },
        { name: 'learns a positive slope', code: 'w, b = train_logistic([1, 2, 3, 6, 7, 8], [0, 0, 0, 1, 1, 1], 0.1, 3000)\nassert w > 0, "more hours should mean a higher chance of passing (w > 0)"' },
      ],
      hints: ['n = len(xs). Each epoch: ps = [sigmoid(w * x + b) for x in xs]', 'dw = sum((p - y) * x for p, y, x in zip(ps, ys, xs)) / n; db = sum(p - y for p, y in zip(ps, ys)) / n; w -= rate * dw; b -= rate * db'],
      solution: 'import math\n\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\n\ndef train_logistic(xs, ys, rate, epochs):\n    w, b = 0.0, 0.0\n    n = len(xs)\n    for _ in range(epochs):\n        ps = [sigmoid(w * x + b) for x in xs]\n        dw = sum((p - y) * x for p, y, x in zip(ps, ys, xs)) / n\n        db = sum(p - y for p, y in zip(ps, ys)) / n\n        w -= rate * dw\n        b -= rate * db\n    return (w, b)\n',
    }),
    py({
      prompt: 'Evaluate on new data. Write `test_accuracy(w, b, xs, ys)`: the fraction of examples where the prediction (1 if σ(w·x + b) ≥ 0.5, else 0) matches the label.',
      starter: 'import math\n\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\n\ndef test_accuracy(w, b, xs, ys):\n    pass\n',
      tests: [eq('test_accuracy(1, -4.5, [4, 5, 0, 10], [0, 1, 0, 1])', '1.0'), eq('test_accuracy(1, -4.5, [4, 5], [1, 1])', '0.5')],
      hints: ['preds = [1 if sigmoid(w * x + b) >= 0.5 else 0 for x in xs]', 'return sum(p == y for p, y in zip(preds, ys)) / len(ys)'],
      solution: 'import math\n\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\n\ndef test_accuracy(w, b, xs, ys):\n    preds = [1 if sigmoid(w * x + b) >= 0.5 else 0 for x in xs]\n    return sum(p == y for p, y in zip(preds, ys)) / len(ys)\n',
    }),
    ex('You made it 🎓', 'You just trained a machine learning model from nothing but math and Python. That\'s the same loop that powers modern AI: model → loss → gradients → update.\n\nNext steps: rebuild it with **numpy** on your own computer, then try **PyTorch**. Pick one capstone, polish it, and put it in your portfolio.', 'From "what is code?" to training your own model. Pip is very proud of you!'),
    mc('You\'ve finished the curriculum. What\'s the best next step?', ['Build and polish projects, apply, and keep learning by doing', 'Stop coding and wait'], 0, 'Skills grow by using them. Go build something!'),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'gr-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('The most reliable source for admission requirements is…', ['the program\'s official website', 'an old forum post'], 0, 'Rules change.'),
      mc('A non-CS graduate can best show readiness with…', ['CS coursework and finished projects', 'a longer statement'], 0, 'Evidence.'),
      mc('A strong statement of purpose…', ['tells a specific story backed by evidence', 'lists adjectives about you'], 0, 'Show, don\'t tell.'),
      mc('A good recommender…', ['knows your work closely', 'is famous'], 0, 'First-hand detail.'),
      mc('A strong portfolio project has…', ['a clear README and is finished', 'hundreds of files'], 0, 'Finished + explained.'),
      mc('A key was pushed to a public repo. First step?', ['rotate/revoke the key', 'delete the commit only'], 0, 'Assume it leaked.'),
      py({ prompt: 'Write `longest_word(text)`: return the longest word (the first one if there\'s a tie).', starter: 'def longest_word(text):\n    pass\n', tests: [eq('longest_word("I built a compiler")', '"compiler"'), eq('longest_word("aa bb")', '"aa"')], solution: 'def longest_word(text):\n    return max(text.split(), key=len)\n' }),
    ],
  },
  'gr-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('The first pass over a paper takes about…', ['5–10 minutes', 'a whole day'], 0, 'Just the big picture.'),
      mc('During the second pass you usually skip…', ['the detailed proofs', 'the figures'], 0, 'Figures carry the ideas.'),
      mcT('Which LaTeX writes x to the power 10?', ['x^{10}', 'x^10', 'x_{10}'], 0, 'Braces group the exponent.'),
      mcT('In LaTeX, \\sqrt{x} produces…', ['the square root of x', 'x squared'], 0, 'sqrt.'),
      mc('Starting assignments early mainly helps you…', ['find the hard parts while there\'s time to get help', 'impress classmates'], 0, 'Time to ask.'),
      mc('Testing yourself instead of rereading is called…', ['active recall', 'passive review'], 0, 'Active recall.'),
      py({ prompt: 'Write `latex_frac(a, b)`: return the LaTeX string for the fraction a over b, using \\frac.', starter: 'def latex_frac(a, b):\n    pass\n', tests: [eq('latex_frac(1, 2)', '"\\\\frac{1}{2}"'), eq('latex_frac("x", "y")', '"\\\\frac{x}{y}"')], hints: ['return "\\\\frac{" + str(a) + "}{" + str(b) + "}"'], solution: 'def latex_frac(a, b):\n    return "\\\\frac{" + str(a) + "}{" + str(b) + "}"\n' }),
    ],
  },
  'gr-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('The interpreter\'s stages, in order:', ['tokenize, parse, evaluate', 'evaluate, parse, tokenize'], 0, 'Text → tokens → structure → value.'),
      mc('Recursive descent uses…', ['one function per grammar rule', 'one giant loop'], 0, 'Functions mirror the grammar.'),
      mc('Dijkstra always expands…', ['the closest unfinished node', 'a random node'], 0, 'Closest first, via a priority queue.'),
      mc('To get the actual route, you also store…', ['each node\'s previous node', 'the total number of edges'], 0, 'Then walk back.'),
      mc('Logistic regression\'s gradient for b is the average of…', ['(p − y)', '(p − y)²'], 0, 'With log loss.'),
      py({ prompt: 'Write `path_cost(graph, path)`: the total minutes along a path (list of places), using the edge costs in `graph` (place → list of (neighbor, cost)).', starter: 'def path_cost(graph, path):\n    pass\n', tests: [eq(`path_cost(${CITY}, ["Home", "Park", "Cafe", "Library"])`, '6'), eq(`path_cost(${CITY}, ["Home"])`, '0')], hints: ['For each consecutive pair (a, b), find the cost: dict(graph[a])[b]'], solution: 'def path_cost(graph, path):\n    return sum(dict(graph[a])[b] for a, b in zip(path, path[1:]))\n' }),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  'grad-ready': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Typical sustainable pace while working full-time:', ['one course per term (sometimes two)', 'four or more courses'], 0, 'Marathon, not sprint.'),
      mc('Where do secrets like API keys belong?', ['a .env file listed in .gitignore', 'the README'], 0, 'Never commit them.'),
      mc('The three-pass method reads a paper…', ['in increasingly deep passes', 'once, slowly, from start to finish'], 0, 'Skim → understand → master.'),
      mc('A paper evaluated only on training data may be…', ['overfitting', 'perfect'], 0, 'No held-out test.'),
      mcT('LaTeX for x subscript n:', ['x_n', 'x^n'], 0, 'Underscore.'),
      mc('In the arithmetic grammar, * is handled in term so that…', ['it binds tighter than +', 'it runs first in the file'], 0, 'Precedence.'),
      mc('Dijkstra fails with…', ['negative edge weights', 'large graphs'], 0, 'Use Bellman–Ford.'),
      mc('The core loop of training a model is…', ['model → loss → gradients → update', 'guess → hope → repeat'], 0, 'Gradient descent.'),
      py({ prompt: 'Write `tokenize_words(s)`: return a list of the lowercase words in s, ignoring punctuation (keep only letters a–z; anything else separates words).', starter: 'def tokenize_words(s):\n    pass\n', tests: [eq('tokenize_words("Hello, world! Pip-bot.")', '["hello", "world", "pip", "bot"]'), eq('tokenize_words("...")', '[]')], hints: ['Build words letter by letter: if ch.isalpha(), add ch.lower() to the current word; otherwise, finish the current word (if any).', 'Remember to add the last word after the loop.'], solution: 'def tokenize_words(s):\n    words, cur = [], ""\n    for ch in s:\n        if ch.isalpha():\n            cur += ch.lower()\n        elif cur:\n            words.append(cur)\n            cur = ""\n    if cur:\n        words.append(cur)\n    return words\n' }),
    ],
  },
};
