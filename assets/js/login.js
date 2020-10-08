$(function () {
  //1点击去注册账号,隐藏登录区域,显示注册区域
  $("#link_reg").on("click", function () {
    $(".login-box").hide()
    $(".reg-box").show()
  })
  //2点击去登陆,隐藏登录区域,显示注册区域
  $("#link_login").on("click", function () {
    $(".login-box").show()
    $(".reg-box").hide()
  })


  //自定义校验规则
  //从layui中到获取form对象
  var form = layui.form;

  // 校验规则

  form.verify({

    //密码规则
    pwd: [
      /^[\S]{6,16}$/,
      '密码必须为6-16位,且不能输入空格'
    ],
    //校验两次密码是否一直
    repwd: function (value) {
      // value是输入的值, 再获取password里面的值进项比较
      var pwd = $(".reg-box [name=password]").val();
      if (value !== pwd) {
        return "两次密码输入不一致";
      }
    }
  })


  //注册功能
  var layer = layui.layer;
  $("#form_reg").on("submit", function (e) {
    //阻止表单默认提交
    e.preventDefault();
    //发送ajax
    $.ajax({
      method: 'post',
      url: 'http://ajax.frontend.itheima.net/api/reguser',
      data: {
        username: $(".reg-box [name=username]").val(),
        password: $(".reg-box [name=password]").val(),
      },
      success: function (res) {
        //返回状态判断
        if (res.status != 0) {
          return layer.msg(res.message);
        }
        //注册成功后的提示信息
        layer.msg(res.message);
        // 注册成功后,返回登录页面
        $("#link_login").click();
      }
    });
  })

  //5.登录功能(给form标签绑定事件,button按钮触发提交  事件)
  $("#form_login").submit(function (e) {
    e.preventDefault();
    // 发送Ajax
    $.ajax({
      method: 'post',
      url: '/api/login',
      //快速获取表单中的数据  serialize()
      data: $(this).serialize(),
      success: function (res) {
        //校验返回状态
        if (res.status !== 0) {

          return layer.msg(res.message)

        }
        //提示信息  保存token 跳转页面
        layer.msg('恭喜您,登陆成功')
        //保存token 未来的接口要使用 token
        localStorage.setItem('token', res.token);
        //跳转
        location.href = "/index.html"
      }
    })
  });
})
