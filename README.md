# OrangeHRM E2E Playwright Test Suite

End-to-end automated tests for [OrangeHRM](https://opensource-demo.orangehrmlive.com) using [Playwright](https://playwright.dev/) and JavaScript.

---

## 📋 Test Coverage

| Module             | File                     | Test Cases |
|--------------------|--------------------------|------------|
| Authentication     | `tests/auth.spec.js`     | TC-AUTH-01 to TC-AUTH-05 |
| Dashboard          | `tests/dashboard.spec.js`| TC-DASH-01 to TC-DASH-05 |
| PIM / Employees    | `tests/pim.spec.js`      | TC-PIM-01 to TC-PIM-08   |
| Leave Management   | `tests/leave.spec.js`    | TC-LEAVE-01 to TC-LEAVE-07 |
| Recruitment        | `tests/recruitment.spec.js` | TC-REC-01 to TC-REC-07 |
| Performance        | `tests/performance.spec.js` | TC-PERF-01 to TC-PERF-06 |
| Admin              | `tests/admin.spec.js`    | TC-ADM-01 to TC-ADM-08  |
| My Info            | `tests/myinfo.spec.js`   | TC-INFO-01 to TC-INFO-05 |
| Directory & Buzz   | `tests/directory.spec.js`| TC-DIR-01 to TC-DIR-04 + TC-BUZZ-01 to TC-BUZZ-03 |
| Time & Attendance  | `tests/time.spec.js`     | TC-TIME-01 to TC-TIME-05 |

**Total: 53 test cases**

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v16 or later
- npm

### 1. Install Dependencies

```bash
npm install
npx playwright install
```

### 2. Run All Tests

```bash
npm test
```

### 3. Run Tests with Browser UI (headed)

```bash
npm run test:headed
```

### 4. Run Playwright Interactive UI

```bash
npm run test:ui
```

### 5. Run a Specific Module

```bash
npm run test:login        # Auth tests only
npm run test:employees    # PIM tests only
npm run test:leave        # Leave tests only
npm run test:recruitment  # Recruitment tests only
npm run test:performance  # Performance tests only
npm run test:admin        # Admin tests only
npm run test:dashboard    # Dashboard tests only
```

### 6. View HTML Report

```bash
npm run test:report
```

---

## 🗂️ Project Structure

```
orangehrm-e2e/
├── tests/
│   ├── auth.setup.js         # Saves login session (runs once)
│   ├── auth.spec.js          # Login/logout tests
│   ├── dashboard.spec.js     # Dashboard tests
│   ├── pim.spec.js           # Employee management tests
│   ├── leave.spec.js         # Leave management tests
│   ├── recruitment.spec.js   # Recruitment tests
│   ├── performance.spec.js   # Performance management tests
│   ├── admin.spec.js         # Admin module tests
│   ├── myinfo.spec.js        # My Info / Profile tests
│   ├── directory.spec.js     # Directory & Buzz tests
│   └── time.spec.js          # Time & Attendance tests
├── utils/
│   ├── constants.js          # URLs, credentials, test data
│   └── helpers.js            # Shared helper functions
├── playwright/
│   └── .auth/
│       └── admin.json        # Saved auth session (auto-generated)
├── playwright.config.js      # Playwright configuration
├── package.json
└── README.md
```

---

## ⚙️ Configuration

All configuration is in `playwright.config.js`:

| Setting       | Value                                            |
|---------------|--------------------------------------------------|
| Base URL      | `https://opensource-demo.orangehrmlive.com`      |
| Browsers      | Chromium, Firefox                                |
| Timeout       | 60s per test                                     |
| Retries       | 1 (local) / 2 (CI)                               |
| Reports       | HTML + JSON                                      |
| Screenshots   | On failure only                                  |
| Video         | On first retry                                   |

---

## 🔐 Credentials

The demo site uses publicly known credentials:

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | Admin    | admin123  |

> ⚠️ These are public demo credentials from the OrangeHRM open-source demo. Do not use real credentials.

---

## 💡 Key Design Decisions

- **Session reuse**: `auth.setup.js` logs in once and saves the browser state. All subsequent tests reuse this session — faster and more reliable.
- **Sequential execution**: Tests run sequentially (`workers: 1`) to avoid conflicts on the shared demo site.
- **Resilient selectors**: Uses OrangeHRM's own CSS class patterns (`.oxd-*`, `.orangehrm-*`) for stable element targeting.
- **Graceful assertions**: For search results, tests handle both "found" and "no records" states to avoid brittle tests on a shared environment.
