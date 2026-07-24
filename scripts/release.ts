import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageJsonPath = resolve(rootDir, 'package.json')

type ReleaseType = 'major' | 'minor' | 'patch'

const releaseTypes: ReleaseType[] = ['major', 'minor', 'patch']
const semverPattern = /^(\d+)\.(\d+)\.(\d+)$/

function git(args: string[]): string {
  return execFileSync('git', args, { cwd: rootDir, encoding: 'utf8' }).trim()
}

function fail(message: string): never {
  console.error(`✖ ${message}`)
  process.exit(1)
}

function parseArgs() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const allowDirty = args.includes('--allow-dirty')
  const positional = args.filter(arg => !arg.startsWith('--'))

  if (positional.length !== 1) {
    fail('usage: pnpm release <major|minor|patch|x.y.z> [--dry-run] [--allow-dirty]')
  }

  return { target: positional[0]!, dryRun, allowDirty }
}

function bump(current: string, target: string): string {
  if (semverPattern.test(target)) return target

  if (!releaseTypes.includes(target as ReleaseType)) {
    fail(`invalid version or release type: "${target}" (expected major, minor, patch or x.y.z)`)
  }

  const match = semverPattern.exec(current)
  if (!match) fail(`package.json version is not valid semver: "${current}"`)

  const [major, minor, patch] = [Number(match[1]), Number(match[2]), Number(match[3])]

  switch (target as ReleaseType) {
    case 'major': return `${major + 1}.0.0`
    case 'minor': return `${major}.${minor + 1}.0`
    case 'patch': return `${major}.${minor}.${patch + 1}`
  }
}

function compare(a: string, b: string): number {
  const pa = semverPattern.exec(a)!.slice(1).map(Number)
  const pb = semverPattern.exec(b)!.slice(1).map(Number)
  for (let i = 0; i < 3; i++) {
    if (pa[i]! !== pb[i]!) return pa[i]! - pb[i]!
  }
  return 0
}

function main() {
  const { target, dryRun, allowDirty } = parseArgs()

  const raw = readFileSync(packageJsonPath, 'utf8')
  const currentVersion = (JSON.parse(raw) as { version?: string }).version
  if (!currentVersion) fail('package.json has no "version" field')

  const nextVersion = bump(currentVersion, target)
  const tag = `v${nextVersion}`

  if (compare(nextVersion, currentVersion) <= 0) {
    fail(`${nextVersion} is not greater than the current version ${currentVersion}`)
  }

  const status = git(['status', '--porcelain'])
  if (status && !allowDirty) {
    fail('working tree is not clean — commit or stash your changes first (--allow-dirty to override)')
  }

  const existingTags = git(['tag', '--list', tag])
  if (existingTags) fail(`tag ${tag} already exists`)

  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'])
  const commitMessage = `chore: bump version to ${nextVersion}`

  console.log(`branch:  ${branch}`)
  console.log(`version: ${currentVersion} → ${nextVersion}`)
  console.log(`commit:  ${commitMessage}`)
  console.log(`tag:     ${tag}`)

  if (dryRun) {
    console.log('\n(dry run — nothing was changed)')
    return
  }

  const updated = raw.replace(
    /(^\s*"version"\s*:\s*")[^"]+(")/m,
    `$1${nextVersion}$2`,
  )
  if (updated === raw) fail('could not rewrite the "version" field in package.json')
  writeFileSync(packageJsonPath, updated)

  try {
    git(['add', packageJsonPath])
    git(['commit', '-m', commitMessage])
    git(['tag', '-a', tag, '-m', tag])
  }
  catch (error) {
    writeFileSync(packageJsonPath, raw)
    fail(`git command failed: ${(error as Error).message}`)
  }

  console.log(`\n✔ ${tag} ready. Push it with:\n  git push origin ${branch} --follow-tags`)
}

main()
