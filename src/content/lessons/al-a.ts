/**
 * Track: algorithms — "Algorithms"
 * Written here: al-1 (complexity), al-2 (searching & sorting), al-3 (patterns), al-4 (divide & conquer)
 * + checkpoints. Numbers double-checked in Python.
 */
import type { Checkpoint, Step } from '../types';
import { ans, eq, ex, fast, mc, ord, py } from './_helpers';

const RAND = 'import random\nrandom.seed(7)\n';
const sortTests = (fn: string) => [
  eq(`${fn}([5, 2, 9, 1, 5, 6])`, '[1, 2, 5, 5, 6, 9]'),
  eq(`${fn}([])`, '[]'),
  eq(`${fn}([1])`, '[1]'),
  eq(`${fn}([3, 2, 1])`, '[1, 2, 3]'),
  { name: 'random lists', code: `${RAND}for _ in range(50):\n    a = [random.randint(-50, 50) for _ in range(random.randint(0, 40))]\n    assert ${fn}(list(a)) == sorted(a), f"failed on {a}"` },
  { name: 'does not call sort()/sorted()', code: `assert "sorted(" not in __source__ and ".sort(" not in __source__` },
];

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ al-1-big-o
  'al-1-big-o': [
    ex('Measuring speed without a stopwatch', 'Timing code depends on the computer, the language and luck. Instead, we count **how the number of steps grows** as the input size n grows. That\'s **Big-O notation**.\n\nRules of thumb:\n\n- **Drop constants:** 3n and n are both **O(n)**\n- **Keep only the biggest term:** n² + 100n + 7 is **O(n²)**\n\nBecause for big n, only the fastest-growing part matters.'),
    ans('Simplify 4n² + 3n + 10 to Big-O. (type like O(n^2) or O(n²))', ['O(n^2)', 'O(n²)', 'n^2', 'n²', 'O(n**2)'], 'Drop the constant 4 and the smaller terms.'),
    ans('Simplify 5n + 2 log n to Big-O.', ['O(n)', 'n'], 'n grows faster than log n.'),
    ex('The common classes', '| Big-O | Name | Example | n = 1,000,000 |\n|---|---|---|---|\n| O(1) | constant | list index, dict lookup | 1 step |\n| O(log n) | logarithmic | binary search | ~20 |\n| O(n) | linear | one loop | 1,000,000 |\n| O(n log n) | linearithmic | good sorting | ~20,000,000 |\n| O(n²) | quadratic | nested loops | 10¹² (hours!) |\n| O(2ⁿ) | exponential | all subsets | impossible |'),
    ord('Order from fastest (best) to slowest.', ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], 'Constant, log, linear, n log n, quadratic, exponential.', 'text'),
    mc('Algorithm A is O(n) and B is O(n²). For small n, B is sometimes faster. Why?', ['Big-O is wrong', 'Big-O hides constant factors — it describes growth for large n', 'B uses less memory'], 1, '100n vs n²: B wins until n = 100. Big-O is about the long run.'),
    mc('A program takes 1 second for n = 1,000 and is O(n²). Roughly how long for n = 10,000?', ['10 seconds', '100 seconds', '2 seconds'], 1, '10× the input → 10² = 100× the time.'),
  ],

  // ------------------------------------------------------------------ al-1-analysis
  'al-1-analysis': [
    ex('Counting the work', '- One loop over n items → **O(n)**\n- A loop inside a loop, both over n → **O(n²)**\n- Two loops **one after another** → O(n) + O(n) = **O(n)**\n- A loop that **halves** (or doubles) each time → **O(log n)**\n- Calling an O(n) function inside an O(n) loop → **O(n²)** (watch for hidden costs like `in` on a list, `list.index`, slicing)'),
    mc('Time complexity?', ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], 0, 'One pass through the list.', 'total = 0\nfor x in nums:\n    total += x'),
    mc('Time complexity?', ['O(n)', 'O(n²)', 'O(n log n)'], 1, 'For each of n items, look at n items.', 'for a in nums:\n    for b in nums:\n        if a + b == 0:\n            print(a, b)'),
    mc('Time complexity?', ['O(n)', 'O(log n)', 'O(n²)'], 1, 'i doubles each time, so it reaches n after about log₂ n steps.', 'i = 1\nwhile i < n:\n    i *= 2'),
    mc('Time complexity? (nums and other both have about n items)', ['O(n)', 'O(n²)', 'O(1)'], 1, '`x in other` scans a list: O(n) inside an O(n) loop. Making `other` a set fixes it → O(n).', 'common = []\nfor x in nums:\n    if x in other:      # other is a list\n        common.append(x)'),
    mc('Time complexity?', ['O(n)', 'O(n²)', 'O(n log n)'], 1, 'The inner loop runs n−1, n−2, …, 0 times: n(n−1)/2 total — still O(n²).', 'for i in range(n):\n    for j in range(i + 1, n):\n        compare(i, j)'),
    py({
      prompt: '`has_pair_sum` is O(n²). Rewrite it in **O(n)** using a set: return True if any two **different** items add up to `target`.',
      starter: 'def has_pair_sum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return True\n    return False\n',
      tests: [eq('has_pair_sum([1, 4, 6, 9], 10)', 'True'), eq('has_pair_sum([5], 10)', 'False'), eq('has_pair_sum([5, 5], 10)', 'True'), eq('has_pair_sum([5, 1], 10)', 'False', "can't use the same 5 twice"), fast('big = list(range(0, 400000, 2))', 'assert has_pair_sum(big, 3) is False', 1.5, 'O(n) on 200,000 numbers')],
      hints: ['seen = set(); for x in nums: if target - x in seen: return True; seen.add(x)', 'Check BEFORE adding x, so x isn\'t paired with itself.'],
      solution: 'def has_pair_sum(nums, target):\n    seen = set()\n    for x in nums:\n        if target - x in seen:\n            return True\n        seen.add(x)\n    return False\n',
    }),
  ],

  // ------------------------------------------------------------------ al-1-space
  'al-1-space': [
    ex('Memory counts too', '**Space complexity** measures the **extra** memory an algorithm needs (not counting the input itself).\n\n- A few variables → **O(1)**\n- A new list/dict/set with n items → **O(n)**\n- Recursion n levels deep → **O(n)** for the call stack\n\nThere\'s often a **time–space trade-off**: the O(n) Two Sum uses O(n) extra memory to save time.'),
    mc('Extra space?', ['O(1)', 'O(n)'], 0, 'Only one extra variable, however long nums is.', 'best = nums[0]\nfor x in nums:\n    if x > best:\n        best = x'),
    mc('Extra space?', ['O(1)', 'O(n)'], 1, 'The new list grows with the input.', 'doubled = [x * 2 for x in nums]'),
    mc('Extra space of this recursive function, counting the call stack?', ['O(1)', 'O(n)', 'O(log n)'], 1, 'n frames pile up before any returns.', 'def total(n):\n    if n == 0:\n        return 0\n    return n + total(n - 1)'),
    ex('In-place algorithms', 'An **in-place** algorithm changes the input directly using O(1) extra space — like `list.reverse()` or `list.sort()`. `sorted(nums)` and `nums[::-1]` create new lists: O(n) space.'),
    py({
      prompt: 'Reverse a list **in place** with O(1) extra space: swap the first and last items, then move inward. Return nothing.',
      starter: 'def reverse_in_place(nums):\n    pass\n',
      tests: [{ name: 'reverses in place', code: 'a = [1, 2, 3, 4, 5]\nresult = reverse_in_place(a)\nassert a == [5, 4, 3, 2, 1] and result is None' }, { name: 'even length and empty', code: 'a = [1, 2]\nreverse_in_place(a)\nb = []\nreverse_in_place(b)\nassert a == [2, 1] and b == []' }, { name: 'no copying shortcuts', code: 'assert "[::-1]" not in __source__ and "reverse()" not in __source__ and "reversed(" not in __source__' }],
      hints: ['i, j = 0, len(nums) - 1; while i < j: swap nums[i], nums[j]; i += 1; j -= 1'],
      solution: 'def reverse_in_place(nums):\n    i, j = 0, len(nums) - 1\n    while i < j:\n        nums[i], nums[j] = nums[j], nums[i]\n        i += 1\n        j -= 1\n',
    }),
  ],

  // ------------------------------------------------------------------ al-1-omega-theta
  'al-1-omega-theta': [
    ex('Upper, lower and tight bounds', '- **O(f)** — grows **at most** like f (upper bound)\n- **Ω(f)** (Omega) — grows **at least** like f (lower bound)\n- **Θ(f)** (Theta) — grows **exactly** like f (both)\n\nIn conversation and interviews, people say "O" when they really mean Θ. In grad courses, the difference matters.'),
    ex('Best, worst and average case', 'One algorithm can behave differently on different inputs. **Linear search** for x in a list:\n\n- **best case:** x is first → Θ(1)\n- **worst case:** x is last or missing → Θ(n)\n- **average case:** about n/2 checks → Θ(n)\n\nUnless told otherwise, "the complexity" means the **worst case**.'),
    mc('Insertion sort on an already-sorted list takes…', ['Θ(n) — each item is already in place', 'Θ(n²)', 'Θ(log n)'], 0, 'It just checks each neighbor once. Its worst case (reverse order) is Θ(n²).'),
    mc('Is an O(n) algorithm also O(n²)?', ['Yes — O is just an upper bound, and n ≤ n²', 'No'], 0, 'True but unhelpful. That\'s why Θ is more precise.'),
    ex('A famous lower bound', 'Any sorting algorithm that only **compares** items needs **Ω(n log n)** comparisons in the worst case. (There are n! possible orderings, and each comparison at best halves them: log₂(n!) ≈ n log n.)\n\nSo merge sort\'s O(n log n) is **optimal** for comparison sorting.'),
    mc('Someone claims a comparison-based sort that\'s O(n) for every input. You should…', ['Believe it', 'Be skeptical — it would beat the proven Ω(n log n) lower bound', 'Assume they used Python'], 1, 'Linear-time sorts exist only with extra assumptions (like small integer keys — coming up in counting sort).'),
  ],

  // ------------------------------------------------------------------ al-2-binary-search
  'al-2-binary-search': [
    ex('Halve the problem', 'Looking for a word in a dictionary, you don\'t start at page 1. You open the middle and throw away half.\n\n**Binary search** on a **sorted** list: compare with the middle; if the target is smaller, search the left half, otherwise the right. **O(log n)**: a million items need ~20 checks.\n\n```python\ndef search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n```'),
    ans('Searching for 7 in [1, 3, 5, 7, 9, 11, 13]: what is the FIRST index checked? (mid = (0 + 6) // 2)', ['3'], 'mid = 3, and nums[3] = 7. Found in one step!'),
    mc('Binary search requires the list to be…', ['short', 'sorted', 'unique', 'numbers only'], 1, 'Sorted — otherwise throwing away half might throw away the answer.'),
    ex('Finding a boundary', 'A powerful variant finds the **first position where a condition becomes true** — like the first index with a value ≥ target (where you\'d insert it). Python has it built in: `bisect.bisect_left(nums, target)`.\n\nThe pattern: keep `lo` and `hi` so the answer is always in `[lo, hi]`, and shrink until they meet.'),
    py({
      prompt: 'Write `first_at_least(nums, target)`: for a sorted list, return the first index whose value is ≥ target (or `len(nums)` if none). O(log n), without `bisect`.',
      starter: 'def first_at_least(nums, target):\n    pass\n',
      tests: [eq('first_at_least([1, 3, 3, 5], 3)', '1'), eq('first_at_least([1, 3, 5], 4)', '2'), eq('first_at_least([1, 3, 5], 9)', '3'), eq('first_at_least([], 1)', '0'), { name: 'matches bisect_left on random data', code: 'import bisect, random\nrandom.seed(2)\nfor _ in range(300):\n    a = sorted(random.randint(0, 20) for _ in range(random.randint(0, 15)))\n    t = random.randint(-1, 21)\n    assert first_at_least(a, t) == bisect.bisect_left(a, t), (a, t)' }, { name: 'no bisect', code: 'assert "bisect" not in __source__' }],
      hints: ['lo, hi = 0, len(nums)  (hi is one past the end)', 'while lo < hi: mid = (lo + hi) // 2; if nums[mid] < target: lo = mid + 1 else: hi = mid. Return lo.'],
      solution: 'def first_at_least(nums, target):\n    lo, hi = 0, len(nums)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid\n    return lo\n',
    }),
    py({
      prompt: '**Binary search on the answer:** write `int_sqrt(n)` returning the largest integer r with r² ≤ n, for huge n — **without** `math.isqrt`, `**0.5` or floats.',
      starter: 'def int_sqrt(n):\n    pass\n',
      tests: [eq('int_sqrt(16)', '4'), eq('int_sqrt(17)', '4'), eq('int_sqrt(0)', '0'), eq('int_sqrt(10**40)', '10**20'), eq('int_sqrt(10**40 - 1)', '10**20 - 1'), { name: 'no shortcuts', code: 'assert "isqrt" not in __source__ and "0.5" not in __source__ and "sqrt" not in __source__.replace("int_sqrt", "")' }],
      hints: ['Search r in [0, n]. If mid * mid <= n, the answer is mid or bigger; otherwise smaller.', 'lo, hi = 0, n; while lo < hi: mid = (lo + hi + 1) // 2; if mid * mid <= n: lo = mid else: hi = mid - 1. Return lo.'],
      solution: 'def int_sqrt(n):\n    lo, hi = 0, n\n    while lo < hi:\n        mid = (lo + hi + 1) // 2\n        if mid * mid <= n:\n            lo = mid\n        else:\n            hi = mid - 1\n    return lo\n',
    }),
  ],

  // ------------------------------------------------------------------ al-2-simple-sorts
  'al-2-simple-sorts': [
    ex('Selection sort', 'Repeatedly **select** the smallest remaining item and swap it into place:\n\n```text\n[5, 2, 9, 1]  → swap 1 to front → [1, 2, 9, 5]\n[1 | 2, 9, 5] → 2 already there → [1, 2, 9, 5]\n[1, 2 | 9, 5] → swap 5 forward  → [1, 2, 5, 9]\n```\n\nAlways **O(n²)** comparisons, even if already sorted.'),
    ex('Insertion sort', 'Like sorting playing cards in your hand: take the next card and **slide it left** into its place among the sorted cards.\n\n```python\nfor i in range(1, len(a)):\n    x = a[i]\n    j = i - 1\n    while j >= 0 and a[j] > x:\n        a[j + 1] = a[j]   # shift right\n        j -= 1\n    a[j + 1] = x\n```\n\nO(n²) worst case, but **O(n) on nearly-sorted data** — real libraries use it for small or almost-sorted pieces.'),
    ans('Insertion sort on [3, 1, 2]: what does the list look like after processing index 1?', ['[1, 3, 2]'], '1 slides in front of 3.'),
    mc('Which sort is fastest on a list that\'s already almost sorted?', ['Selection sort', 'Insertion sort'], 1, 'Insertion sort barely shifts anything.'),
    ex('Stability', 'A sort is **stable** if equal items keep their original order. Sorting people by age with a stable sort keeps same-age people in their earlier (say, alphabetical) order.\n\nInsertion sort and merge sort are stable; selection sort and quicksort (usual versions) are not. Python\'s `sorted` is stable.'),
    py({ prompt: 'Implement **selection sort**: `selection_sort(a)` sorts the list in place and returns it.', starter: 'def selection_sort(a):\n    pass\n', tests: sortTests('selection_sort'), hints: ['for i in range(len(a)): find the index m of the smallest item in a[i:], then swap a[i] and a[m].'], solution: 'def selection_sort(a):\n    for i in range(len(a)):\n        m = i\n        for j in range(i + 1, len(a)):\n            if a[j] < a[m]:\n                m = j\n        a[i], a[m] = a[m], a[i]\n    return a\n' }),
    py({ prompt: 'Implement **insertion sort**: `insertion_sort(a)` sorts in place and returns the list.', starter: 'def insertion_sort(a):\n    pass\n', tests: sortTests('insertion_sort'), hints: ['Use the shifting loop from the lesson.'], solution: 'def insertion_sort(a):\n    for i in range(1, len(a)):\n        x = a[i]\n        j = i - 1\n        while j >= 0 and a[j] > x:\n            a[j + 1] = a[j]\n            j -= 1\n        a[j + 1] = x\n    return a\n' }),
  ],

  // ------------------------------------------------------------------ al-2-merge-sort
  'al-2-merge-sort': [
    ex('Divide, sort, merge', '**Merge sort**:\n\n1. Split the list in half\n2. Sort each half (recursively)\n3. **Merge** the two sorted halves (two pointers, like the Practice problem)\n\n```text\n[5, 2, 9, 1]\n[5, 2]      [9, 1]\n[5] [2]     [9] [1]\n[2, 5]      [1, 9]\n[1, 2, 5, 9]\n```'),
    ex('Why O(n log n)?', 'There are **log₂ n levels** of splitting, and merging all the pieces on one level costs **O(n)** in total. So: **n × log n**.\n\nMerge sort is O(n log n) in **every** case, and it\'s stable. The cost: O(n) extra memory for merging.'),
    ans('How many levels of halving until 16 items become single items?', ['4'], '16 → 8 → 4 → 2 → 1: log₂ 16 = 4.'),
    py({
      prompt: 'Implement **merge sort**: `merge_sort(a)` returns a **new** sorted list.',
      starter: 'def merge_sort(a):\n    pass\n',
      tests: [...sortTests('merge_sort'), fast(`${RAND}big = [random.random() for _ in range(50000)]`, 'r = merge_sort(big)\nassert all(r[i] <= r[i + 1] for i in range(len(r) - 1))', 3.0, 'O(n log n): 50,000 items quickly')],
      hints: ['if len(a) <= 1: return a[:]', 'Sort a[:mid] and a[mid:] recursively, then merge them with two indexes.'],
      solution: 'def merge_sort(a):\n    if len(a) <= 1:\n        return a[:]\n    mid = len(a) // 2\n    left = merge_sort(a[:mid])\n    right = merge_sort(a[mid:])\n    out = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            out.append(left[i])\n            i += 1\n        else:\n            out.append(right[j])\n            j += 1\n    return out + left[i:] + right[j:]\n',
    }),
    mc('In the merge step, using `<=` (not `<`) when the items are equal keeps merge sort…', ['faster', 'stable', 'in place'], 1, 'Taking from the left half first preserves the original order of equal items.'),
  ],

  // ------------------------------------------------------------------ al-2-quick-sort
  'al-2-quick-sort': [
    ex('Partition around a pivot', '**Quicksort**:\n\n1. Pick a **pivot**\n2. **Partition**: everything smaller goes left of it, everything bigger goes right\n3. Recursively sort the two sides\n\nThe pivot is then in its final place. No merge step needed — and it can sort **in place**.'),
    ex('Fast on average, risky in the worst case', '- **Average:** O(n log n), usually faster in practice than merge sort\n- **Worst:** O(n²) — if the pivot is always the smallest or largest (e.g. always picking the first item of an already-sorted list)\n\nFix: pick a **random** pivot. Then the worst case is astronomically unlikely.'),
    mc('Quicksort always picks the FIRST item as pivot. Which input makes it O(n²)?', ['A random list', 'An already sorted list', 'A list of distinct numbers'], 1, 'Each partition peels off just one item.'),
    py({
      prompt: 'Implement quicksort (it\'s fine to build new lists): `quick_sort(a)` → new sorted list. Use a **random** pivot and split into less / equal / greater.',
      starter: 'import random\n\ndef quick_sort(a):\n    pass\n',
      tests: [...sortTests('quick_sort'), fast('big = list(range(30000))', 'assert quick_sort(big) == big', 2.0, 'sorted input is still fast (random pivot)')],
      hints: ['if len(a) <= 1: return a[:]', 'p = random.choice(a); less = [x for x in a if x < p]; equal…; greater…', 'return quick_sort(less) + equal + quick_sort(greater)'],
      solution: 'import random\n\ndef quick_sort(a):\n    if len(a) <= 1:\n        return a[:]\n    p = random.choice(a)\n    less = [x for x in a if x < p]\n    equal = [x for x in a if x == p]\n    greater = [x for x in a if x > p]\n    return quick_sort(less) + equal + quick_sort(greater)\n',
    }),
    ex('Quickselect', 'Need just the **k-th smallest** item? Partition, then recurse into **only one side** — the side containing position k. Average **O(n)**, faster than sorting.'),
    py({
      prompt: 'Write `kth_smallest(a, k)` (k = 1 is the minimum) using quickselect with a random pivot. Don\'t sort.',
      starter: 'import random\n\ndef kth_smallest(a, k):\n    pass\n',
      tests: [eq('kth_smallest([7, 2, 9, 4, 1], 2)', '2'), eq('kth_smallest([5, 5, 5], 2)', '5'), { name: 'random data', code: `${RAND}for _ in range(100):\n    a = [random.randint(0, 30) for _ in range(random.randint(1, 30))]\n    k = random.randint(1, len(a))\n    assert kth_smallest(list(a), k) == sorted(a)[k - 1]` }, { name: 'no sorting', code: 'assert "sort" not in __source__' }],
      hints: ['Split into less/equal/greater around a random pivot.', 'If k <= len(less): recurse on less. Elif k <= len(less) + len(equal): return pivot. Else recurse on greater with k reduced.'],
      solution: 'import random\n\ndef kth_smallest(a, k):\n    p = random.choice(a)\n    less = [x for x in a if x < p]\n    equal = [x for x in a if x == p]\n    if k <= len(less):\n        return kth_smallest(less, k)\n    if k <= len(less) + len(equal):\n        return p\n    greater = [x for x in a if x > p]\n    return kth_smallest(greater, k - len(less) - len(equal))\n',
    }),
  ],

  // ------------------------------------------------------------------ al-2-linear-sorts
  'al-2-linear-sorts': [
    ex('Beating n log n (with a catch)', 'The Ω(n log n) limit only applies to sorts that **compare** items. If keys are small integers, you can **count** instead.\n\n**Counting sort** for values 0..k:\n\n1. Count how many times each value appears (an array of size k + 1)\n2. Write each value out that many times\n\n**O(n + k)** — linear when k isn\'t huge.'),
    mc('When is counting sort a bad idea?', ['Sorting 1 million test scores from 0–100', 'Sorting 10 numbers whose values range up to 1 billion', 'Sorting ages'], 1, 'k = 1 billion makes the count array enormous.'),
    ex('Radix sort', '**Radix sort** sorts numbers digit by digit, from the least significant digit to the most, using a **stable** sort (like counting sort) for each digit.\n\nFor n numbers with d digits: **O(d · n)**.\n\n```text\n[170, 45, 75, 90]\nby ones digit: [170, 90, 45, 75]\nby tens digit: [45, 170, 75, 90]\nby hundreds:   [45, 75, 90, 170]\n```'),
    ex('What Python actually uses', 'Python\'s `sorted` and `list.sort` use **Timsort**: a hybrid of merge sort and insertion sort that finds already-sorted "runs" in real data. O(n log n) worst case, O(n) on sorted input, and stable.\n\nIn real code, use `sorted` — but knowing how sorts work is what lets you reason about any algorithm.'),
    py({
      prompt: 'Implement **counting sort** for non-negative integers: `counting_sort(nums)` returns a new sorted list. No comparisons-based sorting allowed.',
      starter: 'def counting_sort(nums):\n    pass\n',
      tests: [eq('counting_sort([3, 0, 2, 3, 1])', '[0, 1, 2, 3, 3]'), eq('counting_sort([])', '[]'), fast(`${RAND}big = [random.randint(0, 100) for _ in range(300000)]`, 'r = counting_sort(big)\nassert r[0] == 0 and r[-1] == 100 and len(r) == 300000', 1.5, '300,000 small numbers in linear time'), { name: 'no sort()/sorted()', code: 'assert "sort" not in __source__.replace("counting_sort", "")' }],
      hints: ['counts = [0] * (max(nums) + 1) — careful with an empty list.', 'for value, c in enumerate(counts): out.extend([value] * c)'],
      solution: 'def counting_sort(nums):\n    if not nums:\n        return []\n    counts = [0] * (max(nums) + 1)\n    for x in nums:\n        counts[x] += 1\n    out = []\n    for value, c in enumerate(counts):\n        out.extend([value] * c)\n    return out\n',
    }),
    mc('Why must each digit pass of radix sort be STABLE?', ['To save memory', 'So the order from earlier (less significant) digits is kept for ties', 'It doesn\'t need to be'], 1, 'Otherwise sorting by tens would scramble the ones-digit order.'),
  ],

  // ------------------------------------------------------------------ al-3-two-pointers
  'al-3-two-pointers': [
    ex('Two pointers', 'Many array problems become O(n) with **two indexes** moving through the data:\n\n- **From both ends inward** — pair sums in a sorted array, palindromes, reversing\n- **Fast and slow** — removing duplicates in place, cycle detection, finding the middle\n\n```python\n# sorted nums: is there a pair adding to target?\ni, j = 0, len(nums) - 1\nwhile i < j:\n    s = nums[i] + nums[j]\n    if s == target: return True\n    if s < target: i += 1     # need bigger\n    else: j -= 1              # need smaller\n```'),
    mc('In the sorted pair-sum code, why move i forward when the sum is too small?', ['Random choice', 'Moving i right is the only way to make the sum bigger', 'To avoid an error'], 1, 'The list is sorted: nums[i+1] ≥ nums[i].'),
    py({
      prompt: 'Write `is_palindrome(s)` that ignores everything except letters and digits, and ignores case. `"A man, a plan, a canal: Panama"` → True. Use two pointers (no building a cleaned copy).',
      starter: 'def is_palindrome(s):\n    pass\n',
      tests: [eq('is_palindrome("A man, a plan, a canal: Panama")', 'True'), eq('is_palindrome("race a car")', 'False'), eq('is_palindrome("")', 'True'), eq('is_palindrome(".,")', 'True'), { name: 'two pointers, no reversed copy', code: 'assert "[::-1]" not in __source__ and "reversed(" not in __source__' }],
      hints: ['Skip characters where not ch.isalnum() by moving the pointer.', 'Compare s[i].lower() and s[j].lower(), then move both inward.'],
      solution: 'def is_palindrome(s):\n    i, j = 0, len(s) - 1\n    while i < j:\n        if not s[i].isalnum():\n            i += 1\n        elif not s[j].isalnum():\n            j -= 1\n        elif s[i].lower() != s[j].lower():\n            return False\n        else:\n            i += 1\n            j -= 1\n    return True\n',
    }),
    py({
      prompt: '**Remove duplicates in place** from a sorted list: rearrange it so the first k items are the unique values in order, and return k. Use a slow "write" pointer and a fast "read" pointer, O(1) extra space.',
      starter: 'def dedupe_sorted(nums):\n    pass\n',
      tests: [{ name: '[1, 1, 2, 3, 3] → k = 3', code: 'a = [1, 1, 2, 3, 3]\nk = dedupe_sorted(a)\nassert k == 3 and a[:k] == [1, 2, 3]' }, eq('dedupe_sorted([])', '0'), { name: 'no sets or new lists', code: 'assert "set(" not in __source__ and "[]" not in __source__' }],
      hints: ['if not nums: return 0; write = 1', 'for read in range(1, len(nums)): if nums[read] != nums[write - 1]: nums[write] = nums[read]; write += 1'],
      solution: 'def dedupe_sorted(nums):\n    if not nums:\n        return 0\n    write = 1\n    for read in range(1, len(nums)):\n        if nums[read] != nums[write - 1]:\n            nums[write] = nums[read]\n            write += 1\n    return write\n',
    }),
    py({
      prompt: '**Container with most water:** `heights[i]` is a wall height at position i. Pick two walls; water held = distance × the shorter wall. Return the maximum. O(n): start at both ends and always move the **shorter** wall inward.',
      starter: 'def max_water(heights):\n    pass\n',
      tests: [eq('max_water([1, 8, 6, 2, 5, 4, 8, 3, 7])', '49'), eq('max_water([1, 1])', '1'), fast(`${RAND}big = [random.randint(1, 10**4) for _ in range(300000)]`, 'max_water(big)', 1.5, 'O(n) on 300,000 walls')],
      hints: ['i, j = 0, len(h) - 1; best = 0', 'best = max(best, (j - i) * min(h[i], h[j])); then move the pointer at the shorter wall.'],
      solution: 'def max_water(heights):\n    i, j = 0, len(heights) - 1\n    best = 0\n    while i < j:\n        best = max(best, (j - i) * min(heights[i], heights[j]))\n        if heights[i] < heights[j]:\n            i += 1\n        else:\n            j -= 1\n    return best\n',
    }),
  ],

  // ------------------------------------------------------------------ al-3-sliding-window
  'al-3-sliding-window': [
    ex('A window that slides', 'For problems about **contiguous** pieces (subarrays, substrings), keep a **window** [left, right] and update it incrementally instead of recomputing from scratch.\n\nMax sum of any 3 consecutive numbers: compute the first window\'s sum, then for each step **add the new item and subtract the one that left**. O(n) instead of O(n·k).'),
    py({
      prompt: 'Write `max_window_sum(nums, k)` returning the largest sum of k consecutive items (assume len(nums) ≥ k ≥ 1). O(n).',
      starter: 'def max_window_sum(nums, k):\n    pass\n',
      tests: [eq('max_window_sum([2, 1, 5, 1, 3, 2], 3)', '9'), eq('max_window_sum([5], 1)', '5'), eq('max_window_sum([-1, -2, -3], 2)', '-3'), fast('big = list(range(300000))', 'assert max_window_sum(big, 1000) == sum(range(299000, 300000))', 1.5, 'O(n), not O(n·k)')],
      hints: ['window = sum(nums[:k]); best = window', 'for i in range(k, len(nums)): window += nums[i] - nums[i - k]; best = max(best, window)'],
      solution: 'def max_window_sum(nums, k):\n    window = sum(nums[:k])\n    best = window\n    for i in range(k, len(nums)):\n        window += nums[i] - nums[i - k]\n        best = max(best, window)\n    return best\n',
    }),
    ex('Windows that grow and shrink', 'Some windows change size: **expand right** to take in more; **shrink from the left** while the window breaks a rule.\n\nLongest substring without repeating characters: move `right` forward; if the new character is already in the window, move `left` past its previous position.'),
    ans('What is the length of the longest substring of "abcabcbb" with no repeated characters?', ['3'], '"abc" (several times). Any 4-character window repeats a letter.'),
    py({
      prompt: 'Write `longest_unique(s)`: the length of the longest substring without repeating characters. O(n) with a sliding window and a dict of last-seen positions.',
      starter: 'def longest_unique(s):\n    pass\n',
      tests: [eq('longest_unique("abcabcbb")', '3'), eq('longest_unique("bbbbb")', '1'), eq('longest_unique("pwwkew")', '3'), eq('longest_unique("")', '0'), eq('longest_unique("abba")', '2', 'left pointer must never move backwards'), fast('big = "abcdefghij" * 30000', 'assert longest_unique(big) == 10', 1.5, 'O(n) on 300,000 characters')],
      hints: ['last = {}; left = 0; best = 0', 'for right, ch in enumerate(s): if ch in last and last[ch] >= left: left = last[ch] + 1. Then last[ch] = right; best = max(best, right - left + 1)'],
      solution: 'def longest_unique(s):\n    last = {}\n    left = 0\n    best = 0\n    for right, ch in enumerate(s):\n        if ch in last and last[ch] >= left:\n            left = last[ch] + 1\n        last[ch] = right\n        best = max(best, right - left + 1)\n    return best\n',
    }),
    mc('Which problem suits a sliding window?', ['Sorting a list', 'Shortest contiguous subarray with sum ≥ 100 (positive numbers)', 'Finding a node in a tree'], 1, '"Contiguous" + "shortest/longest" is the classic sliding-window signal.'),
  ],

  // ------------------------------------------------------------------ al-3-prefix-sums
  'al-3-prefix-sums': [
    ex('Precompute running totals', 'A **prefix sum** array stores the total of everything before each position:\n\n```text\nnums:   [3, 1, 4, 1, 5]\nprefix: [0, 3, 4, 8, 9, 14]\n```\n\nThen the sum of nums[i:j] is just **prefix[j] − prefix[i]** — O(1) per query after O(n) setup.'),
    ans('Using prefix = [0, 3, 4, 8, 9, 14], what is the sum of nums[1:4]?', ['6'], 'prefix[4] − prefix[1] = 9 − 3 = 6 (that\'s 1 + 4 + 1).'),
    py({
      prompt: 'Build a `RangeSum` class: `__init__(nums)` precomputes prefix sums, and `query(i, j)` returns sum(nums[i:j]) in O(1).',
      starter: 'class RangeSum:\n    pass\n',
      tests: [{ name: 'queries', code: 'r = RangeSum([3, 1, 4, 1, 5])\nassert r.query(1, 4) == 6 and r.query(0, 5) == 14 and r.query(2, 2) == 0' }, fast('r = RangeSum(list(range(100000)))', 'for i in range(100000):\n    r.query(0, i)', 1.0, '100,000 queries quickly (O(1) each)')],
      hints: ['self.prefix = [0]; for x in nums: self.prefix.append(self.prefix[-1] + x)', 'query: return self.prefix[j] - self.prefix[i]'],
      solution: 'class RangeSum:\n    def __init__(self, nums):\n        self.prefix = [0]\n        for x in nums:\n            self.prefix.append(self.prefix[-1] + x)\n\n    def query(self, i, j):\n        return self.prefix[j] - self.prefix[i]\n',
    }),
    ex('Prefix sums + hash map', 'How many subarrays sum to exactly k? A subarray i..j sums to k when **prefix[j] − prefix[i] = k**, i.e. when we\'ve **seen prefix − k before**. Count prefix values in a dict as you go: **O(n)**, and it works with negative numbers (where sliding windows fail).'),
    py({
      prompt: 'Write `count_subarrays(nums, k)`: the number of contiguous subarrays summing to k. O(n).',
      starter: 'def count_subarrays(nums, k):\n    pass\n',
      tests: [eq('count_subarrays([1, 1, 1], 2)', '2'), eq('count_subarrays([1, 2, 3], 3)', '2'), eq('count_subarrays([1, -1, 0], 0)', '3'), eq('count_subarrays([], 0)', '0'), fast('big = [1] * 200000', 'count_subarrays(big, 1000)', 1.5, 'O(n)')],
      hints: ['seen = {0: 1}; total = 0; count = 0', 'for x in nums: total += x; count += seen.get(total - k, 0); seen[total] = seen.get(total, 0) + 1'],
      solution: 'def count_subarrays(nums, k):\n    seen = {0: 1}\n    total = 0\n    count = 0\n    for x in nums:\n        total += x\n        count += seen.get(total - k, 0)\n        seen[total] = seen.get(total, 0) + 1\n    return count\n',
    }),
  ],

  // ------------------------------------------------------------------ al-3-backtracking
  'al-3-backtracking': [
    ex('Try, undo, try again', '**Backtracking** builds a solution one choice at a time. If a choice leads to a dead end, **undo it** and try the next one. It\'s a depth-first search over all possibilities, **pruning** branches that can\'t work.\n\n```python\ndef backtrack(path, choices):\n    if complete(path):\n        record(path)\n        return\n    for c in choices:\n        if valid(c):\n            path.append(c)      # choose\n            backtrack(path, …)  # explore\n            path.pop()          # un-choose\n```'),
    py({
      prompt: 'Write `subsets(nums)` returning all subsets (as lists, items in their original order) using backtracking. Any order of subsets is fine.',
      starter: 'def subsets(nums):\n    pass\n',
      tests: [{ name: 'subsets of [1, 2, 3]', code: 'r = subsets([1, 2, 3])\nassert sorted(r) == sorted([[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]) and len(r) == 8' }, eq('subsets([])', '[[]]')],
      hints: ['def go(i, path): if i == len(nums): out.append(path[:]); return', 'Either skip nums[i] (go(i + 1, path)) or take it: path.append; go(i + 1, path); path.pop()'],
      solution: 'def subsets(nums):\n    out = []\n    path = []\n    def go(i):\n        if i == len(nums):\n            out.append(path[:])\n            return\n        go(i + 1)\n        path.append(nums[i])\n        go(i + 1)\n        path.pop()\n    go(0)\n    return out\n',
    }),
    py({
      prompt: 'Write `permutations(items)` returning all orderings (as lists). Don\'t use itertools.',
      starter: 'def permutations(items):\n    pass\n',
      tests: [{ name: 'permutations of [1, 2, 3]', code: 'r = permutations([1, 2, 3])\nassert sorted(r) == [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]' }, eq('len(permutations(list(range(6))))', '720'), eq('permutations([])', '[[]]'), { name: 'no itertools', code: 'assert "itertools" not in __source__' }],
      hints: ['Track which items are used. When path has len(items) items, record a copy.', 'Loop over items not yet used: choose, recurse, un-choose.'],
      solution: 'def permutations(items):\n    out = []\n    path = []\n    used = [False] * len(items)\n    def go():\n        if len(path) == len(items):\n            out.append(path[:])\n            return\n        for i, x in enumerate(items):\n            if not used[i]:\n                used[i] = True\n                path.append(x)\n                go()\n                path.pop()\n                used[i] = False\n    go()\n    return out\n',
    }),
    ex('N-Queens', 'Place n chess queens on an n × n board so no two attack each other (same row, column or diagonal). Place one queen per row; for each row try every column that isn\'t attacked; backtrack when stuck.\n\nTrack attacked columns and diagonals in sets: cells on one diagonal share **row − col**; on the other, **row + col**.'),
    py({
      prompt: 'Write `count_queens(n)` returning the number of ways to place n non-attacking queens. (n = 4 → 2, n = 8 → 92.)',
      starter: 'def count_queens(n):\n    pass\n',
      tests: [eq('count_queens(1)', '1'), eq('count_queens(2)', '0'), eq('count_queens(4)', '2'), eq('count_queens(6)', '4'), eq('count_queens(8)', '92')],
      hints: ['def place(row): if row == n: count += 1 (use a list or nonlocal)', 'For col in range(n): skip if col in cols or row - col in d1 or row + col in d2; otherwise add to the sets, recurse, remove.'],
      solution: 'def count_queens(n):\n    cols, d1, d2 = set(), set(), set()\n    count = 0\n    def place(row):\n        nonlocal count\n        if row == n:\n            count += 1\n            return\n        for c in range(n):\n            if c in cols or row - c in d1 or row + c in d2:\n                continue\n            cols.add(c); d1.add(row - c); d2.add(row + c)\n            place(row + 1)\n            cols.remove(c); d1.remove(row - c); d2.remove(row + c)\n    place(0)\n    return count\n',
    }),
  ],

  // ------------------------------------------------------------------ al-4-recurrences
  'al-4-recurrences': [
    ex('Running time of recursive algorithms', 'Recursive algorithms get **recurrences** for their running time (just like Discrete Math, Unit 7):\n\n- Binary search: **T(n) = T(n/2) + O(1)** → O(log n)\n- Merge sort: **T(n) = 2T(n/2) + O(n)** → O(n log n)\n- Linear recursion (sum of a list): **T(n) = T(n − 1) + O(1)** → O(n)'),
    ex('The recursion tree', 'Draw the calls as a tree and add up the work level by level. For merge sort:\n\n```text\nlevel 0:            n                → n\nlevel 1:      n/2       n/2          → n\nlevel 2:   n/4  n/4  n/4  n/4        → n\n   …                                    …\nlog₂ n levels × n work per level     = n log n\n```'),
    mc('T(n) = T(n/2) + 1 (binary search). How many levels does the recursion tree have?', ['n', 'log₂ n', 'n/2'], 1, 'Halving n until 1 takes log₂ n steps, and each level does O(1) work.'),
    mc('T(n) = T(n − 1) + n gives…', ['O(n)', 'O(n log n)', 'O(n²)'], 2, 'n + (n−1) + … + 1 = n(n+1)/2. (Selection sort has exactly this shape.)'),
    mc('T(n) = 2T(n − 1) + 1 gives…', ['O(n)', 'O(n²)', 'O(2ⁿ)'], 2, 'Each level doubles the calls: Tower of Hanoi, 2ⁿ − 1.'),
    py({
      prompt: 'Compute the recurrence exactly: write `merge_sort_work(n)` returning T(n) where T(1) = 0 and T(n) = 2·T(n/2) + n for n a power of two. Check: T(8) should be 24 = 8 · log₂ 8.',
      starter: 'def merge_sort_work(n):\n    pass\n',
      tests: [eq('merge_sort_work(1)', '0'), eq('merge_sort_work(8)', '24'), eq('merge_sort_work(1024)', '10240')],
      hints: ['if n == 1: return 0', 'return 2 * merge_sort_work(n // 2) + n'],
      solution: 'def merge_sort_work(n):\n    if n == 1:\n        return 0\n    return 2 * merge_sort_work(n // 2) + n\n',
    }),
  ],

  // ------------------------------------------------------------------ al-4-master-theorem
  'al-4-master-theorem': [
    ex('A shortcut for divide-and-conquer', 'For **T(n) = a·T(n/b) + f(n)** — a subproblems, each of size n/b, plus f(n) work to split and combine — compare f(n) with **n^(log_b a)**:\n\n1. f(n) is **smaller** (polynomially) → **T(n) = Θ(n^(log_b a))** — the leaves dominate\n2. f(n) is the **same** order → **T(n) = Θ(n^(log_b a) · log n)**\n3. f(n) is **bigger** (and well-behaved) → **T(n) = Θ(f(n))** — the top level dominates'),
    ex('Example', 'Merge sort: a = 2, b = 2, f(n) = n.\n\nn^(log₂ 2) = n¹ = n. Same as f(n) → **case 2** → Θ(n log n). ✓\n\nBinary search: a = 1, b = 2, f(n) = 1. n^(log₂ 1) = n⁰ = 1. Same → case 2 → Θ(log n). ✓'),
    mc('T(n) = 4T(n/2) + n. Which case and result?', ['Case 1: Θ(n²)', 'Case 2: Θ(n log n)', 'Case 3: Θ(n)'], 0, 'n^(log₂ 4) = n². f(n) = n is smaller → leaves dominate → Θ(n²).'),
    mc('T(n) = 2T(n/2) + n². Result?', ['Θ(n)', 'Θ(n log n)', 'Θ(n²)'], 2, 'n^(log₂ 2) = n, and f(n) = n² is bigger → case 3 → Θ(n²).'),
    mc('T(n) = 2T(n/2) + 1. Result?', ['Θ(log n)', 'Θ(n)', 'Θ(n log n)'], 1, 'n^(log₂ 2) = n beats f(n) = 1 → case 1 → Θ(n). (E.g. summing a tree.)'),
    mc('T(n) = 8T(n/2) + n² (naive divide-and-conquer matrix multiplication). Result?', ['Θ(n²)', 'Θ(n³)', 'Θ(n² log n)'], 1, 'log₂ 8 = 3, so n³ beats n² → Θ(n³).'),
    ans('For T(n) = 3T(n/2) + n, the answer is Θ(n^c) with c = log₂ 3. What is c rounded to 2 decimals?', ['1.58', '1.59'], 'log₂ 3 ≈ 1.585. This is Karatsuba multiplication — faster than the schoolbook n².'),
  ],

  // ------------------------------------------------------------------ al-4-examples
  'al-4-examples': [
    ex('Divide-and-conquer greatest hits', '- **Merge sort, quicksort** — sorting\n- **Karatsuba** — multiplies n-digit numbers with 3 half-size products instead of 4: Θ(n^1.585)\n- **Closest pair of points** — Θ(n log n) instead of checking all n² pairs\n- **Fast exponentiation** — xⁿ = (x^(n/2))², Θ(log n) multiplications\n- **Counting inversions** — how "unsorted" a list is, during merge sort'),
    py({
      prompt: 'Write `fast_power(x, n)` computing xⁿ for integer n ≥ 0 with O(log n) multiplications: xⁿ = (x^(n/2))² for even n, and x · x^(n−1) for odd n. Don\'t use `**` or `pow`.',
      starter: 'def fast_power(x, n):\n    pass\n',
      tests: [eq('fast_power(2, 10)', '1024'), eq('fast_power(3, 0)', '1'), eq('fast_power(7, 1)', '7'), eq('fast_power(2, 1000) == 2**1000', 'True'), { name: 'no ** or pow', code: 'import re\nassert "**" not in __source__ and not re.search(r"(?<![_a-z])pow\\(", __source__)' }],
      hints: ['if n == 0: return 1', 'half = fast_power(x, n // 2); if n % 2 == 0: return half * half else: return half * half * x'],
      solution: 'def fast_power(x, n):\n    if n == 0:\n        return 1\n    half = fast_power(x, n // 2)\n    if n % 2 == 0:\n        return half * half\n    return half * half * x\n',
    }),
    ex('Counting inversions', 'An **inversion** is a pair i < j with a[i] > a[j]. [2, 4, 1, 3, 5] has 3: (2,1), (4,1), (4,3).\n\nChecking all pairs is O(n²). During merge sort\'s merge step, when an item from the **right** half is placed before items still waiting in the **left** half, it forms an inversion with **each** of them — count them all at once. Total: O(n log n).'),
    ans('How many inversions does [3, 2, 1] have?', ['3'], '(3,2), (3,1), (2,1).'),
    py({
      prompt: 'Write `count_inversions(a)` in O(n log n) by modifying merge sort to return (sorted_list, count).',
      starter: 'def count_inversions(a):\n    pass\n',
      tests: [eq('count_inversions([2, 4, 1, 3, 5])', '3'), eq('count_inversions([1, 2, 3])', '0'), eq('count_inversions([3, 2, 1])', '3'), eq('count_inversions([])', '0'), fast('big = list(range(40000, 0, -1))', 'assert count_inversions(big) == 40000 * 39999 // 2', 3.0, 'O(n log n) on 40,000 items')],
      hints: ['Helper sort(arr) returns (sorted, inv). Split, recurse on both halves, then merge.', 'In the merge, when right[j] < left[i], add len(left) - i to the count.'],
      solution: 'def count_inversions(a):\n    def sort(arr):\n        if len(arr) <= 1:\n            return arr, 0\n        mid = len(arr) // 2\n        left, x = sort(arr[:mid])\n        right, y = sort(arr[mid:])\n        out = []\n        i = j = 0\n        inv = x + y\n        while i < len(left) and j < len(right):\n            if left[i] <= right[j]:\n                out.append(left[i])\n                i += 1\n            else:\n                out.append(right[j])\n                inv += len(left) - i\n                j += 1\n        return out + left[i:] + right[j:], inv\n    return sort(a)[1]\n',
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'al-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('Simplify 7n³ + n² + 100 to Big-O.', ['O(n^3)', 'O(n³)', 'n^3', 'n³', 'O(n**3)'], 'Keep the biggest term.'),
      mc('Two nested loops over n items:', ['O(n)', 'O(n²)', 'O(log n)'], 1, 'n × n.'),
      mc('A loop where i doubles until n:', ['O(n)', 'O(log n)', 'O(1)'], 1, 'log₂ n steps.'),
      mc('Worst case of linear search:', ['Θ(1)', 'Θ(n)', 'Θ(log n)'], 1, 'Check everything.'),
      mc('Comparison sorting has a lower bound of…', ['Ω(n)', 'Ω(n log n)', 'Ω(n²)'], 1, 'Ω(n log n).'),
      mc('Recursion n levels deep uses how much stack space?', ['O(1)', 'O(n)'], 1, 'One frame per level.'),
      py({ prompt: 'Rewrite `has_duplicate` to be O(n).', starter: 'def has_duplicate(nums):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] == nums[j]:\n                return True\n    return False\n', tests: [eq('has_duplicate([1, 2, 3])', 'False'), eq('has_duplicate([1, 2, 1])', 'True'), fast('big = list(range(300000))', 'assert has_duplicate(big) is False', 1.5, 'O(n)')], solution: 'def has_duplicate(nums):\n    seen = set()\n    for x in nums:\n        if x in seen:\n            return True\n        seen.add(x)\n    return False\n' }),
    ],
  },
  'al-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Binary search needs the data to be…', ['sorted', 'small', 'unique'], 0, 'Sorted.'),
      mc('Merge sort\'s time in every case:', ['O(n log n)', 'O(n²)', 'O(n)'], 0, 'Always n log n.'),
      mc('Quicksort\'s worst case:', ['O(n log n)', 'O(n²)', 'O(n)'], 1, 'Bad pivots.'),
      mc('Which sort is O(n) on nearly sorted input?', ['Selection', 'Insertion', 'Quick'], 1, 'Insertion.'),
      mc('Counting sort runs in…', ['O(n + k)', 'O(n log n)', 'O(n²)'], 0, 'k = range of values.'),
      mc('A stable sort keeps…', ['equal items in their original order', 'the list unchanged', 'memory constant'], 0, 'Stability.'),
      py({ prompt: 'Write `search(nums, target)`: binary search returning the index or -1.', starter: 'def search(nums, target):\n    pass\n', tests: [eq('search([1, 3, 5, 7], 5)', '2'), eq('search([1, 3, 5, 7], 4)', '-1'), eq('search([], 1)', '-1'), fast('big = list(range(10**6))', 'for t in range(0, 10**6, 100):\n    search(big, t)', 1.5, 'O(log n) per search')], solution: 'def search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n' }),
    ],
  },
  'al-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('"Longest contiguous substring with…" suggests…', ['sliding window', 'binary search', 'heap'], 0, 'Sliding window.'),
      mc('Pair sum in a SORTED array in O(n):', ['two pointers from both ends', 'nested loops', 'recursion'], 0, 'Two pointers.'),
      ans('prefix = [0, 2, 5, 9]. Sum of nums[1:3]?', ['7'], '9 − 2.'),
      mc('Backtracking means…', ['try a choice, explore, then undo it', 'sort first', 'always pick the greedy option'], 0, 'Choose, explore, un-choose.'),
      ans('How many subsets does a 4-item list have?', ['16'], '2⁴.'),
      py({ prompt: 'Write `max_avg_window(nums, k)` returning the max sum of k consecutive items in O(n).', starter: 'def max_avg_window(nums, k):\n    pass\n', tests: [eq('max_avg_window([1, 12, -5, -6, 50, 3], 4)', '51'), fast('big = [1] * 300000', 'max_avg_window(big, 5000)', 1.5, 'O(n)')], solution: 'def max_avg_window(nums, k):\n    w = sum(nums[:k])\n    best = w\n    for i in range(k, len(nums)):\n        w += nums[i] - nums[i - k]\n        best = max(best, w)\n    return best\n' }),
    ],
  },
  'al-4': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('T(n) = 2T(n/2) + n:', ['Θ(n)', 'Θ(n log n)', 'Θ(n²)'], 1, 'Merge sort.'),
      mc('T(n) = T(n/2) + 1:', ['Θ(log n)', 'Θ(n)', 'Θ(1)'], 0, 'Binary search.'),
      mc('T(n) = 4T(n/2) + n:', ['Θ(n²)', 'Θ(n log n)', 'Θ(n)'], 0, 'Case 1.'),
      mc('T(n) = T(n − 1) + 1:', ['Θ(n)', 'Θ(log n)', 'Θ(n²)'], 0, 'Linear.'),
      ans('Inversions in [4, 3, 2, 1]?', ['6'], 'Every pair: C(4, 2) = 6.'),
      py({ prompt: 'Write a divide-and-conquer `max_dc(nums)` that returns the maximum of a non-empty list by splitting in half recursively (no max() on the whole list).', starter: 'def max_dc(nums):\n    pass\n', tests: [eq('max_dc([3, 9, 2, 7])', '9'), eq('max_dc([5])', '5'), { name: 'no max(nums)', code: 'assert "max(nums)" not in __source__' }], solution: 'def max_dc(nums):\n    if len(nums) == 1:\n        return nums[0]\n    mid = len(nums) // 2\n    a = max_dc(nums[:mid])\n    b = max_dc(nums[mid:])\n    return a if a > b else b\n' }),
    ],
  },
};
