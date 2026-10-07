/**
 * ButtercreamPro BR — comportamento da página.
 * Tudo que é configurável vive em assets/js/config.js.
 */
(function () {
  'use strict';

  var CFG = window.BP_CONFIG || {};

  /* =================================================================
     Preços e textos derivados da configuração
     ============================================================== */
  function money(value) {
    return (CFG.currency || '') + ' ' + value;
  }

  var VALUES = {
    discount: String(CFG.discountPercentage),
    priceOriginal: money(CFG.originalPrice),
    priceOffer: money(CFG.offerPrice),
    bonusReceitasVirais: money((CFG.bonusPrices || {}).receitasVirais),
    bonusNyCookies: money((CFG.bonusPrices || {}).nyCookies),
    bonusMiniCheesecakes: money((CFG.bonusPrices || {}).miniCheesecakes)
  };

  /* Qualquer bônus novo em config.bonusPrices vira um data-bp sozinho:
     `miniDonuts` -> data-bp="bonusMiniDonuts". Evita ter que mexer aqui
     toda vez que um bônus entra na página. */
  (function () {
    var b = CFG.bonusPrices || {};
    for (var k in b) {
      if (!Object.prototype.hasOwnProperty.call(b, k)) continue;
      VALUES['bonus' + k.charAt(0).toUpperCase() + k.slice(1)] = money(b[k]);
    }
  })();

  function applyValues() {
    var nodes = document.querySelectorAll('[data-bp]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-bp');
      if (VALUES[key] !== undefined && VALUES[key] !== 'undefined') {
        nodes[i].textContent = VALUES[key];
      }
    }
  }

  /* =================================================================
     Checkout — um único destino para todos os CTAs
     ============================================================== */
  var FORWARD_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term',
                        'utm_content', 'utm_id', 'gclid', 'fbclid', 'ttclid'];

  function buildCheckoutUrl() {
    var base = CFG.checkoutUrl || '#';
    if (!CFG.forwardUtmParams) return base;
    try {
      var here = new URL(window.location.href);
      var target = new URL(base);
      FORWARD_PARAMS.forEach(function (name) {
        var value = here.searchParams.get(name);
        if (value) target.searchParams.set(name, value);
      });
      return target.toString();
    } catch (e) {
      return base;
    }
  }

  function wireCheckout() {
    var url = buildCheckoutUrl();
    var links = document.querySelectorAll('[data-checkout]');
    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute('href', url);
      links[i].addEventListener('click', onCheckoutClick);
    }
  }

  function onCheckoutClick() {
    var name = (CFG.tracking || {}).checkoutEventName || 'InitiateCheckout';
    var payload = {
      value: CFG.offerPrice,
      currency: CFG.currency,
      label: (this.querySelector('.btn__text') || {}).textContent || ''
    };
    /* Evento próprio da página: qualquer ferramenta pode escutar isto. */
    document.dispatchEvent(new CustomEvent('bp:checkout_click', { detail: payload }));
    if (typeof window.fbq === 'function') window.fbq('track', name, payload);
    if (typeof window.gtag === 'function') window.gtag('event', name, payload);
    if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, bp: payload });
  }

  /* =================================================================
     Rastreamento — só carrega o que tiver ID configurado
     ============================================================== */
  function initTracking() {
    var t = CFG.tracking || {};

    if (t.gtmId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      loadScript('https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(t.gtmId));
    }

    if (t.ga4Id) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', t.ga4Id);
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(t.ga4Id));
    }

    if (t.metaPixelId) {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq('init', t.metaPixelId);
      window.fbq('track', 'PageView');
    }
  }

  function loadScript(src) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  /* =================================================================
     Contadores "evergreen"
     A duração é em segundos. A data-limite fica no localStorage, então
     recarregar a página não reinicia a contagem — ela só recomeça
     quando zera ou quando a duração configurada muda.
     ============================================================== */
  function initCountdowns() {
    var nodes = document.querySelectorAll('[data-countdown]');
    for (var i = 0; i < nodes.length; i++) startCountdown(nodes[i]);
  }

  function startCountdown(el) {
    var key = el.getAttribute('data-countdown');
    var interval = (CFG.countdowns || {})[key];
    if (!interval) return;

    var id = el.getAttribute('data-countdown-id') || key;
    var dueDate = readDueDate(id, interval);

    var digits = {
      hours: el.querySelector('[data-unit="hours"]'),
      minutes: el.querySelector('[data-unit="minutes"]'),
      seconds: el.querySelector('[data-unit="seconds"]')
    };

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function tick() {
      var remaining = Math.floor((dueDate - Date.now()) / 1000);
      if (remaining <= 0) {
        /* Igual ao original: expirou, começa um novo ciclo. */
        dueDate = writeDueDate(id, interval);
        remaining = interval;
      }
      digits.hours.textContent = pad(Math.floor(remaining / 3600));
      digits.minutes.textContent = pad(Math.floor(remaining / 60) % 60);
      digits.seconds.textContent = pad(remaining % 60);
    }

    tick();
    setInterval(tick, 1000);
  }

  function readDueDate(id, interval) {
    try {
      var savedDue = parseInt(localStorage.getItem(id + '-evergreen_due_date'), 10);
      var savedInterval = parseInt(localStorage.getItem(id + '-evergreen_interval'), 10);
      if (savedDue && savedInterval === interval && savedDue > Date.now()) return savedDue;
    } catch (e) { /* storage indisponível: cai no valor novo */ }
    return writeDueDate(id, interval);
  }

  function writeDueDate(id, interval) {
    var due = Date.now() + interval * 1000;
    try {
      localStorage.setItem(id + '-evergreen_due_date', String(due));
      localStorage.setItem(id + '-evergreen_interval', String(interval));
    } catch (e) { /* segue sem persistir */ }
    return due;
  }

  /* =================================================================
     Carrossel
     Mesmos parâmetros do original: laço infinito, avanço automático a
     cada 5s, 3 itens no desktop, 2 no tablet e 1 no mobile.
     ============================================================== */
  var SPEED = 500;

  function slidesPerView() {
    if (window.matchMedia('(max-width: 767px)').matches) return 1;
    if (window.matchMedia('(max-width: 1024px)').matches) return 2;
    return 3;
  }

  function initCarousels() {
    var nodes = document.querySelectorAll('[data-carousel]');
    /* Os fundos vêm no HTML: chegam junto com a página e os clones do laço
       os herdam automaticamente. Sem carregamento preguiçoso, sem seção em
       branco. */
    for (var i = 0; i < nodes.length; i++) new Carousel(nodes[i]);
  }

  function Carousel(root) {
    this.root = root;
    this.track = root.querySelector('.carousel__track');
    this.viewport = root.querySelector('.carousel__viewport');
    this.gap = parseInt(root.getAttribute('data-gap'), 10) || 0;
    this.autoplayMs = parseInt(root.getAttribute('data-autoplay'), 10) || 0;
    this.originals = Array.prototype.slice.call(this.track.children);
    this.count = this.originals.length;
    this.pv = 0;
    this.index = 0;
    this.timer = null;
    this.paused = false;

    this.build();
    this.bind();
  }

  /** (Re)monta os clones do laço para o número de itens visíveis atual. */
  Carousel.prototype.build = function () {
    var pv = slidesPerView();
    if (pv === this.pv) { this.layout(); return; }
    this.pv = pv;

    this.track.innerHTML = '';
    var i;
    for (i = this.count - pv; i < this.count; i++) this.track.appendChild(this.originals[i].cloneNode(true));
    for (i = 0; i < this.count; i++) this.track.appendChild(this.originals[i].cloneNode(true));
    for (i = 0; i < pv; i++) this.track.appendChild(this.originals[i].cloneNode(true));

    this.index = pv;
    this.layout();
  };

  /** Recalcula larguras e reposiciona sem animação. */
  Carousel.prototype.layout = function () {
    var total = this.viewport.clientWidth;
    this.slideW = (total - this.gap * (this.pv - 1)) / this.pv;
    var slides = this.track.children;
    for (var i = 0; i < slides.length; i++) {
      slides[i].style.width = this.slideW + 'px';
      slides[i].style.marginRight = this.gap + 'px';
    }
    this.move(false);
  };

  Carousel.prototype.move = function (animate) {
    this.track.style.transitionDuration = animate ? SPEED + 'ms' : '0ms';
    this.track.style.transform = 'translate3d(' + (-this.index * (this.slideW + this.gap)) + 'px,0,0)';
  };

  Carousel.prototype.go = function (delta) {
    if (this.animando) return;          /* ignora cliques durante a animação */
    var self = this;
    this.animando = true;
    this.index += delta;
    this.move(true);

    /* O retorno ao primeiro slide NÃO pode depender de `transitionend`:
       quem usa "reduzir movimento" no celular não tem transição, o evento
       nunca dispara e o carrossel seguia para fora da pista, ficando em
       branco. Um temporizador resolve em qualquer cenário. */
    clearTimeout(this.tNormaliza);
    this.tNormaliza = setTimeout(function () {
      self.normalize();
      self.animando = false;
    }, SPEED + 60);
  };

  Carousel.prototype.normalize = function () {
    if (this.index >= this.count + this.pv) { this.index -= this.count; this.move(false); }
    else if (this.index < this.pv) { this.index += this.count; this.move(false); }
  };

  Carousel.prototype.bind = function () {
    var self = this;

    var prev = this.root.querySelector('.carousel__btn--prev');
    var next = this.root.querySelector('.carousel__btn--next');
    /* As setas apenas reiniciam a contagem — o giro automático continua,
       para o carrossel nunca parar em um slide. */
    if (prev) prev.addEventListener('click', function () { self.go(-1); self.reiniciar(); });
    if (next) next.addEventListener('click', function () { self.go(1); self.reiniciar(); });

    /* Pausa ao passar o mouse, como no original. */
    this.root.addEventListener('mouseenter', function () { self.paused = true; });
    this.root.addEventListener('mouseleave', function () { self.paused = false; });

    /* Só remonta quando a LARGURA muda. No celular, a barra de endereço
       sumindo ao rolar dispara um resize de altura — e remontar ali era o
       que apagava todas as fotos do carrossel. */
    var resizeTimer, larguraAnterior = window.innerWidth;
    window.addEventListener('resize', function () {
      if (window.innerWidth === larguraAnterior) return;
      larguraAnterior = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { self.build(); }, 150);
    });

    this.start();
  };

  Carousel.prototype.start = function () {
    var self = this;
    if (!this.autoplayMs) return;
    this.timer = setInterval(function () {
      if (!self.paused && !document.hidden) self.go(1);
    }, this.autoplayMs);
  };

  Carousel.prototype.stop = function () {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  };

  /* Zera a contagem do giro automático depois de um clique nas setas. */
  Carousel.prototype.reiniciar = function () {
    this.stop();
    this.start();
  };

  /* =================================================================
     Animações de entrada
     ============================================================== */
  function initReveal() {
    var targets = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

    /* No mobile os botões de compra também têm animação no original. */
    if (window.matchMedia('(max-width: 767px)').matches) {
      targets = targets.concat(Array.prototype.slice.call(
        document.querySelectorAll('.offer__cta-w .btn-wrap, .final__cta-w .btn-wrap')));
    }

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* =================================================================
     Persuasão: data de hoje, contador de vagas e card de abertura.
     Tudo ligado/desligado por config.js → persuasao.
     ============================================================== */
  var P = CFG.persuasao || {};

  /** Escreve a data de hoje ("24 de setembro") nos elementos marcados. */
  function aplicarDataDeHoje() {
    var alvos = document.querySelectorAll('[data-hoje]');
    if (!alvos.length) return;
    var hoje = new Date();
    if (!P.mostrarDataDeHoje) {
      esconderSecao('[data-persuasao="barraUrgencia"]');
      return;
    }
    var texto = hoje.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
    var iso = hoje.getFullYear() + '-' +
              String(hoje.getMonth() + 1).padStart(2, '0') + '-' +
              String(hoje.getDate()).padStart(2, '0');
    for (var i = 0; i < alvos.length; i++) {
      alvos[i].textContent = texto;
      alvos[i].setAttribute('datetime', iso);
    }
  }

  /** Contador de vagas: começa no valor inicial e baixa uma vez. */
  function aplicarEscassez() {
    var wrap = document.querySelector('[data-vagas-wrap]');
    if (!wrap) return;
    if (!P.escassezVagas) { wrap.hidden = true; return; }

    var campo = wrap.querySelector('[data-vagas]');
    campo.textContent = P.vagasIniciais;

    var jaBaixou = false;
    try { jaBaixou = sessionStorage.getItem('bp_vagas') === 'baixou'; } catch (e) {}

    if (jaBaixou) { campo.textContent = P.vagasFinais; wrap.classList.add('is-baixou'); return; }

    setTimeout(function () {
      campo.textContent = P.vagasFinais;
      wrap.classList.add('is-baixou');
      try { sessionStorage.setItem('bp_vagas', 'baixou'); } catch (e) {}
    }, (P.segundosParaBaixar || 90) * 1000);
  }

  function aplicarGarantia() {
    var dias = P.diasGarantia || 7;
    var alvos = document.querySelectorAll('[data-garantia-dias]');
    for (var i = 0; i < alvos.length; i++) alvos[i].textContent = dias;
  }

  function aplicarPrecoSobe() {
    if (P.avisoPrecoSobe) return;
    var avisos = document.querySelectorAll('[data-persuasao="precoSobe"]');
    for (var i = 0; i < avisos.length; i++) avisos[i].hidden = true;
  }

  function esconderSecao(seletor) {
    var el = document.querySelector(seletor);
    if (el) el.hidden = true;
  }

  /** Card de abertura: aparece uma vez por sessão. */
  function iniciarCardAbertura() {
    var card = document.querySelector('[data-abertura]');
    if (!card) return;
    if (!P.cardAbertura) return;

    var jaViu = false;
    try { jaViu = sessionStorage.getItem('bp_abertura') === 'visto'; } catch (e) {}
    if (jaViu) return;

    function fechar() {
      card.hidden = true;
      document.body.style.overflow = '';
      try { sessionStorage.setItem('bp_abertura', 'visto'); } catch (e) {}
      document.removeEventListener('keydown', aoTeclar);
    }
    function aoTeclar(ev) { if (ev.key === 'Escape') fechar(); }

    card.querySelectorAll('[data-abertura-fechar]').forEach(function (b) {
      b.addEventListener('click', fechar);
    });
    var sim = card.querySelector('[data-abertura-sim]');
    if (sim) sim.addEventListener('click', function () {
      /* a resposta "sim" também serve de sinal de intenção para o tracking */
      document.dispatchEvent(new CustomEvent('bp:abertura_sim'));
      fechar();
    });
    card.addEventListener('click', function (ev) { if (ev.target === card) fechar(); });
    document.addEventListener('keydown', aoTeclar);

    /* mostra só depois da primeira pintura, para não atrapalhar o LCP */
    setTimeout(function () {
      card.hidden = false;
      document.body.style.overflow = 'hidden';
      if (sim) sim.focus();
    }, 1200);
  }

  /* =================================================================
     Início
     ============================================================== */
  function init() {
    applyValues();
    wireCheckout();
    initCountdowns();
    initCarousels();
    initReveal();
    aplicarDataDeHoje();
    aplicarEscassez();
    aplicarGarantia();
    aplicarPrecoSobe();
    iniciarCardAbertura();
    initTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
