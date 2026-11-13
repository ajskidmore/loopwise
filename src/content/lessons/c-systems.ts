/**
 * Track: c-systems — "C & Computer Systems"
 * Written here: c-1 (C basics), c-2 (pointers and memory), c-3 (under the hood) + checkpoints + course final exam.
 *
 * C can't run in the browser yet (that needs a server runner), so this course is explain + quiz, with C code to
 * READ, plus Python exercises where the idea carries over (bit operations, two's complement, memory layout).
 * Every C "What does this print?" snippet was compiled and run with clang before publishing
 * (snippets without main() are wrapped in `int main(void) { … }` with <stdio.h>/<string.h>).
 */
import type { AnswerStep, Checkpoint, ChoiceStep, Step } from '../types';
import { ans, ansT, eq, ex, mc, ord, py } from './_helpers';

const mcC = (prompt: string, choices: string[], answer: number, explanation: string, code?: string): ChoiceStep => ({
  ...mc(prompt, choices, answer, explanation), ...(code ? { code, language: 'c' as const } : {}),
});
const ansC = (prompt: string, accept: string[], explanation: string, code?: string): AnswerStep => ({
  ...ans(prompt, accept, explanation), ...(code ? { code, language: 'c' as const } : {}),
});
const ordT = (prompt: string, lines: string[], explanation: string) => ord(prompt, lines, explanation, 'text');

const NOTE = 'C can\'t run in this practice editor yet, so in this course you\'ll read C and answer questions, and practice the ideas in Python.';

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ c-1-hello
  'c-1-hello': [
    ex('Meet C', '**C** (from 1972) sits close to the hardware. Operating systems, databases, Python itself (CPython) and the code in your car are written in C or its cousins.\n\n```c\n#include <stdio.h>\n\nint main(void) {\n    printf("Hello, C!\\n");\n    return 0;\n}\n```\n\n- `#include <stdio.h>` brings in input/output functions\n- every program starts in **`main`**\n- statements end with `;` and blocks use `{ }`\n- `\\n` is a newline (printf doesn\'t add one for you)', NOTE),
    ex('Compile, then run', 'Python runs your code directly. C is **compiled** first: a compiler turns the source into a machine-code program.\n\n```\n$ gcc hello.c -o hello     # compile\n$ ./hello                   # run\nHello, C!\n```\n\nCompiled code runs very fast, but you must recompile after every change.'),
    mc('What must you do before running a C program?', ['Compile it (for example with gcc)', 'Nothing: you run the .c file directly', 'Upload it to a server'], 0, 'gcc turns hello.c into a program called hello.'),
    mcC('What does this print?', ['Hi', 'Hi\\n', '"Hi"'], 0, '\\n is a newline character. It moves to the next line but isn\'t shown.', 'printf("Hi\\n");'),
    ex('printf placeholders', '`printf` fills in **placeholders**:\n\n| Placeholder | Type |\n|---|---|\n| `%d` | int |\n| `%f` | float or double |\n| `%c` | char |\n| `%s` | string |\n\n```c\nint age = 30;\nprintf("Age: %d\\n", age);   // Age: 30\n```'),
    ansC('What does this print?', ['Score: 42'], '%d is replaced by the int 42.', 'int score = 42;\nprintf("Score: %d\\n", score);'),
    mc('What does `return 0;` at the end of main mean?', ['The program finished successfully', 'Print zero', 'Restart the program'], 0, 'By convention, 0 = success and anything else = an error code.'),
  ],

  // ------------------------------------------------------------------ c-1-types
  'c-1-types': [
    ex('Every variable has a type', 'In C you declare each variable\'s type, and it never changes:\n\n```c\nint count = 3;        // whole number (usually 4 bytes)\ndouble price = 9.99;  // decimal (8 bytes)\nchar grade = \'A\';     // one character (1 byte)\n```\n\n`sizeof` tells you how many **bytes** a type uses. Sizes can vary by computer; these are typical for modern machines.'),
    mc('Which type would you use to store 3.5?', ['double', 'int', 'char'], 0, 'int holds only whole numbers.'),
    ansC('What does this print?', ['3'], 'Integer division throws away the remainder: 7 / 2 = 3.', 'int a = 7, b = 2;\nprintf("%d\\n", a / b);'),
    ex('Characters are numbers', 'A `char` is really a small number. \'A\' is stored as **65** (its ASCII code), \'B\' as 66, and so on.\n\n```c\nchar c = \'A\';\nprintf("%d\\n", c);    // 65\nprintf("%c\\n", c + 1); // B\n```'),
    ansC('What does this print?', ['C'], '\'A\' is 65, so 65 + 2 = 67, which is \'C\'.', "char c = 'A';\nprintf(\"%c\\n\", c + 2);"),
    ex('Overflow', 'Each type holds a **limited range**. A 1-byte `unsigned char` holds 0–255. Go past the end and it **wraps around**:\n\n```c\nunsigned char x = 255;\nx = x + 1;   // x is now 0\n```\n\nOverflow bugs have crashed rockets and broken games. Python hides this with unlimited-size integers; C doesn\'t.', 'The 1996 Ariane 5 rocket failure was caused by a number too big for its variable.'),
    ansC('What does this print?', ['0'], '255 + 1 wraps around to 0 in an unsigned char.', 'unsigned char x = 255;\nx = x + 1;\nprintf("%d\\n", x);'),
    py({
      prompt: 'Simulate an 8-bit unsigned number in Python. Write `add_u8(a, b)` that returns `(a + b)` wrapped into the range 0–255, just like an `unsigned char` in C.',
      starter: 'def add_u8(a, b):\n    pass\n',
      tests: [eq('add_u8(255, 1)', '0'), eq('add_u8(200, 100)', '44'), eq('add_u8(3, 4)', '7')],
      hints: ['Wrapping around = the remainder after dividing by 256.', 'return (a + b) % 256'],
      solution: 'def add_u8(a, b):\n    return (a + b) % 256\n',
    }),
  ],

  // ------------------------------------------------------------------ c-1-functions
  'c-1-functions': [
    ex('Functions in C', 'A C function states its **return type** and the **type of every parameter**:\n\n```c\nint add(int a, int b) {\n    return a + b;\n}\n```\n\n`void` means "returns nothing": `void greet(void) { … }`'),
    mcC('What is this function\'s return type?', ['double', 'int', 'void'], 0, 'The type before the name is what it returns.', 'double average(int a, int b) {\n    return (a + b) / 2.0;\n}'),
    ex('Declare before use', 'C reads files **top to bottom**. To call a function that\'s defined later (or in another file), declare its **prototype** first:\n\n```c\nint add(int a, int b);   // prototype: "this exists"\n\nint main(void) {\n    printf("%d\\n", add(2, 3));\n    return 0;\n}\n\nint add(int a, int b) { return a + b; }\n```'),
    mc('What is a function prototype?', ['A declaration of the function\'s name, return type and parameters', 'An unfinished function', 'A test for the function'], 0, 'It tells the compiler how to call the function before it sees the body.'),
    ex('Header files', 'Prototypes for a group of functions usually live in a **header file** (`.h`):\n\n```c\n// mathx.h\nint add(int a, int b);\n\n// main.c\n#include "mathx.h"\n```\n\n- `#include <stdio.h>` (angle brackets) = a system header\n- `#include "mathx.h"` (quotes) = your own header'),
    mc('Which line includes your OWN header file?', ['#include "mathx.h"', '#include <mathx.h>', 'import mathx'], 0, 'Quotes look in your project first.'),
    ansC('What does this print?', ['5'], 'Arguments are copied in, so x inside bump changes only the copy.', 'void bump(int x) {\n    x = x + 1;\n}\n\nint main(void) {\n    int n = 5;\n    bump(n);\n    printf("%d\\n", n);\n    return 0;\n}'),
    mc('Why didn\'t bump change n?', ['C passes a copy of the value', 'bump has a bug in its math', 'n is a constant'], 0, '"Pass by value". To change the caller\'s variable you need a pointer, which is the next unit.'),
  ],

  // ------------------------------------------------------------------ c-2-pointers
  'c-2-pointers': [
    ex('Addresses', 'Every variable lives at an **address** in memory, like a house number.\n\n- `&x` means "the address of x"\n- a **pointer** is a variable that **holds an address**\n- `*p` means "the value **at** the address in p" (that\'s **dereferencing**)\n\n```c\nint x = 10;\nint *p = &x;   // p points to x\n*p = 20;       // changes x!\n```'),
    ansC('What does this print?', ['20'], 'p points to x, so *p = 20 changes x itself.', 'int x = 10;\nint *p = &x;\n*p = 20;\nprintf("%d\\n", x);'),
    mc('`&x` means…', ['the address of x', 'x and something else', 'the value pointed to by x'], 0, '& = "address of".'),
    mc('If p holds the address of x, `*p` is…', ['the value stored in x', 'the address of p', 'always zero'], 0, '* follows the pointer to the value.'),
    ex('Changing the caller\'s variable', 'Pass an address, and the function can change the original:\n\n```c\nvoid bump(int *x) {\n    *x = *x + 1;\n}\n\nint n = 5;\nbump(&n);    // n is now 6\n```\n\nThat\'s how `scanf` fills in your variables, and how C functions return several results.'),
    ansC('What does this print?', ['6'], 'bump receives n\'s address and changes n itself.', 'void bump(int *x) {\n    *x = *x + 1;\n}\n\nint main(void) {\n    int n = 5;\n    bump(&n);\n    printf("%d\\n", n);\n    return 0;\n}'),
    ex('NULL and crashes', '`NULL` is a pointer to nothing. Dereferencing it, or a pointer to memory that\'s gone, crashes the program (a "**segmentation fault**") or worse: silently corrupts data.\n\nThis power is why C is fast, and why pointer bugs cause so many security problems.'),
    mc('What usually happens if you dereference a NULL pointer?', ['The program crashes (segmentation fault)', 'It returns 0 safely', 'The compiler fixes it'], 0, 'C trusts you completely, so be careful.'),
  ],

  // ------------------------------------------------------------------ c-2-arrays
  'c-2-arrays': [
    ex('Arrays', 'A C array is a **fixed-size** block of same-type values, side by side in memory:\n\n```c\nint nums[4] = {10, 20, 30, 40};\nnums[0];   // 10\n```\n\n⚠️ C does **not** check bounds. `nums[10]` reads whatever memory happens to be there. That\'s a classic source of bugs and security holes ("buffer overflows").'),
    ansC('What does this print?', ['30'], 'Indexes start at 0, so [2] is the third item.', 'int nums[4] = {10, 20, 30, 40};\nprintf("%d\\n", nums[2]);'),
    mc('What happens if you read nums[10] from a 4-item array in C?', ['It reads whatever memory is there: undefined behavior', 'You get a clear IndexError', 'It returns 0'], 0, 'No safety net. Python would raise IndexError instead.'),
    ex('Strings are char arrays', 'A C string is an array of `char`s ending with a special **null terminator** `\'\\0\'`:\n\n```c\nchar name[] = "Pip";   // really {\'P\', \'i\', \'p\', \'\\0\'}: 4 bytes\n```\n\n`strlen` counts the characters **before** the `\\0`.'),
    ansC('What does this print? (strlen counts characters before the \\0.)', ['3'], '"Pip" has 3 visible characters. The array is 4 bytes because of the \\0.', 'char name[] = "Pip";\nprintf("%zu\\n", strlen(name));'),
    ansC('What does this print?', ['4'], 'sizeof counts every byte, including the hidden \\0.', 'char name[] = "Pip";\nprintf("%zu\\n", sizeof(name));'),
    mc('Why must a buffer for "Pip" be at least 4 chars long?', ['It needs room for the null terminator \\0', 'C strings need an extra space', 'It doesn\'t'], 0, 'Forgetting the \\0 is a classic C bug.'),
    py({
      prompt: 'Simulate a C string. Write `c_strlen(buf)` that takes a **list of characters** (like C memory) and counts how many come **before** the first `"\\0"`. Don\'t use `index` or `len` on the slice: loop like C would.',
      starter: 'def c_strlen(buf):\n    pass\n',
      tests: [eq('c_strlen(["P", "i", "p", "\\0", "x"])', '3'), eq('c_strlen(["\\0"])', '0'), eq('c_strlen(["a", "b", "\\0"])', '2')],
      hints: ['n = 0; while buf[n] != "\\0": n += 1', 'return n'],
      solution: 'def c_strlen(buf):\n    n = 0\n    while buf[n] != "\\0":\n        n += 1\n    return n\n',
    }),
  ],

  // ------------------------------------------------------------------ c-2-heap
  'c-2-heap': [
    ex('Memory you ask for', 'Local variables disappear when their function returns. For memory that must **outlive** a function, or whose size is only known at run time, ask the **heap**:\n\n```c\n#include <stdlib.h>\n\nint *nums = malloc(100 * sizeof(int));   // room for 100 ints\nif (nums == NULL) { /* out of memory */ }\n...\nfree(nums);                               // give it back\n```'),
    mc('What does malloc do?', ['Reserves a block of heap memory and returns a pointer to it', 'Frees memory', 'Prints memory usage'], 0, 'malloc = memory allocate.'),
    mc('Why check if malloc returned NULL?', ['It returns NULL when no memory is available', 'NULL means success', 'It never returns NULL'], 0, 'Always check before using the pointer.'),
    ex('The three classic heap bugs', '1. **Memory leak**: forgetting `free`, so the program uses more and more memory\n2. **Use after free**: using a pointer after `free`\n3. **Double free**: calling `free` twice on the same pointer\n\nPython, Java and JavaScript avoid these with a **garbage collector** that frees memory automatically. Rust prevents them at compile time.'),
    mc('A server slowly uses more and more memory until it crashes. Most likely bug?', ['A memory leak (missing free)', 'A double free', 'A syntax error'], 0, 'Memory that\'s never returned piles up.'),
    mc('How do Python and Java avoid most of these bugs?', ['A garbage collector frees unused memory automatically', 'They don\'t use memory', 'They forbid pointers and arrays'], 0, 'Automatic memory management trades a little speed for safety.'),
    py({
      prompt: 'Simulate a heap tracker that catches the classic bugs. Write a class `Heap` with:\n\n- `malloc(size)`: returns a new id (1, 2, 3, …) and remembers it as allocated\n- `free(ptr)`: raises `ValueError` if ptr isn\'t currently allocated (a double free or a bad pointer); otherwise frees it\n- `leaks()`: returns the total **size** still allocated',
      starter: 'class Heap:\n    pass\n',
      tests: [
        { name: 'tracks leaks', code: 'h = Heap()\na = h.malloc(100)\nb = h.malloc(50)\nh.free(a)\nassert h.leaks() == 50, f"expected 50 bytes leaked, got {h.leaks()}"' },
        { name: 'ids are 1, 2, 3…', code: 'h = Heap()\nassert [h.malloc(1), h.malloc(1), h.malloc(1)] == [1, 2, 3]' },
        { name: 'double free raises ValueError', code: 'h = Heap()\na = h.malloc(8)\nh.free(a)\ntry:\n    h.free(a)\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("freeing twice should raise ValueError")' },
      ],
      hints: ['In __init__: self.blocks = {} and self.next_id = 1', 'free: if ptr not in self.blocks: raise ValueError("double free"); else del self.blocks[ptr]. leaks: return sum(self.blocks.values())'],
      solution: 'class Heap:\n    def __init__(self):\n        self.blocks = {}\n        self.next_id = 1\n\n    def malloc(self, size):\n        ptr = self.next_id\n        self.next_id += 1\n        self.blocks[ptr] = size\n        return ptr\n\n    def free(self, ptr):\n        if ptr not in self.blocks:\n            raise ValueError("double free or bad pointer")\n        del self.blocks[ptr]\n\n    def leaks(self):\n        return sum(self.blocks.values())\n',
    }),
  ],

  // ------------------------------------------------------------------ c-2-structs
  'c-2-structs': [
    ex('Grouping data', 'C has no classes. A **struct** groups related fields:\n\n```c\nstruct Point {\n    int x;\n    int y;\n};\n\nstruct Point p = {3, 4};\nprintf("%d\\n", p.x);   // 3\n```\n\nFields are read with a dot, like Python attributes.'),
    ansC('What does this print?', ['7'], 'p.x + p.y = 3 + 4.', 'struct Point { int x; int y; };\n\nint main(void) {\n    struct Point p = {3, 4};\n    printf("%d\\n", p.x + p.y);\n    return 0;\n}'),
    ex('Pointers to structs', 'With a pointer to a struct, use the **arrow** `->`:\n\n```c\nstruct Point *pp = &p;\npp->x = 10;     // same as (*pp).x = 10\n```\n\nPassing a pointer avoids copying a big struct, and lets the function change it.'),
    mcC('pp is a pointer to a struct Point. Which line sets its x to 10?', ['pp->x = 10;', 'pp.x = 10;', '*pp->x = 10;'], 0, 'Arrow for pointers, dot for the struct itself.'),
    ex('typedef', '`typedef` gives a type a shorter name:\n\n```c\ntypedef struct {\n    char name[20];\n    int age;\n} Person;\n\nPerson ana = {"Ana", 30};\n```\n\nNow you can write `Person` instead of `struct Person` everywhere.'),
    mc('In C, what plays the role that classes play in Python?', ['structs (plus functions that take them)', 'arrays', 'header files'], 0, 'C has data (structs) and functions, but no methods or inheritance built in.'),
    ansC('What does this print?', ['31'], 'birthday gets a pointer, so it changes the original person.', 'typedef struct { int age; } Person;\n\nvoid birthday(Person *p) {\n    p->age = p->age + 1;\n}\n\nint main(void) {\n    Person ana = {30};\n    birthday(&ana);\n    printf("%d\\n", ana.age);\n    return 0;\n}'),
  ],

  // ------------------------------------------------------------------ c-3-bitwise
  'c-3-bitwise': [
    ex('Working with bits', 'Bitwise operators work on the individual bits of a number. They\'re the same in C and Python:\n\n| Op | Name | 6 op 3 (110, 011) |\n|---|---|---|\n| `&` | AND | 2 (010) |\n| `\\|` | OR | 7 (111) |\n| `^` | XOR | 5 (101) |\n| `<<` | shift left | 6 << 1 = 12 |\n| `>>` | shift right | 6 >> 1 = 3 |\n\nShifting left by 1 doubles; shifting right by 1 halves (dropping the remainder).'),
    ans('What is 5 & 3? (101 AND 011)', ['1'], 'Only the last bit is 1 in both: 001.'),
    ans('What is 5 | 3? (101 OR 011)', ['7'], '111.'),
    ans('What is 1 << 4?', ['16'], 'Shifting 1 left four times: 2⁴ = 16.'),
    ex('Masks and flags', 'Bits are perfect for **flags** (on/off settings) packed into one number:\n\n```c\n#define READ  1   // 001\n#define WRITE 2   // 010\n#define EXEC  4   // 100\n\nint perms = READ | WRITE;      // 011: turn flags on\nif (perms & WRITE) { … }      // test a flag\nperms &= ~WRITE;              // turn a flag off\n```\n\nFile permissions on Linux work exactly like this.'),
    mc('perms = READ | WRITE (011). Which test checks whether EXEC (100) is set?', ['perms & EXEC', 'perms | EXEC', 'perms ^ EXEC'], 0, '& with a mask keeps only that bit: nonzero means it\'s set.'),
    ex('Negative numbers: two\'s complement', 'Computers store negative integers in **two\'s complement**. To get −x in 8 bits: flip every bit of x, then add 1.\n\n5 = 00000101 → flip → 11111010 → +1 → **11111011** = −5\n\nNice property: ordinary addition just works. 5 + (−5) wraps around to 00000000.'),
    py({
      prompt: 'Write two bit helpers (they work the same as in C):\n\n- `is_set(flags, bit)`: True if bit number `bit` (0 = the rightmost) is 1\n- `twos8(x)`: the 8-bit two\'s complement pattern of x, as a string of 8 `0`/`1` characters (for −128 ≤ x ≤ 127)',
      starter: 'def is_set(flags, bit):\n    pass\n\n\ndef twos8(x):\n    pass\n',
      tests: [eq('is_set(0b101, 0)', 'True'), eq('is_set(0b101, 1)', 'False'), eq('twos8(5)', '"00000101"'), eq('twos8(-5)', '"11111011"'), eq('twos8(-1)', '"11111111"')],
      hints: ['is_set: return (flags >> bit) & 1 == 1', 'twos8: x & 0xFF gives the 8-bit pattern (Python handles negatives for you). Then format(value, "08b").'],
      solution: 'def is_set(flags, bit):\n    return (flags >> bit) & 1 == 1\n\n\ndef twos8(x):\n    return format(x & 0xFF, "08b")\n',
    }),
  ],

  // ------------------------------------------------------------------ c-3-compilation
  'c-3-compilation': [
    ex('Four stages', '`gcc main.c -o main` actually runs four steps:\n\n1. **Preprocess**: handle `#include` and `#define` (pure text substitution)\n2. **Compile**: C → assembly language\n3. **Assemble**: assembly → machine code in an **object file** (`.o`)\n4. **Link**: combine object files and libraries (like `printf`\'s code) into one program'),
    ordT('Put the stages in order.', ['Preprocess', 'Compile', 'Assemble', 'Link'], 'Text substitution → assembly → machine code → one finished program.'),
    mc('`#define MAX 100` is handled by…', ['the preprocessor', 'the linker', 'the CPU at run time'], 0, 'It\'s plain find-and-replace before compiling.'),
    mc('You get "undefined reference to `add`". Which stage failed?', ['Linking: the function was declared, but its code was never found', 'Preprocessing', 'Running the program'], 0, 'The compiler trusted the prototype; the linker couldn\'t find the body.'),
    ex('Compiled vs interpreted', '- **C**: compiled ahead of time to machine code for one kind of CPU. Very fast; recompile for other CPUs.\n- **Python**: CPython compiles to **bytecode**, then an interpreter runs it. Slower, but portable and interactive.\n- **Java**: compiles to bytecode for the **JVM**, which compiles the hot parts to machine code while it runs ("JIT").'),
    mc('Why is C usually faster than Python?', ['It\'s compiled ahead of time to native machine code', 'C has shorter keywords', 'Python is written in Java'], 0, 'No interpreter in between at run time.'),
    mc('`gcc -Wall` turns on…', ['compiler warnings that catch likely bugs', 'faster code', 'debug printing'], 0, 'Always compile with warnings on, and read them!'),
  ],

  // ------------------------------------------------------------------ c-3-assembly
  'c-3-assembly': [
    ex('The CPU\'s own language', 'The CPU runs tiny **instructions** that work on **registers**: a handful of super-fast storage slots inside the CPU.\n\n`x = a + b;` might become (simplified x86-64):\n\n```\nmov  eax, [a]     ; load a into register eax\nadd  eax, [b]     ; eax = eax + b\nmov  [x], eax     ; store the result into x\n```\n\nAssembly is a human-readable spelling of machine code.'),
    mc('What is a register?', ['A tiny, very fast storage slot inside the CPU', 'A file on disk', 'A type of loop'], 0, 'CPUs have only a few dozen. Everything passes through them.'),
    ex('Control flow is jumps', 'There\'s no `if` or `for` in assembly, just **compare** and **jump**:\n\n```\n    cmp  eax, 10      ; compare eax with 10\n    jge  done         ; jump to "done" if eax >= 10\n    add  eax, 1\ndone:\n```\n\nEvery loop and if in every language ends up as compares and jumps.'),
    mc('In assembly, how is an if statement built?', ['A compare followed by a conditional jump', 'With an if instruction', 'It can\'t be'], 0, 'Branches = jumps.'),
    ex('Different CPUs, different instructions', 'Each CPU family has its own **instruction set**: **x86-64** (most PCs), **ARM** (phones, Apple Silicon Macs).\n\nThat\'s why a compiled C program for one won\'t run on the other without recompiling.'),
    mc('Why can\'t an x86-64 program run directly on an ARM phone?', ['They use different instruction sets', 'Phones can\'t run programs', 'ARM only runs Python'], 0, 'Recompile, or use a translator like Apple\'s Rosetta.'),
    py({
      prompt: 'Simulate a tiny CPU! Write `run(program)` for a list of instructions acting on one register `acc` (it starts at 0). Return acc at the end.\n\n- `("add", n)`: acc += n\n- `("sub", n)`: acc -= n\n- `("jnz", i)`: if acc is not 0, jump to instruction index i\n\n`[("add", 3), ("sub", 1), ("jnz", 1)]` counts 3 → 2 → 1 → 0, then stops.',
      starter: 'def run(program):\n    acc = 0\n    pc = 0   # program counter: which instruction is next\n    # your code here\n    return acc\n',
      tests: [eq('run([("add", 5), ("sub", 2)])', '3'), eq('run([("add", 3), ("sub", 1), ("jnz", 1)])', '0'), eq('run([("add", 2), ("add", 3), ("sub", 5), ("jnz", 0)])', '0', 'jnz falls through when acc is 0')],
      hints: ['while pc < len(program): op, n = program[pc]', 'For add/sub, update acc and do pc += 1. For jnz: pc = n if acc != 0 else pc + 1.'],
      solution: 'def run(program):\n    acc = 0\n    pc = 0   # program counter: which instruction is next\n    while pc < len(program):\n        op, n = program[pc]\n        if op == "add":\n            acc += n\n            pc += 1\n        elif op == "sub":\n            acc -= n\n            pc += 1\n        elif op == "jnz":\n            pc = n if acc != 0 else pc + 1\n    return acc\n',
    }),
  ],

  // ------------------------------------------------------------------ c-3-stack-heap
  'c-3-stack-heap': [
    ex('A program\'s memory', 'A running program\'s memory is split into regions:\n\n| Region | Holds |\n|---|---|\n| **code** | the machine instructions |\n| **globals** | global and static variables |\n| **heap** | `malloc` memory, which grows as you allocate |\n| **stack** | local variables and function calls |'),
    ex('The call stack', 'Each function call pushes a **stack frame** holding its local variables and where to return. When the function returns, its frame is popped and those locals are gone.\n\nThat\'s why you must never return a pointer to a local variable: the memory it points to is reused by the next call.'),
    mc('Where do a function\'s local variables live?', ['On the stack', 'On the heap', 'In the code region'], 0, 'Pushed on call, popped on return.'),
    mc('Memory from malloc lives on…', ['the heap', 'the stack'], 0, 'It stays until you free it.'),
    mcC('What\'s wrong with this function?', ['It returns the address of a local variable that disappears when the function returns', 'Nothing', 'It forgot #include'], 0, 'After return, that stack memory gets reused. Use malloc (or let the caller pass a buffer).', 'int *make_number(void) {\n    int n = 42;\n    return &n;\n}'),
    mc('Infinite recursion causes a…', ['stack overflow: too many frames for the stack\'s fixed size', 'memory leak on the heap', 'faster program'], 0, 'Yes, that\'s where the website\'s name comes from.'),
    ansT('main calls a(), a() calls b(), and b() calls c(). While c() runs, how many frames are on the stack?', ['4', 'four'], 'main, a, b and c: one frame per active call.'),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'c-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('C programs start running in…', ['main', 'start', 'the first line of the file'], 0, 'main.'),
      mc('Before running C code you must…', ['compile it', 'interpret it line by line'], 0, 'gcc.'),
      mc('The printf placeholder for an int is…', ['%d', '%s', '%f'], 0, '%d.'),
      ansC('What does this print?', ['2'], 'Integer division.', 'printf("%d\\n", 5 / 2);'),
      mc('A function prototype is…', ['a declaration before the definition', 'a finished function'], 0, 'Declare, then define.'),
      ansC('What does this print?', ['B'], '65 + 1 = 66 = \'B\'.', "printf(\"%c\\n\", 'A' + 1);"),
      mc('C passes arguments by…', ['value (a copy)', 'reference'], 0, 'Copies.'),
    ],
  },
  'c-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('`int *p = &x;` makes p…', ['point to x', 'a copy of x'], 0, 'Address of x.'),
      ansC('What does this print?', ['8'], '*p changes x.', 'int x = 3;\nint *p = &x;\n*p = 8;\nprintf("%d\\n", x);'),
      mc('C strings end with…', ["'\\0'", 'a newline', 'nothing'], 0, 'The null terminator.'),
      ansC('What does this print?', ['5'], 'strlen("hello").', 'printf("%zu\\n", strlen("hello"));'),
      mc('Forgetting free causes…', ['a memory leak', 'a syntax error'], 0, 'Leak.'),
      mc('For a pointer to a struct, fields use…', ['->', '.'], 0, 'Arrow.'),
      py({ prompt: 'Simulate pass-by-pointer: write `bump(box)` that adds 1 to `box[0]` (a one-item list standing in for memory).', starter: 'def bump(box):\n    pass\n', tests: [{ name: 'changes the caller\'s value', code: 'b = [5]\nbump(b)\nassert b == [6], f"expected [6], got {b}"' }], solution: 'def bump(box):\n    box[0] += 1\n' }),
    ],
  },
  'c-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('What is 6 ^ 3? (110 XOR 011)', ['5'], '101.'),
      ans('What is 20 >> 2?', ['5'], '20 ÷ 4.'),
      mc('"undefined reference" is a…', ['linker error', 'preprocessor error'], 0, 'Link stage.'),
      mc('Assembly loops are built from…', ['compares and jumps', 'for statements'], 0, 'Jumps.'),
      mc('Local variables live on the…', ['stack', 'heap'], 0, 'Stack.'),
      mc('Too-deep recursion causes a…', ['stack overflow', 'linker error'], 0, 'Out of stack.'),
      py({ prompt: 'Write `set_bit(flags, bit)`: return flags with bit number `bit` turned on.', starter: 'def set_bit(flags, bit):\n    pass\n', tests: [eq('set_bit(0b100, 0)', '0b101'), eq('set_bit(5, 0)', '5')], solution: 'def set_bit(flags, bit):\n    return flags | (1 << bit)\n' }),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  'c-systems': {
    passScore: 0.8, hearts: 3,
    questions: [
      ansC('What does this print?', ['7'], '15 / 2 = 7 in integer division.', 'printf("%d\\n", 15 / 2);'),
      mc('unsigned char 255 + 1 becomes…', ['0', '256'], 0, 'Wraps around.'),
      ansC('What does this print?', ['11'], 'The pointer changes a.', 'int a = 1;\nint *p = &a;\n*p += 10;\nprintf("%d\\n", a);'),
      mc('Reading past the end of a C array is…', ['undefined behavior', 'an IndexError'], 0, 'No bounds checks.'),
      mc('Using a pointer after free is called…', ['use after free', 'a leak'], 0, 'A dangerous bug.'),
      mcC('Which correctly reads field age through pointer p?', ['p->age', 'p.age'], 0, 'Arrow.'),
      ans('What is 1 << 10?', ['1024'], '2¹⁰.'),
      mc('Which stage turns assembly into machine code?', ['assemble', 'link', 'preprocess'], 0, 'The assembler.'),
      mc('Returning the address of a local variable is wrong because…', ['the stack frame disappears on return', 'locals are read-only'], 0, 'Dangling pointer.'),
      py({ prompt: 'Write `popcount(n)`: how many 1 bits a non-negative integer has, using `&` and `>>` (no bin() or str()).', starter: 'def popcount(n):\n    pass\n', tests: [eq('popcount(0b1011)', '3'), eq('popcount(0)', '0'), eq('popcount(255)', '8'), { name: 'uses bit operators', code: 'assert "bin(" not in __source__ and "str(" not in __source__ and ">>" in __source__, "Use & and >> instead of bin() or str()"' }], hints: ['while n: count += n & 1; n >>= 1'], solution: 'def popcount(n):\n    count = 0\n    while n:\n        count += n & 1\n        n >>= 1\n    return count\n' }),
    ],
  },
};
