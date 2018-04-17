# IIFE FOR PRIVACY
do ->
# CONSTRUCTOR
  this.vanillaSlider = (options) ->
    this.options             = options
    this.slider              = document.querySelector('.' + this.options.sliderClass)
    this.slide               = document.querySelectorAll('.' + this.options.slideClass)
    this.sliderWrapper       = document.querySelector('.' + this.options.sliderClass + ' .wrapper')
    this.syncedSlider        = document.querySelectorAll('.' + this.options.syncedSliderClass)
    this.syncedSlide         = document.querySelectorAll('.' + this.options.syncedSlideClass)
    this.syncedSliderWrapper = document.querySelector('.' + this.options.syncedSliderClass + ' .wrapper')
    this.sliderNavItem       = document.querySelectorAll('.' + this.options.sliderNavItemClass)
    this.moveLeftButton      = document.querySelectorAll('.' + this.options.leftButtonClass)
    this.moveRightButton     = document.querySelectorAll('.' + this.options.rightButtonClass)
    this.firstSlide          = document.querySelectorAll('.' + this.options.slideClass)[0]
    this.slidesToShow        = this.options.slidesToShow
    this.slidesToScroll      = this.options.slidesToScroll
    this.slideWidth          = this.firstSlide.clientWidth
    this.slideHeight         = this.firstSlide.clientHeight
    this.sliderWidth         = this.slider.clientWidth
    this.screenWidth         = window.innerWidth
    this.numOfSlides         = document.querySelectorAll('.' + this.options.slideClass).length
    this.sliderNavItemArray  = [...(this.sliderNavItem)]
    this.autoplayInterval    = ''
    this.margin              = ->
      calcMargin = window.getComputedStyle(this.firstSlide).getPropertyValue('margin-right')
      calcMargin = parseInt(calcMargin.replace('px', ''))
      calcMargin = calcMargin * 2
      return calcMargin
    this.scrollDistance      = ->
      (this.margin() + this.slideWidth) * this.slidesToScroll
    this.zeroCounter         = 0
    this.slideCounter        = this.slidesToShow
    this.distanceScrolled    = (this.margin() + this.slideWidth) * this.slidesToScroll
    if this.slidesToShow > 1
      this.slider.style.width = (this.margin() + this.slideWidth) * this.slidesToShow + 'px'

    # SET DEFAULT OPTIONS
    if !this.options.hasOwnProperty 'slidesToShow'
      this.options.slidesToShow = 1
    if !this.options.hasOwnProperty 'slidesToScroll'
      this.options.slidesToScroll = 1

    if this.slidesToShow == 1
      this.slideCounter = 0

    # INITIALIZE NECESSARY MODULES
    this.onResize()
    if this.options.hasOwnProperty('leftButtonClass') and this.options.hasOwnProperty('rightButtonClass')
      this.leftClick()
      this.rightClick()
    if this.options.hasOwnProperty('sliderNavItemClass')
      this.onNavItemClick()
    if this.options.hasOwnProperty('responsive')
      this.responsive()
    if this.options.autoplay != false
      this.autoplay(true)

  # METHODS
  vanillaSlider.prototype.autoplay = (status) ->
    if status == true
      this.autoplayInterval = setInterval((=>
        this.moveRight()
      ), 3000)

    else
      clearInterval this.autoplayInterval

  vanillaSlider.prototype.prefixedStyle = (element, property, value) ->
    element.style['webkit' + property] += value
    element.style['moz' + property] += value
    element.style['ms' + property] += value
    element.style['o' + property] += value
    return

  vanillaSlider.prototype.scroll = (direction, distance) ->
    if this.zeroCounter < 2
      this.distanceScrolled = (this.slideWidth + this.margin()) * this.slidesToShow
    if direction == 'left'
      this.prefixedStyle this.sliderWrapper, 'Transform', "translateX(#{distance}px)"
      if this.options.hasOwnProperty('syncedSlideClass')
        this.prefixedStyle syncedSliderWrapper, 'Transform', "translateX(#{distance}px)"
      this.distanceScrolled -= distance
    else
      this.prefixedStyle this.sliderWrapper, 'Transform', "translateX(#{-distance}px)"
      if this.options.hasOwnProperty('syncedSlideClass')
        this.prefixedStyle syncedSliderWrapper, 'Transform', "translateX(#{-distance}px)"
      this.distanceScrolled += distance

  vanillaSlider.prototype.startOver = ->
    this.sliderWrapper.style.transform            = 'translateX(0)'
    this.sliderWrapper.style['-webkit-transform'] = 'translateX(0)'
    this.sliderWrapper.style['-ms-transform']     = 'translateX(0)'
    if this.options.hasOwnProperty('sliderNavItemClass')
      for navItem in this.sliderNavItemArray
        navItem.classList.remove 'active'
      document.querySelectorAll('.' + this.options.sliderNavItemClass)[0].classList.add 'active'
    this.slideCounter     = 0
    this.zeroCounter      = 0
    this.distanceScrolled = 0
    return

  vanillaSlider.prototype.onResize = ->
    delay = ->
    whenDone = =>
      if this.options.hasOwnProperty 'responsive'
        this.responsive()

    window.addEventListener 'resize', ->
      clearTimeout delay
      delay = setTimeout(whenDone, 100)

  vanillaSlider.prototype.responsive = ->
    for iteration in this.options.responsive
      if window.matchMedia("(max-width: #{iteration.breakpoint}px)").matches
        if this.options.hasOwnProperty('slidesToScroll')
          this.slidesToScroll = iteration.slidesToScroll
          this.slidesToShow   = iteration.slidesToShow
        this.slider.style.width = (this.slideWidth + this.margin()) * iteration.slidesToShow + 'px'
      else if window.innerWidth > this.options.responsive[0].breakpoint
        this.slidesToScroll     = this.options.slidesToScroll
        this.slidesToShow       = this.options.slidesToShow
        this.slider.style.width = (this.slideWidth + this.margin()) * this.slidesToShow + 'px'

  vanillaSlider.prototype.advanceSlide = ->
    if this.options.hasOwnProperty('sliderNavItemClass')
      document.querySelectorAll('.' + this.options.sliderNavItemClass)[this.slideCounter].classList.add 'active'
      if this.slideCounter > 0
        document.querySelectorAll('.' + this.options.sliderNavItemClass)[this.slideCounter - 1].classList.remove 'active'
    this.scroll 'right', this.scrollDistance()

  vanillaSlider.prototype.moveRight = ->
    if this.options.hasOwnProperty('onSlideChange')
      this.options.onSlideChange()
    this.slideCounter++
    this.zeroCounter++
    if this.distanceScrolled >= this.numOfSlides * this.slideWidth
      this.startOver()
    else
      this.advanceSlide()

  vanillaSlider.prototype.rightClick = ->
    for button in this.moveRightButton
      button.onclick = =>
        button.disabled = true
        setTimeout (->
          button.disabled = false
        ), 700
        this.moveRight()

  vanillaSlider.prototype.leftClick = ->
    for button in this.moveLeftButton
      button.onclick = =>
        if this.zeroCounter > 0
          this.moveLeftButton.disabled = true
          setTimeout (=>
            this.moveLeftButton.disabled = false
          ), 700
          if this.options.hasOwnProperty('onSlideChange')
            this.options.onSlideChange()
          if this.distanceScrolled > 0
            this.slideCounter--
            if this.options.hasOwnProperty('this.slidesToScroll')
              this.scroll 'left', this.scrollDistance()
              if this.slidesToShow == 1 and this.slidesToScroll == 1
                if this.options.hasOwnProperty('sliderNavItemClass')
                  document.querySelectorAll('.' + this.options.sliderNavItemClass)[this.slideCounter].classList.add 'active'
                  document.querySelectorAll('.' + this.options.sliderNavItemClass)[this.slideCounter + 1].classList.remove 'active'
            else
              this.scroll 'left', this.scrollDistance()

  vanillaSlider.prototype.onNavItemClick = ->
    for navItem in this.sliderNavItemArray
      navItem.onclick = (event) =>
        this.autoplay (false)
        this.slideNumber                              = this.sliderNavItemArray.indexOf(event.currentTarget)
        this.sliderWrapper.style.transform            = 'translateX(' + this.slideNumber * -this.slideWidth + 'px)'
        this.sliderWrapper.style['-webkit-transform'] = 'translateX(' + this.slideNumber * -this.slideWidth + 'px)'
        this.sliderWrapper.style['-ms-transform']     = 'translateX(' + this.slideNumber * -this.slideWidth + 'px)'
        this.slideCounter                             = this.slideNumber
        this.zeroCounter                              = this.slideNumber
        if this.options.hasOwnProperty('sliderNavItemClass')
          for index in [0...this.sliderNavItemArray.length]
            if index == this.slideNumber
              this.sliderNavItemArray[index].classList.add 'active'
            else
              this.sliderNavItemArray[index].classList.remove 'active'

  vanillaSlider.prototype.extendDefaults = (source, properties) ->
    property = undefined
    for property of properties
      `property = property`
      if properties.hasOwnProperty(property)
        source[property] = properties[property]
    source