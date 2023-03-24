export interface ClinicHistory {
    id_patient: number;
    names_patient: string;
    lastnames_patient: string;
    birthday_patient: Date;
    gender_patient: string;
    phone_patient: number;
    address_patient: string;
    city_patient: string;
    civilstatus_patient: string;
    created_at: string;
    updated_at: string;
    details: Detail[];
    error?: string
}

export interface Detail {
    id_detail: number;
    id_patient: number;
    timestamp_ch_detail: Date;
    reason_ch_detail: string;
    weight_ch_detail: number;
    height_ch_detail: number;
    recommendation_ch_detail: string;
    created_at: string;
    updated_at: string;
}
