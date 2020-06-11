type Slot<T> = (data: T) => void

export default class Subject<T> {
    private subscribers: Slot<T>[] = []
    subscribe = (func: Slot<T>) => {
        const index = this.subscribers.length
        this.subscribers.push(func)
        return {
            unsubscribe: () => {
                this.subscribers.splice(index)
            }
        }
    }
    
    notify = (data: T) => {
        for(const func of this.subscribers) {
            func(data)
        }
    }
}