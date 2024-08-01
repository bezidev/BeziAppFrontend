export interface ErrorRequest {
    message: string
    fileName: string
    lineNumber: number
    columnNumber: number
    stack?: string
}
