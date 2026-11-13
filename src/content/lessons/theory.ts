/**
 * Track: theory — "Theory of Computation"
 * Written here: th-1 (automata, regex, grammars), th-2 (Turing machines, halting, complexity)
 * + checkpoints + course final exam. Hands-on parts are small Python simulations.
 */
import type { Checkpoint, Step } from '../types';
import { ans, ansT, eq, ex, mc, mcT, py } from './_helpers';

const EVEN_ONES = '{("Even", "0"): "Even", ("Even", "1"): "Odd", ("Odd", "0"): "Odd", ("Odd", "1"): "Even"}';

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ th-1-dfa
  'th-1-dfa': [
    ex('The simplest computer', 'A **finite automaton** (DFA) is a machine with a few **states** and no other memory. It reads a string one symbol at a time, and each symbol moves it to a new state. At the end it **accepts** if it\'s in an accepting state.\n\nThis DFA accepts binary strings with an **even number of 1s**:\n\n| state | on 0 | on 1 |\n|---|---|---|\n| **Even** (start, accepting) | Even | Odd |\n| Odd | Odd | Even |', 'Theory asks the deepest question in CS: what can be computed at all? We start with the weakest machine and work up.'),
    ansT('Run the DFA on the input 1011, starting in Even. Which state does it end in?', ['Odd'], 'Even →1→ Odd →0→ Odd →1→ Even →1→ Odd. Three 1s is odd, so it\'s rejected.'),
    mc('Does the DFA accept 0110?', ['Accepted', 'Rejected'], 0, 'Two 1s is even, so it ends in Even, an accepting state.'),
    ex('Nondeterminism', 'An **NFA** (nondeterministic finite automaton) may have **several** possible moves for the same symbol, or moves that read nothing at all. It accepts if **any** path ends in an accepting state.\n\nSurprise: NFAs are **no more powerful**. Any NFA can be turned into a DFA (the "subset construction"). It just might need many more states: up to 2ⁿ.'),
    mc('Which languages can NFAs recognize, compared with DFAs?', ['Exactly the same ones', 'More', 'Fewer'], 0, 'They\'re equally powerful. NFAs are often just easier to design.'),
    mc('A DFA has only finitely many states. Can one recognize "some 0s followed by the SAME number of 1s" (0ⁿ1ⁿ)?', ['No: it would need to count without limit', 'Yes, with enough states'], 0, 'For any DFA with k states, a string with more than k 0s makes it lose count. (The formal proof is called the pumping lemma.)'),
    py({
      prompt: 'Simulate any DFA. Write `run_dfa(transitions, start, accepting, s)`:\n\n- `transitions` is a dict like `{("Even", "1"): "Odd", …}`\n- start in `start`, follow one transition per character of `s`\n- return **True** if the final state is in the set `accepting`',
      starter: 'def run_dfa(transitions, start, accepting, s):\n    pass\n',
      tests: [
        eq(`run_dfa(${EVEN_ONES}, "Even", {"Even"}, "0110")`, 'True'),
        eq(`run_dfa(${EVEN_ONES}, "Even", {"Even"}, "1011")`, 'False'),
        eq(`run_dfa(${EVEN_ONES}, "Even", {"Even"}, "")`, 'True'),
      ],
      hints: ['state = start, then for ch in s: state = transitions[(state, ch)]', 'return state in accepting'],
      solution: 'def run_dfa(transitions, start, accepting, s):\n    state = start\n    for ch in s:\n        state = transitions[(state, ch)]\n    return state in accepting\n',
    }),
  ],

  // ------------------------------------------------------------------ th-1-regex
  'th-1-regex': [
    ex('Patterns', 'A **regular expression** describes a set of strings using three building blocks:\n\n- **concatenation**: `ab` means a then b\n- **union**: `a|b` means a or b\n- **star**: `a*` means zero or more a\'s\n\nSo `a(b|c)*` is "an a, then any mix of b\'s and c\'s".\n\n**Kleene\'s theorem:** regular expressions describe exactly the languages DFAs recognize, called the **regular languages**.'),
    mc('Which strings all match a(b|c)*?', ['a, ab, acb, abbc', 'b, bc, cb', 'only abc'], 0, 'Every match starts with a; after that, any b\'s and c\'s.'),
    ans('Does the string abbb fully match the pattern ab*? (yes or no)', ['yes', 'y'], 'An a followed by three b\'s, and b* allows any number.'),
    ex('Regex in Python', 'Real-world regex adds shortcuts: `\\d` (a digit), `[a-z]` (one lowercase letter), `+` (one or more), `?` (optional), `{3}` (exactly 3).\n\n```python\nimport re\nre.fullmatch(r"\\d{3}-\\d{4}", "555-1234")   # a match object (truthy)\nre.fullmatch(r"\\d{3}-\\d{4}", "55-1234")    # None\n```\n\n`fullmatch` requires the **whole** string to match. The `r"..."` raw string keeps the backslashes intact.'),
    ans('What does this print?', ['True'], '[a-z]+ matches "pip" and \\d matches "7".', 'import re\nprint(bool(re.fullmatch(r"[a-z]+\\d", "pip7")))'),
    mc('Can a regular expression check that parentheses are balanced, to any depth?', ['No: balanced parentheses are not a regular language', 'Yes, with enough stars'], 0, 'It\'s the 0ⁿ1ⁿ problem again: you\'d need unlimited counting. Grammars (next lesson) can do it.'),
    py({
      prompt: 'Write `is_zip(s)` that returns True for a U.S. ZIP code: **5 digits**, optionally followed by a dash and **4 more digits** (like `12345` or `12345-6789`). Use `re.fullmatch`.',
      starter: 'import re\n\n\ndef is_zip(s):\n    pass\n',
      tests: [eq('is_zip("12345")', 'True'), eq('is_zip("12345-6789")', 'True'), eq('is_zip("1234")', 'False'), eq('is_zip("12345-67")', 'False'), eq('is_zip("abcde")', 'False'), { name: 'uses a regular expression', code: 'assert "re." in __source__, "Use the re module"' }],
      hints: ['\\d{5} is five digits. (-\\d{4})? makes the dash part optional.', 'return re.fullmatch(r"\\d{5}(-\\d{4})?", s) is not None'],
      solution: 'import re\n\n\ndef is_zip(s):\n    return re.fullmatch(r"\\d{5}(-\\d{4})?", s) is not None\n',
    }),
  ],

  // ------------------------------------------------------------------ th-1-grammars
  'th-1-grammars': [
    ex('Grammars', 'A **context-free grammar** builds strings with rewrite rules. This one has a single rule with two options:\n\n**S → a S b | ε**     (ε means "the empty string")\n\nStart from S and keep replacing:\n\nS → aSb → aaSbb → aabb\n\nIt generates exactly aⁿbⁿ: equal a\'s then b\'s, which no DFA can do!'),
    mc('Which string can S → a S b | ε generate?', ['aaabbb', 'aab', 'abab'], 0, 'Every use of the rule adds one a on the left and one b on the right.'),
    ex('Grammars for programming languages', 'Compilers use grammars to understand code. A grammar for arithmetic:\n\n```\nExpr   → Expr + Term | Term\nTerm   → Term * Factor | Factor\nFactor → number | ( Expr )\n```\n\nBecause `*` sits deeper in the grammar than `+`, multiplication binds tighter. A **parser** turns code into a **parse tree** using rules like these.'),
    mc('With that grammar, how is 2 + 3 * 4 grouped?', ['2 + (3 * 4)', '(2 + 3) * 4'], 0, 'Term handles *, and Expr combines Terms with +.'),
    ans('What does this print?', ['14'], 'Python\'s grammar also makes * bind tighter than +: 2 + 12.', 'print(2 + 3 * 4)'),
    ex('Machines with a stack', 'Balanced parentheses have a grammar too: **S → ( S ) S | ε**.\n\nThe matching machine is a **pushdown automaton**: a finite automaton plus a **stack**. Push on "(", pop on ")". If the stack is empty at the end, the parentheses balance.'),
    mc('What extra memory does a pushdown automaton have?', ['A stack', 'An infinite tape', 'Nothing extra'], 0, 'The stack is what lets it count nested structure.'),
    py({
      prompt: 'Write `balanced(s)` that returns True if the parentheses in `s` (only `(` and `)`) are balanced. Use a counter as a simple stack: it must never go below 0, and must end at 0.',
      starter: 'def balanced(s):\n    pass\n',
      tests: [eq('balanced("(()())")', 'True'), eq('balanced("(()")', 'False'), eq('balanced(")(")', 'False'), eq('balanced("")', 'True')],
      hints: ['depth = 0; add 1 for "(" and subtract 1 for ")"', 'If depth ever drops below 0, return False. At the end, return depth == 0.'],
      solution: 'def balanced(s):\n    depth = 0\n    for ch in s:\n        if ch == "(":\n            depth += 1\n        else:\n            depth -= 1\n        if depth < 0:\n            return False\n    return depth == 0\n',
    }),
  ],

  // ------------------------------------------------------------------ th-2-turing
  'th-2-turing': [
    ex('The Turing machine', 'In 1936 Alan Turing described a machine with:\n\n- an **infinite tape** of cells\n- a **head** that reads and **writes** one cell, then moves left or right\n- a finite set of states and rules like "in state q, reading 1: write 0, move left, go to state r"\n\nIt\'s simple, yet it can compute **anything** any computer can.'),
    mc('What can a Turing machine do that a DFA can\'t?', ['Write to an unlimited tape and move in both directions', 'Have states', 'Read input'], 0, 'Unlimited, rewritable memory is the big upgrade.'),
    ex('The Church–Turing thesis', 'The **Church–Turing thesis**: anything that can be computed by an algorithm can be computed by a Turing machine.\n\nPython, JavaScript and your phone are all **Turing complete**: given enough memory, each can simulate a Turing machine, and a Turing machine can simulate them.', 'Even some games (like Minecraft redstone) are Turing complete.'),
    mc('Is Python Turing complete?', ['Yes (given enough memory)', 'No'], 0, 'Any general-purpose programming language is.'),
    ex('A machine that adds 1', 'A Turing machine for **binary increment**:\n\n1. Move to the rightmost digit.\n2. While reading a **1**: write **0** and move left (carry the 1).\n3. On a **0** or a blank: write **1** and stop.\n\n1011 → 1010 → 1000 → **1100**'),
    ansT('Apply the increment machine to 1011. What is on the tape at the end?', ['1100'], '1011 + 1 = 1100 (11 + 1 = 12).'),
    mc('A Turing machine that never halts on some input…', ['runs forever and never gives an answer', 'is automatically rejected after a while', 'is broken'], 0, 'Machines aren\'t guaranteed to stop. That\'s the key to the next lesson.'),
    py({
      prompt: 'Simulate the increment machine on a string. Write `increment(tape)` for a binary string, working **right to left**: turn 1s into 0s until you hit a 0 (make it 1) or run off the left end (put a 1 in front).\n\nDon\'t use `int(`; that would skip the machine!',
      starter: 'def increment(tape):\n    pass\n',
      tests: [eq('increment("1011")', '"1100"'), eq('increment("111")', '"1000"'), eq('increment("0")', '"1"'), eq('increment("10")', '"11"'), { name: 'simulates the machine', code: 'assert "int(" not in __source__, "Flip the digits yourself instead of using int()"' }],
      hints: ['cells = list(tape); i = len(cells) - 1', 'while i >= 0 and cells[i] == "1": cells[i] = "0"; i -= 1. Then if i < 0, put "1" in front; else cells[i] = "1".'],
      solution: 'def increment(tape):\n    cells = list(tape)\n    i = len(cells) - 1\n    while i >= 0 and cells[i] == "1":\n        cells[i] = "0"\n        i -= 1\n    if i < 0:\n        cells.insert(0, "1")\n    else:\n        cells[i] = "1"\n    return "".join(cells)\n',
    }),
  ],

  // ------------------------------------------------------------------ th-2-halting
  'th-2-halting': [
    ex('Problems no program can solve', 'A problem is **decidable** if some algorithm always halts with the right yes/no answer.\n\nThe **halting problem**: given any program P and input x, does P(x) eventually stop?\n\nIn 1936, Turing proved that **no program can answer this correctly for every P and x**. Some problems are impossible for any computer, forever.'),
    ex('The proof (by contradiction)', 'Suppose a perfect `halts(P, x)` existed. Build this program:\n\n```python\ndef trouble(P):\n    if halts(P, P):\n        while True: pass     # loop forever\n    else:\n        return               # stop\n```\n\nNow ask: does `trouble(trouble)` halt?\n\n- If it halts, then `halts` said "halts", so it loops forever. ❌\n- If it loops, then `halts` said "loops", so it stops. ❌\n\nEither way, a contradiction. So `halts` can\'t exist. ∎'),
    mc('What proof technique shows the halting problem is undecidable?', ['Proof by contradiction, using a program that asks about itself', 'Induction', 'Testing many programs'], 0, 'Assume a solver exists, then build a program that breaks it.'),
    mc('Why can\'t a checker just run the program and watch whether it stops?', ['If it hasn\'t stopped yet, you can\'t tell whether it ever will', 'Running programs is too slow, but otherwise it would work'], 0, 'Waiting longer never settles "it loops forever".'),
    ex('What this means in practice', '**Rice\'s theorem** goes further: **every** interesting question about what a program does ("does it ever crash?", "is it a virus?") is undecidable in general.\n\nSo real tools use **approximations**: type checkers, linters, timeouts. Loopwise stops your code after 8 seconds. That\'s a practical guess, not a solution to the halting problem.'),
    mc('Loopwise stops code after 8 seconds. Does that solve the halting problem?', ['No: it just gives up, and a slow program might have finished at 9 seconds', 'Yes'], 0, 'A timeout trades correctness for practicality.'),
    mc('Which question IS decidable?', ['Does this DFA accept the string 0101?', 'Does this Python program crash on some input?'], 0, 'Just run the DFA: it always finishes after 4 steps.'),
    py({
      prompt: 'Nobody knows whether this simple loop halts for **every** starting number. It\'s the famous unsolved **Collatz conjecture**.\n\nWrite `steps_to_one(n)`: repeat "if n is even, n = n // 2, otherwise n = 3n + 1" and count the steps until n becomes 1.',
      starter: 'def steps_to_one(n):\n    pass\n',
      tests: [eq('steps_to_one(1)', '0'), eq('steps_to_one(6)', '8'), eq('steps_to_one(27)', '111')],
      hints: ['steps = 0; while n != 1: …; steps += 1', 'if n % 2 == 0: n = n // 2 else: n = 3 * n + 1'],
      solution: 'def steps_to_one(n):\n    steps = 0\n    while n != 1:\n        if n % 2 == 0:\n            n = n // 2\n        else:\n            n = 3 * n + 1\n        steps += 1\n    return steps\n',
    }),
  ],

  // ------------------------------------------------------------------ th-2-complexity
  'th-2-complexity': [
    ex('Easy to check, hard to solve?', 'Among decidable problems, some are much harder than others:\n\n- **P**: problems solvable in **polynomial time** (like O(n²)). Think "efficiently solvable".\n- **NP**: problems whose solutions can be **checked** in polynomial time.\n\nEvery problem in P is in NP. The big open question: **does P = NP?** Is everything easy to check also easy to solve? There\'s a $1,000,000 prize for the answer.'),
    mc('Checking a filled-in Sudoku is quick, but solving big Sudokus seems hard. That puts Sudoku in…', ['NP: solutions are easy to verify', 'P, for sure', 'the undecidable problems'], 0, 'Quick to verify means it\'s in NP. Whether it\'s also in P is part of the P vs NP question.'),
    ex('NP-complete', 'Some NP problems are the **hardest** in NP: every other NP problem can be **reduced** (translated) to them. These are **NP-complete**:\n\n- **SAT**: can this logic formula be made true? (the first one, proved by Cook and Levin)\n- the traveling salesman problem (decision version)\n- graph coloring, subset sum, …\n\nA fast algorithm for **any one** of them would make **all** of NP fast.'),
    mc('If someone found a polynomial-time algorithm for SAT, then…', ['P = NP', 'nothing much would change', 'SAT would become undecidable'], 0, 'Every NP problem reduces to SAT.'),
    ex('Beyond NP', '- **PSPACE**: solvable with a polynomial amount of **memory** (time can be huge). Perfect play in many board games is here.\n- **EXPTIME**: needs exponential time.\n- Past all of them: **undecidable** problems, like halting.\n\nKnown: P ⊆ NP ⊆ PSPACE ⊆ EXPTIME, and P ≠ EXPTIME.'),
    mc('Which list goes from smallest class to largest?', ['P, NP, PSPACE', 'NP, P, PSPACE', 'PSPACE, NP, P'], 0, 'P ⊆ NP ⊆ PSPACE.'),
    mc('What do most experts believe?', ['P ≠ NP', 'P = NP'], 0, 'Believed, but not proved. Much of modern cryptography relies on certain problems being hard.'),
    py({
      prompt: '**Subset sum** (NP-complete): is there a subset of numbers adding up to a target? *Finding* one may be hard, but *checking* one is fast.\n\nWrite the checker `check_subset(nums, target, picks)`. `picks` is a list of **indexes** into nums. Return True if the indexes are valid, there are no repeats, and the picked numbers add up to `target`.',
      starter: 'def check_subset(nums, target, picks):\n    pass\n',
      tests: [eq('check_subset([3, 9, 8, 4], 12, [1, 0])', 'True'), eq('check_subset([3, 9, 8, 4], 12, [2, 3])', 'True'), eq('check_subset([3, 9, 8, 4], 12, [0, 0, 0, 0])', 'False', 'repeating an index is not allowed'), eq('check_subset([3, 9, 8, 4], 12, [7])', 'False', 'indexes must exist'), eq('check_subset([3, 9, 8, 4], 5, [0])', 'False')],
      hints: ['len(set(picks)) == len(picks) means there are no repeats.', 'Check every 0 <= i < len(nums), then return sum(nums[i] for i in picks) == target'],
      solution: 'def check_subset(nums, target, picks):\n    if len(set(picks)) != len(picks):\n        return False\n    for i in picks:\n        if i < 0 or i >= len(nums):\n            return False\n    return sum(nums[i] for i in picks) == target\n',
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'th-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('A DFA\'s only memory is…', ['its current state', 'a stack', 'a tape'], 0, 'Finite states.'),
      mc('NFAs vs DFAs:', ['same power', 'NFAs stronger'], 0, 'Subset construction.'),
      mcT('Which string matches (ab)*?', ['abab', 'aba', 'ba'], 0, 'Repeats of "ab".'),
      mc('0ⁿ1ⁿ is…', ['context-free but not regular', 'regular'], 0, 'Needs counting.'),
      ans('What does this print?', ['False'], 'Only 2 digits, but \\d{3} needs 3.', 'import re\nprint(bool(re.fullmatch(r"\\d{3}", "42")))'),
      mc('A pushdown automaton adds…', ['a stack', 'a second tape'], 0, 'Stack.'),
      py({ prompt: 'Write `ends_in_01(s)`: True if a binary string ends with "01". (A DFA could do this with 3 states!)', starter: 'def ends_in_01(s):\n    pass\n', tests: [eq('ends_in_01("1101")', 'True'), eq('ends_in_01("10")', 'False'), eq('ends_in_01("")', 'False')], solution: 'def ends_in_01(s):\n    return s.endswith("01")\n' }),
    ],
  },
  'th-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('A Turing machine\'s memory is…', ['an unlimited read/write tape', 'a few states only'], 0, 'The tape.'),
      ansT('Binary increment of 0111?', ['1000'], '7 + 1 = 8.'),
      mc('The halting problem is…', ['undecidable', 'decidable but slow', 'in P'], 0, 'Turing, 1936.'),
      mc('Is "does this program ever crash?" decidable in general?', ['No (Rice\'s theorem)', 'Yes'], 0, 'Undecidable.'),
      mc('NP means solutions can be…', ['checked quickly', 'found quickly'], 0, 'Verified in polynomial time.'),
      mc('SAT is…', ['NP-complete', 'undecidable', 'in P (proved)'], 0, 'Cook–Levin.'),
      py({ prompt: 'Write `verify_coloring(edges, colors)`: True if no edge connects two vertices of the same color. `edges` is a list of (u, v) pairs and `colors` is a dict vertex → color.', starter: 'def verify_coloring(edges, colors):\n    pass\n', tests: [eq('verify_coloring([("a", "b"), ("b", "c")], {"a": 1, "b": 2, "c": 1})', 'True'), eq('verify_coloring([("a", "b")], {"a": 1, "b": 1})', 'False')], solution: 'def verify_coloring(edges, colors):\n    return all(colors[u] != colors[v] for u, v in edges)\n' }),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  theory: {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Regular expressions describe exactly the languages recognized by…', ['DFAs', 'Turing machines only'], 0, 'Kleene\'s theorem.'),
      mc('Balanced parentheses are…', ['context-free, not regular', 'regular'], 0, 'Needs a stack.'),
      ans('What does this print?', ['True'], 'Three lowercase letters.', 'import re\nprint(bool(re.fullmatch(r"[a-z]{3}", "pip")))'),
      mc('In a grammar where * sits deeper than +, 1 + 2 * 3 groups as…', ['1 + (2 * 3)', '(1 + 2) * 3'], 0, 'Precedence from structure.'),
      mc('The Church–Turing thesis says…', ['Turing machines capture everything an algorithm can compute', 'P = NP'], 0, 'The model of computation.'),
      mc('Turing\'s halting proof assumes a halting checker exists and…', ['builds a program that contradicts it', 'tests it on examples'], 0, 'Contradiction.'),
      mc('A timeout that stops slow programs…', ['is a practical guess, not a halting solver', 'solves the halting problem'], 0, 'It can be wrong.'),
      mc('If P = NP, then…', ['every efficiently checkable problem is efficiently solvable', 'nothing is decidable'], 0, 'That\'s the question.'),
      mc('Which is largest?', ['PSPACE', 'NP', 'P'], 0, 'P ⊆ NP ⊆ PSPACE.'),
      py({ prompt: 'Write `accepts_even_zeros(s)`: True if the binary string has an even number of 0s. Simulate a 2-state DFA with a variable (don\'t use .count).', starter: 'def accepts_even_zeros(s):\n    pass\n', tests: [eq('accepts_even_zeros("1001")', 'True'), eq('accepts_even_zeros("0")', 'False'), eq('accepts_even_zeros("")', 'True'), { name: 'no .count', code: 'assert ".count(" not in __source__, "Track the state with a variable"' }], solution: 'def accepts_even_zeros(s):\n    even = True\n    for ch in s:\n        if ch == "0":\n            even = not even\n    return even\n' }),
    ],
  },
};
