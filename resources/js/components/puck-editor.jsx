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
    isDisabled,
    stylesheetHref,
    state,
}) {
    return {
        reactRoot: null,
        editorMounted: false,
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
                this.mountEditor()
            }

            if (displayMode === 'slideOver' && modalId) {
                window.addEventListener('open-modal', (event) => {
                    if (event.detail?.id !== modalId) {
                        return
                    }

                    this.$nextTick(() => this.mountEditor())
                })
            }
        },

        destroy() {
            this.reactRoot?.unmount()
        },

        openBuilder() {
            if (isDisabled || !modalId) {
                return
            }

            this.$dispatch('open-modal', { id: modalId })
            this.$nextTick(() => this.mountEditor())
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

        mountEditor() {
            if (!this.$refs.puck) {
                return
            }

            if (!this.reactRoot) {
                this.reactRoot = createRoot(this.$refs.puck)
                this.editorMounted = true
            }

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
