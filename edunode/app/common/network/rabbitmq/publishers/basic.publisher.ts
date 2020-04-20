export interface BasicPublisher<T> {
    publish(content: T): Promise<void>
}
