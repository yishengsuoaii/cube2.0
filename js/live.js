$(function () {
    if (!sessionStorage.getItem('token')) {
        window.location.href = "./../login.html"
    }
    let searchData = window.location.search.substring(1).split("=")[1]

    if (searchData === '' || searchData === undefined) {
        window.location.href = "./../html/home.html"
    }
    var event_id = searchData;
    var event_code = ''
    var event_uri_key = ''
    // 频道分类
    var channel_type = ''
    // 拉流IP
    var serverIp = ''
    // 用户昵称
    var userName
    // 用户头像
    var userImage
    // 聊天记录条数
    var chatNum = 0

    // 动态创建dom
    // 比分dom
    var scoreHtml =`<div id="score-card">
    <div id="check-model"></div>
    <div id="select-oper">
        <div id="select-model">设置模板</div>
        <div id="reset">复位</div>
    </div>
    <div id="team-score-set">
        <div id="team-score-content">
            <div class="change-score">
                <div class="change-list">
                    <div id="left-three-plus" class="oneClass defaultColor">+</div>
                    <span class="twoClass defaultColor">3</span>
                    <div id="left-three-minus" class="oneClass defaultColor">-</div>
                </div>
                <div class="change-list">
                    <div id="left-two-plus" class="oneClass defaultColor">+</div>
                    <span class="twoClass defaultColor">2</span>
                    <div id="left-two-minus" class="oneClass defaultColor">-</div>
                </div>
                <div class="change-list">
                    <div id="left-one-plus" class="oneClass defaultColor">+</div>
                    <span class="twoClass defaultColor">1</span>
                    <div id="left-one-minus" class="oneClass defaultColor">-</div>
                </div>
            </div>
            <div class="team-score">
                <p class="score-preview">
                    <span class="score-preview-hot twoClass defaultColor" id="left-subtotal">0</span>
                    <input class="score-preview-input twoClass defaultColor" id="left-score" type="text" value="0" maxlength="3">
                </p>
                <p class="team-name twoClass defaultColor" id="left-name">队名</p>
                <p class="team-subtotal">
                    场记分
                    <span class="add-subtotal twoClass defaultColor" id="left-subtotal-plus">+1</span>
                    <span id="left-subtotal-minus" class="twoClass defaultColor">-1</span>
                </p>
            </div>
            <div class="team-vs">
                <p class="vs twoClass defaultColor">VS</p>
                <p class="scene-name">场次</p>
            </div>
            <div class="team-score">
                <p class="score-preview">
                    <input type="text" class="score-preview-input twoClass defaultColor" id="right-score" value="0" maxlength="3">
                    <span class="score-preview-hot twoClass defaultColor" id="right-subtotal">0</span>
                </p>
                <p class="team-name twoClass defaultColor" id="right-name">队名</p>
                <p class="team-subtotal team-right-subtotal">
                    <span id="right-subtotal-minus" class="twoClass defaultColor">-1</span>
                    <span class="add-subtotal twoClass defaultColor" id="right-subtotal-plus">+1</span>场记分
                    
                </p>
            </div>
            <div class="change-score">
                <div class="change-list">
                    <div id="right-one-plus" class="oneClass defaultColor">+</div>
                    <span class="twoClass defaultColor">1</span>
                    <div id="right-one-minus" class="oneClass defaultColor">-</div>
                </div>

                <div class="change-list">
                    <div id="right-two-plus" class="oneClass defaultColor">+</div>
                    <span class="twoClass defaultColor">2</span>
                    <div id="right-two-minus" class="oneClass defaultColor">-</div>
                </div>
                <div class="change-list">
                    <div id="right-three-plus" class="oneClass defaultColor">+</div>
                    <span class="twoClass defaultColor">3</span>
                    <div id="right-three-minus" class="oneClass defaultColor">-</div>
                </div>
            </div>
            </div>
            <div id="score-shade"></div>
        </div>
    </div>`

    // 背景替换dom
    var bgReplaceHtml=`<div id="bg-replace">
        <div class="bg-item bg-active"></div>
        <div class="bg-item"></div>
        <div class="bg-item"></div>
        <div class="bg-item"></div>
        <div class="bg-item"></div>
    </div>`

    // 手势检测dom
    var gestureHtml = `<div id="gesture-detection">
        <button type="button" class="layui-btn" id="gesture-btn">开启</button>
    </div>`
    // 自动导切dom
    var autoHtml = `<div id="auto-cut">
        <button type="button" class="layui-btn" id="auto-btn">开启</button>
    </div>`

    // 拉近镜头dom
    var zoomHtml = `<div id="zoom-in">
        <button type="button" class="layui-btn" id="zoom-btn">开启</button>
    </div>`

    // 云幻灯片dom
    var slidesHtml =   `
    <div id="lanternSlide">
           <div class="slideSelectBox">
            <div id="lanternStart" class="defaultStyle">开启</div>
            <div id="selectDoc">选择文档</div>
           </div>
            <div id="lanternPreview" class=" borderClass noneBorder">
                <img  alt="" id="lanternImage">
            </div> 
            <div class="lanternOperation">
                <p class="operationTop">
                    <span class="pageNum  equalClass endStyle">0/0</span>
                    <span class="pageFirst equalClass endStyle">首页</span>
                    <span class="pageEnd equalClass endStyle">尾页</span>
                </p>
                <p class="operationBottom">
                    <span class="selectPage">
                        <span>第</span>
                        <input type="text" class="pageInput borderClass equalClass endStyle noneBorder">
                        <span>页</span>
                    </span>
                    <span class="pagePre equalClass endStyle">上一页</span>
                    <span class="pageNext equalClass endStyle">下一页</span>
                </p>
            </div>
        </div>
    `
    // logoDom
    var logoHtml =`<div id="logoBox">
        <div  class="watermark-submit-btn">开启</div>
        <div  id="addLogoDialog">添加LOGO</div>
    </div>`

    // 背景音乐dom
    var musicHtml = `
    <div id="musicBox">
        <div class="musicLeft">
            <div id="musicStart" class="defaultStyle">开启</div>
            <div id="musicSelect">选择音乐</div>
        </div>
        <div class="musicInfo">
            <div id="musicName"></div>
            <div class="slideBox">
                <img src="./../image/mute-close.png" id="music-mute">
                <div class="slideLine" id="slideMusic"></div>
                <span class="slideInfo">背景音量</span> 
                <span class="wenhao">?</span>
                <div id="wenInfo">
                    调节背景音乐的音量<div class="hintAngle"></div>
                </div>
            </div>
            <div class="slideBox">
                <img src="./../image/mute-close.png" id="audio-mute">
                <div class="slideLine" id="slideAudio"></div>
                <span class="slideInfo">混音音量</span>
                <span class="wenhao wenhao1">?</span>
                <div id="wenInfo1">
                    调节机位混音的音量<div class="hintAngle"></div>
                </div>
            </div>
        </div>
    </div>
    `


    // logo
    var logoFlag = 'True'
    var logoOrientation = 1


    // 比分文件
    var fileScore = 0
    var scoreLocation = 0
    // 聊天VideoJs
    var chatM3u8 = ''
    var chatVideoJs = ''
    // video dom
    var domCameraOne = document.getElementById('cameraOne')
    var domCameraTwo = document.getElementById('cameraTwo')
    var domCameraThree = document.getElementById('cameraThree')
    var domCameraFour = document.getElementById('cameraFour')
    var domLiveRight = document.getElementById('liveRight-video')

    domCameraOne.volume = 0
    domCameraTwo.volume = 0
    domCameraThree.volume = 0
    domCameraFour.volume = 0
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
        // 手势检测标志
        gestureFlag: 'off',
        // 背景替换标志
        replaceFlag: 0,
        // 比分牌是否更新标志
        update: 0,
        // 比分牌是否开启标志
        state: 'off',
        // 自动切换
        autoState:'off',
        // zoomIn
        zoomState: 'off',
        // ppt 
        pptInfo: {
            state: 'off',
            data:[],
            style: 0,
            id: '',
            num:0,
            total: 0,
            update: 0,
        },
        // music 
        musicInfo:{
            state: 'off',
            oss: '',
            audio_volume: 0,
            volume:0,
            name:'',
            update: 0
        },
        // gif
        gifInfo:{
            state:'off',
            update: 0,
            oss:'',
            x:0,
            y:0,
            width:0,
            height:0
        },
        kvInfo:{
            state: 'off',
            oss: '',
            update: 0,
            location: 1
        }
    }
    var pptData ={
        state: 'off',
        data:[],
        style: 0,
        id: '',
        num:0,
        total: 0,
        update: 1,
    }
    var musicData = {
        oss: '',
        name:''
    }
    // 云推流定时器
    var pushTimer = null
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
    // 背景音乐滑块
    var slide_music = null

    var audio_music = null


    //比分牌---------------------------------------------------------------------------------------------

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
    // 比分信息
    var scoreData = null


      // 精彩推荐
    // 已经添加视频
    let rec_addedVideoData = []
    // 所有视频
    let rec_allVideoData = []
    // 过滤所有视频
    let rec_filterVideoData = []
    // 暂时视频
    let rec_momentVideoData = []

    // 渲染已经添加的视频
    function renderViewVideo() {
        var str1 = ''
        var str2 = ''


        if (rec_addedVideoData.length > 0) {
            rec_addedVideoData.forEach((item, index) => {
                str1 += `
                    <a class="backList">
                        <div class="backContent">
                            <div class="backInfo">
                                <div class="backName">
                                ${item.video_profile}               
                                </div>
                                <p class="backShow">
                                    ${item.video_number_views}人观看
                                </p>
                            </div>
                            <img src="${item.video_description_image}" onerror="this.src='./../image/video-page.png'"  class="backImage">
                        </div>
                    </a>
                    `
                str2 += `
                        <div class="rec-video-item"" data-id="${item.video_id}">
                            <div class="rec-video-item-info">
                                <img src="${item.video_description_image}" onerror="this.src='./../image/video-page.png'" alt="">
                                <span class="rec-video-item-name">${item.video_profile}</span>
                            </div>
                            <i class="layui-icon layui-icon-delete recommend-delete videoDelete"></i>   
                        </div>
                        `
            })

        } else {
            str2 = '<p class="rec-video-none">视频</p>'
        }
        $('#recLCont').html(str1)
        $('.recList').html(str2)
        $('.recList').dad({
            draggable: '.rec-video-item-info',
            callback: function () {
			    moveEnd()
            }
        })
    }

    function moveEnd(){
        var data = []
        $('.rec-video-item').each((index,dom)=>{
            
            rec_addedVideoData.forEach(item=>{
                if(Number($(dom).attr('data-id'))===Number(item.video_id)){
                    data.push(item)
                }
            })
            
        })
        data.pop()
        var str1 = ''
        data.forEach(item=>{
            str1 += `
                <a class="backList">
                    <div class="backContent">
                        <div class="backInfo">
                            <div class="backName">
                            ${item.video_profile}               
                            </div>
                            <p class="backShow">
                                ${item.video_number_views}人观看
                            </p>
                        </div>
                        <img src="${item.video_description_image}" onerror="this.src='./../image/video-page.png'"  class="backImage">
                    </div>
                </a>
            `
        })
        $('#recLCont').html(str1)
        rec_addedVideoData=JSON.parse(JSON.stringify(data))
    }


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
                    event_code = result.data.event_code
                    userName = result.data.account_name
                    event_uri_key = result.data.event_uri_key
                    channel_type = result.data.event_category_id
                    $(".head-title").text(result.data.event_title);
                    $("#codeInput").val(result.data.event_code);

                    $("#hlsInput").val(result.data.pull_stream_m3u8_url);
                    chatM3u8 = result.data.pull_stream_m3u8_url
                    $("#rtmpInput").val(result.data.pull_stream_rtmp_url);
                    $("#username").text(result.data.account_name);

                    $('.head-copy').attr('data-clipboard-text',
                        'http://www.cube.vip/h5/wxlogin.html?key=' + result.data
                        .event_uri_key)
                        new QRCode(document.getElementById("liveQrcode1"), {
                            text: 'http://www.cube.vip/h5/wxlogin.html?key=' +  result.data.event_uri_key,
                            width: 240,
                            height: 240,
                        });
                        new QRCode(document.getElementById("liveQrcode"), {
                            text: 'http://www.cube.vip/h5/wxlogin.html?key=' +  result.data.event_uri_key,
                            width: 240,
                            height: 240,
                        });
                    var functionTitleSrc = ''
                    var functionContentSrc = ''
                    result.data.app.forEach((item, index) => {
                        if (index === 0) {
                            if (item.appname == 'logo') {
                                functionTitleSrc += `<li class="layui-this">LOGO</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item layui-show">
                                   ${logoHtml}
                                </div>`
                            } else if (item.appname == '比分牌') {
                                functionTitleSrc += `<li class="layui-this">比分牌</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item layui-show">
                                ${scoreHtml}
                                </div>`
                            } 
                            // else if (item.appname == '背景替换') {
                            //     functionTitleSrc += `<li class="layui-this">背景替换</li>`
                            //     functionContentSrc += `
                            //     <div class="layui-tab-item layui-show">
                            //         ${bgReplaceHtml}
                            //     </div>`
                            // } 
                            else if (item.appname == '手势检测') {
                                functionTitleSrc += `<li class="layui-this">手势检测</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item layui-show">
                                   ${gestureHtml}
                                </div>`
                            } else if (item.appname == '自动导切') {
                                functionTitleSrc += `<li class="layui-this">自动导切</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item layui-show">
                                   ${autoHtml}
                                </div>`
                            }else if (item.appname == 'zoomin') {
                                functionTitleSrc += `<li class="layui-this">zoom-in</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item layui-show">
                                   ${zoomHtml}
                                </div>`
                            }else if (item.appname == '云幻灯片') {
                                functionTitleSrc += `<li class="layui-this">云幻灯片</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item layui-show">
                                   ${slidesHtml}
                                </div>`
                            }else if (item.appname == '背景音乐') {
                                functionTitleSrc += `<li class="layui-this">背景音乐</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item layui-show">
                                   ${musicHtml}
                                </div>`
                            }else if (item.appname == '动态特效') {
                                functionTitleSrc += `<li class="layui-this">动态特效</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item layui-show">
                                    <div id="dynamicBox">
                                    </div>
                                </div>`
                            }else if (item.appname == '图片素材') {
                                functionTitleSrc += `<li class="layui-this">图片素材</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item layui-show">
                                    <div id="kvBox">
                                        <div id="kvStart" class="defaultStyle">开启</div>
                                        <div id="kvSelect">选择图片</div>
                                    </div>
                                </div>`
                            }
                        } else {
                            if (item.appname == 'logo') {
                                functionTitleSrc += `<li>LOGO</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item">
                                   ${logoHtml}
                                </div>`
                            } else if (item.appname == '比分牌') {
                                functionTitleSrc += `<li>比分牌</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item">
                                    ${scoreHtml}
                                </div>`
                                
                            } 
                            // else if (item.appname == '背景替换') {
                            //     functionTitleSrc += `<li>背景替换</li>`
                            //     functionContentSrc += `
                            //     <div class="layui-tab-item">
                            //         ${bgReplaceHtml}
                            //     </div>`
                            // } 
                            else if (item.appname == '手势检测') {
                                functionTitleSrc += `<li>手势检测</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item">
                                    ${gestureHtml}
                                </div>`
                            } else if (item.appname == '自动导切') {
                                functionTitleSrc += `<li>自动导切</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item">
                                    ${autoHtml}
                                </div>`
                            }else if (item.appname == 'zoomin') {
                                functionTitleSrc += `<li>zoom-in</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item">
                                   ${zoomHtml}
                                </div>`
                            }else if (item.appname == '云幻灯片') {
                                functionTitleSrc += `<li>云幻灯片</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item">
                                   ${slidesHtml}
                                </div>`
                            }else if (item.appname == '背景音乐') {
                                functionTitleSrc += `<li>背景音乐</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item">
                                   ${musicHtml}
                                </div>`
                            }else if (item.appname == '动态特效') {
                                functionTitleSrc += `<li>动态特效</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item">
                                    <div id="dynamicBox">
                                    </div>
                                </div>`
                            }else if (item.appname == '图片素材') {
                                functionTitleSrc += `<li>图片素材</li>`
                                functionContentSrc += `
                                <div class="layui-tab-item">
                                    <div id="kvBox">
                                        <div id="kvStart" class="defaultStyle">开启</div>
                                        <div id="kvSelect">选择图片</div>
                                    </div>
                                </div>`
                            }
                        }
                    })
                    $('#function-title').html(functionTitleSrc)
                    $('#function-content').html(functionContentSrc)
                    if(Number(channel_type) ===1){
                        getScoreStyle()
                        renderHistoryScore()
                    }
                    setVideoMuted()
                    getIp()
                }

            },
        })

        
        // 精彩推荐开始------------------------------------------------------------------------------------
        // 获取已经添加的推荐视频
        getRecVideo()
        function getRecVideo(){
            $.ajax({
                type: "GET",
				headers: {
					token: sessionStorage.getItem('token')
				},
				url: "http://www.cube.vip/video/get_event_video/",
				data: {
					stream_code: event_code
				},
				success: function (res) {
					if (res.msg === 'success') {
						rec_addedVideoData = res.data
                        renderViewVideo()
                        
					} else {
						layer.msg('获取视频列表失败,请重试!');
					}
				}
            })
        }
        // 打开添视频弹窗
		$('.addRecName-span').on('click', function () {
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
						rec_allVideoData = res.data
					} else {
						layer.msg('获取视频列表失败,请重试!');
					}
				}
			})
			rec_momentVideoData = []
			rec_addedVideoData.forEach(item => {
				rec_momentVideoData.push(item)
				rec_allVideoData.forEach(its => {
					if (Number(item.video_id) === Number(its.video_id)) {
						its.checked = 'checked'
					}
				})
			})

			$('.rec-video-num').text(rec_addedVideoData.length)
			layer.open({
				type: 1,
				area: ['10rem', '7.3rem'],
				title: '添加视频',
				content: $('#rec-dialog'),
				shade: 0.3,
				shadeClose: true,
				closeBtn: 1,
				resize: false,
				scrollbar: false,
                move:false,
                btn: ['确认', '取消'],
				btn1: function () {
                    layer.closeAll()
                    rec_addedVideoData = []
                    rec_momentVideoData.forEach(item => { // 取消  删除记录
                        rec_addedVideoData.push(item)
                    })
                    renderViewVideo()
                },
                end: function(){
                    $('.rec-search-video-input').val('')
                }

			})
			rec_videoFiltrate()

		})
		//视频 选中 取消 change
		form.on('checkbox(rec-checkbox)', function (data) {
			var videoId = Number(data.value)
			if (data.elem.checked) {
				$('.rec-video-num').text(Number($('.rec-video-num').text()) + 1) //选中+1
				rec_allVideoData.forEach(item => { //选中 添加标记
					if (item.video_id === videoId) {
						item.checked = 'checked'
					}
				})
				rec_momentVideoData.push({ // 选中 添加记录
					video_id: videoId,
					video_profile: $(data.elem).parent().siblings('.rec-content-main-list-info').find(
						'.rec-content-main-list-name').text(),
					video_number_views: $(data.elem).parent().siblings('.rec-content-main-list-info').find(
						'.rec-content-main-list-num i').text(),
					datetime: $(data.elem).parent().siblings('.rec-content-main-list-info').find(
						'.rec-content-main-list-time i').text(),
					video_description_image:  $(data.elem).parent().siblings('.vd-video').attr("src")
				})
			} else {
				$('.rec-video-num').text(Number($('.rec-video-num').text()) - 1) // 取消-1
				rec_allVideoData.forEach(item => { // 取消 删除标记
					if (item.video_id === videoId) {
						delete item.checked
					}
				})
				rec_momentVideoData.forEach((item, index) => { // 取消  删除记录
					if (item.video_id === videoId) {
						rec_momentVideoData.splice(index, 1)
					}
				})
			}

		})


        // 删除视频-------------------------------------------------------------------------------------------------------------------
        $('.recList').on('click', '.videoDelete', function () {
            rec_addedVideoData.splice(Number($(this).parent().attr('data-dad-position'))-1, 1)
            renderViewVideo()
        })

        // 视频分页
        function rec_videoPage(pageIndex) {
            var str = ''
            var length = rec_filterVideoData.length > pageIndex * 6 ? 6 : rec_filterVideoData.length - (pageIndex - 1) * 6
            for (var i = 0; i < length; i++) {
                var index = i + (pageIndex - 1) * 6
                str += `<div class="rec-content-main-list">
                    <img class="vd-video" src="${rec_filterVideoData[index].video_description_image}" onerror="this.src='./../image/video-page.png'"></img>
                    <div class="rec-content-main-list-info">
                        <span class="rec-content-main-list-name">${rec_filterVideoData[index].video_profile}</span>
                        <span class="rec-content-main-list-time">上传时间: <i>${rec_filterVideoData[index].video_create_time}</i></span>
                        <span class="rec-content-main-list-num">观看量: <i>${rec_filterVideoData[index].video_number_views}</i> 次</span>
                    </div>
                    <div class="layui-form video-right-check">
                        <input type="checkbox" lay-filter="rec-checkbox" lay-skin="primary" class="rec-content-main-list-check" value="${rec_filterVideoData[index].video_id}" ${rec_filterVideoData[index].checked} /></div>
                    </div>
                `
            }
            if (rec_filterVideoData.length > 0) {
                $('.rec-content-main-top').html(str)
                form.render('checkbox')
            } else {
                $('.rec-content-main-top').html(
                    `<div class="rec-content-main-none"><img src="./../image/video-none.png" alt=""><p>当前没有视频哦</p></div>
                    <span class="rec-mediaUpload">
                        没有合适的视频？
                        <a href="./media.html">去媒体库上传</a>
                    </span>
                    `
                )
            }
        }
        // 视频筛选---------
        $('.rec-search-video-input').on('keypress', function (event) { // 监听回车事件
            if (event.keyCode == "13") {
                rec_videoFiltrate()
            }
        })
        $('.rec-search-video-btn').on('click', rec_videoFiltrate) //点击搜索按钮
        // 视频过滤方法
        function rec_videoFiltrate() {
            rec_filterVideoData = rec_allVideoData.filter(item => item.video_profile.search($.trim($('.rec-search-video-input')
                .val())) !== -1)
            if (rec_filterVideoData.length > 6) {
                layui.use(['laypage'], function () {
                    var laypage = layui.laypage
                    laypage.render({
                        elem: 'rec-page',
                        count: rec_filterVideoData.length,
                        limit: 6,
                        layout: ['prev', 'next'],
                        jump: function (obj, first) {
                            if (!first) {
                                // layer.msg('第 '+ obj.curr +' 页'+',每页显示'+obj.limit+'条');
                                rec_videoPage(obj.curr)
                            }
                        }
                    })
                })
            } else {
                $('#rec-page').empty()
            }
            rec_videoPage(1)
        }

        // 提交精彩推荐视频
        $('#saveAddRecVideo').on('click',function(){
            var video_id = []
            rec_addedVideoData.forEach(item => {
                video_id.push(item.video_id)
            })
            $.ajax({
                type: "POST",
                headers: {
                    token: sessionStorage.getItem('token')
                },
                url: "http://www.cube.vip/video/get_event_video/",
                data: {
                    stream_code: event_code,
                    video_id: JSON.stringify(video_id)
                },
                success: function (res) {
                    if (res.msg === 'success') {
                        layer.msg('保存成功!');
                    } else {
                        layer.msg('保存失败,请重试!');
                    }
                }
            });
        })

        // 精彩推荐结束------------------------------------------------------------------------------------



        $(".liveScan1").hover(function(){
            $('#liveQrcode1Box').toggle()
        });
        $(".liveScan").hover(function(){
            $('#liveQrcodeBox').toggle()
        });
        $('.head-copy').hover(function(){
            $('#hintBox').toggle()
        })
        $('.head-copy1').hover(function(){
            $('#hintBox1').toggle()
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
                        pullFlow(serverIp, domLiveRight, 4)
                        chatVideoJs = new Aliplayer({
                            "id": "chatVideo",
                            "source": chatM3u8,
                            "width": "7.48rem",
                            "height": "3.87rem",
                            "autoplay": true,
                            "isLive": true,
                            "rePlay": false,
                            "playsinline": true,
                            "preload": true,
                            "controlBarVisibility": "hover",
                            "useH5Prism": true,
                            "waitingTimeout":20
                          })
                        getIps()
                        if (sessionStorage.getItem(event_code)) {
                            allInfo = JSON.parse(sessionStorage.getItem(event_code))
                            pptData.state = allInfo.pptInfo.state
                            renderHistory()
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
                        setTimeout(() => {
                            getIp()
                        }, 5000)
                    }

                }
            })
        }

        function getIps() {
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
                        setTimeout(() => {
                            getIps()
                        }, 5000)

                    } else {
                        serverIp = ''
                        getIps2()
                    }
                }
            })
        }

        function getIps2() {
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
                        pullFlow(serverIp, domLiveRight, 4)
                        getIps()
                    } else {
                        setTimeout(() => {
                            getIps2()
                        }, 5000)
                    }
                }
            })
        }
        $('#pullUrlCopy').on('click',function(){
            layer.open({
                type: 1,
                area: ['4.26rem', '1.60rem'],
                title:'推流地址',
                content: $('#copy-dialog'),
                shade: 0.3,
                shadeClose: true,
                closeBtn: 1,
                resize: false,
                scrollbar: false,
            })
        })

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
            if(serverIp !== ''){
                if (index === 1) {
                    chatVideoJs.play()
                } else {
                    chatVideoJs.pause()
                }
            }
           
            if (index === 2) {
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
        function setVideoMuted() {
            domCameraOne.muted = true
            domCameraTwo.muted = true
            domCameraThree.muted = true
            domCameraFour.muted = true
            domLiveRight.muted = true
        }
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
                                }
                            });
                        },
                        error: function (error) {
                           
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

        // KV图位置 切换选中状态 
        form.on('radio(kvForm)', function(data){
            if(Number(data.value)===1){
                $('#kvImage').addClass('classOne').removeClass('classTwo classThree')
            }
            else if(Number(data.value)===2){
                $('#kvImage').addClass('classTwo').removeClass('classOne classThree')
            }
            else if(Number(data.value)===3){
                $('#kvImage').addClass('classThree').removeClass('classTwo classOne')
            }
            allInfo.kvInfo.location = Number(data.value)
        });  

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
            } 
            // else if (data.value === 'bottomCenter') {
            //     $('#areaCont').removeClass('leftBottom rightTop leftTop rightBottom bottomCenter1').addClass(
            //         'bottomCenter')
            //         styleLocation = 5
            //     if (styleFlag === 1) {
            //         $('#areaCont').removeClass('leftBottom rightTop leftTop rightBottom bottomCenter1').addClass(
            //             'bottomCenter')
            //         styleLocation = 5
            //     } else if (styleFlag === 2) {
            //         $('#areaCont').removeClass('leftBottom rightTop leftTop rightBottom bottomCenter').addClass(
            //             'bottomCenter1')
            //         styleLocation = 6
            //     }

            // }
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
                        $('.watermark-submit-btn').html('关闭').addClass('logoStart')
                        setLogoLocation(logoOrientation)
                    } else {
                        
                        $('.watermark-submit-btn').html('开启').removeClass('logoStart')
                    }

                    form.render('radio');
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
        // 打开logo弹窗
        $('#addLogoDialog').on('click',function(){
            layer.open({
                type: 1,
                area: ['10rem', '7.22rem'],
                title: 'LOGO设置',
                content: $('#logoDialog'),
                shade: 0.3,
                shadeClose: true,
                scrollbar: false,
                move: false,
            })
        })
        $('#logoSave').on('click',function(){
            layer.closeAll()
        })
        // logo位置 开关提交
        $('.watermark-submit-btn').on('click', function () {
            if($(this).hasClass('logoStart')) {
                logoFlag = 'False'
                $('.watermark-submit-btn').html('开启').removeClass('logoStart')
            } else {
                logoFlag = 'True'
                $('.watermark-submit-btn').html('关闭').addClass('logoStart')
            }
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
                        if (logoFlag === 'True') {
                            setLogoLocation(logoOrientation)
                        }
                        allInfo.update = 0
                        sendInstruct()
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
            type: 'default',
            theme: '#FF914D',
            setTips: function (value) { //自定义提示文本
                return value / 10;
            },
            change: function (value) {
                $('#slideOne .layui-slider-bar').css({
                   width: value * 100 + '%'
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
           type: 'default',
            theme: '#FF914D',
            setTips: function (value) { //自定义提示文本
                return value / 10;
            },
            change: function (value) {
                $('#slideTwo .layui-slider-bar').css({
                   width: value * 100 + '%'
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
           type: 'default',
            theme: '#FF914D',
            setTips: function (value) { //自定义提示文本
                return value / 10;
            },
            change: function (value) {
                $('#slideThree .layui-slider-bar').css({
                   width: value * 100 + '%'
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
           type: 'default',
            theme: '#FF914D',
            setTips: function (value) { //自定义提示文本
                return value / 10;
            },
            change: function (value) {
                $('#slideFour .layui-slider-bar').css({
                   width: value * 100 + '%'
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

        // 背景音乐滑块
        slide_music = slider.render({
            elem: '#slideMusic',
            min: 0,
            max: 10,
            step: 1,
            value: 0,
            type: 'default',
            theme: '#FF914D',
            setTips: function (value) { //自定义提示文本
                return value / 10;
            },
            change: function (value) {
                $('#slideMusic .layui-slider-bar').css({
                    width: value * 100 + '%'
                })
                if (value === 0) {
                    $('#music-mute').attr('src', '/image/mute-close.png')
                } else {
                    $('#music-mute').attr('src', '/image/mute-open.png')
                }
                allInfo.musicInfo.volume = value
                sessionStorage.setItem(event_code, JSON.stringify(allInfo))
                if(allInfo.musicInfo.state === 'on') {
                    allInfo.update = 0
                    sendInstruct()
                }
            }
        })

        audio_music = slider.render({
            elem: '#slideAudio',
            min: 0,
            max: 10,
            step: 1,
            value: 0,
            type: 'deslideAudiofault',
            theme: '#FF914D',
            setTips: function (value) { //自定义提示文本
                return value / 10;
            },
            change: function (value) {
                $('#slideAudio .layui-slider-bar').css({
                    width: value * 100 + '%'
                })
                if (value === 0) {
                    $('#audio-mute').attr('src', '/image/mute-close.png')
                } else {
                    $('#audio-mute').attr('src', '/image/mute-open.png')
                }
                allInfo.musicInfo.audio_volume = value
                sessionStorage.setItem(event_code, JSON.stringify(allInfo))
                if(allInfo.musicInfo.state === 'on') {
                    allInfo.update = 0
                    sendInstruct()
                }
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
                allInfo.oneSrc[0] = item
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
            drawCanvas(allInfo.numberFlag)
        }

        //  绘制canvas
        function drawCanvas(num) {
            var v1 = null
            var v2 = null
            var v3 = null
            var canvas = document.getElementById("myCanvas")
            var ctx_canvas = canvas.getContext('2d')
            if (num === 1) {
                v1 = document.getElementById(allInfo.oneSrc[0].dom)
            } else if (num === 2) {
                v1 = document.getElementById(allInfo.twoSrc[0].dom)
                v2 = document.getElementById(allInfo.twoSrc[1].dom)
            } else {
                v1 = document.getElementById(allInfo.threeSrc[0].dom)
                v2 = document.getElementById(allInfo.threeSrc[1].dom)
                v3 = document.getElementById(allInfo.threeSrc[2].dom)
            }
            clearInterval(timerDraw)
            timerDraw = window.setInterval(() => {
                if (num === 1) {
                    ctx_canvas.drawImage(v1, 0, 0, canvas.width, canvas.height)
                } else if (num === 2) {
                    ctx_canvas.drawImage(v1, v1.videoWidth / 4, 0, v1.videoWidth / 2, v1.videoHeight, 0, 0, canvas.width / 2, canvas.height)
                    ctx_canvas.drawImage(v2, v2.videoWidth / 4, 0, v2.videoWidth / 2, v2.videoHeight, canvas.width / 2, 0, canvas.width / 2, canvas.height)
                } else {
                    ctx_canvas.drawImage(v1, v1.videoWidth / 4, 0, v1.videoWidth / 2, v1.videoHeight, 0, 0, canvas.width / 2, canvas.height)
                    ctx_canvas.drawImage(v2, 0, 0, v2.videoWidth, v2.videoHeight, canvas.width / 2, 0, canvas.width / 2, canvas.height / 2)
                    ctx_canvas.drawImage(v3, 0, 0, v3.videoWidth, v3.videoHeight, canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2)
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
                    width: '0.24rem',
                    height: '0.22rem'
                })
                allInfo.liveHeadFlag = false
                domLiveRight.volume = 0

            } else {
                allInfo.liveHeadFlag = true
                $(this).attr('src', './../image/headset-open.png').css({
                    width: '0.24rem',
                    height: '0.18rem'
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
            drawCanvas(allInfo.numberFlag)

            // 直播耳机静音
            if (allInfo.liveHeadFlag) {
                $('#live-headset').attr('src', './../image/headset-open.png').css({
                    width: '0.24rem',
                    height: '0.18rem'
                })
                domLiveRight.volume = 1
            } else {
                $('#live-headset').attr('src', './../image/headset-close.png').css({
                    width: '0.24rem',
                    height: '0.22rem'
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
            if (allInfo.gestureFlag === 'off') {
                $('#gesture-btn').text('开启').css('background-color', '#ff914d')
            } else {
                $('#gesture-btn').text('关闭').css('background-color', '#f2591a')
            }
            // 自动切换
            if (allInfo.autoState === 'off') {
                $('#auto-btn').text('开启').css('background-color', '#ff914d')
            } else {
                $('#auto-btn').text('关闭').css('background-color', '#f2591a')
            }
            // zoom-in 
            if (allInfo.zoomState === 'off') {
                $('#zoom-btn').text('开启').css('background-color', '#ff914d')
            } else {
                $('#zoom-btn').text('关闭').css('background-color', '#f2591a')
            }
            // 渲染背景替换
            $('.bg-item').removeClass('bg-active').eq(allInfo.replaceFlag).addClass('bg-active')

            // 渲染文档历史记录
            if(allInfo.pptInfo.data.length>0){
                $('#lanternImage').show().attr('src',allInfo.pptInfo.data[allInfo.pptInfo.num-1])
                $('.lanternOperation .equalClass').removeClass('endStyle').addClass('activeStyle')
                $('.borderClass').removeClass('noneBorder').addClass('haveBorder')
            }

            $('.pageNum').html(allInfo.pptInfo.num+'/'+allInfo.pptInfo.total)
             
            if(allInfo.pptInfo.state === 'off') {
                $('#lanternStart').addClass('defaultStyle').removeClass('startStyle').html('开启')
                
            } else {
                $('#lanternStart').addClass('startStyle').removeClass('defaultStyle').html('关闭')
            }

             // 渲染音乐
             if(allInfo.musicInfo.state === 'off') {
                $('#musicStart').addClass('defaultStyle').removeClass('startStyle').html('开启')
            } else {
                $('#musicStart').addClass('startStyle').removeClass('defaultStyle').html('关闭')
            }
            if(allInfo.musicInfo.name !=='' && allInfo.musicInfo.oss !=='') {
                $('#musicName').html(allInfo.musicInfo.name)
            }

            if(allInfo.kvInfo.state === 'off') {
                $('#kvStart').addClass('defaultStyle').removeClass('startStyle').html('开启')
            } else {
                $('#kvStart').addClass('startStyle').removeClass('defaultStyle').html('关闭')
            }
        }
        // 手势检测-------------------------------------------------------------------------------------------------
        $('#gesture-btn').on('click', function () {
            if (allInfo.gestureFlag === 'off') {
                allInfo.gestureFlag = 'on'
                $(this).text('关闭').css('background-color', '#f2591a')
            } else {
                allInfo.gestureFlag = 'off'
                $(this).text('开启').css('background-color', '#ff914d')
            }
            sessionStorage.setItem(event_code, JSON.stringify(allInfo))
            allInfo.update = 0
            sendInstruct()
        })
        // 自动导切-------------------------------------------------------------------------------------------------
        $('#auto-btn').on('click', function () {
            if (allInfo.autoState === 'off') {
                allInfo.autoState = 'on'
                $(this).text('关闭').css('background-color', '#f2591a')
            } else {
                allInfo.autoState = 'off'
                $(this).text('开启').css('background-color', '#ff914d')
            }
            sessionStorage.setItem(event_code, JSON.stringify(allInfo))
            var info = {
                code: "FRONT_END_ACTION",
                // 视频一拼二品三拼标志 true/false
                video: {
                    score: {
                        state: allInfo.state,
                        update:0,
                        scoreLocation: scoreLocation
                    },
                    auto_selector: {
                        state: allInfo.autoState
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
        })
         // zoom-in-------------------------------------------------------------------------------------------------
         $('#zoom-btn').on('click', function () {
            if (allInfo.zoomState === 'off') {
                allInfo.zoomState = 'on'
                $(this).text('关闭').css('background-color', '#f2591a')
            } else {
                allInfo.zoomState = 'off'
                $(this).text('开启').css('background-color', '#ff914d')
            }
            sessionStorage.setItem(event_code, JSON.stringify(allInfo))
            var info = {
                 code: "FRONT_END_ACTION",
                 // 视频一拼二品三拼标志 true/false
                 video: {
                     
                    score: {
                        state: allInfo.state,
                        update:0,
                        scoreLocation: scoreLocation
                    },
                     zoom_in: {
                         state: allInfo.zoomState
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
            if(allInfo.pptInfo.state==='on'){
                layer.msg('不允许在幻灯片上加比分牌!')
                return
            }

            layer.open({
                type: 1,
                area: ['10rem', '7.22rem'],
                title: '比分牌设置',
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
                    console.log('')
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
            // if (teamInfo[3] === null || teamInfo[2] === null) {
            //     layer.msg('请上传队伍logo!')
            //     return
            // }

            // if (selectTypeIndex === null && checkIndex === null) {
            //     layer.msg('请选择比分牌样式!')
            //     return
            // }

            takeScreenshot()
            layer.closeAll()

        })

        function takeScreenshot() {
            html2canvas(document.getElementById('areaCont'), {
                allowTaint: true,
                useCORS: true,
                backgroundColor: "transparent",
                scale: 2,
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
                $('.oneClass').removeClass('defaultColor').addClass('highlightOne')
                $('.twoClass').removeClass('defaultColor').addClass('highlightTwo')
                scoreData = JSON.parse(sessionStorage.getItem('score' + event_code))
                $('#left-name').text(scoreData.nameLeft)
                $('#right-name').text(scoreData.nameRight)
                // 比分
                $('#left-score').val(scoreData.smallLeftScore)
                $('#right-score').val(scoreData.smallRightScore)
               
                var image = new Image()
                image.setAttribute('src', scoreData.src)
                image.setAttribute('id', 'model')
                image.style.width = '1.3rem'
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
                $('.oneClass').removeClass('defaultColor').addClass('highlightOne')
                $('.twoClass').removeClass('defaultColor').addClass('highlightTwo')
                scoreData = JSON.parse(sessionStorage.getItem('score' + event_code))
                $('#left-name').text(scoreData.nameLeft)
                $('#right-name').text(scoreData.nameRight)
                // 比分
               
                $('#left-score').val(scoreData.smallLeftScore)
                $('#right-score').val(scoreData.smallRightScore)
                
                var image = new Image()
                image.setAttribute('src', scoreData.src)
                image.setAttribute('id', 'model')
                image.style.width = '1.3rem'
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
                    $('#left-subtotal').text(scoreData.bigLeftScore)
                    var liveBigScoreRight = document.createElement('p')
                    liveBigScoreRight.setAttribute('id', 'liveBigScoreRight')
                    $('#scoreBrand').append(liveBigScoreRight)
                    $('#liveBigScoreRight').css({
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
                    $('#right-subtotal').text(scoreData.bigRightScore)
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
            $('.oneClass').removeClass('highlightOne').addClass('defaultColor')
            $('.twoClass').removeClass('highlightTwo').addClass('defaultColor')
            fileScore = 0
            allInfo.state = 'off'
            scoreLocation = 0
            allInfo.update = 0
            sendInstruct()
            sessionStorage.setItem(event_code, JSON.stringify(allInfo))
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
                    sessionStorage.setItem(event_code, JSON.stringify(allInfo))
                    sendInstruct()

                },
                width: $("#scoreBrand").width(),
                height: $("#scoreBrand").height()
            })
        }
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
           
            $('#liveScoreLeft').text(num)
            scoreData.smallLeftScore = num
            
            saveScoreLocal()
            saveScoreBrand()
        }

        // 左边队伍加减小计
        $('#left-subtotal-plus').on('click', function () {
            if(scoreData.info.classify !== 1){
                scoreData.bigLeftScore = scoreData.bigLeftScore + 1
                $('#left-subtotal').text(scoreData.bigLeftScore)
                $('#liveBigScoreLeft').text(scoreData.bigLeftScore)
                saveScoreLocal()
                saveScoreBrand()
            }
            
        })
        $('#left-subtotal-minus').on('click', function () {
            if(scoreData.info.classify !== 1){
                scoreData.bigLeftScore = scoreData.bigLeftScore -1
                if(scoreData.bigLeftScore <= 0) {
                    scoreData.bigLeftScore = 0
                }
                $('#left-subtotal').text(scoreData.bigLeftScore)
                $('#liveBigScoreLeft').text(scoreData.bigLeftScore)
                saveScoreLocal()
                saveScoreBrand()
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

            $('#liveScoreRight').text(num)
            scoreData.smallRightScore = num
            saveScoreLocal()
            saveScoreBrand()
        }

        // 右边队伍加减小计
        $('#right-subtotal-plus').on('click', function () {
            if(scoreData.info.classify !== 1) {
                 scoreData.bigRightScore = scoreData.bigRightScore + 1
                $('#right-subtotal').text(scoreData.bigRightScore)
                $('#liveBigScoreRight').text(scoreData.bigRightScore)
                saveScoreLocal()
                saveScoreBrand()
            }
           
        })
        $('#right-subtotal-minus').on('click', function () {
            if(scoreData.info.classify !== 1) { 
                scoreData.bigRightScore = scoreData.bigRightScore - 1
                if(scoreData.bigRightScore <= 0) {
                    scoreData.bigRightScore = 0
                }
                $('#right-subtotal').text(scoreData.bigRightScore)
                $('#liveBigScoreRight').text(scoreData.bigRightScore)
                saveScoreLocal()
                saveScoreBrand()
            }
            
        })

        // 切换往后台发数据--------------------------------------------------------------------------------------------------
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
             var pptImg = ''
             if(allInfo.pptInfo.state ==='on') {
                 pptImg = allInfo.pptInfo.data[allInfo.pptInfo.num-1]
             } else {
                 pptImg = ''
             }

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
                    },
                    auto_selector: {
                        state: allInfo.autoState
                    },
                    zoom_in: {
                        state: allInfo.zoomState
                    },
                    gesture_selector:{
                        state:allInfo.gestureFlag
                    },
                    slides:{
                        state:allInfo.pptInfo.state,
                        slidesFormat:allInfo.pptInfo.style,
                        slide_oss:pptImg,
                        update:allInfo.pptInfo.update
                    },
                    gif:{
                        state:allInfo.gifInfo.state,
                        x:allInfo.gifInfo.x,
                        y:allInfo.gifInfo.y,
                        width:allInfo.gifInfo.width,
                        height:allInfo.gifInfo.height,
                        gif_oss:allInfo.gifInfo.oss,
                        update:allInfo.gifInfo.update
                    },
                    image:{
                        state:allInfo.kvInfo.state,
                        imageLocation:allInfo.kvInfo.location,
                        type:'static',
                        image_oss:allInfo.kvInfo.oss,
                        update:allInfo.kvInfo.update
                    }
                },
                audio: {
                    mixer: {
                        // 机位音量
                        oneVolume: allInfo.oneMuteSize / 10,
                        twoVolume: allInfo.twoMuteSize / 10,
                        threeVolume: allInfo.threeMuteSize / 10,
                        fourVolume: allInfo.fourMuteSize / 10
                    },
                    music: {
                        state: allInfo.musicInfo.state,
                        music_volume: allInfo.musicInfo.volume,
                        audio_volume:allInfo.musicInfo.audio_volume,
                        music_oss:allInfo.musicInfo.oss,
                        update:allInfo.musicInfo.update
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
            allInfo.pptInfo.update = 0 
            allInfo.musicInfo.update = 0
            allInfo.kvInfo.update = 0
            sessionStorage.setItem(event_code, JSON.stringify(allInfo))
        }
        // 文档操作开始---------------------------------------------------------------------------------------------------------

        // 打开文档弹窗
        $('#selectDoc').on('click',function(){
            layer.open({
                type: 1,
                area: ['10rem', '7.22rem'],
                title: '文档设置',
                content: $('#docDialog'),
                shade: 0.3,
                shadeClose: true,
                scrollbar: false,
                move: false,
                end: function () {
                    $('#addDoc').html('+添加文档')
                }
            })
        })
        // 获取文档列表
        getAllPdf()
        function getAllPdf(){
            $.ajax({
                type: 'GET',
                url: "http://www.cube.vip/event/get_pdf/",
                dataType: "json",
                headers: {
                    token: sessionStorage.getItem('token')
                },
                success: res => {
                    if(res.msg==='success'){
                        if(res.data.length>0) {
                            $('.docNone').hide()
                            var src = ''
                            res.data.forEach(item=>{
                                src+=`<div class="docItem" data-id="${item.pdf_id}">
                                    <span class="docITitle">${item.pdf_name.replace('.pdf','')}</span>
                                    <span class="docIDelete">删除</span>
                                </div>
                                `
                            })
                            $('.docListCont').html(src)
                        } else {
                            $('.docListCont').html(`<div class="docNone">
                            <p class="noneTitle">当前列表为空</p>
                            <p class="noneTitle">请添加文档</p>
                            <p class="noneInfo">文件支持类型</p>
                            <p class="noneInfo">目前仅支持pdf格式</p>
                        </div>`)
                        }
                    }
                }
            })
        }
        // 选中当前幻灯片样式
        $('.docSItem').on('click',function() {
            if($(this).index() === 3) {
                layer.msg('当前模式暂停使用,敬请谅解!')
                return false
            }
            pptData.style = $(this).index()+1
            $(this).addClass('docActiveItem').siblings('.docSItem').removeClass('docActiveItem')
            $('#docPreview').attr('src',`./../image/pattern${$(this).index()+1}.png`)
        })
        // 上传文档
        upload.render({
            elem: '#addDoc', //绑定元素
            url: 'http://www.cube.vip/event/pdf_drawing_create/', //上传接口
            accept: 'file',
            acceptMime:'application/pdf',
            exts:'pdf',
            headers:{token: sessionStorage.getItem('token')},
            progress: function(n, elem){
                $(elem).text('上传中'+'('+n+'%)')
            },
            done: function(res){
              if(res.msg==="success"){
                  layer.msg('上传成功!')
                  getAllPdf()
              } else {
                layer.msg('上传失败,请重试!')
              }
              $('#addDoc').html('+添加文档')
            },
            error: function(){
              //请求异常回调
              $('#addDoc').html('+添加文档')
            }
          });
        // 删除文档
        $('.docListCont').on('click','.docIDelete',function(){
            layer.open({
                type: 1,
                title: '删除提示',
                area: ['640px', '268px'],
                content: '<div style="margin: 48px 0 0 46px;font-size:18px;color:#666;">是否继续?</div>',
                shade: 0.3,
                shadeClose: true,
                closeBtn: 1,
                resize: false,
                btn: ['确认', '取消'],
                move:false,
                yes: index=> {
                    layer.close(index)
                    if($(this).parent().attr('data-id') ==allInfo.pptInfo.id) {
                        if(allInfo.pptInfo.state === 'on'){
                            layer.msg('请先关闭!')
                            return
                        }
                    }
                    $.ajax({
                        type: 'GET',
                        url: "http://www.cube.vip/event/delete_pdf/",
                        dataType: "json",
                        headers: {
                            token: sessionStorage.getItem('token')
                        },
                        data: {
                            pdf_id:$(this).parent().attr('data-id')
                        },
                        success: res => {
                            if(res.msg==='success'){
                                layer.msg('删除成功!')
                                
                                pptData.id = ''
                                pptData.data = []
                                pptData.num = 0
                                pptData.total = 0
                          
                                if($(this).parent().attr('data-id') ==allInfo.pptInfo.id){
                                    allInfo.pptInfo.id = ''
                                    allInfo.pptInfo.data = []
                                    allInfo.pptInfo.num = 0
                                    allInfo.pptInfo.total = 0
                                    $('.lanternOperation .equalClass').removeClass('activeStyle').addClass('endStyle')
                                    $('.borderClass').removeClass('haveBorder').addClass('noneBorder')
                                    $('#lanternImage').hide()
                                    $('.pageNum').html(0+'/'+0)
                                }
                                sessionStorage.setItem(event_code, JSON.stringify(allInfo))
                                getAllPdf()
                            } else {
                                layer.msg('删除失败,请稍后重试!')
                            }
                        }
                    })
                }
            })
            return false
        })
        // 选中某个文档
        $('.docListCont').on('click','.docItem',function(){
            $(this).css({
                backgroundColor:'rgba(255,145,77,0.3)',
                color:'#FF914D'
            }).siblings().css({
                backgroundColor:'',
                color:'#999'
            })
            $.ajax({
                type: 'GET',
                url: "http://www.cube.vip/event/get_pdf/",
                dataType: "json",
                headers: {
                    token: sessionStorage.getItem('token')
                },
                data: {
                    pdf_id:$(this).attr('data-id')
                },
                success: res => {
                    if(res.msg==='success'){

                        pptData.data = []
                        for(var i=0;i<res.data[0].pdf_count;i++){
                            pptData.data.push(res.data[0].url+(i+1)+'.png')
                        }
                        pptData.id =res.data[0].pdf_id
                        pptData.num = 1
                        pptData.total = res.data[0].pdf_count
                    }
                }
            })
        })


        // 保存幻灯片
        $('#docSave').on('click',function(){
            if(pptData.data.length<=0){
                layer.msg('请选择文档!')
            } else if(pptData.style === 0) {
                layer.msg('请选择样式!')
            } else {
                pptData.num = 1
                allInfo.pptInfo = JSON.parse(JSON.stringify(pptData))
                sessionStorage.setItem(event_code, JSON.stringify(allInfo))
                $('#lanternImage').show().attr('src',pptData.data[0])
                $('.pageNum').html(pptData.num+'/'+pptData.total)
                layer.closeAll()
                $('.lanternOperation .equalClass').removeClass('endStyle').addClass('activeStyle')
                $('.borderClass').removeClass('noneBorder').addClass('haveBorder')
            }
            
        })

        // 操作幻灯片
        // 开始幻灯片
        $('#lanternStart').on('click',function(){
            if(allInfo.pptInfo.data.length<=0){
                layer.msg('请先选择文档!')
                return 
            }
            if(allInfo.pptInfo.state === 'off') {
                if(allInfo.gifInfo.state==='on'){
                    layer.msg('不允许在动态特效上加PDF!')
                    return
                }
                if(allInfo.state==='on'){
                    layer.msg('不允许在比分牌上加PDF!')
                    return
                }
                
                allInfo.pptInfo.state = 'on'
                pptData.state = 'on'
                $(this).addClass('startStyle').removeClass('defaultStyle').html('关闭')
                
            } else {
                allInfo.pptInfo.state = 'off'
                pptData.state = 'off'
                $(this).addClass('defaultStyle').removeClass('startStyle').html('开启')
            }
            sessionStorage.setItem(event_code, JSON.stringify(allInfo))
            allInfo.update = 0
            sendInstruct()
        })
        //首页
        $('.pageFirst').on('click',function(){
            if(allInfo.pptInfo.data.length<=0){
                layer.msg('请先选择文档!')
                return 
            }
            allInfo.pptInfo.num = 1
            changePPTPage()
        })
        // 尾页
        $('.pageEnd').on('click',function(){
            if(allInfo.pptInfo.data.length<=0){
                layer.msg('请先选择文档!')
                return 
            }
            allInfo.pptInfo.num = allInfo.pptInfo.total
            changePPTPage()
        })
        // 上一页
        $('.pagePre').on('click',function(){
            if(allInfo.pptInfo.data.length<=0){
                layer.msg('请先选择文档!')
                return 
            }
            if(allInfo.pptInfo.num  === 1) {
                layer.msg('已经是第一页了!')
                return
            }
            allInfo.pptInfo.num = Number(allInfo.pptInfo.num) - 1
            changePPTPage()
        })
        // 下一页
        $('.pageNext').on('click',function(){
            if(allInfo.pptInfo.data.length<=0){
                layer.msg('请先选择文档!')
                return 
            }
            if(allInfo.pptInfo.num  === allInfo.pptInfo.total) {
                layer.msg('已经是最后一页了!')
                return
            }
            allInfo.pptInfo.num = Number(allInfo.pptInfo.num) + 1
            changePPTPage()
        })
        // $('.pageInput').on('blur',function(){
        //     if(allInfo.pptInfo.data.length<=0){
        //         layer.msg('请先选择文档!')
        //         return 
        //     }
        //     if(!/\d/.test($.trim(Number($(this).val())))){
        //         layer.msg('请正确输入页码!')
        //         return
        //     }
        //     if($.trim(Number($(this).val())) > allInfo.pptInfo.total){
        //         allInfo.pptInfo.num = allInfo.pptInfo.total
        //         $(this).val(allInfo.pptInfo.total)
        //     } else if($.trim(Number($(this).val()))<1){
        //         allInfo.pptInfo.num = 1
        //         $(this).val(1)
        //     } else {
        //         allInfo.pptInfo.num =$.trim(Number($(this).val()))
        //     }
        //     changePPTPage()
        // })
        $('.pageInput').keyup(function(event){
            if(event.keyCode ==13){
                if(allInfo.pptInfo.data.length<=0){
                    layer.msg('请先选择文档!')
                    return 
                }
                if(!/\d/.test($.trim(Number($(this).val())))){
                    layer.msg('请正确输入页码!')
                    return
                }
                if($.trim(Number($(this).val())) > allInfo.pptInfo.total){
                    allInfo.pptInfo.num = allInfo.pptInfo.total
                    $(this).val(allInfo.pptInfo.total)
                } else if($.trim(Number($(this).val()))<1){
                    allInfo.pptInfo.num = 1
                    $(this).val(1)
                } else {
                    allInfo.pptInfo.num =$.trim(Number($(this).val()))
                }
                changePPTPage()
            }
        })

        // 改变页码
        function changePPTPage(){
            $('#lanternImage').attr('src',allInfo.pptInfo.data[allInfo.pptInfo.num-1])
            $('.pageNum').html(allInfo.pptInfo.num+'/'+allInfo.pptInfo.total)
            allInfo.pptInfo.update = 1
            sessionStorage.setItem(event_code, JSON.stringify(allInfo))
            if(allInfo.pptInfo.state==='on'){
                allInfo.update = 0
                sendInstruct()
            }
        }
        // 文档操作结束---------------------------------------------------------------------------------------------------------
        
         // 云推流开始---------------------------------------------------------------------------------------------------------
        // 点击开始推流
        $('.pushList').on('click',function(e){

            // 未推流状态
            if(e.target.className === 'pushBtn') {
                if($.trim($(this).find('.pushInputs').val()).length<=0||!/^rtmp:\/\/([\w.]+\/?)\S*/.test($.trim($(this).find('.pushInputs').val()))　){
                    $(this).find('.pushInputs').focus()
                    layer.msg('请正确输入推流地址!')
                }else {
                    $.ajax({
                        type: 'POST',
                        url: "http://www.cube.vip/event/push_rtmp/",
                        headers: {
                            token: sessionStorage.getItem('token')
                        },
                        data: {
                            event_code:event_code,
                            message:JSON.stringify({
                                code:'FRONT_END_ACTION',
                                cloud_rtmp:{
                                    action:'on',
                                    index:$(this).index() + 1,
                                    url:$.trim($(this).find('.pushInputs').val())
                                }
                            })
                           
                        },
                        success: res => {
                            if (res.msg === 'success') {
                                inquirePushState()
                                startPushTimer()
                            } else if(res.msg === 'error') {
                                layer.msg('直播未开始!')
                            }
                        }
                    })
                }
            }
            // 关闭推流
           else if(e.target.className === 'pushBtn pushNormal'){
                if($.trim($(this).find('.pushInputs').val()).length<=0||!/^rtmp:\/\/([\w.]+\/?)\S*/.test($.trim($(this).find('.pushInputs').val()))　){
                    $(this).find('.pushInputs').focus()
                    layer.msg('请正确输入推流地址!')
                }else {
                    $.ajax({
                        type: 'POST',
                        url: "http://www.cube.vip/event/push_rtmp/",
                        headers: {
                            token: sessionStorage.getItem('token')
                        },
                        data: {
                            event_code:event_code,
                            message:JSON.stringify({
                                code:'FRONT_END_ACTION',
                                cloud_rtmp:{
                                    action:'off',
                                    index:$(this).index() + 1,
                                    url:$.trim($(this).find('.pushInputs').val())
                                }
                            })
                           
                        },
                        success: res => {
                            if (res.msg === 'success') {
                                inquirePushState()
                                startPushTimer()
                            } else if(res.msg === 'error') {
                                layer.msg('直播未开始!')
                            }
                        }
                    })
                }
            } 
            // 异常重新退
            else if(e.target.className === 'pushBtn pushError'){
                if($.trim($(this).find('.pushInputs').val()).length<=0||!/^rtmp:\/\/([\w.]+\/?)\S*/.test($.trim($(this).find('.pushInputs').val()))　){
                    $(this).find('.pushInputs').focus()
                    layer.msg('请正确输入推流地址!')
                }else {
                    $.ajax({
                        type: 'POST',
                        url: "http://www.cube.vip/event/push_rtmp/",
                        headers: {
                            token: sessionStorage.getItem('token')
                        },
                        data: {
                            event_code:event_code,
                            message:JSON.stringify({
                                code:'FRONT_END_ACTION',
                                cloud_rtmp:{
                                    action:'off',
                                    index:$(this).index() + 1,
                                    url:$.trim($(this).find('.pushInputs').val())
                                }
                            })
                           
                        },
                        success: res => {
                            if (res.msg === 'success') {
                                $.ajax({
                                    type: 'POST',
                                    url: "http://www.cube.vip/event/push_rtmp/",
                                    headers: {
                                        token: sessionStorage.getItem('token')
                                    },
                                    data: {
                                        event_code:event_code,
                                        message:JSON.stringify({
                                            code:'FRONT_END_ACTION',
                                            cloud_rtmp:{
                                                action:'on',
                                                index:$(this).index() + 1,
                                                url:$.trim($(this).find('.pushInputs').val())
                                            }
                                        })
                                       
                                    },
                                    success: res => {
                                        if (res.msg === 'success') {
                                            inquirePushState()
                                            startPushTimer()
                                        } else if(res.msg === 'error') {
                                            layer.msg('直播未开始!')
                                        }
                                    }
                                })
                            } else if(res.msg === 'error') {
                                layer.msg('直播未开始!')
                            }
                        }
                    })
                    
                }
            }
            
        })
        // 查询云推流状态
        inquirePushState()
        function inquirePushState(){
            $.ajax({
                type: 'POST',
                url: "http://www.cube.vip/event/get_push_status/",
                headers: {
                    token: sessionStorage.getItem('token')
                },
                data: {
                    index: JSON.stringify([1,2,3,4,5]),
                    event_code:event_code,
                },
                success: res => {
                    if (res.msg === 'success') {
                       $.each(res.data,function(key,value){
                        if(value !== null){
                            $('.pushList').eq(value.cloud_rtmp.index - 1).find('.pushInputs').val(value.cloud_rtmp.url)
                            if(value.cloud_rtmp.action==='on'){
                                $('.pushList').eq(value.cloud_rtmp.index - 1).find('.pushBtn').html('正在推流').removeClass('pushNormal pushError').addClass('pushConnect')
                            } else if(value.cloud_rtmp.action==='normal'){
                                 $('.pushList').eq(value.cloud_rtmp.index - 1).find('.pushBtn').html('推流正常').removeClass('pushConnect pushError').addClass('pushNormal')
                            }else if(value.cloud_rtmp.action==='error') {
                                $('.pushList').eq(value.cloud_rtmp.index - 1).find('.pushBtn').html('推流异常,点击重试').removeClass('pushConnect pushNormal').addClass('pushError')
                            } else {
                                $('.pushList').eq(value.cloud_rtmp.index - 1).find('.pushBtn').html('开始').removeClass('pushConnect pushNormal pushError')
                            }
                        }
                       })
                    }
                }
            })
        }
        startPushTimer()
        function startPushTimer(){
            clearInterval(pushTimer)
            pushTimer=setInterval(()=>{
                inquirePushState()
            },10000)
        }


       // 云推流结束---------------------------------------------------------------------------------------------------------

         // 背景音乐开始-------------------------------------------------------------------------------------------------------

       // 打开背景音乐弹窗
       $('#musicSelect').on('click',function(){
        layer.open({
            type: 1,
            area: ['10rem', '7.22rem'],
            title: '背景音乐设置',
            content: $('#musicDialog'),
            shade: 0.3,
            shadeClose: true,
            scrollbar: false,
            move: false,
            end: function () {
               $.each($('.musicAudio'),function(index,ele){
                   ele.load()
               })
            }
        })
   })
    // 获取所有音乐
    getAllMusic()
    function getAllMusic() {
        $.ajax({
              url:'http://www.cube.vip/event/upload_music/',
              type: 'GET',
              headers: {
                  token: sessionStorage.getItem('token')
              },
              success:res =>{
                  if(res.msg==='success'){
                      var str= ''
                      if(res.data.length>0){
                          res.data.forEach(item=>{
                              str+=`<div class="musicItem">
                              <span class="musicTitle">${item.music_name.replace('.mp3','')}</span>
                              <audio class="musicAudio" src="${item.oss_file}" controlslist="nodownload" controls preload="auto"></audio>
                              <span class="musicDelete" data-id="${item.music_code}">删除</span>
                              </div>`
                          })
                      }else {
                          str+=`<div class="musicNone">
                          <p class="maxMusic">
                              当前列表为空<br />
                              请添加音乐
                          </p>
                          <p class="minMusic">
                              文件支持类型<br />
                              目前仅支持MP3格式
                          </p>
                      </div>`
                      }
                      
                        $('.musicList').html(str)
                        // 播放某首音乐
                        $.each($('.musicAudio'),function(index,ele){
                            ele.addEventListener("playing", function(){		//播放状态Doing
                                $.each($('.musicAudio'),function(inx,dom){
                                    if(inx!==index){
                                        dom.pause()
                                    }
                                })
                            })
                        })
                  }
              }

        })
    }
    // 上传音乐
    upload.render({
        elem: '#addMusic',
        url: 'http://www.cube.vip/event/upload_music/', //上传接口
        accept: 'audio',
        acceptMime:'audio/mpeg',
        exts:'mp3',
        headers:{token: sessionStorage.getItem('token')},
        progress: function(n, elem){
            $(elem).text('上传中'+'('+n+'%)')
        },
        done: function(res){
          if(res.msg==="success"){
              layer.msg('上传成功!')
              getAllMusic()
          } else {
            layer.msg('上传失败,请重试!')
          }
          $('#addMusic').html('+添加音乐')
        },
        error: function(){
          //请求异常回调
          $('#addMusic').html('+添加音乐')
        }
    });
    // 删除音乐
    $('.musicList').on('click','.musicDelete',function(){
        layer.open({
            type: 1,
            title: '删除提示',
            area: ['640px', '268px'],
            content: '<div style="margin: 48px 0 0 46px;font-size:18px;color:#666;">是否继续?</div>',
            shade: 0.3,
            shadeClose: true,
            closeBtn: 1,
            resize: false,
            btn: ['确认', '取消'],
            move:false,
            yes: index=> {
                
                musicData.oss = ''
                musicData.name = ''
                if($(this).siblings('.musicAudio').attr('src').replace('beijing','beijing-internal')===allInfo.musicInfo.oss && $(this).siblings('.musicTitle').html()===allInfo.musicInfo.name){
                    if(allInfo.musicInfo.state === 'on') {
                        layer.close(index)
                        layer.msg('请先关闭背景音乐!')
                        return
                    }
                    allInfo.musicInfo.oss = ''
                    allInfo.musicInfo.name = ''
                    $('#musicName').html('')
                }
                layer.close(index)
                $.ajax({
                    type: 'GET',
                    url: "http://www.cube.vip/event/delete_music/",
                    dataType: "json",
                    headers: {
                        token: sessionStorage.getItem('token')
                    },
                    data: {
                        music_code:$(this).attr('data-id')
                    },
                    success: res => {
                        if(res.msg==='success'){
                            layer.msg('删除成功!')
                            getAllMusic()
                        } else {
                            layer.msg('删除失败,请稍后重试!')
                        }
                    }
                })
            }
        })
        return false
    })
    //  选中某个音乐
    $('.musicList').on('click','.musicItem',function(){
        $(this).css({
            backgroundColor:'rgba(255,145,77,0.3)',
            color:'#FF914D'
        }).siblings().css({
            backgroundColor:'',
            color:'#999'
        })
        musicData.oss = $(this).find('.musicAudio').attr('src').replace('beijing','beijing-internal')
        musicData.name = $(this).find('.musicTitle').html()
    })
    // 音乐提交
    $('#musicSave').on('click',function(){
        if(musicData.oss === '' && musicData.name === ''){
            layer.msg('请先选择音乐!')
            return
        } 
        layer.closeAll()
        allInfo.musicInfo.oss = musicData.oss
        allInfo.musicInfo.name = musicData.name
        sessionStorage.setItem(event_code, JSON.stringify(allInfo))
        $('#musicName').html(musicData.name)
        if(allInfo.musicInfo.state === 'on') {
            allInfo.update = 0
            allInfo.musicInfo.update = 1
            sendInstruct()
        }
    })
    // 开启关闭音乐
    $('#musicStart').on('click',function(){
        if(allInfo.musicInfo.name ==='' || allInfo.musicInfo.oss ===''){
            layer.msg('请先选择音乐!')
            return
        }
        
        if($(this).hasClass('defaultStyle')){
            $(this).removeClass('defaultStyle').addClass('startStyle').html('关闭')
            allInfo.musicInfo.update = 1
            allInfo.musicInfo.state = 'on'
            
        } else {
            $(this).removeClass('startStyle').addClass('defaultStyle').html('开启')
            allInfo.musicInfo.update = 0
            allInfo.musicInfo.state = 'off'
        }   
        allInfo.update = 0
        sendInstruct()
        sessionStorage.setItem(event_code, JSON.stringify(allInfo))
            
    })

   // 背景音乐结束-------------------------------------------------------------------------------------------------------


   // 动态特效开始 ------------------------------------------------------------------------------------------------------
    // 获取所有动态gif
    getAllGif()
    function getAllGif(){
        $.ajax({
            url:'http://www.cube.vip/event/get_all_gif/',
            type: 'GET',
            headers: {
                token: sessionStorage.getItem('token')
            },
            success:res=>{
                if(res.msg==='success'){
                    var str=''
                    if( allInfo.gifInfo.state === 'off'){
                        str+=`<div class="itemBox">
                            <div class="dynamicItem active-dynamicItem" data-id="-1"  data-x="0" data-y="0" data-width="0" data-height="0">
                                <img src="http://changshijie.oss-cn-beijing.aliyuncs.com/media/other/gifopen.png" id="default-img">
                            </div>
                            <p class="itemName">无</p>
                        </div>`
                    } else {
                        str+=`<div class="itemBox">
                            <div class="dynamicItem" data-id="-1"  data-x="0" data-y="0" data-width="0" data-height="0">
                                <img src="http://changshijie.oss-cn-beijing.aliyuncs.com/media/other/gifclose.png" id="default-img">
                            </div>
                            <p class="itemName">无</p>
                        </div>`
                    }
                    res.data.forEach((item,index)=>{
                        var itm = JSON.parse(item.gif_description)
                        if(allInfo.gifInfo.oss === itm.gif_oss.replace('beijing','beijing-internal')) {
                             str+=`<div class="itemBox">
                                <div class="dynamicItem active-dynamicItem" data-id="${index}" data-width="${itm.width}" data-height="${itm.height}" data-x="${itm.x}" data-y="${itm.y}">
                                    <img src="${itm.gif_oss}" id="default-img">
                                </div>
                                <p class="itemName">${item.gif_name}</p>
                            </div>`
                        } else {
                            str+=`<div class="itemBox">
                                <div class="dynamicItem" data-id="${index}" data-x="${itm.x}" data-y="${itm.y}" data-width="${itm.width}" data-height="${itm.height}">
                                    <img src="${itm.gif_oss}" id="default-img">
                                </div>
                                <p class="itemName">${item.gif_name}</p>
                            </div>`
                        }
                    })
                    $('#dynamicBox').html(str)
                }
            }
        })
    }
   // 动态特效选取
    $('#dynamicBox').on('click','.dynamicItem',function(e){
       
        if($(this).attr('data-id')!=='-1') {

            if(allInfo.kvInfo.state==='on'&&allInfo.kvInfo.location===3) {
                layer.msg('不允许在全屏图层上加动态特效!')
                return
            }
            if( allInfo.pptInfo.state === 'on'){
                layer.msg('不允许在PDF上加动态特效!')
                return
            }
           


            $('#default-img').attr('src','http://changshijie.oss-cn-beijing.aliyuncs.com/media/other/gifclose.png')
            allInfo.gifInfo.state = 'on'
        }
        if($(this).attr('data-id')==='-1') {
            $('#default-img').attr('src','http://changshijie.oss-cn-beijing.aliyuncs.com/media/other/gifopen.png')
            allInfo.gifInfo.state = 'off'
        }
        // 
        allInfo.gifInfo.oss = $(this).find('img').attr('src').replace('beijing','beijing-internal')
        allInfo.gifInfo.x = Number($(this).attr('data-x'))
        allInfo.gifInfo.y = Number($(this).attr('data-y'))
        allInfo.gifInfo.width = Number($(this).attr('data-width'))
        allInfo.gifInfo.height = Number($(this).attr('data-height'))
        allInfo.gifInfo.update = 1
        $(this).addClass('active-dynamicItem').parent().siblings('.itemBox').find('.dynamicItem').removeClass('active-dynamicItem')

        allInfo.update = 0
        sendInstruct()
        sessionStorage.setItem(event_code, JSON.stringify(allInfo))
    })
    // 动态特效结束 -----------------------------------------------------------------------------------------------------


    // kv图开始----------------------------------------------------------------------------------------------------------
    // 打开kv图弹窗
    $('#kvSelect').on('click',function(){
        layer.open({
            type: 1,
            area: ['10rem', '7.22rem'],
            title: '素材设置',
            content: $('#kvDialog'),
            shade: 0.3,
            shadeClose: true,
            scrollbar: false,
            move: false,
            end: function () {
            //    $.each($('.musicAudio'),function(index,ele){
            //        ele.load()
            //    })
            }
        })
    })

    // 上传kv图
    upload.render({
        elem: '#addKv',
        url: 'http://www.cube.vip/event/notice_board_style/', //上传接口
        accept: 'images',
        acceptMime: 'image/png',
        exts:'png',
        headers:{token: sessionStorage.getItem('token')},
        done: function(res){
        if(res.msg==="success"){
            layer.msg('上传成功!')
            getALlKvImage()
        } else {
            layer.msg('上传失败,请重试!')
        }
        },
        error: function(){
        //请求异常回调
        }
    });
   
    getALlKvImage()
    // 获取所有kv图
    function getALlKvImage(){
        $.ajax({
            url:'http://www.cube.vip/event/notice_board_style/',
            type: 'GET',
            headers: {
                token: sessionStorage.getItem('token')
            },
            success:res=>{
                if(res.msg==='success'){
                    var str = ''
                    res.data.forEach(item=>{
                        str+=`<div class="kvItem">
                                    <img src="${item.scorecardurl}" alt="">
                                    <div class="kvDelete" data-id="${item.id}">
                                        <i class="layui-icon layui-icon-delete"></i>
                                    </div>
                                    
                                </div>`
                        
                    })
                    if(res.data.length>=6){
                        $('#addKv').hide()
                    } else {
                        $('#addKv').show()
                    }
                    
                    $('#kvLeft').html(str)
                }
            }
        })
    }

    //删除kv图
    $('#kvLeft').on('click','.kvDelete',function(){
        $.ajax({
            url:'http://www.cube.vip/event/delete_notice_board/',
            type: 'GET',
            headers: {
                token: sessionStorage.getItem('token')
            },
            data:{
                id:$(this).attr('data-id')
            },
            success:res=>{
                if(res.msg==='success'){
                    layer.msg('删除成功!')
                    $('#kvImage').hide().attr('src','')
                    allInfo.kvInfo.oss = ''
                    getALlKvImage()
                } else {
                    layer.msg('删除失败,请重试!')
                }
            }
        })
        return false
    })

    // 选中kv图
    $('#kvLeft').on('click','.kvItem',function(){
        $(this).addClass('kvAcItem')
        $(this).siblings('.kvItem').removeClass('kvAcItem')
        $('#kvImage').show().attr('src',$(this).find('img').attr('src'))
        allInfo.kvInfo.oss = $(this).find('img').attr('src').replace('beijing','beijing-internal')
        allInfo.kvInfo.update = 1 
    })

    // 提交
    $('#kvSave').on('click',function () {
        if(allInfo.kvInfo.oss === ''){
            layer.msg('请选择图片!')
            return
        }
        
        if(allInfo.kvInfo.state === 'on'){
            if(allInfo.gifInfo.state==='on'&&allInfo.kvInfo.location===3){
                layer.msg('不允许在动态特效上加全屏图层!')
                return
            }
            allInfo.kvInfo.update = 1
            allInfo.update = 0
            sendInstruct()
        }
        layer.closeAll()
    })

    // 开启
    $('#kvStart').on('click',function(){
        if(allInfo.kvInfo.oss === ''){
            layer.msg('请先选择图片!')
            return
        }
        
        if($(this).hasClass('defaultStyle')){

            if(allInfo.gifInfo.state==='on'&&allInfo.kvInfo.location===3){
                layer.msg('不允许在动态特效上加全屏图层!')
                return
            }
            $(this).removeClass('defaultStyle').addClass('startStyle').html('关闭')
            allInfo.kvInfo.update = 1
            allInfo.kvInfo.state = 'on'
            
        } else {
            $(this).removeClass('startStyle').addClass('defaultStyle').html('开启')
            allInfo.kvInfo.update = 0
            allInfo.kvInfo.state = 'off'
        }   
        allInfo.update = 0
        sendInstruct()
        sessionStorage.setItem(event_code, JSON.stringify(allInfo))
    })
  
      

    // kv图关闭----------------------------------------------------------------------------------------------------------
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
            var message = data.message.split("%-%")
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
                    'message': 'admin%-%' + userName + '%-%' + userImage + '%-%' + $(
                        '#chat-message-input').val()
                }))
            }
            $('#chat-message-input').val('')
        })

        $('#chat-message-input').on('keypress', function (event) { // 监听回车事件
            if (event.keyCode == "13") {
                if ($.trim($(this).val()).length > 0) {
                    chatSocket.send(JSON.stringify({
                        'message': 'admin%-%' + userName + '%-%' + userImage + '%-%' + $(this).val()
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
    var clipboard2 = new ClipboardJS('#copyPullSrcBtn');

    clipboard2.on('success', function(e) {
        layer.msg('复制成功!');
    });

    clipboard2.on('error', function(e) {
        layer.msg('复制失败,请重试!');
    });
    // 复制推流码
    var clipboard3 = new ClipboardJS('#copyCodeBtn');

    clipboard3.on('success', function(e) {
        layer.msg('复制成功!');
    });

    clipboard3.on('error', function(e) {
        layer.msg('复制失败,请重试!');
    });
    // 复制拉流地址
    var clipboard4 = new ClipboardJS('#copyHlsBtn');

    clipboard4.on('success', function(e) {
        layer.msg('复制成功!');
    });

    clipboard4.on('error', function(e) {
        layer.msg('复制失败,请重试!');
    });
    var clipboard5 = new ClipboardJS('#copyRtmpBtn');

    clipboard5.on('success', function(e) {
        layer.msg('复制成功!');
    });

    clipboard5.on('error', function(e) {
        layer.msg('复制失败,请重试!');
    });

})