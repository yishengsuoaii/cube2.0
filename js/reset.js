$(function () {
    layui.use(['layer', 'form', 'element'], function () {
        var layer = layui.layer
        var form = layui.form;
        var element = layui.element;
    })

    $(".mobile").blur(function () {
        if ($.trim($(this).val()).length <= 0) {
            $("#hintInfo").text("请输入手机号");
        } else if (!/^1\d{10}$/.test($.trim($(this).val()))) {
            $("#hintInfo").text("手机号格式不正确!");
        } else {
            $("#hintInfo").text('')
        }
    });

    $("#verification").blur(function () {
        if ($.trim($(this).val()).length <= 0) {
            $("#hintInfo").text("请输入验证码!");
        } else if (!/^\d{6}$/.test($.trim($(this).val()))) {
            $("#hintInfo").text("验证码格式不正确!");
        } else {
            $("#hintInfo").text('');
        }
    });

    $(".txtPwd").blur(function () {
        if ($.trim($(this).val()).length <= 0) {
            $("#hintInfo").text("密码不能为空!");
        } else {
            $("#hintInfo").text("");
        }
    });

    $(".txtPwd-1").blur(function () {
        if ($.trim($(this).val()).length <= 0) {
            $("#hintInfo").text("请再次输入密码!");
        } else if ($(this).val() !== $('.txtPwd').val()) {
            $("#hintInfo").text("两次密码不一致,请重新输入!");
        } else {
            $("#hintInfo").text("");
        }
    });

    $('#getCode').on('click', function () {

        if ($.trim($('.mobile').val()).length <= 0) {
            $("#hintInfo").text("请输入手机号");
        } else if (!/^1\d{10}$/.test($.trim($('.mobile').val()))) {
            $("#hintInfo").text("手机号格式不正确!");
        } else {
            $("#hintInfo").text('')
            $.ajax({
                type: "GET",
                dataType: "json",
                async: false,
                url: "http://www.cubee.vip/account/send_phone_sms/",
                data: $(".mobile").serialize(),
                success: function (result) {
                    if (result.msg === 'success') {
                        layer.msg('验证码已发送,请注意查收!')
                        let count = 59;
                        const countDown = setInterval(() => {
                            if (count === 0) {
                                $('#getCode').text('重新发送').removeAttr(
                                    'disabled');
                                $('#getCode').css({
                                    background: '#ff9400',
                                    color: '#fff',
                                });
                                clearInterval(countDown);
                            } else {
                                $('#getCode').attr('disabled', true);
                                $('#getCode').css({
                                    background: '#d8d8d8',
                                    color: '#707070',
                                });
                                $('#getCode').text(count + '秒后可重新获取');
                            }
                            count--;
                        }, 1000);
                    } else if (result.data === 'Sending too often') {
                        layer.msg('发送太频繁,请稍等一会再发送!')
                    }
                }
            })
        }
    })

    $('#reset-btn').on('click', function () {
        if ($.trim($('.mobile').val()).length <= 0) {
            $("#hintInfo").text("请输入手机号");
        } else if (!/^1\d{10}$/.test($.trim($('.mobile').val()))) {
            $("#hintInfo").text("手机号格式不正确!");
        } else if ($.trim($('#verification').val()).length <= 0) {
            $("#hintInfo").text("请输入验证码!");
        } else if (!/^\d{6}$/.test($.trim($('#verification').val()))) {
            $("#hintInfo").text("验证码格式不正确!");
        } else if ($.trim($('.txtPwd').val()).length <= 0) {
            $("#hintInfo").text("密码不能为空!");
        } else if ($.trim($('.txtPwd-1').val()).length <= 0) {
            $("#hintInfo").text("请再次输入密码!");
        } else if ($('.txtPwd-1').val() !== $('.txtPwd').val()) {
            $("#hintInfo").text("两次密码不一致,请重新输入!");
        } else {
            $.ajax({
                type: "POST",
                dataType: "json",
                async: false,
                url: "http://www.cubee.vip/account/forgot_password/",
                data: $("#form").serialize(),
                success: function (result) {
                    if (result.msg == "success") {
                        window.location.href = "../login.html";
                    } else if(result.data=== 'Verification code error') {
                        layer.msg('验证码错误,请重新输入!')
                    } else {
                        layer.msg('重置失败,请重试!')
                    }
                }
            })
        }

    })



})