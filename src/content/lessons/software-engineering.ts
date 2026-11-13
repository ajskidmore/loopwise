/**
 * Track: software-engineering — "Software Engineering"
 * Written here: se-1 (design), se-2 (process), se-3 (system design) + checkpoints + course final exam.
 * Hands-on parts are small Python exercises (refactors, patterns, tests, a router, a cache).
 */
import type { Checkpoint, Step } from '../types';
import { eq, ex, mc, py } from './_helpers';

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ se-1-principles
  'se-1-principles': [
    ex('Code is read more than it\'s written', 'Professional code lives for years. Many people read and change it, including future you. Good design means code that\'s **easy to understand and safe to change**.\n\nThree short rules of thumb:\n\n- **DRY** (Don\'t Repeat Yourself): each piece of knowledge lives in one place.\n- **KISS** (Keep It Simple): the simplest thing that works.\n- **YAGNI** (You Aren\'t Gonna Need It): don\'t build features "just in case".', 'Software engineering is everything around the code: design, teamwork, testing and keeping systems running.'),
    mc('The same tax calculation is copied into 5 files. The rate changes. Which principle was broken?', ['DRY', 'KISS', 'YAGNI'], 0, 'Now you must find and fix 5 copies, and missing one causes a bug.'),
    ex('SOLID', 'Five classic design principles:\n\n- **S**ingle responsibility: a class or function has one reason to change.\n- **O**pen/closed: add behavior by adding code, not by rewriting working code.\n- **L**iskov substitution: a subclass must work anywhere its parent works.\n- **I**nterface segregation: many small interfaces beat one giant one.\n- **D**ependency inversion: depend on abstractions (like "a storage"), not concrete details (like "this exact database").'),
    mc('One class loads data, formats reports AND sends emails. Which principle does it break?', ['Single responsibility', 'Liskov substitution', 'Open/closed'], 0, 'Three different reasons to change, all in one class.'),
    mc('Liskov substitution says a subclass should…', ['work anywhere its parent class works', 'add more methods than its parent', 'run faster than its parent'], 0, 'If code expecting a Bird breaks when given a Penguin, the design needs work.'),
    mc('A teammate adds a plugin system "in case we need it someday". Which rule warns against this?', ['YAGNI', 'DRY'], 0, 'Build it when it\'s actually needed.'),
    py({
      prompt: 'Apply **DRY**. Write a helper `with_tax(price, rate)` that returns the price plus tax, **rounded to 2 decimals**. Then write `total_with_tax(prices, rate)` that **uses** `with_tax` for each price and returns the total, also rounded to 2 decimals.',
      starter: 'def with_tax(price, rate):\n    pass\n\n\ndef total_with_tax(prices, rate):\n    pass\n',
      tests: [eq('with_tax(100, 0.06)', '106.0'), eq('with_tax(19.99, 0.1)', '21.99'), eq('total_with_tax([100, 50], 0.06)', '159.0'), eq('total_with_tax([], 0.06)', '0'), { name: 'total_with_tax reuses with_tax', code: 'assert __source__.count("with_tax(") >= 3, "Call with_tax inside total_with_tax instead of repeating the math"' }],
      hints: ['with_tax: return round(price * (1 + rate), 2)', 'total_with_tax: return round(sum(with_tax(p, rate) for p in prices), 2)'],
      solution: 'def with_tax(price, rate):\n    return round(price * (1 + rate), 2)\n\n\ndef total_with_tax(prices, rate):\n    return round(sum(with_tax(p, rate) for p in prices), 2)\n',
    }),
  ],

  // ------------------------------------------------------------------ se-1-patterns
  'se-1-patterns': [
    ex('Design patterns', 'A **design pattern** is a named, reusable solution to a common design problem. Knowing the names lets teams say a lot in a few words.\n\n**Strategy:** make a behavior swappable by passing it in.\n\n```python\ndef checkout(total, discount):\n    return discount(total)\n\ncheckout(80, half_off)    # 40\n```\n\nIn Python, a strategy is often just a **function** passed as an argument.'),
    mc('In Python, the Strategy pattern is often as simple as…', ['passing a function as an argument', 'a giant if/else chain', 'a global variable'], 0, 'Functions are values, so the behavior can be swapped in.'),
    ex('Observer', '**Observer:** objects **subscribe** to something, and it **notifies** them when an event happens.\n\n```python\nbutton.subscribe(play_sound)\nbutton.subscribe(save_progress)\nbutton.click()     # calls both\n```\n\nThe button doesn\'t need to know what its subscribers do. You\'ve seen this before: `addEventListener` in JavaScript.'),
    mc('JavaScript\'s `addEventListener` is an example of which pattern?', ['Observer', 'Factory', 'Strategy'], 0, 'Listeners subscribe and get notified on each event.'),
    ex('Factory, and a warning', '**Factory:** one function decides **which** kind of object to create:\n\n```python\ndef make_shape(kind):\n    if kind == "circle":\n        return Circle()\n    return Square()\n```\n\n⚠️ Patterns are tools, not goals. Adding them "to be professional" makes simple code complicated. Use one when it solves a problem you actually have.'),
    mc('When do design patterns do harm?', ['When they\'re added "just in case", making simple code complex', 'Never: more patterns is always better'], 0, 'KISS and YAGNI still apply.'),
    py({
      prompt: 'Build the **Observer** pattern. Write a class `Button` with:\n\n- `subscribe(fn)`: remember the function\n- `click()`: call **every** subscribed function, in the order they subscribed',
      starter: 'class Button:\n    pass\n',
      tests: [
        { name: 'click calls every subscriber in order', code: 'log = []\nb = Button()\nb.subscribe(lambda: log.append("sound"))\nb.subscribe(lambda: log.append("save"))\nb.click()\nassert log == ["sound", "save"], f"expected [\'sound\', \'save\'], got {log}"' },
        { name: 'each click notifies again', code: 'n = []\nb = Button()\nb.subscribe(lambda: n.append(1))\nb.click(); b.click()\nassert len(n) == 2, f"expected 2 calls, got {len(n)}"' },
        { name: 'buttons don\'t share subscribers', code: 'x = []\nb1 = Button(); b2 = Button()\nb1.subscribe(lambda: x.append(1))\nb2.click()\nassert x == [], "Give each Button its own list (create it in __init__)"' },
      ],
      hints: ['def __init__(self):\n    self.subscribers = []', 'subscribe appends fn to the list; click loops over the list and calls fn()'],
      solution: 'class Button:\n    def __init__(self):\n        self.subscribers = []\n\n    def subscribe(self, fn):\n        self.subscribers.append(fn)\n\n    def click(self):\n        for fn in self.subscribers:\n            fn()\n',
    }),
    py({
      prompt: 'Use the **Strategy** pattern. `checkout(total, discount)` is written for you. Write two discount strategies:\n\n- `half_off(total)`: half the price\n- `ten_off(total)`: 10 less, but never below 0',
      starter: 'def checkout(total, discount):\n    return discount(total)\n\n\ndef half_off(total):\n    pass\n\n\ndef ten_off(total):\n    pass\n',
      tests: [eq('checkout(80, half_off)', '40'), eq('checkout(80, ten_off)', '70'), eq('checkout(4, ten_off)', '0')],
      hints: ['half_off: return total / 2', 'ten_off: return max(total - 10, 0)'],
      solution: 'def checkout(total, discount):\n    return discount(total)\n\n\ndef half_off(total):\n    return total / 2\n\n\ndef ten_off(total):\n    return max(total - 10, 0)\n',
    }),
  ],

  // ------------------------------------------------------------------ se-1-refactoring
  'se-1-refactoring': [
    ex('Refactoring', '**Refactoring** means improving the **structure** of code **without changing what it does**.\n\nThe safe way:\n\n1. Make sure tests cover the behavior.\n2. Make one small change.\n3. Run the tests.\n4. Repeat.'),
    mc('During a refactor, what must stay the same?', ['What the code does (its behavior)', 'The variable names', 'The number of lines'], 0, 'Structure changes; behavior doesn\'t. That\'s why tests come first.'),
    ex('Code smells', 'A **code smell** is a hint that something could be cleaner:\n\n- very **long functions**\n- **duplicated** code\n- **magic numbers**: unexplained values like `if score > 1440:`\n- **unclear names**: `x`, `data2`, `doStuff()`\n- **long parameter lists**'),
    mc('`if age >= 21:` appears in 6 places, each with a comment explaining it. What\'s the smell?', ['A magic number', 'A long class', 'Too many tests'], 0, 'Give it a name once: DRINKING_AGE = 21.'),
    ex('Common refactorings', '- **Extract function**: move a chunk into a well-named function.\n- **Rename**: say what it is: `seconds_left`, not `t`.\n- **Replace a magic number with a named constant**.\n- **Guard clauses**: handle special cases early with `return`, instead of nesting `if`s.'),
    mc('Which name is clearest for a variable holding the minutes until a quiz ends?', ['minutes_left', 'm', 'data'], 0, 'Names should explain themselves.'),
    py({
      prompt: 'Refactor this function **without changing what it returns**:\n\n1. Replace the magic number `50` with a constant `FREE_SHIPPING_MIN = 50` at the top.\n2. Use the constant in the function, so `50` appears **only once** in your code.',
      starter: 'def shipping(total):\n    if total <= 0:\n        return 0\n    if total >= 50:\n        return 0\n    return 5\n',
      tests: [eq('shipping(10)', '5'), eq('shipping(60)', '0'), eq('shipping(50)', '0'), eq('shipping(0)', '0'), { name: 'uses a named constant', code: 'assert "FREE_SHIPPING_MIN" in __source__ and __source__.count("50") == 1, "Define FREE_SHIPPING_MIN = 50 once and use it in the function"' }],
      hints: ['FREE_SHIPPING_MIN = 50 goes above the function.', 'Change the check to: if total >= FREE_SHIPPING_MIN:'],
      solution: 'FREE_SHIPPING_MIN = 50\n\n\ndef shipping(total):\n    if total <= 0:\n        return 0\n    if total >= FREE_SHIPPING_MIN:\n        return 0\n    return 5\n',
    }),
  ],

  // ------------------------------------------------------------------ se-2-testing
  'se-2-testing': [
    ex('The testing pyramid', 'Automated tests let you change code with confidence. Teams aim for a **pyramid**:\n\n- **Many unit tests** at the bottom: one function or class, alone. Fast.\n- **Some integration tests** in the middle: parts working together, like your code plus a database.\n- **A few end-to-end (E2E) tests** at the top: the whole app, driven like a real user. Slow but realistic.'),
    mc('Which kind of test checks one function by itself?', ['Unit', 'End-to-end', 'Integration'], 0, 'Small, fast and focused.'),
    mc('Loopwise has a bot that plays every lesson in a real browser. What kind of test is that?', ['End-to-end', 'Unit'], 0, 'It drives the whole app like a learner would. (It\'s real, and it caught bugs in these very lessons!)'),
    ex('Writing good tests', '- Test the **edge cases**: empty input, zero, negative numbers, huge values, duplicates.\n- One behavior per test, with a clear name.\n- Tests must be **fast** and give the **same result** every run.\n\n**TDD** (test-driven development): write a failing test **first**, make it pass, then clean up.'),
    mc('`average(nums)` already has a test with [1, 2, 3]. Which new test is most valuable?', ['An empty list', 'Another normal list like [4, 5, 6]'], 0, 'Empty input is where crashes hide (dividing by zero!).'),
    py({
      prompt: 'Write tests! `clamp` is given. Below it, write **at least 3** `assert` statements that check it, including at least one **edge case** (a value exactly on a boundary).',
      starter: 'def clamp(n, lo, hi):\n    return max(lo, min(n, hi))\n\n\n# your asserts here\n',
      tests: [{ name: 'at least 3 asserts that call clamp', code: 'assert __source__.count("assert") >= 3 and __source__.count("clamp(") >= 4, "Write at least 3 assert lines that call clamp(…)"' }],
      hints: ['assert clamp(5, 0, 10) == 5', 'assert clamp(-1, 0, 10) == 0\nassert clamp(10, 0, 10) == 10   # exactly on the boundary'],
      solution: 'def clamp(n, lo, hi):\n    return max(lo, min(n, hi))\n\n\nassert clamp(5, 0, 10) == 5\nassert clamp(-1, 0, 10) == 0\nassert clamp(99, 0, 10) == 10\nassert clamp(10, 0, 10) == 10\n',
    }),
    py({
      prompt: 'A test with an empty list found a crash. Fix `average(nums)` so it returns **0** for an empty list (and still works for everything else).',
      starter: 'def average(nums):\n    return sum(nums) / len(nums)\n',
      tests: [eq('average([1, 2, 3])', '2.0'), eq('average([])', '0'), eq('average([5])', '5.0')],
      hints: ['Add a guard clause at the top: if not nums: return 0'],
      solution: 'def average(nums):\n    if not nums:\n        return 0\n    return sum(nums) / len(nums)\n',
    }),
  ],

  // ------------------------------------------------------------------ se-2-code-review
  'se-2-code-review': [
    ex('Pull requests', 'Teams rarely change the main code directly. Instead, you open a **pull request (PR)**: "here\'s my change, please review it".\n\n1. Teammates **read** the change and leave comments.\n2. **CI** (continuous integration) automatically runs the tests and checks.\n3. Once it\'s approved and green, it\'s **merged**.'),
    mc('What are the main goals of code review?', ['Catch bugs, share knowledge and keep code consistent', 'Prove who\'s the best programmer'], 0, 'Reviews make the code, and the team, better.'),
    ex('Reviewing well', '**As the author:** keep PRs small, explain *why* in the description, and include tests.\n\n**As the reviewer:**\n\n- Be kind and specific, and explain **why**.\n- Ask questions: "What happens if the list is empty?"\n- Mark small optional suggestions as **"nit:"** so the author knows they won\'t block the change.'),
    mc('Which review comment is most helpful?', ['"This reads the file inside the loop. Could we read it once before the loop?"', '"This is bad."', '"Rewrite everything."'], 0, 'Specific, explains the problem, suggests a fix.'),
    mc('A teammate opens a 2,000-line PR. What\'s the best advice?', ['Split it into smaller PRs', 'Approve it without reading', 'Review only the first file'], 0, 'Small PRs get careful reviews. Huge ones get rubber-stamped.'),
    mc('What should automated checks (CI) catch, so humans don\'t have to?', ['Formatting, lint warnings and failing tests', 'Whether the design makes sense'], 0, 'Let machines do the boring checks; humans review the ideas.'),
    mc('A comment starting with "nit:" means…', ['a small, optional suggestion', 'a serious blocking problem'], 0, '"Nitpick." Fine to skip.'),
    py({
      prompt: 'A reviewer asked: "What if every number is negative?" Fix `find_max(nums)` so it works for **any** non-empty list.',
      starter: 'def find_max(nums):\n    best = 0\n    for n in nums:\n        if n > best:\n            best = n\n    return best\n',
      tests: [eq('find_max([3, 9, 2])', '9'), eq('find_max([-5, -2, -8])', '-2'), eq('find_max([7])', '7')],
      hints: ['Starting at 0 is the bug: -2 is never > 0.', 'Start with best = nums[0]'],
      solution: 'def find_max(nums):\n    best = nums[0]\n    for n in nums:\n        if n > best:\n            best = n\n    return best\n',
    }),
  ],

  // ------------------------------------------------------------------ se-2-agile
  'se-2-agile': [
    ex('Small steps, real feedback', 'The old **waterfall** way: plan everything, build everything, then show users months later and hope they like it.\n\n**Agile**: build a small piece, show it, learn, adjust, and repeat every week or two. Change is expected, not a disaster.'),
    ex('Scrum and Kanban', '**Scrum** works in **sprints** (usually 1–2 weeks):\n\n- pick work from the **backlog** (the to-do list)\n- quick daily **stand-up**: what I did, what I\'ll do, what\'s blocking me\n- **review** (demo the work) and **retrospective** (how can we work better?)\n\n**Kanban** is a board (To do → Doing → Done) with a **WIP limit**: a cap on how many things are in progress at once.'),
    mc('What is a sprint?', ['A short, fixed period of work, usually 1–2 weeks', 'A race to finish before a deadline', 'A type of bug'], 0, 'A regular rhythm of planning and delivering.'),
    mc('What is a retrospective for?', ['Improving how the team works', 'Showing the product to customers', 'Assigning blame'], 0, 'What went well, what didn\'t, and what to try next.'),
    mc('What does a WIP limit do?', ['Caps how many items can be in progress at once', 'Limits the size of the team'], 0, 'Finishing beats starting. Less juggling, faster flow.'),
    ex('User stories and the MVP', 'Work is often written as **user stories**:\n\n*"As a learner, I want to review my mistakes so that I remember them."*\n\nWho, what and why, plus **acceptance criteria** that say when it\'s done.\n\nAn **MVP** (minimum viable product) is the smallest version that tests whether an idea works. Ship it, learn, improve.'),
    mc('What three things does a user story capture?', ['Who, what and why', 'The database tables', 'The deadline, the cost and the manager'], 0, '"As a … I want … so that …"'),
    mc('What is an MVP?', ['The smallest version that lets you learn whether the idea works', 'The final, complete product', 'The most valuable programmer'], 0, 'Learn early, before building too much.'),
  ],

  // ------------------------------------------------------------------ se-3-apis
  'se-3-apis': [
    ex('APIs are contracts', 'An **API** is how programs talk to each other. It\'s a **contract**: "send this, get that".\n\nMost web APIs follow **REST**:\n\n- **resources** live at URLs: `/books`, `/books/42`\n- **HTTP methods** say what to do: `GET` (read), `POST` (create), `PUT`/`PATCH` (update), `DELETE` (remove)\n- data travels as **JSON**'),
    mc('Which request creates a new book?', ['POST /books', 'GET /books/new', 'DELETE /books'], 0, 'POST to the collection creates a new item in it.'),
    ex('Designing a good API', '- URLs are **nouns**, not verbs: `GET /users/42`, not `GET /getUser?id=42`.\n- Use **plural** collection names: `/books`.\n- Return honest **status codes**: 200 OK, 201 Created, 400 bad input, 404 not found.\n- Be **consistent** in naming everywhere.\n- **Never break** clients: removing or renaming a field is a breaking change. Add `/v2` instead.'),
    mc('Which URL follows REST style?', ['GET /users/42', 'GET /getUserById?id=42'], 0, 'The HTTP method is the verb; the URL names the thing.'),
    mc('Which status code means "created successfully"?', ['201', '200', '404'], 0, '201 Created, usually returned after a POST.'),
    mc('Your mobile app reads the field `user_name`. A teammate renames it to `username`. That\'s…', ['a breaking change: old app versions will fail', 'harmless'], 0, 'Clients depend on the contract. Add the new name alongside, or version the API.'),
    py({
      prompt: 'Write a tiny **router** `route(method, path)` that returns the name of the handler:\n\n| request | handler |\n|---|---|\n| `GET /books` | `"list_books"` |\n| `POST /books` | `"create_book"` |\n| `GET /books/<id>` | `"get_book"` |\n| `DELETE /books/<id>` | `"delete_book"` |\n| anything else | `"not_found"` |\n\n`<id>` is any number, like `/books/42`.',
      starter: 'def route(method, path):\n    pass\n',
      tests: [eq('route("GET", "/books")', '"list_books"'), eq('route("POST", "/books")', '"create_book"'), eq('route("GET", "/books/42")', '"get_book"'), eq('route("DELETE", "/books/7")', '"delete_book"'), eq('route("PUT", "/books/7")', '"not_found"'), eq('route("GET", "/authors")', '"not_found"'), eq('route("GET", "/books/abc")', '"not_found"')],
      hints: ['parts = path.strip("/").split("/") gives ["books"] or ["books", "42"].', 'Check len(parts), parts[0] == "books" and parts[1].isdigit(), then the method.'],
      solution: 'def route(method, path):\n    parts = path.strip("/").split("/")\n    if parts == ["books"]:\n        if method == "GET":\n            return "list_books"\n        if method == "POST":\n            return "create_book"\n    if len(parts) == 2 and parts[0] == "books" and parts[1].isdigit():\n        if method == "GET":\n            return "get_book"\n        if method == "DELETE":\n            return "delete_book"\n    return "not_found"\n',
    }),
  ],

  // ------------------------------------------------------------------ se-3-scaling
  'se-3-scaling': [
    ex('Growing up', 'When an app gets more users than one server can handle:\n\n- **Vertical scaling**: a bigger machine (more CPU and memory). Simple, but there\'s a ceiling.\n- **Horizontal scaling**: **more** machines sharing the work. Almost no ceiling, but more moving parts.'),
    mc('Adding more servers to share the load is…', ['horizontal scaling', 'vertical scaling'], 0, 'Out (more machines), not up (a bigger machine).'),
    ex('Load balancers', 'A **load balancer** sits in front of many servers and spreads requests across them.\n\nFor that to work, the servers should be **stateless**: no user data kept only in one server\'s memory. Sessions and data live in a shared database or cache.'),
    mc('Why should servers behind a load balancer be stateless?', ['Any server might receive a user\'s next request', 'It saves electricity'], 0, 'If request 1 went to server A, request 2 might go to server B.'),
    ex('Caching', 'A **cache** keeps recent answers close by (in memory, or in a CDN near users) so you don\'t recompute or refetch them.\n\n- **hit**: the answer was in the cache, so it\'s fast\n- **miss**: compute it, then store it\n\nThe hard part is **invalidation**: knowing when a cached answer is out of date.', '"There are only two hard things in computer science: cache invalidation and naming things." (Phil Karlton)'),
    ex('Scaling the data', '- **Indexes** (from the SQL course) speed up lookups.\n- **Read replicas**: copies of the database that handle reads.\n- **Sharding**: split the data across databases, for example by user id.\n- **Queues**: put slow jobs (emails, video processing) in a line for background workers.'),
    mc('Your app does tons of reads and very few writes, and it\'s getting slow. What\'s a good first step?', ['Add caching or read replicas', 'Shard the database right away', 'Rewrite it in another language'], 0, 'Start with the simplest fix that targets the actual bottleneck.'),
    py({
      prompt: 'Write `cached(fn)`: it returns a **new function** that remembers results. The first call with an argument runs `fn`; later calls with the same argument return the saved answer **without** calling fn again.\n\n(This trick is called **memoization**, and it\'s the same idea as a cache.)',
      starter: 'def cached(fn):\n    pass\n',
      tests: [
        { name: 'returns the right answers', code: 'sq = cached(lambda x: x * x)\nassert sq(4) == 16 and sq(5) == 25, "cached(fn)(x) should equal fn(x)"' },
        { name: 'calls fn only once per argument', code: 'calls = []\ndef slow(x):\n    calls.append(x)\n    return x + 1\nf = cached(slow)\nf(1); f(1); f(2); f(1)\nassert calls == [1, 2], f"fn ran for {calls}; it should run once per new argument"' },
      ],
      hints: ['Inside cached: memory = {} then define an inner function wrapper(x).', 'In wrapper: if x not in memory: memory[x] = fn(x). Return memory[x]. Then cached returns wrapper.'],
      solution: 'def cached(fn):\n    memory = {}\n\n    def wrapper(x):\n        if x not in memory:\n            memory[x] = fn(x)\n        return memory[x]\n\n    return wrapper\n',
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'se-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('DRY stands for…', ['Don\'t Repeat Yourself', 'Do Run Yearly'], 0, 'One source of truth.'),
      mc('"One reason to change" is…', ['single responsibility', 'dependency inversion'], 0, 'The S in SOLID.'),
      mc('Passing a function in to change behavior is the…', ['Strategy pattern', 'Singleton pattern'], 0, 'Strategy.'),
      mc('Subscribers notified on events is the…', ['Observer pattern', 'Factory pattern'], 0, 'Observer.'),
      mc('Refactoring changes…', ['structure, not behavior', 'behavior, not structure'], 0, 'Same results, cleaner code.'),
      mc('`if temp > 451:` with no explanation is a…', ['magic number', 'design pattern'], 0, 'Name it.'),
      py({ prompt: 'Refactor with a guard clause: write `safe_div(a, b)` that returns None when b is 0, otherwise a / b.', starter: 'def safe_div(a, b):\n    pass\n', tests: [eq('safe_div(6, 3)', '2.0'), eq('safe_div(1, 0)', 'None')], solution: 'def safe_div(a, b):\n    if b == 0:\n        return None\n    return a / b\n' }),
    ],
  },
  'se-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('The testing pyramid has the MOST…', ['unit tests', 'end-to-end tests'], 0, 'Fast and plentiful.'),
      mc('Testing code together with a real database is…', ['an integration test', 'a unit test'], 0, 'Parts working together.'),
      mc('TDD means writing the test…', ['first', 'last'], 0, 'Red → green → refactor.'),
      mc('Best PR size?', ['small and focused', 'as big as possible'], 0, 'Easier to review well.'),
      mc('A daily stand-up is part of…', ['Scrum', 'Waterfall'], 0, 'Scrum.'),
      mc('"As a learner, I want…, so that…" is a…', ['user story', 'stack trace'], 0, 'User story.'),
      py({ prompt: 'Fix `last(items)` so it returns None for an empty list instead of crashing.', starter: 'def last(items):\n    return items[-1]\n', tests: [eq('last([1, 2, 3])', '3'), eq('last([])', 'None')], solution: 'def last(items):\n    if not items:\n        return None\n    return items[-1]\n' }),
    ],
  },
  'se-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Which request reads book 5?', ['GET /books/5', 'POST /books/5'], 0, 'GET reads.'),
      mc('Removing a field clients use is…', ['a breaking change', 'always safe'], 0, 'Version it.'),
      mc('A bigger single server is…', ['vertical scaling', 'horizontal scaling'], 0, 'Up, not out.'),
      mc('Spreading requests across servers is the job of a…', ['load balancer', 'compiler'], 0, 'Load balancer.'),
      mc('The hard part of caching is…', ['knowing when cached data is stale', 'storing it'], 0, 'Invalidation.'),
      py({ prompt: 'Write `status_for(method)`: return 201 for "POST" and 200 for anything else.', starter: 'def status_for(method):\n    pass\n', tests: [eq('status_for("POST")', '201'), eq('status_for("GET")', '200')], solution: 'def status_for(method):\n    return 201 if method == "POST" else 200\n' }),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  'software-engineering': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('KISS means…', ['keep it simple', 'keep it secret'], 0, 'Simplest thing that works.'),
      mc('YAGNI warns against…', ['building features before they\'re needed', 'writing tests'], 0, 'You aren\'t gonna need it.'),
      mc('Which pattern is `addEventListener`?', ['Observer', 'Strategy'], 0, 'Subscribe + notify.'),
      mc('Before refactoring, you should have…', ['tests covering the behavior', 'a new framework'], 0, 'Safety net.'),
      mc('Which test type is slowest but most realistic?', ['end-to-end', 'unit'], 0, 'Whole app.'),
      mc('"nit:" in a review means…', ['optional small suggestion', 'must fix'], 0, 'Non-blocking.'),
      mc('A retrospective improves…', ['how the team works', 'the database'], 0, 'Process.'),
      mc('REST URLs should be…', ['nouns', 'verbs'], 0, '/books, not /getBooks.'),
      mc('Servers behind a load balancer should be…', ['stateless', 'each storing their own sessions'], 0, 'Any server may answer.'),
      py({ prompt: 'Write `count_calls(fn)`: return a new function that calls fn and also counts calls in an attribute `calls` on the new function (starting at 0).', starter: 'def count_calls(fn):\n    pass\n', tests: [{ name: 'counts calls', code: 'f = count_calls(lambda x: x * 2)\nassert f.calls == 0, "calls should start at 0"\nassert f(3) == 6\nf(4)\nassert f.calls == 2, f"expected 2 calls, got {f.calls}"' }], hints: ['def wrapper(x): wrapper.calls += 1; return fn(x)', 'Set wrapper.calls = 0 before returning wrapper.'], solution: 'def count_calls(fn):\n    def wrapper(x):\n        wrapper.calls += 1\n        return fn(x)\n\n    wrapper.calls = 0\n    return wrapper\n' }),
    ],
  },
};
