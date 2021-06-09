let data = ''
var infoData = []
let event_uri_key = ''
if(sessionStorage.getItem('cubeInfo')){
   data = sessionStorage.getItem('cubeInfo').substring(1).split("&")
    data.forEach(item => {
        infoData.push(item.split("="))
    })
    event_uri_key = window.location.search.substring(1).split("=")[1]
   
}else {
    window.location.href='http://www.cubee.vip/h5/wxlogin.html?key=' + window.location.search.substring(1).split("=")[1]
}
let timers = null
let videoJs = ''
let playFlay = false
var sessionTimers = null
var sessionCode = null
var streamCode = null
var stateTimer = null

var userName = ''
var describe = ''
var userImg = ''
var liveSrc = ''
$(function () {
    layui.use(['form', 'element'], function () {
        var element = layui.element;
        var form = layui.form;
        layui.element.init();
    });
    // 获取基本信息
    $.ajax({
        url: 'http://www.cubee.vip/event/h5_broadcasting_room/',
        type: 'GET',
        data: {
            event_uri_key: event_uri_key
        },
        success: function (res) {
            if (res.msg === 'success') {
                userName = res.data.event_title
                describe = res.data.event_description
                $('title').text(userName)
                // 是否开启广告
                if (res.data.event_ads_flag) {
                    $('#ad-link').show()
                    $('#ad-link').attr('href', res.data.event_ads_external_uri)
                    $('#ad-image').attr('src', res.data.event_ads_image_uri)
                    $('#chat').css({
                        height: 'calc(100vh - 6.825rem - 40px )'
                    })
                    $('.brier').css({
                        height: 'calc(100vh - 6.825rem - 40px )'
                    })
                    $('.playBack').css({
                        height: 'calc(100vh - 6.825rem - 40px )'
                    })
                } else {
                    $('#ad-link').hide()
                    $('#chat').css({
                        height: 'calc(100vh - 5.625rem - 40px )'
                    })
                    $('.brier').css({
                        height: 'calc(100vh - 5.625rem - 40px )'
                    })
                    $('.playBack').css({
                        height: 'calc(100vh - 5.625rem - 40px )'
                    })
                }
                // 活动简介
                $('.brierImage').attr('src', res.data.event_description_image)
               $('#videoBox').css({
                   background:'url('+res.data.event_video_cover_page+')',
                   backgroundSize:'100% 100%'
               })
                // 活动封面
                userImg = res.data.event_video_cover_page
                 // 是否开启倒计时
                if (res.data.event_countdown) {
                    downtime(res.data.event_start_time, res.data.live_countdown,res.data.event_playback_flag,res.data.event_playback_url)
                } else {
                    downtimes(res.data.event_playback_flag,res.data.event_playback_url)
                }
                //是否在线人数
                if (res.data.event_number_flag) {
                    if (res.data.event_display_position === 1) {
                        $('#showNum').show().text(Math.round((res.data.event_number_views +
                                res.data.event_number_online_number) * res.data
                            .event_number_online_multiple) + '人观看')
                    } else {
                        $('#showNum').show().text(Math.round((res.data.event_number_online +
                                res.data.event_number_online_number) * res.data
                            .event_number_online_multiple) + '人观看')
                    }
                    getNumber()
                }
                // 判断h5模板
                if(res.data.h5_url ===1){
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.src = './js/default_live.js';
                    document.body.appendChild(script);
        
                    var link = document.createElement("link");
                    link.type = "text/css";
                    link.rel = "stylesheet";
                    link.href = './css/default_live.css';
                    document.getElementsByTagName("head")[0].appendChild(link);
                }else if(res.data.h5_url ===2){
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.src = './js/sports_live.js';
                    document.body.appendChild(script);
        
                    var link = document.createElement("link");
                    link.type = "text/css";
                    link.rel = "stylesheet";
                    link.href = './css/sports_live.css';
                    document.getElementsByTagName("head")[0].appendChild(link);
                }
            }
        }
    })
    //在限人数
   function getNumber(){
        setInterval(()=>{
        $.ajax({
            url: 'http://www.cubee.vip/event/h5_get_online/',
            type: 'GET',
            data: {
                event_uri_key: event_uri_key
            },
            success: function (res) {
                if (res.msg === 'success') {
                    if (res.data.event_number_flag) {
                        if (res.data.event_display_position === 1) {
                            $('#showNum').show().text(Math.round((res.data
                                    .event_number_views +
                                    res.data.event_number_online_number) *
                                res.data
                                .event_number_online_multiple) + '人观看')
                        } else {
                            $('#showNum').show().text(Math.round((res.data
                                    .event_number_online +
                                    res.data.event_number_online_number) *
                                res.data
                                .event_number_online_multiple) + '人观看')
                        }
                    }
                }
            }
        })
    },1000*60)
   }
    

    //获取回放视频
    $.ajax({
        url: 'http://www.cubee.vip/video/h5_get_event_video/',
        type: 'GET',
        data: {
            event_uri_key: event_uri_key
        },
        success: function (res) {
            if (res.msg === 'success') {
                var str = '<p class="rec">精彩推荐</p>'
                res.data.forEach(item => {
                    str += `<a class="backList" data-id="${item.video_id}" href="http://www.cubee.vip/h5/playback.html?id=${item.video_id}&url=1&video_number_views=${event_uri_key}&video_profile=1&cover=${item.video_description_image}">
                        <div class="backContent">
                            <img src="${item.video_description_image}" onerror="this.src='./image/back-image.png'"  class="backImage">
                            <div class="backInfo">
                                <div class="backName">
                                ${item.video_profile}               
                                </div>
                                <p class="backTime">
                                    ${item.datetime}
                                </p>
                                <p class="backShow">
                                    ${item.video_number_views}人观看
                                </p>
                            </div>
                        </div>
                    </a>
                    `
                })
                if(res.data.length>3) {
                    str+= '<img src="./image/offer.png"  class="offerImg">'
                }
                $('.playBack').html(str)
            }
        }
    })
    // 增加广告点击量
    $('#ad-link').on('click', function () {
        $.ajax({
            url: 'http://www.cubee.vip/event/h5_ads_number_clicks/',
            type: 'POST',
            data: {
                event_uri_key: event_uri_key
            }
        })
    })

    // 关闭广告
    $('.close').on('click', function (e) {
        $('#ad-link').hide()
        e.preventDefault()
        $('#chat').css({
            height: 'calc(100vh - 5.625rem - 40px )'
        })
        $('.brier').css({
            height: 'calc(100vh - 5.625rem - 40px )'
        })
        $('.playBack').css({
            height: 'calc(100vh - 5.625rem - 40px )'
        })
    })
    // 定时器
    function downtime(startTime, value,flag,url) {
        var date1 = new Date(startTime.replace('T', ' ')).getTime()
        var date2 = Date.now()
        var day = 00
        var hour = 00
        var minute = 00
        var second = 00; //时间默认值

        clearInterval(timers)
        if (date1 > date2) {
            var intDiff = parseInt((date1 - date2) / 1000)
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

                $('#topDown').text('距离直播开始' + day + '天' + hour + '时' + minute + '分' + second +
                    '秒')
                $('#dayClass').text('距离直播开始' + day + '天')

                $('.hour1').text(hour.toString().substring(0, 1));
                $('.minute1').text(minute.toString().substring(0, 1));
                $('.second1').text(second.toString().substring(0, 1));
                $('.hour2').text(hour.toString().substring(1, 2));
                $('.minute2').text(minute.toString().substring(1, 2));
                $('.second2').text(second.toString().substring(1, 2));
                intDiff--;
                if (intDiff <= 0) {
                    clearInterval(timers)
                    $('#topDown').hide()
                    $('#centerDown').hide()
                }
            }, 1000)
                if (value === 1) {
                    $('#centerDown').show()
                } else {
                    $('#topDown').show()
                }
        } else {
            $('#topDown').hide()
            $('#centerDown').hide()
        }
        downtimes(flag,url)

    }
    function downtimes(flag,url) {

        if(flag){
            if(url!==null){
                playFlay = true
                $('#videoBox').css({
                    background:'',
                })
                videoJs =  new Aliplayer({
                    "id": "videoBox",
                    "source": url,
                    "width":'10rem',
                    "height":'5.625rem',
                    "autoplay": false,
                    "isLive": false,
                    "rePlay": false,
                    "playsinline": true,
                    "preload": true,
                    "controlBarVisibility": "click",
                    "useH5Prism": true,
                    "skinLayout": [
                        {
                          "name": "bigPlayButton",
                          "align": "cc",
                        },
                        {
                          "name": "H5Loading",
                          "align": "cc"
                        },
                        {
                          "name": "errorDisplay",
                          "align": "tlabs",
                          "x": 0,
                          "y": 0
                        },
                        {
                          "name": "infoDisplay"
                        },
                        {
                          "name": "tooltip",
                          "align": "blabs",
                          "x": 0,
                          "y": 56
                        },
                        {
                          "name": "thumbnail"
                        },
                        {
                          "name": "controlBar",
                          "align": "blabs",
                          "x": 0,
                          "y": 0,
                          "children": [
                            {
                              "name": "progress",
                              "align": "blabs",
                              "x": 0,
                              "y": 44
                            },
                            {
                              "name": "playButton",
                              "align": "tl",
                              "x": 15,
                              "y": 12
                            },
                            {
                              "name": "timeDisplay",
                              "align": "tl",
                              "x": 10,
                              "y": 7
                            },
                            {
                              "name": "subtitle",
                              "align": "tr",
                              "x": 15,
                              "y": 12
                            },
                            {
                              "name": "setting",
                              "align": "tr",
                              "x": 15,
                              "y": 12
                            },
                            {
                                "name": "fullScreenButton",
                                "align": "tr",
                                "x": 10,
                                "y": 12
                            },
                            {
                              "name": "volume",
                              "align": "tr",
                              "x": 5,
                              "y": 10
                            }
                          ]
                        }
                      ]

                })
                $('#centerDown').on('click',function(){
                    $('#centerDown').hide()
                    videoJs.play()
                })
                videoJs.on('play',function(){
                    $('#topDown').hide()
                    $('#centerDown').hide()
                    
                })
            }
        }
    }
    // 获取直播状态
    getState()
    function getState() {
         stateTimer = setInterval(()=>{
            $.ajax({
                url: 'http://www.cubee.vip/event/h5_get_ip/',
                type: 'GET',
                data: {
                    event_uri_key: event_uri_key
                },
                success: function (res) {
                    if (res.msg === 'success') {
                        setTimeout(()=>{
                            clearInterval(stateTimer)
                            clearInterval(timers)
                            $('#topDown').hide()
                            $('#centerDown').hide()
                            getVideoUrl()
                        },300)
                        
                    }
                }
            })
         },1000*60)
         $.ajax({
            url: 'http://www.cubee.vip/event/h5_get_ip/',
            type: 'GET',
            data: {
                event_uri_key: event_uri_key
            },
            success: function (res) {
                if (res.msg === 'success') {
                    setTimeout(()=>{
                        clearInterval(stateTimer)
                        clearInterval(timers)
                        $('#topDown').hide()
                        $('#centerDown').hide()
                        getVideoUrl()
                    },300)
                }
            }
        })

    }
    // 获取视频url
    function getVideoUrl() {
        $.ajax({
            url: 'http://www.cubee.vip/event/h5_artc_url/',
            type: 'GET',
            data: {
                event_uri_key: event_uri_key
            },
            success: function (res) {
                if (res.msg === 'success') {
                    if(playFlay){
                        videoJs.dispose()
                    }
                    $('#videoBox').css({
                        background:'',
                    })
                     // 直播地址
                    liveSrc = res.data.pull_stream_m3u8_url
                    videoJs =  new Aliplayer({
                        "id": "videoBox",
                        "source": res.data.pull_stream_m3u8_url,
                        "width":'10rem',
                        "height":'5.625rem',
                        "autoplay": false,
                        "isLive": true,
                        "rePlay": false,
                        "playsinline": true,
                        "preload": true,
                        "controlBarVisibility": "click",
                        "useH5Prism": true,
                        "waitingTimeout":10,
                        "skinLayout": [
                            {
                              "name": "bigPlayButton",
                              "align": "cc",
                            },
                            {
                              "name": "H5Loading",
                              "align": "cc"
                            },
                            {
                                "name": "errorDisplay",
                                "align": "tlabs",
                                "x": 0,
                                "y": 0
                              },
                            {
                              "name": "infoDisplay"
                            },
                            {
                              "name": "tooltip",
                              "align": "blabs",
                              "x": 0,
                              "y": 56
                            },
                            {
                              "name": "thumbnail"
                            },
                            {
                              "name": "controlBar",
                              "align": "blabs",
                              "x": 0,
                              "y": 0,
                              "children": [
                                {
                                  "name": "progress",
                                  "align": "blabs",
                                  "x": 0,
                                  "y": 44
                                },
                                {
                                  "name": "playButton",
                                  "align": "tl",
                                  "x": 15,
                                  "y": 12
                                },
                                {
                                  "name": "timeDisplay",
                                  "align": "tl",
                                  "x": 10,
                                  "y": 7
                                },
                                {
                                  "name": "subtitle",
                                  "align": "tr",
                                  "x": 15,
                                  "y": 12
                                },
                                {
                                  "name": "setting",
                                  "align": "tr",
                                  "x": 15,
                                  "y": 12
                                },
                                {
                                    "name": "fullScreenButton",
                                    "align": "tr",
                                    "x": 10,
                                    "y": 12
                                },
                                {
                                  "name": "volume",
                                  "align": "tr",
                                  "x": 5,
                                  "y": 10
                                }
                                
                              ]
                            }
                          ]
                    })

                    
                    videoJs.on('play',function(){
                        $('#topDown').hide()
                        $('#centerDown').hide()
                    })
                    videoJs.on('error',function(err){
                        videoJs.dispose()
                        
                        $('#videoBox').removeClass('prism-player').html(`<img id="refresh" src="./image/404.png">`)
                    })
                }
            }
        })
    }

    $('#videoBox').on('click','#refresh',function () {
        $(this).hide()
        $('#videoBox').addClass('prism-player')
        videoJs =  new Aliplayer({
            "id": "videoBox",
            "source": liveSrc,
            "width":'10rem',
            "height":'5.625rem',
            "autoplay": false,
            "isLive": true,
            "rePlay": false,
            "playsinline": true,
            "preload": true,
            "controlBarVisibility": "click",
            "useH5Prism": true,
            "waitingTimeout":10,
            "skinLayout": [
                {
                  "name": "bigPlayButton",
                  "align": "cc",
                },
                {
                  "name": "H5Loading",
                  "align": "cc"
                },
                {
                  "name": "infoDisplay"
                },
                {
                  "name": "tooltip",
                  "align": "blabs",
                  "x": 0,
                  "y": 56
                },
                {
                  "name": "thumbnail"
                },
                {
                  "name": "controlBar",
                  "align": "blabs",
                  "x": 0,
                  "y": 0,
                  "children": [
                    {
                      "name": "progress",
                      "align": "blabs",
                      "x": 0,
                      "y": 44
                    },
                    {
                      "name": "playButton",
                      "align": "tl",
                      "x": 15,
                      "y": 12
                    },
                    {
                      "name": "timeDisplay",
                      "align": "tl",
                      "x": 10,
                      "y": 7
                    },
                    {
                      "name": "subtitle",
                      "align": "tr",
                      "x": 15,
                      "y": 12
                    },
                    {
                      "name": "setting",
                      "align": "tr",
                      "x": 15,
                      "y": 12
                    },
                    {
                        "name": "fullScreenButton",
                        "align": "tr",
                        "x": 10,
                        "y": 12
                    },
                    {
                      "name": "volume",
                      "align": "tr",
                      "x": 5,
                      "y": 10
                    }
                    
                  ]
                }
              ]
        })
        videoJs.on('error',function(err){
           videoJs.dispose()
           $('#videoBox').removeClass('prism-player').html(`<img id="refresh" src="./image/404.png">`)
        })
    })
    // WebSocket聊天室
    const chatSocket = new WebSocket(
        'ws://' +
        'www.cubee.vip' +
        '/ws/chat/' +
        event_uri_key +
        '/'
    );
    chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        // 管理员-彬-www.baidu.com-精彩-90
        var message = data.message.split('%-%')
        if(message[0]==='admin') {
            var str = `
        <div class="chatList" id="${message[4]}">
            <div class="chatImage">
                <img src="${message[2]}" alt="">
            </div>
            <div class="chatInfo">
                <p class="chatName"><span>管理员</span></p>
                <p class="chatMessage">${message[3]}</p>
            </div>
        </div>
        `
        } else {
            var str = `
        <div class="chatList" id="${message[4]}">
            <div class="chatImage">
                <img src="${message[2]}" alt="">
            </div>
            <div class="chatInfo">
                <p class="chatName">${message[1]}</p>
                <p class="chatMessage">${message[3]}</p>
            </div>
        </div>
        `
        }
       
        $('.chatBox').append(str)

        $('.chatBox').scrollTop($('.chatBox')[0].scrollHeight)

    };

    chatSocket.onclose = function (e) {
        console.error('Chat socket closed unexpectedly');
    };
    // 发送聊天
    $('#send-btn').on('click', function () {
        if ($.trim($('.messageInput').val()).length > 0) {
            chatSocket.send(JSON.stringify({
                'message': 'user%-%' + decodeURI(infoData[0][1]) + '%-%' + infoData[1][
                    1
                ] + '%-%' + $('.messageInput').val()
            }))
        }
        $('.messageInput').val('')

    })
    $('.messageInput').on('keypress', function (event) { // 监听回车事件
        if (event.keyCode == "13") {
            if ($.trim($(this).val()).length > 0) {
                chatSocket.send(JSON.stringify({
                    'message': 'user%-%' + decodeURI(infoData[0][1]) + '%-%' + infoData[
                        1][1] + '%-%' + $(this).val()
                }))
            }
            $(this).val('')
        }
    })

   // 发送心跳-------------------------------------
   getSessionCode()
   function getSessionCode(){
    $.ajax({
            url: 'http://www.cubee.vip/event/h5_get_session_code/',
            type: 'GET',
            data: {
                event_uri_key: event_uri_key
            },
            success:function(res){
                if(res.msg==='success'){
                    sessionCode = res.data.sessions_code
                    streamCode = res.data.stream_code
                    sendHeartbeat()
                    clearInterval(sessionTimers)
                }
            }
        })
        sessionTimers = setInterval(()=>{
            $.ajax({
                url: 'http://www.cubee.vip/event/h5_get_session_code/',
                type: 'GET',
                data: {
                    event_uri_key: event_uri_key
                },
                success:function(res){
                    if(res.msg==='success'){
                        sessionCode = res.data.sessions_code
                        streamCode = res.data.stream_code
                        sendHeartbeat()
                        clearInterval(sessionTimers)
                    }
                }
            })
       },1000*60)
   }
   function sendHeartbeat(){
    setInterval(function() { 
            $.post("http://heartbeat.cube.vip/kafka/live", 
            {"plugin_name":"H5","sessions_code":sessionCode,"stream_code":streamCode,"datatime":Date.now(),"info":""})
        },1000*60) 
   }

   var shaStr = ''
    var timeShare = createTimestamp()
    function createTimestamp() {
        return parseInt(new Date().getTime() / 1000);
    }
    var srcShare = createNonceStr()
    function  createNonceStr() {
        return Math.random().toString(36).substr(2, 15);
    }
    $.ajax({
        url:'http://www.cubee.vip/event/h5_wx_share/',
        type:'GET',
        success:function(res){
            if(res.msg==='success'){

            shaStr = sha1('jsapi_ticket='+res.data+'&noncestr='+srcShare+'&timestamp='+timeShare+'&url=http://www.cubee.vip/h5/live.html?key='+ event_uri_key)
            wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: 'wxfeb6dd6cbf5a390b', // 必填，公众号的唯一标识
                    timestamp: timeShare, // 必填，生成签名的时间戳
                    nonceStr: srcShare, // 必填，生成签名的随机串
                    signature: shaStr, // 必填，签名，见附录1
                    jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                
                wx.ready(function() {
                    // 分享到朋友圈
                    wx.updateTimelineShareData({
                        title: userName, // 分享标题
                        link: 'http://www.cubee.vip/h5/live.html?key='+ event_uri_key, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: userImg, // 分享图标
                    });
                    
                    // 分享给朋友
                    wx.updateAppMessageShareData({
                        title: userName, // 分享标题
                        desc: describe, // 分享描述
                        link: 'http://www.cubee.vip/h5/live.html?key='+ event_uri_key, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: userImg, // 分享图标
                    });
                })
            }
        }
    })
})