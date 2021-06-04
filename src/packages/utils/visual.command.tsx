import {useCommander} from "@/packages/plugins/command.plugin";
import {VisualEditorBlockData, VisualEditorModelValue} from "@/packages/visual-editor.utils";
import deepcopy from "deepcopy";

export function useVisualCommand(
    {
        focusData,
        dataModel,
        updateBlocks,
        dragStart,
        dragEnd,
    }: {
        updateBlocks: (blocks: VisualEditorBlockData[]) => void,
        focusData: {
            value: { focus: VisualEditorBlockData[], unFocus: VisualEditorBlockData[] }
        },
        dataModel: { value: VisualEditorModelValue },
        dragEnd: { on: (cb: () => void) => void, off: (cb: () => void) => void },
        dragStart: { on: (cb: () => void) => void, off: (cb: () => void) => void }
    }) {
    const commander = useCommander()
    /**
     * 删除命令
     */
    commander.registry({
        name: 'delete',
        keyboard: ['backspace', 'delete'],
        followQueue: true,
        execute: () => {
            // 执行删除的命令
            // console.log('执行删除命令')
            let data = {
                before: dataModel.value.blocks,
                after: focusData.value.unFocus,
            }
            return {
                redo() {
                    // console.log('重做删除命令')
                    // data.before = dataModel.value.blocks || [];
                    // const {unFocus} = focusData.value; //
                    // data.after = unFocus
                    updateBlocks(deepcopy(data.after)) // 将新的未选中的更新，相当于选中的删除了
                },
                undo() {
                    // console.log('撤回删除命令')
                    updateBlocks(deepcopy(data.before)) //
                }
            }
        }
    })

    // 添加命令
    commander.registry({
        name: 'updateBlock',
        followQueue: true,
        execute: (newBlock: VisualEditorBlockData, oldBlock) => {
            // console.log('添加命令')
            let blocks = dataModel.value.blocks || []
            let data = {
                before: blocks,
                after: (() => {
                    blocks = [...blocks];
                    // 找的需要替换的block的index
                    const index = dataModel.value.blocks!.indexOf(oldBlock)
                    if (index > -1) {
                        blocks.splice(index, 1, newBlock)
                    }
                    return blocks;
                })()
            }
            return {
                redo() {
                    updateBlocks(deepcopy(data.after))
                    // console.log('重做添加命令')
                },
                undo() {
                    // console.log('撤销添加命令')
                    updateBlocks(deepcopy(data.before))
                }
            }
        }
    })
    commander.registry({
        name: 'add',
        execute: () => {
            return {
                undo: () => {
                    console.log('add undo')
                },
                redo: () => {
                    console.log('add redo')
                }
            }
        }
    })
    /**
     * 拖拽命令，适用于三种情况：
     * - 从菜单拖拽组件到容器画布；
     * - 在容器中拖拽组件调整位置
     * - 拖拽调整组件的宽度和高度；
     */
    commander.registry({
        name: 'drag',
        followQueue: true,
        init() {
            // console.log('command drag init')
            this.data = {
                before: null as null | VisualEditorBlockData[]
            }
            const handler = {
                dragStart: () => this.data.before = deepcopy(dataModel.value.blocks || []),
                dragEnd: () => commander.state.commands.drag()
            }
            dragStart.on(handler.dragStart)
            dragEnd.on(handler.dragEnd)
            return () => {
                dragStart.off(handler.dragStart)
                dragEnd.off(handler.dragEnd)
            }
        },
        execute() {
            let before = deepcopy(this.data.before)
            let after = deepcopy(dataModel.value.blocks)
            // console.log('command drag')
            return {
                redo: () => {
                    updateBlocks(after)
                    // console.log('command drag redo')
                },
                undo: () => {
                    updateBlocks(before)
                    // console.log('command drag undo')
                }
            }
        }
    })

    commander.registry({
        name: 'clear',
        execute: () => {
            const data = {
                before: deepcopy(dataModel.value.blocks),
                after: deepcopy([])
            }
            return {
                redo: () => {
                    updateBlocks(data.after)
                },
                undo: () => {
                    updateBlocks(data.before)
                }
            }
        }
    })

    commander.init()

    return {
        undo: () => commander.state.commands.undo(),
        redo: () => commander.state.commands.redo(),
        delete: () => commander.state.commands.delete(),
        drag: () => commander.state.commands.drag(),
        clear: () => commander.state.commands.clear()
    }
}
