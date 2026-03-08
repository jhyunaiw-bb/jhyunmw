(function () {
  "use strict";

  /* ==========================================================
     1. Header Scroll State
  ========================================================== */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader) return;
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /* ==========================================================
     2. DOM Content Loaded Initialization
  ========================================================== */
  document.addEventListener('DOMContentLoaded', () => {

    const selectBody = document.querySelector('body');
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

    /* --- Mobile Navigation Toggle Function --- */
    function mobileNavToogle() {
      selectBody.classList.toggle('mobile-nav-active');
      if (mobileNavToggleBtn) {
        mobileNavToggleBtn.classList.toggle('bi-list');
        mobileNavToggleBtn.classList.toggle('bi-x');
      }
    }

    /* --- Mobile Menu Button Click --- */
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        mobileNavToogle();
      });
    }

    /* --- Close Mobile Menu on Link Click --- */
    document.querySelectorAll('#navmenu a').forEach(navmenu => {
      navmenu.addEventListener('click', () => {
        if (selectBody.classList.contains('mobile-nav-active')) {
          mobileNavToogle();
        }
      });
    });

    /* --- Mobile Dropdown Accordion --- */
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
      navmenu.addEventListener('click', function (e) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        const nextUl = this.parentNode.nextElementSibling;
        if (nextUl) {
          nextUl.classList.toggle('dropdown-active');
        }
        e.stopImmediatePropagation();
      });
    });



    
    /* --- Portfolio Filtering & Smooth Scroll --- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-card');
    const header = document.querySelector('.header');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', function (e) {
        if (this.closest('.dropdown')) {
          e.preventDefault();
        }

        const filterValue = this.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || filterValue === itemCategory) {
            item.classList.remove('hide');
          } else {
            item.classList.add('hide');
          }
        });

        const href = this.getAttribute('href');
        if (href && href.includes('#')) {
          const targetSectionId = href.split('#')[1];
          const targetSection = document.getElementById(targetSectionId);

          if (targetSection) {
            const headerOffset = header ? header.offsetHeight : 0;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    /* --- Reset Mobile Menu on Window Resize --- */
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1200) {
        if (selectBody.classList.contains('mobile-nav-active')) {
          selectBody.classList.remove('mobile-nav-active');
          if (mobileNavToggleBtn) {
            mobileNavToggleBtn.classList.add('bi-list');
            mobileNavToggleBtn.classList.remove('bi-x');
          }
        }
      }
    });

  });

  /* ==========================================================
     3. Plugins & Component Initialization
  ========================================================== */
  
  /* --- Preloader --- */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /* --- Scroll Top Button --- */
  let scrollTop = document.querySelector('.scroll-top');
  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /* --- AOS (Animation on Scroll) --- */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }
  window.addEventListener('load', aosInit);

  /* --- Skills Animation (Waypoint) --- */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    if (typeof Waypoint !== 'undefined') {
      new Waypoint({
        element: item,
        offset: '80%',
        handler: function (direction) {
          let progress = item.querySelectorAll('.progress .progress-bar');
          progress.forEach(el => {
            el.style.width = el.getAttribute('aria-valuenow') + '%';
          });
        }
      });
    }
  });

  /* --- GLightbox --- */
  if (typeof GLightbox !== 'undefined') {
    const glightbox = GLightbox({
      selector: '.glightbox',
      zoomable: false,
      draggable: false,
      touchNavigation: false,
      loop: false
    });

    glightbox.on('slide_after_load', (data) => {
      const { slideNode } = data;
      const img = slideNode.querySelector('img');
      if (img) {
        img.style.cursor = 'pointer';
        img.onclick = () => { glightbox.close(); };
      }
    });
  }

  /* --- Isotope Layout --- */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    if (typeof imagesLoaded !== 'undefined' && typeof Isotope !== 'undefined') {
      imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
        initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });
      });

      isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
        filters.addEventListener('click', function () {
          isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
          this.classList.add('filter-active');
          initIsotope.arrange({ filter: this.getAttribute('data-filter') });
          if (typeof aosInit === 'function') aosInit();
        }, false);
      });
    }
  });

  /* --- Swiper Sliders --- */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      if (typeof Swiper !== 'undefined') {
        let config = JSON.parse(swiperElement.querySelector(".swiper-config").innerHTML.trim());
        new Swiper(swiperElement, config);
      }
    });
  }
  window.addEventListener("load", initSwiper);

  /* --- FAQ Toggle --- */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /* --- Hash Links Scroll Position Correction --- */
  window.addEventListener('load', function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /* --- Navmenu Scrollspy --- */
  let navmenulinks = document.querySelectorAll('.navmenu a');
  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();