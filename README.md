# Sri Rohith Balaji Metal Crushers — Crusher & Weighbridge Manager

A frontend-only Crusher Production & Weighbridge Management System. Built as a static
single-page app with **React + Vite**, styled with **Tailwind CSS** and **Material UI**,
charted with **Chart.js**, and persisted entirely in the browser's **LocalStorage** —
no backend, no database server, no API keys. Deployable as-is to **GitHub Pages**.

> This is a demo/reference application. All data lives in your browser's LocalStorage;
> clearing site data or switching browsers resets it back to the bundled sample dataset.

## Features

- Responsive industrial dashboard with sidebar navigation, dark/light mode, and global search
- **Dashboard** — today's vehicles, loads, sales, purchases, production, diesel and pending
  payments, plus daily/monthly sales, production and stock charts
- **Customers / Suppliers / Vehicles / Drivers / Products** — full CRUD with search, filter,
  sort, pagination and CSV export
- **Weighbridge** — gross/tare entry with live auto-calculated net weight and a printable
  ticket-style weigh slip
- **Crusher Production** — shift-wise production, diesel consumption and running hours
- **Stock** — opening / production / sales / closing report with a date range filter
- **Sales** — invoices, delivery challans (printable) and a per-customer ledger
- **Purchase** — supplier bills for raw material purchases
- **Expenses** — diesel, salary, maintenance and electricity tracking
- **Reports** — interactive charts, CSV export and print-friendly summary
- **Settings** — company details, logo upload, dark/light theme, demo users, and a
  one-click reset back to sample data

## Tech Stack

| Layer          | Choice                                   |
|----------------|-------------------------------------------|
| Framework      | React 19 + Vite                           |
| Styling        | Tailwind CSS v4 + Material UI (MUI) v9    |
| Routing        | React Router v7 (`HashRouter`)            |
| Charts         | Chart.js via `react-chartjs-2`            |
| Persistence    | Browser `localStorage`                    |
| Initial data   | Static JSON (`src/data/seed.json`)        |

`HashRouter` is used deliberately — it means the app works out of the box on GitHub Pages
without needing a custom 404-redirect trick for client-side routing.

## Project Structure

```
src/
  components/
    layout/       Sidebar, Topbar, page Layout shell
    common/        DataTable, FormDialog, ConfirmDialog, StatCard, ResourceManager, ...
    charts/        Chart.js setup + reusable ChartCard
    print/         Printable weigh slip and invoice/challan documents
  context/
    DataContext.jsx   LocalStorage-backed store, seeded once from seed.json, generic CRUD
    ThemeContext.jsx  Dark/light mode, persisted
  data/
    seed.json      Static sample dataset (dates are relative offsets, resolved on first load)
  pages/           One file per module (Dashboard, Customers, Weighbridge, Reports, ...)
  theme/           MUI theme tokens matching the Tailwind palette
  utils/           storage.js, csv.js, dates.js, id.js
```

`ResourceManager` is a single reusable component that powers every simple master-data CRUD
page (Customers, Suppliers, Vehicles, Drivers, Products, Production, Expenses) from a small
field/column configuration — new modules can reuse it directly.

## Getting Started

```bash
npm install
npm run dev       # start the local dev server
npm run build      # production build into ./dist
npm run preview    # preview the production build locally
```

## Deploying to GitHub Pages

1. **Create a GitHub repository** and push this project to it.

2. **Set the repo name** in two places so asset paths resolve correctly:
   - `vite.config.js` → update the `REPO_NAME` constant
   - `package.json` → update the `homepage` field to
     `https://<your-username>.github.io/<repo-name>`

3. **Enable Pages via GitHub Actions** (recommended — a workflow is already included):
   - Push to the `main` branch.
   - In your repo, go to **Settings → Pages → Build and deployment → Source**, choose
     **GitHub Actions**.
   - The included workflow at `.github/workflows/deploy.yml` will build the app with
     `npm ci && npm run build` and publish `./dist` automatically on every push to `main`.
   - Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

4. **Or deploy manually with the `gh-pages` package** (already installed as a dev
   dependency):
   ```bash
   npm run deploy
   ```
   This runs `npm run build` and pushes the `dist/` folder to a `gh-pages` branch. Then set
   **Settings → Pages → Source** to **Deploy from a branch → `gh-pages` / root**.

Either method works — the GitHub Actions workflow is the more "hands-off" option since it
redeploys automatically on every push.

## Resetting the Demo Data

Go to **Settings → Reset Demo Data** to clear LocalStorage and reload the original sample
dataset at any time — useful after testing CRUD operations.

## Notes & Limitations

- There is no backend, authentication, or multi-user sync — this is a single-browser demo.
  The "Users" list in Settings is illustrative only.
- Stock and ledger figures are computed on the fly from the sales/purchase/production
  records currently in LocalStorage, not stored as separate running balances.
- Because everything is client-side, refreshing after clearing site data (or opening the
  app in a different browser/profile) starts over from the bundled sample dataset.
