const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // fecha todos os outros itens abertos (efeito "sanfona": só um aberto por vez)
    faqItems.forEach(i => i.classList.remove('open'));

    // se o item clicado já estava fechado, abre ele
    if (!isOpen) {
      item.classList.add('open');
    }
  });
});