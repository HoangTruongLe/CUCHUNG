
function cal_total_val(){
  var result = get_total_result(
    fparse($('#cal_product_debt_rate').val()),
    fparse($('#cal_product_diffDays').html()),
    fparse($('#cal_product_price').val()),
    fparse($('#cal_product_dvt').val()),
    fparse($("#cal_product_quantity").val())
  )
  $("#no_goc").html(result.no_goc.formatMoney(0, '.', ','))
  $("#tien_lai").html(result.tien_lai.formatMoney(0, '.', ','))
  $("#tong_thanh_toan").html(result.tong_thanh_toan.formatMoney(0, '.', ','))
}

//add method
function get_total_result(interest_rate, diffDays, price, dvt, quantity){
  var total_quantity =  dvt * quantity
  if( !dvt || !quantity) total_quantity = 1
  var no_goc = price * total_quantity
  var tien_lai = (no_goc * interest_rate * diffDays) / 100
  var tong_thanh_toan = no_goc + tien_lai
  return {
    no_goc: no_goc,
    tien_lai: tien_lai,
    tong_thanh_toan: tong_thanh_toan,
    total_quantity: total_quantity
  }
}

function get_data_to_import(){
  return {
    rec_id: makeid(),
    dvt: fparse($('#cal_product_dvt').val()),
    quantity: fparse($('#cal_product_quantity').val()),
    no_goc: fparse($('#no_goc').html()),
    tien_lai: fparse($('#tien_lai').html()),
    start_date: $('#cal_product_start_date').val(),
    end_date: $('#cal_product_end_date').val(),
    diffDays:  $('#cal_product_diffDays').html(),
    name: $('#select2_product_name').select2('data')[0].text,
    price: fparse($('#cal_product_price').val()),
    note: $('#invoice_note').val()
  }
}

function import_debt_to_table(){
  var data = get_data_to_import()
  render_to_cal_table(data)
}

function init_cal_tool_date_editable(el){
  el.editable({
    type: "combodate",
    value: el.html(),
    format: "DD/MM/YYYY",
    viewformat: "DD/MM/YYYY",
  });
}

function init_number_editable(el){
  var newValue = ''
  el.editable({
    type: "number",
    success: function(response, result){
      newValue = result.toString();
    }
  });
  el.on('hidden', function(e, params) {
    el.html(fparse(newValue).formatMoney('0', '.', ',').toString())
  });
}

function init_cal_tool_note_editable(el){
  el.editable({
    type: "textarea",
  });
}

function render_to_cal_table(data){
  var formated_total_quantity = data.total_quantity.formatMoney('0', '.', ',')
  var tong = data.tong_thanh_toan
  if(!data.total_quantity){
    formated_total_quantity = ''
  }

  var middle = ""
  if($("input[id='customRadioInline2']:checked").length == 1 ){
    middle = `<td class="text-right no_goc"></td>
              <td class="text-right tra_giua_ky btn-warning">`+ (data.no_goc * -1).formatMoney('0', '.', ',') +`</td>
              <td class="text-right tien_lai btn-warning">`+ (data.tien_lai * -1).formatMoney('0', '.', ',') +`</td>`
    tong = tong * -1
  }else{
    middle = `<td class="text-right no_goc">`+ data.no_goc.formatMoney('0', '.', ',') +`</td>
              <td class="text-right tra_giua_ky"></td>
              <td class="text-right tien_lai">`+ data.tien_lai.formatMoney('0', '.', ',') +`</td>`
  }

  var insert_text = `
  <tr>
    <td class="text-center noprint"><button type="button" onclick="$(this).closest('tr').remove()" class="close" style="float: none">&times;</button></td>
    <td class="text-center"><span class="tool_start_date" id="cal_tool_start_date_`+ data.rec_id +`">`+ data.start_date +`</span></td>
    <td class="text-center"><span class="tool_end_date" id="cal_tool_end_date_`+ data.rec_id +`">`+ data.end_date +`</span></td>
    <td class="text-center"><span class="tool_diff_date">`+ data.diffDays +`</span></td>
    <td class="text-left">`+ data.name +`</td>
    <td class="text-center"><span class="tool_quantity" id="cal_tool_quantity_`+ data.rec_id +`">`+ formated_total_quantity +`</span></td>
    <td class="text-right"><span class="tool_price" id="cal_tool_price_`+ data.rec_id +`">`+ data.price.formatMoney('0', '.', ',') +`</span></td>
    `+ middle +`
    <td class="text-right tong"><span class="tool_total">`+ tong.formatMoney('0', '.', ',') +`</span></td>
    <td class="text-center note"><span id="cal_tool_note_`+ data.rec_id +`">`+ data.note +`</span></td>
  </tr>`
  $('#detb_table_body').append(insert_text);
  init_cal_tool_date_editable($('#cal_tool_start_date_' + data.rec_id))
  init_cal_tool_date_editable($('#cal_tool_end_date_' + data.rec_id))
  init_number_editable($('#cal_tool_price_'+ data.rec_id))
  init_number_editable($('#cal_tool_quantity_'+ data.rec_id))
  init_cal_tool_note_editable($('#cal_tool_note_'+ data.rec_id))
  date_observer();
  quantity_observer();
}

function date_observer(){
  $('.tool_start_date').bind('DOMSubtreeModified', function(){
    var diffdays = cal_diff_days($(".tool_start_date").html(), $(".tool_end_date").html())
    $(this).closest("tr").find('.tool_diff_date').html(diffdays)
  })
  $('.tool_end_date').bind('DOMSubtreeModified', function(){
    var diffdays = cal_diff_days($(".tool_start_date").html(), $(".tool_end_date").html())
    $(this).closest("tr").find('.tool_diff_date').html(diffdays)
  })
}

function quantity_observer(){
  $('.tool_quantity').bind('DOMSubtreeModified', function(){

  })
}
