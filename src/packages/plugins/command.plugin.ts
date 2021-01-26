import {reactive} from 'vue'

export interface CommandExecute {
    undo?: () => void,
    redo: () => void,
}

type commandTypes = 'delete' | 'undo' | 'redo' | 'updateBlocks'

export interface Command {
    name: commandTypes, // 命令唯一标志
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
        queue: [] as CommandExecute[], // 执行命令的队列
        commands: {} as Record<commandTypes, (...args: any[]) => void>
    })
    const registry = (command: Command) => {
        state.commands[command.name] = (...args) => {
            const {undo, redo} = command.execute(...args)
            redo() // 执行命令时直接执行redo，重做命令
            if (command.followQueue) {
                let {queue, current} = state
                if (queue.length > 0) {
                    queue = queue.slice(0, current + 1)
                    state.queue = queue
                }
                queue.push({undo, redo}) // 增加命令队列
                state.current = current + 1 // +1
            }
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
                    console.log('执行撤销undo', state)
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
                    console.log('执行重做redo', state)
                    let {current} = state
                    const queueItem = state.queue[current + 1] // 重做下一指针的操作
                    if (!!queueItem) {
                        queueItem.redo()
                        state.current += 1
                    }
                }

            }
        }
    })
    return {
        state,
        registry
    }
}
