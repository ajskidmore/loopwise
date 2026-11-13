/**
 * THE ROADMAP — every track, unit and lesson planned for Loopwise.
 *
 * This file is the single source of truth for curriculum STRUCTURE.
 * Lesson CONTENT (the steps) lives in src/content/lessons/** and is attached by id
 * in src/content/index.ts. A lesson with no content is shown as "coming soon".
 *
 * To add a lesson: add a row here, then write its steps in a lessons file
 * (see docs/CONTENT_GUIDE.md). Never change an existing id — progress is keyed by id.
 *
 * Row format:  [slug, title, summary, "comma, separated, tags"]
 * Lesson id = `${unitId}-${slug}`
 */
import type { Track, TrackCategory, Language } from './types';

type Row = [slug: string, title: string, summary: string, tags: string];
interface UnitDef { id: string; title: string; summary: string; lessons: Row[] }
interface TrackDef {
  id: string; title: string; tagline: string; description: string; category: TrackCategory;
  icon: string; color: string; language?: Language; prerequisites: string[]; estimatedHours: number;
  units: UnitDef[];
}

const u = (id: string, title: string, summary: string, lessons: Row[]): UnitDef => ({ id, title, summary, lessons });

const TRACKS: TrackDef[] = [
  // ================================================================ 1. FOUNDATIONS
  {
    id: 'foundations', title: 'How Computers Think', icon: '🧠', color: '#7452FF', category: 'foundations',
    tagline: 'Start here. Zero experience needed.',
    description: 'What code is, how computers run it, and how programmers think. No typing code yet — just the mental models everything else builds on.',
    prerequisites: [], estimatedHours: 4,
    units: [
      u('fnd-1', 'What is programming?', 'Code, algorithms, and why computers need exact instructions.', [
        ['what-is-code', 'What is code?', 'Code is a list of exact instructions a computer follows.', 'code, program, instructions'],
        ['algorithms', 'Algorithms are recipes', 'Step-by-step plans for solving problems.', 'algorithm, steps, sequence'],
        ['input-output', 'Input → Process → Output', 'Every program takes something in, works on it, and gives something back.', 'input, output, process'],
        ['bugs', 'Bugs happen (and that is fine)', 'Mistakes in code, and the debugging mindset.', 'bug, debugging, error'],
      ]),
      u('fnd-2', 'Inside the machine', 'CPU, memory, storage, and the bits underneath it all.', [
        ['hardware', 'CPU, memory and storage', 'The three parts of a computer every programmer must know.', 'cpu, ram, memory, storage, hardware'],
        ['bits', 'Bits and bytes', 'Everything in a computer is 0s and 1s.', 'bit, byte, binary'],
        ['files', 'Files, folders and paths', 'How data is organized and found on disk.', 'file, folder, directory, path'],
        ['languages', 'Why so many languages?', 'Compiled vs interpreted, high-level vs low-level.', 'compiler, interpreter, programming language, high-level, low-level'],
      ]),
      u('fnd-3', 'Thinking like a programmer', 'Break problems down, write pseudocode, and trace programs by hand.', [
        ['decomposition', 'Break it down', 'Decomposition: splitting big problems into small ones.', 'decomposition, problem solving'],
        ['pseudocode', 'Pseudocode', 'Plan in plain English before writing code.', 'pseudocode, planning'],
        ['flowcharts', 'Flowcharts and decisions', 'Drawing branches and loops.', 'flowchart, branch, loop'],
        ['tracing', 'Tracing by hand', 'Play computer: follow code line by line.', 'tracing, trace table, debugging'],
      ]),
    ],
  },

  // ================================================================ 2. MATH REFRESHER
  {
    id: 'math-0', title: 'Math Refresher', icon: '🔢', color: '#C74F00', category: 'math',
    tagline: 'The pre-college math CS builds on.',
    description: 'Arithmetic, algebra, number systems and growth — re-learned from scratch with programmer-friendly examples. Needed for Discrete Math, Algorithms and everything after.',
    prerequisites: [], estimatedHours: 12,
    units: [
      u('m0-1', 'Numbers', 'Integers, fractions, order of operations and exponents.', [
        ['number-types', 'Kinds of numbers', 'Naturals, integers, rationals, reals.', 'integer, fraction, decimal, real number'],
        ['order-of-ops', 'Order of operations', 'PEMDAS and why computers follow it too.', 'pemdas, order of operations, precedence'],
        ['negatives', 'Negative numbers', 'Adding, subtracting and multiplying negatives.', 'negative numbers, absolute value'],
        ['exponents', 'Exponents and roots', 'Powers, square roots, and exponent rules.', 'exponent, power, square root'],
      ]),
      u('m0-2', 'Algebra', 'Variables, equations and functions.', [
        ['variables', 'Variables and expressions', 'Letters that stand for numbers.', 'variable, expression, algebra'],
        ['equations', 'Solving equations', 'Do the same thing to both sides.', 'equation, solve, linear equation'],
        ['inequalities', 'Inequalities', 'Less than, greater than, and ranges.', 'inequality, range'],
        ['functions', 'Functions and graphs', 'f(x), inputs, outputs and plotting.', 'function, graph, slope, linear'],
      ]),
      u('m0-3', 'Number systems', 'Binary, hex, remainders and logarithms.', [
        ['binary', 'Counting in binary', 'Base 2: how computers count.', 'binary, base 2, place value'],
        ['hex', 'Hexadecimal', 'Base 16: colors, memory addresses.', 'hexadecimal, base 16'],
        ['modular', 'Remainders and modular arithmetic', 'Clock math and the % operator.', 'modulo, remainder, modular arithmetic'],
        ['logarithms', 'Logarithms', 'The opposite of exponents — and why log₂ is everywhere in CS.', 'logarithm, log, exponent'],
      ]),
      u('m0-4', 'Sequences and growth', 'Summations and how fast things grow.', [
        ['sigma', 'Sigma notation', 'Writing long sums compactly.', 'sigma, summation, series'],
        ['series', 'Arithmetic and geometric series', 'The two sums you will see in algorithm analysis.', 'arithmetic series, geometric series'],
        ['growth', 'Growth rates', 'Linear vs quadratic vs exponential.', 'growth, linear, quadratic, exponential'],
      ]),
    ],
  },

  // ================================================================ 3. PYTHON BASICS
  {
    id: 'python-1', title: 'Python Basics', icon: '🐍', color: '#1F8454', category: 'programming', language: 'python',
    tagline: 'Your first real programming language.',
    description: 'Write and run real Python in your browser. Variables, decisions, loops, functions and collections — the building blocks of every program.',
    prerequisites: ['foundations'], estimatedHours: 30,
    units: [
      u('py-1', 'First steps', 'Print, comments, variables and reading errors.', [
        ['hello', 'Hello, world!', 'Run your first program with print().', 'print, string, output, hello world'],
        ['comments', 'Comments', 'Notes for humans that Python ignores.', 'comment, #'],
        ['variables', 'Variables', 'Store values with names.', 'variable, assignment, ='],
        ['errors', 'Reading error messages', 'SyntaxError, NameError and how to fix them.', 'error, traceback, syntaxerror, nameerror'],
      ]),
      u('py-2', 'Numbers and math', 'Arithmetic, integer division, remainders and types.', [
        ['arithmetic', 'Arithmetic operators', '+ - * / and **.', 'arithmetic, operator, int, float'],
        ['division', 'Division and remainders', '/, // and %.', 'floor division, modulo, remainder'],
        ['types', 'Types and conversion', 'int, float, str and converting between them.', 'type, int, float, str, conversion'],
        ['math-module', 'The math module', 'sqrt, floor, ceil and more.', 'math module, import, sqrt'],
      ]),
      u('py-3', 'Strings', 'Text: joining, formatting, indexing and slicing.', [
        ['strings', 'Working with text', 'Quotes, concatenation and len().', 'string, concatenation, len'],
        ['fstrings', 'f-strings', 'Put variables inside text.', 'f-string, format, interpolation'],
        ['indexing', 'Indexing and slicing', 'Grab characters and pieces of a string.', 'index, slice, string'],
        ['methods', 'String methods', 'upper, lower, strip, replace, split.', 'method, upper, lower, split, replace'],
      ]),
      u('py-4', 'Making decisions', 'Booleans, comparisons and if/elif/else.', [
        ['booleans', 'True and False', 'Booleans and comparison operators.', 'boolean, comparison, ==, !='],
        ['if', 'if and else', 'Run code only when a condition is true.', 'if, else, condition, indentation'],
        ['elif', 'elif chains', 'Choosing between many options.', 'elif, branching'],
        ['logic', 'and, or, not', 'Combining conditions.', 'and, or, not, logical operator'],
      ]),
      u('py-5', 'Loops', 'Repeat work with while and for.', [
        ['while', 'while loops', 'Repeat while a condition holds.', 'while, loop, infinite loop'],
        ['for-range', 'for loops and range()', 'Count through numbers.', 'for, range, iteration'],
        ['patterns', 'Loop patterns', 'Counters, accumulators and searching.', 'accumulator, counter, pattern'],
        ['break-continue', 'break and continue', 'Leaving and skipping loop turns.', 'break, continue'],
        ['nested', 'Nested loops', 'Loops inside loops.', 'nested loop, grid'],
      ]),
      u('py-6', 'Functions', 'Package code into reusable pieces.', [
        ['def', 'Defining functions', 'def, calling, and why functions matter.', 'function, def, call'],
        ['parameters', 'Parameters and arguments', 'Passing information in.', 'parameter, argument'],
        ['return', 'Returning values', 'Getting information back out.', 'return, value, none'],
        ['scope', 'Scope', 'Where variables live.', 'scope, local, global'],
        ['defaults', 'Default and keyword arguments', 'Flexible function calls.', 'default argument, keyword argument'],
      ]),
      u('py-7', 'Lists', 'Ordered collections.', [
        ['lists', 'Making lists', 'Create, index and change lists.', 'list, index, mutable'],
        ['list-methods', 'List methods', 'append, insert, remove, pop, sort.', 'append, pop, sort, method'],
        ['looping-lists', 'Looping over lists', 'for item in list, enumerate.', 'for, enumerate, iteration'],
        ['comprehensions', 'List comprehensions', 'Build lists in one line.', 'list comprehension'],
      ]),
      u('py-8', 'Dictionaries, tuples and sets', 'Key-value lookups and other collections.', [
        ['dicts', 'Dictionaries', 'Look things up by key.', 'dictionary, dict, key, value'],
        ['dict-loops', 'Looping over dictionaries', 'keys, values and items.', 'items, keys, values'],
        ['tuples', 'Tuples', 'Fixed groups of values and unpacking.', 'tuple, unpacking, immutable'],
        ['sets', 'Sets', 'Unique items and fast membership checks.', 'set, unique, membership'],
      ]),
    ],
  },

  // ================================================================ 4. DEVELOPER TOOLS
  {
    id: 'tools', title: 'Developer Tools', icon: '🛠️', color: '#5B6B7F', category: 'foundations',
    tagline: 'The terminal, Git and your editor.',
    description: 'The everyday tools every grad program assumes you already know: the command line, Git, VS Code, and package managers.',
    prerequisites: ['foundations'], estimatedHours: 8,
    units: [
      u('tl-1', 'The command line', 'Navigate and work with files from a terminal.', [
        ['terminal', 'What is a terminal?', 'Shells, prompts and commands.', 'terminal, shell, command line, bash'],
        ['navigation', 'Moving around', 'pwd, ls, cd.', 'pwd, ls, cd, path'],
        ['files', 'Working with files', 'mkdir, touch, cp, mv, rm.', 'mkdir, cp, mv, rm'],
        ['pipes', 'Pipes and redirection', 'Chain commands together.', 'pipe, redirection, grep'],
      ]),
      u('tl-2', 'Git and GitHub', 'Version control for every project.', [
        ['why-git', 'Why version control?', 'Snapshots, history and collaboration.', 'git, version control'],
        ['commits', 'Commits', 'add, commit, log.', 'commit, staging, git add'],
        ['branches', 'Branches and merging', 'Work in parallel safely.', 'branch, merge, conflict'],
        ['github', 'GitHub and remotes', 'push, pull, pull requests.', 'github, push, pull, pull request'],
      ]),
      u('tl-3', 'Your coding setup', 'Editors, packages and environments.', [
        ['editor', 'VS Code essentials', 'Extensions, shortcuts, debugger.', 'vs code, editor, debugger'],
        ['packages', 'Package managers', 'pip and npm.', 'pip, npm, package'],
        ['venv', 'Virtual environments', 'Isolated project dependencies.', 'virtualenv, venv, dependencies'],
      ]),
    ],
  },

  // ================================================================ 5. PYTHON INTERMEDIATE
  {
    id: 'python-2', title: 'Python Intermediate', icon: '🐉', color: '#12834A', category: 'programming', language: 'python',
    tagline: 'Objects, recursion, testing and real programs.',
    description: 'Level up to the Python used in grad courses: error handling, modules, object-oriented programming, recursion and testing.',
    prerequisites: ['python-1'], estimatedHours: 30,
    units: [
      u('py2-1', 'Errors and files', 'Handle failures gracefully.', [
        ['exceptions', 'try and except', 'Catch errors instead of crashing.', 'exception, try, except'],
        ['raising', 'Raising exceptions', 'Signal problems from your own code.', 'raise, valueerror'],
        ['files', 'Reading and writing files', 'open, with, read, write.', 'file, open, with, read, write'],
      ]),
      u('py2-2', 'Modules and the standard library', 'Reuse code that already exists.', [
        ['imports', 'import and modules', 'Splitting code across files.', 'import, module'],
        ['random', 'random and datetime', 'Randomness and dates.', 'random, datetime'],
        ['collections', 'collections', 'Counter, defaultdict, deque.', 'counter, defaultdict, deque'],
      ]),
      u('py2-3', 'Object-oriented programming', 'Model the world with classes.', [
        ['classes', 'Classes and objects', 'Blueprints and instances.', 'class, object, instance'],
        ['init-methods', '__init__ and methods', 'Attributes and behavior.', '__init__, method, self, attribute'],
        ['inheritance', 'Inheritance', 'Reuse and specialize classes.', 'inheritance, subclass, super'],
        ['dunder', 'Special methods', '__str__, __eq__, __len__.', 'dunder, __str__, __eq__'],
      ]),
      u('py2-4', 'Recursion', 'Functions that call themselves.', [
        ['intro', 'Thinking recursively', 'Base case and recursive case.', 'recursion, base case'],
        ['call-stack', 'The call stack', 'What happens in memory.', 'call stack, stack frame'],
        ['patterns', 'Recursive patterns', 'Sums, reversing, and tree-shaped calls.', 'recursion, fibonacci, factorial'],
      ]),
      u('py2-5', 'Testing and debugging', 'Prove your code works.', [
        ['assert', 'assert and test cases', 'Think in inputs and expected outputs.', 'assert, test case'],
        ['unittest', 'Unit tests', 'Writing a test suite.', 'unittest, pytest, unit test'],
        ['debugging', 'Debugging strategies', 'Print debugging, rubber ducking, bisecting.', 'debugging, print debugging'],
      ]),
      u('py2-6', 'Pythonic code', 'Functional tools and iterators.', [
        ['lambdas', 'Lambdas, map and filter', 'Small anonymous functions.', 'lambda, map, filter, sorted key'],
        ['generators', 'Iterators and generators', 'yield and lazy sequences.', 'iterator, generator, yield'],
        ['comprehensions', 'Advanced comprehensions', 'Dict and set comprehensions.', 'dict comprehension, set comprehension'],
      ]),
    ],
  },

  // ================================================================ 6. DISCRETE MATH
  {
    id: 'discrete-math', title: 'Discrete Math', icon: '♾️', color: '#DB2665', category: 'math',
    tagline: 'The math of computer science.',
    description: 'Logic, proofs, counting, graphs and number theory — the language used by every algorithms and theory course.',
    prerequisites: ['math-0'], estimatedHours: 35,
    units: [
      u('dm-1', 'Logic', 'Statements, truth tables and quantifiers.', [
        ['propositions', 'Propositions', 'True/false statements and connectives.', 'proposition, and, or, not, logic'],
        ['truth-tables', 'Truth tables', 'Evaluate any logical expression.', 'truth table'],
        ['implication', 'If-then (implication)', 'Implication, converse, contrapositive.', 'implication, contrapositive, converse'],
        ['quantifiers', 'For all and there exists', 'Quantifiers and negation.', 'quantifier, for all, there exists'],
      ]),
      u('dm-2', 'Proofs', 'How to convince anyone something is true.', [
        ['direct', 'Direct proof', 'Chain facts to a conclusion.', 'proof, direct proof'],
        ['contradiction', 'Proof by contradiction', 'Assume the opposite and break it.', 'contradiction, proof'],
        ['induction', 'Mathematical induction', 'Dominoes: base case + step.', 'induction, base case, inductive step'],
        ['strong-induction', 'Strong induction', 'Using all previous cases.', 'strong induction'],
      ]),
      u('dm-3', 'Sets, functions and relations', 'The vocabulary of math.', [
        ['sets', 'Sets and set operations', 'Union, intersection, difference.', 'set, union, intersection, subset'],
        ['functions', 'Functions', 'One-to-one, onto, bijections.', 'function, injective, surjective, bijection'],
        ['relations', 'Relations', 'Equivalence relations and orders.', 'relation, equivalence relation'],
      ]),
      u('dm-4', 'Counting', 'How many ways can it happen?', [
        ['rules', 'Sum and product rules', 'The basic counting principles.', 'counting, product rule, sum rule'],
        ['permutations', 'Permutations', 'Arrangements where order matters.', 'permutation, factorial'],
        ['combinations', 'Combinations', 'Choosing where order does not matter.', 'combination, binomial coefficient'],
        ['pigeonhole', 'Pigeonhole principle', 'More pigeons than holes.', 'pigeonhole principle'],
        ['inclusion-exclusion', 'Inclusion–exclusion', 'Counting overlaps correctly.', 'inclusion exclusion'],
      ]),
      u('dm-5', 'Graphs and trees', 'Networks of things.', [
        ['graphs', 'Graph vocabulary', 'Vertices, edges, degree, paths.', 'graph, vertex, edge, degree'],
        ['trees', 'Trees', 'Connected graphs with no cycles.', 'tree, cycle, connected'],
        ['euler', 'Euler and Hamilton paths', 'Classic path problems.', 'euler path, hamiltonian path'],
        ['coloring', 'Graph coloring', 'Scheduling with colors.', 'graph coloring, bipartite'],
      ]),
      u('dm-6', 'Number theory', 'Divisibility, primes and cryptography.', [
        ['divisibility', 'Divisibility and primes', 'Factors, primes, prime factorization.', 'prime, divisibility, factor'],
        ['gcd', 'GCD and Euclid\'s algorithm', 'The oldest algorithm still in use.', 'gcd, euclidean algorithm'],
        ['modular', 'Modular arithmetic', 'Congruences and inverses.', 'modular arithmetic, congruence, inverse'],
        ['rsa', 'How RSA works', 'Public-key crypto from number theory.', 'rsa, cryptography, public key'],
      ]),
      u('dm-7', 'Recurrences', 'Equations that refer to themselves.', [
        ['recurrences', 'Recurrence relations', 'Describing sequences recursively.', 'recurrence relation'],
        ['solving', 'Solving recurrences', 'Unrolling and guessing patterns.', 'recurrence, closed form'],
      ]),
    ],
  },

  // ================================================================ 7. DATA STRUCTURES
  {
    id: 'data-structures', title: 'Data Structures', icon: '🧱', color: '#0569FF', category: 'cs-core', language: 'python',
    tagline: 'Organize data so programs fly.',
    description: 'Build arrays, linked lists, stacks, queues, hash tables, trees, heaps and graphs yourself — and learn when to use each.',
    prerequisites: ['python-2'], estimatedHours: 40,
    units: [
      u('ds-1', 'Arrays and linked lists', 'Sequential data two ways.', [
        ['arrays', 'Arrays and dynamic arrays', 'Contiguous memory and resizing.', 'array, dynamic array, amortized'],
        ['linked-lists', 'Linked lists', 'Nodes and pointers.', 'linked list, node, pointer'],
        ['compare', 'Array vs linked list', 'Trade-offs in time and memory.', 'trade-off, big o'],
      ]),
      u('ds-2', 'Stacks and queues', 'Last-in-first-out and first-in-first-out.', [
        ['stacks', 'Stacks', 'push, pop and the undo button.', 'stack, lifo, push, pop'],
        ['queues', 'Queues and deques', 'Lines and buffers.', 'queue, fifo, deque'],
        ['applications', 'Stack and queue problems', 'Balanced brackets and more.', 'balanced parentheses, stack'],
      ]),
      u('ds-3', 'Hash tables', 'Instant lookups.', [
        ['hashing', 'Hash functions', 'Turning keys into indexes.', 'hash function, hashing'],
        ['collisions', 'Collisions', 'Chaining and open addressing.', 'collision, chaining, open addressing'],
        ['using', 'Hash map problems', 'Counting, grouping, two-sum.', 'hash map, two sum, frequency'],
      ]),
      u('ds-4', 'Trees', 'Hierarchical data.', [
        ['binary-trees', 'Binary trees', 'Nodes with two children.', 'binary tree, node, root, leaf'],
        ['traversals', 'Tree traversals', 'Pre-order, in-order, post-order, level-order.', 'traversal, inorder, preorder, bfs'],
        ['bst', 'Binary search trees', 'Ordered trees for fast search.', 'binary search tree, bst'],
        ['balanced', 'Balanced trees', 'AVL and red-black intuition.', 'avl, red-black tree, balanced'],
      ]),
      u('ds-5', 'Heaps and priority queues', 'Always grab the smallest.', [
        ['heaps', 'Binary heaps', 'Heap property and heapify.', 'heap, min heap, heapify'],
        ['priority-queues', 'Priority queues', 'heapq and top-k problems.', 'priority queue, heapq, top k'],
      ]),
      u('ds-6', 'Graphs', 'Represent networks in code.', [
        ['representation', 'Adjacency lists and matrices', 'Two ways to store a graph.', 'adjacency list, adjacency matrix'],
        ['tries', 'Tries', 'Prefix trees for words.', 'trie, prefix tree'],
        ['union-find', 'Union–find', 'Tracking connected groups.', 'union find, disjoint set'],
      ]),
    ],
  },

  // ================================================================ 8. ALGORITHMS
  {
    id: 'algorithms', title: 'Algorithms', icon: '⚙️', color: '#0C808B', category: 'cs-core', language: 'python',
    tagline: 'Big-O, sorting, DP, graphs — interview and grad-level.',
    description: 'Analyze and design algorithms like a grad student: complexity, sorting, divide-and-conquer, greedy, dynamic programming, graph algorithms and NP-completeness.',
    prerequisites: ['data-structures', 'discrete-math'], estimatedHours: 50,
    units: [
      u('al-1', 'Complexity', 'Measuring how algorithms scale.', [
        ['big-o', 'Big-O notation', 'Describing growth.', 'big o, time complexity'],
        ['analysis', 'Analyzing loops', 'Count the work.', 'complexity analysis, nested loops'],
        ['space', 'Space complexity', 'Memory usage.', 'space complexity, memory'],
        ['omega-theta', 'Big-Ω and Big-Θ', 'Lower and tight bounds.', 'big omega, big theta, asymptotic'],
      ]),
      u('al-2', 'Searching and sorting', 'The classics.', [
        ['binary-search', 'Binary search', 'Halve the problem every step.', 'binary search, logarithmic'],
        ['simple-sorts', 'Selection and insertion sort', 'Simple O(n²) sorts.', 'selection sort, insertion sort'],
        ['merge-sort', 'Merge sort', 'Divide, sort, merge.', 'merge sort, divide and conquer'],
        ['quick-sort', 'Quicksort', 'Partition around a pivot.', 'quicksort, partition, pivot'],
        ['linear-sorts', 'Counting and radix sort', 'Beating n log n with assumptions.', 'counting sort, radix sort'],
      ]),
      u('al-3', 'Problem-solving patterns', 'Reusable LeetCode techniques.', [
        ['two-pointers', 'Two pointers', 'Walk from both ends.', 'two pointers'],
        ['sliding-window', 'Sliding window', 'Subarrays efficiently.', 'sliding window, subarray'],
        ['prefix-sums', 'Prefix sums', 'Range sums in O(1).', 'prefix sum'],
        ['backtracking', 'Backtracking', 'Try, undo, try again.', 'backtracking, permutations, subsets'],
      ]),
      u('al-4', 'Divide and conquer', 'Split, solve, combine.', [
        ['recurrences', 'Recurrences for algorithms', 'T(n) = 2T(n/2) + n.', 'recurrence, divide and conquer'],
        ['master-theorem', 'The Master Theorem', 'Solve recurrences fast.', 'master theorem'],
        ['examples', 'Classic D&C problems', 'Max subarray, closest pair, fast multiplication.', 'karatsuba, closest pair'],
      ]),
      u('al-5', 'Greedy algorithms', 'Take the best choice now.', [
        ['greedy', 'Greedy choice', 'When greedy works and when it fails.', 'greedy, optimal substructure'],
        ['scheduling', 'Interval scheduling', 'Classic greedy problem.', 'interval scheduling, greedy'],
        ['huffman', 'Huffman coding', 'Compression with a greedy tree.', 'huffman coding, compression'],
      ]),
      u('al-6', 'Dynamic programming', 'Remember answers to subproblems.', [
        ['memoization', 'Memoization', 'Cache recursive results.', 'memoization, dynamic programming, cache'],
        ['tabulation', 'Tabulation', 'Fill a table bottom-up.', 'tabulation, bottom up'],
        ['classic-1d', 'Classic 1-D DP', 'Climbing stairs, house robber, coin change.', 'coin change, 1d dp'],
        ['classic-2d', 'Classic 2-D DP', 'LCS, edit distance, knapsack.', 'knapsack, lcs, edit distance'],
      ]),
      u('al-7', 'Graph algorithms', 'Search, paths and trees.', [
        ['bfs-dfs', 'BFS and DFS', 'Exploring graphs.', 'bfs, dfs, graph search'],
        ['topo-sort', 'Topological sort', 'Ordering with dependencies.', 'topological sort, dag'],
        ['dijkstra', 'Dijkstra\'s shortest paths', 'Weighted shortest paths.', 'dijkstra, shortest path'],
        ['mst', 'Minimum spanning trees', 'Kruskal and Prim.', 'minimum spanning tree, kruskal, prim'],
        ['bellman-ford', 'Bellman–Ford and Floyd–Warshall', 'Negative edges and all pairs.', 'bellman ford, floyd warshall'],
      ]),
      u('al-8', 'Hard problems', 'What computers cannot do quickly.', [
        ['p-np', 'P, NP and NP-complete', 'The biggest open question in CS.', 'p vs np, np complete'],
        ['reductions', 'Reductions', 'Proving problems are hard.', 'reduction, np hard'],
        ['approximation', 'Approximation algorithms', 'Good-enough answers fast.', 'approximation algorithm, heuristic'],
      ]),
    ],
  },

  // ================================================================ 9. WEB: HTML & CSS
  {
    id: 'web-1', title: 'Web Basics: HTML & CSS', icon: '🌐', color: '#E8121B', category: 'web', language: 'html',
    tagline: 'Build real web pages.',
    description: 'Structure pages with HTML and style them with CSS, including layout with flexbox and grid and accessibility basics.',
    prerequisites: ['foundations'], estimatedHours: 15,
    units: [
      u('wb-1', 'HTML', 'The structure of a page.', [
        ['tags', 'Tags and elements', 'Headings, paragraphs, links.', 'html, tag, element'],
        ['structure', 'Page structure', 'head, body, semantic tags.', 'semantic html, head, body'],
        ['forms', 'Forms and inputs', 'Collect data from users.', 'form, input, button'],
        ['accessibility', 'Accessible HTML', 'Alt text, labels and landmarks.', 'accessibility, a11y, wcag'],
      ]),
      u('wb-2', 'CSS', 'The look of a page.', [
        ['selectors', 'Selectors and properties', 'Targeting elements to style.', 'css, selector, property'],
        ['box-model', 'The box model', 'Margin, border, padding.', 'box model, margin, padding'],
        ['flexbox', 'Flexbox', 'One-dimensional layouts.', 'flexbox, layout'],
        ['grid', 'CSS Grid', 'Two-dimensional layouts.', 'css grid, layout'],
        ['responsive', 'Responsive design', 'Media queries and mobile first.', 'responsive, media query'],
      ]),
    ],
  },

  // ================================================================ 10. JAVASCRIPT
  {
    id: 'javascript', title: 'JavaScript', icon: '⚡', color: '#916F08', category: 'programming', language: 'javascript',
    tagline: 'The language of the web.',
    description: 'Learn JavaScript as your second language: syntax, functions, objects, the DOM, async code and TypeScript.',
    prerequisites: ['python-1'], estimatedHours: 30,
    units: [
      u('js-1', 'JavaScript basics', 'Same ideas, new syntax.', [
        ['hello', 'console.log and variables', 'let, const and printing.', 'console.log, let, const'],
        ['types', 'Types and operators', 'Numbers, strings, == vs ===.', 'type, ===, typeof'],
        ['control', 'if and loops', 'Braces instead of indentation.', 'if, for, while'],
      ]),
      u('js-2', 'Functions and collections', 'Arrays and objects.', [
        ['functions', 'Functions and arrow functions', 'function vs =>.', 'function, arrow function'],
        ['arrays', 'Arrays', 'map, filter, reduce.', 'array, map, filter, reduce'],
        ['objects', 'Objects', 'Key-value data and JSON.', 'object, json'],
      ]),
      u('js-3', 'The browser', 'Make pages interactive.', [
        ['dom', 'The DOM', 'Find and change elements.', 'dom, querySelector'],
        ['events', 'Events', 'Respond to clicks and typing.', 'event, addEventListener'],
      ]),
      u('js-4', 'Async JavaScript', 'Waiting without freezing.', [
        ['callbacks', 'Callbacks', 'Functions that run later.', 'callback, setTimeout'],
        ['promises', 'Promises and async/await', 'Readable async code.', 'promise, async, await'],
        ['fetch', 'fetch and APIs', 'Talk to servers.', 'fetch, api, http'],
      ]),
      u('js-5', 'TypeScript', 'JavaScript with types.', [
        ['types', 'Type annotations', 'Catch bugs before running.', 'typescript, type annotation'],
        ['interfaces', 'Interfaces and generics', 'Describe data shapes.', 'interface, generics'],
      ]),
    ],
  },

  // ================================================================ 11. SQL
  {
    id: 'sql', title: 'SQL & Databases', icon: '🗄️', color: '#7A4FD6', category: 'cs-core', language: 'sql',
    tagline: 'Ask questions of data.',
    description: 'Query real databases in the browser, then learn how databases are designed: normalization, indexes and transactions.',
    prerequisites: ['python-1'], estimatedHours: 20,
    units: [
      u('sq-1', 'Querying', 'SELECT your way to answers.', [
        ['select', 'SELECT and FROM', 'Read rows from a table.', 'select, from, table'],
        ['where', 'WHERE and ORDER BY', 'Filter and sort.', 'where, order by, filter'],
        ['aggregates', 'Aggregates and GROUP BY', 'COUNT, SUM, AVG.', 'group by, count, sum, avg'],
        ['joins', 'JOINs', 'Combine tables.', 'join, inner join, left join'],
      ]),
      u('sq-2', 'Changing data', 'Insert, update, delete.', [
        ['insert', 'INSERT, UPDATE, DELETE', 'Modify table contents.', 'insert, update, delete'],
        ['schema', 'CREATE TABLE and keys', 'Primary and foreign keys.', 'create table, primary key, foreign key'],
      ]),
      u('sq-3', 'Database design', 'Build databases that last.', [
        ['normalization', 'Normalization', '1NF, 2NF, 3NF.', 'normalization, normal form'],
        ['indexes', 'Indexes', 'Fast lookups and their cost.', 'index, b-tree'],
        ['transactions', 'Transactions and ACID', 'All-or-nothing changes.', 'transaction, acid'],
      ]),
    ],
  },

  // ================================================================ 12. JAVA
  {
    id: 'java', title: 'Java & OOP', icon: '☕', color: '#C0392B', category: 'languages', language: 'java',
    tagline: 'Strongly typed object-oriented programming.',
    description: 'Many grad courses use Java. Learn static types, classes, interfaces, collections and generics.',
    prerequisites: ['python-2'], estimatedHours: 25,
    units: [
      u('jv-1', 'Java basics', 'Static types and compilation.', [
        ['hello', 'Hello, Java', 'class, main and System.out.println.', 'java, main, println'],
        ['types', 'Static types', 'int, double, String, boolean.', 'static typing, primitive'],
        ['control', 'Control flow', 'if, for, while in Java.', 'if, for, while'],
      ]),
      u('jv-2', 'Objects in Java', 'Classes done the Java way.', [
        ['classes', 'Classes and constructors', 'Fields, methods and new.', 'class, constructor, new'],
        ['encapsulation', 'Encapsulation', 'public, private and getters.', 'encapsulation, private, public'],
        ['interfaces', 'Interfaces and abstract classes', 'Contracts between classes.', 'interface, abstract class, polymorphism'],
      ]),
      u('jv-3', 'Collections and generics', 'Lists and maps with types.', [
        ['collections', 'ArrayList and HashMap', 'The Java collections framework.', 'arraylist, hashmap, collections'],
        ['generics', 'Generics', 'Type parameters.', 'generics, type parameter'],
        ['exceptions', 'Exceptions', 'Checked vs unchecked.', 'exception, checked exception'],
      ]),
    ],
  },

  // ================================================================ 13. C & SYSTEMS
  {
    id: 'c-systems', title: 'C & Computer Systems', icon: '🔧', color: '#4A5568', category: 'systems', language: 'c',
    tagline: 'Pointers, memory and what really happens.',
    description: 'Get close to the hardware: C, pointers, the stack and heap, bits, compilation and a taste of assembly.',
    prerequisites: ['python-2'], estimatedHours: 35,
    units: [
      u('c-1', 'C basics', 'A small, powerful language.', [
        ['hello', 'Hello, C', 'Compiling and running.', 'c, gcc, compile, printf'],
        ['types', 'Types and sizes', 'int, char, float and sizeof.', 'sizeof, char, int'],
        ['functions', 'Functions and headers', 'Declarations and #include.', 'header, include, prototype'],
      ]),
      u('c-2', 'Pointers and memory', 'The heart of C.', [
        ['pointers', 'Pointers', 'Addresses and dereferencing.', 'pointer, address, dereference'],
        ['arrays', 'Arrays and strings in C', 'Null-terminated strings.', 'array, c string, null terminator'],
        ['heap', 'malloc and free', 'Dynamic memory.', 'malloc, free, heap, memory leak'],
        ['structs', 'structs', 'Grouping data.', 'struct'],
      ]),
      u('c-3', 'Under the hood', 'From source to silicon.', [
        ['bitwise', 'Bitwise operators', '&, |, ^, <<, >>.', 'bitwise, shift, mask'],
        ['compilation', 'How compilation works', 'Preprocess, compile, assemble, link.', 'compiler, linker, assembler'],
        ['assembly', 'Assembly basics', 'Registers and instructions.', 'assembly, register, instruction'],
        ['stack-heap', 'Stack vs heap', 'Memory layout of a program.', 'stack, heap, memory layout'],
      ]),
    ],
  },

  // ================================================================ 14. C++
  {
    id: 'cpp', title: 'C++', icon: '➕', color: '#00599C', category: 'languages', language: 'cpp',
    tagline: 'Performance with abstractions.',
    description: 'Classes, RAII, the STL and templates — the C++ used in systems, graphics and competitive programming.',
    prerequisites: ['c-systems'], estimatedHours: 25,
    units: [
      u('cp-1', 'C++ essentials', 'C with superpowers.', [
        ['hello', 'Hello, C++', 'iostream, namespaces, references.', 'c++, iostream, reference'],
        ['classes', 'Classes and RAII', 'Constructors, destructors, ownership.', 'raii, destructor, class'],
        ['stl', 'The STL', 'vector, map, algorithms.', 'stl, vector, map'],
      ]),
      u('cp-2', 'Modern C++', 'Safer, faster code.', [
        ['templates', 'Templates', 'Generic programming.', 'template, generic'],
        ['smart-pointers', 'Smart pointers', 'unique_ptr and shared_ptr.', 'smart pointer, unique_ptr'],
        ['move', 'Move semantics', 'Avoiding copies.', 'move semantics, rvalue'],
      ]),
    ],
  },

  // ================================================================ 15. PROBABILITY & STATS
  {
    id: 'prob-stats', title: 'Probability & Statistics', icon: '🎲', color: '#AC5F05', category: 'math',
    tagline: 'Reasoning under uncertainty.',
    description: 'The probability and statistics needed for randomized algorithms, machine learning and research.',
    prerequisites: ['math-0'], estimatedHours: 30,
    units: [
      u('ps-1', 'Probability', 'Chance, made precise.', [
        ['basics', 'Outcomes and events', 'Sample spaces and probability rules.', 'probability, event, sample space'],
        ['conditional', 'Conditional probability', 'Probability given information.', 'conditional probability, independence'],
        ['bayes', 'Bayes\' theorem', 'Updating beliefs.', 'bayes theorem'],
      ]),
      u('ps-2', 'Random variables', 'Numbers that come from chance.', [
        ['random-variables', 'Random variables', 'Discrete and continuous.', 'random variable'],
        ['expectation', 'Expected value and variance', 'Averages and spread.', 'expected value, variance, standard deviation'],
        ['distributions', 'Common distributions', 'Bernoulli, binomial, uniform, normal.', 'binomial, normal distribution, uniform'],
      ]),
      u('ps-3', 'Statistics', 'Learning from data.', [
        ['descriptive', 'Descriptive statistics', 'Mean, median, mode, spread.', 'mean, median, mode'],
        ['sampling', 'Sampling and the CLT', 'Why averages are normal.', 'central limit theorem, sampling'],
        ['testing', 'Hypothesis testing', 'p-values and confidence intervals.', 'hypothesis test, p-value, confidence interval'],
      ]),
    ],
  },

  // ================================================================ 16. LINEAR ALGEBRA
  {
    id: 'linear-algebra', title: 'Linear Algebra', icon: '📐', color: '#2563EB', category: 'math',
    tagline: 'Vectors and matrices — the math of ML and graphics.',
    description: 'Vectors, matrices, transformations, and eigenvalues, with code examples in Python.',
    prerequisites: ['math-0'], estimatedHours: 30,
    units: [
      u('la-1', 'Vectors', 'Arrows and lists of numbers.', [
        ['vectors', 'What is a vector?', 'Magnitude, direction, components.', 'vector, magnitude'],
        ['operations', 'Vector operations', 'Add, scale, dot product.', 'dot product, vector addition'],
      ]),
      u('la-2', 'Matrices', 'Grids that transform space.', [
        ['matrices', 'Matrices', 'Rows, columns and shape.', 'matrix, rows, columns'],
        ['multiplication', 'Matrix multiplication', 'Combining transformations.', 'matrix multiplication'],
        ['systems', 'Systems of equations', 'Gaussian elimination.', 'linear system, gaussian elimination'],
        ['inverse', 'Inverses and determinants', 'Undoing a transformation.', 'inverse, determinant'],
      ]),
      u('la-3', 'Deeper ideas', 'Spaces and special vectors.', [
        ['span', 'Span, basis and rank', 'What a set of vectors can reach.', 'span, basis, rank, linear independence'],
        ['eigen', 'Eigenvalues and eigenvectors', 'Directions that only stretch.', 'eigenvalue, eigenvector'],
        ['applications', 'Linear algebra in ML', 'Data as matrices, PCA intuition.', 'pca, machine learning, matrix'],
      ]),
    ],
  },

  // ================================================================ 17. CALCULUS
  {
    id: 'calculus', title: 'Calculus Essentials', icon: '📈', color: '#04825B', category: 'math',
    tagline: 'Rates of change — enough for ML and analysis.',
    description: 'Limits, derivatives, optimization and gradients — the calculus needed for machine learning, without the fluff.',
    prerequisites: ['math-0'], estimatedHours: 25,
    units: [
      u('ca-1', 'Limits and derivatives', 'Instantaneous change.', [
        ['limits', 'Limits', 'Approaching a value.', 'limit'],
        ['derivatives', 'The derivative', 'Slope at a point.', 'derivative, slope, rate of change'],
        ['rules', 'Derivative rules', 'Power, product, chain rule.', 'chain rule, power rule'],
      ]),
      u('ca-2', 'Using derivatives', 'Find the best answer.', [
        ['optimization', 'Optimization', 'Maxima and minima.', 'optimization, maximum, minimum'],
        ['partials', 'Partial derivatives and gradients', 'Many variables.', 'partial derivative, gradient'],
        ['gradient-descent', 'Gradient descent', 'How models learn.', 'gradient descent'],
      ]),
      u('ca-3', 'Integrals', 'Adding up tiny pieces.', [
        ['integrals', 'The integral', 'Area under a curve.', 'integral, area'],
        ['ftc', 'Fundamental theorem of calculus', 'Derivatives and integrals undo each other.', 'fundamental theorem of calculus'],
      ]),
    ],
  },

  // ================================================================ 18. ARCHITECTURE & OS
  {
    id: 'architecture-os', title: 'Architecture & Operating Systems', icon: '🖥️', color: '#6B46C1', category: 'systems',
    tagline: 'How hardware and the OS really work.',
    description: 'Logic gates to CPUs, caches, processes, threads, concurrency, virtual memory and file systems.',
    prerequisites: ['c-systems'], estimatedHours: 35,
    units: [
      u('ao-1', 'Computer architecture', 'From gates to CPUs.', [
        ['gates', 'Logic gates', 'AND, OR, NOT in hardware.', 'logic gate, circuit'],
        ['cpu', 'Inside the CPU', 'Fetch, decode, execute, pipelines.', 'cpu, pipeline, instruction cycle'],
        ['caches', 'The memory hierarchy', 'Registers, caches, RAM, disk.', 'cache, memory hierarchy, locality'],
      ]),
      u('ao-2', 'Processes and threads', 'Running many things at once.', [
        ['processes', 'Processes', 'Programs in execution.', 'process, pid'],
        ['threads', 'Threads', 'Concurrency inside a process.', 'thread, concurrency'],
        ['scheduling', 'CPU scheduling', 'Who runs next?', 'scheduling, round robin'],
      ]),
      u('ao-3', 'Concurrency', 'Sharing safely.', [
        ['races', 'Race conditions', 'When timing breaks programs.', 'race condition'],
        ['locks', 'Locks and semaphores', 'Mutual exclusion.', 'lock, mutex, semaphore'],
        ['deadlock', 'Deadlock', 'Everyone waiting forever.', 'deadlock'],
      ]),
      u('ao-4', 'Memory and storage', 'Virtual memory and file systems.', [
        ['virtual-memory', 'Virtual memory', 'Pages and address translation.', 'virtual memory, paging, page table'],
        ['file-systems', 'File systems', 'Inodes, blocks and directories.', 'file system, inode'],
      ]),
    ],
  },

  // ================================================================ 19. NETWORKS & SECURITY
  {
    id: 'networks-security', title: 'Networks & Security', icon: '🔐', color: '#0E7490', category: 'systems',
    tagline: 'How the internet works and how to protect it.',
    description: 'Network layers, TCP/IP, HTTP, DNS, cryptography basics and common vulnerabilities.',
    prerequisites: ['foundations', 'python-1'], estimatedHours: 25,
    units: [
      u('ns-1', 'Networking', 'Packets around the world.', [
        ['layers', 'Network layers', 'The OSI and TCP/IP models.', 'osi model, network layer'],
        ['ip-tcp', 'IP, TCP and UDP', 'Addresses and reliable delivery.', 'ip address, tcp, udp'],
        ['http-dns', 'HTTP and DNS', 'How a web page loads.', 'http, dns, request, response'],
      ]),
      u('ns-2', 'Security', 'Thinking like an attacker (ethically).', [
        ['crypto', 'Encryption and hashing', 'Symmetric, asymmetric, hashes.', 'encryption, hashing, tls'],
        ['auth', 'Authentication', 'Passwords, sessions, tokens.', 'authentication, password, token'],
        ['vulnerabilities', 'Common vulnerabilities', 'Injection, XSS and how to prevent them.', 'sql injection, xss, owasp'],
      ]),
    ],
  },

  // ================================================================ 20. THEORY
  {
    id: 'theory', title: 'Theory of Computation', icon: '🤖', color: '#9333EA', category: 'advanced',
    tagline: 'What can computers compute at all?',
    description: 'Automata, regular expressions, grammars, Turing machines, decidability and complexity classes.',
    prerequisites: ['discrete-math', 'algorithms'], estimatedHours: 25,
    units: [
      u('th-1', 'Automata', 'Simple machines.', [
        ['dfa', 'Finite automata', 'DFAs and NFAs.', 'dfa, nfa, automaton'],
        ['regex', 'Regular expressions', 'Patterns and regular languages.', 'regular expression, regex, regular language'],
        ['grammars', 'Context-free grammars', 'Describing programming languages.', 'context-free grammar, parsing'],
      ]),
      u('th-2', 'Computability', 'The limits of computing.', [
        ['turing', 'Turing machines', 'The model of all computers.', 'turing machine'],
        ['halting', 'The halting problem', 'A problem no program can solve.', 'halting problem, undecidable'],
        ['complexity', 'Complexity classes', 'P, NP, PSPACE.', 'complexity class, p, np'],
      ]),
    ],
  },

  // ================================================================ 21. SOFTWARE ENGINEERING
  {
    id: 'software-engineering', title: 'Software Engineering', icon: '🏗️', color: '#B45309', category: 'advanced',
    tagline: 'Build software that lasts and teams can share.',
    description: 'Design principles, patterns, testing strategy, code review and system design basics.',
    prerequisites: ['python-2', 'tools'], estimatedHours: 20,
    units: [
      u('se-1', 'Design', 'Code that is easy to change.', [
        ['principles', 'Design principles', 'SOLID, DRY and KISS.', 'solid, dry, design principle'],
        ['patterns', 'Design patterns', 'Factory, observer, strategy.', 'design pattern, observer, strategy'],
        ['refactoring', 'Refactoring', 'Improving code safely.', 'refactoring, code smell'],
      ]),
      u('se-2', 'Process', 'Working as a team.', [
        ['testing', 'Testing strategy', 'Unit, integration, end-to-end.', 'testing pyramid, integration test'],
        ['code-review', 'Code review', 'Giving and getting feedback.', 'code review, pull request'],
        ['agile', 'Agile and planning', 'Iterating in small steps.', 'agile, scrum'],
      ]),
      u('se-3', 'System design', 'Big systems in small pieces.', [
        ['apis', 'Designing APIs', 'REST and contracts.', 'api design, rest'],
        ['scaling', 'Scaling basics', 'Caching, load balancing, databases.', 'scaling, load balancer, cache'],
      ]),
    ],
  },

  // ================================================================ 22. MACHINE LEARNING
  {
    id: 'ml-intro', title: 'Intro to Machine Learning', icon: '🧪', color: '#D92474', category: 'advanced', language: 'python',
    tagline: 'How machines learn from data.',
    description: 'Regression, classification, gradient descent, neural networks and evaluation — built from the math you learned.',
    prerequisites: ['python-2', 'linear-algebra', 'prob-stats', 'calculus'], estimatedHours: 35,
    units: [
      u('ml-1', 'Foundations', 'What learning means.', [
        ['what-is-ml', 'What is machine learning?', 'Supervised, unsupervised, reinforcement.', 'machine learning, supervised, unsupervised'],
        ['data', 'Data and features', 'Training sets and features.', 'feature, training data, dataset'],
      ]),
      u('ml-2', 'Core models', 'Classic algorithms.', [
        ['linear-regression', 'Linear regression', 'Fitting a line.', 'linear regression, loss'],
        ['gradient-descent', 'Training with gradient descent', 'Minimize the loss.', 'gradient descent, learning rate'],
        ['classification', 'Logistic regression and classification', 'Yes/no predictions.', 'classification, logistic regression'],
        ['knn-trees', 'k-NN and decision trees', 'Simple, powerful models.', 'knn, decision tree'],
      ]),
      u('ml-3', 'Neural networks', 'Layers of simple units.', [
        ['neurons', 'Neurons and layers', 'From perceptron to network.', 'neural network, perceptron'],
        ['backprop', 'Backpropagation', 'The chain rule at scale.', 'backpropagation'],
        ['evaluation', 'Evaluating models', 'Overfitting, validation, metrics.', 'overfitting, cross validation, accuracy'],
      ]),
    ],
  },

  // ================================================================ 23. LANGUAGE TOUR
  {
    id: 'languages-tour', title: 'Language Tour', icon: '🗺️', color: '#0E8174', category: 'languages',
    tagline: 'Read and write the rest of the popular languages.',
    description: 'Once you know Python, JavaScript, Java and C, every other language is a variation. One quick unit per language.',
    prerequisites: ['python-2', 'javascript'], estimatedHours: 20,
    units: [
      u('lt-1', 'Systems languages', 'Fast and safe.', [
        ['go', 'Go', 'Simple, concurrent, compiled.', 'go, golang, goroutine'],
        ['rust', 'Rust', 'Memory safety without garbage collection.', 'rust, ownership, borrow checker'],
      ]),
      u('lt-2', 'App and web languages', 'Languages you will meet at work.', [
        ['csharp', 'C#', '.NET and games.', 'c#, csharp, .net'],
        ['kotlin-swift', 'Kotlin and Swift', 'Mobile development.', 'kotlin, swift, mobile'],
        ['php-ruby', 'PHP and Ruby', 'Classic web back ends.', 'php, ruby'],
      ]),
      u('lt-3', 'Specialist languages', 'Different ways to think.', [
        ['bash', 'Bash scripting', 'Automate the terminal.', 'bash, shell script'],
        ['r', 'R', 'Statistics and data analysis.', 'r language, statistics'],
        ['haskell', 'Functional programming (Haskell)', 'Pure functions and types.', 'haskell, functional programming'],
      ]),
    ],
  },

  // ================================================================ 24. GRAD READY
  {
    id: 'grad-ready', title: 'Grad School Readiness', icon: '🎓', color: '#1E3A8A', category: 'advanced',
    tagline: 'Get admitted and thrive in an online CS master\'s.',
    description: 'Applying to programs like Georgia Tech OMSCS, reading papers, LaTeX, managing big projects, and capstone projects to prove your skills.',
    prerequisites: ['algorithms'], estimatedHours: 15,
    units: [
      u('gr-1', 'Applying', 'Put together a strong application.', [
        ['programs', 'Choosing a program', 'Online master\'s options compared.', 'omscs, online masters, admissions'],
        ['statement', 'Statement of purpose', 'Telling your story.', 'statement of purpose, application'],
        ['portfolio', 'Building a portfolio', 'Projects that prove readiness.', 'portfolio, github, projects'],
      ]),
      u('gr-2', 'Succeeding', 'Skills nobody teaches.', [
        ['papers', 'Reading research papers', 'The three-pass method.', 'research paper, reading'],
        ['latex', 'LaTeX basics', 'Write math beautifully.', 'latex, math typesetting'],
        ['time', 'Studying while working', 'Planning a part-time degree.', 'time management, study plan'],
      ]),
      u('gr-3', 'Capstones', 'Big projects that tie it together.', [
        ['capstone-1', 'Capstone: build an interpreter', 'A tiny programming language in Python.', 'interpreter, parser, capstone'],
        ['capstone-2', 'Capstone: route planner', 'Graphs + Dijkstra on real data.', 'dijkstra, graph, capstone'],
        ['capstone-3', 'Capstone: ML from scratch', 'Train a model with only numpy.', 'machine learning, numpy, capstone'],
      ]),
    ],
  },
];

/** Build Track objects (with planned lessons) from the compact definitions above. */
export function buildRoadmap(): Track[] {
  return TRACKS.map((t) => ({
    ...t,
    units: t.units.map((unit) => ({
      id: unit.id,
      title: unit.title,
      summary: unit.summary,
      lessons: unit.lessons.map(([slug, title, summary, tags]) => ({
        id: `${unit.id}-${slug}`,
        title,
        summary,
        tags: tags.split(',').map((s) => s.trim()).filter(Boolean),
        status: 'planned' as const,
      })),
    })),
  }));
}
