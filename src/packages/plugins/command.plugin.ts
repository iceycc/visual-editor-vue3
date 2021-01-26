import {reactive, onUnmounted} from 'vue'

export interface CommandExecute {
    undo?: () => void,
    redo: () => void,
}

type commandTypes = 'delete' | 'undo' | 'redo' | 'updateBlock' | 'add' | 'drag'

export interface Command {
    name: commandTypes, // 命令唯一标志
    keyboard?: string | string[], // 命令监听的快捷键
    execute: (...args: any[]) => CommandExecute, // 命令被执行的时候，所做的内容
    followQueue?: boolean, // 命令执行完后，是否需要将命令执行得到的undo，redo放入队列
    init?: () => (() => void | undefined), // 命令初始化函数
    data?: any, // 命令缓存所需的数据
}

export interface CommandManager {
    queue: CommandExecute[],
    current: number,
}

export function useCommander() {
    const state = reactive({
        current: -1,
        queue: [] as CommandExecute[], // 执行命令的队列
        commandArray: [] as Command[],
        commands: {} as Record<commandTypes, (...args: any[]) => void>,
        destroyList: [] as (() => void | undefined)[],

    })
    const registry = (command: Command) => {
        state.commandArray.push(command)
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
    // 初始化函数，负责初始化键盘监听事件，调用命令的初始化逻辑
    const init = () => {
        const onKeydown = (e: KeyboardEvent) => {
            console.log('监听到键盘事件', e)
        }
        window.addEventListener('keydown', onKeydown)
        state.commandArray.forEach(command => !!command.init && state.destroyList.push(command.init()))
        state.destroyList.push(() => window.removeEventListener('keydown', onKeydown))

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
                    if (state.current === -1) return;
                    const queueItem = state.queue[state.current]
                    if (!!queueItem) {
                        !!queueItem.undo && queueItem.undo()
                        state.current--
                    }
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
                    const queueItem = state.queue[state.current + 1] // 重做下一指针的操作
                    if (!!queueItem) {
                        queueItem.redo()
                        state.current++
                    }
                }

            }
        }
    })
    return {
        state,
        registry,
        init
    }
}
