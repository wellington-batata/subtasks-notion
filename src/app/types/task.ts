import { Week, WeekDay } from "./weekDay";

export interface TaskProps {
    id: string,
    name: string,
    type: string,
    weekDay: Week[],
    startDate?: string,
    endDate?: string,
    estimatedTime?: number,
    icon?: string,
    url?: string,
    cover?: string,
    Date?: string,
} 