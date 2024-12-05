import { SubTask } from "@/app/types/subtask";
import { TaskProps } from "@/app/types/task";
import { convertWeekDaysToFutureDates } from "@/lib/utils";
import { randomUUID } from "crypto";

export const tasksToTable = (tasks: Array<any>) : Array<TaskProps> | [] => {

    if(!tasks || tasks.length === 0) return [];
    let result:TaskProps[] = [];
    tasks.forEach((task) => {
        const { id, object, properties, url, icon, cover } = task;
        if(object === "page") {
            result.push({ id: id, 
                type: properties['Type'].select.name,
                name: properties['Name'].title[0].text.content,
                weekDay: properties['Week Day'].multi_select,
                startDate: properties['Start Date'].date.start,
                endDate: properties['End Date'].date.start,
                estimatedTime: properties['Estimated Time'].number,
                url: url,
                icon: icon?.emoji,
                cover: cover?.external.url,
            })

        }
    })
    return result;
}

const taskToSubtasks = (taskProps: TaskProps): SubTask => {
    
    const subtask: SubTask = {
        parent: {
            database_id: process.env.SUBTASKS_DB!
        },
        properties: {
            Name: {
                title: [{ text: { content: taskProps.name }}]
            },
            Date: {
                date: {
                    start: taskProps.Date as string
                }
            },
            "Week Day": {
                multi_select: [{
                    name: taskProps.weekDay[0].name
                }]
            },
            "Estimated Time": {
                number: taskProps.estimatedTime as number
            }
            // Tasks: {
            //     relation: [{ id: taskProps.id }]
            // }
        }
    }

    if(taskProps.icon) {
        subtask.icon = {
            emoji: taskProps.icon
        };
    } 
    if(taskProps.cover) {
        subtask.cover = {
            external: {
                url: taskProps.cover
            }
        };
    }

    return subtask;
}

export function splitTaskByWeekDay(task: TaskProps): SubTask[] {
    // Se não houver dias da semana, retorna array vazio
    if (!task.weekDay?.length) {
        return [];
    }
    
    // Calcula as datas para divisão da task
    const weekDays = convertWeekDaysToFutureDates(task.weekDay);
    return weekDays.map((d)=>{
        const t: TaskProps = {
            ...task,
            weekDay: [{name: d.name}],
            Date: d.date as string
        }
        
        return taskToSubtasks(t);
    });
}


