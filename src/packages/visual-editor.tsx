import {defineComponent, PropType, computed} from 'vue'
import './visual-editor.scss'
import {VisualEditorModelValue, VisualEditorConfig} from './visual-editor.utils'
import {VisualEditorBlock} from './visual-editor-block'
import {useModel} from './utils/useModule'

export const VisualEditor = defineComponent({
    props: {
        modelValue: {
            type: Object as PropType<VisualEditorModelValue>,
            required: true
        },
        config: {
            type: Object as PropType<VisualEditorConfig>,
            required: true
        }
    },
    emit: {
        'update:modelValue': ((val?: VisualEditorModelValue) => true)
    },
    setup(props, ctx) {
        // 组件对外数据双向绑定
        const dataModel = useModel(() => props.modelValue, (val) => ctx.emit('update:modelValue', val))
        const containerStyles = computed(() => ({
            width: `${dataModel.value.container.width}px`,
            height: `${dataModel.value.container.height}px`,
        }))
        console.log('modelValue', dataModel)
        console.log('config', props.config)
        return () => <div class="visual-editor">
            <div class="visual-editor-menu">
                {!!props.config && props.config.componentList.map(item => {
                    const Preview = item.preview
                    return <div class="visual-editor-menu-item">
                        <span class="visual-editor-menu-item-label">{item.label}</span>
                        <Preview/>
                    </div>
                })}
            </div>
            <div class="visual-editor-head">
                visual-editor-head
            </div>
            <div class="visual-editor-operator">
                visual-editor-operator
            </div>
            <div class="visual-editor-body">
                <div class="visual-editor-content">
                    <div class="visual-editor-container" style={containerStyles.value}>
                        {!!dataModel.value && dataModel.value.blocks.map((block, ind) => {
                            return <VisualEditorBlock block={block} key={ind}/>;
                        })}
                    </div>

                </div>
            </div>
        </div>
    }
})
