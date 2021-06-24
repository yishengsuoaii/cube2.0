$(function () {
    
    var register = window.location.search.substring(1).split("=")[1]
    layui.use(['layer', 'form', 'element'], function () {
        var layer = layui.layer
        var form = layui.form;
        var element = layui.element;
        $('#login-form').submit(function () {
            return false;
        })
    })
    if(register === 'true') {
        $('#register').addClass('layui-this')
        $('#registerCont').addClass('layui-show')
    } else {
        $('#log').addClass('layui-this')
        $('#logCont').addClass('layui-show')
    }


    //登录---------------------------------------------------------------------------------------------------------------
    $(".name").blur(function () {
        if ($.trim($(this).val()).length <= 0) {
            $("#hintLogin").text("用户名/手机号不能为空!");
        } else {
            $("#hintLogin").text('')
        }
    })
    $(".txtPwd-1").blur(function () {
        if ($.trim($(this).val()).length <= 0) {
            $("#hintLogin").text("密码不能为空!");
        } else {
            $("#hintLogin").text('')
        }
    })

    $('#login-btn').on('click', function () {
        if ($.trim($('.name').val()).length <= 0 || $.trim($('.txtPwd-1').val()).length <= 0) {
            layer.msg('请输入用户名/手机号或密码!')
            return
        }
        $.ajax({
            type: "POST",
            dataType: "json",
            async: false,
            url: "http://www.cubee.vip/account/login/",
            data: $("#login-form").serialize(),
            success: function (result) {
                sessionStorage.setItem('token', result.token)
                if (result.msg == "success") {
                    window.location.href = "./../html/home.html"
                } else if (result.msg == "error") {
                    layer.msg("账户名或密码错误，请重新输入!")
                }
            }
        })
    })

    // 注册--------------------------------------------------------------------------------------------------------------------
    let userNameFlag = false
    $(".name_1").blur(function () {
        if ($.trim($(this).val()).length <= 0) {
            $("#hintRegister").text("用户名不能为空!")
        } else {
            $.ajax({
                type: "GET",
                url: "http://www.cubee.vip/account/exist_account_name/",
                dataType: "json",
                data: $(".name_1").serialize(),
                success: function (res) {
                    if (res.msg == "error") {
                        $("#hintRegister").text("用户名重复!");
                        userNameFlag= true
                    } else {
                        $("#hintRegister").text('')
                        userNameFlag = false
                    }
                }
            })
        }
    })
    // 手机号是否重复
    let mobileFlag = false
    $(".mobile").blur(function () {
        if ($.trim($(this).val()).length <= 0) {
            $("#hintRegister").text("手机号不能为空!");
        } else if (!/^1\d{10}$/.test($.trim($(this).val()))) {
            $("#hintRegister").text("手机号格式不正确!");
        } else {
            $.ajax({
                type: "GET",
                url: "http://www.cubee.vip/account/exist_telphone/",
                dataType: "json",
                data: $(".mobile").serialize(),
                success: function (result) {
                    if (result.msg == "error") {
                        $("#hintRegister").text("手机号重复!");
                        mobileFlag = true
                    } else {
                        $("#hintRegister").text("");
                        mobileFlag = false
                    }
                }
            })
        }
    });

    $(".txtPwd").blur(function () {
        if ($.trim($(this).val()).length <= 0) {
            $("#hintRegister").text("密码不能为空!");
        } else {
            $("#hintRegister").text("");
        }
    });

    $("#verification").blur(function () {
        if ($.trim($(this).val()).length <= 0) {
            $("#hintRegister").text("请输入验证码!");
        } else if (!/^\d{6}$/.test($.trim($(this).val()))) {
            $("#hintRegister").text("验证码格式不正确!");
        } else {
            $("#hintRegister").text('');
        }
    });
    // 获取验证码
    $("#getCode").on('click', function () {
        if ($.trim($('.mobile').val()).length <= 0) {
            $("#hintRegister").text("手机号不能为空!");
        } else if (!/^1\d{10}$/.test($.trim($('.mobile').val()))) {
            $("#hintRegister").text("手机号格式不正确!");
        } else if (mobileFlag) {
            $("#hintRegister").text("手机号重复!");
        } else {
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

                    } else if (result.msg === 'error') {
                        layer.msg('发送太频繁,请稍等一会再发送!')
                    }
                }
            })
        }
    });
    // 注册按钮
    $('#register-btn').on('click', function () {

        if ($.trim($('.name_1').val()).length <= 0) {
            $("#hintRegister").text("用户名不能为空!")
        } else if(userNameFlag){
            $("#hintRegister").text("用户名重复!");
        } else if ($.trim($('.mobile').val()).length <= 0) {
            $("#hintRegister").text("手机号不能为空!");
        } else if (!/^1\d{10}$/.test($.trim($('.mobile').val()))) {
            $("#hintRegister").text("手机号格式不正确!");
        } else if (mobileFlag) {
            $("#hintRegister").text("手机号重复!");
        } else if ($.trim($('.txtPwd').val()).length <= 0) {
            $("#hintRegister").text("密码不能为空!");
        } else if ($.trim($('#verification').val()).length <= 0) {
            $("#hintRegister").text("请输入验证码!");
        } else if (!/^\d{6}$/.test($.trim($('#verification').val()))) {
            $("#hintRegister").text("验证码格式不正确!");
        } else {
            $.ajax({
                type: "POST",
                dataType: "json",
                async: false,
                url: "http://www.cubee.vip/account/register/",
                data: $("#form").serialize(),
                success: function (result) {
                    if(result.msg==='error') {
                        layer.msg('注册失败,请重新注册!')
                    } else {
                        layer.msg('注册成功!')
                        setTimeout(()=>{
                            $.ajax({
                                type: "POST",
                                dataType: "json",
                                async: false,
                                url: "http://www.cubee.vip/account/login/",
                                data: {
                                    account_name:$.trim($('.name_1').val()),
                                    account_password:$.trim($('.txtPwd').val())
                                },
                                success: function (result) {
                                    sessionStorage.setItem('token', result.token)
                                    if (result.msg == "success") {
                                        window.location.href = "./../html/home.html"
                                    } else if (result.msg == "error") {
                                        layer.msg("账户名或密码错误，请重新输入!")
                                    }
                                }
                            })
                        },1000)
                    }
                },
            })
        }
        
    })
    // 眼睛
    $('#eyes').hover(function(){
        $('.txtPwd').prop('type','text')
    },function(){
        $('.txtPwd').prop('type','password')
    })
})