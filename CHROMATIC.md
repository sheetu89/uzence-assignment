Steps to publish Storybook to Chromatic

1) Get your Chromatic project token from https://www.chromatic.com

2) Set the token in your shell (PowerShell example):

```powershell
$env:CHROMATIC_PROJECT_TOKEN = "<your-token>"
```

Or in bash/cmd:

```bash
export CHROMATIC_PROJECT_TOKEN="<your-token>"
```

3) From project root, run:

```bash
npm run chromatic
```

Notes:
- `npm run chromatic` uses the `build-storybook` script and uploads the static build to Chromatic.
- Chromatic will return a public share URL after a successful upload; open it in an incognito window to verify stories are visible without login.
- If you prefer Vercel, run `npm run build-storybook` and deploy the generated `storybook-static/` directory.
