const express = require('express');
const cores = require('./domain/cores');
const IndexController = require('./controller/indexController');
const GrupoController = require('./controller/grupoController');

const routes = express.Router();    

routes.get('/', async (req, res) => {
    
    await IndexController.PaginaInicial(req,res);

    return res.render('index', { 
                        cores : cores,
                        inscritos : req.session.inscritos,
                        totalArquivo : req.session.totalArquivo,
                        Ip: req.myIp
                    })
});

routes.get('/updateInfo', async (req,res) => 
{
    res.json(await IndexController.PaginaInicial(req,res));
})

routes.get('/atual', IndexController.Atual);

routes.get('/grupos', GrupoController.Grupos);

routes.get('/agendados', GrupoController.Agendados);

routes.get('/grupoAgendado/:idGrupo', GrupoController.GrupoAgendadoById);

routes.post('/proximoGrupo', GrupoController.ProximoGrupo);

routes.get('/grupo/:idGrupo', GrupoController.GrupoById);

routes.post('/adicionar', IndexController.Incluir);


module.exports = routes;