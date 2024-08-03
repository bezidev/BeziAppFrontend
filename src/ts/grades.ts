export interface Grade {
    GradeID: string
    Username: string
    Grade: string
    GradingID: string
    SubjectID: string
    SubjectName: string
    GradeType: number
    GradeImproved: boolean
    ManuallyUpdated: boolean
    TeacherName: string
    Description: string
    IsFinalGrade: boolean
    InsertedBy: string
    LastUpdated: number
    grade_num: number
    description_decrypted: string
}

export interface Term {
    grades: Grade[]
    average: number
    countable_grades: number
}

export interface GradeSubject {
    ID: string
    Name: string
    Teachers: string[]
    terms: Term[]
    final: Grade | null
    average: number
    countable_grades: number
}
