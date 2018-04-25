
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
    note: $('#invoice_note').val(),
    interest_rate: fparse($('#cal_product_debt_rate').val()),
    isPay: isPay()
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
  var total_quantity = data.quantity * data.dvt
  var formated_total_quantity = total_quantity.formatMoney('0', '.', ',')
  var tong = data.no_goc + data.tien_lai
  if(!total_quantity){
    formated_total_quantity = ''
  }

  var middle = ""
  if(data.isPay){
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
    <td class="text-center"><span class="tool_diff_date" id="cal_tool_diff_date_`+ data.rec_id +`">`+ data.diffDays +`</span></td>
    <td class="text-left tool_prod_name">`+ data.name +`</td>
    <td class="text-center"><span class="tool_total_quantity" id="cal_tool_total_quantity_`+ data.rec_id +`">`+ formated_total_quantity +`</span></td>
    <td class="text-right"><span class="tool_price" id="cal_tool_price_`+ data.rec_id +`">`+ data.price.formatMoney('0', '.', ',') +`</span></td>
    `+ middle +`
    <td class="text-right tong"><span class="tool_total">`+ tong.formatMoney('0', '.', ',') +`</span></td>
    <td class="text-center note"><span class="tool_note" id="cal_tool_note_`+ data.rec_id +`">`+ data.note +`</span></td>
    <td class="text-center note hidden"><span id="cal_tool_interest_date_`+ data.rec_id +`" class="tool_interest_rate">`+ data.interest_rate +`</span></td>
    <td class="text-center note hidden"><span id="cal_tool_is_pay_`+ data.rec_id +`" class="tool_is_pay">`+ data.isPay +`</span></td>
    <td class="text-center note hidden"><span id="cal_tool_quantity_`+ data.rec_id +`" class="tool_quantity">`+ data.quantity +`</span></td>
    <td class="text-center note hidden"><span id="cal_tool_dvt_`+ data.rec_id +`" class="tool_dvt">`+ data.dvt +`</span></td>
  </tr>`
  $('#detb_table_body').append(insert_text);
  init_cal_tool_date_editable($('#cal_tool_start_date_' + data.rec_id))
  init_cal_tool_date_editable($('#cal_tool_end_date_' + data.rec_id))
  init_number_editable($('#cal_tool_price_'+ data.rec_id))
  init_number_editable($('#cal_tool_total_quantity_'+ data.rec_id))
  init_cal_tool_note_editable($('#cal_tool_note_'+ data.rec_id))
  init_observers(data);
}

function init_observers(data){
  $('#cal_tool_start_date_'+ data.rec_id).bind('DOMSubtreeModified', function(){
    var diffdays = cal_diff_days($(this).html(), $(this).closest("tr").find(".tool_end_date").html())
    $(this).closest("tr").find('.tool_diff_date').html(diffdays)
  })
  $('#cal_tool_end_date_'+ data.rec_id).bind('DOMSubtreeModified', function(){
    var diffdays = cal_diff_days($(this).closest("tr").find(".tool_start_date").html(), $(this).html())
    $(this).closest("tr").find('.tool_diff_date').html(diffdays)
  })
  $('#cal_tool_total_quantity_'+ data.rec_id).bind('DOMSubtreeModified', function(){
    recalculate_on_row(this)
  })
  $('#cal_tool_price_'+ data.rec_id).bind('DOMSubtreeModified', function(){
    recalculate_on_row(this)
  })
  $('#cal_tool_diff_date_'+ data.rec_id).bind('DOMSubtreeModified', function(){
    recalculate_on_row(this)
  })
}

function recalculate_on_row(row){
  var result = get_total_result(
    fparse($(row).closest("tr").find('.tool_interest_rate').html()),
    fparse($(row).closest("tr").find('.tool_diff_date').html()),
    fparse($(row).closest("tr").find('.tool_price').html()),
    1,
    fparse($(row).closest("tr").find(".tool_total_quantity").html())
  )
  if ($(row).closest("tr").find(".tool_is_pay").html() == 'true'){
    $(row).closest("tr").find('.tra_giua_ky').html((-1*result.no_goc).formatMoney('0', '.', ','))
    $(row).closest("tr").find('.tien_lai').html((-1*result.tien_lai).formatMoney('0', '.', ','))
    $(row).closest("tr").find('.tool_total').html((-1*result.tong_thanh_toan).formatMoney('0', '.', ','))
  }else{
    $(row).closest("tr").find('.no_goc').html(result.no_goc.formatMoney('0', '.', ','))
    $(row).closest("tr").find('.tien_lai').html(result.tien_lai.formatMoney('0', '.', ','))
    $(row).closest("tr").find('.tool_total').html(result.tong_thanh_toan.formatMoney('0', '.', ','))
  }
}
