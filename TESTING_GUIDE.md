# BlinkForm Action Chaining - Testing Guide

## ✅ What Was Fixed

The **"Transaction Trap"** has been resolved. Previously, every form step required a blockchain transaction signature, causing forms to freeze if users rejected the wallet popup. Now:

- ✅ **Intermediate steps** advance instantly without wallet popups
- ✅ **Only the final step** requires a transaction signature
- ✅ Forms work correctly in Dialect Blink Inspector
- ✅ Proper Action Chaining with `PostResponse` → `links.next` callback

---

## 🔧 Files Changed

### Created:
- `backend/src/actions/dto/action-response.dto.ts` - Type definitions for Solana Actions v2.x

### Modified:
- `backend/src/actions/actions.service.ts` - Fixed Transaction Trap, added `getNextAction()`
- `backend/src/actions/actions.controller.ts` - Added `/next` callback endpoint
- `backend/src/schema-parser/schema-parser.service.ts` - Added `requiresTransaction` flag
- `backend/.env` - Added `BASE_URL` configuration
- `backend/.env.example` - Documented `BASE_URL`

---

## 🧪 Testing Instructions

### Step 1: Install Dependencies (if needed)

```bash
cd backend
npm install
```

### Step 2: Start the Backend

```bash
npm run start:dev
```

You should see:
```
[Nest] 12345  - LOG [NestFactory] Starting Nest application...
[Nest] 12345  - LOG [NestApplication] Nest application successfully started
```

### Step 3: Set Up Ngrok for HTTPS

Dialect Blink Inspector requires HTTPS. Install and run Ngrok:

```bash
# Install ngrok (if not installed)
# Download from: https://ngrok.com/download
# Or via package manager:
# - Ubuntu: snap install ngrok
# - Mac: brew install ngrok

# Run ngrok to create HTTPS tunnel
ngrok http 3000
```

**Expected output:**
```
Session Status                online
Forwarding                    https://abc123-xyz.ngrok-free.app -> http://localhost:3000
```

**Copy the HTTPS URL** (e.g., `https://abc123-xyz.ngrok-free.app`)

### Step 4: Update Environment Variable

Edit `backend/.env`:

```env
BASE_URL=https://abc123-xyz.ngrok-free.app  # ← Use YOUR ngrok URL
```

**IMPORTANT:** Restart the backend server after changing `.env`:

```bash
# Press Ctrl+C to stop the server
npm run start:dev  # Start again
```

---

## 🔍 Testing with Dialect Blink Inspector

### 1. Create a Test Form

First, create a multi-step form using the API or database. Example schema:

```json
{
  "nodes": [
    {
      "id": "start",
      "type": "question",
      "data": {
        "questionText": "What is your name?",
        "questionType": "input",
        "validation": { "required": true }
      }
    },
    {
      "id": "email",
      "type": "question",
      "data": {
        "questionText": "What is your email?",
        "questionType": "input",
        "validation": { "required": true }
      }
    },
    {
      "id": "plan",
      "type": "question",
      "data": {
        "questionText": "Choose your plan",
        "questionType": "choice",
        "options": [
          { "label": "Basic", "value": "basic" },
          { "label": "Pro", "value": "pro" }
        ]
      }
    },
    {
      "id": "end",
      "type": "end",
      "data": { "message": "Thank you!" }
    }
  ],
  "edges": [
    { "id": "e1", "source": "start", "target": "email" },
    { "id": "e2", "source": "email", "target": "plan" },
    { "id": "e3", "source": "plan", "target": "end" }
  ]
}
```

### 2. Open Dialect Blink Inspector

1. Go to: **https://dial.to/inspector**
2. Paste your Ngrok URL + form ID:
   ```
   https://abc123-xyz.ngrok-free.app/api/actions/YOUR_FORM_ID
   ```
   Replace `YOUR_FORM_ID` with an actual form ID from your database
3. Click **"Inspect"**

### 3. Test the Multi-Step Flow

#### ✅ Expected Behavior:

**Step 1 - Name Input:**
- Question: "What is your name?"
- Type your name (e.g., "Alice")
- Click "Continue"
- **NO wallet popup appears** ✅
- Form advances immediately to next question ✅

**Step 2 - Email Input:**
- Question: "What is your email?"
- Type your email (e.g., "alice@example.com")
- Click "Continue"
- **NO wallet popup appears** ✅
- Form advances immediately to next question ✅

**Step 3 - Plan Choice:**
- Question: "Choose your plan"
- Select "Basic" or "Pro"
- Click "Continue"
- **NO wallet popup appears** ✅
- Form advances to final step ✅

**Step 4 - Final Submission:**
- **Wallet popup appears** (Phantom/Backpack) ✅
- Sign the transaction to submit form on-chain ✅
- Success message: "Form completed! Thank you for your submission." ✅

---

## 🐛 Troubleshooting

### Issue 1: Form Gets Stuck After First Question

**Symptom:** Clicking "Continue" does nothing, no error shown

**Debug Steps:**

1. Open browser DevTools (F12) → **Network** tab
2. Submit the first answer
3. Look for the POST request to `/api/actions/YOUR_FORM_ID`
4. Check the **Response** body:

**✅ Correct Response (intermediate step):**
```json
{
  "type": "post",
  "message": "Answer recorded: \"Alice\"",
  "links": {
    "next": {
      "type": "post",
      "href": "https://abc123.ngrok-free.app/api/actions/YOUR_FORM_ID/next?account=...&formId=..."
    }
  }
}
```

**❌ Incorrect Response (has transaction):**
```json
{
  "transaction": "base64-string-here...",  // ← Should NOT appear for intermediate steps
  "message": "Answer recorded!",
  "links": { ... }
}
```

If you see `transaction` field on intermediate steps, the fix didn't apply correctly.

**Solution:**
- Verify `backend/.env` has `BASE_URL` set to your Ngrok URL
- Restart the backend server: `npm run start:dev`
- Clear browser cache and refresh Dialect Inspector

---

### Issue 2: CORS Error

**Symptom:** Browser console shows:
```
Access to fetch at '...' from origin 'https://dial.to' has been blocked by CORS policy
```

**Solution:**

1. Check that all endpoints have CORS headers:
   ```bash
   curl -X OPTIONS https://abc123.ngrok-free.app/api/actions/YOUR_FORM_ID/next -v
   ```

   Should return:
   ```
   < HTTP/1.1 200 OK
   < Access-Control-Allow-Origin: *
   < Access-Control-Allow-Methods: GET,POST,PUT,OPTIONS
   ```

2. If headers are missing, verify the backend server restarted after code changes

---

### Issue 3: Session Expired Error

**Symptom:** Clicking "Continue" shows error: "Session expired or invalid"

**Cause:** Redis session cleared or expired (1 hour TTL)

**Solution:**
- Start the form from the beginning (refresh Dialect Inspector)
- Check Redis connection in logs:
  ```bash
  # In backend terminal, look for:
  [Redis] Successfully connected to Upstash Redis
  ```

---

### Issue 4: 404 on /next Endpoint

**Symptom:** Network tab shows `404 Not Found` for `/api/actions/YOUR_FORM_ID/next`

**Solution:**
- Verify the endpoint was added to `actions.controller.ts`
- Rebuild the backend: `npm run build`
- Restart: `npm run start:dev`

---

## 📊 Verify Response Types in Network Tab

Open DevTools → Network tab and check:

| Request | Expected Response Type | Should Have `transaction` Field? |
|---------|----------------------|----------------------------------|
| POST `/api/actions/:formId` (Step 1) | `type: "post"` | ❌ No |
| POST `/api/actions/:formId` (Step 2) | `type: "post"` | ❌ No |
| POST `/api/actions/:formId` (Step 3) | `type: "post"` | ❌ No |
| POST `/api/actions/:formId` (Final) | No `type` field | ✅ Yes (base64) |
| POST `/api/actions/:formId/next` | `type: "action"` | ❌ No |

---

## 🎯 Success Criteria

After testing, you should verify:

- [ ] Multi-step forms advance smoothly without requiring transaction signatures for each step
- [ ] Only the final submission requires a wallet signature
- [ ] Forms work correctly in Dialect Blink Inspector with Ngrok
- [ ] No "freezing" or "stuck" behavior when clicking buttons
- [ ] All responses have proper CORS headers (`Access-Control-Allow-Origin: *`)
- [ ] State persists across steps (answers are remembered)
- [ ] User can reject final transaction without breaking the form (shows error, doesn't freeze)
- [ ] Backend logs show `[Actions POST] Is final step: false` for intermediate steps
- [ ] Backend logs show `[Actions POST] Is final step: true` for final step

---

## 📝 Notes

### For Development:
- Use `BASE_URL=http://localhost:3000` when testing locally without Dialect
- Use `BASE_URL=https://your-ngrok-url.ngrok-free.app` for Dialect testing

### For Production:
- Update `BASE_URL=https://api.blinkform.com` (or your production domain)
- Ensure production Redis (Upstash) is configured
- Test with real Solana wallets on devnet before mainnet

### Transaction Flag:
To force a transaction on a specific mid-flow step (e.g., payment), add to schema:
```json
{
  "id": "payment",
  "type": "question",
  "data": { ... },
  "requiresTransaction": true  // ← Forces TransactionResponse for this step
}
```

---

## 🔗 Resources

- [Solana Actions Specification](https://solana.com/developers/guides/advanced/actions)
- [Dialect Blink Inspector](https://dial.to/inspector)
- [Original Diagnosis Document](file://./ActionChainingFixPlan.md)
- [Technical Deep Dive](file://./Blinks%20Typeform%20Não%20Avança.md)

---

## ✅ Checklist Before Reporting Success

- [ ] Backend builds without errors: `npm run build`
- [ ] Backend starts successfully: `npm run start:dev`
- [ ] Ngrok tunnel is active and HTTPS URL is copied
- [ ] `backend/.env` has `BASE_URL` set to Ngrok URL
- [ ] Backend server restarted after `.env` change
- [ ] Dialect Blink Inspector loads the form
- [ ] First question displays correctly
- [ ] Answering first question advances WITHOUT wallet popup
- [ ] Second question displays correctly
- [ ] Answering second question advances WITHOUT wallet popup
- [ ] Final step shows wallet popup for transaction signature
- [ ] Form submission completes successfully
- [ ] Browser DevTools shows `type: "post"` for intermediate steps
- [ ] Browser DevTools shows `transaction` field only for final step

---

**If all checklist items pass, the Action Chaining fix is working correctly! 🎉**
