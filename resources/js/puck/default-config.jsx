/** @type {import('@puckeditor/core').Config} */
export const defaultPuckConfig = {
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
            },
            defaultProps: {
                text: 'Heading',
                level: '1',
            },
            render: ({ text, level }) => {
                const Tag = `h${level}`

                return <Tag>{text}</Tag>
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
