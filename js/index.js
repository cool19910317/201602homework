/**
 * Created by Administrator on 2016/4/17.
 */
// 渲染页面
function render() {
  $.ajax({
    url: '/users',
    dataType: 'json',
    type: 'GET',
    success: function (data) {
      var str = '';
      data.forEach(function (item) {
        str += '<tr class="list-item-'+item.id+'">\
        <td class="col-md-3">' + item.id + '</td>\
        <td class="col-md-3">' + item.name + '</td>\
        <td class="col-md-3">' + item.age + '</td>\
        <td class="col-md-3">\
        <input type="button" class="btn btn-primary edit" value="修改">\
        <input type="button" class="btn btn-danger delete" value="删除">\
        </td>\
        </tr>';
      });
      $('#table-list').append(str);
    },
    error: function (err) {
      return console.log(err);
    }
  });
}
render();


setTimeout(function () {
  // 增加
  $('#add').bind('click', function () {
    if ($('#username').val() === '' || $('#age').val() === '') {
      alert('信息请填写正确');
    } else {
      $.ajax({
        url: '/add',
        dataType: 'json',
        type: 'post',
        data: {
          name: $('#username').val(),
          age: $('#age').val()
        },
        success: function (data) {
          var str = '<tr class="list-item-'+data.id+'">\
        <td class="col-md-3">' + data.id + '</td>\
        <td class="col-md-3">' + data.name + '</td>\
        <td class="col-md-3">' + data.age + '</td>\
        <td class="col-md-3">\
        <input type="button" class="btn btn-primary edit" value="修改">\
        <input type="button" class="btn btn-danger delete" value="删除">\
        </td>\
        </tr>';
          $('#table-list').append(str);
        },
        error: function (err) {
          return console.log(err);
        }
      });
    }
  });
// 查询
  $('#query').bind('click', function () {

  });
// 修改
  $('#edit').bind('click', function () {

  });
// 删除
  $('.delete').on('click', function () {
    var id = $(this).parent().parent().attr('class').replace('list-item-','');
    var _this = $(this);
    $.ajax({
      url:'/users/'+id,
      type:'delete',
      dataType:'json',
      success:function (data) {
        if(data) _this.parent().parent().remove();
      },
      error:function (err) {
        return console.log(err);
      }
    });
  });
// 升序
  $('#desc').bind('click', function () {

  });
// 降序
  $('#asc').bind('click', function () {

  });
},10);