import Popper from 'popper.js'

/**!
* @file tippy.js | Vanilla JS Tooltip Library
* @version 0.17.0
* @license MIT
*/

const IS_BROWSER = typeof window !== 'undefined'

const BROWSER = {}

if (IS_BROWSER) {
    BROWSER.supported = !!window.requestAnimationFrame
    BROWSER.supportsTouch = 'ontouchstart' in window
    BROWSER.iOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream
    BROWSER.touch = false // presumed false until `touchstart` is fired
}

let idCounter = 1

const STORE = []

const SELECTORS = {
    popper: '.tippy-popper',
    tooltip: '.tippy-tooltip',
    content: '.tippy-tooltip-content',
    circle: '[x-circle]',
    arrow: '[x-arrow]',
    el: '[data-tooltipped]',
    controller: '[data-tippy-controller]'
}

const DEFAULT_SETTINGS = {
    html: false,
    position: 'top',
    animation: 'shift',
    animateFill: true,
    arrow: false,
    arrowSize: 'regular',
    delay: 0,
    hideDelay: 0,
    trigger: 'mouseenter focus',
    duration: 375,
    hideDuration: 375,
    interactive: false,
    interactiveBorder: 2,
    theme: 'dark',
    size: 'regular',
    distance: 10,
    offset: 0,
    hideOnClick: true,
    multiple: false,
    followCursor: false,
    inertia: false,
    flipDuration: 300,
    sticky: false,
    stickyDuration: 200,
    appendTo: null,
    zIndex: 9999,
    touchHold: false,
    popperOptions: {}
}

const DEFAULT_SETTINGS_KEYS = BROWSER.supported && Object.keys(DEFAULT_SETTINGS)

/**
* To run a single time, once DOM is presumed to be ready
*/
function init() {

    if (init.done) return
    init.done = true

    // Handle clicks anywhere on the document
    document.addEventListener('click', event => {

        // Simulated events dispatched on the document
        if (!(event.target instanceof Element)) {
            return hideAllPoppers()
        }

        const el = closest(event.target, SELECTORS.el)
        const popper = closest(event.target, SELECTORS.popper)

        if (popper) {
            const ref = find(STORE, ref => ref.popper === popper)
            const { settings: { interactive } } = ref
            if (interactive) return
        }

        if (el) {
            const ref = find(STORE, ref => ref.el === el)
            const { popper, settings: { hideOnClick, multiple, trigger } } = ref

            // If they clicked before the show() was to fire, clear it
            if (hideOnClick === true && !BROWSER.touch) {
                clearTimeout(popper.getAttribute('data-delay'))
            }

            // Hide all poppers except the one belonging to the element that was clicked IF
            // `multiple` is false AND they are a touch user, OR
            // `multiple` is false AND it's triggered by a click
            if ((!multiple && BROWSER.touch) || (!multiple && trigger.indexOf('click') !== -1)) {
                return hideAllPoppers(ref)
            }

            // If hideOnClick is not strictly true or triggered by a click don't hide poppers
            if (hideOnClick !== true || trigger.indexOf('click') !== -1) return
        }

        // Don't trigger a hide for tippy controllers, and don't needlessly run loop
        if (closest(event.target, SELECTORS.controller) ||
            !document.querySelector(SELECTORS.popper)
        ) return

        hideAllPoppers()
    })

    // Determine if touch user
    if (BROWSER.supportsTouch) {
        document.addEventListener('touchstart', function touchHandler() {
            BROWSER.touch = true
            if (BROWSER.iOS) {
                document.body.classList.add('tippy-touch')
            }
            document.removeEventListener('touchstart', touchHandler)
        })
    } else {
        // For Microsoft Surface
        if (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
            BROWSER.touch = true
        }
    }

    // If the script is in <head>, document.body is null, so it's set in the
    // init function
    DEFAULT_SETTINGS.appendTo = document.body
}


/**
* Pushes execution of a function to end of execution queue, doing so
* just before the next repaint
* @return {Function}
*     @param {Function} fn
*/
const queueExecution = (() => {
    let currentTimeoutQueue

    return fn => {
        clearTimeout(currentTimeoutQueue)

        window.requestAnimationFrame(() => {
            currentTimeoutQueue = setTimeout(fn, 0)
        })
    }
})()

/**
* Returns the supported prefixed property - only `webkit` is needed, `moz`, `ms` and `o` are obsolete
* @param {String} property
* @return {String} - browser supported prefixed property
*/
function prefix(property) {
    const prefixes = [false, 'webkit']
    const upperProp = property.charAt(0).toUpperCase() + property.slice(1)

    for (var i = 0; i < prefixes.length; i++) {
        const prefix = prefixes[i]
        const prefixedProp = prefix ? '' + prefix + upperProp : property
        if (typeof window.document.body.style[prefixedProp] !== 'undefined') {
            return prefixedProp
        }
    }

    return null
}

/**
* Returns the non-shifted placement (e.g., 'bottom-start' => 'bottom')
* @param {String} placement
* @return {String}
*/
function getCorePlacement(placement) {
    return placement.replace(/-.+/, '')
}

/**
* Polyfill to get the closest parent element
* @param {Element} element - child of parent to be returned
* @param {String} parentSelector - selector to match the parent if found
* @return {Element}
*/
function closest(element, parentSelector) {
    if (!Element.prototype.matches) {
        Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
        }
    }
    if (!Element.prototype.closest) Element.prototype.closest = function(selector) {
        var el = this
        while (el) {
            if (el.matches(selector)) {
                return el
            }
            el = el.parentElement
        }
    }
    return element.closest(parentSelector)
}

/**
* Polyfill for Array.prototype.find
* @param {Array} arr
* @param {Function} checkFn
* @return item in the array
*/
function find(arr, checkFn) {
  if (Array.prototype.find) {
    return arr.find(checkFn)
  }

  // use `filter` as fallback
  return arr.filter(checkFn)[0]
}

/**
* Simulates a click event
* @param {Element} el
*/
function simulateClick(el) {
    const settings = {
        'view': window,
        'bubbles': true,
        'cancelable': true
    }

    const event = window.MouseEvent ? new MouseEvent('click', settings)
                                    : new Event('click', settings)

    el.dispatchEvent(event)
}

/**
* Creates a new popper instance
* @param {Object} ref
* @return {Object} - the popper instance
*/
function createPopperInstance(ref) {

    const {
        el,
        popper,
        settings: {
            position,
            popperOptions,
            offset,
            distance
        }
    } = ref

    const tooltip = popper.querySelector(SELECTORS.tooltip)

    const config = {
        placement: position,
        ...(popperOptions || {}),
        modifiers: {
            ...(popperOptions ? popperOptions.modifiers : {}),
            flip: {
                padding: distance + 5 /* 5px from viewport boundary */,
                ...(popperOptions && popperOptions.modifiers ? popperOptions.modifiers.flip : {})
            },
            offset: {
                offset,
                ...(popperOptions && popperOptions.modifiers ? popperOptions.modifiers.offset : {})
            }
        },
        onUpdate() {
            tooltip.style.top = ''
            tooltip.style.bottom = ''
            tooltip.style.left = ''
            tooltip.style.right = ''
            tooltip.style[getCorePlacement(popper.getAttribute('x-placement'))] = -(distance - DEFAULT_SETTINGS.distance) + 'px'
        }
    }

    return new Popper(el, popper, config)
}

/**
* Creates a popper element then returns it
* @param {Number} id - the popper id
* @param {String} title - the tooltip's `title` attribute
* @param {Object} settings - individual settings
* @return {Element} - the popper element
*/
function createPopperElement(id, title, settings) {

    const {
        position,
        distance,
        arrow,
        animateFill,
        inertia,
        animation,
        arrowSize,
        size,
        theme,
        html,
        zIndex
    } = settings

    const popper = document.createElement('div')
    popper.setAttribute('class', 'tippy-popper')
    popper.setAttribute('role', 'tooltip')
    popper.setAttribute('aria-hidden', 'true')
    popper.setAttribute('id', `tippy-tooltip-${id}`)
    popper.style.zIndex = zIndex

    const tooltip = document.createElement('div')
    tooltip.setAttribute('class', `tippy-tooltip tippy-tooltip--${size} ${theme}-theme leave`)
    tooltip.setAttribute('data-animation', animation)

    if (arrow) {
        // Add an arrow
        const arrow = document.createElement('div')
        arrow.setAttribute('class', `arrow-${arrowSize}`)
        arrow.setAttribute('x-arrow', '')
        tooltip.appendChild(arrow)
    }

    if (animateFill) {
        // Create animateFill circle element for animation
        tooltip.setAttribute('data-animatefill', '')
        const circle = document.createElement('div')
        circle.setAttribute('class', 'leave')
        circle.setAttribute('x-circle', '')
        tooltip.appendChild(circle)
    }

    if (inertia) {
        // Change transition timing function cubic bezier
        tooltip.setAttribute('data-inertia', '')
    }

    // Tooltip content (text or HTML)
    const content = document.createElement('div')
    content.setAttribute('class', 'tippy-tooltip-content')

    if (html) {

        let templateId

        if (html instanceof Element) {
            content.appendChild(html)
            templateId = html.id || 'tippy-html-template'
        } else {
            content.innerHTML = document.getElementById(html.replace('#', '')).innerHTML
            templateId = html
        }

        popper.classList.add('html-template')
        popper.setAttribute('tabindex', '0')
        tooltip.setAttribute('data-template-id', templateId)

    } else {
        content.innerHTML = title
    }

    // Init distance. Further updates are made in the popper instance's `onUpdate()` method
    tooltip.style[getCorePlacement(position)] = -(distance - DEFAULT_SETTINGS.distance) + 'px'

    tooltip.appendChild(content)
    popper.appendChild(tooltip)

    return popper
}

/**
* Creates a trigger
* @param {Object} event - the custom event specified in the `trigger` setting
* @param {Element} el - tooltipped element
* @param {Object} handlers - the handlers for each listener
* @return {Array} - array of listener objects
*/
function createTrigger(event, el, handlers, touchHold) {
    const listeners = []

    if (event === 'manual') return listeners

    // Enter
    el.addEventListener(event, handlers.handleTrigger)
    listeners.push({
        event,
        handler: handlers.handleTrigger
    })

    // Leave
    if (event === 'mouseenter') {

        if (BROWSER.supportsTouch && touchHold) {
            el.addEventListener('touchstart', handlers.handleTrigger)
            listeners.push({
                event: 'touchstart',
                handler: handlers.handleTrigger
            })
            el.addEventListener('touchend', handlers.handleMouseleave)
            listeners.push({
                event: 'touchend',
                handler: handlers.handleMouseleave
            })
        }

        el.addEventListener('mouseleave', handlers.handleMouseleave)
        listeners.push({
            event: 'mouseleave',
            handler: handlers.handleMouseleave
        })
    }

    if (event === 'focus') {
        el.addEventListener('blur', handlers.handleBlur)
        listeners.push({
            event: 'blur',
            handler: handlers.handleBlur
        })
    }

    return listeners
}

/**
* Removes the title from the tooltipped element
* @param {Element} el
*/
function removeTitle(el) {
    const title = el.getAttribute('title')
    el.setAttribute('data-original-title', title || 'html')
    el.removeAttribute('title')
}

/**
* Determines if an element is visible in the viewport
* @param {Element} el
* @return {Boolean}
*/
function elementIsInViewport(el) {
    const rect = el.getBoundingClientRect()

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
}

/**
* Mousemove event listener callback method for follow cursor setting
* @param {MouseEvent} e
*/
function followCursorHandler(e) {
    const ref = find(STORE, ref => ref.el === this)
    const { popper } = ref

    const position = getCorePlacement(popper.getAttribute('x-placement'))
    const halfPopperWidth = Math.round( popper.offsetWidth / 2 )
    const halfPopperHeight = Math.round( popper.offsetHeight / 2 )
    const viewportPadding = 5
    const pageWidth = document.documentElement.offsetWidth || document.body.offsetWidth

    const { pageX, pageY } = e

    let x, y

    switch (position) {
        case 'top':
            x = pageX - halfPopperWidth
            y = pageY - 2.5 * halfPopperHeight
            break
        case 'left':
            x = pageX - ( 2 * halfPopperWidth ) - 15
            y = pageY - halfPopperHeight
            break
        case 'right':
            x = pageX + halfPopperHeight
            y = pageY - halfPopperHeight
            break
        case 'bottom':
            x = pageX - halfPopperWidth
            y = pageY + halfPopperHeight/1.5
            break
    }

    const isRightOverflowing = pageX + viewportPadding + halfPopperWidth > pageWidth
    const isLeftOverflowing = pageX - viewportPadding - halfPopperWidth < 0

    // Prevent left/right overflow
    if (position === 'top' || position === 'bottom') {
        if (isRightOverflowing) {
            x = pageWidth - viewportPadding - ( 2 * halfPopperWidth)
        }

        if (isLeftOverflowing) {
            x = viewportPadding
        }
    }

    popper.style[prefix('transform')] = `translate3d(${x}px, ${y}px, 0)`
}

/**
* Triggers a document repaint or reflow for CSS transition
* @param {Element} tooltip
* @param {Element} circle
*/
function triggerReflow(tooltip, circle) {
    // Safari needs the specific 'transform' property to be accessed
    circle ? window.getComputedStyle(circle)[prefix('transform')]
           : window.getComputedStyle(tooltip).opacity
}

/**
* Modifies elements' class lists
* @param {Array} els - HTML elements
* @param {Function} callback
*/
function modifyClassList(els, callback) {
    els.forEach(el => {
        if (!el) return
        callback(el.classList)
    })
}

/**
* Applies the transition duration to each element
* @param {Array} els - HTML elements
* @param {Number} duration
*/
function applyTransitionDuration(els, duration) {
    let mutableDuration = duration

    els.forEach(el => {
        if (!el) return

        mutableDuration = duration

        // Circle fill should be a bit quicker
        if (el.hasAttribute('x-circle')) {
            mutableDuration = Math.round(mutableDuration/1.2)
        }

        el.style[prefix('transitionDuration')] = mutableDuration + 'ms'
    })
}

/**
* Prepares the callback functions for `show` and `hide` methods
* @param {Object} ref -  the element/popper reference
* @param {Number} duration
* @param {Function} callback - callback function to fire once transitions complete
*/
function onTransitionEnd(ref, duration, callback) {

    const tooltip = ref.popper.querySelector(SELECTORS.tooltip)
    let transitionendFired = false

    const listenerCallback = e => {
        if (e.target !== tooltip) return

        transitionendFired = true

        tooltip.removeEventListener('webkitTransitionEnd', listenerCallback)
        tooltip.removeEventListener('transitionend', listenerCallback)

        callback()
    }

    // Wait for transitions to complete
    tooltip.addEventListener('webkitTransitionEnd', listenerCallback)
    tooltip.addEventListener('transitionend', listenerCallback)

    // transitionend listener sometimes may not fire
    clearTimeout(ref.transitionendTimeout)
    ref.transitionendTimeout = setTimeout(() => {
        !transitionendFired && callback()
    }, duration)
}

/**
* Determines if a popper is currently visible
* @param {Element} popper
* @return {Boolean}
*/
function isVisible(popper) {
    return popper.style.visibility === 'visible'
}

/**
* Appends the popper and creates a popper instance if one does not exist
* Also updates its position if need be and enables event listeners
* @param {Object} ref -  the element/popper reference
*/
function mountPopper(ref) {

    const {
        el,
        popper,
        listeners,
        settings: {
            appendTo,
            followCursor
        }
    } = ref

    appendTo.appendChild(ref.popper)

    if (!ref.popperInstance) {
        // Create instance if it hasn't been created yet
        ref.popperInstance = createPopperInstance(ref)

        // Follow cursor setting
        if (followCursor && !BROWSER.touch) {
            el.addEventListener('mousemove', followCursorHandler)
            ref.popperInstance.disableEventListeners()
        }

    } else {
        ref.popperInstance.update()
        !followCursor && ref.popperInstance.enableEventListeners()
    }
}

/**
* Updates a popper's position on each animation frame to make it stick to a moving element
* @param {Object} ref
*/
function makeSticky(ref) {

    const {
        popper,
        popperInstance,
        settings: {
            stickyDuration
        }
    } = ref

    const applyTransitionDuration = () =>
        popper.style[prefix('transitionDuration')] = `${stickyDuration}ms`

    const removeTransitionDuration = () =>
        popper.style[prefix('transitionDuration')] = ''

    const updatePosition = () => {
        popperInstance && popperInstance.scheduleUpdate()

        applyTransitionDuration()

        isVisible(popper) ? window.requestAnimationFrame(updatePosition)
                          : removeTransitionDuration()
    }

    // Wait until Popper's position has been updated initially
    queueExecution(updatePosition)
}

/**
* Hides all poppers
* @param {Object} currentRef
*/
function hideAllPoppers(currentRef) {

    STORE.forEach(ref => {

        const {
            popper,
            tippyInstance,
            settings: {
                appendTo,
                hideOnClick,
                hideDuration,
                trigger
            }
        } = ref

        // Don't hide already hidden ones
        if (!appendTo.contains(popper)) return

        // hideOnClick can have the truthy value of 'persistent', so strict check is needed
        const isHideOnClick = hideOnClick === true || trigger.indexOf('focus') !== -1
        const isNotCurrentRef = !currentRef || popper !== currentRef.popper

        if (isHideOnClick && isNotCurrentRef) {
            tippyInstance.hide(popper, hideDuration)
        }
    })
}

/**
* Returns an array of elements based on the selector input
* @param {String|Element} selector
* @return {Array} of HTML Elements
*/
function getSelectorElementsArray(selector) {
    if (selector instanceof Element) {
        return [selector]
    }

    return [].slice.call(document.querySelectorAll(selector))
}

/**
* Determines if the mouse's cursor is outside the interactive border
* @param {MouseEvent} event
* @param {Element} popper
* @param {Object} settings
* @return {Boolean}
*/
function cursorIsOutsideInteractiveBorder(event, popper, settings) {
    if (!popper.getAttribute('x-placement')) return false

    const { clientX: x, clientY: y } = event
    const { interactiveBorder, distance } = settings

    const rect = popper.getBoundingClientRect()
    const corePosition = getCorePlacement(popper.getAttribute('x-placement'))
    const borderWithDistance = interactiveBorder + distance

    const exceeds = {
        top: rect.top - y > interactiveBorder,
        bottom: y - rect.bottom > interactiveBorder,
        left: rect.left - x > interactiveBorder,
        right: x - rect.right > interactiveBorder
    }

    switch (corePosition) {
        case 'top':
            exceeds.top = rect.top - y > borderWithDistance
            break
        case 'bottom':
            exceeds.bottom = y - rect.bottom > borderWithDistance
            break
        case 'left':
            exceeds.left = rect.left - x > borderWithDistance
            break
        case 'right':
            exceeds.right = x - rect.right > borderWithDistance
            break
    }

    return exceeds.top || exceeds.bottom || exceeds.left || exceeds.right
}

/**
* Returns an object of settings to override global settings
* @param {Element} el - the tooltipped element
* @return {Object} - individual settings
*/
function applyIndividualSettings(el, instanceSettings) {

    const settings = DEFAULT_SETTINGS_KEYS.reduce((acc, key) => {
        let val = el.getAttribute(`data-${ key.toLowerCase() }`) || instanceSettings[key]

        // Convert strings to booleans
        if (val === 'false') val = false
        if (val === 'true') val = true

        // Convert number strings to true numbers
        if (!isNaN(parseFloat(val))) val = parseFloat(val)

        acc[key] = val

        return acc
    }, {})

    // animateFill is disabled if an arrow is true
    if (settings.arrow) settings.animateFill = false

    return Object.assign({}, instanceSettings, settings)
}

/**
* Returns relevant listener callbacks for each ref
* @param {Element} el
* @param {Element} popper
* @param {Object} settings
* @return {Object} - relevant listener callback methods
*/
function getEventListenerHandlers(el, popper, settings) {

    const {
        position,
        delay,
        hideDelay,
        hideDuration,
        duration,
        interactive,
        interactiveBorder,
        distance,
        hideOnClick,
        trigger,
        touchHold
    } = settings

    const clearTimeouts = () => {
        clearTimeout(popper.getAttribute('data-delay'))
        clearTimeout(popper.getAttribute('data-hidedelay'))
    }

    const _show = () => {
        clearTimeouts()

        // Not hidden. For clicking when it also has a `focus` event listener
        if (isVisible(popper)) return

        if (delay) {
            const timeout = setTimeout(() => this.show(popper, duration), delay)
            popper.setAttribute('data-delay', timeout)
        } else {
            this.show(popper, duration)
        }
    }

    const show = event =>
        this.callbacks.wait ? this.callbacks.wait.call(popper, _show, event) : _show()

    const hide = () => {
        clearTimeouts()

        if (hideDelay) {
            const timeout = setTimeout(() => this.hide(popper, hideDuration), hideDelay)
            popper.setAttribute('data-hidedelay', timeout)
        } else {
            this.hide(popper, hideDuration)
        }
    }

    const handleTrigger = event => {

        if (event.type === 'mouseenter' && BROWSER.supportsTouch && BROWSER.touch) {

            // Don't fire 'mouseenter', use the 'touchstart'
            if (touchHold) return

            if (BROWSER.iOS) {
                // Prevents the need to double click buttons/anchor links on iOS
                const fireClick = () => simulateClick(el)

                // For anchor links, use a 300ms delay
                el.nodeName === 'A' ? setTimeout(fireClick, 300)
                                    : fireClick()
            }
        }

        // Toggle show/hide when clicking click-triggered tooltips
        const isClick = event.type === 'click'
        const isNotPersistent = hideOnClick !== 'persistent'

        isClick && isVisible(popper) && isNotPersistent ? hide() : show(event)
    }

    const handleMouseleave = event => {

        // Don't fire 'mouseleave', use the 'touchend'
        if (event.type === 'mouseleave' && BROWSER.supportsTouch &&
        BROWSER.touch && touchHold) {
            return
        }

        if (interactive) {
            // Temporarily handle mousemove to check if the mouse left somewhere
            // other than its popper
            const handleMousemove = event => {
                const triggerHide = () => {
                    document.removeEventListener('mousemove', handleMousemove)
                    hide()
                }

                const closestTooltippedEl = closest(event.target, SELECTORS.el)

                const isOverPopper = closest(event.target, SELECTORS.popper) === popper
                const isOverEl = closestTooltippedEl === el
                const isClickTriggered = trigger.indexOf('click') !== -1
                const isOverOtherTooltippedEl = closestTooltippedEl && closestTooltippedEl !== el

                if (isOverOtherTooltippedEl) {
                    return triggerHide()
                }

                if (isOverPopper || isOverEl || isClickTriggered) return

                if (cursorIsOutsideInteractiveBorder(event, popper, settings)) {
                    triggerHide()
                }
            }
            return document.addEventListener('mousemove', handleMousemove)
        }

        // If it's not interactive, just hide it
        hide()
    }

    const handleBlur = event => {
        // Only hide if not a touch user and has a focus 'relatedtarget', of which is not
        // a popper element
        if (BROWSER.touch || !event.relatedTarget) return
        if (closest(event.relatedTarget, SELECTORS.popper)) return

        hide()
    }

    return {
        handleTrigger,
        handleMouseleave,
        handleBlur
    }
}

/**
* Creates tooltips for all elements that match the instance's selector
* @param {Array} els - Elements
*/
function createTooltips(els) {

    els.forEach(el => {
        const settings = applyIndividualSettings(el, this.settings)

        const { html, trigger, touchHold } = settings

        const title = el.getAttribute('title')
        if (!title && !html) return

        const id = idCounter
        el.setAttribute('data-tooltipped', '')
        el.setAttribute('aria-describedby', `tippy-tooltip-${id}`)

        removeTitle(el)

        const popper = createPopperElement(id, title, settings)
        const handlers = getEventListenerHandlers.call(this, el, popper, settings)
        let listeners = []

        trigger.trim().split(' ').forEach(event =>
            listeners = listeners.concat(createTrigger(event, el, handlers, touchHold))
        )

        STORE.push({
            id,
            el,
            popper,
            settings,
            listeners,
            tippyInstance: this
        })

        idCounter++
    })
}

/**
* Private methods are prefixed with an underscore _
* @param {String|Element} selector
* @param {Object} settings (optional) - the object of settings to be applied to the instance
*/
class Tippy {
    constructor(selector, settings = {}) {

        // Use default browser tooltip on unsupported browsers
        if (!BROWSER.supported) return

        // DOM is presumably mostly ready (for document.body) by instantiation time
        init()

        this.selector = selector
        this.settings = Object.assign({}, DEFAULT_SETTINGS, settings)
        this.callbacks = {
            wait: settings.wait,
            beforeShown: settings.beforeShown || new Function,
            shown: settings.shown || new Function,
            beforeHidden: settings.beforeHidden || new Function,
            hidden: settings.hidden || new Function
        }

        createTooltips.call(this, getSelectorElementsArray(selector))
    }

    /**
    * Returns a tooltipped element's popper reference
    * @param {Element} el
    * @return {Element}
    */
    getPopperElement(el) {
        try {
            return find(STORE, ref => ref.el === el).popper
        } catch (e) {
            console.error('[Tippy error]: Element does not exist in any Tippy instances')
        }
    }

    /**
    * Returns a popper's tooltipped element reference
    * @param {Element} popper
    * @return {Element}
    */
    getTooltippedElement(popper) {
        try {
            return find(STORE, ref => ref.popper === popper).el
        } catch (e) {
            console.error('[Tippy error]: Popper does not exist in any Tippy instances')
        }
    }

    /**
    * Returns the reference object from either the tooltipped element or popper element
    * @param {Element} x (tooltipped element or popper)
    * @return {Object}
    */
    getReference(x) {
        return find(STORE, ref => ref.el === x) ||
               find(STORE, ref => ref.popper === x)
    }

    /**
    * Shows a popper
    * @param {Element} popper
    * @param {Number} duration (optional)
    */
    show(popper, duration = this.settings.duration) {

        this.callbacks.beforeShown.call(popper)

        const ref = find(STORE, ref => ref.popper === popper)
        const tooltip = popper.querySelector(SELECTORS.tooltip)
        const circle = popper.querySelector(SELECTORS.circle)

        const {
            el,
            settings: {
                appendTo,
                sticky,
                interactive,
                followCursor,
                flipDuration
            }
        } = ref

        // Remove transition duration (prevent a transition when popper changes posiiton)
        applyTransitionDuration([popper, tooltip, circle], 0)

        // Mount popper to DOM if its container does not have it
        !appendTo.contains(popper) && mountPopper(ref)

        popper.style.visibility = 'visible'
        popper.setAttribute('aria-hidden', 'false')

        // Wait for popper to update position and alter x-placement
        queueExecution(() => {
            if (!isVisible(popper)) return

            // Sometimes the arrow will not be in the correct position,
            // force another update
            !followCursor && ref.popperInstance.update()

            // Re-apply transition durations
            applyTransitionDuration([tooltip, circle], duration)
            !followCursor && applyTransitionDuration([popper], flipDuration)

            // Interactive tooltips receive a class of 'active'
            interactive && el.classList.add('active')

            // Update popper's position on every animation frame
            sticky && makeSticky(ref)

            // Repaint/reflow is required for CSS transition when appending
            triggerReflow(tooltip, circle)

            modifyClassList([tooltip, circle], list => {
                list.contains('tippy-notransition') && list.remove('tippy-notransition')
                list.remove('leave')
                list.add('enter')
            })

            // Wait for transitions to complete
            onTransitionEnd(ref, duration, () => {
                if (!isVisible(popper) || ref.onShownFired) return

                // Focus interactive tooltips only
                interactive && popper.focus()

                // Remove transitions from tooltip
                tooltip.classList.add('tippy-notransition')

                // Prevents shown() from firing more than once from early transition cancellations
                ref.onShownFired = true

                this.callbacks.shown.call(popper)
            })
        })
    }

    /**
    * Hides a popper
    * @param {Element} popper
    * @param {Number} duration (optional)
    */
    hide(popper, duration = this.settings.duration) {

        this.callbacks.beforeHidden.call(popper)

        const ref = find(STORE, ref => ref.popper === popper)
        const tooltip = popper.querySelector(SELECTORS.tooltip)
        const circle = popper.querySelector(SELECTORS.circle)
        const content = popper.querySelector(SELECTORS.content)

        const {
            el,
            settings: {
                appendTo,
                sticky,
                interactive,
                followCursor,
                html,
                trigger
            }
        } = ref

        ref.onShownFired = false
        interactive && el.classList.remove('active')

        popper.style.visibility = 'hidden'
        popper.setAttribute('aria-hidden', 'true')

        // Use same duration as show if it's the default
        if (duration === DEFAULT_SETTINGS.hideDuration) {
            duration = parseInt(tooltip.style[prefix('transitionDuration')])
        } else {
            applyTransitionDuration([tooltip, circle], duration)
        }

        modifyClassList([tooltip, circle], list => {
            list.contains('tippy-tooltip') && list.remove('tippy-notransition')
            list.remove('enter')
            list.add('leave')
        })

        // Re-focus click-triggered html elements
        // and the tooltipped element IS in the viewport (otherwise it causes unsightly scrolling
        // if the tooltip is closed and the element isn't in the viewport anymore)
        if (html && trigger.indexOf('click') !== -1 && elementIsInViewport(el)) {
            el.focus()
        }

        // Wait for transitions to complete
        onTransitionEnd(ref, duration, () => {
            if (isVisible(popper) || !appendTo.contains(popper)) return

            ref.popperInstance.disableEventListeners()

            appendTo.removeChild(popper)

            this.callbacks.hidden.call(popper)
        })
    }

    /**
    * Destroys a popper
    * @param {Element} popper
    */
    destroy(popper) {
        const ref = find(STORE, ref => ref.popper === popper)
        const { el, popperInstance, listeners } = ref

        // Ensure the popper is hidden
        if (isVisible(popper)) {
            this.hide(popper, 0)
        }

        // Remove Tippy-only event listeners from tooltipped element
        listeners.forEach(listener => el.removeEventListener(listener.event, listener.handler))

        // Restore original title
        el.setAttribute('title', el.getAttribute('data-original-title'))

        el.removeAttribute('data-original-title')
        el.removeAttribute('data-tooltipped')
        el.removeAttribute('aria-describedby')

        popperInstance && popperInstance.destroy()

        // Remove from storage
        STORE.splice(STORE.map(ref => ref.popper).indexOf(popper), 1)
    }

    /**
    * Updates a popper with new content
    * @param {Element} popper
    */
    update(popper) {
        const ref = find(STORE, ref => ref.popper === popper)
        const content = popper.querySelector(SELECTORS.content)
        const { el, settings: { html } } = ref

        if (html) {
            content.innerHTML = (html instanceof Element)
                                ? html.innerHTML
                                : document.getElementById(html.replace('#', '')).innerHTML
        } else {
            content.innerHTML = el.getAttribute('title') || el.getAttribute('data-original-title')
            removeTitle(el)
        }
    }
}

function tippy(selector, settings) {
    return new Tippy(selector, settings)
}

tippy.defaultSettings = DEFAULT_SETTINGS

export default tippy
