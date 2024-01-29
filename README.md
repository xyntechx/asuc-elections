# ASUC Tabulator
Calculate and visualize ASUC election results

## 🚀 Commands
Run locally
```bash
pnpm i
pnpm run dev
```

Build app
```bash
pnpm run build
```

## 📚 Notes
The election results are recorded in a `.csv` file. We must convert this `.csv` file into a `.json` file, name it `votes.json`, and place it in the `/public` folder. Use any online tool to convert this `.csv` file into `.json` (e.g. https://csvjson.com/csv2json); however, we must first remove the first column in the `.csv` file due to its empty head.
