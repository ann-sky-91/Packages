/* eslint-disable @typescript-eslint/explicit-function-return-type */
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')

const tsnode = require('ts-node')

const name = process.argv[2]

if (name == null || name === '') {
    // eslint-disable-next-line no-console
    console.error('missing app name')
    return
}

let existsTsx = fs.existsSync(path.resolve(name, 'index.tsx'))
let existsTs = fs.existsSync(path.resolve(name, 'index.ts'))
if (!existsTsx && !existsTs) {
    // eslint-disable-next-line no-console
    console.error('missing entry')
    return
}

run(
    path.relative(
        process.cwd(),
        existsTsx ? path.resolve(name, 'index.tsx') : path.resolve(name, 'index.ts')
    ),
    process.argv.slice(3).join(' ')
)

function run(scriptPath, args) {
    child_process.execSync(
        `node -r ts-node/register -r tsconfig-paths/register\
            --expose-gc --max-old-space-size=8192\
            ${scriptPath} ${args}`,
        {
            stdio: 'inherit',
            stdout: 'inherit',
            stdin: 'inherit',
            env: {
                TS_NODE_TRANSPILE_ONLY: 'true',
            },
        }
    )
}
