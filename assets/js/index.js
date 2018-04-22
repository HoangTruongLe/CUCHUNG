moment.locale('vi');
var db = initialize_database();
$.fn.datepicker.defaults.language = 'vi';
$.fn.editable.defaults.mode = 'inline';
$.fn.combodate.defaults.maxYear = 2050;
$.fn.combodate.defaults.minYear = 1990;
$(document).ready(function(){
  if(new Date() > new Date(2018, 4, 4)){
    alert("Phần mềm đã bị khoá")
    window.close()
  }else{
    var quantity = new AutoNumeric('#cal_product_quantity', { currencySymbol : '', decimalPlaces: '0' });
    var gia_danh_muc = new AutoNumeric('#tab_prod_price', { currencySymbol : '', decimalPlaces: '0' });
    load_product_data();
    load_customer_data();
    init_select2_dvt();
    init_select2_interest_rate();
    init_select2_customer_name();
    init_select2_product_name();
    $('#current_date_time').html(get_current_date_time())
    init_datepicker();
    cal_diff_days_on_change();
    recalculate_after_dom_changed()
    
  }
})
