const cores = require("./domain/cores");

module.exports = {
	getNomeCor : (idCor) =>
	{
		let _corSelecionada = "";
		
		switch(cores[idCor])
		{
			case 'red': 
				_corSelecionada = "Vermelho";
				break;
			case 'orange': 
				_corSelecionada = "Laranja";
				break;
			case 'blue': 
				_corSelecionada = "Azul";
				break;
			case 'green': 
				_corSelecionada = "Verde";
				break;
			case 'yellow': 
				_corSelecionada = "Amarelo";
				break;
				
		}
		
		return _corSelecionada;
	}
	
	
}