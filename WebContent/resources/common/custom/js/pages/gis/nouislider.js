// Class definition
var KTnoUiSliderGIS = function() {


    var demo1 = function() {
        // init slider
        var slider = document.getElementById('kt_nouislider_1');

        noUiSlider.create(slider, {
            start: [2018, 2020],
            connect: true,
            step : 1,
            range: {
                'min': 2018,
                'max': 2020
            },
            pips: {
                mode: 'values',
                values: [2018, 2019, 2020],
                density: 100
            }
        });
        

    }
    
    return {
        // public functions
        init: function() {
            demo1();
        }
    };
}();

jQuery(document).ready(function() {
    KTnoUiSliderGIS.init();
});

$(document).ready(function(){
	var slider = document.getElementById('kt_nouislider_1');
   /* var pips = slider.querySelectorAll('.noUi-value');

    function clickOnPip() {
        var value = Number(slider.getAttribute('data-value'));

        slider.noUiSlider.set(value);
    }

    for (var i = 0; i < pips.length; i++) {

        // For this example. Do this in CSS!
        pips[i].style.cursor = 'pointer';
        pips[i].addEventListener('click', clickOnPip);
    }*/
	
    slider.noUiSlider.on('change', function () {

		console.log("ddddddfffd");
	});
});
