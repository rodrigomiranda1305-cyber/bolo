/**
 * Textos em espanhol embutidos nos mockups 3D dos produtos.
 *
 * Coordenadas em pixels da arte original. `ang` é a inclinação da linha
 * (os livros estão em perspectiva), `cap` é a altura da maiúscula e (x, y)
 * marca o topo da maiúscula da primeira letra.
 *
 * Nomes de marca permanecem: ButtercreamPro, NY Cookies, PRO.
 */
window.MOCKUPS = [
  {
    base: 'prod-buttercreampro.png', out: 'livro-buttercreampro',
    w: 1920, h: 1080, largura: 1200,
    /* Só o parágrafo da capa está em espanhol; a marca na lombada fica.
       O fundo rosado é saturado, então o retângulo remove só o texto branco. */
    erase: [{ x: 762, y: 666, w: 182, h: 152, maxTraco: 34 },
             { x: 868, y: 774, w: 76, h: 26, maxTraco: 40 }],
    text: [
      { s: 'CRIE CREMES DE',       x: 775, y: 693, w: 103, cap: 14, ang: -8.3 },
      { s: 'MANTEIGA',             x: 774, y: 711, w: 86,  cap: 14, ang: -8.3 },
      { s: 'INCRÍVEIS PARA O SEU', x: 773, y: 729, w: 138, cap: 14, ang: -8.3 },
      { s: 'NEGÓCIO COM MAIS',     x: 772, y: 747, w: 122, cap: 14, ang: -8.3 },
      { s: 'DE 30 RECEITAS',       x: 771, y: 765, w: 100, cap: 14, ang: -8.3 },
      { s: 'ICÔNICAS DA',          x: 770, y: 783, w: 80,  cap: 14, ang: -8.3 },
      { s: 'NOSSA CONFEITARIA',    x: 769, y: 801, w: 156, cap: 14, ang: -8.3 }
    ]
  },

  {
    base: 'prod-virales.png', out: 'livro-receitas-virais',
    w: 1920, h: 1080, largura: 1200,
    /* só a lombada tem fundo liso; capa e parágrafo usam máscara de letra */
    erase: [{ x: 626, y: 312, w: 44, h: 570, modo: 'faixa' }],
    text: [
      { s: 'RECEITAS VIRAIS', x: 710, y: 372, w: 341, cap: 40, ang: -7.3 },

      { s: 'Faça as receitas das', x: 722, y: 688, w: 153, cap: 22, ang: -7.3 },
      { s: 'sobremesas mais',      x: 721, y: 715, w: 135, cap: 22, ang: -7.3 },
      { s: 'virais e',             x: 720, y: 742, w: 62,  cap: 22, ang: -7.3 },
      { s: 'inovadoras que',       x: 719, y: 769, w: 144, cap: 22, ang: -7.3 },
      { s: 'criamos para',         x: 718, y: 796, w: 131, cap: 22, ang: -7.3 },
      { s: 'você.',                x: 717, y: 823, w: 63,  cap: 22, ang: -7.3 },

      /* lombada: lida de cima para baixo */
      { s: 'RECEITAS VIRAIS PRO', x: 662, y: 325, w: 545, cap: 28, ang: 88.5, cor: '#cfd2d1' }
    ]
  },

  {
    base: 'prod-nycookies.png', out: 'livro-ny-cookies',
    w: 1920, h: 1080, largura: 1200,
    erase: [],
    /* LIBRO → LIVRO: só o "B" é substituído por um "V" */
    traco: 0.18, dilatar: 3,
    text: [{ s: 'V', x: 893, y: 500, w: 25, cap: 38, ang: -6.3 }]
  },

  {
    base: 'prod-cheesecakes.png', out: 'livro-mini-cheesecakes',
    w: 1920, h: 1080, largura: 1200,
    erase: [],
    traco: 0.18, dilatar: 3,
    text: [{ s: 'V', x: 910, y: 511, w: 28, cap: 37, ang: -6.3 }]
  },

  {
    base: 'prod-costos.png', out: 'planilha-de-custos',
    w: 1024, h: 576, largura: 1024,
    erase: [],
    /* COSTOS → CUSTOS: só o segundo "O" vira "U" */
    traco: 0.18, dilatar: 3,
    text: [{ s: 'U', x: 406, y: 280, w: 34, cap: 30, ang: -5.6 }]
  }
  ,{
    /* ---------------------------------------------------------------- hero
       Montagem do topo. Só os TÍTULOS principais são recriados em português;
       as listas miúdas de receitas dentro dos cartões ficam como estão
       (saem com cerca de 3 px de altura na tela). */
    base: 'hero.png', out: 'hero',
    w: 940, h: 788, largura: 940,
    traco: 0.16, dilatar: 2, raio: 8,
    erase: [
      { x: 420, y: 97,  w: 92,  h: 29, modo: 'modal', ang: -1.5 },  // CREMAS - cartao azul
      { x: 249, y: 159, w: 132, h: 30, modo: 'modal', ang: -7.9 },  // BIZCOCHOS - cartao rosa
      { x: 268, y: 236, w: 106, h: 29, modo: 'modal', ang: -5.7 },  // RELLENOS - cartao vermelho
      { x: 648, y: 302, w: 164, h: 21, modo: 'modal' },  // titulo do certificado
      { x: 654, y: 435, w: 148, h: 18, modo: 'modal' },  // faixa laranja
      { x: 498, y: 571, w: 72,  h: 25, modo: 'media' },  // COSTOS
      { x: 580, y: 571, w: 74,  h: 25, modo: 'media' },  // REMOJOS
      { x: 665, y: 574, w: 60,  h: 19, modo: 'media' },  // MINI LIBRO - NY Cookies
      { x: 740, y: 574, w: 64,  h: 19, modo: 'media' },  // MINI LIBRO - Cheesecakes
      { x: 502, y: 379, w: 88,  h: 25, modo: 'media' },  // RECETAS VIRALES - capa
      { x: 481, y: 374, w: 16,  h: 152, modo: 'media' }, // lombada do mesmo livro
      { x: 640, y: 179, w: 62,  h: 21, modo: 'media' }   // "PLAN DE" no tablet
    ],
    /* selo redondo: "LIFETIME ACCESS" vira "ACESSO VITALICIO" */
    arcos: [
      { s: 'ACESSO', cx: 565, cy: 291, r: 51, rInt: 40, rExt: 64,
        aIni: -150, aFim: -42, cap: 12, cor: [226, 26, 33],
        caixa: [502, 226, 606, 288] },
      { s: 'VITALÍCIO', cx: 565, cy: 291, r: 51, rInt: 40, rExt: 64,
        aIni: 143, aFim: 45, cap: 11, paraDentro: true, cor: [226, 26, 33],
        caixa: [536, 300, 630, 356] }
    ],
    text: [
      { s: 'CREMES',   x: 424, y: 101, w: 84,  cap: 22, ang: -1.5 },
      { s: 'MASSAS',   x: 253, y: 163, w: 125, cap: 23, ang: -7.9 },
      { s: 'RECHEIOS', x: 272, y: 241, w: 98,  cap: 22, ang: -5.7 },

      { s: 'CERTIFICADO DE CONFEITEIRA PRO', x: 650, y: 307, w: 158, cap: 13,
        ang: 0, cor: '#1c3a5e' },

      { s: 'Mega resistente ao calor', x: 655, y: 439, w: 148, cap: 11, ang: 0,
        cor: '#ffffff' },

      { s: 'RECEITAS VIRAIS', x: 505, y: 391, w: 99, cap: 15, ang: -5.8 },

      { s: 'CUSTOS',     x: 501, y: 577, w: 65, cap: 16, ang: -3.5 },
      { s: 'CALDAS',     x: 583, y: 577, w: 67, cap: 16, ang: -3.5 },
      { s: 'MINI LIVRO', x: 668, y: 578, w: 54, cap: 12, ang: -3 },
      { s: 'MINI LIVRO', x: 743, y: 578, w: 57, cap: 12, ang: -3 },

      /* lombada do livro de receitas virais, lida de cima para baixo */
      { s: 'RECEITAS VIRAIS PRO', x: 495, y: 378, w: 145, cap: 9, ang: 90,
        cor: '#8d9095' },

      { s: 'PLANO DE', x: 641, y: 183, w: 60, cap: 14, ang: 0 }
    ]
  }
];
