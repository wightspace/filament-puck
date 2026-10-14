import esbuild from 'esbuild'
import { copyFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'

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

const defaultOptions = {
    define: {
        'process.env.NODE_ENV': isDev ? `'development'` : `'production'`,
        global: 'globalThis',
    },
    banner: {
        js: 'var global = globalThis;',
    },
    bundle: true,
    mainFields: ['module', 'main'],
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
        crypto: 'crypto-browserify',
        buffer: 'buffer',
        stream: 'stream-browserify',
        events: 'events',
        util: 'util',
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

copyFileSync(
    './node_modules/@puckeditor/core/dist/index.css',
    './resources/dist/puck-editor.css',
)

await compile({
    ...defaultOptions,
    entryPoints: ['./resources/js/components/puck-editor.jsx'],
    outfile: './resources/dist/components/puck-editor.js',
})

console.log('Build completed for puck-editor.js')
