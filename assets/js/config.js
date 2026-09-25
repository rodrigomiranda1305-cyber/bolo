/**
 * ButtercreamPro BR — configuração central da página.
 *
 * Este é o ÚNICO arquivo que precisa ser editado para trocar preços, moeda,
 * link de checkout, durações dos contadores e IDs de rastreamento.
 * O restante da página lê tudo daqui (assets/js/app.js aplica no DOM).
 *
 * Para trocar de moeda, basta mudar `currency` e os valores abaixo.
 */
window.BP_CONFIG = {
  /* ---------------------------------------------------------------- oferta */
  currency: 'R$',
  originalPrice: '199,90',
  offerPrice: '19,90',
  discountPercentage: 90,

  /* valores dos bônus exibidos como "Avaliado em X / HOJE GRÁTIS" */
  bonusPrices: {
    receitasVirais: '27,99',
    nyCookies: '12,99',
    miniCheesecakes: '12,99'
  },

  /* -------------------------------------------------------------- checkout */
  /* Um único destino para TODOS os CTAs de compra da página. */
  checkoutUrl: 'https://pay.hotmart.com/U89314700I?off=zbtkndix&checkoutMode=10',

  /* Repasse de UTMs feito por conta própria.
     DESLIGADO porque a UTMify já faz isso — e faz melhor, incluindo os
     parâmetros xcod/sck que a Hotmart usa para atribuir a venda. Com os dois
     ligados, um sobrescreveria o outro. Só religue se remover a UTMify. */
  forwardUtmParams: false,

  /* ------------------------------------------------------------- persuasão
   * Blocos de escassez, urgência e prova. Tudo aqui pode ser desligado
   * colocando `false` — a seção some da página sem quebrar o layout.
   */
  persuasao: {
    /* Card de abertura: a visitante confirma que se identifica com o
       problema antes de ver a oferta. Aparece uma vez por sessão. */
    cardAbertura: true,

    /* Data de hoje na barra de urgência, atualizada sozinha. */
    mostrarDataDeHoje: true,

    /* Contador de vagas. Começa em `vagasIniciais` e, depois de
       `segundosParaBaixar`, passa para `vagasFinais`.
       ATENÇÃO: só mantenha ligado se o limite de vagas for real. Anunciar
       escassez que não existe é propaganda enganosa (CDC, art. 37). */
    escassezVagas: true,
    vagasIniciais: 5,
    vagasFinais: 3,
    segundosParaBaixar: 90,

    /* Aviso de que o preço sobe. Só mantenha ligado se realmente for subir. */
    avisoPrecoSobe: true,

    /* Tamanho da equipe de suporte citado nas barras vermelhas. */
    tamanhoEquipe: 28,

    /* Prazo de garantia legal (CDC art. 49 / Hotmart). */
    diasGarantia: 7
  },

  /* ------------------------------------------------------------- contadores
   * Contadores "evergreen": a duração é em SEGUNDOS e cada contador guarda
   * sua data-limite no localStorage, exatamente como a página original.
   * Recarregar a página NÃO reinicia o contador; ele só recomeça quando zera
   * ou quando a duração abaixo é alterada.
   */
  countdowns: {
    oferta: 480,       // bloco de oferta do topo — 8 min
    ofertaRepeat: 480, // bloco de oferta repetido — 8 min
    ofertaFinal: 1200  // bloco "os bônus desaparecerão em" — 20 min
  },

  /* ------------------------------------------------------------ rastreamento
   * Deixe em branco para não carregar nada. Preencha com as contas BRASILEIRAS
   * quando elas existirem — nenhum script de terceiros é injetado enquanto o
   * ID correspondente estiver vazio, então não há evento duplicado.
   */
  tracking: {
    /* UTMify — o pixel é carregado no <head> do index.html lendo este ID.
       Deixe em branco para desativar. */
    utmifyPixelId: '6ab55028171efecc30df008a',

    metaPixelId: '',   // ex.: '1234567890'
    ga4Id: '',         // ex.: 'G-XXXXXXXXXX'
    gtmId: '',         // ex.: 'GTM-XXXXXXX'

    /* Nome do evento custom disparado em todo clique de compra. */
    checkoutEventName: 'InitiateCheckout'
  }
};
