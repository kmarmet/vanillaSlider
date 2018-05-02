function vanillaSlider(options) {
   // Main slider
   let slider              = document.querySelector('.' + options.sliderClass);
   let sliderWrapper       = document.querySelector('.' + options.sliderClass + ' .wrapper');
   let firstSlide          = document.querySelectorAll('.' + options.slideClass)[0];
   let slideWidth          = firstSlide.clientWidth;
   // Synced Slider
   let syncedFirstSlide    = document.querySelectorAll('.' + options.syncedSlideClass)[0] || '';
   let syncedSliderWrapper = document.querySelector('.' + options.syncedSliderClass + ' .wrapper') || '';
   let slidesToShow        = options.slidesToShow || 1;
   let slidesToScroll      = options.slidesToScroll || 1;
   let syncedSlideWidth    = syncedFirstSlide.clientWidth;
   // Helpers variables
   let numOfSlides         = [].slice.call(document.querySelectorAll('.' + options.slideClass)).length;
   let sliderNavItemArray  = [].slice.call(document.querySelectorAll('.' + options.sliderNavItemClass));
   // Buttons/Arrows
   let moveLeftButton      = [].slice.call(document.querySelectorAll('.' + options.leftButtonClass));
   let moveRightButton     = [].slice.call(document.querySelectorAll('.' + options.rightButtonClass));
   // Helper functions
   let autoPlayInterval    = function() {
   };
   let margin              = function() {
      let calcMargin;
      calcMargin = window.getComputedStyle(firstSlide).getPropertyValue('margin-right');
      calcMargin = parseInt(calcMargin.replace('px', ''));
      calcMargin = calcMargin * 2;
      return calcMargin;
   };
   // Counters
   let zeroCounter         = 0;
   let slideCounter        = slidesToShow;
   // Determine when slider has reached the end
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

   // Set slider width for sliders with more than one slide
   if (slidesToShow > 1) slider.style.width = (margin() + slideWidth) * slidesToShow + 'px';
   if (slidesToShow === 1) slideCounter = 0;

   // Run Necessary Functions On Load
   onResize();
   if (options.hasOwnProperty('leftButtonClass') && options.hasOwnProperty('rightButtonClass')) {
      leftClick();
      rightClick();
   }
   if (options.hasOwnProperty('sliderNavItemClass')) onNavItemClick();
   if (options.hasOwnProperty('responsive')) responsive();
   if (options.autoPlay !== false) autoPlay(true);

   function autoPlay(status) {
      if (status === true) {
         autoPlayInterval = setInterval((() => {
            moveSlide('right');
         }), 3000);
      }
      else {
         clearInterval(autoPlayInterval);
      }
   }

   function prefixedStyle(element, property, value) {
      element.style['webkit' + property] += value;
      element.style['moz' + property] += value;
      element.style['ms' + property] += value;
      element.style['o' + property] += value;
   }

   function scroll(direction) {
      if (direction === 'left') {
         prefixedStyle(sliderWrapper, 'Transform', `translateX(${(margin() + slideWidth) * slidesToScroll}px)`);
         if (options.hasOwnProperty('syncedSlideClass')) prefixedStyle(syncedSliderWrapper, 'Transform', `translateX(${(margin() + syncedSlideWidth) * slidesToScroll}px)`);
      }
      else {
         prefixedStyle(sliderWrapper, 'Transform', `translateX(${-(margin() + slideWidth) * slidesToScroll}px)`);
         if (options.hasOwnProperty('syncedSlideClass')) prefixedStyle(syncedSliderWrapper, 'Transform', `translateX(${-(margin() + syncedSlideWidth) * slidesToScroll}px)`);
      }
   }

   function startOver() {
      slideWidth                               = firstSlide.clientWidth;
      sliderWrapper.style.transform            = 'translateX(0)';
      sliderWrapper.style['-webkit-transform'] = 'translateX(0)';
      sliderWrapper.style['-ms-transform']     = 'translateX(0)';
      if (options.hasOwnProperty('syncedSlideClass')) {
         syncedSlideWidth                               = syncedFirstSlide.clientWidth;
         syncedSliderWrapper.style.transform            = 'translateX(0)';
         syncedSliderWrapper.style['-webkit-transform'] = 'translateX(0)';
         syncedSliderWrapper.style['-ms-transform']     = 'translateX(0)';
      }
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
         else {
            if (window.innerWidth > 768) {
               startOver();
            }
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
            scroll('left');
            zeroCounter--;
            slideCounter--;
         }
         else {
            scroll('right');
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
            autoPlay(false);
            let slideNumber = sliderNavItemArray.indexOf(event.currentTarget);
            if (options.hasOwnProperty('syncedSlideClass')) {
               syncedSliderWrapper.style.transform            = 'translateX(' + slideNumber * -syncedSlideWidth + 'px)';
               syncedSliderWrapper.style['-webkit-transform'] = 'translateX(' + slideNumber * -syncedSlideWidth + 'px)';
               syncedSliderWrapper.style['-ms-transform']     = 'translateX(' + slideNumber * -syncedSlideWidth + 'px)';
            }
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
