
(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  document.addEventListener('DOMContentLoaded', () => {

    /**
       * 모바일 네비게이션 토글 (햄버거 메뉴)
       */
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.addEventListener('click', function (e) {
        document.querySelector('body').classList.toggle('mobile-nav-active');
        // 햄버거 메뉴 아이콘 변경 (☰ <-> ✕)
        if (document.querySelector('body').classList.contains('mobile-nav-active')) {
          this.innerHTML = '✕';
        } else {
          this.innerHTML = '☰';
        }
      });
    }

    /**
     * 모바일 네비게이션 드롭다운 아코디언 효과
     */
    document.querySelectorAll('.navmenu .dropdown > a').forEach(dropdownToggle => {
      dropdownToggle.addEventListener('click', function (e) {
        // 모바일 화면일 때만 JS 아코디언 동작 (PC는 CSS hover로 동작)
        if (window.innerWidth < 992) {
          e.preventDefault(); // 링크 이동 방지
          this.parentNode.classList.toggle('active');
        }
      });
    });

    /**
     * 포트폴리오 카테고리 필터링 및 스크롤 이동
     */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-card');
    const header = document.querySelector('.header');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', function (e) {
        // 서브 메뉴 안의 필터 버튼인 경우 기본 링크 이동 방지
        if (this.closest('.dropdown')) {
          e.preventDefault();
        }

        const filterValue = this.getAttribute('data-filter');

        // 1. 아이템 필터링 로직 (hide 클래스 추가/제거)
        portfolioItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || filterValue === itemCategory) {
            item.classList.remove('hide');
          } else {
            item.classList.add('hide');
          }
        });

        // 2. 해당 섹션으로 부드럽게 스크롤 이동
        const targetSectionId = this.getAttribute('href').replace('#', '');
        const targetSection = document.getElementById(targetSectionId);

        if (targetSection) {
          // 상단 고정 헤더의 높이만큼 뺀 위치 계산
          const headerOffset = header.offsetHeight;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }

        // 3. 클릭 후 열려있는 메뉴 접기 (모바일)
        if (document.body.classList.contains('mobile-nav-active')) {
          document.body.classList.remove('mobile-nav-active');
          if (mobileNavToggleBtn) mobileNavToggleBtn.innerHTML = '☰';

          // 열려있는 아코디언 모두 초기화
          document.querySelectorAll('.navmenu .dropdown.active').forEach(el => {
            el.classList.remove('active');
          });
        }
      });
    });

    /**
     * 창 크기 조절 시 모바일 메뉴 초기화
     */
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) {
        if (document.body.classList.contains('mobile-nav-active')) {
          document.body.classList.remove('mobile-nav-active');
          if (mobileNavToggleBtn) mobileNavToggleBtn.innerHTML = '☰';
          document.querySelectorAll('.navmenu .dropdown.active').forEach(el => {
            el.classList.remove('active');
          });
        }
      }
    });

  });



  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
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
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox',
    zoomable: false,
    draggable: false,
    touchNavigation: false,
    loop: false
  });


  glightbox.on('slide_after_load', (data) => {

    const { slideIndex, slideNode } = data;
    const img = slideNode.querySelector('img');

    if (img) {
      img.style.cursor = 'pointer';
      img.onclick = () => {
        glightbox.close();
      };
    }
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
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
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
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

  /**
   * Navmenu Scrollspy
   */
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

  document.body.classList.remove('mobile-nav-active');


})();