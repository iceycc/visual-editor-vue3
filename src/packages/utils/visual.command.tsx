import {useCommander} from "@/packages/plugins/command.plugin";
import {VisualEditorBlockData, VisualEditorModelValue} from "@/packages/visual-editor.utils";

export function useVisualCommand({focusData, dataModel, updateBlocks}: {
    updateBlocks: (blocks: VisualEditorBlockData[]) => void,
    focusData: {
        value: { focus: VisualEditorBlockData[], unFocus: VisualEditorBlockData[] }
    },
    dataModel: { value: VisualEditorModelValue }
}) {
    const commander = useCommander()
    commander.registry({
        name: 'delete',
        keyboard: ['backspace', 'delete'],
        followQueue: true,
        execute: () => {
            // 执行删除的命令
            console.log('执行删除命令')
            let data = {
                before: dataModel.value.blocks,
                after: focusData.value.unFocus,
            }
            return {
                redo() {
                    console.log('重做删除命令')
                    // data.before = dataModel.value.blocks || [];
                    // const {unFocus} = focusData.value; //
                    // data.after = unFocus
                    updateBlocks(data.after) // 将新的未选中的更新，相当于选中的删除了
                },
                undo() {
                    console.log('撤回删除命令')
                    updateBlocks(data.before) //
                }
            }
        }
    })
    return {
        undo: () => commander.state.commands.undo(),
        redo: () => commander.state.commands.redo(),
        delete: () => commander.state.commands.delete()
    }
}
