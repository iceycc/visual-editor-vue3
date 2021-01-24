import {createVisualEditorConfig} from "./packages/visual-editor.utils";
import {ElButton, ElInput} from 'element-plus'
// element tsx 的？
export const visualConfig = createVisualEditorConfig()
visualConfig.registry('text', {
    preview: () => '预览:文本',
    render: () => "渲染：文本",
    label: "文本",
    name: "文本"
})

visualConfig.registry('button', {
    preview: () => <ElButton>预览：按钮</ElButton>,
    render: () => <ElButton>渲染：按钮</ElButton>,
    label: "按钮",
    name: "按钮"
})
visualConfig.registry('input', {
    preview: () => <ElInput/>,
    render: () => <ElInput/>,
    label: "输入框",
    name: "输入框"
})

