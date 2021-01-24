import {defineComponent} from "vue";
import {useModel} from "@/packages/utils/useModule";

export const TestUseModel = defineComponent({
    props: {
        modelValue: {type: String}
    },
    emit: {
        'update:moduleValue': (val?: string) => true
    },
    setup(props, ctx) {
        const model = useModel(() => props.modelValue, val => ctx.emit('update:modelValue', val))
        return () => (
            <div>
                自定义输出框
                <input type="text" v-model={model.value}/>
            </div>
        )
    }

})
