/**
 * Track: sql — "SQL & Databases"
 * Written here: sq-1 (querying), sq-2 (changing data), sq-3 (database design) + checkpoints + course final exam.
 *
 * SQL exercises run in sql.js (real SQLite in the browser). Each run starts from a fresh database built from the
 * step's `setup` (usually SHOP below). Checks see `result` (the last query's rows) and can `query()` afterwards.
 * "What does this query return?" questions are run against SHOP by `npm test` (tests/content.test.ts).
 * Prices are whole dollars so results never have floating-point surprises.
 */
import type { AnswerStep, Checkpoint, ChoiceStep, CodeStep, CodeTest, Step } from '../types';
import { ans, ex, mc } from './_helpers';

const J = JSON.stringify;

/** The sample shop every lesson uses. Shown to learners in the explain cards. */
export const SHOP = `
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, price INTEGER NOT NULL);
INSERT INTO products VALUES
  (1, 'Notebook', 'Office', 4), (2, 'Pen', 'Office', 2), (3, 'Backpack', 'Bags', 40),
  (4, 'Water bottle', 'Kitchen', 12), (5, 'Lunch box', 'Kitchen', 15), (6, 'Laptop sleeve', 'Bags', 25),
  (7, 'Stapler', 'Office', 8);
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL);
INSERT INTO customers VALUES (1, 'Ana', 'Detroit'), (2, 'Bo', 'Chicago'), (3, 'Cy', 'Detroit'), (4, 'Dee', 'Austin');
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES customers(id),
  product_id INTEGER NOT NULL REFERENCES products(id), qty INTEGER NOT NULL);
INSERT INTO orders VALUES (1, 1, 3, 1), (2, 1, 1, 3), (3, 2, 4, 2), (4, 3, 7, 1), (5, 2, 1, 5);
`;

const PRODUCTS_TABLE = '| id | name | category | price |\n|---|---|---|---|\n| 1 | Notebook | Office | 4 |\n| 2 | Pen | Office | 2 |\n| 3 | Backpack | Bags | 40 |\n| 4 | Water bottle | Kitchen | 12 |\n| 5 | Lunch box | Kitchen | 15 |\n| 6 | Laptop sleeve | Bags | 25 |\n| 7 | Stapler | Office | 8 |';
const CUSTOMERS_TABLE = '| id | name | city |\n|---|---|---|\n| 1 | Ana | Detroit |\n| 2 | Bo | Chicago |\n| 3 | Cy | Detroit |\n| 4 | Dee | Austin |';
const ORDERS_TABLE = '| id | customer_id | product_id | qty |\n|---|---|---|---|\n| 1 | 1 | 3 | 1 |\n| 2 | 1 | 1 | 3 |\n| 3 | 2 | 4 | 2 |\n| 4 | 3 | 7 | 1 |\n| 5 | 2 | 1 | 5 |';

// ------------------------------------------------------------------ question helpers (SQL-labeled code)
const mcS = (prompt: string, choices: string[], answer: number, explanation: string, code?: string): ChoiceStep => ({
  ...mc(prompt, choices, answer, explanation), ...(code ? { code, language: 'sql' as const } : {}),
});
const ansS = (prompt: string, accept: string[], explanation: string, code?: string): AnswerStep => ({
  ...ans(prompt, accept, explanation), ...(code ? { code, language: 'sql' as const } : {}),
});

/** A SQL exercise against the sample shop (or another `setup`). */
const q = (a: Omit<CodeStep, 'kind' | 'language' | 'starter'> & { starter?: string }): CodeStep => ({
  kind: 'code', language: 'sql', starter: '-- Write your query below\n', setup: SHOP, ...a,
});

// ------------------------------------------------------------------ checks
/** The query's rows must be exactly these, in this order. */
const rowsAre = (rows: unknown[][]): CodeTest => ({
  name: 'returns the right rows in the right order',
  code: `const want = ${J(rows)};\nassert(JSON.stringify(result.rows) === JSON.stringify(want), "Expected " + JSON.stringify(want) + " but got " + JSON.stringify(result.rows));`,
});
/** The query's rows must be these, in any order. */
const sameRows = (rows: unknown[][]): CodeTest => ({
  name: 'returns the right rows',
  code: `const key = (rs) => rs.map((r) => JSON.stringify(r)).sort().join("|");\nconst want = ${J(rows)};\nassert(key(result.rows) === key(want), "Expected the rows " + JSON.stringify(want) + " (any order) but got " + JSON.stringify(result.rows));`,
});
const colsAre = (cols: string[]): CodeTest => ({
  name: `columns: ${cols.join(', ')}`,
  code: `const got = result.columns.map((c) => c.toLowerCase());\nassert(JSON.stringify(got) === ${J(J(cols))}, "The columns should be ${cols.join(', ')} (got " + (got.join(", ") || "none") + ")");`,
});
/** After the learner's code, `sql` must return exactly these rows. */
const afterRows = (sql: string, rows: unknown[][], msg: string): CodeTest => ({
  name: msg,
  code: `const got = query(${J(sql)}).rows;\nassert(JSON.stringify(got) === ${J(J(rows))}, ${J(msg)} + " (found " + JSON.stringify(got) + ")");`,
});
const mentions = (pattern: string, msg: string): CodeTest => ({
  name: msg,
  code: `assert(new RegExp(${J(pattern)}, "i").test(__source__), ${J(msg)});`,
});

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ sq-1-select
  'sq-1-select': [
    ex('Tables and SQL', 'A **database** stores data in **tables**: rows and columns, like a spreadsheet. **SQL** (say "sequel" or "S-Q-L") is the language for asking it questions.\n\nThroughout this course you\'ll query a tiny shop. Here\'s its `products` table:\n\n' + PRODUCTS_TABLE, 'Nearly every app you use, from banking to Instagram, keeps its data in a database and talks to it with SQL.'),
    ex('SELECT and FROM', 'Every query starts by saying **what** you want and **from** which table:\n\n```sql\nSELECT name, price FROM products;\n```\n\n- `SELECT *` means "every column".\n- Keywords are usually written in CAPITALS (not required, just easier to read).\n- End each statement with `;`.'),
    mcS('Which query gets every column of the products table?', ['SELECT * FROM products;', 'GET * FROM products;', 'SELECT products;'], 0, 'SELECT * FROM table is the classic "show me everything".'),
    ansS('How many rows does this query return?', ['7'], 'No filter, so every product: 7 rows.', 'SELECT name FROM products;'),
    ex('Shaping the results', '```sql\nSELECT name, price * 2 AS double_price FROM products;   -- calculate, and rename with AS\nSELECT DISTINCT category FROM products;                  -- drop duplicate values\nSELECT name FROM products LIMIT 3;                       -- only the first 3 rows\n```\n\n`--` starts a comment in SQL.', 'Tip: you can always run `SELECT * FROM products;` in the editor to look at the data.'),
    ansS('What does this query return? Give the number of rows.', ['3'], 'There are 3 different categories: Office, Bags and Kitchen.', 'SELECT DISTINCT category FROM products;'),
    q({
      prompt: 'Show the **name** and **price** of every product (just those two columns, in that order).',
      tests: [colsAre(['name', 'price']), sameRows([['Notebook', 4], ['Pen', 2], ['Backpack', 40], ['Water bottle', 12], ['Lunch box', 15], ['Laptop sleeve', 25], ['Stapler', 8]])],
      hints: ['SELECT column1, column2 FROM table;', 'SELECT name, price FROM products;'],
      solution: 'SELECT name, price FROM products;\n',
    }),
    q({
      prompt: 'Show only the **first 3** product names, using `LIMIT`.',
      tests: [colsAre(['name']), rowsAre([['Notebook'], ['Pen'], ['Backpack']]), mentions('\\blimit\\b', 'Use LIMIT')],
      hints: ['SELECT name FROM products …', 'SELECT name FROM products LIMIT 3;'],
      solution: 'SELECT name FROM products LIMIT 3;\n',
    }),
  ],

  // ------------------------------------------------------------------ sq-1-where
  'sq-1-where': [
    ex('Filtering with WHERE', '**WHERE** keeps only the rows that match a condition:\n\n```sql\nSELECT name, price FROM products WHERE price < 10;\nSELECT name FROM products WHERE category = \'Office\';\n```\n\n- Comparisons: `=` (just **one** equals sign), `<>` (not equal), `<`, `>`, `<=`, `>=`\n- Combine with `AND`, `OR`, `NOT`\n- Text goes in **single quotes**: `\'Office\'`'),
    mcS('Which query finds products that cost less than $10?', ['SELECT * FROM products WHERE price < 10;', 'SELECT * FROM products IF price < 10;', 'SELECT * WHERE price < 10 FROM products;'], 0, 'The order is always SELECT … FROM … WHERE ….'),
    ansS('How many rows does this query return?', ['3'], 'Notebook, Pen and Stapler are in Office.', "SELECT name FROM products WHERE category = 'Office';"),
    ex('Sorting and patterns', '```sql\nSELECT name, price FROM products ORDER BY price DESC;   -- most expensive first\nSELECT name FROM products WHERE name LIKE \'L%\';       -- starts with L\nSELECT name FROM products WHERE category IN (\'Bags\', \'Kitchen\');\nSELECT name FROM products WHERE price BETWEEN 5 AND 20; -- includes 5 and 20\n```\n\n- `ORDER BY` sorts: `ASC` (smallest first, the default) or `DESC`.\n- In `LIKE`, `%` means "any characters".\n- Missing values are `NULL`. Test them with `IS NULL`, never `= NULL`.'),
    mcS('Which products match this condition?', ['Lunch box and Laptop sleeve', 'Only Lunch box', 'Products whose names end in L'], 0, "'L%' = starts with L, then anything.", "WHERE name LIKE 'L%'"),
    mc('How do you find rows where a value is missing?', ['WHERE x IS NULL', 'WHERE x = NULL', 'WHERE x == NULL'], 0, 'NULL means "unknown", so even NULL = NULL isn\'t true. Use IS NULL.'),
    q({
      prompt: 'Show the **name** and **price** of products in the **Kitchen** or **Bags** categories, **most expensive first**.',
      tests: [colsAre(['name', 'price']), rowsAre([['Backpack', 40], ['Laptop sleeve', 25], ['Lunch box', 15], ['Water bottle', 12]])],
      hints: ["WHERE category = 'Kitchen' OR category = 'Bags'  (or: category IN ('Kitchen', 'Bags'))", "SELECT name, price FROM products WHERE category IN ('Kitchen', 'Bags') ORDER BY price DESC;"],
      solution: "SELECT name, price FROM products\nWHERE category IN ('Kitchen', 'Bags')\nORDER BY price DESC;\n",
    }),
    q({
      prompt: 'Show the **names** of products costing from **5 to 20** dollars (including 5 and 20), in **alphabetical** order.',
      tests: [colsAre(['name']), rowsAre([['Lunch box'], ['Stapler'], ['Water bottle']])],
      hints: ['WHERE price BETWEEN 5 AND 20', 'SELECT name FROM products WHERE price BETWEEN 5 AND 20 ORDER BY name;'],
      solution: 'SELECT name FROM products\nWHERE price BETWEEN 5 AND 20\nORDER BY name;\n',
    }),
  ],

  // ------------------------------------------------------------------ sq-1-aggregates
  'sq-1-aggregates': [
    ex('Summaries', '**Aggregate functions** squash many rows into one answer:\n\n| Function | Gives |\n|---|---|\n| `COUNT(*)` | how many rows |\n| `SUM(x)` | the total |\n| `AVG(x)` | the average |\n| `MIN(x)`, `MAX(x)` | the smallest, the largest |\n\n```sql\nSELECT COUNT(*), AVG(price) FROM products;\n```'),
    ansS('What does this query return?', ['40'], 'The Backpack is the most expensive.', 'SELECT MAX(price) FROM products;'),
    ex('The orders table', 'The shop also has an `orders` table. Each row is one order: who bought (`customer_id`), what (`product_id`) and how many (`qty`).\n\n' + ORDERS_TABLE),
    ansS('What does this query return?', ['12'], '1 + 3 + 2 + 1 + 5 = 12 items ordered in total.', 'SELECT SUM(qty) FROM orders;'),
    ex('GROUP BY', '**GROUP BY** makes one summary row **per group**:\n\n```sql\nSELECT category, COUNT(*) AS how_many\nFROM products\nGROUP BY category;\n```\n\n| category | how_many |\n|---|---|\n| Bags | 2 |\n| Kitchen | 2 |\n| Office | 3 |'),
    ex('HAVING', '**WHERE** filters rows *before* grouping. **HAVING** filters the groups *after*:\n\n```sql\nSELECT category, COUNT(*) FROM products\nGROUP BY category\nHAVING COUNT(*) > 2;     -- only Office\n```'),
    mc('You want only the categories that have more than 2 products. Which do you use?', ['HAVING COUNT(*) > 2', 'WHERE COUNT(*) > 2'], 0, 'COUNT(*) only exists after grouping, so it goes in HAVING.'),
    q({
      prompt: 'For each **category**, show the category and its average price **rounded to 2 decimals**, as a column named **avg_price**. Sort by category.\n\nUse `ROUND(AVG(price), 2) AS avg_price`.',
      tests: [colsAre(['category', 'avg_price']), rowsAre([['Bags', 32.5], ['Kitchen', 13.5], ['Office', 4.67]])],
      hints: ['SELECT category, ROUND(AVG(price), 2) AS avg_price FROM products …', '… GROUP BY category ORDER BY category;'],
      solution: 'SELECT category, ROUND(AVG(price), 2) AS avg_price\nFROM products\nGROUP BY category\nORDER BY category;\n',
    }),
    q({
      prompt: 'Using `orders`: for each **customer_id**, show the customer_id and their total quantity as **total**. Keep only customers whose total is **more than 3**. Sort by customer_id.',
      tests: [colsAre(['customer_id', 'total']), rowsAre([[1, 4], [2, 7]]), mentions('\\bhaving\\b', 'Filter the groups with HAVING')],
      hints: ['SELECT customer_id, SUM(qty) AS total FROM orders GROUP BY customer_id …', '… HAVING SUM(qty) > 3 ORDER BY customer_id;'],
      solution: 'SELECT customer_id, SUM(qty) AS total\nFROM orders\nGROUP BY customer_id\nHAVING SUM(qty) > 3\nORDER BY customer_id;\n',
    }),
  ],

  // ------------------------------------------------------------------ sq-1-joins
  'sq-1-joins': [
    ex('Tables point at each other', '`orders.customer_id` holds a customer\'s **id**. The names live in the `customers` table:\n\n' + CUSTOMERS_TABLE + '\n\nA **JOIN** stitches the two tables together by matching those ids:\n\n```sql\nSELECT customers.name, orders.qty\nFROM orders\nJOIN customers ON orders.customer_id = customers.id;\n```'),
    mc('In a JOIN, what does the ON part do?', ['Says how rows from the two tables match up', 'Sorts the results', 'Removes NULLs'], 0, 'ON orders.customer_id = customers.id pairs each order with its customer.'),
    ex('Shorter names, more tables', 'Give tables short **aliases**, and join as many tables as you need:\n\n```sql\nSELECT c.name, p.name, o.qty\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nJOIN products p ON o.product_id = p.id;\n```'),
    ansS('How many rows does this query return?', ['5'], 'Every one of the 5 orders has a matching customer.', 'SELECT c.name FROM orders o JOIN customers c ON o.customer_id = c.id;'),
    ex('LEFT JOIN', 'A plain `JOIN` (an **inner** join) keeps only rows that match on **both** sides.\n\nA **LEFT JOIN** keeps **every** row from the left table. Where there\'s no match, the right side is filled with `NULL`:\n\n```sql\nSELECT c.name, o.id\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id;\n```\n\nDee has no orders, so she appears once, with `NULL` for `o.id`.'),
    mc('With `customers LEFT JOIN orders`, which customer shows up with NULL for the order?', ['Dee', 'Ana', 'Nobody'], 0, 'Dee never ordered. An inner JOIN would leave her out completely.'),
    q({
      prompt: 'List every order as the **customer** name and the **product** name, in order of the **order id**.\n\nName the columns `customer` and `product` (use `AS`).',
      tests: [colsAre(['customer', 'product']), rowsAre([['Ana', 'Backpack'], ['Ana', 'Notebook'], ['Bo', 'Water bottle'], ['Cy', 'Stapler'], ['Bo', 'Notebook']])],
      hints: ['FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id', 'SELECT c.name AS customer, p.name AS product … ORDER BY o.id;'],
      solution: 'SELECT c.name AS customer, p.name AS product\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nJOIN products p ON o.product_id = p.id\nORDER BY o.id;\n',
    }),
    q({
      prompt: 'Find the **names** of customers who have **never** ordered. Use a `LEFT JOIN`, then keep the rows where the order is `NULL`.',
      tests: [colsAre(['name']), rowsAre([['Dee']]), mentions('left\\s+join', 'Use a LEFT JOIN')],
      hints: ['FROM customers c LEFT JOIN orders o ON o.customer_id = c.id', 'SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL;'],
      solution: 'SELECT c.name\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.id IS NULL;\n',
    }),
  ],

  // ------------------------------------------------------------------ sq-2-insert
  'sq-2-insert': [
    ex('Adding rows', '```sql\nINSERT INTO products (name, category, price)\nVALUES (\'Ruler\', \'Office\', 3);\n```\n\nList the columns, then the values in the same order. The `id` fills in automatically, because it\'s an `INTEGER PRIMARY KEY`.', 'Don\'t worry about breaking anything: every run here starts with fresh sample data.'),
    mc('Which statement adds a new row?', ['INSERT INTO', 'ADD ROW', 'APPEND'], 0, 'INSERT INTO table (columns) VALUES (values);'),
    ex('Changing and removing rows', '```sql\nUPDATE products SET price = 5 WHERE name = \'Notebook\';\nDELETE FROM orders WHERE qty = 0;\n```\n\n⚠️ **Always** write the `WHERE`. Without it, UPDATE changes **every** row and DELETE removes **every** row.'),
    mc('What does `UPDATE products SET price = 0;` do?', ['Sets EVERY product\'s price to 0', 'Gives an error', 'Changes only the first row'], 0, 'No WHERE = all rows. A classic (and expensive) mistake in real life.'),
    ansS('How many products are left after this statement?', ['4'], '3 Office products are deleted, so 7 − 3 = 4 remain.', "DELETE FROM products WHERE category = 'Office';"),
    q({
      prompt: 'Add a product named **Ruler** in the **Office** category with a price of **3**.',
      tests: [afterRows("SELECT category, price FROM products WHERE name = 'Ruler'", [['Office', 3]], 'A Ruler row exists with category Office and price 3'), afterRows('SELECT COUNT(*) FROM products', [[8]], 'There should now be 8 products')],
      hints: ['INSERT INTO products (name, category, price) VALUES (…);', "INSERT INTO products (name, category, price) VALUES ('Ruler', 'Office', 3);"],
      solution: "INSERT INTO products (name, category, price)\nVALUES ('Ruler', 'Office', 3);\n",
    }),
    q({
      prompt: 'Raise the price of every **Kitchen** product by **2** dollars. Leave all other products alone.',
      tests: [afterRows("SELECT name, price FROM products WHERE category = 'Kitchen' ORDER BY id", [['Water bottle', 14], ['Lunch box', 17]], 'Kitchen prices go up by 2'), afterRows("SELECT price FROM products WHERE name = 'Backpack'", [[40]], 'Other products keep their price')],
      hints: ['UPDATE products SET price = price + 2 …', "UPDATE products SET price = price + 2 WHERE category = 'Kitchen';"],
      solution: "UPDATE products SET price = price + 2\nWHERE category = 'Kitchen';\n",
    }),
    q({
      prompt: 'Delete every order placed by the customer with **id 3**.',
      tests: [afterRows('SELECT COUNT(*) FROM orders WHERE customer_id = 3', [[0]], 'No orders from customer 3 remain'), afterRows('SELECT COUNT(*) FROM orders', [[4]], 'The other 4 orders are still there')],
      hints: ['DELETE FROM orders WHERE …', 'DELETE FROM orders WHERE customer_id = 3;'],
      solution: 'DELETE FROM orders WHERE customer_id = 3;\n',
    }),
  ],

  // ------------------------------------------------------------------ sq-2-schema
  'sq-2-schema': [
    ex('Creating a table', '```sql\nCREATE TABLE customers (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  email TEXT UNIQUE,\n  city TEXT DEFAULT \'Unknown\'\n);\n```\n\n- Common types: `INTEGER`, `REAL` (decimals), `TEXT`.\n- **Constraints** protect the data: `NOT NULL` (required), `UNIQUE` (no duplicates), `DEFAULT` (a value to use when none is given).'),
    ex('Keys', '- A **primary key** uniquely identifies each row. Usually it\'s `id`.\n- A **foreign key** is a column that points at another table\'s primary key:\n\n```sql\ncustomer_id INTEGER REFERENCES customers(id)\n```\n\nForeign keys are how tables link up, and they\'re exactly what you JOIN on.'),
    mc('A primary key must be…', ['unique, and present for every row', 'always text', 'the last column'], 0, 'It\'s each row\'s one-of-a-kind ID.'),
    mc('`orders.customer_id` points at `customers.id`. What is `orders.customer_id`?', ['A foreign key', 'A primary key', 'An index'], 0, 'It refers to a key in another table.'),
    mcS('This table has `email TEXT UNIQUE`. What happens when you insert the same email twice?', ['The second insert fails with an error', 'Both rows are saved', 'The first row is deleted'], 0, 'UNIQUE makes the database refuse duplicates. That\'s safer than checking in app code.', "INSERT INTO users (email) VALUES ('a@x.com');\nINSERT INTO users (email) VALUES ('a@x.com');"),
    ansS('How many primary keys can one table have?', ['1', 'one'], 'Just one. (It can span several columns, but it\'s still one key.)'),
    q({
      prompt: 'Create a table **reviews** with these columns:\n\n- `id` INTEGER PRIMARY KEY\n- `product_id` INTEGER NOT NULL, a foreign key to `products(id)`\n- `stars` INTEGER NOT NULL\n- `comment` TEXT\n\nThen insert one review: product **1**, **5** stars, comment **Great**.',
      tests: [
        afterRows("SELECT name FROM pragma_table_info('reviews') ORDER BY cid", [['id'], ['product_id'], ['stars'], ['comment']], 'reviews has the columns id, product_id, stars, comment'),
        afterRows("SELECT \"notnull\" FROM pragma_table_info('reviews') WHERE name IN ('product_id', 'stars') ORDER BY cid", [[1], [1]], 'product_id and stars are NOT NULL'),
        afterRows("SELECT \"table\", \"to\" FROM pragma_foreign_key_list('reviews')", [['products', 'id']], 'product_id REFERENCES products(id)'),
        afterRows('SELECT product_id, stars, comment FROM reviews', [[1, 5, 'Great']], 'One review: product 1, 5 stars, "Great"'),
      ],
      hints: ['CREATE TABLE reviews (\n  id INTEGER PRIMARY KEY,\n  product_id INTEGER NOT NULL REFERENCES products(id),\n  …\n);', "INSERT INTO reviews (product_id, stars, comment) VALUES (1, 5, 'Great');"],
      solution: "CREATE TABLE reviews (\n  id INTEGER PRIMARY KEY,\n  product_id INTEGER NOT NULL REFERENCES products(id),\n  stars INTEGER NOT NULL,\n  comment TEXT\n);\nINSERT INTO reviews (product_id, stars, comment) VALUES (1, 5, 'Great');\n",
    }),
  ],

  // ------------------------------------------------------------------ sq-3-normalization
  'sq-3-normalization': [
    ex('Why split data into tables?', 'Imagine storing each customer\'s city **in every order row**. When Ana moves, you must change it in **every** one of her orders. Miss one, and your data contradicts itself. That\'s an **update anomaly**.\n\n**Normalization** means organizing tables so **each fact is stored once**. Our shop does this: the city lives only in `customers`, and orders just point at the customer.'),
    mc('Ana\'s city is stored in 50 of her order rows, and she moves. What\'s the risk?', ['You must update 50 rows, and missing one leaves contradictory data', 'There\'s no problem', 'The database gets faster'], 0, 'Duplicated facts drift apart. Store each fact once.'),
    ex('First normal form (1NF)', '**1NF:** each cell holds **one** value, and each row is unique.\n\n❌ `tags = "sale, new, summer"` (a list crammed into one cell)\n\n✅ a separate `product_tags` table with one row per tag'),
    mc('A `tags` column contains "sale, new, summer". Which rule does that break?', ['1NF: one value per cell', 'Nothing: it\'s fine'], 0, 'Lists in a cell are hard to search, count and update.'),
    ex('2NF and 3NF', '- **2NF:** every column depends on the **whole** key. In `enrollments(student_id, course_id, course_title)`, the title depends only on `course_id`, so it belongs in a `courses` table.\n- **3NF:** no column depends on **another non-key** column. In `employees(id, zip, city)`, the city is decided by the zip.\n\nThe classic summary: every column depends on "**the key, the whole key, and nothing but the key**".'),
    mc('`enrollments(student_id, course_id, course_title)`: course_title depends only on course_id. Which form does it break?', ['2NF', '1NF', 'None'], 0, 'It depends on part of the two-column key.'),
    mc('`employees(id, zip, city)`: city depends on zip. Which form does it break?', ['3NF', '1NF'], 0, 'city depends on a non-key column (zip).'),
    mc('What\'s a downside of splitting data into many tables?', ['Queries need more JOINs, which can be slower to read', 'Data gets lost', 'It becomes impossible to query'], 0, 'Sometimes big systems deliberately "denormalize" for speed, but they start normalized.'),
    q({
      prompt: 'Because the data is normalized, the city lives in `customers` and the quantities in `orders`. Find the **total quantity** ordered by customers who live in **Detroit**. Show one column named **total**.',
      tests: [colsAre(['total']), rowsAre([[5]])],
      hints: ['JOIN orders to customers, then filter WHERE c.city = \'Detroit\'', "SELECT SUM(o.qty) AS total FROM orders o JOIN customers c ON o.customer_id = c.id WHERE c.city = 'Detroit';"],
      solution: "SELECT SUM(o.qty) AS total\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nWHERE c.city = 'Detroit';\n",
    }),
  ],

  // ------------------------------------------------------------------ sq-3-indexes
  'sq-3-indexes': [
    ex('Finding rows fast', 'Without help, finding `WHERE customer_id = 2` means checking **every** row: a full **scan**, O(n).\n\nAn **index** is an extra, sorted structure (usually a **B-tree**) that jumps straight to the matching rows in about **O(log n)** steps. It\'s like the index at the back of a book.\n\n```sql\nCREATE INDEX idx_orders_customer ON orders(customer_id);\n```\n\nPrimary keys get an index automatically.'),
    mc('What does an index on `orders(customer_id)` speed up?', ['Finding rows by customer_id (in WHERE, JOIN and ORDER BY)', 'Every INSERT', 'Saving disk space'], 0, 'Faster lookups on that column.'),
    mc('What\'s the cost of an index?', ['It uses extra space and slows down inserts and updates a little', 'Nothing at all', 'It can delete data'], 0, 'Every write must also update the index. Index the columns you search, not everything.'),
    ans('A B-tree lookup takes about log₂(n) steps. Roughly how many steps to find one row among 1,000,000? (2²⁰ ≈ 1,000,000.)', ['20', 'about 20', '~20'], 'About 20 steps, instead of up to a million for a scan.'),
    mc('A huge orders table is often searched by customer. Which column most deserves an index?', ['customer_id', 'qty'], 0, 'Index the columns you filter and join on.'),
    q({
      prompt: 'Create an index named **idx_orders_customer** on the `customer_id` column of `orders`.',
      tests: [
        afterRows("SELECT tbl_name FROM sqlite_master WHERE type = 'index' AND name = 'idx_orders_customer'", [['orders']], 'An index named idx_orders_customer exists on orders'),
        afterRows("SELECT name FROM pragma_index_info('idx_orders_customer')", [['customer_id']], 'The index covers customer_id'),
      ],
      hints: ['CREATE INDEX name ON table(column);', 'CREATE INDEX idx_orders_customer ON orders(customer_id);'],
      solution: 'CREATE INDEX idx_orders_customer ON orders(customer_id);\n',
    }),
  ],

  // ------------------------------------------------------------------ sq-3-transactions
  'sq-3-transactions': [
    ex('All or nothing', 'Moving $30 from Ana to Bo takes **two** updates: subtract from Ana, add to Bo. If the power fails in between, the money vanishes!\n\nA **transaction** groups statements so they **all happen, or none do**:\n\n```sql\nBEGIN;\nUPDATE accounts SET balance = balance - 30 WHERE owner = \'Ana\';\nUPDATE accounts SET balance = balance + 30 WHERE owner = \'Bo\';\nCOMMIT;      -- make it permanent\n```\n\n`ROLLBACK` instead of `COMMIT` undoes everything since `BEGIN`.'),
    mc('Money leaves Ana\'s account, then the server crashes before it reaches Bo. How does a transaction help?', ['It\'s all-or-nothing: the half-done change is undone', 'It retries forever', 'It deletes both accounts'], 0, 'Without COMMIT, the database rolls the first update back.'),
    ex('ACID', 'Databases promise four things about transactions, called **ACID**:\n\n- **Atomicity**: all or nothing\n- **Consistency**: rules (like NOT NULL and foreign keys) are never broken\n- **Isolation**: transactions running at the same time don\'t see each other\'s half-finished work\n- **Durability**: once committed, it survives a crash'),
    mc('Which ACID property means "once committed, it survives a crash"?', ['Durability', 'Atomicity', 'Isolation'], 0, 'Durable = it lasts.'),
    mc('What does Isolation mean?', ['Transactions running at the same time don\'t see each other\'s half-finished changes', 'The data is encrypted', 'Only one person can ever use the database'], 0, 'Many users at once, but each sees a consistent picture.'),
    ansS('What does this query return?', ['40'], 'ROLLBACK undid the UPDATE, so the Backpack still costs 40.', "BEGIN;\nUPDATE products SET price = 0;\nROLLBACK;\nSELECT price FROM products WHERE name = 'Backpack';"),
    q({
      prompt: 'This exercise has its own `accounts` table: **Ana** has 100 and **Bo** has 50.\n\nMove **30** from Ana to Bo inside a transaction: `BEGIN`, two `UPDATE`s, then `COMMIT`.',
      setup: "CREATE TABLE accounts (id INTEGER PRIMARY KEY, owner TEXT NOT NULL, balance INTEGER NOT NULL);\nINSERT INTO accounts VALUES (1, 'Ana', 100), (2, 'Bo', 50);",
      tests: [
        afterRows('SELECT owner, balance FROM accounts ORDER BY id', [['Ana', 70], ['Bo', 80]], 'Ana has 70 and Bo has 80'),
        mentions('\\bbegin\\b', 'Start with BEGIN'),
        mentions('\\bcommit\\b', 'Finish with COMMIT'),
      ],
      hints: ['BEGIN;\nUPDATE accounts SET balance = balance - 30 WHERE owner = \'Ana\';', "UPDATE accounts SET balance = balance + 30 WHERE owner = 'Bo';\nCOMMIT;"],
      solution: "BEGIN;\nUPDATE accounts SET balance = balance - 30 WHERE owner = 'Ana';\nUPDATE accounts SET balance = balance + 30 WHERE owner = 'Bo';\nCOMMIT;\n",
    }),
    mc('You run BEGIN, then two UPDATEs, then ROLLBACK. What\'s kept?', ['Neither update', 'Both updates', 'Only the first update'], 0, 'ROLLBACK undoes everything since BEGIN.'),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'sq-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      ansS('What does this query return?', ['2'], 'The Pen.', 'SELECT MIN(price) FROM products;'),
      ansS('What does this query return?', ['4'], 'Ana, Bo, Cy and Dee.', 'SELECT COUNT(*) FROM customers;'),
      ansS('How many rows does this query return?', ['2'], 'Ana and Cy live in Detroit.', "SELECT name FROM customers WHERE city = 'Detroit';"),
      mc('To sort from highest to lowest, use…', ['ORDER BY x DESC', 'ORDER BY x ASC', 'SORT x'], 0, 'DESC = descending.'),
      mc('Filtering groups after GROUP BY uses…', ['HAVING', 'WHERE'], 0, 'HAVING.'),
      mc('Which join keeps every row of the left table?', ['LEFT JOIN', 'INNER JOIN'], 0, 'LEFT JOIN.'),
      ansS('What does this query return?', ['3'], 'Office has Notebook, Pen and Stapler.', "SELECT COUNT(*) FROM products WHERE category = 'Office';"),
      q({ prompt: 'Show each **customer name** and how many orders they placed as **n**, for customers with at least one order. Sort by name.', tests: [colsAre(['name', 'n']), rowsAre([['Ana', 2], ['Bo', 2], ['Cy', 1]])], hints: ['JOIN customers and orders, GROUP BY the customer'], solution: 'SELECT c.name, COUNT(*) AS n\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nGROUP BY c.id\nORDER BY c.name;\n' }),
    ],
  },
  'sq-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Which statement changes existing rows?', ['UPDATE', 'INSERT', 'CREATE'], 0, 'UPDATE … SET … WHERE ….'),
      mc('DELETE FROM orders; (no WHERE) deletes…', ['every order', 'nothing', 'the first order'], 0, 'Always use WHERE.'),
      mc('A column that points to another table\'s primary key is a…', ['foreign key', 'primary key'], 0, 'Foreign key.'),
      mc('Which constraint stops duplicate emails?', ['UNIQUE', 'NOT NULL', 'DEFAULT'], 0, 'UNIQUE.'),
      mc('Which constraint makes a column required?', ['NOT NULL', 'UNIQUE', 'PRIMARY'], 0, 'NOT NULL.'),
      ansS('How many products are left after this statement?', ['5'], 'Bags has 2 products: 7 − 2.', "DELETE FROM products WHERE category = 'Bags';"),
      q({ prompt: 'Add a customer named **Eve** from **Boston**.', tests: [afterRows("SELECT city FROM customers WHERE name = 'Eve'", [['Boston']], 'Eve from Boston exists'), afterRows('SELECT COUNT(*) FROM customers', [[5]], '5 customers now')], solution: "INSERT INTO customers (name, city) VALUES ('Eve', 'Boston');\n" }),
    ],
  },
  'sq-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Normalization mainly aims to…', ['store each fact once', 'make tables bigger', 'remove all JOINs'], 0, 'Avoid duplicated facts.'),
      mc('A cell holding "red, green, blue" breaks…', ['1NF', '3NF'], 0, 'One value per cell.'),
      mc('An index usually makes reads ___ and writes ___.', ['faster, a bit slower', 'slower, faster'], 0, 'The trade-off.'),
      mc('Indexes are typically built as…', ['B-trees', 'linked lists', 'stacks'], 0, 'B-trees.'),
      mc('ROLLBACK…', ['undoes the changes since BEGIN', 'saves the changes'], 0, 'Undo.'),
      mc('The "A" in ACID stands for…', ['Atomicity', 'Accuracy', 'Availability'], 0, 'All or nothing.'),
      q({ prompt: 'Create an index named **idx_products_category** on `products(category)`.', tests: [afterRows("SELECT name FROM pragma_index_info('idx_products_category')", [['category']], 'Index idx_products_category on category')], solution: 'CREATE INDEX idx_products_category ON products(category);\n' }),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  sql: {
    passScore: 0.8, hearts: 3,
    questions: [
      ansS('What does this query return?', ['106'], '4 + 2 + 40 + 12 + 15 + 25 + 8.', 'SELECT SUM(price) FROM products;'),
      ansS('How many rows does this query return?', ['4'], 'Backpack 40, Laptop sleeve 25, Lunch box 15, Water bottle 12.', 'SELECT name FROM products WHERE price > 10;'),
      ansS('What does this query return?', ['Pen'], 'The cheapest product comes first.', 'SELECT name FROM products ORDER BY price LIMIT 1;'),
      mc('Which clause filters rows before grouping?', ['WHERE', 'HAVING'], 0, 'WHERE.'),
      mc('An inner JOIN keeps…', ['only rows that match in both tables', 'every row from both tables'], 0, 'Matches only.'),
      mc('UPDATE without WHERE changes…', ['every row', 'no rows'], 0, 'Careful!'),
      mc('`customer_id INTEGER REFERENCES customers(id)` is a…', ['foreign key', 'index'], 0, 'Foreign key.'),
      mc('Durability means a committed transaction…', ['survives crashes', 'runs fast'], 0, 'It lasts.'),
      mc('`employees(id, zip, city)` where city depends on zip breaks…', ['3NF', '1NF'], 0, 'Non-key dependency.'),
      q({ prompt: 'Show each **city** and its number of customers as **n**, sorted by city.', tests: [colsAre(['city', 'n']), rowsAre([['Austin', 1], ['Chicago', 1], ['Detroit', 2]])], solution: 'SELECT city, COUNT(*) AS n\nFROM customers\nGROUP BY city\nORDER BY city;\n' }),
    ],
  },
};
