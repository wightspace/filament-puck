import esbuild from 'esbuild'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { createRequire } from 'module'
import { dirname } from 'path'

const require = createRequire(import.meta.url)
const processBrowserPath = require.resolve('process/browser.js')

const isDev = process.argv.includes('--dev')

async function compile(options) {
    const context = await esbuild.context(options)

    if (isDev) {
        await context.watch()
    } else {
        await context.rebuild()
        await context.dispose()
    }
}

const nodeEnv = isDev ? 'development' : 'production'

const defaultOptions = {
    define: {
        'process.env.NODE_ENV': `'${nodeEnv}'`,
        global: 'globalThis',
        process: 'globalThis.process',
    },
    banner: {
        js: [
            'globalThis.global = globalThis.global ?? globalThis;',
            `globalThis.process = globalThis.process ?? { env: { NODE_ENV: '${nodeEnv}' }, browser: true, version: '', nextTick: (fn) => queueMicrotask(fn) };`,
        ].join('\n'),
    },
    bundle: true,
    format: 'esm',
    mainFields: ['browser', 'module', 'main'],
    platform: 'browser',
    sourcemap: isDev ? 'inline' : false,
    sourcesContent: isDev,
    treeShaking: true,
    target: ['es2020'],
    minify: !isDev,
    jsx: 'automatic',
    loader: {
        '.jsx': 'jsx',
        '.css': 'empty',
    },
    alias: {
        buffer: 'buffer',
        stream: 'stream-browserify',
        events: 'events',
        util: 'util',
        process: processBrowserPath,
    },
    inject: ['./resources/js/shims/node-globals.js'],
    plugins: [
        {
            name: 'watchPlugin',
            setup: function (build) {
                build.onStart(() => {
                    console.log(
                        `Build started at ${new Date(Date.now()).toLocaleTimeString()}: ${build.initialOptions.outfile}`,
                    )
                })

                build.onEnd((result) => {
                    if (result.errors.length > 0) {
                        console.log(
                            `Build failed at ${new Date(Date.now()).toLocaleTimeString()}: ${build.initialOptions.outfile}`,
                            result.errors,
                        )
                    } else {
                        console.log(
                            `Build finished at ${new Date(Date.now()).toLocaleTimeString()}: ${build.initialOptions.outfile}`,
                        )
                    }
                })
            },
        },
    ],
}

mkdirSync('./resources/dist/components', { recursive: true })

writeFileSync(
    './resources/dist/puck-editor.css',
    [
        readFileSync('./node_modules/@puckeditor/core/dist/index.css', 'utf8'),
        readFileSync('./resources/css/puck-editor.css', 'utf8'),
    ].join('\n'),
)

await compile({
    ...defaultOptions,
    entryPoints: ['./resources/js/components/puck-editor.jsx'],
    outfile: './resources/dist/components/puck-editor.js',
})

console.log('Build completed for puck-editor.js')
