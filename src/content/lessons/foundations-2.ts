/**
 * Track: foundations — "How Computers Think"
 * Written here: fnd-2, fnd-3 (lessons + checkpoints) and the course final exam.
 */
import type { Checkpoint, Step } from '../types';
import { ans as ansPy, ex, mc as mcPy, ord } from './_helpers';

// Code shown in this course is pseudocode, not Python — label it as plain text.
const ans: typeof ansPy = (...a) => { const s = ansPy(...a); return s.code ? { ...s, language: 'text' } : s; };
const mc: typeof mcPy = (...a) => { const s = mcPy(...a); return s.code ? { ...s, language: 'text' } : s; };

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ fnd-2-hardware
  'fnd-2-hardware': [
    ex('Three parts to know', 'Every computer — laptop, phone or server — has three parts programmers think about all the time:\n\n- **CPU** (processor): does the work. It follows instructions, billions per second.\n- **Memory** (RAM): a fast, temporary workspace for the program that is running right now.\n- **Storage** (SSD or hard drive): slower, long-term space where files are kept.', 'Think of a kitchen: the CPU is the chef, RAM is the countertop, storage is the pantry.'),
    mc('Which part actually carries out a program\'s instructions?', ['Storage', 'The CPU', 'The screen', 'RAM'], 1, 'The CPU (central processing unit) is the part that runs instructions.'),
    ex('Memory forgets, storage remembers', '**RAM is erased when the power goes off.** That\'s why unsaved work disappears when your laptop dies.\n\n**Storage keeps data** with the power off — your photos, documents and apps live there.\n\nWhen you open an app, it is copied from storage into RAM so the CPU can work with it quickly.'),
    mc('Your laptop battery dies before you save an essay. Where was the unsaved work?', ['In storage', 'In RAM', 'In the CPU\'s fan', 'On the internet'], 1, 'Unsaved work lives in RAM, which is wiped when power is lost. Saving copies it to storage.'),
    mc('Which is usually the FASTEST to read from?', ['RAM', 'A hard drive', 'A USB stick'], 0, 'RAM is many times faster than storage. That\'s why programs are loaded into RAM to run.'),
    ord('Put these in order from what happens first to last when you open a photo app.', ['The app is copied from storage into RAM', 'The CPU runs the app\'s instructions', 'The photo appears on screen'], 'Load into memory → run → show output.'),
    mc('In the kitchen picture, the pantry where ingredients are kept for a long time is…', ['The CPU', 'RAM', 'Storage'], 2, 'Storage keeps things long-term, like a pantry.'),
    mc('A variable in your program (like a score in a game) lives where while the program runs?', ['RAM (memory)', 'Inside the keyboard', 'Only on the screen'], 0, 'Running programs keep their data in memory. You\'ll create your own variables in Python soon.'),
  ],

  // ------------------------------------------------------------------ fnd-2-bits
  'fnd-2-bits': [
    ex('Everything is 0s and 1s', 'Deep down, computers store everything — numbers, text, photos, music — using tiny switches that are either **off (0)** or **on (1)**.\n\nOne switch is called a **bit** (short for *binary digit*).'),
    mc('What is a bit?', ['A single 0 or 1', 'A small program', 'A letter of the alphabet', 'A type of screen'], 0, 'A bit is the smallest piece of data: one 0 or 1.'),
    ex('Bytes', 'Bits are grouped in eights. **8 bits = 1 byte.**\n\nWith 1 bit you can make 2 patterns: `0`, `1`.\nWith 2 bits, 4 patterns: `00`, `01`, `10`, `11`.\nEvery extra bit **doubles** the number of patterns. So 8 bits make 2⁸ = **256** patterns.', 'That\'s why one byte can store a number from 0 to 255.'),
    ans('How many bits are in one byte?', ['8'], '8 bits = 1 byte.'),
    ans('How many different patterns can 3 bits make?', ['8'], '2 × 2 × 2 = 8: 000, 001, 010, 011, 100, 101, 110, 111.'),
    ex('Bigger units', '- **Kilobyte (KB)** ≈ 1,000 bytes — a short text file\n- **Megabyte (MB)** ≈ 1,000 KB — a photo or a song\n- **Gigabyte (GB)** ≈ 1,000 MB — a movie; phone RAM is a few GB\n- **Terabyte (TB)** ≈ 1,000 GB — a big hard drive\n\n(Sometimes each step is 1,024 instead of 1,000 because 1,024 = 2¹⁰.)'),
    ord('Order these from smallest to largest.', ['bit', 'byte', 'kilobyte', 'megabyte', 'gigabyte'], 'bit < byte (8 bits) < KB < MB < GB.'),
    mc('How is the letter "A" stored in a computer?', ['As a tiny picture of an A', 'As a number, written in bits', 'It can\'t be stored', 'As the sound "ay"'], 1, 'Text is stored as numbers. In the common ASCII/Unicode codes, "A" is the number 65 — stored as bits.'),
    ans('A byte can hold 256 patterns. If the smallest number it stores is 0, what is the largest?', ['255'], 'Counting 0, 1, 2 … 255 gives 256 numbers in total.'),
  ],

  // ------------------------------------------------------------------ fnd-2-files
  'fnd-2-files': [
    ex('Files and folders', 'Storage is organized into **files** (a document, a photo, a program) and **folders** (also called **directories**) that hold files and other folders.\n\nFolders inside folders form a **tree**, starting at a top folder called the **root**.'),
    ex('File extensions', 'The end of a file name usually says what kind of file it is:\n\n- `.txt` — plain text\n- `.py` — Python code\n- `.js` — JavaScript code\n- `.html` — a web page\n- `.jpg`, `.png` — images\n- `.csv` — a table of data'),
    mc('You save a Python program. What extension should the file have?', ['.txt', '.py', '.jpg', '.pyt'], 1, 'Python files end in .py, like hello.py.'),
    ex('Paths', 'A **path** is the address of a file: the folders you walk through to reach it, separated by `/`:\n\n```text\n/Users/aj/projects/game/main.py\n```\n\nThat means: start at the root `/`, go into `Users`, then `aj`, then `projects`, then `game`, and find `main.py`.', 'Windows uses \\ instead of /, like C:\\Users\\aj — same idea.'),
    mc('In the path `/home/sam/notes/todo.txt`, which folder directly contains todo.txt?', ['home', 'sam', 'notes', 'txt'], 2, 'The last folder before the file name is the one that holds it: notes.'),
    ord('Order the parts of this path from the root down: /school/math/hw1.py', ['/', 'school', 'math', 'hw1.py'], 'Start at the root, then each folder, then the file.'),
    ex('Absolute vs relative', 'An **absolute path** starts at the root (`/school/math/hw1.py`) — it works from anywhere.\n\nA **relative path** starts from where you are now. If you are already in `/school`, then `math/hw1.py` reaches the same file.\n\n`..` means "the folder above this one".'),
    mc('You are in /school/math. Which relative path points to /school/art/drawing.png?', ['art/drawing.png', '../art/drawing.png', '/art/drawing.png', 'math/art/drawing.png'], 1, '.. goes up from math to school, then into art.'),
  ],

  // ------------------------------------------------------------------ fnd-2-languages
  'fnd-2-languages': [
    ex('Machine code', 'The CPU only understands **machine code**: instructions made of bits, like `10110000 01100001`. Each kind of CPU has its own machine code.\n\nNobody wants to write that by hand, so we use programming languages and let tools translate.'),
    ex('High-level vs low-level', '- **Low-level** languages (assembly, C) are close to the hardware: fast and precise, but you manage lots of details yourself.\n- **High-level** languages (Python, JavaScript) read more like English and handle details for you, so you can focus on the problem.'),
    mc('Which language is the most high-level?', ['Machine code', 'Assembly', 'Python'], 2, 'Python hides hardware details and reads closer to English.'),
    ex('Compilers and interpreters', 'Two ways to turn code into something the CPU can run:\n\n- A **compiler** translates the *whole program* into machine code **before** it runs (C, C++, Go, Rust). Like translating a whole book, then handing it over.\n- An **interpreter** reads and runs the program **line by line** as it goes (Python, JavaScript). Like a live interpreter at a meeting.\n\nJava does both: it compiles to *bytecode* that a virtual machine then runs.'),
    mc('A tool translates your entire C program into machine code before running it. What is it?', ['An interpreter', 'A compiler', 'A browser', 'A text editor'], 1, 'Translating everything ahead of time is compiling.'),
    mc('Python runs your program line by line as it goes. That makes Python…', ['Compiled', 'Interpreted'], 1, 'Python is (usually) interpreted. That\'s why a Python program can print some lines before crashing on a later error.'),
    ex('Why so many languages?', 'Each language makes different trade-offs:\n\n| Language | Great for |\n|---|---|\n| Python | beginners, data, AI, scripts |\n| JavaScript | websites and web apps |\n| Java / C# | big business apps, Android |\n| C / C++ | operating systems, games, speed |\n| SQL | asking questions of databases |\n\nThe good news: once you learn one well, the next one is **much** easier. The ideas are the same.'),
    mc('Which language would you use to make a web page interactive in the browser?', ['SQL', 'JavaScript', 'C', 'Assembly'], 1, 'Browsers run JavaScript.'),
    mc('Why learn Python first?', ['It\'s the only language that matters', 'It\'s readable and beginner-friendly, and its ideas transfer to other languages', 'It\'s the fastest language', 'Computers only understand Python'], 1, 'Python\'s simple syntax lets you focus on programming ideas that carry over to every other language.'),
  ],

  // ------------------------------------------------------------------ fnd-3-decomposition
  'fnd-3-decomposition': [
    ex('Big problems are scary', '"Build a video game" is overwhelming. "Draw a square on the screen" is not.\n\n**Decomposition** means breaking a big problem into smaller problems, and those into even smaller ones, until each piece is easy to solve.', 'This is the #1 skill of good programmers.'),
    ex('Example: a to-do list app', '**Build a to-do app** breaks into:\n\n- Show the list of tasks\n- Add a new task\n- Mark a task as done\n- Delete a task\n- Save tasks so they\'re there tomorrow\n\nAnd "Add a new task" breaks down further: read what the user typed → make sure it isn\'t empty → put it at the end of the list → show the updated list.'),
    mc('Which is the best FIRST step when facing a big programming project?', ['Start typing code immediately', 'Break it into smaller parts', 'Search for someone else\'s finished app', 'Wait until you know everything'], 1, 'Decomposing first gives you a plan of small, doable steps.'),
    mc('Which of these is a sub-problem of "make a calculator app"?', ['Add two numbers the user enters', 'Choose a laptop', 'Learn Spanish', 'Make the app famous'], 0, 'Adding two numbers is one small piece of a calculator.'),
    ord('Order the sub-steps of "send a text message".', ['Open the messages app', 'Choose who to send to', 'Type the message', 'Press send'], 'Each small step is simple on its own; together they solve the big task.'),
    mc('A piece is still too hard to solve. What should you do?', ['Give up on the project', 'Break that piece down further', 'Skip it forever', 'Make it bigger'], 1, 'Keep decomposing until every piece feels easy.'),
    ex('Patterns', 'While decomposing you\'ll notice **repeated pieces**: "show the list" happens after adding, after deleting and after marking done.\n\nSpotting repeats lets you solve a piece **once** and reuse it. In code, reusable pieces become **functions** — you\'ll write them in the Python course.'),
    mc('"Show the updated list" is needed after adding, deleting and completing tasks. What\'s the smart move?', ['Write that code three separate times', 'Solve it once and reuse it', 'Only show the list once a day'], 1, 'Reuse avoids repeated work and repeated bugs.'),
  ],

  // ------------------------------------------------------------------ fnd-3-pseudocode
  'fnd-3-pseudocode': [
    ex('Plan in plain English', '**Pseudocode** is a plan written in plain English, shaped like code. It isn\'t any real language — no computer runs it — but it lets you think through the steps before worrying about exact syntax.\n\n```text\nSET total TO 0\nFOR EACH price IN the shopping cart\n    ADD price TO total\nSHOW total\n```'),
    mc('Who is pseudocode for?', ['The computer', 'Humans planning a program', 'The printer'], 1, 'Computers can\'t run pseudocode. It\'s a thinking tool for people.'),
    ex('Common pseudocode words', '- `SET x TO 5` — remember a value\n- `IF … THEN … ELSE …` — make a decision\n- `REPEAT 3 TIMES` or `WHILE …` — loop\n- `FOR EACH item IN list` — do something to every item\n- `SHOW` / `OUTPUT` — display a result\n\nIndenting shows which steps belong inside an IF or a loop.'),
    ans('What does this pseudocode show?', ['15'], 'total goes 0 → 5 → 15 (5 + 10). Then 15 is shown.', 'SET total TO 0\nADD 5 TO total\nADD 10 TO total\nSHOW total'),
    ans('What does this show if age is 15?', ['too young'], '15 is not 16 or more, so the ELSE branch runs.', 'IF age IS AT LEAST 16 THEN\n    SHOW "can drive"\nELSE\n    SHOW "too young"'),
    ans('How many times is "hi" shown?', ['3'], 'REPEAT 3 TIMES runs the indented line 3 times.', 'REPEAT 3 TIMES\n    SHOW "hi"'),
    ord('Arrange this pseudocode for "find the average of three test scores".', ['SET total TO score1 + score2 + score3', 'SET average TO total / 3', 'SHOW average'], 'You need the total before you can divide, and the average before you can show it.', 'text'),
    mc('Pseudocode says IF it is raining THEN take umbrella. It is sunny. What happens?', ['Take umbrella', 'Nothing — the condition is false, so the step is skipped', 'An error'], 1, 'Steps under IF only run when the condition is true.'),
  ],

  // ------------------------------------------------------------------ fnd-3-flowcharts
  'fnd-3-flowcharts': [
    ex('Pictures of programs', 'A **flowchart** draws an algorithm as boxes connected by arrows:\n\n- **Oval** — Start / End\n- **Rectangle** — a step (do something)\n- **Diamond** — a decision with a yes/no question; two arrows come out\n- **Arrows** — which way to go next'),
    mc('Which shape asks a yes/no question?', ['Oval', 'Rectangle', 'Diamond'], 2, 'Diamonds are decisions, with a "yes" arrow and a "no" arrow.'),
    mc('Which shape marks where a flowchart begins?', ['Oval', 'Diamond', 'Rectangle'], 0, 'Start and End are ovals.'),
    ex('Branches', '```text\n( Start )\n    ↓\n< Is the number > 0 ? >\n   yes ↓          ↘ no\n[ Show "positive" ]  [ Show "not positive" ]\n    ↓                 ↓\n( End )  ←←←←←←←←←←←←←\n```\n\nA decision splits the path into **branches**. Only one branch runs each time.'),
    ans('Using that flowchart, what is shown for the number -3?', ['not positive'], '-3 > 0 is false, so we follow the "no" arrow.'),
    ex('Loops in flowcharts', 'An arrow that points **back up** creates a **loop**:\n\n```text\n[ Set count to 1 ]\n    ↓\n< Is count ≤ 3 ? > —no→ ( End )\n    ↓ yes\n[ Show count ]\n    ↓\n[ Add 1 to count ] —→ back to the question\n```'),
    ans('What does that loop flowchart show, in order? (Type the numbers separated by spaces)', ['1 2 3', '1, 2, 3', '123', '1,2,3'], 'count is 1, 2, 3 — when it becomes 4, "count ≤ 3" is false and we end.'),
    mc('What would happen if the "Add 1 to count" box was missing?', ['It would show 1 forever — an infinite loop', 'It would show 1 2 3', 'It would end immediately'], 0, 'count would stay 1, so "count ≤ 3" is always true. Loops need something that changes so they can finish.'),
  ],

  // ------------------------------------------------------------------ fnd-3-tracing
  'fnd-3-tracing': [
    ex('Play computer', '**Tracing** means running a program in your head (or on paper), one step at a time, writing down the value of every variable as it changes.\n\nIt\'s how you predict what code will do — and how you find bugs.'),
    ex('A trace table', 'Pseudocode:\n\n```text\nSET a TO 3\nSET b TO a + 2\nSET a TO b * 2\n```\n\n| Step | a | b |\n|---|---|---|\n| 1 | 3 | – |\n| 2 | 3 | 5 |\n| 3 | 10 | 5 |\n\nEach row records the variables **after** that step.', 'Notice step 3 changes a — the old value 3 is gone.'),
    ans('After all three steps above, what is a?', ['10'], 'b is 5, so a becomes 5 × 2 = 10.'),
    ans('Trace it: what is x at the end?', ['7'], 'x: 2 → 6 (2 + 4) → 7 (6 + 1).', 'SET x TO 2\nSET x TO x + 4\nSET x TO x + 1'),
    ans('Trace it: what is y at the end?', ['8'], 'x = 4, then y = 4 × 2 = 8. Changing x afterwards does not change y.', 'SET x TO 4\nSET y TO x * 2\nSET x TO 100'),
    ans('Trace the loop: what is total at the end?', ['6'], 'total: 0 → 1 → 3 → 6 (adding 1, then 2, then 3).', 'SET total TO 0\nFOR n FROM 1 TO 3\n    ADD n TO total'),
    ans('Trace it: what is shown?', ['small'], 'n is 4 → 4 × 2 = 8, and 8 is not more than 10, so "small".', 'SET n TO 4\nSET n TO n * 2\nIF n IS MORE THAN 10 THEN\n    SHOW "big"\nELSE\n    SHOW "small"'),
    mc('Swap trouble: what are a and b at the end?', ['a = 2, b = 1', 'a = 2, b = 2', 'a = 1, b = 1'], 1, 'After "SET a TO b", a is 2 and the old 1 is lost. Then b gets a, which is 2. Swapping needs a third, temporary variable!', 'SET a TO 1\nSET b TO 2\nSET a TO b\nSET b TO a'),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'fnd-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Which part of a computer runs instructions?', ['RAM', 'CPU', 'SSD', 'Monitor'], 1, 'The CPU runs instructions.'),
      mc('Which is wiped when the power goes off?', ['RAM', 'Storage'], 0, 'RAM is temporary.'),
      ans('How many bits are in a byte?', ['8'], '8 bits = 1 byte.'),
      ans('How many patterns can 4 bits make?', ['16'], '2⁴ = 16.'),
      ord('Smallest to largest:', ['byte', 'kilobyte', 'megabyte', 'gigabyte'], 'Each is about 1,000 of the one before.'),
      mc('What file extension do Python programs use?', ['.python', '.py', '.pt', '.exe'], 1, '.py'),
      mc('In /a/b/c.txt, which folder holds c.txt?', ['a', 'b', '/'], 1, 'The last folder before the file.'),
      mc('A tool that translates a whole program to machine code before it runs is a…', ['compiler', 'interpreter'], 0, 'Compilers translate ahead of time.'),
      mc('Which is a high-level language?', ['Machine code', 'JavaScript'], 1, 'JavaScript reads closer to English.'),
    ],
  },
  'fnd-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Breaking a big problem into smaller problems is called…', ['Compilation', 'Decomposition', 'Tracing', 'Debugging'], 1, 'Decomposition.'),
      mc('Pseudocode is…', ['A real language computers run', 'A plain-English plan shaped like code'], 1, 'It\'s for planning.'),
      mc('In a flowchart, a decision is drawn as a…', ['Diamond', 'Oval', 'Rectangle'], 0, 'Diamond.'),
      ans('What does this show?', ['9'], '3 → 3 × 3 = 9.', 'SET n TO 3\nSET n TO n * n\nSHOW n'),
      ans('What does this show if temp is 30?', ['cold'], '30 is not above 70.', 'IF temp IS ABOVE 70 THEN\n    SHOW "warm"\nELSE\n    SHOW "cold"'),
      ans('How many times is "go" shown?', ['4'], 'REPEAT 4 TIMES.', 'REPEAT 4 TIMES\n    SHOW "go"'),
      ans('Trace it: what is total at the end?', ['10'], '0 + 1 + 2 + 3 + 4 = 10.', 'SET total TO 0\nFOR n FROM 1 TO 4\n    ADD n TO total'),
      ans('Trace it: what is b at the end?', ['6'], 'a = 3, b = 6. Changing a later doesn\'t change b.', 'SET a TO 3\nSET b TO a * 2\nSET a TO 0'),
      mc('A loop never changes the value it checks. What happens?', ['It ends right away', 'It may run forever (infinite loop)', 'The computer fixes it'], 1, 'Something must change for the loop to end.'),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  foundations: {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('What is a program?', ['A collection of instructions for a computer', 'A type of hardware', 'A keyboard shortcut'], 0, 'Programs are made of instructions (code).'),
      mc('An algorithm is…', ['A step-by-step plan for solving a problem', 'A kind of computer virus', 'A programming language'], 0, 'Like a recipe.'),
      mc('A program runs but gives a wrong answer. That\'s a…', ['syntax error', 'logic error'], 1, 'It runs, so the grammar is fine — the logic is wrong.'),
      mc('Where does a running program keep its data?', ['RAM', 'The monitor', 'The power cable'], 0, 'In memory.'),
      ans('How many patterns can one byte make?', ['256'], '2⁸ = 256.'),
      mc('You are in /docs. Which relative path reaches /pics/cat.png?', ['pics/cat.png', '../pics/cat.png', 'docs/pics/cat.png'], 1, '.. goes up to the root, then into pics.'),
      mc('Python is usually…', ['compiled ahead of time to machine code', 'interpreted line by line'], 1, 'Python is interpreted.'),
      ord('Put these in the order every program follows.', ['Input', 'Process', 'Output'], 'In → work → out.'),
      ans('Trace it: what is shown?', ['12'], 'x = 5, x = 5 + 1 = 6, x = 6 × 2 = 12.', 'SET x TO 5\nSET x TO x + 1\nSET x TO x * 2\nSHOW x'),
      ans('Trace it: what is total at the end?', ['15'], '0 + 1 + 2 + 3 + 4 + 5 = 15.', 'SET total TO 0\nFOR n FROM 1 TO 5\n    ADD n TO total'),
      mc('In a flowchart, an arrow that points back to an earlier box makes a…', ['branch', 'loop', 'file'], 1, 'Going back creates repetition: a loop.'),
      mc('First thing to do when you see an error message?', ['Read it carefully', 'Delete your code', 'Restart the computer'], 0, 'Error messages are clues.'),
    ],
  },
};
