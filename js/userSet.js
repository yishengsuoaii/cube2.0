$(function () {
    if (!sessionStorage.getItem('token')) {
        window.location.href = "./../login.html"
    }

    layui.use(['upload'], function () {

        var upload = layui.upload;
        // 上传门户头像
        var userImage = upload.render({
            elem: '#uploadImage', //绑定元素
            url: 'http://www.cube.vip/account/check_account_thundernail/', //上传接口
            headers: {
                token: sessionStorage.getItem('token')
            },
            done: function (res) {
                if (res.msg === 'success') {
                    layer.msg('上传成功!')
                    $('#userImage').attr('src', res.data.account_thundernail + '?' +
                        new Date().getTime())
                } else {
                    layer.msg('上传失败,请重试!')
                }
            },
            error: function () {
                //请求异常回调
            }
        });
    })

    // 获取头像
    $.ajax({
        type: "GET",
        dataType: "json",
        async: false,
        headers: {
            token: sessionStorage.getItem('token')
        },
        url: "http://www.cube.vip/account/check_account_thundernail/",
        success: function (res) {
            if (res.msg === 'success') {
                $('#userImage').attr('src', res.data.account_thundernail)
            }
        }

    })

    // 获取用户名 手机号
    $.ajax({
        type: "GET",
        dataType: "json",
        async: false,
        headers: {
            token: sessionStorage.getItem('token')
        },
        url: "http://www.cube.vip/account/check_info/",
        success: function (res) {
            if (res.msg === 'success') {
                $('.userName').text(res.data.account_name)
                $('.mobile span').text(res.data.account_telphone)
            }
        }
    })
    $('#nameInput').on('input', function () {
        $('.userName').text($(this).val())
    })
    // 修改用户名
    $('#name-submit').on('click', function () {
        if ($.trim($('#nameInput').val()).length <= 0) {
            layer.msg('请输入新用户名!')
            $('#nameInput').focus()
            return
        }
        $.ajax({
            type: "POST",
            dataType: "json",
            async: false,
            headers: {
                token: sessionStorage.getItem('token')
            },
            url: "http://www.cube.vip/account/check_info/",
            data: {
                update_account_name: $.trim($('#nameInput').val())
            },
            success: function (res) {
                if (res.msg === 'success') {
                    layer.msg('修改成功!')
                    setTimeout(() => {
                        sessionStorage.removeItem('token')
                        window.top.location.href = "./../login.html"
                    }, 1000)
                } else {
                    layer.msg('修改失败,请重试!')
                }
            }
        })
    })

    // 修改密码

    $('#pass-submit').on('click', function () {
        if ($.trim($('#pass1').val()).length <= 0) {
            layer.msg('请输入原密码!')
            $('#pass1').focus()
            return
        } else if ($.trim($('#pass2').val()).length <= 0) {
            layer.msg('请输入新密码!')
            $('#pass2').focus()
            return
        } else if ($.trim($('#pass3').val()).length <= 0) {
            layer.msg('请再次输入密码!')
            $('#pass3').focus()
            return
        }
        $.ajax({
            type: "POST",
            dataType: "json",
            async: false,
            headers: {
                token: sessionStorage.getItem('token')
            },
            url: "http://www.cube.vip/account/change_password/",
            data: {
                account_old_password: $.trim($('#pass1').val()),
                account_new_password: $.trim($('#pass2').val()),
                account_new_password2: $.trim($('#pass3').val())
            },
            success: function (res) {
                if (res.msg === 'success') {
                    layer.msg('修改成功!')
                    setTimeout(() => {
                        sessionStorage.removeItem('token')
                        window.top.location.href = "./../login.html"
                    }, 1000)
                } else if (res.data === 'Old password error') {
                    layer.msg('旧密码错误,请重新输入!')
                } else if (res.data ===
                    'account_new_password and account_new_password2 is not') {
                    layer.msg('两次密码不一致,请重新输入!')
                } else {
                    layer.msg('修改失败,请重试!')
                }
            }
        })
    })

    // 用户名显示
    $('.editNameBtn').click(function () {
        if ($('#nameArrows').hasClass('layui-icon-down')) {
            $('#nameArrows').removeClass('layui-icon-down').addClass('layui-icon-up')
            $('.editNameBox').show()
        } else {
            $('#nameArrows').removeClass('layui-icon-up').addClass('layui-icon-down')
            $('.editNameBox').hide()
        }
    })
    // 密码显示
    $('#editPassBtn').click(function () {
        if ($('#passArrows').hasClass('layui-icon-down')) {
            $('#passArrows').removeClass('layui-icon-down').addClass('layui-icon-up')
            $('.editPassBox').show()
        } else {
            $('#passArrows').removeClass('layui-icon-up').addClass('layui-icon-down')
            $('.editPassBox').hide()
        }
    })
})