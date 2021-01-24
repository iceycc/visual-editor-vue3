export interface VisualEditorBlockData {
    top: number,
    left: number
}

export interface VisualEditorModelValue {
    container: {
        width: number,
        height: number
    },
    blocks: VisualEditorBlockData[]
}

export interface VisualEditorComponent {
    name: string,
    label: string,

    preview: () => JSX.Element,
    render: () => JSX.Element
}

export function createVisualEditorConfig() {
    const componentList: VisualEditorComponent[] = []
    const componentMap: Record<string, VisualEditorComponent> = {}
    return {
        componentList,
        componentMap,
        registry: (key: string, component: Omit<VisualEditorComponent, 'key'>) => {
            let comp = {...component, key}
            componentList.push(component)
            componentMap[key] = comp
        }
    }
}

export type VisualEditorConfig = ReturnType<typeof createVisualEditorConfig>

//
// const config = createVisualEditorConfig()
// config.registry('input', {
//     preview: () => '输出框1',
//     render: () => '输出框1'
// })
