
document.addEventListener('DOMContentLoaded', () => {

  const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));

  if (galleryImages.length === 0) return; // essa página não tem galeria, não faz nada

  let currentIndex = 0;
  let zoomLevel = 1;
  const maxZoom = 3;
  const minZoom = 1;

  // ---- cria o HTML do lightbox dinamicamente ----
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <div class="lightbox-topbar">
      <span class="lightbox-counter"></span>

      <div class="lightbox-actions">
        <button class="lightbox-btn lightbox-share" aria-label="Compartilhar">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M7 12L17 6M7 12l10 6M7 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
          </svg>
        </button>

        <button class="lightbox-btn lightbox-zoom" aria-label="Zoom">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.6">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/>
          </svg>
        </button>

        <button class="lightbox-btn lightbox-fullscreen" aria-label="Tela cheia">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/>
          </svg>
        </button>

        <button class="lightbox-btn lightbox-close" aria-label="Fechar">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M6 6l12 12M18 6L6 18"/>
          </svg>
        </button>
      </div>
    </div>

    <button class="lightbox-arrow lightbox-prev" aria-label="Anterior">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>

    <div class="lightbox-image-wrap">
      <img class="lightbox-image" src="" alt="">
    </div>

    <button class="lightbox-arrow lightbox-next" aria-label="Próxima">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  `;
  document.body.appendChild(overlay);

  const lightboxImg = overlay.querySelector('.lightbox-image');
  const imageWrap = overlay.querySelector('.lightbox-image-wrap');
  const counter = overlay.querySelector('.lightbox-counter');
  const btnClose = overlay.querySelector('.lightbox-close');
  const btnPrev = overlay.querySelector('.lightbox-prev');
  const btnNext = overlay.querySelector('.lightbox-next');
  const btnZoom = overlay.querySelector('.lightbox-zoom');
  const btnFullscreen = overlay.querySelector('.lightbox-fullscreen');
  const btnShare = overlay.querySelector('.lightbox-share');

  // ---- abrir / fechar ----
  function openLightbox(index) {
    currentIndex = index;
    updateImage();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (document.fullscreenElement) document.exitFullscreen();
  }

  function updateImage() {
    const img = galleryImages[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    zoomLevel = 1;
    lightboxImg.style.transform = 'scale(1)';
    counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateImage();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateImage();
  }

  // ---- zoom (clique no ícone alterna 1x → 2x → 1x) ----
  function toggleZoom() {
    zoomLevel = zoomLevel === 1 ? 2 : 1;
    lightboxImg.style.transform = `scale(${zoomLevel})`;
  }

  // ---- tela cheia ----
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      overlay.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }

  // ---- compartilhar (usa a Web Share API se disponível, senão copia o link da imagem) ----
  function shareImage() {
    const imgUrl = lightboxImg.src;

    if (navigator.share) {
      navigator.share({ url: imgUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(imgUrl).then(() => {
        alert('Link da imagem copiado!');
      });
    }
  }

  // ---- eventos ----
  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
  });

  btnClose.addEventListener('click', closeLightbox);
  btnNext.addEventListener('click', showNext);
  btnPrev.addEventListener('click', showPrev);
  btnZoom.addEventListener('click', toggleZoom);
  btnFullscreen.addEventListener('click', toggleFullscreen);
  btnShare.addEventListener('click', shareImage);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === imageWrap) closeLightbox();
  });

  imageWrap.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomLevel = e.deltaY < 0
      ? Math.min(zoomLevel + 0.5, maxZoom)
      : Math.max(zoomLevel - 0.5, minZoom);
    lightboxImg.style.transform = `scale(${zoomLevel})`;
  });

  lightboxImg.addEventListener('dblclick', toggleZoom);

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

});