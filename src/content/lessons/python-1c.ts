/**
 * Track: python-1 — "Python Basics"
 * Written here: py-5 (loops), py-6 (functions) + checkpoints
 */
import type { Checkpoint, Step } from '../types';
import { ans, eq, ex, fill, mc, ord, py } from './_helpers';

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ py-5-while
  'py-5-while': [
    ex('Doing things again and again', 'A **loop** repeats code. A `while` loop repeats **as long as its condition is True**:\n\n```python\ncount = 1\nwhile count <= 3:\n    print(count)\n    count = count + 1\nprint("Done")\n```\n\nOutput: `1`, `2`, `3`, then `Done`.', 'Same shape as if: a condition, a colon, and an indented block.'),
    ex('How it runs', 'Each time around (each **iteration**):\n\n- check the condition — if False, leave the loop\n- run the indented block\n- go back to the top\n\nWhen count becomes 4, `4 <= 3` is False, so the loop ends and `Done` prints.'),
    ans('How many numbers does this print?', ['5'], 'i goes 0, 1, 2, 3, 4 — five values. At 5 the condition is False.', 'i = 0\nwhile i < 5:\n    print(i)\n    i += 1'),
    mc('What is the danger in this code?', ['None', 'x never changes, so the loop never ends (an infinite loop)', 'It prints nothing'], 1, 'Nothing inside the loop changes x, so x < 10 stays True forever. In Loopwise your code is stopped after 8 seconds; on your own computer press Ctrl+C.', 'x = 1\nwhile x < 10:\n    print(x)'),
    py({
      prompt: 'Use a `while` loop to count down from 5 to 1 (one number per line), then print `Liftoff!`.',
      starter: 'n = 5\n',
      expectedOutput: '5\n4\n3\n2\n1\nLiftoff!',
      tests: [{ name: 'uses a while loop', code: 'assert "while" in __source__, "Use a while loop"' }],
      hints: ['while n > 0:', 'Inside: print(n), then n -= 1. After the loop (not indented): print("Liftoff!")'],
      solution: 'n = 5\nwhile n > 0:\n    print(n)\n    n -= 1\nprint("Liftoff!")\n',
    }),
    py({
      prompt: 'Starting from `money = 1`, keep **doubling** it while it is less than 100. Then print the final amount (it should be `128`).',
      starter: 'money = 1\n',
      expectedOutput: '128',
      hints: ['while money < 100:', '    money = money * 2', 'Print after the loop.'],
      solution: 'money = 1\nwhile money < 100:\n    money = money * 2\nprint(money)\n',
    }),
    mc('When should you use a while loop?', ['When you know exactly how many items to go through', 'When you repeat until something becomes true or false, and don\'t know how many times in advance', 'Never'], 1, '"Keep doubling until it passes 100" — you don\'t know the count ahead of time. That\'s while\'s job.'),
  ],

  // ------------------------------------------------------------------ py-5-for-range
  'py-5-for-range': [
    ex('for loops', 'A `for` loop goes through a sequence **one item at a time**. `range(n)` produces the numbers `0` up to `n - 1`:\n\n```python\nfor i in range(3):\n    print(i)\n```\n\nprints `0`, `1`, `2`. Each time around, `i` holds the next number.', 'Like slices, range stops BEFORE the end number.'),
    ans('What is the last number printed?', ['4'], 'range(5) is 0, 1, 2, 3, 4.', 'for i in range(5):\n    print(i)'),
    ex('Start, stop, step', '- `range(stop)` → 0 … stop-1\n- `range(start, stop)` → start … stop-1\n- `range(start, stop, step)` → counts by step\n\n```python\nrange(1, 6)       # 1 2 3 4 5\nrange(0, 10, 2)   # 0 2 4 6 8\nrange(5, 0, -1)   # 5 4 3 2 1\n```'),
    mc('Which range gives 1, 2, 3, 4, 5?', ['range(5)', 'range(1, 5)', 'range(1, 6)', 'range(0, 5)'], 2, 'Start at 1, stop before 6.'),
    ans('How many numbers are in range(0, 10, 3)?', ['4'], '0, 3, 6, 9 — four numbers (12 would be past the stop).'),
    ex('Looping over a string', '`for` works on anything that holds a sequence — including strings:\n\n```python\nfor letter in "hey":\n    print(letter)\n```\n\nprints `h`, `e`, `y` on separate lines.'),
    py({
      prompt: 'Use a `for` loop with `range` to print the numbers **1 to 5**, one per line.',
      expectedOutput: '1\n2\n3\n4\n5',
      tests: [{ name: 'uses for and range', code: 'assert "for" in __source__ and "range" in __source__, "Use for … in range(…)"' }],
      hints: ['for n in range(1, 6):', '    print(n)'],
      solution: 'for n in range(1, 6):\n    print(n)\n',
    }),
    py({
      prompt: 'Print the even numbers from **2 to 10** (2, 4, 6, 8, 10), one per line, using the **step** of range.',
      expectedOutput: '2\n4\n6\n8\n10',
      tests: [{ name: 'uses range with a step', code: 'assert "range(" in __source__, "Use range(start, stop, step)"' }],
      hints: ['range(2, 11, 2)'],
      solution: 'for n in range(2, 11, 2):\n    print(n)\n',
    }),
    py({
      prompt: 'Print each character of `word` on its own line.',
      starter: 'word = "loop"\n',
      expectedOutput: 'l\no\no\np',
      hints: ['for ch in word:'],
      solution: 'word = "loop"\nfor ch in word:\n    print(ch)\n',
    }),
  ],

  // ------------------------------------------------------------------ py-5-patterns
  'py-5-patterns': [
    ex('The accumulator', 'To add up many values, start a variable at 0 **before** the loop and add to it **inside** the loop:\n\n```python\ntotal = 0\nfor n in range(1, 5):\n    total += n\nprint(total)   # 10  (1+2+3+4)\n```\n\nThis pattern — the **accumulator** — is everywhere in programming.'),
    ans('What does this print?', ['15'], '1+2+3+4+5 = 15.', 'total = 0\nfor n in range(1, 6):\n    total += n\nprint(total)'),
    mc('What goes wrong here?', ['Nothing', 'total is reset to 0 every time around, so it ends as just the last number', 'It prints 0'], 1, 'total = 0 is inside the loop, so it restarts each iteration. Put it before the loop.', 'for n in range(1, 4):\n    total = 0\n    total += n\nprint(total)'),
    py({
      prompt: 'Add up all the numbers from **1 to 100** and print the total.',
      expectedOutput: '5050',
      tests: [{ name: 'uses a loop', code: 'assert "for" in __source__ or "while" in __source__, "Use a loop with an accumulator"' }],
      hints: ['total = 0 before the loop', 'for n in range(1, 101): total += n'],
      solution: 'total = 0\nfor n in range(1, 101):\n    total += n\nprint(total)\n',
    }),
    ex('The counter', 'A **counter** counts how many things match a condition — an accumulator that adds 1 inside an `if`:\n\n```python\ncount = 0\nfor n in range(1, 11):\n    if n % 2 == 0:\n        count += 1\nprint(count)   # 5\n```'),
    py({
      prompt: 'Count how many numbers from **1 to 30** are divisible by **3**, and print the count.',
      expectedOutput: '10',
      hints: ['count = 0, then loop over range(1, 31)', 'if n % 3 == 0: count += 1'],
      solution: 'count = 0\nfor n in range(1, 31):\n    if n % 3 == 0:\n        count += 1\nprint(count)\n',
    }),
    py({
      prompt: 'Count the vowels (a, e, i, o, u) in `text` and print the number.',
      starter: 'text = "programming is fun"\n',
      expectedOutput: '5',
      hints: ['Loop over each character.', 'if ch in "aeiou": … — `in` checks whether a character is inside a string.'],
      solution: 'text = "programming is fun"\ncount = 0\nfor ch in text:\n    if ch in "aeiou":\n        count += 1\nprint(count)\n',
    }),
    py({
      prompt: 'Build a string with every character of `word` in **reverse** order and print it. Don\'t use slicing — use a loop and an accumulator string that starts as `""`.',
      starter: 'word = "stressed"\n',
      expectedOutput: 'desserts',
      tests: [{ name: 'uses a loop, not [::-1]', code: 'assert "[::-1]" not in __source__, "Try it with a loop this time"' }],
      hints: ['result = ""', 'for ch in word: result = ch + result   (put each new letter in FRONT)'],
      solution: 'word = "stressed"\nresult = ""\nfor ch in word:\n    result = ch + result\nprint(result)\n',
    }),
  ],

  // ------------------------------------------------------------------ py-5-break-continue
  'py-5-break-continue': [
    ex('Leaving early: break', '`break` exits the loop **immediately**:\n\n```python\nfor n in range(1, 100):\n    if n * n > 50:\n        print(n)\n        break\n```\n\nprints `8` (8 × 8 = 64 is the first square above 50) and stops.'),
    ans('What does this print?', ['1\n2', '1 2', '1, 2'], 'When n is 3 the loop breaks before printing.', 'for n in range(1, 6):\n    if n == 3:\n        break\n    print(n)'),
    ex('Skipping a turn: continue', '`continue` skips the **rest of this iteration** and jumps to the next one:\n\n```python\nfor n in range(1, 6):\n    if n == 3:\n        continue\n    print(n)\n```\n\nprints 1, 2, 4, 5 — 3 is skipped.'),
    mc('break vs continue?', ['Both end the loop', 'break ends the whole loop; continue skips to the next iteration', 'continue ends the loop; break skips one'], 1, 'Remember: break = get out; continue = next please.'),
    py({
      prompt: 'Find and print the **first** number greater than 50 that is divisible by 7. Use a loop and `break`.',
      expectedOutput: '56',
      tests: [{ name: 'uses break', code: 'assert "break" in __source__, "Use break to stop at the first match"' }],
      hints: ['for n in range(51, 100):', 'if n % 7 == 0: print(n) then break'],
      solution: 'for n in range(51, 100):\n    if n % 7 == 0:\n        print(n)\n        break\n',
    }),
    py({
      prompt: 'Print the numbers 1 to 10, **skipping** multiples of 3. Use `continue`.',
      expectedOutput: '1\n2\n4\n5\n7\n8\n10',
      tests: [{ name: 'uses continue', code: 'assert "continue" in __source__, "Use continue to skip"' }],
      hints: ['if n % 3 == 0: continue'],
      solution: 'for n in range(1, 11):\n    if n % 3 == 0:\n        continue\n    print(n)\n',
    }),
    ex('while True + break', 'A common pattern: loop "forever" and `break` when you\'re done.\n\n```python\nn = 1\nwhile True:\n    n *= 3\n    if n > 100:\n        break\nprint(n)   # 243\n```'),
  ],

  // ------------------------------------------------------------------ py-5-nested
  'py-5-nested': [
    ex('Loops inside loops', 'A loop can contain another loop. The **inner** loop runs completely for **each** turn of the outer loop:\n\n```python\nfor row in range(1, 3):\n    for col in range(1, 4):\n        print(row, col)\n```\n\nprints 6 lines: `1 1`, `1 2`, `1 3`, `2 1`, `2 2`, `2 3`.', 'print(a, b) prints the values separated by a space.'),
    ans('How many lines does a loop of range(4) nested inside a loop of range(5) print (one print inside)?', ['20'], '5 outer turns × 4 inner turns = 20.'),
    ex('Printing on one line', 'By default print ends with a new line. `end=""` changes that:\n\n```python\nprint("a", end="")\nprint("b")\n# ab\n```\n\nThis lets inner loops build up a row before moving to the next line.'),
    ans('What does this print?', ['***'], 'Each print adds a * without a new line; the final print() ends the line.', 'for i in range(3):\n    print("*", end="")\nprint()'),
    py({
      prompt: 'Print this triangle using nested loops (or string repetition inside one loop):\n\n```\n*\n**\n***\n****\n```',
      expectedOutput: '*\n**\n***\n****',
      tests: [{ name: 'uses a loop', code: 'assert "for" in __source__ or "while" in __source__' }],
      hints: ['for row in range(1, 5):', 'print("*" * row) — or an inner loop with end=""'],
      solution: 'for row in range(1, 5):\n    print("*" * row)\n',
    }),
    py({
      prompt: 'Print the multiplication table for 1–3 like this (numbers separated by single spaces):\n\n```\n1 2 3\n2 4 6\n3 6 9\n```',
      expectedOutput: '1 2 3\n2 4 6\n3 6 9',
      hints: ['Outer loop: row in range(1, 4). Inner: col in range(1, 4).', 'Inner: print(row * col, end=" "), then print() after the inner loop. Trailing spaces are OK.'],
      solution: 'for row in range(1, 4):\n    for col in range(1, 4):\n        print(row * col, end=" ")\n    print()\n',
    }),
  ],

  // ------------------------------------------------------------------ py-6-def
  'py-6-def': [
    ex('Name a piece of code', 'A **function** is a named block of code you can run whenever you want. You\'ve used built-in ones: `print`, `len`, `round`. Now make your own with `def`:\n\n```python\ndef greet():\n    print("Hello!")\n    print("Welcome to Loopwise")\n\ngreet()\ngreet()\n```\n\n`def` **defines** the function (nothing runs yet). `greet()` **calls** it — the body runs each time.'),
    ans('How many times is "Hello!" printed by the code above?', ['2'], 'The function is called twice.'),
    mc('What does this print?', ['Hi', 'Nothing', 'An error'], 1, 'The function is defined but never called — defining doesn\'t run it.', 'def say_hi():\n    print("Hi")'),
    ex('Why functions?', '- **Reuse**: write once, use many times\n- **Organize**: name each step of a big problem (remember decomposition?)\n- **Fix once**: a bug fixed inside the function is fixed everywhere\n\nRules: define **before** you call; parentheses are required to call (`greet` alone doesn\'t run it).'),
    ord('Arrange a function that prints two lines, then call it.', ['def cheer():', '    print("Go")', '    print("Team!")', 'cheer()'], 'def line, indented body, then the call (not indented).', 'python'),
    py({
      prompt: 'Define a function `banner()` that prints `=====` then `LOOPWISE` then `=====` (3 lines). Then **call it once**.',
      expectedOutput: '=====\nLOOPWISE\n=====',
      tests: [{ name: 'defines banner()', code: 'assert callable(banner), "Define a function named banner"' }],
      hints: ['def banner():', 'Indent the three prints. Then, unindented: banner()'],
      solution: 'def banner():\n    print("=====")\n    print("LOOPWISE")\n    print("=====")\n\nbanner()\n',
    }),
    mc('What\'s the difference between `greet` and `greet()`?', ['None', 'greet() calls (runs) the function; greet just refers to it', 'greet runs it; greet() deletes it'], 1, 'The parentheses mean "run it now".'),
  ],

  // ------------------------------------------------------------------ py-6-parameters
  'py-6-parameters': [
    ex('Giving functions information', 'A **parameter** is a variable in the function definition that receives a value. The value you pass in is the **argument**:\n\n```python\ndef greet(name):          # name is a parameter\n    print(f"Hi, {name}!")\n\ngreet("Ada")              # "Ada" is the argument\ngreet("Linus")\n```\n\nprints `Hi, Ada!` then `Hi, Linus!`.'),
    ans('What does this print?', ['Hi, Sam!'], 'name receives "Sam".', 'def greet(name):\n    print(f"Hi, {name}!")\n\ngreet("Sam")'),
    ex('Several parameters', 'Separate parameters with commas. Arguments are matched **in order**:\n\n```python\ndef describe(animal, sound):\n    print(f"The {animal} says {sound}")\n\ndescribe("cow", "moo")    # The cow says moo\ndescribe("moo", "cow")    # The moo says cow  (oops!)\n```'),
    ans('What does this print?', ['5'], 'a gets 8, b gets 3; 8 - 3 = 5.', 'def diff(a, b):\n    print(a - b)\n\ndiff(8, 3)'),
    mc('What happens with too few arguments?', ['It uses 0', 'TypeError: missing 1 required positional argument', 'It works fine'], 1, 'Python insists every parameter gets a value (unless it has a default — coming soon).', 'def add(a, b):\n    print(a + b)\n\nadd(1)'),
    py({
      prompt: 'Define `introduce(name, city)` that prints `I\'m NAME from CITY`. Then call it with `"Ada"` and `"London"`.',
      expectedOutput: "I'm Ada from London",
      tests: [{ name: 'introduce works for other values', code: 'import io, contextlib\n__b = io.StringIO()\nwith contextlib.redirect_stdout(__b):\n    introduce("Sam", "Lansing")\nassert __b.getvalue().strip() == "I\'m Sam from Lansing", f"introduce(\\"Sam\\", \\"Lansing\\") printed {__b.getvalue().strip()!r}"' }],
      hints: ['def introduce(name, city):', '    print(f"I\'m {name} from {city}")', 'introduce("Ada", "London")'],
      solution: 'def introduce(name, city):\n    print(f"I\'m {name} from {city}")\n\nintroduce("Ada", "London")\n',
    }),
    py({
      prompt: 'Define `box(width)` that prints a row of `#` characters `width` long. Call `box(3)` then `box(6)`.',
      expectedOutput: '###\n######',
      hints: ['"#" * width'],
      solution: 'def box(width):\n    print("#" * width)\n\nbox(3)\nbox(6)\n',
    }),
  ],

  // ------------------------------------------------------------------ py-6-return
  'py-6-return': [
    ex('Getting an answer back', '`print` only **shows** a value. `return` **sends a value back** to whoever called the function, so you can store it and use it:\n\n```python\ndef square(n):\n    return n * n\n\nresult = square(4)\nprint(result + 1)   # 17\n```', 'Most useful functions return something. Printing is just for showing people.'),
    ans('What does this print?', ['10'], 'double(5) returns 10, which is printed.', 'def double(x):\n    return x * 2\n\nprint(double(5))'),
    ex('return ends the function', 'As soon as `return` runs, the function stops — lines after it never run.\n\nA function with **no** return gives back the special value `None` ("nothing"):\n\n```python\ndef shout(text):\n    print(text.upper())\n\nx = shout("hi")   # prints HI\nprint(x)          # None\n```'),
    mc('What does the last line print?', ['7', 'None', 'An error'], 1, 'add prints 7, but it doesn\'t return anything, so total is None.', 'def add(a, b):\n    print(a + b)\n\ntotal = add(3, 4)\nprint(total)'),
    py({
      prompt: 'Write `area(width, height)` that **returns** the area of a rectangle (width × height). Don\'t print inside the function.',
      starter: 'def area(width, height):\n    pass  # replace this line\n',
      tests: [eq('area(3, 4)', '12'), eq('area(10, 2)', '20'), eq('area(0, 5)', '0')],
      hints: ['return width * height'],
      solution: 'def area(width, height):\n    return width * height\n',
    }),
    py({
      prompt: 'Write `is_adult(age)` that returns `True` if age is 18 or more, otherwise `False`.',
      starter: 'def is_adult(age):\n    pass\n',
      tests: [eq('is_adult(18)', 'True'), eq('is_adult(17)', 'False'), eq('is_adult(40)', 'True')],
      hints: ['You can return a comparison directly: return age >= 18'],
      solution: 'def is_adult(age):\n    return age >= 18\n',
    }),
    py({
      prompt: 'Write `biggest(a, b, c)` that returns the largest of three numbers **without using max()**.',
      starter: 'def biggest(a, b, c):\n    pass\n',
      tests: [eq('biggest(1, 2, 3)', '3'), eq('biggest(9, 2, 3)', '9'), eq('biggest(1, 7, 3)', '7'), eq('biggest(-5, -2, -9)', '-2'), { name: 'does not use max()', code: 'assert "max(" not in __source__, "Solve it with if statements"' }],
      hints: ['Start with best = a', 'if b > best: best = b … same for c, then return best'],
      solution: 'def biggest(a, b, c):\n    best = a\n    if b > best:\n        best = b\n    if c > best:\n        best = c\n    return best\n',
    }),
  ],

  // ------------------------------------------------------------------ py-6-scope
  'py-6-scope': [
    ex('Where variables live', 'Variables created **inside** a function are **local**: they exist only while the function runs and can\'t be seen outside.\n\n```python\ndef make_total():\n    total = 99\n\nmake_total()\nprint(total)   # NameError: name \'total\' is not defined\n```\n\nThat\'s a feature: functions can\'t accidentally mess with each other\'s variables.'),
    mc('Why does this crash?', ['secret is local to hide(), so it doesn\'t exist outside', 'print is misspelled', 'Functions can\'t contain variables'], 0, 'Return the value instead if the outside needs it.', 'def hide():\n    secret = 42\n\nhide()\nprint(secret)'),
    ex('Reading outer variables', 'A function **can read** variables defined outside it (called **global** variables):\n\n```python\nrate = 0.1\ndef tax(price):\n    return price * rate\n```\n\nBut the clean way to give a function information is through **parameters**, and to get information out is with **return**.'),
    ans('What does this print?', ['5'], 'The x inside f is a separate local variable. The outside x is still 5.', 'x = 5\ndef f():\n    x = 100\n\nf()\nprint(x)'),
    py({
      prompt: 'This code crashes with a NameError because `result` only exists inside the function. Fix it: make `add_tax` **return** its result, and store what it returns in a variable so the last line prints `110.0`.',
      starter: 'def add_tax(price):\n    result = price + price * 0.1\n\nadd_tax(100)\nprint(result)\n',
      expectedOutput: '110.0',
      tests: [eq('add_tax(50)', '55.0', 'add_tax(50) returns 55.0')],
      hints: ['Add `return result` as the last line inside the function.', 'Then change the call to: result = add_tax(100)'],
      solution: 'def add_tax(price):\n    result = price + price * 0.1\n    return result\n\nresult = add_tax(100)\nprint(result)\n',
    }),
  ],

  // ------------------------------------------------------------------ py-6-defaults
  'py-6-defaults': [
    ex('Default values', 'A parameter can have a **default** — used when no argument is given:\n\n```python\ndef greet(name, greeting="Hello"):\n    print(f"{greeting}, {name}!")\n\ngreet("Ada")              # Hello, Ada!\ngreet("Ada", "Welcome")   # Welcome, Ada!\n```\n\nParameters with defaults must come **after** those without.'),
    ans('What does this print?', ['9'], 'exp defaults to 2, so 3 ** 2 = 9.', 'def power(base, exp=2):\n    return base ** exp\n\nprint(power(3))'),
    ans('What does this print?', ['27'], 'exp is given as 3: 3 ** 3 = 27.', 'def power(base, exp=2):\n    return base ** exp\n\nprint(power(3, 3))'),
    ex('Keyword arguments', 'You can name arguments when calling. Then order doesn\'t matter:\n\n```python\ndef describe(animal, sound):\n    print(f"The {animal} says {sound}")\n\ndescribe(sound="moo", animal="cow")   # The cow says moo\n```\n\nYou\'ve already seen one: `print("a", end="")`.'),
    mc('Which call prints "The dog says woof"?', ['describe("woof", "dog")', 'describe(sound="woof", animal="dog")', 'describe(dog, woof)'], 1, 'Named arguments go to the matching parameters, whatever the order.'),
    py({
      prompt: 'Write `repeat(text, times=2)` that **returns** `text` repeated `times` times, joined by single spaces. `repeat("hi")` → `"hi hi"`; `repeat("go", 3)` → `"go go go"`.',
      starter: 'def repeat(text, times=2):\n    pass\n',
      tests: [eq('repeat("hi")', '"hi hi"'), eq('repeat("go", 3)', '"go go go"'), eq('repeat("x", 1)', '"x"')],
      hints: ['One way: " ".join([text] * times)', 'Or build a string in a loop, adding a space between words.'],
      solution: 'def repeat(text, times=2):\n    return " ".join([text] * times)\n',
    }),
    fill('Give `size` a default value of 10.', 'def make_grid(size___):\n    return size * size', [['=10', '= 10']], 'A default is written with = right after the parameter name.', ['=10', '==10', ':10', '(10)']),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'py-5': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('What numbers does range(2, 6) produce? (separate with spaces)', ['2 3 4 5', '2, 3, 4, 5', '2,3,4,5'], 'Start 2, stop before 6.'),
      ans('What does this print?', ['6'], '1+2+3.', 'total = 0\nfor n in range(1, 4):\n    total += n\nprint(total)'),
      ans('How many times does "x" print?', ['3'], 'i = 0, 1, 2.', 'i = 0\nwhile i < 3:\n    print("x")\n    i += 1'),
      mc('Which keyword skips to the next iteration?', ['break', 'continue', 'pass', 'return'], 1, 'continue.'),
      mc('Which keyword leaves a loop immediately?', ['break', 'continue', 'skip'], 0, 'break.'),
      ans('How many lines are printed by a range(3) loop nested inside a range(3) loop, with one print in the inner loop?', ['9'], '3 × 3.'),
      py({ prompt: 'Print the squares of 1 to 5 (1, 4, 9, 16, 25), one per line.', expectedOutput: '1\n4\n9\n16\n25', solution: 'for n in range(1, 6):\n    print(n * n)\n' }),
      py({ prompt: 'Add up the **odd** numbers from 1 to 99 and print the total.', expectedOutput: '2500', solution: 'total = 0\nfor n in range(1, 100, 2):\n    total += n\nprint(total)\n' }),
      py({ prompt: 'Print how many times the letter `s` appears in `text`.', starter: 'text = "mississippi"\n', expectedOutput: '4', tests: [{ name: 'does not use .count()', code: 'assert ".count(" not in __source__, "Use a loop and a counter"' }], solution: 'text = "mississippi"\ncount = 0\nfor ch in text:\n    if ch == "s":\n        count += 1\nprint(count)\n' }),
    ],
  },
  'py-6': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Which keyword creates a function?', ['func', 'def', 'function', 'fn'], 1, 'def.'),
      mc('A function with no return statement gives back…', ['0', '""', 'None', 'an error'], 2, 'None.'),
      ans('What does this print?', ['7'], '3 + 4.', 'def add(a, b):\n    return a + b\n\nprint(add(3, 4))'),
      ans('What does this print?', ['Hey, Bo'], 'greeting defaults to "Hey".', 'def hi(name, greeting="Hey"):\n    return f"{greeting}, {name}"\n\nprint(hi("Bo"))'),
      mc('Variables created inside a function are…', ['global', 'local', 'permanent'], 1, 'Local.'),
      py({ prompt: 'Write `celsius(f)` that returns `(f - 32) * 5 / 9`.', starter: 'def celsius(f):\n    pass\n', tests: [eq('celsius(212)', '100.0'), eq('celsius(32)', '0.0')], solution: 'def celsius(f):\n    return (f - 32) * 5 / 9\n' }),
      py({ prompt: 'Write `count_down(n)` that **prints** n, n-1, … 1 (one per line). Then call `count_down(3)`.', expectedOutput: '3\n2\n1', tests: [{ name: 'count_down(2) prints 2, 1', code: 'import io, contextlib\n__b = io.StringIO()\nwith contextlib.redirect_stdout(__b):\n    count_down(2)\nassert __b.getvalue().split() == ["2", "1"]' }], solution: 'def count_down(n):\n    for i in range(n, 0, -1):\n        print(i)\n\ncount_down(3)\n' }),
      py({ prompt: 'Write `sum_to(n)` that **returns** 1 + 2 + … + n.', starter: 'def sum_to(n):\n    pass\n', tests: [eq('sum_to(4)', '10'), eq('sum_to(100)', '5050'), eq('sum_to(1)', '1')], solution: 'def sum_to(n):\n    total = 0\n    for i in range(1, n + 1):\n        total += i\n    return total\n' }),
    ],
  },
};

