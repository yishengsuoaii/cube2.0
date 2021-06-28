$(function () {
    if (!sessionStorage.getItem('token')) {
        window.location.href = "./../login.html"
    }
    let searchData = window.location.search.substring(1).split("=")[1]

    if (searchData === '' || searchData === undefined) {
        window.location.href = "./../html/home.html"
    }
    var event_id = searchData;

    // 频道设置切换侧边栏
    $('.aside-list').on('click', function () {
        $(this).addClass('active-aside').siblings('li').removeClass('active-aside')
        $('.channel-set-item').hide().eq($(this).index()).show()
        h5_videoJs.pause()
    })

    // 在线人数
    var numberFlag = 'True'
    var onLine = 1

    // 定时器
    var timers = null
    var countDownFlag = 'True'
    var countDownOrientation = 0

    // 加密
    var codeFlag = 'True'


    var allData = []
    var checkId = 3

    var adFlag = 'True'
    let imageFile = ''

    // 所有视频
    var previewFlag = 'False'
    let allVideoData = []
    // 过滤所有视频
    let filterVideoData = []
    // 暂时频道添加视频预告
    let videoUrl = null
    let videoCode = null
    var h5_videoJs = ''
    // 是否已经添加过预览视频标志
    var previewNull = true
    
    // h5模板
    var h5_check_id = ''
    var h5_all_data = []

    // 1 是添加视频预告,2是添加转场视频
    var differenceFlag = 1
    // 转场视频
    // var addVideoSrc = ''
    // var addVideoJs = videojs('cameraSix', {
    //     muted: false,
    //     controls: true,
    //     // controlBar: false, 
    //     controlBar: {
    //         fullscreenToggle: false,
    //         pictureInPictureToggle: false,
    //         remainingTimeDisplay: false,//隐藏剩余时间
    //       },
    //     preload: 'auto',
    //     width: '224',
    //     height: "126",
    // })

    layui.use(['form', 'element', 'jquery', 'layer', 'upload','laydate'], function () {
        var form = layui.form;
        var element = layui.element;
        var layer = layui.layer;
        var jquery = layui.jquery;
        var upload = layui.upload;
        var laydate = layui.laydate;
        // 视频预告------------------------------------------------------------------------------------------------------------------
        form.on('switch(preview-open)', function (data) {
            if (data.elem.checked) {
                previewFlag = 'True'
            } else {
                previewFlag = 'False'
            }
            
        })
        // 获取视频预告
        $.ajax({
            type: "GET",
            dataType: "json",
            async: false,
            headers: {
                token: sessionStorage.getItem('token')
            },
            url: "http://www.cube.vip/video_editing/get_thumbnails/",
            data: {
                event_id: event_id
            },
            success: function (res) {
                if (res.msg === 'success') {
                   if(res.data.event_playback_flag) {
                    previewFlag = 'True'
                    $("#preview-open").attr('checked', 'checked');
                   } else{
                    previewFlag = 'False'
                    $("#preview-open").removeAttr('checked');
                   }
                   if(res.data.event_playback_uri!==null) {
                    previewNull = false
                    h5_videoJs = new Aliplayer({
                        "id": "viewVideos",
                        "source": res.data.event_playback_uri,
                        "width": "7.5rem",
                        "height": "4.22rem",
                        "autoplay": false,
                        "isLive": false,
                        "rePlay": false,
                        "playsinline": true,
                        "preload": true,
                        "controlBarVisibility": "hover",
                        "useH5Prism": true,
                      })
                      h5_videoJs.setVolume(0)
                   }
                    form.render('checkbox')
                }
                
            }
        })
        $('.preview_select').on('click', function () {
            differenceFlag = 1
            $.ajax({
                type: "GET",
                dataType: "json",
                async: false,
                headers: {
                    token: sessionStorage.getItem('token')
                },
                url: "http://www.cube.vip/video/video_list/",
                data: {
                    save_flag: 'media_library'
                },
                success: function (res) {
                    if (res.msg === 'success') {
                        allVideoData = res.data
                    } else {
                        layer.msg('获取视频列表失败,请重试!');
                    }
                }
            })
            videoCode = null
            $('.check-video-num').text(0)
            layer.open({
                type: 1,
                area: ['10rem', '7.3rem'],
                title: '添加视频',
                content: $('#video-dialog'),
                shade: 0.3,
                shadeClose: true,
                closeBtn: 1,
                resize: false,
                scrollbar: false,
                move:false,
                btn: ['确认', '取消'],
				btn1: function () {
                    if (videoCode === null) {
                        layer.msg('请选择视频!')
                        return
                    }
                    
                    layer.closeAll()
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        async: false,
                        url: "http://www.cube.vip/video/video_code_to_uri/",
                        data: {
                            video_code: videoCode
                        },
                        headers: {
                            token: sessionStorage.getItem('token')
                        },
                        success: res => {
                            if (res.msg === 'success') {
                               
                                if(differenceFlag  === 1) {
                                    if(previewNull){
                                        previewNull = false
                                        h5_videoJs = new Aliplayer({
                                            "id": "viewVideos",
                                            "source": res.data.video_rui,
                                            "width": "7.5rem",
                                            "height": "4.22rem",
                                            "autoplay": false,
                                            "isLive": false,
                                            "rePlay": false,
                                            "playsinline": true,
                                            "preload": true,
                                            "controlBarVisibility": "hover",
                                            "useH5Prism": true,
                                        })
                                        h5_videoJs.setVolume(0)
                                    } else {
                                        h5_videoJs.loadByUrl(res.data.video_rui)
                                    }
                                    videoUrl = res.data.video_rui
                                }
                                
                            } else {
                                layer.msg('获取视频失败,请重试!')
                            }
                        }
                    })
				},
				end:function(){
					$('.search-video-input').val('')
				}
            })
            videoFiltrate()

        })

        $('#addChangeVideo').on('click', function () {
            differenceFlag = 2
            $.ajax({
                type: "GET",
                dataType: "json",
                async: false,
                headers: {
                    token: sessionStorage.getItem('token')
                },
                url: "http://www.cube.vip/video/video_list/",
                data: {
                    save_flag: 'media_library'
                },
                success: function (res) {
                    if (res.msg === 'success') {
                        allVideoData = res.data
                    } else {
                        layer.msg('获取视频列表失败,请重试!');
                    }
                }
            })
            videoCode = null
            $('.check-video-num').text(0)
            layer.open({
                type: 1,
                area: ['10rem', '7.3rem'],
                title: '添加视频',
                content: $('#video-dialog'),
                shade: 0.3,
                shadeClose: true,
                closeBtn: 1,
                resize: false,
                scrollbar: false,
                move:false,
                btn: ['确认', '取消'],
				btn1: function () {
                    if (videoCode === null) {
                        layer.msg('请选择视频!')
                        return
                    }
                    
                    layer.closeAll()
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        async: false,
                        url: "http://www.cube.vip/video/video_code_to_uri/",
                        data: {
                            video_code: videoCode
                        },
                        headers: {
                            token: sessionStorage.getItem('token')
                        },
                        success: res => {
                            if (res.msg === 'success') {
                               
                                if(differenceFlag  === 1) {
                                    if(previewNull){
                                        previewNull = false
                                        h5_videoJs = new Aliplayer({
                                            "id": "viewVideos",
                                            "source": res.data.video_rui,
                                            "width": "7.5rem",
                                            "height": "4.22rem",
                                            "autoplay": false,
                                            "isLive": false,
                                            "rePlay": false,
                                            "playsinline": true,
                                            "preload": true,
                                            "controlBarVisibility": "hover",
                                            "useH5Prism": true,
                                        })
                                    } else {
                                        h5_videoJs.loadByUrl(res.data.video_rui)
                                    }
                                    videoUrl = res.data.video_rui
                                }
                                
                            } else {
                                layer.msg('获取视频失败,请重试!')
                            }
                        }
                    })
				},
				end:function(){
					$('.search-video-input').val('')
				}
            })
            videoFiltrate()

        })

        //视频 选中 取消 change
        form.on('radio(video-checkbox)', function (data) {
            $('.vd-content-main-list-check').removeProp('checked')
            form.render('radio')
            var videoId = Number(data.value)
            videoCode = data.elem.dataset.value
            $('.check-video-num').text(1) //选中+1
            allVideoData.forEach(item => { //选中 添加标记
                if (item.video_id === videoId) {
                    item.checked = 'checked'
                } else {
                    delete item.checked
                }
            })
        })


        // 视频分页
        function videoPage(pageIndex) {
            var str = ''
            var length = filterVideoData.length > pageIndex * 6 ? 6 : filterVideoData.length - (pageIndex - 1) * 6
            for (var i = 0; i < length; i++) {
                var index = i + (pageIndex - 1) * 6
                str += `<div class="vd-content-main-list"><img src="${filterVideoData[index].video_description_image}" onerror="this.src='./../image/video-page.png'" class="vd-video"><div class="vd-content-main-list-info">
				<span class="vd-content-main-list-name">${filterVideoData[index].video_profile}</span>
				<span class="vd-content-main-list-time">上传时间: <i>${filterVideoData[index].video_create_time}</i></span>
				<span class="vd-content-main-list-num">观看量: <i>${filterVideoData[index].video_number_views}</i> 次</span>
                </div>
                <div class="layui-form video-right-check">
                <input type="radio" name="preview" lay-filter="video-checkbox" data-value="${filterVideoData[index].video_code}"  class="vd-content-main-list-check" value="${filterVideoData[index].video_id}" ${filterVideoData[index].checked}/></div>
                </div>
			    `
            }
            if (filterVideoData.length > 0) {
                $('.vd-content-main-top').html(str)
                
                form.render('radio')
            } else {
                $('.vd-content-main-top').html(
                    `<div class="vd-content-main-none"><img src="./../image/video-none.png" alt=""><p>当前没有视频哦</p></div>
                    <span class="mediaUpload">
                        没有合适的视频？
                        <a href="./media.html">去媒体库上传</a>
                    </span>
                    `
                )
               
            }
        }
        // 视频筛选---------
        $('.search-video-input').on('keypress', function (event) { // 监听回车事件
            if (event.keyCode == "13") {
                videoFiltrate()
            }
        })
        $('.search-video-btn').on('click', videoFiltrate) //点击搜索按钮
        // 视频过滤方法
        function videoFiltrate() {
            filterVideoData = allVideoData.filter(item => item.video_profile.search($.trim($('.search-video-input')
                .val())) !== -1)
            if (filterVideoData.length > 6) {
                layui.use(['laypage'], function () {
                    var laypage = layui.laypage
                    laypage.render({
                        elem: 'video-page',
                        count: filterVideoData.length,
                        limit: 6,
                        layout: ['prev', 'next'],
                        jump: function (obj, first) {
                            if (!first) {
                                // layer.msg('第 '+ obj.curr +' 页'+',每页显示'+obj.limit+'条');
                                videoPage(obj.curr)
                            }
                        }
                    })
                })
            } else {
                $('#video-page').empty()
            }
            videoPage(1)
        }

        // 提交
        $('.previewVideo-btn').on('click',function(){
            $.ajax({
                type: "POST",
                dataType: "json",
                async: false,
                headers: {
                    token: sessionStorage.getItem('token')
                },
                url: "http://www.cube.vip/video_editing/get_thumbnails/",
                data: {
                    event_id: event_id,
                    event_playback_flag: previewFlag,
                    video_uri : videoUrl
                },
                success: function (res) {
                    if (res.msg === 'success') {
                        layer.msg('提交成功!');
                    } else {
                        layer.msg('提交失败,请重试!');
                    }
                }
            })
        })

        // 上传直播背景 
        upload.render({
            elem: '#live-bg-upload',
            type: "POST",
            url: 'http://www.cube.vip/event/event_video_cover_page/',
            data: {
                event_id: event_id
            },
            headers: {
                token: sessionStorage.getItem('token')
            },
            size: 1024 * 2,
            done: function (res) {
                //如果上传失败
                if (res.msg === 'success') {
                    layer.msg('上传成功!');
                    $('#live-bg-cover').attr('src', res.data.event_video_cover_page + '?' +
                        new Date().getTime())
                } else {
                    layer.msg('上传失败,请重试!');
                }
            }
        });

        //上传直播导引页图片
        upload.render({
            elem: '#test',
            type: "POST",
            dataType: "json",
            headers: {
                token: sessionStorage.getItem('token')
            },
            data: {
                event_id: event_id
            },
            size: 1024 * 4,
            url: 'http://www.cube.vip/event/event_wallpaper/',
            done: function (result) {
                if (result.msg === 'success') {
                    layer.msg('上传成功!');
                    $("#demo-cover").attr("src", result.data.channel_wallpaper + '?' +
                        new Date().getTime());
                } else {
                    layer.msg('上传失败,请重试!');

                }
            }
        });
        // 上传水印logo
        upload.render({
            elem: '#logo-upload-btn',
            type: "POST",
            dataType: "json",
            headers: {
                token: sessionStorage.getItem('token')
            },
            acceptMime:'image/png',
            exts:'png',
            data: {
                event_id: event_id
            },
            size: 1024 * 2,
            url: 'http://www.cube.vip/event/upload_logo_image/',
            done: function (result) {
                if (result.msg === 'success') {
                    layer.msg('上传成功!');
                    $("#channel-set-logo").attr("src", result.data.event_video_logo_page +
                        '?' +
                        new Date().getTime());
                } else {
                    layer.msg('上传失败,请重试!');

                }
            }
        });
        // 倒计时方位-----------------------------------------------------------------------------------------------------------
        form.on('radio(time-orientation)', function (data) {
            if (data.value === '0') {
                $('.top-time').show()
                $('.center-time').hide()
                $('.bottom-time').hide()
                countDownOrientation = 0

            } else if (data.value === '1') {
                $('.top-time').hide()
                $('.center-time').show()
                $('.bottom-time').show()
                countDownOrientation = 1

            }
        })
        //倒计时开关
        form.on('switch(count-down-open)', function (data) {

            if (data.elem.checked) {
                countDownFlag = 'True'
            } else {
                countDownFlag = 'False'
            }
        });
        laydate.render({
            elem: '#timetest',
            type: 'datetime',
            done: function(value){
                changeTimer(value)
            }
        });

        //获取倒计时
        $.get({
            url: "http://www.cube.vip/event/live_countdown_settings/",
            dataType: "json",
            headers: {
                token: sessionStorage.getItem('token')
            },
            data: {
                event_id: event_id
            },
            success: function (res) {
                if (res.msg === 'success') {
                    if (res.data.event_countdown) {
                        countDownFlag = 'True'
                        $("#count-down-open").attr('checked', 'checked');
                    } else {
                        countDownFlag = 'False'
                        $("#count-down-open").removeAttr('checked');
                    }
                    countDownOrientation = res.data.live_countdown
                    if (countDownOrientation === 0) {
                        $('.top-time').show()
                        $('.center-time').hide()
                        $('.bottom-time').hide()
                        $('#time-radio1').prop('checked', true)
                    } else if (countDownOrientation === 1) {
                        $('.top-time').hide()
                        $('.center-time').show()
                        $('.bottom-time').show()
                        $('#time-radio2').prop('checked', true)
                    }
                    form.render('checkbox');
                    form.render('radio');
                    $('#timetest').val(res.data.event_start_time)
                    changeTimer(res.data.event_start_time.replace('T', ' '))

                }
            },
        });
        function changeTimer(time) {
            
            var date1 = new Date(time).getTime()
            if(isNaN(date1)){
                date1 = 0
            }
            var date2 = Date.now()
            var day = 00
            var hour = 00
            var minute = 00
            var second = 00; //时间默认值

            clearInterval(timers)
            if (date1 > date2) {
                var intDiff = parseInt((date1 - date2) / 1000);
                timers = setInterval(function () {

                    if (Math.floor(intDiff / (60 * 60 * 24)) < 10) {
                        day = '0' + Math.floor(intDiff / (60 * 60 * 24))
                    } else {
                        day = Math.floor(intDiff / (60 * 60 * 24))
                    }

                    if (Math.floor(intDiff / (60 * 60)) - (day * 24) <
                        10) {

                        hour = '0' + (Math.floor(intDiff / (60 * 60)) - (
                            day *
                            24))

                    } else {
                        hour = Math.floor(intDiff / (60 * 60)) - (day *
                            24)

                    }

                    if (Math.floor(intDiff / 60) - (day * 24 * 60) - (
                            hour *
                            60) < 10) {
                        minute = '0' + (Math.floor(intDiff / 60) - (day *
                            24 *
                            60) - (hour * 60))
                    } else {
                        minute = Math.floor(intDiff / 60) - (day * 24 *
                                60) -
                            (hour * 60)
                    }

                    if (Math.floor(intDiff) - (day * 24 * 60 * 60) - (
                            hour *
                            60 * 60) - (minute * 60) <
                        10) {
                        second = '0' + (Math.floor(intDiff) - (day * 24 *
                            60 *
                            60) - (hour * 60 * 60) - (
                            minute * 60))
                    } else {
                        second = Math.floor(intDiff) - (day * 24 * 60 *
                                60) -
                            (hour * 60 * 60) - (minute *
                                60)
                    }

                    $('.day').text(day);
                    $('.hour').text(hour);
                    $('.minute').text(minute);
                    $('.second').text(second);

                    $('.hour1').text(hour.toString().substring(0, 1));
                    $('.minute1').text(minute.toString().substring(0, 1));
                    $('.second1').text(second.toString().substring(0, 1));
                    $('.hour2').text(hour.toString().substring(1, 2));
                    $('.minute2').text(minute.toString().substring(1, 2));
                    $('.second2').text(second.toString().substring(1, 2));
                    intDiff--;
                    if (intDiff <= 0) {
                        clearInterval(timers)
                    }
                }, 1000);
            } else {
                $('.day').text('00');
                $('.hour').text('00');
                $('.minute').text('00');
                $('.second').text('00');

                $('.hour1').text('0');
                $('.minute1').text('0');
                $('.second1').text('0');
                $('.hour2').text('0');
                $('.minute2').text('0');
                $('.second2').text('0');
            }
        }


        // 在线人数 
        form.on('switch(number-switch)', function (data) {
            if (data.elem.checked) {
                numberFlag = 'True'
                
            } else {
                numberFlag = 'False'
               
            }
        });
        form.on('radio(number)', function (data) {
            if (data.value === '1') {
                onLine = 1

            } else if (data.value === '2') {
                onLine = 2
            }
        })
      
        //获取在线人数信息
        $.ajax({
            type: 'GET',
            url: "http://www.cube.vip/event/event_number/",
            dataType: "json",
            headers: {
                token: sessionStorage.getItem('token')
            },
            data: {
                event_id: event_id
            },
            success: function (res) {
                if (res.msg === 'success') {
                    if (res.data.event_number_flag) {
                        numberFlag = 'True'
                        $("#number-switch").attr('checked', 'checked');
                        
                    } else {
                        numberFlag = 'False'
                        $("#number-switch").removeAttr('checked');
                       
                    }
                    if (res.data.event_display_position === 1) {
                        onLine = 1
                        $('#number1').prop('checked', true)
                    } else {
                        onLine = 2
                        $('#number2').prop('checked', true)
                    }
                    $('#num').val(res.data.event_number_online_number)
                    $('#mul').val(res.data.event_number_online_multiple)

                    form.render('radio');
                    form.render('checkbox');
                }
            }
        })


        form.on('switch(code-switch)', function (data) {
            if (data.elem.checked) {
                codeFlag = 'False'
                $('#code1').removeAttr('disabled')
                $('#code2').removeAttr('disabled')
                $('#code3').removeAttr('disabled')
                $('#code4').removeAttr('disabled')
                $('#code5').removeAttr('disabled')
                $('#code6').removeAttr('disabled')

            } else {
                codeFlag = 'True'
                $('#code1').val('').attr('disabled', true)
                $('#code2').val('').attr('disabled', true)
                $('#code3').val('').attr('disabled', true)
                $('#code4').val('').attr('disabled', true)
                $('#code5').val('').attr('disabled', true)
                $('#code6').val('').attr('disabled', true)
            }

        });
        // 获取公开状态及密码
        $.ajax({
            type: 'GET',
            url: 'http://www.cube.vip/event/check_event/',
            dataType: "json",
            headers: {
                token: sessionStorage.getItem('token')
            },
            data: {
                event_id: event_id
            },
            success: function (res) {
                if (res.msg === 'success') {
                    if (res.data.event_private) {
                        codeFlag = 'True'
                        $("#code-switch").removeAttr('checked');
                        
                    } else {
                        codeFlag = 'False'
                        $("#code-switch").attr('checked', 'checked');
                        var codeArray = res.data.event_access_code.split('')
                        $('#code1').val(codeArray[0]).removeAttr('disabled')
                        $('#code2').val(codeArray[1]).removeAttr('disabled')
                        $('#code3').val(codeArray[2]).removeAttr('disabled')
                        $('#code4').val(codeArray[3]).removeAttr('disabled')
                        $('#code5').val(codeArray[4]).removeAttr('disabled')
                        $('#code6').val(codeArray[5]).removeAttr('disabled')
                    }
                    form.render('checkbox');
                }
            }
        })

        // 活动简介--------------------------------------------------------------------------------------------------
        layui.use('upload', function () {
            var upload = layui.upload;
            //执行实例
            upload.render({
                elem: '#introduce-box',
                type: "POST",
                dataType: "json",
                headers: {
                    token: sessionStorage.getItem('token')
                },
                auto: false,
                size: 1024 * 2,
                data: {
                    event_id: event_id,
                },
                url: 'http://www.cube.vip/event/introduction_activities/',
                choose: function (obj) {
                    obj.preview(function (index, file, result) {
                        $("#introduce-image").attr('src',window.URL.createObjectURL(file)).show()
                    })
                },
                bindAction: '#ai-submit',
                done: function (res) {
                    if (res.msg === 'success') {
                        layer.msg('保存成功!');
                    } else {
                        layer.msg('保存失败,请重试!');
                    }
                }
            })
        });
        $('#introduce-shade').on('click',function(){
            $('#introduce-box').trigger('click')
        })
        $('#introduce-shade').hover(function(){
            $(this).show()
        })
        $('#introduce-box').hover(function(){
            $('#introduce-shade').show()
        },function(){
            $('#introduce-shade').hide()
        })

        $.get({
            url: "http://www.cube.vip/event/introduction_activities/",
            dataType: "json",
            headers: {
                token: sessionStorage.getItem('token')
            },
            data: {
                event_id: event_id
            },
            success: function (res) {
                if (res.msg === "success") {
                    $("#introduce-image").attr('src', res.data.event_description_image).show()
                }
            }
        })
        // 邀请卡------------------------------------------------------------------------------------------------
        //监听提交
        form.on('submit(formDemo)', function (data) {
            layer.msg(JSON.stringify(data.field));
            return false;
        });
        // 获取邀请卡
        $.get({
            url: "http://www.cube.vip/event/card_stytle/",
            dataType: "json",
            headers: {
                token: sessionStorage.getItem('token')
            },
            data: {
                event_id: event_id
            },
            success: function (res) {
                if (res.msg === 'success') {
                    checkId = res.data.id
                    allData = res.data.invi_data
                    $('#user-image').attr('src', res.data.account_thundernail)
                    $('#user-name').text(res.data.account_name)
                    $('#channel-name').text(res.data.event_title)
                    $('.copy-url').val('分享地址:http://www.cube.vip/h5/share.html?key=' + res.data.event_uri_key)
                    $('.copy-btn').attr('data-clipboard-text', 'http://www.cube.vip/h5/share.html?key=' + res.data.event_uri_key)
                    new QRCode(document.getElementById("qr-code"), {
                        text: "http://www.cube.vip/h5/wxlogin.html?key=" + res.data.event_uri_key,
                        width: 64,
                        height: 64,
                    });
                    var str = ''
                    res.data.invi_data.forEach(item => {
                        if (res.data.id === item.id) {
                            str += `
									<div class="different-style-list different-style-list-active" data-id="${item.id}">
										<img src="${item.card_stytle_thumbnail_url}" alt="">
									</div>
									`
                            $('.inviteImg').attr('src', item.card_stytle_url)

                        } else {
                            str += `
									<div class="different-style-list" data-id="${item.id}">
										<img src="${item.card_stytle_thumbnail_url}" alt="">
									</div>
									`
                        }
                    })
                    $('.different-style').html(str)
                }
            }
        })

        // 自定义广告
        form.on('switch(ad-switch)', function (data) {
            if (data.elem.checked) {
                adFlag = 'True'
                $('.upload-image').show()
            } else {
                adFlag = 'False'
                $('.upload-image').hide()
            }
        });

        upload.render({
            elem: '.upload-btn',
            type: "POST",
            dataType: "json",
            headers: {
                token: sessionStorage.getItem('token')
            },
            auto: false,
            size: 1024 * 2,
            data: {
                event_id: event_id,
                event_ads_external_uri: $('.ad-link-input').val(),
                event_ads_flag: adFlag
            },
            url: 'http://www.cube.vip/event/event_ads/',
            choose: function (obj) {
                obj.preview(function (index, file, result) {
                    $(".upload-image").attr("src", window.URL.createObjectURL(
                        file));
                    imageFile = file
                })
            },
            bindAction: '#submit123'
        });
        $('#ad-submit-btn').on('click', function () {
            var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/
            if (!reg.test($('.ad-link-input').val()) && $('.ad-link-input').val().length > 0) {
                layer.msg('请输入合法地址!')
                return
            }

            var formData = new FormData()
            formData.append('file', imageFile)
            formData.append('event_id', event_id)
            formData.append('event_ads_external_uri', $('.ad-link-input').val())
            formData.append('event_ads_flag', adFlag)
            $.ajax({
                type: "POST",
                url: 'http://www.cube.vip/event/event_ads/',
                dataType: "json",
                headers: {
                    token: sessionStorage.getItem('token')
                },
                processData: false,
                // 告诉jQuery不要去设置Content-Type请求头
                contentType: false,
                data: formData,
                success: function (res) {

                    if (res.msg === 'success') {
                        layer.msg('保存成功!');
                    } else {
                        layer.msg('保存失败,请重试!');
                    }
                }
            })
        })

        // 获取广告
        $.get({
            url: "http://www.cube.vip/event/event_ads/",
            dataType: "json",
            headers: {
                token: sessionStorage.getItem('token')
            },
            data: {
                event_id: event_id
            },
            success: function (res) {
                if (res.msg === "success") {
                    if (res.data.event_ads_flag) {
                        adFlag = 'True'
                        $("#ad-switch").attr('checked', 'checked');
                        $('.upload-image').show()
                    } else {
                        adFlag = 'False'
                        $("#ad-switch").removeAttr('checked');
                        $('.upload-image').hide()
                    }
                    form.render('checkbox');
                    $('.ad-link-input').val(res.data.event_ads_external_uri)
                    $(".upload-image").attr("src", res.data.event_ads_image_uri)
                }
            }
        })

    });

    // 获取直播导引页图片
    $.get({
        url: "http://www.cube.vip/event/event_wallpaper/",
        dataType: "json",
        headers: {
            token: sessionStorage.getItem('token')
        },
        data: {
            event_id: event_id
        },
        success: function (result) {
            if (result.msg === 'success') {
                $("#demo-cover").attr("src", result.data.channel_wallpaper);
            }
        },
    });

    // 获取直播背景
    $.get({
        url: "http://www.cube.vip/event/event_video_cover_page/",
        dataType: "json",
        headers: {
            token: sessionStorage.getItem('token')
        },
        data: {
            event_id: event_id
        },
        success: function (result) {
            $("#live-bg-cover").attr("src", result.data.event_video_cover_page);
        },
    });

    // 倒计时提交
    $('#down-submit').on('click', function () {
        if($('#timetest').val().length<=0){
            layer.msg('请输入直播开始时间!')
            return
        }
        $.ajax({
            type: 'POST',
            url: "http://www.cube.vip/event/live_countdown_settings/",
            dataType: "json",
            headers: {
                token: sessionStorage.getItem('token')
            },
            data: {
                event_id: event_id,
                event_countdown: countDownFlag,
                live_countdown: countDownOrientation,
                event_start_time:$('#timetest').val()
            },
            success: function (res) {
                if (res.msg === 'success') {
                    layer.msg('提交成功!')
                } else {
                    layer.msg('提交失败,请重试!')
                }
            }
        })
    })



    //提交在线人数
    $('#number-submit').on('click', function () {
        if ($.trim($('#num').val()).length <= 0) {
            layer.msg('请输入默认基础人数!')
            return
        }
        if ($.trim($('#mul').val()) <= 0|| Number($('#mul').val())<1) {
            layer.msg('请输入默认基础倍数且倍数大于1!')
            return
        }
            $.ajax({
                type: 'POST',
                url: "http://www.cube.vip/event/event_number/",
                dataType: "json",
                headers: {
                    token: sessionStorage.getItem('token')
                },
                data: {
                    event_id: event_id,
                    event_number_flag: numberFlag,
                    event_display_position: onLine,
                    event_number_online_number: $('#num').val(),
                    event_number_online_multiple: $('#mul').val()
                },

                success: function (res) {
                    if (res.msg === 'success') {
                        layer.msg('提交成功!')
                    } else {
                        layer.msg('提交失败,请重试!')
                    }
                }
            })

    })

    $('#num').keyup(function () {
        $(this).val($(this).val().replace(/[^\d]/g, ''))
    })
    $('#mul').keyup(function () {
        $(this).val($(this).val().replace(/[^\d]/g, ''))
    })

    $('#code1').focus(function () {
        //第一个input框获得焦点时触发的事件
        var txts = $(".code-input input");
        for (var i = 0; i < txts.length; i++) {
            var t = txts[i];
            t.index = i;
            t.setAttribute("readonly", true);
            t.onkeyup = function () {

                this.value = this.value.replace(/[^\d]/g, '');
                var next = this.index + 1;
                if (next > txts.length - 1) return;
                txts[next].removeAttribute("readonly");
                if (this.value) {
                    txts[next].focus();
                }
            }
        }
        txts[0].removeAttribute("readonly");
    });

    $(".code-input").keydown(function (event) {
        if (event.keyCode == 8) {
            $('.code-input input[type=text]').val("");
            $('#code1').focus();
        }
    });

    $('#code-submit').on('click', function () {
        var codeStr = $('#code1').val()
        codeStr += $('#code2').val()
        codeStr += $('#code3').val()
        codeStr += $('#code4').val()
        codeStr += $('#code5').val()
        codeStr += $('#code6').val()

        if (codeFlag === 'False' && codeStr.length < 6) {
            layer.msg('请填写完整密码!')
            return
        }
        if (codeFlag === 'True') {
            codeStr = ''
        }
        $.ajax({
            type: 'POST',
            url: "http://www.cube.vip/event/update_event_private/",
            dataType: "json",
            headers: {
                token: sessionStorage.getItem('token')
            },
            data: {
                event_id: event_id,
                event_private: codeFlag,
                event_access_code: codeStr,
            },

            success: function (res) {
                if (res.msg === 'success') {
                    layer.msg('提交成功!')
                } else {
                    layer.msg('提交失败,请重试!')
                }
            }
        })

    })

    //  邀请卡-------------------------------------------------------------------
    // 选择样式;
    $('.different-style').on('click', '.different-style-list', function () {
        $(this).addClass('different-style-list-active').siblings().removeClass('different-style-list-active')
        checkId = $(this).attr('data-id')
        allData.forEach(item => {
            if (Number(checkId) === item.id) {
                $('.inviteImg').attr('src', item.card_stytle_url)
            }
        })

    })

    // 复制
    var btn = document.querySelectorAll('.copy-btn');

    var clipboard = new ClipboardJS(btn);
    clipboard.on('success', function (e) {
        layer.msg('复制成功!');
    });
    clipboard.on('error', function (e) {
        layer.msg('复制失败,请重试!');
    });
    // 提交邀请卡
    $('#submit').on('click', function () {
        $.ajax({
            type: "POST",
            dataType: "json",
            async: false,
            headers: {
                token: sessionStorage.getItem('token')
            },
            url: "http://www.cube.vip/event/card_stytle/",
            data: {
                event_id: event_id,
                id: checkId,
                invi_flag: 'True'
            },
            success: function (res) {
                if (res.msg === 'success') {
                    layer.msg('保存成功!');
                } else {
                    layer.msg('保存失败,请重试!');
                }
            }
        })
    })

      // h5模板---------------------------------------------------------------------------------
    // 获取m5模板
    $.get({
        url: "http://www.cube.vip/event/update_h5_stytle/",
        dataType: "json",
        headers: {
            token: sessionStorage.getItem('token')
        },
        data: {
            event_id: event_id
        },
        success: function (res) {
            if (res.msg === 'success') {
                h5_check_id = res.data.id
                h5_all_data = res.data.invi_data
                var str = ''
                res.data.invi_data.forEach(item=>{
                    if (res.data.id === item.id) {
                        str += `<div class="h5_item_box">
                                    <div class="h5_item h5_item_active" data-id="${item.id}">
                                        <img src="${item.h5_stytle_thumbnail_url}" alt="">
                                    </div>
                                    <p class="h5_name"> ${item.h5_stytle_name}</p>
                                </div>
                                `
                        $('.h5_inviteImg').attr('src', item.h5_stytle_url)

                    } else {
                        str += `
                                <div class="h5_item_box">
                                    <div class="h5_item" data-id="${item.id}">
                                        <img src="${item.h5_stytle_thumbnail_url}" alt="">
                                    </div>
                                    <p class="h5_name"> ${item.h5_stytle_name}</p>
                                </div>
                            `
                    }
                })
                $('.h5_list').html(str)
            }
        }
    })

    // 选择h5模板样式
    $('.h5_list').on('click', '.h5_item', function () {
        $(this).addClass('h5_item_active').parent().siblings().find('.h5_item').removeClass('h5_item_active')
        h5_check_id = $(this).attr('data-id')
        h5_all_data.forEach(item => {
            if (Number(h5_check_id) === item.id) {
                $('.h5_inviteImg').attr('src', item.h5_stytle_url)
            }
        })
    })

    // 提交h5模板
    $('#h5_submit').on('click',function(){
        $.ajax({
            type: "POST",
            dataType: "json",
            async: false,
            headers: {
                token: sessionStorage.getItem('token')
            },
            url: "http://www.cube.vip/event/update_h5_stytle/",
            data: {
                event_id: event_id,
                id: h5_check_id
            },
            success: function (res) {
                if (res.msg === 'success') {
                    layer.msg('保存成功!');
                } else {
                    layer.msg('保存失败,请重试!');
                }
            }
        })
    })
})