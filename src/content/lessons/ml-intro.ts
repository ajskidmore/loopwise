/**
 * Track: ml-intro — "Intro to Machine Learning"
 * Written here: ml-1 (foundations), ml-2 (core models), ml-3 (neural networks) + checkpoints + course final exam.
 * Everything is built from scratch in plain Python (no numpy/scikit-learn), using ideas from the
 * Probability, Linear Algebra and Calculus courses. Every number was double-checked in Python.
 */
import type { Checkpoint, Step } from '../types';
import { ans, eq, ex, mc, py } from './_helpers';

/** Test: round(expr, places) equals value — for float results. */
const near = (expr: string, value: string, places = 3, name?: string) => eq(`round(${expr}, ${places})`, value, name);

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ ml-1-what-is-ml
  'ml-1-what-is-ml': [
    ex('Learning from examples', 'Normal programming: **you** write the rules.\n\n**Machine learning (ML)**: you give the computer **examples**, and it finds the rules itself.\n\nWriting rules to spot spam is hopeless: spammers change their wording daily. But show a model a million emails labeled "spam" or "not spam", and it learns the patterns.', 'You\'ve already learned the math ML runs on: probability, vectors and matrices, and derivatives. Now it all comes together.'),
    ex('Three kinds of learning', '- **Supervised**: examples come with the right answers (**labels**). Learn to predict the label.\n- **Unsupervised**: no labels. Find structure, like groups of similar customers (**clustering**).\n- **Reinforcement**: learn by trial and error from **rewards**, like a game-playing agent.'),
    mc('Predicting house prices from past sales (with their prices) is…', ['supervised learning', 'unsupervised learning', 'reinforcement learning'], 0, 'Each example comes with the answer (the price).'),
    mc('Grouping customers by similar shopping habits, with no labels, is…', ['unsupervised learning', 'supervised learning', 'reinforcement learning'], 0, 'Nobody told it the groups. It finds them.'),
    mc('A robot learning to walk by getting a reward for each step forward is…', ['reinforcement learning', 'supervised learning'], 0, 'Trial, error and rewards.'),
    ex('Regression vs classification', 'Supervised problems come in two flavors:\n\n- **Regression**: predict a **number** (price, temperature, minutes)\n- **Classification**: predict a **category** (spam or not, cat/dog/bird)'),
    mc('Predicting whether an email is spam is…', ['classification', 'regression'], 0, 'The answer is a category.'),
    mc('Predicting tomorrow\'s high temperature is…', ['regression', 'classification'], 0, 'The answer is a number.'),
    py({
      prompt: 'Your first "learning" algorithm. `examples` is a list of `(hours_studied, passed)` pairs, where every fail studied less than every pass.\n\nWrite `learn_threshold(examples)` that returns the **midpoint** between the **most** hours of anyone who **failed** and the **fewest** hours of anyone who **passed**. That number is the rule the data taught us.',
      starter: 'def learn_threshold(examples):\n    pass\n',
      tests: [eq('learn_threshold([(1, False), (2, False), (5, True), (6, True)])', '3.5'), eq('learn_threshold([(0, False), (10, True)])', '5.0'), eq('learn_threshold([(6, True), (3, False), (4, True)])', '3.5')],
      hints: ['most_fail = max(h for h, passed in examples if not passed)', 'least_pass = min(h for h, passed in examples if passed); return (most_fail + least_pass) / 2'],
      solution: 'def learn_threshold(examples):\n    most_fail = max(h for h, passed in examples if not passed)\n    least_pass = min(h for h, passed in examples if passed)\n    return (most_fail + least_pass) / 2\n',
    }),
  ],

  // ------------------------------------------------------------------ ml-1-data
  'ml-1-data': [
    ex('Features and labels', 'A **dataset** is a table:\n\n- each **row** is one example (a house)\n- each **feature** column is something we know (size, rooms, age)\n- the **label** (or target) is what we want to predict (price)\n\nOne example\'s features form a **feature vector**: (1500, 3, 20).'),
    ans('A dataset has 1,000 houses. Each row has size, rooms, age, distance to school and garage spaces, plus the price we want to predict. How many features are there?', ['5', 'five'], 'Five features. The price is the label, not a feature.'),
    ex('Train and test', 'If you grade a model on the same examples it learned from, it can just **memorize** them and look perfect.\n\nSo split the data:\n\n- **training set** (often 80%): the model learns from this\n- **test set** (20%): kept hidden until the end, to measure performance on **new** data'),
    mc('Why keep a test set the model never trains on?', ['To check it works on new examples, not just ones it memorized', 'To save memory', 'Because 100% of the data is too much'], 0, 'Real users bring new data. The test set simulates that.'),
    ans('You have 1,000 examples and use an 80/20 split. How many go in the test set?', ['200'], '20% of 1,000.'),
    ex('Preparing features', '**Scaling:** features on very different scales (size ≈ 2,000 vs rooms ≈ 3) can confuse many models. **Min–max scaling** maps each feature to 0…1:\n\n**(x − min) ÷ (max − min)**\n\n**One-hot encoding** turns categories into numbers. For colors {red, green, blue}: red = [1, 0, 0], green = [0, 1, 0], blue = [0, 0, 1].'),
    ans('Min–max scale the value 15 when the feature ranges from 10 to 30.', ['0.25', '1/4'], '(15 − 10) ÷ (30 − 10) = 5 ÷ 20 = 0.25.'),
    mc('Using one-hot encoding for {red, green, blue}, how is green written?', ['[0, 1, 0]', '2', '[1, 1, 0]'], 0, 'A single 1 in green\'s position. Writing "2" would wrongly suggest green is "between" red and blue.'),
    py({
      prompt: 'Write `min_max(xs)` that returns a new list with every value scaled to 0…1. If all the values are equal, return all zeros (to avoid dividing by zero).',
      starter: 'def min_max(xs):\n    pass\n',
      tests: [eq('min_max([10, 20, 30])', '[0.0, 0.5, 1.0]'), eq('min_max([2, 4])', '[0.0, 1.0]'), eq('min_max([5, 5])', '[0.0, 0.0]')],
      hints: ['lo, hi = min(xs), max(xs); if hi == lo: return [0.0] * len(xs)', 'return [(x - lo) / (hi - lo) for x in xs]'],
      solution: 'def min_max(xs):\n    lo, hi = min(xs), max(xs)\n    if hi == lo:\n        return [0.0] * len(xs)\n    return [(x - lo) / (hi - lo) for x in xs]\n',
    }),
    py({
      prompt: 'Write `split(rows, test_fraction)` that returns `(train, test)`. The test set is the **last** `round(len(rows) * test_fraction)` rows, and the training set is everything before them.\n\n(Real projects shuffle first. We skip that so the results are predictable.)',
      starter: 'def split(rows, test_fraction):\n    pass\n',
      tests: [eq('split([1, 2, 3, 4, 5], 0.2)', '([1, 2, 3, 4], [5])'), eq('split(list(range(10)), 0.3)', '(list(range(7)), [7, 8, 9])')],
      hints: ['n_test = round(len(rows) * test_fraction); cut = len(rows) - n_test', 'return (rows[:cut], rows[cut:])'],
      solution: 'def split(rows, test_fraction):\n    n_test = round(len(rows) * test_fraction)\n    cut = len(rows) - n_test\n    return (rows[:cut], rows[cut:])\n',
    }),
  ],

  // ------------------------------------------------------------------ ml-2-linear-regression
  'ml-2-linear-regression': [
    ex('Fitting a line', '**Linear regression** predicts with a straight line:\n\n**ŷ = w·x + b**\n\n- **w** (weight) is the slope: how much ŷ changes per unit of x\n- **b** (bias) is where the line starts\n- **ŷ** ("y-hat") is the prediction\n\nWith many features, it\'s a dot product: ŷ = **w · x** + b (from Linear Algebra).'),
    ans('w = 2, b = 1. What is the prediction for x = 4?', ['9'], '2 × 4 + 1 = 9.'),
    ex('Measuring the error', 'How good is a line? Compare its predictions with the real answers using the **mean squared error**:\n\n**MSE = average of (ŷ − y)²**\n\nPredictions [2, 4] for real values [3, 4]: the errors are −1 and 0, the squares are 1 and 0, so MSE = **0.5**.\n\n"Training" means finding the w and b that make the loss as small as possible.'),
    ans('Predictions [5, 5] and real values [3, 7]. What is the MSE?', ['4'], 'Errors 2 and −2, squares 4 and 4, average 4.'),
    mc('Why square the errors instead of just averaging them?', ['So negative and positive errors don\'t cancel out, and big misses count extra', 'To make the numbers bigger'], 0, 'Without squaring, errors of −2 and +2 would average to a "perfect" 0.'),
    ex('The best line, by formula', 'For one feature, there\'s an exact formula (from calculus: set the derivatives of the MSE to 0):\n\n- **w = Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)²**\n- **b = ȳ − w·x̄**\n\nx̄ and ȳ are the averages. Most models are too complex for a formula. That\'s why the next lesson uses gradient descent.'),
    py({
      prompt: 'Write `mse(preds, ys)`: the mean squared error between predictions and real values.',
      starter: 'def mse(preds, ys):\n    pass\n',
      tests: [eq('mse([2, 4], [3, 4])', '0.5'), eq('mse([1, 2, 3], [1, 2, 3])', '0.0'), eq('mse([5, 5], [3, 7])', '4.0')],
      hints: ['zip(preds, ys) pairs them up.', 'return sum((p - y) ** 2 for p, y in zip(preds, ys)) / len(ys)'],
      solution: 'def mse(preds, ys):\n    return sum((p - y) ** 2 for p, y in zip(preds, ys)) / len(ys)\n',
    }),
    py({
      prompt: 'Write `fit_line(xs, ys)` that returns `(w, b)` using the formula from the card.',
      starter: 'def fit_line(xs, ys):\n    pass\n',
      tests: [eq('tuple(round(v, 6) for v in fit_line([1, 2, 3, 4], [3, 5, 7, 9]))', '(2.0, 1.0)'), eq('tuple(round(v, 6) for v in fit_line([1, 2, 3], [2, 2, 5]))', '(1.5, 0.0)')],
      hints: ['x_bar = sum(xs) / len(xs), and the same for y_bar.', 'num = sum((x - x_bar) * (y - y_bar) for x, y in zip(xs, ys)); den = sum((x - x_bar) ** 2 for x in xs); w = num / den; b = y_bar - w * x_bar'],
      solution: 'def fit_line(xs, ys):\n    x_bar = sum(xs) / len(xs)\n    y_bar = sum(ys) / len(ys)\n    num = sum((x - x_bar) * (y - y_bar) for x, y in zip(xs, ys))\n    den = sum((x - x_bar) ** 2 for x in xs)\n    w = num / den\n    b = y_bar - w * x_bar\n    return (w, b)\n',
    }),
  ],

  // ------------------------------------------------------------------ ml-2-gradient-descent
  'ml-2-gradient-descent': [
    ex('Learning step by step', 'Big models have no exact formula, so they **learn** with **gradient descent** (from Calculus):\n\n1. Start with w = 0, b = 0.\n2. Work out which way each one should move to **lower the loss**.\n3. Take a small step, sized by the **learning rate**.\n4. Repeat.\n\nOne full pass over the training data is called an **epoch**.'),
    ex('The gradients for a line', 'For ŷ = w·x + b with MSE loss, over n examples:\n\n- **dL/dw = (2/n) · Σ (ŷ − y)·x**\n- **dL/db = (2/n) · Σ (ŷ − y)**\n\nThen update both: **w ← w − rate·dL/dw** and **b ← b − rate·dL/db**.'),
    ans('One example: x = 1, y = 3, starting from w = 0, b = 0, so ŷ = 0. What is dL/dw? (n = 1)', ['-6', '−6'], '2 × (0 − 3) × 1 = −6. Negative means increasing w lowers the loss.'),
    ans('Same example, learning rate 0.1. What is the new w?', ['0.6'], 'w = 0 − 0.1 × (−6) = 0.6.'),
    mc('The loss jumps around and grows bigger every epoch. The most likely cause is…', ['the learning rate is too big', 'the learning rate is too small', 'too much training data'], 0, 'Steps overshoot the valley.'),
    mc('What is an epoch?', ['One full pass over the training data', 'One weight', 'One prediction'], 0, 'Training usually runs for many epochs.'),
    ex('The same idea, at huge scale', 'Deep learning models have **billions** of weights, and train exactly this way: compute the gradient of the loss for every weight, step downhill, repeat.\n\nScaling the features first (previous unit) helps gradient descent converge faster and more reliably.'),
    py({
      prompt: 'Write `train(xs, ys, rate, epochs)` that fits ŷ = w·x + b with gradient descent. Start at w = 0, b = 0. Each epoch, compute both gradients over **all** the examples, then update w and b. Return `(w, b)`.',
      starter: 'def train(xs, ys, rate, epochs):\n    w, b = 0.0, 0.0\n    # your code here\n    return (w, b)\n',
      tests: [
        eq('tuple(round(v, 2) for v in train([1, 2, 3, 4], [3, 5, 7, 9], 0.05, 2000))', '(2.0, 1.0)', 'learns w = 2, b = 1'),
        eq('tuple(round(v, 2) for v in train([0, 1, 2], [1, 1, 1], 0.1, 1000))', '(0.0, 1.0)', 'learns a flat line at 1'),
      ],
      hints: ['n = len(xs). Inside a loop over epochs: errors = [w * x + b - y for x, y in zip(xs, ys)]', 'dw = 2 / n * sum(e * x for e, x in zip(errors, xs)); db = 2 / n * sum(errors); w -= rate * dw; b -= rate * db'],
      solution: 'def train(xs, ys, rate, epochs):\n    w, b = 0.0, 0.0\n    n = len(xs)\n    for _ in range(epochs):\n        errors = [w * x + b - y for x, y in zip(xs, ys)]\n        dw = 2 / n * sum(e * x for e, x in zip(errors, xs))\n        db = 2 / n * sum(errors)\n        w -= rate * dw\n        b -= rate * db\n    return (w, b)\n',
    }),
  ],

  // ------------------------------------------------------------------ ml-2-classification
  'ml-2-classification': [
    ex('Yes or no', '**Logistic regression** turns a line into a **probability**:\n\n1. z = w·x + b (any number)\n2. **σ(z) = 1 ÷ (1 + e⁻ᶻ)**, the **sigmoid**, squashes z into 0…1\n3. Predict **1** ("yes") if σ(z) ≥ 0.5, otherwise 0\n\nσ(0) = 0.5, big positive z → close to 1, big negative z → close to 0.'),
    ans('What is σ(0)?', ['0.5', '1/2'], '1 ÷ (1 + e⁰) = 1 ÷ 2.'),
    mc('z is a large positive number. σ(z) is close to…', ['1', '0', '0.5'], 0, 'e⁻ᶻ becomes tiny, so σ(z) ≈ 1 ÷ 1.'),
    ex('Accuracy can lie', '**Accuracy** = correct predictions ÷ total.\n\nBut suppose 1% of patients have a disease. A "model" that always says **healthy** is **99% accurate**, and completely useless!\n\nSo we also count, for the "yes" class:\n\n- **TP** true positives, **FP** false positives (false alarms), **FN** false negatives (misses)\n- **Precision = TP ÷ (TP + FP)**: when it says yes, how often is it right?\n- **Recall = TP ÷ (TP + FN)**: of the real yeses, how many did it find?'),
    ans('A model gets 90 of 100 emails right. What is its accuracy? (as a decimal)', ['0.9', '90%', '0.90'], '90 ÷ 100.'),
    mc('1% of patients are sick, and a model always says "healthy". What is its accuracy?', ['99%, but it\'s useless', '1%', '50%'], 0, 'It never finds a single sick patient: recall = 0.'),
    ans('TP = 8, FP = 2, FN = 4. What is the precision?', ['0.8', '4/5', '80%'], '8 ÷ (8 + 2) = 0.8.'),
    ans('Same model: TP = 8, FP = 2, FN = 4. What is the recall? (Round to 2 decimals.)', ['0.67', '2/3', '0.667'], '8 ÷ (8 + 4) = 8/12 ≈ 0.67. It missed a third of the real positives.'),
    py({
      prompt: 'Write `sigmoid(z)` (use `math.exp`) and `predict(w, b, x)`, which returns **1** if sigmoid(w·x + b) ≥ 0.5, otherwise **0**.',
      starter: 'import math\n\n\ndef sigmoid(z):\n    pass\n\n\ndef predict(w, b, x):\n    pass\n',
      tests: [near('sigmoid(0)', '0.5'), { name: 'sigmoid(10) is close to 1', code: 'assert sigmoid(10) > 0.99, f"got {sigmoid(10)}"' }, near('sigmoid(-2)', '0.119'), eq('predict(2, -4, 3)', '1'), eq('predict(2, -4, 1)', '0')],
      hints: ['return 1 / (1 + math.exp(-z))', 'return 1 if sigmoid(w * x + b) >= 0.5 else 0'],
      solution: 'import math\n\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\n\ndef predict(w, b, x):\n    return 1 if sigmoid(w * x + b) >= 0.5 else 0\n',
    }),
    py({
      prompt: 'Write `precision_recall(preds, labels)` that returns `(precision, recall)` for class 1. If a denominator is 0, use 0.0 for that value.',
      starter: 'def precision_recall(preds, labels):\n    pass\n',
      tests: [eq('tuple(round(v, 3) for v in precision_recall([1, 1, 0, 1, 0], [1, 0, 0, 1, 1]))', '(0.667, 0.667)'), eq('precision_recall([1, 1], [1, 1])', '(1.0, 1.0)'), eq('precision_recall([0, 0], [1, 0])', '(0.0, 0.0)')],
      hints: ['tp = sum(1 for p, y in zip(preds, labels) if p == 1 and y == 1). Count fp (p 1, y 0) and fn (p 0, y 1) the same way.', 'precision = tp / (tp + fp) if tp + fp else 0.0 (and similarly for recall)'],
      solution: 'def precision_recall(preds, labels):\n    tp = sum(1 for p, y in zip(preds, labels) if p == 1 and y == 1)\n    fp = sum(1 for p, y in zip(preds, labels) if p == 1 and y == 0)\n    fn = sum(1 for p, y in zip(preds, labels) if p == 0 and y == 1)\n    precision = tp / (tp + fp) if tp + fp else 0.0\n    recall = tp / (tp + fn) if tp + fn else 0.0\n    return (precision, recall)\n',
    }),
  ],

  // ------------------------------------------------------------------ ml-2-knn-trees
  'ml-2-knn-trees': [
    ex('k-nearest neighbors', '**k-NN** is beautifully simple. To classify a new point:\n\n1. Find the **k** training examples **closest** to it (by distance).\n2. Let them **vote**: the most common label wins.\n\nThere\'s no training step at all. But predictions are slow on huge datasets, because every prediction compares against every example.'),
    mc('k = 3. The three nearest neighbors are labeled cat, dog, cat. What does k-NN predict?', ['cat', 'dog', 'a tie'], 0, 'Majority vote: 2 cats beat 1 dog.'),
    ex('Choosing k, and scaling', '- **Small k** (like 1): follows every noisy point.\n- **Large k**: too smooth, ignoring local detail.\n- Odd k avoids ties between two classes.\n\nScale the features first! Otherwise a feature measured in thousands (salary) drowns out one measured in single digits (rooms).'),
    mc('Why scale features before k-NN?', ['Otherwise features with big numbers dominate the distance', 'It makes the code shorter'], 0, 'Distance treats every unit equally, so put the features on the same scale.'),
    ex('Decision trees', 'A **decision tree** is a flowchart of yes/no questions learned from data:\n\n```\nage < 18? ── yes → "no"\n   └─ no → income > 50? ── yes → "yes"\n                 └─ no → "no"\n```\n\n- ✅ Easy to **explain** to people\n- ⚠️ Deep trees memorize the data (they **overfit**)\n- **Random forests** average many trees for better accuracy'),
    ans('Using that tree, what does it predict for someone aged 30 with income 40?', ['no'], 'age < 18? No. income > 50? No. So "no".'),
    mc('What is a big advantage of decision trees?', ['Their decisions are easy to explain', 'They are always the most accurate model'], 0, 'You can read the exact questions it asked.'),
    py({
      prompt: 'Write `knn_predict(train, point, k)`. `train` is a list of `((x, y), label)` pairs. Find the **k** examples with the smallest straight-line distance to `point`, and return the most common label among them.',
      starter: 'import math\n\n\ndef knn_predict(train, point, k):\n    pass\n',
      tests: [
        eq('knn_predict([((0, 0), "red"), ((1, 0), "red"), ((5, 5), "blue"), ((6, 5), "blue"), ((5, 6), "blue")], (0.5, 0.5), 3)', '"red"'),
        eq('knn_predict([((0, 0), "red"), ((1, 0), "red"), ((5, 5), "blue"), ((6, 5), "blue"), ((5, 6), "blue")], (5, 5), 3)', '"blue"'),
        eq('knn_predict([((0, 0), "a"), ((10, 10), "b")], (9, 9), 1)', '"b"'),
      ],
      hints: ['math.dist(p, q) gives the straight-line distance. Sort: nearest = sorted(train, key=lambda ex: math.dist(ex[0], point))[:k]', 'labels = [label for _, label in nearest]; return max(set(labels), key=labels.count)'],
      solution: 'import math\n\n\ndef knn_predict(train, point, k):\n    nearest = sorted(train, key=lambda ex: math.dist(ex[0], point))[:k]\n    labels = [label for _, label in nearest]\n    return max(set(labels), key=labels.count)\n',
    }),
  ],

  // ------------------------------------------------------------------ ml-3-neurons
  'ml-3-neurons': [
    ex('An artificial neuron', 'A **neuron** does two things:\n\n1. a **weighted sum**: z = w₁x₁ + w₂x₂ + … + b (a dot product plus a bias)\n2. an **activation**, most often **ReLU**: output = max(0, z)\n\nIt\'s logistic regression\'s cousin: same weighted sum, different squashing.'),
    ans('Inputs (1, 2), weights (0.5, −1), bias 1, ReLU activation. What is the output?', ['0'], 'z = 0.5 − 2 + 1 = −0.5, and ReLU turns negatives into 0.'),
    ans('Inputs (1, 2), weights (2, 1), bias −1, ReLU activation. What is the output?', ['3'], 'z = 2 + 2 − 1 = 3, and ReLU keeps positives.'),
    ex('Layers', 'A **neural network** stacks neurons in **layers**: input → hidden layer(s) → output.\n\nA whole layer is one **matrix × vector**, plus biases, then the activation. That\'s Linear Algebra at work. "**Deep** learning" just means many layers.'),
    mc('Why does every layer need a non-linear activation like ReLU?', ['Without it, stacked layers collapse into one big linear function', 'To make training slower', 'It doesn\'t matter'], 0, 'A linear function of a linear function is still linear. The non-linearity is what lets networks learn curves.'),
    ex('Why one neuron isn\'t enough', 'One neuron draws a single straight boundary. **XOR** (true when exactly one input is 1) can\'t be split by one straight line: its "true" points sit on opposite corners.\n\nIn 1969 this limitation stalled neural network research for years. The fix: a **hidden layer**. Two layers can learn XOR easily.'),
    mc('What does a network need to learn XOR?', ['A hidden layer', 'Just one neuron with bigger weights', 'Nothing: it can\'t be learned'], 0, 'A hidden layer lets the network combine two straight boundaries.'),
    py({
      prompt: 'Write `relu(z)` and `neuron(inputs, weights, bias)`, which returns relu of the weighted sum plus the bias.',
      starter: 'def relu(z):\n    pass\n\n\ndef neuron(inputs, weights, bias):\n    pass\n',
      tests: [eq('relu(-3)', '0'), eq('relu(2.5)', '2.5'), eq('neuron([1, 2], [0.5, -1], 1)', '0'), eq('neuron([1, 2], [2, 1], -1)', '3')],
      hints: ['relu: return max(0, z)', 'neuron: return relu(sum(x * w for x, w in zip(inputs, weights)) + bias)'],
      solution: 'def relu(z):\n    return max(0, z)\n\n\ndef neuron(inputs, weights, bias):\n    return relu(sum(x * w for x, w in zip(inputs, weights)) + bias)\n',
    }),
    py({
      prompt: 'A **layer** is several neurons sharing the same inputs. Write `layer(inputs, weight_rows, biases)` that returns a list with one output per neuron. `weight_rows[i]` and `biases[i]` belong to neuron i. Reuse your `neuron` function.',
      starter: 'def relu(z):\n    return max(0, z)\n\n\ndef neuron(inputs, weights, bias):\n    return relu(sum(x * w for x, w in zip(inputs, weights)) + bias)\n\n\ndef layer(inputs, weight_rows, biases):\n    pass\n',
      tests: [eq('layer([1, 2], [[0.5, -1], [2, 1]], [1, -1])', '[0, 3]'), eq('layer([3], [[1], [-1], [2]], [0, 0, 1])', '[3, 0, 7]')],
      hints: ['zip(weight_rows, biases) pairs each neuron\'s weights with its bias.', 'return [neuron(inputs, w, b) for w, b in zip(weight_rows, biases)]'],
      solution: 'def relu(z):\n    return max(0, z)\n\n\ndef neuron(inputs, weights, bias):\n    return relu(sum(x * w for x, w in zip(inputs, weights)) + bias)\n\n\ndef layer(inputs, weight_rows, biases):\n    return [neuron(inputs, w, b) for w, b in zip(weight_rows, biases)]\n',
    }),
  ],

  // ------------------------------------------------------------------ ml-3-backprop
  'ml-3-backprop': [
    ex('Training a network', 'Training a network is gradient descent on the loss, but over **every** weight in **every** layer. We need the derivative of the loss with respect to each one.\n\n**Backpropagation** computes all of them efficiently. It applies the **chain rule** (from Calculus) from the output layer **backward** toward the input, reusing results along the way.'),
    ex('The smallest example', 'One weight: **y = w·x**, and loss **L = (y − t)²** where t is the target.\n\nChain rule: dL/dw = dL/dy · dy/dw = **2(y − t) · x**\n\nA real network does exactly this, layer after layer.'),
    ans('x = 2, w = 1, target t = 5. So y = 2. What is dL/dw = 2(y − t)·x?', ['-12', '−12'], '2 × (2 − 5) × 2 = −12. Negative means increasing w lowers the loss.'),
    mc('Backpropagation is basically…', ['the chain rule, applied layer by layer from the output back to the input', 'trying random weights until one works', 'sorting the training data'], 0, 'Calculus does the heavy lifting.'),
    ex('Forward, then backward', 'Each training step has two passes:\n\n1. **Forward pass**: compute the predictions and the loss, saving the in-between values.\n2. **Backward pass**: compute every gradient using those saved values.\n\nThen update the weights. Libraries like **PyTorch** do the backward pass automatically ("**autograd**"), so you mostly design the network and pick the data.'),
    mc('What do frameworks like PyTorch automate for you?', ['Computing the gradients (autograd)', 'Choosing and cleaning your data', 'Deciding what problem to solve'], 0, 'You still own the data and the design.'),
    mc('In very deep networks, gradients can shrink as they pass back through many layers, so the early layers barely learn. This is called…', ['the vanishing gradient problem', 'overfitting', 'a learning-rate bonus'], 0, 'ReLU and careful design help. It\'s one reason deep learning took decades to take off.'),
    py({
      prompt: 'Train a one-weight "network" y = w·x toward a target t. Start at w = 0. Each step: w = w − rate · 2(w·x − t)·x. Write `train_w(x, t, rate, steps)` and return w.',
      starter: 'def train_w(x, t, rate, steps):\n    w = 0.0\n    # your code here\n    return w\n',
      tests: [near('train_w(2, 6, 0.05, 200)', '3.0', 4, 'learns w = 3 (so 3 × 2 = 6)'), near('train_w(1, -4, 0.1, 500)', '-4.0', 4, 'learns w = −4')],
      hints: ['for _ in range(steps):', '    w = w - rate * 2 * (w * x - t) * x'],
      solution: 'def train_w(x, t, rate, steps):\n    w = 0.0\n    for _ in range(steps):\n        w = w - rate * 2 * (w * x - t) * x\n    return w\n',
    }),
  ],

  // ------------------------------------------------------------------ ml-3-evaluation
  'ml-3-evaluation': [
    ex('Overfitting and underfitting', '- **Overfitting**: the model memorizes the training data, noise and all. Great on training data, poor on new data.\n- **Underfitting**: the model is too simple to capture the pattern. Poor everywhere.\n\nThe goal is the sweet spot in between: it **generalizes**.'),
    mc('Training accuracy is 99%, but test accuracy is 60%. What\'s happening?', ['Overfitting', 'Underfitting', 'It\'s working perfectly'], 0, 'The big gap between training and test performance gives it away.'),
    mc('Training and test accuracy are both 55% on a two-class problem. What\'s happening?', ['Underfitting', 'Overfitting'], 0, 'It barely beats a coin flip on both. The model is too simple, or the features don\'t carry the signal.'),
    ex('Cross-validation', 'One test split can be lucky or unlucky. **k-fold cross-validation**:\n\n1. Split the data into k equal **folds**.\n2. Train on k − 1 folds and test on the remaining one.\n3. Repeat so each fold is the test set once, then average the scores.\n\nUse a **validation** set (or cross-validation) to tune the model. Touch the **test** set only once, at the very end.'),
    ans('5-fold cross-validation on 100 examples. How many examples are in each test fold?', ['20'], '100 ÷ 5.'),
    ex('Fighting overfitting', '- Get **more data**\n- Use a **simpler model** (fewer features, a shallower tree)\n- **Regularization**: penalize big weights\n- **Early stopping**: stop training when validation error starts rising\n- **Dropout** (neural networks): randomly switch off neurons while training'),
    mc('Which change usually REDUCES overfitting?', ['Collecting more training data', 'Making the model much bigger', 'Training for much longer'], 0, 'More varied examples make memorizing harder and learning the real pattern easier.'),
    ex('Bias in, bias out', 'Models learn whatever is in the data, including unfairness. A face recognizer trained mostly on light-skinned faces works worse on darker skin. A hiring model trained on past decisions copies past bias.\n\nGood practice: check performance **separately for different groups**, and ask who could be harmed by a mistake.'),
    mc('A model works much worse for one group of people. What\'s a likely cause?', ['The training data under-represents that group', 'Bad luck', 'The computer is too slow'], 0, 'Unrepresentative data → unequal results. Measure per group.'),
    py({
      prompt: 'Write `k_folds(n, k)` that returns a list of k **test folds**, each a list of indexes. Split `range(n)` into k consecutive, equal-sized pieces (n is divisible by k).',
      starter: 'def k_folds(n, k):\n    pass\n',
      tests: [eq('k_folds(6, 3)', '[[0, 1], [2, 3], [4, 5]]'), eq('k_folds(4, 2)', '[[0, 1], [2, 3]]'), eq('k_folds(5, 5)', '[[0], [1], [2], [3], [4]]')],
      hints: ['size = n // k', 'return [list(range(i * size, (i + 1) * size)) for i in range(k)]'],
      solution: 'def k_folds(n, k):\n    size = n // k\n    return [list(range(i * size, (i + 1) * size)) for i in range(k)]\n',
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'ml-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Learning from labeled examples is…', ['supervised', 'unsupervised'], 0, 'Labels = supervised.'),
      mc('Finding groups in unlabeled data is…', ['clustering (unsupervised)', 'regression'], 0, 'Clustering.'),
      mc('Predicting a house price is…', ['regression', 'classification'], 0, 'A number.'),
      ans('2,000 examples, 25% test set. How many test examples?', ['500'], '2000 × 0.25.'),
      ans('Min–max scale 40 when min = 20 and max = 60.', ['0.5', '1/2'], '20 ÷ 40.'),
      mc('Why not evaluate on the training data?', ['The model may have memorized it', 'It\'s too small'], 0, 'Use unseen data.'),
      py({ prompt: 'Write `one_hot(value, categories)`: a list with 1 at value\'s position and 0 elsewhere.', starter: 'def one_hot(value, categories):\n    pass\n', tests: [eq('one_hot("green", ["red", "green", "blue"])', '[0, 1, 0]'), eq('one_hot("a", ["a"])', '[1]')], solution: 'def one_hot(value, categories):\n    return [1 if c == value else 0 for c in categories]\n' }),
    ],
  },
  'ml-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('w = 3, b = −2. Prediction for x = 5?', ['13'], '15 − 2.'),
      ans('Predictions [1, 1], real values [3, 1]. MSE?', ['2'], '(4 + 0) ÷ 2.'),
      mc('A learning rate that is too big makes training…', ['overshoot and possibly diverge', 'very slow but safe'], 0, 'Overshoot.'),
      ans('σ(0) = ?', ['0.5'], 'Halfway.'),
      ans('TP = 6, FP = 6. Precision?', ['0.5', '1/2'], '6 ÷ 12.'),
      mc('k-NN with k = 5 and neighbors (A, A, B, B, A) predicts…', ['A', 'B'], 0, '3 votes to 2.'),
      mc('Which model is easiest to explain?', ['a decision tree', 'a deep neural network'], 0, 'Readable questions.'),
      py({ prompt: 'Write `accuracy(preds, labels)`: the fraction of predictions that match.', starter: 'def accuracy(preds, labels):\n    pass\n', tests: [eq('accuracy([1, 0, 1, 1], [1, 0, 0, 1])', '0.75'), eq('accuracy([1], [1])', '1.0')], solution: 'def accuracy(preds, labels):\n    return sum(p == y for p, y in zip(preds, labels)) / len(labels)\n' }),
    ],
  },
  'ml-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('ReLU(−5) = ?', ['0'], 'Negatives become 0.'),
      ans('Inputs (2, 1), weights (1, 1), bias 0, ReLU. Output?', ['3'], '2 + 1.'),
      mc('Stacking layers without activations gives…', ['just one linear function', 'a smarter model'], 0, 'It collapses.'),
      mc('Backpropagation uses…', ['the chain rule', 'random search'], 0, 'Chain rule.'),
      mc('Train 98%, test 70% suggests…', ['overfitting', 'underfitting'], 0, 'The gap.'),
      ans('10-fold cross-validation on 200 examples: size of each fold?', ['20'], '200 ÷ 10.'),
      py({ prompt: 'Write `gradient(w, x, t)`: dL/dw for y = w·x and L = (y − t)².', starter: 'def gradient(w, x, t):\n    pass\n', tests: [eq('gradient(1, 2, 5)', '-12'), eq('gradient(3, 2, 6)', '0')], solution: 'def gradient(w, x, t):\n    return 2 * (w * x - t) * x\n' }),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  'ml-intro': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('A spam filter learning from labeled emails is…', ['supervised classification', 'unsupervised regression'], 0, 'Labels + categories.'),
      mc('The test set is used…', ['once, at the end, to measure new-data performance', 'to train the model'], 0, 'Keep it hidden.'),
      ans('w = 0.5, b = 2. Prediction for x = 10?', ['7'], '5 + 2.'),
      ans('Predictions [2, 2], real values [0, 4]. MSE?', ['4'], 'Errors ±2.'),
      ans('One example x = 1, y = 2, with w = b = 0. dL/dw = 2(ŷ − y)·x = ?', ['-4', '−4'], '2 × (0 − 2) × 1.'),
      mc('Always predicting "healthy" for a rare disease gives…', ['high accuracy but zero recall', 'low accuracy and high recall'], 0, 'Accuracy lies here.'),
      ans('TP = 9, FN = 1. Recall?', ['0.9', '90%'], '9 ÷ 10.'),
      mc('XOR needs…', ['a hidden layer', 'a single neuron'], 0, 'Not linearly separable.'),
      mc('Early stopping helps prevent…', ['overfitting', 'underfitting'], 0, 'Stop before memorizing.'),
      py({ prompt: 'Write `step(w, b, xs, ys, rate)`: ONE gradient descent update for ŷ = w·x + b with MSE. Return the new `(w, b)`.', starter: 'def step(w, b, xs, ys, rate):\n    pass\n', tests: [eq('tuple(round(v, 6) for v in step(0, 0, [1], [3], 0.1))', '(0.6, 0.6)'), eq('tuple(round(v, 6) for v in step(1, 0, [1, 2], [1, 2], 0.1))', '(1.0, 0.0)')], hints: ['errors = [w * x + b - y for x, y in zip(xs, ys)]', 'dw = 2 / n * sum(e * x …); db = 2 / n * sum(errors); return (w - rate * dw, b - rate * db)'], solution: 'def step(w, b, xs, ys, rate):\n    n = len(xs)\n    errors = [w * x + b - y for x, y in zip(xs, ys)]\n    dw = 2 / n * sum(e * x for e, x in zip(errors, xs))\n    db = 2 / n * sum(errors)\n    return (w - rate * dw, b - rate * db)\n' }),
    ],
  },
};
