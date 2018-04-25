
function save_calculated_data(){
  var cus_id = $("#cal_customer_cus_id").val()
  var rec_id = fparse($("#cal_rec_id").val())
  var record = {
    rec_id: fparse($("#cal_rec_id").val()),
    cus_id: cus_id,
    cus_name: $("#cal_customer_name").val(),
    cus_phone: $("#cal_customer_phone").val(),
    cus_address: $("#cal_customer_address").val(),
    tong_goc: $("#td_tong_goc").html(),
    tong_tra: $("#td_tong_tra").html(),
    tong_lai: $("#td_tong_lai").html(),
    tong_no_cuoi_ky: $("#td_tong_thanhtoan").html (),
    end_date: get_current_date_time().split("Ngày Xuất báo cáo: ")[1].split(", lúc: ")[0],
    text: get_current_date_time().replace("Ngày Xuất báo cáo: ", "").replace(", lúc: "," - "),
    rec_type: 1
  }

  db.customers.where('id').equals(cus_id).count(function(k){
    if(k == 1){
      db.records.where('rec_id').equals(rec_id).count(function(k){
        if(k == 1){
          if(confirm("Bạn có thực sự muốn sửa bản ghi này không?")){
            db.records.where('rec_id').equals(rec_id).modify(record).then(function(){
              save_debt_details(rec_id)
              get_debt_records();
              toastr.success('Sửa thành công!')
            })
          }
        }else{
          record.id = makeid();
          delete record["rec_id"]
          db.records.add(record).then(function(k){
            $("#cal_rec_id").val(k)
            save_debt_details(k)
            get_debt_records();
            toastr.success('Thêm thành công')
          })
        }
      })
    }else{
      toastr.error('Thêm hoặc chọn một khách hàng trước khi lưu!')
    }
  })
}

function save_debt_details(rec_id){
  db.details.where('rec_id').equals(rec_id).delete()
  $('#detb_table_body > tr').each(function(){
    var debt_rec = {
      isPay: JSON.parse($(this).find('.tool_is_pay').html()),
      start_date: $(this).find('.tool_start_date').html(),
      end_date: $(this).find('.tool_end_date').html(),
      diffDays: $(this).find('.tool_diff_date').html(),
      name: $(this).find('.tool_prod_name').html(),
      price: fparse($(this).find('.tool_price').html()),
      quantity: fparse($(this).find('.tool_quantity').html()),
      total_quantity: fparse($(this).find('.tool_total_quantity').html()),
      note: $(this).find('.tool_note').html(),
      dvt: fparse($(this).find('.tool_dvt').html()),
      interest_rate: fparse($(this).find('.tool_interest_rate').html()),
      rec_id: rec_id,
      tong: fparse($(this).find('.tool_total').html()),
      no_goc: fparse($(this).find('.no_goc').html()),
      tien_lai: fparse($(this).find('.tien_lai').html()),
      tra_giua_ky: fparse($(this).find('.tra_giua_ky').html()),
      id: makeid(),
    }
    db.details.add(debt_rec)
  })
}
