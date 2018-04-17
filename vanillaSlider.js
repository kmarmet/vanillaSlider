// IIFE FOR PRIVACY
(function() {
  // CONSTRUCTOR
  this.vanillaSlider = function(options) {
    this.options = options;
    this.slider = document.querySelector('.' + this.options.sliderClass);
    this.slide = document.querySelectorAll('.' + this.options.slideClass);
    this.sliderWrapper = document.querySelector('.' + this.options.sliderClass + ' .wrapper');
    this.syncedSlider = document.querySelectorAll('.' + this.options.syncedSliderClass);
    this.syncedSlide = document.querySelectorAll('.' + this.options.syncedSlideClass);
    this.syncedSliderWrapper = document.querySelector('.' + this.options.syncedSliderClass + ' .wrapper');
    this.sliderNavItem = document.querySelectorAll('.' + this.options.sliderNavItemClass);
    this.moveLeftButton = document.querySelectorAll('.' + this.options.leftButtonClass);
    this.moveRightButton = document.querySelectorAll('.' + this.options.rightButtonClass);
    this.firstSlide = document.querySelectorAll('.' + this.options.slideClass)[0];
    this.slidesToShow = this.options.slidesToShow;
    this.slidesToScroll = this.options.slidesToScroll;
    this.slideWidth = this.firstSlide.clientWidth;
    this.slideHeight = this.firstSlide.clientHeight;
    this.sliderWidth = this.slider.clientWidth;
    this.screenWidth = window.innerWidth;
    this.numOfSlides = document.querySelectorAll('.' + this.options.slideClass).length;
    this.sliderNavItemArray = [...this.sliderNavItem];
    this.autoplayInterval = '';
    this.margin = function() {
      var calcMargin;
      calcMargin = window.getComputedStyle(this.firstSlide).getPropertyValue('margin-right');
      calcMargin = parseInt(calcMargin.replace('px', ''));
      calcMargin = calcMargin * 2;
      return calcMargin;
    };
    this.scrollDistance = function() {
      return (this.margin() + this.slideWidth) * this.slidesToScroll;
    };
    this.zeroCounter = 0;
    this.slideCounter = this.slidesToShow;
    this.distanceScrolled = (this.margin() + this.slideWidth) * this.slidesToScroll;
    if (this.slidesToShow > 1) {
      this.slider.style.width = (this.margin() + this.slideWidth) * this.slidesToShow + 'px';
    }
    if (!this.options.hasOwnProperty('slidesToShow')) {
      this.options.slidesToShow = 1;
    }
    if (!this.options.hasOwnProperty('slidesToScroll')) {
      this.options.slidesToScroll = 1;
    }
    if (this.slidesToShow === 1) {
      this.slideCounter = 0;
    }
    // INITIALIZE NECESSARY MODULES
    this.onResize();
    if (this.options.hasOwnProperty('leftButtonClass') && this.options.hasOwnProperty('rightButtonClass')) {
      this.leftClick();
      this.rightClick();
    }
    if (this.options.hasOwnProperty('sliderNavItemClass')) {
      this.onNavItemClick();
    }
    if (this.options.hasOwnProperty('responsive')) {
      this.responsive();
    }
    if (this.options.autoplay !== false) {
      return this.autoplay(true);
    }
  };
  // METHODS
  vanillaSlider.prototype.autoplay = function(status) {
    if (status === true) {
      return this.autoplayInterval = setInterval((() => {
        return this.moveRight();
      }), 3000);
    } else {
      return clearInterval(this.autoplayInterval);
    }
  };
  vanillaSlider.prototype.prefixedStyle = function(element, property, value) {
    element.style['webkit' + property] += value;
    element.style['moz' + property] += value;
    element.style['ms' + property] += value;
    element.style['o' + property] += value;
  };
  vanillaSlider.prototype.scroll = function(direction, distance) {
    if (this.zeroCounter < 2) {
      this.distanceScrolled = (this.slideWidth + this.margin()) * this.slidesToShow;
    }
    if (direction === 'left') {
      this.prefixedStyle(this.sliderWrapper, 'Transform', `translateX(${distance}px)`);
      if (this.options.hasOwnProperty('syncedSlideClass')) {
        this.prefixedStyle(syncedSliderWrapper, 'Transform', `translateX(${distance}px)`);
      }
      return this.distanceScrolled -= distance;
    } else {
      this.prefixedStyle(this.sliderWrapper, 'Transform', `translateX(${-distance}px)`);
      if (this.options.hasOwnProperty('syncedSlideClass')) {
        this.prefixedStyle(syncedSliderWrapper, 'Transform', `translateX(${-distance}px)`);
      }
      return this.distanceScrolled += distance;
    }
  };
  vanillaSlider.prototype.startOver = function() {
    var i, len, navItem, ref;
    this.sliderWrapper.style.transform = 'translateX(0)';
    this.sliderWrapper.style['-webkit-transform'] = 'translateX(0)';
    this.sliderWrapper.style['-ms-transform'] = 'translateX(0)';
    if (this.options.hasOwnProperty('sliderNavItemClass')) {
      ref = this.sliderNavItemArray;
      for (i = 0, len = ref.length; i < len; i++) {
        navItem = ref[i];
        navItem.classList.remove('active');
      }
      document.querySelectorAll('.' + this.options.sliderNavItemClass)[0].classList.add('active');
    }
    this.slideCounter = 0;
    this.zeroCounter = 0;
    this.distanceScrolled = 0;
  };
  vanillaSlider.prototype.onResize = function() {
    var delay, whenDone;
    delay = function() {};
    whenDone = () => {
      if (this.options.hasOwnProperty('responsive')) {
        return this.responsive();
      }
    };
    return window.addEventListener('resize', function() {
      clearTimeout(delay);
      return delay = setTimeout(whenDone, 100);
    });
  };
  vanillaSlider.prototype.responsive = function() {
    var i, iteration, len, ref, results;
    ref = this.options.responsive;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      iteration = ref[i];
      if (window.matchMedia(`(max-width: ${iteration.breakpoint}px)`).matches) {
        if (this.options.hasOwnProperty('slidesToScroll')) {
          this.slidesToScroll = iteration.slidesToScroll;
          this.slidesToShow = iteration.slidesToShow;
        }
        results.push(this.slider.style.width = (this.slideWidth + this.margin()) * iteration.slidesToShow + 'px');
      } else if (window.innerWidth > this.options.responsive[0].breakpoint) {
        this.slidesToScroll = this.options.slidesToScroll;
        this.slidesToShow = this.options.slidesToShow;
        results.push(this.slider.style.width = (this.slideWidth + this.margin()) * this.slidesToShow + 'px');
      } else {
        results.push(void 0);
      }
    }
    return results;
  };
  vanillaSlider.prototype.advanceSlide = function() {
    if (this.options.hasOwnProperty('sliderNavItemClass')) {
      document.querySelectorAll('.' + this.options.sliderNavItemClass)[this.slideCounter].classList.add('active');
      if (this.slideCounter > 0) {
        document.querySelectorAll('.' + this.options.sliderNavItemClass)[this.slideCounter - 1].classList.remove('active');
      }
    }
    return this.scroll('right', this.scrollDistance());
  };
  vanillaSlider.prototype.moveRight = function() {
    if (this.options.hasOwnProperty('onSlideChange')) {
      this.options.onSlideChange();
    }
    this.slideCounter++;
    this.zeroCounter++;
    if (this.distanceScrolled >= this.numOfSlides * this.slideWidth) {
      return this.startOver();
    } else {
      return this.advanceSlide();
    }
  };
  vanillaSlider.prototype.rightClick = function() {
    var button, i, len, ref, results;
    ref = this.moveRightButton;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      button = ref[i];
      results.push(button.onclick = () => {
        button.disabled = true;
        setTimeout((function() {
          return button.disabled = false;
        }), 700);
        return this.moveRight();
      });
    }
    return results;
  };
  vanillaSlider.prototype.leftClick = function() {
    var button, i, len, ref, results;
    ref = this.moveLeftButton;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      button = ref[i];
      results.push(button.onclick = () => {
        if (this.zeroCounter > 0) {
          this.moveLeftButton.disabled = true;
          setTimeout((() => {
            return this.moveLeftButton.disabled = false;
          }), 700);
          if (this.options.hasOwnProperty('onSlideChange')) {
            this.options.onSlideChange();
          }
          if (this.distanceScrolled > 0) {
            this.slideCounter--;
            if (this.options.hasOwnProperty('this.slidesToScroll')) {
              this.scroll('left', this.scrollDistance());
              if (this.slidesToShow === 1 && this.slidesToScroll === 1) {
                if (this.options.hasOwnProperty('sliderNavItemClass')) {
                  document.querySelectorAll('.' + this.options.sliderNavItemClass)[this.slideCounter].classList.add('active');
                  return document.querySelectorAll('.' + this.options.sliderNavItemClass)[this.slideCounter + 1].classList.remove('active');
                }
              }
            } else {
              return this.scroll('left', this.scrollDistance());
            }
          }
        }
      });
    }
    return results;
  };
  vanillaSlider.prototype.onNavItemClick = function() {
    var i, len, navItem, ref, results;
    ref = this.sliderNavItemArray;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      navItem = ref[i];
      results.push(navItem.onclick = (event) => {
        var index, j, ref1, results1;
        this.autoplay(false);
        this.slideNumber = this.sliderNavItemArray.indexOf(event.currentTarget);
        this.sliderWrapper.style.transform = 'translateX(' + this.slideNumber * -this.slideWidth + 'px)';
        this.sliderWrapper.style['-webkit-transform'] = 'translateX(' + this.slideNumber * -this.slideWidth + 'px)';
        this.sliderWrapper.style['-ms-transform'] = 'translateX(' + this.slideNumber * -this.slideWidth + 'px)';
        this.slideCounter = this.slideNumber;
        this.zeroCounter = this.slideNumber;
        if (this.options.hasOwnProperty('sliderNavItemClass')) {
          results1 = [];
          for (index = j = 0, ref1 = this.sliderNavItemArray.length; (0 <= ref1 ? j < ref1 : j > ref1); index = 0 <= ref1 ? ++j : --j) {
            if (index === this.slideNumber) {
              results1.push(this.sliderNavItemArray[index].classList.add('active'));
            } else {
              results1.push(this.sliderNavItemArray[index].classList.remove('active'));
            }
          }
          return results1;
        }
      });
    }
    return results;
  };
  return vanillaSlider.prototype.extendDefaults = function(source, properties) {
    var property;
    property = void 0;
    for (property in properties) {
      property = property;
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  };
})();
