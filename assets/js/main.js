(function () {
  "use strict";

  /* ==========================================================
     1. 헤더 스크롤 제어 (Header Scroll State)
  ========================================================== */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader || !selectHeader.classList.contains('sticky-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }
  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /* ==========================================================
     2. 모바일 네비게이션 사이드바 제어 (수정 완료본)
  ========================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    const selectBody = document.querySelector('body');
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

    // 사이드바 열기/닫기 토글 함수
    function mobileNavToggle() {
      selectBody.classList.toggle('mobile-nav-active');
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    }

    // 1) 햄버거 ↔ 엑스(X) 버튼 클릭 시 사이드바 열고 닫기
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // 이벤트 겹침(버블링) 방지
        mobileNavToggle();
      });
    }

    // 2) 사이드바 바깥 영역(어두운 블러 배경) 클릭 시 닫히게 설정
    document.addEventListener('click', (e) => {
      if (selectBody.classList.contains('mobile-nav-active')) {
        // 클릭한 대상이 메뉴 패널 안쪽이나 토글 버튼이 아닐 경우 닫음
        if (!e.target.closest('.navmenu') && !e.target.closest('.mobile-nav-toggle')) {
          mobileNavToggle();
        }
      }
    });

    // 3) 메뉴 링크를 클릭해서 실제 페이지 이동 시 사이드바 자동으로 닫히게 설정
    document.querySelectorAll('#navmenu a').forEach(navLink => {
      navLink.addEventListener('click', function (e) {
        if (selectBody.classList.contains('mobile-nav-active')) {
          // 하위 메뉴를 여는 드롭다운(토글) 버튼이 아니라면 창을 닫음
          if (!this.closest('.dropdown') || this.getAttribute('href') !== '#') {
            setTimeout(() => {
              mobileNavToggle();
            }, 100); // 0.1초 딜레이로 부드럽게 닫힘
          }
        }
      });
    });

    // 4) 모바일 하위 메뉴(드롭다운) 아코디언 토글 기능
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(dropdownToggle => {
      dropdownToggle.addEventListener('click', function (e) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      });
    });
  });

  /* ==========================================================
     3. 페이지 기능 및 플러그인 초기화 (Scroll Top, AOS, Isotope 등)
  ========================================================== */

  /**
   * 위로 가기 버튼 (Scroll top button)
   */
  let scrollTop = document.querySelector('.scroll-top');
  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * 스크롤 애니메이션 초기화 (AOS init)
   */
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

  /**
     * 포트폴리오 그리드 레이아웃 및 필터 (Isotope layout)
     */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    // 💡 URL 파라미터 읽기 기능 추가 (이 부분이 핵심입니다)
    const urlParams = new URLSearchParams(window.location.search);
    const urlFilter = urlParams.get('filter'); // 예: 'motion', 'editorial', 'brand'

    if (urlFilter) {
      filter = '.filter-' + urlFilter; // 기본값을 URL에서 받아온 값으로 변경

      // 상단 메뉴 버튼(UI)의 활성화 상태(검은색 굵은 글씨)도 맞춰서 변경
      let filterMenu = isotopeItem.querySelector('.isotope-filters');
      if (filterMenu) {
        let currentActive = filterMenu.querySelector('.filter-active');
        if (currentActive) currentActive.classList.remove('filter-active');

        let targetTab = filterMenu.querySelector(`[data-filter="${filter}"]`);
        if (targetTab) targetTab.classList.add('filter-active');
      }
    }

    // Isotope 초기화
    let initIsotope;
    if (typeof imagesLoaded !== 'undefined') {
      imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
        if (typeof Isotope !== 'undefined') {
          initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
            itemSelector: '.isotope-item',
            layoutMode: layout,
            filter: filter, // 변경된 필터값이 적용되어 로딩됨
            sortBy: sort
          });
        }
      });
    }

    // 메뉴 클릭 시 필터 작동 로직
    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        if (initIsotope) {
          initIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
        }
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });
  });

  /**
   * GLightbox 초기화
   */
  if (typeof GLightbox !== 'undefined') {
    const glightbox = GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Swiper 슬라이더 초기화
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let configElement = swiperElement.querySelector(".swiper-config");
      if (configElement) {
        let config = JSON.parse(configElement.innerHTML.trim());
        if (typeof Swiper !== 'undefined') {
          new Swiper(swiperElement, config);
        }
      }
    });
  }
  window.addEventListener("load", initSwiper);

  /**
   * URL 해시 링크로 접근 시 스크롤 위치 보정
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
   * 스크롤 위치에 따른 네비게이션 활성화 (Scrollspy)
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

})();