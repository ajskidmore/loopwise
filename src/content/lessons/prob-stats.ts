/**
 * Track: prob-stats — "Probability & Statistics"
 * Written here: ps-1 (probability), ps-2 (random variables), ps-3 (statistics) + checkpoints + course final exam.
 * Every number below was double-checked in Python (exact fractions where it matters).
 * Only Python's standard library is used (math, statistics), so everything runs in the browser.
 */
import type { AnswerStep, Checkpoint, Step } from '../types';
import { ans, eq, ex, mc, py } from './_helpers';

/** A typed number answer that accepts anything within `tol` of `target` (for rounded decimals). */
const approx = (prompt: string, target: string, tol: number, explanation: string): AnswerStep => ({
  ...ans(prompt, [target], explanation),
  numericTolerance: tol,
});

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ ps-1-basics
  'ps-1-basics': [
    ex('Measuring chance', 'A **probability** is a number from **0** (impossible) to **1** (certain).\n\n- The **sample space** is the list of every possible outcome. One die roll: {1, 2, 3, 4, 5, 6}.\n- An **event** is a group of outcomes you care about, like "roll an even number" = {2, 4, 6}.\n\nWhen every outcome is equally likely:\n\n**P(event) = outcomes in the event ÷ total outcomes**\n\nP(even) = 3 / 6 = **1/2**.', 'Probability is how computers reason about randomness: shuffles, games, spam filters and machine learning all run on it.'),
    mc('What is the sample space for one roll of a six-sided die?', ['{1, 2, 3, 4, 5, 6}', '{6}', '{even, odd}', '{1, 6}'], 0, 'The sample space lists every possible outcome. "Even" and "odd" are events (groups of outcomes), not single outcomes.'),
    ans('You roll a fair die. What is the probability of rolling a number greater than 4? (A fraction like 1/2 is fine.)', ['1/3', '2/6', '0.33', '0.333'], 'Only 5 and 6 are greater than 4: 2 outcomes out of 6, so 2/6 = 1/3.'),
    ex('Rules every probability follows', '1. Every probability is between 0 and 1.\n2. All the outcomes together add up to **1** (something must happen).\n3. **Complement:** the chance something does *not* happen is **1 − P(it happens)**.\n\nIf P(rain) = 0.3, then P(no rain) = 1 − 0.3 = **0.7**.'),
    ans('The chance a flight is late is 0.15. What is the chance it is NOT late?', ['0.85', '85%'], 'Complement rule: 1 − 0.15 = 0.85.'),
    ex('Two coins', 'Flip two fair coins. There are **4** equally likely outcomes:\n\n**HH, HT, TH, TT**\n\nP(exactly one head) = 2/4 = **1/2** (HT and TH).\n\nA common mistake is to say "0, 1 or 2 heads, so each is 1/3". Those three results are *not* equally likely. Always count the basic outcomes.'),
    ans('Two fair coins are flipped. What is the probability that both land heads?', ['1/4', '0.25', '25%'], 'Only HH works: 1 outcome out of 4.'),
    ex('"Or": the addition rule', 'For "A **or** B" (either one, or both):\n\n**P(A or B) = P(A) + P(B) − P(A and B)**\n\nWe subtract the overlap so it isn\'t counted twice.\n\nDie: P(even **or** greater than 3). Even = {2, 4, 6}, greater than 3 = {4, 5, 6}, both = {4, 6}.\n\n3/6 + 3/6 − 2/6 = **4/6 = 2/3**. Check by listing: {2, 4, 5, 6}, which is 4 outcomes.'),
    mc('Roll a die. What is P(the number is 1 **or** 2 **or** odd)?', ['1/2', '2/3', '5/6', '1'], 1, 'Odd = {1, 3, 5}; adding 2 gives {1, 2, 3, 5}: 4 outcomes out of 6, which is 2/3. Listing outcomes is the safest check.'),
    py({
      prompt: 'Two dice are rolled (36 equally likely pairs). Write `prob_sum(target)` that **returns** the probability the two dice add up to `target`.\n\nUse two loops from 1 to 6 to count the pairs that hit the target, then divide by 36.',
      starter: 'def prob_sum(target):\n    pass\n',
      tests: [eq('prob_sum(7)', '6/36'), eq('prob_sum(2)', '1/36'), eq('prob_sum(12)', '1/36'), eq('prob_sum(13)', '0')],
      hints: ['Start with count = 0, then use for a in range(1, 7): and inside it for b in range(1, 7):', 'if a + b == target: count += 1. After the loops, return count / 36'],
      solution: 'def prob_sum(target):\n    count = 0\n    for a in range(1, 7):\n        for b in range(1, 7):\n            if a + b == target:\n                count += 1\n    return count / 36\n',
    }),
  ],

  // ------------------------------------------------------------------ ps-1-conditional
  'ps-1-conditional': [
    ex('When you learn something', '**P(A | B)** means "the probability of A **given** that B happened". Read the bar as "given".\n\nKnowing B shrinks the sample space to just the outcomes where B is true.\n\nYou roll a die, and someone tells you it\'s **even**. Now only {2, 4, 6} are possible, so:\n\nP(6 | even) = **1/3** (it was 1/6 before you knew).'),
    ans('A die roll is greater than 3. Given that, what is the probability it is a 5?', ['1/3', '0.33', '0.333'], 'Given "greater than 3", the outcomes are {4, 5, 6}. One of the three is 5.'),
    ex('The formula', '**P(A | B) = P(A and B) ÷ P(B)**\n\nWith counts it\'s even easier: count the outcomes where both happen, then divide by the outcomes where B happens.\n\n100 students: **40** play a sport, and **10** play a sport *and* an instrument.\n\nP(instrument | sport) = 10 / 40 = **0.25**.'),
    ans('Out of 200 emails, 30 contain the word "winner", and 27 of those are spam. What is P(spam | contains "winner")?', ['0.9', '9/10', '27/30', '90%'], 'Only look at the 30 "winner" emails: 27 of 30 are spam, which is 0.9.'),
    mc('Is P(A | B) the same as P(B | A)?', ['Yes, always', 'No: swapping them asks a different question', 'Only for coins'], 1, 'P(four legs | dog) is nearly 1, but P(dog | four legs) is small (cats, horses, tables…). Mixing them up is one of the most common mistakes in statistics.'),
    ex('Independence', 'Events are **independent** when knowing one doesn\'t change the chance of the other: **P(A | B) = P(A)**.\n\nThen "and" becomes a simple multiplication:\n\n**P(A and B) = P(A) × P(B)**\n\nTwo coin flips are independent: P(HH) = 1/2 × 1/2 = **1/4**.', 'Coins and dice have no memory. After 5 heads in a row, the next flip is still 50/50.'),
    ans('You roll a die and flip a coin. What is P(rolling a 6 **and** getting heads)?', ['1/12', '0.083', '0.0833'], 'Independent, so multiply: 1/6 × 1/2 = 1/12.'),
    ans('A fair coin is flipped 3 times. What is P(all three are heads)?', ['1/8', '0.125'], '1/2 × 1/2 × 1/2 = 1/8.'),
    mc('You draw a card from a deck, keep it, then draw a second card. Are the two draws independent?', ['Yes', 'No: the first draw changes what\'s left in the deck'], 1, 'If the first card is an ace, there are fewer aces left for the second draw. Without putting the card back, the draws depend on each other.'),
    py({
      prompt: 'Outcomes are equally likely and given as **sets**. Write `cond(a, b)` that returns P(A | B): the number of outcomes in **both** sets divided by the number of outcomes in b.\n\nIn Python, `a & b` gives the outcomes that are in both sets.',
      starter: 'def cond(a, b):\n    pass\n',
      tests: [eq('cond({6}, {2, 4, 6})', '1/3'), eq('cond({4, 5, 6}, {2, 4, 6})', '2/3'), eq('cond({1, 2}, {3, 4})', '0')],
      hints: ['len(a & b) counts the outcomes in both.', 'return len(a & b) / len(b)'],
      solution: 'def cond(a, b):\n    return len(a & b) / len(b)\n',
    }),
  ],

  // ------------------------------------------------------------------ ps-1-bayes
  'ps-1-bayes': [
    ex('Flipping the question', 'We often know **P(evidence | cause)** but want **P(cause | evidence)**. For example:\n\n- We know: "if someone is sick, the test is positive 90% of the time."\n- We want: "the test is positive. How likely is it that they\'re sick?"\n\n**Bayes\' theorem** flips it:\n\n**P(A | B) = P(B | A) × P(A) ÷ P(B)**', 'Bayes\' theorem powers spam filters, medical reasoning and a big part of machine learning.'),
    ex('Count people, not percentages', 'A disease affects **1%** of people. A test catches **90%** of sick people, but also flags **5%** of healthy people by mistake.\n\nImagine **10,000** people:\n\n- 100 are sick, and 90 of them test positive.\n- 9,900 are healthy, and 5% of them (**495**) test positive anyway.\n\nPositive tests: 90 + 495 = 585. Only 90 of those are sick:\n\nP(sick | positive) = 90 / 585 ≈ **0.15**, about 15%.'),
    mc('Why is the chance only about 15%, even though the test catches 90% of sick people?', ['The test is broken', 'Healthy people far outnumber sick people, so even a few false alarms outnumber the true positives', 'It\'s a rounding error'], 1, '495 false alarms vs 90 real cases. When something is rare, most positive results can still be false.'),
    ex('The pieces have names', '- **Prior** P(A): what you believed *before* the evidence (1% are sick)\n- **Likelihood** P(B | A): how likely the evidence is if A is true (90%)\n- **Evidence** P(B): how likely the evidence is overall:\n  P(B) = P(B | A)·P(A) + P(B | not A)·P(not A)\n- **Posterior** P(A | B): your updated belief *after* the evidence (≈ 15%)'),
    mc('Your belief *before* you see any evidence is called the…', ['posterior', 'prior', 'likelihood'], 1, 'Prior = before. Posterior = after.'),
    ans('Machine X makes 60% of a factory\'s parts, and 1% of them are faulty. Machine Y makes 40%, and 5% of them are faulty. What is the probability a random part is faulty? (Give a decimal.)', ['0.026', '2.6%'], '0.6 × 0.01 + 0.4 × 0.05 = 0.006 + 0.02 = 0.026.'),
    approx('Same factory: a part is faulty. What is the probability it came from machine Y? Round to 2 decimal places.', '0.77', 0.006, 'Bayes: P(Y | faulty) = 0.02 ÷ 0.026 ≈ 0.77. Machine Y makes fewer parts but most of the faulty ones.'),
    mc('A spam filter sees the word "prize". How does Bayes help it?', ['It deletes every email with "prize"', 'It updates the chance the email is spam, based on how often "prize" shows up in spam vs normal mail', 'It ignores the word'], 1, 'Each word is evidence that nudges the probability up or down. That\'s a "naive Bayes" filter.'),
    py({
      prompt: 'Write `bayes(prior, p_e_given_a, p_e_given_not_a)` that returns the **posterior** P(A | evidence).\n\nFirst work out P(evidence) = p_e_given_a × prior + p_e_given_not_a × (1 − prior).',
      starter: 'def bayes(prior, p_e_given_a, p_e_given_not_a):\n    pass\n',
      tests: [eq('round(bayes(0.01, 0.9, 0.05), 3)', '0.154'), eq('round(bayes(0.5, 0.8, 0.2), 2)', '0.8'), eq('round(bayes(0.4, 0.05, 0.01), 2)', '0.77')],
      hints: ['evidence = p_e_given_a * prior + p_e_given_not_a * (1 - prior)', 'return p_e_given_a * prior / evidence'],
      solution: 'def bayes(prior, p_e_given_a, p_e_given_not_a):\n    evidence = p_e_given_a * prior + p_e_given_not_a * (1 - prior)\n    return p_e_given_a * prior / evidence\n',
    }),
  ],

  // ------------------------------------------------------------------ ps-2-random-variables
  'ps-2-random-variables': [
    ex('Numbers that come from chance', 'A **random variable** (usually written **X**) is a number decided by a random event.\n\n- X = the number on a die roll (1 to 6)\n- X = how many heads in 3 coin flips (0 to 3)\n\n**Discrete** random variables have separate values you can list (0, 1, 2, …).\n\n**Continuous** ones can be any value in a range, like height or time.'),
    mc('Which random variable is continuous?', ['The number of emails you get today', 'The exact time until the next bus arrives', 'The number rolled on a die'], 1, 'Time can be 3.2 minutes, 3.25, 3.251… Any value in a range is possible. Counts are discrete.'),
    ex('A distribution', 'A random variable\'s **distribution** lists each value and its probability.\n\nX = number of heads in 2 flips (HH, HT, TH, TT):\n\n| x | 0 | 1 | 2 |\n|---|---|---|---|\n| P(X = x) | 1/4 | 1/2 | 1/4 |\n\nThe probabilities always add up to **1**.'),
    ans('X = number of heads in 3 fair coin flips. What is P(X = 2)? (8 equally likely outcomes.)', ['3/8', '0.375'], 'HHT, HTH and THH have exactly 2 heads: 3 out of 8.'),
    ans('A distribution has P(X = 0) = 0.2 and P(X = 1) = 0.5. The only other value is 2. What is P(X = 2)?', ['0.3', '3/10'], 'Everything adds to 1: 1 − 0.2 − 0.5 = 0.3.'),
    mc('Could P(X = 1) = 0.6 and P(X = 2) = 0.6 be a valid distribution?', ['Yes', 'No: the probabilities add up to more than 1'], 1, '0.6 + 0.6 = 1.2. Something can\'t happen more than 100% of the time.'),
    ex('Distributions in Python', 'A **dictionary** is a natural fit: value → probability.\n\n```python\ndist = {0: 0.25, 1: 0.5, 2: 0.25}\nprint(sum(dist.values()))   # 1.0\n```'),
    ans('What does this print?', ['0.75'], 'P(X = 1) + P(X = 2) = 0.5 + 0.25 = 0.75: the chance of at least one head.', 'dist = {0: 0.25, 1: 0.5, 2: 0.25}\nprint(dist[1] + dist[2])'),
    py({
      prompt: 'Write `is_valid(dist)` that returns True if `dist` is a valid distribution: every probability is between 0 and 1, **and** they add up to 1.\n\n⚠️ Computers store decimals approximately: `0.1 + 0.2 + 0.7` gives `1.0000000000000002`. So check that the total is *very close* to 1: `abs(total - 1) < 1e-9`.',
      starter: 'def is_valid(dist):\n    pass\n',
      tests: [eq('is_valid({0: 0.25, 1: 0.5, 2: 0.25})', 'True'), eq('is_valid({1: 0.6, 2: 0.6})', 'False'), eq('is_valid({1: 1.5, 2: -0.5})', 'False'), eq('is_valid({1: 0.1, 2: 0.2, 3: 0.7})', 'True')],
      hints: ['Loop over dist.values() and return False if any p < 0 or p > 1.', 'At the end: return abs(sum(dist.values()) - 1) < 1e-9'],
      solution: 'def is_valid(dist):\n    for p in dist.values():\n        if p < 0 or p > 1:\n            return False\n    return abs(sum(dist.values()) - 1) < 1e-9\n',
    }),
  ],

  // ------------------------------------------------------------------ ps-2-expectation
  'ps-2-expectation': [
    ex('Expected value', 'The **expected value** E[X] is the long-run average: what you\'d get on average if you repeated it many times.\n\n**E[X] = Σ x × P(X = x)** (multiply each value by its probability, then add them up; Σ means "add up")\n\nA fair die: (1 + 2 + 3 + 4 + 5 + 6) × 1/6 = **3.5**.'),
    ans('A game pays $10 with probability 0.2, and $0 otherwise. What is the expected payout in dollars?', ['2', '$2', '2.00'], '10 × 0.2 + 0 × 0.8 = 2.'),
    ans('X is 0 with probability 0.5, 4 with probability 0.25, and 8 with probability 0.25. What is E[X]?', ['3'], '0 × 0.5 + 4 × 0.25 + 8 × 0.25 = 0 + 1 + 2 = 3.'),
    mc('A die\'s expected value is 3.5, but you can never roll 3.5. What does 3.5 mean?', ['The average over many rolls', 'The most likely roll', 'It\'s a mistake'], 0, 'Expected value is a long-run average, not a value you expect on any single roll.'),
    ex('Expected values add up', '**Linearity:** E[X + Y] = E[X] + E[Y], always.\n\nTwo dice: 3.5 + 3.5 = **7** on average.\n\nScaling works too: E[aX + b] = a·E[X] + b. If each sale earns E = $20, then 10 sales earn 10 × 20 = **$200** on average.'),
    ans('A lottery ticket costs $2 and wins $100 with probability 0.01. What is your expected profit per ticket, in dollars?', ['-1', '−1', '-$1', '-1.00'], 'Expected winnings 100 × 0.01 = $1, minus the $2 cost = −$1. You lose $1 per ticket on average.'),
    ex('Variance: how spread out?', '**Variance** measures how far values usually land from the average μ ("mu", the mean):\n\n**Var(X) = E[(X − μ)²]**: the average squared distance from μ.\n\nThe **standard deviation** (SD) is √Var, in the same units as X.\n\nX = 0 or 2, each with probability 1/2: μ = 1, Var = ((0−1)² + (2−1)²) / 2 = **1**, SD = **1**.'),
    ans('X is 1 or 5, each with probability 1/2. The mean is 3. What is Var(X)?', ['4'], '(1 − 3)² = 4 and (5 − 3)² = 4. The average is 4.'),
    mc('Investment A always pays $100. Investment B pays $0 or $200 with equal chance. Both average $100. Which has the larger variance?', ['A', 'B', 'They\'re equal'], 1, 'A never varies (variance 0). B swings $100 away from the mean every time. Variance is a common way to measure risk.'),
    py({
      prompt: 'A distribution is a dict value → probability. Write **two** functions:\n\n- `expected(dist)`: Σ x × p\n- `variance(dist)`: Σ (x − μ)² × p, where μ = expected(dist)',
      starter: 'def expected(dist):\n    pass\n\n\ndef variance(dist):\n    pass\n',
      tests: [eq('expected({1: 0.5, 5: 0.5})', '3.0'), eq('expected({0: 0.8, 10: 0.2})', '2.0'), eq('variance({1: 0.5, 5: 0.5})', '4.0'), eq('variance({7: 1.0})', '0.0')],
      hints: ['for x, p in dist.items(): add x * p to a running total.', 'In variance, compute mu = expected(dist) first, then add (x - mu) ** 2 * p for each item.'],
      solution: 'def expected(dist):\n    total = 0\n    for x, p in dist.items():\n        total += x * p\n    return total\n\n\ndef variance(dist):\n    mu = expected(dist)\n    total = 0\n    for x, p in dist.items():\n        total += (x - mu) ** 2 * p\n    return total\n',
    }),
  ],

  // ------------------------------------------------------------------ ps-2-distributions
  'ps-2-distributions': [
    ex('Bernoulli and binomial', 'A **Bernoulli** trial is one yes/no try that succeeds with probability p (one coin flip, one free throw).\n\nThe **binomial** distribution counts the successes in **n** independent tries:\n\n**P(X = k) = C(n, k) × pᵏ × (1 − p)ⁿ⁻ᵏ**\n\nC(n, k) is the number of ways to pick *which* k tries succeed. Python: `math.comb(n, k)`.\n\nIts average is simple: **E[X] = n × p**.'),
    ans('A fair coin is flipped 4 times. What is P(exactly 2 heads)? C(4, 2) = 6.', ['3/8', '6/16', '0.375'], '6 × (1/2)² × (1/2)² = 6/16 = 3/8.'),
    ans('A basketball player makes 80% of free throws. How many does she make in 10 shots, on average?', ['8'], 'Binomial average: n × p = 10 × 0.8 = 8.'),
    ex('Uniform', 'In a **uniform** distribution every value is equally likely.\n\n- Discrete: a fair die.\n- Continuous: any number between a and b. The chance of landing between c and d is the fraction of the range they cover: **(d − c) ÷ (b − a)**.\n\nThe bus comes at a random time in the next 10 minutes. P(within 3 minutes) = 3/10 = **0.3**.'),
    ans('A random number is picked uniformly between 0 and 20. What is the probability it lands between 5 and 9?', ['0.2', '1/5', '4/20', '20%'], '(9 − 5) ÷ (20 − 0) = 4/20 = 0.2.'),
    ex('Normal: the bell curve', 'The **normal** distribution is the famous bell curve, set by its mean μ and standard deviation σ ("sigma").\n\nThe **68–95–99.7 rule**: about\n\n- **68%** of values fall within 1σ of the mean\n- **95%** within 2σ\n- **99.7%** within 3σ\n\nHeights, measurement errors and test scores are often close to normal.'),
    ans('Adult heights are roughly normal, with mean 170 cm and SD 10 cm. About what percent of adults are between 160 and 180 cm?', ['68', '68%'], '160 to 180 is within 1 SD of the mean: about 68%.'),
    mc('In a normal distribution, about what percent of values are MORE than 2 SDs **above** the mean?', ['2.5%', '5%', '16%', '50%'], 0, '95% are within 2 SDs, so 5% are outside, split evenly between the two tails: 2.5% above and 2.5% below.'),
    py({
      prompt: 'Write `binom_pmf(n, k, p)`: the probability of exactly k successes in n tries, using the binomial formula and `math.comb`.',
      starter: 'import math\n\n\ndef binom_pmf(n, k, p):\n    pass\n',
      tests: [eq('binom_pmf(4, 2, 0.5)', '0.375'), eq('binom_pmf(3, 0, 0.5)', '0.125'), eq('round(binom_pmf(10, 8, 0.8), 4)', '0.302'), eq('round(sum(binom_pmf(5, k, 0.3) for k in range(6)), 9)', '1.0', 'all the probabilities for n = 5 add up to 1')],
      hints: ['math.comb(n, k) counts the ways to choose which tries succeed.', 'return math.comb(n, k) * p ** k * (1 - p) ** (n - k)'],
      solution: 'import math\n\n\ndef binom_pmf(n, k, p):\n    return math.comb(n, k) * p ** k * (1 - p) ** (n - k)\n',
    }),
  ],

  // ------------------------------------------------------------------ ps-3-descriptive
  'ps-3-descriptive': [
    ex('Three kinds of "average"', 'For the data **2, 3, 3, 5, 7**:\n\n- **Mean:** add them up and divide by how many. 20 ÷ 5 = **4**\n- **Median:** the middle value once sorted. **3**\n- **Mode:** the most common value. **3**\n\nWith an even number of values, the median is the average of the two middle ones: for 1, 2, 3, 4 it\'s (2 + 3) ÷ 2 = **2.5**.', 'Probability goes from a known model to data. Statistics goes the other way: from data back to the model.'),
    ans('What is the mean of 4, 8, 6, 2?', ['5'], '(4 + 8 + 6 + 2) ÷ 4 = 20 ÷ 4 = 5.'),
    ans('What is the median of 7, 1, 9, 3, 5?', ['5'], 'Sort first: 1, 3, 5, 7, 9. The middle value is 5.'),
    ex('Outliers', 'Five salaries (in thousands): 30, 32, 35, 38, **500**.\n\n- Mean = 635 ÷ 5 = **127**\n- Median = **35**\n\nOne huge value drags the mean far away, but the median barely moves. That\'s why news reports usually give *median* income and home prices.'),
    mc('A town has mostly ordinary homes and a few mansions. Which best describes a "typical" home price?', ['Mean', 'Median', 'The largest price'], 1, 'The median ignores how extreme the mansions are; the mean gets pulled up by them.'),
    ex('Spread', '- **Range** = largest − smallest\n- **Standard deviation** = how far values typically sit from the mean\n\nData 2, 4, 4, 4, 5, 5, 7, 9 has mean 5. The squared distances add up to 32, and 32 ÷ 8 = 4, so SD = √4 = **2**.\n\nPython: `statistics.pstdev(data)` divides by n (the whole population). `statistics.stdev(data)` divides by n − 1, the usual choice for a **sample**.'),
    ans('What is the range of 3, 9, 4, 12, 6?', ['9'], '12 − 3 = 9.'),
    ans('What does this print?', ['2.0'], 'This is the example from the last card: the population standard deviation is 2.', 'import statistics\ndata = [2, 4, 4, 4, 5, 5, 7, 9]\nprint(statistics.pstdev(data))'),
    py({
      prompt: 'Write `summary(data)` that returns a tuple `(mean, median)`. Do it yourself: **don\'t** use the `statistics` module.\n\nFor the median, sort a copy with `sorted(data)`. With an even number of values, average the two middle ones.',
      starter: 'def summary(data):\n    pass\n',
      tests: [eq('summary([2, 3, 3, 5, 7])', '(4.0, 3)'), eq('summary([9, 1, 5])', '(5.0, 5)'), eq('summary([1, 2, 3, 4])', '(2.5, 2.5)'), { name: 'does not use the statistics module', code: 'assert "statistics" not in __source__, "Write it yourself this time: no statistics module"' }],
      hints: ['mean = sum(data) / len(data); s = sorted(data); mid = len(s) // 2', 'If len(s) is odd, the median is s[mid]. Otherwise it\'s (s[mid - 1] + s[mid]) / 2'],
      solution: 'def summary(data):\n    mean = sum(data) / len(data)\n    s = sorted(data)\n    mid = len(s) // 2\n    if len(s) % 2 == 1:\n        median = s[mid]\n    else:\n        median = (s[mid - 1] + s[mid]) / 2\n    return (mean, median)\n',
    }),
  ],

  // ------------------------------------------------------------------ ps-3-sampling
  'ps-3-sampling': [
    ex('Population vs sample', 'The **population** is everyone you care about, like all adults in a country. Measuring all of them is usually impossible, so you measure a **sample**, say 500 people.\n\nThe sample mean (written **x̄**, "x-bar") is your estimate of the true population mean **μ**.\n\nThe sample must be **random**. Otherwise it\'s **biased**: it leans one way.'),
    mc('A survey about exercise habits only asks people at a gym. What\'s the main problem?', ['The sample is too small', 'The sample is biased: gym-goers exercise more than most people', 'Nothing'], 1, 'Even a huge sample is useless if it isn\'t representative.'),
    ex('Bigger samples, better estimates', 'Every sample gives a slightly different x̄. That\'s normal.\n\nThe **law of large numbers:** as the sample gets bigger, x̄ gets closer and closer to the true μ.\n\nFlip a coin 10 times and you might get 70% heads. Flip it 10,000 times and you\'ll be very close to 50%.'),
    mc('You flip a fair coin more and more times. The fraction of heads…', ['gets closer to 0.5', 'is always exactly 0.5', 'keeps going up'], 0, 'The law of large numbers: the long-run fraction settles near the true probability.'),
    ex('The central limit theorem', 'The **central limit theorem (CLT)**: the average of many independent values is **approximately normal** (a bell curve), whatever shape the original data had.\n\nHow much do sample averages wobble? Their SD is the **standard error**:\n\n**SE = σ ÷ √n**\n\nσ is the population SD, and n is the sample size.', 'The CLT is why the bell curve shows up everywhere. Lots of small random effects added together look normal.'),
    mc('One die roll is uniform (flat), not bell-shaped. If you average 50 rolls, and repeat that many times, the histogram of those averages looks…', ['flat', 'bell-shaped, centered at 3.5', 'like a single spike at exactly 3.5'], 1, 'That\'s the CLT: averages become normal, centered on the true mean 3.5.'),
    ans('The population SD is 20 and the sample size is 100. What is the standard error?', ['2'], '20 ÷ √100 = 20 ÷ 10 = 2.'),
    ans('To cut the standard error in half, you multiply the sample size by…', ['4'], 'SE = σ ÷ √n. √4 = 2, so 4 times the data halves the error. Precision gets expensive!'),
    py({
      prompt: 'Write `standard_error(sd, n)` that returns sd ÷ √n. Use `math.sqrt`.',
      starter: 'import math\n\n\ndef standard_error(sd, n):\n    pass\n',
      tests: [eq('standard_error(20, 100)', '2.0'), eq('standard_error(9, 9)', '3.0'), eq('standard_error(5, 1)', '5.0')],
      hints: ['return sd / math.sqrt(n)'],
      solution: 'import math\n\n\ndef standard_error(sd, n):\n    return sd / math.sqrt(n)\n',
    }),
  ],

  // ------------------------------------------------------------------ ps-3-testing
  'ps-3-testing': [
    ex('Is it real, or just luck?', 'A friend\'s coin lands heads 9 times out of 10. Is the coin unfair, or were they just lucky?\n\n**Hypothesis testing** answers this:\n\n1. **Null hypothesis H₀:** nothing special is going on (the coin is fair).\n2. Ask: *if H₀ were true*, how surprising would this data be?\n3. Very surprising? Then **reject H₀**.'),
    ex('The p-value', 'The **p-value** is the probability, *assuming H₀ is true*, of a result at least as extreme as the one you saw.\n\nFair coin, 10 flips, 9 or more heads: (10 + 1) ÷ 1024 = 11/1024 ≈ **0.011**.\n\nA common cutoff is **0.05**. Since 0.011 < 0.05, we reject "the coin is fair".'),
    ans('A fair coin is flipped 10 times. What is the probability that all 10 are heads? (2¹⁰ = 1024.)', ['1/1024', '0.0009765625', '0.00098', '0.000977'], '(1/2)¹⁰ = 1/1024, about 0.001.'),
    mc('A test gives p = 0.03, and the cutoff is 0.05. What do you conclude?', ['Reject H₀: this result would be unusual if H₀ were true', 'H₁ is proven 100% true', 'There\'s a 3% chance H₀ is true'], 0, 'p < 0.05, so reject H₀. But nothing is "proven": you could still be in the unlucky 3%.'),
    mc('Which statement about p = 0.03 is correct?', ['There\'s a 3% chance the null hypothesis is true', 'If H₀ were true, results this extreme would happen about 3% of the time', 'The effect is 97% important'], 1, 'The p-value assumes H₀ is true. It is NOT the probability that H₀ is true, which is the most common mistake people make with p-values.'),
    ex('Confidence intervals', 'Instead of one number, give a range: **estimate ± margin**.\n\nA **95% confidence interval** for a mean is about **x̄ ± 2 × SE** (1.96 to be exact).\n\nx̄ = 50 and SE = 2 → 50 ± 4 → **46 to 54**.\n\nIf you repeated the study many times, about 95% of intervals made this way would contain the true mean.'),
    ans('A sample mean is 80 and the standard error is 5. Using ± 2 SE, what is the LOWER end of the 95% confidence interval?', ['70'], '80 − 2 × 5 = 70 (and the upper end is 90).'),
    mc('"Statistically significant" means…', ['the effect is large and important', 'the result would be unlikely if there were no real effect', 'the result is proven'], 1, 'A tiny, unimportant effect can still be "significant" with enough data. Significant ≠ important.'),
    py({
      prompt: 'Write `p_at_least(k, n)`: the probability of getting **at least** k heads in n flips of a fair coin.\n\nAdd up `math.comb(n, i)` for every i from k to n, then divide by `2 ** n`.',
      starter: 'import math\n\n\ndef p_at_least(k, n):\n    pass\n',
      tests: [eq('p_at_least(9, 10)', '11/1024'), eq('p_at_least(3, 3)', '0.125'), eq('p_at_least(0, 5)', '1.0')],
      hints: ['total = 0, then for i in range(k, n + 1): total += math.comb(n, i)', 'return total / 2 ** n'],
      solution: 'import math\n\n\ndef p_at_least(k, n):\n    total = 0\n    for i in range(k, n + 1):\n        total += math.comb(n, i)\n    return total / 2 ** n\n',
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'ps-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('Roll a fair die. P(rolling a 1 or a 2)?', ['1/3', '2/6', '0.33', '0.333'], '2 outcomes out of 6.'),
      ans('P(snow) = 0.35. What is P(no snow)?', ['0.65', '65%'], '1 − 0.35.'),
      ans('Flip 2 fair coins. P(at least one tail)?', ['3/4', '0.75', '75%'], 'Everything except HH: 3 of 4.'),
      ans('A die roll is odd. Given that, what is P(it is 3)?', ['1/3', '0.33', '0.333'], 'Odd = {1, 3, 5}.'),
      ans('In a class, 12 of 30 students wear glasses; 4 of those 12 are left-handed. P(left-handed | glasses)?', ['1/3', '4/12', '0.33', '0.333'], '4 ÷ 12.'),
      ans('Flip a fair coin 4 times. P(all tails)?', ['1/16', '0.0625'], '(1/2)⁴.'),
      mc('P(A | B) and P(B | A) are…', ['always equal', 'usually different', 'never defined'], 1, 'Swapping changes the question.'),
      ans('A disease affects 2% of people; a test catches 100% of them and wrongly flags 2% of healthy people. Out of 1,000 people, how many test positive? (20 sick + 2% of 980, rounded to a whole person.)', ['40'], '20 + 19.6 ≈ 40, so P(sick | positive) is only about 1/2.'),
      py({ prompt: 'Write `p_and(p_a, p_b)` for two **independent** events.', starter: 'def p_and(p_a, p_b):\n    pass\n', tests: [eq('p_and(0.5, 0.5)', '0.25'), eq('p_and(1, 0.3)', '0.3')], solution: 'def p_and(p_a, p_b):\n    return p_a * p_b\n' }),
    ],
  },
  'ps-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Which is a discrete random variable?', ['A person\'s exact weight', 'The number of cars in a parking lot', 'The exact temperature'], 1, 'Counts are discrete.'),
      ans('P(X = 1) = 0.1, P(X = 2) = 0.6, and 3 is the only other value. P(X = 3)?', ['0.3'], '1 − 0.7.'),
      ans('X is 2 with probability 0.5 and 6 with probability 0.5. E[X]?', ['4'], '1 + 3.'),
      ans('Same X (2 or 6, each 1/2). Var(X)?', ['4'], '(2−4)² = (6−4)² = 4.'),
      ans('E[X] = 5. What is E[3X + 1]?', ['16'], '3 × 5 + 1.'),
      ans('A coin with P(heads) = 0.3 is flipped 20 times. Expected number of heads?', ['6'], 'n × p.'),
      ans('Uniform between 0 and 50. P(between 10 and 20)?', ['0.2', '1/5', '20%'], '10 ÷ 50.'),
      ans('Normal with mean 100 and SD 15. About what percent is between 70 and 130?', ['95', '95%'], '±2 SD.'),
      py({ prompt: 'Write `expected(dist)` for a dict value → probability.', starter: 'def expected(dist):\n    pass\n', tests: [eq('expected({0: 0.5, 10: 0.5})', '5.0'), eq('expected({3: 1.0})', '3.0')], solution: 'def expected(dist):\n    return sum(x * p for x, p in dist.items())\n' }),
    ],
  },
  'ps-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('Mean of 10, 20, 30, 40?', ['25'], '100 ÷ 4.'),
      ans('Median of 8, 2, 6, 4?', ['5'], 'Sorted 2, 4, 6, 8 → (4 + 6) ÷ 2.'),
      ans('Mode of 1, 2, 2, 3, 3, 3, 4?', ['3'], 'Appears three times.'),
      mc('Which is least affected by one huge outlier?', ['Mean', 'Median', 'Range'], 1, 'The median.'),
      ans('Population SD 30, sample size 9. Standard error?', ['10'], '30 ÷ 3.'),
      mc('The central limit theorem says sample averages are approximately…', ['uniform', 'normal', 'always equal to μ'], 1, 'Normal.'),
      mc('p = 0.20 with a 0.05 cutoff. Conclusion?', ['Reject H₀', 'Don\'t reject H₀: the data isn\'t surprising enough', 'H₀ is proven true'], 1, 'Not rejecting is not the same as proving.'),
      ans('Mean 60, SE 3. Upper end of the ±2 SE 95% interval?', ['66'], '60 + 6.'),
      py({ prompt: 'Write `mean(data)` without the statistics module.', starter: 'def mean(data):\n    pass\n', tests: [eq('mean([1, 2, 3, 4])', '2.5'), { name: 'no statistics module', code: 'assert "statistics" not in __source__, "Write it yourself"' }], solution: 'def mean(data):\n    return sum(data) / len(data)\n' }),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  'prob-stats': {
    passScore: 0.8, hearts: 3,
    questions: [
      ans('Roll two dice. P(the sum is 2)?', ['1/36', '0.0278', '0.028'], 'Only (1, 1).'),
      ans('Roll a die. P(even or 5)?', ['2/3', '4/6', '0.67', '0.667'], '{2, 4, 5, 6}.'),
      ans('P(A) = 0.5, P(B) = 0.4, independent. P(A and B)?', ['0.2'], '0.5 × 0.4.'),
      mc('A rare disease, a fairly accurate test, a positive result. The chance you\'re sick is often…', ['about the test\'s accuracy', 'much lower than the test\'s accuracy, because the disease is rare', 'exactly 50%'], 1, 'The prior matters.'),
      ans('X is 0 w.p. 0.6 and 10 w.p. 0.4. E[X]?', ['4'], '10 × 0.4.'),
      ans('Fair coin, 3 flips. P(exactly 1 head)? (C(3, 1) = 3)', ['3/8', '0.375'], '3 ÷ 8.'),
      ans('Normal, mean 50, SD 5. About what percent is between 45 and 55?', ['68', '68%'], '±1 SD.'),
      ans('Median of 3, 1, 4, 1, 5?', ['3'], 'Sorted 1, 1, 3, 4, 5.'),
      ans('SD 12, n = 16. Standard error?', ['3'], '12 ÷ 4.'),
      mc('A p-value is the probability that…', ['H₀ is true', 'data this extreme would happen if H₀ were true', 'the result is important'], 1, 'It assumes H₀.'),
      py({ prompt: 'Write `variance(data)`: the population variance of a list (the average squared distance from the mean). No statistics module.', starter: 'def variance(data):\n    pass\n', tests: [eq('variance([2, 4, 4, 4, 5, 5, 7, 9])', '4.0'), eq('variance([3, 3, 3])', '0.0'), { name: 'no statistics module', code: 'assert "statistics" not in __source__, "Write it yourself"' }], hints: ['m = sum(data) / len(data)', 'return sum((x - m) ** 2 for x in data) / len(data)'], solution: 'def variance(data):\n    m = sum(data) / len(data)\n    return sum((x - m) ** 2 for x in data) / len(data)\n' }),
    ],
  },
};
