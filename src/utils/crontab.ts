import cron from "node-cron";
import { TarefaService } from "../services";


//0 0 * * *    toda meia noite
cron.schedule('* * * * *', async () => {
    await TarefaService.verifyIfTarefaIsExpired();
});

function parseDate(input: string): Date {
    const parts = input.split('/');
    if (input.includes("/")) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);

        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            return new Date(year, month, day, 0, 0, 0);
        }
    }else{
        const date = new Date(input)
        return date;
    }
}

export { parseDate };