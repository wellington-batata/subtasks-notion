import { WeekDay, WeekDate, Week, daysMap } from "@/app/types/weekDay";
import { clsx, type ClassValue } from "clsx"
import { mdxCompile } from "next/dist/build/swc/generated-native";
import { twMerge } from "tailwind-merge"
import { number } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateText(text: string, maxLength: number = 100): string {
  // Verifica se o texto é válido e se precisa ser truncado
  if (!text || text.length <= maxLength) {
      return text;
  }

  // Retorna o texto truncado com reticências
  return `${text.slice(0, maxLength)}...`;
}


  // Função auxiliar para calcular próxima data
export const getNextDate = (targetDay: number): string => {
    const today = new Date();
    const date = new Date(today);
    
    // Adiciona dias até encontrar o dia da semana desejado
    while (date.getDay() !== targetDay) {
        date.setDate(date.getDate() + 1);
    }
    
    return date.toISOString().split('T')[0];
};

/**
 * Converte lista de dias da semana em suas respectivas datas futuras
 * @param weekDays Array de dias da semana
 * @returns Array de objetos WeekDayDate
 */
export function convertWeekDaysToFutureDates(weekDays: Week[]): WeekDate[] {
  const result: WeekDate[] = [];
  weekDays.forEach(day => {
      if (day.name === 'Everyday') {
          // Adiciona todos os dias da semana
        for (let i = 0; i <= 6; i++) {
            const mDay = {
                name: daysMap[i].toString(),
                date: getNextDate(i)
            }
            console.log(mDay);
            result.push(mDay);
        }
      } else {
          // Adiciona o dia específico
          result.push({
              name: day.name,
              date: getNextDate(daysMap[day.name as keyof typeof daysMap])
          });
      }
  });
  
  return result;
}


export const extractDaysWeek = (weekdays: Week[]) => {
    const names = weekdays.map((w) => w.name);
    return names.toString()
}

/**
 * Função auxiliar para criar uma Promise que resolve após um determinado tempo.
 * @param ms Tempo em milissegundos.
 * @returns Uma Promise que resolve após o tempo especificado.
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * Classe para controlar o tempo de execução de um método.
 */
export class TimeController {
    private startTime: number | null = null;

    /**
     * Inicia o contador de tempo.
     */
    start(): void {
        this.startTime = performance.now();
    }

    /**
     * Para o contador de tempo e retorna o tempo de execução em milissegundos.
     * @returns Tempo de execução em milissegundos ou null se o contador não foi iniciado.
     */
    stop(): number | null {
        if (this.startTime === null) {
            return null;
        }

        const endTime = performance.now();
        const executionTime = endTime - this.startTime;
        this.startTime = null; // Reinicia o contador
        return executionTime;
    }
}