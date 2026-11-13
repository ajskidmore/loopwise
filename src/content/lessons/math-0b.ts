/**
 * Track: math-0 — "Math Refresher"
 * Written here: m0-2 (algebra), m0-3 (number systems), m0-4 (sequences & growth) + checkpoints + final exam.
 */
import type { Checkpoint, Step } from '../types';
import { ans, ex, mc, ord } from './_helpers';

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ m0-2-variables
  'm0-2-variables': [
    ex('Letters that stand for numbers', 'In algebra a **variable** is a letter that stands for a number — exactly like a variable in code.\n\nAn **expression** combines numbers, variables and operations: `2x + 3`.\n\nWriting a number right next to a letter means **multiply**: `2x` means `2 × x`.', 'In Python you must write the * yourself: 2 * x.'),
    ans('If x = 4, what is 2x + 3?', ['11'], '2 × 4 = 8, then 8 + 3 = 11.'),
    ans('If a = 5 and b = 2, what is 3a − b?', ['13'], '3 × 5 = 15, then 15 − 2 = 13.'),
    ex('Combining like terms', '**Like terms** have the same variable part, and you can add them:\n\n- `3x + 2x = 5x`\n- `4y − y = 3y`\n- `2x + 3 + x + 1 = 3x + 4`\n\nBut `x + y` can\'t be combined — they\'re different variables.'),
    mc('Simplify 7x + 2 − 3x + 5', ['4x + 7', '10x + 7', '4x + 3', '11x'], 0, '7x − 3x = 4x and 2 + 5 = 7.'),
    ex('The distributive property', 'A number outside parentheses multiplies **everything inside**:\n\n- `2(x + 3) = 2x + 6`\n- `5(a − 2) = 5a − 10`\n- `−(x + 4) = −x − 4`'),
    mc('Expand 3(x + 4)', ['3x + 4', '3x + 12', 'x + 12', '3x + 7'], 1, '3 × x = 3x and 3 × 4 = 12.'),
    ans('If n = 3, what is n² + 2n?', ['15'], '3² = 9 and 2 × 3 = 6; 9 + 6 = 15.'),
  ],

  // ------------------------------------------------------------------ m0-2-equations
  'm0-2-equations': [
    ex('Solving = finding the unknown', 'An **equation** says two things are equal: `x + 5 = 12`. **Solving** it means finding the value of x that makes it true.\n\nThe golden rule: **do the same thing to both sides** and the equation stays balanced, like a scale.\n\n```text\nx + 5 = 12\nx + 5 − 5 = 12 − 5     (subtract 5 from both sides)\nx = 7\n```'),
    ans('Solve: x + 9 = 15', ['6', 'x = 6', 'x=6'], 'Subtract 9 from both sides: x = 6.'),
    ans('Solve: 4x = 28', ['7', 'x = 7', 'x=7'], 'Divide both sides by 4: x = 7.'),
    ex('Two-step equations', 'Undo operations in **reverse order**: first addition/subtraction, then multiplication/division.\n\n```text\n2x + 3 = 11\n2x = 8          (subtract 3)\nx = 4           (divide by 2)\n```\n\n**Check** by plugging back in: 2(4) + 3 = 11 ✓'),
    ans('Solve: 3x − 4 = 11', ['5', 'x = 5', 'x=5'], 'Add 4: 3x = 15. Divide by 3: x = 5.'),
    ans('Solve: x / 4 = 3', ['12', 'x = 12', 'x=12'], 'Multiply both sides by 4: x = 12.'),
    ex('Variables on both sides', 'Move all the x terms to one side first:\n\n```text\n5x − 2 = 3x + 8\n2x − 2 = 8       (subtract 3x)\n2x = 10          (add 2)\nx = 5            (divide by 2)\n```'),
    ans('Solve: 6x + 1 = 2x + 13', ['3', 'x = 3', 'x=3'], 'Subtract 2x: 4x + 1 = 13. Subtract 1: 4x = 12. Divide: x = 3.'),
    ord('Order the steps to solve 2x + 6 = 20.', ['2x + 6 = 20', '2x = 14', 'x = 7'], 'Subtract 6 first, then divide by 2.'),
  ],

  // ------------------------------------------------------------------ m0-2-inequalities
  'm0-2-inequalities': [
    ex('Not equal — bigger or smaller', '- `x < 5` — x is **less than** 5\n- `x > 5` — **greater than**\n- `x ≤ 5` — less than **or equal to** (Python: `<=`)\n- `x ≥ 5` — greater than or equal to (Python: `>=`)\n\nAn inequality is usually true for a whole **range** of values, not just one.'),
    mc('Which value of x makes x ≥ 10 true?', ['9', '9.99', '10', '−10'], 2, '≥ includes 10 itself.'),
    ex('Solving inequalities', 'Solve them like equations — do the same thing to both sides:\n\n```text\nx + 3 > 7\nx > 4\n```\n\n**One twist:** multiplying or dividing both sides by a **negative** number **flips** the sign:\n\n```text\n−2x < 6\nx > −3          (divided by −2, so < became >)\n```'),
    mc('Solve: x − 2 < 5', ['x < 3', 'x < 7', 'x > 7', 'x = 7'], 1, 'Add 2 to both sides.'),
    mc('Solve: −3x ≥ 12', ['x ≥ −4', 'x ≤ −4', 'x ≤ 4', 'x ≥ 4'], 1, 'Divide by −3 and flip the sign: x ≤ −4.'),
    ex('Ranges', '`3 ≤ x < 8` means x is at least 3 **and** less than 8. If x is a whole number, that\'s 3, 4, 5, 6, 7.\n\nPython writes it the same way: `3 <= x < 8` — and `range(3, 8)` gives exactly those whole numbers!'),
    ans('How many whole numbers x satisfy 3 ≤ x < 8?', ['5'], '3, 4, 5, 6 and 7.'),
    ans('How many whole numbers satisfy 1 ≤ x ≤ 10?', ['10'], '1 through 10, both ends included.'),
  ],

  // ------------------------------------------------------------------ m0-2-functions
  'm0-2-functions': [
    ex('Input → rule → output', 'A **function** takes an input and gives exactly one output by following a rule:\n\n```text\nf(x) = 2x + 1\n```\n\n`f(3)` means "use 3 as the input": f(3) = 2(3) + 1 = **7**.', 'Sound familiar? It\'s exactly a Python def with a return.'),
    ans('If f(x) = 2x + 1, what is f(5)?', ['11'], '2 × 5 + 1 = 11.'),
    ans('If g(x) = x² − 1, what is g(4)?', ['15'], '4² − 1 = 16 − 1 = 15.'),
    ex('Same idea in Python', '```python\ndef f(x):\n    return 2 * x + 1\n\nprint(f(3))   # 7\n```\n\nMath functions and code functions are the same idea: an input goes in, a result comes out.'),
    ex('Linear functions', 'A function like `y = mx + b` makes a **straight line** when graphed:\n\n- **m** is the **slope**: how much y changes when x goes up by 1\n- **b** is the **y-intercept**: the value of y when x = 0\n\nFor `y = 3x + 2`, every step right goes up 3, and the line crosses the y-axis at 2.'),
    ans('What is the slope of y = 4x − 7?', ['4'], 'The number multiplying x is the slope.'),
    ex('Slope from two points', 'Slope = **change in y ÷ change in x**:\n\n```text\nslope = (y₂ − y₁) / (x₂ − x₁)\n```\n\nFrom (1, 3) to (3, 7): (7 − 3) / (3 − 1) = 4 / 2 = **2**.'),
    ans('What is the slope between (0, 1) and (2, 7)?', ['3'], '(7 − 1) / (2 − 0) = 6 / 2 = 3.'),
    mc('Which function is NOT linear?', ['y = 5x', 'y = x + 10', 'y = x²', 'y = −2x + 1'], 2, 'x² makes a curve (a parabola), not a straight line.'),
  ],

  // ------------------------------------------------------------------ m0-3-binary
  'm0-3-binary': [
    ex('Place value', 'In everyday **decimal** (base 10), each place is worth 10× the one to its right:\n\n```text\n 3   4   7\n100  10   1      → 300 + 40 + 7 = 347\n```\n\n**Binary** (base 2) works the same way, but each place is worth **2×** and the only digits are 0 and 1.'),
    ex('Reading binary', '```text\n 1   0   1   1\n 8   4   2   1      → 8 + 0 + 2 + 1 = 11\n```\n\nAdd up the place values wherever there\'s a 1. The places, from the right: 1, 2, 4, 8, 16, 32, 64, 128…'),
    ans('What is binary 101 in decimal?', ['5'], '4 + 0 + 1 = 5.'),
    ans('What is binary 1101 in decimal?', ['13'], '8 + 4 + 0 + 1 = 13.'),
    ans('What is binary 10000 in decimal?', ['16'], 'A 1 in the fifth place (from the right) is worth 16.'),
    ex('Decimal → binary', 'Find the biggest place value that fits, write a 1, subtract, repeat:\n\n```text\n6 → 4 fits (1), left 2 → 2 fits (1), left 0 → 1 doesn\'t (0)\n6 = 110\n```'),
    ans('Write 9 in binary.', ['1001'], '9 = 8 + 1 → 1001.'),
    ans('What is binary 11111111 (eight 1s) in decimal?', ['255'], '128+64+32+16+8+4+2+1 = 255 — the biggest number one byte can hold.'),
    mc('In Python, what does bin(5) return?', ["'0b101'", "'101b'", '5', "'0x5'"], 0, 'Python marks binary with the prefix 0b.'),
  ],

  // ------------------------------------------------------------------ m0-3-hex
  'm0-3-hex': [
    ex('Base 16', '**Hexadecimal** ("hex") uses 16 digits: `0–9` then `A–F`:\n\n| Hex | A | B | C | D | E | F |\n|---|---|---|---|---|---|---|\n| Decimal | 10 | 11 | 12 | 13 | 14 | 15 |\n\nPlace values are 1, 16, 256…  So hex `1F` = 1×16 + 15 = **31**.\nHex numbers often start with `0x`, like `0x1F`.'),
    ans('What is hex A in decimal?', ['10'], 'A = 10.'),
    ans('What is hex 20 in decimal?', ['32'], '2 × 16 + 0 = 32.'),
    ans('What is hex FF in decimal?', ['255'], '15 × 16 + 15 = 255.'),
    ex('Why programmers love hex', 'One hex digit is exactly **4 bits**, so two hex digits = one byte. Hex is a compact way to write binary:\n\n```text\nbinary 1111 0000  =  hex F0\n```\n\nYou\'ll see hex in **colors** (`#FF0000` is red: red=FF, green=00, blue=00), memory addresses and error codes.'),
    mc('How many bits does one hex digit represent?', ['2', '4', '8', '16'], 1, '16 = 2⁴, so one hex digit = 4 bits.'),
    mc('The web color #00FF00 is…', ['red', 'green', 'blue', 'black'], 1, 'Red 00, green FF (full), blue 00 → pure green.'),
    ans('What is hex 10 in decimal?', ['16'], '1 × 16 + 0 = 16.'),
  ],

  // ------------------------------------------------------------------ m0-3-modular
  'm0-3-modular': [
    ex('Remainders again', '**Modular arithmetic** is math with remainders. `17 mod 5` means "the remainder when 17 is divided by 5" = **2**. In Python: `17 % 5`.\n\nThink of a clock: after 12 comes 1 again. Numbers **wrap around**.'),
    ans('What is 23 mod 7?', ['2'], '7 × 3 = 21, remainder 2.'),
    ans('What is 30 mod 6?', ['0'], '6 divides 30 exactly.'),
    ex('Clock math', 'It\'s 10 o\'clock. What time is it 5 hours later?\n\n`(10 + 5) mod 12 = 15 mod 12 = 3` → **3 o\'clock**.\n\nSame trick for days of the week (mod 7), minutes (mod 60), and wrapping around a list in code.'),
    ans('It\'s 9 o\'clock. On a 12-hour clock, what time is it 8 hours later?', ['5', "5 o'clock"], '(9 + 8) mod 12 = 17 mod 12 = 5.'),
    mc('Today is Monday. What day is it 10 days from now?', ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], 2, '10 mod 7 = 3, and 3 days after Monday is Thursday.'),
    ex('Useful facts', '- `n mod 2` is 0 for even numbers, 1 for odd\n- `n mod 10` is the last digit of n\n- `a mod n` is always between 0 and n − 1\n\nHashing, cryptography and random number generators all rely on mod.'),
    ans('What is the largest possible value of x mod 9?', ['8'], 'Remainders go from 0 up to 9 − 1 = 8.'),
  ],

  // ------------------------------------------------------------------ m0-3-logarithms
  'm0-3-logarithms': [
    ex('The opposite of exponents', 'A **logarithm** answers: "what power do I raise the base to, to get this number?"\n\n`log₂(8) = 3` because `2³ = 8`.\n`log₁₀(1000) = 3` because `10³ = 1000`.\n\nThink of it as **"how many times do I multiply the base to reach this?"**'),
    ans('What is log₂(16)?', ['4'], '2⁴ = 16.'),
    ans('What is log₁₀(100)?', ['2'], '10² = 100.'),
    ans('What is log₂(1)?', ['0'], '2⁰ = 1. The log of 1 is always 0.'),
    ex('Halving', 'Here\'s why log₂ is everywhere in CS: it\'s also **how many times you can halve** something until you reach 1.\n\n```text\n64 → 32 → 16 → 8 → 4 → 2 → 1     (6 halvings)\nlog₂(64) = 6\n```\n\nIf you search a sorted list by checking the middle and throwing away half each time (**binary search**), a list of 1,000,000 items needs only about **20** checks.', 'log₂(1,000,000) ≈ 20, because 2²⁰ ≈ 1,048,576.'),
    ans('How many times can you halve 32 until you reach 1?', ['5'], '32 → 16 → 8 → 4 → 2 → 1: five times. log₂(32) = 5.'),
    ans('What is log₂(1024)?', ['10'], '2¹⁰ = 1024.'),
    mc('Roughly how many halving steps does binary search need for 1,000 sorted items?', ['About 10', 'About 100', 'About 500', '1,000'], 0, '2¹⁰ = 1024, so about 10 steps. Logarithms grow very slowly — that\'s what makes these algorithms fast.'),
  ],

  // ------------------------------------------------------------------ m0-4-sigma
  'm0-4-sigma': [
    ex('Writing long sums', 'The Greek letter **Σ** (sigma) means "add up":\n\n```text\n  4\n  Σ  i   =  1 + 2 + 3 + 4  =  10\ni=1\n```\n\nRead it as: "the sum of i, for i from 1 to 4". The bottom says where to start, the top where to stop.'),
    ans('What is the sum of i for i = 1 to 5?', ['15'], '1 + 2 + 3 + 4 + 5 = 15.'),
    ex('The expression can be anything', '```text\n  3\n  Σ  2i  =  2(1) + 2(2) + 2(3)  =  2 + 4 + 6  =  12\ni=1\n```'),
    ans('What is the sum of i² for i = 1 to 3?', ['14'], '1 + 4 + 9 = 14.'),
    ans('What is the sum of 5 for i = 1 to 4? (Add 5, four times.)', ['20'], 'The expression doesn\'t depend on i, so it\'s 5 + 5 + 5 + 5 = 20.'),
    ex('Σ is a for loop', 'Sigma notation is exactly an accumulator loop:\n\n```python\ntotal = 0\nfor i in range(1, 4):   # i = 1 to 3\n    total += 2 * i\nprint(total)            # 12\n```\n\nOr in one line: `sum(2 * i for i in range(1, 4))`.'),
    mc('Which Python code computes the sum of i for i = 1 to n?', ['sum(range(n))', 'sum(range(1, n + 1))', 'sum(range(1, n))', 'range(n) + 1'], 1, 'range(1, n + 1) gives 1 through n.'),
  ],

  // ------------------------------------------------------------------ m0-4-series
  'm0-4-series': [
    ex('A famous shortcut', 'The sum 1 + 2 + 3 + … + n has a formula:\n\n```text\n1 + 2 + … + n  =  n(n + 1) / 2\n```\n\nPair the first and last (1 + n), the second and second-last (2 + n−1)… each pair adds to n + 1, and there are n/2 pairs.\n\nSo 1 + 2 + … + 100 = 100 × 101 / 2 = **5050**.', 'You computed 5050 with a loop in the Python course — now you can do it in your head.'),
    ans('What is 1 + 2 + … + 10?', ['55'], '10 × 11 / 2 = 55.'),
    ans('What is 1 + 2 + … + 20?', ['210'], '20 × 21 / 2 = 210.'),
    ex('Arithmetic series', 'Any sum where each term goes up by the same amount is an **arithmetic series**:\n\n**sum = (number of terms) × (first + last) / 2**\n\n2 + 4 + 6 + 8 + 10 → 5 terms × (2 + 10) / 2 = **30**.'),
    ans('What is 3 + 6 + 9 + 12?', ['30'], '4 terms × (3 + 12) / 2 = 30.'),
    ex('Geometric series', 'When each term **doubles**, there\'s another neat pattern:\n\n```text\n1 + 2 + 4 + 8 + 16 = 31 = 32 − 1\n1 + 2 + 4 + … + 2ᵏ = 2ᵏ⁺¹ − 1\n```\n\nThe sum is always one less than the next power of 2. This shows up when analyzing trees and recursion.'),
    ans('What is 1 + 2 + 4 + 8 + 16 + 32?', ['63'], 'The next power of 2 is 64, so the sum is 64 − 1 = 63.'),
    mc('Why care about n(n + 1)/2 in programming?', ['It\'s only a math trick', 'A loop inside a loop often does 1 + 2 + … + n steps — so this tells you how slow it is', 'Computers can\'t add'], 1, 'Analyzing how much work nested loops do starts with exactly this sum.'),
  ],

  // ------------------------------------------------------------------ m0-4-growth
  'm0-4-growth': [
    ex('How fast do things grow?', 'Compare three ways a number can grow as n gets bigger:\n\n| n | n (linear) | n² (quadratic) | 2ⁿ (exponential) |\n|---|---|---|---|\n| 1 | 1 | 1 | 2 |\n| 10 | 10 | 100 | 1,024 |\n| 20 | 20 | 400 | 1,048,576 |\n| 30 | 30 | 900 | about 1 billion |\n\nExponential growth explodes. That difference decides whether a program takes a second or a century.'),
    ans('What is 2ⁿ when n = 10?', ['1024', '1,024'], '2¹⁰ = 1,024.'),
    mc('Which grows fastest as n gets large?', ['100n', 'n²', '2ⁿ', 'log₂(n)'], 2, 'Exponential beats any polynomial eventually — even though 100n is bigger at first.'),
    ex('Slowest growers', '`log₂(n)` grows **very slowly**: when n goes from 1,000 to 1,000,000, log₂(n) only goes from about 10 to about 20.\n\nFrom slowest to fastest:\n\n**log n < n < n log n < n² < 2ⁿ**'),
    ord('Order from slowest-growing to fastest-growing.', ['log n', 'n', 'n²', '2ⁿ'], 'Logarithmic, linear, quadratic, exponential.'),
    mc('A program does n² steps. If n doubles, the work becomes…', ['the same', '2× as much', '4× as much', '100× as much'], 2, '(2n)² = 4n². Doubling the input quadruples the work.'),
    mc('A program does n steps. If n doubles, the work becomes…', ['2× as much', '4× as much', 'the same'], 0, 'Linear: double the input, double the work.'),
    ex('Coming up: Big-O', 'In the Algorithms course you\'ll describe programs by their growth: a loop over n items is **O(n)**, a loop inside a loop is **O(n²)**, and binary search is **O(log n)**.\n\nYou now have all the math you need to understand it.'),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'm0-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('If x = 3, what is 4x − 5?', ['7'], '12 − 5 = 7.'),
      mc('Simplify 2x + 5x − 3', ['7x − 3', '4x', '10x − 3', '7x + 3'], 0, '2x + 5x = 7x.'),
      mc('Expand 4(x − 2)', ['4x − 2', '4x − 8', 'x − 8', '4x + 8'], 1, '4 × x − 4 × 2.'),
      ans('Solve: x − 7 = 3', ['10', 'x = 10', 'x=10'], 'Add 7.'),
      ans('Solve: 5x + 2 = 27', ['5', 'x = 5', 'x=5'], 'Subtract 2, divide by 5.'),
      mc('Solve: −2x > 8', ['x > −4', 'x < −4', 'x > 4', 'x < 4'], 1, 'Dividing by a negative flips the sign.'),
      ans('If f(x) = 3x − 1, what is f(4)?', ['11'], '12 − 1.'),
      ans('What is the slope between (1, 2) and (4, 11)?', ['3'], '(11 − 2) / (4 − 1) = 9 / 3.'),
      ans('How many whole numbers satisfy 5 ≤ x < 9?', ['4'], '5, 6, 7, 8.'),
    ],
  },
  'm0-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('Binary 110 in decimal?', ['6'], '4 + 2.'),
      ans('Binary 1010 in decimal?', ['10'], '8 + 2.'),
      ans('Write 12 in binary.', ['1100'], '8 + 4.'),
      ans('Hex 1A in decimal?', ['26'], '16 + 10.'),
      mc('One hex digit is how many bits?', ['4', '8', '2'], 0, '16 = 2⁴.'),
      ans('What is 29 mod 4?', ['1'], '28 + 1.'),
      ans('It\'s 11 o\'clock. On a 12-hour clock, what time is it 3 hours later?', ['2', "2 o'clock"], '14 mod 12 = 2.'),
      ans('What is log₂(64)?', ['6'], '2⁶ = 64.'),
      ans('What is log₁₀(10000)?', ['4'], '10⁴.'),
    ],
  },
  'm0-4': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('Sum of i for i = 1 to 6?', ['21'], '6 × 7 / 2.'),
      ans('Sum of 2i for i = 1 to 4?', ['20'], '2 + 4 + 6 + 8.'),
      ans('1 + 2 + … + 50 = ?', ['1275'], '50 × 51 / 2.'),
      ans('5 + 10 + 15 + 20 = ? (use the arithmetic series formula or just add)', ['50'], '4 × (5 + 20) / 2.'),
      ans('1 + 2 + 4 + 8 + … + 128 = ?', ['255'], '256 − 1.'),
      ord('Slowest to fastest growth:', ['log n', 'n', 'n²', '2ⁿ'], 'log, linear, quadratic, exponential.'),
      mc('Doubling n makes an n² program do how much work?', ['2×', '4×', '8×'], 1, '(2n)² = 4n².'),
      ans('2ⁿ when n = 8?', ['256'], '2⁸ = 256.'),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  'math-0': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('What is 8 − 2 × 3?', ['2'], 'Multiply first.'),
      ans('What is −6 × −4?', ['24'], 'Negative × negative = positive.'),
      ans('What is 2⁶?', ['64'], '2×2×2×2×2×2.'),
      ans('Solve: 3x + 7 = 22', ['5', 'x = 5', 'x=5'], 'Subtract 7, divide by 3.'),
      mc('Solve: −x < 3', ['x < −3', 'x > −3', 'x > 3'], 1, 'Multiply by −1 and flip.'),
      ans('If f(x) = x² + 1, what is f(3)?', ['10'], '9 + 1.'),
      ans('Binary 1111 in decimal?', ['15'], '8+4+2+1.'),
      ans('Hex FF in decimal?', ['255'], '15×16 + 15.'),
      ans('What is 100 mod 7?', ['2'], '98 + 2.'),
      ans('What is log₂(128)?', ['7'], '2⁷ = 128.'),
      ans('1 + 2 + … + 30 = ?', ['465'], '30 × 31 / 2.'),
      mc('Which grows fastest?', ['n²', '1000n', '2ⁿ', 'n log n'], 2, 'Exponential.'),
    ],
  },
};
