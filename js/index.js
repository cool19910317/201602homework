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
        str += '<tr class="list-item-' + item.id + '">\
        <td class="col-md-3 lead">' + item.id + '</td>\
        <td class="col-md-3"><input type="text" class="form-control edit-input" readonly value="' + item.name + '"></td>\
        <td class="col-md-3"><input type="text" class="form-control edit-input" readonly value="' + item.age + '"></td>\
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
      return;
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
          var str = '<tr class="list-item-' + data.id + '">\
        <td class="col-md-3 lead">' + data.id + '</td>\
        <td class="col-md-3"><input type="text" class="form-control edit-input" readonly value="' + data.name + '"></td>\
        <td class="col-md-3"><input type="text" class="form-control edit-input" readonly value="' + data.age + '"></td>\
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
    if ($('#username').val() === '' && $('#age').val() === '') {
      alert('信息请填写正确');
      return;
    } else {
      $.ajax({
        url: '/query',
        type: 'GET',
        dataType: 'JSON',
        data: {
          name: $('#username').val(),
          age: $('#age').val()
        },
        success: function (data) {
          if (data.error) {
            alert(data.msg);
            return;
          } else {
            var str = '';
            data.forEach(function (item) {
              str += '<tr class="list-item-' + item.id + '">\
        <td class="col-md-3 lead">' + item.id + '</td>\
        <td class="col-md-3"><input type="text" class="form-control edit-input" readonly value="' + item.name + '"></td>\
        <td class="col-md-3"><input type="text" class="form-control edit-input" readonly value="' + item.age + '"></td>\
        <td class="col-md-3">\
        <input type="button" class="btn btn-primary edit" value="修改">\
        <input type="button" class="btn btn-danger delete" value="删除">\
        </td>\
        </tr>';
            });
            $('#table-list').html(str);
          }
        },
        error: function (err) {
          return console.log(err);
        }
      })
    }
  });
// 修改
  $('.edit').on('click', function () {
    var input = $('<input type="button" class="ctrlS btn btn-warning" value="保存">');
    $(this).parent().parent().find('.edit-input').removeAttr('readonly').parent().parent().siblings().find('.edit-input').attr('readonly', 'readonly');
    if ($(this).parent().children().length===2) {
      $(this).parent().append(input).parent().siblings().find('.ctrlS').remove();
    } else {
      return;
    }

    // 修改提交
    $('.ctrlS').one('click', function () {
      $(this).parent().parent().find('.edit-input').attr('readonly','readonly');
      var id = $(this).parent().parent().attr('class').replace('list-item-', '');
      var newName = $(this).parent().parent().find('.edit-input').eq(0).val();
      var newAge = $(this).parent().parent().find('.edit-input').eq(1).val();
      console.log(newName,newAge);
      $.ajax({
        url: '/edit/' + id,
        type: 'patch',
        data:{
          name:newName,
          age:newAge
        },
        dataType: 'json',
        success: function (data) {
          console.log(data);
        },
        error: function (err) {
          return console.log(err);
        }
      });
    });

  });



// 删除
  $('.delete').bind('click', function () {
    var id = $(this).parent().parent().attr('class').replace('list-item-', '');
    var _this = $(this);
    $.ajax({
      url: '/users/' + id,
      type: 'delete',
      dataType: 'json',
      success: function (data) {
        console.log(data);
        _this.parent().parent().remove();
      },
      error: function (err) {
        return console.log(err);
      }
    });
  });


// 升序
  $('#desc').bind('click', function () {
    $.ajax({
      url:'',
      type:'',
      success:function (data) {

      },
      error:function (err) {
        return console.log(err);
      }
    });
  });

  app.get('/users',function(req,res){
    var keyword = req.query.keyword;
    var sortBy = req.query.sortBy;
    var pageNum = parseInt(req.query.pageNum);
    var pageSize = parseInt(req.query.pageSize);
    var start = (pageNum-1)*pageSize;
    var end = pageNum*pageSize;
    var type = req.query.type=='desc'?-1:1;
    var users = JSON.parse(fs.readFileSync(db,'utf8'));
    var users = users.filter(function(user){
      return user.name.indexOf(keyword) !=-1;
    }).sort(function(a,b){
      return (a[sortBy] - b[sortBy])*type;
    }).slice(start,end);
    res.send(users);
  });




// 降序
  $('#asc').bind('click', function () {

  });
}, 10);