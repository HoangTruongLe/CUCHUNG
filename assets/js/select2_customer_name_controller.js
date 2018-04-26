function init_select2_customer_name(){
  get_customer_data()
  bind_customer_data_on_change()
}

function get_customer_data(){
  db.customers.toArray().then(function(val){
    $("#select2_customer_name").select2({
      tags: "true",
      placeholder: "Chọn Khách Hàng",
      allowClear: true,
      width: '100%',
      // selectOnClose: true,
      data: val,
    })
  });
}


function bind_customer_data_on_change(){
  $('#select2_customer_name').on('select2:select', function (e) {
    select2_set_customer_data();
  });
  $('#select2_customer_name').on('change', function (e) {
    select2_set_customer_data();
  });
}

function select2_set_customer_data(){
  $("#cal_customer_name").val("")
  $("#cal_customer_id").val("")
  $("#cal_customer_phone").val("")
  $("#cal_customer_address").val("")
  $("#cal_customer_cus_id").val("")
  var value = $('#select2_customer_name').select2('data')
  if(value[0].text) $("#cal_customer_name").val(value[0].text)
  if(value[0].id) $("#cal_customer_cus_id").val(value[0].id)
  if(value[0].address) $("#cal_customer_address").val(value[0].address)
  if(value[0].cus_id)$("#cal_customer_id").val(value[0].cus_id)
  if(value[0].phone) $("#cal_customer_phone").val(value[0].phone)
}

function save_customer_data(){
  var phone = $('#cal_customer_phone').val()
  var address = $('#cal_customer_address').val()
  var text = $('#cal_customer_name').val()
  var cus_id = fparse($('#cal_customer_id').val())
  if(cus_id){
    if(confirm("Bạn có thực sự muốn sửa thông tin khách hàng này?")){
      var customer_val = {text: text, phone: phone, address: address}
      db.customers.where('cus_id').equals(cus_id).modify(customer_val).then(function(){
        toastr.success('Sửa thành công!')
        get_customer_data()
        db.customers.where('cus_id').equals(cus_id).toArray().then(function(result){
          $("#cal_customer_id").val(result[0].cus_id)
        })
      })
    }
  }else{
    if (text){
      var id = makeid()
      var customer_val = {text: text, phone: phone, id: id, address: address}
      add_customer(customer_val);
      get_customer_data()
      db.customers.where('id').equals(id).toArray().then(function(result){
        $("#cal_customer_id").val(result[0].cus_id)
        $("#cal_customer_cus_id").val(result[0].id)
      })
    }else{
      toastr.error('Vui lòng nhập tên khách hàng!')
    }
  }
}
