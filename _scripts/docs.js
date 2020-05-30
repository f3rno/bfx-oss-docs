/* global localStorage, debug, PerfectScrollbar, Zepto */

(() => {
  // init debug
  localStorage.debug = 'bfx:*'
  const l = debug('bfx:oss-docs')

  l('boot')

  window.debugBase = l

  // init perfect scrollbar
  new PerfectScrollbar('#bfx-oss-docs-side-bar') // eslint-disable-line

  if (document.querySelector('#bfx-oss-docs-api-docs-index')) {
    new PerfectScrollbar('#bfx-oss-docs-api-docs-index') // eslint-disable-line
  }

  Zepto(($) => {
    // Give empty paragraphs a class so their margins can be set to 0
    const p = document.querySelectorAll('.bfx-oss-docs-content-type-api-docs p')

    if (p && p.length > 0) {
      p.forEach((p) => {
        if (p.textContent === '') {
          p.classList.add('bfx-oss-docs-empty')
        }
      })
    }

    // Give module inner top-level members a border
    const em = document.querySelectorAll('.bfx-oss-docs-content-type-api-docs em')

    if (em && em.length > 0) {
      em.forEach((em) => {
        if (em.textContent !== 'inner') {
          return
        }

        const li = em.parentElement
        const ul = li.querySelector('ul')

        for (let i = 1; i < ul.children.length; i += 1) {
          ul.children[i].classList.add('bfx-oss-docs-api-docs-index-section')
        }
      })
    }

    // Highlight api doc index links when content scrolls into view
    if (document.querySelector('#bfx-oss-docs-api-docs-index')) {
      $(window).scroll(() => {
        const scrollTop = $(window).scrollTop()
        let nearestAnchor = null
        let nearestAnchorDelta

        $('.bfx-oss-docs-md-content a[id]').each(function () {
          const offsetTop = $(this).offset().top
          const d = offsetTop - scrollTop

          if (nearestAnchor === null || (Math.abs(d) < nearestAnchorDelta)) {
            nearestAnchor = this
            nearestAnchorDelta = Math.abs(d)
          }
        })

        if (nearestAnchor !== null) {
          const id = $(nearestAnchor).attr('id')
          const href = `#${id}`

          $('.content-in-view-outer').removeClass('content-in-view-outer')
          $('.content-in-view-link').removeClass('content-in-view-link')

          const a = $('#bfx-oss-docs-api-docs-index li > a[href="' + href + '"]:first-child')

          if (!a) {
            return
          }

          const t = a.parent()

          if ($(t).children('ul').length > 0) {
            $(t).addClass('content-in-view-outer')
          } else {
            $(t).addClass('content-in-view-link')
          }
        }
      })
    }
  })
})()
