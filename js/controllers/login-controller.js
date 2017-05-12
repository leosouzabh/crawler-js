angular.module('verticalvert').controller('LoginController', function($scope, extracaoService, $http, $q) {
	
	$scope.cnpj = '00727694000163';
	$scope.dados = {
		preenchido: false,
		nroInscricao: '',
   		abertura: '',
   		nomeEmpresarial: '',
		nomeFantasia: '',
		codDescAtividade: ''
	},

	$scope.conectar = function(){
		$scope.status = "1) Abrindo página inicial";
		
		$http.get('https://www.receita.fazenda.gov.br/pessoajuridica/cnpj/cnpjreva/cnpjreva_solicitacao2.asp')
			.then((response) => {				
				$scope.status = "2) Carregando captcha";
				return toDataURL('https://www.receita.fazenda.gov.br/pessoajuridica/cnpj/cnpjreva/captcha/gerarCaptcha.asp');
			})
			.then((captchaBase64) => { 
				$scope.status = "3) Quebrando captcha";
				return extracaoService.extraiCaptcha(extraiBase64(captchaBase64));
			})
			.then((captchaContent) => {
				$scope.status = "4) Postando formulario";
				console.log(captchaContent);
				var req = {
					method: 'POST',
					url: 'https://www.receita.fazenda.gov.br/pessoajuridica/cnpj/cnpjreva/valida.asp',
					data: {
						'origem':'comprovante',
						'cnpj': $scope.cnpj,
						'txtTexto_captcha_serpro_gov_br':captchaContent,
						'submit1':'Consultar',
						'search_type':'cnpj'
					}
				}
				return $http(req);
			})
			.then((conteudo) => {
				console.log(conteudo.data);
				var html = conteudo.data;
				
				var tables = $($("table", $(html))[2]).find("table");
				
				//header
				var tds = $(tables[1]).find("td");
				$scope.dados.nroInscricao = $($(tds[0]).find("font")[1]).text().trim();
				$scope.dados.abertura = $($(tds[2]).find("font")[1]).text().trim();

				//empresariado
				var tds = $(tables[2]).find("td");
				$scope.dados.nomeEmpresarial = $($(tds[0]).find("font")[1]).text().trim();

				//fantasia
				var tds = $(tables[3]).find("td");
				$scope.dados.nomeFantasia = $($(tds[0]).find("font")[1]).text().trim();

				//codigo e Descrição da Atividade
				var tds = $(tables[4]).find("td");
				$scope.dados.codDescAtividade = $($(tds[0]).find("font")[1]).text().trim();

				$scope.dados.preenchido = true;

			})

		//00727694000163
	}

	function extraiBase64(captchaBase64){
		return captchaBase64.replace("data:image/png;base64,", "");
	}

	function toDataURL(url) {
		return $q( function(resolve, reject){
			var xhr = new XMLHttpRequest();
			xhr.onload = function() {
				var reader = new FileReader();
				reader.onloadend = function() {
					console.log('Resolvendo');
					console.log(reader.result);
					resolve(reader.result);
				}
				reader.readAsDataURL(xhr.response);
			};
		  	xhr.open('GET', url);
		  	xhr.responseType = 'blob';
		  	xhr.send();
		});
	}

	function getCod(obj){
		return obj.data.split("|")[0];
	}
	
});