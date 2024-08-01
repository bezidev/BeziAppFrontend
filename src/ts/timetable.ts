
export interface TimetableHour {
    time: Time
    videokonferenca: Videokonferenca
    event_id: number
    color: string
    subject: Subject
    completed: boolean
    hour_special_type: string
    departments: Department[]
    classroom: Classroom
    teachers: Teacher[]
    groups: Group[]
    info: any[]
    teacher_name_short: string
    teacher_name_mobile: string
    hour: number
}

export interface Time {
    from_id: number
    to_id: number
    date: string
}

export interface Videokonferenca {
    id: any
    link: any
    zacetek: any
    opomba: any
}

export interface Subject {
    id: string
    name: string
}

export interface Department {
    id: string
    name: string
}

export interface Classroom {
    id: string
    name: string
}

export interface Teacher {
    id: string
    name: string
}

export interface Group {
    id: string
    name: string
}
