/**
 * Track: architecture-os — "Architecture & Operating Systems"
 * Written here: ao-1 (architecture), ao-2 (processes and threads), ao-3 (concurrency), ao-4 (memory and storage)
 * + checkpoints + course final exam. Explain + quiz, with Python simulations of the hardware and OS ideas
 * (gates, caches, schedulers, races, deadlock detection, page tables).
 */
import type { Checkpoint, Step } from '../types';
import { ans, ansT, eq, ex, mc, ord, py } from './_helpers';

const ordT = (prompt: string, lines: string[], explanation: string) => ord(prompt, lines, explanation, 'text');

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ ao-1-gates
  'ao-1-gates': [
    ex('Computers are made of switches', 'At the bottom, a computer is billions of tiny switches (**transistors**) wired into **logic gates**:\n\n| Gate | Output is 1 when… |\n|---|---|\n| **AND** | both inputs are 1 |\n| **OR** | at least one input is 1 |\n| **NOT** | the input is 0 (it flips) |\n| **XOR** | exactly one input is 1 |\n| **NAND** | NOT (A AND B) |', 'This course follows a program from the hardware all the way up to the operating system.'),
    ans('AND gate: inputs 1 and 0. Output?', ['0'], 'AND needs both inputs to be 1.'),
    ans('XOR gate: inputs 1 and 1. Output?', ['0'], 'XOR is 1 only when the inputs differ.'),
    ex('Gates that do math', 'Adding two bits needs just two gates. This is a **half adder**:\n\n- **sum** = A XOR B\n- **carry** = A AND B\n\n1 + 1 = sum 0, carry 1 (binary 10 = 2). Chain adders together and you can add 64-bit numbers. That\'s the core of the CPU\'s **ALU** (arithmetic logic unit).'),
    ansT('Half adder with A = 1, B = 1. What are (sum, carry)? Write it like 0, 1', ['0, 1', '0,1', '(0, 1)', '(0,1)'], 'sum = 1 XOR 1 = 0, carry = 1 AND 1 = 1.'),
    mc('Why is NAND called a "universal" gate?', ['Every other gate can be built from NAND gates alone', 'It\'s the fastest gate', 'It works on any voltage'], 0, 'Chip makers can build everything out of one kind of gate.'),
    py({
      prompt: 'Build hardware in Python! Using only `&`, `|` and `^` on bits (0 or 1), write:\n\n- `half_adder(a, b)` → `(sum, carry)`\n- `full_adder(a, b, cin)` → `(sum, carry)`, adding three bits (cin is the carry coming in)',
      starter: 'def half_adder(a, b):\n    pass\n\n\ndef full_adder(a, b, cin):\n    pass\n',
      tests: [eq('half_adder(1, 1)', '(0, 1)'), eq('half_adder(1, 0)', '(1, 0)'), eq('full_adder(1, 1, 1)', '(1, 1)'), eq('full_adder(1, 0, 1)', '(0, 1)'), eq('full_adder(0, 0, 0)', '(0, 0)')],
      hints: ['half_adder: return (a ^ b, a & b)', 'full_adder: s = a ^ b ^ cin; carry = (a & b) | (cin & (a ^ b))'],
      solution: 'def half_adder(a, b):\n    return (a ^ b, a & b)\n\n\ndef full_adder(a, b, cin):\n    s = a ^ b ^ cin\n    carry = (a & b) | (cin & (a ^ b))\n    return (s, carry)\n',
    }),
  ],

  // ------------------------------------------------------------------ ao-1-cpu
  'ao-1-cpu': [
    ex('The instruction cycle', 'A CPU repeats one loop billions of times per second:\n\n1. **Fetch** the next instruction from memory (the **program counter** says where)\n2. **Decode** it: what operation, on which registers?\n3. **Execute** it in the ALU\n4. Write the result back\n\nA 3 GHz CPU ticks 3 billion times per second.'),
    ordT('Put the instruction cycle in order.', ['Fetch', 'Decode', 'Execute', 'Write back'], 'Fetch → decode → execute → write back, again and again.'),
    mc('What does the program counter hold?', ['The address of the next instruction', 'How many programs are running', 'The current time'], 0, 'Jumps work by changing it.'),
    ex('Pipelining', 'Like a laundry line (wash, dry, fold), a **pipeline** works on several instructions at once, each at a different stage. With 4 stages, up to 4 instructions are in flight.\n\nTrouble comes when an instruction needs a result that isn\'t ready yet, or at a **branch** (an `if`): which instructions come next? CPUs **predict branches**, and must throw work away when they guess wrong.'),
    mc('What does pipelining improve?', ['Throughput: more instructions finish per second', 'The time for one single instruction', 'Memory size'], 0, 'Each instruction still takes the same time; they just overlap.'),
    ans('A 4-stage pipeline with no stalls. How many clock ticks does it take to finish 10 instructions? (The first takes 4 ticks, then one finishes every tick.)', ['13'], '4 + (10 − 1) = 13 ticks, instead of 40 without a pipeline.'),
    mc('Why are unpredictable if-statements slow on modern CPUs?', ['A wrong branch prediction forces the pipeline to throw away work', 'If-statements use more memory'], 0, 'Sorted data can make some loops much faster for exactly this reason.'),
  ],

  // ------------------------------------------------------------------ ao-1-caches
  'ao-1-caches': [
    ex('The memory hierarchy', 'Fast memory is small and expensive; big memory is slow. So computers stack them:\n\n| Level | Rough access time |\n|---|---|\n| registers | < 1 ns |\n| L1 cache | ~1 ns |\n| L2/L3 cache | ~4–40 ns |\n| RAM | ~100 ns |\n| SSD | ~100,000 ns |\n\n(1 ns = a billionth of a second.) Reading RAM can cost **100× more** than an L1 cache hit.'),
    mc('Which is fastest?', ['L1 cache', 'RAM', 'SSD'], 0, 'Closest to the CPU.'),
    ex('Locality', 'Caches work because programs have **locality**:\n\n- **temporal**: data used now will probably be used again soon\n- **spatial**: data **near** it will probably be used soon\n\nThe cache loads a whole **cache line** (often 64 bytes) at a time. That\'s why walking through an array in order is much faster than jumping around randomly.'),
    mc('Why is looping through an array in order fast?', ['Spatial locality: each cache line brings in the next elements too', 'Arrays are stored on the CPU', 'The compiler skips the loop'], 0, 'One memory trip feeds many iterations.'),
    ex('Hits, misses and eviction', '- **hit**: the data is in the cache\n- **miss**: go to slower memory, then keep a copy\n\nWhen the cache is full, something must be **evicted**. A common policy is **LRU** (least recently used): throw out whatever hasn\'t been used for the longest time.'),
    ansT('A cache holds 2 items and uses LRU. Accesses: A, B, A, C. Which item gets evicted when C arrives?', ['B'], 'A was used more recently than B, so B is the least recently used.'),
    py({
      prompt: 'Simulate an LRU cache. Write `count_hits(accesses, size)` that replays the list of accesses through a cache holding `size` items and returns how many were **hits**.',
      starter: 'def count_hits(accesses, size):\n    pass\n',
      tests: [eq('count_hits(["A", "B", "A", "C", "A", "B"], 2)', '2'), eq('count_hits(["A", "A", "A"], 1)', '2'), eq('count_hits(["A", "B", "C"], 3)', '0')],
      hints: ['Keep a list `cache` with the most recently used item at the END.', 'On a hit: count it, remove the item and append it again. On a miss: if the cache is full, pop(0) (the LRU item), then append.'],
      solution: 'def count_hits(accesses, size):\n    cache = []\n    hits = 0\n    for item in accesses:\n        if item in cache:\n            hits += 1\n            cache.remove(item)\n        elif len(cache) == size:\n            cache.pop(0)\n        cache.append(item)\n    return hits\n',
    }),
  ],

  // ------------------------------------------------------------------ ao-2-processes
  'ao-2-processes': [
    ex('Programs in action', 'A **program** is a file. A **process** is a program **running**, with its own:\n\n- memory (code, stack, heap)\n- **process ID** (PID)\n- open files\n- current state\n\nRun the same program twice and you get two separate processes. The **operating system (OS)** keeps them apart, so one crashing doesn\'t take down the other.'),
    mc('Two browser windows run as separate processes. One crashes. What happens to the other?', ['It keeps running: processes are isolated', 'It crashes too', 'The computer restarts'], 0, 'That isolation is why browsers use many processes.'),
    ex('Process states', 'A process moves between states:\n\n- **ready**: waiting for a turn on the CPU\n- **running**: on the CPU right now\n- **blocked**: waiting for something slow (disk, network, a key press)\n\nWhile one process is blocked, the OS runs another. That\'s how one CPU juggles many programs.'),
    mc('A process is waiting for a file to load from disk. Its state is…', ['blocked', 'running', 'ready'], 0, 'It can\'t use the CPU until the data arrives.'),
    ex('System calls', 'Processes can\'t touch hardware directly. They ask the OS kernel through **system calls**: `open`, `read`, `write`, `fork` (copy this process), `exec` (run a new program).\n\nEven `print("hi")` in Python ends up as a `write` system call.'),
    mc('How does a program read a file?', ['It asks the OS through a system call like read', 'It talks to the disk hardware directly', 'It can\'t'], 0, 'The OS checks permissions and talks to the hardware.'),
    ansT('On Linux and macOS, `fork()` creates a copy of the running process. After one fork, how many processes are running that program?', ['2', 'two'], 'The original (parent) and the copy (child).'),
  ],

  // ------------------------------------------------------------------ ao-2-threads
  'ao-2-threads': [
    ex('Threads', 'A **thread** is a path of execution **inside** a process. A process can have many threads that **share** its memory:\n\n- each thread has its own **stack** and place in the code\n- all threads share the **heap** and globals\n\nWith several CPU cores, threads truly run at the same time.'),
    mc('What do threads in the same process share?', ['The heap and global variables', 'Nothing', 'Only their stacks'], 0, 'Sharing makes communication easy, and dangerous (next unit).'),
    mc('Thread vs process: which is cheaper to create?', ['A thread', 'A process'], 0, 'No new memory space to set up.'),
    ex('Concurrency vs parallelism', '- **Concurrency**: dealing with many things at once, taking turns (even on one core)\n- **Parallelism**: doing many things **at the same instant** on multiple cores\n\nA chef switching between pots is concurrent. Two chefs cooking at once is parallel.'),
    mc('A single-core CPU switching quickly between 10 threads is…', ['concurrent, but not parallel', 'parallel'], 0, 'Only one runs at any instant.'),
    ex('Why use threads?', '- keep an app **responsive**: one thread draws the screen while another downloads\n- use **all the cores** for heavy number-crunching\n- serve many users at once on a server\n\n(Python note: the classic CPython "GIL" lets only one thread run Python code at a time, so CPU-heavy Python code often uses processes instead.)'),
    mc('An app freezes while it downloads a big file. What could fix it?', ['Download on a background thread so the UI thread keeps responding', 'A bigger screen', 'More RAM'], 0, 'Never block the UI thread.'),
  ],

  // ------------------------------------------------------------------ ao-2-scheduling
  'ao-2-scheduling': [
    ex('Who runs next?', 'The OS **scheduler** decides which ready process or thread gets the CPU. Some classic policies:\n\n- **FCFS** (first come, first served): simple, but one long job makes everyone wait\n- **SJF** (shortest job first): best average wait, but needs to know job lengths\n- **Round robin**: everyone gets a short **time slice** (quantum) in turn'),
    ex('Round robin', 'Jobs A (needs 3 ticks), B (1 tick), C (2 ticks), with a quantum of 1:\n\nA B C A C A\n\nA runs 1 tick, then goes to the back of the line. B finishes after its first turn. Everyone gets regular turns, so the system feels responsive.'),
    ansT('Round robin, quantum 1. Jobs A = 2 ticks, B = 2 ticks. Write the order of turns, like A B …', ['A B A B', 'ABAB'], 'They alternate until both are done.'),
    mc('What happens to waiting time with FCFS when a very long job arrives first?', ['Every job behind it waits a long time (the "convoy effect")', 'Short jobs jump ahead automatically'], 0, 'Like getting stuck behind a full shopping cart with one item in your hand.'),
    mc('What\'s the trade-off of a very small round-robin quantum?', ['Lots of time wasted switching between jobs', 'Jobs never finish'], 0, 'Each context switch has a cost.'),
    py({
      prompt: 'Simulate round robin. `jobs` is a list of `(name, ticks_needed)`. With a quantum of 1 tick, return the list of names in the order they **finish**.',
      starter: 'def round_robin(jobs):\n    pass\n',
      tests: [eq('round_robin([("A", 3), ("B", 1), ("C", 2)])', '["B", "C", "A"]'), eq('round_robin([("X", 1)])', '["X"]'), eq('round_robin([("A", 2), ("B", 2)])', '["A", "B"]')],
      hints: ['Use a list as a queue: queue = [[name, ticks] for name, ticks in jobs]', 'Pop from the front, subtract 1 tick. If it\'s done, record the name; otherwise append it to the back.'],
      solution: 'def round_robin(jobs):\n    queue = [[name, ticks] for name, ticks in jobs]\n    finished = []\n    while queue:\n        job = queue.pop(0)\n        job[1] -= 1\n        if job[1] == 0:\n            finished.append(job[0])\n        else:\n            queue.append(job)\n    return finished\n',
    }),
  ],

  // ------------------------------------------------------------------ ao-3-races
  'ao-3-races': [
    ex('When timing breaks programs', '`count += 1` looks like one step, but the CPU does **three**: read count, add 1, write it back.\n\nTwo threads each adding 1 to `count = 0`:\n\n1. Thread A reads 0\n2. Thread B reads 0\n3. A writes 1\n4. B writes 1\n\nTwo increments, but count is **1**. This is a **race condition**: the result depends on the timing.'),
    mc('Why can two threads doing `count += 1` lose an update?', ['The read, add and write steps can interleave', 'Python forbids threads', 'Adding is slow'], 0, 'Both read the old value before either writes.'),
    ex('Why races are nasty', 'Race bugs are **intermittent**: the program works 999 times, then fails once in production. Adding a print statement changes the timing and makes the bug "disappear" (a "**heisenbug**").\n\nThe code that touches shared data is the **critical section**, and only one thread should be in it at a time.'),
    mc('What is a critical section?', ['Code that accesses shared data and must not run in two threads at once', 'The most important function', 'Code that runs at startup'], 0, 'Protect it with a lock (next lesson).'),
    ansT('Thread A and B both run count = count + 1 on count = 5, with fully interleaved reads (both read before either writes). What is count at the end?', ['6'], 'Both read 5 and both write 6. One update is lost.'),
    py({
      prompt: 'Simulate the race! Each thread does **read** then **write** (writing read value + 1). `schedule` lists which thread acts next, like `["A", "B", "A", "B"]`: each thread\'s first turn is its read, and its second turn is its write.\n\nWrite `run_schedule(schedule)` that starts with count = 0 and returns the final count.',
      starter: 'def run_schedule(schedule):\n    count = 0\n    # your code here\n    return count\n',
      tests: [eq('run_schedule(["A", "A", "B", "B"])', '2', 'one after the other: no race'), eq('run_schedule(["A", "B", "A", "B"])', '1', 'interleaved: an update is lost'), eq('run_schedule(["A", "B", "B", "A"])', '1')],
      hints: ['Keep each thread\'s saved value: seen = {} and step = {"A": 0, "B": 0}', 'On a thread\'s first turn: seen[t] = count. On its second turn: count = seen[t] + 1.'],
      solution: 'def run_schedule(schedule):\n    count = 0\n    seen = {}\n    step = {}\n    for t in schedule:\n        if step.get(t, 0) == 0:\n            seen[t] = count\n            step[t] = 1\n        else:\n            count = seen[t] + 1\n            step[t] = 2\n    return count\n',
    }),
  ],

  // ------------------------------------------------------------------ ao-3-locks
  'ao-3-locks': [
    ex('Mutual exclusion', 'A **lock** (or **mutex**) lets only **one** thread into a critical section at a time:\n\n```python\nlock = threading.Lock()\n\nwith lock:          # acquire: wait if another thread holds it\n    count += 1      # the critical section\n                    # released automatically at the end of "with"\n```\n\nOther threads that want the lock **wait** until it\'s released.'),
    mc('What does a mutex guarantee?', ['Only one thread at a time runs the protected code', 'Threads run faster', 'Threads never wait'], 0, 'Mutual exclusion.'),
    mc('Why use `with lock:` instead of calling acquire and release yourself?', ['It releases the lock even if an error happens', 'It\'s required by Python', 'It makes the lock faster'], 0, 'A lock that\'s never released freezes every other thread.'),
    ex('Semaphores', 'A **semaphore** is a counter-based lock that lets up to **N** threads in at once:\n\n- `acquire`: if the count is above 0, decrease it and go in; otherwise wait\n- `release`: increase the count\n\nPerfect for "at most 5 database connections at a time". A semaphore with N = 1 acts like a mutex.'),
    mc('A semaphore starts at 3. Four threads try to enter. How many get in right away?', ['3', '4', '1'], 0, 'The fourth waits until someone releases.'),
    mc('What\'s the cost of using locks everywhere?', ['Threads spend time waiting, so the program can become slow', 'Nothing'], 0, 'Keep critical sections short.'),
    py({
      prompt: 'Build a tiny **semaphore** (no real threads, just the counting logic). Write class `Semaphore(n)` with:\n\n- `try_acquire()`: if there\'s room, take a slot and return True; otherwise return False\n- `release()`: give a slot back',
      starter: 'class Semaphore:\n    pass\n',
      tests: [
        { name: 'allows n at once', code: 's = Semaphore(2)\nassert s.try_acquire() and s.try_acquire()\nassert not s.try_acquire(), "a third acquire should fail"' },
        { name: 'release frees a slot', code: 's = Semaphore(1)\ns.try_acquire()\ns.release()\nassert s.try_acquire(), "after release, acquire should work again"' },
      ],
      hints: ['def __init__(self, n): self.free = n', 'try_acquire: if self.free > 0, subtract 1 and return True; otherwise return False. release: self.free += 1'],
      solution: 'class Semaphore:\n    def __init__(self, n):\n        self.free = n\n\n    def try_acquire(self):\n        if self.free > 0:\n            self.free -= 1\n            return True\n        return False\n\n    def release(self):\n        self.free += 1\n',
    }),
  ],

  // ------------------------------------------------------------------ ao-3-deadlock
  'ao-3-deadlock': [
    ex('Everyone waiting forever', 'Thread 1 holds lock A and waits for lock B. Thread 2 holds B and waits for A. Neither can ever continue: a **deadlock**.\n\nIt needs **four conditions** at once:\n\n1. **Mutual exclusion**: resources can\'t be shared\n2. **Hold and wait**: a thread holds one resource while waiting for another\n3. **No preemption**: you can\'t forcibly take a lock away\n4. **Circular wait**: a cycle of threads, each waiting on the next'),
    mc('Thread 1 holds A and wants B; thread 2 holds B and wants A. This is…', ['a deadlock', 'a race condition', 'a memory leak'], 0, 'A circular wait.'),
    ex('Preventing deadlock', 'Break any one condition. The most practical fix: **always acquire locks in the same global order**. If every thread takes A before B, a cycle can\'t form.\n\nOther options: timeouts ("give up and retry"), or detecting cycles and restarting one thread.'),
    mc('What\'s the simplest, most common way to prevent deadlock?', ['Every thread acquires locks in the same order', 'Use more threads', 'Remove all locks'], 0, 'Lock ordering breaks circular wait.'),
    ex('Detection with a graph', 'Draw a **wait-for graph**: an arrow T1 → T2 means "T1 is waiting for something T2 holds".\n\nA **cycle** in the graph = a deadlock. (You learned cycle detection in Data Structures.)'),
    mc('Wait-for graph: T1 → T2, T2 → T3, T3 → T1. Deadlock?', ['Yes: there\'s a cycle', 'No'], 0, 'T1 → T2 → T3 → T1.'),
    py({
      prompt: 'Write `has_deadlock(waits)`. `waits` maps each thread to the thread it\'s waiting for (or `None`). Return True if following the arrows from **any** thread leads into a cycle.',
      starter: 'def has_deadlock(waits):\n    pass\n',
      tests: [eq('has_deadlock({"T1": "T2", "T2": "T1"})', 'True'), eq('has_deadlock({"T1": "T2", "T2": "T3", "T3": None})', 'False'), eq('has_deadlock({"T1": "T2", "T2": "T3", "T3": "T1", "T4": None})', 'True'), eq('has_deadlock({})', 'False')],
      hints: ['From each thread, follow waits[...] step by step, remembering the threads you\'ve visited on this walk.', 'If you reach a thread you already visited, it\'s a cycle → True. If you reach None (or a thread not in waits), this walk is fine.'],
      solution: 'def has_deadlock(waits):\n    for start in waits:\n        seen = set()\n        t = start\n        while t is not None and t in waits:\n            if t in seen:\n                return True\n            seen.add(t)\n            t = waits[t]\n    return False\n',
    }),
  ],

  // ------------------------------------------------------------------ ao-4-virtual-memory
  'ao-4-virtual-memory': [
    ex('Every process gets its own map', 'Each process sees its own private **virtual address space**, as if it owned all the memory. The hardware translates every virtual address to a **physical** RAM address.\n\nMemory is split into fixed-size **pages** (often 4 KB). A **page table** per process maps virtual page numbers to physical **frames**.\n\nBenefits: isolation (one process can\'t read another\'s memory), and every program can be loaded at the same virtual addresses.'),
    mc('Why can\'t one process read another\'s memory?', ['Each has its own page table mapping to different physical memory', 'Memory is encrypted', 'Processes take turns using all of RAM'], 0, 'Isolation through virtual memory.'),
    ex('Translating an address', 'With 4 KB (4096-byte) pages, a virtual address splits into:\n\n- **page number** = address ÷ 4096 (whole-number division)\n- **offset** = address % 4096\n\nLook up the page number in the page table to get the frame. Then the physical address = frame × 4096 + offset.'),
    ans('Page size 4096. What is the page number of virtual address 8200?', ['2'], '8200 ÷ 4096 = 2 remainder 8.'),
    ans('Same address 8200, and page 2 maps to frame 5. What is the physical address?', ['20488'], '5 × 4096 + 8 = 20488.'),
    ex('Page faults and the TLB', '- **Page fault**: the page isn\'t in RAM (maybe it was swapped to disk). The OS loads it, which is very slow.\n- **TLB**: a small cache of recent translations, so most lookups skip the page table.\n\nWhen RAM is overfull, the system spends all its time swapping pages in and out ("**thrashing**").'),
    mc('Your computer suddenly becomes extremely slow when too many apps are open, with the disk busy constantly. Likely cause?', ['Thrashing: pages constantly swapped between RAM and disk', 'The CPU is broken', 'A race condition'], 0, 'Not enough RAM for everything in use.'),
    py({
      prompt: 'Write `translate(vaddr, page_table, page_size=4096)` that returns the physical address. `page_table` maps page number → frame number. If the page isn\'t in the table, raise `KeyError` (a page fault).',
      starter: 'def translate(vaddr, page_table, page_size=4096):\n    pass\n',
      tests: [eq('translate(8200, {2: 5})', '20488'), eq('translate(100, {0: 3})', '12388'), eq('translate(10, {1: 7}, page_size=8)', '58'), { name: 'missing page raises KeyError', code: 'try:\n    translate(5000, {0: 1})\nexcept KeyError:\n    pass\nelse:\n    raise AssertionError("an unmapped page should raise KeyError (a page fault)")' }],
      hints: ['page = vaddr // page_size; offset = vaddr % page_size', 'return page_table[page] * page_size + offset  (a missing page raises KeyError by itself)'],
      solution: 'def translate(vaddr, page_table, page_size=4096):\n    page = vaddr // page_size\n    offset = vaddr % page_size\n    return page_table[page] * page_size + offset\n',
    }),
  ],

  // ------------------------------------------------------------------ ao-4-file-systems
  'ao-4-file-systems': [
    ex('From bytes to files', 'A disk is just a long row of numbered **blocks** (often 4 KB each). A **file system** turns those blocks into named files and folders.\n\nOn Unix-style systems, each file has an **inode** that stores:\n\n- size, owner, permissions and timestamps\n- **pointers to the blocks** holding the data\n\nThe file **name** isn\'t in the inode at all. It lives in a directory.'),
    mc('Where is a file\'s name stored on a Unix file system?', ['In the directory that contains it', 'In the file\'s inode', 'In the first block of the file'], 0, 'A directory is a list of (name → inode number) entries.'),
    ex('Directories and links', 'A **directory** is a special file listing names and their inode numbers.\n\nTwo names can point to the **same** inode: that\'s a **hard link**. The data is only deleted when the last name is removed.\n\nA **symbolic link** is different: a tiny file containing a **path** to another file (like a shortcut).'),
    mc('You delete one of two hard links to a file. What happens to the data?', ['It stays: the other name still points to the inode', 'It\'s deleted immediately'], 0, 'The inode counts its links.'),
    ex('Crashes and journaling', 'Power fails halfway through saving a file. Is the disk now corrupted?\n\nModern file systems use a **journal**: write down what you\'re about to do, then do it. After a crash, replay or discard the half-finished steps. (Same idea as database transactions!)'),
    mc('What does journaling protect against?', ['A crash leaving the file system half-updated and corrupted', 'Viruses', 'Running out of space'], 0, 'All-or-nothing updates, like ACID transactions.'),
    ans('A file is 10,000 bytes and blocks are 4,096 bytes. How many blocks does it use?', ['3'], '10,000 ÷ 4,096 ≈ 2.44, rounded up to 3 blocks. The last one is partly empty.'),
    py({
      prompt: 'Write `blocks_needed(size, block_size=4096)`: how many blocks a file of `size` bytes uses. An empty file uses 0 blocks.',
      starter: 'def blocks_needed(size, block_size=4096):\n    pass\n',
      tests: [eq('blocks_needed(10000)', '3'), eq('blocks_needed(4096)', '1'), eq('blocks_needed(0)', '0'), eq('blocks_needed(1)', '1')],
      hints: ['Round up without math.ceil: (size + block_size - 1) // block_size'],
      solution: 'def blocks_needed(size, block_size=4096):\n    return (size + block_size - 1) // block_size\n',
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'ao-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('OR gate, inputs 0 and 0. Output?', ['0'], 'Needs at least one 1.'),
      ans('Half adder, A = 1, B = 0. What is the sum bit?', ['1'], '1 XOR 0.'),
      mc('The CPU loop is…', ['fetch, decode, execute', 'compile, link, run'], 0, 'The instruction cycle.'),
      mc('Pipelining improves…', ['throughput', 'single-instruction speed'], 0, 'Overlap.'),
      mc('Fastest memory?', ['registers', 'RAM', 'SSD'], 0, 'Inside the CPU.'),
      mc('Reading an array in order is fast because of…', ['spatial locality', 'branch prediction'], 0, 'Cache lines.'),
      py({ prompt: 'Write `nand(a, b)` for bits, using only & and ^ (hint: x ^ 1 flips a bit).', starter: 'def nand(a, b):\n    pass\n', tests: [eq('nand(1, 1)', '0'), eq('nand(0, 1)', '1'), eq('nand(0, 0)', '1')], solution: 'def nand(a, b):\n    return (a & b) ^ 1\n' }),
    ],
  },
  'ao-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('A running program is a…', ['process', 'file'], 0, 'Process.'),
      mc('Waiting for the network, a process is…', ['blocked', 'running'], 0, 'Blocked.'),
      mc('Threads in one process share…', ['the heap', 'nothing'], 0, 'Shared memory.'),
      mc('Programs ask the OS for services through…', ['system calls', 'comments'], 0, 'Syscalls.'),
      mc('Round robin gives each job…', ['a time slice in turn', 'the CPU until it finishes'], 0, 'Turns.'),
      mc('FCFS behind one huge job causes…', ['the convoy effect', 'deadlock'], 0, 'Everyone waits.'),
    ],
  },
  'ao-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('A bug that depends on thread timing is a…', ['race condition', 'syntax error'], 0, 'Race.'),
      mc('A mutex allows how many threads in at once?', ['1', 'unlimited'], 0, 'Mutual exclusion.'),
      mc('A semaphore of 4 allows…', ['up to 4 at once', 'exactly 1'], 0, 'A counter.'),
      mc('Deadlock requires…', ['circular wait (plus three other conditions)', 'only one thread'], 0, 'Four conditions.'),
      mc('Acquiring locks in a fixed order prevents…', ['deadlock', 'all bugs'], 0, 'No cycles.'),
      py({ prompt: 'Write `safe_increment(counter, lock)`: inside `with lock:`, add 1 to `counter["n"]`.', starter: 'def safe_increment(counter, lock):\n    pass\n', tests: [{ name: 'increments under the lock', code: 'import threading\nc = {"n": 0}\nlk = threading.Lock()\nsafe_increment(c, lk); safe_increment(c, lk)\nassert c["n"] == 2 and "with lock" in __source__, "Use with lock: around the update"' }], solution: 'def safe_increment(counter, lock):\n    with lock:\n        counter["n"] += 1\n' }),
    ],
  },
  'ao-4': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('Page size 1000, virtual address 2345. Page number?', ['2'], '2345 ÷ 1000.'),
      ans('Same address, offset?', ['345'], '2345 % 1000.'),
      mc('A page fault means…', ['the page isn\'t in RAM yet', 'a bug in the page table'], 0, 'Load it.'),
      mc('The TLB caches…', ['address translations', 'files'], 0, 'Fast lookups.'),
      mc('A file\'s inode stores…', ['metadata and block pointers', 'its name'], 0, 'Names live in directories.'),
      mc('Journaling protects against…', ['crashes mid-update', 'viruses'], 0, 'Like transactions.'),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  'architecture-os': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('AND gate, inputs 1 and 1. Output?', ['1'], 'Both are 1.'),
      ans('5-stage pipeline, 10 instructions, no stalls. Clock ticks?', ['14'], '5 + 9.'),
      mc('LRU evicts…', ['the least recently used item', 'the newest item'], 0, 'LRU.'),
      mc('Two separate processes share…', ['nothing by default', 'their heap'], 0, 'Isolation.'),
      mc('Concurrency on a single core is…', ['taking turns', 'true parallelism'], 0, 'Interleaving.'),
      mc('count += 1 from two threads without a lock can…', ['lose updates', 'double the count'], 0, 'Race.'),
      mc('A cycle in the wait-for graph means…', ['deadlock', 'thrashing'], 0, 'Circular wait.'),
      ans('Page size 4096, page 1 → frame 3, virtual address 4100. Physical address?', ['12292'], '3 × 4096 + 4.'),
      mc('A hard link is…', ['another name for the same inode', 'a shortcut containing a path'], 0, 'Same inode.'),
      py({ prompt: 'Write `fcfs_waits(lengths)`: with first-come-first-served, return a list of how long each job WAITS before starting.', starter: 'def fcfs_waits(lengths):\n    pass\n', tests: [eq('fcfs_waits([5, 2, 1])', '[0, 5, 7]'), eq('fcfs_waits([])', '[]')], hints: ['Keep a running total of time used so far.'], solution: 'def fcfs_waits(lengths):\n    waits, t = [], 0\n    for n in lengths:\n        waits.append(t)\n        t += n\n    return waits\n' }),
    ],
  },
};
