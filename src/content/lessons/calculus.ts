/**
 * Track: calculus — "Calculus Essentials"
 * Written here: ca-1 (limits and derivatives), ca-2 (using derivatives), ca-3 (integrals)
 * + checkpoints + course final exam.
 * Answers are numbers (not formulas) so they can be typed and graded reliably.
 * Exercises use plain Python (no sympy/numpy). Every number was double-checked in Python.
 */
import type { AnswerStep, Checkpoint, Step } from '../types';
import { ans, eq, ex, mc, ord, py } from './_helpers';

const ordT = (prompt: string, lines: string[], explanation: string) => ord(prompt, lines, explanation, 'text');

/** A typed vector answer like "(6, 2)". Accepts (6, 2), (6,2), [6, 2], 6, 2 … */
const vecAns = (prompt: string, v: number[], explanation: string): AnswerStep => {
  const parts = v.map(String);
  const spaced = parts.join(', ');
  const tight = parts.join(',');
  return ans(prompt, [`(${spaced})`, `(${tight})`, `[${spaced}]`, `[${tight}]`, spaced, tight], explanation);
};

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ ca-1-limits
  'ca-1-limits': [
    ex('Getting closer and closer', 'A **limit** asks: what value does f(x) **approach** as x gets close to some number?\n\nFor f(x) = x² as x approaches 2:\n\n| x | 1.9 | 1.99 | 2.01 | 2.1 |\n|---|---|---|---|---|\n| x² | 3.61 | 3.9601 | 4.0401 | 4.41 |\n\nThe values close in on 4, so **lim x→2 of x² = 4**.', 'Calculus is the math of change. Machine learning uses it to learn: every model "improves" by following derivatives.'),
    ans('What is the limit of 2x + 1 as x approaches 3?', ['7'], 'For smooth functions like this, just plug in: 2×3 + 1 = 7.'),
    ex('When you can\'t just plug in', 'f(x) = (x² − 1) ÷ (x − 1) at x = 1 gives **0 ÷ 0**, which is undefined.\n\nBut x² − 1 = (x − 1)(x + 1). So for every x **except** 1, f(x) is simply **x + 1**.\n\nAs x approaches 1, f(x) approaches 1 + 1 = **2**. The limit exists even though f(1) doesn\'t.'),
    ans('What is the limit of (x² − 1) ÷ (x − 1) as x approaches 1?', ['2'], 'It simplifies to x + 1, which approaches 2.'),
    ans('What does this print?', ['2.001'], 'f(1.001) = 1.001 + 1 = 2.001: just above the limit of 2.', 'def f(x):\n    return (x * x - 1) / (x - 1)\n\nprint(round(f(1.001), 3))'),
    ex('Limits at infinity', 'We can also ask what happens as x grows **forever** (x → ∞):\n\n- 1/x gets closer and closer to **0**: 1/10, 1/100, 1/1000, …\n- x/(x + 1) gets closer to **1**: 10/11, 100/101, 1000/1001, …\n\nThis is how computer scientists compare algorithms when the input gets huge.'),
    ans('What is the limit of 1/x² as x → ∞?', ['0'], 'x² grows without bound, so 1/x² shrinks toward 0.'),
    mc('What is the limit of x/(x + 1) as x → ∞?', ['0', '1', '∞'], 1, 'The top and bottom become almost the same: 1000/1001 ≈ 0.999.'),
    py({
      prompt: 'Spot a limit with code. For x in `[2.1, 2.01, 2.001]` (in that order), print `(x * x - 4) / (x - 2)` **rounded to 4 decimal places**, one per line.\n\nWhat value do the results approach?',
      expectedOutput: '4.1\n4.01\n4.001',
      hints: ['for x in [2.1, 2.01, 2.001]:', '    print(round((x * x - 4) / (x - 2), 4))'],
      solution: 'for x in [2.1, 2.01, 2.001]:\n    print(round((x * x - 4) / (x - 2), 4))\n',
    }),
  ],

  // ------------------------------------------------------------------ ca-1-derivatives
  'ca-1-derivatives': [
    ex('Slope', 'The **slope** of a line is rise ÷ run: how much y changes for each step in x.\n\nThrough (1, 2) and (3, 8): (8 − 2) ÷ (3 − 1) = **3**.\n\nSlope is a **rate of change**: speed is distance ÷ time, cost per item is money ÷ items.'),
    ans('A line goes through (0, 1) and (2, 9). What is its slope?', ['4'], '(9 − 1) ÷ (2 − 0) = 8 ÷ 2 = 4.'),
    ex('The derivative', 'A curve\'s slope changes from point to point. The **derivative** f′(x) is the slope at **one exact point**: the instantaneous rate of change.\n\nTake the slope between x and a point just next to it, x + h, and let h shrink to 0:\n\n**f′(x) = lim h→0 of (f(x + h) − f(x)) ÷ h**\n\nFor f(x) = x² at x = 3: h = 0.1 gives 6.1, and h = 0.01 gives 6.01. So **f′(3) = 6**.'),
    ans('Same f(x) = x² at x = 3. With h = 0.001, what is (f(3 + h) − f(3)) ÷ h?', ['6.001'], '(9.006001 − 9) ÷ 0.001 = 6.001. It keeps closing in on 6.'),
    ans('So for f(x) = x², what is f′(3) exactly?', ['6'], 'The slopes 6.1, 6.01, 6.001, … approach 6.'),
    mc('f′(x) is positive at some point. What is f doing there?', ['Increasing', 'Decreasing', 'Staying flat'], 0, 'A positive slope means going up as x increases.'),
    mc('s(t) is a car\'s position at time t. What is s′(t)?', ['Its speed (velocity)', 'The total distance', 'The time'], 0, 'The rate of change of position is velocity.'),
    ex('Derivatives with code', 'Computers often estimate derivatives with a tiny h. The **central difference** looks at both sides and is more accurate:\n\n**f′(x) ≈ (f(x + h) − f(x − h)) ÷ (2h)**\n\n```python\ndef square(x):\n    return x * x\n\nh = 0.00001\nprint((square(3 + h) - square(3 - h)) / (2 * h))   # about 6.0\n```'),
    py({
      prompt: 'Write `deriv(f, x)` that estimates f′(x) using the central difference with `h = 0.00001`.\n\n`f` is a function: you can pass a function to another function like any other value, and call it with `f(...)`.',
      starter: 'def deriv(f, x):\n    pass\n',
      tests: [
        { name: 'slope of x² at 3 is about 6', code: 'def __sq(x):\n    return x * x\n__d = deriv(__sq, 3)\nassert __d is not None and abs(__d - 6) < 1e-4, f"expected about 6, got {__d!r}"' },
        { name: 'slope of x³ at 2 is about 12', code: 'def __cube(x):\n    return x ** 3\n__d = deriv(__cube, 2)\nassert __d is not None and abs(__d - 12) < 1e-4, f"expected about 12, got {__d!r}"' },
        { name: 'slope of a flat line is 0', code: 'def __five(x):\n    return 5\n__d = deriv(__five, 10)\nassert __d is not None and abs(__d) < 1e-6, f"expected about 0, got {__d!r}"' },
      ],
      hints: ['h = 0.00001', 'return (f(x + h) - f(x - h)) / (2 * h)'],
      solution: 'def deriv(f, x):\n    h = 0.00001\n    return (f(x + h) - f(x - h)) / (2 * h)\n',
    }),
  ],

  // ------------------------------------------------------------------ ca-1-rules
  'ca-1-rules': [
    ex('The power rule', 'You don\'t need limits every time. Shortcuts:\n\n- **Power rule:** the derivative of xⁿ is **n·xⁿ⁻¹**\n  - x³ → 3x²\n  - x² → 2x (so at x = 3, the slope is 6 ✓)\n  - x → 1\n- A **constant** (like 7) has derivative **0**: it never changes.'),
    ans('f(x) = x⁴. What is f′(2)?', ['32'], 'f′(x) = 4x³, and 4 × 2³ = 4 × 8 = 32.'),
    ex('Sums and constant multiples', 'Take the derivative of each piece separately, and keep any number in front:\n\n(3x² + 5x + 7)′ = 3·2x + 5·1 + 0 = **6x + 5**'),
    ans('f(x) = 3x² + 5x. What is f′(1)?', ['11'], 'f′(x) = 6x + 5, so f′(1) = 6 + 5 = 11.'),
    ex('The product rule', 'For two functions multiplied together:\n\n**(f·g)′ = f′·g + f·g′**\n\nExample: x²·x³. The rule gives 2x·x³ + x²·3x² = 2x⁴ + 3x⁴ = **5x⁴**. That matches the power rule on x⁵ ✓.'),
    ans('f(x) = x²·(x + 1). What is f′(1)? (Use the product rule, or multiply it out first.)', ['5'], 'Product rule: 2x(x + 1) + x²·1. At x = 1: 2·2 + 1 = 5. (Or f = x³ + x², so f′ = 3x² + 2x = 5 at x = 1.)'),
    ex('The chain rule', 'For a function **inside** another function:\n\n**f(g(x))′ = f′(g(x)) · g′(x)**\n\n"Derivative of the outside (leave the inside alone) × derivative of the inside."\n\n(3x + 1)²: the outside is ( )², whose derivative is 2( ); the inside 3x + 1 has derivative 3.\n\nSo the derivative is 2(3x + 1)·3. At x = 0: 2·1·3 = **6**.', 'The chain rule is the heart of how neural networks learn ("backpropagation").'),
    ans('f(x) = (2x + 1)³. What is f′(0)?', ['6'], 'Outside: 3( )². Inside: 2x + 1, derivative 2. At x = 0: 3·1²·2 = 6.'),
    mc('Which rule does backpropagation in neural networks rely on most?', ['The chain rule', 'Only the power rule', 'No rules: it guesses'], 0, 'A network is functions inside functions inside functions, so the chain rule is used over and over.'),
    py({
      prompt: 'A polynomial can be stored as a list of coefficients: `[5, 3, 2]` means 5 + 3x + 2x².\n\nWrite `poly_deriv(coeffs)` that returns the derivative\'s coefficients using the power rule. For `[5, 3, 2]` the derivative is 3 + 4x, so return `[3, 4]`.',
      starter: 'def poly_deriv(coeffs):\n    pass\n',
      tests: [eq('poly_deriv([5, 3, 2])', '[3, 4]'), eq('poly_deriv([0, 0, 0, 1])', '[0, 0, 3]'), eq('poly_deriv([7])', '[]')],
      hints: ['The coefficient at position k belongs to xᵏ. Its derivative is k·coeffs[k] times xᵏ⁻¹.', 'return [k * coeffs[k] for k in range(1, len(coeffs))]'],
      solution: 'def poly_deriv(coeffs):\n    result = []\n    for k in range(1, len(coeffs)):\n        result.append(k * coeffs[k])\n    return result\n',
    }),
  ],

  // ------------------------------------------------------------------ ca-2-optimization
  'ca-2-optimization': [
    ex('Flat at the top and bottom', 'At the highest or lowest point of a smooth curve, the slope is **0**: the curve is momentarily flat.\n\nSo to find a maximum or minimum, solve **f′(x) = 0**.\n\nf(x) = x² − 6x + 10: f′(x) = 2x − 6 = 0, so **x = 3**. Then f(3) = 9 − 18 + 10 = **1**, the lowest value.'),
    ans('f(x) = x² − 4x. At what x is f′(x) = 0?', ['2'], 'f′(x) = 2x − 4 = 0 → x = 2.'),
    ex('Maximum or minimum?', 'The **second derivative** f″(x) (the derivative of the derivative) tells you which way the curve bends:\n\n- f″ > 0: bends up like a smile → **minimum**\n- f″ < 0: bends down like a frown → **maximum**\n\nYou can also just compare f at a few nearby points.'),
    mc('f(x) = −x² + 4x has f′(x) = −2x + 4, which is 0 at x = 2. f″(x) = −2. What is at x = 2?', ['A maximum', 'A minimum', 'Neither'], 0, 'f″ is negative, so it\'s a frown shape: a peak.'),
    ans('What is the maximum value of f(x) = −x² + 4x?', ['4'], 'At x = 2: −4 + 8 = 4.'),
    ex('A real problem', 'You have **40 m** of fence for a rectangle. What shape holds the most area?\n\nIf one side is x, the other is 20 − x, so the area is A(x) = x(20 − x) = 20x − x².\n\nA′(x) = 20 − 2x = 0 → **x = 10**. A 10 × 10 square gives area **100 m²**.', 'Optimization is everywhere in computing: shortest routes, lowest cost, smallest error.'),
    ans('With 40 m of fence, what is the largest possible rectangle area, in m²?', ['100'], '10 × 10 = 100.'),
    mc('f(x) = x³ has f′(0) = 0. What is at x = 0?', ['A maximum', 'A minimum', 'Neither: just a flat spot where the curve keeps rising'], 2, 'x³ goes up on both sides of 0. A zero slope is a candidate, not a guarantee.'),
    py({
      prompt: 'For a > 0, the curve a·x² + b·x + c is a smile, and its lowest point is where the derivative 2a·x + b = 0.\n\nWrite `find_min(a, b, c)` that returns that x.',
      starter: 'def find_min(a, b, c):\n    pass\n',
      tests: [eq('find_min(1, -6, 10)', '3.0'), eq('find_min(2, 8, 0)', '-2.0'), eq('find_min(1, 0, 5)', '0.0')],
      hints: ['Solve 2a·x + b = 0 for x.', 'return -b / (2 * a)'],
      solution: 'def find_min(a, b, c):\n    return -b / (2 * a)\n',
    }),
  ],

  // ------------------------------------------------------------------ ca-2-partials
  'ca-2-partials': [
    ex('Many inputs', 'Most real functions have many inputs. f(x, y) = x² + 3y depends on both x and y.\n\nA **partial derivative** changes **one** input and holds the others still:\n\n- **∂f/∂x**: treat y as a constant → 2x\n- **∂f/∂y**: treat x as a constant → 3\n\n(∂ is a curly "d" meaning "partial".)'),
    ans('f(x, y) = x² + xy. What is ∂f/∂x at (1, 2)?', ['4'], '∂f/∂x = 2x + y (y is a constant). At (1, 2): 2 + 2 = 4.'),
    ans('Same f(x, y) = x² + xy. What is ∂f/∂y at (1, 2)?', ['1'], '∂f/∂y = x (x² is a constant, xy → x). At x = 1: 1.'),
    ex('The gradient', 'Put all the partial derivatives in a vector and you get the **gradient**, written **∇f** (say "grad f"):\n\n∇f = (∂f/∂x, ∂f/∂y)\n\nIt points in the direction of **steepest uphill**. Its length tells you how steep.\n\nf = x² + y² (a bowl): ∇f = (2x, 2y). At (1, 2) that\'s **(2, 4)**, pointing away from the bottom.'),
    vecAns('f(x, y) = x² + y². What is the gradient at (3, 1)? Write it like (a, b).', [6, 2], '(2·3, 2·1) = (6, 2).'),
    mc('To go DOWNHILL as fast as possible, you move…', ['in the direction of the gradient', 'in the opposite direction of the gradient', 'sideways to the gradient'], 1, 'The gradient points uphill, so its opposite (−∇f) points steepest downhill.'),
    mc('At the very bottom of a bowl, the gradient is…', ['(0, 0)', 'very large', 'pointing straight up'], 0, 'It\'s flat in every direction there, so every partial derivative is 0.'),
    py({
      prompt: 'Write `grad(f, x, y)` that returns `[df_dx, df_dy]`, estimated with central differences (h = 0.00001):\n\n- df_dx = (f(x + h, y) − f(x − h, y)) ÷ (2h)\n- df_dy = (f(x, y + h) − f(x, y − h)) ÷ (2h)',
      starter: 'def grad(f, x, y):\n    pass\n',
      tests: [
        { name: 'gradient of x² + 3y at (1, 2) is about [2, 3]', code: 'def __g(x, y):\n    return x * x + 3 * y\n__r = grad(__g, 1, 2)\nassert __r is not None and abs(__r[0] - 2) < 1e-4 and abs(__r[1] - 3) < 1e-4, f"expected about [2, 3], got {__r!r}"' },
        { name: 'gradient of x² + y² at (3, 1) is about [6, 2]', code: 'def __b(x, y):\n    return x * x + y * y\n__r = grad(__b, 3, 1)\nassert __r is not None and abs(__r[0] - 6) < 1e-4 and abs(__r[1] - 2) < 1e-4, f"expected about [6, 2], got {__r!r}"' },
      ],
      hints: ['h = 0.00001', 'return [(f(x + h, y) - f(x - h, y)) / (2 * h), (f(x, y + h) - f(x, y - h)) / (2 * h)]'],
      solution: 'def grad(f, x, y):\n    h = 0.00001\n    dx = (f(x + h, y) - f(x - h, y)) / (2 * h)\n    dy = (f(x, y + h) - f(x, y - h)) / (2 * h)\n    return [dx, dy]\n',
    }),
  ],

  // ------------------------------------------------------------------ ca-2-gradient-descent
  'ca-2-gradient-descent': [
    ex('Walk downhill', 'Often we can\'t solve f′(x) = 0 directly. **Gradient descent** finds the bottom step by step instead:\n\n**x ← x − α · f′(x)**\n\n- f′(x) says which way is uphill, so we step the **other** way.\n- **α** (alpha) is the **learning rate**: how big each step is.\n\nRepeat until the slope is about 0.'),
    ex('An example', 'f(x) = x², so f′(x) = 2x. Start at x = 4 with α = 0.25:\n\n- step 1: 4 − 0.25 × 8 = **2**\n- step 2: 2 − 0.25 × 4 = **1**\n- step 3: 1 − 0.25 × 2 = **0.5**\n\nEach step halves x, sliding toward the minimum at 0.'),
    ans('f(x) = x², α = 0.25, x = 0.5. What is the next x?', ['0.25'], '0.5 − 0.25 × (2 × 0.5) = 0.5 − 0.25 = 0.25.'),
    ans('f(x) = (x − 3)², so f′(x) = 2(x − 3). With x = 5 and α = 0.1, what is the next x?', ['4.6'], 'f′(5) = 4, and 5 − 0.1 × 4 = 4.6: one step closer to the minimum at 3.'),
    mc('What happens if the learning rate is far too BIG?', ['Steps overshoot the bottom and can bounce further and further away', 'It always finds the answer faster', 'Nothing changes'], 0, 'Too-big steps jump over the valley. Training "blows up".'),
    mc('What happens if the learning rate is far too SMALL?', ['Progress is very slow', 'It jumps around wildly', 'It crashes immediately'], 0, 'Tiny steps head the right way but take forever.'),
    ex('This is how machine learning learns', 'In machine learning, the function is the **loss**: a number measuring how wrong the model is. The inputs are the model\'s **weights**, often millions of them.\n\nTraining = gradient descent on the loss: compute the gradient (using the chain rule, via **backpropagation**), take a step downhill, and repeat thousands of times.'),
    ordT('Put the steps of gradient descent in order.', ['Start with a guess for x', 'Compute the slope f′(x)', 'Step: x = x − learning_rate × f′(x)', 'Repeat until the slope is about 0'], 'Guess → slope → step → repeat.'),
    py({
      prompt: 'f(x) = (x − 3)², so f′(x) = 2(x − 3).\n\nWrite `gradient_descent(x, rate, steps)` that does `steps` updates of x ← x − rate × f′(x), then **returns** x.',
      starter: 'def gradient_descent(x, rate, steps):\n    pass\n',
      tests: [eq('round(gradient_descent(0, 0.1, 100), 4)', '3.0'), eq('round(gradient_descent(5, 0.5, 1), 6)', '3.0'), eq('round(gradient_descent(5, 0.1, 1), 6)', '4.6'), eq('gradient_descent(3, 0.1, 10)', '3')],
      hints: ['for _ in range(steps):', '    x = x - rate * 2 * (x - 3)   then return x after the loop'],
      solution: 'def gradient_descent(x, rate, steps):\n    for _ in range(steps):\n        slope = 2 * (x - 3)\n        x = x - rate * slope\n    return x\n',
    }),
  ],

  // ------------------------------------------------------------------ ca-3-integrals
  'ca-3-integrals': [
    ex('Adding up tiny pieces', 'The **integral** adds up a quantity over a range. Picture it as the **area under a curve**:\n\n**∫ from a to b of f(x) dx**\n\nDriving at 60 km/h for 2 hours: the speed graph is a flat line, and the area under it is 60 × 2 = **120 km**. That\'s the distance.\n\nDerivatives break things into rates. Integrals add rates back up into totals.'),
    ans('An object moves at a steady 5 m/s for 10 seconds. How far does it go, in meters?', ['50'], 'Area under the speed graph: 5 × 10 = 50.'),
    ex('Rectangles', 'For a curvy graph, split the range into **n thin rectangles** of width Δx and add their areas. That\'s a **Riemann sum**.\n\nUsing each rectangle\'s **midpoint** for its height works well.\n\nMore (thinner) rectangles → a closer answer. The integral is the limit as n → ∞.'),
    ans('What is the area under f(x) = 3 from x = 0 to x = 4?', ['12'], 'A rectangle 4 wide and 3 tall.'),
    ans('What is the area under f(x) = x from x = 0 to x = 4?', ['8'], 'A triangle with base 4 and height 4: ½ × 4 × 4 = 8.'),
    mc('Using more, thinner rectangles makes the estimate…', ['more accurate', 'less accurate', 'exactly the same'], 0, 'Thin rectangles hug the curve more closely.'),
    ex('Area below zero', 'Where the curve is **below** the x-axis, the area counts as **negative**.\n\nf(x) = x from −1 to 1: the triangle on the left (−½) cancels the one on the right (+½), so the integral is **0**.'),
    mc('What is the integral of f(x) = x from x = −2 to x = 2?', ['0', '4', '−4'], 0, 'The negative half (−2) and positive half (+2) cancel.'),
    py({
      prompt: 'Write `riemann(f, a, b, n)` that estimates the integral of f from a to b with **n** rectangles, using the **midpoint** of each one:\n\n- width dx = (b − a) ÷ n\n- rectangle i (from 0 to n − 1) has height f(a + (i + 0.5) × dx)\n- add up height × dx',
      starter: 'def riemann(f, a, b, n):\n    pass\n',
      tests: [
        { name: 'area under x² from 0 to 3 is about 9', code: 'def __sq(x):\n    return x * x\n__r = riemann(__sq, 0, 3, 1000)\nassert __r is not None and abs(__r - 9) < 1e-3, f"expected about 9, got {__r!r}"' },
        { name: 'area under 1 from 2 to 5 is 3', code: 'def __one(x):\n    return 1\n__r = riemann(__one, 2, 5, 10)\nassert __r is not None and abs(__r - 3) < 1e-9, f"expected 3, got {__r!r}"' },
      ],
      hints: ['dx = (b - a) / n, then total = 0', 'for i in range(n): total += f(a + (i + 0.5) * dx) * dx — then return total'],
      solution: 'def riemann(f, a, b, n):\n    dx = (b - a) / n\n    total = 0\n    for i in range(n):\n        total += f(a + (i + 0.5) * dx) * dx\n    return total\n',
    }),
  ],

  // ------------------------------------------------------------------ ca-3-ftc
  'ca-3-ftc': [
    ex('Running derivatives backward', 'An **antiderivative** F of f is a function whose derivative is f: **F′ = f**.\n\n- x² is an antiderivative of 2x\n- x³ is an antiderivative of 3x²\n\nThe power rule backward: an antiderivative of **xⁿ** is **xⁿ⁺¹ ÷ (n + 1)**.'),
    mc('F(x) = x³ is an antiderivative of which function?', ['3x²', 'x²', 'x⁴ ÷ 4'], 0, 'The derivative of x³ is 3x².'),
    ex('The fundamental theorem', 'The **fundamental theorem of calculus** connects the two big ideas:\n\n**∫ from a to b of f(x) dx = F(b) − F(a)**\n\nNo rectangles needed: find an antiderivative and subtract.\n\n∫ from 0 to 3 of x² dx: F(x) = x³ ÷ 3, so F(3) − F(0) = 9 − 0 = **9**. That\'s the same answer the 1,000 rectangles gave.', 'Derivatives and integrals undo each other, like multiplying and dividing.'),
    ans('What is ∫ from 0 to 2 of 3x² dx?', ['8'], 'F(x) = x³, so F(2) − F(0) = 8 − 0 = 8.'),
    ans('What is ∫ from 1 to 3 of 2x dx?', ['8'], 'F(x) = x², so F(3) − F(1) = 9 − 1 = 8.'),
    ans('What is ∫ from 0 to 1 of x² dx? (A fraction is fine.)', ['1/3', '0.333', '0.33'], 'F(x) = x³ ÷ 3, so F(1) − F(0) = 1/3.'),
    mc('The fundamental theorem says derivatives and integrals are…', ['opposites: each undoes the other', 'the same thing', 'unrelated'], 0, 'Integrate a rate to get a total. Differentiate the total to get the rate back.'),
    mc('For a continuous random variable (like height), the probability of landing between a and b is…', ['the area under its probability curve from a to b', 'the height of the curve at a', 'always zero'], 0, 'This is where calculus meets probability: probabilities of ranges are integrals.'),
    py({
      prompt: 'A polynomial is a list of coefficients: `[0, 0, 1]` means x².\n\nWrite `integrate_poly(coeffs, a, b)` that returns the **exact** integral from a to b using the fundamental theorem: the term c·xᵏ has antiderivative c·xᵏ⁺¹ ÷ (k + 1).',
      starter: 'def integrate_poly(coeffs, a, b):\n    pass\n',
      tests: [eq('round(integrate_poly([0, 0, 1], 0, 3), 9)', '9.0'), eq('round(integrate_poly([0, 2], 1, 3), 9)', '8.0'), eq('round(integrate_poly([5], 0, 2), 9)', '10.0'), eq('round(integrate_poly([0, 0, 3], 0, 2), 9)', '8.0')],
      hints: ['Write a helper F(x) that adds coeffs[k] * x ** (k + 1) / (k + 1) for every k.', 'return F(b) - F(a)'],
      solution: 'def integrate_poly(coeffs, a, b):\n    def F(x):\n        total = 0\n        for k in range(len(coeffs)):\n            total += coeffs[k] * x ** (k + 1) / (k + 1)\n        return total\n    return F(b) - F(a)\n',
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'ca-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('Limit of 3x − 2 as x → 4?', ['10'], 'Plug in: 12 − 2.'),
      ans('Limit of (x² − 9) ÷ (x − 3) as x → 3?', ['6'], 'Simplifies to x + 3.'),
      ans('Limit of 5/x as x → ∞?', ['0'], 'The bottom grows forever.'),
      ans('Slope of the line through (1, 1) and (4, 7)?', ['2'], '6 ÷ 3.'),
      ans('f(x) = x³. What is f′(2)?', ['12'], '3x² = 12.'),
      ans('f(x) = 4x² − x. What is f′(1)?', ['7'], '8x − 1.'),
      ans('f(x) = (x + 2)². What is f′(1)? (Chain rule.)', ['6'], '2(x + 2)·1 = 6.'),
      mc('f′(x) < 0 means f is…', ['increasing', 'decreasing', 'constant'], 1, 'Negative slope.'),
      py({ prompt: 'Write `slope(x1, y1, x2, y2)`: rise over run.', starter: 'def slope(x1, y1, x2, y2):\n    pass\n', tests: [eq('slope(1, 2, 3, 8)', '3.0'), eq('slope(0, 5, 5, 0)', '-1.0')], solution: 'def slope(x1, y1, x2, y2):\n    return (y2 - y1) / (x2 - x1)\n' }),
    ],
  },
  'ca-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('f(x) = x² − 10x. At what x is f′(x) = 0?', ['5'], '2x − 10 = 0.'),
      mc('f″(x) > 0 at a point where f′(x) = 0. It\'s a…', ['maximum', 'minimum'], 1, 'Smile shape.'),
      ans('Largest rectangle area with 20 m of fence, in m²?', ['25'], '5 × 5.'),
      ans('f(x, y) = 3x + y². ∂f/∂y at (2, 4)?', ['8'], '2y.'),
      vecAns('Gradient of f = x² + y² at (2, -1)?', [4, -2], '(2x, 2y).'),
      mc('Gradient descent steps…', ['along the gradient', 'against the gradient'], 1, 'Downhill.'),
      ans('f(x) = x², α = 0.1, x = 10. Next x?', ['8'], '10 − 0.1 × 20.'),
      py({ prompt: 'Write `step(x, rate, slope)`: one gradient descent update.', starter: 'def step(x, rate, slope):\n    pass\n', tests: [eq('step(10, 0.1, 20)', '8.0'), eq('step(0, 0.5, -2)', '1.0')], solution: 'def step(x, rate, slope):\n    return x - rate * slope\n' }),
    ],
  },
  'ca-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('A car drives 50 km/h for 3 hours. Distance in km?', ['150'], 'Area of a rectangle.'),
      ans('Area under f(x) = 2x from 0 to 3?', ['9'], 'Triangle: ½ × 3 × 6.'),
      mc('The integral of x from −3 to 3 is…', ['0', '9', '−9'], 0, 'The halves cancel.'),
      ans('∫ from 0 to 3 of 2x dx?', ['9'], 'x² from 0 to 3.'),
      ans('∫ from 1 to 2 of 3x² dx?', ['7'], '8 − 1.'),
      mc('An antiderivative of 2x is…', ['x²', '2', 'x³'], 0, '(x²)′ = 2x.'),
      ans('∫ from 0 to 3 of x² dx?', ['9'], '27 ÷ 3.'),
      py({ prompt: 'Write `trapezoid(y0, y1, width)`: the area of one trapezoid slice, width × (y0 + y1) ÷ 2.', starter: 'def trapezoid(y0, y1, width):\n    pass\n', tests: [eq('trapezoid(2, 4, 3)', '9.0'), eq('trapezoid(0, 0, 5)', '0.0')], solution: 'def trapezoid(y0, y1, width):\n    return width * (y0 + y1) / 2\n' }),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  calculus: {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('Limit of (x² − 16) ÷ (x − 4) as x → 4?', ['8'], 'x + 4.'),
      ans('f(x) = x⁵. What is f′(1)?', ['5'], '5x⁴.'),
      ans('f(x) = 2x³ + x. What is f′(1)?', ['7'], '6x² + 1.'),
      ans('f(x) = (3x − 1)². What is f′(1)? (Chain rule.)', ['12'], '2(3x − 1)·3 = 2·2·3.'),
      ans('f(x) = x² − 8x + 1. At what x is the minimum?', ['4'], '2x − 8 = 0.'),
      ans('f(x, y) = x²y. ∂f/∂x at (3, 2)?', ['12'], '2xy.'),
      mc('If the learning rate is too large, gradient descent…', ['may overshoot and diverge', 'is always faster and safer'], 0, 'Too-big steps bounce away.'),
      ans('f(x) = (x − 1)², α = 0.5, x = 3. Next x?', ['1'], 'f′(3) = 4; 3 − 2.'),
      ans('∫ from 0 to 2 of 4x dx?', ['8'], '2x² from 0 to 2.'),
      ans('∫ from 0 to 1 of 3x² dx?', ['1'], 'x³ from 0 to 1.'),
      py({ prompt: 'Write `poly_eval(coeffs, x)`: evaluate the polynomial `[c0, c1, c2, …]` = c0 + c1·x + c2·x² + … at x.', starter: 'def poly_eval(coeffs, x):\n    pass\n', tests: [eq('poly_eval([1, 2, 3], 2)', '17'), eq('poly_eval([5], 10)', '5'), eq('poly_eval([0, 0, 1], -3)', '9')], hints: ['Add coeffs[k] * x ** k for every k.'], solution: 'def poly_eval(coeffs, x):\n    return sum(c * x ** k for k, c in enumerate(coeffs))\n' }),
    ],
  },
};
