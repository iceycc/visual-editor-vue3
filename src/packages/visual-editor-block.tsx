import {defineComponent, PropType, computed, ref, onMounted} from 'vue';
import {VisualEditorBlockData, VisualEditorConfig} from './visual-editor.utils';

export const VisualEditorBlock = defineComponent({
    props: {
        block: {type: Object as PropType<VisualEditorBlockData>, required: true},
        config: {type: Object as PropType<VisualEditorConfig>, required: true}
    },
    setup(props, ctx) {
        const el = ref({} as HTMLElement)
        const styles = computed(() => (
            {
                top: `${props.block.top}px`,
                left: `${props.block.left}px`
            }
        ))
        onMounted(() => {
            /// 添加组件的时候，自动按照鼠标位置调整上线左右居中
            const block = props.block
            if (block.adjustPosition) {
                // 需要重新定位
                const {offsetWidth, offsetHeight} = el.value
                block.left = block.left - offsetWidth / 2
                block.top = block.top - offsetHeight / 2
                block.adjustPosition = false
            }
        })
        return () => {
            const component = props.config.componentMap[props.block.componentKey]
            const render = component.render()
            return <div style={styles.value} class="visual-editor-block" ref={el}>
                {render}
            </div>
        }
    }

})
