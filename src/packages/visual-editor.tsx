import {defineComponent, PropType, computed} from 'vue'
import './visual-editor.scss'
import {VisualEditorModelValue} from './visual-editor-utils'
import {VisualEditorBlock} from './visual-editor-block'
import {useModel} from './utils/useModule'

export const VisualEditor = defineComponent({
    props: {
        modelValue: {
            type: Object as PropType<VisualEditorModelValue>,
            required: true
        }
    },
    emit: {
        'update:modelValue': ((val?: VisualEditorModelValue) => true)
    },
    setup(props, ctx) {
        /*双向绑定至，容器中的组件数据*/
        const dataModel = useModel(() => props.modelValue, (val) => ctx.emit('update:modelValue', val))
        /*container节点的style样式对象*/
        const containerStyles = computed(() => ({
            width: `${dataModel.value.container.width}px`,
            height: `${dataModel.value.container.height}px`,
        }))
        console.log('modelValue', dataModel)
        return () => <div class="visual-editor">
            <div class="visual-editor-menu">
                visual-editor-menu
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
