$(function () {
    //自定义表单校验
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "用户昵称长度在1-6位字符之间！"
            }
        }
    })

    //2初始化用户信息
    initUserInfo();
    //初始化用户信息封装，后面还要用
    var layer = layui.layer;
    function initUserInfo() {
        //发Ajax请求
        $.ajax({
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.messagae)
                }
                // console.log(res);
                //成功后，渲染到表单
                form.val('formUserInfo', res.data)
            }
        })
    }

    //重置表单
    $("#btnReset").on("click", function (e) {
        // 阻止默认重置，因为重置到初始化页面html的值
        // console.log(111);
        e.preventDefault()
        //重新渲染
        initUserInfo();
    })

    //修改用户信息 
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.messagae)
                //调用父框架中的全局方法
                window.parent.getUserInfo()
            }
        })
    })
})