import {Router} from 'express';
import StudentController from './src/app/controllers/StudentController';
import SessionController from './src/app/controllers/SessionController';
import authMiddleware from './src/app/middlewares/auth';
import PlanController from  './src/app/controllers/PlanController';
import RegistrationController from './src/app/controllers/RegistrationController';
import CheckinController from './src/app/controllers/CheckinController';


const routes = new Router();

//rota para autenticação no sistema
routes.post('/users', SessionController.store, () => {
  console.log('Server is running...');
});

//rota para criação de aluno 
//usando middleware de autenticação, ou seja, só pode cadastrar um aluno quem é administrador
routes.post('/create', authMiddleware, StudentController.store);

//rota para alteração dos dados de um aluno 
routes.put('/update/:id', authMiddleware, StudentController.update);
//rota para tratar atualização de aluno sem ID informado
routes.put('/update', authMiddleware, (req, res) => {
  return res.status(400).json({error: 'ID de aluno não informado'});
});

//rota para remoção de um aluno pelo ID
routes.delete('/delete/:id', authMiddleware, StudentController.delete);
//rota para tratar remoção de aluno sem ID informado
routes.delete('/delete', authMiddleware, (req, res) => {
  return res.status(400).json({error: 'ID de aluno não informado'});
});

//rota para exibição de um aluno pelo ID
routes.get('/students/:id', authMiddleware, StudentController.showById);
//rota para tratar consulta de aluno sem ID informado
routes.get('/students', authMiddleware, (req, res) => {
  return res.status(400).json({error: 'ID de aluno não informado'});
});


//rota para exibição de todos os alunos cadastrados
routes.get('/show', authMiddleware, StudentController.showAll);

//rota para exibição de todos os planos cadastrados
routes.get('/plans', authMiddleware, PlanController.show);
//rota para criação de planos
routes.post('/plans/create', authMiddleware, PlanController.store);
//rota para atualização dos dados de um plano por id
routes.put('/plans/update/:id', authMiddleware, PlanController.update);
//rota para remoçao de um plano pro id
routes.delete('/plans/delete/:id', authMiddleware, PlanController.delete);


//rota para criação de matrícula por id de student
routes.post('/register/:id', authMiddleware, RegistrationController.store);
//rota para exibição de matrícula por plano
routes.get('/registrations/show/plan', authMiddleware, RegistrationController.showByPlan);
//rota para exibição de todas as matrículas
routes.get('/registrations/show/all', authMiddleware, RegistrationController.showAll);
//rota para busca de matrícula por plano
routes.put('/registrations/update/:id', authMiddleware, RegistrationController.update);
//rota para busca de matrícula por plano
routes.delete('/registrations/delete/:id', authMiddleware, RegistrationController.delete);

//rota para checkin
routes.post('/checkin/:id', CheckinController.store);

export default routes;