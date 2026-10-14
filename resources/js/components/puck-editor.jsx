import '../shims/node-globals.js'

import { createRoot } from 'react-dom/client'
import { Puck } from '@puckeditor/core'

import { defaultPuckConfig } from '../puck/default-config.jsx'

const emptyPuckData = {
    root: { props: {} },
    content: [],
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
        mountElement: null,
        editorMounted: false,
        isSchedulingMount: false,
        state,

        get blockCount() {
            return Array.isArray(this.state?.content) ? this.state.content.length : 0
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
            this.ensureStylesheet()

            if (displayMode === 'inline') {
                this.scheduleMount()
            }

            if (displayMode === 'slideOver' && modalId) {
                window.addEventListener('open-modal', (event) => {
                    if (event.detail?.id !== modalId) {
                        return
                    }

                    if (!this.editorMounted) {
                        this.scheduleMount()
                    }
                })
            }
        },

        destroy() {
            this.reactRoot?.unmount()
            this.reactRoot = null
            this.mountElement = null
            this.editorMounted = false
        },

        openBuilder() {
            if (isDisabled || !modalId) {
                return
            }

            this.$dispatch('open-modal', { id: modalId })

            if (!this.editorMounted) {
                this.scheduleMount()
            }
        },

        closeBuilder() {
            if (!modalId) {
                return
            }

            this.$dispatch('close-modal', { id: modalId })
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

            if (attempt === 0) {
                this.isSchedulingMount = true
            }

            const mountElement = this.getMountElement()

            if (mountElement) {
                this.isSchedulingMount = false
                this.mountEditor(mountElement)

                return
            }

            if (attempt < 30) {
                requestAnimationFrame(() => this.scheduleMount(attempt + 1))

                return
            }

            this.isSchedulingMount = false
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

            this.mountElement = el
            this.reactRoot = createRoot(el)
            this.editorMounted = true
            this.renderPuck()
        },

        renderPuck() {
            if (!this.reactRoot) {
                return
            }

            const puckConfig = config ?? defaultPuckConfig
            const data =
                this.state && Object.keys(this.state).length > 0
                    ? this.state
                    : emptyPuckData

            this.reactRoot.render(
                <div className="fi-puck-editor">
                    <Puck
                        config={puckConfig}
                        data={data}
                        onChange={(nextData) => {
                            if (isDisabled) {
                                return
                            }

                            const current = JSON.stringify(this.state ?? {})
                            const next = JSON.stringify(nextData ?? {})

                            if (current === next) {
                                return
                            }

                            this.state = nextData
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
