type SimpleListener = () => void

export function createEvent() {
    let listener: SimpleListener[] = []
    return {
        on: (cb: SimpleListener) => {
            listener.push(cb)
        },
        off: (cb: SimpleListener) => {
            const index = listener.indexOf(cb)
            listener.splice(index, 1)
        },
        emit: () => {

            listener.forEach(item => item())
        }
    }
}
