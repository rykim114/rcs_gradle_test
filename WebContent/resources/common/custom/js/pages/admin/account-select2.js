// Class definition
var KTAccountSelect2 = function() {
    // Private functions
    var modalDemos = function() {
        $('#kt_write_modal').on('shown.bs.modal', function () {
            // basic
            $('#kt_select2_1_modal').select2({
                placeholder: "법인명을 선택해주세요",
                allowClear: true
            });
            
        });
        $('#kt_modify_modal').on('shown.bs.modal', function () {
            // basic
            $('#kt_select2_2_modal').select2({
                placeholder: "법인명을 선택해주세요",
                allowClear: true
            });
            
        });
    }

    // Public functions
    return {
        init: function() {
            modalDemos();
        }
    };
}();

// Initialization
jQuery(document).ready(function() {
    KTAccountSelect2.init();
});
