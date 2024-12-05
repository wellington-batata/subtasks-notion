import { WeekDay } from "./weekDay";

// LOCAL MODEL
export interface SubTaskProps {
    name: string,
    type: string,
    weekDay: WeekDay[],
    startDate?: string,
    endDate?: string,
    estimatedTime?: number,
    icon?: string,
    url?: string,
    cover?: string,
} 
// NOTION MODEL
export type SubTask = {
    id?: string,
    parent: Parent;
    icon?: Icon;
    cover?: Cover;
    properties: Properties;
}

interface Parent {
    database_id: string;
}

interface Icon {
    emoji: string;
}

interface Cover {
    external: {
        url: string;
    };
}

interface Properties {
    Name: NameProperty;
    Date: DateProperty;
    "Week Day": WeekDayProperty;
    "Estimated Time": EstimatedTimeProperty;
    Tasks?: TasksProperty;
}

interface NameProperty {
    title: Array<{
        text: {
            content: string;
        };
    }>;
}

interface DateProperty {
    type?: "date";
    date: {
        start: string;
    };
}

interface WeekDayProperty {
    type?: "multi_select";
    multi_select: Array<{
        name: string;
        color?: string;
    }>;
}

interface EstimatedTimeProperty {
    type?: "number";
    number: number;
}

interface TasksProperty {
    type?: "relation";
    relation?: Array<{
        id?: string;
    }>;
}