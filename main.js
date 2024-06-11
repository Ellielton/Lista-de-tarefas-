let listaItens = [];
//vai receber o indice do elemento que foi clicado para ser editado que vem do editarItens.foreach.
let itemAEditar;

//EScuta o form para enviar os dados.
const form = document.getElementById('form-itens');

//capturando os informações de entrada do html
const itensInput = document.getElementById('receber-item');

//captura a lista que sera preenchida com os itens que esta salvos na lista de objeto.
const ulItens = document.getElementById('lista-de-itens');

//buscando do html a lista que conterá os itens marcados como concluido.
const ulItensComprados = document.getElementById('itens-comprados');

//buscando dados do localstorage e armazenando na const
const listaRecuperada = localStorage.getItem('listaItens');

//transformando em json para armazenar no localStorage do navegador
function atualizaLocalStorage() {
  localStorage.setItem('listaItens',JSON.stringify(listaItens));
}

//(valores omitidos, 0, null, NaN, undefined, "", false) << todos esses retorna false na comparação.

//condicional da busca feita no localStorage.
if(listaRecuperada) {
  listaItens = JSON.parse(listaRecuperada);
  mostrarItens();
} else {
  listaItens = [];
}


//adiciona o fofoqueiro ao form que percebe o submit e chama uma função
form.addEventListener('submit', (evento) => {

  //percebe o e não faz o envio do form
  evento.preventDefault();
  salvarItem();

  //chama a function que mostra os itens na tela.
  mostrarItens();

  //coloca foco no input.
  itensInput.focus();
})

function salvarItem() {
  //coleta o valor digitado no campo na pagina
  const comprasItem = itensInput.value;

  //salva um booleano e com o metodo some() passamos o elemento e verificamos se são iguais.
  //Como javascript é casesensitive deixamos os elementos comparados em maiúsculo com toUpperCase().
  const checarDuplicado = listaItens.some((elemento)=> elemento.valor.toUpperCase() === comprasItem.toUpperCase());

  //criamos uma condicional if para determinar o que fazer dependendo do valor de checarDuplicado.
  //sendo true execute senão vai para o else.
  if(checarDuplicado) {
    alert('Esse item já existe.');

  } else { 

    //criando os objeto e inserindo na lista
    listaItens.push( {
      valor: comprasItem,
      checar: false
    });
    
  }
  
  itensInput.value =''; //limpa o campo apos adicinar o item digitado.
  //console.log(listaItens);
}

//functin declarection
function mostrarItens() {
  /*
    Dificuldades:
      1- A lista esta reoetindo o primeiro item ao adicionar pelo forme, resolve-se limpa a lista antes de exibir os itens salvos pelo input da tela. resp. linha 53.

      2- A lista não estava crescendo apenas sobrepondo os itens mesmo com varios objetos na lista. Solução: estava limpando a lista dentro do for quando deveria ser fora para limpa a lista antes de iniciar o loop.
  */
 
  //limpa a lista, antes de exibir os itens que vem do form.
  ulItens.innerHTML = '';
  ulItensComprados.innerHTML = '';
  
  listaItens.forEach((elemento, index) => {
    //Condicional que transfere os itens concluidos
    //esse if verifica se a chave checar tem o valor true.
    if(elemento.checar) {
      ulItensComprados.innerHTML += 
      `
        <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
          <div>
              <input type="checkbox" checked class="is-clickable" />
              <span class="itens-comprados is-size-5">${elemento.valor}</span>
          </div>
          <div>
              <i class="fa-solid fa-trash is-clickable deletar"></i>
          </div>
        </li>
      `

    } else {
      ulItens.innerHTML +=
      `
        <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
          <div>
              <input type="checkbox" class="is-clickable" />
              <input type="text" class="is-size-5" value="${elemento.valor}" ${index !== Number(itemAEditar) ? 'disabled' : '' }></input>
          </div>
          <div>
            <!-- adicionando os icones de editar o itens da lista. -->
            ${index === Number(itemAEditar)? '<button onclick="salvarEdicao()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>' : '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>' }

            <i class="fa-solid fa-trash is-clickable deletar"></i>
          </div>
        </li>
      `
    }
  });
  
  //capturando os input em uma array com selectorall, atravéz da tag e tipo do input
  const inputsCheck = document.querySelectorAll('input[type="checkbox"]');

  //percorrendo o arrey de checkbo com forEach()
  inputsCheck.forEach(i=>{
    //adiciona evento ao checkbox
    i.addEventListener('click', (evento)=> {
      //O target é o alvo e retorna que da lista doi clicado;
      //O pareteElement repassa essa funcção para o pai do elemento alvo;
      //getAttribute() sinaliza qual elemento será o alvo e salvo seu indice na variável.
      const valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value');
      console.log(valorDoElemento)
      // acessa dentro do array o índice do elemeto 
      listaItens[valorDoElemento].checar = evento.target.checked;
      console.log( listaItens[valorDoElemento].checar ) // ao clicar ativar checked do target acima.
      mostrarItens();
    })
  })

  const deletarObjetos = document.querySelectorAll('.deletar');

  deletarObjetos.forEach(i=>{
    i.addEventListener('click', (evento)=> {
      const valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value');
      listaItens.splice(valorDoElemento, 1 )
      mostrarItens();
    });
  });

  //busca o icone editar no html.
  const editarItens = document.querySelectorAll('.editar');

  editarItens.forEach(i=>{
    i.addEventListener('click', (evento)=> {
      //atribui valor a variável na L-3
      itemAEditar = evento.target.parentElement.parentElement.getAttribute('data-value');
      mostrarItens();
     //console.log(itemAEditar);
    });
  });

  //chamada da função que salva o dados no localStorage aqui pois já criamos os item
  atualizaLocalStorage();
}
  
//criando a função que salva a edição do item existente na lista.
function salvarEdicao() {
  //passamos o indeci do elemeneto clicado para o data-value e buscamos o input contido neste.
  const itemEditado = document.querySelector(`[data-value="${itemAEditar}"] input[type="text"]`);
  //proximo passo é criamos o button que envolve o icone de disqueta, que chamará a função ao ser clicado atravez do onclick isso a linha
  //console.log(itemEditado.value);

  //salvando a edição no objeto
  listaItens[itemAEditar].valor = itemEditado.value;
  //netraliza o indice para as proximas edições
  itemAEditar = -1; // reseta o indice.
  console.log(listaItens);
  mostrarItens();
}