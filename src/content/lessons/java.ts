/**
 * Track: java — "Java & OOP"
 * Written here: jv-1 (basics), jv-2 (objects), jv-3 (collections, generics, exceptions) + checkpoints + final exam.
 *
 * Java can't run in the browser yet (needs a server runner), so this course is explain + quiz with Java code to
 * READ, plus Python exercises for the shared ideas (classes, interfaces, maps). Every Java "What does this print?"
 * snippet was compiled with javac 17 and run before publishing (snippets without a class are wrapped in
 * `public class Main { public static void main(String[] args) { … } }` with `import java.util.*;`).
 */
import type { AnswerStep, Checkpoint, ChoiceStep, Step } from '../types';
import { ans, eq, ex, mc, py } from './_helpers';

const mcJv = (prompt: string, choices: string[], answer: number, explanation: string, code?: string): ChoiceStep => ({
  ...mc(prompt, choices, answer, explanation), ...(code ? { code, language: 'java' as const } : {}),
});
const ansJv = (prompt: string, accept: string[], explanation: string, code?: string): AnswerStep => ({
  ...ans(prompt, accept, explanation), ...(code ? { code, language: 'java' as const } : {}),
});

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ jv-1-hello
  'jv-1-hello': [
    ex('Hello, Java', 'Java is used for Android apps, big company back ends, and many university courses. Every Java program lives inside a **class**:\n\n```java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}\n```\n\n- the program starts in **`main`**\n- `System.out.println` prints a line (like Python\'s `print`)\n- statements end with `;`, and blocks use `{ }`', 'Java can\'t run in this practice editor yet, so you\'ll read Java and practice the shared ideas in Python.'),
    ex('Compile, then run', 'Java is compiled to **bytecode**, which runs on the **Java Virtual Machine (JVM)**:\n\n```\n$ javac Main.java     # compile → Main.class\n$ java Main           # run on the JVM\n```\n\nThe same `.class` file runs on Windows, Mac or Linux: "write once, run anywhere".'),
    mc('What does javac produce?', ['Bytecode (.class files) for the JVM', 'Python code', 'A web page'], 0, 'The JVM then runs that bytecode, compiling hot parts to machine code as it goes.'),
    mcJv('What does this print?', ['Hi Pip', 'Hi + Pip', '"Hi Pip"'], 0, '+ joins strings in Java too.', 'System.out.println("Hi " + "Pip");'),
    mc('Where does a Java program start running?', ['public static void main(String[] args)', 'The first line of the file', 'A function called start()'], 0, 'The JVM looks for main.'),
    ansJv('What does this print?', ['Hi there'], 'print (without "ln") doesn\'t end the line, so "there" continues on the same line.', 'System.out.print("Hi ");\nSystem.out.println("there");'),
    mc('What\'s the difference between print and println?', ['println ends the line afterward; print doesn\'t', 'print is faster', 'There is none'], 0, '"ln" = line.'),
  ],

  // ------------------------------------------------------------------ jv-1-types
  'jv-1-types': [
    ex('Static types', 'Java checks types **before** running (static typing, like TypeScript):\n\n```java\nint count = 3;\ndouble price = 9.99;\nboolean ready = true;\nchar grade = \'A\';\nString name = "Pip";   // String is a class: capital S\n\ncount = "three";        // ❌ compile error\n```\n\nThe compiler catches type mistakes before your users ever see them.'),
    mcJv('Which line fails to compile?', ['Line 2', 'Line 1', 'Neither'], 0, 'age is an int; a String can\'t go in it.', 'int age = 30;\nage = "thirty";'),
    ansJv('What does this print?', ['3'], 'int / int is integer division in Java, just like C.', 'int a = 7, b = 2;\nSystem.out.println(a / b);'),
    ansJv('What does this print?', ['3.5'], 'One double makes the whole division a double.', 'double a = 7;\nint b = 2;\nSystem.out.println(a / b);'),
    ex('Primitives vs objects', 'Java has 8 **primitive** types (`int`, `double`, `boolean`, `char`, `long`, …) that hold plain values. Everything else is an **object**, like `String`.\n\n⚠️ Compare Strings with **`.equals`**, not `==`. For objects, `==` checks whether they\'re the **same object**, not whether they have the same text.'),
    mc('How should you check whether two Strings have the same text?', ['a.equals(b)', 'a == b', 'a === b'], 0, '== compares identity for objects. It can work by accident, then fail later.'),
    ex('var', 'Modern Java can **infer** a local variable\'s type:\n\n```java\nvar total = 0;      // int\nvar name = "Pip";   // String\n```\n\nThe type is still fixed. `var` just saves typing.'),
    mc('After `var x = 5;`, can you write `x = "five";`?', ['No: x is still an int', 'Yes: var means any type'], 0, 'var is inference, not dynamic typing.'),
  ],

  // ------------------------------------------------------------------ jv-1-control
  'jv-1-control': [
    ex('if and loops', 'Java\'s control flow looks just like JavaScript\'s and C\'s:\n\n```java\nif (score >= 90) {\n    System.out.println("A");\n} else if (score >= 80) {\n    System.out.println("B");\n} else {\n    System.out.println("Keep going");\n}\n\nfor (int i = 0; i < 3; i++) { … }\nwhile (n > 0) { … }\n```'),
    ansJv('What does this print?', ['B'], '85 is not ≥ 90, but it is ≥ 80.', 'int score = 85;\nif (score >= 90) {\n    System.out.println("A");\n} else if (score >= 80) {\n    System.out.println("B");\n} else {\n    System.out.println("C");\n}'),
    ansJv('What does this print?', ['10'], '0 + 1 + 2 + 3 + 4.', 'int total = 0;\nfor (int i = 0; i < 5; i++) {\n    total += i;\n}\nSystem.out.println(total);'),
    ex('Arrays and for-each', '```java\nint[] nums = {3, 1, 4};\nnums.length;              // 3 (no parentheses for arrays)\n\nfor (int n : nums) {      // "for each n in nums"\n    System.out.println(n);\n}\n```\n\nJava arrays have a **fixed size**. For a growable list, use `ArrayList` (unit 3).'),
    ansJv('What does this print?', ['8'], '3 + 1 + 4.', 'int[] nums = {3, 1, 4};\nint sum = 0;\nfor (int n : nums) {\n    sum += n;\n}\nSystem.out.println(sum);'),
    mcJv('What does `nums.length` give for this array?', ['4', '3', 'an error'], 0, 'Four elements.', 'int[] nums = {9, 8, 7, 6};'),
    ex('switch', '```java\nswitch (day) {\n    case "Sat", "Sun" -> System.out.println("Weekend");\n    default -> System.out.println("Weekday");\n}\n```\n\nThe modern arrow form doesn\'t "fall through" into the next case. Older Java needed a `break` in every case.'),
    mc('In the old style switch, forgetting `break` causes…', ['fall-through: the next case runs too', 'a compile error', 'nothing'], 0, 'One reason the arrow form was added.'),
  ],

  // ------------------------------------------------------------------ jv-2-classes
  'jv-2-classes': [
    ex('Classes and constructors', '```java\npublic class Dog {\n    String name;          // a field\n    int age;\n\n    Dog(String name, int age) {   // the constructor\n        this.name = name;\n        this.age = age;\n    }\n\n    void bark() {                  // a method\n        System.out.println(name + " says woof");\n    }\n}\n\nDog rex = new Dog("Rex", 3);\nrex.bark();\n```\n\n- **`this`** is Java\'s `self`\n- **`new`** creates an object\n- the constructor has the class\'s name and no return type'),
    mc('What is Java\'s equivalent of Python\'s `self`?', ['this', 'me', 'it'], 0, 'this.name = name copies the parameter into the field.'),
    mc('How do you create a Dog object?', ['new Dog("Rex", 3)', 'Dog("Rex", 3)', 'create Dog("Rex", 3)'], 0, 'Java requires new.'),
    ansJv('What does this print?', ['Rex says woof'], 'bark() uses the name field set by the constructor.', 'class Dog {\n    String name;\n    Dog(String name) { this.name = name; }\n    void bark() { System.out.println(name + " says woof"); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Dog("Rex").bark();\n    }\n}'),
    ex('static', '**static** members belong to the **class itself**, not to each object:\n\n```java\nclass Counter {\n    static int created = 0;   // one shared copy\n    Counter() { created++; }\n}\n```\n\nThat\'s why `main` is static: it runs before any object exists.'),
    ansJv('What does this print?', ['3'], 'One shared counter, increased by each of the 3 constructors.', 'class Counter {\n    static int created = 0;\n    Counter() { created++; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Counter(); new Counter(); new Counter();\n        System.out.println(Counter.created);\n    }\n}'),
    py({
      prompt: 'Same idea in Python. Write a class `Dog` whose constructor takes `name` and `age`, and a method `describe()` that returns `"<name> is <age>"`.\n\nAlso add a **class attribute** `created` (shared by all dogs, like Java\'s `static`) that counts how many dogs were made.',
      starter: 'class Dog:\n    pass\n',
      tests: [
        { name: 'describe works', code: 'assert Dog("Rex", 3).describe() == "Rex is 3"' },
        { name: 'created counts every dog', code: 'start = Dog.created\nDog("A", 1); Dog("B", 2)\nassert Dog.created == start + 2, f"expected {start + 2}, got {Dog.created}"' },
      ],
      hints: ['class Dog:\n    created = 0   # class attribute', 'In __init__: self.name = name; self.age = age; Dog.created += 1'],
      solution: 'class Dog:\n    created = 0\n\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n        Dog.created += 1\n\n    def describe(self):\n        return f"{self.name} is {self.age}"\n',
    }),
  ],

  // ------------------------------------------------------------------ jv-2-encapsulation
  'jv-2-encapsulation': [
    ex('Hiding the details', '**Encapsulation** = keep an object\'s data private, and let other code change it only through methods that keep it valid:\n\n```java\npublic class Account {\n    private double balance;           // nobody outside can touch this\n\n    public double getBalance() { return balance; }\n\n    public void deposit(double amount) {\n        if (amount <= 0) throw new IllegalArgumentException("must be positive");\n        balance += amount;\n    }\n}\n```'),
    mc('Why make balance private?', ['So it can only change through methods that check the rules', 'To make it faster', 'Private fields use less memory'], 0, 'Nobody can set balance = -1,000,000 by accident.'),
    ex('Access modifiers', '| Modifier | Visible to |\n|---|---|\n| `public` | everyone |\n| `private` | only this class |\n| `protected` | this class, subclasses and the package |\n| (none) | classes in the same package |'),
    mc('Which modifier lets ONLY the class itself see a field?', ['private', 'public', 'protected'], 0, 'private.'),
    mcJv('What happens when another class tries `acct.balance = 5;` with a private balance?', ['A compile error', 'It works', 'It sets 0 instead'], 0, 'The compiler enforces privacy.', 'Account acct = new Account();\nacct.balance = 5;'),
    mc('Getters and setters are…', ['public methods that read or change private fields', 'special Java keywords', 'a kind of loop'], 0, 'Like getBalance() and deposit().'),
    py({
      prompt: 'Python uses a convention instead of a keyword: a leading underscore means "private, please don\'t touch". Write `Account` with a `_balance` that starts at 0, `get_balance()`, and `deposit(amount)`, which raises `ValueError` for amounts ≤ 0.',
      starter: 'class Account:\n    pass\n',
      tests: [
        { name: 'deposits add up', code: 'a = Account()\na.deposit(50)\na.deposit(25)\nassert a.get_balance() == 75' },
        { name: 'rejects bad deposits', code: 'a = Account()\ntry:\n    a.deposit(-5)\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("deposit(-5) should raise ValueError")\nassert a.get_balance() == 0' },
      ],
      hints: ['def __init__(self): self._balance = 0', 'def deposit(self, amount):\n    if amount <= 0:\n        raise ValueError("must be positive")\n    self._balance += amount'],
      solution: 'class Account:\n    def __init__(self):\n        self._balance = 0\n\n    def get_balance(self):\n        return self._balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("must be positive")\n        self._balance += amount\n',
    }),
  ],

  // ------------------------------------------------------------------ jv-2-interfaces
  'jv-2-interfaces': [
    ex('Interfaces', 'An **interface** is a contract: "any class that implements me has these methods":\n\n```java\ninterface Shape {\n    double area();\n}\n\nclass Square implements Shape {\n    double side;\n    Square(double s) { side = s; }\n    public double area() { return side * side; }\n}\n```\n\nCode can then work with **any** `Shape` without knowing which kind it is.'),
    mc('What does `implements Shape` promise?', ['The class provides every method Shape lists', 'The class is a subclass of Shape\'s fields', 'Nothing'], 0, 'The compiler checks the promise.'),
    ex('Polymorphism', '```java\nShape[] shapes = { new Square(2), new Circle(1) };\nfor (Shape s : shapes) {\n    System.out.println(s.area());   // each uses its own area()\n}\n```\n\nOne call, different behavior per object: that\'s **polymorphism**.'),
    ansJv('What does this print?', ['4.0'], 'Square(2).area() = 2 × 2, printed as a double.', 'interface Shape { double area(); }\n\nclass Square implements Shape {\n    double side;\n    Square(double s) { side = s; }\n    public double area() { return side * side; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Shape s = new Square(2);\n        System.out.println(s.area());\n    }\n}'),
    ex('Abstract classes', 'An **abstract class** is in between: it can hold shared fields and code, plus `abstract` methods that subclasses must fill in.\n\n- A class can **extend** only **one** class...\n- ...but it can **implement many** interfaces.'),
    mc('How many classes can a Java class extend?', ['One', 'As many as it likes'], 0, 'Single inheritance of classes, many interfaces.'),
    mc('How many interfaces can a class implement?', ['Many', 'Only one'], 0, 'class Duck implements Flyer, Swimmer { … }'),
    py({
      prompt: 'Polymorphism in Python. Write classes `Square(side)` and `Circle(radius)`, each with an `area()` method (use `math.pi` for circles). Then write `total_area(shapes)` that adds up `area()` for any list of shapes.',
      starter: 'import math\n\n\nclass Square:\n    pass\n\n\nclass Circle:\n    pass\n\n\ndef total_area(shapes):\n    pass\n',
      tests: [eq('Square(3).area()', '9'), eq('round(Circle(1).area(), 4)', '3.1416'), eq('round(total_area([Square(2), Circle(1)]), 4)', '7.1416'), eq('total_area([])', '0')],
      hints: ['class Square:\n    def __init__(self, side): self.side = side\n    def area(self): return self.side * self.side', 'total_area: return sum(s.area() for s in shapes)'],
      solution: 'import math\n\n\nclass Square:\n    def __init__(self, side):\n        self.side = side\n\n    def area(self):\n        return self.side * self.side\n\n\nclass Circle:\n    def __init__(self, radius):\n        self.radius = radius\n\n    def area(self):\n        return math.pi * self.radius ** 2\n\n\ndef total_area(shapes):\n    return sum(s.area() for s in shapes)\n',
    }),
  ],

  // ------------------------------------------------------------------ jv-3-collections
  'jv-3-collections': [
    ex('ArrayList', 'A growable list (like Python\'s `list`):\n\n```java\nimport java.util.ArrayList;\n\nArrayList<String> names = new ArrayList<>();\nnames.add("Ana");\nnames.add("Bo");\nnames.get(0);      // "Ana"\nnames.size();      // 2\n```\n\n`<String>` says what the list holds. Lists hold objects, so numbers use `Integer` rather than `int`.'),
    ansJv('What does this print?', ['2'], 'Two items were added.', 'ArrayList<String> names = new ArrayList<>();\nnames.add("Ana");\nnames.add("Bo");\nSystem.out.println(names.size());'),
    ex('HashMap', 'Key → value pairs (like Python\'s `dict`):\n\n```java\nimport java.util.HashMap;\n\nHashMap<String, Integer> ages = new HashMap<>();\nages.put("Ana", 30);\nages.get("Ana");              // 30\nages.getOrDefault("Zed", 0);  // 0\nages.containsKey("Bo");       // false\n```'),
    ansJv('What does this print?', ['31'], 'put replaces the old value for "Ana".', 'HashMap<String, Integer> ages = new HashMap<>();\nages.put("Ana", 30);\nages.put("Ana", 31);\nSystem.out.println(ages.get("Ana"));'),
    mc('Which Java collection works like a Python dict?', ['HashMap', 'ArrayList', 'int[]'], 0, 'Keys to values.'),
    mc('Why `ArrayList<Integer>` instead of `ArrayList<int>`?', ['Collections hold objects, and Integer is the object version of int', 'int is too small', 'It\'s a typo'], 0, 'Java converts automatically between them ("autoboxing").'),
    py({
      prompt: 'Translate this Java word counter into Python:\n\n```java\nHashMap<String, Integer> counts = new HashMap<>();\nfor (String w : words) {\n    counts.put(w, counts.getOrDefault(w, 0) + 1);\n}\n```\n\nWrite `count_words(words)` that returns the dict.',
      starter: 'def count_words(words):\n    pass\n',
      tests: [eq('count_words(["a", "b", "a"])', '{"a": 2, "b": 1}'), eq('count_words([])', '{}')],
      hints: ['counts = {}; for w in words: counts[w] = counts.get(w, 0) + 1', 'return counts'],
      solution: 'def count_words(words):\n    counts = {}\n    for w in words:\n        counts[w] = counts.get(w, 0) + 1\n    return counts\n',
    }),
  ],

  // ------------------------------------------------------------------ jv-3-generics
  'jv-3-generics': [
    ex('Type parameters', '**Generics** let one class or method work with many types **safely**:\n\n```java\nclass Box<T> {\n    private T value;\n    Box(T value) { this.value = value; }\n    T get() { return value; }\n}\n\nBox<String> b = new Box<>("hi");\nString s = b.get();     // no cast needed\n```\n\n`T` is a placeholder filled in when you use the class, the same idea as TypeScript generics.'),
    mc('In `Box<String>`, what is T?', ['String', 'T', 'Object'], 0, 'The type argument fills the placeholder.'),
    mcJv('Does this compile?', ['No: the list only holds Strings', 'Yes'], 0, 'Generics catch the mistake at compile time.', 'ArrayList<String> names = new ArrayList<>();\nnames.add(42);'),
    ex('Generic methods', '```java\nstatic <T> T first(List<T> items) {\n    return items.get(0);\n}\n\nString s = first(List.of("a", "b"));   // T = String\n```\n\nBefore generics (Java 5), collections held plain `Object`s and you had to cast everything, causing crashes at run time instead of errors at compile time.'),
    mc('What\'s the main benefit of generics?', ['Type errors are caught at compile time, and no casts are needed', 'Programs run faster', 'Less memory'], 0, 'Safety and clarity.'),
    ansJv('What does this print?', ['hi'], 'The Box holds a String and get() returns it.', 'class Box<T> {\n    private T value;\n    Box(T value) { this.value = value; }\n    T get() { return value; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Box<String> b = new Box<>("hi");\n        System.out.println(b.get());\n    }\n}'),
    mc('`Map<String, List<Integer>>` maps…', ['each String to a list of Integers', 'each Integer to a String', 'nothing: it\'s invalid'], 0, 'Generics nest.'),
  ],

  // ------------------------------------------------------------------ jv-3-exceptions
  'jv-3-exceptions': [
    ex('try / catch / finally', '```java\ntry {\n    int n = Integer.parseInt("abc");\n} catch (NumberFormatException e) {\n    System.out.println("Not a number");\n} finally {\n    System.out.println("Always runs");\n}\n```\n\nSame idea as Python\'s try/except/finally.'),
    ansJv('What does this print? (Give the first line only.)', ['Not a number'], 'parseInt("abc") throws NumberFormatException, which is caught.', 'try {\n    int n = Integer.parseInt("abc");\n    System.out.println(n);\n} catch (NumberFormatException e) {\n    System.out.println("Not a number");\n}'),
    ex('Checked vs unchecked', 'Java has two kinds of exceptions:\n\n- **Checked** (like `IOException`): things that can go wrong even in correct code, like a missing file. The compiler **forces** you to catch them or declare `throws IOException`.\n- **Unchecked** (`RuntimeException`s, like `NullPointerException`): usually bugs. Not forced.'),
    mc('Which kind does the compiler FORCE you to handle?', ['Checked exceptions (like IOException)', 'Unchecked exceptions (like NullPointerException)'], 0, 'Checked = checked by the compiler.'),
    mcJv('Why won\'t this compile?', ['readFile can throw a checked IOException that\'s neither caught nor declared', 'Missing semicolon', 'Strings can\'t be returned'], 0, 'Add `throws IOException` or a try/catch.', 'String load() {\n    return Files.readString(Path.of("data.txt"));\n}'),
    mc('`NullPointerException` usually means…', ['you used a variable that holds null as if it were an object', 'the file is missing', 'the network is down'], 0, 'The most famous Java bug.'),
    py({
      prompt: 'Like Java\'s `Integer.parseInt` in a try/catch: write `parse_or_default(s, default)` that returns `int(s)`, or `default` if s isn\'t a valid integer. Catch only `ValueError`.',
      starter: 'def parse_or_default(s, default):\n    pass\n',
      tests: [eq('parse_or_default("42", 0)', '42'), eq('parse_or_default("abc", -1)', '-1'), { name: 'catches ValueError specifically', code: 'assert "except ValueError" in __source__, "Catch ValueError specifically, not every exception"' }],
      hints: ['try:\n    return int(s)\nexcept ValueError:\n    return default'],
      solution: 'def parse_or_default(s, default):\n    try:\n        return int(s)\n    except ValueError:\n        return default\n',
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'jv-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Java code is compiled to…', ['bytecode for the JVM', 'Python'], 0, 'javac → .class.'),
      ansJv('What does this print?', ['2'], 'Integer division.', 'System.out.println(5 / 2);'),
      mc('Compare String text with…', ['.equals()', '=='], 0, '== is identity.'),
      ansJv('What does this print?', ['6'], '1 + 2 + 3.', 'int t = 0;\nfor (int i = 1; i <= 3; i++) {\n    t += i;\n}\nSystem.out.println(t);'),
      mc('A Java array\'s size is…', ['fixed', 'growable'], 0, 'Use ArrayList to grow.'),
      mc('`var x = 5;` makes x…', ['an int', 'any type'], 0, 'Inferred.'),
    ],
  },
  'jv-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Java\'s version of self is…', ['this', 'self'], 0, 'this.'),
      mc('Objects are created with…', ['new', 'make'], 0, 'new.'),
      mc('A static field is…', ['shared by the whole class', 'copied into each object'], 0, 'One copy.'),
      mc('private fields are visible to…', ['only their own class', 'everyone'], 0, 'Encapsulation.'),
      mc('A class can extend…', ['one class', 'many classes'], 0, 'Single inheritance.'),
      mc('Calling the same method on different objects and getting different behavior is…', ['polymorphism', 'encapsulation'], 0, 'Polymorphism.'),
      py({ prompt: 'Write class `Temp` with a private-by-convention `_c` (Celsius) set in the constructor and a method `to_f()` returning Fahrenheit (c × 9/5 + 32).', starter: 'class Temp:\n    pass\n', tests: [eq('Temp(100).to_f()', '212.0'), eq('Temp(0).to_f()', '32.0')], solution: 'class Temp:\n    def __init__(self, c):\n        self._c = c\n\n    def to_f(self):\n        return self._c * 9 / 5 + 32\n' }),
    ],
  },
  'jv-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('A growable Java list is…', ['ArrayList', 'int[]'], 0, 'ArrayList.'),
      ansJv('What does this print?', ['3'], 'Three adds.', 'ArrayList<Integer> xs = new ArrayList<>();\nxs.add(1); xs.add(2); xs.add(3);\nSystem.out.println(xs.size());'),
      mc('HashMap.getOrDefault returns…', ['the value, or a default if the key is missing', 'always the default'], 0, 'Safe lookup.'),
      mc('Generics catch type mistakes at…', ['compile time', 'run time'], 0, 'Before running.'),
      mc('IOException is…', ['checked', 'unchecked'], 0, 'Must handle or declare.'),
      mc('A finally block runs…', ['always', 'only on errors'], 0, 'Cleanup.'),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  java: {
    passScore: 0.8, hearts: 3,
    questions: [
      ansJv('What does this print?', ['12'], '"1" + 2 is string concatenation.', 'System.out.println("1" + 2);'),
      ansJv('What does this print?', ['3'], 'Integer division.', 'System.out.println(10 / 3);'),
      mc('The JVM runs…', ['bytecode', 'C source'], 0, 'Bytecode.'),
      mc('Encapsulation means…', ['hiding data behind methods that keep it valid', 'putting everything in main'], 0, 'Private + methods.'),
      mc('An interface is…', ['a contract of methods', 'a kind of loop'], 0, 'Contract.'),
      mc('Which is Java\'s dict?', ['HashMap', 'ArrayList'], 0, 'HashMap.'),
      ansJv('What does this print?', ['B'], 'The second put replaces the value for key 1.', 'HashMap<Integer, String> m = new HashMap<>();\nm.put(1, "A");\nm.put(1, "B");\nSystem.out.println(m.get(1));'),
      mc('NullPointerException is…', ['unchecked', 'checked'], 0, 'A RuntimeException.'),
      py({ prompt: 'Write `Stack` with `push(x)`, `pop()` (raise IndexError when empty) and `size()`: the same API as Java\'s Deque used as a stack.', starter: 'class Stack:\n    pass\n', tests: [{ name: 'LIFO order', code: 's = Stack()\ns.push(1); s.push(2)\nassert s.pop() == 2 and s.size() == 1' }, { name: 'empty pop raises IndexError', code: 's = Stack()\ntry:\n    s.pop()\nexcept IndexError:\n    pass\nelse:\n    raise AssertionError("pop on empty should raise IndexError")' }], solution: 'class Stack:\n    def __init__(self):\n        self.items = []\n\n    def push(self, x):\n        self.items.append(x)\n\n    def pop(self):\n        if not self.items:\n            raise IndexError("pop from empty stack")\n        return self.items.pop()\n\n    def size(self):\n        return len(self.items)\n' }),
    ],
  },
};
