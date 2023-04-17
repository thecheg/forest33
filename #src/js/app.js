'use strict';

//=include ../../node_modules/jquery/dist/jquery.js
//=include ../../node_modules/device.js/dist/device.umd.js
//=include ../../node_modules/swiper/swiper-bundle.js
//=include ../modules/fancybox/fancybox.js

/*
 * Cheg UI 3.0.0
*/
const app = {
	settings: {
		winWidth: 0,
		winHeight: 0,

		sbWidth: 0,

		scrollOffset: function() {
			let off = 0;

			if (app.matches('max-width:1200px')) {
				off = 90;
			}

			if (app.matches('max-width:800px')) {
				off = 60;
			}

			return off;
		},
		scrollPos: 0,
		popupOpened: false,
		scrollLockPos: 0,

		animDuration: 400,

		appLoaded: false,

		formTitle: '',

		menuOpened: false,
	},
	deviceIs: device.device,

	/*
	 * Checking if matches media query
	*/
	matches(query) {
		return window.matchMedia(`(${query})`).matches
	},

	/*
	 * Scroll to hash on page laod
	*/
	toHash() {
		if (window.location.hash) {
			app.scrollTo(window.location.hash, {
				offset: app.settings.scrollOffset()
			});
		}
	},

	carousel(block) {
		let slider = block.find('.ui-carousel__slider'),
			sliderS,
			opts = JSON.parse(block.attr('data-carousel')),
			swiperOpts = $.extend({
				slidesPerView: 'auto',
				spaceBetween: 20,
				speed: 500,
				loop: true,
				grabCursor: true,
				init: true,
				navigation: {
					nextEl: block.find('.ui-carousel__nav-item--n').get(0),
					prevEl: block.find('.ui-carousel__nav-item--p').get(0),
				},
				pagination: {
					el: block.find('.ui-carousel__dots').get(0),
					clickable: true,
					bulletActiveClass: 'active',
					renderBullet: function(i, className) {
						return '<button class="ui-carousel__dots-item ' + className + '" type="button"></button>';
					}
				}
			}, opts);

		sliderS = new Swiper(slider.get(0), swiperOpts);

		block.data('carouselInit', true);
	},

	/*
	 * Product slider
	*/
	product(block) {
		let thumb = block.find('.product__thumbs-slider'),
			thumbS,
			thumbOpts = {
				loop: true,
				init: true,
				slidesPerView: 2,
				spaceBetween: 20,
				slideActiveClass: 'active',
				slideDuplicateActiveClass: 'active-duplicate',
				watchSlidesProgress: true,
			};

		thumbS = new Swiper(thumb.get(0), thumbOpts);

		let img = block.find('.product__imgs-slider'),
			imgS,
			imgOpts = {
				loop: true,
				init: true,
				slidesPerView: 1,
				spaceBetween: 0,
				navigation: {
					nextEl: [
						block.find('.product__nav-item--n').get(0),
					],
					prevEl: [
						block.find('.product__nav-item--p').get(0),
					]
				},
				slideActiveClass: 'active',
				slideDuplicateActiveClass: 'active-duplicate',
				thumbs: {
					swiper: thumbS,
					slideThumbActiveClass: 'active'
				},
			};

		imgS = new Swiper(img.get(0), imgOpts);

		block.data('productInit', true);
	}
};
	
//=include ../modules/cheg.units/functions.js

//=include ../modules/cheg.scrollto/functions.js

//=include ../modules/cheg.tabs/functions.js
//=include ../modules/cheg.accordions/functions.js

//=include ../modules/cheg.scrolllock/functions.js
//=include ../modules/cheg.popups/functions.js

//=include ../modules/cheg.menu/functions.js

//=include ../modules/cheg.waypoint/functions.js

//=include ../modules/cheg.checkwebp/functions.js

/*
 * Init
*/
app.init = () => {
	// * Units
	app.units.all();

	// * Accordions
	$('.ui-accordion').not('.custom').each(function () {
		if (!$(this).data('accordionInit')) {
			app.accordions($(this));
		}
	});

	// * Tabs
	$('.ui-tabs').not('.custom').each(function () {
		if (!$(this).data('tabsInit')) {
			app.tabs.init($(this));
		}
	});
	app.tabs.bind();

	// * Popups
	$('.popup').each(function () {
		if (!$(this).data('popupsInit')) {
			app.popups.init($(this));
		}
	});
	app.popups.bind();

	// * Product slider
	$('.product__block').each(function () {
		if (!$(this).data('productInit')) {
			app.product($(this));
		}
	});

	// * Carousel
	$('.ui-carousel').each(function () {
		if (!$(this).data('carouselInit')) {
			app.carousel($(this));
		}
	});
}

app.deviceIs.addClasses(document.documentElement);

(function () {
	app.deviceIs.touch ? $('html').addClass('touch') : $('html').addClass('no-touch');

	app.settings.winWidth = $(window).width();
	app.settings.winHeight = $(window).height();
	app.settings.scrollPos = $(window).scrollTop();

	// * Init
	app.init();

	//app.popups.open('request');

	// * Menu binds
	app.menu.bind();

	$(document).on('click', '.catalog__menu-trig', function() {
		$(this).closest('.catalog__menu').toggleClass('active');
	});

	$(document).on('click', '.catalog__menu-link', function() {
		$(this).closest('.catalog__menu').removeClass('active');
	});

	app.waypoint({
		position: 20,
		onDown: function() {
			$('.app').addClass('app--scrolled');
			$('.header').addClass('header--scrolled');
		},
		onUp: function() {
			$('.app').removeClass('app--scrolled');
			$('.header').removeClass('header--scrolled');
		}
	});


	if (app.deviceIs.desktop) {
		$(window).on('resize', function () {
			app.units.all();
		});
	} else {

	}

	if (app.deviceIs.mobile || app.deviceIs.tablet) {
		$(window).on('orientationchange', function () {
			app.units.vh();
		}).on('resize', function () {
			app.units.mobile();
		});
	}

	$(window).on('resize', function () {
		app.settings.winWidth = $(window).width();
		app.settings.winHeight = $(window).height();
		app.settings.scrollPos = $(window).scrollTop();

		app.settings.menuOpened ? app.menu.close() : null;
	}).on('scroll', function () {
		app.settings.scrollPos = $(window).scrollTop();
	}).trigger('resize').trigger('scroll');

	// * Scroll to element
	$(document).on('click', 'a[href^="#"], [data-scrollto]', function (e) {
		e.preventDefault();
		let el = $(this).attr('href') || $(this).attr('data-scrollto');

		app.scrollTo(el, {
			offset: app.settings.scrollOffset() + 20
		});
	});
})(jQuery);

$(window).on('load', function () {
	setTimeout(function () {
		// * hide preloader
		$('.preloader').fadeOut(1000, function () {
			$(this).remove();
		});
		$('.app').addClass('app--loaded');
		app.settings.appLoaded = true;
		$(window)
			.trigger('app.loaded')
			.trigger('scroll');
	}, 300);

	// * Scroll to hash on page laod
	app.toHash();
});