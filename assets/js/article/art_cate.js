$(function () {
    //初始化文章类别展示
    initArtCateList();
    //封装函数
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                var str = template("tpl-table", res)
                $("tbody").html(str)
            }
        })
    }

    //显示添加文章分类列表
    var layer = layui.layer;
    $("#btnAdd").on("click", function () {
        //利用框架代码，显示提示文章类别区域
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $("#dialog-add").html()
        });
    })
    //因为关闭弹窗要用到索引
    var indexAdd = null

    //添加文章分类  事件代理
    $("body").on('submit', '#form-add', function (e) {
        e.preventDefault();
        //天机文章分类发送Ajax
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //添加成功后要重新渲染页面
                initArtCateList()
                layer.msg(res.message)
                //添加完成 关闭弹窗
                layer.close(indexAdd)

            }
        })
    })


    //为编辑按钮添加事件  事件代理
    var indexEdit = null
    var form = layui.form
    $("tbody").on("click", ".btn-edit", function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $("#dialog-edit").html()
        });
        //获取Id 发送Ajax获取数据  渲染到页面
        var Id = $(this).attr("data-id")

        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + Id, //路径的最后带/ 后面是字符串的变量拼接
            success: function (res) {
                form.val("form-edit", res.data)
            }
        })
    })

    //修改数据并提交
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //因为更新成功，所以要重新渲染页面中的数据
                initArtCateList();
                layer.msg('恭喜您，文章类别更新成功')
                layer.close(indexEdit)
            }
        })
    })

    //删除
    $("tbody").on("click", ".btn-delete", function () {
        //先获取Id  进入函数中this的指向就改变了
        var Id = $(this).attr("data-id")

        // 显示弹窗
        layer.confirm('是否确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList();
                    layer.msg('恭喜，删除成功')
                    layer.close(index);
                }
            })

        });
    })
})