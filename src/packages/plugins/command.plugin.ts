import {reactive} from 'vue'

export interface CommandExecute {
    undo?: () => void,
    redo: () => void,
}

export interface Command {
    name: string, // 命令唯一标志
    keyboard?: string | string[], // 命令监听的快捷键
    execute: (...args: any[]) => CommandExecute, // 命令被执行的时候，所做的内容
    followQueue?: boolean, // 命令执行完后，是否需要将命令执行得到的undo，redo放入队列
}

export interface CommandManager {
    queue: CommandExecute[],
    current: number,
}

export function useCommander() {
    const state = reactive({
        current: -1,
        queue: [] as CommandExecute[],
        commands: {} as Record<string, (...args: any[]) => void>
    })
    const registry = (command: Command) => {
        state.commands[command.name] = (...args) => {
            const {undo, redo} = command.execute(...args)
            if (command.followQueue) {
                state.queue.push({undo, redo})
                state.current += 1
            }
            redo()
        }
    }
    registry({
        name: 'undo',
        keyboard: 'ctrl+z',
        followQueue: false,
        execute: () => {
            // 命令执行的时候，需要做的事情
            return {
                redo: () => {
                    // 将要做的事情还原
                    let {current} = state;
                    if (current === -1) return;
                    const {undo} = state.queue[current];
                    !!undo && undo();
                    state.current -= 1
                },
                // undo: () => {
                //     // 重新做一遍，要做的事情
                // }
            }
        }
    })

    registry({
        name: 'redo',
        keyboard: ['ctrl+y', 'ctrl+shift+y'],
        followQueue: false,
        execute: () => {
            return {
                redo: () => {
                    let {current} = state
                    if (!state.queue[current]) return;
                    const {redo} = state.queue[current];
                    redo();
                    state.current += 1
                }

            }
        }
    })
    return {
        state,
        registry
    }
}
