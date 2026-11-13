/**
 * Track: networks-security — "Networks & Security"
 * Written here: ns-1 (networking), ns-2 (security) + checkpoints + course final exam.
 * Explain + quiz, with Python exercises (IP addresses, HTTP parsing, DNS lookups, hashing, escaping).
 * Security content is defensive: how attacks work so you can prevent them. Only hashlib.sha256 is used,
 * which works the same in the browser (Pyodide) and in the Node content tests.
 */
import type { Checkpoint, Step } from '../types';
import { ans, eq, ex, mc, mcT, ord, py } from './_helpers';

const ordT = (prompt: string, lines: string[], explanation: string) => ord(prompt, lines, explanation, 'text');

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ ns-1-layers
  'ns-1-layers': [
    ex('Networks in layers', 'Sending data across the world is split into **layers**. Each layer solves one problem and relies on the layer below. The everyday **TCP/IP model**:\n\n| Layer | Job | Examples |\n|---|---|---|\n| **Application** | what the app says | HTTP, DNS, email |\n| **Transport** | between programs: reliable or fast | TCP, UDP |\n| **Internet** | between computers, across networks | IP |\n| **Link** | to the next device on this network | Wi-Fi, Ethernet |', 'Every time you load a web page, all four layers work together in a fraction of a second.'),
    ordT('Order the TCP/IP layers from top (closest to your app) to bottom.', ['Application', 'Transport', 'Internet', 'Link'], 'Your app talks HTTP, which rides on TCP, inside IP packets, sent over Wi-Fi.'),
    mc('Which layer gets a packet from one computer to another across many networks?', ['Internet (IP)', 'Application', 'Link'], 0, 'IP addresses and routing.'),
    ex('Encapsulation', 'Each layer **wraps** the data from the layer above with its own **header**, like envelopes inside envelopes:\n\n[ Wi-Fi header [ IP header [ TCP header [ HTTP request ] ] ] ]\n\nThe receiver unwraps them in reverse order.'),
    mc('When your computer receives a packet, which header does it read first?', ['The link (Wi-Fi/Ethernet) header', 'The HTTP header'], 0, 'Outermost envelope first.'),
    ex('The OSI model', 'Textbooks also teach the 7-layer **OSI model** (Physical, Data Link, Network, Transport, Session, Presentation, Application). You\'ll hear people say "a layer 7 problem" (application) or "layer 3" (network/IP). The ideas are the same.'),
    mc('"That\'s a layer 3 problem" refers to…', ['the network layer (IP and routing)', 'the application', 'the cable'], 0, 'OSI layer 3 = network.'),
  ],

  // ------------------------------------------------------------------ ns-1-ip-tcp
  'ns-1-ip-tcp': [
    ex('IP addresses', 'Every device on the internet has an **IP address**. **IPv4** addresses are four numbers from 0–255: `192.168.1.10`. That\'s 32 bits, about 4.3 billion addresses, which ran out. **IPv6** uses 128 bits: `2001:db8::1`.\n\nData travels in **packets**. **Routers** pass each packet toward its destination, one hop at a time.'),
    mc('Which is a valid IPv4 address?', ['192.168.1.10', '192.168.1.300', '192.168.1'], 0, 'Four parts, each 0–255.'),
    ex('Networks and subnets', '`192.168.1.0/24` means: the first **24 bits** (the first three numbers) identify the network, and the last 8 bits identify the device. So `192.168.1.5` and `192.168.1.200` are on the **same** network; `192.168.2.5` is not.'),
    ans('How many device addresses fit in the last 8 bits of a /24 network? (2⁸)', ['256'], '0–255. Two are reserved, leaving 254 usable devices.'),
    ex('TCP vs UDP', '- **TCP**: a reliable, ordered stream. Lost packets are resent, and data arrives in order. It starts with a **3-way handshake** (SYN, SYN-ACK, ACK). Used for web pages, email and files.\n- **UDP**: just send it, with no guarantees. Faster, less overhead. Used for video calls, games and DNS.\n\nPrograms are reached at **ports**: HTTPS is 443, HTTP is 80.'),
    mc('A video call drops a packet. It\'s better to skip it than to wait for a resend. Which protocol fits?', ['UDP', 'TCP'], 0, 'Late audio is useless, so speed beats perfection.'),
    ordT('Order the TCP handshake.', ['SYN', 'SYN-ACK', 'ACK'], '"Can we talk?" "Yes, can you hear me?" "Yes."'),
    py({
      prompt: 'Write `same_subnet_24(a, b)` that returns True if two IPv4 addresses (strings) share the first three numbers, meaning they\'re on the same /24 network. Also write `is_valid_ipv4(s)`: four parts, each a whole number from 0 to 255.',
      starter: 'def same_subnet_24(a, b):\n    pass\n\n\ndef is_valid_ipv4(s):\n    pass\n',
      tests: [eq('same_subnet_24("192.168.1.5", "192.168.1.200")', 'True'), eq('same_subnet_24("192.168.1.5", "192.168.2.5")', 'False'), eq('is_valid_ipv4("10.0.0.1")', 'True'), eq('is_valid_ipv4("10.0.0.256")', 'False'), eq('is_valid_ipv4("10.0.1")', 'False'), eq('is_valid_ipv4("a.b.c.d")', 'False')],
      hints: ['a.split(".")[:3] gives the first three parts.', 'is_valid_ipv4: parts = s.split("."); check len(parts) == 4, and every p.isdigit() and 0 <= int(p) <= 255'],
      solution: 'def same_subnet_24(a, b):\n    return a.split(".")[:3] == b.split(".")[:3]\n\n\ndef is_valid_ipv4(s):\n    parts = s.split(".")\n    if len(parts) != 4:\n        return False\n    return all(p.isdigit() and 0 <= int(p) <= 255 for p in parts)\n',
    }),
  ],

  // ------------------------------------------------------------------ ns-1-http-dns
  'ns-1-http-dns': [
    ex('What happens when you visit a site', 'Typing `https://example.com` sets off a chain:\n\n1. **DNS**: look up example.com\'s IP address\n2. **TCP**: connect to that IP on port 443\n3. **TLS**: set up encryption (the "S" in HTTPS)\n4. **HTTP**: send `GET /` and receive the HTML\n5. The browser fetches CSS, JavaScript and images the same way, then draws the page'),
    ordT('Put these steps in order.', ['DNS lookup', 'TCP connection', 'TLS handshake', 'HTTP request'], 'Find the address → connect → encrypt → ask for the page.'),
    ex('DNS: the internet\'s phone book', '**DNS** turns names into addresses:\n\n- an **A record** maps a name to an IPv4 address\n- a **CNAME** says "this name is an alias for that other name"\n\nAnswers are **cached** for a while (their TTL, "time to live"), which is why DNS changes can take time to spread.'),
    mc('Why might a website\'s new address take hours to reach everyone?', ['DNS answers are cached until their TTL runs out', 'The internet is slow', 'HTTP is broken'], 0, 'Lower the TTL before planned moves.'),
    ex('HTTP messages', 'A request is plain text:\n\n```\nGET /books/42 HTTP/1.1\nHost: example.com\nAccept: application/json\n```\n\nThe first line has the **method**, the **path** and the **version**. Then come **headers**. The response starts with a status line like `HTTP/1.1 200 OK`.'),
    mcT('What is the path in this request line?', ['/books/42', 'GET', 'HTTP/1.1'], 0, 'Method, path, version.', 'GET /books/42 HTTP/1.1'),
    py({
      prompt: 'Write `parse_request_line(line)` that returns a dict with `"method"`, `"path"` and `"version"` from an HTTP request line like `"GET /books/42 HTTP/1.1"`.',
      starter: 'def parse_request_line(line):\n    pass\n',
      tests: [eq('parse_request_line("GET /books/42 HTTP/1.1")', '{"method": "GET", "path": "/books/42", "version": "HTTP/1.1"}'), eq('parse_request_line("POST /login HTTP/2")["method"]', '"POST"')],
      hints: ['method, path, version = line.split(" ")', 'return {"method": method, "path": path, "version": version}'],
      solution: 'def parse_request_line(line):\n    method, path, version = line.split(" ")\n    return {"method": method, "path": path, "version": version}\n',
    }),
    py({
      prompt: 'Simulate a DNS lookup. `records` maps a name to either `("A", "ip address")` or `("CNAME", "other name")`. Write `resolve(name, records)` that follows CNAMEs until it reaches an A record and returns the IP. Return None if the name doesn\'t exist.',
      starter: 'def resolve(name, records):\n    pass\n',
      tests: [eq('resolve("www.pip.dev", {"www.pip.dev": ("CNAME", "pip.dev"), "pip.dev": ("A", "203.0.113.7")})', '"203.0.113.7"'), eq('resolve("pip.dev", {"pip.dev": ("A", "203.0.113.7")})', '"203.0.113.7"'), eq('resolve("nope.dev", {})', 'None')],
      hints: ['Loop: while name in records: kind, value = records[name]', 'If kind == "A", return value; otherwise name = value. After the loop, return None.'],
      solution: 'def resolve(name, records):\n    while name in records:\n        kind, value = records[name]\n        if kind == "A":\n            return value\n        name = value\n    return None\n',
    }),
  ],

  // ------------------------------------------------------------------ ns-2-crypto
  'ns-2-crypto': [
    ex('Keeping secrets', '**Encryption** scrambles data so only someone with the right **key** can read it.\n\n- **Symmetric** (like AES): **one shared key** both encrypts and decrypts. Fast, but how do you share the key safely?\n- **Asymmetric** (like RSA, from Discrete Math): a **public key** anyone can use to encrypt, and a **private key** only you have to decrypt.'),
    mc('With asymmetric encryption, which key do you share with the world?', ['The public key', 'The private key', 'Both'], 0, 'Never share the private key.'),
    ex('How HTTPS uses both', '**TLS** (the S in HTTPS) combines them: asymmetric crypto to safely agree on a fresh **symmetric** key, then fast symmetric encryption for the actual data.\n\nThe site proves who it is with a **certificate** signed by a trusted authority. That\'s the lock icon in your browser.'),
    mc('Why does TLS switch to symmetric encryption after the handshake?', ['Symmetric encryption is much faster for lots of data', 'Asymmetric encryption is insecure', 'Browsers require it'], 0, 'Best of both worlds.'),
    ex('Hashing is different', 'A **hash function** (like SHA-256) turns any input into a fixed-size fingerprint:\n\n- the same input always gives the same hash\n- a tiny change gives a completely different hash\n- it\'s **one-way**: you can\'t get the input back\n\nHashes check that files weren\'t changed, and store passwords safely (next lesson). Hashing is **not** encryption: there\'s no key and no decrypting.'),
    mc('Can you "decrypt" a SHA-256 hash to get the original text?', ['No: hashing is one-way', 'Yes, with the right key'], 0, 'No key exists. Attackers can only guess inputs and compare.'),
    ans('What does this print? (How many hex characters is a SHA-256 hash?)', ['64'], '256 bits = 32 bytes = 64 hex characters, whatever the input size.', 'import hashlib\nprint(len(hashlib.sha256(b"hello").hexdigest()))'),
    py({
      prompt: 'Verify a download. Write `matches(data, expected_hex)` that returns True if the SHA-256 hash of `data` (bytes) equals `expected_hex`. Then `fingerprint(text)` should return the first 8 hex characters of the SHA-256 hash of a **string** (encode it as UTF-8).',
      starter: 'import hashlib\n\n\ndef matches(data, expected_hex):\n    pass\n\n\ndef fingerprint(text):\n    pass\n',
      tests: [eq('matches(b"hello", hashlib.sha256(b"hello").hexdigest())', 'True'), eq('matches(b"hello!", hashlib.sha256(b"hello").hexdigest())', 'False'), eq('fingerprint("hello")', '"2cf24dba"')],
      hints: ['hashlib.sha256(data).hexdigest() gives the hash as hex text.', 'fingerprint: hashlib.sha256(text.encode("utf-8")).hexdigest()[:8]'],
      solution: 'import hashlib\n\n\ndef matches(data, expected_hex):\n    return hashlib.sha256(data).hexdigest() == expected_hex\n\n\ndef fingerprint(text):\n    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:8]\n',
    }),
  ],

  // ------------------------------------------------------------------ ns-2-auth
  'ns-2-auth': [
    ex('Storing passwords', '**Never store passwords as plain text.** Store a **hash** instead, and when someone logs in, hash what they typed and compare.\n\nTwo more must-haves:\n\n- a random **salt** per user, mixed in before hashing, so identical passwords get different hashes and precomputed "rainbow tables" don\'t work\n- a **slow** hash made for passwords (bcrypt, scrypt, Argon2), so guessing billions of passwords is too expensive'),
    mc('A database of password hashes leaks. Why does a per-user salt help?', ['The same password gives different hashes, so attackers must crack each one separately', 'Salts encrypt the database', 'It makes hashes shorter'], 0, 'No shortcuts with precomputed tables.'),
    mc('Why use a SLOW hash like bcrypt for passwords?', ['Each guess costs an attacker real time', 'It saves server power', 'Fast hashes are inaccurate'], 0, 'Slow for one login is fine; slow for billions of guesses is a wall.'),
    ex('Sessions and tokens', 'After login, the server must remember you on every request:\n\n- **session**: the server stores your login and gives your browser a random **session ID** cookie\n- **token** (like a JWT): a signed message the client sends with each request\n\nCookies should be `HttpOnly` (JavaScript can\'t read them) and `Secure` (only sent over HTTPS).'),
    mc('Why mark a session cookie HttpOnly?', ['So injected JavaScript (XSS) can\'t steal it', 'To make it load faster', 'So it works without HTTPS'], 0, 'Defense in depth.'),
    ex('Two-factor authentication', '**2FA** asks for two kinds of proof:\n\n- something you **know** (a password)\n- something you **have** (a phone app code, a security key)\n\nA stolen password alone is then not enough.'),
    mc('Which is a second factor?', ['A code from an authenticator app', 'Your password again', 'Your username'], 0, 'Something you have.'),
    py({
      prompt: 'Practice the salt-and-hash pattern (with SHA-256 to keep it simple; real systems use bcrypt or Argon2). Write:\n\n- `hash_password(password, salt)`: the SHA-256 hex digest of `salt + password` (both strings, UTF-8)\n- `check_password(password, salt, stored)`: True if hashing the attempt gives `stored`',
      starter: 'import hashlib\n\n\ndef hash_password(password, salt):\n    pass\n\n\ndef check_password(password, salt, stored):\n    pass\n',
      tests: [
        { name: 'right password passes', code: 's = hash_password("hunter2", "x9")\nassert check_password("hunter2", "x9", s)' },
        { name: 'wrong password fails', code: 's = hash_password("hunter2", "x9")\nassert not check_password("hunter3", "x9", s)' },
        { name: 'salt changes the hash', code: 'assert hash_password("same", "a") != hash_password("same", "b"), "different salts should give different hashes"' },
        { name: 'never stores the plain password', code: 'assert "hunter2" not in hash_password("hunter2", "x9")' },
      ],
      hints: ['hashlib.sha256((salt + password).encode("utf-8")).hexdigest()', 'check_password: return hash_password(password, salt) == stored'],
      solution: 'import hashlib\n\n\ndef hash_password(password, salt):\n    return hashlib.sha256((salt + password).encode("utf-8")).hexdigest()\n\n\ndef check_password(password, salt, stored):\n    return hash_password(password, salt) == stored\n',
    }),
  ],

  // ------------------------------------------------------------------ ns-2-vulnerabilities
  'ns-2-vulnerabilities': [
    ex('Think like an attacker, defensively', 'The **OWASP Top 10** lists the most common web security risks. Two classics share one root cause: **mixing untrusted input with code**.\n\n**SQL injection:** building a query by gluing in user text:\n\n```python\nquery = "SELECT * FROM users WHERE name = \'" + name + "\'"\n```\n\nIf `name` is `x\' OR \'1\'=\'1`, the query returns **every** user.', 'Only test security on systems you own or have written permission to test.'),
    mc('What is the root cause of SQL injection?', ['User input is pasted straight into the SQL code', 'The database is too old', 'Passwords are too short'], 0, 'Input became code.'),
    ex('The fix: parameters', 'Use **parameterized queries**. The database receives the query and the values **separately**, so input can never become code:\n\n```python\ncursor.execute("SELECT * FROM users WHERE name = ?", (name,))\n```\n\nNever build SQL with `+` or f-strings from user input.'),
    mc('Which line is safe from SQL injection?', ['cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))', 'cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")', 'cursor.execute("SELECT * FROM users WHERE id = " + user_id)'], 0, 'The ? placeholder keeps the data separate.'),
    ex('XSS: cross-site scripting', 'If a site shows user text as raw HTML, a "comment" like `<script>steal()</script>` runs in **every visitor\'s** browser. (You met this in Web Basics and JavaScript.)\n\nFix: **escape** output, turning `<` into `&lt;` and so on. Frameworks like React do it by default. Plus a **Content Security Policy** to block unexpected scripts.'),
    mc('The best defense against XSS is to…', ['escape user content before showing it as HTML', 'hide the comment box', 'use longer passwords'], 0, 'Treat user content as text, never as code.'),
    ex('A few more', '- **Broken access control**: changing `/invoices/41` to `/invoices/42` shows someone else\'s invoice. Always check permissions on the server.\n- **Secrets in code**: API keys committed to GitHub.\n- **Outdated dependencies** with known holes: keep them updated.'),
    mc('A user changes /orders/100 to /orders/101 and sees another customer\'s order. What\'s wrong?', ['Broken access control: the server didn\'t check ownership', 'SQL injection', 'Nothing'], 0, 'Never trust the client to hide things.'),
    py({
      prompt: 'Write `escape_html(text)` that makes text safe to put inside HTML by replacing:\n\n- `&` → `&amp;` (do this one **first**!)\n- `<` → `&lt;`\n- `>` → `&gt;`\n- `"` → `&quot;`\n- `\'` → `&#39;`',
      starter: 'def escape_html(text):\n    pass\n',
      tests: [eq('escape_html("<script>alert(1)</script>")', '"&lt;script&gt;alert(1)&lt;/script&gt;"'), eq('escape_html("Tom & Jerry")', '"Tom &amp; Jerry"'), eq('escape_html("say \\"hi\\" it\'s")', '"say &quot;hi&quot; it&#39;s"'), eq('escape_html("&lt;")', '"&amp;lt;"', '& is escaped first, so existing entities are escaped too')],
      hints: ['Chain replace calls: text.replace("&", "&amp;").replace("<", "&lt;")…', '& must come first, or you\'d turn the & in "&lt;" into "&amp;lt;".'],
      solution: 'def escape_html(text):\n    return (text.replace("&", "&amp;")\n                .replace("<", "&lt;")\n                .replace(">", "&gt;")\n                .replace(\'"\', "&quot;")\n                .replace("\'", "&#39;"))\n',
    }),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'ns-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('HTTP belongs to which layer?', ['Application', 'Transport', 'Link'], 0, 'App layer.'),
      mc('Reliable, ordered delivery is provided by…', ['TCP', 'UDP', 'IP'], 0, 'TCP.'),
      mc('Which IPv4 address is invalid?', ['10.0.0.300', '10.0.0.30'], 0, 'Max 255.'),
      ans('Bits in an IPv4 address?', ['32'], 'Four 8-bit numbers.'),
      mc('DNS turns…', ['names into IP addresses', 'IP addresses into HTML'], 0, 'Phone book.'),
      mc('HTTPS usually uses port…', ['443', '80', '22'], 0, '443.'),
      py({ prompt: 'Write `port_service(port)`: return "http" for 80, "https" for 443, "ssh" for 22, else "unknown".', starter: 'def port_service(port):\n    pass\n', tests: [eq('port_service(443)', '"https"'), eq('port_service(22)', '"ssh"'), eq('port_service(9999)', '"unknown"')], solution: 'def port_service(port):\n    return {80: "http", 443: "https", 22: "ssh"}.get(port, "unknown")\n' }),
    ],
  },
  'ns-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('One shared key for both encrypting and decrypting is…', ['symmetric encryption', 'asymmetric encryption'], 0, 'Symmetric.'),
      mc('Hashing is…', ['one-way', 'reversible with a key'], 0, 'One-way.'),
      mc('Passwords should be stored as…', ['salted, slow hashes', 'encrypted text', 'plain text'], 0, 'bcrypt/Argon2.'),
      mc('2FA adds…', ['something you have', 'a longer username'], 0, 'Second factor.'),
      mc('The fix for SQL injection is…', ['parameterized queries', 'longer queries'], 0, 'Separate data from code.'),
      mc('Escaping output prevents…', ['XSS', 'deadlock'], 0, 'XSS.'),
      py({ prompt: 'Write `is_strong(pw)`: True if pw has at least 12 characters and contains a digit.', starter: 'def is_strong(pw):\n    pass\n', tests: [eq('is_strong("correcthorse9")', 'True'), eq('is_strong("short1")', 'False'), eq('is_strong("nodigitsatallhere")', 'False')], solution: 'def is_strong(pw):\n    return len(pw) >= 12 and any(c.isdigit() for c in pw)\n' }),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  'networks-security': {
    passScore: 0.8, hearts: 3,
    questions: [
      mc('Which layer moves packets between networks?', ['Internet (IP)', 'Application'], 0, 'IP.'),
      mc('A live game that prefers speed over resends uses…', ['UDP', 'TCP'], 0, 'UDP.'),
      mc('Are 10.1.2.3 and 10.1.2.99 on the same /24?', ['Yes', 'No'], 0, 'Same first three numbers.'),
      mc('The first step of loading a website by name is…', ['a DNS lookup', 'the HTTP request'], 0, 'Find the address.'),
      mc('A CNAME record is…', ['an alias for another name', 'an IP address'], 0, 'Alias.'),
      mc('HTTPS protects data using…', ['TLS', 'DNS'], 0, 'TLS.'),
      mc('A salt makes identical passwords…', ['hash differently', 'hash identically'], 0, 'Unique per user.'),
      mc('Changing an ID in the URL to see others\' data is…', ['broken access control', 'XSS'], 0, 'Check on the server.'),
      ans('What does this print?', ['&lt;b&gt;'], 'html.escape turns < and > into entities.', 'import html\nprint(html.escape("<b>"))'),
      py({ prompt: 'Write `caesar(text, shift)`: shift each lowercase letter forward by `shift` (wrapping z → a), leaving other characters alone. (An ancient cipher. Never use it for real security!)', starter: 'def caesar(text, shift):\n    pass\n', tests: [eq('caesar("abc", 1)', '"bcd"'), eq('caesar("xyz", 3)', '"abc"'), eq('caesar("hi pip!", 13)', '"uv cvc!"')], hints: ['For a letter c: chr((ord(c) - ord("a") + shift) % 26 + ord("a"))'], solution: 'def caesar(text, shift):\n    out = ""\n    for c in text:\n        if "a" <= c <= "z":\n            out += chr((ord(c) - ord("a") + shift) % 26 + ord("a"))\n        else:\n            out += c\n    return out\n' }),
    ],
  },
};
