/**
 * Track: python-2 — "Python Intermediate"
 * Written here: py2-4 (recursion), py2-5 (testing & debugging), py2-6 (Pythonic code) + checkpoints + final exam
 */
import type { Checkpoint, Step } from '../types';
import { ans, eq, ex, fill, mc, ord, py } from './_helpers';

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ py2-4-intro
  'py2-4-intro': [
    ex('A function that calls itself', '**Recursion** solves a problem by solving a **smaller version of the same problem**.\n\nFactorial: `5! = 5 × 4 × 3 × 2 × 1`. Notice `5! = 5 × 4!`, and `4! = 4 × 3!`…\n\n```python\ndef factorial(n):\n    if n == 1:              # base case: stop here\n        return 1\n    return n * factorial(n - 1)   # recursive case\n```', 'Like Russian nesting dolls: open one, find a smaller one inside, until the tiniest doll.'),
    ex('Two required parts', '- **Base case** — a simple input you answer directly, with no more recursion\n- **Recursive case** — call yourself on a **smaller** input that moves toward the base case\n\nForget the base case (or don\'t shrink the input) and the calls never stop → `RecursionError`.'),
    ans('What does factorial(4) return?', ['24'], '4 × 3 × 2 × 1 = 24.'),
    mc('What\'s missing here?', ['Nothing', 'A base case — it never stops', 'A loop'], 1, 'Without a base case it calls itself forever (until Python gives up with RecursionError).', 'def countdown(n):\n    print(n)\n    countdown(n - 1)'),
    py({
      prompt: 'Write a **recursive** `countdown(n)` that prints n, n-1, … down to 1, then prints `Go!`. Then call `countdown(3)`.',
      expectedOutput: '3\n2\n1\nGo!',
      tests: [{ name: 'is recursive (no loops)', code: 'assert "for " not in __source__ and "while " not in __source__, "Use recursion instead of a loop"' }],
      hints: ['Base case: if n == 0: print("Go!") and return.', 'Otherwise print(n), then countdown(n - 1).'],
      solution: 'def countdown(n):\n    if n == 0:\n        print("Go!")\n        return\n    print(n)\n    countdown(n - 1)\n\ncountdown(3)\n',
    }),
    py({
      prompt: 'Write a recursive `sum_list(nums)` that returns the sum of a list. Base case: an empty list sums to 0. Recursive case: the first item plus the sum of the rest (`nums[1:]`).',
      starter: 'def sum_list(nums):\n    pass\n',
      tests: [eq('sum_list([1, 2, 3, 4])', '10'), eq('sum_list([])', '0'), eq('sum_list([7])', '7'), { name: 'recursive, no sum()/loops', code: 'assert "sum(" not in __source__.replace("sum_list(", "") and "for " not in __source__ and "while " not in __source__' }],
      hints: ['if not nums: return 0', 'return nums[0] + sum_list(nums[1:])'],
      solution: 'def sum_list(nums):\n    if not nums:\n        return 0\n    return nums[0] + sum_list(nums[1:])\n',
    }),
  ],

  // ------------------------------------------------------------------ py2-4-call-stack
  'py2-4-call-stack': [
    ex('The call stack', 'Each function call gets its own **stack frame** — a box holding its local variables. Frames pile up like plates:\n\n```text\nfactorial(3)  waits for factorial(2)\n  factorial(2)  waits for factorial(1)\n    factorial(1)  returns 1        ← base case, top of the stack\n  factorial(2)  returns 2 × 1 = 2\nfactorial(3)  returns 3 × 2 = 6\n```\n\nCalls go **down** to the base case, then answers come back **up**.'),
    mc('In factorial(3), which call finishes FIRST?', ['factorial(3)', 'factorial(2)', 'factorial(1)'], 2, 'The deepest call (the base case) returns first; the others are waiting on it.'),
    ans('What does this print? (one number per line — type them separated by spaces)', ['1 2 3', '1\n2\n3'], 'Each call recurses BEFORE printing, so the deepest call (n = 1) prints first.', 'def show(n):\n    if n == 0:\n        return\n    show(n - 1)\n    print(n)\n\nshow(3)'),
    ex('Stack overflow', 'Python allows about **1,000** frames by default. Go deeper and you get:\n\n```text\nRecursionError: maximum recursion depth exceeded\n```\n\nThat\'s why simple repetition over huge inputs is usually a **loop**, while recursion shines for naturally nested problems: trees, folders inside folders, divide-and-conquer algorithms.'),
    mc('Which problem is most naturally recursive?', ['Adding 1 to every number in a list', 'Listing every file inside a folder and all its sub-folders', 'Printing "hi" 10 times'], 1, 'Folders contain folders that contain folders… the structure itself is recursive.'),
    ans('How many times is f called in total by f(4), counting the first call?', ['5'], 'f(4) → f(3) → f(2) → f(1) → f(0) (base case): 5 calls.', 'def f(n):\n    if n == 0:\n        return 0\n    return 1 + f(n - 1)'),
  ],

  // ------------------------------------------------------------------ py2-4-patterns
  'py2-4-patterns': [
    ex('Pattern: shrink a string or list', 'Handle the **first** element, then recurse on **the rest**:\n\n```python\ndef reverse(s):\n    if s == "":\n        return ""\n    return reverse(s[1:]) + s[0]\n```\n\n`reverse("abc")` = `reverse("bc") + "a"` = `"cb" + "a"` = `"cba"`.'),
    py({
      prompt: 'Write a recursive `power(base, exp)` that returns base^exp for whole numbers exp ≥ 0, **without** using `**` or `pow`.',
      starter: 'def power(base, exp):\n    pass\n',
      tests: [eq('power(2, 10)', '1024'), eq('power(5, 0)', '1'), eq('power(3, 3)', '27'), { name: 'no ** or pow', code: 'assert "**" not in __source__ and "pow(" not in __source__' }],
      hints: ['Base case: exp == 0 → 1', 'Recursive case: base * power(base, exp - 1)'],
      solution: 'def power(base, exp):\n    if exp == 0:\n        return 1\n    return base * power(base, exp - 1)\n',
    }),
    ex('Pattern: tree-shaped calls', 'Some functions call themselves **more than once**. Fibonacci: each number is the sum of the two before it.\n\n```python\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n```\n\nBeautiful — but **slow**: fib(40) makes over 300 million calls, recomputing the same values again and again. In Algorithms you\'ll fix this with *memoization*.'),
    mc('Why is that recursive fib slow for big n?', ['Python is slow at addition', 'It recomputes the same smaller values many, many times', 'It uses too much memory for one call'], 1, 'fib(5) computes fib(3) twice, fib(2) three times… the work grows exponentially.'),
    py({
      prompt: 'Write `flatten(items)` that turns a nested list into a flat list, however deep it goes.\n\n```\nflatten([1, [2, [3, 4]], 5])  → [1, 2, 3, 4, 5]\n```',
      starter: 'def flatten(items):\n    pass\n',
      tests: [eq('flatten([1, [2, [3, 4]], 5])', '[1, 2, 3, 4, 5]'), eq('flatten([])', '[]'), eq('flatten([[[[7]]]])', '[7]'), eq('flatten([1, [], [2]])', '[1, 2]')],
      hints: ['Loop over items. If an item is a list (isinstance(x, list)), extend the result with flatten(x); otherwise append x.'],
      solution: 'def flatten(items):\n    out = []\n    for x in items:\n        if isinstance(x, list):\n            out.extend(flatten(x))\n        else:\n            out.append(x)\n    return out\n',
    }),
    py({
      prompt: 'Write a recursive `is_palindrome(s)`: a string is a palindrome if its first and last characters match **and** the middle is a palindrome. Strings of length 0 or 1 are palindromes.',
      starter: 'def is_palindrome(s):\n    pass\n',
      tests: [eq('is_palindrome("racecar")', 'True'), eq('is_palindrome("abca")', 'False'), eq('is_palindrome("")', 'True'), eq('is_palindrome("aa")', 'True'), { name: 'recursive (no [::-1])', code: 'assert "[::-1]" not in __source__ and "reversed(" not in __source__' }],
      hints: ['if len(s) <= 1: return True', 'return s[0] == s[-1] and is_palindrome(s[1:-1])'],
      solution: 'def is_palindrome(s):\n    if len(s) <= 1:\n        return True\n    return s[0] == s[-1] and is_palindrome(s[1:-1])\n',
    }),
  ],

  // ------------------------------------------------------------------ py2-5-assert
  'py2-5-assert': [
    ex('Prove it works', '"It worked when I tried it once" isn\'t enough. **Tests** check that code gives the right answers — automatically, every time you change something.\n\nThe simplest test is `assert`: it does nothing if the condition is True, and raises `AssertionError` if it\'s False.\n\n```python\nassert add(2, 3) == 5\nassert add(-1, 1) == 0, "negatives should work"\n```'),
    ex('Choosing test cases', 'Good tests cover:\n\n- **Normal cases** — typical inputs\n- **Edge cases** — empty lists, 0, one item, the biggest/smallest values\n- **Error cases** — bad input should raise the right exception\n\nMost bugs hide at the edges.', 'Loopwise\'s hidden tests work exactly like this!'),
    mc('Which is an EDGE case for a function that averages a list?', ['[1, 2, 3]', '[10, 20]', '[] (an empty list)', '[5, 5, 5]'], 2, 'Empty input is the classic edge case — dividing by len([]) = 0 crashes.'),
    mc('What happens when `assert 2 + 2 == 5` runs?', ['Nothing', 'It prints False', 'AssertionError is raised', 'Python fixes the math'], 2, 'A false assert raises AssertionError.'),
    py({
      prompt: 'This `average` function has a bug on empty lists. Fix it so `average([])` returns `0` (and normal lists still work). The asserts at the bottom must all pass.',
      starter: 'def average(nums):\n    return sum(nums) / len(nums)\n\nassert average([2, 4]) == 3\nassert average([5]) == 5\nassert average([]) == 0\nprint("all tests passed")\n',
      expectedOutput: 'all tests passed',
      tests: [{ name: 'keeps the asserts', code: 'assert __source__.count("assert average") >= 3, "Don\'t delete the asserts — fix the function"' }],
      hints: ['Check for an empty list first: if not nums: return 0'],
      solution: 'def average(nums):\n    if not nums:\n        return 0\n    return sum(nums) / len(nums)\n\nassert average([2, 4]) == 3\nassert average([5]) == 5\nassert average([]) == 0\nprint("all tests passed")\n',
    }),
  ],

  // ------------------------------------------------------------------ py2-5-unittest
  'py2-5-unittest': [
    ex('Test files and pytest', 'Real projects keep tests in separate files like `test_math.py`. The most popular tool, **pytest**, finds every function whose name starts with `test_` and runs it:\n\n```python\n# test_cart.py\nfrom cart import total\n\ndef test_empty_cart():\n    assert total([]) == 0\n\ndef test_two_items():\n    assert total([3, 4]) == 7\n```\n\nRun `pytest` in the terminal and it reports which tests pass and fail. (Python also has a built-in `unittest` module that works the same way with classes.)'),
    mc('Which function will pytest run as a test?', ['check_total()', 'test_total()', 'total_test()', 'run()'], 1, 'pytest looks for names starting with test_.'),
    ex('Tests that catch bugs', 'A test suite is only useful if it **fails when the code is wrong**. A great habit: before trusting a test, imagine a buggy version of the function — would your tests notice?\n\n**Test-driven development (TDD)** goes further: write the failing test first, then write code until it passes.'),
    py({
      prompt: 'Leap years: divisible by 4, **except** years divisible by 100, **unless** also divisible by 400 (so 2000 was a leap year, 1900 wasn\'t).\n\nWrite **at least three** test functions (`test_...`) for `is_leap(year)` using `assert`. Your tests must **pass** on the correct version below and **catch** the common bug of only checking `year % 4 == 0`.',
      starter: 'def is_leap(year):\n    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)\n\n# write your test_ functions below\n',
      tests: [
        { name: 'at least 3 test functions', code: 'assert len([k for k in dir() if k.startswith("test_") and callable(eval(k))]) >= 3, "Write at least three functions named test_..."' },
        { name: 'all your tests pass on the correct is_leap', code: '__tests = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]\nfor __t in __tests:\n    __t()' },
        { name: 'your tests catch the "% 4 only" bug', code: '__tests = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]\n__g = __tests[0].__globals__\n__real = __g["is_leap"]\n__g["is_leap"] = lambda y: y % 4 == 0\n__caught = False\ntry:\n    for __t in __tests:\n        try:\n            __t()\n        except AssertionError:\n            __caught = True\nfinally:\n    __g["is_leap"] = __real\nassert __caught, "None of your tests failed on the buggy version — add a test for a year like 1900"' },
      ],
      hints: ['def test_normal_leap(): assert is_leap(2024)', 'def test_century(): assert not is_leap(1900)', 'def test_400(): assert is_leap(2000)'],
      solution: 'def is_leap(year):\n    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)\n\ndef test_normal_leap():\n    assert is_leap(2024)\n\ndef test_normal_year():\n    assert not is_leap(2023)\n\ndef test_century():\n    assert not is_leap(1900)\n\ndef test_400():\n    assert is_leap(2000)\n',
    }),
    mc('In TDD, what do you write first?', ['The code', 'A failing test', 'The documentation'], 1, 'Red (failing test) → green (make it pass) → refactor.'),
  ],

  // ------------------------------------------------------------------ py2-5-debugging
  'py2-5-debugging': [
    ex('A debugging toolkit', '- **Read the traceback** bottom-up: error type, message, then the line\n- **Reproduce** with the smallest input that fails\n- **Print debugging**: `print(f"{i=} {total=}")` shows names and values\n- **Rubber duck**: explain the code line by line out loud — you\'ll often spot the bug mid-sentence\n- **Bisect**: comment out half the code to find which half is broken\n- **Check assumptions**: is that variable really a number? (`print(type(x))`)'),
    ans('What does this print?', ['x=5'], 'An f-string with = prints the expression and its value — handy for debugging.', 'x = 5\nprint(f"{x=}")'),
    ex('Off-by-one errors', 'The most common bug in programming: a loop that runs **one time too many or too few**.\n\n```python\nfor i in range(1, 10):   # meant 1 to 10? This stops at 9!\n```\n\nAlways test the first and last values.'),
    py({
      prompt: '`sum_to(n)` should return 1 + 2 + … + n, but it has an **off-by-one** bug. Find and fix it.',
      starter: 'def sum_to(n):\n    total = 0\n    for i in range(1, n):\n        total += i\n    return total\n',
      tests: [eq('sum_to(3)', '6'), eq('sum_to(1)', '1'), eq('sum_to(100)', '5050')],
      hints: ['Try sum_to(3) by hand: range(1, 3) is 1, 2 — where\'s the 3?', 'range(1, n + 1)'],
      solution: 'def sum_to(n):\n    total = 0\n    for i in range(1, n + 1):\n        total += i\n    return total\n',
    }),
    py({
      prompt: '`count_words` should count how many times each word appears, but every count comes out as 1. Fix the bug.',
      starter: 'def count_words(words):\n    counts = {}\n    for w in words:\n        counts[w] = 1\n    return counts\n',
      tests: [eq('count_words(["a", "b", "a"])', '{"a": 2, "b": 1}'), eq('count_words([])', '{}')],
      hints: ['Each time we see a word we should ADD 1 to its existing count.', 'counts[w] = counts.get(w, 0) + 1'],
      solution: 'def count_words(words):\n    counts = {}\n    for w in words:\n        counts[w] = counts.get(w, 0) + 1\n    return counts\n',
    }),
    py({
      prompt: '`add_item` is supposed to give each call a fresh list unless one is passed in — but items "leak" between calls. This is a famous Python gotcha: **mutable default arguments** are created once and shared. Fix it by defaulting to `None`.',
      starter: 'def add_item(item, items=[]):\n    items.append(item)\n    return items\n',
      tests: [{ name: 'calls don\'t share a list', code: 'a = add_item("x")\nb = add_item("y")\nassert a == ["x"] and b == ["y"], f"got {a} and {b}"' }, eq('add_item(3, [1, 2])', '[1, 2, 3]')],
      hints: ['def add_item(item, items=None):', 'if items is None: items = []'],
      solution: 'def add_item(item, items=None):\n    if items is None:\n        items = []\n    items.append(item)\n    return items\n',
    }),
  ],

  // ------------------------------------------------------------------ py2-6-lambdas
  'py2-6-lambdas': [
    ex('Tiny anonymous functions', 'A **lambda** is a one-expression function without a name:\n\n```python\ndouble = lambda x: x * 2\nprint(double(5))   # 10\n```\n\nThey\'re mostly used as **arguments** to other functions — especially as a `key` for sorting.'),
    ex('Sorting with key', '`sorted` and `max`/`min` accept a `key` function that says **what to compare**:\n\n```python\nwords = ["kiwi", "fig", "banana"]\nsorted(words, key=len)                  # [\'fig\', \'kiwi\', \'banana\']\nsorted(words, key=len, reverse=True)    # longest first\n\npeople = [("Ada", 36), ("Bo", 25)]\nsorted(people, key=lambda p: p[1])      # by age\nmax(people, key=lambda p: p[1])         # oldest: (\'Ada\', 36)\n```'),
    ans('What does this print?', ["['fig', 'kiwi', 'banana']"], 'Sorted by length: 3, 4, 6.', 'print(sorted(["kiwi", "fig", "banana"], key=len))'),
    ex('map and filter', '```python\nnums = [1, 2, 3, 4]\nlist(map(lambda n: n * 10, nums))         # [10, 20, 30, 40]\nlist(filter(lambda n: n % 2 == 0, nums))  # [2, 4]\n```\n\nThey return lazy iterators, so wrap them in `list()` to see the results. Comprehensions usually read better — but you\'ll see map/filter in other people\'s code and in JavaScript.'),
    ans('What does this print?', ['[1, 3]'], 'filter keeps the odd numbers.', 'print(list(filter(lambda n: n % 2 == 1, [1, 2, 3, 4])))'),
    py({
      prompt: 'Write `sort_by_price(items)` that takes a list of `(name, price)` tuples and returns them sorted from **cheapest to most expensive**.',
      starter: 'def sort_by_price(items):\n    pass\n',
      tests: [eq('sort_by_price([("tea", 3), ("cake", 5), ("gum", 1)])', '[("gum", 1), ("tea", 3), ("cake", 5)]'), eq('sort_by_price([])', '[]')],
      hints: ['sorted(items, key=lambda item: item[1])'],
      solution: 'def sort_by_price(items):\n    return sorted(items, key=lambda item: item[1])\n',
    }),
    py({
      prompt: 'Write `longest_word(words)` that returns the longest word using `max` with a `key`. (If there\'s a tie, `max` returns the first one — that\'s fine.)',
      starter: 'def longest_word(words):\n    pass\n',
      tests: [eq('longest_word(["a", "abc", "ab"])', '"abc"'), eq('longest_word(["hi", "yo"])', '"hi"'), { name: 'uses max with key', code: 'assert "max(" in __source__ and "key=" in __source__' }],
      hints: ['return max(words, key=len)'],
      solution: 'def longest_word(words):\n    return max(words, key=len)\n',
    }),
  ],

  // ------------------------------------------------------------------ py2-6-generators
  'py2-6-generators': [
    ex('Iterators', 'Anything you can loop over is **iterable**. Under the hood, `for` asks for one item at a time with `next()`:\n\n```python\nit = iter([10, 20])\nprint(next(it))   # 10\nprint(next(it))   # 20\nnext(it)          # StopIteration — no more items\n```'),
    ex('Generators with yield', 'A **generator** function uses `yield` to produce values **one at a time**, pausing between them:\n\n```python\ndef count_up(limit):\n    n = 1\n    while n <= limit:\n        yield n\n        n += 1\n\nfor x in count_up(3):\n    print(x)        # 1, 2, 3\n```\n\nIt never builds the whole list in memory — great for huge or even **infinite** sequences.'),
    ans('What does this print?', ['[1, 4, 9]'], 'The generator yields 1², 2², 3².', 'def squares(n):\n    for i in range(1, n + 1):\n        yield i * i\n\nprint(list(squares(3)))'),
    mc('What\'s the main advantage of a generator over returning a list?', ['It\'s always faster', 'It produces values one at a time, so it uses very little memory', 'It can only be used once'], 1, 'A generator can describe a billion values while holding just one at a time.'),
    ex('Generator expressions', 'Like a list comprehension, but with **parentheses** — lazy instead of building a list:\n\n```python\ntotal = sum(n * n for n in range(1_000_000))\n```\n\nNo million-item list is ever created.'),
    py({
      prompt: 'Write a generator `evens()` that yields 0, 2, 4, 6, … **forever**. (The test takes just the first few values — that\'s the point!)',
      starter: 'def evens():\n    pass\n',
      tests: [{ name: 'first five values', code: 'g = evens()\nassert [next(g) for _ in range(5)] == [0, 2, 4, 6, 8]' }, { name: 'uses yield', code: 'assert "yield" in __source__' }],
      hints: ['n = 0; while True: yield n; n += 2'],
      solution: 'def evens():\n    n = 0\n    while True:\n        yield n\n        n += 2\n',
    }),
    py({
      prompt: 'Write a generator `fib_gen()` that yields the Fibonacci numbers 0, 1, 1, 2, 3, 5, … forever.',
      starter: 'def fib_gen():\n    pass\n',
      tests: [{ name: 'first ten values', code: 'g = fib_gen()\nassert [next(g) for _ in range(10)] == [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]' }],
      hints: ['a, b = 0, 1; while True: yield a; a, b = b, a + b'],
      solution: 'def fib_gen():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n',
    }),
  ],

  // ------------------------------------------------------------------ py2-6-comprehensions
  'py2-6-comprehensions': [
    ex('Dict and set comprehensions', 'The comprehension idea works for dicts and sets too:\n\n```python\nwords = ["hi", "hello", "hey"]\n{w: len(w) for w in words}    # {\'hi\': 2, \'hello\': 5, \'hey\': 3}\n{len(w) for w in words}       # {2, 3, 5}  (a set — duplicates removed)\n```'),
    ans('What does this print?', ["{1: 1, 2: 4, 3: 9}"], 'Each key maps to its square.', 'print({n: n * n for n in [1, 2, 3]})'),
    ex('zip', '`zip` walks through several lists **side by side**:\n\n```python\nnames = ["Ada", "Bo"]\nscores = [95, 80]\nfor name, score in zip(names, scores):\n    print(name, score)\n\ndict(zip(names, scores))   # {\'Ada\': 95, \'Bo\': 80}\n```'),
    ex('Nested comprehensions', 'Two `for`s flatten a grid, in the same order as nested loops:\n\n```python\ngrid = [[1, 2], [3, 4]]\n[x for row in grid for x in row]   # [1, 2, 3, 4]\n```', 'If a comprehension needs more than two for/if parts, a regular loop is usually clearer.'),
    py({
      prompt: 'Write `index_by_name(names, ages)` that returns a dict mapping each name to its age, using `zip` and a dict comprehension (or `dict(zip(...))`).',
      starter: 'def index_by_name(names, ages):\n    pass\n',
      tests: [eq('index_by_name(["Ada", "Bo"], [36, 25])', '{"Ada": 36, "Bo": 25}'), eq('index_by_name([], [])', '{}'), { name: 'uses zip', code: 'assert "zip(" in __source__' }],
      hints: ['{n: a for n, a in zip(names, ages)}'],
      solution: 'def index_by_name(names, ages):\n    return {n: a for n, a in zip(names, ages)}\n',
    }),
    py({
      prompt: 'Write `invert(d)` that swaps keys and values: `{"a": 1, "b": 2}` → `{1: "a", 2: "b"}`. Use a dict comprehension.',
      starter: 'def invert(d):\n    pass\n',
      tests: [eq('invert({"a": 1, "b": 2})', '{1: "a", 2: "b"}'), eq('invert({})', '{}'), { name: 'uses a comprehension', code: 'assert "for" in __source__ and "{" in __source__.split("def invert", 1)[1]' }],
      hints: ['{v: k for k, v in d.items()}'],
      solution: 'def invert(d):\n    return {v: k for k, v in d.items()}\n',
    }),
    fill('Flatten the grid with a nested comprehension.', '[x for row in grid ___ x in row]', [['for']], 'Two for clauses, outer loop first.', ['for', 'in', 'if', 'each']),
    ord('Arrange a dict comprehension that maps each word to its first letter.', ['{w:', 'w[0]', 'for w in words}'], 'key: value, then the for clause.', 'python'),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'py2-4': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Every recursive function needs…', ['a loop', 'a base case', 'a global variable'], 1, 'A base case to stop.'),
      ans('What does f(3) return?', ['6'], '3 + 2 + 1 + 0.', 'def f(n):\n    if n == 0:\n        return 0\n    return n + f(n - 1)'),
      mc('Too-deep recursion raises…', ['IndexError', 'RecursionError', 'StackError'], 1, 'RecursionError.'),
      py({ prompt: 'Write a recursive `count_down_list(n)` that returns `[n, n-1, …, 1]` (and `[]` for 0).', starter: 'def count_down_list(n):\n    pass\n', tests: [eq('count_down_list(3)', '[3, 2, 1]'), eq('count_down_list(0)', '[]'), { name: 'recursive', code: 'assert "for " not in __source__ and "while " not in __source__ and "range(" not in __source__' }], solution: 'def count_down_list(n):\n    if n == 0:\n        return []\n    return [n] + count_down_list(n - 1)\n' }),
      py({ prompt: 'Write a recursive `count_items(nested)` that counts all non-list items in a nested list.', starter: 'def count_items(nested):\n    pass\n', tests: [eq('count_items([1, [2, 3], [[4]]])', '4'), eq('count_items([])', '0')], solution: 'def count_items(nested):\n    total = 0\n    for x in nested:\n        if isinstance(x, list):\n            total += count_items(x)\n        else:\n            total += 1\n    return total\n' }),
      py({ prompt: 'Write a recursive `digits_sum(n)` for n ≥ 0 (e.g. 472 → 13). Base case: a single digit.', starter: 'def digits_sum(n):\n    pass\n', tests: [eq('digits_sum(472)', '13'), eq('digits_sum(5)', '5'), eq('digits_sum(0)', '0')], solution: 'def digits_sum(n):\n    if n < 10:\n        return n\n    return n % 10 + digits_sum(n // 10)\n' }),
    ],
  },
  'py2-5': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('pytest runs functions whose names start with…', ['check_', 'test_', 'run_'], 1, 'test_.'),
      mc('Which is an edge case for a function that finds the max of a list?', ['[3, 1, 2]', '[7] (one item)', '[1, 2, 3]'], 1, 'Single-item lists are an edge.'),
      ans('What does this print?', ['n=3'], 'Debug f-string.', 'n = 3\nprint(f"{n=}")'),
      mc('The bug in `for i in range(1, n)` when you meant 1 to n is called…', ['a syntax error', 'an off-by-one error', 'a type error'], 1, 'Off by one.'),
      py({ prompt: 'Fix `last_item` so it returns the last element of a list (it currently crashes).', starter: 'def last_item(items):\n    return items[len(items)]\n', tests: [eq('last_item([1, 2, 3])', '3'), eq('last_item(["x"])', '"x"')], solution: 'def last_item(items):\n    return items[len(items) - 1]\n' }),
      py({ prompt: 'Fix `is_teen` — 13 through 19 (inclusive) are teens.', starter: 'def is_teen(age):\n    return 13 < age < 19\n', tests: [eq('is_teen(13)', 'True'), eq('is_teen(19)', 'True'), eq('is_teen(20)', 'False'), eq('is_teen(12)', 'False')], solution: 'def is_teen(age):\n    return 13 <= age <= 19\n' }),
    ],
  },
  'py2-6': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('What does this print?', ['12'], 'lambda triples 4.', 'f = lambda x: x * 3\nprint(f(4))'),
      ans('What does this print?', ["['bb', 'a']"], 'Longest first.', 'print(sorted(["a", "bb"], key=len, reverse=True))'),
      mc('Which keyword makes a generator?', ['return', 'yield', 'gen', 'async'], 1, 'yield.'),
      ans('What does this print?', ["{'a': 1, 'b': 2}"], 'zip pairs them.', 'print(dict(zip(["a", "b"], [1, 2])))'),
      py({ prompt: 'Write `square_map(nums)` returning a dict from each number to its square (dict comprehension).', starter: 'def square_map(nums):\n    pass\n', tests: [eq('square_map([2, 3])', '{2: 4, 3: 9}')], solution: 'def square_map(nums):\n    return {n: n * n for n in nums}\n' }),
      py({ prompt: 'Write a generator `countdown_gen(n)` yielding n, n-1, … 1.', starter: 'def countdown_gen(n):\n    pass\n', tests: [eq('list(countdown_gen(3))', '[3, 2, 1]'), { name: 'uses yield', code: 'assert "yield" in __source__' }], solution: 'def countdown_gen(n):\n    while n > 0:\n        yield n\n        n -= 1\n' }),
      py({ prompt: 'Write `by_last_letter(words)` that sorts words by their LAST letter.', starter: 'def by_last_letter(words):\n    pass\n', tests: [eq('by_last_letter(["cab", "bac", "acb"])', '["cab", "acb", "bac"]')], solution: 'def by_last_letter(words):\n    return sorted(words, key=lambda w: w[-1])\n' }),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  'python-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Which exception does int("x") raise?', ['TypeError', 'ValueError', 'KeyError'], 1, 'ValueError.'),
      mc('`with open("f.txt", "a")` will…', ['erase f.txt', 'add to the end of f.txt', 'only read f.txt'], 1, 'Append.'),
      mc('Which collection counts items for you?', ['deque', 'Counter', 'defaultdict'], 1, 'Counter.'),
      mc('In OOP, an object is…', ['a blueprint', 'an instance created from a class', 'a module'], 1, 'Instance.'),
      ans('What does this print?', ['Hi, Ada'], 'Method uses self.name.', 'class P:\n    def __init__(self, name):\n        self.name = name\n\n    def greet(self):\n        return f"Hi, {self.name}"\n\nprint(P("Ada").greet())'),
      mc('Recursion stops at the…', ['base case', 'return type', 'first call'], 0, 'Base case.'),
      py({ prompt: 'Write a recursive `binary(n)` that returns the binary string of n ≥ 1 (e.g. 5 → "101"), without bin().', starter: 'def binary(n):\n    pass\n', tests: [eq('binary(5)', '"101"'), eq('binary(1)', '"1"'), eq('binary(8)', '"1000"'), { name: 'no bin()', code: 'assert "bin(" not in __source__' }], solution: 'def binary(n):\n    if n < 2:\n        return str(n)\n    return binary(n // 2) + str(n % 2)\n' }),
      py({ prompt: 'Create a `Stack` class with `push(x)`, `pop()` (returns the top item; raise `IndexError` if empty), `peek()` and `is_empty()`.', starter: 'class Stack:\n    pass\n', tests: [{ name: 'push/pop order', code: 's = Stack()\ns.push(1); s.push(2)\nassert s.peek() == 2 and s.pop() == 2 and s.pop() == 1 and s.is_empty()' }, { name: 'pop on empty raises IndexError', code: 'try:\n    Stack().pop()\nexcept IndexError:\n    pass\nelse:\n    raise AssertionError("pop on an empty stack should raise IndexError")' }], solution: 'class Stack:\n    def __init__(self):\n        self.items = []\n\n    def push(self, x):\n        self.items.append(x)\n\n    def pop(self):\n        if not self.items:\n            raise IndexError("pop from empty stack")\n        return self.items.pop()\n\n    def peek(self):\n        return self.items[-1]\n\n    def is_empty(self):\n        return not self.items\n' }),
      py({ prompt: 'Write `word_lengths(text)` returning a dict of each distinct word → its length (dict comprehension).', starter: 'def word_lengths(text):\n    pass\n', tests: [eq('word_lengths("hi there hi")', '{"hi": 2, "there": 5}')], solution: 'def word_lengths(text):\n    return {w: len(w) for w in text.split()}\n' }),
      py({ prompt: 'Write `safe_get(items, i)` returning `items[i]`, or `None` if i is out of range (use try/except IndexError).', starter: 'def safe_get(items, i):\n    pass\n', tests: [eq('safe_get([1, 2], 1)', '2'), eq('safe_get([1, 2], 5)', 'None'), { name: 'uses try/except', code: 'assert "except IndexError" in __source__' }], solution: 'def safe_get(items, i):\n    try:\n        return items[i]\n    except IndexError:\n        return None\n' }),
    ],
  },
};
