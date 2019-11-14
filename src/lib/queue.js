import Bee from 'bee-queue';
import RegistrationMail from '../app/jobs/registrationMail';
import redisConfig from '../config/redis';
import { never } from 'rxjs';

//array recebendo todos os jobs. sempre q cadastrar um novo, colocar ele dentro array
const jobs = [RegistrationMail];

//pegando todos os jobs e armazenando eles dentro da variável this.queues
class Queue{
  constructor(){
    this.queues = {};

    this.init();
  }

  init(){
    jobs.forEach(({key, handle}) => {
      this.queues[key] = {
        //armazenando nossa fila q possui conexão com o banco redis
        bee: new Bee(key, {
          redis: redisConfig
        }), 
        handle // armazenando o método handle q recebe as informações/variáveis e dispara uma ação, 
        //no nosso caso, enviar email, em background
      };
    });
  }

  //método para incluir um novo job na fila pra ser processado
  addQueue(queue, job){
    return this.queues[queue].bee.createJob(job).save();
  }

  //método para processar filas 
  //recebe cada um dos jobs e processa em tempo real/background
  //toda vez q um novo job for adicionado(método 'add' acima), o método 'process' atualiza a lista e executa o job
  processQueue(){
    jobs.forEach(job => {
      const {bee, handle} = this.queues[job.key];

      //o evento 'on' vai ouvir o resultado da operação e reparar se foi 'failed'
      //se falhar, chama o método handleFailure
      bee.on('failed', this.handleFailure).process(handle);
    });
  } 

  //método para capturar e exibir um erro no processamento de uma fila
  handleFailure(job, err){
    console.log(`Queue ${job.queue.name}: FAILED `, err);
  }
}

export default new Queue();