function init_select2_customer_name_coffee(){
  get_customer_data_coffee()
  bind_customer_data_on_change_coffee()
  $('#coffee_table').bind('DOMSubtreeModified', function(event){
    recalculate_table()
  })
}

function get_customer_data_coffee(){
  db.customers.toArray().then(function(val){
    $("#select2_customer_name_coffee").select2({
      tags: "true",
      placeholder: "Chọn Khách Hàng",
      allowClear: true,
      width: '100%',
      data: val,
    })
  });
}

function bind_customer_data_on_change_coffee(){
  $('#select2_customer_name_coffee').on('change', function (e) {
    select2_set_customer_data_coffee();
  });
}

function select2_set_customer_data_coffee(){
  $("#cal_customer_name_coffee").val("")
  $("#cal_customer_id_coffee").val("")
  $("#cal_customer_phone_coffee").val("")
  $("#cal_customer_address_coffee").val("")
  $("#cal_customer_cus_id_coffee").val("")
  var value = $('#select2_customer_name_coffee').select2('data')
  if(value[0].text) $("#cal_customer_name_coffee").val(value[0].text)
  if(value[0].id) $("#cal_customer_cus_id_coffee").val(value[0].id)
  if(value[0].address) $("#cal_customer_address_coffee").val(value[0].address)
  if(value[0].cus_id)$("#cal_customer_id_coffee").val(value[0].cus_id)
  if(value[0].phone) $("#cal_customer_phone_coffee").val(value[0].phone)
}

function save_customer_data_coffee(){
  var phone = $('#cal_customer_phone_coffee').val()
  var address = $('#cal_customer_address_coffee').val()
  var text = $('#cal_customer_name_coffee').val()
  var cus_id = fparse($('#cal_customer_id_coffee').val())
  if(cus_id){
    if(confirm("Bạn có thực sự muốn sửa thông tin khách hàng này?")){
      var customer_val = {text: text, phone: phone, address: address}
      db.customers.where('cus_id').equals(cus_id).modify(customer_val).then(function(){
        toastr.success('Sửa thành công!')
        get_customer_data_coffee()
        db.customers.where('cus_id').equals(cus_id).toArray().then(function(result){
          $("#cal_customer_id_coffee").val(result[0].cus_id)
        })
      })
    }
  }else{
    if (text){
      var id = makeid()
      var customer_val = {text: text, phone: phone, id: id, address: address}
      add_customer(customer_val);
      get_customer_data_coffee()
      db.customers.where('id').equals(id).toArray().then(function(result){
        $("#cal_customer_id_coffee").val(result[0].cus_id)
        $("#cal_customer_cus_id_coffee").val(result[0].id)
      })
    }else{
      toastr.error('Vui lòng nhập tên khách hàng!')
    }
  }
}

function remove_coffee_row(row){
  $(row).closest('tr').remove()
  var target_el = $('#coffee_table').find("tr")[0]
  recalculate_on_coffee_row($(target_el))
  cal_remaining_quantity($(target_el))
  cal_for_total_row()
}

function append_new_coffee_line(data = null){
  var rec_id = makeid();
  var insert_text = ''
  if(!data){
    insert_text = `
    <tr>
      <td class="text-center noprint"><button type="button" onclick="remove_coffee_row(this)" class="close" style="float: none">&times;</button></td>
      <td class="text-center"><span class="coffee_start_date" id="cal_coffee_start_date_`+ rec_id +`">`+ get_current_date() +`</span></td>
      <td class="text-right"><span class="num_editable coffee_so_luong_ban" id="cal_coffee_so_luong_ban_`+ rec_id +`">0</span></td>
      <td class="text-right"><span class="num_editable coffee_gia" id="cal_coffee_gia_`+ rec_id +`">0</span></td>
      <td class="text-right"><span class="coffee_thanh_tien" id="cal_coffee_thanh_tien_`+ rec_id +`">0</span></td>
      <td class="text-right"><span class="num_editable coffee_tra" id="cal_coffee_tra_`+ rec_id +`">0</span></td>
      <td class="text-right"><span class="coffee_con" id="cal_coffee_con_`+ rec_id +`">0</span></td>
      <td class="text-right"><span class="num_editable coffee_xuat" id="cal_coffee_xuat_`+ rec_id +`">0</span></td>
      <td class="text-right"><span class="coffee_ton" id="cal_coffee_ton_`+ rec_id +`">0</span></td>
      <td class="text-left note"><span class="coffee_ghi_chu" id="cal_coffee_ghi_chu_`+ rec_id +`"></span></td>
    </tr>`
  }else {
    insert_text = `
    <tr>
      <td class="text-center noprint"><button type="button" onclick="remove_coffee_row(this)" class="close" style="float: none">&times;</button></td>
      <td class="text-center"><span class="coffee_start_date" id="cal_coffee_start_date_`+ rec_id +`">`+ data.ngay_ghi +`</span></td>
      <td class="text-right"><span class="num_editable coffee_so_luong_ban" id="cal_coffee_so_luong_ban_`+ rec_id +`">`+ data.slb.formatMoney('0', '.', ',') +`</span></td>
      <td class="text-right"><span class="num_editable coffee_gia" id="cal_coffee_gia_`+ rec_id +`">`+ data.price.formatMoney('0', '.', ',') +`</span></td>
      <td class="text-right"><span class="coffee_thanh_tien" id="cal_coffee_thanh_tien_`+ rec_id +`">`+ data.thanh_tien.formatMoney('0', '.', ',') +`</span></td>
      <td class="text-right"><span class="num_editable coffee_tra" id="cal_coffee_tra_`+ rec_id +`">`+ data.da_tra.formatMoney('0', '.', ',') +`</span></td>
      <td class="text-right"><span class="coffee_con" id="cal_coffee_con_`+ rec_id +`">`+ data.no_con.formatMoney('0', '.', ',') +`</span></td>
      <td class="text-right"><span class="num_editable coffee_xuat" id="cal_coffee_xuat_`+ rec_id +`">`+ data.xuat.formatMoney('0', '.', ',') +`</span></td>
      <td class="text-right"><span class="coffee_ton" id="cal_coffee_ton_`+ rec_id +`">`+ data.luu_kho.formatMoney('0', '.', ',') +`</span></td>
      <td class="text-left note"><span class="coffee_ghi_chu" id="cal_coffee_ghi_chu_`+ rec_id +`">`+ data.ghi_chu +`</span></td>
    </tr>`
  }
  $('#coffee_table').append(insert_text)
  init_cal_tool_date_editable($('#cal_coffee_start_date_' + rec_id))
  init_number_editable($('#cal_tool_price_'+ rec_id))
  init_number_editable($('#cal_coffee_so_luong_ban_'+ rec_id))
  init_number_editable($('#cal_coffee_gia_'+ rec_id))
  init_number_editable($('#cal_coffee_tra_'+ rec_id))
  init_number_editable($('#cal_coffee_xuat_'+ rec_id))
  init_cal_tool_note_editable($('#cal_coffee_ghi_chu_'+ rec_id))
}

function append_to_total(el){
  var total_price = fparse(el.find('.coffee_so_luong_ban').html()) * fparse(el.find('.coffee_gia').html())
  el.find('.coffee_thanh_tien').html(total_price.formatMoney('0', '.', ','))
}

function recalculate_on_coffee_row(el){
  if (el.find('.coffee_thanh_tien').length > 0 || el.find('.coffee_tra').length >0 ){
    var thanh_tien = get_prev_val(el, '.coffee_thanh_tien')
    var tra = get_prev_val(el, '.coffee_tra')
    if(fparse(el.find('.coffee_thanh_tien').html()) > 0 || fparse(el.find('.coffee_tra').html()) ){
      el.find('.coffee_con').html((thanh_tien - tra).formatMoney('0', '.', ','))
    }else {
      el.find('.coffee_con').html('0')
    }
  }
}

function calculate_total_money(previous_remaining, quantity, price, pay){
  var data = {
    quantity: quantity,
    price: price,
    total: quantity * price,
    pay: pay,
    remaining: previous_remaining + (quantity * price) - pay
  }
  return data 
}

function cal_remaining_quantity(el){
  if (el.find('.coffee_so_luong_ban').length > 0 || el.find('.coffee_xuat').length >0 ){
    var sold_units = get_prev_val(el, '.coffee_so_luong_ban')
    var import_units = get_prev_val(el, '.coffee_xuat')
    if(fparse(el.find('.coffee_xuat').html()) > 0 || fparse(el.find('.coffee_so_luong_ban').html()) ){
      el.find('.coffee_ton').html((import_units - sold_units).formatMoney('0', '.', ','))
    }else {
      el.find('.coffee_ton').html('0')
    }
  }
}

function trigger_next_row_change(el, child_class){
  if(el.next().find(child_class).length > 0){
    el.next().find(child_class).trigger("DOMSubtreeModified")
    get_prev_val(el.next())
  }
}

function get_prev_val(el, child_class, val = 0){
  if(el.find(child_class).length > 0){
    val += fparse(el.find(child_class).html())
    return get_prev_val(el.prev(), child_class, val)
  }else{
    return val
  }
}

function cal_for_total_row(){
  var tong_luong_ban = 0
  var tong_tra = 0
  var tong_xuat = 0
  var tong_thanh_tien = 0
  $('#coffee_table > tr').each(function(){
    tong_luong_ban += fparse($(this).find('.coffee_so_luong_ban').html())
    tong_thanh_tien += fparse($(this).find('.coffee_thanh_tien').html())
    tong_tra += fparse($(this).find('.coffee_tra').html())
    tong_xuat += fparse($(this).find('.coffee_xuat').html())
    $('#total_coffee_tong_ban').html(tong_luong_ban.formatMoney(0, '.', ','))
    $('#total_coffee_thanh_tien').html(tong_thanh_tien.formatMoney(0, '.', ','))
    $('#total_coffee_tra').html(tong_tra.formatMoney(0, '.', ','))
    $('#total_coffee_con').html((tong_thanh_tien - tong_tra).formatMoney(0, '.', ','))
    $('#total_coffee_xuat').html(tong_xuat.formatMoney(0, '.', ','))
    $('#total_coffee_ton').html((tong_xuat - tong_luong_ban).formatMoney(0, '.', ','))
  })
}

function recalculate_table(){
  $('#coffee_table').unbind('DOMSubtreeModified')
  $('#coffee_table > tr').each(function(idex, row_element){
    append_to_total($(row_element))
    recalculate_on_coffee_row($(row_element))
    cal_remaining_quantity($(row_element))
  })
  cal_for_total_row()
  $('#coffee_table').bind('DOMSubtreeModified', function(event){
    recalculate_table()
  })
}
