/**
 * Practice Arena — standalone LeetCode-style problems, searchable by tag and difficulty.
 * Each problem is a CodeStep graded by hidden tests. Add more freely; ids must stay stable.
 */
import type { Problem } from './types';
import { eq, fast } from './lessons/_helpers';

export const PROBLEMS: Problem[] = [
  {
    id: 'add-two', title: 'Add Two Numbers', difficulty: 'intro', tags: ['functions', 'arithmetic'], track: 'python-1',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Write a function `add(a, b)` that **returns** the sum of `a` and `b`.\n\n```\nadd(2, 3)   → 5\nadd(-1, 1)  → 0\n```',
      starter: 'def add(a, b):\n    # your code here\n    pass\n',
      tests: [
        { name: 'add(2, 3) == 5', code: 'assert add(2, 3) == 5, f"got {add(2, 3)}"' },
        { name: 'add(-1, 1) == 0', code: 'assert add(-1, 1) == 0, f"got {add(-1, 1)}"' },
        { name: 'add(100, 250) == 350', code: 'assert add(100, 250) == 350' },
      ],
      hints: ['Use the return keyword: return a + b'],
      solution: 'def add(a, b):\n    return a + b\n',
    },
  },
  {
    id: 'is-even', title: 'Even or Odd', difficulty: 'intro', tags: ['modulo', 'booleans'], track: 'python-1',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Write `is_even(n)` that returns `True` if `n` is even and `False` otherwise.\n\n```\nis_even(4)  → True\nis_even(7)  → False\n```',
      starter: 'def is_even(n):\n    pass\n',
      tests: [
        { name: 'is_even(4) is True', code: 'assert is_even(4) is True' },
        { name: 'is_even(7) is False', code: 'assert is_even(7) is False' },
        { name: 'is_even(0) is True', code: 'assert is_even(0) is True' },
        { name: 'is_even(-3) is False', code: 'assert is_even(-3) is False' },
      ],
      hints: ['A number is even when n % 2 == 0', 'return n % 2 == 0'],
      solution: 'def is_even(n):\n    return n % 2 == 0\n',
    },
  },
  {
    id: 'fizzbuzz', title: 'FizzBuzz', difficulty: 'easy', tags: ['loops', 'modulo', 'conditionals', 'classic'], track: 'python-1',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Print the numbers 1 to 15, one per line, but:\n\n- for multiples of 3 print `Fizz`\n- for multiples of 5 print `Buzz`\n- for multiples of both print `FizzBuzz`',
      starter: 'for n in range(1, 16):\n    pass\n',
      expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz',
      hints: ['Check the "both" case (n % 15 == 0) first.', 'Use if / elif / elif / else.'],
      solution: 'for n in range(1, 16):\n    if n % 15 == 0:\n        print("FizzBuzz")\n    elif n % 3 == 0:\n        print("Fizz")\n    elif n % 5 == 0:\n        print("Buzz")\n    else:\n        print(n)\n',
    },
  },
  {
    id: 'largest', title: 'Find the Largest', difficulty: 'easy', tags: ['lists', 'loops', 'algorithm'], track: 'python-1',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Write `largest(nums)` that returns the biggest number in a non-empty list **without using `max()`**.\n\n```\nlargest([4, 9, 2, 7])  → 9\nlargest([-5, -2, -9])  → -2\n```',
      starter: 'def largest(nums):\n    pass\n',
      tests: [
        { name: 'largest([4, 9, 2, 7]) == 9', code: 'assert largest([4, 9, 2, 7]) == 9' },
        { name: 'largest([-5, -2, -9]) == -2', code: 'assert largest([-5, -2, -9]) == -2' },
        { name: 'largest([3]) == 3', code: 'assert largest([3]) == 3' },
        { name: 'does not call max()', code: 'assert "max(" not in __source__, "Solve it without max()"' },
      ],
      hints: ['Start with biggest = nums[0].', 'Loop: if n > biggest: biggest = n'],
      solution: 'def largest(nums):\n    biggest = nums[0]\n    for n in nums:\n        if n > biggest:\n            biggest = n\n    return biggest\n',
    },
  },
  {
    id: 'count-vowels', title: 'Count the Vowels', difficulty: 'easy', tags: ['strings', 'loops'], track: 'python-1',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Write `count_vowels(s)` that returns how many vowels (a, e, i, o, u — upper or lower case) are in `s`.\n\n```\ncount_vowels("Hello World")  → 3\n```',
      starter: 'def count_vowels(s):\n    pass\n',
      tests: [
        { name: '"Hello World" → 3', code: 'assert count_vowels("Hello World") == 3' },
        { name: '"AEIOU" → 5', code: 'assert count_vowels("AEIOU") == 5' },
        { name: '"rhythm" → 0', code: 'assert count_vowels("rhythm") == 0' },
      ],
      hints: ['Loop over each character.', 'Check: if ch.lower() in "aeiou"'],
      solution: 'def count_vowels(s):\n    return sum(1 for ch in s if ch.lower() in "aeiou")\n',
    },
  },
  {
    id: 'reverse-string-js', title: 'Reverse a String (JavaScript)', difficulty: 'easy', tags: ['strings', 'javascript'], track: 'javascript',
    step: {
      kind: 'code', language: 'javascript',
      prompt: 'Write a JavaScript function `reverse(s)` that returns the string backwards.\n\n```\nreverse("loop")  → "pool"\n```',
      starter: 'function reverse(s) {\n  // your code here\n}\n',
      tests: [
        { name: 'reverse("loop") === "pool"', code: 'assert(reverse("loop") === "pool", `got ${reverse("loop")}`)' },
        { name: 'reverse("") === ""', code: 'assert(reverse("") === "")' },
        { name: 'reverse("ab c") === "c ba"', code: 'assert(reverse("ab c") === "c ba")' },
      ],
      hints: ['s.split("") makes an array of characters.', 'Arrays have .reverse() and .join("")'],
      solution: 'function reverse(s) {\n  return s.split("").reverse().join("");\n}\n',
    },
  },
  {
    id: 'two-sum', title: 'Two Sum', difficulty: 'medium', tags: ['hash map', 'arrays', 'classic', 'interview'], track: 'data-structures',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Given a list `nums` and a `target`, return the **indexes** `[i, j]` (with `i < j`) of the two numbers that add up to `target`. Exactly one answer exists.\n\nTry for O(n) time using a dictionary.\n\n```\ntwo_sum([2, 7, 11, 15], 9)  → [0, 1]\ntwo_sum([3, 2, 4], 6)       → [1, 2]\n```',
      starter: 'def two_sum(nums, target):\n    pass\n',
      tests: [
        { name: '[2,7,11,15], 9 → [0,1]', code: 'assert two_sum([2, 7, 11, 15], 9) == [0, 1]' },
        { name: '[3,2,4], 6 → [1,2]', code: 'assert two_sum([3, 2, 4], 6) == [1, 2]' },
        { name: '[3,3], 6 → [0,1]', code: 'assert two_sum([3, 3], 6) == [0, 1]' },
        { name: 'large input runs fast', code: 'big = list(range(200000))\nassert two_sum(big, 399997) == [199998, 199999]' },
      ],
      hints: ['For each number, the partner you need is target - n.', 'Store numbers you have seen in a dict: value → index.'],
      solution: 'def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n',
    },
  },
  {
    id: 'sum-digits', title: 'Sum of Digits', difficulty: 'easy', tags: ['math', 'modulo', 'loops'], track: 'python-1',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Write `digit_sum(n)` that returns the sum of the digits of a non-negative integer.\n\n```\ndigit_sum(472)  → 13\ndigit_sum(0)    → 0\n```\n\nBonus: solve it with `%` and `//` instead of converting to a string.',
      starter: 'def digit_sum(n):\n    pass\n',
      tests: [eq('digit_sum(472)', '13'), eq('digit_sum(0)', '0'), eq('digit_sum(9999)', '36'), eq('digit_sum(1000)', '1')],
      hints: ['n % 10 is the last digit; n // 10 removes it.', 'Loop while n > 0, adding n % 10 to a total.'],
      solution: 'def digit_sum(n):\n    total = 0\n    while n > 0:\n        total += n % 10\n        n //= 10\n    return total\n',
    },
  },
  {
    id: 'reverse-words', title: 'Reverse the Words', difficulty: 'easy', tags: ['strings', 'lists'], track: 'python-1',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Write `reverse_words(sentence)` that returns the words in reverse order, separated by single spaces.\n\n```\nreverse_words("I love Python")  → "Python love I"\n```',
      starter: 'def reverse_words(sentence):\n    pass\n',
      tests: [eq('reverse_words("I love Python")', '"Python love I"'), eq('reverse_words("one")', '"one"'), eq('reverse_words("a b c d")', '"d c b a"')],
      hints: ['sentence.split() gives a list of words.', '" ".join(words[::-1])'],
      solution: 'def reverse_words(sentence):\n    return " ".join(sentence.split()[::-1])\n',
    },
  },
  {
    id: 'capitalize-words', title: 'Title Case', difficulty: 'easy', tags: ['strings', 'loops'], track: 'python-1',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Write `title_case(text)` that capitalizes the first letter of every word and makes the rest lowercase — **without** using `.title()` or `.capitalize()`.\n\n```\ntitle_case("hello WORLD")  → "Hello World"\n```',
      starter: 'def title_case(text):\n    pass\n',
      tests: [eq('title_case("hello WORLD")', '"Hello World"'), eq('title_case("pYTHON")', '"Python"'), eq('title_case("a b")', '"A B"'), { name: 'no .title() or .capitalize()', code: 'assert ".title(" not in __source__ and ".capitalize(" not in __source__' }],
      hints: ['For each word w: w[0].upper() + w[1:].lower()'],
      solution: 'def title_case(text):\n    return " ".join(w[0].upper() + w[1:].lower() for w in text.split())\n',
    },
  },
  {
    id: 'anagram', title: 'Anagram Check', difficulty: 'easy', tags: ['strings', 'sorting', 'hash map', 'interview'], track: 'python-1',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Two words are **anagrams** if they use exactly the same letters (like "listen" and "silent"). Write `is_anagram(a, b)` that returns True or False. Ignore upper/lower case.',
      starter: 'def is_anagram(a, b):\n    pass\n',
      tests: [eq('is_anagram("listen", "silent")', 'True'), eq('is_anagram("Dusty", "study")', 'True'), eq('is_anagram("apple", "papel")', 'True'), eq('is_anagram("rat", "car")', 'False'), eq('is_anagram("aab", "abb")', 'False')],
      hints: ['Sorted letters of anagrams are identical.', 'return sorted(a.lower()) == sorted(b.lower())'],
      solution: 'def is_anagram(a, b):\n    return sorted(a.lower()) == sorted(b.lower())\n',
    },
  },
  {
    id: 'dedupe', title: 'Remove Duplicates (Keep Order)', difficulty: 'easy', tags: ['lists', 'sets'], track: 'python-1',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Write `dedupe(items)` that returns a new list with duplicates removed, keeping the **first** occurrence of each item in its original order.\n\n```\ndedupe([3, 1, 3, 2, 1])  → [3, 1, 2]\n```',
      starter: 'def dedupe(items):\n    pass\n',
      tests: [eq('dedupe([3, 1, 3, 2, 1])', '[3, 1, 2]'), eq('dedupe([])', '[]'), eq('dedupe(["a", "a", "a"])', '["a"]')],
      hints: ['Keep a set of items you have already seen.', 'Loop; if the item is not in seen, append it and add it to seen.'],
      solution: 'def dedupe(items):\n    seen = set()\n    out = []\n    for x in items:\n        if x not in seen:\n            seen.add(x)\n            out.append(x)\n    return out\n',
    },
  },
  {
    id: 'second-largest', title: 'Second Largest', difficulty: 'easy', tags: ['lists', 'loops', 'interview'], track: 'python-1',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Write `second_largest(nums)` that returns the second-largest **distinct** value. The list always has at least two different values.\n\n```\nsecond_largest([4, 9, 2, 9, 7])  → 7\n```',
      starter: 'def second_largest(nums):\n    pass\n',
      tests: [eq('second_largest([4, 9, 2, 9, 7])', '7'), eq('second_largest([1, 2])', '1'), eq('second_largest([5, 5, 4])', '4'), eq('second_largest([-3, -1, -2])', '-2')],
      hints: ['Remove duplicates with set(), then sort.', 'sorted(set(nums))[-2]'],
      solution: 'def second_largest(nums):\n    return sorted(set(nums))[-2]\n',
    },
  },
  {
    id: 'running-sum', title: 'Running Sum', difficulty: 'easy', tags: ['lists', 'prefix sum'], track: 'python-1',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Write `running_sum(nums)` that returns a list where each position holds the total of all numbers up to and including that position.\n\n```\nrunning_sum([1, 2, 3, 4])  → [1, 3, 6, 10]\n```',
      starter: 'def running_sum(nums):\n    pass\n',
      tests: [eq('running_sum([1, 2, 3, 4])', '[1, 3, 6, 10]'), eq('running_sum([])', '[]'), eq('running_sum([5, -5, 5])', '[5, 0, 5]')],
      hints: ['Keep a total; after adding each number, append the total.'],
      solution: 'def running_sum(nums):\n    total = 0\n    out = []\n    for n in nums:\n        total += n\n        out.append(total)\n    return out\n',
    },
  },
  {
    id: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'medium', tags: ['stack', 'strings', 'classic', 'interview'], track: 'data-structures',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Write `is_valid(s)` for a string of brackets `()[]{}`. Return True if every opening bracket is closed by the same type, in the correct order.\n\n```\nis_valid("([]{})")  → True\nis_valid("(]")      → False\nis_valid("([)]")    → False\n```',
      starter: 'def is_valid(s):\n    pass\n',
      tests: [eq('is_valid("([]{})")', 'True'), eq('is_valid("(]")', 'False'), eq('is_valid("([)]")', 'False'), eq('is_valid("")', 'True'), eq('is_valid("((")', 'False'), eq('is_valid("))")', 'False')],
      hints: ['Use a list as a stack: push opening brackets.', 'On a closing bracket, the top of the stack must be the matching opener. At the end the stack must be empty.'],
      solution: 'def is_valid(s):\n    pairs = {")": "(", "]": "[", "}": "{"}\n    stack = []\n    for ch in s:\n        if ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n        else:\n            stack.append(ch)\n    return not stack\n',
    },
  },
  {
    id: 'binary-search', title: 'Binary Search', difficulty: 'medium', tags: ['binary search', 'algorithm', 'classic'], track: 'algorithms',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Write `search(nums, target)` that returns the index of `target` in the **sorted** list `nums`, or `-1` if it isn\'t there. It must be **O(log n)**: check the middle, then throw away half each time.',
      starter: 'def search(nums, target):\n    pass\n',
      tests: [
        eq('search([1, 3, 5, 7, 9], 7)', '3'), eq('search([1, 3, 5, 7, 9], 4)', '-1'), eq('search([], 1)', '-1'), eq('search([2], 2)', '0'),
        { name: 'fast on a big list (no .index or in)', code: 'big = list(range(0, 2000000, 2))\nimport time\nt = time.time()\nfor x in range(0, 4000, 7):\n    search(big, x)\nassert time.time() - t < 1.0, "Too slow — make sure you halve the range each step"\nassert search(big, 1999998) == 999999' },
      ],
      hints: ['Keep lo = 0 and hi = len(nums) - 1.', 'mid = (lo + hi) // 2; move lo or hi past mid depending on the comparison; stop when lo > hi.'],
      solution: 'def search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n',
    },
  },
  {
    id: 'merge-sorted', title: 'Merge Two Sorted Lists', difficulty: 'medium', tags: ['two pointers', 'sorting', 'classic'], track: 'algorithms',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Write `merge(a, b)` that merges two **sorted** lists into one sorted list in O(len(a) + len(b)) time — **without** calling `sort` or `sorted`.\n\n```\nmerge([1, 4, 7], [2, 3, 8])  → [1, 2, 3, 4, 7, 8]\n```',
      starter: 'def merge(a, b):\n    pass\n',
      tests: [eq('merge([1, 4, 7], [2, 3, 8])', '[1, 2, 3, 4, 7, 8]'), eq('merge([], [1])', '[1]'), eq('merge([1, 1], [1])', '[1, 1, 1]'), eq('merge([5], [])', '[5]'), { name: 'no sort()/sorted()', code: 'assert "sort" not in __source__, "Use two pointers instead of sorting"' }],
      hints: ['Keep an index i into a and j into b.', 'Repeatedly take the smaller front item; when one list runs out, add the rest of the other.'],
      solution: 'def merge(a, b):\n    i = j = 0\n    out = []\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            out.append(a[i])\n            i += 1\n        else:\n            out.append(b[j])\n            j += 1\n    return out + a[i:] + b[j:]\n',
    },
  },
  {
    id: 'fibonacci', title: 'Fibonacci Number', difficulty: 'easy', tags: ['loops', 'dynamic programming', 'classic'], track: 'python-1',
    step: {
      kind: 'code', language: 'python',
      prompt: 'The Fibonacci sequence starts 0, 1, and each next number is the sum of the previous two: 0, 1, 1, 2, 3, 5, 8, 13… Write `fib(n)` that returns the n-th number (`fib(0)` = 0, `fib(1)` = 1). It must handle `fib(90)` quickly.',
      starter: 'def fib(n):\n    pass\n',
      tests: [eq('fib(0)', '0'), eq('fib(1)', '1'), eq('fib(7)', '13'), eq('fib(90)', '2880067194370816120')],
      hints: ['Keep two variables a, b = 0, 1 and update them n times.', 'Each step: a, b = b, a + b'],
      solution: 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n',
    },
  },
  {
    id: 'sum-array-js', title: 'Sum an Array (JavaScript)', difficulty: 'intro', tags: ['arrays', 'loops', 'javascript'], track: 'javascript',
    step: {
      kind: 'code', language: 'javascript',
      prompt: 'Write a JavaScript function `sum(nums)` that returns the total of an array of numbers (0 for an empty array).',
      starter: 'function sum(nums) {\n  // your code here\n}\n',
      tests: [
        { name: 'sum([1, 2, 3]) === 6', code: 'assert(sum([1, 2, 3]) === 6, `got ${sum([1, 2, 3])}`)' },
        { name: 'sum([]) === 0', code: 'assert(sum([]) === 0, `got ${sum([])}`)' },
        { name: 'sum([-1, 1]) === 0', code: 'assert(sum([-1, 1]) === 0)' },
      ],
      hints: ['let total = 0; for (const n of nums) total += n; return total;'],
      solution: 'function sum(nums) {\n  let total = 0;\n  for (const n of nums) total += n;\n  return total;\n}\n',
    },
  },
  {
    id: 'merge-intervals', title: 'Merge Intervals', difficulty: 'medium', tags: ['sorting', 'intervals', 'interview'], track: 'algorithms',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Given a list of `[start, end]` intervals, merge all overlapping ones and return them sorted by start. Intervals that touch (end == next start) also merge.\n\n```\nmerge([[1, 3], [2, 6], [8, 10], [15, 18]])  → [[1, 6], [8, 10], [15, 18]]\n```',
      starter: 'def merge(intervals):\n    pass\n',
      tests: [eq('merge([[1, 3], [2, 6], [8, 10], [15, 18]])', '[[1, 6], [8, 10], [15, 18]]'), eq('merge([[1, 4], [4, 5]])', '[[1, 5]]'), eq('merge([])', '[]'), eq('merge([[5, 6], [1, 10]])', '[[1, 10]]')],
      hints: ['Sort by start.', 'If the next interval starts <= the last merged end, extend the end with max(); otherwise start a new interval.'],
      solution: 'def merge(intervals):\n    out = []\n    for s, e in sorted(intervals):\n        if out and s <= out[-1][1]:\n            out[-1][1] = max(out[-1][1], e)\n        else:\n            out.append([s, e])\n    return out\n',
    },
  },
  {
    id: 'product-except-self', title: 'Product Except Self', difficulty: 'medium', tags: ['prefix sum', 'arrays', 'interview'], track: 'algorithms',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Return a list where position i holds the product of every number **except** nums[i] — **without division**, in O(n).\n\n```\nproduct_except_self([1, 2, 3, 4])  → [24, 12, 8, 6]\n```',
      starter: 'def product_except_self(nums):\n    pass\n',
      tests: [eq('product_except_self([1, 2, 3, 4])', '[24, 12, 8, 6]'), eq('product_except_self([0, 4, 5])', '[20, 0, 0]'), eq('product_except_self([2, 3])', '[3, 2]'), { name: 'no division', code: 'assert "/" not in __source__' }, fast('big = [1] * 200000', 'product_except_self(big)', 1.5, 'O(n)')],
      hints: ['Pass 1 (left to right): out[i] = product of everything before i.', 'Pass 2 (right to left): multiply out[i] by the product of everything after i.'],
      solution: 'def product_except_self(nums):\n    n = len(nums)\n    out = [1] * n\n    left = 1\n    for i in range(n):\n        out[i] = left\n        left *= nums[i]\n    right = 1\n    for i in range(n - 1, -1, -1):\n        out[i] *= right\n        right *= nums[i]\n    return out\n',
    },
  },
  {
    id: 'top-k-frequent', title: 'Top K Frequent Elements', difficulty: 'medium', tags: ['hash map', 'heap', 'interview'], track: 'data-structures',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Return the k most frequent values, most frequent first (ties: smaller value first).\n\n```\ntop_k_frequent([1, 1, 1, 2, 2, 3], 2)  → [1, 2]\n```',
      starter: 'def top_k_frequent(nums, k):\n    pass\n',
      tests: [eq('top_k_frequent([1, 1, 1, 2, 2, 3], 2)', '[1, 2]'), eq('top_k_frequent([4, 4, 5, 5, 6], 2)', '[4, 5]'), eq('top_k_frequent([7], 1)', '[7]')],
      hints: ['Count with Counter.', 'sorted(counts, key=lambda v: (-counts[v], v))[:k]  — or heapq.nsmallest with the same key.'],
      solution: 'from collections import Counter\n\ndef top_k_frequent(nums, k):\n    counts = Counter(nums)\n    return sorted(counts, key=lambda v: (-counts[v], v))[:k]\n',
    },
  },
  {
    id: 'linked-list-cycle', title: 'Linked List Cycle', difficulty: 'easy', tags: ['linked list', 'two pointers', 'classic'], track: 'data-structures',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Return True if a linked list has a cycle (some node\'s `next` points back to an earlier node). Use O(1) extra memory: a **slow** pointer moves 1 step and a **fast** pointer 2 steps — if they ever meet, there\'s a cycle (Floyd\'s algorithm).',
      starter: 'class Node:\n    def __init__(self, value, next=None):\n        self.value = value\n        self.next = next\n\ndef has_cycle(head):\n    pass\n',
      tests: [
        { name: 'detects a cycle', code: 'a, b, c = Node(1), Node(2), Node(3)\na.next, b.next, c.next = b, c, a\nassert has_cycle(a) is True' },
        { name: 'no cycle', code: 'assert has_cycle(Node(1, Node(2, Node(3)))) is False and has_cycle(None) is False' },
        { name: 'O(1) memory (no sets)', code: 'assert "set(" not in __source__ and "{}" not in __source__' },
      ],
      hints: ['slow = fast = head', 'while fast and fast.next: slow = slow.next; fast = fast.next.next; if slow is fast: return True'],
      solution: 'class Node:\n    def __init__(self, value, next=None):\n        self.value = value\n        self.next = next\n\ndef has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow is fast:\n            return True\n    return False\n',
    },
  },
  {
    id: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'easy', tags: ['dynamic programming', 'classic'], track: 'algorithms',
    step: {
      kind: 'code', language: 'python',
      prompt: 'You can climb 1 or 2 steps at a time. How many distinct ways are there to climb `n` steps? Must handle n = 1000 instantly.',
      starter: 'def climb_stairs(n):\n    pass\n',
      tests: [eq('climb_stairs(1)', '1'), eq('climb_stairs(2)', '2'), eq('climb_stairs(5)', '8'), { name: 'n = 1000 instantly', code: 'r = climb_stairs(1000)\nassert len(str(r)) == 209' }],
      hints: ['ways(n) = ways(n-1) + ways(n-2). Keep just two variables in a loop.'],
      solution: 'def climb_stairs(n):\n    a, b = 1, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n',
    },
  },
  {
    id: 'coin-change', title: 'Coin Change', difficulty: 'medium', tags: ['dynamic programming', 'classic', 'interview'], track: 'algorithms',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Return the fewest coins needed to make `amount`, or -1 if it can\'t be done. Coins can be reused.\n\n```\ncoin_change([1, 2, 5], 11)  → 3   (5 + 5 + 1)\ncoin_change([2], 3)         → -1\n```',
      starter: 'def coin_change(coins, amount):\n    pass\n',
      tests: [eq('coin_change([1, 2, 5], 11)', '3'), eq('coin_change([2], 3)', '-1'), eq('coin_change([1], 0)', '0'), eq('coin_change([1, 3, 4], 6)', '2', 'greedy would say 3'), fast('', 'assert coin_change([3, 7, 405, 436], 8839) == 25', 2.0, 'amount 8,839 quickly')],
      hints: ['dp[a] = fewest coins for amount a; dp[0] = 0.', 'dp[a] = min(dp[a - c] + 1) over coins c <= a.'],
      solution: 'def coin_change(coins, amount):\n    INF = float("inf")\n    dp = [0] + [INF] * amount\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a and dp[a - c] + 1 < dp[a]:\n                dp[a] = dp[a - c] + 1\n    return dp[amount] if dp[amount] != INF else -1\n',
    },
  },
  {
    id: 'number-of-islands', title: 'Number of Islands', difficulty: 'medium', tags: ['bfs', 'dfs', 'graphs', 'grid', 'interview'], track: 'algorithms',
    step: {
      kind: 'code', language: 'python',
      prompt: '`grid` is a list of strings of `"1"` (land) and `"0"` (water). Count the islands (land connected horizontally/vertically).',
      starter: 'def num_islands(grid):\n    pass\n',
      tests: [eq('num_islands(["11110", "11010", "11000", "00000"])', '1'), eq('num_islands(["11000", "11000", "00100", "00011"])', '3'), eq('num_islands(["0"])', '0'), eq('num_islands(["10" * 50] * 100)', '50')],
      hints: ['For every unvisited land cell: count += 1, then flood-fill (stack or queue) to mark its whole island.'],
      solution: 'def num_islands(grid):\n    rows, cols = len(grid), len(grid[0])\n    seen = set()\n    count = 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == "1" and (r, c) not in seen:\n                count += 1\n                stack = [(r, c)]\n                seen.add((r, c))\n                while stack:\n                    y, x = stack.pop()\n                    for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):\n                        if 0 <= ny < rows and 0 <= nx < cols and grid[ny][nx] == "1" and (ny, nx) not in seen:\n                            seen.add((ny, nx))\n                            stack.append((ny, nx))\n    return count\n',
    },
  },
  {
    id: 'course-schedule', title: 'Course Schedule', difficulty: 'medium', tags: ['graphs', 'topological sort', 'interview'], track: 'algorithms',
    step: {
      kind: 'code', language: 'python',
      prompt: 'There are `n` courses (0..n−1). `prereqs` is a list of pairs `[a, b]` meaning "to take a, you must first take b". Return True if it\'s possible to finish every course (i.e. there\'s no cycle).',
      starter: 'def can_finish(n, prereqs):\n    pass\n',
      tests: [eq('can_finish(2, [[1, 0]])', 'True'), eq('can_finish(2, [[1, 0], [0, 1]])', 'False'), eq('can_finish(3, [])', 'True'), eq('can_finish(4, [[1, 0], [2, 1], [3, 2], [1, 3]])', 'False')],
      hints: ['Kahn\'s algorithm: count in-degrees (edge b → a), process courses with in-degree 0.', 'You can finish everything iff you process all n courses.'],
      solution: 'from collections import deque\n\ndef can_finish(n, prereqs):\n    adj = [[] for _ in range(n)]\n    indeg = [0] * n\n    for a, b in prereqs:\n        adj[b].append(a)\n        indeg[a] += 1\n    q = deque(i for i in range(n) if indeg[i] == 0)\n    done = 0\n    while q:\n        v = q.popleft()\n        done += 1\n        for w in adj[v]:\n            indeg[w] -= 1\n            if indeg[w] == 0:\n                q.append(w)\n    return done == n\n',
    },
  },
  {
    id: 'kth-largest', title: 'Kth Largest Element', difficulty: 'medium', tags: ['heap', 'quickselect', 'interview'], track: 'data-structures',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Return the k-th largest element of an unsorted list (k = 1 is the maximum) without fully sorting: keep a min-heap of size k.',
      starter: 'import heapq\n\ndef kth_largest(nums, k):\n    pass\n',
      tests: [eq('kth_largest([3, 2, 1, 5, 6, 4], 2)', '5'), eq('kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)', '4'), eq('kth_largest([1], 1)', '1'), { name: 'no full sort', code: 'assert "sort" not in __source__' }],
      hints: ['Push each number; if the heap has more than k items, pop the smallest. The answer is heap[0].'],
      solution: 'import heapq\n\ndef kth_largest(nums, k):\n    h = []\n    for x in nums:\n        heapq.heappush(h, x)\n        if len(h) > k:\n            heapq.heappop(h)\n    return h[0]\n',
    },
  },
  {
    id: 'rotate-matrix', title: 'Rotate Image', difficulty: 'medium', tags: ['matrix', 'arrays', 'interview'], track: 'data-structures',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Rotate an n × n matrix 90° **clockwise, in place**. Trick: transpose (swap m[i][j] and m[j][i]), then reverse each row.\n\n```\n[[1, 2],      [[3, 1],\n [3, 4]]  →    [4, 2]]\n```',
      starter: 'def rotate(m):\n    pass\n',
      tests: [{ name: '3 × 3', code: 'm = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nr = rotate(m)\nassert m == [[7, 4, 1], [8, 5, 2], [9, 6, 3]], m\nassert r is None, "rotate in place and return nothing"' }, { name: '1 × 1', code: 'm = [[5]]\nrotate(m)\nassert m == [[5]]' }],
      hints: ['for i in range(n): for j in range(i + 1, n): swap m[i][j], m[j][i]', 'Then for row in m: row.reverse()'],
      solution: 'def rotate(m):\n    n = len(m)\n    for i in range(n):\n        for j in range(i + 1, n):\n            m[i][j], m[j][i] = m[j][i], m[i][j]\n    for row in m:\n        row.reverse()\n',
    },
  },
  {
    id: 'longest-common-prefix', title: 'Longest Common Prefix', difficulty: 'easy', tags: ['strings'], track: 'python-1',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Return the longest prefix shared by every string in the list ("" if none).\n\n```\nlongest_prefix(["flower", "flow", "flight"])  → "fl"\n```',
      starter: 'def longest_prefix(words):\n    pass\n',
      tests: [eq('longest_prefix(["flower", "flow", "flight"])', '"fl"'), eq('longest_prefix(["dog", "car"])', '""'), eq('longest_prefix(["solo"])', '"solo"'), eq('longest_prefix([])', '""')],
      hints: ['Start with prefix = words[0]; while some word doesn\'t start with it, chop the last character.'],
      solution: 'def longest_prefix(words):\n    if not words:\n        return ""\n    prefix = words[0]\n    for w in words[1:]:\n        while not w.startswith(prefix):\n            prefix = prefix[:-1]\n    return prefix\n',
    },
  },
  {
    id: 'network-delay', title: 'Network Delay Time', difficulty: 'hard', tags: ['graphs', 'dijkstra', 'heap'], track: 'algorithms',
    step: {
      kind: 'code', language: 'python',
      prompt: 'A signal starts at node `k` in a network of nodes 1..n. `times` is a list of directed edges `(u, v, w)`: a signal takes w time to go from u to v. Return how long until **every** node has received it, or -1 if some never will.',
      starter: 'import heapq\n\ndef network_delay(times, n, k):\n    pass\n',
      tests: [eq('network_delay([(2, 1, 1), (2, 3, 1), (3, 4, 1)], 4, 2)', '2'), eq('network_delay([(1, 2, 1)], 2, 2)', '-1'), eq('network_delay([], 1, 1)', '0'), eq('network_delay([(1, 2, 5), (1, 3, 1), (3, 2, 1)], 3, 1)', '2')],
      hints: ['Dijkstra from k with a heap.', 'If fewer than n nodes were reached, return -1; otherwise the max distance.'],
      solution: 'import heapq\n\ndef network_delay(times, n, k):\n    adj = {}\n    for u, v, w in times:\n        adj.setdefault(u, []).append((v, w))\n    dist = {k: 0}\n    heap = [(0, k)]\n    while heap:\n        d, u = heapq.heappop(heap)\n        if d > dist[u]:\n            continue\n        for v, w in adj.get(u, []):\n            nd = d + w\n            if v not in dist or nd < dist[v]:\n                dist[v] = nd\n                heapq.heappush(heap, (nd, v))\n    return max(dist.values()) if len(dist) == n else -1\n',
    },
  },
  {
    id: 'edit-distance', title: 'Edit Distance', difficulty: 'hard', tags: ['dynamic programming', 'strings', 'classic'], track: 'algorithms',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Return the minimum number of single-character insertions, deletions or substitutions to turn `a` into `b`. Strings can be up to 500 characters — use an O(len(a) × len(b)) DP.',
      starter: 'def min_distance(a, b):\n    pass\n',
      tests: [eq('min_distance("horse", "ros")', '3'), eq('min_distance("intention", "execution")', '5'), eq('min_distance("", "")', '0'), fast('a = "ab" * 250\nb = "ba" * 250', 'assert min_distance(a, b) == 2', 3.0, '500 × 500 in time')],
      hints: ['dp[i][j] = distance between a[:i] and b[:j]; first row/column are 0..len.', 'Match → dp[i-1][j-1]; otherwise 1 + min of the three neighbors.'],
      solution: 'def min_distance(a, b):\n    prev = list(range(len(b) + 1))\n    for i in range(1, len(a) + 1):\n        cur = [i] + [0] * len(b)\n        for j in range(1, len(b) + 1):\n            if a[i - 1] == b[j - 1]:\n                cur[j] = prev[j - 1]\n            else:\n                cur[j] = 1 + min(prev[j], cur[j - 1], prev[j - 1])\n        prev = cur\n    return prev[-1]\n',
    },
  },
  {
    id: 'n-queens', title: 'N-Queens Count', difficulty: 'hard', tags: ['backtracking', 'recursion', 'classic'], track: 'algorithms',
    step: {
      kind: 'code', language: 'python',
      prompt: 'Return the number of ways to place n queens on an n × n board so none attack each other. Must handle n = 9 (352 solutions) quickly — prune with sets of used columns and diagonals.',
      starter: 'def total_n_queens(n):\n    pass\n',
      tests: [eq('total_n_queens(4)', '2'), eq('total_n_queens(1)', '1'), eq('total_n_queens(3)', '0'), fast('', 'assert total_n_queens(9) == 352', 3.0, 'n = 9 quickly')],
      hints: ['Place row by row; a cell (r, c) is attacked if c, r - c or r + c is already used.'],
      solution: 'def total_n_queens(n):\n    cols, d1, d2 = set(), set(), set()\n    def place(r):\n        if r == n:\n            return 1\n        total = 0\n        for c in range(n):\n            if c in cols or r - c in d1 or r + c in d2:\n                continue\n            cols.add(c); d1.add(r - c); d2.add(r + c)\n            total += place(r + 1)\n            cols.remove(c); d1.remove(r - c); d2.remove(r + c)\n        return total\n    return place(0)\n',
    },
  },
];

export const getProblem = (id: string) => PROBLEMS.find((p) => p.id === id);
