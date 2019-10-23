import {Router} from 'express';
import StudentController from './src/app/controllers/StudentController';
import SessionController from './src/app/controllers/SessionController';
import authMiddleware from './src/app/middlewares/auth';


const routes = new Router();

//rota para autenticação no sistema
routes.post('/users', SessionController.store, () => {
  console.log('Server is running...');
});

//rota para criação de aluno 
//usando middleware de autenticação, ou seja, só pode cadastrar um aluno quem é administrador
routes.post('/create', authMiddleware, StudentController.create);

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


export default routes;