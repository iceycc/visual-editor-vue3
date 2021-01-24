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
        /*处理从菜单拖拽组件到容器的相关动作*/
        const menuDraggier = (() => {
            // 用闭包自执行函数，只暴露需要的方法
            let component = null as null | VisualEditorComponent
            const blockHandler = {
                /**
                 * 处理拖拽菜单组件开始动作
                 * @param e
                 * @param current
                 */
                dragstart: (e: DragEvent, current: VisualEditorComponent) => {
                    console.log('current', current)
                    containerRef.value.addEventListener('dragenter', containerHandle.dragenter)
                    containerRef.value.addEventListener('dragover', containerHandle.dragover)
                    containerRef.value.addEventListener('dragleave', containerHandle.dragleave)
                    containerRef.value.addEventListener('drop', containerHandle.drop)
                    component = current
                },
                /**
                 * 处理拖拽菜单组件结束动作
                 * @param e
                 */
                dragend: (e: DragEvent) => {
                    containerRef.value.removeEventListener('dragenter', containerHandle.dragenter)
                    containerRef.value.removeEventListener('dragover', containerHandle.dragover)
                    containerRef.value.removeEventListener('dragleave', containerHandle.dragleave)
                    containerRef.value.removeEventListener('drop', containerHandle.drop)
                    component = null
                },
            }
            const containerHandle = {
                /**
                 * 拖拽菜单组件，进入容器的时候，设置鼠标为可放置状态
                 * @param e
                 */
                dragenter: (e: DragEvent) => {
                    e.dataTransfer!.dropEffect = 'move'
                },
                /**
                 * 拖拽菜单组件，鼠标在容器中移动的时候，禁用默认事件
                 * @param e
                 */
                dragover: (e: DragEvent) => {
                    e.preventDefault()
                },
                /**
                 * 如果拖拽过程中，鼠标离开了容器，设置鼠标为不可放置的状态
                 * @param e
                 */
                dragleave: (e: DragEvent) => {
                    e.dataTransfer!.dropEffect = 'none'
                },
                /**
                 * 处理拖拽菜单组件结束动作
                 * @param e
                 */
                drop: (e: DragEvent) => {
                    const value = dataModel.value.blocks || []
                    value.push({
                        top: e.offsetY,
                        left: e.offsetX,
                        componentKey: component!.key,
                        adjustPosition: true
                    })
                    dataModel.value = {
                        ...dataModel.value,
                        blocks: value
                    }
                }
            }
            return blockHandler
        })()
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
                            return <VisualEditorBlock config={props.config} block={block} key={ind}/>;
                        })}
                    </div>

                </div>
            </div>
        </div>
    }
})
