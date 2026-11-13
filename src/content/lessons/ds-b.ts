/**
 * Track: data-structures — "Data Structures"
 * Written here: ds-4 (trees), ds-5 (heaps), ds-6 (graphs, tries, union-find) + checkpoints + final exam
 */
import type { Checkpoint, Step } from '../types';
import { ans, eq, ex, fast, mc, py } from './_helpers';

const TREE = 'class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\n';
// The example tree used across lessons:
//        4
//       / \
//      2   6
//     / \   \
//    1   3   7
const EXAMPLE = 'T = TreeNode(4, TreeNode(2, TreeNode(1), TreeNode(3)), TreeNode(6, None, TreeNode(7)))';
const PICTURE = '```text\n        4\n       / \\\n      2   6\n     / \\   \\\n    1   3   7\n```';

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ ds-4-binary-trees
  'ds-4-binary-trees': [
    ex('Trees in code', 'A **binary tree** is made of nodes that each have a value and up to **two children**, `left` and `right`:\n\n```python\nclass TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n```\n\n' + PICTURE + '\n\nThe top node is the **root**; nodes without children are **leaves**.'),
    ans('In the tree above, how many leaves are there?', ['3'], '1, 3 and 7 have no children.'),
    ans('What is the height of that tree (edges on the longest root-to-leaf path)?', ['2'], '4 → 2 → 1 is two edges.'),
    ex('Recursion fits trees perfectly', 'A tree is a node plus two **smaller trees**. So most tree functions are a few lines of recursion:\n\n```python\ndef size(node):\n    if node is None:          # base case: empty tree\n        return 0\n    return 1 + size(node.left) + size(node.right)\n```'),
    py({
      prompt: 'Write `tree_sum(node)` that returns the sum of all values in a binary tree (0 for an empty tree).',
      starter: TREE + 'def tree_sum(node):\n    pass\n',
      tests: [{ name: 'sums the example tree', code: EXAMPLE + '\nassert tree_sum(T) == 23, f"got {tree_sum(T)}"' }, eq('tree_sum(None)', '0')],
      hints: ['if node is None: return 0', 'return node.val + tree_sum(node.left) + tree_sum(node.right)'],
      solution: TREE + 'def tree_sum(node):\n    if node is None:\n        return 0\n    return node.val + tree_sum(node.left) + tree_sum(node.right)\n',
    }),
    py({
      prompt: 'Write `height(node)`: the number of **edges** on the longest path from the node down to a leaf. A single node has height 0; use -1 for an empty tree.',
      starter: TREE + 'def height(node):\n    pass\n',
      tests: [{ name: 'example tree has height 2', code: EXAMPLE + '\nassert height(T) == 2' }, eq('height(None)', '-1'), eq('height(TreeNode(1))', '0'), { name: 'a long chain', code: 'n = None\nfor i in range(50):\n    n = TreeNode(i, n)\nassert height(n) == 49' }],
      hints: ['Empty → -1. Otherwise 1 + max(height(left), height(right)).'],
      solution: TREE + 'def height(node):\n    if node is None:\n        return -1\n    return 1 + max(height(node.left), height(node.right))\n',
    }),
    py({
      prompt: 'Write `mirror(node)` that swaps every node\'s left and right children (in place) and returns the root.',
      starter: TREE + 'def mirror(node):\n    pass\n',
      tests: [{ name: 'mirrors the example tree', code: EXAMPLE + '\nm = mirror(T)\nassert m.val == 4 and m.left.val == 6 and m.right.val == 2 and m.left.left.val == 7 and m.right.left.val == 3 and m.right.right.val == 1' }, eq('mirror(None)', 'None')],
      hints: ['Swap: node.left, node.right = node.right, node.left — then mirror both children.'],
      solution: TREE + 'def mirror(node):\n    if node is None:\n        return None\n    node.left, node.right = node.right, node.left\n    mirror(node.left)\n    mirror(node.right)\n    return node\n',
    }),
  ],

  // ------------------------------------------------------------------ ds-4-traversals
  'ds-4-traversals': [
    ex('Visiting every node', 'There are four standard orders for visiting a tree:\n\n- **Pre-order:** node, then left, then right\n- **In-order:** left, then node, then right\n- **Post-order:** left, then right, then node\n- **Level-order:** row by row from the top (uses a queue — this is BFS)\n\n' + PICTURE),
    ans('Pre-order traversal of the tree? (values separated by spaces)', ['4 2 1 3 6 7'], 'Node first: 4, then the whole left subtree (2 1 3), then the right (6 7).'),
    ans('In-order traversal? (values separated by spaces)', ['1 2 3 4 6 7'], 'Left, node, right. Notice it comes out sorted — that\'s no accident (next lesson!).'),
    ans('Post-order traversal? (values separated by spaces)', ['1 3 2 7 6 4'], 'Children before parent: the root comes last.'),
    ans('Level-order traversal? (values separated by spaces)', ['4 2 6 1 3 7'], 'Row by row: 4 | 2 6 | 1 3 7.'),
    py({
      prompt: 'Write `inorder(node)` that returns a list of values in **in-order** (left, node, right), recursively.',
      starter: TREE + 'def inorder(node):\n    pass\n',
      tests: [{ name: 'example tree', code: EXAMPLE + '\nassert inorder(T) == [1, 2, 3, 4, 6, 7]' }, eq('inorder(None)', '[]')],
      hints: ['if node is None: return []', 'return inorder(node.left) + [node.val] + inorder(node.right)'],
      solution: TREE + 'def inorder(node):\n    if node is None:\n        return []\n    return inorder(node.left) + [node.val] + inorder(node.right)\n',
    }),
    py({
      prompt: 'Write `level_order(root)` returning a list of levels, each a list of values: the example tree gives `[[4], [2, 6], [1, 3, 7]]`. Use a `deque` as a queue.',
      starter: 'from collections import deque\n\n' + TREE + 'def level_order(root):\n    pass\n',
      tests: [{ name: 'example tree', code: EXAMPLE + '\nassert level_order(T) == [[4], [2, 6], [1, 3, 7]]' }, eq('level_order(None)', '[]')],
      hints: ['q = deque([root]); while q: process exactly len(q) nodes — that\'s one level.', 'For each node, append its value to this level and enqueue its non-None children.'],
      solution: 'from collections import deque\n\n' + TREE + 'def level_order(root):\n    if root is None:\n        return []\n    levels = []\n    q = deque([root])\n    while q:\n        level = []\n        for _ in range(len(q)):\n            node = q.popleft()\n            level.append(node.val)\n            if node.left:\n                q.append(node.left)\n            if node.right:\n                q.append(node.right)\n        levels.append(level)\n    return levels\n',
    }),
  ],

  // ------------------------------------------------------------------ ds-4-bst
  'ds-4-bst': [
    ex('Binary search trees', 'A **binary search tree (BST)** keeps one rule at every node:\n\n**everything in the left subtree < node < everything in the right subtree**\n\nThe example tree is a BST. To search, compare and go left or right — like binary search:\n\n```python\ndef contains(node, x):\n    while node:\n        if x == node.val:\n            return True\n        node = node.left if x < node.val else node.right\n    return False\n```\n\nEach step drops a whole subtree, so search takes **O(height)**.'),
    mc('Searching for 3 in the example BST visits which nodes?', ['4, 2, 3', '4, 6, 3', '1, 2, 3', 'All six'], 0, '3 < 4 → left to 2; 3 > 2 → right to 3. Found.'),
    mc('Why does in-order traversal of a BST come out sorted?', ['Coincidence', 'Left subtree (smaller) comes before the node, which comes before the right subtree (bigger)', 'Python sorts it'], 1, 'The BST rule and the in-order rule line up.'),
    py({
      prompt: 'Write `insert(node, x)` that inserts x into a BST and returns the root (create a new node when you reach an empty spot). Ignore duplicates.',
      starter: TREE + 'def inorder(node):\n    return inorder(node.left) + [node.val] + inorder(node.right) if node else []\n\ndef insert(node, x):\n    pass\n',
      tests: [
        { name: 'builds a valid BST', code: 'root = None\nfor x in [5, 3, 8, 1, 4, 9, 7]:\n    root = insert(root, x)\nassert inorder(root) == [1, 3, 4, 5, 7, 8, 9] and root.val == 5' },
        { name: 'ignores duplicates', code: 'root = None\nfor x in [2, 2, 1]:\n    root = insert(root, x)\nassert inorder(root) == [1, 2]' },
      ],
      hints: ['if node is None: return TreeNode(x)', 'if x < node.val: node.left = insert(node.left, x) — similarly for right. return node'],
      solution: TREE + 'def inorder(node):\n    return inorder(node.left) + [node.val] + inorder(node.right) if node else []\n\ndef insert(node, x):\n    if node is None:\n        return TreeNode(x)\n    if x < node.val:\n        node.left = insert(node.left, x)\n    elif x > node.val:\n        node.right = insert(node.right, x)\n    return node\n',
    }),
    py({
      prompt: 'Write `is_bst(node)` that checks the BST rule for the **whole** subtree, not just each node\'s children. (Trap: a node deep in the left subtree must still be smaller than the root!) Pass down a `low` and `high` limit.',
      starter: TREE + 'def is_bst(node, low=float("-inf"), high=float("inf")):\n    pass\n',
      tests: [
        { name: 'the example tree is a BST', code: EXAMPLE + '\nassert is_bst(T)' },
        { name: 'catches a deep violation', code: 'bad = TreeNode(5, TreeNode(3, None, TreeNode(6)), TreeNode(8))\nassert not is_bst(bad), "6 is in 5\'s LEFT subtree, so this isn\'t a BST"' },
        eq('is_bst(None)', 'True'),
      ],
      hints: ['if node is None: return True', 'The value must satisfy low < node.val < high; recurse left with high = node.val and right with low = node.val.'],
      solution: TREE + 'def is_bst(node, low=float("-inf"), high=float("inf")):\n    if node is None:\n        return True\n    if not (low < node.val < high):\n        return False\n    return is_bst(node.left, low, node.val) and is_bst(node.right, node.val, high)\n',
    }),
    mc('You insert 1, 2, 3, 4, 5 (in that order) into an empty BST. What shape do you get?', ['A balanced tree of height 2', 'A "stick" leaning right — basically a linked list', 'A full tree'], 1, 'Each new value is bigger, so it always goes right. Height 4 — search becomes O(n).'),
  ],

  // ------------------------------------------------------------------ ds-4-balanced
  'ds-4-balanced': [
    ex('Keeping trees short', 'BST operations cost **O(height)**. A balanced tree with n nodes has height about **log₂ n** (1 million nodes → about 20 levels). But insert sorted data and you get a stick of height n.\n\n**Self-balancing trees** fix this automatically after inserts and deletes:\n\n- **AVL trees:** at every node, the left and right heights differ by at most 1\n- **Red-black trees:** a coloring rule that keeps the longest path at most twice the shortest\n\nBoth guarantee **O(log n)** search, insert and delete.'),
    ans('A perfectly balanced BST holds about 1,000,000 values. About how many levels does a search walk through?', ['20'], '2²⁰ ≈ 1,048,576, so about 20.'),
    ex('Rotations', 'Balancing works with **rotations** — local rearrangements that keep the BST order but change heights:\n\n```text\n  Right rotation at 3:\n\n      3            2\n     /            / \\\n    2      →     1   3\n   /\n  1\n```\n\nThe in-order sequence (1, 2, 3) is unchanged — only the shape.'),
    mc('Where are balanced trees used?', ['Nowhere — hash tables replaced them', 'Database indexes, Java\'s TreeMap, C++\'s std::map, Linux\'s scheduler', 'Only in textbooks'], 1, 'Unlike hash tables, balanced trees keep keys in sorted order, so they also support "find everything between A and B".'),
    mc('Hash table vs balanced BST: which supports "list all keys between 10 and 20" efficiently?', ['Hash table', 'Balanced BST'], 1, 'BSTs keep order; hashing scatters keys.'),
    py({
      prompt: 'Write `is_balanced(node)` (AVL rule: at every node, left and right heights differ by at most 1). For speed, compute heights and balance in **one** recursive pass: have a helper return the height, or -2 to mean "unbalanced".',
      starter: TREE + 'def is_balanced(node):\n    pass\n',
      tests: [
        { name: 'example tree is balanced', code: EXAMPLE + '\nassert is_balanced(T)' },
        { name: 'a stick is not', code: 'assert not is_balanced(TreeNode(1, None, TreeNode(2, None, TreeNode(3))))' },
        eq('is_balanced(None)', 'True'),
        { name: 'checks every node, not just the root', code: 'left = TreeNode(2, TreeNode(3, TreeNode(4)))\nright = TreeNode(2, None, TreeNode(3, None, TreeNode(4)))\nassert not is_balanced(TreeNode(1, left, right))' },
      ],
      hints: ['def h(n): if n is None: return -1; a = h(n.left); b = h(n.right); if a == -2 or b == -2 or abs(a - b) > 1: return -2; return 1 + max(a, b)', 'return h(node) != -2'],
      solution: TREE + 'def is_balanced(node):\n    def h(n):\n        if n is None:\n            return -1\n        a, b = h(n.left), h(n.right)\n        if a == -2 or b == -2 or abs(a - b) > 1:\n            return -2\n        return 1 + max(a, b)\n    return h(node) != -2\n',
    }),
    py({
      prompt: 'Build a **balanced** BST from a sorted list: the middle element becomes the root, the left half becomes the left subtree, the right half the right subtree. Write `from_sorted(nums)`.',
      starter: TREE + 'def inorder(node):\n    return inorder(node.left) + [node.val] + inorder(node.right) if node else []\n\ndef height(node):\n    return -1 if node is None else 1 + max(height(node.left), height(node.right))\n\ndef from_sorted(nums):\n    pass\n',
      tests: [{ name: 'keeps order', code: 'assert inorder(from_sorted([1, 2, 3, 4, 5, 6, 7])) == [1, 2, 3, 4, 5, 6, 7]' }, { name: 'is short (height 2 for 7 items)', code: 'assert height(from_sorted(list(range(7)))) == 2' }, { name: '1,000 items → height under 10', code: 'assert height(from_sorted(list(range(1000)))) <= 9' }, eq('from_sorted([])', 'None')],
      hints: ['if not nums: return None', 'mid = len(nums) // 2; return TreeNode(nums[mid], from_sorted(nums[:mid]), from_sorted(nums[mid + 1:]))'],
      solution: TREE + 'def inorder(node):\n    return inorder(node.left) + [node.val] + inorder(node.right) if node else []\n\ndef height(node):\n    return -1 if node is None else 1 + max(height(node.left), height(node.right))\n\ndef from_sorted(nums):\n    if not nums:\n        return None\n    mid = len(nums) // 2\n    return TreeNode(nums[mid], from_sorted(nums[:mid]), from_sorted(nums[mid + 1:]))\n',
    }),
  ],

  // ------------------------------------------------------------------ ds-5-heaps
  'ds-5-heaps': [
    ex('Always grab the smallest', 'A **min-heap** is a binary tree where **every parent ≤ its children**, so the **smallest item is always at the root**.\n\n- peek at the min: **O(1)**\n- insert: **O(log n)** (add at the bottom, "bubble up")\n- remove the min: **O(log n)** (move the last item to the root, "sift down")\n\nIt\'s not fully sorted — just sorted enough to always know the minimum.'),
    ex('Stored in a plain list', 'Heaps are complete trees (filled level by level), so they fit neatly in a list — no pointers needed:\n\n- children of index i: **2i + 1** and **2i + 2**\n- parent of index i: **(i − 1) // 2**\n\n```text\nlist:  [1, 3, 2, 7, 4]\n\ntree:      1\n          / \\\n         3   2\n        / \\\n       7   4\n```'),
    ans('In a heap stored as a list, what is the index of the parent of index 4?', ['1'], '(4 − 1) // 2 = 1.'),
    mc('Is [1, 3, 2, 7, 4] a valid min-heap?', ['Yes — every parent is ≤ its children', 'No — it isn\'t sorted'], 0, '1 ≤ 3, 1 ≤ 2, 3 ≤ 7, 3 ≤ 4. Heaps don\'t need to be sorted.'),
    py({
      prompt: 'Write `is_min_heap(a)` that checks the heap property for a list using the index formulas.',
      starter: 'def is_min_heap(a):\n    pass\n',
      tests: [eq('is_min_heap([1, 3, 2, 7, 4])', 'True'), eq('is_min_heap([1, 3, 2, 0])', 'False'), eq('is_min_heap([])', 'True'), eq('is_min_heap([5, 5, 5])', 'True')],
      hints: ['For every index i ≥ 1, check a[(i - 1) // 2] <= a[i].'],
      solution: 'def is_min_heap(a):\n    return all(a[(i - 1) // 2] <= a[i] for i in range(1, len(a)))\n',
    }),
    py({
      prompt: 'Implement `heap_push(heap, x)`: append x, then **bubble it up** — while it\'s smaller than its parent, swap them. (Don\'t use heapq.)',
      starter: 'def heap_push(heap, x):\n    pass\n',
      tests: [{ name: 'keeps the heap property', code: 'import random\nrandom.seed(3)\nh = []\nfor _ in range(500):\n    heap_push(h, random.randint(0, 999))\nassert all(h[(i - 1) // 2] <= h[i] for i in range(1, len(h))) and len(h) == 500' }, { name: 'smallest is at the front', code: 'h = []\nfor x in [5, 9, 2, 7, 1]:\n    heap_push(h, x)\nassert h[0] == 1' }, { name: 'no heapq', code: 'assert "heapq" not in __source__' }],
      hints: ['heap.append(x); i = len(heap) - 1', 'while i > 0 and heap[i] < heap[(i - 1) // 2]: swap them and move i to the parent.'],
      solution: 'def heap_push(heap, x):\n    heap.append(x)\n    i = len(heap) - 1\n    while i > 0:\n        p = (i - 1) // 2\n        if heap[i] >= heap[p]:\n            break\n        heap[i], heap[p] = heap[p], heap[i]\n        i = p\n',
    }),
  ],

  // ------------------------------------------------------------------ ds-5-priority-queues
  'ds-5-priority-queues': [
    ex('heapq: Python\'s heap', '```python\nimport heapq\nh = []\nheapq.heappush(h, 5)\nheapq.heappush(h, 1)\nheapq.heappush(h, 3)\nheapq.heappop(h)     # 1 — always the smallest\nheapq.heapify(nums)  # turn a list into a heap in O(n)\n```\n\nA **priority queue** serves the most important item first (ER triage, task schedulers, Dijkstra\'s algorithm). Push `(priority, item)` tuples — tuples compare by their first element.'),
    ans('What does this print?', ['2'], 'heappop returns the smallest.', 'import heapq\nh = [7, 2, 9]\nheapq.heapify(h)\nprint(heapq.heappop(h))'),
    mc('heapq is a MIN-heap. How do you get the LARGEST item first?', ['You can\'t', 'Push negated values (−x) and negate again when popping', 'Use heapq.reverse()'], 1, 'Negating flips the order. (Or use heapq.nlargest for a one-off.)'),
    py({
      prompt: '**Top k:** return the k largest numbers in descending order, in O(n log k): keep a min-heap of size k — push each number, and if the heap grows past k, pop the smallest.',
      starter: 'import heapq\n\ndef top_k(nums, k):\n    pass\n',
      tests: [eq('top_k([5, 1, 9, 3, 7], 2)', '[9, 7]'), eq('top_k([1, 2], 5)', '[2, 1]'), eq('top_k([], 3)', '[]'), { name: 'uses a heap (not sorted/nlargest)', code: 'assert "heappush" in __source__ and "nlargest" not in __source__ and "sorted(nums" not in __source__' }],
      hints: ['for x in nums: heapq.heappush(h, x); if len(h) > k: heapq.heappop(h)', 'At the end the heap holds the k largest: return sorted(h, reverse=True)'],
      solution: 'import heapq\n\ndef top_k(nums, k):\n    h = []\n    for x in nums:\n        heapq.heappush(h, x)\n        if len(h) > k:\n            heapq.heappop(h)\n    return sorted(h, reverse=True)\n',
    }),
    py({
      prompt: '**Merge k sorted lists** into one sorted list using a heap of `(value, list_index, position)` tuples. Total time O(N log k).',
      starter: 'import heapq\n\ndef merge_k(lists):\n    pass\n',
      tests: [eq('merge_k([[1, 4, 7], [2, 5], [3, 6, 9]])', '[1, 2, 3, 4, 5, 6, 7, 9]'), eq('merge_k([[], [1]])', '[1]'), eq('merge_k([])', '[]'), { name: 'no sort/sorted', code: 'assert "sort" not in __source__' }],
      hints: ['Start the heap with (lst[0], i, 0) for each non-empty list.', 'Pop the smallest, append it, and push the next item from the same list if there is one.'],
      solution: 'import heapq\n\ndef merge_k(lists):\n    h = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]\n    heapq.heapify(h)\n    out = []\n    while h:\n        val, i, j = heapq.heappop(h)\n        out.append(val)\n        if j + 1 < len(lists[i]):\n            heapq.heappush(h, (lists[i][j + 1], i, j + 1))\n    return out\n',
    }),
    py({
      prompt: '**Task scheduler:** `tasks` is a list of `(priority, name)` where a **lower number = more urgent**. Return the names in the order they\'d be done. Ties: alphabetical by name.',
      starter: 'import heapq\n\ndef schedule(tasks):\n    pass\n',
      tests: [eq('schedule([(2, "email"), (1, "fire"), (3, "lunch"), (1, "alarm")])', '["alarm", "fire", "email", "lunch"]'), eq('schedule([])', '[]')],
      hints: ['heapq.heapify(list(tasks)) — tuples compare priority first, then name.', 'Pop until empty, collecting names.'],
      solution: 'import heapq\n\ndef schedule(tasks):\n    h = list(tasks)\n    heapq.heapify(h)\n    return [heapq.heappop(h)[1] for _ in range(len(h))]\n',
    }),
  ],

  // ------------------------------------------------------------------ ds-6-representation
  'ds-6-representation': [
    ex('Graphs in memory', 'Two common ways to store a graph with V vertices and E edges:\n\n**Adjacency list** — each vertex maps to its neighbors:\n```python\ngraph = {"A": ["B", "C"], "B": ["A"], "C": ["A"]}\n```\n**Adjacency matrix** — a V × V grid; `matrix[i][j] = 1` if there\'s an edge:\n```python\n#      A  B  C\nm = [[0, 1, 1],   # A\n     [1, 0, 0],   # B\n     [1, 0, 0]]   # C\n```'),
    ex('Which to use?', '| | Adjacency list | Adjacency matrix |\n|---|---|---|\n| Memory | O(V + E) | O(V²) |\n| "Is there an edge u–v?" | O(degree) | **O(1)** |\n| List u\'s neighbors | **O(degree)** | O(V) |\n\nMost real graphs (roads, social networks) are **sparse** — far fewer edges than V² — so adjacency lists are the default.'),
    mc('A social network has 1 billion users with ~200 friends each. Which representation?', ['Adjacency matrix', 'Adjacency list'], 1, 'A matrix would need 10¹⁸ cells; lists need about 2 × 10¹¹ entries.'),
    ans('An undirected graph has 5 vertices. How many cells does its adjacency matrix have?', ['25'], '5 × 5.'),
    py({
      prompt: 'Write `build_graph(edges)` that turns a list of undirected edges like `[("A", "B"), ("A", "C")]` into an adjacency dict of **sorted** neighbor lists.',
      starter: 'def build_graph(edges):\n    pass\n',
      tests: [eq('build_graph([("A", "B"), ("A", "C")])', '{"A": ["B", "C"], "B": ["A"], "C": ["A"]}'), eq('build_graph([])', '{}')],
      hints: ['from collections import defaultdict; g = defaultdict(list)', 'For each (u, v): append v to g[u] and u to g[v]. Then sort each list and return a dict.'],
      solution: 'from collections import defaultdict\n\ndef build_graph(edges):\n    g = defaultdict(list)\n    for u, v in edges:\n        g[u].append(v)\n        g[v].append(u)\n    return {k: sorted(v) for k, v in g.items()}\n',
    }),
    py({
      prompt: 'Write `to_matrix(graph, order)`: given an adjacency dict and a list giving the vertex order, return the adjacency matrix (list of lists of 0/1).',
      starter: 'def to_matrix(graph, order):\n    pass\n',
      tests: [eq('to_matrix({"A": ["B", "C"], "B": ["A"], "C": ["A"]}, ["A", "B", "C"])', '[[0, 1, 1], [1, 0, 0], [1, 0, 0]]')],
      hints: ['index = {v: i for i, v in enumerate(order)}', 'm = [[0] * n for _ in range(n)] — NOT [[0] * n] * n, which repeats the same row!'],
      solution: 'def to_matrix(graph, order):\n    index = {v: i for i, v in enumerate(order)}\n    n = len(order)\n    m = [[0] * n for _ in range(n)]\n    for u, nbrs in graph.items():\n        for v in nbrs:\n            m[index[u]][index[v]] = 1\n    return m\n',
    }),
  ],

  // ------------------------------------------------------------------ ds-6-tries
  'ds-6-tries': [
    ex('Prefix trees', 'A **trie** stores words letter by letter along paths from the root. Words sharing a prefix share a path:\n\n```text\n(root)\n  └ c\n    └ a\n      ├ t ✓          "cat"\n      └ r ✓          "car"\n        └ t ✓        "cart"\n```\n\n✓ marks "a word ends here". Looking up a word of length L takes **O(L)** — no matter how many words are stored.', 'Autocomplete, spell-checkers and IP routing tables all use tries.'),
    mc('Why is a trie great for autocomplete?', ['It stores words alphabetically in a list', 'All words starting with a prefix live under that prefix\'s node', 'It compresses words'], 1, 'Walk down the prefix, then collect everything below.'),
    ex('A trie with dicts', '```python\nclass Trie:\n    def __init__(self):\n        self.root = {}\n\n    def insert(self, word):\n        node = self.root\n        for ch in word:\n            node = node.setdefault(ch, {})\n        node["$"] = True     # end-of-word marker\n```'),
    py({
      prompt: 'Finish the trie: add `contains(word)` (exact word stored?) and `starts_with(prefix)` (any word with that prefix?).',
      starter: 'class Trie:\n    def __init__(self):\n        self.root = {}\n\n    def insert(self, word):\n        node = self.root\n        for ch in word:\n            node = node.setdefault(ch, {})\n        node["$"] = True\n',
      tests: [{ name: 'contains vs starts_with', code: 't = Trie()\nfor w in ["cat", "car", "cart"]:\n    t.insert(w)\nassert t.contains("car") and t.contains("cart") and not t.contains("ca")\nassert t.starts_with("ca") and t.starts_with("cart") and not t.starts_with("dog")' }, { name: 'empty trie', code: 't = Trie()\nassert not t.contains("a") and t.starts_with("")' }],
      hints: ['Write a helper that walks down the letters and returns the final node or None.', 'contains: node is not None and "$" in node. starts_with: node is not None.'],
      solution: 'class Trie:\n    def __init__(self):\n        self.root = {}\n\n    def insert(self, word):\n        node = self.root\n        for ch in word:\n            node = node.setdefault(ch, {})\n        node["$"] = True\n\n    def _walk(self, s):\n        node = self.root\n        for ch in s:\n            if ch not in node:\n                return None\n            node = node[ch]\n        return node\n\n    def contains(self, word):\n        node = self._walk(word)\n        return node is not None and "$" in node\n\n    def starts_with(self, prefix):\n        return self._walk(prefix) is not None\n',
    }),
    py({
      prompt: 'Write `autocomplete(words, prefix)` returning all words that start with `prefix`, **sorted**, by building a trie and collecting every word below the prefix node.',
      starter: 'def autocomplete(words, prefix):\n    pass\n',
      tests: [eq('autocomplete(["car", "cart", "cat", "dog"], "car")', '["car", "cart"]'), eq('autocomplete(["a", "b"], "z")', '[]'), eq('autocomplete(["hi", "hello", "help"], "he")', '["hello", "help"]'), { name: 'builds a trie (no startswith)', code: 'assert "startswith" not in __source__' }],
      hints: ['Insert all words into a dict-of-dicts trie with a "$" end marker.', 'Walk down the prefix, then DFS below it, building up the letters; when you see "$", record prefix + letters.'],
      solution: 'def autocomplete(words, prefix):\n    root = {}\n    for w in words:\n        node = root\n        for ch in w:\n            node = node.setdefault(ch, {})\n        node["$"] = True\n    node = root\n    for ch in prefix:\n        if ch not in node:\n            return []\n        node = node[ch]\n    out = []\n    def collect(n, path):\n        for key, child in n.items():\n            if key == "$":\n                out.append(prefix + path)\n            else:\n                collect(child, path + key)\n    collect(node, "")\n    return sorted(out)\n',
    }),
  ],

  // ------------------------------------------------------------------ ds-6-union-find
  'ds-6-union-find': [
    ex('Who is connected to whom?', '**Union–find** (also called *disjoint set union*) tracks groups that merge over time:\n\n- **find(x):** which group is x in? (returns the group\'s representative, its "root")\n- **union(a, b):** merge the groups of a and b\n\nEach item points to a parent; following parents leads to the root. Two items are in the same group if they have the same root.'),
    ex('Two tricks make it nearly O(1)', '- **Path compression:** during find, point every visited node straight at the root\n- **Union by size/rank:** attach the smaller tree under the bigger one\n\nTogether, each operation is so close to O(1) that the difference only matters in theory (it\'s the inverse Ackermann function — under 5 for any realistic input).'),
    mc('Union–find is the perfect tool for…', ['Sorting numbers', 'Detecting whether adding a road connects two already-connected cities (creating a cycle)', 'Finding the shortest path'], 1, 'If find(a) == find(b) already, the new edge closes a cycle. Kruskal\'s MST algorithm relies on this.'),
    py({
      prompt: 'Implement class `UnionFind(n)` for items 0..n−1 with `find(x)` (with path compression), `union(a, b)` (returns False if already in the same group, else merges and returns True), and `groups()` (the number of separate groups).',
      starter: 'class UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.count = n\n',
      tests: [
        { name: 'merging groups', code: 'u = UnionFind(5)\nassert u.union(0, 1) and u.union(3, 4)\nassert u.groups() == 3\nassert u.find(0) == u.find(1) and u.find(0) != u.find(3)\nassert not u.union(1, 0), "already connected → False"' },
        fast('u = UnionFind(200000)', 'for i in range(199999):\n    u.union(i, i + 1)\nfor i in range(200000):\n    u.find(i)\nassert u.groups() == 1', 2.5, 'fast with 200,000 items (needs path compression)'),
      ],
      hints: ['find: if parent[x] != x: parent[x] = find(parent[x]); return parent[x]  (careful — very deep recursion; an iterative loop is safer)', 'union: ra, rb = find(a), find(b); if same return False; parent[ra] = rb; count -= 1; return True'],
      solution: 'class UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.size = [1] * n\n        self.count = n\n\n    def find(self, x):\n        root = x\n        while self.parent[root] != root:\n            root = self.parent[root]\n        while self.parent[x] != root:\n            self.parent[x], x = root, self.parent[x]\n        return root\n\n    def union(self, a, b):\n        ra, rb = self.find(a), self.find(b)\n        if ra == rb:\n            return False\n        if self.size[ra] < self.size[rb]:\n            ra, rb = rb, ra\n        self.parent[rb] = ra\n        self.size[ra] += self.size[rb]\n        self.count -= 1\n        return True\n\n    def groups(self):\n        return self.count\n',
    }),
    py({
      prompt: 'Using union–find, write `count_islands_of_friends(n, friendships)`: n people (0..n−1) and a list of friendship pairs. Return how many separate friend circles there are.',
      starter: 'def count_islands_of_friends(n, friendships):\n    pass\n',
      tests: [eq('count_islands_of_friends(5, [(0, 1), (1, 2), (3, 4)])', '2'), eq('count_islands_of_friends(3, [])', '3'), eq('count_islands_of_friends(1, [])', '1')],
      hints: ['parent = list(range(n)); a find function; for each pair, link their roots.', 'Count how many i have find(i) == i at the end.'],
      solution: 'def count_islands_of_friends(n, friendships):\n    parent = list(range(n))\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    for a, b in friendships:\n        parent[find(a)] = find(b)\n    return sum(1 for i in range(n) if find(i) == i)\n',
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'ds-4': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('In-order traversal of a BST gives the values…', ['in insertion order', 'sorted', 'reversed'], 1, 'Sorted.'),
      mc('BST search time is…', ['O(1)', 'O(height)', 'O(n²)'], 1, 'O(height).'),
      mc('Balanced trees guarantee height…', ['O(log n)', 'O(n)', 'O(1)'], 0, 'O(log n).'),
      ans('Pre-order of a tree with root 1, left child 2, right child 3? (spaces)', ['1 2 3'], 'Node, left, right.'),
      ans('Post-order of that tree? (spaces)', ['2 3 1'], 'Left, right, node.'),
      py({ prompt: 'Write `count_leaves(node)`.', starter: TREE + 'def count_leaves(node):\n    pass\n', tests: [{ name: 'example', code: EXAMPLE + '\nassert count_leaves(T) == 3' }, eq('count_leaves(None)', '0')], solution: TREE + 'def count_leaves(node):\n    if node is None:\n        return 0\n    if node.left is None and node.right is None:\n        return 1\n    return count_leaves(node.left) + count_leaves(node.right)\n' }),
      py({ prompt: 'Write `bst_min(node)` returning the smallest value in a non-empty BST (keep going left).', starter: TREE + 'def bst_min(node):\n    pass\n', tests: [{ name: 'example', code: EXAMPLE + '\nassert bst_min(T) == 1' }], solution: TREE + 'def bst_min(node):\n    while node.left:\n        node = node.left\n    return node.val\n' }),
    ],
  },
  'ds-5': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('In a min-heap, the smallest item is…', ['at the root (index 0)', 'at the end', 'anywhere'], 0, 'Root.'),
      mc('Inserting into a heap costs…', ['O(1)', 'O(log n)', 'O(n)'], 1, 'Bubble up.'),
      ans('Children of index 3 in a list-heap? (two numbers, spaces)', ['7 8', '7, 8', '7,8'], '2·3+1 and 2·3+2.'),
      mc('heapq.heapify(list) runs in…', ['O(n)', 'O(n log n)', 'O(n²)'], 0, 'O(n), surprisingly.'),
      py({ prompt: 'Write `kth_smallest(nums, k)` (1-based) using heapq.', starter: 'import heapq\n\ndef kth_smallest(nums, k):\n    pass\n', tests: [eq('kth_smallest([7, 2, 9, 4], 2)', '4'), eq('kth_smallest([5], 1)', '5')], solution: 'import heapq\n\ndef kth_smallest(nums, k):\n    h = list(nums)\n    heapq.heapify(h)\n    for _ in range(k - 1):\n        heapq.heappop(h)\n    return h[0]\n' }),
      py({ prompt: 'Write `heap_sort(nums)` returning a sorted list using heappush/heappop.', starter: 'import heapq\n\ndef heap_sort(nums):\n    pass\n', tests: [eq('heap_sort([3, 1, 2])', '[1, 2, 3]'), eq('heap_sort([])', '[]'), { name: 'no sort()', code: 'assert "sort(" not in __source__.replace("heap_sort(", "")' }], solution: 'import heapq\n\ndef heap_sort(nums):\n    h = []\n    for x in nums:\n        heapq.heappush(h, x)\n    return [heapq.heappop(h) for _ in range(len(h))]\n' }),
    ],
  },
  'ds-6': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('For a sparse graph, which uses less memory?', ['Adjacency list', 'Adjacency matrix'], 0, 'O(V + E).'),
      mc('Checking whether edge u–v exists is O(1) with…', ['an adjacency matrix', 'an adjacency list'], 0, 'Direct lookup.'),
      mc('Trie lookup for a word of length L takes…', ['O(L)', 'O(number of words)', 'O(1)'], 0, 'One step per letter.'),
      mc('Union–find\'s path compression…', ['sorts the items', 'points visited nodes straight at the root', 'deletes groups'], 1, 'Flattening.'),
      py({ prompt: 'Write `neighbors_count(edges, v)` returning v\'s degree from an undirected edge list.', starter: 'def neighbors_count(edges, v):\n    pass\n', tests: [eq('neighbors_count([(1, 2), (1, 3), (2, 3)], 1)', '2'), eq('neighbors_count([], 1)', '0')], solution: 'def neighbors_count(edges, v):\n    return sum((a == v) + (b == v) for a, b in edges)\n' }),
      py({ prompt: 'Using union–find, write `makes_cycle(n, edges)`: True if adding the edges one by one ever connects two already-connected vertices.', starter: 'def makes_cycle(n, edges):\n    pass\n', tests: [eq('makes_cycle(3, [(0, 1), (1, 2), (2, 0)])', 'True'), eq('makes_cycle(3, [(0, 1), (1, 2)])', 'False')], solution: 'def makes_cycle(n, edges):\n    parent = list(range(n))\n    def find(x):\n        while parent[x] != x:\n            x = parent[x]\n        return x\n    for a, b in edges:\n        ra, rb = find(a), find(b)\n        if ra == rb:\n            return True\n        parent[ra] = rb\n    return False\n' }),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  'data-structures': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Which gives O(1) access by index?', ['Array', 'Linked list', 'BST'], 0, 'Array.'),
      mc('Undo history (most recent first) uses a…', ['queue', 'stack', 'heap'], 1, 'Stack.'),
      mc('Average-case dict lookup:', ['O(1)', 'O(log n)', 'O(n)'], 0, 'Hashing.'),
      mc('Always need the current minimum, with inserts? Use a…', ['heap', 'stack', 'linked list'], 0, 'Heap.'),
      mc('Autocomplete on a dictionary of words? Use a…', ['trie', 'queue', 'matrix'], 0, 'Trie.'),
      mc('Sorted keys with O(log n) insert and range queries?', ['balanced BST', 'hash table', 'stack'], 0, 'Balanced BST.'),
      ans('In-order traversal of the BST with root 5, left 3, right 8? (spaces)', ['3 5 8'], 'Sorted.'),
      py({ prompt: 'Write `max_depth_values(root)` returning the list of values on the DEEPEST level of a binary tree, left to right.', starter: 'from collections import deque\n\n' + TREE + 'def max_depth_values(root):\n    pass\n', tests: [{ name: 'example', code: EXAMPLE + '\nassert max_depth_values(T) == [1, 3, 7]' }, eq('max_depth_values(None)', '[]')], solution: 'from collections import deque\n\n' + TREE + 'def max_depth_values(root):\n    if root is None:\n        return []\n    q = deque([root])\n    last = []\n    while q:\n        last = []\n        for _ in range(len(q)):\n            n = q.popleft()\n            last.append(n.val)\n            if n.left:\n                q.append(n.left)\n            if n.right:\n                q.append(n.right)\n    return last\n' }),
      py({ prompt: 'Write `first_unique(s)` returning the index of the first character that appears exactly once, or -1. O(n).', starter: 'def first_unique(s):\n    pass\n', tests: [eq('first_unique("loopwise")', '0'), eq('first_unique("aabbc")', '4'), eq('first_unique("aabb")', '-1')], solution: 'from collections import Counter\n\ndef first_unique(s):\n    c = Counter(s)\n    for i, ch in enumerate(s):\n        if c[ch] == 1:\n            return i\n    return -1\n' }),
      py({ prompt: 'Build an `LRUCache(capacity)` with `get(key)` (return value or -1, marks as recently used) and `put(key, value)` (evicts the least recently used when full). Hint: `collections.OrderedDict` with `move_to_end` and `popitem(last=False)`.', starter: 'from collections import OrderedDict\n\nclass LRUCache:\n    pass\n', tests: [{ name: 'evicts least recently used', code: 'c = LRUCache(2)\nc.put(1, 1); c.put(2, 2)\nassert c.get(1) == 1\nc.put(3, 3)\nassert c.get(2) == -1 and c.get(3) == 3 and c.get(1) == 1' }, { name: 'put updates value', code: 'c = LRUCache(1)\nc.put(1, 1); c.put(1, 5)\nassert c.get(1) == 5' }], solution: 'from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.data = OrderedDict()\n\n    def get(self, key):\n        if key not in self.data:\n            return -1\n        self.data.move_to_end(key)\n        return self.data[key]\n\n    def put(self, key, value):\n        if key in self.data:\n            self.data.move_to_end(key)\n        self.data[key] = value\n        if len(self.data) > self.capacity:\n            self.data.popitem(last=False)\n' }),
    ],
  },
};

