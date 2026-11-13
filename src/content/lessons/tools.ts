/**
 * Track: tools — "Developer Tools"
 * Written here: tl-1 (command line, hands-on in the practice terminal), tl-2 (Git), tl-3 (setup)
 * + checkpoints + final exam.
 */
import type { Checkpoint, Step } from '../types';
import { ansT, ex, fillT, mcT, ord, term } from './_helpers';

const LOG = 'INFO server started\nINFO user login\nERROR database timeout\nINFO page viewed\nERROR file missing\nWARN slow request\nERROR database timeout\n';

export const lessons: Record<string, Step[]> = {
  // ------------------------------------------------------------------ tl-1-terminal
  'tl-1-terminal': [
    ex('Talking to the computer in text', 'Before mice and windows, people used computers by **typing commands**. Programmers still do every day, because it\'s fast, precise and easy to automate.\n\n- The **terminal** is the window you type into.\n- The **shell** (usually *bash* or *zsh*) is the program that reads your command and runs it.\n- The **command line** is the whole idea: text in, text out.', 'In Loopwise you\'ll practice in a pretend terminal — you can\'t break anything!'),
    ex('Reading the prompt', 'The shell shows a **prompt** when it\'s ready for a command:\n\n```text\nlearner@loopwise:~/projects$ \n```\n\n- `learner` — your username\n- `loopwise` — the computer\'s name\n- `~/projects` — the folder you\'re in (`~` means your **home folder**)\n- `$` — "your turn"\n\nYou type after the `$` and press **Enter**.'),
    mcT('In the prompt `ada@laptop:~/school$`, which folder is Ada in?', ['laptop', '~/school (the school folder inside her home folder)', 'ada', '$'], 1, 'The part between : and $ is the current folder.'),
    ex('Commands, arguments, options', '```text\nls -a projects\n```\n\n- `ls` — the **command** (what to do)\n- `-a` — an **option** (or *flag*) that changes how it behaves\n- `projects` — an **argument** (what to do it to)\n\nCommands are **case-sensitive**: `ls` works, `LS` doesn\'t.'),
    mcT('In `mkdir -p photos/2026`, what is `-p`?', ['The command', 'An option (flag)', 'The argument', 'The prompt'], 1, 'Things starting with - are options that tweak a command.'),
    term({
      prompt: 'Your first command! Type `pwd` ("**p**rint **w**orking **d**irectory") and press **Enter** to see which folder you\'re in. Then press **Check**.',
      goal: { used: ['pwd'], outputIncludes: ['/home/learner'] },
      hints: ['Type exactly: pwd'],
      solution: ['pwd'],
    }),
    term({
      prompt: '`echo` prints whatever you give it. Make the terminal say **Hello, terminal!**',
      goal: { outputIncludes: ['Hello, terminal!'], used: ['echo'] },
      hints: ['echo Hello, terminal!'],
      solution: ['echo Hello, terminal!'],
    }),
    mcT('You type `PWD` and get "command not found". Why?', ['The computer is broken', 'Commands are case-sensitive — it should be pwd', 'pwd needs an argument'], 1, 'Shells treat uppercase and lowercase as different.'),
  ],

  // ------------------------------------------------------------------ tl-1-navigation
  'tl-1-navigation': [
    ex('Looking around: ls', '`ls` **l**i**s**ts what\'s in the current folder.\n\n- `ls` — list this folder\n- `ls photos` — list a different folder\n- `ls -a` — show **all**, including hidden files whose names start with `.`\n- `ls -l` — **long** format with details'),
    term({
      prompt: 'Use `ls` to see what\'s in your home folder.',
      setup: { dirs: ['projects', 'music'], files: { 'todo.txt': 'learn the terminal\n' } },
      goal: { used: ['ls'], outputIncludes: ['todo.txt'] },
      hints: ['Just type ls and press Enter.'],
      solution: ['ls'],
    }),
    ex('Moving around: cd', '`cd` **c**hanges **d**irectory:\n\n- `cd projects` — go into `projects`\n- `cd ..` — go **up** one level (to the parent folder)\n- `cd ~` or just `cd` — go home\n- `cd /` — go to the very top (the **root**)\n- `cd music/jazz` — go several levels at once\n\nIn a real terminal, press **Tab** to auto-complete names — it saves tons of typing.'),
    term({
      prompt: 'Go **into** the `projects` folder. Use `pwd` afterwards to confirm where you are.',
      setup: { dirs: ['projects', 'music'] },
      goal: { cwd: '~/projects' },
      hints: ['cd projects'],
      solution: ['cd projects', 'pwd'],
    }),
    term({
      prompt: 'You\'re in `~/projects`. Get to the `jazz` folder, which is inside `music` in your home folder.',
      setup: { dirs: ['projects', 'music/jazz', 'music/rock'], cwd: '~/projects' },
      goal: { cwd: '~/music/jazz' },
      hints: ['First go up with cd .., then into music/jazz.', 'Or in one go: cd ../music/jazz  (or cd ~/music/jazz)'],
      solution: ['cd ../music/jazz'],
    }),
    term({
      prompt: 'There\'s a **hidden** file in this folder. Find it with the right option of `ls`.',
      setup: { files: { 'notes.txt': 'hi\n', '.secret-plan': 'learn everything\n' } },
      goal: { outputIncludes: ['.secret-plan'] },
      hints: ['Hidden files start with a dot. ls only shows them with -a.'],
      solution: ['ls -a'],
    }),
    mcT('What does `cd ..` do?', ['Deletes the folder', 'Goes up to the parent folder', 'Goes to the home folder', 'Lists two folders'], 1, '.. always means "the folder above this one".'),
    ansT('You\'re in `/home/ada/school/math`. You run `cd ../..`. Where are you now? (full path)', ['/home/ada', '/home/ada/'], 'Each .. goes up one: math → school → ada.'),
  ],

  // ------------------------------------------------------------------ tl-1-files
  'tl-1-files': [
    ex('Making things', '- `mkdir name` — **m**a**k**e a **dir**ectory (folder). `mkdir -p a/b/c` makes all the missing levels.\n- `touch file.txt` — create an empty file\n- `echo "text" > file.txt` — create a file **with** content\n- `cat file.txt` — show what\'s in a file'),
    term({
      prompt: 'Set up a website project: create a folder named `website`, and inside it create two empty files: `index.html` and `style.css`.',
      goal: { dirs: ['~/website'], files: ['~/website/index.html', '~/website/style.css'] },
      hints: ['mkdir website', 'touch website/index.html website/style.css  (or cd website first, then touch each)'],
      solution: ['mkdir website', 'touch website/index.html website/style.css'],
    }),
    term({
      prompt: 'Look inside `recipe.txt` to find the secret ingredient, then save **just that ingredient** into a new file called `answer.txt` using `echo` and `>`.',
      setup: { files: { 'recipe.txt': 'Flour\nSugar\nSecret ingredient: cinnamon\n' } },
      goal: { equals: { '~/answer.txt': 'cinnamon' }, used: ['cat'] },
      hints: ['cat recipe.txt shows the file.', 'echo cinnamon > answer.txt'],
      solution: ['cat recipe.txt', 'echo cinnamon > answer.txt'],
    }),
    ex('Copying, moving, renaming', '- `cp a.txt b.txt` — **c**o**p**y\n- `cp -r folder backup` — copy a whole folder (**r**ecursively)\n- `mv a.txt docs/` — **m**o**v**e into a folder\n- `mv old.txt new.txt` — **rename** (moving to a new name)'),
    term({
      prompt: 'Rename `draft.txt` to `final.txt`, then move it into the `essays` folder.',
      setup: { dirs: ['essays'], files: { 'draft.txt': 'My essay\n' } },
      goal: { files: ['~/essays/final.txt'], missing: ['~/draft.txt', '~/final.txt'] },
      hints: ['mv draft.txt final.txt', 'mv final.txt essays/'],
      solution: ['mv draft.txt final.txt', 'mv final.txt essays/'],
    }),
    ex('Deleting — carefully!', '- `rm file.txt` — **r**e**m**ove a file\n- `rm -r folder` — remove a folder and **everything in it**\n- `rmdir folder` — remove a folder only if it\'s empty\n\n⚠️ **There is no trash can.** `rm` deletes immediately and permanently. Double-check before pressing Enter — especially with `-r`.', 'Never run a command like rm -rf / or rm -rf ~ that someone online tells you to. It erases everything.'),
    term({
      prompt: 'Clean up: delete the `old-stuff` folder (it has files inside) and the file `junk.txt`. Keep `keep.txt`!',
      setup: { dirs: ['old-stuff'], files: { 'old-stuff/a.txt': 'a', 'old-stuff/b.txt': 'b', 'junk.txt': 'x', 'keep.txt': 'important' } },
      goal: { missing: ['~/old-stuff', '~/junk.txt'], files: ['~/keep.txt'] },
      hints: ['A folder with files inside needs rm -r.', 'rm -r old-stuff   then   rm junk.txt'],
      solution: ['rm -r old-stuff', 'rm junk.txt'],
    }),
    mcT('Which command makes a backup copy of a whole folder?', ['mv photos backup', 'cp photos backup', 'cp -r photos backup', 'rm -r photos'], 2, 'Copying a folder needs -r (recursive).'),
  ],

  // ------------------------------------------------------------------ tl-1-pipes
  'tl-1-pipes': [
    ex('Small tools that work together', 'The command line\'s superpower: **small commands you can chain**.\n\n- `grep word file` — show only lines containing *word*\n- `wc -l file` — count lines\n- `head -n 3 file` / `tail -n 3 file` — first / last lines\n- `sort file` — sort lines alphabetically'),
    term({
      prompt: '`app.log` is a server log. Show only the lines that contain `ERROR`.',
      setup: { files: { 'app.log': LOG } },
      goal: { used: ['grep'], outputIncludes: ['ERROR file missing'] },
      hints: ['grep ERROR app.log'],
      solution: ['grep ERROR app.log'],
    }),
    ex('Redirection: > and >>', '- `command > file` — save the output into a file (**replaces** what was there)\n- `command >> file` — **append** to the end of the file\n\n```text\necho "first" > log.txt\necho "second" >> log.txt\n```\n\nNow log.txt has both lines.'),
    term({
      prompt: 'Save all the `ERROR` lines from `app.log` into a new file called `errors.txt`.',
      setup: { files: { 'app.log': LOG } },
      goal: { equals: { '~/errors.txt': 'ERROR database timeout\nERROR file missing\nERROR database timeout' } },
      hints: ['grep ERROR app.log > errors.txt'],
      solution: ['grep ERROR app.log > errors.txt'],
    }),
    ex('Pipes: |', 'A **pipe** `|` sends one command\'s output straight into the next command:\n\n```text\ngrep ERROR app.log | wc -l\n```\n\nmeans: find the error lines, **then** count them. You can chain as many as you like.'),
    term({
      prompt: 'Count how many lines in `app.log` contain `ERROR`, using a **pipe**, and save just the number into `count.txt`.',
      setup: { files: { 'app.log': LOG } },
      goal: { equals: { '~/count.txt': '3' } },
      hints: ['grep ERROR app.log | wc -l shows the count.', 'Add > count.txt at the end.'],
      solution: ['grep ERROR app.log | wc -l > count.txt'],
    }),
    term({
      prompt: '`names.txt` has a list of names. Show them **sorted**, and only the **first 2**.',
      setup: { files: { 'names.txt': 'Zoe\nAda\nMia\nLinus\nGrace\n' } },
      goal: { outputIncludes: ['Ada\nGrace'], used: ['sort', 'head'] },
      hints: ['sort names.txt | head -n 2'],
      solution: ['sort names.txt | head -n 2'],
    }),
    mcT('What\'s the difference between > and >>?', ['None', '> replaces the file; >> adds to the end', '>> replaces; > adds', '> is for folders'], 1, 'Use >> when you want to keep what\'s already there.'),
  ],

  // ------------------------------------------------------------------ tl-2-why-git
  'tl-2-why-git': [
    ex('The "final_v2_REALLY_final" problem', 'Ever had files like `essay_final.docx`, `essay_final2.docx`, `essay_REAL_final.docx`?\n\n**Version control** fixes that. **Git** — the tool almost every developer uses — saves **snapshots** of your project over time, so you can:\n\n- see exactly what changed, when, and why\n- go back to any earlier version\n- work on new ideas without breaking what works\n- combine work from many people safely'),
    ex('Key words', '- **Repository (repo)** — a project folder Git is tracking (it keeps its history in a hidden `.git` folder)\n- **Commit** — a saved snapshot, with a message describing the change\n- **Branch** — a separate line of work\n- **Remote** — a copy of the repo on another computer, like **GitHub**', 'Git and GitHub aren\'t the same: Git is the tool on your computer; GitHub is a website that hosts Git repos.'),
    mcT('What is a commit?', ['A website', 'A saved snapshot of your project with a message', 'A type of file', 'A Python command'], 1, 'Commits are the snapshots that make up a project\'s history.'),
    mcT('Git vs GitHub?', ['Same thing', 'Git tracks versions on your computer; GitHub hosts repos online for sharing', 'GitHub is required to use Git'], 1, 'You can use Git without GitHub; GitHub adds sharing and collaboration.'),
    mcT('Where does Git store a repository\'s history?', ['In the cloud only', 'In a hidden .git folder inside the project', 'In your Documents folder'], 1, 'Delete .git and the folder stops being a repository.'),
    mcT('Why do teams use version control?', ['To make code run faster', 'To track changes, undo mistakes and combine everyone\'s work safely', 'Because computers require it'], 1, 'It\'s the safety net and collaboration tool for code.'),
  ],

  // ------------------------------------------------------------------ tl-2-commits
  'tl-2-commits': [
    ex('The basic loop', '```text\ngit init                    # start tracking this folder (once)\ngit status                  # what changed?\ngit add essay.txt           # stage a file for the next snapshot\ngit commit -m "Add intro"   # save the snapshot with a message\ngit log                     # see the history\n```\n\nYou\'ll run `status → add → commit` hundreds of times.'),
    ex('The staging area', 'Git has three places:\n\n- **Working folder** — your files as you edit them\n- **Staging area** — changes you\'ve chosen for the next commit (`git add`)\n- **History** — committed snapshots (`git commit`)\n\nStaging lets you commit **some** changes and leave others for later. `git add .` stages everything in the current folder.'),
    ord('Put the everyday Git steps in order.', ['Edit your files', 'git status', 'git add <files>', 'git commit -m "message"'], 'Change → check → stage → commit.', 'text'),
    fillT('Complete the command to commit with a message.', 'git ___ -m "Fix typo in title"', [['commit']], 'git commit saves the staged snapshot.', ['commit', 'save', 'push', 'add']),
    fillT('Stage the file app.py.', 'git ___ app.py', [['add']], 'git add puts changes in the staging area.', ['add', 'stage', 'commit', 'put']),
    mcT('Which is the most useful commit message?', ['"stuff"', '"changes"', '"Fix crash when the cart is empty"', '"asdf"'], 2, 'Good messages say what changed and why — future you will thank you.'),
    mcT('Which command shows the history of commits?', ['git history', 'git log', 'git status', 'git show-all'], 1, 'git log lists commits, newest first.'),
    mcT('You edited 3 files but only want to commit one. What do you do?', ['Commit everything anyway', 'git add only that one file, then commit', 'Delete the other two'], 1, 'The staging area exists exactly for this.'),
  ],

  // ------------------------------------------------------------------ tl-2-branches
  'tl-2-branches': [
    ex('Parallel universes for code', 'A **branch** is an independent line of work. The main line is usually called `main`.\n\nTo try a new feature without risking `main`:\n\n```text\ngit switch -c dark-mode     # create a branch and switch to it\n# …edit, add, commit…\ngit switch main             # go back to main\ngit merge dark-mode         # bring the finished work into main\n```\n\n(Older tutorials use `git checkout -b dark-mode` — same idea.)'),
    mcT('Why make a branch for a new feature?', ['Branches make code faster', 'So unfinished work doesn\'t break the main version', 'Git requires one branch per file'], 1, 'main stays working while you experiment.'),
    ord('Order the steps to build a feature on a branch and bring it into main.', ['git switch -c new-feature', 'Edit files, then git add and git commit', 'git switch main', 'git merge new-feature'], 'Create → work → go back → merge.', 'text'),
    ex('Merge conflicts', 'If two branches change the **same lines**, Git can\'t guess which to keep. It marks the file:\n\n```text\n<<<<<<< HEAD\ntitle = "Loopwise"\n=======\ntitle = "LoopWise!"\n>>>>>>> rename-branch\n```\n\nYou edit the file to keep what you want, delete the markers, then `git add` and `git commit`. Conflicts are normal — not a disaster.'),
    mcT('In a conflict, the part between <<<<<<< HEAD and ======= is…', ['the version on the branch you\'re on (current)', 'the version from the other branch', 'a Git error message'], 0, 'HEAD = where you are now. The part after ======= comes from the branch being merged in.'),
    mcT('What do you do after fixing a conflict in a file?', ['Delete the repository', 'git add the file, then git commit', 'Nothing'], 1, 'Staging the fixed file tells Git the conflict is resolved.'),
    fillT('Create a new branch called login and switch to it.', 'git switch ___ login', [['-c']], '-c means "create".', ['-c', '-b', '--new', 'new']),
  ],

  // ------------------------------------------------------------------ tl-2-github
  'tl-2-github': [
    ex('Remotes and GitHub', 'A **remote** is a copy of your repo somewhere else — usually on **GitHub**. It\'s your backup and how you share code.\n\n```text\ngit clone <url>     # download a repo (with its whole history)\ngit push            # send your commits up to the remote\ngit pull            # bring others\' commits down to you\n```\n\nThe first push of a new branch: `git push -u origin main` (`origin` is the default name for your remote).'),
    mcT('You want to download a project from GitHub to work on it. Which command?', ['git push', 'git clone <url>', 'git commit', 'git init'], 1, 'clone copies the entire repository to your computer.'),
    mcT('You made commits locally. How do teammates get them?', ['They appear automatically', 'You git push, then they git pull', 'Email the files'], 1, 'push uploads; pull downloads.'),
    ex('Pull requests', 'On GitHub, you usually don\'t push straight to `main`. Instead:\n\n- push your **branch**\n- open a **pull request** (PR): "please review and merge my changes"\n- teammates **review**, comment, and approve\n- the branch is **merged**\n\nA **fork** is your own copy of someone else\'s repo — the way to contribute to open-source projects.'),
    ord('Order the typical team workflow.', ['git switch -c fix-bug', 'Commit your changes', 'git push -u origin fix-bug', 'Open a pull request on GitHub', 'Teammate reviews and merges it'], 'Branch → commit → push → PR → review & merge.', 'text'),
    ex('.gitignore', 'Some files should **never** be committed: passwords and API keys, `.env` files, huge folders like `node_modules/`, and editor junk.\n\nList them in a file named **`.gitignore`**:\n\n```text\n.env\nnode_modules/\n*.log\n```', 'Accidentally pushed a password? Change the password right away — removing it from Git history isn\'t enough, because others may have copied it.'),
    mcT('Which file should you put in .gitignore?', ['README.md', 'main.py', '.env (it holds secret keys)', 'index.html'], 2, 'Secrets never go into a repository.'),
  ],

  // ------------------------------------------------------------------ tl-3-editor
  'tl-3-editor': [
    ex('Your code editor', 'Programmers write code in an **editor**. The most popular free one is **Visual Studio Code (VS Code)**.\n\nWhat makes an editor better than a plain text app:\n\n- **Syntax highlighting** — colors for keywords, strings, numbers\n- **Autocomplete** — suggests names as you type\n- **Error squiggles** — underlines mistakes before you run\n- **Extensions** — add support for any language (install the *Python* extension first)\n- **Integrated terminal** — a terminal right inside the editor'),
    ex('Shortcuts worth learning', '| Action | Windows / Linux | Mac |\n|---|---|---|\n| Open any file by name | Ctrl+P | Cmd+P |\n| Command palette | Ctrl+Shift+P | Cmd+Shift+P |\n| Toggle terminal | Ctrl+` | Ctrl+` |\n| Find in all files | Ctrl+Shift+F | Cmd+Shift+F |\n| Comment out a line | Ctrl+/ | Cmd+/ |'),
    mcT('What\'s the first thing to install in VS Code for Python?', ['A theme', 'The Python extension', 'A game', 'Nothing — it can\'t run Python'], 1, 'The Python extension adds running, debugging and autocomplete.'),
    ex('The debugger', 'Instead of sprinkling `print()` everywhere, a **debugger** lets you pause the program and look inside:\n\n- **Breakpoint** — click left of a line number; the program pauses there\n- **Step over** — run the next line\n- **Step into** — go inside a function call\n- **Variables panel** — see every variable\'s current value\n\nIt\'s like the trace tables from Foundations, done for you.'),
    mcT('A breakpoint…', ['Deletes a line', 'Pauses the program at that line so you can inspect it', 'Makes the program faster', 'Marks a syntax error'], 1, 'Breakpoints let you freeze time and look around.'),
    mcT('Which shortcut comments out the current line in VS Code (Windows)?', ['Ctrl+/', 'Ctrl+C', 'Ctrl+Z', 'Alt+F4'], 0, 'Ctrl+/ (Cmd+/ on Mac) toggles a comment.'),
  ],

  // ------------------------------------------------------------------ tl-3-packages
  'tl-3-packages': [
    ex('Don\'t reinvent the wheel', 'A **package** (or *library*) is code someone else wrote that you can install and use. A **package manager** downloads and installs them:\n\n- **pip** for Python: `pip install requests`\n- **npm** for JavaScript: `npm install lodash`\n\nThere are hundreds of thousands of free packages on PyPI (Python) and npm (JavaScript).'),
    mcT('Which tool installs Python packages?', ['npm', 'pip', 'git', 'cd'], 1, 'pip is Python\'s package installer.'),
    ex('Listing what a project needs', 'Projects record their packages so anyone can install the same ones:\n\n- Python: **`requirements.txt`**, installed with `pip install -r requirements.txt`\n- JavaScript: **`package.json`**, installed with `npm install`\n\nThat\'s why you can clone a project and get it running with one command.'),
    mcT('You clone a JavaScript project with a package.json. What do you run first?', ['npm install', 'pip install', 'git push', 'rm package.json'], 0, 'npm install reads package.json and downloads everything listed.'),
    mcT('A teammate\'s Python project has requirements.txt. How do you install everything in it?', ['pip install requirements.txt', 'pip install -r requirements.txt', 'npm install', 'python requirements.txt'], 1, '-r means "read the list from this file".'),
    mcT('Before installing a package from the internet, you should…', ['Install anything with a cool name', 'Check it\'s popular, maintained and spelled correctly (fake look-alike packages exist)', 'Never use packages'], 1, 'Attackers publish packages with names like popular ones ("typosquatting"). A quick check keeps you safe.'),
  ],

  // ------------------------------------------------------------------ tl-3-venv
  'tl-3-venv': [
    ex('The version clash problem', 'Project A needs version 1 of a package; project B needs version 2. If both install into the same global Python, one breaks.\n\nA **virtual environment** gives each project its **own private set of packages**.'),
    ex('Using venv', '```text\npython -m venv .venv            # create one (once per project)\nsource .venv/bin/activate       # turn it on (Mac/Linux)\n.venv\\Scripts\\activate          # turn it on (Windows)\npip install requests            # installs into .venv only\npip freeze > requirements.txt   # record exact versions\ndeactivate                      # turn it off\n```\n\nWhen it\'s active, your prompt usually starts with `(.venv)`.', 'Add .venv/ to .gitignore — teammates recreate it from requirements.txt.'),
    mcT('Why use a virtual environment?', ['To make Python faster', 'To keep each project\'s packages separate so they don\'t clash', 'To hide your code'], 1, 'Each project gets its own isolated packages.'),
    mcT('Which command creates a virtual environment named .venv?', ['pip install venv', 'python -m venv .venv', 'git venv', 'npm venv'], 1, 'python -m venv runs the built-in venv module.'),
    mcT('How do you know a virtual environment is active?', ['The computer restarts', 'The prompt usually shows (.venv)', 'Python stops working'], 1, 'Most shells show the environment name at the start of the prompt.'),
    mcT('Should the .venv folder be committed to Git?', ['Yes, always', 'No — add it to .gitignore and share requirements.txt instead'], 1, 'Environments are large and machine-specific; requirements.txt is enough to recreate one.'),
  ],
};

export const checkpoints: Record<string, Checkpoint> = {
  'tl-1': {
    passScore: 0.8, hearts: 3,
    questions: [
      mcT('Which command shows the folder you\'re in?', ['ls', 'pwd', 'cd', 'cat'], 1, 'pwd = print working directory.'),
      mcT('Which shows hidden files?', ['ls -a', 'ls -h', 'cat -a', 'pwd -a'], 0, '-a = all.'),
      term({ prompt: 'Go into the `photos` folder inside `documents`.', setup: { dirs: ['documents/photos'] }, goal: { cwd: '~/documents/photos' }, solution: ['cd documents/photos'] }),
      term({ prompt: 'Create a folder called `notes` containing an empty file `today.txt`.', goal: { files: ['~/notes/today.txt'] }, solution: ['mkdir notes', 'touch notes/today.txt'] }),
      term({ prompt: 'Rename `a.txt` to `b.txt`.', setup: { files: { 'a.txt': 'hello\n' } }, goal: { files: ['~/b.txt'], missing: ['~/a.txt'], contains: { '~/b.txt': 'hello' } }, solution: ['mv a.txt b.txt'] }),
      term({ prompt: 'Save the number of lines in `list.txt` that contain `apple` into `n.txt` (just the number).', setup: { files: { 'list.txt': 'apple pie\nbanana\ngreen apple\ncherry\n' } }, goal: { equals: { '~/n.txt': '2' } }, solution: ['grep apple list.txt | wc -l > n.txt'] }),
      mcT('Which deletes a folder and everything inside it?', ['rm folder', 'rmdir folder', 'rm -r folder', 'del folder'], 2, 'rm -r (careful!).'),
      mcT('What does | do?', ['Saves output to a file', 'Sends one command\'s output into the next command', 'Deletes output'], 1, 'Pipes chain commands.'),
    ],
  },
  'tl-2': {
    passScore: 0.8, hearts: 3,
    questions: [
      mcT('Which command starts tracking a folder with Git?', ['git start', 'git init', 'git new', 'git clone'], 1, 'git init.'),
      ord('Order: save a change with Git.', ['git status', 'git add file.py', 'git commit -m "msg"'], 'Check, stage, commit.', 'text'),
      mcT('What does git push do?', ['Downloads commits', 'Uploads your commits to the remote', 'Deletes a branch'], 1, 'push = up.'),
      mcT('What does git pull do?', ['Uploads commits', 'Downloads and merges others\' commits', 'Creates a branch'], 1, 'pull = down.'),
      fillT('Switch back to the main branch.', 'git ___ main', [['switch', 'checkout']], 'git switch main (or the older git checkout main).', ['switch', 'go', 'branch', 'move']),
      mcT('What is a pull request?', ['A request to download code', 'A proposal to merge your branch, with review', 'A Git error'], 1, 'PRs are how teams review changes.'),
      mcT('Which should be in .gitignore?', ['README.md', 'node_modules/', 'main.py'], 1, 'Big generated folders and secrets.'),
      mcT('Two branches changed the same line. What happens on merge?', ['Git deletes both', 'A merge conflict you resolve by hand', 'Git picks one at random'], 1, 'You decide what to keep.'),
    ],
  },
  'tl-3': {
    passScore: 0.8, hearts: 3,
    questions: [
      mcT('What does a debugger breakpoint do?', ['Pauses the program at a line', 'Deletes the line', 'Fixes the bug'], 0, 'Pause and inspect.'),
      mcT('Python\'s package installer is…', ['npm', 'pip', 'brew'], 1, 'pip.'),
      mcT('JavaScript projects list their packages in…', ['requirements.txt', 'package.json', '.gitignore'], 1, 'package.json.'),
      mcT('Install everything in requirements.txt:', ['pip install -r requirements.txt', 'pip requirements.txt', 'npm install'], 0, '-r reads the list.'),
      mcT('Create a virtual environment:', ['python -m venv .venv', 'pip venv', 'git venv'], 0, 'python -m venv .venv.'),
      mcT('Why use virtual environments?', ['Separate packages per project', 'Faster internet', 'Required for Git'], 0, 'Isolation.'),
      mcT('Record exact installed versions:', ['pip freeze > requirements.txt', 'pip save', 'git freeze'], 0, 'pip freeze lists them.'),
    ],
  },
};

export const finalExams: Record<string, Checkpoint> = {
  tools: {
    passScore: 0.8, hearts: 3,
    questions: [
      mcT('`~` means…', ['the root folder', 'your home folder', 'the current folder'], 1, 'Home.'),
      ansT('You\'re in /home/ada/a/b. Where does `cd ..` take you? (full path)', ['/home/ada/a', '/home/ada/a/'], 'Up one level.'),
      term({ prompt: 'Make a folder `backup` and copy `report.txt` into it.', setup: { files: { 'report.txt': 'Q3\n' } }, goal: { files: ['~/backup/report.txt', '~/report.txt'] }, solution: ['mkdir backup', 'cp report.txt backup/'] }),
      term({ prompt: 'Add the line `milk` to the END of `shopping.txt` without erasing what\'s there.', setup: { files: { 'shopping.txt': 'eggs\nbread\n' } }, goal: { equals: { '~/shopping.txt': 'eggs\nbread\nmilk' } }, solution: ['echo milk >> shopping.txt'] }),
      term({ prompt: 'Save the WARN lines from `server.log` into `warnings.txt`.', setup: { files: { 'server.log': 'INFO ok\nWARN disk 80%\nINFO ok\nWARN disk 90%\n' } }, goal: { equals: { '~/warnings.txt': 'WARN disk 80%\nWARN disk 90%' } }, solution: ['grep WARN server.log > warnings.txt'] }),
      mcT('Which saves a snapshot in Git?', ['git add', 'git commit', 'git status'], 1, 'commit.'),
      mcT('What\'s the staging area for?', ['Choosing which changes go into the next commit', 'Storing passwords', 'Running code'], 0, 'Staging.'),
      mcT('Create and switch to a branch:', ['git switch -c name', 'git merge name', 'git push name'], 0, 'switch -c.'),
      mcT('Download a repo from GitHub:', ['git clone <url>', 'git pull <url>', 'git get <url>'], 0, 'clone.'),
      mcT('Secrets like API keys belong…', ['in your commits', 'in .env, listed in .gitignore'], 1, 'Never commit secrets.'),
      mcT('Each project\'s own packages live in a…', ['virtual environment', 'branch', 'commit'], 0, 'venv.'),
    ],
  },
};
