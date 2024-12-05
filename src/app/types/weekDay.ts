/**
 * Tipo que define os dias da semana aceitos
 */
export type WeekDay = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Everyday';

export type WeekDate = {
    name: string,
    date: String
}

export interface Week {
    id?: string,
    name: string,
    color?: string
}

export enum daysMap {
    'Sunday' = 0,
    'Monday' = 1,
    'Tuesday'= 2,
    'Wednesday'= 3,
    'Thursday'= 4,
    'Friday'= 5,
    'Saturday'= 6
};