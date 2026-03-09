(function () {
  "use strict";

  /* --- 1. 헤더 및 초기 설정 (기존 유지) --- */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader || !selectHeader.classList.contains('sticky-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }
  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  document.addEventListener('DOMContentLoaded', () => {
    const selectBody = document.querySelector('body');
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

    function mobileNavToggle() {
      selectBody.classList.toggle('mobile-nav-active');
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    }

    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        mobileNavToggle();
      });
    }

    /* --- 2. Isotope Layout & URL Filter Integration --- */
    document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
      let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

      // URL에서 filter 파라미터 확인 (예: ?filter=motion)
      const urlParams = new URLSearchParams(window.location.search);
      const filterKey = urlParams.get('filter');
      let initialFilter = filterKey ? `.filter-${filterKey}` : (isotopeItem.getAttribute('data-default-filter') ?? '*');

      imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
        let initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: initialFilter,
          sortBy: sort
        });

        // URL 파라미터가 있을 경우 필터 버튼 UI 업데이트
        if (filterKey) {
          const targetBtn = isotopeItem.querySelector(`.isotope-filters li[data-filter=".filter-${filterKey}"]`);
          if (targetBtn) {
            isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
            targetBtn.classList.add('filter-active');
          }
        }

        // 필터 버튼 클릭 이벤트
        isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
          filters.addEventListener('click', function () {
            isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
            this.classList.add('filter-active');
            initIsotope.arrange({ filter: this.getAttribute('data-filter') });
            if (typeof AOS !== 'undefined') AOS.refresh();
          });
        });
      });
    });
  });

  /* --- 3. 기타 플러그인 초기화 (AOS, GLightbox 등 - 기존 유지) --- */
  window.addEventListener('load', () => {
    const preloader = document.querySelector('#preloader');
    if (preloader) preloader.remove();
    if (typeof AOS !== 'undefined') {
      AOS.init({ duration: 600, easing: 'ease-in-out', once: true });
    }
  });

  // YouTube API 로직 (기존 유지)
  window.onYouTubeIframeAPIReady = function () {
    const player = new YT.Player('youtube-player', {
      events: {
        'onStateChange': (event) => {
          if (event.data === YT.PlayerState.ENDED) {
            player.seekTo(player.getDuration() - 0.1, true);
            player.pauseVideo();
          }
        }
      }
    });
  };

})();