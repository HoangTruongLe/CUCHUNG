function save_debt_record(){
  var cus_id = $("#cal_customer_cus_id").val()
  var rec_id = fparse($("#cal_rec_id").val())
  var record = {
    rec_id: rec_id,
    cus_id: cus_id,
    cus_name: $("#cal_customer_name").val(),
    cus_phone: $("#cal_customer_phone").val(),
    cus_address: $("#cal_customer_address").val(),
    tong_goc: $("#td_tong_goc").html(),
    tong_tra: $("#td_tong_tra").html(),
    tong_lai: $("#td_tong_lai").html(),
    tong_no_cuoi_ky: $("#td_tong_thanhtoan").html (),
    end_date: get_current_date_time().split(", lúc: ")[0],
    text: get_current_date_time().replace(", lúc: "," - "),
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

function save_coffee_record(){
  var cus_id = $("#cal_customer_cus_id_coffee").val()
  var rec_id = fparse($("#cal_rec_id_coffee").val())
  var record = {
    rec_id: rec_id,
    cus_id: cus_id,
    cus_name: $("#cal_customer_name_coffee").val(),
    cus_phone: $("#cal_customer_phone_coffee").val(),
    cus_address: $("#cal_customer_address_coffee").val(),
    slb: $("#total_coffee_tong_ban").html(),
    thanh_tien: $("#total_coffee_thanh_tien").html(),
    da_tra: $("#total_coffee_tra").html(),
    no_con: $("#total_coffee_con").html (),
    tong_xuat: $("#total_coffee_xuat").html (),
    tong_luu_kho: $("#total_coffee_ton").html (),
    end_date: get_current_date_time().split(", lúc: ")[0],
    text: get_current_date_time().replace(", lúc: "," - "),
  }
  db.customers.where('id').equals(cus_id).count(function(k){
    if(k == 1){
      db.coffee_records.where('rec_id').equals(rec_id).count(function(k){
        if(k == 1){
          if(confirm("Bạn có thực sự muốn sửa bản ghi này không?")){
            db.coffee_records.where('rec_id').equals(rec_id).modify(record).then(function(){
              save_coffee_details(rec_id)
              get_coffee_records();
              toastr.success('Sửa thành công!')
            })
          }
        }else{
          record.id = makeid();
          delete record["rec_id"]
          db.coffee_records.add(record).then(function(k){
            $("#cal_rec_id").val(k)
            save_coffee_details(k)
            get_coffee_records();
            toastr.success('Thêm thành công')
          })
        }
      })
    }else{
      toastr.error('Thêm hoặc chọn một khách hàng trước khi lưu!')
    }
  })
}

function save_calculated_data(){
  var active_tab = $("#top_control li>a.active").attr("href")
  if (active_tab == '#coffee_tool'){
    save_coffee_record();
  }else if (active_tab == '#cal_tool' || !active_tab) {
    save_debt_record();
  }
}

function save_debt_details(rec_id){
  db.details.where('rec_id').equals(rec_id).delete()
  $('#detb_table_body > tr').each(function(){
    var debt_rec = {
      isPay: JSON.parse($(this).find('.tool_is_pay').html()),
      start_date: $(this).find('.tool_start_date').html(),
      end_date: $(this).find('.tool_end_date').html(),
      diffDays: fparse($(this).find('.tool_diff_date').html()),
      name: $(this).find('.tool_prod_name').html(),
      price: fparse($(this).find('.tool_price').html()),
      quantity: fparse($(this).find('.tool_quantity').html()),
      total_quantity: fparse($(this).find('.tool_total_quantity').html()),
      note: reject_empty($(this).find('.tool_note').html()),
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

function save_coffee_details(rec_id){
  db.coffee_details.where('rec_id').equals(rec_id).delete()
  $('#coffee_table > tr').each(function(){
    var coffee_rec = {
      ngay_ghi: $(this).find('.coffee_start_date').html(),
      slb: fparse($(this).find('.coffee_so_luong_ban').html()),
      price: fparse($(this).find('.coffee_gia').html()),
      thanh_tien: fparse($(this).find('.coffee_thanh_tien').html()),
      da_tra: fparse($(this).find('.coffee_tra').html()),
      no_con: fparse($(this).find('.coffee_con').html()),
      xuat: fparse($(this).find('.coffee_xuat').html()),
      luu_kho: fparse($(this).find('.coffee_ton').html()),
      rec_id: rec_id,
      ghi_chu: reject_empty($(this).find('.coffee_ghi_chu').html()),
      id: makeid(),
    }
    console.log($(this).find('.coffee_ghi_chu').html())
    db.coffee_details.add(coffee_rec)
  })
}
