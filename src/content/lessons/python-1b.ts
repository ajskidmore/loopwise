/**
 * Track: python-1 — "Python Basics"
 * Written here: py-3 (strings), py-4 (decisions) + checkpoints
 */
import type { Checkpoint, Step } from '../types';
import { ans, ex, fill, mc, ord, py, rerun } from './_helpers';

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ py-3-strings
  'py-3-strings': [
    ex('Strings are text', 'A **string** (`str`) is a piece of text. Put it in **single or double quotes** — both work, as long as they match:\n\n```python\ngreeting = "Hello"\nname = \'Ada\'\n```\n\nNeed a quote mark inside? Use the other kind outside: `"It\'s fine"`.'),
    mc('Which is NOT a valid string?', ['"hello"', "'hello'", '"hello\'', '"it\'s"'], 2, 'The quotes must match: it opens with " but closes with \'.'),
    ex('Joining strings', 'Use `+` to **concatenate** (join) strings. Python adds no spaces for you:\n\n```python\nfirst = "Ada"\nlast = "Lovelace"\nprint(first + " " + last)   # Ada Lovelace\n```\n\nUse `*` to repeat: `"ha" * 3` → `hahaha`.'),
    ans('What does this print?', ['hotdog'], '+ joins with no space in between.', 'print("hot" + "dog")'),
    ans('What does this print?', ['-----'], '"-" repeated 5 times.', 'print("-" * 5)'),
    ex('How long is it?', '`len()` counts the characters in a string — **spaces and punctuation count too**:\n\n```python\nprint(len("cat"))      # 3\nprint(len("hi there")) # 8\nprint(len(""))         # 0  (the empty string)\n```'),
    ans('What does len("Hello!") return?', ['6'], 'H-e-l-l-o-! is 6 characters.'),
    py({
      prompt: 'Variables `first` and `last` hold a name. Print the full name with **one space** between them: `Grace Hopper`.',
      starter: 'first = "Grace"\nlast = "Hopper"\n',
      expectedOutput: 'Grace Hopper',
      tests: [{ name: 'uses the variables', code: 'assert "first" in __source__.split("print", 1)[-1] and "last" in __source__.split("print", 1)[-1], "Use first and last inside print"' }],
      hints: ['Join three pieces: first, a space " ", and last.', 'print(first + " " + last)'],
      solution: 'first = "Grace"\nlast = "Hopper"\nprint(first + " " + last)\n',
    }),
    ex('Special characters', 'A backslash starts an **escape sequence**:\n\n- `\\n` — new line\n- `\\t` — tab\n- `\\"` — a quote inside a double-quoted string\n\n```python\nprint("one\\ntwo")\n```\nprints `one` and `two` on separate lines.'),
    py({
      prompt: 'Using **a single print**, print these two lines:\n\n```\nLine 1\nLine 2\n```',
      starter: '',
      expectedOutput: 'Line 1\nLine 2',
      tests: [{ name: 'only one print', code: 'assert __source__.count("print") == 1, "Use just one print with \\\\n inside"' }],
      hints: ['Put \\n in the middle of the string.', 'print("Line 1\\nLine 2")'],
      solution: 'print("Line 1\\nLine 2")\n',
    }),
  ],

  // ------------------------------------------------------------------ py-3-fstrings
  'py-3-fstrings': [
    ex('The easy way to mix text and values', 'Joining with `+` gets messy, and numbers need `str()`. **f-strings** fix that: put an `f` before the quotes and variables inside `{ }`:\n\n```python\nname = "Sam"\nage = 30\nprint(f"{name} is {age} years old")\n# Sam is 30 years old\n```', 'f stands for "formatted". It\'s the modern, preferred way.'),
    ans('What does this print?', ['I have 3 cats'], 'The {count} is replaced by the value 3.', 'count = 3\nprint(f"I have {count} cats")'),
    mc('What does this print?', ['Hi, {name}', 'Hi, Ana', 'Hi, name', 'An error'], 0, 'Without the f in front, the braces are just ordinary text.', 'name = "Ana"\nprint("Hi, {name}")'),
    ex('Expressions inside braces', 'You can put any expression in the braces:\n\n```python\nprice = 4\nqty = 3\nprint(f"Total: {price * qty}")   # Total: 12\n```\n\nAnd you can format numbers: `{value:.2f}` shows **2 decimal places**.\n\n```python\nprint(f"{3.14159:.2f}")   # 3.14\n```'),
    ans('What does this print?', ['Total: 7.50'], ':.2f shows exactly two decimal places, so 7.5 becomes 7.50.', 'cost = 7.5\nprint(f"Total: {cost:.2f}")'),
    fill('Complete the f-string so it prints Score: 10', 'score = 10\nprint(___"Score: {score}")', [['f']], 'An f right before the opening quote turns on the {} replacement.', ['f', 's', 'str', '$']),
    py({
      prompt: 'Use an **f-string** to print `Pip is 2 years old` using the variables below.',
      starter: 'name = "Pip"\nage = 2\n',
      expectedOutput: 'Pip is 2 years old',
      tests: [{ name: 'uses an f-string', code: 'assert \'f"\' in __source__ or "f\'" in __source__, "Use an f-string: f\\"...\\""' }],
      hints: ['print(f"...") with {name} and {age} inside.'],
      solution: 'name = "Pip"\nage = 2\nprint(f"{name} is {age} years old")\n',
    }),
    py({
      prompt: 'A meal costs `29.0` and you leave an 18% tip. Print `Tip: $5.22` — the tip rounded to 2 decimals with an f-string.',
      starter: 'meal = 29.0\n',
      expectedOutput: 'Tip: $5.22',
      hints: ['The tip is meal * 0.18 (= 5.22).', 'print(f"Tip: ${meal * 0.18:.2f}")'],
      solution: 'meal = 29.0\nprint(f"Tip: ${meal * 0.18:.2f}")\n',
    }),
  ],

  // ------------------------------------------------------------------ py-3-indexing
  'py-3-indexing': [
    ex('Every character has a position', 'Each character in a string has a numbered position called an **index**. Python counts from **0**:\n\n```text\n P  y  t  h  o  n\n 0  1  2  3  4  5\n```\n\nUse square brackets to grab one: `"Python"[0]` → `P`.', 'Counting from 0 feels odd at first. Nearly every language does it, so it\'s worth getting used to now.'),
    ans('What is "Python"[1]?', ['y'], 'Index 0 is P, index 1 is y.'),
    ans('What is "hello"[4]?', ['o'], 'h=0, e=1, l=2, l=3, o=4.'),
    ex('Counting from the end', 'Negative indexes count from the end: `-1` is the last character, `-2` the one before it.\n\n```python\nword = "Python"\nprint(word[-1])   # n\nprint(word[-2])   # o\n```\n\nAsking for an index that doesn\'t exist (like `word[10]`) gives an **IndexError**.'),
    ans('What is "coffee"[-1]?', ['e'], '-1 is always the last character.'),
    ex('Slicing', 'A **slice** takes a piece: `text[start:stop]` — from `start` up to **but not including** `stop`.\n\n```python\nword = "Python"\nword[0:3]   # "Pyt"  (indexes 0, 1, 2)\nword[2:]    # "thon" (2 to the end)\nword[:2]    # "Py"   (start to 2)\n```'),
    ans('What is "Python"[1:4]?', ['yth'], 'Indexes 1, 2 and 3 → y, t, h. The stop index 4 is not included.'),
    mc('What is "banana"[:3]?', ['ban', 'bana', 'nan', 'ana'], 0, 'From the start up to (not including) index 3: b, a, n.'),
    py({
      prompt: 'Print the **first letter** of `name`, then on the next line print its **last letter**.',
      starter: 'name = "Lovelace"\n',
      expectedOutput: 'L\ne',
      hints: ['First is name[0]. Last is name[-1].'],
      solution: 'name = "Lovelace"\nprint(name[0])\nprint(name[-1])\n',
    }),
    py({
      prompt: 'The variable `date` holds `"2026-11-11"`. Use a slice to print just the year: `2026`.',
      starter: 'date = "2026-11-11"\n',
      expectedOutput: '2026',
      tests: [{ name: 'uses a slice', code: 'assert "date[" in __source__, "Slice the date variable, like date[0:4]"' }],
      hints: ['The year is indexes 0 to 3.', 'print(date[0:4])  or  print(date[:4])'],
      solution: 'date = "2026-11-11"\nprint(date[:4])\n',
    }),
  ],

  // ------------------------------------------------------------------ py-3-methods
  'py-3-methods': [
    ex('Strings come with tools', 'A **method** is a function that belongs to a value. Call it with a dot:\n\n```python\nname = "ada"\nprint(name.upper())   # ADA\n```\n\nCommon string methods:\n\n- `.upper()` / `.lower()` — change case\n- `.strip()` — remove spaces from both ends\n- `.replace(old, new)` — swap text\n- `.split(sep)` — break into a list of pieces\n- `.startswith(x)` / `.endswith(x)` — True or False'),
    ans('What does this print?', ['HELLO'], '.upper() makes every letter uppercase.', 'print("Hello".upper())'),
    ans('What does this print?', ['I like cats'], 'replace swaps every "dogs" for "cats".', 'print("I like dogs".replace("dogs", "cats"))'),
    mc('What does "  hi  ".strip() return?', ['"  hi  "', '"hi"', '"hi  "', '"  hi"'], 1, 'strip() removes whitespace from both ends (not the middle).'),
    ex('Strings never change', 'Methods **return a new string**. The original stays the same — strings are **immutable**:\n\n```python\nname = "ada"\nname.upper()\nprint(name)          # ada   (unchanged!)\nname = name.upper()\nprint(name)          # ADA\n```\n\nTo keep the result, store it.'),
    mc('What does this print?', ['PIP', 'pip', 'Pip', 'An error'], 1, 'name.upper() made a new string, but it was never stored. name is still "pip".', 'name = "pip"\nname.upper()\nprint(name)'),
    ex('split', '`split` breaks a string into a **list** of pieces:\n\n```python\n"a,b,c".split(",")       # [\'a\', \'b\', \'c\']\n"one two three".split()  # [\'one\', \'two\', \'three\']\n```\n\nWith no argument it splits on spaces. (Lists are coming in Unit 7.)'),
    ans('How many pieces does "red,green,blue".split(",") produce?', ['3'], 'Splitting at each comma gives red, green, blue.'),
    py({
      prompt: 'Someone typed their email messily. Clean it up: remove the spaces at both ends **and** make it lowercase, then print it. Expected: `ada@example.com`',
      starter: 'email = "   Ada@Example.COM  "\n',
      expectedOutput: 'ada@example.com',
      hints: ['You can chain methods: email.strip().lower()'],
      solution: 'email = "   Ada@Example.COM  "\nprint(email.strip().lower())\n',
    }),
    py({
      prompt: 'Print `True` if `filename` ends with `.py`, using a string method.',
      starter: 'filename = "game.py"\n',
      expectedOutput: 'True',
      tests: [{ name: 'uses endswith', code: 'assert "endswith" in __source__, "Use filename.endswith(...)"' }],
      hints: ['print(filename.endswith(".py"))'],
      solution: 'filename = "game.py"\nprint(filename.endswith(".py"))\n',
    }),
  ],

  // ------------------------------------------------------------------ py-4-booleans
  'py-4-booleans': [
    ex('True or False', 'A **boolean** (`bool`) has only two possible values: `True` and `False` (capital T and F!).\n\nYou get booleans by **comparing** things:\n\n| Operator | Means |\n|---|---|\n| `==` | equal to |\n| `!=` | not equal to |\n| `<` / `>` | less / greater than |\n| `<=` / `>=` | less / greater than or equal |'),
    ans('What does print(5 > 3) show?', ['True'], '5 is greater than 3.'),
    ans('What does print(4 == 5) show?', ['False'], '4 is not equal to 5.'),
    ex('= vs ==', '**This is the #1 beginner mix-up:**\n\n- `=` **assigns**: `x = 5` puts 5 into x\n- `==` **compares**: `x == 5` asks "is x equal to 5?" and gives True/False'),
    mc('Which line ASKS whether score equals 100?', ['score = 100', 'score == 100', 'score := 100', 'score === 100'], 1, '== compares. = assigns.'),
    ans('What does this print?', ['True'], '7 is not equal to 3, so != gives True.', 'print(7 != 3)'),
    mc('What does "apple" == "Apple" give?', ['True', 'False'], 1, 'String comparison is case-sensitive: "a" and "A" are different characters.'),
    ans('What does this print?', ['True'], '10 >= 10 is True because they are equal.', 'age = 10\nprint(age >= 10)'),
    py({
      prompt: 'Store whether `temp` is **below 32** in a variable called `freezing`, then print it.',
      starter: 'temp = 25\n',
      expectedOutput: 'True',
      tests: [{ name: 'freezing is a bool', code: 'assert isinstance(freezing, bool), "freezing should be True or False (use a comparison)"' }],
      hints: ['freezing = temp < 32'],
      solution: 'temp = 25\nfreezing = temp < 32\nprint(freezing)\n',
    }),
  ],

  // ------------------------------------------------------------------ py-4-if
  'py-4-if': [
    ex('Making decisions', 'An `if` statement runs code **only when a condition is True**:\n\n```python\ntemp = 95\nif temp > 90:\n    print("It\'s hot!")\nprint("Done")\n```\n\nTwo rules:\n\n- the `if` line ends with a **colon** `:`\n- the code inside is **indented** (4 spaces)', 'Indentation isn\'t decoration in Python — it decides what\'s inside the if.'),
    ans('What does this print if temp is 70? (just the output)', ['Done'], '70 > 90 is False, so the indented line is skipped. "Done" isn\'t indented, so it always runs.', 'if temp > 90:\n    print("It\'s hot!")\nprint("Done")'),
    ex('else', '`else` gives the code to run when the condition is **False**:\n\n```python\nage = 15\nif age >= 18:\n    print("You can vote")\nelse:\n    print("Not yet")\n```\n\nExactly one of the two blocks runs — never both.'),
    ans('What does this print?', ['Not yet'], '15 >= 18 is False, so the else block runs.', 'age = 15\nif age >= 18:\n    print("You can vote")\nelse:\n    print("Not yet")'),
    mc('What\'s wrong with this code?', ['Nothing', 'The if line is missing a colon', 'print needs to be capitalized', 'x must be in quotes'], 1, 'Every if (and else) line must end with a colon. Without it you get a SyntaxError.', 'if x > 5\n    print("big")'),
    ord('Arrange the lines into a working if/else.', ['if score >= 60:', '    print("Pass")', 'else:', '    print("Try again")'], 'if line, its indented block, then else and its indented block.', 'python'),
    py({
      prompt: 'If `balance` is **less than 0**, print `Overdrawn`. Otherwise print `OK`.',
      starter: 'balance = -20\n',
      expectedOutput: 'Overdrawn',
      tests: [{ name: 'uses if/else', code: 'assert "if" in __source__ and "else" in __source__, "Use an if and an else"' }],
      hints: ['if balance < 0:', 'Indent the print under the if, then else: and another indented print.'],
      solution: 'balance = -20\nif balance < 0:\n    print("Overdrawn")\nelse:\n    print("OK")\n',
    }),
    py({
      prompt: 'Print `even` if `n` is even, otherwise `odd`. (Hint from Unit 2: the `%` operator.)',
      starter: 'n = 14\n',
      expectedOutput: 'even',
      tests: [rerun('n', '7', 'odd')],
      hints: ['n % 2 == 0 is True for even numbers.'],
      solution: 'n = 14\nif n % 2 == 0:\n    print("even")\nelse:\n    print("odd")\n',
    }),
  ],

  // ------------------------------------------------------------------ py-4-elif
  'py-4-elif': [
    ex('More than two choices', '`elif` ("else if") adds more conditions. Python checks them **top to bottom** and runs the **first** one that\'s True — then skips the rest:\n\n```python\nscore = 85\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelse:\n    print("Below C")\n```'),
    ans('What does that code print for score = 85?', ['B'], '85 >= 90 is False; 85 >= 80 is True → "B". The rest are skipped.'),
    ans('What would it print for score = 95?', ['A'], 'The first condition is already True, so only "A" prints — even though 95 >= 80 is also True.'),
    mc('Why does order matter here?', ['It doesn\'t', 'Python runs only the FIRST true branch, so broader conditions must come later', 'Python runs every true branch'], 1, 'If "score >= 70" came first, a 95 would get a C!', 'if score >= 70:\n    print("C")\nelif score >= 90:\n    print("A")'),
    py({
      prompt: 'Print `cold` if `temp` is below 50, `nice` if it\'s below 80, otherwise `hot`.',
      starter: 'temp = 65\n',
      expectedOutput: 'nice',
      tests: [rerun('temp', '30', 'cold'), rerun('temp', '90', 'hot'), rerun('temp', '80', 'hot')],
      hints: ['if temp < 50: … elif temp < 80: … else: …'],
      solution: 'temp = 65\nif temp < 50:\n    print("cold")\nelif temp < 80:\n    print("nice")\nelse:\n    print("hot")\n',
    }),
    ans('How many lines does this print?', ['1'], 'Even though both conditions are True, an if/elif chain runs only the first true branch.', 'x = 10\nif x > 5:\n    print("big")\nelif x > 1:\n    print("medium")'),
  ],

  // ------------------------------------------------------------------ py-4-logic
  'py-4-logic': [
    ex('Combining conditions', '- `and` — True only if **both** sides are True\n- `or` — True if **at least one** side is True\n- `not` — flips True ↔ False\n\n```python\nage = 25\nhas_ticket = True\nif age >= 18 and has_ticket:\n    print("Come in")\n```'),
    ans('What is True and False?', ['False'], 'and needs both sides True.'),
    ans('What is True or False?', ['True'], 'or needs just one side True.'),
    ans('What is not True?', ['False'], 'not flips the value.'),
    ans('What does this print?', ['False'], 'x > 0 is True but x > 10 is False, and and needs both.', 'x = 5\nprint(x > 0 and x > 10)'),
    mc('A store is open from 9 to 17 (hour 17 is closed). Which condition is right?', ['hour >= 9 or hour < 17', 'hour >= 9 and hour < 17', 'hour > 9 and hour > 17', 'not hour'], 1, 'The hour must be at least 9 AND before 17 — both must hold.'),
    ex('Chained comparisons', 'Python lets you write ranges like math does:\n\n```python\nif 9 <= hour < 17:\n    print("open")\n```\n\nThat means `9 <= hour and hour < 17`.'),
    py({
      prompt: 'A ride needs riders to be **at least 48 inches tall AND at least 8 years old**. Print `Enjoy the ride!` if both are true, otherwise `Sorry!`.',
      starter: 'height = 50\nage = 7\n',
      expectedOutput: 'Sorry!',
      tests: [rerun('age', '9', 'Enjoy the ride!'), rerun('height', '40', 'Sorry!')],
      hints: ['if height >= 48 and age >= 8:'],
      solution: 'height = 50\nage = 7\nif height >= 48 and age >= 8:\n    print("Enjoy the ride!")\nelse:\n    print("Sorry!")\n',
    }),
    fill('Complete it so "weekend" prints on Saturday OR Sunday.', 'if day == "Sat" ___ day == "Sun":\n    print("weekend")', [['or']], 'Either day counts, so we need or.', ['or', 'and', 'not', '+']),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'py-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('What does print("ab" + "cd") show?', ['abcd'], 'Strings join with no space.'),
      ans('What is len("code!")?', ['5'], 'c-o-d-e-! = 5.'),
      ans('What is "Python"[0]?', ['P'], 'Index 0 is the first character.'),
      ans('What is "Python"[-1]?', ['n'], '-1 is the last character.'),
      ans('What is "Python"[2:5]?', ['tho'], 'Indexes 2, 3, 4.'),
      ans('What does this print?', ['Hi Ana'], 'f-string fills in {name}.', 'name = "Ana"\nprint(f"Hi {name}")'),
      ans('What does "Hi".lower() return? (no quotes)', ['hi'], 'lower() makes letters lowercase.'),
      py({ prompt: 'Print `word` in all capital letters.', starter: 'word = "loop"\n', expectedOutput: 'LOOP', solution: 'word = "loop"\nprint(word.upper())\n' }),
      py({ prompt: 'Use an f-string to print `2 + 3 = 5` using the variables a and b (compute the sum inside the braces).', starter: 'a = 2\nb = 3\n', expectedOutput: '2 + 3 = 5', tests: [{ name: 'uses an f-string', code: 'assert \'f"\' in __source__ or "f\'" in __source__' }], solution: 'a = 2\nb = 3\nprint(f"{a} + {b} = {a + b}")\n' }),
    ],
  },
  'py-4': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('What does print(3 < 2) show?', ['False'], '3 is not less than 2.'),
      mc('Which operator checks equality?', ['=', '==', '=>', '!='], 1, '== compares.'),
      ans('What is True and True?', ['True'], 'Both sides True.'),
      ans('What is False or False?', ['False'], 'Neither side True.'),
      ans('What does this print?', ['medium'], '7 > 10 is False; 7 > 5 is True.', 'x = 7\nif x > 10:\n    print("big")\nelif x > 5:\n    print("medium")\nelse:\n    print("small")'),
      ans('What does this print?', ['no'], 'not True is False, so else runs.', 'ok = True\nif not ok:\n    print("yes")\nelse:\n    print("no")'),
      mc('What must end every if, elif and else line?', ['A semicolon', 'A colon', 'A period', 'Nothing'], 1, 'A colon.'),
      py({
        prompt: 'Print `positive`, `negative` or `zero` depending on `n`.', starter: 'n = -4\n', expectedOutput: 'negative',
        tests: [rerun('n', '0', 'zero'), rerun('n', '9', 'positive')],
        solution: 'n = -4\nif n > 0:\n    print("positive")\nelif n < 0:\n    print("negative")\nelse:\n    print("zero")\n',
      }),
      py({ prompt: 'Print `True` if `year` is between 2000 and 2099 inclusive, otherwise `False`. (One print of a comparison is enough.)', starter: 'year = 2026\n', expectedOutput: 'True', tests: [rerun('year', '1999', 'False'), rerun('year', '2099', 'True')], solution: 'year = 2026\nprint(2000 <= year <= 2099)\n' }),
    ],
  },
};
