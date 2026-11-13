/**
 * Track: linear-algebra — "Linear Algebra"
 * Written here: la-1 (vectors), la-2 (matrices), la-3 (deeper ideas) + checkpoints + course final exam.
 * Vectors and matrices are plain Python lists (no numpy), so every exercise runs in the browser.
 * Every number below was double-checked in Python.
 */
import type { AnswerStep, Checkpoint, Step } from '../types';
import { ans, eq, ex, mc, ord, py } from './_helpers';

const ordT = (prompt: string, lines: string[], explanation: string) => ord(prompt, lines, explanation, 'text');

/** A typed vector answer like "(6, 2)". Accepts (6, 2), (6,2), [6, 2], 6, 2 … */
const vecAns = (prompt: string, v: number[], explanation: string, code?: string): AnswerStep => {
  const parts = v.map(String);
  const spaced = parts.join(', ');
  const tight = parts.join(',');
  return ans(prompt, [`(${spaced})`, `(${tight})`, `[${spaced}]`, `[${tight}]`, spaced, tight], explanation, code);
};

/** A typed shape answer like "3×2". Accepts 3×2, 3x2, 3 x 2, 3 by 2 … */
const shapeAns = (prompt: string, rows: number, cols: number, explanation: string): AnswerStep =>
  ans(prompt, [`${rows}×${cols}`, `${rows}x${cols}`, `${rows} x ${cols}`, `${rows} × ${cols}`, `${rows} by ${cols}`], explanation);

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ la-1-vectors
  'la-1-vectors': [
    ex('What is a vector?', 'A **vector** is a list of numbers. You can picture it as an **arrow**.\n\nv = (3, 4) means "go **3** right and **4** up".\n\n- The numbers are its **components**.\n- How many there are is its **dimension**: (3, 4) is 2-dimensional, and (1, 0, 2) is 3-dimensional.\n\nIn Python, a vector is just a list: `v = [3, 4]`.', 'Linear algebra is the math behind graphics, games, search engines and machine learning. Data is almost always stored as vectors and matrices.'),
    mc('Which is a 3-dimensional vector?', ['(1, 2)', '(1, 2, 3)', '7'], 1, 'Three components = 3 dimensions.'),
    ex('Magnitude: how long is the arrow?', 'The **magnitude** (length) of a vector is written ‖v‖. It comes from the Pythagorean theorem:\n\n**‖(x, y)‖ = √(x² + y²)**\n\n‖(3, 4)‖ = √(9 + 16) = √25 = **5**.\n\nIt works in any dimension: square every component, add, then take the square root.'),
    ans('What is the magnitude of (6, 8)?', ['10'], '√(36 + 64) = √100 = 10.'),
    ans('What is the magnitude of (1, 2, 2)?', ['3'], '√(1 + 4 + 4) = √9 = 3.'),
    ex('Direction and unit vectors', 'A **unit vector** has length exactly 1. It keeps only the *direction*.\n\nTo make one, divide every component by the magnitude:\n\n(3, 4) ÷ 5 = **(0.6, 0.8)**\n\nCheck: √(0.36 + 0.64) = √1 = 1.'),
    vecAns('What is the unit vector in the direction of (0, 5)? Write it like (a, b).', [0, 1], '‖(0, 5)‖ = 5, and (0, 5) ÷ 5 = (0, 1).'),
    mc('Compare (2, 0) and (0, 2).', ['Same magnitude, different direction', 'Same direction, different magnitude', 'They are the same vector'], 0, 'Both have length 2, but one points right and the other points up.'),
    py({
      prompt: 'Write `magnitude(v)` that returns the length of a vector of **any** dimension (a list of numbers). Use `math.sqrt`.',
      starter: 'import math\n\n\ndef magnitude(v):\n    pass\n',
      tests: [eq('magnitude([3, 4])', '5.0'), eq('magnitude([1, 2, 2])', '3.0'), eq('magnitude([0, 0])', '0.0'), eq('magnitude([5])', '5.0')],
      hints: ['Add up x * x for every x in v.', 'return math.sqrt(sum(x * x for x in v))'],
      solution: 'import math\n\n\ndef magnitude(v):\n    total = 0\n    for x in v:\n        total += x * x\n    return math.sqrt(total)\n',
    }),
  ],

  // ------------------------------------------------------------------ la-1-operations
  'la-1-operations': [
    ex('Adding and scaling', '**Add** vectors component by component:\n\n(1, 2) + (3, 5) = (1 + 3, 2 + 5) = **(4, 7)**\n\nAs arrows: put the second arrow at the tip of the first.\n\n**Scale** by multiplying every component by a number:\n\n3 × (1, 2) = **(3, 6)**: same direction, 3 times as long. A negative number flips the direction.'),
    vecAns('(2, -1) + (4, 3) = ?', [6, 2], '(2 + 4, −1 + 3) = (6, 2).'),
    vecAns('2 × (3, -4) = ?', [6, -8], 'Multiply each component by 2.'),
    ex('The dot product', 'The **dot product** multiplies matching components and adds the results. The answer is a single number:\n\n**(a₁, a₂) · (b₁, b₂) = a₁b₁ + a₂b₂**\n\n(1, 2) · (3, 4) = 1×3 + 2×4 = **11**\n\nIt measures how much two vectors point the same way:\n\n- **positive**: roughly the same direction\n- **zero**: perpendicular (at 90°)\n- **negative**: roughly opposite'),
    ans('What is (2, 3) · (4, -1)?', ['5'], '2×4 + 3×(−1) = 8 − 3 = 5.'),
    mc('(1, 2) · (2, -1) = 0. What does that tell you?', ['The vectors are perpendicular (90° apart)', 'They point the same way', 'One of them is the zero vector'], 0, '1×2 + 2×(−1) = 0. A zero dot product means a right angle.'),
    ex('Similarity', 'The dot product is linked to the angle θ between two vectors:\n\n**a · b = ‖a‖ ‖b‖ cos θ**\n\nDividing gives **cosine similarity**: cos θ = a · b ÷ (‖a‖ ‖b‖). It is 1 for the same direction, 0 for perpendicular and −1 for opposite.\n\nSearch engines and recommendation systems use it to find "similar" items.'),
    ans('What is v · v for v = (3, 4)?', ['25'], '3×3 + 4×4 = 25, which is ‖v‖² (5² = 25). A vector dotted with itself is its length squared.'),
    py({
      prompt: 'Write two functions for vectors of any (matching) dimension:\n\n- `add(a, b)` returns a **new list** with the component-wise sums\n- `dot(a, b)` returns the dot product (a number)',
      starter: 'def add(a, b):\n    pass\n\n\ndef dot(a, b):\n    pass\n',
      tests: [eq('add([1, 2], [3, 5])', '[4, 7]'), eq('add([0, 0, 1], [1, 1, 1])', '[1, 1, 2]'), eq('dot([1, 2], [3, 4])', '11'), eq('dot([1, 0, 2], [3, 5, -1])', '1')],
      hints: ['for i in range(len(a)): use a[i] and b[i].', 'add: return [a[i] + b[i] for i in range(len(a))]   dot: return sum(a[i] * b[i] for i in range(len(a)))'],
      solution: 'def add(a, b):\n    return [a[i] + b[i] for i in range(len(a))]\n\n\ndef dot(a, b):\n    total = 0\n    for i in range(len(a)):\n        total += a[i] * b[i]\n    return total\n',
    }),
  ],

  // ------------------------------------------------------------------ la-2-matrices
  'la-2-matrices': [
    ex('Matrices', 'A **matrix** is a grid of numbers. Its **shape** is rows × columns:\n\n```\nA = | 1  2  3 |\n    | 4  5  6 |\n```\n\nA is a **2×3** matrix (2 rows, 3 columns).\n\nIn Python, a matrix is a list of rows: `A = [[1, 2, 3], [4, 5, 6]]`. `A[i][j]` is row i, column j, counting from 0.'),
    shapeAns('What is the shape of [[1, 2], [3, 4], [5, 6]]? (Like 2×3.)', 3, 2, '3 rows, each with 2 numbers: 3×2.'),
    ans('What does this print?', ['6'], 'A[1] is the second row [4, 5, 6], and [2] is its third item: 6.', 'A = [[1, 2, 3], [4, 5, 6]]\nprint(A[1][2])'),
    ex('Adding, scaling, transposing', '- **Add** two matrices of the **same shape** entry by entry.\n- **Scale** by multiplying every entry by a number.\n- The **transpose** Aᵀ flips rows into columns:\n\n```\n| 1  2  3 |ᵀ    | 1  4 |\n| 4  5  6 |  =  | 2  5 |\n                | 3  6 |\n```\n\nA 2×3 matrix becomes 3×2.'),
    shapeAns('A matrix is 2×5. What is the shape of its transpose?', 5, 2, 'Rows and columns swap: 5×2.'),
    mc('Can you add a 2×3 matrix and a 3×2 matrix?', ['Yes', 'No: the shapes must match'], 1, 'Addition pairs up entries in the same position, so both matrices need the same shape.'),
    ex('Special matrices', 'A **square** matrix has as many rows as columns.\n\nThe **identity matrix I** has 1s on the diagonal and 0s everywhere else:\n\n```\nI = | 1  0 |\n    | 0  1 |\n```\n\nIt acts like the number 1: multiplying by I changes nothing.\n\nA **data table** is a matrix too: each row is one example (a house) and each column is one feature (size, rooms, age).'),
    mc('Which is the 2×2 identity matrix?', ['[[1, 1], [1, 1]]', '[[1, 0], [0, 1]]', '[[0, 1], [1, 0]]'], 1, '1s on the diagonal, 0s elsewhere.'),
    py({
      prompt: 'Write `transpose(A)` that returns a **new** matrix with rows and columns swapped. A is a list of rows.',
      starter: 'def transpose(A):\n    pass\n',
      tests: [eq('transpose([[1, 2, 3], [4, 5, 6]])', '[[1, 4], [2, 5], [3, 6]]'), eq('transpose([[7]])', '[[7]]'), eq('transpose([[1, 2]])', '[[1], [2]]')],
      hints: ['The new matrix has len(A[0]) rows. New row j is made of A[i][j] for every row i.', 'return [[A[i][j] for i in range(len(A))] for j in range(len(A[0]))]'],
      solution: 'def transpose(A):\n    result = []\n    for j in range(len(A[0])):\n        result.append([A[i][j] for i in range(len(A))])\n    return result\n',
    }),
  ],

  // ------------------------------------------------------------------ la-2-multiplication
  'la-2-multiplication': [
    ex('Matrix × vector', 'To multiply a matrix by a vector, take the **dot product of each row** with the vector:\n\n```\n| 1  2 |   | 5 |   | 1×5 + 2×6 |   | 17 |\n| 3  4 | × | 6 | = | 3×5 + 4×6 | = | 39 |\n```\n\nThe vector needs as many entries as the matrix has columns.'),
    vecAns('[[2, 0], [0, 3]] × (4, 5) = ?', [8, 15], 'Row 1: 2×4 + 0×5 = 8. Row 2: 0×4 + 3×5 = 15.'),
    ex('Matrices move space', 'A matrix is a **transformation**: it moves every vector somewhere new.\n\n- [[2, 0], [0, 3]] stretches x by 2 and y by 3.\n- [[0, −1], [1, 0]] **rotates** everything 90° counterclockwise: (1, 0) becomes (0, 1).\n\nThis is exactly how games and graphics move, rotate and scale objects on screen.'),
    mc('What is [[0, -1], [1, 0]] × (0, 1)?', ['(1, 0)', '(-1, 0)', '(0, -1)'], 1, 'Row 1: 0×0 + (−1)×1 = −1. Row 2: 1×0 + 0×1 = 0. "Up" rotated 90° counterclockwise points left.'),
    ex('Matrix × matrix', 'For C = A × B, the entry in row i, column j is **(row i of A) · (column j of B)**.\n\n```\n| 1  2 |   | 5  6 |   | 19  22 |\n| 3  4 | × | 7  8 | = | 43  50 |\n```\n\nTop-left: (1, 2) · (5, 7) = 5 + 14 = 19.\n\n**Shapes:** (m×**n**) × (**n**×p) = m×p. The inner numbers must match.'),
    shapeAns('A is 2×3 and B is 3×4. What is the shape of A × B?', 2, 4, 'The inner 3s match. The outer numbers give the shape: 2×4.'),
    mc('Is A × B always equal to B × A?', ['Yes, like regular numbers', 'No: the order matters'], 1, 'Rotating then stretching is usually different from stretching then rotating. Often B × A doesn\'t even have a valid shape.'),
    ans('What is the top-left entry of [[1, 1], [0, 1]] × [[1, 2], [3, 4]]?', ['4'], 'Row 1 of the first, (1, 1), dotted with column 1 of the second, (1, 3): 1 + 3 = 4.'),
    py({
      prompt: 'Write `matmul(A, B)` that returns A × B. You can assume the shapes fit (columns of A = rows of B).\n\nUse three loops: rows of A, columns of B, and the shared middle index.',
      starter: 'def matmul(A, B):\n    pass\n',
      tests: [eq('matmul([[1, 2], [3, 4]], [[5, 6], [7, 8]])', '[[19, 22], [43, 50]]'), eq('matmul([[1, 2, 3]], [[1], [2], [3]])', '[[14]]'), eq('matmul([[2, 0], [0, 3]], [[4], [5]])', '[[8], [15]]')],
      hints: ['for i in range(len(A)): build a new row. for j in range(len(B[0])): compute one entry.', 'Each entry: sum(A[i][k] * B[k][j] for k in range(len(B)))'],
      solution: 'def matmul(A, B):\n    result = []\n    for i in range(len(A)):\n        row = []\n        for j in range(len(B[0])):\n            total = 0\n            for k in range(len(B)):\n                total += A[i][k] * B[k][j]\n            row.append(total)\n        result.append(row)\n    return result\n',
    }),
  ],

  // ------------------------------------------------------------------ la-2-systems
  'la-2-systems': [
    ex('Systems of equations', 'Several equations that must all be true at once form a **system**:\n\nx + y = 5\nx − y = 1\n\nThe solution is **x = 3, y = 2** (check: 3 + 2 = 5 and 3 − 2 = 1).\n\nAs matrices, it\'s **A x = b**: A = [[1, 1], [1, −1]] holds the numbers in front of x and y, and b = (5, 1).'),
    ans('x + y = 10 and x − y = 4. What is x?', ['7'], 'Add the two equations: 2x = 14, so x = 7 (and y = 3).'),
    ex('Elimination', 'Add or subtract equations to **cancel** a variable:\n\n2x + y = 7\nx + y = 4\n\nSubtract the second from the first: **x = 3**. Put it back in: 3 + y = 4, so **y = 1**.'),
    ans('3x + y = 11 and x + y = 5. What is x?', ['3'], 'Subtract: 2x = 6, so x = 3 (and y = 2).'),
    ex('Gaussian elimination', 'Computers do the same thing on a grid called the **augmented matrix** [A | b]. Three moves are allowed:\n\n1. Swap two rows.\n2. Multiply a row by a non-zero number.\n3. Add a multiple of one row to another.\n\nGet zeros below the diagonal (a "triangle"), solve the last row, then work back upward. That last part is **back-substitution**.', 'Gaussian elimination is over 2,000 years old (it appears in an ancient Chinese text) and still runs inside modern software.'),
    ordT('Put the steps of Gaussian elimination in order.', ['Write the system as an augmented matrix [A | b]', 'Use row operations to get zeros below the diagonal', 'Solve the last equation', 'Back-substitute upward to find the other variables'], 'Set up, eliminate, solve the bottom, then back-substitute.'),
    mc('How many solutions can a system of linear equations have?', ['Always exactly one', 'None, exactly one, or infinitely many', 'Exactly two'], 1, 'Two lines can cross once, never meet (parallel), or be the same line.'),
    mc('x + y = 2 and x + y = 5. How many solutions?', ['One', 'None: the lines are parallel', 'Infinitely many'], 1, 'x + y can\'t be 2 and 5 at the same time.'),
    py({
      prompt: 'Write `is_solution(A, x, b)` that returns True if **A x = b**: the dot product of every row of A with x must equal the matching entry of b.',
      starter: 'def is_solution(A, x, b):\n    pass\n',
      tests: [eq('is_solution([[1, 1], [1, -1]], [3, 2], [5, 1])', 'True'), eq('is_solution([[1, 1], [1, -1]], [2, 3], [5, 1])', 'False'), eq('is_solution([[2, 1, 0], [0, 1, 1], [1, 0, 1]], [1, 2, 3], [4, 5, 4])', 'True')],
      hints: ['for i in range(len(A)): compute the dot product of A[i] and x.', 'If it doesn\'t equal b[i], return False. After the loop, return True.'],
      solution: 'def is_solution(A, x, b):\n    for i in range(len(A)):\n        total = 0\n        for j in range(len(x)):\n            total += A[i][j] * x[j]\n        if total != b[i]:\n            return False\n    return True\n',
    }),
  ],

  // ------------------------------------------------------------------ la-2-inverse
  'la-2-inverse': [
    ex('Undoing a matrix', 'The **inverse** A⁻¹ undoes what A does:\n\n**A⁻¹ × A = I** (the identity)\n\nIt\'s like ÷5 undoing ×5. With an inverse you can solve A x = b directly: **x = A⁻¹ b**.\n\nOnly square matrices can have inverses, and not all of them do.'),
    ex('The determinant', 'For a 2×2 matrix:\n\n**det [[a, b], [c, d]] = ad − bc**\n\nThe determinant tells you how much the matrix **scales area**. det = 2 means shapes get twice as big.\n\nIf **det = 0**, the matrix squashes the plane flat onto a line. You can\'t undo that, so there is **no inverse**.'),
    ans('What is det [[3, 1], [2, 4]]?', ['10'], '3×4 − 1×2 = 12 − 2 = 10.'),
    ans('What is det [[2, 4], [1, 2]]?', ['0'], '2×2 − 4×1 = 0. The second column is twice the first, so space gets flattened.'),
    mc('A matrix has determinant 0. What does that mean?', ['It has no inverse', 'It is the identity matrix', 'Its inverse is the zero matrix'], 0, 'det 0 = space squashed flat, and that can\'t be undone.'),
    ex('The 2×2 inverse formula', 'For A = [[a, b], [c, d]] with det ≠ 0:\n\n**A⁻¹ = (1 / det) × [[d, −b], [−c, a]]**\n\nSwap a and d, flip the signs of b and c, then divide by the determinant.\n\nExample: [[2, 1], [1, 1]] has det = 1, so its inverse is **[[1, −1], [−1, 2]]**.'),
    mc('What is the inverse of [[2, 0], [0, 3]]?', ['[[1/2, 0], [0, 1/3]]', '[[-2, 0], [0, -3]]', '[[3, 0], [0, 2]]'], 0, 'It stretches x by 2 and y by 3, so the inverse shrinks x by 2 and y by 3. The formula gives the same: det 6, (1/6) × [[3, 0], [0, 2]].'),
    mc('A has determinant 6 (it makes areas 6 times bigger). What does A⁻¹ do to areas?', ['Multiplies them by 6', 'Multiplies them by 1/6', 'Multiplies them by −6'], 1, 'Undoing a ×6 stretch is a ×1/6 shrink: det(A⁻¹) = 1 / det(A).'),
    py({
      prompt: 'Write two functions for 2×2 matrices:\n\n- `det2(A)` returns ad − bc\n- `inverse2(A)` returns the inverse, or **None** if the determinant is 0',
      starter: 'def det2(A):\n    pass\n\n\ndef inverse2(A):\n    pass\n',
      tests: [eq('det2([[3, 1], [2, 4]])', '10'), eq('inverse2([[2, 1], [1, 1]])', '[[1.0, -1.0], [-1.0, 2.0]]'), eq('inverse2([[2, 4], [1, 2]])', 'None'), eq('inverse2([[2, 0], [0, 4]])', '[[0.5, 0.0], [0.0, 0.25]]')],
      hints: ['a, b = A[0] and c, d = A[1] unpack the entries.', 'In inverse2: d0 = det2(A); if d0 == 0: return None; else return [[d / d0, -b / d0], [-c / d0, a / d0]]'],
      solution: 'def det2(A):\n    a, b = A[0]\n    c, d = A[1]\n    return a * d - b * c\n\n\ndef inverse2(A):\n    a, b = A[0]\n    c, d = A[1]\n    d0 = det2(A)\n    if d0 == 0:\n        return None\n    return [[d / d0, -b / d0], [-c / d0, a / d0]]\n',
    }),
  ],

  // ------------------------------------------------------------------ la-3-span
  'la-3-span': [
    ex('Linear combinations and span', 'A **linear combination** of vectors u and v is a·u + b·v for some numbers a and b.\n\nThe **span** is everything you can reach that way.\n\n(1, 0) and (0, 1) span the **whole plane**: any (x, y) = x·(1, 0) + y·(0, 1).'),
    vecAns('What is 2·(1, 0) + 3·(0, 1)?', [2, 3], '(2, 0) + (0, 3) = (2, 3).'),
    ex('Linear independence', 'Vectors are **linearly independent** if none of them is a combination of the others. Each one adds a new direction.\n\n(1, 2) and (2, 4) are **dependent**: (2, 4) = 2 × (1, 2). They point along the same line, so together they only span that **line**, not the plane.'),
    mc('Are (1, 2) and (3, 6) linearly independent?', ['Yes', 'No: (3, 6) = 3 × (1, 2)'], 1, 'One is a multiple of the other, so the second adds no new direction.'),
    mc('What is the span of (1, 2) and (2, 4)?', ['The whole plane', 'A line', 'A single point'], 1, 'Every combination lands on the line through (1, 2).'),
    ex('Basis, dimension and rank', 'A **basis** is a set of independent vectors that spans a space. Every basis of a space has the same number of vectors. That number is the **dimension**:\n\n- a plane needs 2\n- 3D space needs 3\n\nThe **rank** of a matrix is the number of independent columns. It tells you the dimension of everything the matrix can output.'),
    ans('How many vectors are in a basis for 3D space?', ['3', 'three'], '3D space has dimension 3, for example (1, 0, 0), (0, 1, 0) and (0, 0, 1).'),
    ans('What is the rank of [[1, 2], [2, 4]]?', ['1', 'one'], 'Its columns (1, 2) and (2, 4) are dependent, so there is only 1 independent direction.'),
    mc('In 2D, two vectors are independent exactly when the determinant of the matrix with them as columns is…', ['0', 'not 0', '1'], 1, 'det ≠ 0 means the matrix doesn\'t flatten the plane, so the columns point in different directions.'),
    py({
      prompt: 'Write `independent2(u, v)` that returns True if 2D vectors u and v are linearly independent. Use the determinant: u[0]·v[1] − u[1]·v[0] must not be 0.',
      starter: 'def independent2(u, v):\n    pass\n',
      tests: [eq('independent2([1, 2], [3, 6])', 'False'), eq('independent2([1, 0], [0, 1])', 'True'), eq('independent2([2, 1], [1, 3])', 'True'), eq('independent2([0, 0], [1, 1])', 'False')],
      hints: ['return u[0] * v[1] - u[1] * v[0] != 0'],
      solution: 'def independent2(u, v):\n    return u[0] * v[1] - u[1] * v[0] != 0\n',
    }),
  ],

  // ------------------------------------------------------------------ la-3-eigen
  'la-3-eigen': [
    ex('Directions that only stretch', 'A matrix usually turns vectors in new directions. But some special vectors only get **stretched** (or shrunk, or flipped):\n\n**A v = λ v**\n\n- v is an **eigenvector** of A\n- λ (the Greek letter "lambda") is its **eigenvalue**: the stretch factor\n\n"Eigen" is German for "own": these are the matrix\'s own special directions.'),
    ex('An example', 'A = [[2, 0], [0, 3]]:\n\n- A × (1, 0) = (2, 0) = **2** × (1, 0). Eigenvector, λ = 2.\n- A × (0, 1) = (0, 3) = **3** × (0, 1). Eigenvector, λ = 3.\n- A × (1, 1) = (2, 3). Not a multiple of (1, 1), so **not** an eigenvector.\n\nFor a **diagonal** matrix like this one, the eigenvalues are just the diagonal entries.'),
    ans('A = [[2, 0], [0, 3]]. What is the eigenvalue for the eigenvector (0, 1)?', ['3'], 'A × (0, 1) = (0, 3) = 3 × (0, 1).'),
    mc('A = [[2, 1], [1, 2]] and v = (1, 1). A v = (3, 3). So…', ['v is an eigenvector with λ = 3', 'v is not an eigenvector', 'v is an eigenvector with λ = 1'], 0, '(3, 3) = 3 × (1, 1).'),
    ans('Same A = [[2, 1], [1, 2]]. For v = (1, -1), A v = (1, -1). What is the eigenvalue?', ['1'], 'A v = 1 × v, so λ = 1.'),
    ex('Why eigenvalues matter', 'Apply A over and over, and the eigenvectors tell the story. Along an eigenvector, each step just multiplies by λ:\n\n- |λ| > 1: it **grows**\n- |λ| < 1: it **shrinks** toward zero\n\nThis is how Google\'s original PageRank ranked web pages, how engineers study vibrations, and how PCA finds patterns in data.\n\nTo find them by hand, solve **det(A − λI) = 0**. For [[2, 1], [1, 2]] that gives λ = 1 and λ = 3.'),
    mc('A vector has eigenvalue 0.5. What happens to it if you apply A again and again?', ['It grows', 'It shrinks toward zero', 'It rotates'], 1, 'Each step halves it: 0.5, 0.25, 0.125, …'),
    ans('What is the largest eigenvalue of [[4, 0], [0, 1]]?', ['4'], 'Diagonal matrix: the eigenvalues are 4 and 1.'),
    py({
      prompt: 'Write `eigenvalue_of(A, v)` for a 2×2 matrix A and a non-zero vector v. If A v = λ v, return λ. Otherwise return **None**.\n\nCompute A v, find λ using a component of v that isn\'t 0, then check **both** components match λ × v.',
      starter: 'def eigenvalue_of(A, v):\n    pass\n',
      tests: [eq('eigenvalue_of([[2, 1], [1, 2]], [1, 1])', '3.0'), eq('eigenvalue_of([[2, 1], [1, 2]], [1, -1])', '1.0'), eq('eigenvalue_of([[2, 1], [1, 2]], [1, 0])', 'None'), eq('eigenvalue_of([[2, 0], [0, 3]], [0, 1])', '3.0')],
      hints: ['Av = [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]]', 'i = 0 if v[0] != 0 else 1; lam = Av[i] / v[i]. Then if Av[0] == lam * v[0] and Av[1] == lam * v[1]: return lam. Otherwise return None.'],
      solution: 'def eigenvalue_of(A, v):\n    Av = [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]]\n    i = 0 if v[0] != 0 else 1\n    lam = Av[i] / v[i]\n    if Av[0] == lam * v[0] and Av[1] == lam * v[1]:\n        return lam\n    return None\n',
    }),
  ],

  // ------------------------------------------------------------------ la-3-applications
  'la-3-applications': [
    ex('Data is a matrix', 'Machine learning stores data as a matrix **X**:\n\n- each **row** is one example (a house, a person, a photo)\n- each **column** is one feature (size, age, a pixel)\n\n100 houses with 3 features each make a **100×3** matrix.'),
    shapeAns('A dataset has 500 people with 4 measurements each. What is the shape of the data matrix?', 500, 4, 'One row per person, one column per measurement: 500×4.'),
    ex('A linear model', 'A simple model predicts with a **dot product**: weights **w** times features **x**.\n\nIf w = (2, 3) and a house has x = (10, 1):\n\nprediction = 2×10 + 3×1 = **23**\n\nFor every row at once, that\'s just a matrix × vector: **X w**. "Training" a model means finding good weights.'),
    ans('Weights w = (3, 1, 2). A house has features x = (2, 5, 1). What is the prediction x · w?', ['13'], '2×3 + 5×1 + 1×2 = 6 + 5 + 2 = 13.'),
    ex('Images and meanings as vectors', '- A grayscale **image** is a matrix of pixel brightness values.\n- Language models turn words into vectors called **embeddings**. Words with similar meanings get vectors pointing in similar directions.\n\n"Similar" is measured with **cosine similarity** from the dot product lesson.'),
    mc('How can you tell that two word vectors have similar meanings?', ['Their cosine similarity is high (close to 1)', 'They both have many components', 'Their dot product is exactly 0'], 0, 'Close to 1 = pointing the same way. A dot product of 0 means perpendicular: unrelated.'),
    ex('PCA: finding the important directions', 'Data often spreads out mostly along a few directions. **Principal component analysis (PCA)** finds them.\n\nThey are the **eigenvectors** of the data\'s covariance matrix (a matrix describing how features vary together). The **eigenvalue** says how much spread each direction has.\n\nKeep only the top few directions and you can shrink 1,000 features down to 50 while losing little information.'),
    mc('PCA keeps the directions with…', ['the largest eigenvalues (the most spread)', 'the smallest eigenvalues', 'random eigenvalues'], 0, 'Big eigenvalue = lots of variation along that direction = lots of information.'),
    mc('One layer of a neural network mostly computes…', ['a matrix times a vector, followed by a simple non-linear function', 'only additions', 'a sorted list'], 0, 'Deep learning is, at its core, lots of matrix multiplication.'),
    py({
      prompt: 'Write `predict(X, w)` that returns a **list** of predictions: the dot product of each row of X with the weights w.',
      starter: 'def predict(X, w):\n    pass\n',
      tests: [eq('predict([[10, 1], [20, 2]], [2, 3])', '[23, 46]'), eq('predict([[2, 5, 1]], [3, 1, 2])', '[13]'), eq('predict([], [1, 2])', '[]')],
      hints: ['Start with an empty list and append one dot product per row.', 'return [sum(row[j] * w[j] for j in range(len(w))) for row in X]'],
      solution: 'def predict(X, w):\n    result = []\n    for row in X:\n        total = 0\n        for j in range(len(w)):\n            total += row[j] * w[j]\n        result.append(total)\n    return result\n',
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'la-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('Magnitude of (5, 12)?', ['13'], '√(25 + 144) = √169.'),
      ans('Magnitude of (2, 3, 6)?', ['7'], '√(4 + 9 + 36) = √49.'),
      vecAns('(1, 4) + (2, -3) = ?', [3, 1], 'Add each component.'),
      vecAns('-2 × (1, 3) = ?', [-2, -6], 'Multiply each component by −2.'),
      ans('(3, 2) · (1, 4) = ?', ['11'], '3 + 8.'),
      mc('The dot product of two non-zero vectors is 0. They are…', ['parallel', 'perpendicular', 'equal'], 1, 'Zero dot product = 90°.'),
      vecAns('Unit vector in the direction of (0, -3)?', [0, -1], 'Divide by the length 3.'),
      py({ prompt: 'Write `scale(c, v)` that returns a new list with every component of v multiplied by c.', starter: 'def scale(c, v):\n    pass\n', tests: [eq('scale(3, [1, 2])', '[3, 6]'), eq('scale(-1, [0, 5, 2])', '[0, -5, -2]')], solution: 'def scale(c, v):\n    return [c * x for x in v]\n' }),
    ],
  },
  'la-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      shapeAns('Shape of [[1, 2, 3, 4]]?', 1, 4, '1 row, 4 columns.'),
      vecAns('[[1, 2], [3, 4]] × (1, 1) = ?', [3, 7], '1 + 2 and 3 + 4.'),
      shapeAns('(3×2) × (2×5) gives what shape?', 3, 5, 'Outer numbers.'),
      ans('det [[5, 2], [3, 1]] = ?', ['-1', '−1'], '5 − 6.'),
      mc('det(A) = 0 means…', ['A has no inverse', 'A is the identity', 'A is 1×1'], 0, 'Space is squashed flat.'),
      ans('x + 2y = 7 and x − y = 1. What is y?', ['2'], 'Subtract: 3y = 6.'),
      mc('In general, A × B and B × A are…', ['always equal', 'not necessarily equal'], 1, 'Order matters.'),
      py({ prompt: 'Write `matvec(A, v)`: matrix A times vector v, returned as a list.', starter: 'def matvec(A, v):\n    pass\n', tests: [eq('matvec([[1, 2], [3, 4]], [5, 6])', '[17, 39]'), eq('matvec([[1, 0, 2]], [3, 4, 5])', '[13]')], solution: 'def matvec(A, v):\n    return [sum(row[j] * v[j] for j in range(len(v))) for row in A]\n' }),
    ],
  },
  'la-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Are (2, 1) and (4, 2) linearly independent?', ['Yes', 'No'], 1, '(4, 2) = 2 × (2, 1).'),
      ans('What is the dimension of a plane?', ['2', 'two'], 'A basis has 2 vectors.'),
      ans('Rank of [[1, 0], [0, 1]]?', ['2', 'two'], 'Two independent columns.'),
      ans('A = [[3, 0], [0, 5]]. Eigenvalue for the eigenvector (1, 0)?', ['3'], 'A × (1, 0) = (3, 0).'),
      ans('A = [[1, 2], [2, 1]] and v = (1, 1). A v = (3, 3). Eigenvalue?', ['3'], '(3, 3) = 3 × (1, 1).'),
      mc('Along an eigenvector with |λ| < 1, repeated multiplication by A…', ['grows', 'shrinks toward zero'], 1, 'Each step multiplies by λ.'),
      shapeAns('1,000 photos with 64 features each: shape of the data matrix?', 1000, 64, 'Rows = examples.'),
      py({ prompt: 'Write `cosine(a, b)`: the cosine similarity a · b ÷ (‖a‖ ‖b‖). Use `math.sqrt`.', starter: 'import math\n\n\ndef cosine(a, b):\n    pass\n', tests: [eq('round(cosine([1, 0], [1, 1]), 3)', '0.707'), eq('round(cosine([1, 2], [2, 4]), 6)', '1.0'), eq('cosine([1, 0], [0, 1])', '0.0')], hints: ['dot = sum(x * y for x, y in zip(a, b))', 'return dot / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))'], solution: 'import math\n\n\ndef cosine(a, b):\n    dot = sum(x * y for x, y in zip(a, b))\n    return dot / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))\n' }),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  'linear-algebra': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('Magnitude of (8, 6)?', ['10'], '√(64 + 36).'),
      ans('(1, 2, 3) · (4, 5, 6) = ?', ['32'], '4 + 10 + 18.'),
      mc('(3, 1) · (-1, 3) = 0, so the vectors are…', ['perpendicular', 'parallel', 'equal'], 0, '−3 + 3 = 0.'),
      shapeAns('Transpose of a 4×7 matrix has shape?', 7, 4, 'Swap rows and columns.'),
      shapeAns('(5×3) × (3×2) gives what shape?', 5, 2, 'Outer numbers.'),
      ans('Top-left entry of [[1, 2], [3, 4]] × [[2, 0], [1, 2]]?', ['4'], '(1, 2) · (2, 1) = 2 + 2.'),
      ans('det [[4, 3], [2, 1]] = ?', ['-2', '−2'], '4 − 6.'),
      ans('2x + y = 8 and x + y = 5. What is x?', ['3'], 'Subtract: x = 3.'),
      ans('Rank of [[2, 4], [1, 2]]?', ['1', 'one'], 'The columns are multiples of each other.'),
      ans('Largest eigenvalue of [[7, 0], [0, 2]]?', ['7'], 'Diagonal entries.'),
      py({ prompt: 'Write `identity(n)`: the n×n identity matrix as a list of lists.', starter: 'def identity(n):\n    pass\n', tests: [eq('identity(2)', '[[1, 0], [0, 1]]'), eq('identity(3)', '[[1, 0, 0], [0, 1, 0], [0, 0, 1]]'), eq('identity(1)', '[[1]]')], hints: ['Entry (i, j) is 1 when i == j, otherwise 0.', 'return [[1 if i == j else 0 for j in range(n)] for i in range(n)]'], solution: 'def identity(n):\n    return [[1 if i == j else 0 for j in range(n)] for i in range(n)]\n' }),
    ],
  },
};
