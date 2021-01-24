import {defineComponent, PropType, computed, ref} from 'vue'
import './visual-editor.scss'
import {VisualEditorModelValue, VisualEditorConfig, VisualEditorComponent} from './visual-editor.utils'
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
        // 容器样式
        const containerStyles = computed(() => ({
            width: `${dataModel.value.container.width}px`,
            height: `${dataModel.value.container.height}px`,
        }))
        //
        const containerRef = ref({} as HTMLElement)
        const menuDraggier = {
            current: {
                component: null as null | VisualEditorComponent
            },
            dragstart: (e: DragEvent, component: VisualEditorComponent) => {
                console.log('dragstart')
                containerRef.value.addEventListener('dragenter', menuDraggier.dragenter)
                containerRef.value.addEventListener('dragover', menuDraggier.dragover)
                containerRef.value.addEventListener('dragleave', menuDraggier.dragleave)
                containerRef.value.addEventListener('drop', menuDraggier.drop)
                menuDraggier.current.component = component
            },
            dragover: (e: DragEvent) => {
                console.log('dragover')
                e.preventDefault()
            },
            dragenter: (e: DragEvent) => {
                console.log('dragenter')
                e.dataTransfer!.dropEffect = 'move'
            },
            dragleave: (e: DragEvent) => {
                console.log('dragleave')
                e.dataTransfer!.dropEffect = 'none'
            },
            dragend: (e: DragEvent) => {
                containerRef.value.removeEventListener('dragenter', menuDraggier.dragenter)
                containerRef.value.removeEventListener('dragover', menuDraggier.dragover)
                containerRef.value.removeEventListener('dragleave', menuDraggier.dragleave)
                containerRef.value.removeEventListener('drop', menuDraggier.drop)
                menuDraggier.current.component = null
            },
            drop: (e: DragEvent) => {
                console.log('drop', menuDraggier.current.component)
                const value = dataModel.value.blocks || []
                value.push({
                    top: e.offsetY,
                    left: e.offsetX
                })
                dataModel.value = {
                    ...dataModel.value,
                    blocks: value
                }
            }
        }
        console.log('modelValue', dataModel)
        console.log('config', props.config)
        return () => <div class="visual-editor">
            <div class="visual-editor-menu">
                {!!props.config && props.config.componentList.map(component => {
                    const Preview = component.preview
                    return <div class="visual-editor-menu-item"
                                draggable={true}
                                onDragstart={(e) => menuDraggier.dragstart(e, component)}
                                onDragend={menuDraggier.dragend}
                    >
                        <span class="visual-editor-menu-item-label">{component.label}</span>
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
                    <div class="visual-editor-container" ref={containerRef} style={containerStyles.value}>
                        {!!dataModel.value && dataModel.value.blocks.map((block, ind) => {
                            return <VisualEditorBlock block={block} key={ind}/>;
                        })}
                    </div>

                </div>
            </div>
        </div>
    }
})
