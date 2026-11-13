/**
 * Track: math-0 — "Math Refresher"
 * Written: m0-1 (all lessons + checkpoint)
 */
import type { Checkpoint, Step } from '../types';

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ m0-1-number-types
  'm0-1-number-types': [
    {
      kind: 'explain',
      title: 'Why math? 🤔',
      body: 'Programming uses math constantly — not scary math, but **clear thinking about numbers**. We will rebuild everything from the ground up, one small step at a time.\n\nFirst: there are different **kinds** of numbers, and computers care a lot about which kind you are using.',
    },
    {
      kind: 'explain',
      title: 'The number families',
      body: '- **Natural numbers**: counting numbers `0, 1, 2, 3, …`\n- **Integers**: whole numbers, including negatives: `…, -2, -1, 0, 1, 2, …`\n- **Rational numbers**: anything you can write as a fraction, like `1/2`, `-3/4`, `0.25`\n- **Real numbers**: every point on the number line, including numbers like `π = 3.14159…` that never end or repeat',
      tip: 'Each family contains the one before it. Every integer is also a rational number (5 = 5/1).',
    },
    {
      kind: 'choice',
      prompt: 'Which of these is an integer?',
      choices: ['2.5', '-7', '1/3', 'π'],
      answer: 1,
      explanation: 'Integers are whole numbers. -7 is whole (just negative).',
    },
    {
      kind: 'choice',
      prompt: 'Is 0.75 a rational number?',
      choices: ['Yes — it equals 3/4', 'No — it has a decimal point'],
      answer: 0,
      explanation: 'Any number you can write as a fraction is rational, decimals included. 0.75 = 3/4.',
    },
    {
      kind: 'explain',
      title: 'Computers: int vs float',
      body: 'Programming languages split numbers into two main kinds:\n\n- **int** (integer): whole numbers like `42` or `-3`\n- **float** (floating-point): numbers with a decimal point like `3.14` or `2.0`\n\nNotice `2.0` is a float even though its value is whole — the decimal point decides.',
    },
    {
      kind: 'choice',
      prompt: 'In Python, what kind of number is 7.0?',
      choices: ['int', 'float'],
      answer: 1,
      explanation: 'The decimal point makes it a float, even though 7.0 equals 7.',
    },
    {
      kind: 'answer',
      prompt: 'Write 1/4 as a decimal.',
      accept: ['0.25', '.25'],
      explanation: '1 ÷ 4 = 0.25.',
    },
    {
      kind: 'answer',
      prompt: 'Write 0.5 as a fraction (like a/b, in lowest terms).',
      accept: ['1/2'],
      explanation: '0.5 is one half: 1/2.',
    },
  ],

  // ------------------------------------------------------------------ m0-1-order-of-ops
  'm0-1-order-of-ops': [
    {
      kind: 'explain',
      title: 'What is 2 + 3 × 4?',
      body: 'If you go left to right you get `5 × 4 = 20`. But the correct answer is **14**!\n\nMath (and every programming language) uses an **order of operations** so everyone gets the same answer.',
    },
    {
      kind: 'explain',
      title: 'PEMDAS',
      body: '- **P**arentheses first `( )`\n- **E**xponents `2³`\n- **M**ultiplication and **D**ivision — left to right\n- **A**ddition and **S**ubtraction — left to right\n\nSo `2 + 3 × 4` → multiply first → `2 + 12` → `14`.',
      tip: 'M and D are a tie — do whichever comes first going left to right. Same for A and S.',
    },
    {
      kind: 'answer',
      prompt: 'What is 10 - 2 × 3?',
      accept: ['4'],
      explanation: 'Multiply first: 2 × 3 = 6. Then 10 - 6 = 4.',
    },
    {
      kind: 'answer',
      prompt: 'What is (10 - 2) × 3?',
      accept: ['24'],
      explanation: 'Parentheses first: 10 - 2 = 8. Then 8 × 3 = 24.',
    },
    {
      kind: 'answer',
      prompt: 'What is 20 ÷ 4 × 5?',
      accept: ['25'],
      explanation: 'Division and multiplication tie, so go left to right: 20 ÷ 4 = 5, then 5 × 5 = 25.',
    },
    {
      kind: 'explain',
      title: 'Same rules in code',
      body: 'In code, `*` means multiply and `/` means divide:\n\n```python\nprint(2 + 3 * 4)    # 14\nprint((2 + 3) * 4)  # 20\n```\n\nWhen in doubt, **add parentheses**. They make your intent obvious to both the computer and other humans.',
    },
    {
      kind: 'choice',
      prompt: 'What does this print?',
      code: 'print(8 - 6 / 2)',
      language: 'python',
      choices: ['1.0', '5.0', '4.0', '7.0'],
      answer: 1,
      explanation: 'Division first: 6 / 2 = 3.0, then 8 - 3.0 = 5.0. (Python\'s / always gives a float.)',
    },
    {
      kind: 'answer',
      prompt: 'What is 2 + 3² ? (3² means 3 × 3)',
      accept: ['11'],
      explanation: 'Exponent first: 3² = 9. Then 2 + 9 = 11.',
    },
  ],

  // ------------------------------------------------------------------ m0-1-negatives
  'm0-1-negatives': [
    {
      kind: 'explain',
      title: 'Below zero',
      body: 'Picture a **number line**: zero in the middle, positives to the right, negatives to the left.\n\n- Adding a positive moves **right**\n- Subtracting moves **left**\n\n`3 - 5` starts at 3 and moves 5 left → `-2`.',
    },
    {
      kind: 'answer',
      prompt: 'What is 4 - 9?',
      accept: ['-5'],
      explanation: 'Start at 4, move 9 to the left: -5.',
    },
    {
      kind: 'explain',
      title: 'Subtracting a negative',
      body: 'Subtracting a negative is the same as adding:\n\n`5 - (-2) = 5 + 2 = 7`\n\nThink: "taking away a debt" leaves you richer.',
    },
    {
      kind: 'answer',
      prompt: 'What is 3 - (-4)?',
      accept: ['7'],
      explanation: 'Minus a negative is plus: 3 + 4 = 7.',
    },
    {
      kind: 'explain',
      title: 'Multiplying signs',
      body: '- positive × positive = **positive**\n- positive × negative = **negative**\n- negative × negative = **positive**\n\nSame rules for division.',
    },
    {
      kind: 'answer',
      prompt: 'What is -3 × -6?',
      accept: ['18'],
      explanation: 'Two negatives make a positive: 18.',
    },
    {
      kind: 'answer',
      prompt: 'What is -20 ÷ 4?',
      accept: ['-5'],
      explanation: 'Negative ÷ positive = negative: -5.',
    },
    {
      kind: 'explain',
      title: 'Absolute value',
      body: 'The **absolute value** `|x|` is a number\'s distance from zero — always zero or positive.\n\n`|-7| = 7` and `|7| = 7`. In Python it\'s `abs(-7)`. Programmers use it for things like "how far apart are two numbers?"',
    },
    {
      kind: 'answer',
      prompt: 'What is |3 - 10| ?',
      accept: ['7'],
      explanation: '3 - 10 = -7, and its distance from zero is 7.',
    },
  ],

  // ------------------------------------------------------------------ m0-1-exponents
  'm0-1-exponents': [
    {
      kind: 'explain',
      title: 'Repeated multiplication',
      body: 'An **exponent** says how many times to multiply a number by itself.\n\n`2³ = 2 × 2 × 2 = 8`\n\nThe 2 is the **base** and the 3 is the **exponent** (or power). In Python you write `2 ** 3`.',
    },
    {
      kind: 'answer',
      prompt: 'What is 5²?',
      accept: ['25'],
      explanation: '5 × 5 = 25. "Squared" means power 2.',
    },
    {
      kind: 'answer',
      prompt: 'What is 2⁵?',
      accept: ['32'],
      explanation: '2 × 2 × 2 × 2 × 2 = 32. Powers of 2 are everywhere in computing!',
    },
    {
      kind: 'explain',
      title: 'Special exponents',
      body: '- Anything to the power **1** is itself: `7¹ = 7`\n- Anything (except 0) to the power **0** is **1**: `9⁰ = 1`\n- A **negative** exponent means "one over": `2⁻¹ = 1/2`',
    },
    {
      kind: 'choice',
      prompt: 'What is 1000⁰?',
      choices: ['0', '1', '1000', 'Undefined'],
      answer: 1,
      explanation: 'Any non-zero number to the power 0 is 1.',
    },
    {
      kind: 'explain',
      title: 'Exponent rules',
      body: '- Multiply same base → **add** exponents: `2³ × 2⁴ = 2⁷`\n- Divide same base → **subtract**: `2⁵ ÷ 2² = 2³`\n- Power of a power → **multiply**: `(2³)² = 2⁶`',
    },
    {
      kind: 'answer',
      prompt: '2⁴ × 2³ = 2^? (type just the exponent)',
      accept: ['7'],
      explanation: 'Same base, multiplying → add exponents: 4 + 3 = 7.',
    },
    {
      kind: 'explain',
      title: 'Square roots',
      body: 'A **square root** undoes squaring. `√49 = 7` because `7² = 49`.\n\nIn Python: `49 ** 0.5` or `math.sqrt(49)`.',
    },
    {
      kind: 'answer',
      prompt: 'What is √81?',
      accept: ['9'],
      explanation: '9 × 9 = 81.',
    },
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'm0-1': {
    passScore: 0.8,
    hearts: 3,
    questions: [
      { kind: 'choice', prompt: 'Which number is NOT an integer?', choices: ['-4', '0', '3.5', '12'], answer: 2, explanation: '3.5 is not whole.' },
      { kind: 'answer', prompt: 'What is 6 + 4 × 2?', accept: ['14'], explanation: '4 × 2 = 8, then 6 + 8 = 14.' },
      { kind: 'answer', prompt: 'What is (6 + 4) × 2?', accept: ['20'], explanation: 'Parentheses first: 10 × 2 = 20.' },
      { kind: 'answer', prompt: 'What is -2 - 5?', accept: ['-7'], explanation: 'Start at -2 and move 5 left: -7.' },
      { kind: 'answer', prompt: 'What is -4 × -5?', accept: ['20'], explanation: 'Negative × negative = positive.' },
      { kind: 'answer', prompt: 'What is 3³?', accept: ['27'], explanation: '3 × 3 × 3 = 27.' },
      { kind: 'answer', prompt: 'What is 2¹⁰? (Hint: programmers know this one — it\'s about a thousand)', accept: ['1024'], explanation: '2¹⁰ = 1024, which is why a kilobyte is sometimes 1024 bytes.' },
      { kind: 'choice', prompt: 'In Python, what kind of number is 4.0?', choices: ['int', 'float'], answer: 1, explanation: 'The decimal point makes it a float.' },
      { kind: 'answer', prompt: 'What is |-15|?', accept: ['15'], explanation: 'Absolute value is distance from zero.' },
      { kind: 'answer', prompt: 'What is √64?', accept: ['8'], explanation: '8² = 64.' },
    ],
  },
};
