const headingLevelStyles = {
    1: { fontSize: '2.25rem', lineHeight: '2.5rem', letterSpacing: '-0.025em' },
    2: { fontSize: '1.875rem', lineHeight: '2.25rem', letterSpacing: '-0.025em' },
    3: { fontSize: '1.5rem', lineHeight: '2rem', letterSpacing: '0' },
}

/** @type {import('@puckeditor/core').Config} */
export const defaultPuckConfig = {
    root: {
        render: ({ children }) => (
            <div
                style={{
                    minHeight: '100%',
                    background: '#ffffff',
                    color: '#0f172a',
                    fontFamily:
                        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    lineHeight: 1.5,
                }}
            >
                {children}
            </div>
        ),
    },
    components: {
        Heading: {
            fields: {
                text: {
                    type: 'text',
                },
                level: {
                    type: 'select',
                    options: [
                        { label: 'H1', value: '1' },
                        { label: 'H2', value: '2' },
                        { label: 'H3', value: '3' },
                    ],
                },
                align: {
                    type: 'radio',
                    options: [
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                    ],
                },
            },
            defaultProps: {
                text: 'Heading',
                level: '1',
                align: 'left',
            },
            render: ({ text, level, align }) => {
                const Tag = `h${level}`

                return (
                    <Tag
                        style={{
                            ...(headingLevelStyles[level] ?? headingLevelStyles[1]),
                            margin: 0,
                            padding: '1rem 1.5rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            textAlign: align ?? 'left',
                        }}
                    >
                        {text}
                    </Tag>
                )
            },
        },
        Text: {
            fields: {
                content: {
                    type: 'textarea',
                },
            },
            defaultProps: {
                content: 'Start typing…',
            },
            render: ({ content }) => <p>{content}</p>,
        },
    },
}
