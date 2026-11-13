# Deploying to Firebase (one-time setup, ~15 minutes)

You need: a Google account, [Node.js 20+](https://nodejs.org), and this project folder.

## 1. Create the Firebase project
1. Go to https://console.firebase.google.com → **Add project** → name it (e.g. `loopwise`). Analytics optional.
2. **Build → Authentication → Get started.** Enable **Google** and **Email/Password** sign-in.
3. **Build → Firestore Database → Create database** → *production mode* → pick a region near you (e.g. `us-central1`).
4. **Project settings (⚙️) → Your apps → Web (`</>`)** → register an app (no Hosting checkbox needed). Copy the `firebaseConfig` values.

## 2. Connect this code to it
```bash
cp .env.example .env.local        # then paste the six values from firebaseConfig into .env.local
```
Edit `.firebaserc` and replace `YOUR_FIREBASE_PROJECT_ID` with your project id.

## 3. Install, test and deploy
```bash
npm install
npm test                           # should say all tests passed
npm install -g firebase-tools
firebase login
npm run build
firebase deploy                    # uploads the site + security rules
```
Your site is live at `https://<project-id>.web.app`.

## 4. After the first deploy
- **Authentication → Settings → Authorized domains:** your `*.web.app` domain is added automatically. Add any custom domain you connect later.
- Custom domain: **Hosting → Add custom domain**.
- Updating the site later: `npm run build && firebase deploy --only hosting`.

## Costs
Everything above fits Firebase's free **Spark** plan: code runs in each learner's browser, not on your server.
Only the future Java/C/C++ runner needs the pay-as-you-go **Blaze** plan.
