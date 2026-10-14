import '../shims/node-globals.js'

import { createRoot } from 'react-dom/client'
import { Puck } from '@puckeditor/core'

import { defaultPuckConfig } from '../puck/default-config.jsx'

const emptyPuckData = {
    root: { props: {} },
    content: [],
}

function normalizePuckData(value) {
    if (!value || typeof value !== 'object') {
        return structuredClone(emptyPuckData)
    }

    return {
        root: value.root ?? { props: {} },
        content: Array.isArray(value.content) ? value.content : [],
        ...(value.zones ? { zones: value.zones } : {}),
    }
}

export default function puckEditorFormComponent({
    config,
    displayMode = 'inline',
    modalId,
    mountElementId,
    isDisabled,
    stylesheetHref,
    state,
}) {
    return {
        reactRoot: null,
        editorMounted: false,
        isSchedulingMount: false,
        /** Livewire entangled form state (synced on Done / close). */
        state,
        /** Local Puck document — avoids entangle feedback loops while editing. */
        puckData: null,

        get blockCount() {
            const source =
                this.puckData ??
                (this.state && Object.keys(this.state).length > 0
                    ? this.state
                    : emptyPuckData)

            return Array.isArray(source.content) ? source.content.length : 0
        },

        get summaryText() {
            if (this.blockCount === 0) {
                return 'No blocks yet. Open the page builder to get started.'
            }

            return this.blockCount === 1
                ? '1 block in this layout'
                : `${this.blockCount} blocks in this layout`
        },

        init() {
            this.puckData = normalizePuckData(this.state)
            this.ensureStylesheet()

            if (displayMode === 'inline') {
                this.scheduleMount()
            }

            if (displayMode === 'slideOver' && modalId) {
                window.addEventListener('open-modal', (event) => {
                    if (event.detail?.id !== modalId) {
                        return
                    }

                    window.setTimeout(() => this.scheduleMount(), 100)
                })

                window.addEventListener('close-modal', (event) => {
                    if (event.detail?.id !== modalId) {
                        return
                    }

                    this.syncToLivewire()
                })

                window.addEventListener('puck-editor-done', (event) => {
                    if (event.detail?.id !== modalId) {
                        return
                    }

                    this.finishEditing()
                })
            }
        },

        destroy() {
            this.reactRoot?.unmount()
            this.reactRoot = null
            this.editorMounted = false
        },

        openBuilder() {
            if (isDisabled || !modalId) {
                return
            }

            this.puckData = normalizePuckData(this.state)
            this.$dispatch('open-modal', { id: modalId })

            if (this.editorMounted) {
                this.renderPuck()
            } else {
                window.setTimeout(() => this.scheduleMount(), 100)
            }
        },

        finishEditing() {
            this.syncToLivewire()
            this.$dispatch('close-modal', { id: modalId })
        },

        syncToLivewire() {
            if (isDisabled) {
                return
            }

            this.state = structuredClone(this.puckData)
        },

        ensureStylesheet() {
            if (
                !stylesheetHref ||
                document.querySelector('[data-fi-puck-editor-styles]')
            ) {
                return
            }

            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = stylesheetHref
            link.dataset.fiPuckEditorStyles = 'true'
            document.head.appendChild(link)
        },

        scheduleMount(attempt = 0) {
            if (this.editorMounted) {
                return
            }

            const mountElement = this.getMountElement()

            if (mountElement) {
                this.mountEditor(mountElement)

                return
            }

            if (attempt < 40) {
                requestAnimationFrame(() => this.scheduleMount(attempt + 1))
            }
        },

        getMountElement() {
            if (mountElementId) {
                return document.getElementById(mountElementId)
            }

            return this.$refs.puck ?? null
        },

        mountEditor(mountElement) {
            const el = mountElement ?? this.getMountElement()

            if (!el || this.editorMounted) {
                return
            }

            this.reactRoot = createRoot(el)
            this.editorMounted = true
            this.renderPuck()
        },

        renderPuck() {
            if (!this.reactRoot) {
                return
            }

            const puckConfig = config ?? defaultPuckConfig
            const data = normalizePuckData(this.puckData)

            this.reactRoot.render(
                <div className="fi-puck-editor">
                    <Puck
                        config={puckConfig}
                        data={data}
                        onChange={(nextData) => {
                            if (isDisabled) {
                                return
                            }

                            this.puckData = normalizePuckData(nextData)
                        }}
                        permissions={
                            isDisabled
                                ? {
                                      edit: false,
                                      drag: false,
                                      delete: false,
                                      duplicate: false,
                                      insert: false,
                                  }
                                : undefined
                        }
                    />
                </div>,
            )
        },
    }
}
