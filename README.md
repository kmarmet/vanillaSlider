# vanillaSlider
A vanilla/pure Javascript image slider.

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
