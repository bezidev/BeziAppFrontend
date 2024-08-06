export interface AbsencesResponse {
    summary: AbsenceSummary
    items: AbsenceDate[]
}

export interface AbsenceSummary {
    pending_hours: number
    excused_hours: number
    unexcused_hours: number
    unmanaged_absences: number
}

export interface AbsenceDate {
    id: number
    date: string
    missing_count: number
    excused_count: number
    not_excused_count: number
    state: string
    seen: boolean
    excuse_sent: boolean
    excuse_description?: string
    excuse_written_date: any
    hours: AbsenceHour[]
    attachments: any[]
}

export interface AbsenceHour {
    class_name: string
    class_short_name: string
    value: string
    from: string
    to: string
    state: string
}