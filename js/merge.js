if (!sessionStorage.getItem('token')) {
    window.location.href = "./../login.html"
}
let searchData = window.location.search.substring(1).split("&")
var infoData = []
searchData.forEach(item => {
    infoData.push(item.split("="))
})
if(infoData.length<2){
    window.location.href = "./../html/media.html"
}
var allVideo = videojs('myVideo', {
    muted: false,
    controls: true,
    preload: 'auto',
    width: '700',
    height: '328',
}, function () {
    this.on("playing", function () {
        singleTwo.pause()
        singleOne.pause()
    })
    this.on('loadedmetadata', function () {
        // console.log(this.duration())

    })
})
var singleOne = videojs('mergeOne', {
    muted: false,
    controls: true,
    preload: 'auto',
    width: '300',
    height: '170',
}, function () {
    this.on("playing", function () {
        singleTwo.pause()
        allVideo.pause()
    })
    this.on('loadedmetadata', function () {
        // console.log(this.duration())

    })
})
var singleTwo = videojs('mergeTwo', {
    muted: false,
    controls: true,
    preload: 'auto',
    width: '300',
    height: '170'
}, function () {
    this.on("playing", function () {
        singleOne.pause()
        allVideo.pause()
    })
    this.on('loadedmetadata', function () {
        // console.log(this.duration())

    })
})
var mergeTimer = null
$(function () {

    $.ajax({
        type: "GET",
        dataType: "json",
        async: false,
        url: "http://www.cube.vip/video/video_code_to_uri/",
        data: {
            video_code: infoData[0][1]
        },
        headers: {
            token: sessionStorage.getItem('token')
        },
        success: res => {
            if (res.msg === 'success') {

                singleOne.src({
                    type: 'application/x-mpegURL',
                    src: res.data.video_rui
                })
            } else {
                layer.msg('获取视频失败,请重试!')
            }
        }
    })
    $.ajax({
        type: "GET",
        dataType: "json",
        async: false,
        url: "http://www.cube.vip/video/video_code_to_uri/",
        data: {
            video_code: infoData[1][1]
        },
        headers: {
            token: sessionStorage.getItem('token')
        },
        success: res => {
            if (res.msg === 'success') {

                singleTwo.src({
                    type: 'application/x-mpegURL',
                    src: res.data.video_rui
                })
            } else {
                layer.msg('获取视频失败,请重试!')
            }
        }
    })
    $('#videoText').on('input', function () {
        $('.nameLength').text($(this).val().length + '/140')
    })
    $('#submit').on('click', function () {
        if ($.trim($('#videoText').val()).length <= 0) {
            layer.msg('请输入视频描述!')
            return
        }
        var order = []
        $('.item').each((index, item) => {
            order.push($(item).attr('index'))
        })
        if (order[0] === '0') {
            $.ajax({
                type: "GET",
                dataType: "json",
                async: false,
                url: "http://www.cube.vip/video_editing/merger_video/",
                data: {
                    fistname: infoData[0][1],
                    secondname: infoData[1][1],
                    video_description: $('#videoText').val()
                },
                headers: {
                    token: sessionStorage.getItem('token')
                },
                success: res => {
                    if (res.msg === 'success') {

                        mergeState(res.data.editing_action_id)
                    } else {
                        layer.msg('合并失败,请重试...')
                    }
                }
            })
        } else {
            $.ajax({
                type: "GET",
                dataType: "json",
                async: false,
                url: "http://www.cube.vip/video_editing/merger_video/",
                data: {
                    fistname: infoData[1][1],
                    secondname: infoData[0][1],
                    video_description: $('#videoText').val()
                },
                headers: {
                    token: sessionStorage.getItem('token')
                },
                success: res => {
                    if (res.msg === 'success') {

                        mergeState(res.data.editing_action_id)
                    }else {
                        layer.msg('合并失败,请重试...')
                    }
                }
            })
        }
    })
    //  查询合并状态
    function mergeState(id) {

        clearInterval(mergeTimer)
        mergeTimer = setInterval(() => {
            $.ajax({
                type: "GET",
                dataType: "json",
                async: false,
                url: "http://www.cube.vip/video_editing/merge_video_status/",
                data: {
                    editing_action_id: id
                },
                headers: {
                    token: sessionStorage.getItem('token')
                },
                success: res => {
                    if (res.msg === 'sucess') {
                        $('#showDialog').show()
                        allVideo.src({
                            type: 'application/x-mpegURL',
                            src: res.data.video_uri
                        })
                        clearInterval(mergeTimer)
                    } else if (res.msg === 'assigned') {
                        layer.msg('等待合并....')
                    } else if (res.msg === 'pending') {
                        layer.msg('正在合并....')
                    } else {
                        layer.msg('合并失败,请重试!')
                        clearInterval(mergeTimer)
                    }
                }
            })
        }, 1000)
    }



    $('.goMedia-btn').on('click', function () {
        $('#showDialog').hide()
        window.location.href = './media.html'
    })

    $('.current-btn').on('click', function () {
        $('#showDialog').hide()
    })

    function Pointer(x, y) {
        this.x = x;
        this.y = y;
    }

    function Position(left, top) {
        this.left = left;
        this.top = top;
    }
    $(".item_content .item").each(function (i) {
        this.init = function () { // 初始化
                this.box = $(this).parent();
                $(this).attr("index", i).css({
                    position: "absolute",
                    left: this.box.offset().left-270,
                    top: '508px'
                }).appendTo(".item_content");
                this.drag();
            },
            this.move = function (callback) { // 移动
                $(this).stop(true).animate({
                    left: this.box.offset().left-270,
                    top: '508px'
                }, 500, function () {
                    if (callback) {
                        callback.call(this);
                    }
                });
            },
            this.collisionCheck = function () {
                var currentItem = this;
                var direction = null;
                $(this).siblings(".item").each(function () {
                    if (
                        currentItem.pointer.x > this.box.offset().left &&
                        currentItem.pointer.y > this.box.offset().top &&
                        (currentItem.pointer.x < this.box.offset().left + this.box.width()) &&
                        (currentItem.pointer.y < this.box.offset().top + this.box.height())
                    ) {
                        // 返回对象和方向
                        if (currentItem.box.offset().top < this.box.offset().top) {
                            direction = "down";
                        } else if (currentItem.box.offset().top > this.box.offset().top) {
                            direction = "up";
                        } else {
                            direction = "normal";
                        }
                        this.swap(currentItem, direction);
                    }
                });
            },
            this.swap = function (currentItem, direction) { // 交换位置
                if (this.moveing) return false;
                var directions = {
                    normal: function () {
                        var saveBox = this.box;
                        this.box = currentItem.box;
                        currentItem.box = saveBox;
                        this.move();
                        $(this).attr("index", this.box.index());
                        $(currentItem).attr("index", currentItem.box.index());
                    },
                    down: function () {
                        // 移到上方
                        var box = this.box;
                        var node = this;
                        var startIndex = currentItem.box.index();
                        var endIndex = node.box.index();;
                        for (var i = endIndex; i > startIndex; i--) {
                            var prevNode = $(".item_content .item[index=" + (i - 1) + "]")[0];
                            node.box = prevNode.box;
                            $(node).attr("index", node.box.index());
                            node.move();
                            node = prevNode;
                        }
                        currentItem.box = box;
                        $(currentItem).attr("index", box.index());
                    },
                    up: function () {
                        // 移到上方
                        var box = this.box;
                        var node = this;
                        var startIndex = node.box.index();
                        var endIndex = currentItem.box.index();;
                        for (var i = startIndex; i < endIndex; i++) {
                            var nextNode = $(".item_content .item[index=" + (i + 1) + "]")[0];
                            node.box = nextNode.box;
                            $(node).attr("index", node.box.index());
                            node.move();
                            node = nextNode;
                        }
                        currentItem.box = box;
                        $(currentItem).attr("index", box.index());
                    }
                }
                directions[direction].call(this);
            },
            this.drag = function () { // 拖拽
                var oldPosition = new Position();
                var oldPointer = new Pointer();
                var isDrag = false;
                var currentItem = null;
                $(this).mousedown(function (e) {
                    e.preventDefault();
                    oldPosition.left = $(this).position().left;
                    oldPosition.top = $(this).position().top;
                    oldPointer.x = e.clientX;
                    oldPointer.y = e.clientY;
                    isDrag = true;

                    currentItem = this;

                });
                $(document).mousemove(function (e) {
                    var currentPointer = new Pointer(e.clientX, e.clientY);
                    if (!isDrag) return false;
                    $(currentItem).css({
                        "opacity": "0.8",
                        "z-index": 999
                    });
                    var left = currentPointer.x - oldPointer.x + oldPosition.left;
                    var top = currentPointer.y - oldPointer.y + oldPosition.top;
                    $(currentItem).css({
                        left: left,
                        top: top
                    });
                    currentItem.pointer = currentPointer;
                    // 开始交换位置
                    currentItem.collisionCheck();
                });
                $(document).mouseup(function () {
                    if (!isDrag) return false;
                    isDrag = false;
                    currentItem.move(function () {
                        $(this).css({
                            "opacity": "1",
                            "z-index": 0
                        });
                    });
                });
            }
        this.init();
    })
})