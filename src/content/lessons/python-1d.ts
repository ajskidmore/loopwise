/**
 * Track: python-1 — "Python Basics"
 * Written here: py-7 (lists), py-8 (dicts, tuples, sets) + checkpoints, and the course final exam.
 */
import type { Checkpoint, Step } from '../types';
import { ans, eq, ex, fill, mc, ord, py } from './_helpers';

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ py-7-lists
  'py-7-lists': [
    ex('Many values, one variable', 'A **list** holds many values in order, inside square brackets:\n\n```python\nscores = [90, 75, 88]\nnames = ["Ada", "Grace", "Linus"]\nempty = []\n```\n\nLists can hold any type — even a mix — and can grow or shrink.'),
    ex('Indexing works like strings', 'Positions start at **0**, and negative indexes count from the end:\n\n```python\nnames = ["Ada", "Grace", "Linus"]\nprint(names[0])    # Ada\nprint(names[-1])   # Linus\nprint(len(names))  # 3\nprint(names[1:])   # [\'Grace\', \'Linus\']\n```'),
    ans('What does this print?', ['Grace'], 'Index 1 is the second item.', 'names = ["Ada", "Grace", "Linus"]\nprint(names[1])'),
    ans('What does this print?', ['4'], 'There are 4 items.', 'print(len([10, 20, 30, 40]))'),
    ex('Lists can change', 'Unlike strings, lists are **mutable** — you can change items in place:\n\n```python\ncolors = ["red", "green", "blue"]\ncolors[1] = "yellow"\nprint(colors)   # [\'red\', \'yellow\', \'blue\']\n```\n\nAsking for a position that doesn\'t exist gives an **IndexError**.'),
    mc('What does this print?', ["['a', 'Z', 'c']", "['a', 'b', 'c']", "['Z', 'b', 'c']", 'An error'], 0, 'Index 1 (the second item) is replaced.', 'letters = ["a", "b", "c"]\nletters[1] = "Z"\nprint(letters)'),
    mc('What happens here?', ['Prints 3', 'IndexError: list index out of range', 'Prints nothing'], 1, 'The valid indexes are 0, 1 and 2. There is no index 3.', 'nums = [1, 2, 3]\nprint(nums[3])'),
    py({
      prompt: 'Create a list called `planets` with `"Mercury"`, `"Venus"` and `"Earth"` (in that order). Print the **last** planet using a negative index.',
      expectedOutput: 'Earth',
      tests: [eq('planets', '["Mercury", "Venus", "Earth"]'), { name: 'uses a negative index', code: 'assert "[-1]" in __source__, "Use planets[-1]"' }],
      hints: ['planets = ["Mercury", "Venus", "Earth"]', 'print(planets[-1])'],
      solution: 'planets = ["Mercury", "Venus", "Earth"]\nprint(planets[-1])\n',
    }),
    py({
      prompt: 'The second score was entered wrong. Change it to `95`, then print the whole list.',
      starter: 'scores = [80, 59, 72]\n',
      expectedOutput: '[80, 95, 72]',
      hints: ['scores[1] = 95'],
      solution: 'scores = [80, 59, 72]\nscores[1] = 95\nprint(scores)\n',
    }),
  ],

  // ------------------------------------------------------------------ py-7-list-methods
  'py-7-list-methods': [
    ex('Adding and removing', '```python\nitems = ["a", "b"]\nitems.append("c")      # add to the end   → [\'a\', \'b\', \'c\']\nitems.insert(0, "z")   # add at index 0   → [\'z\', \'a\', \'b\', \'c\']\nitems.remove("a")      # remove by value  → [\'z\', \'b\', \'c\']\nlast = items.pop()     # remove + return the last → "c"\n```\n\nThese methods **change the list itself**.'),
    mc('What does this print?', ["[1, 2, 3, 4]", "[4, 1, 2, 3]", "[1, 2, 3]", '4'], 0, 'append adds to the end.', 'nums = [1, 2, 3]\nnums.append(4)\nprint(nums)'),
    ans('What does this print?', ['30'], 'pop() removes the last item and returns it.', 'nums = [10, 20, 30]\nx = nums.pop()\nprint(x)'),
    ex('Checking and sorting', '- `x in items` → True/False: is x in the list?\n- `items.sort()` sorts the list **in place** (and returns `None`)\n- `sorted(items)` **returns a new** sorted list, leaving the original alone\n- `items.index(x)` → position of x\n- `items.count(x)` → how many times x appears'),
    ans('What does this print?', ['True'], '"pear" is in the list.', 'fruit = ["apple", "pear"]\nprint("pear" in fruit)'),
    mc('What does this print?', ['[1, 2, 3]', 'None', '[3, 1, 2]'], 1, '.sort() changes the list but returns None. Use sorted(nums) to get a new list back, or sort first and print nums afterwards.', 'nums = [3, 1, 2]\nprint(nums.sort())'),
    py({
      prompt: 'Start with an empty list `cart`. Append `"milk"`, `"eggs"` and `"bread"`, then remove `"eggs"`. Print the list.',
      starter: 'cart = []\n',
      expectedOutput: "['milk', 'bread']",
      tests: [{ name: 'uses append and remove', code: 'assert "append" in __source__ and "remove" in __source__' }],
      hints: ['cart.append("milk") … three times', 'cart.remove("eggs")'],
      solution: 'cart = []\ncart.append("milk")\ncart.append("eggs")\ncart.append("bread")\ncart.remove("eggs")\nprint(cart)\n',
    }),
    py({
      prompt: 'Print the scores sorted from **highest to lowest**. (Hint: `sorted` takes `reverse=True`.)',
      starter: 'scores = [72, 95, 88, 61]\n',
      expectedOutput: '[95, 88, 72, 61]',
      hints: ['print(sorted(scores, reverse=True))'],
      solution: 'scores = [72, 95, 88, 61]\nprint(sorted(scores, reverse=True))\n',
    }),
    fill('Add "kiwi" to the end of the list.', 'fruit = ["apple"]\nfruit.___("kiwi")', [['append']], 'append adds one item to the end.', ['append', 'add', 'push', 'insert']),
  ],

  // ------------------------------------------------------------------ py-7-looping-lists
  'py-7-looping-lists': [
    ex('Visit every item', '`for` loops work directly on lists:\n\n```python\nfor name in ["Ada", "Grace"]:\n    print(f"Hello, {name}")\n```\n\nNeed the position too? `enumerate` gives **(index, item)** pairs:\n\n```python\nfor i, name in enumerate(["Ada", "Grace"]):\n    print(i, name)     # 0 Ada / 1 Grace\n```'),
    ans('What does this print?', ['6'], '1 + 2 + 3 using an accumulator.', 'total = 0\nfor n in [1, 2, 3]:\n    total += n\nprint(total)'),
    ex('Handy built-ins', '```python\nnums = [4, 9, 2]\nsum(nums)   # 15\nmax(nums)   # 9\nmin(nums)   # 2\n```\n\nThey\'re great — but you should also be able to write them yourself with a loop (interviews love asking!).'),
    ans('What is max([3, 8, 5])?', ['8'], 'The biggest value.'),
    ex('Building a new list', 'A very common pattern: start empty, loop, `append` what you want to keep.\n\n```python\nprices = [5, 12, 8, 20]\ncheap = []\nfor p in prices:\n    if p < 10:\n        cheap.append(p)\nprint(cheap)   # [5, 8]\n```'),
    py({
      prompt: 'Build a list `doubled` with every number in `nums` multiplied by 2, then print it.',
      starter: 'nums = [3, 7, 10]\n',
      expectedOutput: '[6, 14, 20]',
      hints: ['doubled = [] then loop and append(n * 2)'],
      solution: 'nums = [3, 7, 10]\ndoubled = []\nfor n in nums:\n    doubled.append(n * 2)\nprint(doubled)\n',
    }),
    py({
      prompt: 'Write `average(nums)` that returns the average of a non-empty list.',
      starter: 'def average(nums):\n    pass\n',
      tests: [eq('average([1, 2, 3])', '2.0'), eq('average([10])', '10.0'), eq('average([2, 3])', '2.5')],
      hints: ['sum(nums) / len(nums)'],
      solution: 'def average(nums):\n    return sum(nums) / len(nums)\n',
    }),
    py({
      prompt: 'Print each item with its number, starting at **1**, like `1. eggs`. (Hint: `enumerate(items, start=1)`.)',
      starter: 'items = ["eggs", "flour", "sugar"]\n',
      expectedOutput: '1. eggs\n2. flour\n3. sugar',
      hints: ['for i, item in enumerate(items, start=1):', '    print(f"{i}. {item}")'],
      solution: 'items = ["eggs", "flour", "sugar"]\nfor i, item in enumerate(items, start=1):\n    print(f"{i}. {item}")\n',
    }),
  ],

  // ------------------------------------------------------------------ py-7-comprehensions
  'py-7-comprehensions': [
    ex('A loop in one line', 'A **list comprehension** builds a list in one expression:\n\n```python\nsquares = [n * n for n in range(1, 5)]\n# [1, 4, 9, 16]\n```\n\nRead it as: "**n × n**, for each **n** in range(1, 5)". It does exactly what the loop-and-append pattern does.'),
    ans('What does this print?', ['[2, 4, 6]'], 'Each x is doubled.', 'print([x * 2 for x in [1, 2, 3]])'),
    ex('Filtering with if', 'Add an `if` at the end to keep only some items:\n\n```python\nnums = [5, 12, 8, 20]\nbig = [n for n in nums if n > 10]\n# [12, 20]\n```'),
    ans('What does this print?', ['[0, 2, 4]'], 'Keeps only the even numbers from 0–5.', 'print([n for n in range(6) if n % 2 == 0])'),
    ord('Arrange the parts of a comprehension that keeps words longer than 3 letters.', ['[w', 'for w in words', 'if len(w) > 3]'], 'Expression first, then the for, then the optional if.', 'python'),
    py({
      prompt: 'Use a list comprehension to make `upper_names`: every name in uppercase. Print it.',
      starter: 'names = ["ada", "grace", "linus"]\n',
      expectedOutput: "['ADA', 'GRACE', 'LINUS']",
      tests: [{ name: 'uses a comprehension', code: 'assert "for" in __source__ and "[" in __source__.split("upper_names", 1)[-1], "Use [... for ... in names]"' }],
      hints: ['[n.upper() for n in names]'],
      solution: 'names = ["ada", "grace", "linus"]\nupper_names = [n.upper() for n in names]\nprint(upper_names)\n',
    }),
    py({
      prompt: 'Use a list comprehension to keep only the **passing** scores (60 or more). Print the result.',
      starter: 'scores = [45, 88, 60, 59, 92]\n',
      expectedOutput: '[88, 60, 92]',
      hints: ['[s for s in scores if s >= 60]'],
      solution: 'scores = [45, 88, 60, 59, 92]\nprint([s for s in scores if s >= 60])\n',
    }),
  ],

  // ------------------------------------------------------------------ py-8-dicts
  'py-8-dicts': [
    ex('Look things up by name', 'A **dictionary** (`dict`) stores **key → value** pairs, like a real dictionary maps words to meanings:\n\n```python\nages = {"Ada": 36, "Grace": 85}\nprint(ages["Ada"])   # 36\n```\n\nKeys are usually strings or numbers and must be unique. Lookups by key are very fast.'),
    ans('What does this print?', ['red'], 'Look up the key "apple".', 'colors = {"apple": "red", "banana": "yellow"}\nprint(colors["apple"])'),
    ex('Adding, changing, removing', '```python\nstock = {"apples": 5}\nstock["pears"] = 3      # add a new key\nstock["apples"] = 10    # change a value\ndel stock["pears"]      # remove a key\nprint(stock)            # {\'apples\': 10}\n```'),
    mc('What happens when you look up a key that isn\'t there?', ['You get None', 'KeyError', 'You get 0', 'It adds the key'], 1, 'Square-bracket lookups of a missing key raise KeyError.', 'ages = {"Ada": 36}\nprint(ages["Bob"])'),
    ex('Safe lookups', '- `key in d` → True/False\n- `d.get(key)` → the value, or `None` if missing\n- `d.get(key, default)` → the value, or your default\n\n```python\nages = {"Ada": 36}\nprint(ages.get("Bob", 0))   # 0\n```'),
    ans('What does this print?', ['0'], 'get returns the default when the key is missing.', 'stock = {"apples": 5}\nprint(stock.get("kiwis", 0))'),
    py({
      prompt: 'Create a dict `capitals` mapping `"France"` → `"Paris"` and `"Japan"` → `"Tokyo"`. Then add `"Kenya"` → `"Nairobi"` and print `capitals["Kenya"]`.',
      expectedOutput: 'Nairobi',
      tests: [eq('capitals', '{"France": "Paris", "Japan": "Tokyo", "Kenya": "Nairobi"}', 'capitals has all three countries')],
      hints: ['capitals = {"France": "Paris", "Japan": "Tokyo"}', 'capitals["Kenya"] = "Nairobi"'],
      solution: 'capitals = {"France": "Paris", "Japan": "Tokyo"}\ncapitals["Kenya"] = "Nairobi"\nprint(capitals["Kenya"])\n',
    }),
    py({
      prompt: 'Write `price_of(item)` that returns the price from the `menu` dict, or `-1` if the item isn\'t on the menu.',
      starter: 'menu = {"taco": 3, "burrito": 8}\n\ndef price_of(item):\n    pass\n',
      tests: [eq('price_of("taco")', '3'), eq('price_of("burrito")', '8'), eq('price_of("pizza")', '-1')],
      hints: ['return menu.get(item, -1)'],
      solution: 'menu = {"taco": 3, "burrito": 8}\n\ndef price_of(item):\n    return menu.get(item, -1)\n',
    }),
  ],

  // ------------------------------------------------------------------ py-8-dict-loops
  'py-8-dict-loops': [
    ex('Looping over a dict', '```python\nages = {"Ada": 36, "Grace": 85}\n\nfor name in ages:              # keys\n    print(name)\n\nfor age in ages.values():      # values\n    print(age)\n\nfor name, age in ages.items(): # both\n    print(f"{name} is {age}")\n```\n\nDicts remember the order keys were added.'),
    ans('What does this print?', ['30'], 'Sums the values 10 + 20.', 'stock = {"a": 10, "b": 20}\ntotal = 0\nfor n in stock.values():\n    total += n\nprint(total)'),
    ex('Counting with a dict', 'A classic: count how often each thing appears.\n\n```python\ncounts = {}\nfor word in ["hi", "yo", "hi"]:\n    counts[word] = counts.get(word, 0) + 1\nprint(counts)   # {\'hi\': 2, \'yo\': 1}\n```\n\n`counts.get(word, 0)` is 0 the first time a word appears.', 'This pattern solves a huge number of interview problems.'),
    py({
      prompt: 'Count how many times each letter appears in `word` and print the dict. Expected: `{\'b\': 1, \'a\': 3, \'n\': 2}`',
      starter: 'word = "banana"\n',
      expectedOutput: "{'b': 1, 'a': 3, 'n': 2}",
      hints: ['counts = {}', 'for ch in word: counts[ch] = counts.get(ch, 0) + 1'],
      solution: 'word = "banana"\ncounts = {}\nfor ch in word:\n    counts[ch] = counts.get(ch, 0) + 1\nprint(counts)\n',
    }),
    py({
      prompt: 'Print each student and grade as `Ada: A` using `.items()`.',
      starter: 'grades = {"Ada": "A", "Linus": "B"}\n',
      expectedOutput: 'Ada: A\nLinus: B',
      tests: [{ name: 'uses .items()', code: 'assert ".items()" in __source__' }],
      hints: ['for name, grade in grades.items():'],
      solution: 'grades = {"Ada": "A", "Linus": "B"}\nfor name, grade in grades.items():\n    print(f"{name}: {grade}")\n',
    }),
    py({
      prompt: 'Write `top_scorer(scores)` that returns the **name** with the highest score in a dict like `{"Ada": 90, "Bo": 95}`.',
      starter: 'def top_scorer(scores):\n    pass\n',
      tests: [eq('top_scorer({"Ada": 90, "Bo": 95})', '"Bo"'), eq('top_scorer({"Cy": 70})', '"Cy"'), eq('top_scorer({"A": 5, "B": 3, "C": 4})', '"A"')],
      hints: ['Track best_name and best_score while looping over .items().', 'Or: max(scores, key=scores.get)'],
      solution: 'def top_scorer(scores):\n    best_name = None\n    best_score = None\n    for name, score in scores.items():\n        if best_score is None or score > best_score:\n            best_name, best_score = name, score\n    return best_name\n',
    }),
  ],

  // ------------------------------------------------------------------ py-8-tuples
  'py-8-tuples': [
    ex('Tuples: fixed groups', 'A **tuple** is like a list that **can\'t change** (immutable). Use parentheses:\n\n```python\npoint = (3, 4)\nprint(point[0])    # 3\n```\n\nUse tuples for values that belong together and shouldn\'t change: coordinates, RGB colors, a date.'),
    mc('What happens?', ['point becomes (5, 4)', 'TypeError: \'tuple\' object does not support item assignment', 'Nothing'], 1, 'Tuples are immutable — you can\'t change their items.', 'point = (3, 4)\npoint[0] = 5'),
    ex('Unpacking', 'Assign a tuple\'s items to several variables at once:\n\n```python\npoint = (3, 4)\nx, y = point\nprint(x)   # 3\n```\n\nThis gives Python\'s famous one-line **swap**:\n\n```python\na, b = 1, 2\na, b = b, a     # now a = 2, b = 1\n```', 'Remember the swap trouble in Foundations? Python solves it for you.'),
    ans('What does this print?', ['20'], 'After the swap, a holds 20.', 'a, b = 10, 20\na, b = b, a\nprint(a)'),
    ex('Returning several values', 'Functions can return a tuple, and you can unpack it:\n\n```python\ndef min_max(nums):\n    return min(nums), max(nums)\n\nlow, high = min_max([4, 9, 1])\nprint(low, high)   # 1 9\n```'),
    py({
      prompt: 'Write `divide(a, b)` that returns **two** values: the whole-number quotient and the remainder. `divide(17, 5)` → `(3, 2)`.',
      starter: 'def divide(a, b):\n    pass\n',
      tests: [eq('divide(17, 5)', '(3, 2)'), eq('divide(10, 2)', '(5, 0)'), eq('divide(3, 7)', '(0, 3)')],
      hints: ['Use // and % from Unit 2.', 'return a // b, a % b'],
      solution: 'def divide(a, b):\n    return a // b, a % b\n',
    }),
    py({
      prompt: 'Swap the values of `left` and `right` in **one line**, then print both (left first) separated by a space.',
      starter: 'left = "L"\nright = "R"\n',
      expectedOutput: 'R L',
      hints: ['left, right = right, left', 'print(left, right)'],
      solution: 'left = "L"\nright = "R"\nleft, right = right, left\nprint(left, right)\n',
    }),
  ],

  // ------------------------------------------------------------------ py-8-sets
  'py-8-sets': [
    ex('Sets: unique items', 'A **set** holds **unique** items with **no order**. Duplicates disappear automatically:\n\n```python\ntags = {"python", "code", "python"}\nprint(len(tags))   # 2\n```\n\nMake an empty set with `set()` — `{}` makes an empty **dict**.'),
    ans('What does this print?', ['3'], 'set() removes the duplicate 1 and 2, leaving {1, 2, 3}.', 'print(len(set([1, 2, 2, 3, 1])))'),
    ex('Why sets?', '- **Remove duplicates**: `set(my_list)`\n- **Fast membership checks**: `x in my_set` is very fast, even with millions of items\n- **Math-style operations**:\n\n```python\na = {1, 2, 3}\nb = {2, 3, 4}\na | b    # union: {1, 2, 3, 4}\na & b    # intersection: {2, 3}\na - b    # difference: {1}\n```'),
    mc('Which items are in both {1, 2, 3} and {3, 4}?', ['{3}', '{1, 2, 3, 4}', '{1, 2}', '{}'], 0, 'The intersection (&) keeps items found in both.'),
    mc('How do you make an empty set?', ['{}', 'set()', '[]', 'empty()'], 1, '{} is an empty dict. Use set().'),
    py({
      prompt: 'Print how many **different** visitors are in the list.',
      starter: 'visitors = ["ana", "bo", "ana", "cy", "bo", "ana"]\n',
      expectedOutput: '3',
      hints: ['len(set(visitors))'],
      solution: 'visitors = ["ana", "bo", "ana", "cy", "bo", "ana"]\nprint(len(set(visitors)))\n',
    }),
    py({
      prompt: 'Print a **sorted list** of the friends that Ana and Bo have in common.',
      starter: 'ana = {"cy", "dee", "eli"}\nbo = {"eli", "fay", "cy"}\n',
      expectedOutput: "['cy', 'eli']",
      hints: ['Intersection: ana & bo', 'print(sorted(ana & bo))'],
      solution: 'ana = {"cy", "dee", "eli"}\nbo = {"eli", "fay", "cy"}\nprint(sorted(ana & bo))\n',
    }),
    py({
      prompt: 'Write `has_duplicates(items)` that returns `True` if any value appears more than once.',
      starter: 'def has_duplicates(items):\n    pass\n',
      tests: [eq('has_duplicates([1, 2, 3])', 'False'), eq('has_duplicates([1, 2, 1])', 'True'), eq('has_duplicates([])', 'False')],
      hints: ['If removing duplicates makes it shorter, there were duplicates.', 'return len(set(items)) < len(items)'],
      solution: 'def has_duplicates(items):\n    return len(set(items)) < len(items)\n',
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'py-7': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('What does this print?', ['c'], 'Index -1 is the last item.', 'print(["a", "b", "c"][-1])'),
      ans('What does this print?', ['3'], 'Three items after append.', 'x = [1, 2]\nx.append(3)\nprint(len(x))'),
      mc('What does nums.sort() return?', ['The sorted list', 'None', 'The first item'], 1, 'sort() works in place and returns None.'),
      ans('What does this print?', ['[1, 4, 9]'], 'Each n squared.', 'print([n * n for n in [1, 2, 3]])'),
      ans('What does this print?', ['False'], '5 is not in the list.', 'print(5 in [1, 2, 3])'),
      py({ prompt: 'Print the list of words from `words` that start with `"s"` (use a loop or a comprehension).', starter: 'words = ["sun", "moon", "star", "sky", "cloud"]\n', expectedOutput: "['sun', 'star', 'sky']", solution: 'words = ["sun", "moon", "star", "sky", "cloud"]\nprint([w for w in words if w.startswith("s")])\n' }),
      py({ prompt: 'Write `smallest(nums)` that returns the smallest number **without** using min().', starter: 'def smallest(nums):\n    pass\n', tests: [eq('smallest([4, 2, 8])', '2'), eq('smallest([-1, -5, 0])', '-5'), eq('smallest([7])', '7'), { name: 'no min()', code: 'assert "min(" not in __source__' }], solution: 'def smallest(nums):\n    best = nums[0]\n    for n in nums:\n        if n < best:\n            best = n\n    return best\n' }),
      py({ prompt: 'Remove `"b"` from `letters` and print the list.', starter: 'letters = ["a", "b", "c"]\n', expectedOutput: "['a', 'c']", solution: 'letters = ["a", "b", "c"]\nletters.remove("b")\nprint(letters)\n' }),
    ],
  },
  'py-8': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('What does this print?', ['2'], 'Look up the key "b".', 'd = {"a": 1, "b": 2}\nprint(d["b"])'),
      ans('What does this print?', ['None'], 'get with no default returns None when the key is missing.', 'd = {"a": 1}\nprint(d.get("z"))'),
      mc('Which collection CANNOT be changed after it\'s made?', ['list', 'dict', 'tuple', 'set'], 2, 'Tuples are immutable.'),
      mc('What does {} create?', ['An empty set', 'An empty dict', 'An empty list'], 1, '{} is an empty dict.'),
      ans('What does this print?', ['2'], 'Unique values: "x" and "y".', 'print(len({"x", "y", "x"}))'),
      ans('What does this print?', ['1'], 'Unpacking: a = 1, b = 2.', 'a, b = (1, 2)\nprint(a)'),
      py({ prompt: 'Write `word_counts(text)` that returns a dict of how many times each word appears. Words are separated by spaces.', starter: 'def word_counts(text):\n    pass\n', tests: [eq('word_counts("a b a")', '{"a": 2, "b": 1}'), eq('word_counts("hi")', '{"hi": 1}')], solution: 'def word_counts(text):\n    counts = {}\n    for w in text.split():\n        counts[w] = counts.get(w, 0) + 1\n    return counts\n' }),
      py({ prompt: 'Print the total value of the inventory: quantity × price for each item, added up. (Expected: `27`)', starter: 'qty = {"pen": 3, "pad": 2}\nprice = {"pen": 5, "pad": 6}\n', expectedOutput: '27', solution: 'qty = {"pen": 3, "pad": 2}\nprice = {"pen": 5, "pad": 6}\ntotal = 0\nfor item, q in qty.items():\n    total += q * price[item]\nprint(total)\n' }),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  'python-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('What does this print?', ['7'], '1 + 2 * 3 = 7.', 'print(1 + 2 * 3)'),
      ans('What is 17 % 5?', ['2'], 'Remainder 2.'),
      ans('What does this print?', ['pyt'], 'Slice 0 to 3.', 'print("python"[:3])'),
      ans('What does this print?', ['B'], '85 is not >= 90, but is >= 80.', 'score = 85\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelse:\n    print("C")'),
      ans('What does this print?', ['10'], '0+1+2+3+4.', 'total = 0\nfor i in range(5):\n    total += i\nprint(total)'),
      mc('A function without return gives back…', ['0', 'None', 'an empty string'], 1, 'None.'),
      ans('What does this print?', ['[2, 3]'], 'Slice from index 1.', 'print([1, 2, 3][1:])'),
      ans('What does this print?', ['3'], 'Value for key "b".', 'print({"a": 1, "b": 3}["b"])'),
      py({ prompt: 'Write `fizzbuzz(n)` that **returns** `"FizzBuzz"` if n is divisible by 3 and 5, `"Fizz"` if by 3, `"Buzz"` if by 5, otherwise the number as a string.', starter: 'def fizzbuzz(n):\n    pass\n', tests: [eq('fizzbuzz(15)', '"FizzBuzz"'), eq('fizzbuzz(9)', '"Fizz"'), eq('fizzbuzz(10)', '"Buzz"'), eq('fizzbuzz(7)', '"7"')], solution: 'def fizzbuzz(n):\n    if n % 15 == 0:\n        return "FizzBuzz"\n    if n % 3 == 0:\n        return "Fizz"\n    if n % 5 == 0:\n        return "Buzz"\n    return str(n)\n' }),
      py({ prompt: 'Write `is_palindrome(word)` that returns True if the word reads the same backwards (ignore upper/lower case).', starter: 'def is_palindrome(word):\n    pass\n', tests: [eq('is_palindrome("Racecar")', 'True'), eq('is_palindrome("loop")', 'False'), eq('is_palindrome("a")', 'True')], solution: 'def is_palindrome(word):\n    w = word.lower()\n    return w == w[::-1]\n' }),
      py({ prompt: 'Write `evens(nums)` that returns a new list with only the even numbers.', starter: 'def evens(nums):\n    pass\n', tests: [eq('evens([1, 2, 3, 4])', '[2, 4]'), eq('evens([1, 3])', '[]')], solution: 'def evens(nums):\n    return [n for n in nums if n % 2 == 0]\n' }),
      py({ prompt: 'Write `letter_count(text, letter)` that returns how many times `letter` appears in `text`, using a loop (not `.count`).', starter: 'def letter_count(text, letter):\n    pass\n', tests: [eq('letter_count("banana", "a")', '3'), eq('letter_count("loop", "z")', '0'), { name: 'no .count()', code: 'assert ".count(" not in __source__' }], solution: 'def letter_count(text, letter):\n    n = 0\n    for ch in text:\n        if ch == letter:\n            n += 1\n    return n\n' }),
    ],
  },
};

