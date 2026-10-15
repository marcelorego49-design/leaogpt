/* Leão Play — interfaces e Meta Pixel na carga, respeitando recusas expressas registradas. */
(() => {
  'use strict';
  const PIXEL_ID = '1419384443735371';
  const VIDEO_ID = 'wuzB7MB8KTY';
  const WHATSAPP_NUMBER = '5591991618878';
  const CONSENT_KEY = 'leaoPlayMarketingConsent_v1';
  const page = document.documentElement.dataset.page || 'home';
  const messages = {
    teste: 'Olá! Vim pelo site da Leão Play e gostaria de solicitar um teste grátis. Como funciona?',
    mensal: 'Olá! Conheci a Leão Play pelo site e tenho interesse no IPTV mensal. Gostaria de confirmar o valor para meu aparelho.',
    trimestral: 'Olá! Conheci a Leão Play pelo site e tenho interesse no plano trimestral IPTV. Gostaria de confirmar o valor final e as condições.',
    anual: 'Olá! Conheci a Leão Play pelo site e tenho interesse no plano anual IPTV. Gostaria de confirmar o valor final e as condições.',
    p2p: 'Olá! Conheci a Leão Play pelo site e gostaria de receber informações sobre o P2P para Android.',
    video: 'Olá! Assisti à demonstração no site da Leão Play e gostaria de solicitar um teste.',
    geral: 'Olá! Conheci a Leão Play pelo site e gostaria de conhecer as opções disponíveis para meu aparelho.'
  };
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];
  const consentRead = () => { try { return localStorage.getItem(CONSENT_KEY); } catch (_) { return null; } };
  const consentWrite = (choice) => { try { localStorage.setItem(CONSENT_KEY, choice); } catch (_) { /* If storage is unavailable, keep this session only. */ } };
  let pixelStarted = false;
  // Modo solicitado para medição na entrada: ativo na ausência de recusa previamente registrada.
  // Atenção: não constitui consentimento automático; validar a base legal do tratamento antes da publicação.
  let marketingTrackingEnabled = consentRead() !== 'rejected';

  function startPixel() {
    if (pixelStarted || !marketingTrackingEnabled) return;
    pixelStarted = true;
    // Bootstrap assíncrono oficial: inicialização uma vez por página, salvo recusa registrada.
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    if (typeof window.fbq === 'function') {
      window.fbq('init', PIXEL_ID);
      window.fbq('track', 'PageView');
      if (page === 'plans') window.fbq('track', 'ViewContent', { content_name: 'Planos Leão Play' });
    }
  }
  function updateConsentStatus() {
    const status = $('#cookie-status');
    if (!status) return;
    const choice = consentRead();
    status.textContent = choice === 'accepted'
      ? 'Preferência atual: medição publicitária ativada.'
      : choice === 'rejected'
        ? 'Preferência atual: medição publicitária desativada.'
        : 'Sem preferência registrada. A medição publicitária está ativada neste modo e pode ser desativada abaixo.';
  }
  function saveConsent(value) {
    marketingTrackingEnabled = value === 'accepted';
    consentWrite(value);
    updateConsentStatus();
    if (marketingTrackingEnabled) startPixel();
    // A page refresh clears an already initialized pixel after consent is revoked.
    else if (pixelStarted) window.location.reload();
  }
  $$('[data-cookie-accept]').forEach(el => el.addEventListener('click', () => saveConsent('accepted')));
  $$('[data-cookie-reject]').forEach(el => el.addEventListener('click', () => saveConsent('rejected')));
  updateConsentStatus();
  if (marketingTrackingEnabled) startPixel();

  $$('a[data-wa]').forEach(link => {
    const kind = link.dataset.wa;
    const msg = messages[kind] || messages.geral;
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    link.addEventListener('click', () => {
      if (marketingTrackingEnabled && typeof window.fbq === 'function') {
        window.fbq('track', 'Contact', { content_name: `whatsapp_${kind}` });
      }
    });
  });

  // Only one FAQ answer at a time. All start closed.
  const faqItems = $$('.faq-list details');
  faqItems.forEach(item => {
    item.open = false;
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      faqItems.forEach(other => { if (other !== item) other.open = false; });
    });
  });

  const menuBtn = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const opening = mobileNav.hidden;
      mobileNav.hidden = !opening;
      menuBtn.setAttribute('aria-expanded', String(opening));
      menuBtn.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
      if (opening) mobileNav.querySelector('a')?.focus();
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileNav.hidden = true;
      menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  $$('#year').forEach(el => el.textContent = String(new Date().getFullYear()));

  // Optional fallbacks when a remote R2 file cannot load.
  $$('.hero-image').forEach(img => img.addEventListener('error', () => {
    img.hidden = true;
    const fallback = img.parentElement?.querySelector('.image-error');
    if (fallback) fallback.hidden = false;
  }));
  // A broken R2 URL must not leave an empty tile in the moving carousel.
  // Remove both repeated instances of the same image so both halves remain identical.
  const logoImgs = $$('.marquee-set .logo-tile img');
  const removeFailedLogo = (failedImg) => {
    const src = failedImg.getAttribute('src');
    logoImgs.forEach(img => {
      if (img.getAttribute('src') === src) img.closest('.logo-tile')?.remove();
    });
  };
  logoImgs.forEach(img => {
    img.addEventListener('error', () => removeFailedLogo(img));
    // Catch failures that happened before DOMContentLoaded / listener registration.
    if (img.complete && img.naturalWidth === 0) removeFailedLogo(img);
  });

  // Load the YouTube video when the demonstration enters the viewport.
  // Autoplay in mudo is requested; each browser decides whether to allow it.
  const videoBox = $('#video-frame');
  let videoLoaded = false;
  function loadVideo() {
    if (!videoBox || videoLoaded) return;
    videoLoaded = true;
    const iframe = document.createElement('iframe');
    const params = new URLSearchParams({
      autoplay: '1', mute: '1', loop: '1', playlist: VIDEO_ID,
      controls: '1', playsinline: '1', rel: '0', modestbranding: '1'
    });
    iframe.src = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?${params.toString()}`;
    iframe.title = 'Demonstração do aplicativo Leão Play';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    videoBox.replaceChildren(iframe);
  }
  $('#video-launch')?.addEventListener('click', loadVideo);
  if (videoBox && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(item => item.isIntersecting)) { loadVideo(); observer.disconnect(); }
    }, { threshold: 0.25 });
    observer.observe(videoBox);
  } else if (videoBox) {
    loadVideo();
  }
})();
