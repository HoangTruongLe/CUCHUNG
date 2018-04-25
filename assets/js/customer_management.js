function add_customer(cus_val){
  db.customers.add(cus_val).then(function(){
    toastr.success('Thêm thành công!')
    load_customer_data()
  })
}

function get_and_import_from_cus_tab(){
  var text = $('#tab_cus_name').val()
  if (text){
    var phone = $('#tab_cus_phone').val()
    var address = $('#tab_cus_address').val()
    var id = makeid()
    var cus_val = {text: text, phone: phone.toString(), address: address.toString(), id: id}
    add_customer(cus_val);
  }else{
    toastr.error('Vui lòng nhập tên khách hàng!')
  }
}

function delete_customer(del_btn, id){
  if (confirm("Tất cả dữ liệu liên quan tới khách hàng này sẽ bị xoá hết. Bạn có chắc chắn muốn xoá khách hàng này không? ")){
    $(del_btn).closest('tr').remove();
    db.customers.where('id').equals(id).delete()
  }
}

function init_customer_name_editable(customer){
  $('#cusname_' + customer.cus_id).editable({
    type: 'text',
    success: function(response, newValue) {
      db.customers.where('cus_id').equals(customer.cus_id).modify({text: newValue}).then(function(){
        toastr.success('Sửa thành công!')
        load_customer_data()
      })
    }
  });
}

function init_customer_phone_editable(customer){
  $('#cusphone_' + customer.cus_id).editable({
    type: 'text',
    success: function(response, newValue) {
      db.customers.where('cus_id').equals(customer.cus_id).modify({phone: newValue}).then(function(){
        toastr.success('Sửa thành công!')
        load_customer_data()
      })
    }
  });
}

function init_customer_address_editable(customer){
  $('#cusaddress_' + customer.cus_id).editable({
    type: 'text',
    success: function(response, newValue) {
      db.customers.where('cus_id').equals(customer.cus_id).modify({address: newValue}).then(function(){
        toastr.success('Sửa thành công!')
        load_customer_data()
      })
    }
  });
}

function load_customer_data(){
  clear_customer_inputs();
  db.customers.toArray().then(function(val){
    val.forEach(function(customer){
      render_customer(customer)
    })
  });
}

function clear_customer_inputs(){
  $("#tab_cus_name").val("");
  $("#tab_cus_phone").val("");
  $("#tab_cus_address").val("");
  $('#customer_table').html("");
}

function render_customer(customer){
  var insert_text = `
  <tr>
    <td class="text-center"><button type="button" onclick="delete_customer(this,'`+ customer.id +`')" class="close" style="float: none">&times;</button></td>
    <td class="text-center">`+ customer.cus_id +`</td>
    <td class="text-left"><span class="cus_name" id="cusname_`+customer.cus_id+`">`+ customer.text +`</span></td>
    <td class="text-center"><span class="cus_phone" id="cusphone_`+customer.cus_id+`">`+ customer.phone.toString() +`</span></td>
    <td class="text-right"><span class="cus_address" id="cusaddress_`+customer.cus_id+`">`+ customer.address.toString() +`</span></td>
  </tr>`
  $('#customer_table').append(insert_text);
  init_customer_name_editable(customer)
  init_customer_phone_editable(customer)
  init_customer_address_editable(customer)
}
