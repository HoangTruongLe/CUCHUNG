function init_modal_select2_customer_name(){
  db.customers.toArray().then(function(val){
    $("#modal_select2_customer_name").select2({
      tags: "true",
      placeholder: "Chọn Khách Hàng",
      allowClear: true,
      width: '100%',
      data: val,
    })
  });
  $('#modal_select2_customer_name').on('change', function (e) {
    var value = $('#modal_select2_customer_name').select2('data')
    $('#debt_rec_table').html("")
    if (value[0].id){
      db.records.where('cus_id').equals(value[0].id).reverse().sortBy("rec_id").then(function(records){
        records.forEach(function(record){
          render_debt_record(record)
        })
      })
    }
  });
  get_debt_records();
}

function render_debt_record(record){
  var row = `<tr>
              <td onclick="select_debt_row(`+ record.rec_id +`)" class="text-center btn-info btn-debt" ><span>Xem</span></td>
              <td class="text-center" ><span class="">`+ record.rec_id +`</span></td>
              <td class="text-left" ><span class="debt_rec_customer" id=''>`+ record.cus_name +`</span></td>
              <td class="text-center" ><span class="text-success debt_rec_ngay_tinh" id=''>`+ record.end_date +`</span></td>
              <td class="text-right" ><span class="debt_rec_tong_no" id=''>`+ record.tong_goc +`</span></td>
              <td class="text-right" ><span class="debt_rec_tong_tra" id=''>`+ record.tong_tra +`</span></td>
              <td class="text-right" ><span class="debt_rec_tong_lai" id=''>`+ record.tong_lai +`</span></td>
              <td class="text-right" ><span class="debt_rec_tong_no_cuoi_ky" id=''>`+ record.tong_no_cuoi_ky +`</span></td>
            </tr>`
  $('#debt_rec_table').append(row)
}

function get_debt_records(){
  $('#debt_rec_table').html("");
  db.customers.toArray().then(function(cus){
    cus.forEach(function(val){
      db.records.where('cus_id').equals(val.id).each(function(record){
        render_debt_record(record)
      })
    })
  })
}

function select_debt_row(rec_id){
  db.records.where('rec_id').equals(rec_id).each(function(record){
    $("#select2_customer_name").val(record.cus_id.toString()).trigger("change");
    $("#cal_customer_phone").val(record.cus_phone.toString())
    $("#cal_customer_address").val(record.cus_address.toString())
    $("#cal_rec_id").val(record.rec_id)
    $("#td_tong_goc").html('0')
    $("#td_tong_tra").html('0')
    $("#td_tong_lai").html('0')
    $("#td_tong_thanhtoan").html('0')
    $('#cal_tool_rec_modal').modal('hide');
  })
  $('#detb_table_body').html("");
  db.details.where('rec_id').equals(rec_id).each(function(record){
    record.rec_id = makeid()
    render_to_cal_table(record)
  })
}
