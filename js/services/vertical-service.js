angular.module('verticalService', [])
	
	.service("extracaoService", function($q, $http, $timeout) {		

		this.extraiCaptcha = function(captchaBase64){
			return $q( function(resolve, reject){
				var req = {
					method: 'POST',
					url: 'http://2captcha.com/in.php',
					data: {
						'key': '',
						'method': 'base64',
						'body': captchaBase64
					}
				}
				//$scope.status = "3.1) Efetuando post do captcha";
				$http(req).then((response) => {				
					console.log(response);
					//$scope.status = "3.2) Recuperando a resposta (1º Tentativa)";
					var retorno = response.data.split("|");
					var status = retorno[0];
					var idCallback = retorno[1];
					if ( retorno[0] == "OK"){
						var urlGet = 'http://2captcha.com/res.php?key=&action=get&id='+idCallback;
						var tempoEntreTentativas = 10000;
						setTimeout(()=>{
							$http.get(urlGet)
		  						.then((responseCaptcha1) => {
		  							if ( getCod(responseCaptcha1) == "OK" ){
		  								resolve(responseCaptcha1.data.split("|")[1])

		  							} else if (getCod(responseCaptcha1) == "CAPCHA_NOT_READY"){
		  								//$scope.status = "3.2) Recuperando a resposta (2º Tentativa)";
		  								setTimeout(()=>{
											$http.get(urlGet)
						  						.then((responseCaptcha2) => {
						  							if ( getCod(responseCaptcha2) == "OK" ){
						  								resolve(responseCaptcha2.data.split("|")[1])

						  							} else if (getCod(responseCaptcha2) == "CAPCHA_NOT_READY"){
						  								//$scope.status = "3.2) Recuperando a resposta (3º Tentativa)";
						  								setTimeout(()=>{
															$http.get(urlGet)
										  						.then((responseCaptcha3) => {
										  							if ( getCod(responseCaptcha3) == "OK" ){
										  								resolve(responseCaptcha3.data.split("|")[1])

										  							} else if (getCod(responseCaptcha3) == "CAPCHA_NOT_READY"){
										  								//$scope.status = "3.2) Recuperando a resposta (4º Tentativa)";
										  								setTimeout(()=>{
																			$http.get(urlGet)
														  						.then((responseCaptcha4) => {
														  							if ( getCod(responseCaptcha4) == "OK" ){
														  								resolve(responseCaptcha4.data.split("|")[1])

														  							} else {
														  								reject("CAPTCHA NAO EXTRAIDO");
														  							}
														  						});
																		},tempoEntreTentativas);
										  							} else {
										  								reject("CAPTCHA NAO EXTRAIDO");
										  							}
										  						});
														},tempoEntreTentativas);

						  							} else {
						  								reject("CAPTCHA NAO EXTRAIDO");
						  							}
						  						});
										},tempoEntreTentativas);

		  							} else {
		  								reject("CAPTCHA NAO EXTRAIDO");
		  							}
		  						});
						},tempoEntreTentativas);

					}
				});
			});
		}

		function getCod(obj){
			return obj.data.split("|")[0];
		}
	})

	

