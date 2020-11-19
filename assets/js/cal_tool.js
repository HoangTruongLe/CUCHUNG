
function cal_total_val(){
  var result = get_total_result(
    fparse($('#cal_product_debt_rate').select2('data')[0].text),
    fparse($('#cal_product_diffDays').html()),
    fparse($('#cal_product_price').val()),
    fparse($("#cal_product_quantity").val())
  )
  $("#no_goc").html(result.no_goc.formatMoney(0, '.', ','))
  $("#tien_lai").html(result.tien_lai.formatMoney(0, '.', ','))
  $("#tong_thanh_toan").html(result.tong_thanh_toan.formatMoney(0, '.', ','))
}

function get_data_to_import(){
  return {
    rec_id: makeid(),
    dvt: $('#cal_product_dvt').select2('data')[0].text,
    quantity: fparse($('#cal_product_quantity').val()),
    no_goc: fparse($('#no_goc').html()),
    tien_lai: fparse($('#tien_lai').html()),
    import_date: $('#cal_product_import_date').val(),
    start_date: $('#cal_product_start_date').val(),
    end_date: $('#cal_product_end_date').val(),
    diffDays:  $('#cal_product_diffDays').html(),
    name: $('#select2_product_name').select2('data')[0].text,
    price: fparse($('#cal_product_price').val()),
    note: $('#invoice_note').val(),
    interest_rate: fparse($('#cal_product_debt_rate').select2('data')[0].text),
    isPay: isPay()
  }
}

function import_debt_to_table(){
  var data = get_data_to_import()
  render_to_cal_table(data)
}

function render_to_cal_table(data){
  var formated_quantity = data.quantity.formatMoney('0', '.', ',')
  var tong = data.no_goc + data.tien_lai
  if(!data.quantity){
    formated_quantity = ''
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
    <td class="text-center"><span class="tool_import_date" id="cal_tool_import_date_`+ data.rec_id +`">`+ data.import_date +`</span></td>
    <td class="text-center"><span class="tool_start_date" id="cal_tool_start_date_`+ data.rec_id +`">`+ data.start_date +`</span></td>
    <td class="text-center"><span class="tool_end_date" id="cal_tool_end_date_`+ data.rec_id +`">`+ data.end_date +`</span></td>
    <td class="text-center"><span class="tool_diff_date" id="cal_tool_diff_date_`+ data.rec_id +`">`+ data.diffDays +`</span></td>
    <td class="text-center note"><span class="tool_prod_name" id="cal_tool_name_`+ data.rec_id +`">`+ data.name +`</span></td>
    <td class="text-center"><span class="num_editable tool_quantity" id="cal_tool_quantity_`+ data.rec_id +`">`+ formated_quantity +`</span></td>
    <td class="text-center"><span id="cal_tool_dvt_`+ data.rec_id +`" class="tool_dvt">`+ data.dvt +`</span></td>
    <td class="text-right"><span class="num_editable tool_price" id="cal_tool_price_`+ data.rec_id +`">`+ data.price.formatMoney('0', '.', ',') +`</span></td>
    <td class="text-right"><span id="cal_tool_interest_rate_`+ data.rec_id +`" class="num_editable tool_interest_rate">`+ data.interest_rate +`</span>%</td>
    `+ middle +`
    <td class="text-right tong"><span class="tool_total">`+ tong.formatMoney('0', '.', ',') +`</span></td>
    <td class="text-center note"><span class="tool_note" id="cal_tool_note_`+ data.rec_id +`">`+ data.note +`</span></td>
    <td class="text-center note hidden"><span id="cal_tool_is_pay_`+ data.rec_id +`" class="tool_is_pay">`+ data.isPay +`</span></td>
    <td class="text-center note hidden"><span id="cal_tool_quantity_`+ data.rec_id +`" class="tool_quantity">`+ data.quantity +`</span></td>
  </tr>`
  $('#detb_table_body').append(insert_text);
  init_cal_tool_date_editable($('#cal_tool_import_date_' + data.rec_id))
  init_cal_tool_date_editable($('#cal_tool_start_date_' + data.rec_id))
  init_cal_tool_date_editable($('#cal_tool_end_date_' + data.rec_id))
  init_number_editable($('#cal_tool_price_'+ data.rec_id))
  init_number_editable($('#cal_tool_quantity_'+ data.rec_id))
  init_number_editable($('#cal_tool_interest_rate_'+ data.rec_id))
  init_cal_tool_note_editable($('#cal_tool_note_'+ data.rec_id))
  init_cal_tool_note_editable($('#cal_tool_dvt_'+ data.rec_id))
  init_cal_tool_note_editable($('#cal_tool_name_'+ data.rec_id))
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
  $('#cal_tool_quantity_'+ data.rec_id).bind('DOMSubtreeModified', function(){
    recalculate_on_row(this)
  })
  $('#cal_tool_price_'+ data.rec_id).bind('DOMSubtreeModified', function(){
    recalculate_on_row(this)
  })
  $('#cal_tool_interest_rate_'+ data.rec_id).bind('DOMSubtreeModified', function(){
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
    fparse($(row).closest("tr").find(".tool_quantity").html())
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

function set_current_date(){
  $('#detb_table_body > tr').each(function(){
    $(this).find('.tool_end_date').html(get_current_date())
  })
}
