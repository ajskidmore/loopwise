/**
 * Track: python-2 — "Python Intermediate"
 * Written here: py2-1 (errors & files), py2-2 (modules & stdlib), py2-3 (OOP) + checkpoints
 */
import type { Checkpoint, Step } from '../types';
import { ans, eq, ex, fill, mc, ord, py } from './_helpers';

/** Test helper: calling `expr` must raise `exc`. */
const raises = (expr: string, exc: string, name?: string) => ({
  name: name ?? `${expr} raises ${exc}`,
  code: `try:\n    ${expr}\nexcept ${exc}:\n    pass\nelse:\n    raise AssertionError("${expr.replace(/"/g, '\\"')} should raise ${exc}")`,
});

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ py2-1-exceptions
  'py2-1-exceptions': [
    ex('When things go wrong', 'Some errors only happen while a program runs — bad input, a missing file, dividing by zero. These are **exceptions**:\n\n```python\nint("abc")   # ValueError: invalid literal for int() with base 10: \'abc\'\n10 / 0       # ZeroDivisionError: division by zero\n[1, 2][5]    # IndexError: list index out of range\n```\n\nUnhandled, an exception **crashes** the program.'),
    ex('try / except', 'Wrap risky code in `try`. If an exception happens, Python jumps to the matching `except` instead of crashing:\n\n```python\ntext = "abc"\ntry:\n    n = int(text)\n    print("Got", n)\nexcept ValueError:\n    print("That\'s not a number!")\n```\n\nprints `That\'s not a number!`', 'Catch specific exceptions (like ValueError), not everything — otherwise you hide real bugs.'),
    ans('What does this print?', ['oops'], 'int("12x") raises ValueError, so the except block runs and "ok" is never printed.', 'try:\n    n = int("12x")\n    print("ok")\nexcept ValueError:\n    print("oops")'),
    mc('Which exception does 5 / 0 raise?', ['ValueError', 'ZeroDivisionError', 'TypeError', 'IndexError'], 1, 'Dividing by zero raises ZeroDivisionError.'),
    ex('else, finally, and the error object', '```python\ntry:\n    n = int(text)\nexcept ValueError as e:\n    print("Problem:", e)     # e holds the error message\nelse:\n    print("No problem!")     # runs only if nothing went wrong\nfinally:\n    print("Always runs")     # runs no matter what\n```\n\nYou can also catch several kinds: `except (ValueError, TypeError):`'),
    py({
      prompt: 'Write `safe_int(text)` that returns `int(text)`, or `None` if the text isn\'t a valid whole number.',
      starter: 'def safe_int(text):\n    pass\n',
      tests: [eq('safe_int("42")', '42'), eq('safe_int("-7")', '-7'), eq('safe_int("abc")', 'None'), eq('safe_int("3.5")', 'None'), { name: 'catches ValueError specifically', code: 'assert "except ValueError" in __source__ or "except (ValueError" in __source__, "Catch ValueError specifically"' }],
      hints: ['try: return int(text)', 'except ValueError: return None'],
      solution: 'def safe_int(text):\n    try:\n        return int(text)\n    except ValueError:\n        return None\n',
    }),
    py({
      prompt: 'Write `safe_divide(a, b)` that returns `a / b`, or the string `"undefined"` if `b` is 0. Use try/except.',
      starter: 'def safe_divide(a, b):\n    pass\n',
      tests: [eq('safe_divide(10, 4)', '2.5'), eq('safe_divide(1, 0)', '"undefined"'), { name: 'uses try/except', code: 'assert "try" in __source__ and "ZeroDivisionError" in __source__' }],
      hints: ['except ZeroDivisionError: return "undefined"'],
      solution: 'def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return "undefined"\n',
    }),
  ],

  // ------------------------------------------------------------------ py2-1-raising
  'py2-1-raising': [
    ex('Raising your own', 'Your functions can **raise** exceptions when they get bad input:\n\n```python\ndef set_age(age):\n    if age < 0:\n        raise ValueError("age can\'t be negative")\n    return age\n```\n\nThis stops the function and tells the caller exactly what went wrong — better than quietly returning a wrong answer.'),
    mc('What happens when Python reaches `raise ValueError("bad")`?', ['It prints "bad" and continues', 'The function stops and a ValueError is thrown to the caller', 'Nothing'], 1, 'raise stops normal execution, just like a built-in error.'),
    ex('Picking the right exception', '- `ValueError` — right type, wrong value (`sqrt(-1)`, age -5)\n- `TypeError` — wrong type entirely (`len(5)`)\n- `KeyError` / `IndexError` — missing key or position\n\nReusing the standard ones makes your code feel familiar to every Python programmer.'),
    mc('A function that needs a positive number receives -3. Which exception fits best?', ['TypeError', 'ValueError', 'KeyError', 'ZeroDivisionError'], 1, 'It\'s a number (right type) with a bad value.'),
    py({
      prompt: 'Write `withdraw(balance, amount)` that returns the new balance. Raise a `ValueError` if `amount` is negative or more than `balance`.',
      starter: 'def withdraw(balance, amount):\n    pass\n',
      tests: [eq('withdraw(100, 30)', '70'), eq('withdraw(50, 50)', '0'), raises('withdraw(100, 150)', 'ValueError'), raises('withdraw(100, -5)', 'ValueError')],
      hints: ['if amount < 0 or amount > balance: raise ValueError("...")', 'Otherwise return balance - amount'],
      solution: 'def withdraw(balance, amount):\n    if amount < 0 or amount > balance:\n        raise ValueError("invalid amount")\n    return balance - amount\n',
    }),
    ans('What does this print?', ['caught: too big'], 'check raises ValueError("too big"); the except block catches it and prints its message.', 'def check(n):\n    if n > 10:\n        raise ValueError("too big")\n    return n\n\ntry:\n    check(99)\nexcept ValueError as e:\n    print("caught:", e)'),
  ],

  // ------------------------------------------------------------------ py2-1-files
  'py2-1-files': [
    ex('Saving to files', 'Programs often read and write files. Use `open` inside a `with` block — it closes the file automatically:\n\n```python\nwith open("notes.txt", "w") as f:\n    f.write("first line\\n")\n    f.write("second line\\n")\n```\n\nModes: `"r"` read (default), `"w"` write (**erases** the file first), `"a"` append to the end.', 'Exercises here write to a pretend disk inside your browser — your real files are safe.'),
    ex('Reading files', '```python\nwith open("notes.txt") as f:\n    text = f.read()          # the whole file as one string\n\nwith open("notes.txt") as f:\n    for line in f:           # one line at a time\n        print(line.strip())  # strip() removes the \\n\n```\n\nOpening a file that doesn\'t exist for reading raises `FileNotFoundError`.'),
    mc('Which mode adds to the end of a file without erasing it?', ['"r"', '"w"', '"a"', '"x"'], 2, '"a" = append.'),
    mc('Why use `with open(...) as f:`?', ['It\'s faster', 'It closes the file automatically, even if an error happens', 'It encrypts the file'], 1, 'Forgetting to close files can lose data; with handles it for you.'),
    py({
      prompt: 'Write the three lines `apple`, `banana`, `cherry` to a file called `fruit.txt` (one per line). Then read it back and print how many lines it has.',
      expectedOutput: '3',
      tests: [{ name: 'fruit.txt has the three fruits', code: 'with open("fruit.txt") as __f:\n    assert __f.read().split() == ["apple", "banana", "cherry"], "fruit.txt should contain apple, banana, cherry on separate lines"' }],
      hints: ['with open("fruit.txt", "w") as f: f.write("apple\\nbanana\\ncherry\\n")', 'Then: with open("fruit.txt") as f: print(len(f.readlines()))'],
      solution: 'with open("fruit.txt", "w") as f:\n    f.write("apple\\nbanana\\ncherry\\n")\n\nwith open("fruit.txt") as f:\n    print(len(f.readlines()))\n',
    }),
    py({
      prompt: 'A file `scores.txt` is created for you with one number per line. Write `total_score(path)` that returns the sum of all the numbers in that file.',
      starter: 'with open("scores.txt", "w") as f:\n    f.write("10\\n25\\n7\\n")\n\ndef total_score(path):\n    pass\n',
      tests: [eq('total_score("scores.txt")', '42'), { name: 'works for another file', code: 'with open("__t.txt", "w") as __f:\n    __f.write("1\\n2\\n3\\n4\\n")\nassert total_score("__t.txt") == 10' }],
      hints: ['Loop over the lines, convert each with int(line), add them up.'],
      solution: 'with open("scores.txt", "w") as f:\n    f.write("10\\n25\\n7\\n")\n\ndef total_score(path):\n    total = 0\n    with open(path) as f:\n        for line in f:\n            total += int(line)\n    return total\n',
    }),
    py({
      prompt: 'Write `read_or_default(path)` that returns the file\'s text, or the string `"(no file)"` if it doesn\'t exist.',
      starter: 'def read_or_default(path):\n    pass\n',
      tests: [eq('read_or_default("definitely_missing.txt")', '"(no file)"'), { name: 'reads existing files', code: 'with open("__hello.txt", "w") as __f:\n    __f.write("hi")\nassert read_or_default("__hello.txt") == "hi"' }],
      hints: ['try: with open(path) as f: return f.read()', 'except FileNotFoundError: return "(no file)"'],
      solution: 'def read_or_default(path):\n    try:\n        with open(path) as f:\n            return f.read()\n    except FileNotFoundError:\n        return "(no file)"\n',
    }),
  ],

  // ------------------------------------------------------------------ py2-2-imports
  'py2-2-imports': [
    ex('Code in many files', 'A **module** is just a `.py` file. Big programs are split into many modules, and you bring in what you need with `import`:\n\n```python\nimport math                 # use as math.sqrt(...)\nfrom math import sqrt, pi   # use as sqrt(...) directly\nimport statistics as stats  # short nickname\n```\n\nIf you write `helpers.py`, another file in the same folder can `import helpers`.'),
    mc('After `from math import sqrt`, how do you call it?', ['math.sqrt(9)', 'sqrt(9)', 'math(sqrt(9))', 'import sqrt(9)'], 1, 'from … import puts the name directly into your file.'),
    ans('What does this print?', ['3.0'], 'sqrt(9) is 3.0 (a float).', 'from math import sqrt\nprint(sqrt(9))'),
    ex('if __name__ == "__main__":', 'When a file runs directly, Python sets its special variable `__name__` to `"__main__"`. When it\'s **imported**, `__name__` is the module\'s name instead.\n\n```python\ndef main():\n    print("Running!")\n\nif __name__ == "__main__":\n    main()\n```\n\nThis lets a file be both a runnable program **and** an importable module without running its main code on import.'),
    mc('Why use `if __name__ == "__main__":`?', ['It\'s required in every file', 'So code only runs when the file is run directly, not when it\'s imported', 'To make the program faster'], 1, 'It separates "run me" code from "library" code.'),
    py({
      prompt: 'Use the `statistics` module (imported with the nickname `stats`) to print the **median** of `nums`.',
      starter: 'nums = [3, 9, 1, 7, 5]\n',
      expectedOutput: '5',
      tests: [{ name: 'imports statistics as stats', code: 'assert "import statistics as stats" in __source__' }],
      hints: ['import statistics as stats', 'print(stats.median(nums))'],
      solution: 'import statistics as stats\n\nnums = [3, 9, 1, 7, 5]\nprint(stats.median(nums))\n',
    }),
  ],

  // ------------------------------------------------------------------ py2-2-random
  'py2-2-random': [
    ex('Randomness', '```python\nimport random\nrandom.randint(1, 6)          # a whole number 1–6 (both ends included!)\nrandom.random()               # a float from 0.0 up to (not including) 1.0\nrandom.choice(["a", "b", "c"]) # pick one item\nrandom.shuffle(cards)         # shuffle a list in place\nrandom.seed(42)               # make the "random" sequence repeatable\n```\n\nComputers make **pseudo-random** numbers from a starting **seed**. Same seed → same numbers, which is great for testing.'),
    mc('Which values can random.randint(1, 3) return?', ['1 or 2', '1, 2 or 3', '0, 1, 2 or 3', 'Any decimal between 1 and 3'], 1, 'Unlike range, randint includes both ends.'),
    py({
      prompt: 'Write `roll_dice(n)` that returns a list of `n` dice rolls (each 1–6).',
      starter: 'import random\n\ndef roll_dice(n):\n    pass\n',
      tests: [
        { name: 'returns n rolls', code: 'assert len(roll_dice(5)) == 5 and roll_dice(0) == []' },
        { name: 'every roll is 1–6 and all faces appear', code: 'r = roll_dice(2000)\nassert all(1 <= x <= 6 for x in r), "rolls must be between 1 and 6"\nassert set(r) == {1, 2, 3, 4, 5, 6}, "all six faces should show up in 2000 rolls"' },
      ],
      hints: ['[random.randint(1, 6) for _ in range(n)]'],
      solution: 'import random\n\ndef roll_dice(n):\n    return [random.randint(1, 6) for _ in range(n)]\n',
    }),
    ex('Dates and times', '```python\nfrom datetime import date, timedelta\n\nd = date(2026, 11, 11)\nprint(d.year)               # 2026\nprint(d + timedelta(days=30))   # 2026-12-11\nprint((date(2026, 12, 25) - d).days)   # 44\nprint(d.strftime("%A"))     # Wednesday\n```\n\nSubtracting two dates gives a `timedelta`; `.days` is the number of days between them.'),
    ans('How many days are between date(2026, 1, 1) and date(2026, 1, 31)? (end − start)', ['30'], 'January 31 is 30 days after January 1.'),
    py({
      prompt: 'Write `days_until(start, end)` that takes two `date` objects and returns how many days from `start` to `end`.',
      starter: 'from datetime import date\n\ndef days_until(start, end):\n    pass\n',
      tests: [eq('days_until(date(2026, 11, 11), date(2026, 12, 25))', '44'), eq('days_until(date(2024, 2, 28), date(2024, 3, 1))', '2', 'handles leap years (2024)'), eq('days_until(date(2026, 1, 1), date(2026, 1, 1))', '0')],
      hints: ['return (end - start).days'],
      solution: 'from datetime import date\n\ndef days_until(start, end):\n    return (end - start).days\n',
    }),
  ],

  // ------------------------------------------------------------------ py2-2-collections
  'py2-2-collections': [
    ex('Counter', '`collections` has upgraded containers. **Counter** counts things for you:\n\n```python\nfrom collections import Counter\nc = Counter("banana")\nprint(c["a"])            # 3\nprint(c.most_common(1))  # [(\'a\', 3)]\n```\n\nIt replaces the whole "count with a dict" pattern in one line.'),
    ans('What does this print?', ['2'], 'There are two "red" items.', 'from collections import Counter\nc = Counter(["red", "blue", "red"])\nprint(c["red"])'),
    ex('defaultdict', 'A **defaultdict** creates a default value the first time you use a missing key — no more `if key not in d` checks:\n\n```python\nfrom collections import defaultdict\ngroups = defaultdict(list)\nfor word in ["apple", "avocado", "banana"]:\n    groups[word[0]].append(word)\nprint(dict(groups))   # {\'a\': [\'apple\', \'avocado\'], \'b\': [\'banana\']}\n```'),
    ex('deque', 'A **deque** ("deck") is a list that\'s fast at **both ends**:\n\n```python\nfrom collections import deque\nq = deque([1, 2, 3])\nq.appendleft(0)   # deque([0, 1, 2, 3])\nq.popleft()       # 0 — fast! (list.pop(0) is slow on big lists)\n```\n\nPerfect for queues — you\'ll use it for BFS in the Algorithms course.'),
    mc('Which is best for a line of people where you add at the back and remove from the front?', ['list with pop(0)', 'deque with append and popleft', 'set', 'tuple'], 1, 'deque makes both ends fast.'),
    py({
      prompt: 'Write `top_word(text)` that returns the most common word in `text` (words separated by spaces). Use `Counter`.',
      starter: 'from collections import Counter\n\ndef top_word(text):\n    pass\n',
      tests: [eq('top_word("the cat and the hat")', '"the"'), eq('top_word("go go go stop")', '"go"'), { name: 'uses Counter', code: 'assert "Counter(" in __source__' }],
      hints: ['Counter(text.split()).most_common(1) gives [(word, count)].', 'return Counter(text.split()).most_common(1)[0][0]'],
      solution: 'from collections import Counter\n\ndef top_word(text):\n    return Counter(text.split()).most_common(1)[0][0]\n',
    }),
    py({
      prompt: 'Write `group_by_length(words)` that returns a **dict** mapping each word length to the list of words of that length, in their original order. Use `defaultdict(list)`.',
      starter: 'from collections import defaultdict\n\ndef group_by_length(words):\n    pass\n',
      tests: [eq('group_by_length(["hi", "yo", "cat"])', '{2: ["hi", "yo"], 3: ["cat"]}'), eq('group_by_length([])', '{}'), { name: 'returns a plain dict', code: 'assert type(group_by_length(["a"])) is dict, "Convert with dict(...) before returning"' }],
      hints: ['groups = defaultdict(list); groups[len(w)].append(w)', 'return dict(groups)'],
      solution: 'from collections import defaultdict\n\ndef group_by_length(words):\n    groups = defaultdict(list)\n    for w in words:\n        groups[len(w)].append(w)\n    return dict(groups)\n',
    }),
  ],

  // ------------------------------------------------------------------ py2-3-classes
  'py2-3-classes': [
    ex('Bundling data and behavior', 'So far data (variables) and actions (functions) were separate. **Object-oriented programming (OOP)** bundles them together.\n\nA **class** is a blueprint. An **object** (or **instance**) is one thing built from it:\n\n```python\nclass Dog:\n    pass\n\nrex = Dog()     # an object\nfido = Dog()    # another, separate object\n```', 'Real-world feel: "Car" is the class; your specific car is an object.'),
    ex('Attributes', 'Objects can hold their own data in **attributes**, accessed with a dot:\n\n```python\nrex = Dog()\nrex.name = "Rex"\nrex.age = 3\nprint(rex.name)   # Rex\n```\n\nEach object has its own attributes — changing `rex.name` doesn\'t affect `fido`.'),
    mc('In `class Car:` … `my_car = Car()`, what is my_car?', ['The class', 'An object (instance) of Car', 'A function', 'A module'], 1, 'Calling the class makes a new object.'),
    mc('By convention, class names are written…', ['in_snake_case', 'InCapitalizedWords (CamelCase)', 'ALL_CAPS', 'with numbers'], 1, 'Classes use CamelCase: BankAccount, ShoppingCart.'),
    ans('What does this print?', ['Max'], 'Each object has its own name attribute.', 'class Pet:\n    pass\n\na = Pet()\nb = Pet()\na.name = "Max"\nb.name = "Bea"\nprint(a.name)'),
    py({
      prompt: 'Define an empty class `Book`. Create an object `b` from it, give it attributes `title = "Dune"` and `pages = 412`, and print `Dune has 412 pages` using an f-string.',
      expectedOutput: 'Dune has 412 pages',
      tests: [{ name: 'b is a Book', code: 'assert isinstance(b, Book)' }],
      hints: ['class Book:\n    pass', 'b = Book(); b.title = "Dune"; b.pages = 412'],
      solution: 'class Book:\n    pass\n\nb = Book()\nb.title = "Dune"\nb.pages = 412\nprint(f"{b.title} has {b.pages} pages")\n',
    }),
  ],

  // ------------------------------------------------------------------ py2-3-init-methods
  'py2-3-init-methods': [
    ex('__init__: setting up new objects', 'Setting attributes one by one is clumsy. `__init__` runs automatically when an object is created:\n\n```python\nclass Dog:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\nrex = Dog("Rex", 3)\nprint(rex.age)   # 3\n```\n\n`self` is the object being built. `self.name = name` stores the argument on that object.'),
    ex('Methods', 'Functions inside a class are **methods**. They always take `self` first, so they can use the object\'s data:\n\n```python\nclass Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return f"{self.name} says woof"\n\nprint(Dog("Rex").speak())   # Rex says woof\n```\n\nYou don\'t pass `self` yourself — Python does it.'),
    ans('What does this print?', ['6'], 'Counter starts at 5; increment adds 1.', 'class Counter:\n    def __init__(self, start):\n        self.value = start\n\n    def increment(self):\n        self.value += 1\n\nc = Counter(5)\nc.increment()\nprint(c.value)'),
    mc('What is `self`?', ['A keyword that does nothing', 'The specific object the method was called on', 'The class itself', 'A global variable'], 1, 'In rex.speak(), self is rex.'),
    ord('Order the lines of a class with a constructor and a method.', ['class Circle:', '    def __init__(self, r):', '        self.r = r', '    def area(self):', '        return 3.14 * self.r ** 2'], 'class line, then each method with its indented body.', 'python'),
    py({
      prompt: 'Create a class `BankAccount`:\n\n- `__init__(self, owner)` sets `owner` and starts `balance` at 0\n- `deposit(self, amount)` adds to the balance\n- `withdraw(self, amount)` subtracts, but raises `ValueError` if there isn\'t enough money',
      starter: 'class BankAccount:\n    pass\n',
      tests: [
        { name: 'new accounts start at 0', code: 'a = BankAccount("Ada")\nassert a.owner == "Ada" and a.balance == 0' },
        { name: 'deposit and withdraw', code: 'a = BankAccount("Ada")\na.deposit(100)\na.withdraw(30)\nassert a.balance == 70, f"balance should be 70, got {a.balance}"' },
        { name: 'overdraft raises ValueError', code: 'a = BankAccount("Bo")\na.deposit(10)\ntry:\n    a.withdraw(50)\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("withdrawing too much should raise ValueError")\nassert a.balance == 10, "a failed withdrawal must not change the balance"' },
        { name: 'accounts are independent', code: 'a, b = BankAccount("A"), BankAccount("B")\na.deposit(5)\nassert b.balance == 0' },
      ],
      hints: ['def __init__(self, owner): self.owner = owner; self.balance = 0', 'In withdraw: if amount > self.balance: raise ValueError("insufficient funds")'],
      solution: 'class BankAccount:\n    def __init__(self, owner):\n        self.owner = owner\n        self.balance = 0\n\n    def deposit(self, amount):\n        self.balance += amount\n\n    def withdraw(self, amount):\n        if amount > self.balance:\n            raise ValueError("insufficient funds")\n        self.balance -= amount\n',
    }),
    py({
      prompt: 'Create a class `Rectangle` with `__init__(self, width, height)` and two methods: `area()` and `perimeter()`.',
      starter: 'class Rectangle:\n    pass\n',
      tests: [eq('Rectangle(3, 4).area()', '12'), eq('Rectangle(3, 4).perimeter()', '14'), eq('Rectangle(5, 5).area()', '25')],
      hints: ['area = width × height; perimeter = 2 × (width + height)'],
      solution: 'class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\n    def perimeter(self):\n        return 2 * (self.width + self.height)\n',
    }),
  ],

  // ------------------------------------------------------------------ py2-3-inheritance
  'py2-3-inheritance': [
    ex('Is-a relationships', '**Inheritance** lets a class reuse another class and specialize it. A **subclass** gets everything from its **parent** class:\n\n```python\nclass Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return "..."\n\nclass Cat(Animal):          # Cat is an Animal\n    def speak(self):        # override the parent\'s version\n        return f"{self.name} says meow"\n\nprint(Cat("Tom").speak())   # Tom says meow\n```\n\nCat didn\'t write `__init__` — it inherited it.'),
    ans('What does this print?', ['...'], 'Bird doesn\'t override speak, so it uses Animal\'s version.', 'class Animal:\n    def speak(self):\n        return "..."\n\nclass Bird(Animal):\n    pass\n\nprint(Bird().speak())'),
    ex('super()', 'To **extend** (not replace) the parent\'s method, call it with `super()`:\n\n```python\nclass Student(Person):\n    def __init__(self, name, school):\n        super().__init__(name)   # let Person set up the name\n        self.school = school     # then add the extra part\n```'),
    mc('`isinstance(Cat("Tom"), Animal)` returns…', ['True — a Cat is an Animal', 'False — it\'s a Cat, not an Animal', 'An error'], 0, 'Subclass objects count as instances of the parent too.'),
    py({
      prompt: 'There\'s a `Shape` class. Make two subclasses:\n\n- `Square(side)` whose `area()` returns side²\n- `Circle(radius)` whose `area()` returns `3.14159 * radius ** 2`\n\nBoth should call `super().__init__(name)` with `"square"` / `"circle"`.',
      starter: 'class Shape:\n    def __init__(self, name):\n        self.name = name\n\n    def area(self):\n        return 0\n\n# your classes here\n',
      tests: [
        eq('Square(3).area()', '9'), { name: 'Circle(1).area() ≈ 3.14159', code: 'assert abs(Circle(1).area() - 3.14159) < 1e-9' },
        eq('Square(2).name', '"square"'), eq('Circle(2).name', '"circle"'),
        { name: 'both are Shapes', code: 'assert isinstance(Square(1), Shape) and isinstance(Circle(1), Shape)' },
        { name: 'uses super()', code: 'assert __source__.count("super().__init__") >= 2' },
      ],
      hints: ['class Square(Shape):\n    def __init__(self, side):\n        super().__init__("square")\n        self.side = side'],
      solution: 'class Shape:\n    def __init__(self, name):\n        self.name = name\n\n    def area(self):\n        return 0\n\nclass Square(Shape):\n    def __init__(self, side):\n        super().__init__("square")\n        self.side = side\n\n    def area(self):\n        return self.side ** 2\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        super().__init__("circle")\n        self.radius = radius\n\n    def area(self):\n        return 3.14159 * self.radius ** 2\n',
    }),
    mc('Which is the best use of inheritance?', ['Car inherits from Wheel', 'Manager inherits from Employee', 'Pizza inherits from Oven'], 1, 'Use inheritance for "is-a": a Manager is an Employee. A car HAS wheels (that\'s composition, not inheritance).'),
  ],

  // ------------------------------------------------------------------ py2-3-dunder
  'py2-3-dunder': [
    ex('Special ("dunder") methods', 'Methods with **d**ouble **under**scores let your objects work with Python\'s built-in features:\n\n- `__init__` — creating\n- `__str__` — what `print(obj)` and `str(obj)` show\n- `__repr__` — the developer-facing description\n- `__eq__` — what `==` means\n- `__len__` — what `len(obj)` returns\n- `__lt__` — what `<` means (lets `sorted` work)'),
    ex('__str__', 'Without it, printing an object shows something unhelpful like `<__main__.Point object at 0x7f…>`.\n\n```python\nclass Point:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __str__(self):\n        return f"({self.x}, {self.y})"\n\nprint(Point(2, 3))   # (2, 3)\n```'),
    ans('What does this print?', ['Ada (36)'], 'print uses __str__.', 'class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def __str__(self):\n        return f"{self.name} ({self.age})"\n\nprint(Person("Ada", 36))'),
    ex('__eq__', 'By default `==` on objects checks whether they\'re the **same object**, not whether they look alike:\n\n```python\nPoint(1, 2) == Point(1, 2)   # False by default!\n```\n\nDefine `__eq__` to compare their data:\n\n```python\n    def __eq__(self, other):\n        return self.x == other.x and self.y == other.y\n```'),
    py({
      prompt: 'Make a `Playlist` class: `__init__(self, name)` starts with an empty list `songs`; `add(song)` appends; `len(playlist)` returns the number of songs; and `str(playlist)` returns like `Road Trip (2 songs)`.',
      starter: 'class Playlist:\n    pass\n',
      tests: [
        { name: 'len() works', code: 'p = Playlist("Road Trip")\np.add("A")\np.add("B")\nassert len(p) == 2' },
        { name: 'str() works', code: 'p = Playlist("Road Trip")\np.add("A")\np.add("B")\nassert str(p) == "Road Trip (2 songs)", f"got {str(p)!r}"' },
        { name: 'empty playlist', code: 'assert len(Playlist("x")) == 0 and str(Playlist("x")) == "x (0 songs)"' },
      ],
      hints: ['def __len__(self): return len(self.songs)', 'def __str__(self): return f"{self.name} ({len(self.songs)} songs)"'],
      solution: 'class Playlist:\n    def __init__(self, name):\n        self.name = name\n        self.songs = []\n\n    def add(self, song):\n        self.songs.append(song)\n\n    def __len__(self):\n        return len(self.songs)\n\n    def __str__(self):\n        return f"{self.name} ({len(self.songs)} songs)"\n',
    }),
    py({
      prompt: 'Give `Money` an `__eq__` so two Money objects are equal when both `amount` and `currency` match.',
      starter: 'class Money:\n    def __init__(self, amount, currency):\n        self.amount = amount\n        self.currency = currency\n',
      tests: [eq('Money(5, "USD") == Money(5, "USD")', 'True'), eq('Money(5, "USD") == Money(5, "EUR")', 'False'), eq('Money(5, "USD") == Money(6, "USD")', 'False')],
      hints: ['def __eq__(self, other): return self.amount == other.amount and self.currency == other.currency'],
      solution: 'class Money:\n    def __init__(self, amount, currency):\n        self.amount = amount\n        self.currency = currency\n\n    def __eq__(self, other):\n        return self.amount == other.amount and self.currency == other.currency\n',
    }),
    fill('Complete the method so print(obj) shows a nice description.', 'def ___(self):\n    return f"Card: {self.rank}"', [['__str__']], '__str__ controls what print shows.', ['__str__', '__init__', '__print__', '__len__']),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'py2-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('int("hello") raises…', ['TypeError', 'ValueError', 'NameError'], 1, 'Right type (str), bad value.'),
      ans('What does this print?', ['no'], 'The ZeroDivisionError is caught.', 'try:\n    x = 1 / 0\n    print("yes")\nexcept ZeroDivisionError:\n    print("no")'),
      mc('Which block ALWAYS runs?', ['except', 'else', 'finally'], 2, 'finally.'),
      mc('Which open mode erases the file first?', ['"r"', '"a"', '"w"'], 2, '"w".'),
      py({ prompt: 'Write `parse_price(text)` that returns `float(text)`, or `0.0` if it can\'t be converted.', starter: 'def parse_price(text):\n    pass\n', tests: [eq('parse_price("4.99")', '4.99'), eq('parse_price("free")', '0.0')], solution: 'def parse_price(text):\n    try:\n        return float(text)\n    except ValueError:\n        return 0.0\n' }),
      py({ prompt: 'Write `check_age(age)` that returns `age`, but raises `ValueError` if it\'s below 0 or above 150.', starter: 'def check_age(age):\n    pass\n', tests: [eq('check_age(30)', '30'), raises('check_age(-1)', 'ValueError'), raises('check_age(200)', 'ValueError')], solution: 'def check_age(age):\n    if age < 0 or age > 150:\n        raise ValueError("bad age")\n    return age\n' }),
      py({ prompt: 'Write `count_lines(path)` that returns how many lines a text file has.', starter: 'def count_lines(path):\n    pass\n', tests: [{ name: 'counts lines', code: 'with open("__c.txt", "w") as __f:\n    __f.write("a\\nb\\nc\\n")\nassert count_lines("__c.txt") == 3' }], solution: 'def count_lines(path):\n    with open(path) as f:\n        return len(f.readlines())\n' }),
    ],
  },
  'py2-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('After `import math as m`, you call sqrt with…', ['sqrt(4)', 'm.sqrt(4)', 'math.sqrt(4)'], 1, 'The nickname is m.'),
      mc('random.randint(1, 10) can return 10?', ['Yes', 'No'], 0, 'Both ends are included.'),
      ans('What does this print?', ['3'], 'Counter counts the "b"s.', 'from collections import Counter\nprint(Counter("bubble")["b"])'),
      mc('Which is fast for adding/removing at BOTH ends?', ['list', 'deque', 'tuple'], 1, 'deque.'),
      mc('What does `if __name__ == "__main__":` protect?', ['Code that should only run when the file is run directly', 'Private variables', 'Imports'], 0, 'Not run on import.'),
      py({ prompt: 'Write `next_week(d)` that returns the date 7 days after the `date` d.', starter: 'from datetime import date, timedelta\n\ndef next_week(d):\n    pass\n', tests: [eq('next_week(date(2026, 12, 28))', 'date(2027, 1, 4)')], solution: 'from datetime import date, timedelta\n\ndef next_week(d):\n    return d + timedelta(days=7)\n' }),
      py({ prompt: 'Write `letter_counts(word)` that returns a **dict** of letter counts using `Counter`.', starter: 'from collections import Counter\n\ndef letter_counts(word):\n    pass\n', tests: [eq('letter_counts("aab")', '{"a": 2, "b": 1}'), { name: 'returns a dict', code: 'assert type(letter_counts("x")) is dict' }], solution: 'from collections import Counter\n\ndef letter_counts(word):\n    return dict(Counter(word))\n' }),
    ],
  },
  'py2-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('What is a class?', ['A blueprint for creating objects', 'A kind of loop', 'A module'], 0, 'Blueprint.'),
      mc('Which method runs when an object is created?', ['__str__', '__init__', '__new_object__', 'create'], 1, '__init__.'),
      mc('In a method, `self` refers to…', ['the class', 'the object the method was called on', 'the module'], 1, 'The object.'),
      ans('What does this print?', ['12'], '3 × 4.', 'class Box:\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n\n    def area(self):\n        return self.w * self.h\n\nprint(Box(3, 4).area())'),
      ans('What does this print?', ['woof'], 'Dog overrides sound.', 'class Animal:\n    def sound(self):\n        return "..."\n\nclass Dog(Animal):\n    def sound(self):\n        return "woof"\n\nprint(Dog().sound())'),
      mc('Which method controls what print(obj) shows?', ['__repr__ only', '__str__', '__print__'], 1, '__str__.'),
      py({ prompt: 'Create `Counter` with `__init__` (count starts at 0), `click()` adding 1, and `reset()` setting it back to 0.', starter: 'class Counter:\n    pass\n', tests: [{ name: 'click and reset', code: 'c = Counter()\nc.click(); c.click()\nassert c.count == 2\nc.reset()\nassert c.count == 0' }], solution: 'class Counter:\n    def __init__(self):\n        self.count = 0\n\n    def click(self):\n        self.count += 1\n\n    def reset(self):\n        self.count = 0\n' }),
      py({ prompt: 'Make `Teacher(Person)` that adds a `subject` attribute and calls `super().__init__(name)`.', starter: 'class Person:\n    def __init__(self, name):\n        self.name = name\n', tests: [{ name: 'Teacher works', code: 't = Teacher("Ada", "math")\nassert t.name == "Ada" and t.subject == "math" and isinstance(t, Person)' }, { name: 'uses super()', code: 'assert "super().__init__" in __source__' }], solution: 'class Person:\n    def __init__(self, name):\n        self.name = name\n\nclass Teacher(Person):\n    def __init__(self, name, subject):\n        super().__init__(name)\n        self.subject = subject\n' }),
    ],
  },
};
