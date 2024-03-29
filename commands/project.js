#!/usr/bin/env node
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')

const b = '\x1b['
const e = '\x1b[0m'
const purple = '35;1m'

const sdkPath = path.relative(process.cwd(), path.resolve(__dirname, '../'))

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))

const paths = [
    ...(packageJson.localDependencies ?? []).map(dep => `${dep}/*`),
    path.join(sdkPath, '*'),
    path.join(sdkPath, 'includes/*'),
    path.join(sdkPath, 'node_modules/*'),
]
    .map(path => `"${path}"`)
    .join(', ')

const include =
    packageJson.modules && packageJson.modules.length > 0
        ? `"include": [${(packageJson.modules ?? []).map(module => `"${module}"`).join(', ')}],\n`
        : ''

const exclude = [
    'node_modules',
    ...(packageJson.localDependencies ?? []).map(dep => `${dep}/node_modules`),
    path.join(sdkPath, 'node_modules'),
]
    .map(path => `"${path}"`)
    .join(', ')

process.stdout.write(`${b}${purple}install packages${e}\n`)
child_process.execSync(
    `npm i -D\
 eslint eslint-config-prettier\
 eslint-plugin-prettier\
 eslint-plugin-react\
 eslint-plugin-react-hooks\
 @typescript-eslint/eslint-plugin\
 @typescript-eslint/parser\
 prettier\
`,
    { stdio: 'inherit' }
)
process.stdout.write(`\n${b}${purple}install packages${e} 👌\n`)

process.stdout.write(`${b}${purple}rewrite configs${e}`)
fs.writeFileSync(
    path.resolve('tsconfig.json'),
    `{
    "compilerOptions": {
        "lib": ["ES2021", "DOM"],
        "jsx": "react-jsx",
        "module": "ES2022",
        "target": "ES2017",
        "moduleResolution": "node",

        "esModuleInterop": true,

        "typeRoots": [
            "${path.join(sdkPath, 'node_modules/@types')}"
        ],
        "baseUrl": ".",
        "paths": {
            "*": [${paths}],
            ${(packageJson.modules ?? [])
                .map(module => `"${module}/*" : ["${module}/*"]`)
                .join(',\n          ')}
        }
    },
    ${include}
    "exclude": [${exclude}]
}
`
)

process.stdout.write(` 👌\n`)
