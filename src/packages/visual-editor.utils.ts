export interface VisualEditorBlockData {
    componentKey: string, //  映射VisualEditorConfig 中 componentMap的 component对象
    top: number, // 组件的top定位
    left: number, // 组件的left定位
    adjustPosition?: boolean, // 是否需要调整位置
    focus?: boolean, //
}

export function createNewBlock({top, left, component}: { top: number, left: number, component: VisualEditorComponent }): VisualEditorBlockData {
    return {
        top,
        left,
        componentKey: component!.key,
        adjustPosition: true,
        focus: false
    }
}

export interface VisualEditorModelValue {
    container: {
        width: number,
        height: number
    },
    blocks: VisualEditorBlockData[]
}

export interface VisualEditorComponent {
    key: string,
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
            componentList.push(comp)
            componentMap[key] = comp
        }
    }
}

export type VisualEditorConfig = ReturnType<typeof createVisualEditorConfig>

//
// const config = createVisualEditorConfig()
// config.registry('input', {
//     preview: () => '输出框1',
//     render: () => '输出框1',
//     label: '',
// })
