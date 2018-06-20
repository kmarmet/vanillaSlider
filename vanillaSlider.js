/*
 ****** DOCUMENTATION ******
 The vanillaSlider function can be called at the bottom of any page that needs a slider
 Can be reused on any page, multiple times

 // MINIMUM REQUIRED OPTIONS:
 (Replace classes and numbers with your classes and desired numbers)
 vanillaSlider({
 sliderClass:        "testimonial-slider",
 slideClass:         "testimonial-slider-copy",
 slidesToShow:       1,
 slidesToScroll:     1,
 });

 // Basic HTML
 <div class="slider-class">
 <div class="wrapper">
 <img src="" alt="" class="slide-class">
 <img src="" alt="" class="slide-class">
 </div>
 </div>

 A very simple demo can be found here: https://codepen.io/kmarmet/pen/RJGebK?editors=1010

 // ADDITIONAL OPTIONS (no period needed for class names):
 autoPlay: true | false (true is default)
 fade: true | false (false is default)
 showTransition: true | false (true is default)
 slidesToShow: int
 slidesToScroll: int
 syncedSliderClass: 'synced slider class name'
 syncedSlideClass: 'synced slide class name'
 leftButtonClass:  "left button class name",
 rightButtonClass: "right button class name",
 responsive:       [
 {
 breakpoint:     768,
 slidesToShow:   2,
 slidesToScroll: 2
 }
 ],

 Using fade requires an active class for the slide class.
 Example CSS:
 .slide-class {opacity: 0;}
 .slide-class.active {opacity: 1;}
 */

function vanillaSlider(options) {
   // Ensure elements exist before proceeding
   let checkForElements = setInterval(function() {
      if (document.querySelectorAll('.' + options.slideClass)[0]) {
         clearInterval(checkForElements);
         whenLive();
      }
   }, 10);

   function whenLive() {
      // Main slider
      let slider        = document.querySelector('.' + options.sliderClass);
      let slide         = [].slice.call(document.querySelectorAll('.' + options.slideClass));
      let sliderWrapper = document.querySelector('.' + options.sliderClass + ' .wrapper');
      let firstSlide    = document.querySelectorAll('.' + options.slideClass)[0];
      let slideWidth    = document.querySelectorAll('.' + options.slideClass)[0].getBoundingClientRect().width;

      // Synced Slider
      let syncedFirstSlide    = document.querySelectorAll('.' + options.syncedSlideClass)[0] || '';
      let syncedSliderWrapper = document.querySelector('.' + options.syncedSliderClass + ' .wrapper') || '';
      let syncedSlideWidth    = syncedFirstSlide.clientWidth;

      // Helpers/default variables
      let numOfSlides        = [].slice.call(document.querySelectorAll('.' + options.slideClass)).length;
      let sliderNavItemArray = [].slice.call(document.querySelectorAll('.' + options.sliderNavItemClass));
      let slidesToShow       = options.slidesToShow || 1;
      let slidesToScroll     = options.slidesToScroll || 1;

      // Buttons/Arrows
      let moveLeftButton   = [].slice.call(document.querySelectorAll('.' + options.leftButtonClass));
      let moveRightButton  = [].slice.call(document.querySelectorAll('.' + options.rightButtonClass));
      // Helper functions
      let autoPlayInterval = function() {
      };
      let margin           = function(isSynced) {
         let totalMargin, marginLeft, marginRight, slideType;
         if (isSynced === undefined) isSynced = false;
         isSynced === false ? slideType = firstSlide : slideType = syncedFirstSlide;
         marginRight = window.getComputedStyle(slideType).getPropertyValue('margin-right').replace('px', '');
         marginLeft  = window.getComputedStyle(slideType).getPropertyValue('margin-left').replace('px', '');
         totalMargin = parseInt(marginLeft) + parseInt(marginRight);
         return totalMargin;
      };
      // Counters
      let zeroCounter      = 0;
      let slideCounter     = 0;
      slidesToShow === 1 ? slideCounter = 0 : slideCounter = slidesToShow;
      let speed, fade;

      // Set defaults
      options.hasOwnProperty('speed') ? speed = options.speed : speed = 3000;
      options.hasOwnProperty('fade') ? fade = options.fade : fade = false;

      // Determine when slider has reached the end
      let end = function() {
         if (slidesToShow === 1) {
            if (zeroCounter === (numOfSlides - 1)) return true;
         }
         else {
            if (zeroCounter === slidesToShow / slidesToScroll) return true;
         }
      };

      // Set slider width
      if (slidesToShow > 1) {
         if (options.hasOwnProperty('syncedSliderClass')) {
            slider.style.width = (margin(true) + slideWidth) * slidesToShow + 'px';
         }
         else {
            slider.style.width = (margin(false) + slideWidth) * slidesToShow + 'px';
         }
      }

      // Default styles
      slide.forEach(function(item) {
         if (item.nodeName === 'IMG') {
            item.style.maxWidth = '100%';
         }
      });

      // Run Necessary Functions On Load
      onResize();
      if (options.hasOwnProperty('leftButtonClass')) leftClick();
      if (options.hasOwnProperty('rightButtonClass')) rightClick();
      if (options.hasOwnProperty('sliderNavItemClass')) onNavItemClick();
      if (options.hasOwnProperty('responsive')) responsive();
      if (options.autoPlay !== false) autoPlay(true);
      if (fade === true && slidesToShow === 1) styleCurrentSlide(zeroCounter);
      if (options.showTransition !== false) {
         prefixedStyle(sliderWrapper, 'Transition', 'all .5s ease-in-out');
         if (options.hasOwnProperty('syncedSlideClass')) prefixedStyle(syncedSliderWrapper, 'Transform', 'transition: all .5s ease-in-out');
      }

      function autoPlay(status) {
         if (status === true) {
            autoPlayInterval = setInterval((() => {
               moveSlide('right');
            }), speed);
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
            prefixedStyle(sliderWrapper, 'Transform', `translate3d(${(margin(false) + slideWidth) * slidesToScroll}px, 0, 0)`);
            if (options.hasOwnProperty('syncedSlideClass')) prefixedStyle(syncedSliderWrapper, 'Transform', `translate3d(${(margin(true) + syncedSlideWidth) * slidesToScroll}px, 0, 0)`);
         }
         else {
            prefixedStyle(sliderWrapper, 'Transform', `translate3d(${-(margin(false) + slideWidth) * slidesToScroll}px, 0, 0)`);
            if (options.hasOwnProperty('syncedSlideClass')) prefixedStyle(syncedSliderWrapper, 'Transform', `translate3d(${-(margin(true) + syncedSlideWidth) * slidesToScroll}px, 0, 0)`);
         }
      }

      function startOver() {
         slideWidth                               = firstSlide.clientWidth;
         sliderWrapper.style.transform            = 'translate3d(0, 0, 0)';
         sliderWrapper.style['-webkit-transform'] = 'translate3d(0, 0, 0)';
         sliderWrapper.style['-ms-transform']     = 'translate3d(0, 0, 0)';
         if (options.hasOwnProperty('syncedSlideClass')) {
            syncedSlideWidth                               = syncedFirstSlide.clientWidth;
            syncedSliderWrapper.style.transform            = 'translate3d(0, 0, 0)';
            syncedSliderWrapper.style['-webkit-transform'] = 'translate3d(0, 0, 0)';
            syncedSliderWrapper.style['-ms-transform']     = 'translate3d(0, 0, 0)';
         }
         if (options.hasOwnProperty('sliderNavItemClass')) {
            sliderNavItemArray.forEach(function(navItem) {
               navItem.classList.remove('active');
            });

            document.querySelectorAll('.' + options.sliderNavItemClass)[0].classList.add('active');
         }
         slideCounter = 0;
         zeroCounter  = 0;
         if (fade === true && slidesToShow === 1) {
            styleCurrentSlide(zeroCounter);
         }
      }

      function onResize() {
         let delay      = function() {
         };
         let width      = window.innerWidth;
         const whenDone = () => {
            if (options.hasOwnProperty('responsive')) {
               responsive();
            }
            else {
               startOver();
            }
            if (options.hasOwnProperty('variableHeight')) slider.style.height = firstSlide.clientHeight + 'px';
         };
         window.addEventListener('resize', function() {
            clearTimeout(delay);
            if (width !== window.innerWidth) {
               delay = setTimeout(whenDone, 100);
            }
         });
      }

      function responsive() {
         options.responsive.forEach(function(iteration) {
            if (window.matchMedia(`(max-width: ${iteration.breakpoint}px)`).matches) {
               if (options.hasOwnProperty('slidesToScroll')) {
                  slidesToScroll = iteration.slidesToScroll;
                  slidesToShow   = iteration.slidesToShow;
               }
               if (options.hasOwnProperty('syncedSliderClass')) slider.style.width = (slideWidth + margin(true)) * iteration.slidesToShow + 'px';
               slider.style.width = (slideWidth + margin(false)) * iteration.slidesToShow + 'px';
            }
            else if (window.innerWidth > options.responsive[0].breakpoint) {
               slidesToScroll     = options.slidesToScroll;
               slidesToShow       = options.slidesToShow;
               slider.style.width = (slideWidth + margin(false)) * slidesToShow + 'px';
               if (options.hasOwnProperty('syncedSliderClass')) slider.style.width = (slideWidth + margin(true)) * iteration.slidesToShow + 'px';
            }
         });
      }

      function moveSlide(direction) {
         if (options.hasOwnProperty('onSlideChange')) {
            options.onSlideChange();
         }
         if (end() === true && direction !== 'left') {
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
            if (fade === true && slidesToShow === 1) {
               styleCurrentSlide(zeroCounter);
            }
         }
         if (options.hasOwnProperty('variableHeight')) slider.style.height = document.querySelectorAll('.' + options.slideClass)[zeroCounter].clientHeight + 'px';
      }

      function rightClick() {
         moveRightButton.forEach(function(button) {
            button.addEventListener('click', function() {
               button.disabled = true;
               setTimeout(function() {
                  button.disabled = false;
               }, 700);
               moveSlide('right');
            });
         });
      }

      function leftClick() {
         moveLeftButton.forEach(function(button) {
            button.addEventListener('click', function() {
               button.disabled = true;
               setTimeout(function() {
                  button.disabled = false;
               }, 700);
               if (zeroCounter > 0) {
                  moveSlide('left');
               }
            });
         });
      }

      function styleCurrentSlide(index) {
         slide.filter(function(current) {
            return current !== document.querySelectorAll('.' + options.slideClass)[index];
         }).map(function(slide) {
            slide.style.opacity = '0';
         });
         document.querySelectorAll('.' + options.slideClass)[index].style.opacity = '1';
      }

      function onNavItemClick() {
         sliderNavItemArray.forEach(function(navItem) {
            navItem.addEventListener('click', function(event) {
               autoPlay(false);
               let slideNumber = sliderNavItemArray.indexOf(event.currentTarget);
               if (options.hasOwnProperty('onSlideChange')) {
                  options.onSlideChange();
               }
               if (options.hasOwnProperty('syncedSlideClass')) {
                  syncedSliderWrapper.style.transform            = 'translate3d(' + slideNumber * (-syncedSlideWidth - margin(true)) + 'px, 0,0)';
                  syncedSliderWrapper.style['-webkit-transform'] = 'translate3d(' + slideNumber * (-syncedSlideWidth - margin(true)) + 'px, 0,0)';
                  syncedSliderWrapper.style['-ms-transform']     = 'translate3d(' + slideNumber * (-syncedSlideWidth - margin(true)) + 'px, 0,0)';
               }
               if (options.hasOwnProperty('variableHeight')) {
                  slider.style.height = document.querySelectorAll('.' + options.slideClass)[slideNumber].clientHeight + 'px, 0,0';
               }
               sliderWrapper.style.transform            = 'translate3d(' + slideNumber * (-slideWidth - margin(false)) + 'px, 0,0)';
               sliderWrapper.style['-webkit-transform'] = 'translate3d(' + slideNumber * (-slideWidth - margin(false)) + 'px, 0,0)';
               sliderWrapper.style['-ms-transform']     = 'translate3d(' + slideNumber * (-slideWidth - margin(false)) + 'px, 0,0)';
               slideCounter                             = slideNumber;
               zeroCounter                              = slideNumber;
               sliderNavItemArray.forEach(function(item, index) {
                  slideNumber === index ? sliderNavItemArray[index].classList.add('active') : sliderNavItemArray[index].classList.remove('active');
               });
               if (fade === true && slidesToShow === 1) {
                  styleCurrentSlide(slideNumber);
               }
            });
         });

         /*
          ****** DOCUMENTATION ******
          The vanillaSlider function can be called at the bottom of any page that needs a slider
          Can be reused on any page, multiple times

          // MINIMUM REQUIRED OPTIONS:
          (Replace classes and numbers with your classes and desired numbers)
          vanillaSlider({
          sliderClass:        "testimonial-slider",
          slideClass:         "testimonial-slider-copy",
          slidesToShow:       1,
          slidesToScroll:     1,
          });

          // Basic HTML
          <div class="slider-class">
          <div class="wrapper">
          <img src="" alt="" class="slide-class">
          <img src="" alt="" class="slide-class">
          </div>
          </div>

          A very simple demo can be found here: https://codepen.io/kmarmet/pen/RJGebK?editors=1010

          // ADDITIONAL OPTIONS (no period needed for class names):
          autoPlay: true | false (true is default)
          fade: true | false (false is default)
          showTransition: true | false (true is default)
          slidesToShow: int
          slidesToScroll: int
          syncedSliderClass: 'synced slider class name'
          syncedSlideClass: 'synced slide class name'
          leftButtonClass:  "left button class name",
          rightButtonClass: "right button class name",
          responsive:       [
          {
          breakpoint:     768,
          slidesToShow:   2,
          slidesToScroll: 2
          }
          ],

          Using fade requires an active class for the slide class.
          Example CSS:
          .slide-class {opacity: 0;}
          .slide-class.active {opacity: 1;}
          */

         function vanillaSlider(options) {
            // Ensure elements exist before proceeding
            let checkForElements = setInterval(function() {
               if (document.querySelectorAll('.' + options.slideClass)[0]) {
                  clearInterval(checkForElements);
                  whenLive();
               }
            }, 10);

            function whenLive() {
               let speed         = options.speed || 3000;
               let fade          = options.fade || false;
               // Main slider
               let slider        = document.querySelector('.' + options.sliderClass);
               let slide         = [].slice.call(document.querySelectorAll('.' + options.slideClass));
               let sliderWrapper = document.querySelector('.' + options.sliderClass + ' .wrapper');
               let firstSlide    = document.querySelectorAll('.' + options.slideClass)[0];
               let slideWidth    = document.querySelectorAll('.' + options.slideClass)[0].getBoundingClientRect().width;

               // Synced Slider
               let syncedFirstSlide    = document.querySelectorAll('.' + options.syncedSlideClass)[0] || '';
               let syncedSliderWrapper = document.querySelector('.' + options.syncedSliderClass + ' .wrapper') || '';
               let syncedSlideWidth    = syncedFirstSlide.clientWidth;

               // Helpers/default variables
               let numOfSlides        = [].slice.call(document.querySelectorAll('.' + options.slideClass)).length;
               let sliderNavItemArray = [].slice.call(document.querySelectorAll('.' + options.sliderNavItemClass));
               let slidesToShow       = options.slidesToShow || 1;
               let slidesToScroll     = options.slidesToScroll || 1;

               // Buttons/Arrows
               let moveLeftButton   = [].slice.call(document.querySelectorAll('.' + options.leftButtonClass));
               let moveRightButton  = [].slice.call(document.querySelectorAll('.' + options.rightButtonClass));
               // Helper functions
               let autoPlayInterval = function() {
               };
               let margin           = function(isSynced) {
                  let totalMargin, marginLeft, marginRight, slideType;
                  if (isSynced === undefined) isSynced = false;
                  isSynced === false ? slideType = firstSlide : slideType = syncedFirstSlide;
                  marginRight = window.getComputedStyle(slideType).getPropertyValue('margin-right').replace('px', '');
                  marginLeft  = window.getComputedStyle(slideType).getPropertyValue('margin-left').replace('px', '');
                  totalMargin = parseInt(marginLeft) + parseInt(marginRight);
                  return totalMargin;
               };
               // Counters
               let zeroCounter      = 0;
               let slideCounter     = 0;
               slidesToShow === 1 ? slideCounter = 0 : slideCounter = slidesToShow;

               // Determine when slider has reached the end
               let end = function() {
                  if (slidesToShow === 1) {
                     if (zeroCounter === (numOfSlides - 1)) return true;
                  }
                  else {
                     if (zeroCounter === slidesToShow / slidesToScroll) return true;
                  }
               };

               // Set slider width
               if (slidesToShow > 1) {
                  if (options.hasOwnProperty('syncedSliderClass')) {
                     slider.style.width = (margin(true) + slideWidth) * slidesToShow + 'px';
                  }
                  else {
                     slider.style.width = (margin(false) + slideWidth) * slidesToShow + 'px';
                  }
               }

               // Default styles
               slide.forEach(function(item) {
                  if (item.nodeName === 'IMG') {
                     item.style.maxWidth = '100%';
                  }
               });

               // Run Necessary Functions On Load
               onResize();
               if (options.hasOwnProperty('leftButtonClass')) leftClick();
               if (options.hasOwnProperty('rightButtonClass')) rightClick();
               if (options.hasOwnProperty('sliderNavItemClass')) onNavItemClick();
               if (options.hasOwnProperty('responsive')) responsive();
               if (options.autoPlay !== false) autoPlay(true);
               if (fade === true && slidesToShow === 1) styleCurrentSlide(zeroCounter);
               if (options.showTransition !== false) {
                  prefixedStyle(sliderWrapper, 'Transition', 'all .5s ease-in-out');
                  if (options.hasOwnProperty('syncedSlideClass')) prefixedStyle(syncedSliderWrapper, 'Transform', 'transition: all .5s ease-in-out');
               }

               function autoPlay(status) {
                  if (status === true) {
                     autoPlayInterval = setInterval((() => {
                        moveSlide('right');
                     }), speed);
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
                     prefixedStyle(sliderWrapper, 'Transform', `translate3d(${(margin(false) + slideWidth) * slidesToScroll}px, 0, 0)`);
                     if (options.hasOwnProperty('syncedSlideClass')) prefixedStyle(syncedSliderWrapper, 'Transform', `translate3d(${(margin(true) + syncedSlideWidth) * slidesToScroll}px, 0, 0)`);
                  }
                  else {
                     prefixedStyle(sliderWrapper, 'Transform', `translate3d(${-(margin(false) + slideWidth) * slidesToScroll}px, 0, 0)`);
                     if (options.hasOwnProperty('syncedSlideClass')) prefixedStyle(syncedSliderWrapper, 'Transform', `translate3d(${-(margin(true) + syncedSlideWidth) * slidesToScroll}px, 0, 0)`);
                  }
               }

               function startOver() {
                  slideWidth                               = firstSlide.clientWidth;
                  sliderWrapper.style.transform            = 'translate3d(0, 0, 0)';
                  sliderWrapper.style['-webkit-transform'] = 'translate3d(0, 0, 0)';
                  sliderWrapper.style['-ms-transform']     = 'translate3d(0, 0, 0)';
                  if (options.hasOwnProperty('syncedSlideClass')) {
                     syncedSlideWidth                               = syncedFirstSlide.clientWidth;
                     syncedSliderWrapper.style.transform            = 'translate3d(0, 0, 0)';
                     syncedSliderWrapper.style['-webkit-transform'] = 'translate3d(0, 0, 0)';
                     syncedSliderWrapper.style['-ms-transform']     = 'translate3d(0, 0, 0)';
                  }
                  if (options.hasOwnProperty('sliderNavItemClass')) {
                     sliderNavItemArray.forEach(function(navItem) {
                        navItem.classList.remove('active');
                     });

                     document.querySelectorAll('.' + options.sliderNavItemClass)[0].classList.add('active');
                  }
                  slideCounter = 0;
                  zeroCounter  = 0;
                  if (fade === true && slidesToShow === 1) {
                     styleCurrentSlide(zeroCounter);
                  }
               }

               function onResize() {
                  let delay      = function() {
                  };
                  let width      = window.innerWidth;
                  const whenDone = () => {
                     if (options.hasOwnProperty('responsive')) {
                        responsive();
                     }
                     else {
                        startOver();
                     }
                     if (options.hasOwnProperty('variableHeight')) slider.style.height = firstSlide.clientHeight + 'px';
                  };
                  window.addEventListener('resize', function() {
                     clearTimeout(delay);
                     if (width !== window.innerWidth) {
                        delay = setTimeout(whenDone, 100);
                     }
                  });
               }

               function responsive() {
                  options.responsive.forEach(function(iteration) {
                     if (window.matchMedia(`(max-width: ${iteration.breakpoint}px)`).matches) {
                        if (options.hasOwnProperty('slidesToScroll')) {
                           slidesToScroll = iteration.slidesToScroll;
                           slidesToShow   = iteration.slidesToShow;
                        }
                        if (options.hasOwnProperty('syncedSliderClass')) slider.style.width = (slideWidth + margin(true)) * iteration.slidesToShow + 'px';
                        slider.style.width = (slideWidth + margin(false)) * iteration.slidesToShow + 'px';
                     }
                     else if (window.innerWidth > options.responsive[0].breakpoint) {
                        slidesToScroll     = options.slidesToScroll;
                        slidesToShow       = options.slidesToShow;
                        slider.style.width = (slideWidth + margin(false)) * slidesToShow + 'px';
                        if (options.hasOwnProperty('syncedSliderClass')) slider.style.width = (slideWidth + margin(true)) * iteration.slidesToShow + 'px';
                     }
                  });
               }

               function moveSlide(direction) {
                  if (options.hasOwnProperty('onSlideChange')) {
                     options.onSlideChange();
                  }
                  if (end() === true && direction !== 'left') {
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
                     if (fade === true && slidesToShow === 1) {
                        styleCurrentSlide(zeroCounter);
                     }
                  }
                  if (options.hasOwnProperty('variableHeight')) slider.style.height = document.querySelectorAll('.' + options.slideClass)[zeroCounter].clientHeight + 'px';
               }

               function rightClick() {
                  moveRightButton.forEach(function(button) {
                     button.addEventListener('click', function() {
                        button.disabled = true;
                        setTimeout(function() {
                           button.disabled = false;
                        }, 700);
                        moveSlide('right');
                     });
                  });
               }

               function leftClick() {
                  moveLeftButton.forEach(function(button) {
                     button.addEventListener('click', function() {
                        button.disabled = true;
                        setTimeout(function() {
                           button.disabled = false;
                        }, 700);
                        if (zeroCounter > 0) {
                           moveSlide('left');
                        }
                     });
                  });
               }

               function styleCurrentSlide(index) {
                  slide.filter(function(current) {
                     return current !== document.querySelectorAll('.' + options.slideClass)[index];
                  }).map(function(slide) {
                     slide.style.opacity = '0';
                  });
                  document.querySelectorAll('.' + options.slideClass)[index].style.opacity = '1';
               }

               function onNavItemClick() {
                  sliderNavItemArray.forEach(function(navItem) {
                     navItem.addEventListener('click', function(event) {
                        autoPlay(false);
                        let slideNumber = sliderNavItemArray.indexOf(event.currentTarget);
                        if (options.hasOwnProperty('onSlideChange')) {
                           options.onSlideChange();
                        }
                        if (options.hasOwnProperty('syncedSlideClass')) {
                           syncedSliderWrapper.style.transform            = 'translate3d(' + slideNumber * (-syncedSlideWidth - margin(true)) + 'px, 0,0)';
                           syncedSliderWrapper.style['-webkit-transform'] = 'translate3d(' + slideNumber * (-syncedSlideWidth - margin(true)) + 'px, 0,0)';
                           syncedSliderWrapper.style['-ms-transform']     = 'translate3d(' + slideNumber * (-syncedSlideWidth - margin(true)) + 'px, 0,0)';
                        }
                        if (options.hasOwnProperty('variableHeight')) {
                           slider.style.height = document.querySelectorAll('.' + options.slideClass)[slideNumber].clientHeight + 'px, 0,0';
                        }
                        sliderWrapper.style.transform            = 'translate3d(' + slideNumber * (-slideWidth - margin(false)) + 'px, 0,0)';
                        sliderWrapper.style['-webkit-transform'] = 'translate3d(' + slideNumber * (-slideWidth - margin(false)) + 'px, 0,0)';
                        sliderWrapper.style['-ms-transform']     = 'translate3d(' + slideNumber * (-slideWidth - margin(false)) + 'px, 0,0)';
                        slideCounter                             = slideNumber;
                        zeroCounter                              = slideNumber;
                        sliderNavItemArray.forEach(function(item, index) {
                           slideNumber === index ? sliderNavItemArray[index].classList.add('active') : sliderNavItemArray[index].classList.remove('active');
                        });
                        if (fade === true && slidesToShow === 1) {
                           styleCurrentSlide(slideNumber);
                        }
                     });
                  });
               }
            }
         }

      }
   }
}
