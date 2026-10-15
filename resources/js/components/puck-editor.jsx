import '../shims/node-globals.js'

import { createRoot } from 'react-dom/client'
import { Puck } from '@puckeditor/core'

import { defaultPuckConfig } from '../puck/default-config.jsx'

function toPlainObject(value) {
    const raw = window.Alpine?.raw ? window.Alpine.raw(value) : value

    if (raw === undefined || raw === null) {
        return raw
    }

    return JSON.parse(JSON.stringify(raw))
}

function normalizePuckData(value) {
    const data = toPlainObject(value)

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return { root: { props: {} }, content: [] }
    }

    return {
        root:
            data.root && typeof data.root === 'object' && !Array.isArray(data.root)
                ? data.root
                : { props: {} },
        content: Array.isArray(data.content) ? data.content : [],
        ...(data.zones && !Array.isArray(data.zones) ? { zones: data.zones } : {}),
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
    // React roots and Puck documents must stay outside Alpine's reactive proxies.
    let reactRoot = null
    let puckData = null
    let isDirty = false

    return {
        /** Livewire entangled form state (synced on Done / close). */
        state,

        blockCount: 0,

        get summaryText() {
            if (this.blockCount === 0) {
                return 'No blocks yet. Open the page builder to get started.'
            }

            return this.blockCount === 1
                ? '1 block in this layout'
                : `${this.blockCount} blocks in this layout`
        },

        init() {
            this.loadFromState()
            this.ensureStylesheet()

            if (displayMode === 'inline') {
                this.scheduleMount()

                return
            }

            if (!modalId) {
                return
            }

            window.addEventListener('open-modal', (event) => {
                if (event.detail?.id !== modalId) {
                    return
                }

                this.loadFromState()
                window.setTimeout(() => this.scheduleMount(), 50)
            })

            window.addEventListener('close-modal', (event) => {
                if (event.detail?.id !== modalId) {
                    return
                }

                this.syncToLivewire()
            })
        },

        destroy() {
            reactRoot?.unmount()
            reactRoot = null
        },

        loadFromState() {
            if (isDirty) {
                return
            }

            puckData = normalizePuckData(this.state)
            this.blockCount = puckData.content.length
        },

        openBuilder() {
            if (isDisabled || !modalId) {
                return
            }

            window.dispatchEvent(
                new CustomEvent('open-modal', { detail: { id: modalId } }),
            )
        },

        finishEditing() {
            window.dispatchEvent(
                new CustomEvent('close-modal', { detail: { id: modalId } }),
            )
        },

        syncToLivewire() {
            if (isDisabled || !isDirty) {
                return
            }

            this.state = normalizePuckData(puckData)
            isDirty = false
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
            if (reactRoot) {
                return
            }

            const mountElement = mountElementId
                ? document.getElementById(mountElementId)
                : (this.$refs.puck ?? null)

            if (mountElement) {
                reactRoot = createRoot(mountElement)
                this.renderPuck()

                return
            }

            if (attempt < 40) {
                requestAnimationFrame(() => this.scheduleMount(attempt + 1))
            }
        },

        renderPuck() {
            if (!reactRoot) {
                return
            }

            reactRoot.render(
                <div className="fi-puck-editor">
                    <Puck
                        config={config ?? defaultPuckConfig}
                        data={puckData}
                        height="100%"
                        iframe={{ enabled: true, syncHostStyles: false }}
                        onChange={(nextData) => {
                            if (isDisabled) {
                                return
                            }

                            puckData = nextData
                            isDirty = true
                            const nextBlockCount = Array.isArray(nextData?.content)
                                ? nextData.content.length
                                : 0

                            if (nextBlockCount !== this.blockCount) {
                                this.blockCount = nextBlockCount
                            }

                            if (displayMode === 'inline') {
                                this.syncToLivewire()
                            }
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
