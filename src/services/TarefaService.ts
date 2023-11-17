import { IUsuarios, ITarefa, Tarefa } from "../models";
import { parseDate } from "../utils/crontab";
import { PERMISSAO, STATUS } from "../utils/enum";
import ObjetivoService from "./ObjetivoService";
import mongoose from "mongoose";


class TarefaService {

    public async createTarefa(titulo, descricao, data_estimada, prioridade, objetivo) {
        try {
            const tarefa = new Tarefa({
                titulo: titulo,
                descricao: descricao,
                data_estimada: data_estimada,
                prioridade: prioridade
            })
            const response = await tarefa.save();
            objetivo.tarefas.push(response);
            await objetivo.save();
            return response;
        } catch (error) {
            throw error
        }
    }

    public async findTarefasByObjetivoId(id) {
        try {
            const objetivo = await ObjetivoService.getObjetivoById(id);
            let tarefas = objetivo.tarefas
            if (tarefas.length > 1) {
                tarefas.sort((a, b) => {
                    const dataEstimadaA = new Date(a.data_estimada.split('/').reverse().join('-')).getTime();
                    const dataEstimadaB = new Date(b.data_estimada.split('/').reverse().join('-')).getTime();
                    const dataAtual = new Date().getTime();

                    const diferencaA = Math.abs(dataEstimadaA - dataAtual);
                    const diferencaB = Math.abs(dataEstimadaB - dataAtual);

                    if (a.prioridade === b.prioridade) {
                        return diferencaA - diferencaB;
                    } else {
                        return a.prioridade - b.prioridade;
                    }
                });
            }

            return tarefas;
        } catch (error) {
            throw error;
        }
    }

    public async findTaskByID(id): Promise<ITarefa> {
        try {
            const tarefas = await Tarefa.findOne({ _id: id }).populate('usuarios.usuario')
            if (!tarefas) {
                throw `Tarefa ${id} não encontrada.`;
            }
            return tarefas;
        } catch (error) {
            throw error;
        }
    }

    public async deleteTarefa(id: string) {
        try {
            const deleteTarefa = await Tarefa.findByIdAndDelete(id)
            return deleteTarefa
        } catch (error) {
            throw error;
        }
    }

    public async changePriority(id: string, novaPrioridade: any) {
        try {
            const tarefa = await Tarefa.findById(id)
            if (!tarefa) {
                throw `Tarefa ${id} não encontrada.`;
            }
            const prioridadeTarefa = await tarefa.updateOne({ prioridade: novaPrioridade })
            return prioridadeTarefa
        } catch (error) {
            throw error
        }
    }

    public async editarTarefa(tarefaId: string, titulo: string, descricao: string, data_estimada: string, prioridade: number) {
        try {
            const tarefa = await Tarefa.findById(tarefaId);
            if (!tarefa) {
                throw `Tarefa com ID ${tarefaId} não encontrada.`;
            }
            if (titulo) {
                tarefa.titulo = titulo;
            }
            if (descricao) {
                tarefa.descricao = descricao;
            }
            if (data_estimada) {
                tarefa.data_estimada = data_estimada;
            }
            if (prioridade) {
                tarefa.prioridade = prioridade;
            }
            const tarefaAtualizada = await tarefa.save();
            return tarefaAtualizada;
        } catch (error) {
            throw error;
        }
    }



    public async updateUsuarios(id: string, novosUsuarios: IUsuarios[]) {
        try {
            const novaLista = novosUsuarios.map((usuario) => {
                return { usuario: new mongoose.Types.ObjectId(usuario._id), permissao: PERMISSAO.MEMBRO };
            });

            const tarefa = await Tarefa.findById(id);

            if (tarefa) {
                // Verifique se o usuário já está na lista
                const usuariosParaAdicionar = novaLista.filter((novoUsuario) => {
                    return !tarefa.usuarios.some((usuarioNaTarefa) => usuarioNaTarefa.usuario.equals(novoUsuario.usuario));
                });

                if (usuariosParaAdicionar.length > 0) {
                    // Adicione os novos usuários à lista
                    tarefa.usuarios.push(...usuariosParaAdicionar);
                    await tarefa.save();
                }
            }
            if (!tarefa) {
                throw `tarefa ${id} não encontrado.`;
            }

            // tarefa.usuarios = novosUsuarios;
            //await tarefa.save();
            return tarefa;
        } catch (error) {
            throw error;
        }
    }

    public async changeTaskStatus(id, status) {
        try {
            const task = await this.findTaskByID(id);
            task.status = status;
            await Tarefa.findByIdAndUpdate(id, task);
            return task;
        } catch (error) {
            throw error;
        }
    }

    public async onDeleteObjetivoDeleteAllTarefas(tarefas) {
        const session = await mongoose.startSession();
        session.startTransaction()
        try {
            const options = { session };
            const filtro = { _id: { $in: tarefas } };
            await Tarefa.deleteMany(filtro, options);
            const result = await session.commitTransaction()
            return result;
        } catch (error) {
            await session.abortTransaction();
            session.endSession()
            throw error;
        }
    }

    public async findTarefaByStatus(objetivo, status): Promise<ITarefa[]> {
        try {
            const tarefas = objetivo.tarefas || [];
            // Filtra as tarefas com o status desejado
            const tarefasFiltradas = tarefas.filter((tarefa: ITarefa) => tarefa.status == status);

            return tarefasFiltradas;
        } catch (error) {
            throw error;
        }
    }

    public async findTarefasExpiradasUsuario(usuario): Promise<ITarefa[]> {
        try {
            const objetivos = await ObjetivoService.findAllObjetivosByUser(usuario)

            const tarefas: ITarefa[] = [].concat(...objetivos.map(objetivo => objetivo.tarefas));

            tarefas.sort((a, b) => {
                const dataA = new Date(a.data_estimada);
                const dataB = new Date(b.data_estimada);

                //Verificação para ver se alguma das datas é inválida
                if (!this.isCorrectDate(dataA))
                    console.warn(`TAREFA DE ID ${a._id} POSSUI DATA INVALIDA {${dataA}} `);
                if (!this.isCorrectDate(dataB))
                    console.warn(`TAREFA DE ID ${b._id} POSSUI DATA INVALIDA {${dataB}} `);

                return dataB.getDate() - dataA.getDate();
            });

            return tarefas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @param date data a testar
     * @returns Verdadeiro caso a data seja válida para o new Date(). Falso caso seja NaN ou invalida
     */
    public isCorrectDate = (date: Date): boolean => {
        return date instanceof Date && isFinite(+date);
    };

    public async isTarefaExpired(tarefa: ITarefa): Promise<Boolean> {
        try {
            const dataAtual = new Date();
            const deadlineTarefa = new Date(tarefa.data_estimada);

            return dataAtual > deadlineTarefa;
        } catch (error) {
            throw error;
        }
    }

    public async verifyIfTarefaIsExpired() {
        try {
            const tarefas = await Tarefa.find();
            let ids = []
            if (tarefas.length) {
                const today: Date = new Date();
                for (let i = 0; i < tarefas.length; i++) {
                    const data_estimada = parseDate(tarefas[i].data_estimada);
                    if (data_estimada) {
                        if (data_estimada < today) {
                            if (tarefas[i].status != STATUS.ATRASADO) {
                                ids.push(tarefas[i]._id)
                            }
                        }
                    }
                    if (ids.length) {
                        await Tarefa.updateMany({ _id: { $in: ids } }, { $set: { status: STATUS.ATRASADO } });
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    public async updateChronometer(id: string, novoCronometro: number) {
        try {
            const tarefa = await Tarefa.findById(id);
            if (!tarefa) {
                throw `Tarefa com ID ${id} não encontrada.`;
            }
            tarefa.cronometro = novoCronometro;
            const tarefaAtualizada = await tarefa.save();
            return tarefaAtualizada;
        } catch (error) {
            throw error;
        }
    }


    public async findChronometer(id: string) {
        try {
            const tarefa = await Tarefa.findById(id);
            if (!tarefa) {
                throw `Tarefa com ID ${id} não encontrada.`;
            }
            const cronometro = tarefa.cronometro;
            return cronometro;
        } catch (error) {
            throw error;
        }
    }


// A ideia é criar uma rota onde a fazer uma requisição ela verifique se o botão de play foi apertado
// caso o botão ja tenha sido apertado retornar a diferença de tempo entre o primeiro play e o segundo
// obtendo assim o tempo decorrido dentre um play e o outro, podendo assim o usuario desligar o dispositivo
// e a cada diferença coletada somar o tempo total decorrido

//true == botão play apertado e o cronometro rodando
//false == botão play não iniciado

    public async changePlayTimeAndCalcDiff(id: string) {
        try{
            const tarefa = await Tarefa.findById(id);
            if(!tarefa.play){
                //pega o valor de agora e altera play para false, ira sempre cair aqui primeiro pois o campo paly é false por default
                tarefa.lastPlayTime = Date.now();
                tarefa.play = !tarefa.play
            }else{
                const diff = Date.now() - tarefa.lastPlayTime;
                tarefa.cronometro += diff;
                tarefa.play = !tarefa.play;
            }
            return await tarefa.save();
        }catch(error){
            throw error;
        }
    }

}

export default new TarefaService();