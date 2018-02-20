function validarMaxMin(element){
    var msgElement = document.querySelectorAll('[data-message-for="' + element.id + '"]')[0];
    
    if(msgElement){
        msgElement.innerText = '';
        var min = element.getAttribute('min');
        var max = element.getAttribute('max');        
        var value = element.value;
        
        if(min && (value < min) ){
            msgElement.innerText = ' o valor não pode ser menor que ' + min;
        }
        if(max && (value > max)){
            msgElement.innerText = ' o valor não pode ser maior que ' + max;
        }
    }
}

function validarMaxMinLength(element){
    var msgElement = document.querySelectorAll('[data-message-for="' + element.id + '"]')[0];
    console.log('Validanting MaxMinLength: ', element);
    if(msgElement){
        msgElement.innerText = '';
        var min = element.getAttribute('minlength');
        var max = element.getAttribute('maxlength');        
        var value = (element.value || '').length;
        
        if(min && (value < min) ){
            msgElement.innerText = ' o comprimento não pode ser menor que ' + min;
        }
        if(max && (value > max)){
            msgElement.innerText = ' o comprimento não pode ser maior que ' + max;
        }
    }
}


function clickUpload(elementId){
    var el = document.querySelector(elementId);
    el.focus();el.click();
}

function fileChange(fileElement){
    var fileSize = parseFloat((fileElement.files[0].size || '')/1024/1024).toFixed(2) ;
    document.querySelector('#file-surrogate').value = (fileElement.files[0].name || '') + ' - ' + fileSize + 'MB';
    
    var msgElement = document.querySelectorAll('[data-message-for="' + fileElement.id + '"]')[0];
    if(msgElement){
        msgElement.innerText = '';
        if(fileSize > 3){
            if(msgElement) msgElement.innerText = 'o arquivo é maior que 3MB';
        }

    }
}

function validarCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
	if (strCPF == "00000000000") return false;
    
	for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
	Resto = (Soma * 10) % 11;
	
    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;
	
	Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;
	
    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
}

//Dedicated functions
function cpfKeyUp(element){
    var msgElement = document.querySelectorAll('[data-message-for="' + element.id + '"]')[0];
    if(msgElement){
        msgElement.innerText = '';
        var cpfStr = (element.value || '').trim().replace('-', '');
        console.log('cpfStr: ', cpfStr);
        var cfpIsValid = validarCPF(cpfStr);
        var cfpNomerico = (/^\d+$/.test(cpfStr));

        if(cpfStr && (!cfpIsValid || !cfpNomerico) ){
            console.log('CPF is invalid');
            if(msgElement) msgElement.innerText = 'CPF inválido';
        }
    }
}


function validaEmail(emailStr){
    var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailPattern.test((emailStr || '').trim());
}

function emailKeyDown(element){
    var msgElement = document.querySelectorAll('[data-message-for="' + element.id + '"]')[0];
    if(msgElement) msgElement.innerText = '';
    var emailStr = (element.value || '').trim();

    if(emailStr && !validaEmail(emailStr) ){
        console.log('Email is invalid');
        if(msgElement) msgElement.innerText = 'email inválido';
    }   

}

function confirmaEmail(){
    var emailValue = document.querySelector('#Email').value;
    var emailConfirmaValue = document.querySelector('#ConfirmeEmail').value;
    return emailValue.toLocaleLowerCase() == emailConfirmaValue.toLocaleLowerCase();

}

//testio
function confirmaEmailOnBlur(element){
    var msgElement = document.querySelectorAll('[data-message-for="' + element.id + '"]')[0];
    if(msgElement) msgElement.innerText = '';
    if(!confirmaEmail()){
        if(msgElement) msgElement.innerText = 'o e-mail e a confirmação devem ser iguais.';
    }
}
function cepFocus(){
    console.log('cepFocus: ');
    //document.querySelectorAll('.cep-wrap .loading')[0].classList.remove('hidden');
}
function cepBlur(){
    console.log('cepBlur: ');
    //document.querySelectorAll('.cep-wrap .loading')[0].classList.add('hidden')
}

function getEndereco(cep ){
    document.querySelectorAll('.cep-wrap .loading.searching')[0].classList.remove('hidden'); 
    document.querySelectorAll('.cep-wrap .loading.not-found')[0].classList.add('hidden');           
    document.querySelectorAll('.cep-wrap .loading.valida-ok')[0].classList.add('hidden');

    
    var msgElement = document.querySelectorAll('[data-message-for="CEP"]')[0];
    if(msgElement) msgElement.innerText = '';    

    var cepURL = 'https://viacep.com.br/ws/' + cep + '/json/';
    var xhr = new XMLHttpRequest(),
        method = "GET";
    xhr.open(method, cepURL, true);
 	xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = setCEPDataValue.bind(null, xhr);
    xhr.send(); 
    function setCEPDataValue(xhr){
        if(msgElement) msgElement.innerText = '';   
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log(xhr.responseText);
            var data = JSON.parse(xhr.responseText);
            setFieldValue("#Endereco", data.logradouro);
            data.complemento && setFieldValue("#Complemento", data.complemento);
            data.bairro && setFieldValue("#Bairro", data.bairro);
            setFieldValue("#Cidade", data.localidade);
            setFieldValue("#UF", data.uf); 
            document.querySelectorAll('.cep-wrap .loading.not-found')[0].classList.add('hidden');
            document.querySelectorAll('.cep-wrap .loading.searching')[0].classList.add('hidden');            
            document.querySelectorAll('.cep-wrap .loading.valida-ok')[0].classList.remove('hidden');
        }else{
            //TODO: show 'CEP not found'
            document.querySelectorAll('.cep-wrap .loading.not-found')[0].classList.remove('hidden');
            document.querySelectorAll('.cep-wrap .loading.searching')[0].classList.add('hidden');            
            document.querySelectorAll('.cep-wrap .loading.valida-ok')[0].classList.add('hidden');
            msgElement.innerText = ' o cep não foi encontrado.';

        }
        
        function setFieldValue(fieldId, newValue){
            var el = document.querySelector(fieldId);
            if(el) el.value = newValue;
        }
    }    
    return xhr;//Not necessary(yet);
}

function validarData(dataVal){
    var dataStr =  dataVal.replace(/\D/g, '-');
    var format1 = /^\d\d[\\-]\d\d[\\-]\d\d\d\d$/.test(dataStr);
    if(format1) dataStr = dataStr.split('-').reverse().join('-');

    var validFormat = /^\d\d\d\d[\\-]\d\d[\\-]\d\d$/.test(dataStr);    

    if(!validFormat) return;
    
    var data = new Date(dateStr);
    return (data instanceof Date && isFinite(data)) ;
}
function DataNascKeyUp(element){
    var msgElement = document.querySelectorAll('[data-message-for="' + element.id + '"]')[0];
    if(msgElement) msgElement.innerText = '';

    if(!validarData(element.value)){
        if(msgElement) msgElement.innerText = ' data inválida.';
    }
}
function onFormSubmit(){
    //Fields to validate:
    var errorMessages = "";
    var formMsgEl =  document.querySelectorAll('.form-messages')[0];
    formMsgEl.innerText = '';

    var nomeEl = document.getElementById('Nome');
    var nomeVal = nomeEl.value || '';
    if(nomeVal.length < nomeEl.getAttribute('minlength')){
        errorMessages = "Favor corrigir os campos inválidos";
    }

    var sobrenomeEl = document.getElementById('Sobrenome');
    var sobrenomeVal = sobrenomeEl.value || '';
    if(sobrenomeVal.length < sobrenomeEl.getAttribute('minlength'))
         errorMessages = "Favor corrigir os campos inválidos";

    var generoEls = document.querySelectorAll('[name="Genero"]:checked');
    var generoVal = generoEls.length && generoEls[0].value || '';
    if(!generoVal)
         errorMessages = "O campo Gênero é obrigatório.";


    var dataNascimentoEl = document.getElementById('DataNascimento');
    var dataNascimentoVal =  dataNascimentoEl.value || '';
    /*
    if(dataNascimentoVal < dataNascimentoEl.getAttribute('min'))
        errorMessages = 'A data de nascimento deve ser igual ou maior que ' + dataNascimentoEl.getAttribute('min');
    if(dataNascimentoVal > dataNascimentoEl.getAttribute('max'))
        errorMessages = 'A data de nascimento não deve ser maior que ' + dataNascimentoEl.getAttribute('max');
    */

    var EmailEl = document.getElementById('Email');
    var EmailVal = EmailEl.value || '';
    var ConfirmeEmail = document.getElementById('ConfirmeEmail').value || '';//Já validado
    var CelularEl = document.getElementById('Celular');
        var CelularVal = CelularEl.value || '';
        if(!CelularVal)
            errorMessages = "O campo Celular é obrigatório";

    var Telefone = document.getElementById('Telefone').value || '';//Opcional
    var CPFEl = document.getElementById('CPF');//Já validado
    var CFPVal = (CPFEl.value || '').trim().replace('-', '');
        var emailIsValid = validaEmail(EmailVal);
        var cpfIsValid = validarCPF(CFPVal);
        if(!emailIsValid || !confirmaEmail() || !cpfIsValid)
            errorMessages = "Favor corrigir os campos inválidos";
        if(!CFPVal)
            errorMessages = "O campo CPF é obrigatório";
        
    var CEPEl = document.getElementById('CEP');
     var CEPVal = CEPEl.value || '';
     if(!CEPVal)
            errorMessages = "O campo CEP é obrigatório";


    var EnderecoEl = document.getElementById('Endereco');
    var EnderecoVal = EnderecoEl.value || '';
     if(!EnderecoVal)
            errorMessages = "O campo Endereço é obrigatório";

    var NumeroEl = document.getElementById('Numero');
    var NumeroVal = NumeroEl.value || '';
     if(!NumeroVal)
            errorMessages = "O campo Número é obrigatório";

    var Complemento = document.getElementById('Complemento').value || '';
    var BairroEl = document.getElementById('Bairro');
    var BairroVal = BairroEl.value || '';
    if(!BairroVal)
            errorMessages = "O campo Bairro é obrigatório";

    var CidadeEl = document.getElementById('Cidade');
    var CidadeVal = CidadeEl.value || '';
    if(!CidadeVal)
            errorMessages = "O campo Cidade é obrigatório";

    var UFEl = document.getElementById('UF');
    var UFVal = UFEl.value || '';
    if(!UFVal)
            errorMessages = "O campo UF é obrigatório";

    var Anexo = document.getElementById('Anexo').files[0] || '';

    if(errorMessages == '') {
        document.querySelector('#cadastro-usuario').submit();
        alert("Formulário salvo com sucesso!");
    }
    else document.querySelectorAll('.form-messages')[0].innerText = errorMessages;
    //document.querySelectorAll('.form-messages')[0].innerText = 'Please make sure all your fields are valid';
}


/*


    var Nome = document.getElementById('Nome').value;
    var Sobrenome = document.getElementById('Sobrenome').value;
    var DataNascimento = document.getElementById('DataNascimento').value;
    var Email = document.getElementById('Email').value;
    var ConfirmeEmail = document.getElementById('ConfirmeEmail').value;
    var Celular = document.getElementById('Celular').value;
    var Telefone = document.getElementById('Telefone').value;
    var CPF = document.getElementById('CPF').value;
    var CEP = document.getElementById('CEP').value;
    var Endereco = document.getElementById('Endereco').value;
    var Complemento = document.getElementById('Complemento').value;
    var Bairro = document.getElementById('Bairro').value;
    var Cidade = document.getElementById('Cidade').value;
    var UF = document.getElementById('UF').value;
    var Anexo = document.getElementById('Anexo').files[0];


*/