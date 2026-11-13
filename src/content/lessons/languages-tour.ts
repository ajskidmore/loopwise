/**
 * Track: languages-tour — "Language Tour"
 * Written here: lt-1 (Go, Rust), lt-2 (C#, Kotlin/Swift, PHP/Ruby), lt-3 (Bash, R, Haskell) + checkpoints + final.
 *
 * One quick lesson per language: what it's for, what it looks like, and its big idea, practiced in Python (or in
 * the practice terminal for Bash). Code samples are labeled 'text'.
 * Only Swift, Ruby and Bash could be run on the authoring machine, so ONLY those have "What does this … code
 * print?" questions, and each was run with swift/ruby/bash before publishing. Go, Rust, C#, Kotlin, PHP, R and
 * Haskell questions are about concepts and reading code, never exact output.
 */
import type { Checkpoint, Step } from '../types';
import { eq, ex, mc, mcT, py, term } from './_helpers';

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ lt-1-go
  'lt-1-go': [
    ex('Go: simple and concurrent', '**Go** (from Google, 2009) is small, compiles fast, and makes concurrency easy. Docker and Kubernetes are written in Go.\n\n```go\npackage main\n\nimport "fmt"\n\nfunc main() {\n    names := []string{"Ana", "Bo"}\n    for _, n := range names {\n        fmt.Println("Hi", n)\n    }\n}\n```\n\n- `:=` declares and infers a type\n- the type comes **after** the name: `func add(a int, b int) int`\n- only one loop keyword: `for`', 'Once you know Python, JavaScript, Java and C, every other language is a variation. This tour shows you the big idea in each.'),
    mcT('In Go, which line declares x and lets Go infer its type?', ['x := 5', 'int x = 5;', 'let x = 5'], 0, ':= is "declare and assign".'),
    ex('Goroutines and channels', 'Put `go` in front of a call and it runs **concurrently** as a lightweight **goroutine**. Thousands are cheap.\n\nGoroutines talk through **channels** instead of sharing variables:\n\n```go\nch := make(chan int)\ngo func() { ch <- 42 }()   // send\nvalue := <-ch              // receive (waits until a value arrives)\n```\n\nGo\'s motto: "Don\'t communicate by sharing memory; share memory by communicating."'),
    mc('How do goroutines usually exchange data?', ['Through channels', 'Through global variables with no locks', 'They can\'t'], 0, 'Channels avoid many race conditions (from the OS course).'),
    mc('Go has no exceptions. How are errors returned?', ['As an extra return value: result, err := doThing()', 'With try/catch', 'They\'re ignored'], 0, 'Then `if err != nil { … }`. Very explicit.'),
    py({
      prompt: 'Go functions often return `(value, error)`. Write a Python version: `safe_div(a, b)` returns `(a / b, None)`, or `(None, "division by zero")` when b is 0.',
      starter: 'def safe_div(a, b):\n    pass\n',
      tests: [eq('safe_div(6, 3)', '(2.0, None)'), eq('safe_div(1, 0)', '(None, "division by zero")')],
      hints: ['if b == 0: return (None, "division by zero")', 'return (a / b, None)'],
      solution: 'def safe_div(a, b):\n    if b == 0:\n        return (None, "division by zero")\n    return (a / b, None)\n',
    }),
  ],

  // ------------------------------------------------------------------ lt-1-rust
  'lt-1-rust': [
    ex('Rust: fast and memory-safe', '**Rust** is as fast as C++, but its compiler **prevents** memory bugs (use-after-free, double free, data races) with **no garbage collector**. It\'s used in browsers, operating systems and cloud infrastructure.\n\n```rust\nfn main() {\n    let name = String::from("Pip");\n    let mut count = 0;      // variables are immutable unless "mut"\n    count += 1;\n    println!("{} {}", name, count);\n}\n```'),
    mcT('Can you change x after this line?', ['No: Rust variables are immutable unless declared mut', 'Yes'], 0, 'Write `let mut x = 5;` to allow changes.', 'let x = 5;'),
    ex('Ownership', 'Every value has exactly **one owner**. Assigning or passing it **moves** ownership (like C++ move semantics, but enforced):\n\n```rust\nlet a = String::from("hi");\nlet b = a;          // ownership moves to b\nprintln!("{}", a);  // ❌ compile error: a no longer owns the string\n```\n\nWhen the owner goes out of scope, the value is freed automatically (RAII again!).'),
    mc('After `let b = a;` with a String, what happens if you use a?', ['A compile error: ownership moved to b', 'It prints the string', 'It prints nothing'], 0, 'The borrow checker catches it before the program ever runs.'),
    ex('Borrowing', 'You can **borrow** a value with a reference instead of moving it:\n\n- `&x`: any number of read-only borrows at once\n- `&mut x`: exactly **one** mutable borrow, and no other borrows at the same time\n\nThat single rule makes data races impossible in safe Rust.'),
    mc('Why does Rust allow only one mutable borrow at a time?', ['So two parts of the code can\'t change the same data at once (no data races)', 'To save memory', 'It\'s a style preference'], 0, 'Enforced at compile time.'),
    py({
      prompt: 'Simulate ownership. Write class `Owned(value)` with:\n\n- `move()`: returns a **new** Owned holding the value, and marks this one as moved\n- `get()`: returns the value, or raises `RuntimeError("value was moved")` if this one was moved',
      starter: 'class Owned:\n    pass\n',
      tests: [
        { name: 'moving transfers the value', code: 'a = Owned("hi")\nb = a.move()\nassert b.get() == "hi"' },
        { name: 'the old owner can\'t be used', code: 'a = Owned("hi")\nb = a.move()\ntry:\n    a.get()\nexcept RuntimeError:\n    pass\nelse:\n    raise AssertionError("using a moved value should raise RuntimeError")' },
      ],
      hints: ['In __init__: self.value = value; self.moved = False', 'move: self.moved = True; return Owned(self.value). get: if self.moved, raise RuntimeError("value was moved").'],
      solution: 'class Owned:\n    def __init__(self, value):\n        self.value = value\n        self.moved = False\n\n    def move(self):\n        self.moved = True\n        return Owned(self.value)\n\n    def get(self):\n        if self.moved:\n            raise RuntimeError("value was moved")\n        return self.value\n',
    }),
  ],

  // ------------------------------------------------------------------ lt-2-csharp
  'lt-2-csharp': [
    ex('C#: Microsoft\'s Java cousin', '**C#** runs on **.NET** and powers Windows apps, business back ends and the **Unity** game engine.\n\n```csharp\nusing System;\n\nclass Program {\n    static void Main() {\n        var names = new List<string> { "Ana", "Bo" };\n        foreach (var n in names) {\n            Console.WriteLine($"Hi {n}");\n        }\n    }\n}\n```\n\nIf you read Java, you can read C#: classes, static types, generics. `$"…{n}"` works like a Python f-string.'),
    mcT('What does `$"Hi {n}"` do in C#?', ['Inserts the value of n into the string, like an f-string', 'Prints a dollar sign', 'Declares a variable'], 0, 'String interpolation.'),
    ex('LINQ', 'C#\'s standout feature is **LINQ**: query collections like a database:\n\n```csharp\nvar adults = people\n    .Where(p => p.Age >= 18)\n    .OrderBy(p => p.Name)\n    .Select(p => p.Name);\n```\n\nIt\'s `filter`, sort and `map` with SQL-style names.'),
    mc('LINQ\'s `.Where(...)` is most like which JavaScript method?', ['filter', 'map', 'reduce'], 0, 'Keep the items that match.'),
    mc('Which popular game engine is scripted in C#?', ['Unity', 'Unreal (that one is C++)', 'Neither'], 0, 'Unity uses C#; Unreal uses C++.'),
    py({
      prompt: 'Write the Python version of that LINQ query. `people` is a list of `(name, age)` pairs. Write `adult_names(people)` that returns the names of people aged 18 or over, **sorted alphabetically**.',
      starter: 'def adult_names(people):\n    pass\n',
      tests: [eq('adult_names([("Zed", 30), ("Ann", 12), ("Bo", 18)])', '["Bo", "Zed"]'), eq('adult_names([])', '[]')],
      hints: ['return sorted(name for name, age in people if age >= 18)'],
      solution: 'def adult_names(people):\n    return sorted(name for name, age in people if age >= 18)\n',
    }),
  ],

  // ------------------------------------------------------------------ lt-2-kotlin-swift
  'lt-2-kotlin-swift': [
    ex('The mobile languages', '- **Kotlin**: the modern language for **Android** (and it runs on the JVM alongside Java)\n- **Swift**: Apple\'s language for **iPhone, iPad and Mac** apps\n\nThey look strikingly similar:\n\n```kotlin\nval name = "Pip"        // Kotlin: val = constant, var = variable\nvar count = 0\n```\n\n```swift\nlet name = "Pip"        // Swift: let = constant, var = variable\nvar count = 0\n```'),
    mc('Which language would you pick for a new iPhone app?', ['Swift', 'Kotlin', 'PHP'], 0, 'Kotlin for Android, Swift for Apple.'),
    ex('Null safety', 'Both languages make "this might be missing" **part of the type**, preventing the famous null-pointer crash:\n\n```swift\nvar nickname: String? = nil    // ? = optional: may be nil\nprint(nickname ?? "none")      // ?? = use this default if it\'s nil\n```\n\nKotlin works the same way, with `String?` and `?:`. The compiler won\'t let you use an optional without dealing with the missing case.'),
    mcT('What does this Swift code print?', ['none', 'nil', 'an error'], 0, 'nickname is nil, so ?? uses the default.', 'var nickname: String? = nil\nprint(nickname ?? "none")'),
    mcT('What does this Swift code print?', ['Hi, Pip!', 'Hi, \\(name)!', 'Hi, name!'], 0, '\\(name) inserts the value of name: Swift\'s string interpolation.', 'let name = "Pip"\nprint("Hi, \\(name)!")'),
    mc('What does the `?` in `String?` mean?', ['The value might be missing (nil/null)', 'The value is a question', 'The value is optional to type'], 0, 'Optional types prevent null crashes.'),
    py({
      prompt: 'Python version of `??`: write `or_default(value, default)` that returns `value` unless it is `None`, in which case it returns `default`. (Careful: `0` and `""` are real values, not missing!)',
      starter: 'def or_default(value, default):\n    pass\n',
      tests: [eq('or_default(None, "none")', '"none"'), eq('or_default("Pip", "none")', '"Pip"'), eq('or_default(0, 5)', '0'), eq('or_default("", "x")', '""')],
      hints: ['`value or default` would be wrong for 0 and "".', 'return default if value is None else value'],
      solution: 'def or_default(value, default):\n    return default if value is None else value\n',
    }),
  ],

  // ------------------------------------------------------------------ lt-2-php-ruby
  'lt-2-php-ruby': [
    ex('PHP: the web workhorse', '**PHP** runs a huge share of websites, including WordPress and much of the early Facebook. It was built to mix into HTML pages:\n\n```php\n<?php\n$name = "Pip";               // variables start with $\necho "Hello, $name!";\n?>\n```\n\nModern PHP (version 8+) is fast and has types, classes and a big package ecosystem.'),
    mcT('In PHP, how do variable names start?', ['With $', 'With @', 'With nothing'], 0, '$name, $count, $total.'),
    ex('Ruby: programmer happiness', '**Ruby** was designed to be pleasant to read and write. **Ruby on Rails** made it famous for building web apps quickly (GitHub and Shopify started with it).\n\n```ruby\nnames = ["Ana", "Bo"]\nnames.each { |n| puts "Hi #{n}" }   # a block\n3.times { puts "Pip!" }\n```\n\n`#{…}` is interpolation, and `{ |n| … }` is a **block**, Ruby\'s lambda.'),
    mcT('What does this Ruby code print?', ['6', '[1, 4, 9]', '1 2 3'], 0, 'sum adds 1 + 2 + 3.', 'puts [1, 2, 3].sum'),
    mcT('What does this Ruby code print?', ['[1, 4, 9]', '14', '[1, 2, 3]'], 0, 'map squares each number. (p prints a value in its literal form.)', 'p [1, 2, 3].map { |x| x * x }'),
    mc('Ruby on Rails is a…', ['web framework', 'database', 'game engine'], 0, 'Like Django for Python.'),
    py({
      prompt: 'Ruby\'s `3.times { … }` runs a block a number of times. Write `times(n, fn)` that calls `fn(i)` for i from 0 to n − 1 and returns a list of the results.',
      starter: 'def times(n, fn):\n    pass\n',
      tests: [eq('times(3, lambda i: i * 10)', '[0, 10, 20]'), eq('times(0, lambda i: i)', '[]')],
      hints: ['return [fn(i) for i in range(n)]'],
      solution: 'def times(n, fn):\n    return [fn(i) for i in range(n)]\n',
    }),
  ],

  // ------------------------------------------------------------------ lt-3-bash
  'lt-3-bash': [
    ex('Bash scripts', 'A **Bash script** saves a list of terminal commands in a file so you can rerun them anytime:\n\n```bash\n#!/bin/bash\nname="Pip"                  # no spaces around =\necho "Backing up for $name"\nfor f in *.txt; do\n    cp "$f" backup/\ndone\n```\n\n`#!/bin/bash` (the "shebang") says which program runs the file. Make it runnable with `chmod +x backup.sh`, then `./backup.sh`.', 'You already know the commands from Developer Tools. Scripts just save them.'),
    mcT('Which Bash line correctly sets a variable?', ['name="Pip"', 'name = "Pip"', '$name = "Pip"'], 0, 'Bash breaks if you put spaces around =.'),
    mcT('What does this Bash code print?', ['Hi Pip', 'Hi $name', 'Hi name'], 0, '$name is replaced inside double quotes.', 'name="Pip"\necho "Hi $name"'),
    mcT('What does this Bash code print?', ['3', '0', '1 2 3'], 0, 'The loop runs 3 times, adding 1 each time, then prints the total.', 'count=0\nfor i in 1 2 3; do\n    count=$((count + 1))\ndone\necho $count'),
    ex('Pipes are the superpower', '`|` sends one command\'s output into the next, and `>` saves output to a file:\n\n```bash\ngrep WARN app.log | sort > warnings.txt\n```\n\nSmall tools, combined: the Unix philosophy.'),
    term({
      prompt: 'Your practice terminal has `app.log`. Save every line containing **WARN**, **sorted alphabetically**, into a new file `warnings.txt`. Use one pipeline: `grep … | sort > …`',
      setup: { files: { 'app.log': 'INFO started\nWARN disk 80%\nINFO request ok\nWARN cache miss\nERROR crash\n' } },
      goal: { equals: { '~/warnings.txt': 'WARN cache miss\nWARN disk 80%' }, used: ['grep', 'sort'] },
      hints: ['grep WARN app.log shows the matching lines.', 'grep WARN app.log | sort > warnings.txt'],
      solution: ['grep WARN app.log | sort > warnings.txt'],
    }),
    mc('A script is supposed to run every night. What makes Bash good for that?', ['It glues existing command-line tools together with very little code', 'It\'s the fastest language', 'It has the best error messages'], 0, 'For anything long or complicated, switch to Python.'),
  ],

  // ------------------------------------------------------------------ lt-3-r
  'lt-3-r': [
    ex('R: built for statistics', '**R** is a language made by statisticians, for data analysis and charts. It\'s huge in research, biology and economics.\n\n```r\nscores <- c(90, 72, 85)     # c() makes a vector; <- assigns\nmean(scores)                # the average\nscores * 2                  # doubles EVERY element\nscores[scores > 80]         # keeps 90 and 85\n```\n\nNote: R vectors start at index **1**, not 0.'),
    mcT('In R, what does `scores * 2` do to a vector?', ['Multiplies every element by 2', 'Repeats the vector twice', 'An error'], 0, 'Operations are vectorized: they apply to every element at once.'),
    mcT('`x <- c(5, 6, 7)`. What is `x[1]` in R?', ['5', '6', 'an error'], 0, 'R counts from 1.'),
    ex('Data frames and the tidyverse', 'R\'s **data frame** is a table, like a spreadsheet or a SQL table. The popular **tidyverse** packages read like a pipeline:\n\n```r\npeople |>\n  filter(age >= 18) |>\n  group_by(city) |>\n  summarise(n = n())\n```\n\nCompare that with SQL\'s `WHERE … GROUP BY … COUNT(*)`: same ideas, different spelling. (Python\'s **pandas** library is the same idea, too.)'),
    mc('R\'s `filter(age >= 18) |> group_by(city)` is most like which SQL?', ['WHERE age >= 18 … GROUP BY city', 'ORDER BY age', 'INSERT INTO'], 0, 'Data analysis concepts carry across languages.'),
    mc('What is "vectorized" code?', ['An operation applied to a whole collection at once, without writing a loop', 'Code that draws vector graphics', 'Code with many variables'], 0, 'Fast and concise. numpy brings it to Python.'),
    py({
      prompt: 'Imitate R\'s vector operations in Python. Write `vec_mul(xs, k)` (multiply every element by k) and `keep_above(xs, limit)` (like R\'s `xs[xs > limit]`).',
      starter: 'def vec_mul(xs, k):\n    pass\n\n\ndef keep_above(xs, limit):\n    pass\n',
      tests: [eq('vec_mul([90, 72, 85], 2)', '[180, 144, 170]'), eq('keep_above([90, 72, 85], 80)', '[90, 85]'), eq('keep_above([], 1)', '[]')],
      hints: ['return [x * k for x in xs]', 'return [x for x in xs if x > limit]'],
      solution: 'def vec_mul(xs, k):\n    return [x * k for x in xs]\n\n\ndef keep_above(xs, limit):\n    return [x for x in xs if x > limit]\n',
    }),
  ],

  // ------------------------------------------------------------------ lt-3-haskell
  'lt-3-haskell': [
    ex('A different way to think', '**Haskell** is a **purely functional** language:\n\n- functions have **no side effects**: the same input always gives the same output\n- values never change after they\'re created (**immutable**)\n- no loops: use **recursion** and functions like `map`, `filter` and `foldr`\n\n```haskell\nsquare :: Int -> Int        -- type signature\nsquare x = x * x\n\nmap square [1, 2, 3]        -- [1, 4, 9]\n```'),
    mcT('What does `square :: Int -> Int` describe?', ['square takes an Int and returns an Int', 'square subtracts', 'a variable called Int'], 0, 'Types read like arrows: input -> output.'),
    ex('Recursion and pattern matching', 'Functions are often defined **case by case**:\n\n```haskell\nsumList :: [Int] -> Int\nsumList []     = 0                  -- the empty list\nsumList (x:xs) = x + sumList xs     -- first item x, the rest xs\n```\n\nThat\'s induction from Discrete Math, as code: a base case and a step.'),
    mc('In `sumList (x:xs)`, what are x and xs?', ['The first item, and the rest of the list', 'Two separate lists', 'Two numbers to add'], 0, 'Head and tail.'),
    mc('Why are pure functions easier to test?', ['The same input always gives the same output, with no hidden state', 'They run faster', 'They don\'t need inputs'], 0, 'No surprises.'),
    mc('Which of these ideas, popular in Haskell, show up in Python and JavaScript too?', ['map, filter, lambdas and immutability', 'Only Haskell can use them', 'None'], 0, 'Functional ideas spread everywhere.'),
    py({
      prompt: 'Write `sum_list(xs)` the Haskell way: **recursion**, no loops and no `sum()`. Base case: the empty list → 0. Otherwise: the first item + sum_list(the rest).',
      starter: 'def sum_list(xs):\n    pass\n',
      tests: [eq('sum_list([1, 2, 3])', '6'), eq('sum_list([])', '0'), { name: 'recursive, no loops or sum()', code: 'assert "for " not in __source__ and "while " not in __source__ and "sum(" not in __source__, "Use recursion, not loops or sum()"' }],
      hints: ['if not xs: return 0', 'return xs[0] + sum_list(xs[1:])'],
      solution: 'def sum_list(xs):\n    if not xs:\n        return 0\n    return xs[0] + sum_list(xs[1:])\n',
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'lt-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Go\'s lightweight concurrent functions are called…', ['goroutines', 'threads', 'coroutines'], 0, 'go doThing().'),
      mc('Goroutines communicate through…', ['channels', 'files'], 0, 'Channels.'),
      mc('Go returns errors as…', ['an extra return value', 'exceptions'], 0, 'value, err.'),
      mc('Rust prevents memory bugs with…', ['ownership and borrowing rules', 'a garbage collector'], 0, 'Checked at compile time.'),
      mc('In Rust, `let x = 5;` is…', ['immutable', 'mutable'], 0, 'Use mut to change.'),
      mc('How many mutable borrows can exist at once in Rust?', ['One', 'Unlimited'], 0, 'No data races.'),
    ],
  },
  'lt-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('C# runs on…', ['.NET', 'the JVM only'], 0, '.NET.'),
      mc('LINQ\'s Select is like…', ['map', 'filter'], 0, 'Transform each item.'),
      mc('Kotlin is the modern language for…', ['Android', 'iPhone'], 0, 'Android.'),
      mcT('What does this Swift code print?', ['guest', 'nil'], 0, 'The default is used for nil.', 'let user: String? = nil\nprint(user ?? "guest")'),
      mc('PHP variables start with…', ['$', '#'], 0, '$.'),
      mcT('What does this Ruby code print?', ['10', '[1, 2, 3, 4]'], 0, '1 + 2 + 3 + 4.', 'puts [1, 2, 3, 4].sum'),
    ],
  },
  'lt-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      mcT('Which line is valid Bash?', ['count=5', 'count = 5'], 0, 'No spaces.'),
      mcT('What does this Bash code print?', ['Hi Ana', 'Hi $who'], 0, 'Variables expand in double quotes.', 'who="Ana"\necho "Hi $who"'),
      mc('R vectors start at index…', ['1', '0'], 0, 'R counts from 1.'),
      mc('R and pandas are mainly for…', ['data analysis', 'device drivers'], 0, 'Data.'),
      mc('Haskell functions are…', ['pure: no side effects', 'full of hidden state'], 0, 'Pure.'),
      mc('Haskell repeats work with…', ['recursion and map/filter/fold', 'for loops'], 0, 'No loops.'),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  'languages-tour': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Docker and Kubernetes are written in…', ['Go', 'Ruby'], 0, 'Go.'),
      mc('Which language gives memory safety without a garbage collector?', ['Rust', 'PHP'], 0, 'Ownership.'),
      mc('Unity games are scripted in…', ['C#', 'Haskell'], 0, 'C#.'),
      mc('Optional types (String?) in Kotlin and Swift prevent…', ['null-pointer crashes', 'slow loops'], 0, 'Null safety.'),
      mc('WordPress is built with…', ['PHP', 'Swift'], 0, 'PHP.'),
      mc('Ruby on Rails is famous for…', ['building web apps quickly', 'operating systems'], 0, 'Web.'),
      mcT('What does this Bash code print?', ['2', '0'], 0, 'Two loop iterations.', 'n=0\nfor x in a b; do\n    n=$((n + 1))\ndone\necho $n'),
      mc('R is most popular for…', ['statistics and data analysis', 'mobile games'], 0, 'Statistics.'),
      mc('Haskell\'s `(x:xs)` pattern splits a list into…', ['its first item and the rest', 'two halves'], 0, 'Head and tail.'),
      py({ prompt: 'Write `compose(f, g)`, a functional-programming classic: return a new function h where h(x) = f(g(x)).', starter: 'def compose(f, g):\n    pass\n', tests: [{ name: 'composes', code: 'h = compose(lambda x: x + 1, lambda x: x * 2)\nassert h(5) == 11, f"expected 11, got {h(5)}"' }], solution: 'def compose(f, g):\n    return lambda x: f(g(x))\n' }),
    ],
  },
};
