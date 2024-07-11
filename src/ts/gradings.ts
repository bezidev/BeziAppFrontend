export interface GradingsResponse {
    past: Grading[]
    future: Grading[]
}

export interface Grading {
    ID: number
    Course: string
    GradingName: string
    Type: number
    Date: string
    Hour: number
    Test: boolean
    Grade: number
}
