document.addEventListener('DOMContentLoaded', () => {

  // --- Variáveis Globais ---
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-btn');
  const themeBtn = document.getElementById('theme-toggle');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navList = document.querySelector('.nav-links');
  const iconTheme = themeBtn.querySelector('i');

  // --- 1. Navigation System (SPA Feel) ---
  function switchSection(targetId) {
    // Remover classe ativa de todas as seções e links
    sections.forEach(sec => sec.classList.remove('active'));
    navLinks.forEach(link => {
      link.classList.remove('active');
      // Marca o link como ativo se corresponder ao target (mesmo se clicado em outro lugar)
      if (link.getAttribute('data-target') === targetId) {
        link.classList.add('active');
      }
    });

    // Adicionar classe ativa na seção alvo
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Fechar menu mobile se estiver aberto
    navList.classList.remove('active');
    const mobileIcon = mobileBtn.querySelector('i');
    if (mobileIcon) {
      mobileIcon.classList.replace('bi-x-lg', 'bi-list');
    }

    updateDots(targetId);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      switchSection(target);
    });
  });

  // --- 2. Theme Toggle (Light/Dark) ---
  const getCurrentTheme = () => document.body.getAttribute('data-theme');

  // Check LocalStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);
  }

  themeBtn.addEventListener('click', () => {
    const current = getCurrentTheme();
    const newTheme = current === 'dark' ? 'light' : 'dark';

    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
  });

  function updateIcon(theme) {
    if (theme === 'dark') {
      iconTheme.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
    } else {
      iconTheme.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
    }
  }

  // --- 3. Home Slider Background ---
  const slides = document.querySelectorAll('.hero-slider .slide');
  let currentSlide = 0;
  const slideInterval = 5000; // 5 segundos

  function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  setInterval(nextSlide, slideInterval);

  // ==================================================
  // PROJECT FILTERS
  // ==================================================

  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Remove classe ativa de todos e adiciona no clicado
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // 2. Pega o valor do filtro (web, data, auto, all)
      const filterValue = btn.getAttribute('data-filter');

      // 3. Loop nos projetos para mostrar/esconder
      projectItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || filterValue === itemCategory) {
          item.classList.remove('hide');
          item.classList.add('show');
        } else {
          item.classList.add('hide');
          item.classList.remove('show');
        }
      });
    });
  });

  // --- 4. Testimonials Slider (Manual) ---
  const testimItems = document.querySelectorAll('.testimonial-item');
  const prevBtn = document.getElementById('prev-testim');
  const nextBtn = document.getElementById('next-testim');
  let currentTestim = 0;

  function showTestimonial(index) {
    testimItems.forEach(item => item.classList.remove('active'));
    testimItems[index].classList.add('active');
  }

  nextBtn.addEventListener('click', () => {
    currentTestim = (currentTestim + 1) % testimItems.length;
    showTestimonial(currentTestim);
  });

  prevBtn.addEventListener('click', () => {
    currentTestim = (currentTestim - 1 + testimItems.length) % testimItems.length;
    showTestimonial(currentTestim);
  });

  // --- 5. Mobile Menu ---
  mobileBtn.addEventListener('click', () => {
    navList.classList.toggle('active');
    // Troca ícone
    const icon = mobileBtn.querySelector('i');
    if (navList.classList.contains('active')) {
      icon.classList.replace('bi-list', 'bi-x-lg');
    } else {
      icon.classList.replace('bi-x-lg', 'bi-list');
    }
  });

  // --- 6. Dynamic Year ---
  document.getElementById('year').textContent = new Date().getFullYear();

  // ==================================================
  //  VISUAL ENHANCEMENTS (NEW CODE)
  // ==================================================

  // --- 1. Typewriter Effect (Efeito de Digitação) ---
  const TypeWriter = function (txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  TypeWriter.prototype.type = function () {
    // Current index of word
    const current = this.wordIndex % this.words.length;
    // Get full text of current word
    const fullTxt = this.words[current];

    // Check if deleting
    if (this.isDeleting) {
      // Remove char
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      // Add char
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insert txt into element
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    // Initial Type Speed
    let typeSpeed = 100;

    if (this.isDeleting) {
      typeSpeed /= 2; // Faster deletion
    }

    // If word is complete
    if (!this.isDeleting && this.txt === fullTxt) {
      // Make pause at end
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      // Move to next word
      this.wordIndex++;
      // Pause before start typing
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }

  // Init Typewriter
  const txtElement = document.querySelector('.txt-type');
  if (txtElement) {
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    new TypeWriter(txtElement, words, wait);
  }


  // --- 2. 3D Tilt Effect (Cards) ---
  const cards = document.querySelectorAll('.skill-card, .project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const cardRect = card.getBoundingClientRect();
      const x = e.clientX - cardRect.left - cardRect.width / 2;
      const y = e.clientY - cardRect.top - cardRect.height / 2;

      const rotateX = y / -20;
      const rotateY = x / 20;

      // ADICIONAMOS "perspective(1000px)" AQUI DENTRO DA STRING 👇
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`;
    });

    card.addEventListener('mouseleave', () => {
      // Resetamos mantendo a perspectiva zerada ou removendo tudo
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
  });


  // --- 3. Custom Cursor ---
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  // Mouse Movement Tracking
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot moves instantly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline moves with slight delay (using CSS transition for smoothness)
    cursorOutline.style.left = `${posX}px`;
    cursorOutline.style.top = `${posY}px`;
  });

  // Hover effect on clickable elements
  const clickableElements = document.querySelectorAll('a, button, .skill-card, .project-card');
  clickableElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });


  // --- 4. Interactive Parallax Background (Home Section) ---
  const homeSection = document.getElementById('home');

  homeSection.addEventListener('mousemove', (e) => {
    const slides = document.querySelectorAll('.hero-slider .slide.active');

    // Calculate mouse position relative to center of window (-1 to 1 range)
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;

    // Movement intensity factor (negativo para mover na direção oposta ao mouse)
    const movementFactor = -25;

    slides.forEach(slide => {
      // Apply translation based on mouse position
      slide.style.transform = `translate(${x * movementFactor}px, ${y * movementFactor}px)`;
    });
  });

  // Reset parallax on mouse leave
  homeSection.addEventListener('mouseleave', () => {
    const slides = document.querySelectorAll('.hero-slider .slide');
    slides.forEach(slide => {
      slide.style.transform = `translate(0px, 0px)`;
    });
  })

  // ==================================================
  // UX LOGIC (NEW CODE)
  // ==================================================

  // 1. Preloader Logic
  // Usamos 'window.addEventListener("load")' fora do DOMContentLoaded
  // para garantir que todas as imagens pesadas carregaram
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('loaded');
      // Opcional: Remover do DOM após a animação para liberar memória
      setTimeout(() => preloader.style.display = 'none', 550);
    }
  });

  // 2. Integration: Update Dots & Navigation
  // Array ordenado das suas seções para navegação sequencial
  const sectionIds = ['home', 'about', 'skills', 'process', 'projects', 'testimonials', 'contact'];
  const dots = document.querySelectorAll('.dot');

  // Função auxiliar para atualizar o visual dos dots
  function updateDots(targetId) {
    dots.forEach(dot => {
      dot.classList.remove('active');
      if (dot.getAttribute('data-target') === targetId) {
        dot.classList.add('active');
      }
    });
  }

  // SOBREESCREVER (ou atualizar) sua função switchSection existente
  // para incluir a atualização dos dots
  const originalSwitchSection = switchSection; // Guardamos referência da antiga se necessário

  // Redefinindo a função switchSection para ser mais robusta
  switchSection = function (targetId) {
    // Lógica Visual das Seções (Mantém o que já existia)
    sections.forEach(sec => sec.classList.remove('active'));
    const targetSection = document.getElementById(targetId);
    if (targetSection) targetSection.classList.add('active');

    // Lógica do Header (Mantém o que já existia)
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-target') === targetId) link.classList.add('active');
    });
    navList.classList.remove('active'); // Fecha menu mobile

    // NOVA Lógica: Atualiza os dots laterais
    updateDots(targetId);
  };

  // Event Listener para os cliques nos Dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = dot.getAttribute('data-target');
      switchSection(target);
    });
  });

  // 3. Keyboard Navigation (Arrow Keys)
  document.addEventListener('keydown', (e) => {
    // Encontrar índice da seção atual
    // Procura qual seção tem a classe 'active'
    const currentSection = document.querySelector('.section.active');
    const currentId = currentSection ? currentSection.id : 'home';
    const currentIndex = sectionIds.indexOf(currentId);

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      // Próxima seção
      if (currentIndex < sectionIds.length - 1) {
        switchSection(sectionIds[currentIndex + 1]);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      // Seção anterior
      if (currentIndex > 0) {
        switchSection(sectionIds[currentIndex - 1]);
      }
    }
  });

  // ==================================================
  // CONTACT FORM (Serverless / AJAX)
  // ==================================================

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault(); // Impede o redirecionamento da página

      const data = new FormData(contactForm);
      const action = contactForm.getAttribute('action'); // Pega a URL do Formspree

      // Estado de "Enviando..."
      const btn = contactForm.querySelector('button');
      const originalBtnText = btn.innerHTML;
      btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div> Enviando...';
      btn.disabled = true;

      try {
        const response = await fetch(action, {
          method: 'POST',
          body: data,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          formStatus.textContent = "Mensagem enviada com sucesso! Entrarei em contato em breve.";
          formStatus.className = "form-status success";
          contactForm.reset(); // Limpa os campos
        } else {
          const jsonData = await response.json();
          if (Object.hasOwn(jsonData, 'errors')) {
            formStatus.textContent = jsonData["errors"].map(error => error["message"]).join(", ");
          } else {
            formStatus.textContent = "Oops! Ocorreu um erro ao enviar.";
          }
          formStatus.className = "form-status error";
        }
      } catch (error) {
        formStatus.textContent = "Erro de conexão. Tente novamente mais tarde.";
        formStatus.className = "form-status error";
      } finally {
        // Restaura o botão
        btn.innerHTML = originalBtnText;
        btn.disabled = false;

        // Limpa mensagem de status após 5 segundos
        setTimeout(() => {
          formStatus.textContent = "";
          formStatus.className = "form-status";
        }, 5000);
      }
    });
  }

  // ==================================================
  // 🚀 EXTRAS: SCROLL PROGRESS & BACK TO TOP (CORRIGIDO)
  // ==================================================

  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  // Função que calcula o progresso
  function updateScrollProgress(scrollTop, scrollHeight, clientHeight) {
    // Cálculo da porcentagem
    const totalScroll = scrollHeight - clientHeight;
    const percentage = (scrollTop / totalScroll) * 100;

    if (scrollProgress) {
      scrollProgress.style.width = percentage + "%";
    }

    if (backToTopBtn) {
      if (scrollTop > 30) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  }

  // 1. Escuta o Scroll da Janela (Desktop padrão)
  window.addEventListener('scroll', () => {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    updateScrollProgress(scrollTop, scrollHeight, clientHeight);
  });

  // 2. Escuta o Scroll das Seções (Correção para Tablet/Mobile com overflow)
  sections.forEach(section => {
    section.addEventListener('scroll', (e) => {
      const el = e.target;
      updateScrollProgress(el.scrollTop, el.scrollHeight, el.clientHeight);
    });
  });

  // 3. Clique do Botão Voltar ao Topo
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      // Tenta rolar a janela
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Tenta rolar todas as seções (para garantir)
      sections.forEach(section => {
        section.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }
});