import { Buffer } from 'buffer'
import process from 'process'

globalThis.global = globalThis.global ?? globalThis
globalThis.process = globalThis.process ?? process
globalThis.Buffer = globalThis.Buffer ?? Buffer

export { Buffer, process }
