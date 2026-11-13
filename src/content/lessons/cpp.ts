/**
 * Track: cpp — "C++"
 * Written here: cp-1 (essentials), cp-2 (modern C++) + checkpoints + course final exam.
 *
 * C++ can't run in the browser yet, so this is explain + quiz with C++ to READ, plus Python exercises for the
 * shared ideas. Every C++ "What does this print?" snippet was compiled with clang++ -std=c++20 and run before
 * publishing (snippets without main() are wrapped in `int main() { … }` with the common standard headers).
 */
import type { AnswerStep, Checkpoint, ChoiceStep, Step } from '../types';
import { ans, eq, ex, mc, py } from './_helpers';

const mcX = (prompt: string, choices: string[], answer: number, explanation: string, code?: string): ChoiceStep => ({
  ...mc(prompt, choices, answer, explanation), ...(code ? { code, language: 'cpp' as const } : {}),
});
const ansX = (prompt: string, accept: string[], explanation: string, code?: string): AnswerStep => ({
  ...ans(prompt, accept, explanation), ...(code ? { code, language: 'cpp' as const } : {}),
});

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ cp-1-hello
  'cp-1-hello': [
    ex('C with superpowers', '**C++** adds classes, generic code and a huge standard library to C, while staying just as fast. Games, browsers, databases and trading systems are often written in C++.\n\n```cpp\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, C++!" << std::endl;\n    return 0;\n}\n```\n\n- `std::cout << …` prints (the `<<` arrows push text out)\n- `std::` is a **namespace**: a family name that avoids clashes', 'C++ can\'t run in this practice editor yet. You\'ll read C++ and practice the ideas in Python.'),
    ansX('What does this print?', ['5 + 3 = 8'], 'Each << adds the next piece; the last one is the computed number 8.', 'std::cout << "5 + 3 = " << 5 + 3 << std::endl;'),
    mc('What is `std` in `std::cout`?', ['A namespace: the standard library\'s family name', 'A type of variable', 'A file name'], 0, 'Namespaces keep names from different libraries apart.'),
    ex('References', 'A **reference** is another name for an existing variable, marked with `&`:\n\n```cpp\nvoid bump(int &x) {   // x IS the caller\'s variable\n    x = x + 1;\n}\n\nint n = 5;\nbump(n);              // n is now 6, no pointer syntax needed\n```\n\nReferences do what C needed pointers for, more safely: they can\'t be null.'),
    ansX('What does this print?', ['6'], 'x is a reference to n, so bump changes n itself.', 'void bump(int &x) {\n    x = x + 1;\n}\n\nint main() {\n    int n = 5;\n    bump(n);\n    std::cout << n << std::endl;\n    return 0;\n}'),
    mcX('Without the `&`, what would that program print?', ['5', '6'], 0, 'Then x would be a copy, just like in C.', 'void bump(int x) { x = x + 1; }'),
    ex('const references', 'Passing a big object by value copies it, which is slow. Passing `const std::string &s` gives the function **read-only access** without copying.\n\nYou\'ll see `const T &` everywhere in real C++ code.'),
    mc('Why write `void print(const std::string &s)` instead of `void print(std::string s)`?', ['No copy is made, and the function promises not to change s', 'It runs on more computers', 'Strings must always be const'], 0, 'Fast and safe.'),
  ],

  // ------------------------------------------------------------------ cp-1-classes
  'cp-1-classes': [
    ex('Classes', '```cpp\nclass Counter {\npublic:\n    Counter(int start) : count(start) {}   // constructor\n    void add() { count++; }\n    int get() const { return count; }       // const: doesn\'t change the object\nprivate:\n    int count;\n};\n\nCounter c(10);\nc.add();\n```\n\nLike Java: `public`/`private`, constructors and methods. The `: count(start)` part is an **initializer list**.'),
    ansX('What does this print?', ['12'], 'Starts at 10, then add() twice.', 'class Counter {\npublic:\n    Counter(int start) : count(start) {}\n    void add() { count++; }\n    int get() const { return count; }\nprivate:\n    int count;\n};\n\nint main() {\n    Counter c(10);\n    c.add();\n    c.add();\n    std::cout << c.get() << std::endl;\n    return 0;\n}'),
    ex('Destructors and RAII', 'A **destructor** (`~ClassName`) runs **automatically** when an object goes out of scope.\n\n**RAII** ("Resource Acquisition Is Initialization") is C++\'s big idea: grab a resource (memory, a file, a lock) in the constructor, release it in the destructor. Cleanup can never be forgotten, even when an error happens.'),
    ansX('What does this print? (Write the two words in order, separated by a space.)', ['open close'], 'The constructor runs at creation; the destructor runs automatically when f goes out of scope at the closing brace.', 'struct File {\n    File() { std::cout << "open "; }\n    ~File() { std::cout << "close" << std::endl; }\n};\n\nint main() {\n    {\n        File f;\n    }\n    return 0;\n}'),
    mc('When does a C++ destructor run for a local object?', ['Automatically, when the object goes out of scope', 'Only when you call delete', 'Never'], 0, 'At the closing brace of its block.'),
    mc('RAII solves which C problem?', ['Forgetting to free or close resources', 'Slow compiling', 'Integer overflow'], 0, 'The destructor always cleans up.'),
    py({
      prompt: 'Python\'s version of RAII is the `with` statement. Write a class `Resource` that appends `"open"` to a shared list `log` in `__enter__` and `"close"` in `__exit__`, so it **always** closes, even if an error happens inside the `with` block.',
      starter: 'log = []\n\n\nclass Resource:\n    pass\n',
      tests: [
        { name: 'opens and closes', code: 'log.clear()\nwith Resource():\n    log.append("work")\nassert log == ["open", "work", "close"], f"got {log}"' },
        { name: 'closes even on error', code: 'log.clear()\ntry:\n    with Resource():\n        raise RuntimeError("boom")\nexcept RuntimeError:\n    pass\nassert log == ["open", "close"], f"got {log}"' },
      ],
      hints: ['def __enter__(self):\n    log.append("open")\n    return self', 'def __exit__(self, exc_type, exc, tb):\n    log.append("close")\n    return False   # don\'t hide errors'],
      solution: 'log = []\n\n\nclass Resource:\n    def __enter__(self):\n        log.append("open")\n        return self\n\n    def __exit__(self, exc_type, exc, tb):\n        log.append("close")\n        return False\n',
    }),
  ],

  // ------------------------------------------------------------------ cp-1-stl
  'cp-1-stl': [
    ex('The Standard Template Library', 'The **STL** gives you ready-made, fast data structures:\n\n```cpp\n#include <vector>\n#include <map>\n\nstd::vector<int> nums = {3, 1, 4};   // growable array (like a Python list)\nnums.push_back(1);\nnums.size();                          // 4\n\nstd::map<std::string, int> ages;      // sorted key → value\nages["Ana"] = 30;\n```'),
    ansX('What does this print?', ['4'], 'Three starting values plus one push_back.', 'std::vector<int> nums = {3, 1, 4};\nnums.push_back(1);\nstd::cout << nums.size() << std::endl;'),
    ex('Algorithms', '`<algorithm>` works on any container through **iterators** (positions):\n\n```cpp\nstd::sort(nums.begin(), nums.end());\nauto it = std::find(nums.begin(), nums.end(), 4);\nint total = std::accumulate(nums.begin(), nums.end(), 0);   // <numeric>\n```\n\n`auto` lets the compiler figure out the type.'),
    ansX('What does this print?', ['1 3 4'], 'sort orders the vector, then the loop prints each value with a space after it.', 'std::vector<int> v = {4, 1, 3};\nstd::sort(v.begin(), v.end());\nfor (int x : v) std::cout << x << " ";\nstd::cout << std::endl;'),
    mc('Which STL container is most like a Python list?', ['std::vector', 'std::map', 'std::set'], 0, 'A growable array.'),
    mc('`std::map` keeps its keys…', ['sorted', 'in insertion order', 'in random order'], 0, 'For hash-based (unordered, usually faster) use std::unordered_map.'),
    ansX('What does this print?', ['8'], 'accumulate adds everything to the starting value 0: 4 + 1 + 3.', 'std::vector<int> v = {4, 1, 3};\nstd::cout << std::accumulate(v.begin(), v.end(), 0) << std::endl;'),
  ],

  // ------------------------------------------------------------------ cp-2-templates
  'cp-2-templates': [
    ex('Generic code', 'A **template** writes one function or class for many types:\n\n```cpp\ntemplate <typename T>\nT biggest(T a, T b) {\n    return a > b ? a : b;\n}\n\nbiggest(3, 7);         // T = int\nbiggest(2.5, 1.5);     // T = double\n```\n\nThe compiler generates a separate, fully optimized version for each type you use. That\'s how `std::vector<int>` and `std::vector<std::string>` both exist.'),
    ansX('What does this print?', ['7'], 'T becomes int; 7 is bigger.', 'template <typename T>\nT biggest(T a, T b) {\n    return a > b ? a : b;\n}\n\nint main() {\n    std::cout << biggest(3, 7) << std::endl;\n    return 0;\n}'),
    mc('How do C++ templates differ from Java generics?', ['C++ generates separate code for each type at compile time', 'They are exactly the same', 'Templates only work with int'], 0, 'Fast, but it can make programs bigger and error messages long.'),
    mc('`a > b ? a : b` means…', ['if a > b then a, otherwise b', 'a and b compared twice', 'a or b at random'], 0, 'The ternary operator, like Python\'s `a if a > b else b`.'),
    ex('Concepts (C++20)', 'Templates accept any type, and mistakes produce famously long error messages. **C++20 concepts** state the requirements up front:\n\n```cpp\ntemplate <std::integral T>\nT twice(T x) { return x * 2; }\n```\n\nNow passing a string gives one clear error.'),
    py({
      prompt: 'Python is "generic" automatically: one function works for any type that supports the operations. Write `biggest(items)` that returns the largest item of a non-empty list **without** using `max`. It should work for numbers and strings alike.',
      starter: 'def biggest(items):\n    pass\n',
      tests: [eq('biggest([3, 7, 2])', '7'), eq('biggest(["pear", "apple", "zoo"])', '"zoo"'), eq('biggest([2.5])', '2.5'), { name: 'no max()', code: 'assert "max(" not in __source__, "Write the loop yourself"' }],
      hints: ['best = items[0], then loop and keep any item that is bigger.'],
      solution: 'def biggest(items):\n    best = items[0]\n    for x in items:\n        if x > best:\n            best = x\n    return best\n',
    }),
  ],

  // ------------------------------------------------------------------ cp-2-smart-pointers
  'cp-2-smart-pointers': [
    ex('No more manual delete', 'Raw `new`/`delete` causes the same leaks and double-frees as C\'s malloc/free. **Smart pointers** use RAII to free memory automatically:\n\n```cpp\n#include <memory>\n\nauto p = std::make_unique<Dog>("Rex");    // one owner\nauto q = std::make_shared<Dog>("Bo");     // shared, reference-counted\n```\n\n- **`unique_ptr`**: exactly one owner. Freed when the owner goes away.\n- **`shared_ptr`**: many owners. Freed when the **last** one goes away.'),
    mc('Which smart pointer has exactly one owner?', ['unique_ptr', 'shared_ptr', 'weak_ptr'], 0, 'It can be moved to a new owner, but never copied.'),
    ansX('What does this print?', ['2'], 'Two shared_ptrs (a and b) own the same object.', 'auto a = std::make_shared<int>(42);\nauto b = a;\nstd::cout << a.use_count() << std::endl;'),
    mc('When is the object behind a shared_ptr freed?', ['When the last shared_ptr to it is destroyed', 'Immediately', 'Never'], 0, 'Reference counting.'),
    ex('Cycles and weak_ptr', 'Two objects holding `shared_ptr`s to **each other** keep both counts above zero forever: a leak. A **`weak_ptr`** points without owning, breaking the cycle (a parent owns its children; children only weakly point back).'),
    mc('Parent and child hold shared_ptrs to each other. What happens?', ['They are never freed (a cycle leak)', 'Both are freed immediately', 'It doesn\'t compile'], 0, 'Use weak_ptr for the back-reference.'),
    mc('In modern C++, how often should you write raw `delete`?', ['Almost never: use smart pointers and containers', 'After every new', 'Only in destructors'], 0, 'Let RAII do it.'),
  ],

  // ------------------------------------------------------------------ cp-2-move
  'cp-2-move': [
    ex('Copying is expensive', 'Copying a `std::vector` with a million items copies a million items. But often the original is about to be thrown away anyway. Why not just **steal** its memory?\n\nThat\'s **move semantics**: transfer the guts of an object instead of copying them.\n\n```cpp\nstd::vector<int> a(1000000, 7);\nstd::vector<int> b = std::move(a);   // b takes a\'s memory; a is left empty\n```'),
    mc('What does `std::move(a)` signal?', ['a may be "emptied out": its contents can be taken instead of copied', 'Copy a twice', 'Delete a immediately'], 0, 'After moving, use a only to assign it something new.'),
    ansX('What does this print?', ['0 3'], 'b took a\'s contents, leaving a empty (size 0) and b with 3 items.', 'std::vector<int> a = {1, 2, 3};\nstd::vector<int> b = std::move(a);\nstd::cout << a.size() << " " << b.size() << std::endl;'),
    ex('rvalues', 'A temporary value like `make_big_vector()` or `x + y` is an **rvalue**: it has no name and is about to vanish. C++ automatically **moves** from rvalues. `std::move` turns a named variable into an rvalue.\n\nReturning a big object from a function is cheap in modern C++ for exactly this reason.'),
    mc('Why is returning a large vector from a function cheap in modern C++?', ['It\'s moved (or the copy is skipped), not copied', 'Vectors are always small', 'The compiler deletes it'], 0, 'Move semantics plus "copy elision".'),
    mc('Why can a unique_ptr be moved but not copied?', ['Copying would create two owners, breaking "unique"', 'It\'s too big to copy', 'Moving is slower'], 0, 'Moving transfers the single ownership.'),
    py({
      prompt: 'Simulate a move. Write `move_items(src)` that returns a **new list** holding everything from `src`, and leaves `src` **empty** (like a moved-from vector). Reuse the items; don\'t copy them one by one.',
      starter: 'def move_items(src):\n    pass\n',
      tests: [{ name: 'takes everything and empties the source', code: 'a = [1, 2, 3]\nb = move_items(a)\nassert b == [1, 2, 3] and a == [], f"got b={b}, a={a}"' }, { name: 'returns a different list object', code: 'a = [9]\nb = move_items(a)\nassert b is not a' }],
      hints: ['moved = src[:]  (a new list holding the same items)', 'Then src.clear() and return moved.'],
      solution: 'def move_items(src):\n    moved = src[:]\n    src.clear()\n    return moved\n',
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'cp-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      ansX('What does this print?', ['10'], '2 × 5.', 'std::cout << 2 * 5 << std::endl;'),
      mc('`int &r = x;` makes r…', ['another name for x', 'a copy of x', 'a pointer to x'], 0, 'A reference.'),
      mc('A destructor\'s name starts with…', ['~', '#', '!'], 0, '~ClassName.'),
      mc('RAII ties resource cleanup to…', ['an object\'s lifetime', 'a timer'], 0, 'Destructors.'),
      mc('std::vector is like Python\'s…', ['list', 'dict'], 0, 'Growable array.'),
      ansX('What does this print?', ['3'], 'Three items.', 'std::vector<std::string> v = {"a", "b", "c"};\nstd::cout << v.size() << std::endl;'),
    ],
  },
  'cp-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Templates generate code for each type…', ['at compile time', 'at run time'], 0, 'Compile time.'),
      ansX('What does this print?', ['2.5'], 'T = double.', 'template <typename T>\nT biggest(T a, T b) { return a > b ? a : b; }\n\nint main() {\n    std::cout << biggest(2.5, 1.5) << std::endl;\n    return 0;\n}'),
      mc('Many owners, freed by the last one:', ['shared_ptr', 'unique_ptr'], 0, 'Reference counted.'),
      mc('Breaking a shared_ptr cycle uses…', ['weak_ptr', 'delete'], 0, 'Non-owning.'),
      mc('std::move lets an object\'s contents be…', ['taken instead of copied', 'duplicated'], 0, 'Moved.'),
      mc('A temporary value with no name is an…', ['rvalue', 'lvalue'], 0, 'rvalue.'),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  cpp: {
    passScore: 0.8, hearts: 3,
    questions: [
      ansX('What does this print?', ['Hi 3'], 'Mixing text and numbers with <<.', 'std::cout << "Hi " << 1 + 2 << std::endl;'),
      mc('Passing `const std::string &` avoids…', ['copying the string', 'reading the string'], 0, 'No copy.'),
      mc('C++\'s answer to forgotten cleanup is…', ['RAII', 'garbage collection'], 0, 'Destructors.'),
      ansX('What does this print?', ['9'], '2 + 3 + 4.', 'std::vector<int> v = {2, 3, 4};\nstd::cout << std::accumulate(v.begin(), v.end(), 0) << std::endl;'),
      mc('std::map keeps keys…', ['sorted', 'unsorted'], 0, 'Sorted.'),
      mc('A function template is written with…', ['template <typename T>', 'generic<T>'], 0, 'template.'),
      mc('unique_ptr can be…', ['moved, not copied', 'copied, not moved'], 0, 'Single owner.'),
      ansX('What does this print?', ['1'], 'Only a owns it; use_count is 1.', 'auto a = std::make_shared<int>(5);\nstd::cout << a.use_count() << std::endl;'),
      py({ prompt: 'Write `swap_ends(items)`: swap the first and last items of a list IN PLACE (like a reference parameter in C++) and return nothing.', starter: 'def swap_ends(items):\n    pass\n', tests: [{ name: 'swaps in place', code: 'xs = [1, 2, 3]\nr = swap_ends(xs)\nassert xs == [3, 2, 1] and r is None, f"got {xs}"' }], solution: 'def swap_ends(items):\n    items[0], items[-1] = items[-1], items[0]\n' }),
    ],
  },
};
