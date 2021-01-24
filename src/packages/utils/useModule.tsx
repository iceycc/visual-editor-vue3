import {ref, computed, watch, defineComponent} from 'vue';
import defineProperty = Reflect.defineProperty;

// 自定义双向绑定
export function useModel<T>(getter: () => T, emitter: (val: T) => void) {
    const state = ref(getter()) as { value: T }
    watch(getter, val => {
        if (val !== state.value) {
            state.value = val
        }
    })
    return {
        get value() {
            return state.value
        },
        set value(val: T) {
            if (state.value !== val) {
                state.value = val
                emitter(val)
            }
        }
    }
}

