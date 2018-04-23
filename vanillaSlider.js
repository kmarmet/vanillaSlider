function vanillaSlider(options) {
   let slider              = document.querySelector('.' + options.sliderClass);
   let slide               = document.querySelectorAll('.' + options.slideClass);
   let sliderWrapper       = document.querySelector('.' + options.sliderClass + ' .wrapper');
   let syncedSlider        = document.querySelectorAll('.' + options.syncedSliderClass);
   let syncedSlide         = document.querySelectorAll('.' + options.syncedSlideClass);
   let syncedSliderWrapper = document.querySelector('.' + options.syncedSliderClass + ' .wrapper');
   let sliderNavItem       = document.querySelectorAll('.' + options.sliderNavItemClass);
   let moveLeftButton      = [...document.querySelectorAll('.' + options.leftButtonClass)];
   let moveRightButton     = [...document.querySelectorAll('.' + options.rightButtonClass)];
   let firstSlide          = document.querySelectorAll('.' + options.slideClass)[0];
   let slidesToShow        = options.slidesToShow;
   let slidesToScroll      = options.slidesToScroll;
   let slideWidth          = firstSlide.clientWidth;
   let numOfSlides         = [...document.querySelectorAll('.' + options.slideClass)].length;
   let sliderNavItemArray  = [...document.querySelectorAll('.' + options.sliderNavItemClass)];
   let autoplayInterval    = function() {
   };
   let margin              = function() {
      let calcMargin;
      calcMargin = window.getComputedStyle(firstSlide).getPropertyValue('margin-right');
      calcMargin = parseInt(calcMargin.replace('px', ''));
      calcMargin = calcMargin * 2;
      return calcMargin;
   };
   let scrollDistance      = function() {
      return (margin() + slideWidth) * slidesToScroll;
   };
   let zeroCounter         = 0;
   let slideCounter        = slidesToShow;
   let distanceScrolled    = (margin() + slideWidth) * slidesToScroll;
   let end                 = function() {
      if (slidesToShow === 1) {
         if (zeroCounter === (numOfSlides - 1)) {
            return true;
         }
      }
      else {
         if (zeroCounter === slidesToShow / slidesToScroll) {
            return true;
         }
      }
   };
   if (slidesToShow > 1) {
      slider.style.width = (margin() + slideWidth) * slidesToShow + 'px';
   }

   // SET DEFAULTS
   if (!options.hasOwnProperty('slidesToShow')) {
      options.slidesToShow = 1;
   }
   if (!options.hasOwnProperty('slidesToScroll')) {
      options.slidesToScroll = 1;
   }
   if (slidesToShow === 1) {
      slideCounter = 0;
   }

   // RUN NECESSARY FUNCTIONS
   onResize();
   if (options.hasOwnProperty('leftButtonClass') && options.hasOwnProperty('rightButtonClass')) {
      leftClick();
      rightClick();
   }
   if (options.hasOwnProperty('sliderNavItemClass')) {
      onNavItemClick();
   }
   if (options.hasOwnProperty('responsive')) {
      responsive();
   }
   if (options.autoplay !== false) {
      autoplay(true);
   }

   function autoplay(status) {
      if (status === true) {
         autoplayInterval = setInterval((() => {
            moveSlide('right');
         }), 3000);
      }
      else {
         clearInterval(autoplayInterval);
      }
   }

   function prefixedStyle(element, property, value) {
      element.style['webkit' + property] += value;
      element.style['moz' + property] += value;
      element.style['ms' + property] += value;
      element.style['o' + property] += value;
   }

   function scroll(direction, distance) {
      if (direction === 'left') {
         prefixedStyle(sliderWrapper, 'Transform', `translateX(${distance}px)`);
         if (options.hasOwnProperty('syncedSlideClass')) {
            prefixedStyle(syncedSliderWrapper, 'Transform', `translateX(${distance}px)`);
         }
         zeroCounter <= 0 ? distanceScrolled = (slideWidth + margin()) * slidesToShow : distanceScrolled -= distance;
      }
      else {
         prefixedStyle(sliderWrapper, 'Transform', `translateX(${-distance}px)`);
         if (options.hasOwnProperty('syncedSlideClass')) {
            prefixedStyle(syncedSliderWrapper, 'Transform', `translateX(${-distance}px)`);
         }
         zeroCounter <= 0 ? distanceScrolled = (slideWidth + margin()) * slidesToShow : distanceScrolled += distance;
      }
   }

   function startOver() {
      sliderWrapper.style.transform            = 'translateX(0)';
      sliderWrapper.style['-webkit-transform'] = 'translateX(0)';
      sliderWrapper.style['-ms-transform']     = 'translateX(0)';
      if (options.hasOwnProperty('sliderNavItemClass')) {
         sliderNavItemArray.forEach(function(navItem) {
            navItem.classList.remove('active');
         });

         document.querySelectorAll('.' + options.sliderNavItemClass)[0].classList.add('active');
      }
      slideCounter = 0;
      zeroCounter  = 0;
   }

   function onResize() {
      let delay      = function() {
      };
      const whenDone = () => {
         if (options.hasOwnProperty('responsive')) {
            responsive();
         }
      };
      window.addEventListener('resize', function() {
         clearTimeout(delay);
         delay = setTimeout(whenDone, 100);
      });
   }

   function responsive() {
      options.responsive.forEach(function(iteration) {
         if (window.matchMedia(`(max-width: ${iteration.breakpoint}px)`).matches) {
            if (options.hasOwnProperty('slidesToScroll')) {
               slidesToScroll = iteration.slidesToScroll;
               slidesToShow   = iteration.slidesToShow;
            }
            slider.style.width = (slideWidth + margin()) * iteration.slidesToShow + 'px';
         }
         else if (window.innerWidth > options.responsive[0].breakpoint) {
            slidesToScroll     = options.slidesToScroll;
            slidesToShow       = options.slidesToShow;
            slider.style.width = (slideWidth + margin()) * slidesToShow + 'px';
         }
      });
   }

   function moveSlide(direction) {
      if (options.hasOwnProperty('onSlideChange')) {
         options.onSlideChange();
      }
      if (end() === true) {
         startOver();
      }
      else {
         if (direction === 'left') {
            scroll('left', scrollDistance());
            zeroCounter--;
            slideCounter--;
         }
         else {
            scroll('right', scrollDistance());
            zeroCounter++;
            slideCounter++;
         }
         if (options.hasOwnProperty('slidesToScroll')) {
            if (slidesToShow === 1 && slidesToScroll === 1) {
               if (options.hasOwnProperty('sliderNavItemClass')) {
                  sliderNavItemArray.forEach(function(navItem, index) {
                     navItem.classList.remove('active');
                     if (index === slideCounter) {
                        navItem.classList.add('active');
                     }
                  });
               }
            }
         }
      }
   }

   function rightClick() {
      moveRightButton.forEach(function(button) {
         button.onclick = () => {
            button.disabled = true;
            setTimeout((function() {
               button.disabled = false;
            }), 700);
            moveSlide('right');
         };
      });
   }

   function leftClick() {
      moveLeftButton.forEach(function(button) {
         button.onclick = () => {
            button.disabled = true;
            setTimeout((() => {
               button.disabled = false;
            }), 700);
            if (zeroCounter > 0) {
               moveSlide('left');
            }
         };
      });
   }

   function onNavItemClick() {
      sliderNavItemArray.forEach(function(navItem, index) {
         navItem.onclick = function(event) {
            autoplay(false);
            let slideNumber                          = sliderNavItemArray.indexOf(event.currentTarget);
            sliderWrapper.style.transform            = 'translateX(' + slideNumber * -slideWidth + 'px)';
            sliderWrapper.style['-webkit-transform'] = 'translateX(' + slideNumber * -slideWidth + 'px)';
            sliderWrapper.style['-ms-transform']     = 'translateX(' + slideNumber * -slideWidth + 'px)';
            slideCounter                             = slideNumber;
            zeroCounter                              = slideNumber;
            sliderNavItemArray.forEach(function(item, index) {
               slideNumber === index ? sliderNavItemArray[index].classList.add('active') : sliderNavItemArray[index].classList.remove('active');
            });
         };
      });
   }
}