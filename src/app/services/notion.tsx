import { Client } from '@notionhq/client';
import { SubTask } from '../types/subtask';
import { delay } from '@/lib/utils';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export const NotionService =  {
    async getDatabase(databaseId: string) {
      try {
        const response = await notion.databases.query({
          database_id: databaseId,
          // add filters if need
          // filter: {
          //   property: 'Status',
          //   status: {
          //     equals: 'Done'
          //   }
          // }
        });
        
        return response.results;
      } catch (error) {
        console.error('Error fetching database:', error);
        throw error;
      }
    },

    // Method by get especific page
    async getPage(pageId: string) {
      try {
        const response = await notion.pages.retrieve({
          page_id: pageId,
        });
        return response;
      } catch (error) {
        console.error('Error fetching page:', error);
        throw error;
      }
    },

    async createSubTask(data: SubTask) {
      try {
        const subtask: any = data;
        console.log('SUB >>>>>', subtask);
        const response = await notion.pages.create(subtask);
        return response;
      } catch (error) {
        console.error('Erro ao criar a subtarefa:', error);
        throw error;
      }
    },

     /**
     * Cria uma subtarefa no Notion com retentativas.
     * @param data Dados da subtarefa.
     * @param maxRetries Número máximo de tentativas.
     * @param retryDelay Tempo de espera entre as tentativas em milissegundos.
     * @returns A subtarefa criada ou `null` se todas as tentativas falharem.
     */
    async createSubTaskWithRetry(data: SubTask, maxRetries = 3, retryDelay = 1000): Promise<any | null> {
      let retries = 0;

      while (retries <= maxRetries) {
          try {
              const subtask: any = data;
              const response = await notion.pages.create(subtask);
              return response; // Retorna a resposta em caso de sucesso
          } catch (error) {
              retries++;
              console.error(`Erro ao criar a subtarefa (tentativa ${retries}):`, error);

              if (retries <= maxRetries) {
                  console.warn(`Tentando novamente em ${retryDelay}ms...`);
                  await delay(retryDelay); // Aguarda antes da próxima tentativa
              }
          }
      }

      console.error(`Falha ao criar a subtarefa após ${maxRetries} tentativas.`);
      return null; // Retorna null se todas as tentativas falharem
    }
  };