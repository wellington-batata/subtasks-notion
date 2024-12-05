import { delay } from '@/lib/utils';
import { NotionService } from '../../services/notion';
import { splitTaskByWeekDay, tasksToTable } from './parser'
import { postSubTaskSchema } from './subtask.validate';
import { NextRequest } from 'next/server';


export async function GET() {
  try {
    const data = await NotionService.getDatabase(
      process.env.TASKS_DB!
    );

    const result = tasksToTable(data);

    return Response.json(result);
  } catch (error) {
    console.error('Error in API route:', error);
    return Response.json({ message: 'Internal server error' });
  }
}


export async function POST(req: NextRequest) {
  try {
    const taskList:any = await req.json();
    console.log(taskList);

    for(const t of taskList) {
      t.parent = {
        database_id: process.env.SUBTASKS_DB
      }
      const validate = postSubTaskSchema(t);
      if(validate.success) {
        await NotionService.createSubTask(t);
        await delay(2000);
      } else {
        console.error('Error in API route:', validate.error.errors);
        return Response.json({ message: 'Internal server error' });
      }
    }

    return Response.json({ms: 'ok'});

  } catch (error) {
    console.error('Error in API route:', error);
    return Response.json({ message: 'Internal server error' });
  }
}


