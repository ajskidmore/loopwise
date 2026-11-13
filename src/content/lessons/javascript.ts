/**
 * Track: javascript — "JavaScript"
 * Written here: js-1 (basics), js-2 (functions and collections), js-3 (the browser), js-4 (async), js-5 (TypeScript)
 * + checkpoints + course final exam.
 *
 * Notes for writers:
 * - The in-browser JS runner is synchronous: output from setTimeout / promises is NOT captured, and there is no
 *   DOM. So async, DOM and event exercises are written as plain functions that take fake event/data objects.
 * - TypeScript can't run here, so TS snippets are labeled 'text' and the TS lessons are explain + quiz.
 * - "What does this print?" JS snippets are not executed by `npm test` (only Python ones are), so each one was
 *   run by hand in Node before publishing.
 */
import type { AnswerStep, Checkpoint, ChoiceStep, FillStep, Step } from '../types';
import { ans, fill, fillT, js, mc, mcT, ex, ord } from './_helpers';

/** Multiple choice / short answer / fill-in with JavaScript code (the shared helpers default to Python). */
const mcJ = (prompt: string, choices: string[], answer: number, explanation: string, code?: string): ChoiceStep => ({
  ...mc(prompt, choices, answer, explanation), ...(code ? { code, language: 'javascript' as const } : {}),
});
const ansJ = (prompt: string, accept: string[], explanation: string, code?: string): AnswerStep => ({
  ...ans(prompt, accept, explanation), ...(code ? { code, language: 'javascript' as const } : {}),
});
const fillJ = (prompt: string, template: string, answers: string[][], explanation: string, bank?: string[]): FillStep => ({
  ...fill(prompt, template, answers, explanation, bank), language: 'javascript',
});
const ordT = (prompt: string, lines: string[], explanation: string) => ord(prompt, lines, explanation, 'text');

/** Test that `expr` (JS) is deeply equal to `expected` (JS), compared as JSON. */
const same = (expr: string, expected: string, name?: string) => ({
  name: name ?? `${expr} → ${expected}`,
  code: `const __v = ${expr};\nassert(JSON.stringify(__v) === JSON.stringify(${expected}), \`expected ${expected.replace(/`/g, '\\`').replace(/\$/g, '\\$')}, got \${JSON.stringify(__v)}\`);`,
});

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ js-1-hello
  'js-1-hello': [
    ex('Your second language', 'You already know how to program in Python. JavaScript uses the **same ideas** with different spelling. It\'s the language every web browser runs.\n\nPython\'s `print` is JavaScript\'s **`console.log`**:\n\n```javascript\nconsole.log("Hello, world!");  // a comment\n```\n\n- Statements usually end with a **semicolon** `;`\n- Comments start with **`//`** instead of `#`', 'Learning a second language is much faster than the first. Most of this course is "oh, it\'s like Python, but…"'),
    mcJ('What does this print?', ['Hi there', 'Hi + there', '"Hi there"'], 0, '+ joins strings, just like Python. The quotes aren\'t printed.', 'console.log("Hi" + " there");'),
    ex('Variables: let and const', 'JavaScript asks you to **declare** a variable the first time:\n\n```javascript\nlet score = 0;      // can change later\nscore = 5;\n\nconst name = "Pip"; // can never be reassigned\n```\n\nUse **`const`** by default, and **`let`** only when the value must change.\n\n(Older code uses `var`. Avoid it: it has confusing rules.)'),
    mcJ('Which line causes an error?', ['Line 1', 'Line 2', 'Neither'], 1, 'x was declared with const, so assigning to it again throws a TypeError.', 'const x = 1;\nx = 2;'),
    fillJ('Declare a variable whose value will change later.', '___ count = 0;', [['let']], 'let is for values that change. const would block count = count + 1 later.', ['let', 'const', 'def', 'int']),
    ex('Template literals', 'JavaScript\'s version of Python f-strings uses **backticks** `` ` `` and **`${ }`**:\n\n```javascript\nconst name = "Pip";\nconst age = 2;\nconsole.log(`${name} is ${age} years old`);\n// Pip is 2 years old\n```'),
    ansJ('What does this print?', ['3 cats'], '${n} is replaced by the value of n.', 'const n = 3;\nconsole.log(`${n} cats`);'),
    js({
      prompt: 'Make a `const` called `name` set to `"Pip"` and a `let` called `age` set to `2`. Then use a **template literal** to print exactly:\n\n```\nPip is 2\n```',
      expectedOutput: 'Pip is 2',
      tests: [
        { name: 'uses const and let', code: 'assert(__source__.includes("const") && __source__.includes("let"), "Declare name with const and age with let")' },
        { name: 'uses a template literal', code: 'assert(__source__.includes("`") && __source__.includes("${"), "Use backticks and ${...}")' },
      ],
      hints: ['const name = "Pip";\nlet age = 2;', 'console.log(`${name} is ${age}`);'],
      solution: 'const name = "Pip";\nlet age = 2;\nconsole.log(`${name} is ${age}`);\n',
    }),
  ],

  // ------------------------------------------------------------------ js-1-types
  'js-1-types': [
    ex('Types', 'JavaScript\'s main types:\n\n| Type | Example | Python |\n|---|---|---|\n| number | `42`, `3.5` | int **and** float |\n| string | `"hi"`, `\'hi\'` | str |\n| boolean | `true`, `false` | `True`, `False` |\n| null | `null` | `None` |\n| undefined | a variable with no value yet | (none) |\n\n`typeof` tells you the type: `typeof 42` is `"number"`.'),
    ansJ('What does this print?', ['number'], 'Whole numbers and decimals are both "number".', 'console.log(typeof 42);'),
    mc('Python has int and float. How many number types does JavaScript have for everyday use?', ['One: number', 'Three', 'None'], 0, 'One `number` type covers 7 and 7.5. (There\'s also BigInt for huge integers, but you\'ll rarely need it.)'),
    ex('=== vs ==', 'JavaScript has two equality checks:\n\n- **`===`** strict: same type **and** same value\n- `==` loose: converts types first, so `"5" == 5` is `true` 😬\n\n**Always use `===`** (and `!==` for "not equal"). Loose equality causes sneaky bugs.'),
    mcJ('What does this print?', ['true', 'false', 'an error'], 1, '"5" is a string and 5 is a number. Different types, so === says false.', 'console.log("5" === 5);'),
    mcJ('What does this print?', ['true', 'false'], 0, '== converts "5" to a number first, so it\'s true. That surprise is why we use ===.', 'console.log("5" == 5);'),
    ex('Operators', '- Math: `+ - * /`, `%` (remainder), `**` (power)\n- `7 / 2` is **3.5**. For whole-number division use `Math.floor(7 / 2)` → 3\n- Logic: **`&&`** (and), **`||`** (or), **`!`** (not)\n\n⚠️ `+` with a string glues text together: `"2" + 3` is `"23"`, not 5.'),
    ansJ('What does this print?', ['23'], 'One side is a string, so + joins them as text.', 'console.log("2" + 3);'),
    ansJ('What does this print?', ['3'], '7 / 2 = 3.5, and Math.floor rounds down to 3.', 'console.log(Math.floor(7 / 2));'),
    js({
      prompt: 'Using the two constants already there, print three lines:\n\n1. `a / b`\n2. `a / b` rounded **down** with `Math.floor`\n3. the remainder `a % b`',
      starter: 'const a = 7;\nconst b = 2;\n',
      expectedOutput: '3.5\n3\n1',
      hints: ['console.log(a / b);', 'console.log(Math.floor(a / b));\nconsole.log(a % b);'],
      solution: 'const a = 7;\nconst b = 2;\nconsole.log(a / b);\nconsole.log(Math.floor(a / b));\nconsole.log(a % b);\n',
    }),
  ],

  // ------------------------------------------------------------------ js-1-control
  'js-1-control': [
    ex('if, else if, else', 'Python uses indentation. JavaScript uses **parentheses** around the condition and **braces** `{ }` around the block:\n\n```javascript\nif (temp > 25) {\n  console.log("hot");\n} else if (temp > 10) {\n  console.log("mild");\n} else {\n  console.log("cold");\n}\n```\n\n`elif` is spelled **`else if`**.'),
    mcJ('What does this print?', ['hot', 'mild', 'cold'], 1, '15 is not > 20, but it is > 10.', 'const t = 15;\nif (t > 20) {\n  console.log("hot");\n} else if (t > 10) {\n  console.log("mild");\n} else {\n  console.log("cold");\n}'),
    ex('for loops', 'The classic `for` loop has three parts: **start; keep going while; step**:\n\n```javascript\nfor (let i = 0; i < 3; i++) {\n  console.log(i);   // 0, 1, 2\n}\n```\n\n`i++` means "add 1 to i".\n\nTo loop over the items of an array (like Python\'s `for x in items`), use **`for...of`**:\n\n```javascript\nfor (const fruit of ["apple", "pear"]) {\n  console.log(fruit);\n}\n```'),
    ansJ('What does this print?', ['10'], '1 + 2 + 3 + 4 = 10. The loop runs while i <= 4.', 'let total = 0;\nfor (let i = 1; i <= 4; i++) {\n  total += i;\n}\nconsole.log(total);'),
    ordT('Put the lines in order to print 0, 1 and 2.', ['for (let i = 0; i < 3; i++) {', '  console.log(i);', '}'], 'Open the loop, the body inside, then close the brace.'),
    ex('while', '`while` works like Python\'s:\n\n```javascript\nlet n = 3;\nwhile (n > 0) {\n  console.log(n);\n  n--;          // subtract 1\n}\n```\n\n`break` and `continue` work just like in Python.'),
    mcJ('How many times does this print "hi"?', ['2', '3', '5'], 1, 'n is 0, 2, 4 when it prints. Then n becomes 6 and the loop stops.', 'let n = 0;\nwhile (n < 5) {\n  console.log("hi");\n  n += 2;\n}'),
    js({
      prompt: 'Classic interview warm-up: **FizzBuzz**. For the numbers 1 to 15, print one line each:\n\n- `FizzBuzz` if the number is divisible by 3 **and** 5\n- `Fizz` if divisible by 3\n- `Buzz` if divisible by 5\n- otherwise the number itself',
      expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz',
      hints: ['for (let i = 1; i <= 15; i++) { … }', 'Check the "both" case first: if (i % 3 === 0 && i % 5 === 0) { console.log("FizzBuzz"); } else if …'],
      solution: 'for (let i = 1; i <= 15; i++) {\n  if (i % 3 === 0 && i % 5 === 0) {\n    console.log("FizzBuzz");\n  } else if (i % 3 === 0) {\n    console.log("Fizz");\n  } else if (i % 5 === 0) {\n    console.log("Buzz");\n  } else {\n    console.log(i);\n  }\n}\n',
    }),
  ],

  // ------------------------------------------------------------------ js-2-functions
  'js-2-functions': [
    ex('Functions', '```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nconsole.log(add(2, 3));  // 5\n```\n\nSame idea as Python\'s `def`, with braces. A function with no `return` gives back **`undefined`**.'),
    ansJ('What does this print?', ['8'], 'double(4) returns 4 × 2.', 'function double(n) {\n  return n * 2;\n}\nconsole.log(double(4));'),
    ex('Arrow functions', 'A shorter way to write a function, used everywhere in modern JavaScript:\n\n```javascript\nconst add = (a, b) => a + b;\nconst double = n => n * 2;        // one parameter: no ( ) needed\nconst greet = name => {\n  const msg = `Hi ${name}`;\n  return msg;                     // with { } you need return\n};\n```\n\nWithout braces, the value after `=>` is returned automatically.'),
    mcJ('Which is the same as `function square(x) { return x * x; }`?', ['const square = x => x * x;', 'const square = x => { x * x };', 'const square => x * x;'], 0, 'With braces you must write return. Option 2 returns undefined, and option 3 is a syntax error.'),
    ex('Defaults, and functions as values', 'Parameters can have **default values**:\n\n```javascript\nfunction greet(name = "friend") {\n  return `Hi, ${name}!`;\n}\n```\n\nFunctions are **values**: you can store them in variables and pass them to other functions. You\'ll use that constantly with arrays and events.'),
    ansJ('What does this print?', ['Hi, friend!'], 'No argument was given, so name uses its default.', 'function greet(name = "friend") {\n  return `Hi, ${name}!`;\n}\nconsole.log(greet());'),
    js({
      prompt: 'Write an **arrow function** `clamp(n, lo, hi)` that returns n, but never less than lo and never more than hi.\n\n```\nclamp(5, 0, 10)   → 5\nclamp(-3, 0, 10)  → 0\nclamp(99, 0, 10)  → 10\n```',
      starter: 'const clamp = (n, lo, hi) => {\n  // your code here\n};\n',
      tests: [
        { name: 'clamp(5, 0, 10) is 5', code: 'assert(clamp(5, 0, 10) === 5, `got ${clamp(5, 0, 10)}`)' },
        { name: 'clamp(-3, 0, 10) is 0', code: 'assert(clamp(-3, 0, 10) === 0, `got ${clamp(-3, 0, 10)}`)' },
        { name: 'clamp(99, 0, 10) is 10', code: 'assert(clamp(99, 0, 10) === 10, `got ${clamp(99, 0, 10)}`)' },
        { name: 'is an arrow function', code: 'assert(__source__.includes("=>"), "Write it with =>")' },
      ],
      hints: ['if (n < lo) return lo; if (n > hi) return hi; return n;', 'Or in one line: Math.min(Math.max(n, lo), hi)'],
      solution: 'const clamp = (n, lo, hi) => {\n  if (n < lo) return lo;\n  if (n > hi) return hi;\n  return n;\n};\n',
    }),
    js({
      prompt: 'Write `applyTwice(f, x)` that calls the function `f` on x, then calls f **again** on the result, and returns that.\n\n```\napplyTwice(n => n + 3, 1)      → 7\napplyTwice(s => s + "!", "hi") → "hi!!"\n```',
      starter: 'function applyTwice(f, x) {\n  // your code here\n}\n',
      tests: [
        { name: 'applyTwice(n => n + 3, 1) is 7', code: 'assert(applyTwice(n => n + 3, 1) === 7, `got ${applyTwice(n => n + 3, 1)}`)' },
        { name: 'applyTwice(s => s + "!", "hi") is "hi!!"', code: 'assert(applyTwice(s => s + "!", "hi") === "hi!!", `got ${applyTwice(s => s + "!", "hi")}`)' },
      ],
      hints: ['f(x) gives the first result. Call f on that.', 'return f(f(x));'],
      solution: 'function applyTwice(f, x) {\n  return f(f(x));\n}\n',
    }),
  ],

  // ------------------------------------------------------------------ js-2-arrays
  'js-2-arrays': [
    ex('Arrays', 'Arrays are JavaScript\'s lists:\n\n```javascript\nconst nums = [10, 20, 30];\nnums[0];            // 10\nnums.length;        // 3   (Python: len(nums))\nnums.push(40);      // add to the end (Python: append)\nnums.pop();         // remove the last one\nnums.includes(20);  // true  (Python: 20 in nums)\n```\n\nA `const` array can still change inside. `const` only stops you from pointing the name at a different array.'),
    ansJ('What does this print?', ['4'], 'push added a fourth item.', 'const a = [10, 20, 30];\na.push(40);\nconsole.log(a.length);'),
    ex('map and filter', 'Two methods you\'ll use every day. Both return a **new** array:\n\n```javascript\n[1, 2, 3].map(n => n * 2);         // [2, 4, 6]   transform each item\n[1, 2, 3, 4].filter(n => n > 2);   // [3, 4]      keep the matches\n```\n\nThey\'re like Python\'s list comprehensions: `[n * 2 for n in nums]`.'),
    ansJ('What does this print?', ['[2,4]', '[2, 4]'], 'filter keeps the even numbers. (This practice console shows arrays without spaces.)', 'console.log([1, 2, 3, 4].filter(n => n % 2 === 0));'),
    ex('reduce', '**`reduce`** combines all the items into **one** value:\n\n```javascript\nconst total = [5, 10, 15].reduce((sum, n) => sum + n, 0);  // 30\n```\n\nThe function gets the running result (`sum`) and the next item (`n`). The `0` at the end is the starting value.'),
    mcJ('What does this print?', ['6', '123', '0'], 0, 'Start at 1, then 1×1 = 1, 1×2 = 2, 2×3 = 6.', 'console.log([1, 2, 3].reduce((acc, n) => acc * n, 1));'),
    mc('Which array method gives you a new array with only SOME of the items?', ['map', 'filter', 'reduce'], 1, 'filter keeps items that pass a test. map keeps every item but changes it. reduce boils everything down to one value.'),
    js({
      prompt: 'Write `sumOfEvenSquares(nums)` that returns the sum of the **squares** of the **even** numbers. Chain `filter`, `map` and `reduce`.\n\n```\nsumOfEvenSquares([1, 2, 3, 4]) → 20   (4 + 16)\n```',
      starter: 'function sumOfEvenSquares(nums) {\n  // your code here\n}\n',
      tests: [
        { name: '[1, 2, 3, 4] → 20', code: 'assert(sumOfEvenSquares([1, 2, 3, 4]) === 20, `got ${sumOfEvenSquares([1, 2, 3, 4])}`)' },
        { name: '[] → 0', code: 'assert(sumOfEvenSquares([]) === 0, `got ${sumOfEvenSquares([])}`)' },
        { name: '[5] → 0', code: 'assert(sumOfEvenSquares([5]) === 0, `got ${sumOfEvenSquares([5])}`)' },
        { name: 'uses filter, map and reduce', code: 'assert(["filter", "map", "reduce"].every(m => __source__.includes(m)), "Use filter, map and reduce")' },
      ],
      hints: ['nums.filter(n => n % 2 === 0) keeps the evens.', 'return nums.filter(n => n % 2 === 0).map(n => n * n).reduce((sum, n) => sum + n, 0);'],
      solution: 'function sumOfEvenSquares(nums) {\n  return nums\n    .filter(n => n % 2 === 0)\n    .map(n => n * n)\n    .reduce((sum, n) => sum + n, 0);\n}\n',
    }),
  ],

  // ------------------------------------------------------------------ js-2-objects
  'js-2-objects': [
    ex('Objects', 'Objects hold **key: value** pairs, like Python dictionaries:\n\n```javascript\nconst pip = { name: "Pip", age: 2 };\n\npip.name;          // "Pip"   (dot notation)\npip["age"];        // 2       (bracket notation)\npip.color = "purple";  // add a new property\n```\n\nThe keys don\'t need quotes in JavaScript code.'),
    ansJ('What does this print?', ['4'], 'pet.legs reads the "legs" property.', 'const pet = { name: "Rex", legs: 4 };\nconsole.log(pet.legs);'),
    ex('Working with objects', '```javascript\nconst user = { name: "Ana", age: 30 };\n\nObject.keys(user);    // ["name", "age"]\n\nfor (const [key, value] of Object.entries(user)) {\n  console.log(key, value);\n}\n\nconst { name } = user;   // "destructuring": pulls out name\n```\n\nReal data is usually an **array of objects**: `[{ name: "Ana" }, { name: "Bo" }]`.'),
    ansJ('What does this print?', ['2'], 'Two keys: name and age.', 'const user = { name: "Ana", age: 30 };\nconsole.log(Object.keys(user).length);'),
    ex('JSON', '**JSON** (JavaScript Object Notation) is the text format the web uses to send data. It looks like JS objects, but keys must be in double quotes.\n\n```javascript\nconst text = JSON.stringify({ a: 1 });  // \'{"a":1}\'  object → text\nconst obj = JSON.parse(\'{"a":1}\');     // text → object\n```\n\nAlmost every web API sends and receives JSON.'),
    mcJ('What does this print?', ['{"a":1,"b":[2,3]}', '{a: 1, b: [2, 3]}', '[object Object]'], 0, 'JSON.stringify makes compact JSON text, with keys in double quotes.', 'console.log(JSON.stringify({ a: 1, b: [2, 3] }));'),
    mc('What does JSON.parse do?', ['Turns a JSON string into a JavaScript value', 'Turns an object into a string', 'Downloads a JSON file'], 0, 'parse = text → value. stringify = value → text.'),
    js({
      prompt: 'Write `oldest(people)` that takes an array of `{ name, age }` objects and returns the **name** of the oldest person.\n\n```\noldest([{ name: "Ana", age: 30 }, { name: "Bo", age: 45 }]) → "Bo"\n```',
      starter: 'function oldest(people) {\n  // your code here\n}\n',
      tests: [
        { name: 'finds Bo', code: 'const __r = oldest([{ name: "Ana", age: 30 }, { name: "Bo", age: 45 }, { name: "Cy", age: 20 }]);\nassert(__r === "Bo", `got ${__r}`)' },
        { name: 'works with one person', code: 'assert(oldest([{ name: "Solo", age: 9 }]) === "Solo")' },
        { name: 'oldest can be first', code: 'assert(oldest([{ name: "Max", age: 90 }, { name: "Kid", age: 5 }]) === "Max")' },
      ],
      hints: ['Keep track of the best person so far: let best = people[0];', 'for (const p of people) { if (p.age > best.age) best = p; } then return best.name;'],
      solution: 'function oldest(people) {\n  let best = people[0];\n  for (const p of people) {\n    if (p.age > best.age) best = p;\n  }\n  return best.name;\n}\n',
    }),
  ],

  // ------------------------------------------------------------------ js-3-dom
  'js-3-dom': [
    ex('The DOM', 'When a browser loads a web page, it turns the HTML into a tree of objects called the **DOM** (Document Object Model). JavaScript can find and change those objects, and the page updates instantly.\n\n```javascript\nconst title = document.querySelector("#title");\ntitle.textContent = "Welcome!";\n```\n\n`querySelector` takes a **CSS selector**: `#title` means "the element with id title".', 'This practice editor has no web page to change, so in this unit we\'ll write the logic as plain functions. That\'s what good front-end code looks like anyway.'),
    mcJ('Which line finds the element with id "score"?', ['document.querySelector("#score")', 'document.querySelector("score")', 'document.find(score)'], 0, '# means id in CSS selectors. "score" alone would look for a <score> tag.'),
    mcJ('What does `document.querySelector(".card")` find?', ['The element with id "card"', 'The first element with the class "card"', 'Every <card> tag'], 1, '. means class. querySelectorAll(".card") would find all of them.'),
    ex('Changing the page', '```javascript\nconst h = document.querySelector("h1");\nh.textContent = "New title";      // change text\nh.classList.add("highlight");      // add a CSS class\n\nconst li = document.createElement("li");  // make a new element\nli.textContent = "Milk";\ndocument.querySelector("ul").append(li);  // put it on the page\n```'),
    mcJ('After this runs, what does the h1 heading show?', ['Welcome!', 'h1', 'The old text followed by Welcome!'], 0, 'Setting textContent replaces the text completely.', 'const h = document.querySelector("h1");\nh.textContent = "Welcome!";'),
    ex('textContent vs innerHTML', '`el.innerHTML = "..."` treats the text as **HTML** and builds elements from it.\n\nThat\'s dangerous with anything a user typed. A comment like `<img src=x onerror="stealCookies()">` would **run code** on every visitor\'s screen. This attack is called **XSS** (cross-site scripting).\n\n✅ Use **`textContent`** for text. It never runs HTML.'),
    mc('Why should you never put user input into innerHTML?', ['It can let an attacker run code on the page (XSS)', 'It\'s slower to type', 'It only works in Chrome'], 0, 'Treat user input as text, never as HTML.'),
    js({
      prompt: 'Front-end code often turns data into HTML. Write `listHtml(items)` that returns a string like:\n\n```\nlistHtml(["Milk", "Eggs"]) → "<ul><li>Milk</li><li>Eggs</li></ul>"\n```\n\nUse `map` and `join("")`.',
      starter: 'function listHtml(items) {\n  // your code here\n}\n',
      tests: [
        { name: 'two items', code: 'const __r = listHtml(["Milk", "Eggs"]);\nassert(__r === "<ul><li>Milk</li><li>Eggs</li></ul>", `got ${__r}`)' },
        { name: 'empty list', code: 'assert(listHtml([]) === "<ul></ul>", `got ${listHtml([])}`)' },
      ],
      hints: ['items.map(item => `<li>${item}</li>`) makes an array of strings.', 'return "<ul>" + items.map(item => `<li>${item}</li>`).join("") + "</ul>";'],
      solution: 'function listHtml(items) {\n  return "<ul>" + items.map(item => `<li>${item}</li>`).join("") + "</ul>";\n}\n',
    }),
  ],

  // ------------------------------------------------------------------ js-3-events
  'js-3-events': [
    ex('Events', 'Pages react to people through **events**: clicks, typing, scrolling.\n\n```javascript\nconst btn = document.querySelector("#save");\n\nbtn.addEventListener("click", () => {\n  console.log("Saved!");\n});\n```\n\nThe function you pass is a **handler**. It doesn\'t run now; the browser calls it **later**, every time the event happens.'),
    mcJ('`handleClick` is a function. Which line correctly sets it up to run on each click?', ['btn.addEventListener("click", handleClick)', 'btn.addEventListener("click", handleClick())'], 0, 'Pass the function itself. With ( ), it runs once right now, and its result gets passed instead.'),
    ex('The event object', 'Handlers receive an **event object** with details:\n\n```javascript\ninput.addEventListener("keydown", (event) => {\n  console.log(event.key);     // "a", "Enter", "Backspace", …\n});\n\nform.addEventListener("submit", (event) => {\n  event.preventDefault();      // stop the page from reloading\n});\n```\n\n`event.target` is the element the event happened on.'),
    mc('A form reloads the whole page when submitted, but you want JavaScript to handle it. What do you call in the submit handler?', ['event.preventDefault()', 'event.stop()', 'return 0'], 0, 'preventDefault cancels the browser\'s built-in behavior.'),
    ex('Common events', '| Event | When it fires |\n|---|---|\n| `click` | an element is clicked or tapped |\n| `input` | the text in a box changes (every keystroke) |\n| `change` | a value is committed (e.g. a dropdown) |\n| `submit` | a form is sent |\n| `keydown` | a key is pressed |'),
    mc('Which event fires every time the text in an input box changes?', ['input', 'submit', 'load'], 0, '`input` fires on every change. `submit` is for forms.'),
    mcJ('The user presses the Enter key in a keydown handler. What is event.key?', ['"Enter"', '"\\n"', '"Return key"'], 0, 'Named keys use their names: "Enter", "Escape", "ArrowUp", "Backspace".'),
    js({
      prompt: 'Keep logic in plain functions so it\'s easy to test. Write `handleKey(event, text)` that returns the **new** text after a keypress:\n\n- `"Backspace"`: remove the last character\n- any single character (`event.key.length === 1`): add it to the end\n- anything else (like `"Shift"`): return the text unchanged\n\n`event` is an object like `{ key: "a" }`.',
      starter: 'function handleKey(event, text) {\n  // your code here\n}\n',
      tests: [
        { name: 'typing a letter adds it', code: 'assert(handleKey({ key: "a" }, "Pi") === "Pia", `got ${handleKey({ key: "a" }, "Pi")}`)' },
        { name: 'Backspace removes the last letter', code: 'assert(handleKey({ key: "Backspace" }, "Pip") === "Pi", `got ${handleKey({ key: "Backspace" }, "Pip")}`)' },
        { name: 'Shift changes nothing', code: 'assert(handleKey({ key: "Shift" }, "Pip") === "Pip", `got ${handleKey({ key: "Shift" }, "Pip")}`)' },
        { name: 'Backspace on empty text stays empty', code: 'assert(handleKey({ key: "Backspace" }, "") === "", `got ${handleKey({ key: "Backspace" }, "")}`)' },
      ],
      hints: ['if (event.key === "Backspace") return text.slice(0, -1);', 'if (event.key.length === 1) return text + event.key;  then return text;'],
      solution: 'function handleKey(event, text) {\n  if (event.key === "Backspace") return text.slice(0, -1);\n  if (event.key.length === 1) return text + event.key;\n  return text;\n}\n',
    }),
  ],

  // ------------------------------------------------------------------ js-4-callbacks
  'js-4-callbacks': [
    ex('Code that runs later', 'A **callback** is a function you hand to someone else to call later.\n\n```javascript\nsetTimeout(() => {\n  console.log("2 seconds later");\n}, 2000);   // milliseconds\n```\n\nYou\'ve already used callbacks: `map`, `filter` and event handlers all take one.'),
    mcJ('In what order are the letters printed?', ['A B C', 'A C B', 'B A C'], 1, 'setTimeout schedules B for later, even with 0 ms. The rest of the current code (C) finishes first.', 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nconsole.log("C");'),
    ex('The event loop', 'JavaScript runs **one thing at a time**. Timers, clicks and network replies wait in a **queue**. When the current code finishes, the **event loop** takes the next waiting task.\n\nThat\'s why a page stays responsive while waiting for a server. Nothing sits there blocking; the reply just joins the queue when it arrives.'),
    mc('Why not "wait" for 3 seconds with a loop that checks the clock?', ['It would freeze the whole page: nothing else can run', 'It\'s faster than setTimeout', 'There\'s no problem'], 0, 'While your loop spins, clicks, scrolling and drawing all stop.'),
    ex('Callback hell', 'When each step needs the previous one, callbacks nest deeper and deeper:\n\n```javascript\ngetUser(id, (user) => {\n  getOrders(user, (orders) => {\n    getDetails(orders[0], (details) => {\n      // …and error handling at every level 😵\n    });\n  });\n});\n```\n\nThis "pyramid" is hard to read. **Promises** (next lesson) fix it.'),
    mc('Older Node.js callbacks look like `(err, result) => { … }`. If `err` is not null, what does that mean?', ['Something went wrong', 'It worked', 'The result is ready'], 0, 'The error comes first so you can\'t forget to check it.'),
    js({
      prompt: 'Build your own version of `map` to see how callbacks work. Write `myMap(arr, fn)` that calls `fn` on each item and returns a new array of the results. **Don\'t** use `.map`.',
      starter: 'function myMap(arr, fn) {\n  // your code here\n}\n',
      tests: [
        same('myMap([1, 2, 3], n => n * 10)', '[10, 20, 30]'),
        same('myMap([], n => n)', '[]'),
        same('myMap(["a", "b"], s => s.toUpperCase())', '["A", "B"]'),
        { name: 'doesn\'t use .map', code: 'assert(!__source__.includes(".map("), "Write the loop yourself")' },
      ],
      hints: ['const result = []; then loop with for (const item of arr)', 'result.push(fn(item)); and return result at the end'],
      solution: 'function myMap(arr, fn) {\n  const result = [];\n  for (const item of arr) {\n    result.push(fn(item));\n  }\n  return result;\n}\n',
    }),
    js({
      prompt: 'Write `once(fn)` that returns a **new function**. The first time the new function is called, it calls `fn` and remembers the result. Every later call just returns that same result **without** calling fn again.\n\n(Handy for "only submit this form once".)',
      starter: 'function once(fn) {\n  // your code here\n}\n',
      tests: [
        { name: 'fn runs only once', code: 'let __count = 0;\nconst __f = once(() => { __count++; return "done"; });\n__f(); __f(); __f();\nassert(__count === 1, `fn ran ${__count} times`)' },
        { name: 'later calls return the first result', code: 'let __n = 0;\nconst __g = once(() => ++__n * 10);\nconst __a = __g();\nconst __b = __g();\nassert(__a === 10 && __b === 10, `got ${__a} and ${__b}`)' },
      ],
      hints: ['Inside once, keep two variables: let called = false; let result;', 'return () => { if (!called) { called = true; result = fn(); } return result; };'],
      solution: 'function once(fn) {\n  let called = false;\n  let result;\n  return () => {\n    if (!called) {\n      called = true;\n      result = fn();\n    }\n    return result;\n  };\n}\n',
    }),
  ],

  // ------------------------------------------------------------------ js-4-promises
  'js-4-promises': [
    ex('Promises', 'A **Promise** is an object standing in for a value that will arrive **later**. It\'s in one of three states:\n\n- **pending**: still waiting\n- **fulfilled**: the value arrived\n- **rejected**: something went wrong\n\n```javascript\ngetUser(7)\n  .then(user => console.log(user.name))\n  .catch(err => console.log("Failed:", err));\n```'),
    mc('What are the three states of a Promise?', ['pending, fulfilled, rejected', 'start, middle, end', 'true, false, null'], 0, 'Waiting → success or failure.'),
    ex('async and await', '`async`/`await` lets you write async code that reads top to bottom:\n\n```javascript\nasync function showUser() {\n  try {\n    const user = await getUser(7);    // wait here…\n    console.log(user.name);           // …then continue\n  } catch (err) {\n    console.log("Failed:", err);\n  }\n}\n```\n\n- `await` only works inside an **`async`** function.\n- Errors are caught with ordinary **try/catch**.'),
    mcJ('In what order are the numbers printed?', ['1 2 3', '1 3 2', '2 1 3'], 1, '.then callbacks always run after the current code finishes, even when the promise is already resolved.', 'console.log(1);\nPromise.resolve().then(() => console.log(2));\nconsole.log(3);'),
    mc('An async function always returns…', ['a Promise', 'a number', 'nothing'], 0, 'Even `async function f() { return 5; }` returns a Promise that fulfills with 5.'),
    ex('Waiting for several things', 'Run tasks **at the same time** and wait for all of them:\n\n```javascript\nconst [user, posts] = await Promise.all([\n  getUser(7),\n  getPosts(7),\n]);\n```\n\nThat\'s faster than awaiting them one after the other.'),
    fillJ('Complete the code so getUser waits for the response.', '___ function getUser() {\n  const res = ___ fetch("/user");\n  return res;\n}', [['async'], ['await']], 'The function must be async to use await inside it.', ['async', 'await', 'then', 'wait']),
    mc('What does `await` actually do?', ['Pauses this async function until the promise settles, while the rest of the page keeps running', 'Freezes the whole browser until the result arrives', 'Runs the code twice'], 0, 'Only that one function waits. The event loop keeps everything else going.'),
  ],

  // ------------------------------------------------------------------ js-4-fetch
  'js-4-fetch': [
    ex('Talking to servers', 'Web apps get data from **APIs**: a URL on a server that answers with data, usually JSON.\n\nEach request gets a **response** with:\n\n- a **status code**: did it work?\n- a **body**: the data\n\n**GET** requests read data. **POST** requests send new data.'),
    ex('Status codes', '| Code | Meaning |\n|---|---|\n| **200** | OK |\n| **201** | Created |\n| **400** | Bad request (your data was wrong) |\n| **401 / 403** | Not signed in / not allowed |\n| **404** | Not found |\n| **500** | The server broke |\n\nRule of thumb: **2xx** = success, **4xx** = your mistake, **5xx** = the server\'s mistake.'),
    mc('A request comes back with status 404. What happened?', ['The thing you asked for wasn\'t found', 'Everything worked', 'The server crashed'], 0, '404 = not found.'),
    ex('fetch', '```javascript\nasync function getWeather() {\n  const res = await fetch("/api/weather");\n  if (!res.ok) throw new Error(`HTTP ${res.status}`);\n  const data = await res.json();\n  console.log(data.temp);\n}\n```\n\n- `res.ok` is true for 2xx status codes.\n- **Two awaits**: one for the response to start arriving, one for the body to finish downloading and be parsed as JSON.'),
    ordT('Put the lines of this fetch code in order.', ['const res = await fetch("/api/weather");', 'if (!res.ok) throw new Error("Request failed");', 'const data = await res.json();', 'console.log(data.temp);'], 'Request → check the status → read the body → use the data.'),
    mc('Why does fetch code need two awaits?', ['fetch resolves when the response starts; res.json() waits for the whole body and parses it', 'It\'s a typo', 'To make it faster'], 0, 'The body can be large and arrive after the headers.'),
    mc('`fetch` does NOT reject (throw) for a 404 or 500 status. What should you check?', ['res.ok (or res.status)', 'Nothing: it always works', 'The URL length'], 0, 'fetch only rejects for network failures. Always check res.ok yourself.'),
    js({
      prompt: 'Write `describeStatus(code)` that returns:\n\n- `"ok"` for 200–299\n- `"client error"` for 400–499\n- `"server error"` for 500–599\n- `"other"` for anything else',
      starter: 'function describeStatus(code) {\n  // your code here\n}\n',
      tests: [
        { name: '200 → ok', code: 'assert(describeStatus(200) === "ok", `got ${describeStatus(200)}`)' },
        { name: '201 → ok', code: 'assert(describeStatus(201) === "ok")' },
        { name: '404 → client error', code: 'assert(describeStatus(404) === "client error", `got ${describeStatus(404)}`)' },
        { name: '500 → server error', code: 'assert(describeStatus(500) === "server error", `got ${describeStatus(500)}`)' },
        { name: '301 → other', code: 'assert(describeStatus(301) === "other", `got ${describeStatus(301)}`)' },
      ],
      hints: ['if (code >= 200 && code <= 299) return "ok";', 'Do the same for 400–499 and 500–599, then return "other".'],
      solution: 'function describeStatus(code) {\n  if (code >= 200 && code <= 299) return "ok";\n  if (code >= 400 && code <= 499) return "client error";\n  if (code >= 500 && code <= 599) return "server error";\n  return "other";\n}\n',
    }),
  ],

  // ------------------------------------------------------------------ js-5-types
  'js-5-types': [
    ex('JavaScript with types', '**TypeScript** is JavaScript plus **type annotations**. A checker reads your code **before it runs** and flags mistakes. Then it\'s converted to plain JavaScript.\n\n```typescript\nlet age: number = 30;\n\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n\nadd(2, "3");   // ❌ flagged in your editor: "3" is not a number\n```', 'Most professional JavaScript today is written in TypeScript. (Loopwise itself is!)'),
    mcT('Which line does TypeScript flag as an error?', ['Line 1', 'Line 2', 'Neither'], 1, 'count was declared as a number, so assigning a string is a type error.', 'let count: number = 5;\ncount = "five";'),
    ex('Everyday types', '- `number`, `string`, `boolean`\n- Arrays: `number[]` (an array of numbers)\n- **Unions**: `string | null` (a string **or** null)\n- `any` turns checking off. Avoid it.\n\nTypeScript can often **infer** the type: in `let x = 5`, x is automatically a number.'),
    mcT('What type does TypeScript infer for `names`?', ['string[]', 'string', 'any'], 0, 'An array of strings.', 'const names = ["Ana", "Bo"];'),
    mc('When does TypeScript find type errors?', ['Before the code runs: in your editor or when compiling', 'Only after the app crashes in the browser', 'Never'], 0, 'That\'s the whole point: catch bugs early.'),
    fillT('Add types: text is a string, and the function returns its length.', 'function count(text: ___): ___ {\n  return text.length;\n}', [['string'], ['number']], 'The parameter is a string, and .length is a number.', ['string', 'number', 'boolean', 'void']),
    mc('What does the type `string | null` mean?', ['Either a string or null', 'A string and null at the same time', 'A list of strings'], 0, '| means "or".'),
    mc('Do type annotations change what the code does when it runs?', ['No: they\'re removed when TypeScript is converted to JavaScript', 'Yes: they make it run faster', 'Yes: they add extra checks at runtime'], 0, 'Types exist only at "compile time" to help you. The browser runs plain JavaScript.'),
  ],

  // ------------------------------------------------------------------ js-5-interfaces
  'js-5-interfaces': [
    ex('Describing shapes', 'An **interface** describes what an object must look like:\n\n```typescript\ninterface User {\n  name: string;\n  age: number;\n  email?: string;   // ? = optional\n}\n\nconst ana: User = { name: "Ana", age: 30 };   // ✅\n```\n\nNow every function that takes a `User` knows exactly which properties exist.'),
    mcT('Which value matches this interface?', ['{ name: "Ana", age: 30 }', '{ name: "Ana" }', '{ name: 30, age: "Ana" }'], 0, 'Option 2 is missing age. Option 3 has the types swapped.', 'interface User {\n  name: string;\n  age: number;\n}'),
    mc('In an interface, what does `email?: string` mean?', ['email is optional (but must be a string if present)', 'email must contain a question mark', 'email can be any type'], 0, 'The ? makes a property optional.'),
    ex('Type aliases and literal types', 'A `type` gives a name to any type, including a fixed list of allowed values:\n\n```typescript\ntype Status = "idle" | "loading" | "done";\n\nlet s: Status = "loading";   // ✅\n```\n\nTypos like `"lodaing"` get caught instantly.'),
    mcT('Is this allowed?', ['Yes', 'No: "error" isn\'t one of the allowed values'], 1, 'Status only allows "idle", "loading" or "done".', 'type Status = "idle" | "loading" | "done";\nlet s: Status = "error";'),
    ex('Generics', 'A **generic** is a type placeholder, usually called `T`. It lets one function work with many types **without** losing track of which one:\n\n```typescript\nfunction first<T>(items: T[]): T {\n  return items[0];\n}\n\nfirst([1, 2, 3]);      // TypeScript knows this is a number\nfirst(["a", "b"]);     // …and this is a string\n```\n\nYou\'ve seen generics already: `number[]` can also be written `Array<number>`.'),
    mcT('What type does `first(["a", "b"])` return?', ['string', 'T', 'any'], 0, 'T is filled in as string from the argument.', 'function first<T>(items: T[]): T {\n  return items[0];\n}'),
    mc('Why use a generic instead of `any`?', ['It keeps the real type, so mistakes are still caught', 'It runs faster', 'It\'s shorter to type'], 0, 'any throws type information away; T carries it through.'),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'js-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      mcJ('Which prints text in JavaScript?', ['console.log("hi")', 'print("hi")', 'echo "hi"'], 0, 'console.log.'),
      mc('You need a variable that will never be reassigned. Use…', ['const', 'let', 'var'], 0, 'const.'),
      ansJ('What does this print?', ['5 apples'], 'Template literal.', 'const n = 5;\nconsole.log(`${n} apples`);'),
      ansJ('What does this print?', ['false'], 'Different types.', 'console.log(1 === "1");'),
      ansJ('What does this print?', ['12'], '"1" + 2 is the string "12".', 'console.log("1" + 2);'),
      ansJ('What does this print?', ['string'], 'Quotes make a string.', 'console.log(typeof "42");'),
      ansJ('What does this print?', ['6'], '0 + 1 + 2 + 3.', 'let t = 0;\nfor (let i = 0; i < 4; i++) {\n  t += i;\n}\nconsole.log(t);'),
      js({ prompt: 'Print the numbers 5, 4, 3, 2, 1 (one per line) using a loop.', expectedOutput: '5\n4\n3\n2\n1', tests: [{ name: 'uses a loop', code: 'assert(__source__.includes("for") || __source__.includes("while"), "Use a loop")' }], solution: 'for (let i = 5; i >= 1; i--) {\n  console.log(i);\n}\n' }),
    ],
  },
  'js-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mcJ('Which arrow function returns n + 1?', ['n => n + 1', 'n => { n + 1 }', '(n) -> n + 1'], 0, 'No braces = automatic return.'),
      ansJ('What does this print?', ['[2,4,6]', '[2, 4, 6]'], 'map doubles each item.', 'console.log([1, 2, 3].map(n => n * 2));'),
      ansJ('What does this print?', ['10'], '1 + 2 + 3 + 4.', 'console.log([1, 2, 3, 4].reduce((a, b) => a + b, 0));'),
      ansJ('What does this print?', ['2'], 'Only 3 and 4 are greater than 2.', 'console.log([1, 2, 3, 4].filter(n => n > 2).length);'),
      ansJ('What does this print?', ['Pip'], 'Dot notation.', 'const bot = { name: "Pip", color: "purple" };\nconsole.log(bot.name);'),
      mc('JSON.stringify turns…', ['a value into JSON text', 'JSON text into a value'], 0, 'stringify = to text.'),
      ansJ('What does this print?', ['undefined'], 'No return statement.', 'function f() {\n  const x = 1;\n}\nconsole.log(f());'),
      js({ prompt: 'Write `names(people)` that returns an array of just the names from an array of `{ name }` objects. Use map.', starter: 'function names(people) {\n  // your code here\n}\n', tests: [same('names([{ name: "Ana" }, { name: "Bo" }])', '["Ana", "Bo"]'), same('names([])', '[]')], solution: 'function names(people) {\n  return people.map(p => p.name);\n}\n' }),
    ],
  },
  'js-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      mcJ('Which selector finds the element with id "menu"?', ['"#menu"', '".menu"', '"menu"'], 0, '# = id.'),
      mcJ('Which selector finds elements with class "btn"?', ['".btn"', '"#btn"', '"btn"'], 0, '. = class.'),
      mc('Safest way to show text a user typed?', ['textContent', 'innerHTML'], 0, 'innerHTML can run code (XSS).'),
      mcJ('Which runs `save` on every click?', ['btn.addEventListener("click", save)', 'btn.addEventListener("click", save())'], 0, 'Pass the function, don\'t call it.'),
      mc('event.preventDefault() in a submit handler…', ['stops the page from reloading', 'deletes the form'], 0, 'Cancels the default behavior.'),
      mc('Which event fires on every keystroke in a text box?', ['input', 'submit', 'click'], 0, 'input.'),
      js({ prompt: 'Write `toggle(classes, name)`: given an array of class names, return a NEW array with `name` removed if present, or added at the end if not.', starter: 'function toggle(classes, name) {\n  // your code here\n}\n', tests: [same('toggle(["a", "on"], "on")', '["a"]'), same('toggle(["a"], "on")', '["a", "on"]'), same('toggle([], "x")', '["x"]')], hints: ['classes.includes(name) tells you if it\'s there.', 'filter to remove; [...classes, name] to add.'], solution: 'function toggle(classes, name) {\n  if (classes.includes(name)) return classes.filter(c => c !== name);\n  return [...classes, name];\n}\n' }),
    ],
  },
  'js-4': {
    passScore: 0.8, hearts: 3,
    questions: [
      mcJ('In what order are the letters printed?', ['X Y Z', 'X Z Y', 'Y X Z'], 1, 'The timer callback runs after the current code.', 'console.log("X");\nsetTimeout(() => console.log("Y"), 0);\nconsole.log("Z");'),
      mc('A Promise that failed is…', ['rejected', 'fulfilled', 'pending'], 0, 'Rejected.'),
      mc('`await` can be used…', ['inside async functions (and module top level)', 'anywhere at all'], 0, 'It needs an async function.'),
      mc('Status 500 means…', ['the server had an error', 'success', 'not found'], 0, '5xx = server.'),
      mc('Status 201 means…', ['created successfully', 'forbidden', 'bad request'], 0, '2xx = success.'),
      mc('Does fetch throw for a 404?', ['No: check res.ok yourself', 'Yes, always'], 0, 'Only network failures reject.'),
      mc('To run two requests at the same time and wait for both, use…', ['Promise.all', 'two setTimeouts', 'a while loop'], 0, 'Promise.all.'),
      js({ prompt: 'Write `callLater(fn, args)`: return a function that, when called, calls `fn(...args)` and returns its result. (Store the arguments now, use them later.)', starter: 'function callLater(fn, args) {\n  // your code here\n}\n', tests: [{ name: 'returns a function that adds', code: 'const __f = callLater((a, b) => a + b, [2, 3]);\nassert(typeof __f === "function" && __f() === 5, "callLater((a, b) => a + b, [2, 3])() should be 5")' }], hints: ['return () => fn(...args);'], solution: 'function callLater(fn, args) {\n  return () => fn(...args);\n}\n' }),
    ],
  },
  'js-5': {
    passScore: 0.8, hearts: 3,
    questions: [
      mcT('Which line is a type error?', ['Line 1', 'Line 2'], 1, 'name is a string.', 'let name: string = "Pip";\nname = 42;'),
      mc('TypeScript checks types…', ['before the code runs', 'only while it runs'], 0, 'At compile time / in the editor.'),
      mc('`number[]` means…', ['an array of numbers', 'one number', 'a number or null'], 0, 'Array of numbers.'),
      mc('`age?: number` in an interface means age is…', ['optional', 'required', 'a question'], 0, 'Optional.'),
      mcT('Allowed?', ['Yes', 'No'], 1, '"big" is not in the union.', 'type Size = "s" | "m" | "l";\nconst x: Size = "big";'),
      mc('Generics (like `<T>`) are better than `any` because they…', ['keep the real type information', 'run faster'], 0, 'Types are preserved.'),
      fillT('Type the parameter and return value.', 'function isLong(text: ___): ___ {\n  return text.length > 10;\n}', [['string'], ['boolean']], 'Text in, true/false out.', ['number', 'string', 'boolean']),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  javascript: {
    passScore: 0.8, hearts: 3,
    questions: [
      ansJ('What does this print?', ['false'], 'Strict equality checks the type.', 'console.log(0 === "0");'),
      ansJ('What does this print?', ['Hi Ana'], 'Template literal.', 'const who = "Ana";\nconsole.log(`Hi ${who}`);'),
      ansJ('What does this print?', ['15'], '3 × 5.', 'const mul = (a, b) => a * b;\nconsole.log(mul(3, 5));'),
      ansJ('What does this print?', ['[3,4]', '[3, 4]'], 'filter keeps items > 2.', 'console.log([1, 2, 3, 4].filter(n => n > 2));'),
      ansJ('What does this print?', ['30'], '10 + 20.', 'console.log([10, 20].reduce((s, n) => s + n, 0));'),
      mc('The safe way to put user text on a page is…', ['textContent', 'innerHTML', 'eval'], 0, 'Avoid XSS.'),
      mcJ('In what order are the numbers printed?', ['1 2 3', '1 3 2', '3 2 1'], 1, 'Promise callbacks run after the current code.', 'console.log(1);\nPromise.resolve().then(() => console.log(2));\nconsole.log(3);'),
      mc('Status 403 means…', ['not allowed', 'OK', 'server error'], 0, '4xx = client side; 403 = forbidden.'),
      mc('TypeScript interfaces describe…', ['the shape of objects', 'how fast code runs', 'CSS styles'], 0, 'Shapes.'),
      js({ prompt: 'Write `countBy(words)`: return an object mapping each word to how many times it appears.\n\n```\ncountBy(["a", "b", "a"]) → { a: 2, b: 1 }\n```', starter: 'function countBy(words) {\n  // your code here\n}\n', tests: [same('countBy(["a", "b", "a"])', '{ a: 2, b: 1 }'), same('countBy([])', '{}')], hints: ['const counts = {}; for (const w of words) counts[w] = (counts[w] || 0) + 1;'], solution: 'function countBy(words) {\n  const counts = {};\n  for (const w of words) {\n    counts[w] = (counts[w] || 0) + 1;\n  }\n  return counts;\n}\n' }),
    ],
  },
};
