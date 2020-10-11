$(function () {
    var form = layui.form
    var layer = layui.layer

    initCate()


    function initCate() {
        $.ajax({
            methof: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $("[name=cate_id]").html(htmlStr)
                form.render()
            }
        })
    }
    //渲染富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $("#btnChooseImage").on('click', function () {
        $("#coverFile").click()
    })

    var layer = layui.layer;
    $("#coverFile").on('change', function (e) {
        var files = e.target.files;
        if (files.length === 0) {
            return layer.msg('请选择用户头像！')
        }
        //选择头像成功后
        // 1. 拿到用户选择的文件
        var file = e.target.files[0]
        // 2. 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 3. 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域



    })

    //设置状态
    var state = '已发布'
    $("#btnSave2").on("click", function () {
        state = '草稿'
    })
    //添加文章
    $("#form-pub").on("submit", function (e) {
        e.preventDefault()

        // 创建FormData对象 收集数据
        var fd = new FormData(this)

        fd.append("state", state)
        // console.log(state);

        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                console.log(...fd);

                publishArticle(fd)
                // 6. 发起 ajax 数据请求
            })
    });

    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您，添加文章成功，跳转中。。。')
                setTimeout(function () {
                    window.parent.document.querySelector('#art_list').click()
                }, 2000);
            }
        })
    }

})