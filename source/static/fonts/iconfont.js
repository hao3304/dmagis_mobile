;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-qingchu" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M356.736 735.104c14.336 0 25.856-10.88 25.856-24.256l0-266.88c0-13.376-11.584-24.256-25.856-24.256S330.88 430.656 330.88 444.032l0 266.88C330.88 724.224 342.464 735.104 356.736 735.104z"  ></path>' +
    '' +
    '<path d="M512 735.104c14.336 0 25.856-10.88 25.856-24.256l0-266.88c0-13.376-11.584-24.256-25.856-24.256s-25.856 10.88-25.856 24.256l0 266.88C486.144 724.224 497.664 735.104 512 735.104z"  ></path>' +
    '' +
    '<path d="M667.264 735.104c14.336 0 25.856-10.88 25.856-24.256l0-266.88c0-13.376-11.584-24.256-25.856-24.256s-25.856 10.88-25.856 24.256l0 266.88C641.344 724.224 652.928 735.104 667.264 735.104z"  ></path>' +
    '' +
    '<path d="M796.608 177.216l-107.136 0c-11.712-41.728-51.776-72.768-99.904-72.768L434.368 104.448c-48.128 0-88.256 31.04-99.904 72.768L227.392 177.216c-57.152 0-103.488 43.52-103.488 97.024l0 24.256L149.76 298.496l0 24.256 51.776 0 0 460.928c0 53.504 46.4 97.088 103.488 97.088l414.016 0c57.152 0 103.488-43.584 103.488-97.088L822.528 322.688l51.776 0L874.304 298.496l25.856 0L900.16 274.24C900.096 220.736 853.76 177.216 796.608 177.216zM434.368 152.96l155.264 0c19.072 0 35.584 9.792 44.544 24.256L389.824 177.216C398.784 162.752 415.296 152.96 434.368 152.96zM770.752 783.616c0 26.752-23.232 48.576-51.776 48.576L305.024 832.192c-28.48 0-55.36-21.824-55.36-48.576l3.648-460.928 517.504 0L770.816 783.616zM786.688 274.24l-129.344 0L366.656 274.24 237.248 274.24 175.616 274.24c0-26.752 23.232-48.512 51.776-48.512l569.28 0c28.48 0 51.776 21.76 51.776 48.512L786.688 274.24z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-yuanxing" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M512 844.8 512 844.8C695.800365 844.8 844.8 695.800364 844.8 512 844.8 328.199636 695.800365 179.2 512 179.2 328.199635 179.2 179.2 328.199636 179.2 512 179.2 695.800364 328.199635 844.8 512 844.8L512 844.8ZM512 1024 512 1024C229.230208 1024 0 794.769788 0 512 0 229.230212 229.230208 0 512 0 794.769788 0 1024 229.230212 1024 512 1024 794.769788 794.769788 1024 512 1024L512 1024Z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-mianji" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M947.93351 255.639285c16.063496 0 29.06104-12.998035 29.06104-29.059849L976.99455 73.015967c0-16.062837-12.997545-29.060873-29.06104-29.060873L794.334073 43.955094c-16.034842 0-29.060017 12.998035-29.060017 29.060873L765.274056 120.750131l-94.33837 0c-2.937009-0.451278-5.928256-0.451278-8.864241 0L258.72799 120.750131 258.72799 73.015967c0-16.062837-13.027222-29.060873-29.062063-29.060873L76.067513 43.955094c-16.063496 0-29.062063 12.998035-29.062063 29.060873l0 153.563468c0 16.062837 12.998568 29.059849 29.062063 29.059849l47.737143 0 0 506.581594L76.067513 762.220878c-16.063496 0-29.062063 12.997012-29.062063 29.059849l0 153.563468c0 16.062837 12.998568 29.059849 29.062063 29.059849l153.598414 0c16.034842 0 29.062063-12.997012 29.062063-29.059849l0-47.735188 506.545043 0 0 47.735188c0 16.062837 13.026198 29.059849 29.060017 29.059849l153.599437 0c16.063496 0 29.06104-12.997012 29.06104-29.059849L976.993527 791.281751c0-16.062837-12.997545-29.059849-29.06104-29.059849l-47.737143 0L900.195344 354.582761c0.050144-0.984421 0.050144-1.970888 0-2.955308l0-95.988168L947.93351 255.639285zM823.39716 102.07684l95.473264 0 0 95.441723-95.473264 0L823.39716 102.07684zM181.928783 459.920878c1.707968-1.102101 3.328951-2.394537 4.825086-3.89061l277.168724-277.158391 132.079449 0L181.928783 592.929194 181.928783 459.920878zM105.129576 102.07684l95.473264 0 0 46.62797c-0.014327 0.367367-0.02763 0.734734-0.02763 1.106194s0.014327 0.738827 0.02763 1.106194l0 46.601364-95.473264 0L105.129576 102.07684zM229.665927 255.639285c16.034842 0 29.062063-12.998035 29.062063-29.059849l0-47.707558 123.003375 0L181.928783 378.666272 181.928783 255.639285 229.665927 255.639285zM181.928783 675.116031l496.265511-496.244154 87.079762 0 0 35.606962L217.509574 762.220878l-35.580791 0L181.928783 675.116031zM105.129576 915.784346l0-95.441723 95.473264 0 0 46.600341c-0.014327 0.367367-0.02763 0.735757-0.02763 1.106194s0.014327 0.738827 0.02763 1.106194l0 46.62797L105.129576 915.783323zM842.071217 553.748846 563.784997 832.022641c-2.10912 2.109034-3.823229 4.460592-5.148464 6.965645L426.365717 838.988286l415.7055-415.688467L842.071217 553.748846zM918.870424 915.784346l-95.473264 0 0-95.441723 95.473264 0L918.870424 915.784346zM794.334073 762.220878c-16.034842 0-29.060017 12.997012-29.060017 29.059849l0 47.706535L639.011318 838.987263l203.060922-203.051579 0 126.284171L794.334073 762.219855zM842.071217 341.111958 344.174489 838.988286l-85.446499 0 0-35.795251 547.576186-547.552727 35.76704 0L842.071217 341.111958z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-juli" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M254.916608 512.518144l102.219776 102.219776 51.10784-51.109888-102.219776-102.219776L254.916608 512.518144 254.916608 512.518144zM357.136384 410.298368l127.77472 127.77472 51.113984-51.109888-127.778816-127.778816L357.136384 410.298368 357.136384 410.298368zM996.01408 333.633536 689.352704 26.968064c-14.11072-14.11072-36.99712-14.11072-51.10784 0L24.920064 640.290816c-14.11072 14.114816-14.11072 36.99712 0 51.10784l306.661376 306.661376c14.116864 14.112768 36.99712 14.112768 51.10784 0l613.3248-613.318656C1010.128896 370.630656 1010.128896 347.746304 996.01408 333.633536L996.01408 333.633536zM893.796352 384.743424 382.691328 895.844352c-14.112768 14.11072-36.990976 14.11072-51.10784 0L127.13984 691.402752c-14.11072-14.112768-14.11072-36.993024 0-51.109888l25.554944-25.554944L638.244864 129.18784c14.112768-14.112768 36.999168-14.112768 51.109888 0l204.443648 204.445696C907.907072 347.746304 907.907072 370.628608 893.796352 384.743424L893.796352 384.743424zM561.580032 205.856768l127.772672 127.778816 51.10784-51.10784L612.687872 154.74688 561.580032 205.856768 561.580032 205.856768zM459.354112 308.074496l102.223872 102.221824 51.10784-51.113984-102.221824-102.217728L459.354112 308.074496 459.354112 308.074496zM331.58144 691.402752l-127.77472-127.77472-51.111936 51.109888 127.776768 127.772672L331.58144 691.402752 331.58144 691.402752z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-juxing" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M990.72 234.496h-129.536V107.52v-2.56c0-15.36-12.8-28.16-28.16-28.16s-28.16 12.8-28.16 28.16v129.536h-129.536c-15.36 0-28.16 12.8-28.16 28.16s12.8 28.16 28.16 28.16h129.536v129.536c0 15.36 12.8 28.16 28.16 28.16s28.16-12.8 28.16-28.16V290.816h129.536c15.36 0 28.16-12.8 28.16-28.16 0-15.872-12.8-28.16-28.16-28.16zM46.08 342.016c14.336 0 25.6-11.264 25.6-25.6h1.024v-28.16h47.104c13.824 0 25.6-11.264 25.6-25.6s-11.776-25.6-25.6-25.6L46.08 236.544c-14.336 0-25.6 11.264-25.6 25.6V317.44c0 12.8 11.264 24.576 25.6 24.576zM221.184 287.744h128c14.336 0 25.6-11.264 25.6-25.6s-11.264-25.6-25.6-25.6h-128c-14.336 0-25.6 11.776-25.6 25.6 0 14.336 11.776 25.6 25.6 25.6zM450.56 287.744h128c14.336 0 25.6-11.264 25.6-25.6s-11.264-25.6-25.6-25.6H450.56c-14.336 0-25.6 11.776-25.6 25.6 1.024 14.336 11.264 25.6 25.6 25.6zM859.136 568.32c0-14.336-11.264-25.6-25.6-25.6s-25.6 11.264-25.6 25.6v128c0 14.336 11.264 25.6 25.6 25.6s25.6-11.264 25.6-25.6v-128zM833.536 772.096c-14.336 0-25.6 11.776-25.6 25.6V880.64h-102.4v1.536c-14.336 0-25.6 11.264-25.6 25.6s11.264 25.6 25.6 25.6h128c14.336 0 25.6-11.264 25.6-25.6V798.72c0-15.36-11.776-26.624-25.6-26.624zM608.256 880.64L71.68 879.616V390.144h-1.024c0-14.336-11.264-25.6-25.6-25.6s-25.6 11.264-25.6 25.6V906.24c0 14.336 11.264 25.6 25.6 25.6h561.664c14.336 0 25.6-11.776 25.6-25.6 0-14.336-11.776-25.6-24.064-25.6z" fill="" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-zhexian" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M106.080525 784.507464c-10.854209 0-21.681812-4.321422-29.676903-12.881378-15.31787-16.391319-14.44806-42.089607 1.942236-57.403385l312.283375-291.838741c15.045671-14.057157 38.22765-14.636349 53.949726-1.340531l164.839279 139.355884 278.400685-307.547515c15.049764-16.630772 40.730657-17.908882 57.361429-2.859117 16.629749 15.054881 17.908882 40.738843 2.855024 57.365522L643.289674 644.018779c-14.696724 16.23066-39.609113 17.890462-56.335053 3.758604L419.708526 506.380002 133.800867 773.568321c-7.826246 7.317663-17.788132 10.939143-27.720342 10.939143z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-duobianxing" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M161.152 398.016l134.016 412.416h433.664l134.016-412.416L512 143.104 161.152 398.08zM512 64l426.048 309.568-162.752 500.864H248.704L85.952 373.568 512 64z" fill="#666666" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)