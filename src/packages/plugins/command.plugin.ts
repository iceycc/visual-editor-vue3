import {reactive} from 'vue'
import {KeyboardCode} from './keyboard-code'

export interface CommandExecute {
    undo?: () => void,
    redo: () => void,
}

type commandTypes = 'delete' | 'undo' | 'redo' | 'updateBlock' | 'add' | 'drag' | 'clear'

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
        current: -1, // 队列中当前的命令
        queue: [] as CommandExecute[], // 命令队列
        commandArray: [] as Command[], // 命令对象数组
        commands: {} as Record<commandTypes, (...args: any[]) => void>, //  命令对象，方便通过命令的名称调用命令的execute函数，并且执行额外的命令队列的逻辑
        destroyList: [] as (() => void | undefined)[], // 组件销毁的时候，需要调用的销毁逻辑数组

    })
    /**
     * 注册一个命令
     * @param command
     */
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

    const keyBoardEvent = (() => {
        const onKeydown = (e: KeyboardEvent) => {
            console.log(e)
            // 某些情况下不需要处理键盘事件，比如焦点不再浏览器内
            if (document.activeElement !== document.body) return

        }
        return () => {
            window.addEventListener('keydown', onKeydown)
            return () => {
                window.removeEventListener('keydown', onKeydown)
            }
        }
    })()

    /**
     * 初始化函数，负责初始化键盘监听事件，调用命令的初始化逻辑
     */
    const init = () => {
        const onKeydown = (e: KeyboardEvent) => {
            const {keyCode, shiftKey, altKey, ctrlKey, metaKey} = e
            let keyString: string[] = []
            if (ctrlKey || metaKey) keyString.push('ctrl')
            if (shiftKey) keyString.push('shift')
            if (altKey) keyString.push('alt')
            keyString.push(KeyboardCode[keyCode])
            const keyNames = keyString.join('+')
            console.log(keyNames)
            state.commandArray.forEach(({keyboard, name}) => {
                if (!keyboard) {
                    return
                }
                const keys = Array.isArray(keyboard) ? keyboard : [keyboard]
                if (keys.indexOf(keyNames) > -1) {
                    state.commands[name]()
                    e.stopPropagation()
                    e.preventDefault()
                }
            })
        }
        window.addEventListener('keydown', onKeydown)
        state.commandArray.forEach(command => !!command.init && state.destroyList.push(command.init()))
        state.destroyList.push(keyBoardEvent())
        state.destroyList.push(() => window.removeEventListener('keydown', onKeydown))

    }
    /**
     * 注册撤回命令（撤回命令执行结果不需要进入命令队列）
     */
    registry({
        name: 'undo',
        keyboard: 'ctrl+z',
        followQueue: false,
        execute: () => {
            // 命令执行的时候，需要做的事情
            return {
                redo: () => {
                    // console.log('执行撤销undo', state)
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

    /**
     * 注册重做命令（重做命令执行结果不需要进入命令队列）
     */
    registry({
        name: 'redo',
        keyboard: ['ctrl+y', 'ctrl+shift+y'],
        followQueue: false,
        execute: () => {
            return {
                redo: () => {
                    // console.log('执行重做redo', state)
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
