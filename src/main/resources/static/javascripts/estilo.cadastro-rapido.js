var Brewer = Brewer || {};

Brewer.EstiloCadastroRapido = (function(){
	function EstiloCadastroRapido(){
		//receber o modal, capturando pelo id
		this.modal = $('#modalCadastroRapidoEstilo'); 
		this.botaoSalvar = this.modal.find('.js-modal-cadastro-estilo-salvar-btn');
		this.form = this.modal.find('form');
		//receber a url do post
		this.url = this.form.attr('action');
		//recebendo o input nomeEstilo
		this.inputNomeEstilo = $('#nomeEstilo');
		this.containerMensagemErro = $('.js-mensagem-cadastro-rapido-estilo');
	
	}
	EstiloCadastroRapido.prototype.iniciar = function(){
		//event.preventDefault //vai parar o submit
		this.form.on("submit",function(event){event.preventDefault() })
		//funcao acionada ao abrir o modal
		this.modal.on('shown.bs.modal', onModalShow.bind(this));
		//funcao acionada ao fechar o modal > limpar inputs
		this.modal.on('hide.bs.modal', onModalClose.bind(this));
		//evento no click do botao
		this.botaoSalvar.on('click', onBotaoSalvarClick.bind(this));
	
	}
	function onModalShow(){
		this.inputNomeEstilo.focus();
	}
	function onModalClose(){
		this.inputNomeEstilo.val('');
		this.containerMensagemErro.addClass('hidden');
		this.form.find('.form-group').removeClass('has-error');
	}
	function onBotaoSalvarClick(){
		var nomeEstilo = this.inputNomeEstilo.val().trim();
		$.ajax({
			url: this.url, 
			method: 'POST',
			contentType: 'application/json',//enviando no formato json
			data: JSON.stringify({nome:nomeEstilo}),
			error: onErroSalvandoEstilo.bind(this),
			success: onEstiloSalvo.bind(this)
		});
	}
	function onErroSalvandoEstilo(obj){
		var mensagemErro = obj.responseText;
		this.containerMensagemErro.removeClass('hidden');//fazendo com que ele apareça
		this.containerMensagemErro.html('<span>'+mensagemErro +'</span>')//adicionando tag span dentro do container recuperado
		this.form.find('.form-group').addClass('has-error');//adicionando classe do bootstrap sobre os form-groups
	}
	function onEstiloSalvo(estilo){//ira retornar o objeto
		var comboEstilo = $('#estilo');
		comboEstilo.append('<option value='+estilo.codigo+'>'+estilo.nome+'</option>');//adicionar ao combo o novo elemento
		comboEstilo.val(estilo.codigo);
		this.modal.modal('hide');
	}

	return EstiloCadastroRapido

}());

$(function(){
	var estiloCadastroRapido = new Brewer.EstiloCadastroRapido();
	estiloCadastroRapido.iniciar();
});