function init_select2_product_name(){
  var price = new AutoNumeric('#cal_product_price', { currencySymbol : '', decimalPlaces: '0' });
  get_product_data()
  bind_product_data_on_change(price)
}

function bind_product_data_on_change(price){
  $('#select2_product_name').on('select2:select', function (e) {
    $("#cal_product_name").val("")
    $("#cal_product_id").val("")
    $("#cal_product_price").val("")
    var value = $('#select2_product_name').select2('data')
    if(value[0].text) $("#cal_product_name").val(value[0].text)
    if(value[0].prod_id)$("#cal_product_id").val(value[0].prod_id)
    if(value[0].price) price.set(value[0].price)
    cal_total_val()
  });
}

function get_product_data(){
  db.products.toArray().then(function(val){
    $("#select2_product_name").select2({
      tags: "true",
      placeholder: "Chọn Danh Mục",
      allowClear: true,
      width: '100%',
      data: val,
    })
  });
}

function save_product_data(){
  var price = fparse($('#cal_product_price').val())
  var text = $('#cal_product_name').val()
  var prod_id = fparse($('#cal_product_id').val())
  if(prod_id){
    if(confirm("Bạn có thực sự muốn sửa thông tin danh mục này?")){
      var product_val = {text: text, price: price}
      db.products.where('prod_id').equals(prod_id).modify(product_val).then(function(k){
        toastr.success('Sửa thành công!')
        get_product_data()
        db.products.where('prod_id').equals(prod_id).toArray().then(function(result){
          $("#cal_product_id").val(result[0].prod_id)
        })
      })
    }
  }else{
    if (text){
      var id = makeid()
      var product_val = {text: text, price: price, id: id}
      add_product(product_val);
      get_product_data()
      db.products.where('id').equals(id).toArray().then(function(result){
        $("#cal_product_id").val(result[0].prod_id)
      })
    }else{
      toastr.error('Vui lòng nhập tên danh mục!')
    }
  }
}
