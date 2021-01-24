import {defineComponent, PropType, computed} from 'vue';
import {VisualEditorBlockData} from './visual-editor-utils';

export const VisualEditorBlock = defineComponent({
    props: {
        block: {type: Object as PropType<VisualEditorBlockData>, required: true}
    },
    setup(props, ctx) {
        const styles = computed(() => (
            {
                top: `${props.block.top}px`,
                left: `${props.block.left}px`
            }
        ))
        return () => (
            <div style={styles.value} class="visual-editor-block">
                这是一条block
            </div>
        )
    }

})
