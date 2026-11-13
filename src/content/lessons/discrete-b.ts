/**
 * Track: discrete-math — "Discrete Math"
 * Written here: dm-4 (counting), dm-5 (graphs), dm-6 (number theory), dm-7 (recurrences)
 * + checkpoints + course final exam. All numbers were double-checked in Python.
 */
import type { Checkpoint, Step } from '../types';
import { ans, eq, ex, mc, ord, py } from './_helpers';

const ordT = (prompt: string, lines: string[], explanation: string) => ord(prompt, lines, explanation, 'text');

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ dm-4-rules
  'dm-4-rules': [
    ex('Counting without listing', 'Counting is how computer scientists measure things: how many passwords exist, how many paths an algorithm might try, how likely a collision is.\n\n**Product rule:** if one choice has m options and a second, independent choice has n options, together there are **m × n** possibilities.\n\n3 shirts and 4 pants → 3 × 4 = **12** outfits.'),
    ans('A lunch special has 3 sandwiches, 2 sides and 4 drinks (pick one of each). How many different meals?', ['24'], '3 × 2 × 4 = 24.'),
    ex('Sum rule', '**Sum rule:** if you choose from one group **or** another (and they don\'t overlap), add: m + n.\n\n5 pizzas or 3 burgers → 5 + 3 = **8** choices of main.', '"And" (one from each) → multiply. "Or" (one from either) → add.'),
    ans('A 4-digit PIN uses digits 0–9 and digits may repeat. How many PINs are possible?', ['10000', '10,000'], '10 × 10 × 10 × 10 = 10⁴ = 10,000.'),
    ans('A license plate is 3 letters (A–Z) followed by 3 digits. How many plates?', ['17576000', '17,576,000'], '26³ × 10³ = 17,576 × 1,000 = 17,576,000.'),
    mc('Each bit is 0 or 1. How many different 8-bit patterns are there?', ['8', '16', '64', '256'], 3, '2⁸ = 256 — the product rule explains why a byte holds 256 values.'),
    ans('A password must be exactly 2 characters, each a lowercase letter (26) or a digit (10). How many passwords?', ['1296', '1,296'], 'Each character has 26 + 10 = 36 options (sum rule); two characters → 36 × 36 = 1,296 (product rule).'),
  ],

  // ------------------------------------------------------------------ dm-4-permutations
  'dm-4-permutations': [
    ex('Arrangements', 'A **permutation** is an ordering. How many ways can 5 books stand on a shelf?\n\n5 choices for the first spot, 4 for the second, … → 5 × 4 × 3 × 2 × 1 = **5!** = 120.\n\n**n!** ("n factorial") = n × (n − 1) × … × 1, and 0! = 1.'),
    ans('How many ways can 4 people stand in a line?', ['24'], '4! = 24.'),
    ex('Arranging only some', 'Picking an **ordered** group of k from n: **P(n, k) = n! / (n − k)!**\n\nGold, silver and bronze among 8 runners: 8 × 7 × 6 = **336**.'),
    ans('A club of 10 picks a president and a vice-president (different people). How many ways?', ['90'], '10 × 9 = 90.'),
    ex('Repeated letters', 'Arrangements of letters with repeats: divide by the ways the identical letters could be swapped.\n\n"BOOK": 4! / 2! = 24 / 2 = **12** (the two O\'s are interchangeable).'),
    ans('How many distinct arrangements of the letters in "LOOP"?', ['12'], '4! / 2! = 12 (two O\'s).'),
    py({
      prompt: 'Write `permutations_count(n, k)` returning P(n, k) = n! / (n − k)!, computed with a loop that multiplies n × (n−1) × … (k terms). Don\'t use math.perm.',
      starter: 'def permutations_count(n, k):\n    pass\n',
      tests: [eq('permutations_count(8, 3)', '336'), eq('permutations_count(5, 5)', '120'), eq('permutations_count(5, 0)', '1'), { name: 'no math.perm', code: 'assert "perm(" not in __source__' }],
      hints: ['result = 1; for i in range(k): result *= n - i'],
      solution: 'def permutations_count(n, k):\n    result = 1\n    for i in range(k):\n        result *= n - i\n    return result\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-4-combinations
  'dm-4-combinations': [
    ex('Choosing (order doesn\'t matter)', 'A **combination** is a selection where order **doesn\'t** matter: picking 2 toppings from 5. The formula — read "n choose k":\n\n**C(n, k) = n! / (k! (n − k)!)**\n\nIt\'s P(n, k) divided by k!, because each group of k was counted k! times in different orders.\n\nC(5, 2) = 10. In Python: `math.comb(5, 2)`.'),
    ans('How many ways to choose 2 people from 6 to share a room?', ['15'], 'C(6, 2) = 6 × 5 / 2 = 15.'),
    ans('How many 3-person committees from 10 people?', ['120'], 'C(10, 3) = 10 × 9 × 8 / 6 = 120.'),
    mc('Choosing a 3-person committee vs. choosing a president, VP and treasurer from 10. Which has more possibilities?', ['The committee', 'The officers — order (roles) matters', 'They\'re equal'], 1, 'Officers: P(10, 3) = 720. Committee: C(10, 3) = 120 = 720 / 3!.'),
    ex('Pascal\'s triangle', '```text\n        1\n       1 1\n      1 2 1\n     1 3 3 1\n    1 4 6 4 1\n```\n\nEach number is the sum of the two above it. Row n lists C(n, 0), C(n, 1), …, C(n, n). The rule behind it: **C(n, k) = C(n−1, k−1) + C(n−1, k)**.'),
    ans('How many 5-card poker hands from a 52-card deck? (C(52, 5))', ['2598960', '2,598,960'], 'C(52, 5) = 2,598,960.'),
    py({
      prompt: 'Write a **recursive** `choose(n, k)` using Pascal\'s rule: C(n, k) = C(n−1, k−1) + C(n−1, k), with C(n, 0) = C(n, n) = 1.',
      starter: 'def choose(n, k):\n    pass\n',
      tests: [eq('choose(5, 2)', '10'), eq('choose(6, 0)', '1'), eq('choose(6, 6)', '1'), eq('choose(10, 3)', '120'), { name: 'no math.comb', code: 'assert "comb(" not in __source__' }],
      hints: ['if k == 0 or k == n: return 1', 'return choose(n - 1, k - 1) + choose(n - 1, k)'],
      solution: 'def choose(n, k):\n    if k == 0 or k == n:\n        return 1\n    return choose(n - 1, k - 1) + choose(n - 1, k)\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-4-pigeonhole
  'dm-4-pigeonhole': [
    ex('More pigeons than holes', '**Pigeonhole principle:** if you put more than n items into n boxes, some box gets **at least two**.\n\n13 people → at least two share a birth month (only 12 months).\n\nSimple, but it proves surprising things — like that every hash table **must** have collisions once it has more keys than slots.'),
    ans('What\'s the smallest group that GUARANTEES two people share a birthday (counting Feb 29, so 366 possible days)?', ['367'], '366 people could all differ; the 367th must repeat.'),
    ans('A drawer has black and white socks. How many must you pull out (in the dark) to guarantee a matching pair?', ['3'], '2 colors = 2 boxes. The 3rd sock must match one of the first two.'),
    ex('Generalized version', 'If N items go into k boxes, some box has **at least ⌈N / k⌉** items (⌈ ⌉ means round **up**).\n\n25 students in 4 study groups → some group has at least ⌈25/4⌉ = **7**.'),
    ans('100 emails are sorted into 7 folders. At least how many emails must be in the fullest folder?', ['15'], '⌈100 / 7⌉ = ⌈14.29⌉ = 15.'),
    mc('A hash table has 1,000 slots and you store 1,001 keys. What\'s guaranteed?', ['Nothing', 'At least one collision (two keys in the same slot)', 'Exactly one collision'], 1, 'Pigeonhole: 1,001 keys, 1,000 slots.'),
    py({
      prompt: 'Write `min_in_fullest(items, boxes)` returning the guaranteed minimum number of items in the fullest box: ⌈items / boxes⌉. Use only integer math (no floats).',
      starter: 'def min_in_fullest(items, boxes):\n    pass\n',
      tests: [eq('min_in_fullest(25, 4)', '7'), eq('min_in_fullest(100, 7)', '15'), eq('min_in_fullest(12, 12)', '1'), eq('min_in_fullest(10**18 + 1, 10**18)', '2', 'works for huge numbers')],
      hints: ['Ceiling division with integers: (a + b - 1) // b, or -(-a // b)'],
      solution: 'def min_in_fullest(items, boxes):\n    return (items + boxes - 1) // boxes\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-4-inclusion-exclusion
  'dm-4-inclusion-exclusion': [
    ex('Don\'t double-count', 'To count things in A **or** B, adding |A| + |B| counts the overlap twice. Subtract it once:\n\n**|A ∪ B| = |A| + |B| − |A ∩ B|**\n\nIn a class, 20 take Spanish, 15 take French, 5 take both → 20 + 15 − 5 = **30** take at least one.'),
    ans('How many numbers from 1 to 100 are divisible by 2 OR 3?', ['67'], 'By 2: 50. By 3: 33. By both (by 6): 16. 50 + 33 − 16 = 67.'),
    ex('Three sets', '**|A ∪ B ∪ C| = |A| + |B| + |C| − |A∩B| − |A∩C| − |B∩C| + |A∩B∩C|**\n\nAdd singles, subtract pairs, add back the triple. ("Inclusion–exclusion" — the signs alternate.)'),
    ans('Numbers 1–100 divisible by 2, 3 OR 5? (By 2: 50, by 3: 33, by 5: 20, by 6: 16, by 10: 10, by 15: 6, by 30: 3)', ['74'], '50 + 33 + 20 − 16 − 10 − 6 + 3 = 74.'),
    mc('40 people like coffee, 30 like tea, 10 like both. How many like coffee or tea?', ['70', '60', '80', '50'], 1, '40 + 30 − 10 = 60.'),
    py({
      prompt: 'Write `count_divisible(n, a, b)` returning how many integers from 1 to n are divisible by a or b, using inclusion–exclusion **without a loop over 1..n** (so it\'s instant even for huge n). Use `math.lcm(a, b)` for "divisible by both".',
      starter: 'import math\n\ndef count_divisible(n, a, b):\n    pass\n',
      tests: [eq('count_divisible(100, 2, 3)', '67'), eq('count_divisible(10, 4, 6)', '3', 'lcm matters: 4, 6, 8 (12 > 10)'), eq('count_divisible(10**15, 2, 5)', '600000000000000', 'instant for huge n')],
      hints: ['n // a counts multiples of a up to n.', 'return n // a + n // b - n // math.lcm(a, b)'],
      solution: 'import math\n\ndef count_divisible(n, a, b):\n    return n // a + n // b - n // math.lcm(a, b)\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-5-graphs
  'dm-5-graphs': [
    ex('Dots and lines', 'A **graph** is a set of **vertices** (nodes) connected by **edges**. Graphs model maps, social networks, the web, computer networks, course prerequisites…\n\n- **Undirected**: edges go both ways (friendships)\n- **Directed**: edges have arrows (Twitter follows, one-way streets)\n- **Degree** of a vertex: how many edges touch it'),
    ex('Storing a graph in code', 'An **adjacency list** maps each vertex to its neighbors:\n\n```python\ngraph = {\n    "A": ["B", "C"],\n    "B": ["A"],\n    "C": ["A"],\n}\n```\n\nHere A has degree 2; B and C have degree 1.'),
    ex('The handshake lemma', 'Every edge has **two ends**, so:\n\n**sum of all degrees = 2 × (number of edges)**\n\nConsequence: the number of odd-degree vertices is always even.'),
    ans('A graph has degrees 3, 3, 2, 2, 2. How many edges does it have?', ['6'], 'Sum = 12, and 12 / 2 = 6.'),
    mc('Can a graph have exactly three vertices of odd degree?', ['Yes', 'No — the sum of degrees must be even'], 1, 'Three odd numbers plus evens always give an odd total.'),
    ex('Paths and connectivity', '- A **path** is a sequence of edges from one vertex to another\n- A **cycle** is a path that returns to its start (without reusing edges)\n- A graph is **connected** if every vertex can reach every other\n- The **complete graph** Kₙ connects every pair: it has n(n − 1)/2 edges'),
    ans('How many edges does K₆ (6 vertices, all connected) have?', ['15'], '6 × 5 / 2 = 15 — the same as C(6, 2).'),
    py({
      prompt: 'Given an undirected graph as an adjacency dict, write `edge_count(graph)` using the handshake lemma.',
      starter: 'def edge_count(graph):\n    pass\n',
      tests: [eq('edge_count({"A": ["B", "C"], "B": ["A"], "C": ["A"]})', '2'), eq('edge_count({"x": []})', '0'), eq('edge_count({1: [2, 3], 2: [1, 3], 3: [1, 2]})', '3')],
      hints: ['Total degree = sum(len(neighbors) for neighbors in graph.values())', 'Divide by 2 with //'],
      solution: 'def edge_count(graph):\n    return sum(len(n) for n in graph.values()) // 2\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-5-trees
  'dm-5-trees': [
    ex('Trees', 'A **tree** is a **connected** graph with **no cycles**. Trees are everywhere in CS: folder structures, family trees, HTML pages, decision trees, search trees.\n\nKey facts about a tree with n vertices:\n\n- it has exactly **n − 1 edges**\n- there\'s exactly **one path** between any two vertices\n- adding any edge creates a cycle; removing any edge disconnects it'),
    ans('A tree has 50 vertices. How many edges?', ['49'], 'Always n − 1.'),
    ex('Rooted trees', 'Pick one vertex as the **root** and hang everything below it:\n\n- **parent** / **child**: directly above / below\n- **leaf**: a vertex with no children\n- **depth**: distance from the root\n- **binary tree**: every vertex has at most 2 children\n\nA folder is a parent; its files and sub-folders are children; empty folders and files are leaves.'),
    mc('A connected graph has 10 vertices and 10 edges. Is it a tree?', ['Yes', 'No — a tree with 10 vertices has 9 edges, so this one must contain a cycle'], 1, 'One edge too many always creates a cycle.'),
    ans('A full binary tree of depth 3 (root at depth 0, every non-leaf has 2 children) has how many leaves?', ['8'], 'Each level doubles: 1, 2, 4, 8.'),
    py({
      prompt: 'Write `is_tree(n, edges)`: vertices are 0..n−1 and `edges` is a list of pairs. Return True if the graph is a tree — it must have exactly n − 1 edges **and** be connected.',
      starter: 'def is_tree(n, edges):\n    pass\n',
      tests: [eq('is_tree(4, [(0, 1), (1, 2), (1, 3)])', 'True'), eq('is_tree(4, [(0, 1), (1, 2), (2, 0)])', 'False', 'cycle + disconnected vertex'), eq('is_tree(3, [(0, 1)])', 'False'), eq('is_tree(1, [])', 'True')],
      hints: ['If len(edges) != n - 1, return False.', 'Build an adjacency list, explore from vertex 0 with a stack, and check you visited all n vertices.'],
      solution: 'def is_tree(n, edges):\n    if len(edges) != n - 1:\n        return False\n    adj = {v: [] for v in range(n)}\n    for a, b in edges:\n        adj[a].append(b)\n        adj[b].append(a)\n    seen = {0}\n    stack = [0]\n    while stack:\n        v = stack.pop()\n        for w in adj[v]:\n            if w not in seen:\n                seen.add(w)\n                stack.append(w)\n    return len(seen) == n\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-5-euler
  'dm-5-euler': [
    ex('The bridges of Königsberg', 'In 1736 the city of Königsberg had 7 bridges joining 4 land areas. Could you walk across **every bridge exactly once**? Leonhard Euler proved it was impossible — and invented graph theory.\n\nAn **Euler path** uses every **edge** exactly once. A connected graph has one **if and only if** it has **0 or 2** vertices of odd degree. (With 0, you can even end where you started — an **Euler circuit**.)'),
    mc('Königsberg\'s 4 land areas had degrees 5, 3, 3, 3. Is there an Euler path?', ['Yes', 'No — four vertices have odd degree'], 1, 'An Euler path allows at most 2 odd-degree vertices.'),
    mc('A connected graph has degrees 2, 4, 3, 3. Euler path?', ['Yes — exactly two odd vertices (start at one, end at the other)', 'No'], 0, 'Two odd vertices: the path starts at one and ends at the other.'),
    ex('Hamiltonian paths', 'A **Hamiltonian path** visits every **vertex** exactly once. It sounds similar — but no simple rule decides whether one exists. Finding one is **NP-complete**: no known algorithm is fast on big graphs.\n\nThis contrast (an easy problem vs. an almost identical hard one) is a theme you\'ll see again in Algorithms and Theory.'),
    mc('Which problem has a quick test based on vertex degrees?', ['Euler path (every edge once)', 'Hamiltonian path (every vertex once)', 'Both', 'Neither'], 0, 'Euler: count odd degrees. Hamiltonian: no known efficient test.'),
    py({
      prompt: 'Write `has_euler_path(graph)` for a **connected** undirected graph given as an adjacency dict. Return True if it has 0 or 2 odd-degree vertices.',
      starter: 'def has_euler_path(graph):\n    pass\n',
      tests: [eq('has_euler_path({"A": ["B"], "B": ["A", "C"], "C": ["B"]})', 'True'), eq('has_euler_path({"A": ["B", "C", "D"], "B": ["A"], "C": ["A"], "D": ["A"]})', 'False'), eq('has_euler_path({1: [2, 3], 2: [1, 3], 3: [1, 2]})', 'True')],
      hints: ['odd = sum(1 for nbrs in graph.values() if len(nbrs) % 2 == 1)', 'return odd in (0, 2)'],
      solution: 'def has_euler_path(graph):\n    odd = sum(1 for nbrs in graph.values() if len(nbrs) % 2 == 1)\n    return odd in (0, 2)\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-5-coloring
  'dm-5-coloring': [
    ex('Coloring graphs', 'Give each vertex a color so that **no edge connects two vertices of the same color**. The fewest colors needed is the **chromatic number**.\n\nIt solves scheduling: vertices = exams, edges = "a student takes both", colors = time slots. The chromatic number is the fewest exam slots with no clashes.'),
    ans('What is the chromatic number of a triangle (3 vertices, all connected)?', ['3'], 'Every vertex touches the other two, so all three need different colors.'),
    ex('Bipartite graphs', 'A graph is **bipartite** (2-colorable) when its vertices split into two groups with edges only **between** groups — like students and the courses they take.\n\nA graph is bipartite **if and only if** it has **no cycle of odd length**.', 'The Four Color Theorem says any map drawn on paper needs at most 4 colors. It was the first major theorem proved with a computer (1976).'),
    mc('A square (4-cycle) needs how many colors?', ['2', '3', '4'], 0, 'Alternate colors around an even cycle.'),
    mc('Is a 5-cycle (pentagon) bipartite?', ['Yes', 'No — it\'s an odd cycle'], 1, 'Alternating colors around 5 vertices fails at the end; it needs 3.'),
    py({
      prompt: 'Write `is_valid_coloring(graph, colors)`: `graph` is an adjacency dict and `colors` maps each vertex to a color. Return True if no edge joins two vertices of the same color.',
      starter: 'def is_valid_coloring(graph, colors):\n    pass\n',
      tests: [eq('is_valid_coloring({"A": ["B"], "B": ["A"]}, {"A": "red", "B": "blue"})', 'True'), eq('is_valid_coloring({"A": ["B"], "B": ["A"]}, {"A": "red", "B": "red"})', 'False'), eq('is_valid_coloring({1: [2, 3], 2: [1, 3], 3: [1, 2]}, {1: 0, 2: 1, 3: 2})', 'True')],
      hints: ['For every vertex v and neighbor w: if colors[v] == colors[w], return False.'],
      solution: 'def is_valid_coloring(graph, colors):\n    for v, nbrs in graph.items():\n        for w in nbrs:\n            if colors[v] == colors[w]:\n                return False\n    return True\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-6-divisibility
  'dm-6-divisibility': [
    ex('Primes', 'A **prime** is an integer greater than 1 whose only divisors are 1 and itself: 2, 3, 5, 7, 11, 13, …\n\n**Fundamental Theorem of Arithmetic:** every integer > 1 is a product of primes in exactly one way (ignoring order):\n\n84 = 2 × 2 × 3 × 7 = 2² × 3 × 7', '1 is not prime — otherwise factorizations wouldn\'t be unique (6 = 2·3 = 1·2·3 = 1·1·2·3…).'),
    mc('Which is prime?', ['1', '21', '29', '51'], 2, '21 = 3·7, 51 = 3·17, and 1 isn\'t prime by definition.'),
    ans('What is the largest prime factor of 84?', ['7'], '84 = 2² × 3 × 7.'),
    ex('Testing for primes fast', 'To test n, you only need to try divisors up to **√n**: if n = a × b, one of a, b must be ≤ √n.\n\nTo test 97: try 2, 3, 5, 7 (√97 ≈ 9.8). None divide it → prime.'),
    ans('To test whether 121 is prime, what is the largest divisor you need to try?', ['11'], '√121 = 11 — and 11 divides it (121 = 11²), so it isn\'t prime.'),
    py({
      prompt: 'Write `is_prime(n)` that tests divisors only up to √n. It must handle n = 1 and 0 (not prime) and be fast for n around a trillion.',
      starter: 'def is_prime(n):\n    pass\n',
      tests: [eq('[n for n in range(30) if is_prime(n)]', '[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]'), eq('is_prime(1000000007)', 'True', 'big prime'), eq('is_prime(999999999989)', 'True', 'very big prime (~10^12) — needs the √n trick'), eq('is_prime(121)', 'False')],
      hints: ['if n < 2: return False', 'i = 2; while i * i <= n: if n % i == 0: return False; i += 1', 'return True'],
      solution: 'def is_prime(n):\n    if n < 2:\n        return False\n    i = 2\n    while i * i <= n:\n        if n % i == 0:\n            return False\n        i += 1\n    return True\n',
    }),
    py({
      prompt: 'Write `prime_factors(n)` returning the list of prime factors of n ≥ 2 in increasing order, with repeats. `prime_factors(84)` → `[2, 2, 3, 7]`.',
      starter: 'def prime_factors(n):\n    pass\n',
      tests: [eq('prime_factors(84)', '[2, 2, 3, 7]'), eq('prime_factors(97)', '[97]'), eq('prime_factors(1024)', '[2] * 10')],
      hints: ['Divide out 2 as long as you can, then 3, then 4 (won\'t divide anymore), …', 'Whatever is left above 1 at the end is itself prime.'],
      solution: 'def prime_factors(n):\n    factors = []\n    d = 2\n    while d * d <= n:\n        while n % d == 0:\n            factors.append(d)\n            n //= d\n        d += 1\n    if n > 1:\n        factors.append(n)\n    return factors\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-6-gcd
  'dm-6-gcd': [
    ex('Greatest common divisor', 'The **gcd** of a and b is the largest number dividing both. gcd(48, 18) = 6.\n\n**Euclid\'s algorithm** (around 300 BC!) uses one fact: **gcd(a, b) = gcd(b, a mod b)**. Repeat until the remainder is 0:\n\n```text\ngcd(48, 18) → 48 mod 18 = 12 → gcd(18, 12)\ngcd(18, 12) → 18 mod 12 = 6  → gcd(12, 6)\ngcd(12, 6)  → 12 mod 6  = 0  → answer: 6\n```'),
    ans('What is gcd(84, 36)?', ['12'], '84 mod 36 = 12; 36 mod 12 = 0 → 12.'),
    ans('What is gcd(17, 5)?', ['1'], '17 and 5 share no factor besides 1 — they\'re "coprime".'),
    ex('Least common multiple', 'The **lcm** is the smallest number both divide:\n\n**lcm(a, b) = a × b / gcd(a, b)**\n\nlcm(48, 18) = 864 / 6 = **144**. Used for things like "when do two repeating schedules line up?"'),
    ans('Bus A comes every 12 minutes, bus B every 18. Both arrive now. In how many minutes do they next arrive together?', ['36'], 'lcm(12, 18) = 216 / gcd 6 = 36.'),
    py({
      prompt: 'Write Euclid\'s algorithm: `gcd(a, b)` for non-negative integers (gcd(a, 0) = a). Don\'t use math.gcd.',
      starter: 'def gcd(a, b):\n    pass\n',
      tests: [eq('gcd(48, 18)', '6'), eq('gcd(17, 5)', '1'), eq('gcd(0, 9)', '9'), eq('gcd(2**60, 6**20)', '2**20', 'fast for huge numbers'), { name: 'no math.gcd', code: 'assert "math.gcd" not in __source__ and "from math import gcd" not in __source__' }],
      hints: ['while b != 0: a, b = b, a % b', 'return a'],
      solution: 'def gcd(a, b):\n    while b != 0:\n        a, b = b, a % b\n    return a\n',
    }),
    py({
      prompt: 'Write `lcm(a, b)` for positive integers using your own gcd (included in the starter).',
      starter: 'def gcd(a, b):\n    while b:\n        a, b = b, a % b\n    return a\n\ndef lcm(a, b):\n    pass\n',
      tests: [eq('lcm(12, 18)', '36'), eq('lcm(7, 5)', '35'), eq('lcm(6, 6)', '6')],
      hints: ['return a * b // gcd(a, b)'],
      solution: 'def gcd(a, b):\n    while b:\n        a, b = b, a % b\n    return a\n\ndef lcm(a, b):\n    return a * b // gcd(a, b)\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-6-modular
  'dm-6-modular': [
    ex('Congruence', '**a ≡ b (mod n)** means a and b have the **same remainder** when divided by n (equivalently, n divides a − b).\n\n17 ≡ 2 (mod 5), and 38 ≡ 3 (mod 7).\n\nYou can add, subtract and multiply first and reduce later — or reduce first:\n\n(a × b) mod n = ((a mod n) × (b mod n)) mod n'),
    ans('What is (123 × 456) mod 10? (Hint: only the last digits matter.)', ['8'], '3 × 6 = 18, and 18 mod 10 = 8.'),
    mc('Is 29 ≡ 5 (mod 8)?', ['Yes — both leave remainder 5', 'No'], 0, '29 = 3·8 + 5.'),
    ex('Modular inverses', 'The **inverse** of a (mod n) is the number x with a·x ≡ 1 (mod n) — "division" in modular arithmetic.\n\nInverse of 3 mod 7 is **5**, since 3 × 5 = 15 = 2·7 + 1.\n\nAn inverse exists exactly when gcd(a, n) = 1. Python: `pow(3, -1, 7)` → 5.'),
    ans('What is the inverse of 4 modulo 9? (4·x ≡ 1 mod 9)', ['7'], '4 × 7 = 28 = 3·9 + 1.'),
    ex('Fast modular powers', 'Cryptography needs things like 3¹⁰⁰ mod 7 for **huge** exponents. Python\'s built-in `pow(base, exp, mod)` does it instantly using **repeated squaring** — it never computes the giant number.\n\n```python\npow(3, 100, 7)   # 4\n```'),
    py({
      prompt: 'Implement fast modular exponentiation yourself: `mod_pow(base, exp, mod)` using **repeated squaring** (look at exp in binary). It must be fast for exponents with hundreds of digits. Don\'t use the 3-argument `pow`.',
      starter: 'def mod_pow(base, exp, mod):\n    pass\n',
      tests: [eq('mod_pow(3, 100, 7)', '4'), eq('mod_pow(2, 10, 1000)', '24'), eq('mod_pow(5, 0, 13)', '1'), eq('mod_pow(7, 10**300, 1000003)', 'pow(7, 10**300, 1000003)', 'huge exponent, instantly'), { name: 'no built-in 3-argument pow', code: 'import re\nassert not re.search(r"(?<![_a-z])pow\\(", __source__.replace("mod_pow(", "")), "Write the loop yourself"' }],
      hints: ['result = 1; base %= mod', 'while exp > 0: if exp is odd, result = result * base % mod; base = base * base % mod; exp //= 2'],
      solution: 'def mod_pow(base, exp, mod):\n    result = 1\n    base %= mod\n    while exp > 0:\n        if exp % 2 == 1:\n            result = result * base % mod\n        base = base * base % mod\n        exp //= 2\n    return result\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-6-rsa
  'dm-6-rsa': [
    ex('Public-key cryptography', 'Every time you see 🔒 in your browser, **RSA** (or a cousin) is protecting you. Its genius: a **public key** anyone can use to lock a message, and a **private key** only you have to unlock it.\n\nIt\'s built entirely from what you just learned: primes, gcd, modular inverses and modular powers.'),
    ex('A toy RSA', '1. Pick two primes: p = 3, q = 11. Then **n = 33**.\n2. φ = (p − 1)(q − 1) = 2 × 10 = **20**.\n3. Pick e with gcd(e, 20) = 1: **e = 3**. Public key: (n = 33, e = 3).\n4. Private key d = inverse of e mod φ: 3·d ≡ 1 (mod 20) → **d = 7** (21 ≡ 1).\n\n**Encrypt** m = 4: c = 4³ mod 33 = 64 mod 33 = **31**.\n**Decrypt**: 31⁷ mod 33 = **4**. ✓'),
    ans('In the toy RSA, what is n?', ['33'], 'n = p × q = 3 × 11.'),
    mc('Why is real RSA secure?', ['The algorithm is secret', 'Finding d requires p and q, and factoring a huge n (600+ digits) is infeasible', 'Computers can\'t do modular math'], 1, 'Multiplying p × q is easy; undoing it is believed to be extremely hard.'),
    mc('Which key do you share with everyone?', ['The private key d', 'The public key (n, e)', 'p and q'], 1, 'Keep d, p and q secret.'),
    py({
      prompt: 'Complete the toy RSA: write `encrypt(m, e, n)` and `decrypt(c, d, n)`. (You may use the built-in 3-argument `pow`.) The tests check that decrypt(encrypt(m)) gives back m.',
      starter: 'def encrypt(m, e, n):\n    pass\n\ndef decrypt(c, d, n):\n    pass\n',
      tests: [eq('encrypt(4, 3, 33)', '31'), eq('decrypt(31, 7, 33)', '4'), { name: 'round trip for every message', code: 'assert all(decrypt(encrypt(m, 3, 33), 7, 33) == m for m in range(33))' }, { name: 'a bigger key', code: 'n = 61 * 53\nassert all(decrypt(encrypt(m, 17, n), 2753, n) == m for m in range(0, n, 97))' }],
      hints: ['encrypt: return pow(m, e, n)', 'decrypt: return pow(c, d, n)'],
      solution: 'def encrypt(m, e, n):\n    return pow(m, e, n)\n\ndef decrypt(c, d, n):\n    return pow(c, d, n)\n',
    }),
    ordT('Order the steps to build an RSA key pair.', ['Choose two primes p and q', 'Compute n = p·q and φ = (p−1)(q−1)', 'Choose e with gcd(e, φ) = 1', 'Compute d = inverse of e mod φ'], 'Primes → n and φ → public exponent → private exponent.'),
  ],

  // ------------------------------------------------------------------ dm-7-recurrences
  'dm-7-recurrences': [
    ex('Sequences defined by themselves', 'A **recurrence relation** defines each term using earlier terms, plus starting values:\n\n- aₙ = aₙ₋₁ + 3, a₀ = 2 → 2, 5, 8, 11, …\n- Fibonacci: Fₙ = Fₙ₋₁ + Fₙ₋₂, F₀ = 0, F₁ = 1 → 0, 1, 1, 2, 3, 5, …\n\nIn CS, recurrences describe the **running time of recursive algorithms**: T(n) = T(n − 1) + 1 means "do 1 step of work, then solve a problem one smaller".'),
    ans('aₙ = 2·aₙ₋₁ + 1 with a₀ = 0. What is a₃?', ['7'], 'a₁ = 1, a₂ = 3, a₃ = 7.'),
    ans('aₙ = aₙ₋₁ + n with a₀ = 0. What is a₄?', ['10'], '0 → 1 → 3 → 6 → 10.'),
    mc('Which recurrence describes "solve two half-size problems, plus n work to combine"?', ['T(n) = T(n − 1) + n', 'T(n) = 2T(n/2) + n', 'T(n) = T(n/2) + 1'], 1, 'That\'s merge sort! (T(n/2) + 1 is binary search.)'),
    py({
      prompt: 'Write `seq(n)` that returns aₙ for the recurrence aₙ = 3·aₙ₋₁ − 2 with a₀ = 2 (so a₁ = 4, a₂ = 10). Use a **loop**, not recursion, so `seq(1000)` is instant.',
      starter: 'def seq(n):\n    pass\n',
      tests: [eq('seq(0)', '2'), eq('seq(1)', '4'), eq('seq(2)', '10'), eq('seq(1000)', '3**1000 + 1', 'big n works')],
      hints: ['a = 2; repeat n times: a = 3 * a - 2'],
      solution: 'def seq(n):\n    a = 2\n    for _ in range(n):\n        a = 3 * a - 2\n    return a\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-7-solving
  'dm-7-solving': [
    ex('Solving = finding a formula', 'A **closed form** gives aₙ directly, without computing every earlier term.\n\n**Unrolling:** for aₙ = aₙ₋₁ + 3, a₀ = 2:\n\naₙ = aₙ₋₁ + 3 = aₙ₋₂ + 3 + 3 = … = a₀ + 3n = **2 + 3n**'),
    ans('Closed form check: with aₙ = 2 + 3n, what is a₁₀₀?', ['302'], '2 + 300 = 302.'),
    ex('Common patterns', '| Recurrence | Closed form | Growth |\n|---|---|---|\n| aₙ = aₙ₋₁ + c | a₀ + cn | linear |\n| aₙ = aₙ₋₁ + n | a₀ + n(n+1)/2 | quadratic |\n| aₙ = 2·aₙ₋₁ | a₀ · 2ⁿ | exponential |\n| T(n) = T(n/2) + 1 | about log₂ n | logarithmic |\n| T(n) = 2T(n/2) + n | about n log₂ n | n log n |'),
    mc('aₙ = 2·aₙ₋₁ with a₀ = 5. Closed form?', ['5 + 2n', '5 · 2ⁿ', '2 · 5ⁿ', '5n²'], 1, 'Each step doubles: 5, 10, 20, 40, …'),
    mc('The recursive Fibonacci function makes T(n) = T(n−1) + T(n−2) + 1 calls. Its growth is…', ['linear', 'quadratic', 'exponential'], 2, 'It grows like Fibonacci itself — roughly 1.618ⁿ. That\'s why naive recursive fib is so slow.'),
    ex('Guess and verify', 'A reliable technique: **compute a few terms, guess a formula, then prove it by induction**.\n\naₙ = 2aₙ₋₁ + 1, a₀ = 0 → 0, 1, 3, 7, 15, … Guess **aₙ = 2ⁿ − 1** (Tower of Hanoi moves!). Induction step: 2(2ᵏ − 1) + 1 = 2ᵏ⁺¹ − 1 ✓'),
    ans('Tower of Hanoi with 10 disks needs 2¹⁰ − 1 moves. How many?', ['1023', '1,023'], '1024 − 1.'),
    py({
      prompt: 'Verify a closed form by computer: write `matches(limit)` that returns True if the recurrence aₙ = aₙ₋₁ + 2n − 1 (a₀ = 0) equals **n²** for every n from 0 to limit.',
      starter: 'def matches(limit):\n    pass\n',
      tests: [eq('matches(0)', 'True'), eq('matches(1000)', 'True')],
      hints: ['a = 0; for n in range(1, limit + 1): a += 2*n - 1; if a != n*n: return False', 'Check n = 0 too (a₀ = 0 = 0²).'],
      solution: 'def matches(limit):\n    a = 0\n    for n in range(1, limit + 1):\n        a += 2 * n - 1\n        if a != n * n:\n            return False\n    return True\n',
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'dm-4': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('3 hats and 5 scarves: how many hat+scarf combos?', ['15'], '3 × 5.'),
      ans('How many ways to arrange 5 different books?', ['120'], '5!.'),
      ans('Pick 1st and 2nd place from 6 runners:', ['30'], '6 × 5.'),
      ans('Choose 2 of 7 toppings (order doesn\'t matter):', ['21'], 'C(7, 2) = 21.'),
      ans('Arrangements of "TOOT"? (4! / (2!·2!))', ['6'], '24 / 4 = 6.'),
      ans('Smallest number of people to guarantee two share a birth month?', ['13'], '12 months + 1.'),
      ans('1–30 divisible by 2 or 5? (15 + 6 − 3)', ['18'], 'Inclusion–exclusion.'),
      py({ prompt: 'Write `factorial(n)` with a loop.', starter: 'def factorial(n):\n    pass\n', tests: [eq('factorial(0)', '1'), eq('factorial(5)', '120')], solution: 'def factorial(n):\n    r = 1\n    for i in range(2, n + 1):\n        r *= i\n    return r\n' }),
    ],
  },
  'dm-5': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('Degrees 2, 2, 2, 2. How many edges?', ['4'], '8 / 2.'),
      ans('A tree with 20 vertices has how many edges?', ['19'], 'n − 1.'),
      ans('How many edges in K₅?', ['10'], '5 × 4 / 2.'),
      mc('Euler path exists when the number of odd-degree vertices is…', ['0 or 2', 'exactly 1', 'any'], 0, '0 or 2 (and connected).'),
      mc('A graph is bipartite iff it has no…', ['even cycle', 'odd cycle', 'leaf'], 1, 'No odd cycles.'),
      mc('Finding a Hamiltonian path is…', ['easy (count degrees)', 'NP-complete (no known fast algorithm)'], 1, 'Hard.'),
      py({ prompt: 'Write `degrees(graph)` returning a dict vertex → degree for an adjacency dict.', starter: 'def degrees(graph):\n    pass\n', tests: [eq('degrees({"A": ["B"], "B": ["A"]})', '{"A": 1, "B": 1}')], solution: 'def degrees(graph):\n    return {v: len(n) for v, n in graph.items()}\n' }),
    ],
  },
  'dm-6': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Which is prime?', ['27', '31', '33', '39'], 1, '31.'),
      ans('Prime factorization of 60 as a product (smallest first, separated by ×)?', ['2 × 2 × 3 × 5', '2×2×3×5', '2*2*3*5', '2 * 2 * 3 * 5', '2^2 × 3 × 5', '2² × 3 × 5'], '60 = 2² × 3 × 5.'),
      ans('gcd(54, 24)?', ['6'], '54 mod 24 = 6; 24 mod 6 = 0.'),
      ans('lcm(4, 6)?', ['12'], '24 / 2.'),
      ans('Inverse of 2 mod 5?', ['3'], '2 × 3 = 6 ≡ 1.'),
      ans('What is 2¹⁰ mod 7? (1024 mod 7)', ['2'], '1024 = 146 × 7 + 2.'),
      mc('RSA\'s security rests on…', ['keeping the algorithm secret', 'the difficulty of factoring large numbers'], 1, 'Factoring.'),
    ],
  },
  'dm-7': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('aₙ = aₙ₋₁ + 5, a₀ = 1. a₃ = ?', ['16'], '1, 6, 11, 16.'),
      mc('Closed form of aₙ = aₙ₋₁ + 5, a₀ = 1?', ['1 + 5n', '5ⁿ', '5n²'], 0, 'Linear.'),
      ans('aₙ = 3aₙ₋₁, a₀ = 1. a₄ = ?', ['81'], '3⁴.'),
      mc('T(n) = T(n/2) + 1 grows like…', ['n', 'log n', 'n²'], 1, 'Binary search.'),
      mc('T(n) = 2T(n/2) + n grows like…', ['n log n', 'n²', 'log n'], 0, 'Merge sort.'),
      py({ prompt: 'Write `hanoi_moves(n)` returning the number of moves for n disks using the recurrence M(n) = 2M(n−1) + 1, M(0) = 0 (loop or recursion).', starter: 'def hanoi_moves(n):\n    pass\n', tests: [eq('hanoi_moves(0)', '0'), eq('hanoi_moves(3)', '7'), eq('hanoi_moves(64)', '2**64 - 1')], solution: 'def hanoi_moves(n):\n    m = 0\n    for _ in range(n):\n        m = 2 * m + 1\n    return m\n' }),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  'discrete-math': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('p = T, q = F. Value of p → q? (T or F)', ['F', 'false'], 'The broken promise.'),
      mc('¬(p ∨ q) ≡ ?', ['¬p ∨ ¬q', '¬p ∧ ¬q', 'p ∧ q'], 1, 'De Morgan.'),
      mc('Negation of "∀x, x > 0":', ['∀x, x ≤ 0', '∃x, x ≤ 0', '∃x, x > 0'], 1, '¬∀ = ∃¬.'),
      mc('Induction needs…', ['a base case and an inductive step', 'only examples', 'a contradiction'], 0, 'Both parts.'),
      ans('How many subsets does a 6-element set have?', ['64'], '2⁶.'),
      mc('f(x) = 3x + 1 from reals to reals is…', ['a bijection', 'not injective', 'not surjective'], 0, 'Invertible: (y − 1) / 3.'),
      ans('C(8, 2) = ?', ['28'], '8 × 7 / 2.'),
      ans('A tree with 12 vertices has how many edges?', ['11'], 'n − 1.'),
      ans('gcd(120, 45)?', ['15'], '120 mod 45 = 30; 45 mod 30 = 15; 30 mod 15 = 0.'),
      ans('Inverse of 3 mod 11?', ['4'], '3 × 4 = 12 ≡ 1.'),
      py({ prompt: 'Write `count_paths(rows, cols)`: the number of ways to walk from the top-left to the bottom-right of a grid of `rows` × `cols` squares moving only right or down. (Hint: you make rows + cols moves and choose which are "down".)', starter: 'def count_paths(rows, cols):\n    pass\n', tests: [eq('count_paths(2, 2)', '6'), eq('count_paths(1, 3)', '4'), eq('count_paths(10, 10)', '184756')], solution: 'import math\n\ndef count_paths(rows, cols):\n    return math.comb(rows + cols, rows)\n' }),
      py({ prompt: 'Write `is_bipartite(graph)` for an adjacency dict: try to 2-color it with BFS/DFS and return False if two neighbors must share a color.', starter: 'def is_bipartite(graph):\n    pass\n', tests: [eq('is_bipartite({1: [2], 2: [1, 3], 3: [2]})', 'True'), eq('is_bipartite({1: [2, 3], 2: [1, 3], 3: [1, 2]})', 'False'), eq('is_bipartite({1: [2], 2: [1], 3: [4], 4: [3]})', 'True', 'two separate pieces')], solution: 'def is_bipartite(graph):\n    color = {}\n    for start in graph:\n        if start in color:\n            continue\n        color[start] = 0\n        stack = [start]\n        while stack:\n            v = stack.pop()\n            for w in graph[v]:\n                if w not in color:\n                    color[w] = 1 - color[v]\n                    stack.append(w)\n                elif color[w] == color[v]:\n                    return False\n    return True\n' }),
    ],
  },
};
