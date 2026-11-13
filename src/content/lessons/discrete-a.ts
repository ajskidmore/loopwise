/**
 * Track: discrete-math — "Discrete Math"
 * Written here: dm-1 (logic), dm-2 (proofs), dm-3 (sets, functions, relations) + checkpoints
 */
import type { Checkpoint, Step } from '../types';
import { ans, eq, ex, mc, ord, py } from './_helpers';

const ordT = (prompt: string, lines: string[], explanation: string) => ord(prompt, lines, explanation, 'text');

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ dm-1-propositions
  'dm-1-propositions': [
    ex('Statements that are true or false', 'A **proposition** is a statement that is either **true** or **false** — never both, never neither.\n\n- "7 is prime." ✅ proposition (true)\n- "2 + 2 = 5." ✅ proposition (false)\n- "Close the door." ❌ a command\n- "Is it raining?" ❌ a question\n- "x > 3" ❌ not until we know x', 'Discrete math is the math of computer science — and logic is where it starts. You already use it in every if statement.'),
    mc('Which is a proposition?', ['Please sit down.', 'Paris is the capital of France.', 'What time is it?', 'x + 1 = 4'], 1, 'It\'s a statement with a definite truth value (true).'),
    ex('Connectives', 'Combine propositions p and q with **connectives**:\n\n| Symbol | Name | Read as | Python |\n|---|---|---|---|\n| ¬p | negation | not p | `not p` |\n| p ∧ q | conjunction | p and q | `p and q` |\n| p ∨ q | disjunction | p or q | `p or q` |\n\n∨ is **inclusive** or: true when either **or both** are true.'),
    ans('p is true, q is false. Is p ∧ q true or false?', ['false', 'F'], '∧ needs both to be true.'),
    ans('p is true, q is false. Is p ∨ q true or false?', ['true', 'T'], '∨ needs at least one.'),
    ans('p is false. Is ¬p true or false?', ['true', 'T'], 'Negation flips the value.'),
    mc('Let p = "it\'s sunny", q = "it\'s warm". Which means "it\'s sunny but not warm"?', ['p ∨ q', 'p ∧ ¬q', '¬p ∧ q', '¬(p ∨ q)'], 1, '"but" is logically "and"; "not warm" is ¬q.'),
    mc('In everyday English, "Would you like tea or coffee?" usually means only one. In logic, p ∨ q is true when…', ['exactly one is true', 'at least one is true (possibly both)', 'both are true'], 1, 'Logical "or" is inclusive. "Exactly one" is called exclusive or (XOR).'),
  ],

  // ------------------------------------------------------------------ dm-1-truth-tables
  'dm-1-truth-tables': [
    ex('Every possibility, in a table', 'A **truth table** lists every combination of inputs and the result. With 2 variables there are 2² = 4 rows:\n\n| p | q | p ∧ q | p ∨ q |\n|---|---|---|---|\n| T | T | T | T |\n| T | F | F | T |\n| F | T | F | T |\n| F | F | F | F |'),
    ans('How many rows does a truth table with 3 variables have?', ['8'], '2³ = 8. Each new variable doubles the rows.'),
    ans('Evaluate ¬p ∨ q when p = T, q = F. (T or F)', ['F', 'false'], '¬p = F, q = F, and F ∨ F = F.'),
    ex('Equivalent expressions', 'Two expressions are **logically equivalent** (≡) if they have the same truth value in **every** row.\n\n**De Morgan\'s laws** — used constantly in code:\n\n- ¬(p ∧ q) ≡ ¬p ∨ ¬q\n- ¬(p ∨ q) ≡ ¬p ∧ ¬q\n\n"Not (sunny and warm)" means "not sunny **or** not warm".'),
    mc('Which is equivalent to `not (a or b)` in Python?', ['not a or not b', 'not a and not b', 'a and b', 'not a and b'], 1, 'De Morgan: the "not" flips or into and.'),
    mc('`if not (age >= 18 and has_id):` is the same as…', ['if age < 18 or not has_id:', 'if age < 18 and not has_id:', 'if age >= 18 or has_id:'], 0, 'Negate each part (≥ becomes <) and swap and → or.'),
    py({
      prompt: 'Print the full truth table for `p and not q`, one row per line as `p q result`. Use `for p in [True, False]:` with a nested loop for q, in that order.',
      expectedOutput: 'True True False\nTrue False True\nFalse True False\nFalse False False',
      hints: ['for p in [True, False]:\n    for q in [True, False]:\n        print(p, q, p and not q)'],
      solution: 'for p in [True, False]:\n    for q in [True, False]:\n        print(p, q, p and not q)\n',
    }),
    py({
      prompt: 'Write `xor(p, q)` — exclusive or: True when **exactly one** of p, q is True.',
      starter: 'def xor(p, q):\n    pass\n',
      tests: [eq('xor(True, True)', 'False'), eq('xor(True, False)', 'True'), eq('xor(False, True)', 'True'), eq('xor(False, False)', 'False')],
      hints: ['Exactly one true ⇔ they\'re different: return p != q'],
      solution: 'def xor(p, q):\n    return p != q\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-1-implication
  'dm-1-implication': [
    ex('If–then', 'The **implication** p → q means "**if** p, **then** q". It\'s **false only when p is true and q is false** — a broken promise.\n\n| p | q | p → q |\n|---|---|---|\n| T | T | T |\n| T | F | **F** |\n| F | T | T |\n| F | F | T |\n\n"If you get an A, I\'ll buy you pizza." If you don\'t get an A, the promise can\'t be broken — so it counts as true either way.', 'Rows where p is false are "vacuously true". This surprises everyone at first.'),
    ans('p is false, q is false. Is p → q true or false?', ['true', 'T'], 'A false "if" can\'t break the promise.'),
    ans('p is true, q is false. Is p → q true or false?', ['false', 'F'], 'The only false case.'),
    ex('Converse, inverse, contrapositive', 'For **p → q** ("if it rains, the ground is wet"):\n\n- **Converse** q → p: "if the ground is wet, it rained" (not necessarily — sprinklers!)\n- **Inverse** ¬p → ¬q: "if it doesn\'t rain, the ground isn\'t wet" (also not necessarily)\n- **Contrapositive** ¬q → ¬p: "if the ground isn\'t wet, it didn\'t rain" ✅ **always equivalent** to the original\n\nProofs often prove the contrapositive instead.'),
    mc('Which is ALWAYS equivalent to p → q?', ['q → p', '¬p → ¬q', '¬q → ¬p', 'p ∧ q'], 2, 'The contrapositive.'),
    mc('"If a number is divisible by 4, it is even." What is the converse?', ['If a number is even, it is divisible by 4.', 'If a number is not even, it is not divisible by 4.', 'If a number is not divisible by 4, it is not even.'], 0, 'Swap the two parts. (And the converse is false here: 6 is even but not divisible by 4.)'),
    ex('p → q in code', 'p → q is equivalent to **¬p ∨ q**. In Python: `(not p) or q`.\n\nThe **biconditional** p ↔ q ("p if and only if q") is true when p and q have the **same** value: `p == q`.'),
    py({
      prompt: 'Write `implies(p, q)` that returns the truth value of p → q.',
      starter: 'def implies(p, q):\n    pass\n',
      tests: [eq('implies(True, True)', 'True'), eq('implies(True, False)', 'False'), eq('implies(False, True)', 'True'), eq('implies(False, False)', 'True')],
      hints: ['p → q ≡ (not p) or q'],
      solution: 'def implies(p, q):\n    return (not p) or q\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-1-quantifiers
  'dm-1-quantifiers': [
    ex('For all, there exists', 'Statements about many things use **quantifiers**:\n\n- **∀** "for all": ∀x (x² ≥ 0) — every number\'s square is non-negative ✅\n- **∃** "there exists": ∃x (x² = 4) — some number squares to 4 ✅ (x = 2)\n\nIn Python: `all(...)` and `any(...)`:\n\n```python\nall(x * x >= 0 for x in nums)\nany(x * x == 4 for x in nums)\n```'),
    mc('"Every student passed." in logic:', ['∃s Passed(s)', '∀s Passed(s)', '¬∀s Passed(s)'], 1, '"Every" = ∀.'),
    mc('To prove "∀x, P(x)" is FALSE, you need…', ['one counterexample', 'to check every x', 'nothing'], 0, 'A single counterexample sinks a "for all" claim.'),
    ex('Negating quantifiers', 'Negation flips the quantifier and negates inside:\n\n- ¬∀x P(x) ≡ ∃x ¬P(x) — "not everyone passed" = "someone didn\'t pass"\n- ¬∃x P(x) ≡ ∀x ¬P(x) — "nobody cheated" = "everyone didn\'t cheat"'),
    mc('The negation of "All birds can fly" is…', ['No birds can fly', 'Some bird cannot fly', 'All birds cannot fly'], 1, '¬∀ = ∃¬. One penguin is enough.'),
    mc('The negation of "There is a perfect program" is…', ['Every program is imperfect', 'Some program is imperfect', 'There is an imperfect program'], 0, '¬∃ = ∀¬.'),
    ans('What does this print?', ['False'], 'all() needs every item to be positive; -1 isn\'t.', 'nums = [3, -1, 5]\nprint(all(n > 0 for n in nums))'),
    py({
      prompt: 'Write `has_counterexample(nums)` that returns True if **some** number in nums is NOT even (a counterexample to "all numbers are even"). Use `any` or `all`.',
      starter: 'def has_counterexample(nums):\n    pass\n',
      tests: [eq('has_counterexample([2, 4, 6])', 'False'), eq('has_counterexample([2, 3])', 'True'), eq('has_counterexample([])', 'False'), { name: 'uses any or all', code: 'assert "any(" in __source__ or "all(" in __source__' }],
      hints: ['¬∀x even(x) ≡ ∃x ¬even(x)', 'return any(n % 2 != 0 for n in nums)'],
      solution: 'def has_counterexample(nums):\n    return any(n % 2 != 0 for n in nums)\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-2-direct
  'dm-2-direct': [
    ex('Why proofs?', 'Testing checks some cases. A **proof** shows a statement is true for **every** case — even infinitely many. In grad school you\'ll prove that algorithms are correct and how fast they run.\n\nA **direct proof** of "if p then q": assume p, then use definitions and facts, step by step, until you reach q.'),
    ex('Definitions are tools', 'Proofs run on precise definitions:\n\n- n is **even** if n = 2k for some integer k\n- n is **odd** if n = 2k + 1 for some integer k\n- a **divides** b (a | b) if b = a·k for some integer k'),
    ex('Example: even + even = even', '**Claim:** if a and b are even, then a + b is even.\n\n**Proof.** Since a and b are even, a = 2j and b = 2k for some integers j, k. Then\n\na + b = 2j + 2k = 2(j + k).\n\nj + k is an integer, so a + b is 2 times an integer — it\'s even. ∎', '∎ (or "QED") marks the end of a proof.'),
    ordT('Order the steps of a direct proof that "odd + odd is even".', ['Let a = 2j + 1 and b = 2k + 1 for integers j, k.', 'Then a + b = 2j + 2k + 2.', 'So a + b = 2(j + k + 1).', 'j + k + 1 is an integer, so a + b is even. ∎'], 'Start from the definitions, do the algebra, then match the definition of even.'),
    mc('Why can\'t you prove "the sum of two evens is even" by checking 2 + 4 = 6?', ['You can — one example proves it', 'One example only shows one case; a proof must cover every case', 'Because 6 isn\'t even'], 1, 'Examples can disprove a "for all" claim, but never prove one.'),
    mc('Writing an even number as "2k" — what must k be?', ['Any real number', 'An integer', 'A positive number', 'An even number'], 1, 'k must be an integer; otherwise every number would be "2 times something".'),
    mc('Claim: if n is odd, then n² is odd. A good first line is…', ['Let n = 2k for some integer k.', 'Let n = 2k + 1 for some integer k.', 'Assume n² is even.', 'Try n = 3.'], 1, 'Start from the hypothesis (n odd) using its definition. Then n² = 4k² + 4k + 1 = 2(2k² + 2k) + 1, which is odd.'),
  ],

  // ------------------------------------------------------------------ dm-2-contradiction
  'dm-2-contradiction': [
    ex('Assume the opposite', 'In a **proof by contradiction**, you assume the statement is **false**, then show that leads to something impossible (like 1 = 0, or a number that\'s both even and odd). Since the assumption breaks math, the statement must be true.'),
    ex('Classic: √2 is irrational', '**Claim:** √2 can\'t be written as a fraction a/b.\n\n**Proof.** Suppose it can, with a/b in **lowest terms**. Then 2 = a²/b², so a² = 2b², so a² is even, so a is even: a = 2c. Then 4c² = 2b², so b² = 2c², so b is even too.\n\nBut then a and b are both even — **not** in lowest terms. Contradiction! ∎'),
    mc('In a proof by contradiction of "P", you start by assuming…', ['P', 'not P', 'P and not P'], 1, 'Assume the opposite, then derive something impossible.'),
    mc('In the √2 proof, what was the contradiction?', ['a² was negative', 'a and b were both even, though a/b was in lowest terms', '√2 equals 2'], 1, 'Lowest terms means a and b share no factor of 2 — yet we showed both are even.'),
    ex('Classic: infinitely many primes', '**Claim:** there are infinitely many primes.\n\n**Proof (Euclid).** Suppose there are only finitely many: p₁, p₂, …, pₙ. Let N = p₁·p₂·…·pₙ + 1. Dividing N by any pᵢ leaves remainder 1, so no pᵢ divides N. But every integer > 1 has a prime factor — so N has a prime factor that isn\'t on our "complete" list. Contradiction! ∎'),
    ans('If the only primes were 2, 3 and 5, what would Euclid\'s N be?', ['31'], '2 × 3 × 5 + 1 = 31 — which is itself prime and not on the list.'),
    mc('Which is the best candidate for proof by contradiction?', ['"The sum of two evens is even."', '"There is no largest integer."', '"7 × 8 = 56."'], 1, '"There is no…" claims are natural: assume there IS a largest integer N, then N + 1 is larger. Contradiction.'),
  ],

  // ------------------------------------------------------------------ dm-2-induction
  'dm-2-induction': [
    ex('Dominoes', '**Mathematical induction** proves a statement P(n) for **all** n ≥ some starting value:\n\n- **Base case:** prove P(1) (the first domino falls)\n- **Inductive step:** prove that **if** P(k) is true, **then** P(k + 1) is true (each domino knocks over the next)\n\nThen every domino falls: P(1), P(2), P(3), … all true.', 'Induction is recursion in reverse — and it\'s how you prove recursive algorithms correct.'),
    ex('Example: 1 + 2 + … + n = n(n + 1)/2', '**Base case (n = 1):** left side is 1; right side is 1·2/2 = 1. ✓\n\n**Inductive step:** assume 1 + … + k = k(k + 1)/2 (the **inductive hypothesis**). Then\n\n1 + … + k + (k + 1) = k(k + 1)/2 + (k + 1) = (k + 1)(k/2 + 1) = (k + 1)(k + 2)/2,\n\nwhich is the formula for n = k + 1. ✓ ∎'),
    mc('In the inductive step, what do you ASSUME?', ['P(k + 1)', 'P(k) — the inductive hypothesis', 'P(n) for all n'], 1, 'You assume P(k) and use it to prove P(k + 1).'),
    ordT('Order the parts of an induction proof.', ['State the claim P(n)', 'Prove the base case P(1)', 'Assume P(k) for some k ≥ 1', 'Use that to prove P(k + 1)', 'Conclude P(n) holds for all n ≥ 1'], 'Claim → base → hypothesis → step → conclusion.'),
    ans('Check the base case of "1 + 3 + 5 + … + (2n − 1) = n²" for n = 1. What is the left side?', ['1'], 'Just the first term: 2(1) − 1 = 1, and 1² = 1 ✓.'),
    mc('Someone proves only the inductive step, but not the base case. Is the proof valid?', ['Yes', 'No — without a first domino, nothing has to fall'], 1, 'Example: "n = n + 1" passes the step (if k = k+1 then k+1 = k+2) but is never true.'),
    py({
      prompt: 'Induction proves it for all n — code can **spot-check** it. Write `check_formula(limit)` that returns True if `1 + 2 + … + n == n*(n+1)//2` for **every** n from 1 to limit.',
      starter: 'def check_formula(limit):\n    pass\n',
      tests: [eq('check_formula(1)', 'True'), eq('check_formula(500)', 'True')],
      hints: ['Keep a running total; for each n, add n and compare with n*(n+1)//2.', 'return all(sum(range(1, n + 1)) == n * (n + 1) // 2 for n in range(1, limit + 1))'],
      solution: 'def check_formula(limit):\n    total = 0\n    for n in range(1, limit + 1):\n        total += n\n        if total != n * (n + 1) // 2:\n            return False\n    return True\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-2-strong-induction
  'dm-2-strong-induction': [
    ex('Using ALL the earlier dominoes', 'In **strong induction**, the inductive step may assume P(1), P(2), …, P(k) are **all** true (not just P(k)) to prove P(k + 1).\n\nUse it when the next case depends on cases further back.'),
    ex('Example: prime factorization', '**Claim:** every integer n ≥ 2 is a product of primes.\n\n**Base:** 2 is prime. ✓\n\n**Step:** assume every integer from 2 to k is a product of primes. Look at k + 1:\n\n- if it\'s prime, done;\n- otherwise k + 1 = a·b with 2 ≤ a, b ≤ k — and **by the hypothesis** both a and b are products of primes, so k + 1 is too. ∎\n\nWe needed a and b, which can be **any** smaller numbers — that\'s why we need strong induction.'),
    mc('Why does the factorization proof need STRONG induction?', ['Because primes are infinite', 'Because k + 1 splits into factors that can be any smaller numbers, not just k', 'It doesn\'t'], 1, 'Ordinary induction only gives you P(k).'),
    ex('Example: stamps', 'With 4¢ and 5¢ stamps you can make every amount n ≥ 12:\n\n- 12 = 4+4+4, 13 = 4+4+5, 14 = 4+5+5, 15 = 5+5+5 (**four base cases**)\n- For n ≥ 16: n − 4 ≥ 12 can be made (by the hypothesis), so add one 4¢ stamp. ∎'),
    ans('Using 4¢ and 5¢ stamps, how do you make 17¢? Give the number of 4¢ stamps.', ['3'], '17 = 4 + 4 + 4 + 5: three 4¢ stamps and one 5¢ stamp.'),
    mc('Why does the stamp proof need four base cases?', ['To look thorough', 'The step jumps back by 4, so 12, 13, 14 and 15 each start a chain', 'Because 4 + 5 = 9'], 1, 'Every n ≥ 16 reaches back to one of 12–15.'),
    py({
      prompt: 'Write `can_make(n)` returning True if n cents can be made from 4¢ and 5¢ stamps. (Try all possible numbers of 5¢ stamps.)',
      starter: 'def can_make(n):\n    pass\n',
      tests: [eq('[n for n in range(1, 20) if not can_make(n)]', '[1, 2, 3, 6, 7, 11]', 'exactly 1, 2, 3, 6, 7, 11 are impossible below 20'), eq('can_make(0)', 'True'), eq('all(can_make(n) for n in range(12, 300))', 'True')],
      hints: ['for fives in range(n // 5 + 1): if (n - 5 * fives) % 4 == 0: return True', 'return False after the loop'],
      solution: 'def can_make(n):\n    for fives in range(n // 5 + 1):\n        if (n - 5 * fives) % 4 == 0:\n            return True\n    return False\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-3-sets
  'dm-3-sets': [
    ex('Sets', 'A **set** is an unordered collection of distinct elements: A = {1, 2, 3}.\n\n- x **∈** A — x is an element of A (2 ∈ A)\n- x **∉** A — not an element (5 ∉ A)\n- **∅** — the empty set {}\n- **|A|** — the size (cardinality): |{1, 2, 3}| = 3\n- A **⊆** B — every element of A is in B ("subset")'),
    mc('Is {1, 2} ⊆ {1, 2, 3}?', ['Yes', 'No'], 0, 'Every element of {1, 2} is in {1, 2, 3}.'),
    ans('What is |{a, b, b, c}|?', ['3'], 'Sets ignore duplicates: {a, b, c}.'),
    ex('Operations', '- **A ∪ B** union: in A **or** B\n- **A ∩ B** intersection: in **both**\n- **A − B** difference: in A but **not** B\n- **Aᶜ** complement: everything (in the universe) not in A\n\nWith A = {1, 2, 3}, B = {3, 4}: A ∪ B = {1, 2, 3, 4}, A ∩ B = {3}, A − B = {1, 2}.'),
    mc('A = {1, 2, 3, 4}, B = {2, 4, 6}. What is A ∩ B?', ['{2, 4}', '{1, 2, 3, 4, 6}', '{1, 3}', '{6}'], 0, 'Elements in both.'),
    mc('Same A and B. What is A − B?', ['{1, 3}', '{6}', '{2, 4}'], 0, 'In A, not in B.'),
    ex('Power sets', 'The **power set** 𝒫(A) is the set of **all subsets** of A. For A = {a, b}:\n\n𝒫(A) = { ∅, {a}, {b}, {a, b} }\n\nIf |A| = n, then |𝒫(A)| = **2ⁿ** — each element is either in or out of a subset.'),
    ans('How many subsets does a set with 5 elements have?', ['32'], '2⁵ = 32.'),
    py({
      prompt: 'Write `power_set(items)` that returns a list of all subsets of the list `items`, each subset as a **sorted list**. Any order of subsets is fine.',
      starter: 'def power_set(items):\n    pass\n',
      tests: [
        { name: 'power_set([1, 2]) has the 4 subsets', code: 'assert sorted(map(sorted, power_set([1, 2]))) == [[], [1], [1, 2], [2]]' },
        { name: 'size is 2^n', code: 'assert len(power_set(list(range(6)))) == 64' },
        { name: 'empty set', code: 'assert power_set([]) == [[]]' },
      ],
      hints: ['Start with [[]]. For each item, add a copy of every existing subset with the item added.', 'subsets = [[]]\nfor x in items:\n    subsets += [s + [x] for s in subsets]'],
      solution: 'def power_set(items):\n    subsets = [[]]\n    for x in sorted(items):\n        subsets += [s + [x] for s in subsets]\n    return subsets\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-3-functions
  'dm-3-functions': [
    ex('Functions, precisely', 'A **function** f: A → B assigns **every** element of A (the **domain**) **exactly one** element of B (the **codomain**).\n\n- **Injective** (one-to-one): different inputs → different outputs\n- **Surjective** (onto): every element of B is hit by some input\n- **Bijective**: both — a perfect pairing, so f has an **inverse**'),
    mc('f: integers → integers, f(x) = 2x. Is f injective?', ['Yes', 'No'], 0, 'If 2a = 2b then a = b, so different inputs give different outputs.'),
    mc('Same f(x) = 2x on integers. Is f surjective?', ['Yes', 'No — odd numbers are never outputs'], 1, 'Nothing maps to 3.'),
    mc('f: integers → integers, f(x) = x². Injective?', ['Yes', 'No — f(2) = f(−2) = 4'], 1, 'Two inputs share an output.'),
    mc('f: integers → integers, f(x) = x + 1. Bijective?', ['Yes — every y comes from exactly one x (x = y − 1)', 'No'], 0, 'It\'s injective and surjective; its inverse is y − 1.'),
    ex('Why CS cares', '- A **hash function** maps huge inputs to small outputs — it can\'t be injective, so **collisions** are unavoidable\n- Encryption must be **bijective** so it can be decrypted\n- Comparing set sizes: a bijection between A and B means |A| = |B|'),
    py({
      prompt: 'A function on a finite domain can be stored as a dict. Write `is_injective(f)` that returns True if no two keys map to the same value.',
      starter: 'def is_injective(f):\n    pass\n',
      tests: [eq('is_injective({1: "a", 2: "b"})', 'True'), eq('is_injective({1: "a", 2: "a"})', 'False'), eq('is_injective({})', 'True')],
      hints: ['Compare the number of distinct values with the number of keys.', 'return len(set(f.values())) == len(f)'],
      solution: 'def is_injective(f):\n    return len(set(f.values())) == len(f)\n',
    }),
    py({
      prompt: 'Write `is_surjective(f, codomain)` that returns True if every element of the set `codomain` is a value of the dict `f`.',
      starter: 'def is_surjective(f, codomain):\n    pass\n',
      tests: [eq('is_surjective({1: "a", 2: "b"}, {"a", "b"})', 'True'), eq('is_surjective({1: "a", 2: "a"}, {"a", "b"})', 'False')],
      hints: ['return set(f.values()) >= codomain   (or: codomain <= set(f.values()))'],
      solution: 'def is_surjective(f, codomain):\n    return codomain <= set(f.values())\n',
    }),
  ],

  // ------------------------------------------------------------------ dm-3-relations
  'dm-3-relations': [
    ex('Relations', 'A **relation** R on a set A is a set of ordered pairs (a, b) — "a is related to b". Examples on integers: a < b, a = b, "a divides b", "a and b have the same remainder mod 3".\n\nKey properties:\n\n- **Reflexive:** every a relates to itself (a R a)\n- **Symmetric:** if a R b then b R a\n- **Transitive:** if a R b and b R c then a R c'),
    mc('Which properties does "<" on integers have?', ['Reflexive only', 'Transitive only', 'Symmetric and transitive', 'All three'], 1, 'Not reflexive (3 < 3 is false), not symmetric (2 < 3 but not 3 < 2), but transitive.'),
    mc('"is a sibling of" (excluding yourself) is…', ['Reflexive', 'Symmetric', 'Neither'], 1, 'If Ana is Bo\'s sibling, Bo is Ana\'s sibling. You are not your own sibling, so it isn\'t reflexive.'),
    ex('Equivalence relations', 'A relation that is **reflexive, symmetric and transitive** is an **equivalence relation**. It splits the set into **equivalence classes** — groups of "equivalent" things.\n\n"Same remainder mod 3" splits the integers into 3 classes: {…, 0, 3, 6, …}, {…, 1, 4, 7, …}, {…, 2, 5, 8, …}.'),
    ans('"Same remainder when divided by 5" splits the integers into how many equivalence classes?', ['5'], 'Remainders 0, 1, 2, 3, 4.'),
    mc('Is "a ≤ b" an equivalence relation?', ['Yes', 'No — it isn\'t symmetric'], 1, '2 ≤ 3 but not 3 ≤ 2. (≤ is a partial order: reflexive, transitive and antisymmetric.)'),
    py({
      prompt: 'A relation is given as a **set of pairs** over the set `elements`. Write `is_reflexive(rel, elements)` and `is_symmetric(rel)`.',
      starter: 'def is_reflexive(rel, elements):\n    pass\n\ndef is_symmetric(rel):\n    pass\n',
      tests: [
        eq('is_reflexive({(1, 1), (2, 2), (1, 2)}, {1, 2})', 'True'), eq('is_reflexive({(1, 1)}, {1, 2})', 'False'),
        eq('is_symmetric({(1, 2), (2, 1), (3, 3)})', 'True'), eq('is_symmetric({(1, 2)})', 'False'),
      ],
      hints: ['Reflexive: all((a, a) in rel for a in elements)', 'Symmetric: all((b, a) in rel for (a, b) in rel)'],
      solution: 'def is_reflexive(rel, elements):\n    return all((a, a) in rel for a in elements)\n\ndef is_symmetric(rel):\n    return all((b, a) in rel for (a, b) in rel)\n',
    }),
    py({
      prompt: 'Write `is_transitive(rel)`: for every (a, b) and (b, c) in rel, (a, c) must also be in rel.',
      starter: 'def is_transitive(rel):\n    pass\n',
      tests: [eq('is_transitive({(1, 2), (2, 3), (1, 3)})', 'True'), eq('is_transitive({(1, 2), (2, 3)})', 'False'), eq('is_transitive(set())', 'True')],
      hints: ['Two nested loops over rel: if b == c in (a, b), (c, d), check (a, d) in rel.'],
      solution: 'def is_transitive(rel):\n    for (a, b) in rel:\n        for (c, d) in rel:\n            if b == c and (a, d) not in rel:\n                return False\n    return True\n',
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'dm-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Which is a proposition?', ['Run!', '5 is even.', 'Is 5 even?'], 1, 'It has a truth value (false).'),
      ans('p = T, q = F. p ∨ q is? (T or F)', ['T', 'true'], 'One is true.'),
      ans('p = T, q = F. p → q is? (T or F)', ['F', 'false'], 'The only false case.'),
      ans('How many rows in a truth table with 4 variables?', ['16'], '2⁴.'),
      mc('¬(p ∧ q) ≡ ?', ['¬p ∧ ¬q', '¬p ∨ ¬q', 'p ∨ q'], 1, 'De Morgan.'),
      mc('The contrapositive of p → q is…', ['q → p', '¬q → ¬p', '¬p → ¬q'], 1, 'Flip and negate.'),
      mc('Negation of "Every test passed":', ['No test passed', 'Some test failed', 'Every test failed'], 1, '¬∀ = ∃¬.'),
      py({ prompt: 'Write `nand(p, q)` = not (p and q).', starter: 'def nand(p, q):\n    pass\n', tests: [eq('nand(True, True)', 'False'), eq('nand(True, False)', 'True'), eq('nand(False, False)', 'True')], solution: 'def nand(p, q):\n    return not (p and q)\n' }),
    ],
  },
  'dm-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('An even number is defined as…', ['n = 2k for some integer k', 'n = 2k + 1', 'n > 2'], 0, 'Definition of even.'),
      mc('Examples can…', ['prove a "for all" statement', 'disprove a "for all" statement', 'neither'], 1, 'One counterexample disproves it.'),
      mc('Proof by contradiction starts by assuming…', ['the statement', 'the statement is false', 'the base case'], 1, 'Assume the opposite.'),
      mc('The two parts of induction are…', ['base case and inductive step', 'hypothesis and conclusion only', 'contradiction and converse'], 0, 'Base + step.'),
      ordT('Order the induction proof parts.', ['Base case', 'Inductive hypothesis', 'Inductive step', 'Conclusion'], 'Base, assume, step, conclude.'),
      mc('Strong induction lets you assume…', ['only P(k)', 'P(1) through P(k)', 'P(k + 1)'], 1, 'All earlier cases.'),
      ans('Euclid\'s N for primes 2 and 3 only?', ['7'], '2 × 3 + 1.'),
    ],
  },
  'dm-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('{1, 2, 3} ∪ {3, 4} = ?', ['{3}', '{1, 2, 3, 4}', '{1, 2}'], 1, 'Union.'),
      mc('{1, 2, 3} ∩ {3, 4} = ?', ['{3}', '{1, 2, 3, 4}', '∅'], 0, 'Intersection.'),
      ans('How many subsets does {a, b, c} have?', ['8'], '2³.'),
      mc('f(x) = x² from integers to integers is…', ['injective', 'not injective'], 1, 'f(−1) = f(1).'),
      mc('A bijection is…', ['injective and surjective', 'only injective', 'only surjective'], 0, 'Both.'),
      mc('An equivalence relation is…', ['reflexive, symmetric, transitive', 'only symmetric', 'reflexive and antisymmetric'], 0, 'All three.'),
      py({ prompt: 'Write `subsets_of_size(items, k)` returning how many k-element subsets a list of distinct items has (you may build them, or use math.comb).', starter: 'def subsets_of_size(items, k):\n    pass\n', tests: [eq('subsets_of_size([1, 2, 3, 4], 2)', '6'), eq('subsets_of_size([1, 2, 3], 0)', '1')], solution: 'import math\n\ndef subsets_of_size(items, k):\n    return math.comb(len(items), k)\n' }),
    ],
  },
};
