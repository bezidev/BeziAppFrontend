export interface LoginResponse {
    type: string
    data: string
    session: string
    palette: any[]
    is_global_administrator: boolean
    is_radio_administrator: boolean
    is_upload_moderator: boolean
    error: any
}
