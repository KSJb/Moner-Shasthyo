/* jQuery Simple Slider Plugin
 * @author: Luiz~ | 0lulz | lffg (https://github.com/lffg)
 * Licence MIT
 */
(function($) {
    $.fn.slider = function(config) {
        // ========== BEGIN Plugin ========== //

        var $sliderThis = $(this);

        // === BEGIN General Config of the Plugin === //
        var config = $.extend({
            'autoPlay': true,
            'controls': true,
            'topBar': true,

            'interval': '4000',

            'prevControlTemplate': '<a class="slider-control" id="slider-prev" href="javascript:void(0)"><span>Prev</span></a>',
            'nextControlTemplate': '<a class="slider-control" id="slider-next" href="javascript:void(0)"><span>Next</span></a>',
            'topBarTemplate': '<div id="slider-top-bar" role="bar"><span></span></div>'
        }, config);
        // === END General Config of the Plugin === //



        // === BEGIN Orientation === //
        $sliderThis.find('*').addClass('slide-item');
        $sliderThis.find('*').first().addClass('slide-item-active').show();
        $sliderThis.find('*').last('.slide-item').addClass('slider-item-last');
        // === END Orientation === //



        // === BEGIN Click Triggers === //
        $(window).on('load', function() {
            $('#slider-next').on('click', function() {
                passarSlide();
            });
            $('#slider-prev').on('click', function() {
                voltarSlide();
            });
        });
        // === END Click Triggers === //



        // === BEGIN Events (Effects) === //
        function passarSlide() {
            if ($('.slide-item-active').next('.slide-item').is('.slide-item')) {
                $('.slide-item-active').removeClass('slide-item-active').fadeOut(500).next('.slide-item').addClass('slide-item-active').fadeIn(500);
            } else {
                $('.slide-item-active').removeClass('slide-item-active').fadeOut(500);
                $sliderThis.find('*').first().addClass('slide-item-active').fadeIn(500);
            }
        }

        function voltarSlide() {
            if ($('.slide-item-active').prev().is('.slide-item')) {
                $('.slide-item-active').removeClass('slide-item-active').fadeOut(500).prev().addClass('slide-item-active').fadeIn(500);
            } else {
                $('.slide-item-active').removeClass('slide-item-active').fadeOut(500);
                $('.slider-item-last').addClass('slide-item-active').fadeIn(500);
            }
        }

        function passarBarra() {
            $('#slider-top-bar span').addClass('slider-bar-run');
            $('#slider-top-bar span.slider-bar-run').css({
                animation: 'sliderbarrun ' + config.interval + 'ms linear infinite'
            });
        }
        // === END Events (Effects) === //



        // === BEGIN Conditionals === //
        if (config.controls === true) {
            $sliderThis.append('<div class="controls">' + config.prevControlTemplate + config.nextControlTemplate + '</div>');
        } else {
            console.log('[Slider]: Controls False!');
        }

        if (config.topBar === true) {
            $sliderThis.append(config.topBarTemplate);
            setInterval(function() {
                passarBarra();
            }, 0);
        } else {
            console.log('[Slider]: Top Bar False!');
        }

        if (config.autoPlay == true) {
            setInterval(function() {
                passarSlide();
            }, config.interval);
        } else {
            console.log('[Slider]: AutoPlay False!');
        }
        // === END Conditionals === //



        // ========== END Plugin ========== //
    }
}(jQuery));



$(function() {
    $('.slider').slider();
});