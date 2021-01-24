import {defineComponent, PropType, computed, ref} from 'vue'
import './visual-editor.scss'
import {
    VisualEditorModelValue,
    VisualEditorConfig,
    VisualEditorComponent,
    createNewBlock,
    VisualEditorBlockData
} from './visual-editor.utils'
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
        // 容器中过的组件数据
        const dataModel = useModel(() => props.modelValue, (val) => ctx.emit('update:modelValue', val))
        // container阶段的dom对象的引用
        const containerRef = ref({} as HTMLElement)
        // container节点的style样式对象
        const containerStyles = computed(() => ({
            width: `${dataModel.value.container.width}px`,
            height: `${dataModel.value.container.height}px`,
        }))
        // 计算寻中与未选中的block的事件
        const focusData = computed(() => {
            let focus: VisualEditorBlockData[] = [];
            let unFocus: VisualEditorBlockData[] = [];
            (dataModel.value.blocks || []).forEach(block => (block.focus ? focus : unFocus).push(block));
            return {
                focus,
                unFocus
            }
        })
        // 对外暴露的一些方法
        const methods = {
            clearFocus: (block?: VisualEditorBlockData) => {
                let blocks = (dataModel.value.blocks || []);
                if (blocks.length === 0) return
                if (!!block) {
                    blocks = blocks.filter(item => item !== block)
                }
                blocks.forEach(block => block.focus = false)
            }
        }
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
                    value.push(createNewBlock({
                        top: e.offsetY,
                        left: e.offsetX,
                        component: component!
                    }))

                    dataModel.value = {
                        ...dataModel.value,
                        blocks: value
                    }
                }
            }
            return blockHandler
        })();
        // 处理block选中事件
        const focusHandle = (() => {
            return {
                container: {
                    onMousedown(e: MouseEvent) {
                        e.preventDefault();
                        e.stopPropagation();
                        // 点击空白清空所有block
                        methods.clearFocus();
                    }
                },
                block: {
                    onMouseDown(e: MouseEvent, block: VisualEditorBlockData) {
                        e.preventDefault();
                        e.stopPropagation();
                        // 重点逻辑
                        if (e.shiftKey) { // 按住shift，会将当前点击的block的focus进行取反
                            if (focusData.value.focus.length <= 1) {
                                // 如果只有一个，按住shift，不会取消。未来以后shift只能横向纵向移动
                                block.focus = true
                            } else {
                                block.focus = !block.focus;
                            }
                        } else {
                            if (!block.focus) { // 没有shift，切当前没有选中的，会选中当前，清空其他
                                block.focus = true;
                                methods.clearFocus(block);
                            }
                        }
                        blockDraggier.mousedown(e)
                    }
                }
            }
        })();
        // 处理block在container中拖拽移动事件
        const blockDraggier = (() => {
            let dragState = {
                startX: 0,
                startY: 0,
                startPos: [] as { left: number, top: number }[]
            }
            const mousedown = (e: MouseEvent) => {
                dragState = {
                    startX: e.clientX,
                    startY: e.clientY,
                    startPos: focusData.value.focus.map(({top, left}) => ({top, left}))
                }
                document.addEventListener('mousemove', mousemove)
                document.addEventListener('mouseup', mouseup)
            }
            const mousemove = (e: MouseEvent) => {
                const durX = e.clientX - dragState.startX
                const durY = e.clientY - dragState.startY
                focusData.value.focus.forEach((block, index) => {
                    block.top = dragState.startPos[index].top + durY
                    block.left = dragState.startPos[index].left + durX
                })
            }
            const mouseup = () => {
                document.removeEventListener('mousemove', mousemove)
                document.removeEventListener('mouseup', mouseup)
            }
            return {
                mousedown
            }
        })()
        // mouse事件，在移动的时候可以监听鼠标滚轮事件，比较方便
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
                    <div class="visual-editor-container"
                         ref={containerRef}
                         style={containerStyles.value}
                         {...focusHandle.container}
                    >
                        {/*vue3的话会将事件自动代理到组件根节点*/}
                        {!!dataModel.value && dataModel.value.blocks.map((block, ind) => {
                            return <VisualEditorBlock
                                config={props.config}
                                block={block}
                                key={ind}
                                {...{
                                    onMouseDown: (e: MouseEvent) => {
                                        focusHandle.block.onMouseDown(e, block)
                                    }
                                }}
                            />;
                        })}
                    </div>

                </div>
            </div>
        </div>
    }
})
