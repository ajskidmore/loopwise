/**
 * Track: foundations — "How Computers Think"
 * Written: fnd-1 (all lessons + checkpoint)
 */
import type { Checkpoint, Step } from '../types';

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ fnd-1-what-is-code
  'fnd-1-what-is-code': [
    {
      kind: 'explain',
      title: 'Welcome to Loopwise! 👋',
      body: 'You are about to learn to code **from absolute zero**. No experience needed — every idea will be explained before you use it.\n\nFirst big idea: a computer is **incredibly fast**, but it is **not smart**. It does exactly what it is told — nothing more, nothing less.',
      tip: 'Hi, I\'m Pip! I\'ll pop up with tips. Tap Continue to keep going.',
    },
    {
      kind: 'explain',
      title: 'So what is code?',
      body: '**Code** is a list of instructions written for a computer.\n\nA collection of code that does a job is called a **program**. Your web browser, a calculator app and a video game are all programs.\n\nWriting those instructions is called **programming** (or **coding**).',
    },
    {
      kind: 'choice',
      prompt: 'Which is the best description of code?',
      choices: ['A secret message only experts can read', 'A list of instructions for a computer', 'The electricity inside a computer', 'A kind of computer hardware'],
      answer: 1,
      explanation: 'Code is simply instructions. A program is a collection of code that does a job.',
    },
    {
      kind: 'explain',
      title: 'Exact instructions',
      body: 'Imagine telling a robot: **"Make a sandwich."**\n\nThe robot has no idea what that means. You would need to say things like:\n\n- Pick up two slices of bread\n- Open the peanut butter jar\n- Spread peanut butter on one slice\n- Put the slices together\n\nComputers are like that robot. Every step must be **spelled out**.',
      tip: 'Being "too literal" is a computer\'s superpower and its weakness.',
    },
    {
      kind: 'order',
      prompt: 'Put the sandwich robot\'s instructions in the right order.',
      lines: ['Pick up two slices of bread', 'Open the peanut butter jar', 'Spread peanut butter on one slice', 'Put the two slices together'],
      explanation: 'Order matters! Computers run instructions from top to bottom, one at a time.',
    },
    {
      kind: 'explain',
      title: 'Programming languages',
      body: 'Computers really only understand **0s and 1s**. Writing in 0s and 1s would be miserable, so people invented **programming languages** — ways of writing instructions that look closer to English.\n\nHere is one line of **Python**, the first language you will learn:\n\n```python\nprint("Hello!")\n```\n\nThis tells the computer to show the word Hello! on the screen.',
    },
    {
      kind: 'choice',
      prompt: 'Why do programming languages exist?',
      choices: ['Computers only understand English', 'So humans can write instructions more easily than with 0s and 1s', 'To make computers run slower', 'Because computers are smart'],
      answer: 1,
      explanation: 'Programming languages are a bridge: humans write something readable, and a tool translates it for the computer.',
    },
    {
      kind: 'choice',
      prompt: 'A computer does something you did not expect. What is the most likely reason?',
      choices: ['The computer decided to ignore you', 'The instructions said something different from what you meant', 'Computers are random', 'It was tired'],
      answer: 1,
      explanation: 'Computers follow instructions exactly. When results surprise us, it\'s almost always because the instructions weren\'t what we intended.',
    },
  ],

  // ------------------------------------------------------------------ fnd-1-algorithms
  'fnd-1-algorithms': [
    {
      kind: 'explain',
      title: 'Algorithms are recipes',
      body: 'An **algorithm** is a step-by-step plan for solving a problem.\n\nA cooking recipe is an algorithm. So are directions to a friend\'s house. Algorithms exist **before** any code — code is just one way to write an algorithm down.',
    },
    {
      kind: 'choice',
      prompt: 'Which of these is an algorithm?',
      choices: ['The color blue', 'Directions: "Go 2 blocks, turn left, stop at the red house"', 'A laptop', 'The word "hello"'],
      answer: 1,
      explanation: 'Directions are a step-by-step plan, so they are an algorithm.',
    },
    {
      kind: 'explain',
      title: 'A good algorithm is…',
      body: '- **Clear** — each step means exactly one thing\n- **Ordered** — the steps happen in a set sequence\n- **Finite** — it eventually stops\n\n"Stir until it looks right" is not clear. "Stir for 2 minutes" is.',
    },
    {
      kind: 'choice',
      prompt: 'Which step is clear enough for a computer?',
      choices: ['Add some salt', 'Cook until done', 'Bake at 350°F for 20 minutes', 'Make it taste good'],
      answer: 2,
      explanation: 'It gives an exact temperature and an exact time — no guessing required.',
    },
    {
      kind: 'explain',
      title: 'Finding the biggest number',
      body: 'Here is a real algorithm programmers use. To find the **largest** number in a list:\n\n- Remember the first number as "biggest so far"\n- Look at each other number one at a time\n- If it is bigger than "biggest so far", remember it instead\n- When you run out of numbers, "biggest so far" is the answer',
      tip: 'You will write this exact algorithm in Python later!',
    },
    {
      kind: 'answer',
      prompt: 'Run the algorithm by hand on the list 4, 9, 2, 7. What is "biggest so far" at the end?',
      accept: ['9'],
      explanation: 'Start with 4. 9 is bigger → 9. 2 is not bigger. 7 is not bigger. Answer: 9.',
    },
    {
      kind: 'answer',
      prompt: 'Same algorithm, list 3, 1, 2. After looking at the number 1, what is "biggest so far"?',
      accept: ['3'],
      explanation: 'Start with 3. 1 is not bigger than 3, so we keep 3.',
    },
    {
      kind: 'order',
      prompt: 'Order these steps of an algorithm for brushing your teeth.',
      lines: ['Pick up toothbrush', 'Put toothpaste on brush', 'Brush for 2 minutes', 'Rinse your mouth'],
      explanation: 'Each step depends on the one before it — that\'s why order matters.',
    },
  ],

  // ------------------------------------------------------------------ fnd-1-input-output
  'fnd-1-input-output': [
    {
      kind: 'explain',
      title: 'Input → Process → Output',
      body: 'Almost every program follows the same shape:\n\n- **Input** — information comes in\n- **Process** — the program works on it\n- **Output** — a result comes out\n\nA calculator: you type `2 + 3` (input), it adds (process), it shows `5` (output).',
    },
    {
      kind: 'choice',
      prompt: 'In a weather app, what is the OUTPUT?',
      choices: ['Your city name', 'The forecast shown on screen', 'The app\'s calculations', 'Your phone\'s battery'],
      answer: 1,
      explanation: 'The forecast is the result shown to you. Your city is the input; the calculations are the process.',
    },
    {
      kind: 'choice',
      prompt: 'In a music app, you type a song name into search. That song name is the…',
      choices: ['Input', 'Process', 'Output'],
      answer: 0,
      explanation: 'Information you give a program is input.',
    },
    {
      kind: 'explain',
      title: 'Inputs come in many forms',
      body: 'Input can be typing, clicking, a file, a photo, a sensor reading or data from the internet.\n\nOutput can be text on screen, a sound, a saved file, a message sent to a server, or a robot moving.',
    },
    {
      kind: 'answer',
      prompt: 'A program takes a number as input and outputs that number doubled. If the input is 6, what is the output?',
      accept: ['12'],
      explanation: 'The process is "multiply by 2", so 6 becomes 12.',
    },
    {
      kind: 'answer',
      prompt: 'A program outputs the input number plus 10. The output was 25. What was the input?',
      accept: ['15'],
      explanation: '15 + 10 = 25. Working backwards like this is a real debugging skill!',
    },
    {
      kind: 'choice',
      prompt: 'A spell-checker underlines a misspelled word. Which part is "checking each word against a dictionary"?',
      choices: ['Input', 'Process', 'Output'],
      answer: 1,
      explanation: 'Checking is the work the program does — the process. The underline is the output.',
    },
  ],

  // ------------------------------------------------------------------ fnd-1-bugs
  'fnd-1-bugs': [
    {
      kind: 'explain',
      title: 'Meet the bug 🐛',
      body: 'A **bug** is a mistake in code that makes a program do the wrong thing.\n\n**Every programmer writes bugs** — beginners and experts alike. Finding and fixing them is called **debugging**, and it is a normal, daily part of programming.',
      tip: 'Seeing errors does NOT mean you are bad at this. It means you are programming.',
    },
    {
      kind: 'explain',
      title: 'Two main kinds of bugs',
      body: '- **Syntax errors** — the code breaks the language\'s grammar rules, so it can\'t run at all. Like a sentence with a missing word.\n- **Logic errors** — the code runs, but does the wrong thing. Like a recipe that says "bake for 2 hours" instead of 20 minutes.',
    },
    {
      kind: 'choice',
      prompt: 'A program runs without crashing, but says 2 + 2 is 5. What kind of bug is this?',
      choices: ['Syntax error', 'Logic error', 'Not a bug'],
      answer: 1,
      explanation: 'It runs, so the grammar is fine. The result is wrong, so it\'s a logic error.',
    },
    {
      kind: 'choice',
      prompt: 'You forget a closing quote mark and the program refuses to run. What kind of bug?',
      code: 'print("Hello)',
      language: 'python',
      choices: ['Syntax error', 'Logic error'],
      answer: 0,
      explanation: 'The language\'s rules say every opening quote needs a closing one. Breaking a grammar rule = syntax error.',
    },
    {
      kind: 'explain',
      title: 'The debugging mindset',
      body: 'When something goes wrong:\n\n- **Read the error message.** It usually says what and where.\n- **Reproduce it.** Can you make it happen again?\n- **Narrow it down.** Which line is the problem?\n- **Change one thing at a time** and test again.',
    },
    {
      kind: 'order',
      prompt: 'Put the debugging steps in a sensible order.',
      lines: ['Read the error message', 'Reproduce the problem', 'Narrow down which line is wrong', 'Change one thing and test again'],
      explanation: 'Gather information first, then make small, testable changes.',
    },
    {
      kind: 'choice',
      prompt: 'Your code has a bug. What\'s the best first move?',
      choices: ['Delete everything and start over', 'Read the error message carefully', 'Change many lines at once', 'Give up'],
      answer: 1,
      explanation: 'Error messages are clues. Reading them carefully saves hours.',
    },
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'fnd-1': {
    passScore: 0.8,
    hearts: 3,
    questions: [
      {
        kind: 'choice',
        prompt: 'What is a program?',
        choices: ['A collection of code that does a job', 'A computer screen', 'A type of keyboard', 'A math formula'],
        answer: 0,
        explanation: 'Programs are made of code — instructions — that together do a job.',
      },
      {
        kind: 'choice',
        prompt: 'Which word means "a step-by-step plan for solving a problem"?',
        choices: ['Bug', 'Algorithm', 'Output', 'Syntax'],
        answer: 1,
        explanation: 'That\'s the definition of an algorithm.',
      },
      {
        kind: 'choice',
        prompt: 'A thermostat reads the room temperature. The temperature reading is the…',
        choices: ['Input', 'Process', 'Output'],
        answer: 0,
        explanation: 'Information coming into the program is input.',
      },
      {
        kind: 'choice',
        prompt: 'Code runs but gives the wrong answer. This is a…',
        choices: ['Syntax error', 'Logic error'],
        answer: 1,
        explanation: 'Runs = grammar OK. Wrong answer = logic error.',
      },
      {
        kind: 'answer',
        prompt: 'Using the "biggest so far" algorithm on 5, 8, 3, 8, 1 — what is the answer?',
        accept: ['8'],
        explanation: '5 → 8 (bigger) → 3 no → 8 not bigger than 8 → 1 no. Answer 8.',
      },
      {
        kind: 'order',
        prompt: 'Put the parts of every program in order.',
        lines: ['Input', 'Process', 'Output'],
        explanation: 'Information comes in, gets worked on, and a result comes out.',
      },
      {
        kind: 'choice',
        prompt: 'Which instruction is clear enough for a computer?',
        choices: ['Wait a bit', 'Wait 5 seconds', 'Wait until it feels right', 'Wait for a while'],
        answer: 1,
        explanation: 'Only "5 seconds" is exact.',
      },
      {
        kind: 'choice',
        prompt: 'Why are programming languages useful?',
        choices: ['They let humans write instructions more easily than 0s and 1s', 'They make computers think for themselves', 'They are only for experts', 'They replace hardware'],
        answer: 0,
        explanation: 'They\'re a human-friendly way to write instructions that get translated for the machine.',
      },
    ],
  },
};
