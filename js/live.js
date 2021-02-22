$(function () {
    if (!sessionStorage.getItem('token')) {
        window.location.href = "./../login.html"
    }
    let searchData = window.location.search.substring(1).split("=")[1]

    if (searchData === '' || searchData === undefined) {
        window.location.href = "./../index.html"
    }
    var event_id = searchData;
    var event_code = ''
    var event_uri_key = ''
    var serverIp = ''
    // 用户昵称
    var userName
    // 用户头像
    var userImage
    // 聊天记录条数
    var chatNum = 0

    // logo
    var logoFlag = 'True'
    var logoOrientation = 1


    // 比分文件
    var fileScore = 0
    var scoreLocation = 0

    // video dom
    var domChatVideo= document.getElementById('chatVideo')
    var domCameraOne= document.getElementById('cameraOne')
    var domCameraTwo= document.getElementById('cameraTwo')
    var domCameraThree = document.getElementById('cameraThree')
    var domCameraFour=  document.getElementById('cameraFour')
    var domLiveRight = document.getElementById('liveRight-video')

    domCameraOne.volume = 0
    domCameraTwo.volume =0
    domCameraThree.volume =0
    domCameraFour.volume =0
    //所有信息
    var allInfo = {
        // 几拼标志
        numberFlag: 1,
        // 几拼src
        oneSrc: [],
        twoSrc: [],
        threeSrc: [],
        //已经添加几路
        numFlag: 0,
        // 输出机位耳机是否开启
        liveHeadFlag: true,
        // 一二三机位音量大小
        oneMuteSize: 0,
        twoMuteSize: 0,
        threeMuteSize: 0,
        fourMuteSize: 0,
        // tab栏切换保存输出机位耳机状态
        gestureFlag: 0,
        replaceFlag: 0,
        // 比分牌更新状态及是否开启
        update: 0,
        state: 'off'
    }
    // 绘制canvas 定时器
    var timerDraw = null

    // 机位一二三滑块----------------------------------------------------------------------------------------------
    var oneMuteFlag = false
    var twoMuteFlag = false
    var threeMuteFlag = false
    var fourMuteFlag = false
    // 机位一二三滑块实例
    var slide_one = null
    var slide_two = null
    var slide_three = null
    var slide_four = null


    // 所有样式 比分牌---------------------------------------------------------------------------------------------

    // 比分牌透明度实例
    var clarity = null
    var styleArr = [
        [],
        [],
        []
    ]
    // 当前分类下标
    var typeIndex = 0
    // 选中分类下标
    var selectTypeIndex = null
    // 选中样式下标
    var checkIndex = null
    // 队伍昵称 logo
    var teamInfo = [null, null, null, null]

    //记录比分牌样式
    var styleFlag = null
    // 记录位置
    var styleLocation = 2

    var scoreData = null

    layui.use(['form', 'element', 'jquery', 'layer', 'upload', 'slider'], function () {


        let form = layui.form;
        var element = layui.element;
        var layer = layui.layer;
        var jquery = layui.jquery;
        var slider = layui.slider;
        var upload = layui.upload

        // 获取用户头像
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
                    userImage = res.data.account_thundernail
                }
            }
        })

        // 获取直播信息
        $.get({
            url: "http://www.cube.vip/event/live_control/",
            dataType: "json",
            headers: {
                token: sessionStorage.getItem('token')
            },
            async: false,
            data: {
                event_id: event_id
            },
            success: function (result) {
                if (result.msg === 'success') {
                    $(".head-title").text(result.data.event_title);
                    $(".event_code").text(result.data.event_code);
                    event_code = result.data.event_code

                    $(".pull_m3u8").html('<span>HLS:</span><p>' + result.data.pull_stream_m3u8_url + '</p><span>RTMP:</span><p>' + result.data.pull_stream_rtmp_url + '</p>');
                    $("#username").text(result.data.account_name);
                    userName = result.data.account_name
                    event_uri_key = result.data.event_uri_key
                    $('.head-copy').attr('data-clipboard-text',
                        'http://www.cube.vip/h5/wxlogin.html?key=' + result.data
                        .event_uri_key)
                    setVideoMuted()
                    getIp()
                    getScoreStyle()

                }

            },
        })

        // 获取IP地址
        function getIp() {
            $.get({
                url: "http://www.cube.vip/event/get_ip/",
                dataType: "json",
                headers: {
                    token: sessionStorage.getItem('token')
                },
                async: false,
                data: {
                    stream_code: event_code
                },
                success: res => {
                    if (res.msg === 'success') {
                        serverIp = res.data.ip
                        pullFlow(serverIp, domCameraOne, 0)
                        pullFlow(serverIp, domCameraTwo, 1)
                        pullFlow(serverIp, domCameraThree, 2)
                        pullFlow(serverIp, domCameraFour, 3)
                        pullFlow(serverIp, domChatVideo, 4)
                        if (sessionStorage.getItem(event_code)) {
                            allInfo = JSON.parse(sessionStorage.getItem(event_code))
                            renderHistory()
                            renderHistoryScore()
                            if (sessionStorage.getItem('imageBase64' + event_code)) {
                                fileScore = sessionStorage.getItem('imageBase64' + event_code)
                            }
                        } else {
                            allInfo.oneSrc[0] = {
                                dom: 'cameraOne',
                                name: 1
                            }

                            allInfo.twoSrc[0] = {
                                dom: 'cameraOne',
                                name: 1
                            }
                            allInfo.twoSrc[1] = {
                                dom: 'cameraTwo',
                                name: 2
                            }

                            allInfo.threeSrc[0] = {
                                dom: 'cameraOne',
                                name: 1
                            }
                            allInfo.threeSrc[1] = {
                                dom: 'cameraTwo',
                                name: 2
                            }
                            allInfo.threeSrc[2] = {
                                dom: 'cameraThree',
                                name: 3
                            }
                            cameraCut({
                                dom: 'cameraOne',
                                name: 1
                            })
                            sessionStorage.setItem(event_code, JSON.stringify(allInfo))
                        }
                    } else {
                        setTimeout(()=>{
                            getIp()
                        },5000)
                    }

                }
            })
        }
        $('.live-tab-title li').on('click', function () {
            $(this).addClass('active-this').siblings('li').removeClass('active-this')
            var index = $(this).index()
            $('.live-tab-item').each((ins, item) => {
                if (ins === index) {
                    $(item).addClass('layui-show')
                } else {
                    $(item).removeClass('layui-show')
                }
            })
            if(index===1){
                domChatVideo.muted = false
            } else {
                domChatVideo.muted = true
            } 
             if(index ===2){
                domCameraOne.muted = false
                domCameraTwo.muted = false
                domCameraThree.muted = false
                domCameraFour.muted = false
                domLiveRight.muted = false

                domCameraOne.play()
                domCameraTwo.play()
                domCameraThree.play()
                domCameraFour.play()
                domLiveRight.play()
             } else {
                setVideoMuted()
             }
        })
        // 静音
        function setVideoMuted(){
            domCameraOne.muted = true
            domCameraTwo.muted = true
            domCameraThree.muted = true
            domCameraFour.muted = true
            domLiveRight.muted = true
        }
        var errorNum=0
        // 拉流
        function pullFlow(ip, dom, index) {
            var server = 'http://' + ip + ':8088/janus'
            var janus = null;
            var streaming = null;
            var opaqueId = "streamingtest-" + Janus.randomString(12);

            Janus.init({
                debug: "all",
                callback: function () {
                    if (!Janus.isWebrtcSupported()) {
                        return;
                    }
                    janus = new Janus({
                        server: server,
                        success: function () {
                            janus.attach({
                                plugin: "janus.plugin.streaming",
                                opaqueId: opaqueId,
                                success: function (pluginHandle) {
                                    streaming = pluginHandle;
                                    updateStreamsList();
                                },
                                onmessage: function (msg, jsep) {
                                    if (msg["error"]) {
                                        return;
                                    }
                                    if (jsep) {
                                        var stereo = (jsep.sdp.indexOf("stereo=1") !== -1);
                                        streaming.createAnswer({
                                            jsep: jsep,
                                            media: {
                                                audioSend: false,
                                                videoSend: false,
                                                data: true
                                            },
                                            customizeSdp: function (jsep) {
                                                if (stereo && jsep.sdp.indexOf("stereo=1") == -1) {
                                                    jsep.sdp = jsep.sdp.replace("useinbandfec=1", "useinbandfec=1;stereo=1");
                                                }
                                            },
                                            success: function (jsep) {
                                                Janus.debug("Got SDP!", jsep);
                                                var body = {
                                                    request: "start"
                                                };
                                                streaming.send({
                                                    message: body,
                                                    jsep: jsep
                                                });
                                            },
                                            error: function (error) {
                                                Janus.error("WebRTC error:", error);
                                            }
                                        });
                                    }
                                },
                                onremotestream: function (stream) {
                                    Janus.attachMediaStream(dom, stream);
                                    if (index === 4) {
                                        Janus.attachMediaStream(domLiveRight, stream);
                                    }
                                }
                            });
                        },
                        error: function (error) {
                            errorNum++ 
                            if(errorNum==5){
                                pullFlow(serverIp, domCameraOne, 0)
                                pullFlow(serverIp, domCameraTwo, 1)
                                pullFlow(serverIp, domCameraThree, 2)
                                pullFlow(serverIp, domCameraFour, 3)
                                pullFlow(serverIp, domChatVideo, 4)
                                errorNum = 0
                            }
                        },
                        destroyed: function () {
                            window.location.reload();
                        }
                    })
                }
            })

            function updateStreamsList() {
                streaming.send({
                    message: {
                        request: "list"
                    },
                    success: function (result) {
                        if (result["list"]) {
                            streaming.send({
                                message: {
                                    request: "watch",
                                    id: parseInt(result["list"][index].id) || result["list"][index].id
                                }
                            });
                        }
                    }
                });
            }
        }

        // 比分显示方位
        form.on('radio(areaRadio)', function (data) {
            if (data.value === 'leftTop') {
                $('#areaCont').removeClass('leftBottom rightTop rightBottom bottomCenter bottomCenter1').addClass(
                    'leftTop')
                styleLocation = 1

            } else if (data.value === 'leftBottom') {
                $('#areaCont').removeClass('leftTop rightTop rightBottom bottomCenter bottomCenter1').addClass(
                    'leftBottom')
                styleLocation = 2


            } else if (data.value === 'rightTop') {
                $('#areaCont').removeClass('leftBottom leftTop rightBottom bottomCenter bottomCenter1').addClass(
                    'rightTop')
                styleLocation = 3

            } else if (data.value === 'rightBottom') {
                $('#areaCont').removeClass('leftBottom rightTop leftTop bottomCenter bottomCenter1').addClass(
                    'rightBottom')
                styleLocation = 4
            } else if (data.value === 'bottomCenter') {
                if (styleFlag === 1) {
                    $('#areaCont').removeClass('leftBottom rightTop leftTop rightBottom bottomCenter1').addClass(
                        'bottomCenter')
                    styleLocation = 5
                } else if (styleFlag === 2) {
                    $('#areaCont').removeClass('leftBottom rightTop leftTop rightBottom bottomCenter').addClass(
                        'bottomCenter1')
                    styleLocation = 6
                }

            }
        })

        // logo方位-----------------------------------------------------------------------------------------------------------
        form.on('radio(logo-orientation)', function (data) {
            if (data.value === '1') {
                $('.upload-watermark-image').removeClass(
                    'upload-watermark-image-rt upload-watermark-image-rb upload-watermark-image-lb'
                ).addClass('upload-watermark-image-lt')
                logoOrientation = 1

            } else if (data.value === '2') {
                $('.upload-watermark-image').removeClass(
                    'upload-watermark-image-lt upload-watermark-image-rb upload-watermark-image-rt'
                ).addClass('upload-watermark-image-lb')
                logoOrientation = 2

            } else if (data.value === '3') {
                $('.upload-watermark-image').removeClass(
                    'upload-watermark-image-lb upload-watermark-image-rb upload-watermark-image-lt'
                ).addClass('upload-watermark-image-rt')
                logoOrientation = 3

            } else if (data.value === '4') {
                $('.upload-watermark-image').removeClass(
                    'upload-watermark-image-rt upload-watermark-image-lt upload-watermark-image-lb'
                ).addClass('upload-watermark-image-rb')
                logoOrientation = 4
            }
        })
        //logo开关
        form.on('switch(logo-open)', function (data) {
            if (data.elem.checked) {
                logoFlag = 'True'
                $('.upload-watermark-image').show()
            } else {
                logoFlag = 'False'
                $('.upload-watermark-image').hide()
            }
        });

        // 获取logo信息
        $.get({
            url: "http://www.cube.vip/event/logo_page_setup/",
            dataType: "json",
            headers: {
                token: sessionStorage.getItem('token')
            },
            data: {
                event_id: event_id
            },
            success: function (res) {
                if (res.msg === "success") {
                    $("#channel-set-logo").attr("src", res.data.event_video_logo_page +
                        '?' + new Date().getTime());

                    if (res.data.event_logo_position === 1) {
                        $('.upload-watermark-image').removeClass(
                            'upload-watermark-image-rt upload-watermark-image-rb upload-watermark-image-lb'
                        ).addClass('upload-watermark-image-lt')
                        logoOrientation = 1
                        $('#logo-radio1').prop('checked', true);

                    } else if (res.data.event_logo_position === 2) {
                        $('.upload-watermark-image').removeClass(
                            'upload-watermark-image-lt upload-watermark-image-rb upload-watermark-image-rt'
                        ).addClass('upload-watermark-image-lb')
                        logoOrientation = 2
                        $('#logo-radio2').prop('checked', true);


                    } else if (res.data.event_logo_position === 3) {
                        $('.upload-watermark-image').removeClass(
                            'upload-watermark-image-lb upload-watermark-image-rb upload-watermark-image-lt'
                        ).addClass('upload-watermark-image-rt')
                        logoOrientation = 3
                        $('#logo-radio3').prop('checked', true);

                    } else if (res.data.event_logo_position === 4) {
                        $('.upload-watermark-image').removeClass(
                            'upload-watermark-image-rt upload-watermark-image-lt upload-watermark-image-lb'
                        ).addClass('upload-watermark-image-rb')
                        logoOrientation = 4
                        $('#logo-radio4').prop('checked', true);
                    }
                    if (res.data.event_logo_countdown) {
                        logoFlag = 'True'
                        $("#logo-switch").attr('checked', 'checked');
                        $('.upload-watermark-image').show()
                        setLogoLocation(logoOrientation)
                    } else {
                        logoFlag = 'False'
                        $("#logo-switch").removeAttr('checked');
                        $('.upload-watermark-image').hide()
                    }

                    form.render('radio');
                    form.render('checkbox');
                }
            }
        })

        function setLogoLocation(value) {
            $('#scoreLocation1').removeAttr('disabled')
            $('#scoreLocation2').removeAttr('disabled')
            $('#scoreLocation3').removeAttr('disabled')
            $('#scoreLocation4').removeAttr('disabled')
            if (Number(value) === 1) {
                $('#scoreLocation1').attr('disabled', 'true')
            } else if (Number(value) === 2) {
                $('#scoreLocation2').attr('disabled', 'true')
            } else if (Number(value) === 3) {
                $('#scoreLocation3').attr('disabled', 'true')
            } else if (Number(value) === 4) {
                $('#scoreLocation4').attr('disabled', 'true')
            }
            form.render('radio')
        }
        // logo位置 开关提交
        $('#watermark-submit-btn').on('click', function () {
            $.ajax({
                type: 'POST',
                url: "http://www.cube.vip/event/logo_page_setup/",
                dataType: "json",
                headers: {
                    token: sessionStorage.getItem('token')
                },
                data: {
                    event_id: event_id,
                    event_logo_countdown: logoFlag,
                    event_logo_position: logoOrientation
                },
                success: function (res) {
                    if (res.msg === 'success') {
                        layer.msg('提交成功!')
                        if (logoFlag === 'True') {
                            setLogoLocation(logoOrientation)
                        }

                    } else {
                        layer.msg('提交失败,请重试!')
                    }
                }
            })
        })

        // 机位一二三音频滑块---------------------------------------------------------------------------------------------------
        slide_one = slider.render({
            elem: '#slideOne',
            min: 0,
            max: 10,
            step: 1,
            value: 0,
            type: 'vertical',
            theme: '#FF914D',
            setTips: function (value) { //自定义提示文本
                return value / 10;
            },
            change: function (value) {
                $('#slideOne .layui-slider-bar').css({
                    height: value * 100 + '%'
                })
                if (value === 0) {
                    oneMuteFlag = false
                    $('#one-mute').attr('src', '/image/mute-close.png')
                } else {
                    oneMuteFlag = true
                    $('#one-mute').attr('src', '/image/mute-open.png')
                }
                allInfo.oneMuteSize = value * 10
                domCameraOne.volume = value
                sessionStorage.setItem(event_code, JSON.stringify(allInfo))
            }
        })

        $('#one-mute').on('click', function () {
            if (oneMuteFlag) {
                oneMuteFlag = false
                slide_one.setValue(0)
            } else {
                oneMuteFlag = true
                slide_one.setValue(5)
            }
        })

        slide_two = slider.render({
            elem: '#slideTwo',
            min: 0,
            max: 10,
            step: 1,
            value: 0,
            type: 'vertical',
            theme: '#FF914D',
            setTips: function (value) { //自定义提示文本
                return value / 10;
            },
            change: function (value) {
                $('#slideTwo .layui-slider-bar').css({
                    height: value * 100 + '%'
                })
                if (value === 0) {
                    twoMuteFlag = false
                    $('#two-mute').attr('src', '/image/mute-close.png')
                } else {
                    twoMuteFlag = true
                    $('#two-mute').attr('src', '/image/mute-open.png')
                }
                allInfo.twoMuteSize = value * 10
                domCameraTwo.volume = value
                sessionStorage.setItem(event_code, JSON.stringify(allInfo))
            }
        })

        $('#two-mute').on('click', function () {
            if (twoMuteFlag) {
                twoMuteFlag = false
                slide_two.setValue(0)
            } else {
                twoMuteFlag = true
                slide_two.setValue(5)
            }
        })

        slide_three = slider.render({
            elem: '#slideThree',
            min: 0,
            max: 10,
            step: 1,
            value: 0,
            type: 'vertical',
            theme: '#FF914D',
            setTips: function (value) { //自定义提示文本
                return value / 10;
            },
            change: function (value) {
                $('#slideThree .layui-slider-bar').css({
                    height: value * 100 + '%'
                })
                if (value === 0) {
                    threeMuteFlag = false
                    $('#three-mute').attr('src', '/image/mute-close.png')
                } else {
                    threeMuteFlag = true
                    $('#three-mute').attr('src', '/image/mute-open.png')
                }
                allInfo.threeMuteSize = value * 10
                domCameraThree.volume = value 
                sessionStorage.setItem(event_code, JSON.stringify(allInfo))
            }
        })

        $('#three-mute').on('click', function () {
            if (threeMuteFlag) {
                threeMuteFlag = false
                slide_three.setValue(0)
            } else {
                threeMuteFlag = true
                slide_three.setValue(5)
            }
        })

        slide_four = slider.render({
            elem: '#slideFour',
            min: 0,
            max: 10,
            step: 1,
            value: 0,
            type: 'vertical',
            theme: '#FF914D',
            setTips: function (value) { //自定义提示文本
                return value / 10;
            },
            change: function (value) {
                $('#slideFour .layui-slider-bar').css({
                    height: value * 100 + '%'
                })
                if (value === 0) {
                    fourMuteFlag = false
                    $('#four-mute').attr('src', '/image/mute-close.png')
                } else {
                    fourMuteFlag = true
                    $('#four-mute').attr('src', '/image/mute-open.png')
                }
                allInfo.fourMuteSize = value * 10
                domCameraFour.volume = value
                sessionStorage.setItem(event_code, JSON.stringify(allInfo))
            }
        })

        $('#four-mute').on('click', function () {
            if (fourMuteFlag) {
                fourMuteFlag = false
                slide_four.setValue(0)
            } else {
                fourMuteFlag = true
                slide_four.setValue(5)
            }
        })


        // 上传队伍logo
        upload.render({
            elem: '#left-uploadImg',
            url: '/upload/',
            auto: false,
            choose: function (obj) {
                obj.preview(function (index, file, result) {
                    $('#left-uploadIcon').hide()
                    var url = window.URL.createObjectURL(file)
                    $('#left-logo').show().attr('src', url)
                    $('#logoLeft').show().attr('src', url)
                    teamInfo[2] = url
                })
            }
        })

        upload.render({
            elem: '#right-uploadImg',
            url: '/upload/',
            auto: false,
            choose: function (obj) {
                obj.preview(function (index, file, result) {
                    $('#right-uploadIcon').hide()
                    var url = window.URL.createObjectURL(file)
                    $('#right-logo').show().attr('src', url)
                    $('#logoRight').show().attr('src', url)
                    teamInfo[3] = url
                })
            }
        })

        // 显示透明度
        clarity = slider.render({
            elem: '#claritySlide', //绑定元素
            min: 0,
            max: 100,
            value: 100,
            step: 10,
            theme: '#FF914D',
            setTips: function (value) { //自定义提示文本
                return value + '%';
            },
            change: function (value) {
                $('#areaCont').css('opacity', Number(value.replace('%', '')) / 100)
                $('.clarityPercentage').text(value)
                $('#ossImg').css('opacity', Number(value.replace('%', '')) / 100)
            }
        })

        //一拼二拼三拼--------------------------------------------------------------------------------------------------------------
        $('#one-merge').on('click', function () {
            renderOne()
            drawCanvas(allInfo.numberFlag)
            sessionStorage.setItem(event_code, JSON.stringify(allInfo))
        })
        $('#two-merge').on('click', function () {
            $(this).addClass('mergeActive').siblings('img').removeClass('mergeActive')
            allInfo.numberFlag = 2
            allInfo.numFlag = 0
            drawCanvas(allInfo.numberFlag)
            sessionStorage.setItem(event_code, JSON.stringify(allInfo))
        })
        $('#three-merge').on('click', function () {
            $(this).addClass('mergeActive').siblings('img').removeClass('mergeActive')
            allInfo.numberFlag = 3
            allInfo.numFlag = 0
            drawCanvas(allInfo.numberFlag)
            sessionStorage.setItem(event_code, JSON.stringify(allInfo))
        })

        // 机位一二三切换----------------------------------------------------------------------------------------------------

        $('#cameraOne').on('click', function () {
            cameraCut({
                dom: 'cameraOne',
                name: 1
            })
        })

        $('#cameraTwo').on('click', function () {
            cameraCut({
                dom: 'cameraTwo',
                name: 2
            })
        })

        $('#cameraThree').on('click', function () {
            cameraCut({
                dom: 'cameraThree',
                name: 3
            })
        })
        $('#cameraFour').on('click', function () {
            cameraCut({
                dom: 'cameraFour',
                name: 4
            })
        })

        // 机位切换渲染dom 
        function cameraCut(item) {
            if (allInfo.numberFlag === 1) {
                allInfo.numFlag = 1
                allInfo.oneSrc[0]= item
            } else if (allInfo.numberFlag === 2) {
                if (allInfo.numFlag % 2 === 0) {
                    allInfo.twoSrc[0] = item
                } else {
                    allInfo.twoSrc[1] = item
                }
                allInfo.numFlag++
            } else if (allInfo.numberFlag === 3) {
                if (allInfo.numFlag % 3 === 0) {
                   
                    allInfo.threeSrc[0] = item
                } else if (allInfo.numFlag % 3 === 1) {
                   
                    allInfo.threeSrc[1] = item
                } else if (allInfo.numFlag % 3 === 2) {
                    allInfo.threeSrc[2] = item
                }
                allInfo.numFlag++
            }
            sessionStorage.setItem(event_code, JSON.stringify(allInfo))
            drawCanvas(allInfo.numberFlag )
        }

        //  绘制canvas
        function drawCanvas(num) {
            var v1 = null
            var v2 = null
            var v3 = null
            var canvas = document.getElementById("myCanvas")
            var ctx_canvas = canvas.getContext('2d')
            if(num === 1){
                v1 = document.getElementById(allInfo.oneSrc[0].dom)
            } else if(num === 2){
                v1 = document.getElementById(allInfo.twoSrc[0].dom)
                v2 = document.getElementById(allInfo.twoSrc[1].dom)
            } else {
                v1 = document.getElementById(allInfo.threeSrc[0].dom)
                v2 = document.getElementById(allInfo.threeSrc[1].dom)
                v3 = document.getElementById(allInfo.threeSrc[2].dom)
            }
            clearInterval(timerDraw)
            timerDraw = window.setInterval(() =>{
                if(num === 1){
                    ctx_canvas.drawImage(v1,0,0, canvas.width, canvas.height)
                } else if(num === 2){
                    ctx_canvas.drawImage(v1,v1.videoWidth/4,0,v1.videoWidth/2,v1.videoHeight,0,0, canvas.width/2, canvas.height)
                    ctx_canvas.drawImage(v2,v2.videoWidth/4,0,v2.videoWidth/2,v2.videoHeight,canvas.width/2,0, canvas.width/2, canvas.height)
                } else {
                    ctx_canvas.drawImage(v1,v1.videoWidth/4,0,v1.videoWidth/2,v1.videoHeight,0,0, canvas.width/2, canvas.height)
                    ctx_canvas.drawImage(v2,0,0,v2.videoWidth,v2.videoHeight,canvas.width/2,0, canvas.width/2, canvas.height/2)
                    ctx_canvas.drawImage(v3,0,0,v3.videoWidth,v3.videoHeight,canvas.width/2,canvas.height/2, canvas.width/2, canvas.height/2)
                }
            }, 20);

        }

        // 机位一二三快切-----------------------------------------------------------------------------------------------------
        $('#one-cut').on('click', function () {
            renderOne()
            $('#cameraOne').trigger('click')
            allInfo.update = 0
            sendInstruct()
        })
        $('#two-cut').on('click', function () {
            renderOne()
            $('#cameraTwo').trigger('click')
            allInfo.update = 0
            sendInstruct()
        })
        $('#three-cut').on('click', function () {
            renderOne()
            $('#cameraThree').trigger('click')
            allInfo.update = 0
            sendInstruct()
        })
        $('#four-cut').on('click', function () {
            renderOne()
            $('#cameraFour').trigger('click')
            allInfo.update = 0
            sendInstruct()
        })
        // 单机位时渲染dom
        function renderOne() {
            $('#one-merge').addClass('mergeActive').siblings('img').removeClass('mergeActive')
            allInfo.numberFlag = 1
            allInfo.numFlag = 0
        }
        // 直播耳机静音--------------------------------------------------------------------------------------------------
        $('#live-headset').on('click', function () {
            if (allInfo.liveHeadFlag) {
                $(this).attr('src', './../image/headset-close.png').css({
                    width: '24px',
                    height: '22px'
                })
                allInfo.liveHeadFlag = false
                domLiveRight.volume = 0 
    
            } else {
                allInfo.liveHeadFlag = true
                $(this).attr('src', './../image/headset-open.png').css({
                    width: '24px',
                    height: '18px'
                })
                domLiveRight.volume = 1
            }
            sessionStorage.setItem(event_code, JSON.stringify(allInfo))
        })

        // 渲染导播sessionStorage记录
        function renderHistory() {
            // 渲染一二三拼
            if (allInfo.numberFlag === 1) {
                $('#one-merge').addClass('mergeActive').siblings('img').removeClass('mergeActive')
            } else if (allInfo.numberFlag === 2) {
                $('#two-merge').addClass('mergeActive').siblings('img').removeClass('mergeActive')
            } else if (allInfo.numberFlag === 3) {
                $('#three-merge').addClass('mergeActive').siblings('img').removeClass('mergeActive')
            }
            drawCanvas(allInfo.numberFlag )

            // 直播耳机静音
            if (allInfo.liveHeadFlag) {
                $('#live-headset').attr('src', './../image/headset-open.png').css({
                    width: '24px',
                    height: '18px'
                })
                domLiveRight.volume = 1
            } else {
                $('#live-headset').attr('src', './../image/headset-close.png').css({
                    width: '24px',
                    height: '22px'
                })
                domLiveRight.volume = 0
            }
            // 一二三机位音量

            setTimeout(() => {
                slide_one.setValue(allInfo.oneMuteSize)
                slide_two.setValue(allInfo.twoMuteSize)
                slide_three.setValue(allInfo.threeMuteSize)
                slide_four.setValue(allInfo.fourMuteSize)
            }, 100)
            // 渲染手势检测
            if (allInfo.gestureFlag === Number(0)) {
                $('#gesture-btn').text('开启').css('background-color', '#ff914d')
            } else {
                $('#gesture-btn').text('关闭').css('background-color', '#f2591a')
            }
            // 渲染背景替换
            $('.bg-item').removeClass('bg-active').eq(allInfo.replaceFlag).addClass('bg-active')
        }
        // 手势检测-------------------------------------------------------------------------------------------------
        $('#gesture-btn').on('click', function () {
            if (allInfo.gestureFlag === Number(0)) {
                allInfo.gestureFlag = 1
                $(this).text('关闭').css('background-color', '#f2591a')
            } else {
                allInfo.gestureFlag = 0
                $(this).text('开启').css('background-color', '#ff914d')
            }
            sessionStorage.setItem(event_code, JSON.stringify(allInfo))
        })
        // 背景替换------------------------------------------------------------------------------------------------
        $('.bg-item').on('click', function () {
            $(this).addClass('bg-active').siblings().removeClass('bg-active')
            allInfo.replaceFlag = $(this).index()
            sessionStorage.setItem(event_code, JSON.stringify(allInfo))
        })

        // 添加模板--------------------------------------------------------------------------------------------------------------------------------

        // 获取比分牌样式
        function getScoreStyle() {
            $.ajax({
                type: 'GET',
                url: "http://www.cube.vip/event/score_card_style/",
                dataType: "json",
                async: false,
                headers: {
                    token: sessionStorage.getItem('token')
                },
                success: function (res) {
                    if (res.msg === 'success') {
                        res.data.forEach(item => {
                            if (item.category === 2) {
                                styleArr[0].push(item)
                            } else if (item.category === 1) {
                                styleArr[1].push(item)
                            } else if (item.category === 3) {
                                styleArr[2].push(item)
                            }
                        })

                        $('.styleTop img').each((ins, its) => {
                            $(its).attr('src', styleArr[0][ins].scorecardurl)
                        })
                    }
                }
            })
        }

        // 打开模板弹窗
        $('#select-model').on('click', function () {

            layer.open({
                type: 1,
                area: ['1170px', '722px'],
                title: ['比分牌设置', 'color:#fff;background-color:#FF914D;font-size: 20px;'],
                content: $('#scoreDialog'),
                shade: 0.3,
                shadeClose: false,
                scrollbar: false,
                move: false,
                cancel: function () {
                    recoverStyle()
                }
            })
        })

        $('#teamNameOne').on('input', function () {
            $('#nameLeft').show().text($.trim($(this).val()))
            teamInfo[0] = $.trim($(this).val())
        })

        $('#teamNameTwo').on('input', function () {
            $('#nameRight').show().text($.trim($(this).val()))
            teamInfo[1] = $.trim($(this).val())
        })


        // 选择球赛类别
        $('.selectGroup span').on('click', function () {
            $(this).addClass('selectCheck').siblings('span').removeClass('selectCheck')
            $('.styleTop').removeClass('styleCheck')
            typeIndex = $(this).index()
            var index = typeIndex
            $('.styleTop img').each((ins, its) => {
                $(its).attr('src', styleArr[index][ins].scorecardurl)
                if (typeIndex === selectTypeIndex && checkIndex === ins) {
                    $(its).parents('.styleTop').addClass('styleCheck')
                }
            })
        })

        $('.styleClass .styleTop').on('click', function () {
            $('.defaultInfo').hide()
            $('.styleTop').removeClass('styleCheck')
            $(this).addClass('styleCheck')
            selectTypeIndex = typeIndex
            checkIndex = Number($(this).attr('data-id'))
            renderStyle()
        })

        // 渲染比分牌样式
        function renderStyle() {
            var info = JSON.parse(styleArr[selectTypeIndex][checkIndex].description)
            var ossImg = new Image()
            ossImg.setAttribute('display', 'block')
            ossImg.setAttribute('id', 'ossImg')
            ossImg.setAttribute('src', styleArr[selectTypeIndex][checkIndex].scorecardurl)
            $('#areaCont').empty().show().append(ossImg)
            var img = new Image();
            var canvas2 = document.createElement('canvas');
            var ctx = canvas2.getContext('2d');
            img.crossOrigin = 'Anonymous';
            img.src = $('#ossImg').attr('src');
            img.onload = function () {
                canvas2.height = img.height;
                canvas2.width = img.width;
                ctx.drawImage(img, 0, 0);
                var dataURL = canvas2.toDataURL('image/png');
                $('#ossImg').attr('src', dataURL);
                canvas2 = null;
            }
            var logoLeft = new Image()
            logoLeft.setAttribute('id', 'logoLeft')
            $('#areaCont').append(logoLeft)

            var logoRight = new Image()
            logoRight.setAttribute('id', 'logoRight')
            $('#areaCont').append(logoRight)
            styleFlag = info.classify
            if (info.classify === 1) {
                if ($('#areaCont').hasClass('bottomCenter1')) {
                    $('#areaCont').removeClass('bottomCenter1').addClass('bottomCenter')
                    styleLocation = 5
                }
                $('#logoLeft').css({
                    display: 'none',
                    width: '40px',
                    height: '32px',
                    position: 'absolute',
                    left: info.logo_left[0] + 'px',
                    top: info.logo_left[1] + 'px',

                })
                $('#logoRight').css({
                    display: 'none',
                    width: '40px',
                    height: '32px',
                    position: 'absolute',
                    left: info.logo_right[0] + 3 + 'px',
                    top: info.logo_right[1] + 'px',

                })
                if (selectTypeIndex === 1 && checkIndex === 3) {
                    $('#logoLeft').css({
                        borderBottomLeftRadius: '25px',

                    })
                    $('#logoRight').css({
                        borderBottomRightRadius: '25px',

                    })

                } else if (selectTypeIndex === 2 && checkIndex === 0 || selectTypeIndex === 2 && checkIndex === 1) {
                    console.log(123)
                } else {
                    $('#logoLeft').css({
                        borderTopLeftRadius: '18px',
                        borderBottomLeftRadius: '18px',

                    })
                    $('#logoRight').css({
                        borderTopRightRadius: '18px',
                        borderBottomRightRadius: '18px',

                    })
                }
            } else {
                if ($('#areaCont').hasClass('bottomCenter')) {
                    $('#areaCont').removeClass('bottomCenter').addClass('bottomCenter1')
                    styleLocation = 6
                }
                $('#logoLeft').css({
                    display: 'none',
                    width: '32px',
                    height: '22px',
                    position: 'absolute',
                    left: info.logo_left[0] + 'px',
                    top: info.logo_left[1] - 1 + 'px',
                })
                $('#logoRight').css({
                    display: 'none',
                    width: '32px',
                    height: '22px',
                    position: 'absolute',
                    left: info.logo_right[0] + 'px',
                    top: info.logo_right[1] + 'px',
                })

                if (selectTypeIndex === 0 && checkIndex === 2) {
                    $('#logoLeft').css({
                        borderTopLeftRadius: '10px',
                    })
                } else if (selectTypeIndex === 2 && checkIndex === 2) {
                    $('#logoLeft').css({
                        left: info.logo_left[0] + 1 + 'px',

                    })
                    $('#logoRight').css({
                        top: info.logo_right[1] + 1 + 'px',
                        left: info.logo_right[0] + 1 + 'px',
                    })
                }
            }

            if (teamInfo[2] !== null) {
                $('#logoLeft').show().attr('src', teamInfo[2])
            }
            if (teamInfo[3] !== null) {
                $('#logoRight').show().attr('src', teamInfo[3])
            }
            var nameLeft = document.createElement('p')
            nameLeft.setAttribute('id', 'nameLeft')
            $('#areaCont').append(nameLeft)
            $('#nameLeft').css({
                width: '104px',
                height: '12px',
                position: 'absolute',
                left: info.team_name_left[0] + 'px',
                top: info.team_name_left[1] + 'px',
                fontSize: '12px',
                lineHeight: '10px',
                color: '#fff',
                fontFamily: 'Source Han Sans CN',
                fontWeight: 400,
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }).text(teamInfo[0])

            var nameRight = document.createElement('p')
            nameRight.setAttribute('id', 'nameRight')
            $('#areaCont').append(nameRight)
            $('#nameRight').css({
                width: '104px',
                height: '12px',
                position: 'absolute',
                left: info.team_name_right[0] + 'px',
                top: info.team_name_right[1] + 'px',
                fontSize: '12px',
                lineHeight: '10px',
                color: '#fff',
                fontFamily: 'Source Han Sans CN',
                fontWeight: 400,
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',

            }).text(teamInfo[1])

        }
        // 模板提交
        $('#scoreSave').on('click', function () {


            if ($.trim($('#teamNameOne').val()) <= 0) {
                layer.msg('请输入队名!')
                $('#teamNameOne').focus()
                return
            }
            if ($.trim($('#teamNameTwo').val()) <= 0) {
                layer.msg('请输入队名!')
                $('#teamNameTwo').focus()
                return
            }
            if (teamInfo[3] === null || teamInfo[2] === null) {
                layer.msg('请上传队伍logo!')
                return
            }

            if (selectTypeIndex === null && checkIndex === null) {
                layer.msg('请选择比分牌样式!')
                return
            }

            takeScreenshot()
            layer.closeAll()
            $('#score-shade').hide()

        })

        function takeScreenshot() {
            html2canvas(document.getElementById('areaCont'), {
                allowTaint: true,
                useCORS: true,
                backgroundColor: "transparent",
                onrendered: function (canvas) {
                    sessionStorage.setItem('score' + event_code, JSON.stringify({
                        src: canvas.toDataURL('image/png', 1.0),
                        location: styleLocation,
                        info: JSON.parse(styleArr[selectTypeIndex][checkIndex].description),
                        nameLeft: $.trim($('#teamNameOne').val()),
                        nameRight: $.trim($('#teamNameTwo').val()),
                        smallLeftScore: 0,
                        smallRightScore: 0,
                        bigLeftScore: 0,
                        bigRightScore: 0,
                        session: 1,
                        sessionFlag: false

                    }))
                    recoverStyle()
                    renderScore()
                },
                width: $("#areaCont").width(),
                height: $("#areaCont").height()
            })
        }

        // 渲染带比分的比分牌
        function renderScore() {
            if (sessionStorage.getItem('score' + event_code)) {
                $('#score-shade').hide()
                scoreData = JSON.parse(sessionStorage.getItem('score' + event_code))
                $('#left-name').text(scoreData.nameLeft)
                $('#right-name').text(scoreData.nameRight)
                $('#scene-num').text(scoreData.session)
                // 比分
                if (Number(scoreData.session) === 1) {
                    $('#left-score').val(scoreData.smallLeftScore)
                    $('#right-score').val(scoreData.smallRightScore)
                } else {
                    $('#left-score').val(scoreData.bigLeftScore)
                    $('#right-score').val(scoreData.bigRightScore)
                }
                var image = new Image()
                image.setAttribute('src', scoreData.src)
                image.setAttribute('id', 'model')
                image.style.width = '130px'
                $('#check-model').html(image)

                var imgs = new Image()
                imgs.setAttribute('src', scoreData.src)
                imgs.setAttribute('display', 'block')
                imgs.setAttribute('id', 'scoreBg')
                $('#scoreBrand').show().html(imgs)

                var imgBg = new Image();
                var canvas2 = document.createElement('canvas');
                var ctx = canvas2.getContext('2d');
                imgBg.crossOrigin = 'Anonymous';
                imgBg.src = $('#scoreBg').attr('src');
                imgBg.onload = function () {
                    canvas2.height = imgBg.height;
                    canvas2.width = imgBg.width;
                    ctx.drawImage(imgBg, 0, 0);
                    var dataURL = canvas2.toDataURL('image/png');
                    $('#scoreBg').attr('src', dataURL);
                    canvas2 = null;
                }
                $('#logo-radio1').removeAttr('disabled')
                $('#logo-radio2').removeAttr('disabled')
                $('#logo-radio3').removeAttr('disabled')
                $('#logo-radio4').removeAttr('disabled')
                if (scoreData.location === 1) {
                    scoreLocation = 1
                    $('#logo-radio1').attr('disabled', 'true')
                    $('#scoreBrand').removeClass('lbPosition rtPosition rbPosition bcPosition bc1Position').addClass('ltPosition')
                } else if (scoreData.location === 2) {
                    scoreLocation = 2
                    $('#logo-radio2').attr('disabled', 'true')
                    $('#scoreBrand').removeClass('ltPosition rtPosition rbPosition bcPosition bc1Position').addClass('lbPosition')
                } else if (scoreData.location === 3) {
                    scoreLocation = 3
                    $('#logo-radio3').attr('disabled', 'true')
                    $('#scoreBrand').removeClass('lbPosition ltPosition rbPosition bcPosition bc1Position').addClass('rtPosition')
                } else if (scoreData.location === 4) {
                    scoreLocation = 4
                    $('#logo-radio4').attr('disabled', 'true')
                    $('#scoreBrand').removeClass('lbPosition rtPosition ltPosition bcPosition bc1Position').addClass('rbPosition')
                } else if (scoreData.location === 5) {
                    scoreLocation = 5
                    $('#scoreBrand').removeClass('ltPosition lbPosition rtPosition rbPosition bc1Position').addClass('bcPosition')
                } else if (scoreData.location === 6) {
                    scoreLocation = 5
                    $('#scoreBrand').removeClass('ltPosition lbPosition rtPosition rbPosition bcPosition').addClass('bc1Position')
                }
                form.render('radio')
                var liveScoreLeft = document.createElement('p')
                liveScoreLeft.setAttribute('id', 'liveScoreLeft')
                $('#scoreBrand').append(liveScoreLeft)
                $('#liveScoreLeft').css({
                    width: '30px',
                    height: '12px',
                    position: 'absolute',
                    fontSize: '12px',
                    color: '#fff',
                    fontFamily: 'Source Han Sans CN',
                    fontWeight: 400,
                }).text(scoreData.smallLeftScore)

                var liveScoreRight = document.createElement('p')
                liveScoreRight.setAttribute('id', 'liveScoreRight')
                $('#scoreBrand').append(liveScoreRight)
                $('#liveScoreRight').css({
                    width: '30px',
                    height: '12px',
                    position: 'absolute',
                    fontSize: '12px',
                    color: '#fff',
                    fontFamily: 'Source Han Sans CN',
                    fontWeight: 400,
                }).text(scoreData.smallRightScore)


                if (scoreData.info.classify === 1) {
                    $('#liveScoreLeft').css({
                        textAlign: 'center',
                        left: scoreData.info.score_left[0] + 'px',
                        top: scoreData.info.score_left[1] + 'px',
                    })

                    $('#liveScoreRight').css({
                        textAlign: 'center',
                        left: scoreData.info.score_right[0] + 'px',
                        top: scoreData.info.score_right[1] + 'px',
                    })
                } else {

                    $('#liveScoreLeft').css({
                        textAlign: 'left',
                        width: '20px',
                        lineHeight: '8px',
                        left: scoreData.info.score_small_left[0] + 'px',
                        top: scoreData.info.score_small_left[1] + 'px',
                    })
                    $('#liveScoreRight').css({
                        textAlign: 'left',
                        width: '20px',
                        lineHeight: '8px',
                        left: scoreData.info.score_small_right[0] + 'px',
                        top: scoreData.info.score_small_right[1] + 'px',
                    })

                    var liveBigScoreLeft = document.createElement('p')
                    liveBigScoreLeft.setAttribute('id', 'liveBigScoreLeft')
                    $('#scoreBrand').append(liveBigScoreLeft)
                    $('#liveBigScoreLeft').css({
                        display: 'none',
                        width: '30px',
                        height: '14px',
                        lineHeight: '10px',
                        position: 'absolute',
                        left: scoreData.info.score_big_left[0] + 'px',
                        top: scoreData.info.score_big_left[1] + 'px',
                        fontSize: '14px',
                        color: '#fff',
                        fontFamily: 'Source Han Sans CN',
                        fontWeight: 400,
                    }).text(scoreData.bigLeftScore)

                    var liveBigScoreRight = document.createElement('p')
                    liveBigScoreRight.setAttribute('id', 'liveBigScoreRight')
                    $('#scoreBrand').append(liveBigScoreRight)
                    $('#liveBigScoreRight').css({
                        display: 'none',
                        width: '30px',
                        height: '14px',
                        lineHeight: '10px',
                        position: 'absolute',
                        left: scoreData.info.score_big_right[0] + 'px',
                        top: scoreData.info.score_big_right[1] + 'px',
                        fontSize: '14px',
                        color: '#fff',
                        fontFamily: 'Source Han Sans CN',
                        fontWeight: 400,
                    }).text(scoreData.bigRightScore)

                    if (scoreData.sessionFlag) {
                        $('#liveBigScoreRight').show()
                        $('#liveBigScoreLeft').show()
                    }
                }
                setTimeout(() => {
                    saveScoreBrand()
                }, 0)
            }
        }
        // 渲染带比分的历史记录比分牌
        function renderHistoryScore() {
            if (sessionStorage.getItem('score' + event_code)) {
                $('#score-shade').hide()
                scoreData = JSON.parse(sessionStorage.getItem('score' + event_code))
                $('#left-name').text(scoreData.nameLeft)
                $('#right-name').text(scoreData.nameRight)
                $('#scene-num').text(scoreData.session)
                // 比分
                if (Number(scoreData.session) === 1) {
                    $('#left-score').val(scoreData.smallLeftScore)
                    $('#right-score').val(scoreData.smallRightScore)
                } else {
                    $('#left-score').val(scoreData.bigLeftScore)
                    $('#right-score').val(scoreData.bigRightScore)
                }
                var image = new Image()
                image.setAttribute('src', scoreData.src)
                image.setAttribute('id', 'model')
                image.style.width = '130px'
                $('#check-model').html(image)

                var imgs = new Image()
                imgs.setAttribute('src', scoreData.src)
                imgs.setAttribute('display', 'block')
                imgs.setAttribute('id', 'scoreBg')
                $('#scoreBrand').show().html(imgs)

                var imgBg = new Image();
                var canvas2 = document.createElement('canvas');
                var ctx = canvas2.getContext('2d');
                imgBg.crossOrigin = 'Anonymous';
                imgBg.src = $('#scoreBg').attr('src');
                imgBg.onload = function () {
                    canvas2.height = imgBg.height;
                    canvas2.width = imgBg.width;
                    ctx.drawImage(imgBg, 0, 0);
                    var dataURL = canvas2.toDataURL('image/png');
                    $('#scoreBg').attr('src', dataURL);
                    canvas2 = null;
                }
                $('#logo-radio1').removeAttr('disabled')
                $('#logo-radio2').removeAttr('disabled')
                $('#logo-radio3').removeAttr('disabled')
                $('#logo-radio4').removeAttr('disabled')
                if (scoreData.location === 1) {
                    scoreLocation = 1
                    $('#logo-radio1').attr('disabled', 'true')
                    $('#scoreBrand').removeClass('lbPosition rtPosition rbPosition bcPosition bc1Position').addClass('ltPosition')
                } else if (scoreData.location === 2) {
                    scoreLocation = 2
                    $('#logo-radio2').attr('disabled', 'true')
                    $('#scoreBrand').removeClass('ltPosition rtPosition rbPosition bcPosition bc1Position').addClass('lbPosition')
                } else if (scoreData.location === 3) {
                    scoreLocation = 3
                    $('#logo-radio3').attr('disabled', 'true')
                    $('#scoreBrand').removeClass('lbPosition ltPosition rbPosition bcPosition bc1Position').addClass('rtPosition')
                } else if (scoreData.location === 4) {
                    scoreLocation = 4
                    $('#logo-radio4').attr('disabled', 'true')
                    $('#scoreBrand').removeClass('lbPosition rtPosition ltPosition bcPosition bc1Position').addClass('rbPosition')
                } else if (scoreData.location === 5) {
                    scoreLocation = 5
                    $('#scoreBrand').removeClass('ltPosition lbPosition rtPosition rbPosition bc1Position').addClass('bcPosition')
                } else if (scoreData.location === 6) {
                    scoreLocation = 5
                    $('#scoreBrand').removeClass('ltPosition lbPosition rtPosition rbPosition bcPosition').addClass('bc1Position')
                }
                form.render('radio')
                var liveScoreLeft = document.createElement('p')
                liveScoreLeft.setAttribute('id', 'liveScoreLeft')
                $('#scoreBrand').append(liveScoreLeft)
                $('#liveScoreLeft').css({
                    width: '30px',
                    height: '12px',
                    position: 'absolute',
                    fontSize: '12px',
                    color: '#fff',
                    fontFamily: 'Source Han Sans CN',
                    fontWeight: 400,
                }).text(scoreData.smallLeftScore)

                var liveScoreRight = document.createElement('p')
                liveScoreRight.setAttribute('id', 'liveScoreRight')
                $('#scoreBrand').append(liveScoreRight)
                $('#liveScoreRight').css({
                    width: '30px',
                    height: '12px',
                    position: 'absolute',
                    fontSize: '12px',
                    color: '#fff',
                    fontFamily: 'Source Han Sans CN',
                    fontWeight: 400,
                }).text(scoreData.smallRightScore)


                if (scoreData.info.classify === 1) {
                    $('#liveScoreLeft').css({
                        textAlign: 'center',
                        left: scoreData.info.score_left[0] + 'px',
                        top: scoreData.info.score_left[1] + 'px',
                    })

                    $('#liveScoreRight').css({
                        textAlign: 'center',
                        left: scoreData.info.score_right[0] + 'px',
                        top: scoreData.info.score_right[1] + 'px',
                    })
                } else {

                    $('#liveScoreLeft').css({
                        textAlign: 'left',
                        width: '20px',
                        lineHeight: '8px',
                        left: scoreData.info.score_small_left[0] + 'px',
                        top: scoreData.info.score_small_left[1] + 'px',
                    })
                    $('#liveScoreRight').css({
                        textAlign: 'left',
                        width: '20px',
                        lineHeight: '8px',
                        left: scoreData.info.score_small_right[0] + 'px',
                        top: scoreData.info.score_small_right[1] + 'px',
                    })

                    var liveBigScoreLeft = document.createElement('p')
                    liveBigScoreLeft.setAttribute('id', 'liveBigScoreLeft')
                    $('#scoreBrand').append(liveBigScoreLeft)
                    $('#liveBigScoreLeft').css({
                        display: 'none',
                        width: '30px',
                        height: '14px',
                        lineHeight: '10px',
                        position: 'absolute',
                        left: scoreData.info.score_big_left[0] + 'px',
                        top: scoreData.info.score_big_left[1] + 'px',
                        fontSize: '14px',
                        color: '#fff',
                        fontFamily: 'Source Han Sans CN',
                        fontWeight: 400,
                    }).text(scoreData.bigLeftScore)

                    var liveBigScoreRight = document.createElement('p')
                    liveBigScoreRight.setAttribute('id', 'liveBigScoreRight')
                    $('#scoreBrand').append(liveBigScoreRight)
                    $('#liveBigScoreRight').css({
                        display: 'none',
                        width: '30px',
                        height: '14px',
                        lineHeight: '10px',
                        position: 'absolute',
                        left: scoreData.info.score_big_right[0] + 'px',
                        top: scoreData.info.score_big_right[1] + 'px',
                        fontSize: '14px',
                        color: '#fff',
                        fontFamily: 'Source Han Sans CN',
                        fontWeight: 400,
                    }).text(scoreData.bigRightScore)

                    if (scoreData.sessionFlag) {
                        $('#liveBigScoreRight').show()
                        $('#liveBigScoreLeft').show()
                    }
                }
            }
        }
        // 保存比分状态
        function saveScoreLocal() {
            sessionStorage.setItem('score' + event_code, JSON.stringify(scoreData))
        }

        // 恢复比分牌默认样式
        function recoverStyle() {
            $('.defaultInfo').show()
            $('#areaCont').empty().hide().removeClass('rightTop leftTop  rightBottom bottomCenter bottomCenter1').addClass('leftBottom')

            $('.styleTop').removeClass('styleCheck')

            $('.selectGroup span').removeClass('selectCheck')

            $('#pingpang').addClass('selectCheck')

            $('.styleTop img').each((ins, its) => {
                $(its).attr('src', styleArr[0][ins].scorecardurl)
            })

            $('#teamNameOne').val('')

            $('#teamNameTwo').val('')

            $('.uploadIcon').show()
            $('#left-logo').removeAttr('src').hide()
            $('#right-logo').removeAttr('src').hide()


            // 当前分类下标
            typeIndex = 0
            // 选中分类下标
            selectTypeIndex = null
            // 选中样式下标
            checkIndex = null
            // 队伍昵称 logo
            teamInfo = [null, null, null, null]

            //记录比分牌样式
            styleFlag = null
            // 记录位置
            styleLocation = 2

            $("#scoreLocation2").prop('checked', true)
            form.render()

            clarity.setValue(100)
            $('.clarityPercentage').text(100 + '%')

        }
        // 复位
        $('#reset').on('click', function () {
            // 比分
            $('#left-score').val(0)
            $('#right-score').val(0)
            // 小计
            $('#left-subtotal').text(0)
            $('#right-subtotal').text(0)
            // 场记
            $('#scene-num').text(1)
            //  队名
            $('#left-name').text('队名')
            $('#right-name').text('队名')
            $('#check-model').empty('')
            $('#scoreBrand').empty('').hide()
            $('#score-shade').show()
            fileScore = 0
            allInfo.state = 'off'
            scoreLocation = 0
            sessionStorage.removeItem('score' + event_code)
            sessionStorage.removeItem('imageBase64' + event_code)
            $('#logo-radio1').removeAttr('disabled')
            $('#logo-radio2').removeAttr('disabled')
            $('#logo-radio3').removeAttr('disabled')
            $('#logo-radio4').removeAttr('disabled')
            form.render('radio')
        })
        // 保存有比分的比分牌
        function saveScoreBrand() {
            html2canvas(document.getElementById('scoreBrand'), {
                allowTaint: true,
                useCORS: true,
                backgroundColor: "transparent",
                onrendered: function (canvas) {
                    fileScore = canvas.toDataURL('image/png', 1.0)
                    allInfo.state = 'on'
                    sessionStorage.setItem('imageBase64' + event_code, canvas.toDataURL('image/png', 1.0))
                    allInfo.update = 1
                    sendInstruct()

                },
                width: $("#scoreBrand").width(),
                height: $("#scoreBrand").height()
            })
        }
        // 场记加减-----------------------------------------------------------------------------------------------------------------------
        $('#scene-plus').on('click', function () {
            if (scoreData.info.classify === 1) {
                $('#scene-num').text(1)
            } else {
                $('#scene-num').text(2)
                $('#liveBigScoreLeft').show()
                $('#liveBigScoreRight').show()
                $('#left-score').val($('#liveBigScoreLeft').text())
                $('#right-score').val($('#liveBigScoreRight').text())
                scoreData.session = 2
                scoreData.sessionFlag = true
                saveScoreLocal()

            }
            saveScoreBrand()
        })
        $('#scene-minus').on('click', function () {
            $('#left-score').val($('#liveScoreLeft').text())
            $('#right-score').val($('#liveScoreRight').text())
            $('#scene-num').text(1)
            scoreData.session = 1
            saveScoreLocal()
        })

        // 左边队伍加减比分---------------------------------------------------------------------------------------------------

        // 比分输入框限制只能输入数字
        $('#left-score').on('input', function () {
            var num = $(this).val().replace(/[^\d]/g, '')
            renderSmallLeftScore(num)
        })

        // 三分加减
        $('#left-three-plus').on('click', function () {
            var num = Number($('#left-score').val()) + 3
            renderSmallLeftScore(num)
        })
        $('#left-three-minus').on('click', function () {
            var num = Number($('#left-score').val()) - 3
            renderSmallLeftScore(num)
        })

        // 二分加减
        $('#left-two-plus').on('click', function () {
            var num = Number($('#left-score').val()) + 2
            renderSmallLeftScore(num)
        })
        $('#left-two-minus').on('click', function () {
            var num = Number($('#left-score').val()) - 2
            renderSmallLeftScore(num)
        })

        // 一分加减
        $('#left-one-plus').on('click', function () {
            var num = Number($('#left-score').val()) + 1
            renderSmallLeftScore(num)
        })
        $('#left-one-minus').on('click', function () {
            var num = Number($('#left-score').val()) - 1
            renderSmallLeftScore(num)
        })

        function renderSmallLeftScore(num) {
            if (num > 999) {
                num = 999
            } else if (num < 0) {
                num = 0
            }

            $('#left-score').val(num)
            if (scoreData.session === 1) {
                $('#liveScoreLeft').text(num)
                scoreData.smallLeftScore = num
            } else {
                $('#liveBigScoreLeft').text(num)
                scoreData.bigLeftScore = num
            }
            saveScoreLocal()
            saveScoreBrand()
        }

        // 左边队伍加减小计
        $('#left-subtotal-plus').on('click', function () {
            $('#left-subtotal').text(Number($('#left-subtotal').text()) + 1)
        })
        $('#left-subtotal-minus').on('click', function () {
            if (Number($('#left-subtotal').text()) - 1 <= 0) {
                $('#left-subtotal').text(0)
            } else {
                $('#left-subtotal').text(Number($('#left-subtotal').text()) - 1)
            }
        })


        // 右边队伍加减比分---------------------------------------------------------------------------------------------------
        // 比分输入框限制只能输入数字
        $('#right-score').on('input', function () {
            var num = $(this).val().replace(/[^\d]/g, '')
            renderSmallRightScore(num)
        })

        // 三分加减
        $('#right-three-plus').on('click', function () {
            var num = Number($('#right-score').val()) + 3
            renderSmallRightScore(num)
        })
        $('#right-three-minus').on('click', function () {
            var num = Number($('#right-score').val()) - 3
            renderSmallRightScore(num)
        })

        // 二分加减
        $('#right-two-plus').on('click', function () {
            var num = Number($('#right-score').val()) + 2
            renderSmallRightScore(num)
        })
        $('#right-two-minus').on('click', function () {
            var num = Number($('#right-score').val()) - 2
            renderSmallRightScore(num)
        })

        // 一分加减
        $('#right-one-plus').on('click', function () {
            var num = Number($('#right-score').val()) + 1
            renderSmallRightScore(num)
        })
        $('#right-one-minus').on('click', function () {
            var num = Number($('#right-score').val()) - 1
            renderSmallRightScore(num)
        })

        function renderSmallRightScore(num) {
            if (num > 999) {
                num = 999
            } else if (num < 0) {
                num = 0
            }
            $('#right-score').val(num)

            if (scoreData.session === 1) {
                $('#liveScoreRight').text(num)
                scoreData.smallRightScore = num
            } else {
                $('#liveBigScoreRight').text(num)
                scoreData.bigRightScore = num
            }
            saveScoreLocal()
            saveScoreBrand()
        }

        // 右边队伍加减小计
        $('#right-subtotal-plus').on('click', function () {
            $('#right-subtotal').text(Number($('#right-subtotal').text()) + 1)
        })
        $('#right-subtotal-minus').on('click', function () {
            if (Number($('#right-subtotal').text()) - 1 <= 0) {
                $('#right-subtotal').text(0)
            } else {
                $('#right-subtotal').text(Number($('#right-subtotal').text()) - 1)
            }
        })

        // 切换往后台发数据
        $('#switchover').on('click', function () {
            allInfo.update = 0
            sendInstruct()
        })

        function sendInstruct() {
            // 视频一拼二品三拼标志
            var oneSpell = 0
            var twoSpell = 0
            var threeSpell = 0
            // 机位顺序
            var cameraOrder = []
            if (allInfo.numberFlag === 1) {
                oneSpell = 1
                allInfo.oneSrc.forEach(item => {
                    cameraOrder.push(item.name)
                })
            } else if (allInfo.numberFlag === 2) {
                twoSpell = 1
                allInfo.twoSrc.forEach(item => {
                    cameraOrder.push(item.name)
                })
                if (cameraOrder[0] === cameraOrder[1]) {
                    layer.msg('机位重复,请重新选择!')
                    return
                }
            } else if (allInfo.numberFlag === 3) {
                threeSpell = 1
                allInfo.threeSrc.forEach(item => {
                    cameraOrder.push(item.name)
                })
                if (cameraOrder[0] === cameraOrder[1] || cameraOrder[0] === cameraOrder[2] || cameraOrder[2] === cameraOrder[1]) {
                    layer.msg('机位重复,请重新选择!')
                    return
                }
            }

            //机位音量


            var info = {
                code: "FRONT_END_ACTION",
                // 视频一拼二品三拼标志 true/false
                video: {
                    mixer: {
                        oneSpell: oneSpell,
                        twoSpell: twoSpell,
                        threeSpell: threeSpell,
                        // 机位顺序
                        cameraOrder: cameraOrder,
                    },
                    score: {
                        state: allInfo.state,
                        update: allInfo.update,
                        scoreLocation: scoreLocation
                    }
                },
                audio: {
                    mixer: {
                        // 机位音量
                        oneVolume: allInfo.oneMuteSize / 10,
                        twoVolume: allInfo.twoMuteSize / 10,
                        threeVolume: allInfo.threeMuteSize / 10,
                        fourVolume: allInfo.fourMuteSize / 10
                    }
                }
            }
            var formData = new FormData()
            formData.append('file', fileScore)
            formData.append('stream_code', event_code)
            formData.append('json_data', JSON.stringify(info))
            $.ajax({
                type: "POST",
                url: 'http://www.cube.vip/director/director_instruct/',
                dataType: "json",
                headers: {
                    token: sessionStorage.getItem('token')
                },
                processData: false,
                contentType: false,
                data: formData
            })
        }

        // WebSocket聊天室--------------------------------------------------------------------------------------------------
        const chatSocket = new WebSocket(
            'ws://' +
            'www.cube.vip' +
            '/ws/chat/' +
            event_uri_key +
            '/'
        );
        chatSocket.onmessage = function (e) {
            chatNum++
            $('.chatNum').text(chatNum)
            const data = JSON.parse(e.data);
            var message = data.message.split("-")
            if (message[0] === 'admin') {
                var str = `
				<div class="chatList">
					<img src="${message[2]}" class="userImage">
					<div class="chatRight">
						<p class="userName" style="color:#FF914D">管理员</p>
						<p class="chatMessage">${message[3]}</p>
					</div>
					<div class="deleteChat" data-id="${message[4]}">删除</div>
				</div>
				`
            } else {
                var str = `
				<div class="chatList">
					<img src="${message[2]}" class="userImage">
					<div class="chatRight">
						<p class="userName">${message[1]}</p>
						<p class="chatMessage">${message[3]}</p>
					</div>
					<div class="deleteChat" data-id="${message[4]}">删除</div>
				</div>
				`
            }

            $('.chatContent').append(str)
            $('.chatContent').scrollTop($('.chatContent')[0].scrollHeight)
        };

        chatSocket.onclose = function (e) {
            console.error('Chat socket closed unexpectedly');
        };
        // 发送消息
        $('#chat-message-submit').on('click', function () {
            if ($.trim($('#chat-message-input').val()).length > 0) {
                chatSocket.send(JSON.stringify({
                    'message': 'admin-' + userName + '-' + userImage + '-' + $(
                        '#chat-message-input').val()
                }))
            }
            $('#chat-message-input').val('')
        })

        $('#chat-message-input').on('keypress', function (event) { // 监听回车事件
            if (event.keyCode == "13") {
                if ($.trim($(this).val()).length > 0) {
                    chatSocket.send(JSON.stringify({
                        'message': 'admin-' + userName + '-' + userImage + '-' + $(this).val()
                    }))
                }
                $(this).val('')
            }
        })

        // 删除消息
        $('.chatContent').on('click', '.deleteChat', function () {
            $.ajax({
                type: 'POST',
                url: "http://www.cube.vip/chatting/delete_chat/",
                dataType: "json",
                headers: {
                    token: sessionStorage.getItem('token')
                },
                async: false,
                data: {
                    chat_id: $(this).attr('data-id')
                },
                success: res => {
                    if (res.msg === 'success') {
                        layer.msg('删除成功!')
                        chatNum--
                        $('.chatNum').text(chatNum)
                        $(this).parents('.chatList').remove()
                    } else {
                        layer.msg('删除失败,请重试!')
                    }
                }
            })
        })
    })



    // 复制链接
    var btn = document.querySelectorAll('.head-copy');

    var clipboard = new ClipboardJS(btn);

    clipboard.on('success', function (e) {
        layer.msg('复制成功!');
    });

    clipboard.on('error', function (e) {
        layer.msg('复制失败,请重试!');
    });
})