# NPM Release GitHub Action

This GitHub workflow actions simplifies the release of new versions.

## Scope

- ✅ NPM release
- ✅ GitHub release 
- ✅ GitHub release change note

## Usage

1. Create an NPM access token for automatisation.
2. Add this token as action secret to the GitHub repository.
3. Create a workflow file `.github/workflows/release.yml`:

```yml
on:
  push:
    branches:
      - main
jobs:
  release:
    runs-on: ubuntu-latest
    permissions: write-all    
    steps:        
      - uses: actions/checkout@v4
      - run: npm ci
      - run: scriptpilot/github-action-npm-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

4. Increase the version in the `package.json` file.
5. Commit and push the change to the repository.

## Development

For this repository:

- apply changes with link to an issue
- run `npm version patch | minor | major`

This will run the `test` and `build` script, commit the `dist` folder and increase the package version.
