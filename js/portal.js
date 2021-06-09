if (!sessionStorage.getItem('token')) {
	window.location.href = "./../login.html"
}
var userId = null
// 已经添加频道
let addedChannelData = []
// 所有频道
let allChannelData = []
// 过滤所有频道
let filterChannelData = []
// 暂时频道
let momentChannelData = []

// 已经添加视频
let addedVideoData = []
// 所有视频
let allVideoData = []
// 过滤所有视频
let filterVideoData = []
// 暂时视频
let momentVideoData = []
var form = null

// 渲染已经添加的频道
function renderViewChannel() {
	var str1 = ''
	var str2 = ''
	if (addedChannelData.length > 0) {
		addedChannelData.forEach((item, index) => {
			str1 +=
				`<div class="wonderful-channel-list">
								<img src="${item.event_video_cover_page}" alt="">
								<span class="wonderful-channel-list-name">
									${item.event_title}
								</span>
							</div>`
			str2 += `
					<div class="add-channel-list">
						<div class="add-channel-list-info">
							<img src="${item.event_video_cover_page}" alt="">
							<span class="channel-name">${item.event_title}</span>
						</div>
						<i class="layui-icon layui-icon-delete recommend-delete channelDelete" data-id="${index}"></i>   
					</div>
					`
		})
		if (addedChannelData.length > 2) {
			$('.moreCont').show()
		} else {
			$('.moreCont').hide()
		}
	} else {
		str1 = '<p class="add-wonderful">立即添加精彩频道</p>'
		str2 = '<p class="channel-none">频道</p>'
	}
	$('.wonderful-channel-cont').html(str1)
	$('.channel-cont-add').html(str2)
}

// 渲染已经添加的视频
function renderViewVideo() {
	var str1 = ''
	var str2 = ''


	if (addedVideoData.length > 0) {
		addedVideoData.forEach((item, index) => {
			str1 += `
						<div class="wonderful-video-list">
							<p class="wonderful-video-describe">
								${item.video_profile}
							</p>
							<img src="${item.video_description_image}" onerror="this.src='./../image/video-page.png'" alt="" class="wonderful-video-cover">
							<p class="wonderful-video-info">
								<span>${item.datetime}</span>
								<span class="wonderful-video-view">
									<img src="./../image/mobile-eye.png" alt="">
									${item.video_number_views}次
								</span>
							</p>
							<p class="wonderful-video-bg"></p>
						</div>
					`

			str2 += `
						<div class="add-video-list">
							<div class="add-video-list-info">
								<img src="${item.video_description_image}" onerror="this.src='./../image/video-page.png'" alt="">
								<span class="video-name">${item.video_profile}</span>
							</div>
							<i class="layui-icon layui-icon-delete recommend-delete videoDelete" data-id="${index}"></i>   
						</div>
					`
		})

	} else {
		str1 = '<p class="add-wonderful" id="addVideo">立即添加精彩视频</p>'
		str2 = '<p class="video-none">视频</p>'
	}
	$('.wonderful-video').html(str1)
	$('.video-cont-add').html(str2)
}
var layer = null
$(function () {

	layui.use(['upload', 'layer', 'form'], function () {
		layer = layui.layer
		var upload = layui.upload;
		form = layui.form;
		// 上传部落头像
		var userImage = upload.render({
			elem: '#userLayer', //绑定元素
			url: 'http://www.cubee.vip/account/check_account_thundernail/', //上传接口
			headers: {
				token: sessionStorage.getItem('token')
			},
			accept: 'images',
			acceptMime: 'image/png',
			exts:'png',
			size: 1024 * 2,
			done: function (res) {
				if (res.msg === 'success') {
					$('.userImg').attr('src', res.data.account_thundernail + '?' +
						new Date().getTime())
					$('.portal-info-image').attr('src', res.data.account_thundernail +
						'?' + new Date().getTime())
				}
			},
			error: function () {
				//请求异常回调
			}
		});
		// 上传封面图片
		var coverImage = upload.render({
			elem: '#coverLayer', //绑定元素
			url: 'http://www.cubee.vip/channel/upload_channnel_wallpaper/', //上传接口
			headers: {
				token: sessionStorage.getItem('token')
			},
			accept: 'images',
			acceptMime: 'image/png',
			exts:'png',
			size: 1024 * 2,
			done: function (res) {
				if (res.msg === 'success') {
					// $('.cover-image-img img').attr('src',res.data.account_thundernail+'?'+new Date().getTime()) 
					$(".cover-image-img .bgc").css('background-image', 'url(' + res.data
						.channel_wallpaper + '?' + new Date().getTime() + ')'); //封面图片
					$(".mainLeft-top").css('background-image', 'url(' + res.data
						.channel_wallpaper + '?' + new Date().getTime() + ')'); // 手机端封面
				}
			},
			error: function () {
				//请求异常回调
			}
		})
		// 打开添加频道弹窗---------------------------------------------------------------------------------------------------------
		$('.add-channel-btn').on('click', function () {
			$.ajax({
				type: "POST",
				dataType: "json",
				async: false,
				headers: {
					token: sessionStorage.getItem('token')
				},
				url: "http://www.cubee.vip/event/event_list/",
				data: {},
				success: function (res) {
					if (res.msg === 'success') {
						allChannelData = res.data
					} else {
						layer.msg('获取频道列表失败,请重试!');
					}
				}
			})

			momentChannelData = []
			addedChannelData.forEach(item => {
				momentChannelData.push(item)
				allChannelData.forEach(its => {
					if (Number(item.event_id) === Number(its.event_id)) {
						its.checked = 'checked'
					}
				})
			})

			$('.check-channel-num').text(addedChannelData.length)
			layer.open({
				type: 1,
				area: ['1000px', '730px'],
				title: '添加频道',
				content: $('#channel-dialog'),
				shade: 0.3,
				shadeClose: true,
				closeBtn: 1,
				resize: false,
				scrollbar: false,
				move:false,
				btn: ['确认', '取消'],
				btn1: function () {
					layer.closeAll()
					addedChannelData = []
					momentChannelData.forEach(item => {
						addedChannelData.push(item)
					})
					renderViewChannel()
				},
				end:function(){
					$('.search-channel-input').val('')
				}
			})
			channelFiltrate()
		})
		// 监听频道选中取消
		form.on('checkbox(channel-checkbox)', function (data) {
			var channelId = Number(data.value)
			if (data.elem.checked) {
				$('.check-channel-num').text(Number($('.check-channel-num').text()) + 1) //选中+1
				allChannelData.forEach(item => { //选中 添加标记
					if (item.event_id === channelId) {
						item.checked = 'checked'
					}
				})
				momentChannelData.push({ // 选中 添加记录
					event_id: channelId,
					event_title: $(data.elem).parent().siblings('.cd-content-main-list-name').text(),
					event_video_cover_page: $(data.elem).attr('data-src')
				})
			} else {
				$('.check-channel-num').text(Number($('.check-channel-num').text()) - 1) // 取消-1
				allChannelData.forEach(item => { // 取消 删除标记
					if (item.event_id === channelId) {
						delete item.checked
					}
				})
				momentChannelData.forEach((item, index) => { // 取消  删除记录
					if (item.event_id === channelId) {
						momentChannelData.splice(index, 1)
					}

				})
			}
		})

		// 打开添视频弹窗------------------------------------------------------------------------------------------------------
		$('.add-video-btn').on('click', function () {
			$.ajax({
				type: "GET",
				dataType: "json",
				async: false,
				headers: {
					token: sessionStorage.getItem('token')
				},
				url: "http://www.cubee.vip/video/video_list/",
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
			momentVideoData = []
			addedVideoData.forEach(item => {
				momentVideoData.push(item)
				allVideoData.forEach(its => {
					if (Number(item.video_id) === Number(its.video_id)) {
						its.checked = 'checked'
					}
				})
			})

			$('.check-video-num').text(addedVideoData.length)
			layer.open({
				type: 1,
				area: ['1000px', '730px'],
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
					layer.closeAll()
					addedVideoData = []
					momentVideoData.forEach(item => { // 取消  删除记录
						addedVideoData.push(item)
					})
					renderViewVideo()
				},
				end:function(){
					$('.search-video-input').val('')
				}
			})
			videoFiltrate()

		})
		//视频 选中 取消 change
		form.on('checkbox(video-checkbox)', function (data) {
			var videoId = Number(data.value)
			if (data.elem.checked) {
				$('.check-video-num').text(Number($('.check-video-num').text()) + 1) //选中+1
				allVideoData.forEach(item => { //选中 添加标记
					if (item.video_id === videoId) {
						item.checked = 'checked'
					}
				})
				momentVideoData.push({ // 选中 添加记录
					video_id: videoId,
					video_profile: $(data.elem).parent().siblings('.vd-content-main-list-info').find(
						'.vd-content-main-list-name').text(),
					video_number_views: $(data.elem).parent().siblings('.vd-content-main-list-info').find(
						'.vd-content-main-list-num i').text(),
					datetime: $(data.elem).parent().siblings('.vd-content-main-list-info').find(
						'.vd-content-main-list-time i').text(),
					video_description_image:  $(data.elem).parent().siblings('.vd-video').attr("src")
				})
			} else {
				$('.check-video-num').text(Number($('.check-video-num').text()) - 1) // 取消-1
				allVideoData.forEach(item => { // 取消 删除标记
					if (item.video_id === videoId) {
						delete item.checked
					}
				})
				momentVideoData.forEach((item, index) => { // 取消  删除记录
					if (item.video_id === videoId) {
						momentVideoData.splice(index, 1)
					}
				})
			}

		})

	})

	// 获取部落基本信息
	$.ajax({
		type: "GET",
		dataType: "json",
		async: false,
		headers: {
			token: sessionStorage.getItem('token')
		},
		url: "http://www.cubee.vip/channel/channel_info/",
		success: function (res) {
			if (res.msg === 'success') {
				$('.portal-info-name').text(res.data.channel_name)
				$('.portalTop-right-title-input').val(res.data.channel_name),
					$('.portalTop-right-textarea').val(res.data.channel_description)

				// 更新长度
				$('.portalTop-right-title-length').text(res.data.channel_name.length + '/16')
				if (res.data.channel_description === null) {
					$('.portalTop-right-textarea-length').text('0/140')
				} else {
					$('.portalTop-right-textarea-length').text(res.data.channel_description
						.length + '/140')
				}

				if (res.data.channel_wallpaper !==
					'http://content.changsmart.com/channel_wallpaper/default.jpg') {
					$(".cover-image-img .bgc").css('background-image', 'url(' + res.data
						.channel_wallpaper + '?' + new Date().getTime() + ')') //封面图片
					$(".mainLeft-top").css('background-image', 'url(' + res.data
						.channel_wallpaper + '?' + new Date().getTime() + ')') // 手机端封面
				}
				$('.cover-url-input').val(res.data.channel_wallpaper_url)
			}
		}
	})
	// 获取部落 头像
	$.ajax({
		type: "GET",
		dataType: "json",
		async: false,
		headers: {
			token: sessionStorage.getItem('token')
		},
		url: "http://www.cubee.vip/account/check_account_thundernail/",
		success: function (res) {
			if (res.msg === 'success') {
				if (res.data.account_thundernail !==
					'http://content.changsmart.com/account/default.png') {
					$('.userImg').attr('src', res.data.account_thundernail)
					$('.portal-info-image').attr('src', res.data.account_thundernail)
				}
			}
		}
	})

	// 获取已经添加的频道 和 视频
	$.ajax({
		type: "GET",
		dataType: "json",
		async: false,
		headers: {
			token: sessionStorage.getItem('token')
		},
		url: 'http://www.cubee.vip/channel/portal_display/',
		success: function (res) {
			if (res.msg === 'success') {
				addedChannelData = res.data.data.event
				addedVideoData = res.data.data.video
				renderViewChannel()
				renderViewVideo()
				userId = res.data.data.account_id
			} else {
				layer.msg('获取数据失败,请刷新页面重试!');
			}
		}
	})


	// 部落名称输入事件
	$('.portalTop-right-title-input').on('input', function () {
		$('.portalTop-right-title-length').text($(this).val().length + '/16')
		$('.portal-info-name').text($(this).val())
	})

	// 部落简介输入事件
	$('.portalTop-right-textarea').on('input', function () {
		$('.portalTop-right-textarea-length').text($(this).val().length + '/140')
	})

	// 手机预览
	new QRCode(document.getElementById("qrcode"), {
		text: 'http://www.cubee.vip/h5/portalMobile.html?key=' + userId,
		width: 240,
		height: 240,
	});
	$('.preview').hover(function () {
		$('#qrcodeBox').toggle()
	})
	$('.copyUrl').hover(function(){
		$('#hintBox').toggle()
	})
	// 复制链接
	$('#copyUrl').attr('data-clipboard-text', 'http://www.cubee.vip/h5/portalMobile.html?key=' + userId )
	var btn = document.getElementById('copyUrl');

	var clipboard = new ClipboardJS(btn);

	clipboard.on('success', function (e) {
		layer.msg('复制成功!');
	});

	clipboard.on('error', function (e) {
		layer.msg('复制失败,请重试!');
	});




	// 部落基本信息保存
	$('.portalSave').on('click', function () {
		if ($('.portalTop-right-title-input').val() === '') {
			layer.msg('请输入部落名称!')
			$('.portalTop-right-title-input').focus()
			return
		} else if ($('.portalTop-right-textarea').val() === '') {
			layer.msg('请输入部落简介!')
			$('.portalTop-right-textarea').focus()
			return
		}
		$.ajax({
			type: "POST",
			dataType: "json",
			async: false,
			headers: {
				token: sessionStorage.getItem('token')
			},
			url: "http://www.cubee.vip/channel/channel_info/",
			data: {
				channel_name: $('.portalTop-right-title-input').val(),
				channel_description: $('.portalTop-right-textarea').val(),
				channel_wallpaper_url: $('.cover-url-input').val()
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

	// 编辑部落 和编辑推荐切换
	$('.mainLeft-top-layer').on('click', function () {
		$('.main-right-portal').show()
		$('.main-right-recommend').hide()
	})
	$('.mainLeft-wonderful-layer').on('click', function () {
		$('.main-right-portal').hide()
		$('.main-right-recommend').show()
	})

	// 添加频道和视频
	$('.recommendSave').on('click', function () {
		var event_id = []
		addedChannelData.forEach(item => {
			event_id.push(item.event_id)
		})
		var video_id = []
		addedVideoData.forEach(item => {
			video_id.push(item.video_id)
		})
		$.ajax({
			type: "POST",
			dataType: "json",
			async: false,
			headers: {
				token: sessionStorage.getItem('token')
			},
			url: "http://www.cubee.vip/channel/portal_display/",
			data: {
				event_id: JSON.stringify(event_id),
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

	// 删除频道--------------------------------------------------------------------------------------------------------------------
	$('.channel-cont-add').on('click', '.channelDelete', function () {
		addedChannelData.splice(Number($(this).attr('data-id')), 1)
		renderViewChannel()
	})
	// 频道分页
	function channelPage(pageIndex) {
		var str = ''
		var length = filterChannelData.length > pageIndex * 6 ? 6 : filterChannelData.length - (pageIndex -
			1) * 6
		for (var i = 0; i < length; i++) {
			var index = i + (pageIndex - 1) * 6
			str += `<div class="cd-content-main-list"><img src="./../image/channel-img.png" alt=""><span class="cd-content-main-list-name">${filterChannelData[index].event_title}</span>
			<div class="layui-form channel-right-check">
				<input type="checkbox" lay-filter="channel-checkbox" lay-skin="primary" class="cd-content-main-list-check" value="${filterChannelData[index].event_id}" data-src="${filterChannelData[index].event_video_cover_page}" ${filterChannelData[index].checked} />
			</div>
			</div>`
		}
		$('.cd-content-main-top').html(str)
		form.render('checkbox')
	}
	// 频道筛选---------
	$('.search-channel-input').on('keypress', function (event) { // 监听回车事件
		if (event.keyCode == "13") {
			channelFiltrate()
		}
	})
	$('.search-channel-btn').on('click', channelFiltrate) //点击搜索按钮
	// 频道过滤方法
	function channelFiltrate() {
		filterChannelData = allChannelData.filter(item => item.event_title.search($.trim($(
			'.search-channel-input').val())) !== -1)
		if (filterChannelData.length > 6) {
			layui.use(['laypage'], function () {
				var laypage = layui.laypage
				laypage.render({
					elem: 'channel-page',
					count: filterChannelData.length,
					limit: 6,
					layout: ['prev', 'next'],
					jump: function (obj, first) {
						if (!first) {
							// layer.msg('第 '+ obj.curr +' 页'+',每页显示'+obj.limit+'条');
							channelPage(obj.curr)
						}
					}
				})
			})
		} else {
			$('#channel-page').empty()
		}
		channelPage(1)
	}


	// 删除视频-------------------------------------------------------------------------------------------------------------------
	$('.video-cont-add').on('click', '.videoDelete', function () {
		addedVideoData.splice(Number($(this).attr('data-id')), 1)
		renderViewVideo()
	})

	// 视频分页
	function videoPage(pageIndex) {
		var str = ''
		var length = filterVideoData.length > pageIndex * 6 ? 6 : filterVideoData.length - (pageIndex - 1) * 6
		for (var i = 0; i < length; i++) {
			var index = i + (pageIndex - 1) * 6
			str += `<div class="vd-content-main-list">
				<img class="vd-video" src="${filterVideoData[index].video_description_image}" onerror="this.src='./../image/video-page.png'"></img>
				<div class="vd-content-main-list-info">
					<span class="vd-content-main-list-name">${filterVideoData[index].video_profile}</span>
					<span class="vd-content-main-list-time">上传时间: <i>${filterVideoData[index].video_create_time}</i></span>
					<span class="vd-content-main-list-num">观看量: <i>${filterVideoData[index].video_number_views}</i> 次</span>
				</div>
				<div class="layui-form video-right-check">
					<input type="checkbox" lay-filter="video-checkbox" lay-skin="primary" class="vd-content-main-list-check" value="${filterVideoData[index].video_id}" ${filterVideoData[index].checked} /></div>
				</div>
			`
		}
		if (filterVideoData.length > 0) {
			$('.vd-content-main-top').html(str)
			form.render('checkbox')
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
})