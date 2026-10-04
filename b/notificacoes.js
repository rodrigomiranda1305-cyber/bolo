/* =====================================================================
   Prova social — avisos de compra no canto inferior

   Sorteia nome + cidade e mostra um aviso a cada 5 a 20 segundos,
   sem parar. Cada aviso fica 5 segundos na tela.

   ATENÇÃO: os nomes e cidades são SORTEADOS, não são compras reais.
   Para desligar, troque LIGADO para false logo abaixo.
   ================================================================== */
(function () {
  'use strict';

  var LIGADO       = true;
  var ESPERA_MIN   = 5000;    /* 5 s  */
  var ESPERA_MAX   = 20000;   /* 20 s */
  var TEMPO_NA_TELA = 5000;
  var PRIMEIRA_ESPERA = 8000; /* deixa a pessoa ler o topo antes do 1º */

  if (!LIGADO) return;

  var NOMES = [
    'Ana', 'Mariana', 'Juliana', 'Camila', 'Fernanda', 'Patrícia', 'Larissa',
    'Beatriz', 'Carolina', 'Vanessa', 'Aline', 'Tatiane', 'Priscila', 'Renata',
    'Débora', 'Simone', 'Luciana', 'Bruna', 'Gabriela', 'Letícia', 'Sabrina',
    'Adriana', 'Michele', 'Rafaela', 'Daniela', 'Jéssica', 'Natália', 'Elaine',
    'Cristiane', 'Viviane', 'Amanda', 'Thais', 'Milena', 'Rosana', 'Eliane',
    'Josiane', 'Kelly', 'Andreia', 'Flávia', 'Marcela', 'Isabela', 'Silvana'
  ];

  /* cidade e estado conferem de verdade — nada de "Salvador, SP" */
  var CIDADES = [
    ['São Paulo', 'SP'], ['Campinas', 'SP'], ['Santo André', 'SP'],
    ['Ribeirão Preto', 'SP'], ['Sorocaba', 'SP'], ['Osasco', 'SP'],
    ['Rio de Janeiro', 'RJ'], ['Niterói', 'RJ'], ['Nova Iguaçu', 'RJ'],
    ['Belo Horizonte', 'MG'], ['Uberlândia', 'MG'], ['Contagem', 'MG'],
    ['Juiz de Fora', 'MG'], ['Curitiba', 'PR'], ['Londrina', 'PR'],
    ['Maringá', 'PR'], ['Porto Alegre', 'RS'], ['Caxias do Sul', 'RS'],
    ['Pelotas', 'RS'], ['Florianópolis', 'SC'], ['Joinville', 'SC'],
    ['Blumenau', 'SC'], ['Salvador', 'BA'], ['Feira de Santana', 'BA'],
    ['Recife', 'PE'], ['Olinda', 'PE'], ['Caruaru', 'PE'],
    ['Fortaleza', 'CE'], ['Juazeiro do Norte', 'CE'], ['Natal', 'RN'],
    ['João Pessoa', 'PB'], ['Maceió', 'AL'], ['Aracaju', 'SE'],
    ['São Luís', 'MA'], ['Teresina', 'PI'], ['Belém', 'PA'],
    ['Manaus', 'AM'], ['Goiânia', 'GO'], ['Anápolis', 'GO'],
    ['Brasília', 'DF'], ['Campo Grande', 'MS'], ['Cuiabá', 'MT'],
    ['Vitória', 'ES'], ['Serra', 'ES'], ['Porto Velho', 'RO']
  ];

  var sorteia = function (lista) {
    return lista[Math.floor(Math.random() * lista.length)];
  };

  /* não repete o mesmo nome logo em seguida */
  var ultimoNome = '', ultimaCidade = '';
  function sorteiaDiferente(lista, anterior) {
    var v, tentativas = 0;
    do { v = sorteia(lista); tentativas++; }
    while (String(v) === String(anterior) && tentativas < 8);
    return v;
  }

  var caixa, texto, timerSaida, timerEntrada;

  function monta() {
    caixa = document.createElement('div');
    caixa.className = 'aviso';
    caixa.setAttribute('role', 'status');
    caixa.setAttribute('aria-live', 'polite');

    var icone = document.createElement('span');
    icone.className = 'aviso__ico';
    icone.setAttribute('aria-hidden', 'true');
    icone.textContent = '✓';

    texto = document.createElement('p');
    texto.className = 'aviso__txt';

    var fechar = document.createElement('button');
    fechar.className = 'aviso__fechar';
    fechar.type = 'button';
    fechar.setAttribute('aria-label', 'Fechar aviso');
    fechar.textContent = '×';
    fechar.addEventListener('click', function () {
      esconde();
      clearTimeout(timerEntrada);     /* fechou uma vez: não insiste mais */
    });

    caixa.appendChild(icone);
    caixa.appendChild(texto);
    caixa.appendChild(fechar);
    document.body.appendChild(caixa);
  }

  function mostra() {
    var nome = sorteiaDiferente(NOMES, ultimoNome);
    var cidade = sorteiaDiferente(CIDADES, ultimaCidade);
    ultimoNome = nome; ultimaCidade = cidade;

    texto.innerHTML = '<strong></strong><span></span>';
    texto.firstChild.textContent = nome + ' acabou de comprar';
    texto.lastChild.textContent = cidade[0] + ' — ' + cidade[1];

    caixa.classList.add('is-visivel');
    clearTimeout(timerSaida);
    timerSaida = setTimeout(esconde, TEMPO_NA_TELA);

    timerEntrada = setTimeout(mostra,
      TEMPO_NA_TELA + ESPERA_MIN + Math.random() * (ESPERA_MAX - ESPERA_MIN));
  }

  function esconde() {
    if (caixa) caixa.classList.remove('is-visivel');
  }

  function inicia() {
    monta();
    timerEntrada = setTimeout(mostra, PRIMEIRA_ESPERA);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicia);
  } else {
    inicia();
  }
})();
