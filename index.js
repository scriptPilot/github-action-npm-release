import shell from 'shelljs'
import fs from 'fs-extra'
import fetch from 'node-fetch'

// Read the package version
console.logg(process.env)
const packageJson = fs.readJsonSync(`./package.json')
console.log(`Version in package.json file: ${packageJson.version}`)

// Read all NPM versions
if (process.env.NPM_TOKEN) {
  const npmResp = await fetch(`https://registry.npmjs.org/${packageJson.name}`)
  const npmJson = await npmResp.json()
  const npmVersions = Object.keys(npmJson.versions)
  console.log(`Versions in NPM repository:`, npmVersions)
}

// Exit the script if the package version is already published on NPM
if (process.env.NPM_TOKEN && npmVersions.includes(packageJson.version)) {
  console.log(`Version ${packageJson.version} already published to NPM.`)
  process.exit(0)
}

// Run the test script
if (shell.exec('npm run test').code !== 0) process.exit(1)

// Run the build script
if (shell.exec('npm run build').code !== 0) process.exit(1)

// Create a Git tag
if (shell.exec(`git tag "v${packageJson.version}"`).code !== 0) process.exit(1)
if (shell.exec(`git push origin "v${packageJson.version}"`).code !== 0) process.exit(1)

// Publish to NPM
if (process.env.NPM_TOKEN) {
  fs.writeFileSync('.npmrc', `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`)
  if (shell.exec('npm publish --access public').code !== 0) process.exit(1)
}

// Create a GitHub release
if (shell.exec(`gh release create "v${packageJson.version}"`).code !== 0) process.exit(1)

// Update the GitHub release notes
if (shell.exec(`cd ./node_modules/github-release-notes && npm link`).code !== 0) process.exit(1)
if (shell.exec(`gren release --tags "v${packageJson.version}" \
                --token "${process.env.GITHUB_TOKEN}" --override`).code !== 0) process.exit(1)