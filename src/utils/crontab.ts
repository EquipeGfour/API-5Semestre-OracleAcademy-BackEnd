import cron from "node-cron";
import { TarefaService } from "../services";


//0 0 * * *    toda meia noite
//0 * * * *
cron.schedule('0 * * * *', async () => {
    await TarefaService.verifyIfTarefaIsExpired();
});

function parseDate(input: string): String {
    if (input.includes("/")) {
       return input
    }else{
        const date = new Date(input)
        const formatedDate = date.toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"}).split(',')[0]
        return formatedDate;
    }
}

export { parseDate };