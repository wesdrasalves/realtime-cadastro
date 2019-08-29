const fs = require('fs');
const path = require('path');
const Paths = require('../domain/paths');
const TotalPessoasGrupo = 15;
const cores = require('../domain/cores');


const getLength = () =>
{
    var x = fs.readdirSync(Paths.PathPadrao);
    return x.length ;
}

const getLengthLastFile = (totalArquivo) =>
{
    let _total = 0;

    if(fs.existsSync(path.resolve(Paths.PathPadrao,`${totalArquivo}.txt`))){
        _dataLine = fs.readFileSync(path.resolve(Paths.PathPadrao,`${totalArquivo}.txt`));
        _total = _dataLine.toString().split('\n').length;;
    }

    return _total-1;
}

const PaginaInicial  = async (req,res) =>
{
    if(!Number.isInteger(req.session.inscritos))
    {
        req.session.inscritos = 0;
        req.session.totalArquivo = 0;
    }

    req.session.totalArquivo = getLength();
    
    if(req.session.totalArquivo > 0)
    {
        req.session.inscritos = (req.session.totalArquivo - 1) * TotalPessoasGrupo;
        req.session.inscritos = getLengthLastFile(req.session.totalArquivo);            
    }
    else{
        req.session.inscritos = 0;
    }

    return {
        totalArquivos: req.session.totalArquivo,
        inscritos: req.session.inscritos,
    }
}

const Incluir = async (req,res) =>
{
    let _fileName = ''; 
    let _arquivo = 0;

    await PaginaInicial(req,res);

    _arquivo = req.session.totalArquivo;

    if(req.session.inscritos % TotalPessoasGrupo == 0)
        _arquivo++;

	

    _fileName = path.resolve(Paths.PathPadrao,`${_arquivo}.txt`);

    try{

		if(req.session.inscritos == TotalPessoasGrupo)
			if(fs.existsSync(path.resolve(Paths.PathAgendados,`${_arquivo}.txt`)))
			{
				fs.copyFileSync(path.resolve(Paths.PathAgendados,`${_arquivo}.txt`), _fileName);
				//fs.unlink(path.resolve(Paths.PathAgendados,`${_arquivo}.txt`));
			}
	
        fs.appendFileSync(_fileName, `${req.body.nome};${req.body.cristao}\r\n`);

        if(req.session.inscritos == TotalPessoasGrupo)
        {
            req.session.totalArquivo++;
			
			let _dataLine = fs.readFileSync(_fileName);
			
			let _dados = _dataLine.toString("utf8");
			_dados = _dados.split('\r\n');
			
			
            req.session.inscritos = _dados.length;
			
        }
        else
            req.session.inscritos++;

        req.io.emit('add', {
                        nome: req.body.nome,
                        inscritos: req.session.inscritos,
                        totalArquivo: req.session.totalArquivo
                    });
    }
    catch(e)
    {
        res.status(500);
        return res.json({ok: false, mensagem :'Dados não foram salvos'});   
    }

    return res.json({ok:true});   
}


const Atual = (req,res) => {
    let _grupoAtual = fs.readdirSync(Paths.PathPadraoParticipante).length;
    let _dataLine = [];

    if(fs.existsSync(path.resolve(Paths.PathPadraoParticipante,`${_grupoAtual}.txt`))){
        _dataLine = fs.readFileSync(path.resolve(Paths.PathPadraoParticipante,`${_grupoAtual}.txt`));
    }

    let _dados = _dataLine.toString("utf8");
    _dados = _dados.split('\r\n');

    return res.render('atual', {
        cores : cores,
        integrantes :  _dados,
        idGrupo : _grupoAtual,
        Ip: req.myIp
    });
}


module.exports = {
    PaginaInicial : PaginaInicial,
    Incluir : Incluir,
    Atual : Atual
} 