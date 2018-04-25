function add_product(prod_val){
  db.products.add(prod_val).then(function(){
    toastr.success('Thêm thành công')
    load_product_data()
  })
}

function get_and_import_from_prod_tab(){
  var text = $('#tab_prod_name').val()
  if (text){
    var price = fparse($('#tab_prod_price').val())
    var id = makeid()
    var prod_val = {text: text, price: price, id: id}
    add_product(prod_val);
  }else{
    toastr.error('Vui lòng nhập tên danh mục!')
  }
}

function delete_product(del_btn, id){
  if (confirm("Tất cả dữ liệu liên quan tới sản phẩm này sẽ bị xoá hết. Bạn có chắc chắn muốn xoá sản phẩm này không? ")){
    $(del_btn).closest('tr').remove();
    db.products.where('id').equals(id).delete()
  }
}

function init_product_name_editable(product){
  $('#prodname_' + product.prod_id).editable({
    type: 'text',
    success: function(response, newValue) {
      db.products.where('prod_id').equals(product.prod_id).modify({text: newValue}).then(function(){
        toastr.success('Sửa thành công!')
        load_product_data()
      })
    }
  });
}

function init_product_price_editable(product){
  $('#prodprice_' + product.prod_id).editable({
    type: 'number',
    success: function(response, newValue) {
      db.products.where('prod_id').equals(product.prod_id).modify({price: fparse(newValue)}).then(function(){
        toastr.success('Sửa thành công!')
        load_product_data()
      })
    }
  });
}

function load_product_data(){
  clear_product_inputs();
  db.products.toArray().then(function(val){
    val.forEach(function(product){
      render_product(product)
    })
  });
}

function clear_product_inputs(){
  $("#tab_prod_name").val("");
  $("#tab_prod_price").val("");
  $('#product_table').html("");
}

function render_product(product){
  var insert_text = `
  <tr>
    <td class="text-center"><button type="button" onclick="delete_product(this,'`+ product.id +`')" class="close" style="float: none">&times;</button></td>
    <td class="text-center">`+ product.prod_id +`</td>
    <td class="text-left"><span class="prod_name" id="prodname_`+product.prod_id+`">`+ product.text +`</span></td>
    <td class="text-right"><span slass="prod_price" id="prodprice_`+product.prod_id+`">`+ product.price.formatMoney('0', '.', ',') +`</span></td>
    <td></td>
  </tr>`
  $('#product_table').append(insert_text);
  init_product_name_editable(product)
  init_product_price_editable(product)
}
