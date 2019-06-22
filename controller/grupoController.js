const fs = require('fs');
const path = require('path');
const Paths = require('../domain/paths');

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

const GrupoById = async (req,res) =>
{
    let arquivos = fs.readdirSync(Paths.PathPadrao);
    let _dataLine = [];

    if(fs.existsSync(path.resolve(Paths.PathPadrao,`${req.params.idGrupo}.txt`))){
        _dataLine = fs.readFileSync(path.resolve(Paths.PathPadrao,`${req.params.idGrupo}.txt`));
    }

    let _dados = _dataLine.toString("utf8");
    _dados = _dados.split('\r\n');

    return res.render('grupo', { 
        integrantes :  _dados,
        idGrupo : req.params.idGrupo
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
    GrupoById : GrupoById,
    ProximoGrupo : ProximoGrupo
} 