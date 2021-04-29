if(!sessionStorage.getItem('token')){
    window.location.href="./../login.html"
}
var videoFile = null
var imgFile = null
var number = 0
var downLoadNum = 0
$(function () {
    // 所有视频库
    var allVideoLibrary = []
    // 选中视频库
    var checkVideoLibrary = []

    // 所有暂存库
    var allTsLibrary = []
    var checkTsLibrary = []


    layui.use(['form', 'laydate', 'upload', 'laypage'], function () {
        var form = layui.form;
        var laydate = layui.laydate;
        var upload = layui.upload;
        var laypage = layui.laypage;

        var timer = null
        var downTimer = null
        // 全选 视频库
        form.on('checkbox(all-check)', function (data) {
            if (data.elem.checked) {
                $('.singleVideo').each((index, item) => {
                    var flag = true
                    checkVideoLibrary.forEach(items => {
                        if (items.video_id === $(item).val()) {
                            flag = false
                        }
                    })
                    if (flag) {
                        checkVideoLibrary.push({
                            video_code: $(item).attr('data-code'),
                            video_id: $(item).val()
                        })
                    }
                })
            } else {
                $('.singleVideo').each((index, item) => {
                    checkVideoLibrary.forEach((items, ins) => {
                        if (items.video_id === $(item).val()) {
                            checkVideoLibrary.splice(ins, 1)
                        }
                    })
                })
            }
            $('.select-num span').text('(' + checkVideoLibrary.length + ')')
            $('.singleVideo').prop('checked', data.elem.checked)
            form.render('checkbox')
        });
        form.on('checkbox(single-check)', function (data) {

            if (data.elem.checked) {
                checkVideoLibrary.push({
                    video_code: $(this).attr('data-code'),
                    video_id: data.value
                })
            } else {
                checkVideoLibrary.forEach((items, ins) => {
                    if (items.video_id === data.value) {
                        checkVideoLibrary.splice(ins, 1)
                    }
                })
            }
            $('#all-check').prop('checked', $('.singleVideo').length === $(
                '.singleVideo:checked').length)
            $('.select-num span').text('(' + checkVideoLibrary.length + ')')
            form.render('checkbox')
        });


        // 暂存库全选
        form.on('checkbox(ts-all-check)', function (data) {

            if (data.elem.checked) {
                $('.ts-singleVideo').each((index, item) => {
                    var flag = true
                    checkTsLibrary.forEach(items => {
                        if (items.video_id === $(item).val()) {
                            flag = false
                        }
                    })
                    if (flag) {
                        checkTsLibrary.push({
                            video_code: $(item).attr('data-code'),
                            video_id: $(item).val()
                        })
                    }
                })
            } else {
                $('.ts-singleVideo').each((index, item) => {
                    checkTsLibrary.forEach((items, ins) => {
                        if (items.video_id === $(item).val()) {
                            checkTsLibrary.splice(ins, 1)
                        }
                    })
                })
            }
            $('.ts-singleVideo').prop('checked', data.elem.checked)
            $('.ts-select-num span').text('(' + checkTsLibrary.length + ')')
            form.render('checkbox')
        });
        form.on('checkbox(ts-single-check)', function (data) {

            if (data.elem.checked) {
                checkTsLibrary.push({
                    video_code: $(this).attr('data-code'),
                    video_id: data.value
                })
            } else {
                checkTsLibrary.forEach((items, ins) => {
                    if (items.video_id === data.value) {
                        checkTsLibrary.splice(ins, 1)
                    }
                })
            }
            $('#ts-all-check').prop('checked', $('.ts-singleVideo').length === $(
                '.ts-singleVideo:checked').length)
            $('.ts-select-num span').text('(' + checkTsLibrary.length + ')')
            form.render('checkbox')
        });

        //日期范围筛选媒体库
        laydate.render({
            elem: '#videoTime',
            type: 'datetime',
            range: true,
            done: function (time) {
                if (time) {
                    $.ajax({
                        type: "GET",
                        url: "http://www.cube.vip/video/search_time_video/",
                        dataType: "json",
                        headers: {
                            token: sessionStorage.getItem('token')
                        },
                        data: {
                            save_flag: "media_library",
                            start_time1: time
                        },
                        success: res => {
                            if (res.msg === 'success') {
                                allVideoLibrary = res.data
                                checkVideoLibrary = []
                                $('.select-num span').text('(' + 0 + ')')
                                if (allVideoLibrary.length > 6) {
                                    $('#videoPage').show()
                                    laypage.render({
                                        elem: 'videoPage',
                                        count: allVideoLibrary.length,
                                        limit: 6,
                                        theme: '#F2591A',
                                        groups: 5,
                                        limits: [6, 12, 18, 24],
                                        layout: ['prev', 'page',
                                            'next',
                                            'skip', 'limit',
                                            'count'
                                        ],
                                        jump: function (obj, first) {
                                            if (!first) {
                                                renderVideo(obj
                                                    .curr,
                                                    obj.limit)
                                            } else {
                                                renderVideo(1, obj
                                                    .limit)
                                            }
                                        }
                                    })
                                } else {
                                    renderVideo(1, 6)
                                    $('#videoPage').hide()
                                }

                            }
                        },
                    })
                } else {
                    getVideo()
                }

            }
        });

        // 关键字筛选
        $('.fileSearch').on('click', function () {
            if ($.trim($('.fileName').val()).length <= 0) {
                getVideo()
            } else {
                $.ajax({
                    type: "GET",
                    url: "http://www.cube.vip/video/search_time_video/",
                    dataType: "json",
                    headers: {
                        token: sessionStorage.getItem('token')
                    },
                    data: {
                        save_flag: "media_library",
                        keyword: $('.fileName').val()
                    },
                    success: res => {
                        if (res.msg === 'success') {
                            allVideoLibrary = res.data
                            checkVideoLibrary = []
                            $('.select-num span').text('(' + 0 + ')')
                            if (allVideoLibrary.length > 6) {
                                $('#videoPage').show()
                                laypage.render({
                                    elem: 'videoPage',
                                    count: allVideoLibrary.length,
                                    limit: 6,
                                    theme: '#F2591A',
                                    groups: 5,
                                    limits: [6, 12, 18, 24],
                                    layout: ['prev', 'page',
                                        'next',
                                        'skip', 'limit',
                                        'count'
                                    ],
                                    jump: function (obj, first) {
                                        if (!first) {
                                            renderVideo(obj
                                                .curr,
                                                obj.limit)
                                        } else {
                                            renderVideo(1, obj
                                                .limit)
                                        }
                                    }
                                })
                            } else {
                                renderVideo(1, 6)
                                $('#videoPage').hide()
                            }
                        }
                    },
                })
            }

        })
        $('.fileName').on('keypress', function (event) { // 监听回车事件
            if (event.keyCode == "13") {
                if ($.trim($(this).val()).length <= 0) {
                    getVideo()
                } else {
                    $.ajax({
                        type: "GET",
                        url: "http://www.cube.vip/video/search_time_video/",
                        dataType: "json",
                        headers: {
                            token: sessionStorage.getItem('token')
                        },
                        data: {
                            save_flag: "media_library",
                            keyword: $(this).val()
                        },
                        success: res => {
                            if (res.msg === 'success') {
                                allVideoLibrary = res.data
                                checkVideoLibrary = []
                                $('.select-num span').text('(' + 0 + ')')
                                if (allVideoLibrary.length > 6) {
                                    $('#videoPage').show()
                                    laypage.render({
                                        elem: 'videoPage',
                                        count: allVideoLibrary.length,
                                        limit: 6,
                                        theme: '#F2591A',
                                        groups: 5,
                                        limits: [6, 12, 18, 24],
                                        layout: ['prev', 'page',
                                            'next',
                                            'skip', 'limit',
                                            'count'
                                        ],
                                        jump: function (obj, first) {
                                            if (!first) {
                                                renderVideo(obj
                                                    .curr,
                                                    obj.limit)
                                            } else {
                                                renderVideo(1, obj
                                                    .limit)
                                            }
                                        }
                                    })
                                } else {
                                    renderVideo(1, 6)
                                    $('#videoPage').hide()
                                }
                            }
                        },
                    })
                }

            }
        })


        // 获取媒体库视频
        getVideo()

        function getVideo() {
            $.get({
                url: "http://www.cube.vip/video/video_list/",
                dataType: "json",
                headers: {
                    token: sessionStorage.getItem('token')
                },
                data: {
                    save_flag: "media_library"
                },
                success: res => {
                    if (res.msg === 'success') {
                        allVideoLibrary = res.data
                        checkVideoLibrary = []
                        $('.select-num span').text('(' + 0 + ')')
                        if (allVideoLibrary.length > 6) {
                            $('#videoPage').show()
                            laypage.render({
                                elem: 'videoPage',
                                count: allVideoLibrary.length,
                                limit: 6,
                                theme: '#F2591A',
                                groups: 5,
                                limits: [6, 12, 18, 24],
                                layout: ['prev', 'page',
                                    'next',
                                    'skip', 'limit',
                                    'count'
                                ],
                                jump: function (obj, first) {
                                    if (!first) {
                                        renderVideo(obj
                                            .curr,
                                            obj.limit)
                                    } else {
                                        renderVideo(1, obj
                                            .limit)
                                    }
                                }
                            })
                        } else {
                            renderVideo(1, 6)
                            $('#videoPage').hide()
                        }
                    }
                },
            })
        }


        // 渲染媒体库dom
        function renderVideo(pageIndex, pageSize) {
            var str = ''
            var length = allVideoLibrary.length > pageIndex * pageSize ? pageSize : allVideoLibrary
                .length - (pageIndex - 1) * pageSize
            for (var i = 0; i < length; i++) {
                var index = i + (pageIndex - 1) * pageSize
                var flag = false
                checkVideoLibrary.forEach(item => {
                    if (item.video_id == allVideoLibrary[index].video_id) {
                        flag = true
                    }
                })
                if (flag) {
                    str += `<div class="videoList">
                        <div class="videoBox" data-id="${allVideoLibrary[index].video_id}" data-code="${allVideoLibrary[index].video_code}">
                            <img class="videoImg" src="${allVideoLibrary[index].video_description_image}" onerror="this.src='./../image/video-page.png'" alt="">
                            <img class="playIcon" src="./../image/play.png">
                            </div>
                        <div class="videoInfo">
                            <p class="videoDescribe">${allVideoLibrary[index].video_profile}</p>
                            <p class="common">评论:<span>${allVideoLibrary[index].count}</span>条</p>
                            <p class="views">观看:<span>${allVideoLibrary[index].video_number_views}</span>次</p>
                            <p class="uploadTime">上传时间:<span>${allVideoLibrary[index].video_create_time.replace('T', ' ')}</span></p>
                        </div>
                        <div class="videoPe">
                            <div class="layui-form video-radio">
                                <input type="checkbox" checked lay-skin="primary" class="singleVideo" data-code="${allVideoLibrary[index].video_code}" value="${allVideoLibrary[index].video_id}" lay-filter="single-check">
                            </div>
                            <div class="video-bottom">
                                <img src="./../image/edit-icon.png" class="video-edit" data-id="${allVideoLibrary[index].video_id}" data-code="${allVideoLibrary[index].video_code}">
                                <span class="video-upload" data-code="${allVideoLibrary[index].video_code}">下载</span>
                            </div>
                        </div>
                    </div>`
                } else {
                    str += `<div class="videoList">
                        <div class="videoBox" data-id="${allVideoLibrary[index].video_id}" data-code="${allVideoLibrary[index].video_code}">
                            <img class="videoImg" src="${allVideoLibrary[index].video_description_image}" onerror="this.src='./../image/video-page.png'" alt="">
                            <img class="playIcon" src="./../image/play.png">
                        </div>
                        <div class="videoInfo">
                            <p class="videoDescribe">${allVideoLibrary[index].video_profile}</p>
                            <p class="common">评论:<span>${allVideoLibrary[index].count}</span>条</p>
                            <p class="views">观看:<span>${allVideoLibrary[index].video_number_views}</span>次</p>
                            <p class="uploadTime">上传时间:<span>${allVideoLibrary[index].video_create_time.replace('T', ' ')}</span></p>
                        </div>
                        <div class="videoPe">
                            <div class="layui-form video-radio">
                                <input type="checkbox"  lay-skin="primary" class="singleVideo" data-code="${allVideoLibrary[index].video_code}" value="${allVideoLibrary[index].video_id}" lay-filter="single-check">
                            </div>
                            <div class="video-bottom">
                                <img src="./../image/edit-icon.png" class="video-edit" data-id="${allVideoLibrary[index].video_id}" data-code="${allVideoLibrary[index].video_code}">
                                <span class="video-upload" data-code="${allVideoLibrary[index].video_code}">下载</span>
                            </div>
                        </div>
                    </div>`
                }

            }
            $('.videoContent').html(str)
            monitorDownload()
            if ($('.singleVideo').length == 0) {
                $('#all-check').prop('checked', false)
            } else {
                $('#all-check').prop('checked', $('.singleVideo').length === $('.singleVideo:checked')
                    .length)
            }

            form.render('checkbox')
        }

        // 获取暂存库-------------------------------------------------------------------------------------------------
        getTs()

        function getTs() {
            $.get({
                url: "http://www.cube.vip/video/video_list/",
                dataType: "json",
                headers: {
                    token: sessionStorage.getItem('token')
                },
                data: {
                    save_flag: "staging"
                },
                success: res => {
                    if (res.msg === 'success') {

                        allTsLibrary = res.data
                        checkTsLibrary = []
                        $('.ts-select-num span').text('(' + 0 + ')')
                        if (allTsLibrary.length > 6) {
                            $('#tsPage').show()
                            laypage.render({
                                elem: 'tsPage',
                                count: allTsLibrary.length,
                                limit: 6,
                                theme: '#F2591A',
                                groups: 5,
                                limits: [6, 12, 18, 24],
                                layout: ['prev', 'page',
                                    'next',
                                    'skip', 'limit',
                                    'count'
                                ],
                                jump: function (obj, first) {
                                    
                                    if (!first) {
                                        renderTs(obj
                                            .curr,
                                            obj.limit)
                                    } else {
                                        renderTs(1, obj
                                            .limit)
                                    }
                                }
                            })
                        } else {
                            renderTs(1, 6)
                            $('#tsPage').hide()
                        }
                    }
                },
            })
        }

        // 渲染暂存库dom
        function renderTs(pageIndex, pageSize) {
            var str = ''
            var length = allTsLibrary.length > pageIndex * pageSize ? pageSize : allTsLibrary
                .length - (pageIndex - 1) * pageSize
            for (var i = 0; i < length; i++) {
                var index = i + (pageIndex - 1) * pageSize
                var flag = false
                checkTsLibrary.forEach(item => {
                    if (item.video_id == allTsLibrary[index].video_id) {
                        flag = true
                    }
                })
                if (flag) {
                    str += `<div class="videoList" style="background:#ddd">
                                <div class="videoBox" data-id="${allTsLibrary[index].video_id}" data-code="${allTsLibrary[index].video_code}">
                                    <img class="videoImg" src="${allTsLibrary[index].video_description_image}" onerror="this.src='./../image/video-page.png'" alt="">
                                    <img class="playIcon" src="./../image/play.png">
                                </div>
                                <div class="videoInfo">
                                    <p class="videoDescribe">${allTsLibrary[index].video_profile}</p>
                                    <p class="common">评论:<span>${allTsLibrary[index].count}</span>条</p>
                                    <p class="views">观看:<span>${allTsLibrary[index].video_number_views}</span>次</p>
                                    <p class="uploadTime">上传时间:<span>${allTsLibrary[index].video_create_time.replace('T', ' ')}</span></p>
                                </div>
                                <div class="videoPe">
                                    <div class="layui-form video-radio">
                                        <input type="checkbox" lay-skin="primary" checked class="ts-singleVideo" data-code="${allTsLibrary[index].video_code}" value="${allTsLibrary[index].video_id}" lay-filter="ts-single-check">
                                    </div>
                                    <div class="video-bottom">
                                        <img src="./../image/edit-icon.png" class="video-edit" data-id="${allTsLibrary[index].video_id}" data-code="${allTsLibrary[index].video_code}">
                                        <span class="video-upload" data-code="${allTsLibrary[index].video_code}">下载</span>
                                    </div>
                                </div>
                            </div>`
                } else {
                    str += `<div class="videoList" style="background:#ddd">
                                <div class="videoBox" data-id="${allTsLibrary[index].video_id}" data-code="${allTsLibrary[index].video_code}">
                                <img class="videoImg" src="${allTsLibrary[index].video_description_image}" onerror="this.src='./../image/video-page.png'" alt="">
                                <img class="playIcon" src="./../image/play.png">
                                </div>
                                <div class="videoInfo">
                                    <p class="videoDescribe">${allTsLibrary[index].video_profile}</p>
                                    <p class="common">评论:<span>${allTsLibrary[index].count}</span>条</p>
                                    <p class="views">观看:<span>${allTsLibrary[index].video_number_views}</span>次</p>
                                    <p class="uploadTime">上传时间:<span>${allTsLibrary[index].video_create_time.replace('T', ' ')}</span></p>
                                </div>
                                <div class="videoPe">
                                    <div class="layui-form video-radio">
                                        <input type="checkbox" lay-skin="primary" class="ts-singleVideo" data-code="${allTsLibrary[index].video_code}" value="${allTsLibrary[index].video_id}" lay-filter="ts-single-check">
                                    </div>
                                    <div class="video-bottom">
                                        <img src="./../image/edit-icon.png" class="video-edit" data-id="${allTsLibrary[index].video_id}" data-code="${allTsLibrary[index].video_code}">
                                        <span class="video-upload" data-code="${allTsLibrary[index].video_code}">下载</span>
                                    </div>
                                </div>
                            </div>`
                }
            }

            $('.tsContent').html(str)
            monitorDownload()
            if ($('.ts-singleVideo').length == 0) {
                $('#ts-all-check').prop('checked', false)
            } else {
                $('#ts-all-check').prop('checked', $('.ts-singleVideo').length === $(
                        '.ts-singleVideo:checked')
                    .length)
            }
            form.render('checkbox')
        }

        // 从暂存库移动到媒体库
        $('#ts-move-video').on('click', function () {
            if (checkTsLibrary.length <= 0) {
                layer.msg('请勾选要移动的视频!')
                return
            } else {
                var videoId = []
                checkTsLibrary.forEach(item => {
                    videoId.push(item.video_id)
                })
                $.post({
                    url: "http://www.cube.vip/video/save_media_library/",
                    dataType: "json",
                    headers: {
                        token: sessionStorage.getItem('token')
                    },
                    data: {
                        video_id: JSON.stringify(videoId),
                        save_flag: 'media_library'
                    },
                    success: res => {
                        if (res.msg === 'success') {
                            layer.msg('移至成功!')
                            getTs()
                            getVideo()
                        } else {
                            layer.msg('移至失败,请重试!')
                        }
                    },
                })

            }
        })

        // 从媒体库移动暂存库
        $('#move-ts').on('click', function () {
            if (checkVideoLibrary.length <= 0) {
                layer.msg('请勾选要移动的视频!')
                return
            } else {
                var videoId = []
                checkVideoLibrary.forEach(item => {
                    videoId.push(item.video_id)
                })
                $.post({
                    url: "http://www.cube.vip/video/save_media_library/",
                    dataType: "json",
                    headers: {
                        token: sessionStorage.getItem('token')
                    },
                    data: {
                        video_id: JSON.stringify(videoId),
                        save_flag: 'staging'
                    },
                    success: res => {
                        if (res.msg === 'success') {
                            layer.msg('移至成功!')
                            getTs()
                            getVideo()
                        } else {
                            layer.msg('移至失败,请重试!')
                        }
                    },
                })

            }
        })

        // 删除视频库
        $('#delete-video').on('click', function () {
            if (checkVideoLibrary.length <= 0) {
                layer.msg('请勾选要删除的视频!')
                return
            }
            var videoId = []
            checkVideoLibrary.forEach(item => {
                videoId.push(item.video_id)
            })
            layer.open({
                type: 1,
                title: '删除提示',
                area: ['640px', '268px'],
                content: '<div style="margin: 48px 0 0 46px;font-size:18px;color:#666;">此操作将删除该视频,是否继续?</div>',
                shade: 0.3,
                shadeClose: true,
                closeBtn: 1,
                resize: false,
                btn: ['确认', '取消'],
                move:false,
                btn1: function () {
                    $.ajax({
                        type: 'GET',
                        url: 'http://www.cube.vip/video/delete_video/',
                        dataType: "json",
                        headers: {
                            token: sessionStorage.getItem('token')
                        },
                        data: {
                            video_list: JSON.stringify(videoId)
                        },
                        success: function (result) {
                            if (result.msg == "success") {
                                layer.msg('删除成功!')
                                setTimeout(() => {
                                    layer.closeAll()
                                    getVideo()
                                }, 500)

                            } else if (result.msg == "error") {
                                layer.msg('删除失败,请重试!')
                            }
                        },
                    })
                }
            })
        })

        // 删除暂存库
        $('#ts-delete-video').on('click', function () {
            if (checkTsLibrary.length <= 0) {
                layer.msg('请勾选要删除的视频!')
                return
            }
            var videoId = []
            checkTsLibrary.forEach(item => {
                videoId.push(item.video_id)
            })
            layer.open({
                type: 1,
                title: '删除提示',
                area: ['640px', '268px'],
                content: '<div style="margin: 48px 0 0 46px;font-size:18px;color:#666;">此操作将删除该视频,是否继续?</div>',
                shade: 0.3,
                shadeClose: true,
                closeBtn: 1,
                resize: false,
                btn: ['确认', '取消'],
                move:false,
                btn1: function () {
                    $.ajax({
                        type: 'GET',
                        url: 'http://www.cube.vip/video/delete_video/',
                        dataType: "json",
                        headers: {
                            token: sessionStorage.getItem('token')
                        },
                        data: {
                            video_list: JSON.stringify(videoId)
                        },
                        success: function (result) {
                            if (result.msg == "success") {
                                layer.msg('删除成功!')
                                setTimeout(() => {
                                    layer.closeAll()
                                    getTs()
                                }, 500)

                            } else if (result.msg == "error") {
                                layer.msg('删除失败,请重试!')
                            }
                        },
                    })
                }
            })
        })

        //上传视频描述长度
        $('#textarea').on('input', function () {
            $('.textLength').text($(this).val().length + '/140')
        })


        // 点击上传视频 调起弹窗
        $('#uploadVideo').on('click', function () {
            layer.open({
                type: 1,
                area: ['640px', '560px'],
                title: '上传视频',
                content: $("#uploadDialog"),
                shade: 0.3,
                shadeClose: true,
                closeBtn: 1,
                btn: ['确认', '取消'],
                move:false,
                resize: false,
                scrollbar: false,
                btn1: function () {
                    if (!videoFile) {
                        layer.msg('请添加视频!')
                        return
                    }
                    if ($.trim($('#textarea').val()).length <= 0) {
                        layer.msg('请添加视频描述!')
                        return
                    }
                    var formData = new FormData()
                    formData.append('file', videoFile)
                    formData.append('video_description', $('#textarea').val())
                    layer.closeAll()
                    layer.msg('视频正在上传,请耐心等待!')
                    $('#uploadVideo').attr('disabled', true)
                    $('.loadingBox').show()
                    $('.loadingText').text('视频上传中,请勿刷新页面...')
                    $.ajax({
                        type: 'POST',
                        url: 'http://www.cube.vip/video_editing/upload_video/',
                        headers: {
                            token: sessionStorage.getItem('token')
                        },
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (res) {
                            if (res.msg === "success") {
                                monitorState(res.data.upload_action_id)
                                sessionStorage.setItem('taskId', res.data
                                    .upload_action_id)
                            } else{
                                $('.loadingBox').hide()
                                layer.msg('视频上传失败,请稍后重试!')
                                $('#uploadVideo').removeAttr('disabled')
                            }
                        }
                    })
                },
                end: function () {
                    clearDefault()
                }
            })
        })
        // 清除上传视频默认信息
        function clearDefault() {
            videoFile = null
            $('#textarea').val('')
            $('.textLength').text('0/140')
            $('#uploadImage').show()
            $('#uploadName').show()
            $('#previewVideo')[0].pause()
            $('#previewVideo').hide().removeAttr('src')

        }


        // 上传视频控件
        upload.render({
            elem: '#uploadBox',
            url: '/',
            headers: {
                token: sessionStorage.getItem('token')
            },
            auto: false,
            accept: 'video',
            bindAction: '.aaa',
            choose: function (obj) {
                obj.preview(function (index, file, result) {
                    videoFile = file
                    $('#uploadImage').hide()
                    $('#uploadName').hide()
                    $('#previewVideo').show().prop('src', result)
                })
            }
        })

        // 上传视频封面
        upload.render({
            elem: '.coverBox',
            url: '/',
            headers: {
                token: sessionStorage.getItem('token')
            },
            auto: false,
            bindAction: '.aaa',
            choose: function (obj) {
                obj.preview(function (index, file, result) {
                    imgFile = file
                    $('#uploadCover').hide()
                    $('#coverName').hide()
                    $('.coverImg').show().prop('src', result)
                })
            }
        })

        // 监听历史上传状态
        if (sessionStorage.getItem('taskId')) {
            monitorState(sessionStorage.getItem('taskId'))
            $('#uploadVideo').attr('disabled', true)
        }
        // 监听上传状态
        function monitorState(id) {
            clearInterval(timer)
            timer = setInterval(() => {
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: "http://www.cube.vip/video_editing/upload_video_status/",
                    data: {
                        upload_action_id: id
                    },
                    headers: {
                        token: sessionStorage.getItem('token')
                    },
                    success: function (result) {
                        $('.loadingBox').show()
                        if (result.msg == "success") {
                            clearInterval(timer)
                            sessionStorage.removeItem('taskId')
                            $('#uploadVideo').removeAttr('disabled')
                            $('.loadingBox').hide()
                            getTs()
                            layer.msg('上传成功,请去暂存库查看!')
                            number = 0
                        } else if (result.msg === 'assigned') {
                            $('.loadingText').text('待分配...')
                            countDown()

                        } else if (result.msg === 'pending') {
                            $('.loadingText').text('转码中...')
                        } else if (result.msg == "failed") {
                            layer.msg('上传失败,请重试!')
                            clearInterval(timer)
                            sessionStorage.removeItem('taskId')
                            $('#uploadVideo').removeAttr('disabled')
                            $('.loadingBox').hide()
                            number = 0
                        }
                    }
                })
            }, 3000);
        }
        // 超过5分钟 还未分配上传资源 ,终止上传
        function countDown() {
            number++
            if (number >= 100) {
                clearInterval(timer)
                sessionStorage.removeItem('taskId')
                $('#uploadVideo').removeAttr('disabled')
                $('.loadingBox').hide()
                number = 0
            }
        }
        // 视频库编辑描述
        $('.videoContent').on('click', '.video-edit', function () {
            var _that = $(this)
            var video_id = $(this).attr('data-id')
            $('#editDesText').val($(this).parents('.videoList').find('.videoDescribe').text())
            $('#editTextLength').text($(this).parents('.videoList').find('.videoDescribe')
                .text().length + '/140')
            layer.open({
                type: 1,
                area: ['640px', '560px'],
                title: '编辑',
                content: $("#describeDialog"),
                shade: 0.3,
                shadeClose: true,
                closeBtn: 1,
                btn: ['确认', '取消'],
                move:false,
                resize: false,
                scrollbar: false,
                btn1: function () {
                    if ($.trim($('#editDesText').val()).length <= 0) {
                        layer.msg('请输入视频描述!')
                        return
                    }
                    var formData = new FormData()
                    formData.append('file', imgFile)
                    formData.append('video_description', $('#editDesText').val())
                    formData.append('video_id',video_id)
                    $.ajax({
                        type: 'POST',
                        url: 'http://www.cube.vip/video/update_video_description/',
                        headers: {
                            token: sessionStorage.getItem('token')
                        },
                        processData: false,
                        contentType: false,
                        data:formData,
                        success: res => {
                            if (res.msg === 'success') {
                                layer.msg('修改成功!')
                                setTimeout(() => {
                                    layer.closeAll();
                                    _that.parents('.videoList').find('.videoDescribe').text($('#editDesText').val())
                                    _that.parents('.videoList').find('.videoBox .videoImg').attr('src',window.URL.createObjectURL(imgFile))
                                    $('#editDesText').val('')
                                    $('#editTextLength').text('0/140')
                                }, 500)
                            } else {
                                layer.msg('修改失败,请重试!')
                            }
                        }
                    })
                },
                end:function(){
                    layer.closeAll();
                    $('#editDesText').val('')
                    $('#editTextLength').text('0/140')
                    imgFile = null
                    $('#uploadCover').show()
                    $('#coverName').show()
                    $('.coverImg').hide()
                }

            })
        })
        // 暂存编辑描述
        $('.tsContent').on('click', '.video-edit', function () {
            var _that = $(this)
            var video_id = $(this).attr('data-id')
            $('#editDesText').val($(this).parents('.videoList').find('.videoDescribe').text())
            $('#editTextLength').text($(this).parents('.videoList').find('.videoDescribe')
                .text().length + '/140')
            layer.open({
                type: 1,
                area: ['640px', '560px'],
                title: '编辑',
                content: $("#describeDialog"),
                shade: 0.3,
                shadeClose: true,
                closeBtn: 1,
                btn: ['确认', '取消'],
                move:false,
                resize: false,
                scrollbar: false,
                btn1: function () {
                    if ($.trim($('#editDesText').val()).length <= 0) {
                        layer.msg('请输入视频描述!')
                        return
                    }
                    var formData = new FormData()
                    formData.append('file', imgFile)
                    formData.append('video_description', $('#editDesText').val())
                    formData.append('video_id',video_id)

                    $.ajax({
                        type: 'POST',
                        url: 'http://www.cube.vip/video/update_video_description/',
                        headers: {
                            token: sessionStorage.getItem('token')
                        },
                        processData: false,
                        contentType: false,
                        data:formData,
                        success: res => {
                            if (res.msg === 'success') {
                                layer.msg('修改成功!')
                                setTimeout(() => {
                                    layer.closeAll();
                                    _that.parents('.videoList').find('.videoDescribe').text($('#editDesText').val())
                                    _that.parents('.videoList').find('.videoBox .videoImg').attr('src',window.URL.createObjectURL(imgFile))
                                    $('#editDesText').val('')
                                    $('#editTextLength').text('0/140')
                                }, 500)
                            } else {
                                layer.msg('修改失败,请重试!')
                            }
                        }
                    })
                },
                end:function(){
                    layer.closeAll();
                    $('#editDesText').val('')
                    $('#editTextLength').text('0/140')
                    imgFile = null
                    $('#uploadCover').show()
                    $('#coverName').show()
                    $('.coverImg').hide()
                }

            })
        })

        // 视频库编辑描述长度
        $('#editDesText').on('input', function () {
            $('#editTextLength').text($(this).val().length + '/140')
        })

        // 视频库观看
        $('.videoContent').on('click', '.videoBox', function () {
            $.ajax({
                type: "GET",
                dataType: "json",
                async: false,
                url: "http://www.cube.vip/video/video_code_to_uri/",
                data: {
                    video_code: $(this).attr('data-code')
                },
                headers: {
                    token: sessionStorage.getItem('token')
                },
                success: res => {
                    if (res.msg === 'success') {
                        getComment($(this).attr('data-id'))
                        var player = new Aliplayer({
                            "id": "player-con",
                            "source": res.data.video_rui,
                            "width": "750px",
                            "height": "428px",
                            "autoplay": true,
                            "isLive": false,
                            "rePlay": false,
                            "playsinline": true,
                            "preload": true,
                            "controlBarVisibility": "hover",
                            "useH5Prism": true,
                          })

                        layer.open({
                            type: 1,
                            area: ['800px', '800px'],
                            title: ['视频预览/评论管理', 'color:#fff'],
                            content: $("#showVideoDialog"),
                            shade: 0.3,
                            shadeClose: true,
                            closeBtn: 1,
                            resize: false,
                            scrollbar: false,
                            move:false,
                            end: function () {
                                layer.closeAll();
                                player.dispose()
                            }
                        });

                    } else {
                        layer.msg('获取视频失败,请重试!')
                    }
                }
            })
        })
        // 获取评论
        function getComment(id) {
            $.ajax({
                type: "POST",
                dataType: "json",
                async: false,
                url: "http://www.cube.vip/commenting/h5_comments_show/",
                data: {
                    video_id: id
                },
                headers: {
                    token: sessionStorage.getItem('token')
                },
                success: function (res) {
                    if (res.msg === 'success') {
                        var str = ''
                        res.data.forEach(item => {
                            str += `
                            <div class="chatList">
                            <img src="${item.wechat_image_url}" class="userImage">
                            <div class="chatRight">
                                <p class="userName">${item.viewer}</p>
                                <p class="chatMessage">${item.comment}</p>
                            </div>
                            <div class="deleteChat" data-id="${item.commend_id}">删除</div>
                        </div>
                            `
                        })
                        $('.commentBox').html(str)
                        $('.commentNum span').text(res.data.length)
                    } else {
                        $('.commentBox').empty('')
                        $('.commentNum span').text(0)
                    }
                }
            })
        }
        // 删除评论
        $('.commentBox').on('click', '.deleteChat', function () {

            $.ajax({
                type: "POST",
                dataType: "json",
                async: false,
                url: "http://www.cube.vip/commenting/delete_comments/",
                data: {
                    commend_id: $(this).attr('data-id')
                },
                headers: {
                    token: sessionStorage.getItem('token')
                },
                success: res => {
                    if (res.msg === 'success') {
                        layer.msg('删除成功!')
                        $(this).parents('.chatList').remove()
                        var num = Number($('.commentNum span').text())
                        $('.commentNum span').text(--num)
                    } else {
                        layer.msg('删除失败,请重试!')
                    }
                }
            })
        })
        // 暂存库观看
        $('.tsContent').on('click', '.videoBox', function () {
            $.ajax({
                type: "GET",
                dataType: "json",
                async: false,
                url: "http://www.cube.vip/video/video_code_to_uri/",
                data: {
                    video_code: $(this).attr('data-code')
                },
                headers: {
                    token: sessionStorage.getItem('token')
                },
                success: res => {
                    if (res.msg === 'success') {
                        getComment($(this).attr('data-id'))
                        var player = new Aliplayer({
                            "id": "player-con",
                            "source": res.data.video_rui,
                            "width": "750px",
                            "height": "428px",
                            "autoplay": true,
                            "isLive": false,
                            "rePlay": false,
                            "playsinline": true,
                            "preload": true,
                            "controlBarVisibility": "hover",
                            "useH5Prism": true,
                          })

                        layer.open({
                            type: 1,
                            area: ['800px', '800px'],
                            title: ['视频预览/评论管理', 'color:#fff'],
                            content: $("#showVideoDialog"),
                            shade: 0.3,
                            shadeClose: true,
                            closeBtn: 1,
                            resize: false,
                            scrollbar: false,
                            move:false,
                            end: function () {
                                layer.closeAll();
                                player.dispose()
                            }
                        });

                    } else {
                        layer.msg('获取视频失败,请重试!')
                    }
                }
            })
        })
        // 监听下载状态
        function monitorDownload(){
            if(sessionStorage.getItem('uploadflag')){
                downloadVideo(sessionStorage.getItem('uploadflag'))
                $('.layui-tab-item .video-upload').addClass('video-upload-wait')
            } else {
                $('.layui-tab-item .video-upload').removeClass('video-upload-wait')
            }
        }

        // 视频库下载
        $('.videoContent').on('click', '.video-upload', function () {
            if($(this).hasClass('video-upload-wait')) {
                layer.msg('有下载任务,请稍等!')
                return
            } 
            $.ajax({
                type: "POST",
                dataType: "json",
                headers: {
                    token: sessionStorage.getItem('token')
                },
                url: "http://www.cube.vip/video_editing/download_video/",
                data: {
                    video_code: $(this).attr('data-code')
                },
                success: function (res) {
                    if (res.msg === 'success') {
                        downloadVideo(res.data.video_download_id)
                        sessionStorage.setItem('uploadflag',res.data.video_download_id)
                        layer.msg('正在下载,请稍等...')
                        $('.layui-tab-item .video-upload').addClass('video-upload-wait')
                    } else {
                        layer.msg('下载失败,请稍后重试...')
                    }
                }
            })
        })

        // 暂存库下载
        $('.tsContent').on('click', '.video-upload', function () {
            if($(this).hasClass('video-upload-wait')) {
                layer.msg('有下载任务,请稍等!')
                return
            } 
            $.ajax({
                type: "POST",
                dataType: "json",
                // async: false,
                headers: {
                    token: sessionStorage.getItem('token')
                },
                url: "http://www.cube.vip/video_editing/download_video/",
                data: {
                    video_code: $(this).attr('data-code')
                },
                success: function (res) {
                    if (res.msg === 'success') {
                        downloadVideo(res.data.video_download_id)
                        sessionStorage.setItem('uploadflag',res.data.video_download_id)
                        layer.msg('正在下载,请稍等...')
                        $('.layui-tab-item .video-upload').addClass('video-upload-wait')
                    }else {
                        layer.msg('下载失败,请稍后重试...')
                    }
                }
            })
        })
        // 监听下载状态
        function downloadVideo(id) {
            clearInterval(downTimer)
            downTimer = setInterval(() => {
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    async: false,
                    headers: {
                        token: sessionStorage.getItem('token')
                    },
                    url: "http://www.cube.vip/video_editing/download_video_status/",
                    data: {
                        video_download_id: id
                    },
                    success: function (res) {
                        if (res.msg === 'success') {
                            downLoadNum = 0
                            clearInterval(downTimer)
                            window.open(res.data.video_mp4_uri,'_self')
                            sessionStorage.removeItem('uploadflag')
                            $('.layui-tab-item .video-upload').removeClass('video-upload-wait')
                        }else if(res.msg==='assigned'){
                            monitorDownNum()
                        } else if(res.msg==='error'){
                            downLoadNum = 0
                            layer.msg('下载失败,请重试!')
                            clearInterval(downTimer)
                            sessionStorage.removeItem('uploadflag')
                            $('.layui-tab-item .video-upload').removeClass('video-upload-wait')
                        }
                    }
                })
            }, 1000)

        }
        // 监听下载分配次数\
        function monitorDownNum(){
            downLoadNum +=1
            if(downLoadNum >=30) {
                downLoadNum = 0
                layer.msg('下载失败,请重试!')
                clearInterval(downTimer)
                sessionStorage.removeItem('uploadflag')
                $('.layui-tab-item .video-upload').removeClass('video-upload-wait')
            }
        }


        // 视频合并
        $('#merge').on('click', function (e) {
            if (checkVideoLibrary.length !== 2) {
                layer.msg('请勾选两个视频!')
                return
            }
            window.location.href = "merge.html?codeone=" + checkVideoLibrary[0].video_code +
                '&codetwo=' + checkVideoLibrary[1].video_code
        })

        // 视频剪辑
        $("#editing").click(function () {
            if (checkVideoLibrary.length !== 1) {
                layer.msg('请勾选一个视频!')
                return
            }
            window.location.href = "tailor.html?key=" + checkVideoLibrary[0].video_code

        })
    });

})