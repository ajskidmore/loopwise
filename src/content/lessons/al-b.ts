/**
 * Track: algorithms — "Algorithms"
 * Written here: al-5 (greedy), al-6 (dynamic programming), al-7 (graph algorithms), al-8 (hard problems)
 * + checkpoints + course final exam. Numbers double-checked in Python.
 */
import type { Checkpoint, Step } from '../types';
import { ans, eq, ex, fast, mc, ord, py } from './_helpers';

// A small weighted graph used in several lessons:  A-B 4, A-C 1, C-B 2, B-D 1, C-D 5
const WG = 'G = {"A": [("B", 4), ("C", 1)], "B": [("A", 4), ("C", 2), ("D", 1)], "C": [("A", 1), ("B", 2), ("D", 5)], "D": [("B", 1), ("C", 5)]}';
const GRAPH_PIC = '```text\n      A\n   4 / \\ 1\n    B ─2─ C\n  1 |    / 5\n    D ──┘\n```';

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ al-5-greedy
  'al-5-greedy': [
    ex('Take the best option now', 'A **greedy algorithm** builds a solution step by step, always taking the choice that looks best **right now**, and never reconsiders.\n\nMaking change for 63¢ with US coins: take the biggest coin that fits each time → 25, 25, 10, 1, 1, 1 = **6 coins**. That\'s optimal.'),
    ex('Greedy can fail', 'With coins **{1, 3, 4}**, make 6¢:\n\n- Greedy: 4, then 1, 1 → **3 coins**\n- Best: 3 + 3 → **2 coins**\n\nGreedy works only when the problem has the **greedy-choice property** (a locally best choice is always part of some best overall solution). You must **prove** it — or find a counterexample.', 'When greedy fails, dynamic programming (Unit 6) usually saves the day.'),
    ans('Greedy change for 30¢ with coins {1, 10, 25}: how many coins does greedy use?', ['6'], '25 + 1+1+1+1+1 = 6 coins. (Three 10s = 3 coins is better — greedy fails here too!)'),
    mc('Why use greedy algorithms at all?', ['They\'re always optimal', 'When they\'re provably correct, they\'re simple and fast', 'They use recursion'], 1, 'Many classics — scheduling, Huffman codes, Dijkstra, Kruskal — are greedy and provably optimal.'),
    py({
      prompt: 'Write `greedy_coins(amount, coins)` that makes change greedily (largest coin first) and returns the number of coins used. Assume coin 1 is always available.',
      starter: 'def greedy_coins(amount, coins):\n    pass\n',
      tests: [eq('greedy_coins(63, [1, 5, 10, 25])', '6'), eq('greedy_coins(6, [1, 3, 4])', '3', 'greedy gives 3 (not optimal, and that\'s expected here)'), eq('greedy_coins(0, [1, 5])', '0')],
      hints: ['for c in sorted(coins, reverse=True): count += amount // c; amount %= c'],
      solution: 'def greedy_coins(amount, coins):\n    count = 0\n    for c in sorted(coins, reverse=True):\n        count += amount // c\n        amount %= c\n    return count\n',
    }),
    py({
      prompt: '**Jump game:** `nums[i]` is the max jump length from position i. Starting at index 0, can you reach the last index? Greedy: track the **farthest** index reachable so far. O(n).',
      starter: 'def can_reach_end(nums):\n    pass\n',
      tests: [eq('can_reach_end([2, 3, 1, 1, 4])', 'True'), eq('can_reach_end([3, 2, 1, 0, 4])', 'False'), eq('can_reach_end([0])', 'True'), fast('big = [1] * 300000', 'assert can_reach_end(big)', 1.5, 'O(n)')],
      hints: ['farthest = 0; for i, n in enumerate(nums): if i > farthest: return False; farthest = max(farthest, i + n)', 'return True'],
      solution: 'def can_reach_end(nums):\n    farthest = 0\n    for i, n in enumerate(nums):\n        if i > farthest:\n            return False\n        farthest = max(farthest, i + n)\n    return True\n',
    }),
  ],

  // ------------------------------------------------------------------ al-5-scheduling
  'al-5-scheduling': [
    ex('Interval scheduling', 'You have meeting requests (start, end) for one room. Fit in as many as possible.\n\nTempting greedy rules that **fail**: shortest first, earliest start first.\n\nThe rule that **works**: always pick the meeting that **ends earliest** (and doesn\'t overlap what you\'ve picked). Ending early leaves the most room for everything else.'),
    mc('Meetings: (1, 10), (2, 3), (4, 5), (6, 7). "Earliest start first" picks (1, 10) and gets 1 meeting. What does "earliest end first" get?', ['1', '2', '3', '4'], 2, '(2,3), (4,5), (6,7) — three meetings.'),
    py({
      prompt: 'Write `max_meetings(intervals)` returning the maximum number of non-overlapping intervals `(start, end)`. Touching is allowed: (1, 2) and (2, 3) don\'t overlap.',
      starter: 'def max_meetings(intervals):\n    pass\n',
      tests: [eq('max_meetings([(1, 10), (2, 3), (4, 5), (6, 7)])', '3'), eq('max_meetings([(1, 2), (2, 3), (3, 4)])', '3'), eq('max_meetings([])', '0'), eq('max_meetings([(1, 5), (2, 6), (3, 7)])', '1')],
      hints: ['Sort by end time: sorted(intervals, key=lambda iv: iv[1])', 'Keep the end of the last chosen meeting; take a meeting if its start >= that end.'],
      solution: 'def max_meetings(intervals):\n    count = 0\n    last_end = float("-inf")\n    for s, e in sorted(intervals, key=lambda iv: iv[1]):\n        if s >= last_end:\n            count += 1\n            last_end = e\n    return count\n',
    }),
    ex('How many rooms?', 'A different question: **every** meeting must happen — how many rooms do you need? Sort by start time and keep a **min-heap of end times** for rooms in use. For each meeting, if the earliest-ending room is free, reuse it; otherwise open a new room. The heap\'s biggest size is the answer.'),
    py({
      prompt: 'Write `rooms_needed(intervals)` using a min-heap of end times.',
      starter: 'import heapq\n\ndef rooms_needed(intervals):\n    pass\n',
      tests: [eq('rooms_needed([(0, 30), (5, 10), (15, 20)])', '2'), eq('rooms_needed([(1, 2), (2, 3)])', '1'), eq('rooms_needed([])', '0'), eq('rooms_needed([(1, 4), (2, 5), (3, 6)])', '3')],
      hints: ['for s, e in sorted(intervals): if heap and heap[0] <= s: heapq.heappop(heap); heapq.heappush(heap, e)', 'Track the max len(heap) — or just return len(heap) at the end (it never shrinks below the peak).'],
      solution: 'import heapq\n\ndef rooms_needed(intervals):\n    heap = []\n    for s, e in sorted(intervals):\n        if heap and heap[0] <= s:\n            heapq.heappop(heap)\n        heapq.heappush(heap, e)\n    return len(heap)\n',
    }),
  ],

  // ------------------------------------------------------------------ al-5-huffman
  'al-5-huffman': [
    ex('Compressing text', 'Normal text uses the same number of bits for every character (8 in ASCII). **Huffman coding** gives **frequent characters shorter codes** and rare ones longer codes — the idea inside ZIP and JPEG.\n\nThe codes are **prefix-free**: no code is the start of another, so a bit stream decodes unambiguously.'),
    ex('Building the tree (greedily)', '1. Make a node for each character with its frequency\n2. **Repeatedly merge the two least frequent** nodes into a parent whose frequency is their sum\n3. Left edges = 0, right edges = 1; each character\'s code is its path from the root\n\n"aaaabbc": a:4, b:2, c:1 → merge c+b (3), then 3+a (7).\nCodes: a = 0, b = 11, c = 10 → total bits = 4·1 + 2·2 + 1·2 = **10** (vs 56 in ASCII).'),
    mc('Codes a = 0, b = 01. Why is this NOT allowed?', ['Too short', 'a\'s code is a prefix of b\'s, so "01" is ambiguous', 'Codes must be the same length'], 1, 'Prefix-free codes decode without separators.'),
    ans('Frequencies x:5, y:1, z:1. Huffman merges y+z first (2), then with x (7). How many bits for "xxxxxyz"? (x gets 1 bit, y and z get 2)', ['9'], '5·1 + 1·2 + 1·2 = 9.'),
    py({
      prompt: 'Write `huffman_bits(freqs)`: given a list of character frequencies, return the total number of bits the Huffman encoding uses. (Fact: it equals the sum of all merged node weights.) Use a heap. A single character needs 1 bit per occurrence.',
      starter: 'import heapq\n\ndef huffman_bits(freqs):\n    pass\n',
      tests: [eq('huffman_bits([4, 2, 1])', '10'), eq('huffman_bits([5, 1, 1])', '9'), eq('huffman_bits([1, 1, 1, 1])', '8'), eq('huffman_bits([7])', '7')],
      hints: ['if len(freqs) == 1: return freqs[0]', 'heapify; while more than one: pop two, total += a + b, push a + b.'],
      solution: 'import heapq\n\ndef huffman_bits(freqs):\n    if len(freqs) == 1:\n        return freqs[0]\n    h = list(freqs)\n    heapq.heapify(h)\n    total = 0\n    while len(h) > 1:\n        a = heapq.heappop(h)\n        b = heapq.heappop(h)\n        total += a + b\n        heapq.heappush(h, a + b)\n    return total\n',
    }),
  ],

  // ------------------------------------------------------------------ al-6-memoization
  'al-6-memoization': [
    ex('Remember answers', 'The recursive Fibonacci recomputes the same values exponentially many times. **Memoization** stores each answer the first time it\'s computed and reuses it:\n\n```python\nmemo = {}\ndef fib(n):\n    if n < 2:\n        return n\n    if n not in memo:\n        memo[n] = fib(n - 1) + fib(n - 2)\n    return memo[n]\n```\n\nFrom exponential to **O(n)**. Python can do it for you: put `@functools.cache` above the function.'),
    ex('Dynamic programming', '**Dynamic programming (DP)** = solving a problem by combining answers to **overlapping subproblems**, computing each subproblem **once**.\n\nIt applies when a problem has:\n\n- **Optimal substructure:** the best answer is built from best answers to smaller problems\n- **Overlapping subproblems:** the same smaller problems come up again and again'),
    mc('Why is naive recursive fib(40) slow?', ['Big numbers', 'It solves the same subproblems over and over', 'Python recursion is slow'], 1, 'fib(38) is computed twice, fib(37) three times, …'),
    ans('Climbing stairs: you can climb 1 or 2 steps at a time. How many distinct ways to climb 5 steps?', ['8'], 'ways(n) = ways(n−1) + ways(n−2): 1, 2, 3, 5, 8.'),
    py({
      prompt: 'Write `climb(n)` — the number of ways to climb n stairs taking 1 or 2 steps — **recursively with memoization** (a dict, or `functools.cache`). It must handle n = 90 instantly.',
      starter: 'def climb(n):\n    pass\n',
      tests: [eq('climb(1)', '1'), eq('climb(5)', '8'), eq('climb(90)', '4660046610375530309')],
      hints: ['from functools import cache, then put @cache on the line above def climb(n):', 'Base cases: climb(1) = 1, climb(2) = 2 (or climb(0) = 1). Otherwise climb(n - 1) + climb(n - 2).'],
      solution: 'from functools import cache\n\n@cache\ndef climb(n):\n    if n <= 2:\n        return n\n    return climb(n - 1) + climb(n - 2)\n',
    }),
    py({
      prompt: '**Grid paths with walls:** count paths from top-left to bottom-right moving only right/down. `grid` is a list of strings where `#` is a wall. Use memoized recursion on (row, col).',
      starter: 'from functools import cache\n\ndef count_paths(grid):\n    pass\n',
      tests: [eq('count_paths(["...", "...", "..."])', '6'), eq('count_paths(["..", "#."])', '1'), eq('count_paths(["#"])', '0'), eq('count_paths(["." * 16] * 16)', '155117520')],
      hints: ['Define @cache def go(r, c): out of bounds or wall → 0; at the end → 1; else go(r + 1, c) + go(r, c + 1).'],
      solution: 'from functools import cache\n\ndef count_paths(grid):\n    rows, cols = len(grid), len(grid[0])\n    @cache\n    def go(r, c):\n        if r >= rows or c >= cols or grid[r][c] == "#":\n            return 0\n        if r == rows - 1 and c == cols - 1:\n            return 1\n        return go(r + 1, c) + go(r, c + 1)\n    return go(0, 0)\n',
    }),
  ],

  // ------------------------------------------------------------------ al-6-tabulation
  'al-6-tabulation': [
    ex('Bottom-up: fill a table', '**Tabulation** solves subproblems in order, smallest first, filling a table — no recursion:\n\n```python\ndef fib(n):\n    dp = [0, 1] + [0] * (n - 1)\n    for i in range(2, n + 1):\n        dp[i] = dp[i - 1] + dp[i - 2]\n    return dp[n]\n```\n\nSame O(n) time; no recursion-depth limit. If each step only needs the last few entries, keep just those: **O(1) space**.'),
    ord('Order the steps of designing a DP solution.', ['Define what dp[i] means in words', 'Write the recurrence relating dp[i] to smaller entries', 'Set the base cases', 'Fill the table in an order where smaller entries come first', 'Read the answer from the table'], 'Meaning → recurrence → base cases → order → answer.', 'text'),
    mc('Top-down memoization vs bottom-up tabulation:', ['Completely different answers', 'Same idea, different direction — both compute each subproblem once', 'Tabulation is always exponential'], 1, 'Both are dynamic programming.'),
    py({
      prompt: '**Min cost stairs:** `cost[i]` is the cost to step on stair i. You start at stair 0 or 1, and climb 1 or 2 at a time; reaching the top means going past the last stair. Return the minimum total cost (bottom-up).',
      starter: 'def min_cost(cost):\n    pass\n',
      tests: [eq('min_cost([10, 15, 20])', '15'), eq('min_cost([1, 100, 1, 1, 1, 100, 1, 1, 100, 1])', '6'), eq('min_cost([5, 5])', '5')],
      hints: ['dp[i] = cost to stand on stair i = cost[i] + min(dp[i - 1], dp[i - 2]); dp[0] = cost[0], dp[1] = cost[1]', 'Answer: min(dp[-1], dp[-2])'],
      solution: 'def min_cost(cost):\n    a, b = cost[0], cost[1]\n    for c in cost[2:]:\n        a, b = b, c + min(a, b)\n    return min(a, b)\n',
    }),
    py({
      prompt: '**Max subarray sum (Kadane):** the largest sum of any contiguous non-empty subarray. Bottom-up idea: best ending here = max(this item, this item + best ending at the previous item). O(n).',
      starter: 'def max_subarray(nums):\n    pass\n',
      tests: [eq('max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4])', '6'), eq('max_subarray([-3, -1, -2])', '-1'), eq('max_subarray([5])', '5'), fast('import random\nrandom.seed(5)\nbig = [random.randint(-100, 100) for _ in range(300000)]', 'max_subarray(big)', 1.5, 'O(n)')],
      hints: ['cur = best = nums[0]; for x in nums[1:]: cur = max(x, cur + x); best = max(best, cur)'],
      solution: 'def max_subarray(nums):\n    cur = best = nums[0]\n    for x in nums[1:]:\n        cur = max(x, cur + x)\n        best = max(best, cur)\n    return best\n',
    }),
  ],

  // ------------------------------------------------------------------ al-6-classic-1d
  'al-6-classic-1d': [
    ex('Coin change, done right', 'Fewest coins to make `amount` with coins {1, 3, 4}? Greedy failed. DP:\n\n**dp[a] = fewest coins to make a** = 1 + min(dp[a − c] for each coin c ≤ a), with dp[0] = 0.\n\n```text\na:   0 1 2 3 4 5 6\ndp:  0 1 2 1 1 2 2\n```\n\ndp[6] = 2 (3 + 3). Time: O(amount × number of coins).'),
    ans('Using that table, what is dp[5]? (fewest coins from {1, 3, 4} to make 5)', ['2'], '4 + 1.'),
    py({
      prompt: 'Write `min_coins(amount, coins)`: the fewest coins to make the amount, or -1 if impossible.',
      starter: 'def min_coins(amount, coins):\n    pass\n',
      tests: [eq('min_coins(6, [1, 3, 4])', '2'), eq('min_coins(11, [1, 2, 5])', '3'), eq('min_coins(3, [2])', '-1'), eq('min_coins(0, [1])', '0'), eq('min_coins(30, [1, 10, 25])', '3')],
      hints: ['INF = float("inf"); dp = [0] + [INF] * amount', 'for a in range(1, amount + 1): for c in coins: if c <= a: dp[a] = min(dp[a], dp[a - c] + 1)'],
      solution: 'def min_coins(amount, coins):\n    INF = float("inf")\n    dp = [0] + [INF] * amount\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a and dp[a - c] + 1 < dp[a]:\n                dp[a] = dp[a - c] + 1\n    return dp[amount] if dp[amount] != INF else -1\n',
    }),
    ans('House robber: houses hold [2, 7, 9, 3, 1]; you can\'t rob two adjacent houses. Max loot?', ['12'], '2 + 9 + 1 = 12.'),
    py({
      prompt: 'Write `rob(houses)`: max sum with no two adjacent houses. dp[i] = max(dp[i−1], dp[i−2] + houses[i]).',
      starter: 'def rob(houses):\n    pass\n',
      tests: [eq('rob([2, 7, 9, 3, 1])', '12'), eq('rob([1, 2, 3, 1])', '4'), eq('rob([])', '0'), eq('rob([5])', '5')],
      hints: ['prev2, prev1 = 0, 0; for h in houses: prev2, prev1 = prev1, max(prev1, prev2 + h)'],
      solution: 'def rob(houses):\n    prev2 = prev1 = 0\n    for h in houses:\n        prev2, prev1 = prev1, max(prev1, prev2 + h)\n    return prev1\n',
    }),
    py({
      prompt: '**Longest increasing subsequence:** the length of the longest strictly increasing subsequence (not necessarily contiguous). `[10, 9, 2, 5, 3, 7, 101, 18]` → 4 (e.g. 2, 3, 7, 18). An O(n²) DP is fine: dp[i] = 1 + max(dp[j] for j < i with nums[j] < nums[i]).',
      starter: 'def lis(nums):\n    pass\n',
      tests: [eq('lis([10, 9, 2, 5, 3, 7, 101, 18])', '4'), eq('lis([0, 1, 0, 3, 2, 3])', '4'), eq('lis([7, 7, 7])', '1'), eq('lis([])', '0')],
      hints: ['dp = [1] * len(nums)', 'for i: for j < i: if nums[j] < nums[i]: dp[i] = max(dp[i], dp[j] + 1). Return max(dp) (or 0).'],
      solution: 'def lis(nums):\n    dp = [1] * len(nums)\n    for i in range(len(nums)):\n        for j in range(i):\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp, default=0)\n',
    }),
  ],

  // ------------------------------------------------------------------ al-6-classic-2d
  'al-6-classic-2d': [
    ex('Two-dimensional DP', 'When a problem compares **two sequences** or has **two changing quantities**, the table is 2-D.\n\n**Longest common subsequence (LCS)** of strings a and b — dp[i][j] = LCS of a[:i] and b[:j]:\n\n- if a[i−1] == b[j−1]: dp[i][j] = dp[i−1][j−1] + 1\n- else: dp[i][j] = max(dp[i−1][j], dp[i][j−1])\n\nLCS("abcde", "ace") = 3. Used by `diff` and DNA comparison.'),
    py({
      prompt: 'Write `lcs(a, b)` returning the length of the longest common subsequence.',
      starter: 'def lcs(a, b):\n    pass\n',
      tests: [eq('lcs("abcde", "ace")', '3'), eq('lcs("abc", "def")', '0'), eq('lcs("", "abc")', '0'), eq('lcs("AGGTAB", "GXTXAYB")', '4')],
      hints: ['dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]', 'Fill rows i = 1..len(a), columns j = 1..len(b) with the rule from the lesson; return dp[-1][-1].'],
      solution: 'def lcs(a, b):\n    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]\n    for i in range(1, len(a) + 1):\n        for j in range(1, len(b) + 1):\n            if a[i - 1] == b[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1] + 1\n            else:\n                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\n    return dp[-1][-1]\n',
    }),
    ex('Edit distance', 'The fewest single-character **inserts, deletes or substitutions** to turn one word into another — what spell-checkers use.\n\ndp[i][j] = distance between a[:i] and b[:j]:\n\n- dp[i][0] = i, dp[0][j] = j\n- if the letters match: dp[i−1][j−1]\n- else: 1 + min(delete dp[i−1][j], insert dp[i][j−1], substitute dp[i−1][j−1])\n\n"kitten" → "sitting" = **3** (k→s, e→i, insert g).'),
    py({
      prompt: 'Write `edit_distance(a, b)`.',
      starter: 'def edit_distance(a, b):\n    pass\n',
      tests: [eq('edit_distance("kitten", "sitting")', '3'), eq('edit_distance("flaw", "lawn")', '2'), eq('edit_distance("", "abc")', '3'), eq('edit_distance("same", "same")', '0')],
      hints: ['dp[i][0] = i and dp[0][j] = j for the borders.', 'dp[i][j] = dp[i-1][j-1] if a[i-1] == b[j-1] else 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])'],
      solution: 'def edit_distance(a, b):\n    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]\n    for i in range(len(a) + 1):\n        dp[i][0] = i\n    for j in range(len(b) + 1):\n        dp[0][j] = j\n    for i in range(1, len(a) + 1):\n        for j in range(1, len(b) + 1):\n            if a[i - 1] == b[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1]\n            else:\n                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])\n    return dp[-1][-1]\n',
    }),
    ex('0/1 knapsack', 'Items have weights and values; a bag holds capacity W. Each item is taken or not (0/1). Maximize value.\n\ndp[w] = best value with capacity w. For each item, loop w **downward** from W to its weight (so each item is used at most once):\n\ndp[w] = max(dp[w], dp[w − weight] + value)\n\nTime: O(n × W).'),
    py({
      prompt: 'Write `knapsack(items, capacity)` where items is a list of `(weight, value)` pairs.',
      starter: 'def knapsack(items, capacity):\n    pass\n',
      tests: [eq('knapsack([(1, 1), (3, 4), (4, 5), (5, 7)], 7)', '9'), eq('knapsack([(5, 10)], 4)', '0'), eq('knapsack([], 10)', '0'), eq('knapsack([(2, 3), (2, 3), (2, 3)], 4)', '6', 'each item at most once')],
      hints: ['dp = [0] * (capacity + 1)', 'for wt, val in items: for w in range(capacity, wt - 1, -1): dp[w] = max(dp[w], dp[w - wt] + val)'],
      solution: 'def knapsack(items, capacity):\n    dp = [0] * (capacity + 1)\n    for wt, val in items:\n        for w in range(capacity, wt - 1, -1):\n            dp[w] = max(dp[w], dp[w - wt] + val)\n    return dp[capacity]\n',
    }),
  ],

  // ------------------------------------------------------------------ al-7-bfs-dfs
  'al-7-bfs-dfs': [
    ex('Exploring a graph', '**Breadth-first search (BFS)** explores in rings: all neighbors first, then their neighbors… using a **queue**. In an unweighted graph, BFS finds the **shortest path** (fewest edges).\n\n**Depth-first search (DFS)** goes as deep as possible before backing up, using a **stack** (or recursion). Great for exploring everything, finding connected pieces, and detecting cycles.\n\nBoth are **O(V + E)**. Always keep a **visited** set, or you\'ll loop forever on cycles.'),
    mc('Fewest moves for a knight to reach a square, fewest hops in a network… which search?', ['DFS', 'BFS'], 1, 'BFS explores by distance, so the first time it reaches a node is via a shortest path.'),
    py({
      prompt: 'Write `shortest_hops(graph, start, goal)` using BFS on an adjacency dict: the fewest edges from start to goal, or -1 if unreachable.',
      starter: 'from collections import deque\n\ndef shortest_hops(graph, start, goal):\n    pass\n',
      tests: [eq('shortest_hops({"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": ["E"], "E": []}, "A", "E")', '3'), eq('shortest_hops({"A": ["B"], "B": ["A"], "C": []}, "A", "C")', '-1'), eq('shortest_hops({"A": []}, "A", "A")', '0')],
      hints: ['q = deque([(start, 0)]); seen = {start}', 'Pop (node, d); if node == goal: return d; push unseen neighbors with d + 1.'],
      solution: 'from collections import deque\n\ndef shortest_hops(graph, start, goal):\n    q = deque([(start, 0)])\n    seen = {start}\n    while q:\n        node, d = q.popleft()\n        if node == goal:\n            return d\n        for nxt in graph.get(node, []):\n            if nxt not in seen:\n                seen.add(nxt)\n                q.append((nxt, d + 1))\n    return -1\n',
    }),
    py({
      prompt: '**Count islands:** `grid` is a list of strings of `1` (land) and `0` (water). Islands are groups of land connected up/down/left/right. Return how many there are (DFS or BFS from each unvisited land cell).',
      starter: 'def count_islands(grid):\n    pass\n',
      tests: [eq('count_islands(["11000", "11000", "00100", "00011"])', '3'), eq('count_islands(["111", "101", "111"])', '1'), eq('count_islands(["0"])', '0'), eq('count_islands(["1" * 200] * 200)', '1', 'one big island — use an explicit stack (recursion would be too deep)')],
      hints: ['seen = set(). For each land cell not seen: count += 1 and flood-fill from it.', 'Flood fill with a stack: pop (r, c); for each of 4 neighbors in bounds, land and unseen: mark and push.'],
      solution: 'def count_islands(grid):\n    rows, cols = len(grid), len(grid[0])\n    seen = set()\n    count = 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == "1" and (r, c) not in seen:\n                count += 1\n                seen.add((r, c))\n                stack = [(r, c)]\n                while stack:\n                    y, x = stack.pop()\n                    for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):\n                        if 0 <= ny < rows and 0 <= nx < cols and grid[ny][nx] == "1" and (ny, nx) not in seen:\n                            seen.add((ny, nx))\n                            stack.append((ny, nx))\n    return count\n',
    }),
    mc('Why does BFS need a visited set?', ['To sort the nodes', 'Without it, cycles make it revisit nodes forever', 'To find the start'], 1, 'Mark nodes when you add them to the queue.'),
  ],

  // ------------------------------------------------------------------ al-7-topo-sort
  'al-7-topo-sort': [
    ex('Order with dependencies', 'Courses with prerequisites, build steps, spreadsheet formulas: some tasks must come before others. This is a **directed acyclic graph (DAG)**, and a **topological order** lists the vertices so every edge points **forward**.\n\n**Kahn\'s algorithm:**\n\n1. Count each vertex\'s incoming edges (**in-degree**)\n2. Queue every vertex with in-degree 0 (nothing required first)\n3. Repeatedly take one, output it, and "remove" its outgoing edges; queue any vertex whose in-degree drops to 0\n\nIf some vertices never reach in-degree 0, there\'s a **cycle** — no valid order exists.'),
    mc('Courses: Intro → Data Structures → Algorithms, and Math → Algorithms. Which is a valid order?', ['Algorithms, Intro, Math, Data Structures', 'Intro, Math, Data Structures, Algorithms', 'Data Structures, Intro, Math, Algorithms'], 1, 'Every prerequisite appears before the course that needs it.'),
    mc('A requires B, B requires C, C requires A. A topological order…', ['starts with A', 'doesn\'t exist — there\'s a cycle', 'is A, B, C'], 1, 'Cycles make ordering impossible.'),
    py({
      prompt: 'Write `topo_order(n, edges)`: vertices 0..n−1, edges `(a, b)` mean a must come before b. Return a valid order as a list using Kahn\'s algorithm (when several vertices are ready, take the **smallest** first — use a heap), or `None` if there\'s a cycle.',
      starter: 'import heapq\n\ndef topo_order(n, edges):\n    pass\n',
      tests: [eq('topo_order(4, [(0, 1), (1, 3), (2, 3)])', '[0, 1, 2, 3]'), eq('topo_order(3, [(0, 1), (1, 2), (2, 0)])', 'None'), eq('topo_order(3, [])', '[0, 1, 2]'), eq('topo_order(3, [(2, 1), (1, 0)])', '[2, 1, 0]')],
      hints: ['indeg = [0] * n; adj = [[] for _ in range(n)]', 'Start a heap with every vertex whose indeg is 0. Pop, append to order, decrement neighbors, push any that hit 0.', 'If len(order) < n at the end, return None.'],
      solution: 'import heapq\n\ndef topo_order(n, edges):\n    adj = [[] for _ in range(n)]\n    indeg = [0] * n\n    for a, b in edges:\n        adj[a].append(b)\n        indeg[b] += 1\n    ready = [v for v in range(n) if indeg[v] == 0]\n    heapq.heapify(ready)\n    order = []\n    while ready:\n        v = heapq.heappop(ready)\n        order.append(v)\n        for w in adj[v]:\n            indeg[w] -= 1\n            if indeg[w] == 0:\n                heapq.heappush(ready, w)\n    return order if len(order) == n else None\n',
    }),
  ],

  // ------------------------------------------------------------------ al-7-dijkstra
  'al-7-dijkstra': [
    ex('Shortest paths with weights', 'When edges have **weights** (distances, times, costs), BFS isn\'t enough. **Dijkstra\'s algorithm** finds shortest paths from a start vertex when all weights are **non-negative**:\n\n- distances start at ∞, except the start (0)\n- repeatedly take the **unfinished vertex with the smallest distance** (a min-heap!)\n- **relax** its edges: if going through it is shorter, update the neighbor\'s distance\n\nWith a heap: **O((V + E) log V)**. GPS navigation is built on it.\n\n' + GRAPH_PIC),
    ans('In the graph above, what is the shortest distance from A to D?', ['4'], 'A→C (1) → B (2) → D (1) = 4. The direct-looking A→B→D is 5.'),
    ans('Shortest distance from A to B?', ['3'], 'A→C→B = 1 + 2 = 3, beating the direct edge of 4.'),
    py({
      prompt: 'Implement `dijkstra(graph, start)` returning a dict of shortest distances. `graph` maps each vertex to a list of `(neighbor, weight)` pairs. Unreachable vertices should not appear in the result.',
      starter: 'import heapq\n\ndef dijkstra(graph, start):\n    pass\n',
      tests: [{ name: 'example graph', code: WG + '\nassert dijkstra(G, "A") == {"A": 0, "C": 1, "B": 3, "D": 4}' }, eq('dijkstra({"A": [], "B": []}, "A")', '{"A": 0}'), fast('import random\nrandom.seed(9)\nn = 20000\nbig = {i: [((i * 7 + k) % n, random.randint(1, 20)) for k in range(1, 6)] for i in range(n)}', 'd = dijkstra(big, 0)\nassert d[0] == 0 and len(d) == n', 3.0, 'O((V + E) log V) on 20,000 vertices')],
      hints: ['dist = {start: 0}; heap = [(0, start)]', 'Pop (d, v); if d > dist[v]: continue (stale entry). For (w, cost): nd = d + cost; if w not in dist or nd < dist[w]: dist[w] = nd; push (nd, w).'],
      solution: 'import heapq\n\ndef dijkstra(graph, start):\n    dist = {start: 0}\n    heap = [(0, start)]\n    while heap:\n        d, v = heapq.heappop(heap)\n        if d > dist[v]:\n            continue\n        for w, cost in graph.get(v, []):\n            nd = d + cost\n            if w not in dist or nd < dist[w]:\n                dist[w] = nd\n                heapq.heappush(heap, (nd, w))\n    return dist\n',
    }),
    mc('Why does Dijkstra break with negative edge weights?', ['Heaps can\'t store negatives', 'It assumes a finished vertex can\'t get shorter later — a negative edge could make it shorter', 'It doesn\'t break'], 1, 'Once popped, a vertex is final. Negative edges violate that (use Bellman–Ford instead).'),
  ],

  // ------------------------------------------------------------------ al-7-mst
  'al-7-mst': [
    ex('Connect everything cheaply', 'A **minimum spanning tree (MST)** connects all vertices of a weighted graph using edges with the **smallest total weight** (and no cycles — it\'s a tree, so V − 1 edges). Think: laying cable to connect every building for the least cost.\n\n**Kruskal\'s algorithm** (greedy): sort edges by weight; add each edge **unless it would create a cycle** (check with union–find).\n\n**Prim\'s algorithm** (greedy): grow a tree from one vertex, always adding the cheapest edge leaving it (with a heap).'),
    ans('Using the graph from the Dijkstra lesson (A-C 1, B-D 1, B-C 2, A-B 4, C-D 5), what is the MST\'s total weight?', ['4'], 'Kruskal takes A-C (1), B-D (1), B-C (2). A-B and C-D would make cycles. 1 + 1 + 2 = 4.'),
    mc('A graph has 10 vertices. How many edges does its MST have?', ['10', '9', '45'], 1, 'A spanning tree on V vertices has V − 1 edges.'),
    py({
      prompt: 'Implement **Kruskal\'s algorithm**: `mst_weight(n, edges)` with vertices 0..n−1 and edges `(weight, u, v)`. Return the MST\'s total weight (assume the graph is connected). Use union–find.',
      starter: 'def mst_weight(n, edges):\n    pass\n',
      tests: [eq('mst_weight(4, [(4, 0, 1), (1, 0, 2), (2, 2, 1), (1, 1, 3), (5, 2, 3)])', '4'), eq('mst_weight(1, [])', '0'), eq('mst_weight(3, [(1, 0, 1), (1, 1, 2), (1, 0, 2)])', '2')],
      hints: ['parent = list(range(n)) with a find function.', 'for w, u, v in sorted(edges): if find(u) != find(v): union them and total += w'],
      solution: 'def mst_weight(n, edges):\n    parent = list(range(n))\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    total = 0\n    for w, u, v in sorted(edges):\n        ru, rv = find(u), find(v)\n        if ru != rv:\n            parent[ru] = rv\n            total += w\n    return total\n',
    }),
    mc('Is the MST the same as shortest paths from one vertex?', ['Yes', 'No — MST minimizes the TOTAL edge weight; shortest paths minimize each route from the start'], 1, 'Different questions with different answers.'),
  ],

  // ------------------------------------------------------------------ al-7-bellman-ford
  'al-7-bellman-ford': [
    ex('Negative edges', 'Some problems have negative weights (refunds, currency exchange gains). **Bellman–Ford** handles them:\n\n- set dist[start] = 0, everything else ∞\n- **relax every edge**, and repeat that whole pass **V − 1 times**\n- one more pass: if anything still improves, there\'s a **negative cycle** (a loop you could go around forever to decrease the cost)\n\nTime **O(V · E)** — slower than Dijkstra, but more general.'),
    mc('Why V − 1 passes?', ['Tradition', 'A shortest path (without cycles) has at most V − 1 edges, and each pass fixes at least one more edge of it', 'To be safe'], 1, 'After k passes, every shortest path using ≤ k edges is correct.'),
    py({
      prompt: 'Implement `bellman_ford(n, edges, start)` for vertices 0..n−1 and directed edges `(u, v, w)`. Return the list of distances (`float("inf")` for unreachable), or `None` if a negative cycle is reachable.',
      starter: 'def bellman_ford(n, edges, start):\n    pass\n',
      tests: [eq('bellman_ford(3, [(0, 1, 4), (0, 2, 5), (2, 1, -3)], 0)', '[0, 2, 5]'), eq('bellman_ford(3, [(0, 1, 1), (1, 2, -2), (2, 1, 1)], 0)', 'None', 'negative cycle 1→2→1'), eq('bellman_ford(2, [], 0)', '[0, float("inf")]')],
      hints: ['dist = [inf] * n; dist[start] = 0', 'Repeat n - 1 times: for u, v, w in edges: if dist[u] + w < dist[v]: dist[v] = dist[u] + w', 'Then one more pass: if any edge still improves, return None.'],
      solution: 'def bellman_ford(n, edges, start):\n    INF = float("inf")\n    dist = [INF] * n\n    dist[start] = 0\n    for _ in range(n - 1):\n        for u, v, w in edges:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n    for u, v, w in edges:\n        if dist[u] + w < dist[v]:\n            return None\n    return dist\n',
    }),
    ex('All pairs: Floyd–Warshall', 'To get shortest paths between **every** pair of vertices, **Floyd–Warshall** is a famous 3-line DP:\n\n```python\nfor k in range(n):\n    for i in range(n):\n        for j in range(n):\n            d[i][j] = min(d[i][j], d[i][k] + d[k][j])\n```\n\n"Is going through vertex k shorter?" — **O(V³)**, handles negative edges (but not negative cycles).'),
    mc('Floyd–Warshall\'s running time is…', ['O(V²)', 'O(V³)', 'O(E log V)'], 1, 'Three nested loops over the vertices.'),
  ],

  // ------------------------------------------------------------------ al-8-p-np
  'al-8-p-np': [
    ex('Easy to check, hard to find?', '- **P**: problems solvable in **polynomial time** (O(n), O(n²), O(n³)…) — "efficiently solvable"\n- **NP**: problems where a proposed answer can be **verified** in polynomial time\n\nSudoku is in NP: checking a filled grid is easy; finding the solution seems hard. Every problem in P is also in NP.\n\n**P vs NP** asks: if answers are easy to check, are they always easy to find? Nobody knows. It\'s one of the Clay Institute\'s $1,000,000 Millennium Prize Problems.'),
    mc('Which describes NP?', ['Not polynomial', 'Problems whose solutions can be verified in polynomial time', 'Problems no computer can solve'], 1, 'NP = nondeterministic polynomial time; the verification view is the friendliest definition.'),
    ex('NP-complete', 'An **NP-complete** problem is in NP and is **at least as hard as every problem in NP**. If anyone found a polynomial algorithm for **one** of them, **all** NP problems would become easy (P = NP).\n\nFamous ones: **SAT** (satisfy a logic formula), **traveling salesperson** (decision version), **subset sum**, **graph coloring** with 3 colors, **Hamiltonian path**, **knapsack** (decision version).', 'Recognizing an NP-complete problem tells you to stop hunting for a perfect fast algorithm and reach for heuristics or approximations.'),
    mc('Your boss asks for a fast algorithm that always finds the optimal delivery route visiting 500 stops. What do you say?', ['Sure, by Friday', 'That\'s traveling salesperson — NP-hard; I\'ll build a fast heuristic that gives a very good route', 'Impossible to do anything'], 1, 'Know when to stop looking for perfection.'),
    py({
      prompt: 'Subset sum is in NP: **checking** a proposed answer is easy. Write `verify(nums, target, chosen)` where `chosen` is a list of **indexes**: return True if they\'re distinct valid indexes whose values sum to target. (O(n) — that\'s the "easy to check" part.)',
      starter: 'def verify(nums, target, chosen):\n    pass\n',
      tests: [eq('verify([3, 34, 4, 12, 5, 2], 9, [2, 4])', 'True'), eq('verify([3, 34, 4, 12, 5, 2], 9, [0, 0, 0])', 'False', 'indexes must be distinct'), eq('verify([1, 2], 3, [0, 5])', 'False', 'index out of range'), eq('verify([1, 2], 0, [])', 'True')],
      hints: ['Check len(set(chosen)) == len(chosen) and every 0 <= i < len(nums).', 'Then compare sum(nums[i] for i in chosen) with target.'],
      solution: 'def verify(nums, target, chosen):\n    if len(set(chosen)) != len(chosen):\n        return False\n    if any(i < 0 or i >= len(nums) for i in chosen):\n        return False\n    return sum(nums[i] for i in chosen) == target\n',
    }),
    py({
      prompt: 'Now **find** an answer by brute force: `subset_sum(nums, target)` returns True if some subset sums to target. Try all 2ⁿ subsets — fine for small n, hopeless for n = 100. (Notice the contrast with verifying!)',
      starter: 'def subset_sum(nums, target):\n    pass\n',
      tests: [eq('subset_sum([3, 34, 4, 12, 5, 2], 9)', 'True'), eq('subset_sum([3, 34, 4, 12, 5, 2], 30)', 'False'), eq('subset_sum([], 0)', 'True')],
      hints: ['Recursive: subset_sum(rest, target - first) or subset_sum(rest, target).', 'Base case: target == 0 → True; no numbers left → False.'],
      solution: 'def subset_sum(nums, target):\n    if target == 0:\n        return True\n    if not nums:\n        return False\n    return subset_sum(nums[1:], target - nums[0]) or subset_sum(nums[1:], target)\n',
    }),
  ],

  // ------------------------------------------------------------------ al-8-reductions
  'al-8-reductions': [
    ex('Turning one problem into another', 'A **reduction** from problem A to problem B is a fast way to **convert any A-instance into a B-instance** with the same answer.\n\n- Use it to **solve** A: "I can reduce A to sorting, so A takes O(n log n)."\n- Use it to show B is **hard**: if a known hard problem A reduces to B, then B is at least as hard as A.\n\nThe direction matters: reduce **from** the known-hard problem **to** the new one.'),
    mc('You want to prove your new problem X is NP-hard. You should…', ['Reduce X to SAT', 'Reduce a known NP-complete problem (like SAT) to X', 'Show X is in P'], 1, 'If X could solve SAT, X must be at least as hard as SAT.'),
    ex('A reduction you already know', '"Does this list have duplicates?" reduces to **sorting**: sort it, then check neighbors. So the duplicates problem is no harder than sorting (O(n log n)).\n\nMany interview problems are secretly reductions: "this is just a shortest-path problem on a graph where each word is a vertex…"'),
    mc('"Find the shortest sequence of one-letter changes from COLD to WARM using real words." What is this, secretly?', ['Sorting', 'BFS on a graph where words are vertices and one-letter changes are edges', 'Knapsack'], 1, 'Model it as a graph; then BFS finds the fewest changes.'),
    py({
      prompt: 'Reduce a problem to graph search: `word_ladder(start, end, words)` returns the fewest steps from start to end, changing one letter at a time, where every intermediate word must be in `words` (a list). Return -1 if impossible. (Count steps = number of changes.)',
      starter: 'from collections import deque\n\ndef word_ladder(start, end, words):\n    pass\n',
      tests: [eq('word_ladder("cold", "warm", ["cord", "card", "ward", "warm", "word", "worm"])', '4'), eq('word_ladder("hit", "cog", ["hot", "dot", "dog"])', '-1', 'end word not in the list'), eq('word_ladder("aa", "aa", [])', '0')],
      hints: ['BFS from start; neighbors = words in the set that differ in exactly one position.', 'Try changing each position to each letter a–z and check membership in a set.'],
      solution: 'from collections import deque\n\ndef word_ladder(start, end, words):\n    if start == end:\n        return 0\n    dictionary = set(words)\n    q = deque([(start, 0)])\n    seen = {start}\n    while q:\n        w, d = q.popleft()\n        for i in range(len(w)):\n            for ch in "abcdefghijklmnopqrstuvwxyz":\n                nxt = w[:i] + ch + w[i + 1:]\n                if nxt in dictionary and nxt not in seen:\n                    if nxt == end:\n                        return d + 1\n                    seen.add(nxt)\n                    q.append((nxt, d + 1))\n    return -1\n',
    }),
  ],

  // ------------------------------------------------------------------ al-8-approximation
  'al-8-approximation': [
    ex('Good enough, fast', 'For NP-hard problems in the real world, we use:\n\n- **Approximation algorithms** — fast, with a **proven** guarantee like "at most 2× the optimal"\n- **Heuristics** — fast and usually good, without a guarantee (nearest-neighbor tours, local search, genetic algorithms)\n- **Exact but exponential** — fine when n is small, or with clever pruning (SAT solvers handle millions of variables in practice!)'),
    ex('A 2-approximation: vertex cover', 'A **vertex cover** is a set of vertices touching every edge (e.g. where to put cameras so every hallway is watched). Finding the smallest is NP-hard.\n\n**Simple 2-approximation:** while some edge is uncovered, add **both** its endpoints. The result is at most **twice** the optimal size — because any cover must contain at least one endpoint of each edge we picked, and those edges share no vertices.'),
    mc('An approximation algorithm with ratio 2 for a minimization problem guarantees…', ['the optimal answer', 'an answer at most 2× the optimal', 'an answer within 2 of optimal'], 1, 'A ratio is multiplicative.'),
    py({
      prompt: 'Implement the 2-approximation: `vertex_cover(edges)` returns a set of vertices that touches every edge, by picking an uncovered edge and adding both endpoints.',
      starter: 'def vertex_cover(edges):\n    pass\n',
      tests: [{ name: 'covers every edge', code: 'edges = [(1, 2), (2, 3), (3, 4), (4, 5), (2, 5)]\nc = vertex_cover(edges)\nassert all(u in c or v in c for u, v in edges)' }, { name: 'at most twice the optimum on a star', code: 'edges = [(0, i) for i in range(1, 50)]\nassert len(vertex_cover(edges)) <= 2' }, eq('vertex_cover([])', 'set()')],
      hints: ['cover = set(); for u, v in edges: if u not in cover and v not in cover: cover.add(u); cover.add(v)'],
      solution: 'def vertex_cover(edges):\n    cover = set()\n    for u, v in edges:\n        if u not in cover and v not in cover:\n            cover.add(u)\n            cover.add(v)\n    return cover\n',
    }),
    py({
      prompt: '**Nearest-neighbor heuristic** for the traveling salesperson: start at city 0, repeatedly go to the closest unvisited city, then return to 0. `dist` is a matrix. Return the tour length. (Not optimal — but fast and usually decent.)',
      starter: 'def nearest_neighbor_tour(dist):\n    pass\n',
      tests: [eq('nearest_neighbor_tour([[0, 1, 4], [1, 0, 2], [4, 2, 0]])', '7'), eq('nearest_neighbor_tour([[0]])', '0'), eq('nearest_neighbor_tour([[0, 2], [2, 0]])', '4')],
      hints: ['current = 0; visited = {0}; total = 0', 'While unvisited cities remain: pick the nearest, add its distance, move there. Finally add dist[current][0].'],
      solution: 'def nearest_neighbor_tour(dist):\n    n = len(dist)\n    current = 0\n    visited = {0}\n    total = 0\n    while len(visited) < n:\n        nxt = min((c for c in range(n) if c not in visited), key=lambda c: dist[current][c])\n        total += dist[current][nxt]\n        visited.add(nxt)\n        current = nxt\n    return total + dist[current][0]\n',
    }),
    mc('When is an exponential exact algorithm the right choice?', ['Never', 'When inputs are small or the structure lets pruning cut the search down', 'Always'], 1, 'Brute force on 15 items is instant; on 100 it\'s hopeless.'),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'al-5': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Greedy algorithms…', ['always find the optimum', 'make the locally best choice and never reconsider', 'try every option'], 1, 'Local choices.'),
      mc('Max non-overlapping meetings: pick by…', ['earliest start', 'shortest length', 'earliest end'], 2, 'Earliest end.'),
      ans('Greedy change for 6 with coins {1, 3, 4} uses how many coins?', ['3'], '4 + 1 + 1.'),
      mc('Huffman coding gives frequent characters…', ['longer codes', 'shorter codes', 'the same length'], 1, 'Shorter.'),
      py({ prompt: 'Write `min_platforms(arrivals, departures)` — trains at a station; return the max number present at once. (A train departing at time t frees the platform for one arriving at t.)', starter: 'def min_platforms(arrivals, departures):\n    pass\n', tests: [eq('min_platforms([900, 940, 950, 1100], [910, 1200, 1120, 1130])', '3'), eq('min_platforms([1], [2])', '1')], solution: 'def min_platforms(arrivals, departures):\n    events = [(t, 1) for t in arrivals] + [(t, -1) for t in departures]\n    events.sort(key=lambda e: (e[0], e[1]))\n    cur = best = 0\n    for _, d in events:\n        cur += d\n        best = max(best, cur)\n    return best\n' }),
    ],
  },
  'al-6': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('DP applies when a problem has…', ['overlapping subproblems and optimal substructure', 'only one solution', 'negative numbers'], 0, 'Both properties.'),
      mc('Memoization is…', ['bottom-up', 'top-down recursion with a cache'], 1, 'Top-down.'),
      ans('Ways to climb 6 stairs with 1- or 2-steps?', ['13'], '1, 2, 3, 5, 8, 13.'),
      ans('LCS of "abc" and "ac"?', ['2'], '"ac".'),
      ans('Edit distance from "cat" to "cut"?', ['1'], 'One substitution.'),
      py({ prompt: 'Write `count_change(amount, coins)`: the number of DIFFERENT ways to make the amount (order doesn\'t matter). Loop over coins on the outside.', starter: 'def count_change(amount, coins):\n    pass\n', tests: [eq('count_change(5, [1, 2, 5])', '4'), eq('count_change(3, [2])', '0'), eq('count_change(0, [7])', '1')], solution: 'def count_change(amount, coins):\n    dp = [1] + [0] * amount\n    for c in coins:\n        for a in range(c, amount + 1):\n            dp[a] += dp[a - c]\n    return dp[amount]\n' }),
    ],
  },
  'al-7': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Shortest path in an UNWEIGHTED graph:', ['DFS', 'BFS', 'Kruskal'], 1, 'BFS.'),
      mc('Shortest paths with non-negative weights:', ['Dijkstra', 'DFS', 'Topological sort'], 0, 'Dijkstra.'),
      mc('Negative edge weights:', ['Dijkstra', 'Bellman–Ford'], 1, 'Bellman–Ford.'),
      mc('Ordering tasks with prerequisites:', ['MST', 'topological sort', 'binary search'], 1, 'Topo sort.'),
      mc('Kruskal\'s algorithm uses…', ['a queue', 'union–find', 'a trie'], 1, 'Cycle checks.'),
      py({ prompt: 'Write `has_path(graph, a, b)` using DFS (iterative) on an adjacency dict.', starter: 'def has_path(graph, a, b):\n    pass\n', tests: [eq('has_path({1: [2], 2: [3], 3: []}, 1, 3)', 'True'), eq('has_path({1: [2], 2: [], 3: [1]}, 1, 3)', 'False'), eq('has_path({1: [1]}, 1, 1)', 'True')], solution: 'def has_path(graph, a, b):\n    stack = [a]\n    seen = {a}\n    while stack:\n        v = stack.pop()\n        if v == b:\n            return True\n        for w in graph.get(v, []):\n            if w not in seen:\n                seen.add(w)\n                stack.append(w)\n    return False\n' }),
    ],
  },
  'al-8': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Problems whose answers can be verified in polynomial time form…', ['P', 'NP', 'EXP'], 1, 'NP.'),
      mc('If one NP-complete problem had a polynomial algorithm…', ['nothing changes', 'P = NP', 'it would be NP-hard'], 1, 'All of NP would be easy.'),
      mc('To show X is NP-hard, reduce…', ['X to a known NP-complete problem', 'a known NP-complete problem to X'], 1, 'From known-hard to X.'),
      mc('A 2-approximation for a minimization problem returns…', ['the optimum', 'at most 2× the optimum', 'exactly 2× the optimum'], 1, 'At most 2×.'),
      mc('Which is NP-complete?', ['Sorting', 'Shortest path', 'Subset sum', 'Binary search'], 2, 'Subset sum.'),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  algorithms: {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Time complexity of binary search:', ['O(n)', 'O(log n)', 'O(1)'], 1, 'Halving.'),
      mc('Best worst-case comparison sorting time:', ['O(n)', 'O(n log n)', 'O(n²)'], 1, 'Ω(n log n) bound.'),
      mc('T(n) = 2T(n/2) + n:', ['Θ(n log n)', 'Θ(n²)', 'Θ(n)'], 0, 'Master theorem case 2.'),
      mc('Which technique finds the longest substring without repeats in O(n)?', ['sliding window', 'quicksort', 'Dijkstra'], 0, 'Window.'),
      mc('Fewest coins with arbitrary coin sets needs…', ['greedy', 'dynamic programming'], 1, 'DP.'),
      mc('Shortest path with non-negative weights:', ['BFS', 'Dijkstra', 'Kruskal'], 1, 'Dijkstra.'),
      mc('Traveling salesperson (decision version) is…', ['in P', 'NP-complete', 'undecidable'], 1, 'NP-complete.'),
      ans('Edit distance between "sun" and "sit"?', ['2'], 'u→i, n→t.'),
      py({ prompt: 'Write `three_sum_zero(nums)` returning True if any three items (different positions) sum to 0. Aim for O(n²): sort, then two pointers for each first element.', starter: 'def three_sum_zero(nums):\n    pass\n', tests: [eq('three_sum_zero([-1, 0, 1, 2, -1, -4])', 'True'), eq('three_sum_zero([1, 2, 3])', 'False'), eq('three_sum_zero([0, 0])', 'False'), fast('import random\nrandom.seed(4)\nbig = [random.randint(1, 10**6) for _ in range(1500)]', 'assert three_sum_zero(big) is False', 3.0, 'O(n²), not O(n³)')], solution: 'def three_sum_zero(nums):\n    a = sorted(nums)\n    for i in range(len(a) - 2):\n        j, k = i + 1, len(a) - 1\n        while j < k:\n            s = a[i] + a[j] + a[k]\n            if s == 0:\n                return True\n            if s < 0:\n                j += 1\n            else:\n                k -= 1\n    return False\n' }),
      py({ prompt: 'Write `longest_path_dag(n, edges)`: vertices 0..n−1, directed acyclic edges (u, v, w). Return the maximum total weight of any path (0 if no edges). Hint: topological order + DP.', starter: 'def longest_path_dag(n, edges):\n    pass\n', tests: [eq('longest_path_dag(4, [(0, 1, 3), (1, 2, 4), (0, 2, 2), (2, 3, 1)])', '8'), eq('longest_path_dag(2, [])', '0')], solution: 'from collections import deque\n\ndef longest_path_dag(n, edges):\n    adj = [[] for _ in range(n)]\n    indeg = [0] * n\n    for u, v, w in edges:\n        adj[u].append((v, w))\n        indeg[v] += 1\n    q = deque(v for v in range(n) if indeg[v] == 0)\n    best = [0] * n\n    while q:\n        u = q.popleft()\n        for v, w in adj[u]:\n            best[v] = max(best[v], best[u] + w)\n            indeg[v] -= 1\n            if indeg[v] == 0:\n                q.append(v)\n    return max(best, default=0)\n' }),
    ],
  },
};

