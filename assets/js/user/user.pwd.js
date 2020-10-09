$(function () {

    //定义验证规则
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $("[name=oldPwd]").val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value != $("[name=newPwd]").val()) {
                return '两次密码输入不一致'
            }
        }
    })

    //修改密码
    $(".layui-form").on("submit", function (e) {
        //取消默认提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                //修改成功 重置表单
                $(".layui-form")[0].reset()
            }
        })
    })
})