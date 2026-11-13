# Loopwise curriculum

> Generated from `src/content/roadmap.ts` by `npm run curriculum`. Do not edit by hand.
> Which lessons are written is tracked in [STATUS.md](STATUS.md).

**24 courses · 92 units · 306 lessons.** Courses are listed in the recommended order; each ends with a final exam.

## 1. 🧠 How Computers Think `foundations`

What code is, how computers run it, and how programmers think. No typing code yet — just the mental models everything else builds on.

*~4h · after: nothing — start here*

**Unit 1 — What is programming?** `fnd-1` — Code, algorithms, and why computers need exact instructions.
- What is code? — Code is a list of exact instructions a computer follows. `fnd-1-what-is-code`
- Algorithms are recipes — Step-by-step plans for solving problems. `fnd-1-algorithms`
- Input → Process → Output — Every program takes something in, works on it, and gives something back. `fnd-1-input-output`
- Bugs happen (and that is fine) — Mistakes in code, and the debugging mindset. `fnd-1-bugs`
- 🏆 Checkpoint test

**Unit 2 — Inside the machine** `fnd-2` — CPU, memory, storage, and the bits underneath it all.
- CPU, memory and storage — The three parts of a computer every programmer must know. `fnd-2-hardware`
- Bits and bytes — Everything in a computer is 0s and 1s. `fnd-2-bits`
- Files, folders and paths — How data is organized and found on disk. `fnd-2-files`
- Why so many languages? — Compiled vs interpreted, high-level vs low-level. `fnd-2-languages`
- 🏆 Checkpoint test

**Unit 3 — Thinking like a programmer** `fnd-3` — Break problems down, write pseudocode, and trace programs by hand.
- Break it down — Decomposition: splitting big problems into small ones. `fnd-3-decomposition`
- Pseudocode — Plan in plain English before writing code. `fnd-3-pseudocode`
- Flowcharts and decisions — Drawing branches and loops. `fnd-3-flowcharts`
- Tracing by hand — Play computer: follow code line by line. `fnd-3-tracing`
- 🏆 Checkpoint test

## 2. 🔢 Math Refresher `math-0`

Arithmetic, algebra, number systems and growth — re-learned from scratch with programmer-friendly examples. Needed for Discrete Math, Algorithms and everything after.

*~12h · after: nothing — start here*

**Unit 1 — Numbers** `m0-1` — Integers, fractions, order of operations and exponents.
- Kinds of numbers — Naturals, integers, rationals, reals. `m0-1-number-types`
- Order of operations — PEMDAS and why computers follow it too. `m0-1-order-of-ops`
- Negative numbers — Adding, subtracting and multiplying negatives. `m0-1-negatives`
- Exponents and roots — Powers, square roots, and exponent rules. `m0-1-exponents`
- 🏆 Checkpoint test

**Unit 2 — Algebra** `m0-2` — Variables, equations and functions.
- Variables and expressions — Letters that stand for numbers. `m0-2-variables`
- Solving equations — Do the same thing to both sides. `m0-2-equations`
- Inequalities — Less than, greater than, and ranges. `m0-2-inequalities`
- Functions and graphs — f(x), inputs, outputs and plotting. `m0-2-functions`
- 🏆 Checkpoint test

**Unit 3 — Number systems** `m0-3` — Binary, hex, remainders and logarithms.
- Counting in binary — Base 2: how computers count. `m0-3-binary`
- Hexadecimal — Base 16: colors, memory addresses. `m0-3-hex`
- Remainders and modular arithmetic — Clock math and the % operator. `m0-3-modular`
- Logarithms — The opposite of exponents — and why log₂ is everywhere in CS. `m0-3-logarithms`
- 🏆 Checkpoint test

**Unit 4 — Sequences and growth** `m0-4` — Summations and how fast things grow.
- Sigma notation — Writing long sums compactly. `m0-4-sigma`
- Arithmetic and geometric series — The two sums you will see in algorithm analysis. `m0-4-series`
- Growth rates — Linear vs quadratic vs exponential. `m0-4-growth`
- 🏆 Checkpoint test

## 3. 🐍 Python Basics `python-1`

Write and run real Python in your browser. Variables, decisions, loops, functions and collections — the building blocks of every program.

*~30h · after: How Computers Think*

**Unit 1 — First steps** `py-1` — Print, comments, variables and reading errors.
- Hello, world! — Run your first program with print(). `py-1-hello`
- Comments — Notes for humans that Python ignores. `py-1-comments`
- Variables — Store values with names. `py-1-variables`
- Reading error messages — SyntaxError, NameError and how to fix them. `py-1-errors`
- 🏆 Checkpoint test

**Unit 2 — Numbers and math** `py-2` — Arithmetic, integer division, remainders and types.
- Arithmetic operators — + - * / and **. `py-2-arithmetic`
- Division and remainders — /, // and %. `py-2-division`
- Types and conversion — int, float, str and converting between them. `py-2-types`
- The math module — sqrt, floor, ceil and more. `py-2-math-module`
- 🏆 Checkpoint test

**Unit 3 — Strings** `py-3` — Text: joining, formatting, indexing and slicing.
- Working with text — Quotes, concatenation and len(). `py-3-strings`
- f-strings — Put variables inside text. `py-3-fstrings`
- Indexing and slicing — Grab characters and pieces of a string. `py-3-indexing`
- String methods — upper, lower, strip, replace, split. `py-3-methods`
- 🏆 Checkpoint test

**Unit 4 — Making decisions** `py-4` — Booleans, comparisons and if/elif/else.
- True and False — Booleans and comparison operators. `py-4-booleans`
- if and else — Run code only when a condition is true. `py-4-if`
- elif chains — Choosing between many options. `py-4-elif`
- and, or, not — Combining conditions. `py-4-logic`
- 🏆 Checkpoint test

**Unit 5 — Loops** `py-5` — Repeat work with while and for.
- while loops — Repeat while a condition holds. `py-5-while`
- for loops and range() — Count through numbers. `py-5-for-range`
- Loop patterns — Counters, accumulators and searching. `py-5-patterns`
- break and continue — Leaving and skipping loop turns. `py-5-break-continue`
- Nested loops — Loops inside loops. `py-5-nested`
- 🏆 Checkpoint test

**Unit 6 — Functions** `py-6` — Package code into reusable pieces.
- Defining functions — def, calling, and why functions matter. `py-6-def`
- Parameters and arguments — Passing information in. `py-6-parameters`
- Returning values — Getting information back out. `py-6-return`
- Scope — Where variables live. `py-6-scope`
- Default and keyword arguments — Flexible function calls. `py-6-defaults`
- 🏆 Checkpoint test

**Unit 7 — Lists** `py-7` — Ordered collections.
- Making lists — Create, index and change lists. `py-7-lists`
- List methods — append, insert, remove, pop, sort. `py-7-list-methods`
- Looping over lists — for item in list, enumerate. `py-7-looping-lists`
- List comprehensions — Build lists in one line. `py-7-comprehensions`
- 🏆 Checkpoint test

**Unit 8 — Dictionaries, tuples and sets** `py-8` — Key-value lookups and other collections.
- Dictionaries — Look things up by key. `py-8-dicts`
- Looping over dictionaries — keys, values and items. `py-8-dict-loops`
- Tuples — Fixed groups of values and unpacking. `py-8-tuples`
- Sets — Unique items and fast membership checks. `py-8-sets`
- 🏆 Checkpoint test

## 4. 🛠️ Developer Tools `tools`

The everyday tools every grad program assumes you already know: the command line, Git, VS Code, and package managers.

*~8h · after: How Computers Think*

**Unit 1 — The command line** `tl-1` — Navigate and work with files from a terminal.
- What is a terminal? — Shells, prompts and commands. `tl-1-terminal`
- Moving around — pwd, ls, cd. `tl-1-navigation`
- Working with files — mkdir, touch, cp, mv, rm. `tl-1-files`
- Pipes and redirection — Chain commands together. `tl-1-pipes`
- 🏆 Checkpoint test

**Unit 2 — Git and GitHub** `tl-2` — Version control for every project.
- Why version control? — Snapshots, history and collaboration. `tl-2-why-git`
- Commits — add, commit, log. `tl-2-commits`
- Branches and merging — Work in parallel safely. `tl-2-branches`
- GitHub and remotes — push, pull, pull requests. `tl-2-github`
- 🏆 Checkpoint test

**Unit 3 — Your coding setup** `tl-3` — Editors, packages and environments.
- VS Code essentials — Extensions, shortcuts, debugger. `tl-3-editor`
- Package managers — pip and npm. `tl-3-packages`
- Virtual environments — Isolated project dependencies. `tl-3-venv`
- 🏆 Checkpoint test

## 5. 🐉 Python Intermediate `python-2`

Level up to the Python used in grad courses: error handling, modules, object-oriented programming, recursion and testing.

*~30h · after: Python Basics*

**Unit 1 — Errors and files** `py2-1` — Handle failures gracefully.
- try and except — Catch errors instead of crashing. `py2-1-exceptions`
- Raising exceptions — Signal problems from your own code. `py2-1-raising`
- Reading and writing files — open, with, read, write. `py2-1-files`
- 🏆 Checkpoint test

**Unit 2 — Modules and the standard library** `py2-2` — Reuse code that already exists.
- import and modules — Splitting code across files. `py2-2-imports`
- random and datetime — Randomness and dates. `py2-2-random`
- collections — Counter, defaultdict, deque. `py2-2-collections`
- 🏆 Checkpoint test

**Unit 3 — Object-oriented programming** `py2-3` — Model the world with classes.
- Classes and objects — Blueprints and instances. `py2-3-classes`
- __init__ and methods — Attributes and behavior. `py2-3-init-methods`
- Inheritance — Reuse and specialize classes. `py2-3-inheritance`
- Special methods — __str__, __eq__, __len__. `py2-3-dunder`
- 🏆 Checkpoint test

**Unit 4 — Recursion** `py2-4` — Functions that call themselves.
- Thinking recursively — Base case and recursive case. `py2-4-intro`
- The call stack — What happens in memory. `py2-4-call-stack`
- Recursive patterns — Sums, reversing, and tree-shaped calls. `py2-4-patterns`
- 🏆 Checkpoint test

**Unit 5 — Testing and debugging** `py2-5` — Prove your code works.
- assert and test cases — Think in inputs and expected outputs. `py2-5-assert`
- Unit tests — Writing a test suite. `py2-5-unittest`
- Debugging strategies — Print debugging, rubber ducking, bisecting. `py2-5-debugging`
- 🏆 Checkpoint test

**Unit 6 — Pythonic code** `py2-6` — Functional tools and iterators.
- Lambdas, map and filter — Small anonymous functions. `py2-6-lambdas`
- Iterators and generators — yield and lazy sequences. `py2-6-generators`
- Advanced comprehensions — Dict and set comprehensions. `py2-6-comprehensions`
- 🏆 Checkpoint test

## 6. ♾️ Discrete Math `discrete-math`

Logic, proofs, counting, graphs and number theory — the language used by every algorithms and theory course.

*~35h · after: Math Refresher*

**Unit 1 — Logic** `dm-1` — Statements, truth tables and quantifiers.
- Propositions — True/false statements and connectives. `dm-1-propositions`
- Truth tables — Evaluate any logical expression. `dm-1-truth-tables`
- If-then (implication) — Implication, converse, contrapositive. `dm-1-implication`
- For all and there exists — Quantifiers and negation. `dm-1-quantifiers`
- 🏆 Checkpoint test

**Unit 2 — Proofs** `dm-2` — How to convince anyone something is true.
- Direct proof — Chain facts to a conclusion. `dm-2-direct`
- Proof by contradiction — Assume the opposite and break it. `dm-2-contradiction`
- Mathematical induction — Dominoes: base case + step. `dm-2-induction`
- Strong induction — Using all previous cases. `dm-2-strong-induction`
- 🏆 Checkpoint test

**Unit 3 — Sets, functions and relations** `dm-3` — The vocabulary of math.
- Sets and set operations — Union, intersection, difference. `dm-3-sets`
- Functions — One-to-one, onto, bijections. `dm-3-functions`
- Relations — Equivalence relations and orders. `dm-3-relations`
- 🏆 Checkpoint test

**Unit 4 — Counting** `dm-4` — How many ways can it happen?
- Sum and product rules — The basic counting principles. `dm-4-rules`
- Permutations — Arrangements where order matters. `dm-4-permutations`
- Combinations — Choosing where order does not matter. `dm-4-combinations`
- Pigeonhole principle — More pigeons than holes. `dm-4-pigeonhole`
- Inclusion–exclusion — Counting overlaps correctly. `dm-4-inclusion-exclusion`
- 🏆 Checkpoint test

**Unit 5 — Graphs and trees** `dm-5` — Networks of things.
- Graph vocabulary — Vertices, edges, degree, paths. `dm-5-graphs`
- Trees — Connected graphs with no cycles. `dm-5-trees`
- Euler and Hamilton paths — Classic path problems. `dm-5-euler`
- Graph coloring — Scheduling with colors. `dm-5-coloring`
- 🏆 Checkpoint test

**Unit 6 — Number theory** `dm-6` — Divisibility, primes and cryptography.
- Divisibility and primes — Factors, primes, prime factorization. `dm-6-divisibility`
- GCD and Euclid's algorithm — The oldest algorithm still in use. `dm-6-gcd`
- Modular arithmetic — Congruences and inverses. `dm-6-modular`
- How RSA works — Public-key crypto from number theory. `dm-6-rsa`
- 🏆 Checkpoint test

**Unit 7 — Recurrences** `dm-7` — Equations that refer to themselves.
- Recurrence relations — Describing sequences recursively. `dm-7-recurrences`
- Solving recurrences — Unrolling and guessing patterns. `dm-7-solving`
- 🏆 Checkpoint test

## 7. 🧱 Data Structures `data-structures`

Build arrays, linked lists, stacks, queues, hash tables, trees, heaps and graphs yourself — and learn when to use each.

*~40h · after: Python Intermediate*

**Unit 1 — Arrays and linked lists** `ds-1` — Sequential data two ways.
- Arrays and dynamic arrays — Contiguous memory and resizing. `ds-1-arrays`
- Linked lists — Nodes and pointers. `ds-1-linked-lists`
- Array vs linked list — Trade-offs in time and memory. `ds-1-compare`
- 🏆 Checkpoint test

**Unit 2 — Stacks and queues** `ds-2` — Last-in-first-out and first-in-first-out.
- Stacks — push, pop and the undo button. `ds-2-stacks`
- Queues and deques — Lines and buffers. `ds-2-queues`
- Stack and queue problems — Balanced brackets and more. `ds-2-applications`
- 🏆 Checkpoint test

**Unit 3 — Hash tables** `ds-3` — Instant lookups.
- Hash functions — Turning keys into indexes. `ds-3-hashing`
- Collisions — Chaining and open addressing. `ds-3-collisions`
- Hash map problems — Counting, grouping, two-sum. `ds-3-using`
- 🏆 Checkpoint test

**Unit 4 — Trees** `ds-4` — Hierarchical data.
- Binary trees — Nodes with two children. `ds-4-binary-trees`
- Tree traversals — Pre-order, in-order, post-order, level-order. `ds-4-traversals`
- Binary search trees — Ordered trees for fast search. `ds-4-bst`
- Balanced trees — AVL and red-black intuition. `ds-4-balanced`
- 🏆 Checkpoint test

**Unit 5 — Heaps and priority queues** `ds-5` — Always grab the smallest.
- Binary heaps — Heap property and heapify. `ds-5-heaps`
- Priority queues — heapq and top-k problems. `ds-5-priority-queues`
- 🏆 Checkpoint test

**Unit 6 — Graphs** `ds-6` — Represent networks in code.
- Adjacency lists and matrices — Two ways to store a graph. `ds-6-representation`
- Tries — Prefix trees for words. `ds-6-tries`
- Union–find — Tracking connected groups. `ds-6-union-find`
- 🏆 Checkpoint test

## 8. ⚙️ Algorithms `algorithms`

Analyze and design algorithms like a grad student: complexity, sorting, divide-and-conquer, greedy, dynamic programming, graph algorithms and NP-completeness.

*~50h · after: Data Structures, Discrete Math*

**Unit 1 — Complexity** `al-1` — Measuring how algorithms scale.
- Big-O notation — Describing growth. `al-1-big-o`
- Analyzing loops — Count the work. `al-1-analysis`
- Space complexity — Memory usage. `al-1-space`
- Big-Ω and Big-Θ — Lower and tight bounds. `al-1-omega-theta`
- 🏆 Checkpoint test

**Unit 2 — Searching and sorting** `al-2` — The classics.
- Binary search — Halve the problem every step. `al-2-binary-search`
- Selection and insertion sort — Simple O(n²) sorts. `al-2-simple-sorts`
- Merge sort — Divide, sort, merge. `al-2-merge-sort`
- Quicksort — Partition around a pivot. `al-2-quick-sort`
- Counting and radix sort — Beating n log n with assumptions. `al-2-linear-sorts`
- 🏆 Checkpoint test

**Unit 3 — Problem-solving patterns** `al-3` — Reusable LeetCode techniques.
- Two pointers — Walk from both ends. `al-3-two-pointers`
- Sliding window — Subarrays efficiently. `al-3-sliding-window`
- Prefix sums — Range sums in O(1). `al-3-prefix-sums`
- Backtracking — Try, undo, try again. `al-3-backtracking`
- 🏆 Checkpoint test

**Unit 4 — Divide and conquer** `al-4` — Split, solve, combine.
- Recurrences for algorithms — T(n) = 2T(n/2) + n. `al-4-recurrences`
- The Master Theorem — Solve recurrences fast. `al-4-master-theorem`
- Classic D&C problems — Max subarray, closest pair, fast multiplication. `al-4-examples`
- 🏆 Checkpoint test

**Unit 5 — Greedy algorithms** `al-5` — Take the best choice now.
- Greedy choice — When greedy works and when it fails. `al-5-greedy`
- Interval scheduling — Classic greedy problem. `al-5-scheduling`
- Huffman coding — Compression with a greedy tree. `al-5-huffman`
- 🏆 Checkpoint test

**Unit 6 — Dynamic programming** `al-6` — Remember answers to subproblems.
- Memoization — Cache recursive results. `al-6-memoization`
- Tabulation — Fill a table bottom-up. `al-6-tabulation`
- Classic 1-D DP — Climbing stairs, house robber, coin change. `al-6-classic-1d`
- Classic 2-D DP — LCS, edit distance, knapsack. `al-6-classic-2d`
- 🏆 Checkpoint test

**Unit 7 — Graph algorithms** `al-7` — Search, paths and trees.
- BFS and DFS — Exploring graphs. `al-7-bfs-dfs`
- Topological sort — Ordering with dependencies. `al-7-topo-sort`
- Dijkstra's shortest paths — Weighted shortest paths. `al-7-dijkstra`
- Minimum spanning trees — Kruskal and Prim. `al-7-mst`
- Bellman–Ford and Floyd–Warshall — Negative edges and all pairs. `al-7-bellman-ford`
- 🏆 Checkpoint test

**Unit 8 — Hard problems** `al-8` — What computers cannot do quickly.
- P, NP and NP-complete — The biggest open question in CS. `al-8-p-np`
- Reductions — Proving problems are hard. `al-8-reductions`
- Approximation algorithms — Good-enough answers fast. `al-8-approximation`
- 🏆 Checkpoint test

## 9. 🌐 Web Basics: HTML & CSS `web-1`

Structure pages with HTML and style them with CSS, including layout with flexbox and grid and accessibility basics.

*~15h · after: How Computers Think*

**Unit 1 — HTML** `wb-1` — The structure of a page.
- Tags and elements — Headings, paragraphs, links. `wb-1-tags`
- Page structure — head, body, semantic tags. `wb-1-structure`
- Forms and inputs — Collect data from users. `wb-1-forms`
- Accessible HTML — Alt text, labels and landmarks. `wb-1-accessibility`
- 🏆 Checkpoint test

**Unit 2 — CSS** `wb-2` — The look of a page.
- Selectors and properties — Targeting elements to style. `wb-2-selectors`
- The box model — Margin, border, padding. `wb-2-box-model`
- Flexbox — One-dimensional layouts. `wb-2-flexbox`
- CSS Grid — Two-dimensional layouts. `wb-2-grid`
- Responsive design — Media queries and mobile first. `wb-2-responsive`
- 🏆 Checkpoint test

## 10. ⚡ JavaScript `javascript`

Learn JavaScript as your second language: syntax, functions, objects, the DOM, async code and TypeScript.

*~30h · after: Python Basics*

**Unit 1 — JavaScript basics** `js-1` — Same ideas, new syntax.
- console.log and variables — let, const and printing. `js-1-hello`
- Types and operators — Numbers, strings, == vs ===. `js-1-types`
- if and loops — Braces instead of indentation. `js-1-control`
- 🏆 Checkpoint test

**Unit 2 — Functions and collections** `js-2` — Arrays and objects.
- Functions and arrow functions — function vs =>. `js-2-functions`
- Arrays — map, filter, reduce. `js-2-arrays`
- Objects — Key-value data and JSON. `js-2-objects`
- 🏆 Checkpoint test

**Unit 3 — The browser** `js-3` — Make pages interactive.
- The DOM — Find and change elements. `js-3-dom`
- Events — Respond to clicks and typing. `js-3-events`
- 🏆 Checkpoint test

**Unit 4 — Async JavaScript** `js-4` — Waiting without freezing.
- Callbacks — Functions that run later. `js-4-callbacks`
- Promises and async/await — Readable async code. `js-4-promises`
- fetch and APIs — Talk to servers. `js-4-fetch`
- 🏆 Checkpoint test

**Unit 5 — TypeScript** `js-5` — JavaScript with types.
- Type annotations — Catch bugs before running. `js-5-types`
- Interfaces and generics — Describe data shapes. `js-5-interfaces`
- 🏆 Checkpoint test

## 11. 🗄️ SQL & Databases `sql`

Query real databases in the browser, then learn how databases are designed: normalization, indexes and transactions.

*~20h · after: Python Basics*

**Unit 1 — Querying** `sq-1` — SELECT your way to answers.
- SELECT and FROM — Read rows from a table. `sq-1-select`
- WHERE and ORDER BY — Filter and sort. `sq-1-where`
- Aggregates and GROUP BY — COUNT, SUM, AVG. `sq-1-aggregates`
- JOINs — Combine tables. `sq-1-joins`
- 🏆 Checkpoint test

**Unit 2 — Changing data** `sq-2` — Insert, update, delete.
- INSERT, UPDATE, DELETE — Modify table contents. `sq-2-insert`
- CREATE TABLE and keys — Primary and foreign keys. `sq-2-schema`
- 🏆 Checkpoint test

**Unit 3 — Database design** `sq-3` — Build databases that last.
- Normalization — 1NF, 2NF, 3NF. `sq-3-normalization`
- Indexes — Fast lookups and their cost. `sq-3-indexes`
- Transactions and ACID — All-or-nothing changes. `sq-3-transactions`
- 🏆 Checkpoint test

## 12. ☕ Java & OOP `java`

Many grad courses use Java. Learn static types, classes, interfaces, collections and generics.

*~25h · after: Python Intermediate*

**Unit 1 — Java basics** `jv-1` — Static types and compilation.
- Hello, Java — class, main and System.out.println. `jv-1-hello`
- Static types — int, double, String, boolean. `jv-1-types`
- Control flow — if, for, while in Java. `jv-1-control`
- 🏆 Checkpoint test

**Unit 2 — Objects in Java** `jv-2` — Classes done the Java way.
- Classes and constructors — Fields, methods and new. `jv-2-classes`
- Encapsulation — public, private and getters. `jv-2-encapsulation`
- Interfaces and abstract classes — Contracts between classes. `jv-2-interfaces`
- 🏆 Checkpoint test

**Unit 3 — Collections and generics** `jv-3` — Lists and maps with types.
- ArrayList and HashMap — The Java collections framework. `jv-3-collections`
- Generics — Type parameters. `jv-3-generics`
- Exceptions — Checked vs unchecked. `jv-3-exceptions`
- 🏆 Checkpoint test

## 13. 🔧 C & Computer Systems `c-systems`

Get close to the hardware: C, pointers, the stack and heap, bits, compilation and a taste of assembly.

*~35h · after: Python Intermediate*

**Unit 1 — C basics** `c-1` — A small, powerful language.
- Hello, C — Compiling and running. `c-1-hello`
- Types and sizes — int, char, float and sizeof. `c-1-types`
- Functions and headers — Declarations and #include. `c-1-functions`
- 🏆 Checkpoint test

**Unit 2 — Pointers and memory** `c-2` — The heart of C.
- Pointers — Addresses and dereferencing. `c-2-pointers`
- Arrays and strings in C — Null-terminated strings. `c-2-arrays`
- malloc and free — Dynamic memory. `c-2-heap`
- structs — Grouping data. `c-2-structs`
- 🏆 Checkpoint test

**Unit 3 — Under the hood** `c-3` — From source to silicon.
- Bitwise operators — &, |, ^, <<, >>. `c-3-bitwise`
- How compilation works — Preprocess, compile, assemble, link. `c-3-compilation`
- Assembly basics — Registers and instructions. `c-3-assembly`
- Stack vs heap — Memory layout of a program. `c-3-stack-heap`
- 🏆 Checkpoint test

## 14. ➕ C++ `cpp`

Classes, RAII, the STL and templates — the C++ used in systems, graphics and competitive programming.

*~25h · after: C & Computer Systems*

**Unit 1 — C++ essentials** `cp-1` — C with superpowers.
- Hello, C++ — iostream, namespaces, references. `cp-1-hello`
- Classes and RAII — Constructors, destructors, ownership. `cp-1-classes`
- The STL — vector, map, algorithms. `cp-1-stl`
- 🏆 Checkpoint test

**Unit 2 — Modern C++** `cp-2` — Safer, faster code.
- Templates — Generic programming. `cp-2-templates`
- Smart pointers — unique_ptr and shared_ptr. `cp-2-smart-pointers`
- Move semantics — Avoiding copies. `cp-2-move`
- 🏆 Checkpoint test

## 15. 🎲 Probability & Statistics `prob-stats`

The probability and statistics needed for randomized algorithms, machine learning and research.

*~30h · after: Math Refresher*

**Unit 1 — Probability** `ps-1` — Chance, made precise.
- Outcomes and events — Sample spaces and probability rules. `ps-1-basics`
- Conditional probability — Probability given information. `ps-1-conditional`
- Bayes' theorem — Updating beliefs. `ps-1-bayes`
- 🏆 Checkpoint test

**Unit 2 — Random variables** `ps-2` — Numbers that come from chance.
- Random variables — Discrete and continuous. `ps-2-random-variables`
- Expected value and variance — Averages and spread. `ps-2-expectation`
- Common distributions — Bernoulli, binomial, uniform, normal. `ps-2-distributions`
- 🏆 Checkpoint test

**Unit 3 — Statistics** `ps-3` — Learning from data.
- Descriptive statistics — Mean, median, mode, spread. `ps-3-descriptive`
- Sampling and the CLT — Why averages are normal. `ps-3-sampling`
- Hypothesis testing — p-values and confidence intervals. `ps-3-testing`
- 🏆 Checkpoint test

## 16. 📐 Linear Algebra `linear-algebra`

Vectors, matrices, transformations, and eigenvalues, with code examples in Python.

*~30h · after: Math Refresher*

**Unit 1 — Vectors** `la-1` — Arrows and lists of numbers.
- What is a vector? — Magnitude, direction, components. `la-1-vectors`
- Vector operations — Add, scale, dot product. `la-1-operations`
- 🏆 Checkpoint test

**Unit 2 — Matrices** `la-2` — Grids that transform space.
- Matrices — Rows, columns and shape. `la-2-matrices`
- Matrix multiplication — Combining transformations. `la-2-multiplication`
- Systems of equations — Gaussian elimination. `la-2-systems`
- Inverses and determinants — Undoing a transformation. `la-2-inverse`
- 🏆 Checkpoint test

**Unit 3 — Deeper ideas** `la-3` — Spaces and special vectors.
- Span, basis and rank — What a set of vectors can reach. `la-3-span`
- Eigenvalues and eigenvectors — Directions that only stretch. `la-3-eigen`
- Linear algebra in ML — Data as matrices, PCA intuition. `la-3-applications`
- 🏆 Checkpoint test

## 17. 📈 Calculus Essentials `calculus`

Limits, derivatives, optimization and gradients — the calculus needed for machine learning, without the fluff.

*~25h · after: Math Refresher*

**Unit 1 — Limits and derivatives** `ca-1` — Instantaneous change.
- Limits — Approaching a value. `ca-1-limits`
- The derivative — Slope at a point. `ca-1-derivatives`
- Derivative rules — Power, product, chain rule. `ca-1-rules`
- 🏆 Checkpoint test

**Unit 2 — Using derivatives** `ca-2` — Find the best answer.
- Optimization — Maxima and minima. `ca-2-optimization`
- Partial derivatives and gradients — Many variables. `ca-2-partials`
- Gradient descent — How models learn. `ca-2-gradient-descent`
- 🏆 Checkpoint test

**Unit 3 — Integrals** `ca-3` — Adding up tiny pieces.
- The integral — Area under a curve. `ca-3-integrals`
- Fundamental theorem of calculus — Derivatives and integrals undo each other. `ca-3-ftc`
- 🏆 Checkpoint test

## 18. 🖥️ Architecture & Operating Systems `architecture-os`

Logic gates to CPUs, caches, processes, threads, concurrency, virtual memory and file systems.

*~35h · after: C & Computer Systems*

**Unit 1 — Computer architecture** `ao-1` — From gates to CPUs.
- Logic gates — AND, OR, NOT in hardware. `ao-1-gates`
- Inside the CPU — Fetch, decode, execute, pipelines. `ao-1-cpu`
- The memory hierarchy — Registers, caches, RAM, disk. `ao-1-caches`
- 🏆 Checkpoint test

**Unit 2 — Processes and threads** `ao-2` — Running many things at once.
- Processes — Programs in execution. `ao-2-processes`
- Threads — Concurrency inside a process. `ao-2-threads`
- CPU scheduling — Who runs next? `ao-2-scheduling`
- 🏆 Checkpoint test

**Unit 3 — Concurrency** `ao-3` — Sharing safely.
- Race conditions — When timing breaks programs. `ao-3-races`
- Locks and semaphores — Mutual exclusion. `ao-3-locks`
- Deadlock — Everyone waiting forever. `ao-3-deadlock`
- 🏆 Checkpoint test

**Unit 4 — Memory and storage** `ao-4` — Virtual memory and file systems.
- Virtual memory — Pages and address translation. `ao-4-virtual-memory`
- File systems — Inodes, blocks and directories. `ao-4-file-systems`
- 🏆 Checkpoint test

## 19. 🔐 Networks & Security `networks-security`

Network layers, TCP/IP, HTTP, DNS, cryptography basics and common vulnerabilities.

*~25h · after: How Computers Think, Python Basics*

**Unit 1 — Networking** `ns-1` — Packets around the world.
- Network layers — The OSI and TCP/IP models. `ns-1-layers`
- IP, TCP and UDP — Addresses and reliable delivery. `ns-1-ip-tcp`
- HTTP and DNS — How a web page loads. `ns-1-http-dns`
- 🏆 Checkpoint test

**Unit 2 — Security** `ns-2` — Thinking like an attacker (ethically).
- Encryption and hashing — Symmetric, asymmetric, hashes. `ns-2-crypto`
- Authentication — Passwords, sessions, tokens. `ns-2-auth`
- Common vulnerabilities — Injection, XSS and how to prevent them. `ns-2-vulnerabilities`
- 🏆 Checkpoint test

## 20. 🤖 Theory of Computation `theory`

Automata, regular expressions, grammars, Turing machines, decidability and complexity classes.

*~25h · after: Discrete Math, Algorithms*

**Unit 1 — Automata** `th-1` — Simple machines.
- Finite automata — DFAs and NFAs. `th-1-dfa`
- Regular expressions — Patterns and regular languages. `th-1-regex`
- Context-free grammars — Describing programming languages. `th-1-grammars`
- 🏆 Checkpoint test

**Unit 2 — Computability** `th-2` — The limits of computing.
- Turing machines — The model of all computers. `th-2-turing`
- The halting problem — A problem no program can solve. `th-2-halting`
- Complexity classes — P, NP, PSPACE. `th-2-complexity`
- 🏆 Checkpoint test

## 21. 🏗️ Software Engineering `software-engineering`

Design principles, patterns, testing strategy, code review and system design basics.

*~20h · after: Python Intermediate, Developer Tools*

**Unit 1 — Design** `se-1` — Code that is easy to change.
- Design principles — SOLID, DRY and KISS. `se-1-principles`
- Design patterns — Factory, observer, strategy. `se-1-patterns`
- Refactoring — Improving code safely. `se-1-refactoring`
- 🏆 Checkpoint test

**Unit 2 — Process** `se-2` — Working as a team.
- Testing strategy — Unit, integration, end-to-end. `se-2-testing`
- Code review — Giving and getting feedback. `se-2-code-review`
- Agile and planning — Iterating in small steps. `se-2-agile`
- 🏆 Checkpoint test

**Unit 3 — System design** `se-3` — Big systems in small pieces.
- Designing APIs — REST and contracts. `se-3-apis`
- Scaling basics — Caching, load balancing, databases. `se-3-scaling`
- 🏆 Checkpoint test

## 22. 🧪 Intro to Machine Learning `ml-intro`

Regression, classification, gradient descent, neural networks and evaluation — built from the math you learned.

*~35h · after: Python Intermediate, Linear Algebra, Probability & Statistics, Calculus Essentials*

**Unit 1 — Foundations** `ml-1` — What learning means.
- What is machine learning? — Supervised, unsupervised, reinforcement. `ml-1-what-is-ml`
- Data and features — Training sets and features. `ml-1-data`
- 🏆 Checkpoint test

**Unit 2 — Core models** `ml-2` — Classic algorithms.
- Linear regression — Fitting a line. `ml-2-linear-regression`
- Training with gradient descent — Minimize the loss. `ml-2-gradient-descent`
- Logistic regression and classification — Yes/no predictions. `ml-2-classification`
- k-NN and decision trees — Simple, powerful models. `ml-2-knn-trees`
- 🏆 Checkpoint test

**Unit 3 — Neural networks** `ml-3` — Layers of simple units.
- Neurons and layers — From perceptron to network. `ml-3-neurons`
- Backpropagation — The chain rule at scale. `ml-3-backprop`
- Evaluating models — Overfitting, validation, metrics. `ml-3-evaluation`
- 🏆 Checkpoint test

## 23. 🗺️ Language Tour `languages-tour`

Once you know Python, JavaScript, Java and C, every other language is a variation. One quick unit per language.

*~20h · after: Python Intermediate, JavaScript*

**Unit 1 — Systems languages** `lt-1` — Fast and safe.
- Go — Simple, concurrent, compiled. `lt-1-go`
- Rust — Memory safety without garbage collection. `lt-1-rust`
- 🏆 Checkpoint test

**Unit 2 — App and web languages** `lt-2` — Languages you will meet at work.
- C# — .NET and games. `lt-2-csharp`
- Kotlin and Swift — Mobile development. `lt-2-kotlin-swift`
- PHP and Ruby — Classic web back ends. `lt-2-php-ruby`
- 🏆 Checkpoint test

**Unit 3 — Specialist languages** `lt-3` — Different ways to think.
- Bash scripting — Automate the terminal. `lt-3-bash`
- R — Statistics and data analysis. `lt-3-r`
- Functional programming (Haskell) — Pure functions and types. `lt-3-haskell`
- 🏆 Checkpoint test

## 24. 🎓 Grad School Readiness `grad-ready`

Applying to programs like Georgia Tech OMSCS, reading papers, LaTeX, managing big projects, and capstone projects to prove your skills.

*~15h · after: Algorithms*

**Unit 1 — Applying** `gr-1` — Put together a strong application.
- Choosing a program — Online master's options compared. `gr-1-programs`
- Statement of purpose — Telling your story. `gr-1-statement`
- Building a portfolio — Projects that prove readiness. `gr-1-portfolio`
- 🏆 Checkpoint test

**Unit 2 — Succeeding** `gr-2` — Skills nobody teaches.
- Reading research papers — The three-pass method. `gr-2-papers`
- LaTeX basics — Write math beautifully. `gr-2-latex`
- Studying while working — Planning a part-time degree. `gr-2-time`
- 🏆 Checkpoint test

**Unit 3 — Capstones** `gr-3` — Big projects that tie it together.
- Capstone: build an interpreter — A tiny programming language in Python. `gr-3-capstone-1`
- Capstone: route planner — Graphs + Dijkstra on real data. `gr-3-capstone-2`
- Capstone: ML from scratch — Train a model with only numpy. `gr-3-capstone-3`
- 🏆 Checkpoint test
