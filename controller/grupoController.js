const fs = require('fs');
const path = require('path');
const Paths = require('../domain/paths');
const cores = require('../domain/cores');
const helper = require('../helper.js');

const Grupos = async (req,res) =>
{
    let arquivos = fs.readdirSync(Paths.PathPadrao);
    let _totalArquivos = fs.readdirSync(Paths.PathPadraoParticipante).length;

    return res.render('grupos', { 
        arquivos : arquivos,
        GrupoAtual: _totalArquivos,
        Ip: req.myIp
    })
}

const Agendados = async (req,res) =>
{
    let arquivos = fs.readdirSync(Paths.PathAgendados);

    return res.render('agendados', { 
        arquivos : arquivos,
        Ip: req.myIp
    })
}

const GrupoAgendadoById  = async (req,res) =>
{
    let arquivos = fs.readdirSync(Paths.PathAgendados);
    let _dataLine = [];
	let _indexCorSelecionada = 0;

    if(fs.existsSync(path.resolve(Paths.PathAgendados,`${req.params.idGrupo}.txt`))){
        _dataLine = fs.readFileSync(path.resolve(Paths.PathAgendados,`${req.params.idGrupo}.txt`));
    }
	
	_indexCorSelecionada = (req.params.idGrupo - 1) % cores.length;
		
    let _dados = _dataLine.toString("utf8");
    _dados = _dados.split('\r\n');

    return res.render('grupoAgendado', { 
        integrantes :  _dados,
        idGrupo : req.params.idGrupo,
		corSelecionada : helper.getNomeCor(_indexCorSelecionada)
    });
}

const GrupoById = async (req,res) =>
{
    let arquivos = fs.readdirSync(Paths.PathPadrao);
    let _dataLine = [];
	let _indexCorSelecionada = 0;

    if(fs.existsSync(path.resolve(Paths.PathPadrao,`${req.params.idGrupo}.txt`))){
        _dataLine = fs.readFileSync(path.resolve(Paths.PathPadrao,`${req.params.idGrupo}.txt`));
    }
	
	_indexCorSelecionada = (req.params.idGrupo - 1) % cores.length;
		
    let _dados = _dataLine.toString("utf8");
    _dados = _dados.split('\r\n');

    return res.render('grupo', { 
        integrantes :  _dados,
        idGrupo : req.params.idGrupo,
		corSelecionada : helper.getNomeCor(_indexCorSelecionada)
    });
}

const ProximoGrupo = async (req,res) =>
{
    let _totalArquivos = fs.readdirSync(Paths.PathPadraoParticipante).length;
    
    _totalArquivos++;

    if(fs.existsSync(path.resolve(Paths.PathPadrao,`${_totalArquivos}.txt`)))
    {
        fs.copyFileSync(path.resolve(Paths.PathPadrao,`${_totalArquivos}.txt`),
                        path.resolve(Paths.PathPadraoParticipante,`${_totalArquivos}.txt`));
    }

    req.io.emit('updateGrupo', {
        GrupoAtual: _totalArquivos,
    });

    return res.json({ 
        ProximoGrupo :  _totalArquivos
    });
}

module.exports = {
    Grupos : Grupos,
    Agendados: Agendados,
    GrupoById : GrupoById,
    GrupoAgendadoById : GrupoAgendadoById,
    ProximoGrupo : ProximoGrupo
} 