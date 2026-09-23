/**
 * Mapa dos 5 depoimentos: onde está cada texto em espanhol na arte original e
 * qual é o texto equivalente em português.
 *
 * Coordenadas em pixels da arte original (675 x 1200).
 *   clean[] → regiões onde o texto original é removido por inpainting
 *   text[]  → blocos redesenhados em português, ajustados ao retângulo alvo
 *
 * Os nomes das alunas são mantidos: são pessoas reais.
 */
window.DEPOIMENTOS = (function () {

  /* Paletas: as artes 1-2 usam azul/laranja, as 3-5 vermelho/marinho. */
  var AZUL = '#1c30a3', LARANJA = '#ff5e00';
  var VERMELHO = '#cc412f', MARINHO = '#0d3052';

  /* Layout interno do certificado, em fração da moldura (idêntico nos 5). */
  var CERT = {
    limpar: [
      { t: 0.242, h: 0.230, x: 0.040, w: 0.920 }, // título + "certifica que" + nome
      { t: 0.500, h: 0.148, x: 0.240, w: 0.545 }, // corpo miúdo (acima das rubricas)
      /* as legendas são limpas em duas faixas laterais para preservar o selo */
      { t: 0.774, h: 0.050, x: 0.100, w: 0.290 },
      { t: 0.774, h: 0.050, x: 0.620, w: 0.290 }
    ],
    titulo:    { t: 0.267, h: 0.050, x: 0.165, w: 0.655 },
    certifica: { t: 0.362, h: 0.013, x: 0.402, w: 0.199 },
    nome:      { t: 0.404, h: 0.054, x: 0.149, w: 0.731 },
    corpo:     { t: 0.508, h: 0.033, x: 0.247, w: 0.532 },
    assinEsq:  { t: 0.779, h: 0.012, x: 0.146, w: 0.190 },
    assinDir:  { t: 0.779, h: 0.012, x: 0.674, w: 0.196 }
  };

  var CERT_TEXTO = {
    titulo: 'CERTIFICADO DE CONFEITEIRA PRO',
    certifica: 'Este documento certifica que',
    corpo: [
      'concluiu com êxito o curso profissional',
      'de confeitaria "ButtercreamPro", dominando',
      'e aplicando suas habilidades em preparo de cremes,',
      'decoração, criatividade e forno.',
      'É uma honra conceder este reconhecimento pelo seu esforço e dedicação.'
    ],
    assinEsq: 'Chef Instrutora ButtercreamPro',
    assinDir: 'Diretor Geral ButtercreamPro'
  };

  return [
    /* ============================================================ 1 */
    {
      base: 'car2-1.png',
      cert: { x: 337, y: 496, w: 316, h: 240 },
      certNome: 'JENNIFER RINCÓN HERNÁNDEZ',
      certNomeMaiusc: true,
      clean: [
        { x: 0, y: 95, w: 675, h: 155, tipo: 'mode' },     // bloco do título
        { x: 354, y: 348, w: 288, h: 144, tipo: 'pintar' },  // "MUY MERECIDO..." (sobre o padrão do chat)
        { x: 0, y: 965, w: 675, h: 95, tipo: 'mode' },     // bloco final
        { x: 82, y: 634, w: 386, h: 108, tipo: 'mode' }, // balão "Tú"
        { x: 74, y: 748, w: 262, h: 26, tipo: 'mode' },
        { x: 74, y: 806, w: 290, h: 70, tipo: 'mode' },
        { x: 74, y: 876, w: 122, h: 26, tipo: 'mode' },
        { x: 74, y: 916, w: 116, h: 24, tipo: 'mode' }
      ],
      text: [
        { s: 'OBRIGADA!',  x: 141, y: 108, w: 393, h: 55, c: AZUL, peso: 800 },
        { s: 'RECEBER SUAS FOTOS E VER SEU TALENTO', x: 107, y: 189, w: 460, h: 21, c: LARANJA, peso: 800 },
        { s: 'ENCHE NOSSO CORAÇÃO', x: 107, y: 215, w: 460, h: 27, c: LARANJA, peso: 800 },

        { s: 'MUITO MERECIDO SEU', x: 358, y: 356, w: 272, h: 21, c: AZUL, peso: 800 },
        { s: 'CERTIFICADO',        x: 358, y: 384, w: 272, h: 29, c: AZUL, peso: 800 },
        { s: 'DE CONFEITEIRA',     x: 358, y: 421, w: 272, h: 27, c: AZUL, peso: 800 },
        { s: 'PROFISSIONAL',       x: 358, y: 455, w: 272, h: 29, c: AZUL, peso: 800 },

        { s: 'VAMOS DAR UMA GRANDE',          x: 83, y: 979,  w: 510, h: 34, c: LARANJA, peso: 800 },
        { s: 'SALVA DE PALMAS PARA JENNIFER', x: 83, y: 1024, w: 509, h: 22, c: LARANJA, peso: 800 },

        /* balão "Você" (rótulo do remetente em destaque) */
        { s: 'Você', x: 86, y: 641, w: 34, h: 13, c: '#c0392b', peso: 600, chat: true },
        { s: 'Oi, confeiteira! Sou a Karen da',   x: 86, y: 665, w: 250, h: 13, chat: true },
        { s: 'ButtercreamPro ✨ Obrigada por',    x: 86, y: 688, w: 266, h: 13, chat: true },
        { s: 'falar com a gente, por favor con',  x: 86, y: 711, w: 300, h: 13, chat: true },

        { s: 'Oi, tudo bem karen como você está?', x: 79, y: 754, w: 248, h: 13, chat: true },

        { s: 'Queria solicitar a certificação que', x: 79, y: 812, w: 274, h: 13, chat: true },
        { s: 'vocês oferecem, já testei muitas',    x: 79, y: 835, w: 262, h: 13, chat: true },
        { s: 'das suas receitas são uma',           x: 79, y: 858, w: 224, h: 13, chat: true },
        { s: 'maravilha',                           x: 79, y: 881, w: 80,  h: 13, chat: true },

        { s: 'Obrigada', x: 79, y: 922, w: 78, h: 13, chat: true }
      ]
    },

    /* ============================================================ 2 */
    {
      base: 'car2-2.png',
      cert: { x: 337, y: 466, w: 316, h: 240 },
      certNome: 'Angelly Chacin',
      clean: [
        { x: 0, y: 95, w: 675, h: 160, tipo: 'mode' },
        { x: 354, y: 314, w: 288, h: 144, tipo: 'pintar' },
        { x: 0, y: 962, w: 675, h: 100, tipo: 'mode' },
        { x: 82, y: 594, w: 384, h: 116, tipo: 'mode' },  // balão branco
        { x: 166, y: 748, w: 284, h: 26, tipo: 'mode' },  // balão verde 1
        { x: 166, y: 774, w: 182, h: 26, tipo: 'mode' },
        { x: 210, y: 812, w: 156, h: 26, tipo: 'mode' },  // balão verde 2
        { x: 208, y: 850, w: 240, h: 26, tipo: 'mode' },  // balão verde 3
        { x: 208, y: 876, w: 152, h: 26, tipo: 'mode' }
      ],
      text: [
        { s: 'OBRIGADA!', x: 141, y: 108, w: 393, h: 55, c: AZUL, peso: 800 },
        { s: 'RECEBER SUAS FOTOS E VER SEU TALENTO', x: 107, y: 189, w: 460, h: 21, c: LARANJA, peso: 800 },
        { s: 'ENCHE NOSSO CORAÇÃO', x: 107, y: 215, w: 460, h: 27, c: LARANJA, peso: 800 },

        { s: 'MUITO MERECIDO SEU', x: 358, y: 326, w: 272, h: 21, c: AZUL, peso: 800 },
        { s: 'CERTIFICADO',        x: 358, y: 350, w: 272, h: 29, c: AZUL, peso: 800 },
        { s: 'DE CONFEITEIRA',     x: 358, y: 387, w: 272, h: 27, c: AZUL, peso: 800 },
        { s: 'PROFISSIONAL',       x: 358, y: 421, w: 272, h: 29, c: AZUL, peso: 800 },

        { s: 'VAMOS DAR UMA GRANDE',                  x: 83, y: 979,  w: 510, h: 34, c: LARANJA, peso: 800 },
        { s: 'SALVA DE PALMAS PARA ANGELLY DO CHILE', x: 83, y: 1021, w: 509, h: 19, c: LARANJA, peso: 800 },

        { s: 'Angelly Chacin. Escrevo para', x: 86, y: 604, w: 250, h: 13, chat: true },
        { s: 'meu certificado já que',       x: 86, y: 631, w: 205, h: 13, chat: true },
        { s: 'implementei a cobertura 2.0',  x: 86, y: 658, w: 246, h: 13, chat: true },

        { s: 'Oi, Angelly! 😍😍😍😍 seu bolo', x: 171, y: 753, w: 268, h: 13, chat: true },
        { s: 'está lindo!',                   x: 170, y: 776, w: 82,  h: 13, chat: true },

        { s: 'Parabéns 🎈🎉', x: 216, y: 817, w: 120, h: 13, chat: true },

        { s: 'Neste momento envio seu', x: 213, y: 856, w: 200, h: 13, chat: true },
        { s: 'certificado 📜',          x: 213, y: 878, w: 105, h: 13, chat: true }
      ]
    },

    /* ============================================================ 3 */
    {
      base: 'car2-3.png',
      cert: { x: 350, y: 469, w: 270, h: 205 },
      certNome: 'Alejandra Gutiérrez',
      clean: [
        { x: 0, y: 95, w: 675, h: 175, tipo: 'mode' },
        { x: 366, y: 334, w: 240, h: 122, tipo: 'pintar' },
        { x: 0, y: 946, w: 675, h: 130, tipo: 'mode' },
        { x: 66, y: 640, w: 296, h: 146, tipo: 'mode' },  // balão branco
        { x: 160, y: 800, w: 226, h: 26, tipo: 'mode' },  // verde 1
        { x: 154, y: 840, w: 282, h: 50, tipo: 'mode' }   // verde 2
      ],
      text: [
        { s: 'OBRIGADA!', x: 141, y: 108, w: 393, h: 55, c: VERMELHO, peso: 800 },
        { s: 'RECEBER SUAS FOTOS E VER SEU TALENTO', x: 107, y: 189, w: 460, h: 21, c: MARINHO, peso: 800 },
        { s: 'ENCHE NOSSO CORAÇÃO', x: 108, y: 215, w: 459, h: 27, c: MARINHO, peso: 800 },

        { s: 'MUITO MERECIDO SEU', x: 373, y: 342, w: 222, h: 17, c: MARINHO, peso: 800 },
        { s: 'CERTIFICADO',        x: 373, y: 365, w: 222, h: 24, c: MARINHO, peso: 800 },
        { s: 'DE CONFEITEIRA',     x: 373, y: 396, w: 222, h: 22, c: MARINHO, peso: 800 },
        { s: 'PROFISSIONAL',       x: 373, y: 424, w: 222, h: 24, c: MARINHO, peso: 800 },

        { s: 'VAMOS DAR UMA GRANDE', x: 151, y: 960,  w: 372, h: 26, c: VERMELHO, peso: 800 },
        { s: 'SALVA DE PALMAS PARA', x: 151, y: 992,  w: 372, h: 25, c: VERMELHO, peso: 800 },
        { s: 'ALEJANDRA',            x: 151, y: 1023, w: 373, h: 43, c: VERMELHO, peso: 800 },

        { s: 'Com suas explicações de passo',  x: 72, y: 662, w: 256, h: 13, chat: true },
        { s: 'a passo ficou super fácil',      x: 72, y: 685, w: 208, h: 13, chat: true },
        { s: 'decorar, de me sentir tão',      x: 71, y: 708, w: 218, h: 13, chat: true },
        { s: 'insegura passei a me sentir',    x: 72, y: 731, w: 238, h: 13, chat: true },
        { s: 'uma pro com você . Obrigada',    x: 72, y: 754, w: 250, h: 13, chat: true },

        { s: 'Bolo lindo, confeiteira!', x: 164, y: 805, w: 206, h: 13, chat: true },

        { s: 'Por favor me deixe seu nome e',      x: 158, y: 844, w: 250, h: 13, chat: true },
        { s: 'seu e-mail para enviar o certificado', x: 158, y: 868, w: 270, h: 13, chat: true }
      ]
    },

    /* ============================================================ 4 */
    {
      base: 'car2-4.png',
      cert: { x: 340, y: 466, w: 290, h: 221 },
      certNome: 'Carmen Venegas Rambla',
      clean: [
        { x: 0, y: 95, w: 675, h: 175, tipo: 'mode' },
        { x: 366, y: 334, w: 240, h: 122, tipo: 'pintar' },
        { x: 0, y: 938, w: 675, h: 175, tipo: 'mode' },
        { x: 76, y: 766, w: 350, h: 130, tipo: 'mode' },
        { x: 76, y: 896, w: 228, h: 26, tipo: 'mode' },
        { x: 176, y: 256, w: 84, h: 18, tipo: 'mode' }
      ],
      text: [
        { s: 'OBRIGADA!', x: 141, y: 106, w: 393, h: 55, c: VERMELHO, peso: 800 },
        { s: 'MAIS UM DEPOIMENTO QUE',      x: 57, y: 193, w: 561, h: 29, c: MARINHO, peso: 800 },
        { s: 'ENCHE NOSSO CORAÇÃO DE ALEGRIA', x: 57, y: 227, w: 561, h: 26, c: MARINHO, peso: 800 },

        { s: 'MUITO MERECIDO SEU', x: 373, y: 341, w: 222, h: 17, c: MARINHO, peso: 800 },
        { s: 'CERTIFICADO',        x: 373, y: 364, w: 222, h: 24, c: MARINHO, peso: 800 },
        { s: 'DE CONFEITEIRA',     x: 373, y: 394, w: 222, h: 22, c: MARINHO, peso: 800 },
        { s: 'PROFISSIONAL',       x: 373, y: 423, w: 222, h: 22, c: MARINHO, peso: 800 },

        { s: 'VAMOS DAR UMA GRANDE',   x: 91, y: 950,  w: 487, h: 30, c: VERMELHO, peso: 800 },
        { s: 'SALVA',                  x: 89, y: 988,  w: 489, h: 74, c: VERMELHO, peso: 800 },
        { s: 'DE PALMAS PARA CARMEN',  x: 90, y: 1068, w: 489, h: 35, c: VERMELHO, peso: 800 },

        { s: 'online', x: 190, y: 260, w: 44, h: 10, chat: true, fs: 13 },
        { s: 'Bom dia, este é o resultado',       x: 83, y: 773, w: 235, h: 12, chat: true, fs: 15.5 },
        { s: 'do meu trabalho com o Buttercream', x: 83, y: 794, w: 268, h: 12, chat: true, fs: 15.5 },
        { s: 'mágico, com bolos de cenoura e',    x: 83, y: 815, w: 252, h: 12, chat: true, fs: 15.5 },
        { s: 'o outro com blueberry, ganache',    x: 83, y: 836, w: 250, h: 12, chat: true, fs: 15.5 },
        { s: 'de maracujá e cream cheese.',       x: 83, y: 857, w: 232, h: 12, chat: true, fs: 15.5 },
        { s: ' Muito feliz com o curso e com',    x: 83, y: 878, w: 240, h: 12, chat: true, fs: 15.5 },
        { s: 'minha experiência.',                x: 83, y: 899, w: 148, h: 12, chat: true, fs: 15.5 }
      ]
    },

    /* ============================================================ 5 */
    {
      base: 'car2-5.png',
      cert: { x: 340, y: 466, w: 290, h: 220 },
      certNome: 'Alejandra Gutiérrez',
      clean: [
        { x: 0, y: 115, w: 675, h: 155, tipo: 'mode' },
        { x: 366, y: 334, w: 240, h: 122, tipo: 'pintar' },
        { x: 0, y: 938, w: 675, h: 155, tipo: 'mode' },
        { x: 76, y: 692, w: 268, h: 46, tipo: 'mode' },
        { x: 76, y: 738, w: 222, h: 26, tipo: 'mode' },
        { x: 76, y: 770, w: 152, h: 26, tipo: 'mode' },  // balões brancos
        { x: 144, y: 868, w: 286, h: 68, tipo: 'mode' }   // balão verde final
      ],
      text: [
        { s: 'OBRIGADA!', x: 141, y: 127, w: 393, h: 55, c: VERMELHO, peso: 800 },
        { s: 'RECEBER SUAS FOTOS E VER SEU TALENTO', x: 107, y: 206, w: 460, h: 21, c: MARINHO, peso: 800 },
        { s: 'ENCHE NOSSO CORAÇÃO', x: 108, y: 232, w: 459, h: 27, c: MARINHO, peso: 800 },

        { s: 'MUITO MERECIDO SEU', x: 373, y: 341, w: 222, h: 17, c: MARINHO, peso: 800 },
        { s: 'CERTIFICADO',        x: 373, y: 364, w: 222, h: 24, c: MARINHO, peso: 800 },
        { s: 'DE CONFEITEIRA',     x: 373, y: 394, w: 222, h: 22, c: MARINHO, peso: 800 },
        { s: 'PROFISSIONAL',       x: 373, y: 423, w: 222, h: 22, c: MARINHO, peso: 800 },

        { s: 'VAMOS DAR UMA GRANDE',      x: 129, y: 953,  w: 416, h: 30, c: VERMELHO, peso: 800 },
        { s: 'SALVA DE PALMAS PARA MARÍA', x: 129, y: 991,  w: 416, h: 21, c: VERMELHO, peso: 800 },
        { s: 'SOLEDAD',                    x: 129, y: 1018, w: 416, h: 65, c: VERMELHO, peso: 800 },

        { s: 'O creme é a coisa mais',        x: 83, y: 698, w: 205, h: 12, chat: true, fs: 15.5 },
        { s: 'espetacular do mundo. É sedoso,', x: 83, y: 719, w: 256, h: 12, chat: true, fs: 15.5 },
        { s: 'gostoso e fácil de usar🥰', x: 83, y: 740, w: 205, h: 12, chat: true, fs: 15.5 },
        { s: 'Literal é mágico',              x: 83, y: 776, w: 140, h: 12, chat: true, fs: 15.5 },

        { s: 'Fiquei sem palavras!!!!',        x: 151, y: 875, w: 190, h: 12, chat: true, fs: 15.5 },
        { s: '❤️ é um dos bolos MAIS',          x: 151, y: 900, w: 200, h: 12, chat: true, fs: 15.5 },
        { s: 'LINDOS que já recebemos',        x: 151, y: 922, w: 210, h: 12, chat: true, fs: 15.5 }
      ]
    }
  ].map(function (d) { d.CERT = CERT; d.CERT_TEXTO = CERT_TEXTO; return d; });
})();
