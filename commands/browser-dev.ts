#!/usr/bin/env -S npx tsx
import fs from 'fs'
import path from 'path'

import args from 'args'

import __getAppEntries from './__getAppEntries'
import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'

args.option('port', 'The port on which the app will be running', 3000)
args.option('open', 'Open in browser', false)

const flags = args.parse(process.argv, {
    name: 'sky browser dev',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

export namespace browser {
    dev()

    export async function dev(): Promise<void> {
        const name = process.argv[4]

        if (name == null || name === '') {
            // eslint-disable-next-line no-console
            console.error('missing app name')
            // eslint-disable-next-line
            return
        }

        const skyConfig = __loadSkyConfig()

        if (!skyConfig) {
            return
        }

        const skyAppConfig = __getAppConfig(name, skyConfig)

        if (!skyAppConfig) {
            return
        }

        const entries = __getAppEntries(skyAppConfig)

        const folder = `.sky/${skyAppConfig.name}/browser-dev`
        fs.rmSync(folder, { recursive: true, force: true })
        fs.mkdirSync(folder, { recursive: true })
        fs.writeFileSync(
            path.join(folder, 'config.json'),
            JSON.stringify(
                {
                    open: flags.open,
                    port: flags.port,
                    public: skyAppConfig.public,
                    entries,
                },
                null,
                4
            ),
            'utf-8'
        )
    }
}
