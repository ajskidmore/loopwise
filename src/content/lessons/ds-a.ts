/**
 * Track: data-structures — "Data Structures"
 * Written here: ds-1 (arrays & linked lists), ds-2 (stacks & queues), ds-3 (hash tables) + checkpoints
 */
import type { Checkpoint, Step } from '../types';
import { ans, eq, ex, fast, mc, ord, py, raises } from './_helpers';

const LINKED_LIST_STARTER = 'class Node:\n    def __init__(self, value, next=None):\n        self.value = value\n        self.next = next\n\n';

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ ds-1-arrays
  'ds-1-arrays': [
    ex('Why data structures?', 'A **data structure** is a way to organize data so certain operations are fast. Choosing the right one is often the difference between a program that takes a second and one that takes an hour.\n\nWe\'ll describe speed with **Big-O**: O(1) means "constant time, no matter how big", O(n) means "grows with the size n". (The Algorithms course goes deep on this.)'),
    ex('Arrays: side by side in memory', 'An **array** stores items in **one continuous block of memory**, like numbered lockers in a row. To find item i, the computer computes `start + i × itemSize` — one step, no searching.\n\n- Read/write by index: **O(1)**\n- Insert or delete in the middle: **O(n)** — everything after it must shift over\n\nPython\'s `list` is an array of references under the hood.'),
    mc('Why is `nums[500000]` instant even in a huge list?', ['Python searches really fast', 'The position is computed directly from the index — no searching', 'Lists are sorted'], 1, 'start + index × size: one calculation.'),
    ex('Dynamic arrays', 'A real array has a **fixed size**. Python lists grow with `append` by using a **dynamic array**: when it\'s full, allocate a bigger block (about 1.125–2× the size) and copy everything over.\n\nCopying is O(n), but it happens so rarely that `append` is **O(1) on average** — called **amortized O(1)**.'),
    mc('Which list operation is O(n) — slow on a big list?', ['nums[i]', 'nums.append(x)', 'nums.insert(0, x)', 'len(nums)'], 2, 'Inserting at the front shifts every other item right.'),
    mc('Which is also O(n) on a Python list?', ['nums[-1]', 'x in nums', 'nums.pop()', 'nums[3] = 7'], 1, '`in` has to check items one by one.'),
    py({
      prompt: 'Write `rotate_right(nums, k)` that returns a **new** list with the items shifted k places to the right (wrapping around). `rotate_right([1, 2, 3, 4, 5], 2)` → `[4, 5, 1, 2, 3]`. k may be bigger than the length.',
      starter: 'def rotate_right(nums, k):\n    pass\n',
      tests: [eq('rotate_right([1, 2, 3, 4, 5], 2)', '[4, 5, 1, 2, 3]'), eq('rotate_right([1, 2, 3], 3)', '[1, 2, 3]'), eq('rotate_right([1, 2, 3], 4)', '[3, 1, 2]'), eq('rotate_right([], 5)', '[]')],
      hints: ['Use k % len(nums) to handle big k (but watch out for an empty list).', 'Slices: nums[-k:] + nums[:-k]'],
      solution: 'def rotate_right(nums, k):\n    if not nums:\n        return []\n    k %= len(nums)\n    return nums[-k:] + nums[:-k] if k else nums[:]\n',
    }),
  ],

  // ------------------------------------------------------------------ ds-1-linked-lists
  'ds-1-linked-lists': [
    ex('Nodes and pointers', 'A **linked list** stores each item in its own **node**, and each node points to the **next** one:\n\n```text\nhead → [3 | •] → [7 | •] → [9 | None]\n```\n\n```python\nclass Node:\n    def __init__(self, value, next=None):\n        self.value = value\n        self.next = next\n\nhead = Node(3, Node(7, Node(9)))\n```\n\nNodes can live anywhere in memory — the pointers tie them together.'),
    ex('Walking a linked list', 'To visit every node, start at the head and follow `next` until you hit `None`:\n\n```python\nnode = head\nwhile node is not None:\n    print(node.value)\n    node = node.next\n```'),
    ans('What does this print?', ['7'], 'head is 3; head.next is 7.', 'class Node:\n    def __init__(self, value, next=None):\n        self.value = value\n        self.next = next\n\nhead = Node(3, Node(7, Node(9)))\nprint(head.next.value)'),
    py({
      prompt: 'Write `to_list(head)` that returns a Python list of the values in a linked list (the `Node` class is provided).',
      starter: LINKED_LIST_STARTER + 'def to_list(head):\n    pass\n',
      tests: [eq('to_list(Node(1, Node(2, Node(3))))', '[1, 2, 3]'), eq('to_list(None)', '[]', 'empty list (head is None)')],
      hints: ['out = []; node = head; while node: out.append(node.value); node = node.next'],
      solution: LINKED_LIST_STARTER + 'def to_list(head):\n    out = []\n    node = head\n    while node is not None:\n        out.append(node.value)\n        node = node.next\n    return out\n',
    }),
    ex('Fast at the front', 'Adding to the **front** is **O(1)** — make a new node pointing at the old head:\n\n```python\nhead = Node(1, head)\n```\n\nBut reaching item i means walking i steps: **O(n)**. No jumping to the middle.'),
    py({
      prompt: 'Write `reverse(head)` that reverses a linked list **in place** (by re-pointing `next`) and returns the new head. This is a classic interview question!',
      starter: LINKED_LIST_STARTER + 'def to_list(head):\n    out = []\n    while head:\n        out.append(head.value)\n        head = head.next\n    return out\n\ndef reverse(head):\n    pass\n',
      tests: [eq('to_list(reverse(Node(1, Node(2, Node(3)))))', '[3, 2, 1]'), eq('reverse(None)', 'None'), eq('to_list(reverse(Node(5)))', '[5]'), { name: 'reuses the same nodes (no copying)', code: 'a = Node(1, Node(2))\nb = a.next\nassert reverse(a) is b and b.next is a and a.next is None' }],
      hints: ['Keep three pointers: prev (starts None), node (starts head), and the saved next.', 'Loop: nxt = node.next; node.next = prev; prev = node; node = nxt. Return prev.'],
      solution: LINKED_LIST_STARTER + 'def to_list(head):\n    out = []\n    while head:\n        out.append(head.value)\n        head = head.next\n    return out\n\ndef reverse(head):\n    prev = None\n    node = head\n    while node:\n        nxt = node.next\n        node.next = prev\n        prev = node\n        node = nxt\n    return prev\n',
    }),
    mc('Getting the 1000th item of a linked list takes…', ['O(1)', 'O(n) — you must walk from the head', 'O(log n)'], 1, 'No index math possible: follow 999 pointers.'),
  ],

  // ------------------------------------------------------------------ ds-1-compare
  'ds-1-compare': [
    ex('Trade-offs', '| Operation | Array (Python list) | Linked list |\n|---|---|---|\n| Get item i | **O(1)** | O(n) |\n| Add/remove at end | **O(1)** amortized | O(1) with a tail pointer |\n| Add/remove at front | O(n) | **O(1)** |\n| Insert after a node you have | O(n) | **O(1)** |\n| Memory | compact | extra pointer per item |\n\nNo structure wins everything — you pick based on which operations your program does most.'),
    mc('A music app constantly jumps to "song number 4,512". Which fits best?', ['Array', 'Linked list'], 0, 'Random access by index is the array\'s strength.'),
    mc('An undo history adds and removes only at the front, millions of times. Which avoids O(n) shifting?', ['Array with insert(0, x)', 'Linked list'], 1, 'Front operations are O(1) for linked lists.'),
    ex('Caches love arrays', 'In practice arrays are often faster than Big-O alone suggests: their items sit next to each other in memory, so the CPU **cache** loads many at once. Linked-list nodes are scattered.\n\nThat\'s why Python\'s list is an array, and why `collections.deque` (blocks of arrays linked together) is the go-to for fast operations at both ends.'),
    mc('Which Python type gives O(1) adds and removes at BOTH ends?', ['list', 'tuple', 'collections.deque', 'str'], 2, 'deque = double-ended queue.'),
    py({
      prompt: 'Measure it! Write `front_inserts(n)` that inserts n items at the **front** of a `deque` (using `appendleft`) and returns the deque. It must handle n = 200,000 quickly (a list with insert(0, …) would be far too slow).',
      starter: 'from collections import deque\n\ndef front_inserts(n):\n    pass\n',
      tests: [eq('list(front_inserts(3))', '[2, 1, 0]'), fast('', 'front_inserts(200000)', 1.5, '200,000 front inserts in well under 2 seconds')],
      hints: ['d = deque(); for i in range(n): d.appendleft(i); return d'],
      solution: 'from collections import deque\n\ndef front_inserts(n):\n    d = deque()\n    for i in range(n):\n        d.appendleft(i)\n    return d\n',
    }),
  ],

  // ------------------------------------------------------------------ ds-2-stacks
  'ds-2-stacks': [
    ex('Last in, first out', 'A **stack** is like a stack of plates: you only touch the **top**.\n\n- **push**: put on top\n- **pop**: take off the top\n- **peek**: look at the top\n\nAll **O(1)**. In Python, a list is a perfect stack: `append` to push, `pop()` to pop, `stack[-1]` to peek.', 'Stacks are everywhere: the undo button, the browser back button, and the call stack running your recursive functions.'),
    ans('Push 1, push 2, push 3, pop, push 4, pop. What is popped the second time?', ['4'], 'After pushing 4 it\'s on top, so it comes off next.'),
    ans('What does this print?', ['[1, 4]'], 'Push 1, 2, 3 → pop 3 → pop 2 → push 4.', 'stack = []\nfor x in [1, 2, 3]:\n    stack.append(x)\nstack.pop()\nstack.pop()\nstack.append(4)\nprint(stack)'),
    mc('Which data structure does the browser "Back" button use?', ['Queue', 'Stack', 'Hash table'], 1, 'The most recently visited page is the first one you go back to.'),
    py({
      prompt: 'Use a stack to reverse a string: push every character, then pop them all into the result. Write `reverse_with_stack(s)`.',
      starter: 'def reverse_with_stack(s):\n    pass\n',
      tests: [eq('reverse_with_stack("stack")', '"kcats"'), eq('reverse_with_stack("")', '""'), { name: 'uses a stack (no [::-1])', code: 'assert "[::-1]" not in __source__ and "reversed(" not in __source__ and ".pop(" in __source__' }],
      hints: ['stack = list(s) works as "push everything".', 'while stack: out += stack.pop()'],
      solution: 'def reverse_with_stack(s):\n    stack = []\n    for ch in s:\n        stack.append(ch)\n    out = ""\n    while stack:\n        out += stack.pop()\n    return out\n',
    }),
    py({
      prompt: 'Build a `MinStack` class: `push(x)`, `pop()`, `top()`, and `get_min()` — and **every** operation must be O(1). (Hint: keep a second stack of minimums.)',
      starter: 'class MinStack:\n    pass\n',
      tests: [
        { name: 'tracks the minimum through pushes and pops', code: 's = MinStack()\ns.push(5); s.push(2); s.push(7); s.push(1)\nassert s.get_min() == 1\ns.pop()\nassert s.get_min() == 2 and s.top() == 7\ns.pop(); s.pop()\nassert s.get_min() == 5' },
        { name: 'handles repeated minimums', code: 's = MinStack()\ns.push(2); s.push(2); s.pop()\nassert s.get_min() == 2' },
        fast('s = MinStack()\nfor i in range(100000, 0, -1):\n    s.push(i)', 'for _ in range(100000):\n    s.get_min()', 1.0, 'get_min is O(1)'),
      ],
      hints: ['Keep self.items and self.mins.', 'On push: also push min(x, current min) onto mins. On pop: pop both.'],
      solution: 'class MinStack:\n    def __init__(self):\n        self.items = []\n        self.mins = []\n\n    def push(self, x):\n        self.items.append(x)\n        self.mins.append(x if not self.mins else min(x, self.mins[-1]))\n\n    def pop(self):\n        self.mins.pop()\n        return self.items.pop()\n\n    def top(self):\n        return self.items[-1]\n\n    def get_min(self):\n        return self.mins[-1]\n',
    }),
  ],

  // ------------------------------------------------------------------ ds-2-queues
  'ds-2-queues': [
    ex('First in, first out', 'A **queue** is a line at a store: join at the **back**, leave from the **front**.\n\n- **enqueue**: add to the back\n- **dequeue**: remove from the front\n\n⚠️ Don\'t use `list.pop(0)` — it\'s O(n). Use `collections.deque`: `append` + `popleft`, both O(1).'),
    ans('Enqueue A, B, C, then dequeue twice. Which item is left?', ['C'], 'A leaves first, then B.'),
    mc('Printers, web servers and customer-support lines use which structure for waiting jobs?', ['Stack', 'Queue', 'Set'], 1, 'First come, first served.'),
    ex('Deques', 'A **deque** ("deck") allows adding and removing at **both** ends in O(1): `append`, `appendleft`, `pop`, `popleft`.\n\nIt can act as a stack, a queue, or both — and `deque(maxlen=3)` keeps only the most recent 3 items, handy for "last N events".'),
    ans('What does this print?', ['[3, 4, 5]'], 'maxlen=3 drops the oldest items as new ones arrive, so only the last 3 remain.', 'from collections import deque\nd = deque(maxlen=3)\nfor x in [1, 2, 3, 4, 5]:\n    d.append(x)\nprint(list(d))'),
    py({
      prompt: 'Simulate a ticket line: `serve(people, n)` takes a list of names in arrival order and returns the list of the first n people served (or everyone, if fewer). Use a `deque`.',
      starter: 'from collections import deque\n\ndef serve(people, n):\n    pass\n',
      tests: [eq('serve(["Ana", "Bo", "Cy"], 2)', '["Ana", "Bo"]'), eq('serve(["Ana"], 5)', '["Ana"]'), { name: 'uses popleft', code: 'assert "popleft" in __source__' }],
      hints: ['q = deque(people); out = []', 'while q and len(out) < n: out.append(q.popleft())'],
      solution: 'from collections import deque\n\ndef serve(people, n):\n    q = deque(people)\n    out = []\n    while q and len(out) < n:\n        out.append(q.popleft())\n    return out\n',
    }),
    py({
      prompt: 'Build a queue from **two stacks** (another classic!): class `StackQueue` with `enqueue(x)` and `dequeue()`. Push onto an "in" stack; when you need to dequeue and the "out" stack is empty, move everything over (which reverses the order). Raise `IndexError` if empty.',
      starter: 'class StackQueue:\n    pass\n',
      tests: [
        { name: 'FIFO order', code: 'q = StackQueue()\nfor x in [1, 2, 3]:\n    q.enqueue(x)\nassert q.dequeue() == 1\nq.enqueue(4)\nassert [q.dequeue(), q.dequeue(), q.dequeue()] == [2, 3, 4]' },
        raises('StackQueue().dequeue()', 'IndexError', 'dequeue on empty raises IndexError'),
      ],
      hints: ['self.inbox, self.outbox = [], []', 'dequeue: if not outbox, move everything: while inbox: outbox.append(inbox.pop())'],
      solution: 'class StackQueue:\n    def __init__(self):\n        self.inbox = []\n        self.outbox = []\n\n    def enqueue(self, x):\n        self.inbox.append(x)\n\n    def dequeue(self):\n        if not self.outbox:\n            while self.inbox:\n                self.outbox.append(self.inbox.pop())\n        if not self.outbox:\n            raise IndexError("dequeue from empty queue")\n        return self.outbox.pop()\n',
    }),
  ],

  // ------------------------------------------------------------------ ds-2-applications
  'ds-2-applications': [
    ex('Matching brackets', 'Is `( [ ] { } )` balanced? Is `( [ ) ]`? A stack makes this easy:\n\n- opening bracket → **push** it\n- closing bracket → the top of the stack must be its partner; **pop** it\n- at the end the stack must be **empty**\n\nCompilers and code editors do exactly this to match your parentheses.'),
    mc('Checking "( [ ) ]": what goes wrong?', ['Nothing — it\'s balanced', 'When ")" arrives, the top of the stack is "[" — not its partner', 'The stack is empty at the end'], 1, 'Order matters: the most recent opener must close first.'),
    ex('Evaluating expressions', 'Calculators turn `3 + 4 × 2` into **postfix** (Reverse Polish) notation: `3 4 2 × +`. Then a stack evaluates it: push numbers; on an operator, pop two, compute, push the result.\n\n```text\n3 4 2 × +\npush 3, push 4, push 2\n× → pop 2 and 4 → push 8\n+ → pop 8 and 3 → push 11\n```'),
    ans('Evaluate the postfix expression `5 1 2 + 4 * + 3 -`.', ['14'], '1+2 = 3; 3×4 = 12; 5+12 = 17; 17−3 = 14.'),
    py({
      prompt: 'Write `eval_rpn(tokens)` for a list of postfix tokens (numbers as strings, and the operators `+ - * /`, where `/` does integer division toward zero, i.e. `int(a / b)`). Return the integer result.',
      starter: 'def eval_rpn(tokens):\n    pass\n',
      tests: [eq('eval_rpn(["2", "1", "+", "3", "*"])', '9'), eq('eval_rpn(["4", "13", "5", "/", "+"])', '6'), eq('eval_rpn(["7", "-2", "/"])', '-3', 'division toward zero'), eq('eval_rpn(["42"])', '42')],
      hints: ['For an operator, pop b first, then a, and push a (op) b.', 'Numbers: stack.append(int(token)). Careful: "-2" is a number, not an operator.'],
      solution: 'def eval_rpn(tokens):\n    stack = []\n    for t in tokens:\n        if t in ("+", "-", "*", "/"):\n            b = stack.pop()\n            a = stack.pop()\n            if t == "+":\n                stack.append(a + b)\n            elif t == "-":\n                stack.append(a - b)\n            elif t == "*":\n                stack.append(a * b)\n            else:\n                stack.append(int(a / b))\n        else:\n            stack.append(int(t))\n    return stack[0]\n',
    }),
    py({
      prompt: '**Next greater element:** for each number, find the first larger number to its right (or -1). `[2, 1, 3, 2]` → `[3, 3, -1, -1]`. Aim for O(n) with a stack of indexes still "waiting" for an answer.',
      starter: 'def next_greater(nums):\n    pass\n',
      tests: [eq('next_greater([2, 1, 3, 2])', '[3, 3, -1, -1]'), eq('next_greater([5, 4, 3])', '[-1, -1, -1]'), eq('next_greater([])', '[]'), fast('import random\nrandom.seed(1)\nbig = [random.randint(0, 10**6) for _ in range(200000)]', 'next_greater(big)', 2.0, 'O(n): 200,000 numbers quickly')],
      hints: ['result = [-1] * len(nums); stack = []  (holds indexes)', 'For each i: while stack and nums[stack[-1]] < nums[i]: result[stack.pop()] = nums[i]. Then push i.'],
      solution: 'def next_greater(nums):\n    result = [-1] * len(nums)\n    stack = []\n    for i, x in enumerate(nums):\n        while stack and nums[stack[-1]] < x:\n            result[stack.pop()] = x\n        stack.append(i)\n    return result\n',
    }),
  ],

  // ------------------------------------------------------------------ ds-3-hashing
  'ds-3-hashing': [
    ex('Instant lookups', 'Finding a name in a list means checking items one by one: O(n). A **hash table** finds it in **O(1) on average** — the magic behind Python\'s `dict` and `set`.\n\nThe trick: a **hash function** turns a key into a number, which picks a **bucket** (slot) in an array:\n\n```text\nhash("apple") → 9284713 → 9284713 % 8 = 1 → bucket 1\n```\n\nTo find "apple" later, compute the same hash and go straight to bucket 1.'),
    mc('What must a hash function always do?', ['Return a random number', 'Return the same number for the same key, every time', 'Return a unique number for every key ever'], 1, 'Deterministic: same input → same output. (Uniqueness is impossible — see collisions next.)'),
    ex('A toy hash function', '```python\ndef toy_hash(key, size):\n    return sum(ord(ch) for ch in key) % size\n```\n\n`ord` gives a character\'s number (`ord("a")` = 97). Good real hash functions spread keys evenly so buckets stay small.'),
    ans('With toy_hash, which bucket (size 10) does "ab" go in? (ord("a") = 97, ord("b") = 98)', ['5'], '97 + 98 = 195, and 195 % 10 = 5.'),
    ex('Keys must be immutable', 'If a key could change after being stored, its hash would change and it would end up in the wrong bucket. So dict keys and set items must be **hashable** — immutable things like numbers, strings and tuples.\n\n```python\n{[1, 2]: "x"}   # TypeError: unhashable type: \'list\'\n{(1, 2): "x"}   # fine — tuples are immutable\n```'),
    mc('Which can be a dictionary key?', ['[3, 4]', '{"a": 1}', '(3, 4)', '{3, 4}'], 2, 'Tuples are immutable, so they\'re hashable. Lists, dicts and sets are not.'),
    py({
      prompt: 'Write `toy_hash(key, size)` from the lesson, then `bucket_sizes(keys, size)` that returns a list of how many keys land in each of the `size` buckets.',
      starter: 'def toy_hash(key, size):\n    pass\n\ndef bucket_sizes(keys, size):\n    pass\n',
      tests: [eq('toy_hash("ab", 10)', '5'), eq('bucket_sizes(["ab", "ba", "c"], 10)', '[0, 0, 0, 0, 0, 2, 0, 0, 0, 1]'), eq('bucket_sizes([], 3)', '[0, 0, 0]')],
      hints: ['toy_hash: return sum(ord(ch) for ch in key) % size', 'bucket_sizes: counts = [0] * size; for k in keys: counts[toy_hash(k, size)] += 1'],
      solution: 'def toy_hash(key, size):\n    return sum(ord(ch) for ch in key) % size\n\ndef bucket_sizes(keys, size):\n    counts = [0] * size\n    for k in keys:\n        counts[toy_hash(k, size)] += 1\n    return counts\n',
    }),
  ],

  // ------------------------------------------------------------------ ds-3-collisions
  'ds-3-collisions': [
    ex('When two keys share a bucket', 'There are far more possible keys than buckets, so two keys will eventually hash to the same bucket — a **collision** (the pigeonhole principle from Discrete Math!). Notice "ab" and "ba" collided with our toy hash.\n\nTwo classic fixes:\n\n- **Chaining:** each bucket holds a small list of (key, value) pairs\n- **Open addressing:** if a bucket is taken, probe the next free one (Python\'s dict does a version of this)'),
    ex('Load factor and resizing', 'The **load factor** is items ÷ buckets. As it grows, buckets get crowded and lookups slow down. So hash tables **resize** (usually doubling the buckets and re-inserting everything) when the load factor passes a limit like 0.66–0.75.\n\nLike dynamic arrays, resizing is rare enough that operations stay **O(1) on average**. Worst case (everything collides) is O(n).'),
    mc('A table has 8 buckets and 6 items. What is the load factor?', ['0.5', '0.75', '1.33', '6'], 1, '6 / 8 = 0.75 — time to resize in many implementations.'),
    mc('If a terrible hash function sent every key to the same bucket, lookups would take…', ['O(1)', 'O(log n)', 'O(n)'], 2, 'One giant chain = searching a list.'),
    py({
      prompt: 'Build your own hash map with **chaining**: class `HashMap` with `put(key, value)` (insert or update), `get(key)` (raise `KeyError` if missing), and `__len__`. Use `self.buckets = [[] for _ in range(8)]` and Python\'s built-in `hash(key) % len(self.buckets)`.\n\n**Bonus (required by a test):** when `len` exceeds 0.75 × the number of buckets, double the buckets and re-insert everything.',
      starter: 'class HashMap:\n    def __init__(self):\n        self.buckets = [[] for _ in range(8)]\n        self.count = 0\n',
      tests: [
        { name: 'put and get', code: 'm = HashMap()\nm.put("a", 1); m.put("b", 2)\nassert m.get("a") == 1 and m.get("b") == 2 and len(m) == 2' },
        { name: 'put updates existing keys', code: 'm = HashMap()\nm.put("a", 1); m.put("a", 5)\nassert m.get("a") == 5 and len(m) == 1' },
        raises('HashMap().get("missing")', 'KeyError', 'missing key raises KeyError'),
        { name: 'resizes and keeps everything', code: 'm = HashMap()\nfor i in range(1000):\n    m.put(i, i * i)\nassert len(m) == 1000 and all(m.get(i) == i * i for i in range(1000))\nassert len(m.buckets) >= 1000 / 0.75, f"only {len(m.buckets)} buckets for 1000 items — resize when the load factor passes 0.75"' },
      ],
      hints: ['put: find the bucket; loop over its (k, v) pairs — if k matches, replace it; else append (key, value) and count += 1.', 'Resize: old = all pairs; self.buckets = [[] for _ in range(2 * n)]; re-insert each pair into its new bucket.'],
      solution: 'class HashMap:\n    def __init__(self):\n        self.buckets = [[] for _ in range(8)]\n        self.count = 0\n\n    def _bucket(self, key):\n        return self.buckets[hash(key) % len(self.buckets)]\n\n    def put(self, key, value):\n        b = self._bucket(key)\n        for i, (k, _) in enumerate(b):\n            if k == key:\n                b[i] = (key, value)\n                return\n        b.append((key, value))\n        self.count += 1\n        if self.count > 0.75 * len(self.buckets):\n            self._resize()\n\n    def _resize(self):\n        pairs = [p for b in self.buckets for p in b]\n        self.buckets = [[] for _ in range(2 * len(self.buckets))]\n        for k, v in pairs:\n            self._bucket(k).append((k, v))\n\n    def get(self, key):\n        for k, v in self._bucket(key):\n            if k == key:\n                return v\n        raise KeyError(key)\n\n    def __len__(self):\n        return self.count\n',
    }),
  ],

  // ------------------------------------------------------------------ ds-3-using
  'ds-3-using': [
    ex('The hash map toolbox', 'Most "make it faster" interview problems are solved by trading memory for a hash map or set:\n\n- **Seen before?** Keep a `set` → O(1) membership\n- **Counting:** `Counter` or `dict.get(k, 0) + 1`\n- **Grouping:** `defaultdict(list)` keyed by some signature\n- **Complement lookup:** "is target − x already seen?" (Two Sum)\n\nTurning an O(n²) double loop into an O(n) single pass is the most common optimization in interviews.'),
    mc('To check whether a list has duplicates, the fastest approach is…', ['Compare every pair (two loops)', 'Sort, then compare neighbors', 'Add items to a set and stop when one is already there'], 2, 'O(n) with a set (sorting is O(n log n); pairs are O(n²)).'),
    py({
      prompt: '**First repeated character:** return the first character in `s` that appears a second time (reading left to right), or `None`. `"abcbad"` → `"b"`. Make it O(n) with a set.',
      starter: 'def first_repeat(s):\n    pass\n',
      tests: [eq('first_repeat("abcbad")', '"b"'), eq('first_repeat("abc")', 'None'), eq('first_repeat("aa")', '"a"'), fast('big = "".join(chr(0x4e00 + i) for i in range(200000)) + "x" + "x"', 'assert first_repeat(big) == "x"', 1.5, 'O(n) on 200,000 characters')],
      hints: ['seen = set(); for ch in s: if ch in seen: return ch; seen.add(ch)'],
      solution: 'def first_repeat(s):\n    seen = set()\n    for ch in s:\n        if ch in seen:\n            return ch\n        seen.add(ch)\n    return None\n',
    }),
    py({
      prompt: '**Group anagrams:** return a list of groups where each group contains words that are anagrams of each other. Inside each group keep the original order; order the groups by their first appearance.\n\n`["eat", "tea", "tan", "ate", "nat", "bat"]` → `[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]`',
      starter: 'def group_anagrams(words):\n    pass\n',
      tests: [eq('group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"])', '[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]'), eq('group_anagrams([])', '[]'), eq('group_anagrams(["a"])', '[["a"]]')],
      hints: ['Anagrams have the same sorted letters: "".join(sorted(w)) is a great key.', 'Use a dict from key → list (dicts keep insertion order), then return list(d.values()).'],
      solution: 'def group_anagrams(words):\n    groups = {}\n    for w in words:\n        key = "".join(sorted(w))\n        groups.setdefault(key, []).append(w)\n    return list(groups.values())\n',
    }),
    py({
      prompt: '**Longest consecutive run:** given unsorted integers, return the length of the longest run of consecutive numbers. `[100, 4, 200, 1, 3, 2]` → 4 (1, 2, 3, 4). Do it in O(n): put everything in a set, and only start counting at numbers whose predecessor (n − 1) isn\'t in the set.',
      starter: 'def longest_run(nums):\n    pass\n',
      tests: [eq('longest_run([100, 4, 200, 1, 3, 2])', '4'), eq('longest_run([])', '0'), eq('longest_run([5, 5, 5])', '1'), fast('big = list(range(300000, 0, -1))', 'assert longest_run(big) == 300000', 2.0, 'O(n) on 300,000 numbers')],
      hints: ['s = set(nums); best = 0', 'for n in s: if n - 1 not in s: count up while n + length in s; update best.'],
      solution: 'def longest_run(nums):\n    s = set(nums)\n    best = 0\n    for n in s:\n        if n - 1 not in s:\n            length = 1\n            while n + length in s:\n                length += 1\n            best = max(best, length)\n    return best\n',
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'ds-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Array access by index is…', ['O(1)', 'O(n)', 'O(log n)'], 0, 'Computed directly.'),
      mc('Inserting at the front of a Python list is…', ['O(1)', 'O(n)'], 1, 'Everything shifts.'),
      mc('Linked list access to item i is…', ['O(1)', 'O(n)'], 1, 'Walk the pointers.'),
      mc('Python list append is…', ['O(n) every time', 'amortized O(1)', 'O(log n)'], 1, 'Occasional resize.'),
      ord('Order the pointer steps inside the loop that reverses a linked list.', ['nxt = node.next', 'node.next = prev', 'prev = node', 'node = nxt'], 'Save next, re-point, advance both.', 'python'),
      py({ prompt: 'Write `length(head)` returning the number of nodes in a linked list.', starter: LINKED_LIST_STARTER + 'def length(head):\n    pass\n', tests: [eq('length(Node(1, Node(2)))', '2'), eq('length(None)', '0')], solution: LINKED_LIST_STARTER + 'def length(head):\n    n = 0\n    while head:\n        n += 1\n        head = head.next\n    return n\n' }),
      py({ prompt: 'Write `middle(head)` that returns the value of the middle node (for even lengths, the second of the two middles). Try the fast/slow pointer trick: one pointer moves 2 steps for each 1 step of the other.', starter: LINKED_LIST_STARTER + 'def middle(head):\n    pass\n', tests: [eq('middle(Node(1, Node(2, Node(3))))', '2'), eq('middle(Node(1, Node(2, Node(3, Node(4)))))', '3'), eq('middle(Node(9))', '9')], solution: LINKED_LIST_STARTER + 'def middle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow.value\n' }),
    ],
  },
  'ds-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('A stack is…', ['FIFO', 'LIFO'], 1, 'Last in, first out.'),
      mc('A queue is…', ['FIFO', 'LIFO'], 0, 'First in, first out.'),
      mc('The O(1) way to dequeue in Python is…', ['list.pop(0)', 'deque.popleft()'], 1, 'deque.'),
      ans('Push a, b, c; pop; pop. What\'s on top?', ['a'], 'c and b were removed.'),
      ans('Evaluate postfix `3 4 + 2 *`.', ['14'], '(3 + 4) × 2.'),
      py({ prompt: 'Write `is_balanced(s)` for strings of `()[]{}` using a stack.', starter: 'def is_balanced(s):\n    pass\n', tests: [eq('is_balanced("{[()]}")', 'True'), eq('is_balanced("([)]")', 'False'), eq('is_balanced("(")', 'False'), eq('is_balanced("")', 'True')], solution: 'def is_balanced(s):\n    pairs = {")": "(", "]": "[", "}": "{"}\n    stack = []\n    for ch in s:\n        if ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n        else:\n            stack.append(ch)\n    return not stack\n' }),
      py({ prompt: 'Write `last_k(items, k)` that returns a list of the last k items seen, using `deque(maxlen=k)`.', starter: 'from collections import deque\n\ndef last_k(items, k):\n    pass\n', tests: [eq('last_k([1, 2, 3, 4], 2)', '[3, 4]'), eq('last_k([1], 3)', '[1]'), { name: 'uses maxlen', code: 'assert "maxlen" in __source__' }], solution: 'from collections import deque\n\ndef last_k(items, k):\n    return list(deque(items, maxlen=k))\n' }),
    ],
  },
  'ds-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Average lookup time in a hash table:', ['O(1)', 'O(n)', 'O(log n)'], 0, 'Average O(1).'),
      mc('Two keys landing in the same bucket is a…', ['crash', 'collision', 'resize'], 1, 'Collision.'),
      mc('Which can\'t be a dict key?', ['"abc"', '42', '(1, 2)', '[1, 2]'], 3, 'Lists are unhashable.'),
      ans('Load factor of a table with 16 buckets and 4 items?', ['0.25', '.25', '1/4'], '4 / 16.'),
      py({ prompt: 'Write `two_sum(nums, target)` returning indexes [i, j] (i < j) of two numbers adding to target, in O(n) with a dict.', starter: 'def two_sum(nums, target):\n    pass\n', tests: [eq('two_sum([2, 7, 11, 15], 9)', '[0, 1]'), eq('two_sum([3, 3], 6)', '[0, 1]'), fast('big = list(range(200000))', 'assert two_sum(big, 399997) == [199998, 199999]', 1.5, 'O(n)')], solution: 'def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n' }),
      py({ prompt: 'Write `common(a, b)` returning a sorted list of values that appear in both lists (no duplicates), in O(n) using sets.', starter: 'def common(a, b):\n    pass\n', tests: [eq('common([1, 2, 2, 3], [2, 3, 4])', '[2, 3]'), eq('common([], [1])', '[]')], solution: 'def common(a, b):\n    return sorted(set(a) & set(b))\n' }),
    ],
  },
};
