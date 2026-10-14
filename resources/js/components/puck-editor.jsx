import { createRoot } from 'react-dom/client'
import { Puck } from '@puckeditor/core'

import { defaultPuckConfig } from '../puck/default-config.jsx'

const emptyPuckData = {
    root: { props: {} },
    content: [],
}

export default function puckEditorFormComponent({
    config,
    isDisabled,
    stylesheetHref,
    state,
}) {
    return {
        reactRoot: null,
        state,

        init() {
            if (
                stylesheetHref &&
                !document.querySelector('[data-fi-puck-editor-styles]')
            ) {
                const link = document.createElement('link')
                link.rel = 'stylesheet'
                link.href = stylesheetHref
                link.dataset.fiPuckEditorStyles = 'true'
                document.head.appendChild(link)
            }

            this.reactRoot = createRoot(this.$refs.puck)
            this.renderPuck()
        },

        destroy() {
            this.reactRoot?.unmount()
        },

        renderPuck() {
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
