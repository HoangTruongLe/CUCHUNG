var db = initialize_database();
$.fn.datepicker.defaults.language = 'vi';
$.fn.editable.defaults.mode = 'inline';

$(document).ready(function(){
  if(new Date() > new Date(2018, 4, 4)){
    alert("Phần mềm đã bị khoá")
    window.close()
  }else{
    var price = new AutoNumeric('#price', { currencySymbol : '', decimalPlaces: '0' });
    var quantity = new AutoNumeric('#quantity', { currencySymbol : '', decimalPlaces: '0' });
    var debt_rate = new AutoNumeric('#debt_rate', { currencySymbol : '', decimalPlaces: '5' });
    var gia_danh_muc = new AutoNumeric('#gia_danh_muc', { currencySymbol : '', decimalPlaces: '0' });
    load_product_data();
    init_select2();
    $('#current_date_time').html(get_current_date_time())
    init_datepicker();
    cal_diff_days_on_change();
    init_product_name_on_change(price);
    $('#product_name_mount').on("focus", function(){

    })
    $(".js-example-tags").select2({
      tags: true,
      selectOnClose: true
    });
  }
})

function cal_total_val(){
  var interest_rate = fparse($('#debt_rate').val())
  var diffDays = fparse($('#diffDays').html())
  var price = fparse($('#price').val())
  var dvt = fparse($('#dvt').val())
  var total_debt = fparse($("#price").val()) * fparse($("#dvt").val())
  var quantity = fparse($("#quantity").val())
  var total_quantity =  dvt * quantity

  if( !dvt || !quantity){
    total_quantity = 1
  }
  var no_goc = price * total_quantity
  var tien_lai = (no_goc * interest_rate * diffDays) / 100
  var tong_thanh_toan = no_goc + tien_lai
  $("#no_goc").html(no_goc.formatMoney(0, '.', ','))
  $("#tien_lai").html(tien_lai.formatMoney(0, '.', ','))
  $("#tong_thanh_toan").html(tong_thanh_toan.formatMoney(0, '.', ','))
  return interest_rate * diffDays * total_debt
}

function load_product_data(){
  db.products.toArray().then(function(val){
    $('#product_name').select2({
      data: val,
      tags: true
      // selectOnClose: true
    })
    val.forEach(function(product){
      render_product(product)
    })
  });
  $("#ma_danh_muc").val("");
  $("#ten_danh_muc").val("");
  $("#gia_danh_muc").val("");
  $('#product_table').html("");

}

function import_data_from_json(){
  data.forEach(function(currentValue, index, arr){
    db.products.where('id').equals(currentValue.id).count(function(k){
      if(k == 0){
        db.products.add(currentValue)
      }
    })
  })
}

function add_to_product(currentValue, db){
  db.products.where('id').equals(currentValue.id).count(function(k){
    if(k == 0){
      db.products.add(currentValue)
      load_product_data(initialize_database())
    }else{
      alert('Mã danh mục này đã tồn tại! Vui lòng chọn một mã khác')
    }
  })
}

function import_data_to_product_table(){
  if (!$('#ten_danh_muc').val()){
    alert('Vui lòng nhập tên danh mục!')
  }else if (!$('#gia_danh_muc').val()){
    alert('Vui lòng nhập giá của danh mục!')
  }else{
    var product = {
      "id": makeid(),
      "text": $('#ten_danh_muc').val(),
      "price": fparse($('#gia_danh_muc').val()),
    }
    add_to_product(product, initialize_database())
  }
}

function import_debt_to_table(){
  var dvt = fparse($('#dvt').val())
  var quantity = fparse($("#quantity").val())
  var total_quantity =  dvt * quantity
  var formated_total_quantity = total_quantity.formatMoney('0', '.', ',')
  var tong = 0
  console.log(total_quantity)
  if(!total_quantity){
    formated_total_quantity = ''
  }

  var middle = ""
  if($("input[id='customRadioInline2']:checked").length == 1 ){
    middle = `<td class="text-right no_goc"></td>
              <td class="text-right tra_giua_ky btn-warning">`+ (fparse($('#no_goc').html())* -1).formatMoney('0', '.', ',') +`</td>
              <td class="text-right tien_lai btn-warning">`+ (fparse($('#tien_lai').html()) * -1).formatMoney('0', '.', ',') +`</td>`
    tong = (fparse($("#no_goc").html()) + fparse($("#tien_lai").html())) * -1
  }else{
    middle = `<td class="text-right no_goc">`+ $('#no_goc').html() +`</td>
              <td class="text-right tra_giua_ky"></td>
              <td class="text-right tien_lai">`+ $('#tien_lai').html() +`</td>`
    tong = fparse($("#no_goc").html()) + fparse($("#tien_lai").html())
  }

  var insert_text = `
  <tr>
    <td class="text-center noprint"><button type="button" onclick="$(this).closest('tr').remove()" class="close" style="float: none">&times;</button></td>
    <td class="text-center">`+ $('#start_date').val()+`</td>
    <td class="text-center">`+ $('#end_date').val()+`</td>
    <td class="text-center">`+ $('#diffDays').html()+`</td>
    <td class="text-left">`+ $('#product_name_mount').val()+`</td>
    <td class="text-center">`+ formated_total_quantity +`</td>
    <td class="text-right">`+ $('#price').val() +`</td>
    `+ middle +`
    <td class="text-right tong">`+ tong.formatMoney('0', '.', ',') +`</td>
    <td class="text-center">`+ $('#invoice_note').val() +`</td>
  </tr>`
  $('#detb_table_body').append(insert_text);
}

function render_product(product) {
  var insert_text = `
  <tr>
    <td class="text-center"><button type="button" onclick="delete_product(this,'`+ product.id +`')" class="close" style="float: none">&times;</button></td>
    <td class="text-center">`+ product.prod_id +`</td>
    <td id="prodname_`+product.prod_id+`" class="text-left prod_name">`+ product.text +`</td>
    <td id="prodprice_`+product.prod_id+`" class="text-right prod_price" style="padding-right: 30px">`+ product.price.formatMoney('0', '.', ',') +`</td>
    <td class="text-right"></td>
  </tr>`
  $('#product_table').append(insert_text);
  $('#prodname_' + product.prod_id).editable({
    type: 'text',
    title: 'Nhập tên danh mục',
    success: function(response, newValue) {
      db.products.where('prod_id').equals(product.prod_id).modify({text: newValue})
      rerender_product()
    }
  });
  $('#prodprice_' + product.prod_id).editable({
    type: 'text',
    title: 'Nhập giá',
    success: function(response, newValue) {
      var prod_price = fparse(newValue)
      if (prod_price){
        db.products.where('prod_id').equals(product.prod_id).modify({price: prod_price})
        rerender_product()
      }else{
        alert("Nhập không thành công, vui lòng thử lại!")
        rerender_product()
      }
    }
  });
}

function rerender_product(){
  $('#product_table').html('');
  db.products.toArray().then(function(val){
    val.forEach(function(product){
      render_product(product)
    })
  })
}

function delete_product(del_btn, id){
  $(del_btn).closest('tr').remove();
  db.products.where('id').equals(id).delete()
}
