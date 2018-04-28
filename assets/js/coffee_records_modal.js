function get_coffee_records(){
  $('#coffee_rec_table').html("");
  db.customers.toArray().then(function(cus){
    cus.forEach(function(val){
      db.coffee_records.where('cus_id').equals(val.id).each(function(record){
        render_coffee_records(record)
      })
    })
  })
}

function render_coffee_records(record){
  var row = `<tr>
              <td class="text-center"><button style="float: none" class="close" onclick="delete_coffee_row(this,`+ record.rec_id +`)" >&times;</button></td>
              <td onclick="select_coffee_row(`+ record.rec_id +`)" class="text-center btn-info btn-debt" ><span>Xem</span></td>
              <td class="text-center" ><span class="">`+ record.rec_id +`</span></td>
              <td class="text-left" ><span class="debt_rec_customer" id=''>`+ record.cus_name +`</span></td>
              <td class="text-center" ><span class="text-success debt_rec_ngay_tinh" id=''>`+ record.end_date +`</span></td>
              <td class="text-right" ><span class="coffee_rec_slb" id=''>`+ record.slb +`</span></td>
              <td class="text-right" ><span class="coffee_rec_thanh_tien" id=''>`+ record.thanh_tien +`</span></td>
              <td class="text-right" ><span class="coffee_rec_da_tra" id=''>`+ record.da_tra +`</span></td>
              <td class="text-right" ><span class="coffee_rec_no_con" id=''>`+ record.no_con +`</span></td>
              <td class="text-right" ><span class="coffee_rec_tong_xuat" id=''>`+ record.tong_xuat +`</span></td>
              <td class="text-right" ><span class="coffee_rec_tong_luu_kho" id=''>`+ record.tong_luu_kho +`</span></td>
            </tr>`
  $('#coffee_rec_table').append(row)
}

function init_coffee_modal_select2_customer_name(){
  db.customers.toArray().then(function(val){
    $("#coffee_modal_select2_customer_name").select2({
      tags: "true",
      placeholder: "Chọn Khách Hàng",
      allowClear: true,
      width: '100%',
      data: val,
    })
  });
  $('#coffee_modal_select2_customer_name').on('change', function (e) {
    var value = $('#coffee_modal_select2_customer_name').select2('data')
    $('#coffee_rec_table').html("")
    if (value[0].id){
      db.coffee_records.where('cus_id').equals(value[0].id).reverse().sortBy("rec_id").then(function(coffee_records){
        coffee_records.forEach(function(record){
          render_coffee_records(record)
        })
      })
    }else{
      get_coffee_records();
    }
  });
}

function select_coffee_row(rec_id){
  db.coffee_records.where('rec_id').equals(rec_id).each(function(record){
    $("#select2_customer_name_coffee").val(record.cus_id.toString()).trigger("change");
    $("#cal_customer_phone_coffee").val(record.cus_phone.toString())
    $("#cal_customer_address_coffee").val(record.cus_address.toString())
    $("#cal_rec_id_coffee").val(record.rec_id.toString())
    $("#total_coffee_tong_ban").html(record.slb.toString())
    $("#total_coffee_thanh_tien").html(record.thanh_tien.toString())
    $("#total_coffee_tra").html(record.da_tra.toString())
    $("#total_coffee_con").html(record.no_con.toString())
    $("#total_coffee_xuat").html(record.tong_xuat.toString())
    $("#total_coffee_ton").html(record.tong_luu_kho.toString())
  })
  $('#coffee_table').html("");
  db.coffee_details.where('rec_id').equals(rec_id).each(function(record){
    record.rec_id = makeid()
    append_new_coffee_line(record)
  })
  $("#top_control li>a[href='#coffee_tool']").trigger("click")
  $('#coffee_rec_modal').modal('hide');
}

function delete_coffee_row(del_btn, id){
  if (confirm("Bạn có chắc chắn muốn xoá không?")){
    $(del_btn).closest('tr').remove();
    db.coffee_records.where('rec_id').equals(id).delete()
  }
}
