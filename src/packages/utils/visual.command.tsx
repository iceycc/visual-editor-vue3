import {useCommander} from "@/packages/plugins/command.plugin";

export function useVisualCommand() {
    const commander = useCommander()
    commander.registry({
        name: 'delete',
        keyboard: ['backspace', 'delete'],
        execute: () => {
            // 执行删除的命令
            return {
                undo() {
                    console.log('执行删除名令')
                },
                redo() {
                    console.log('重做删除命令')
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
