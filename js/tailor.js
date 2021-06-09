if (!sessionStorage.getItem('token')) {
    window.location.href = "./../login.html"
}
// 容器距页面左侧距离，用于测量鼠标event中的x距离
let containerLeft = 0
// 容器宽度
let containerWidth = 0

/**
 * 检测鼠标是否接近
 * @param x1
 * @param x2
 */
const isCursorClose = function (x1, x2) {
    return Math.abs(x1 - x2) < 2
}
Vue.component("child-video", {
    template: `
        <div id="containerBox">
            <div class="crop-container">
        <div class="crop-slider">
          <div ref="timeLineContainer" class="crop-time-line-container">
            <div class="crop-time-line"></div>
            <div v-for="(item, index) in cropItemList"
                 class="crop-range crop-range-hover"
                 :style="computedRangeStyle(item)"
                 :key="index">
              <div class="cursor-time-hint  crop-moving-cursor">
                <div class="cursor-line"></div>
                <div class="cursor-time">{{getFormatTime(item.startTime)}}</div>
              </div>
              <div class="cursor-time-hint  crop-moving-cursor"
                   :style="computedEndTimeIndicatorStyle(item)">
                <div class="cursor-line"></div>
                <div class="cursor-time">{{getFormatTime(item.endTime)}}</div>
              </div>
            </div>
          </div>
          <div class="media-duration">{{durationText}}</div>
        </div>
        <div class="crop-panel">
          <div class="crop-time-area">
            <div ref="timeItemContainer" :class="['crop-time-body']">
              <template v-for="(item, index) in cropItemList">
                <div :key="index"
                     :data-highlight="cropItemHoverIndex === index ? 1 : 0"
                     class="crop-time-item">
                  <div class="time-area">
                    <div class="time-input-area">
                      <span class="time-text">{{language.CUT_BEGIN_TIME}}</span>
                      <div class="time-input">
                        <input type="text"
                               :value="item.startTimeArr[0]"
                               @blur="startTimeChange($event, index, 0)" />
                        :
                        <input type="text"
                               :value="item.startTimeArr[1]"
                               @blur="startTimeChange($event, index, 1)" />
                        :
                        <input type="text"
                               :value="item.startTimeArr[2]"
                               @blur="startTimeChange($event, index, 2)" />
                      </div>
                    </div>
                    <span class="range-text"> ~ </span>
                    <div class="time-input-area">
                      <span class="time-text">{{language.CUT_END_TIME}}</span>
    
                      <div class="time-input">
                        <input type="text"
                               :value="item.endTimeArr[0]"
                               @blur="endTimeChange($event, index, 0)" />
                        :
                        <input type="text"
                               :value="item.endTimeArr[1]"
                               @blur="endTimeChange($event, index, 1)" />
                        :
                        <input type="text"
                               :value="item.endTimeArr[2]"
                               @blur="endTimeChange($event, index, 2)" />
                      </div>
                    </div>
                  </div>
                  <button class="small-btn" @click="togglePlayClip(index)">
                    {{playingIndex === index ? '暂停' : '播放'}}
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="submitBox">
        <p class="videoName">
        视频描述:
        </p>
        <textarea v-model.trim="videoDescribe" placeholder="请输入视频描述" maxlength="140"  id="textVideo">
        </textarea>
        <p class="hintInfo">
            <span class="hintIcon">!</span>保存将另存为一个新的视频，不会覆盖原有视频。      
        </p>
        <div :class="['confirm-btn', {'confirm-btn-disabled': isSendingCrop}]"
            @click="confirmCrop()">{{isSendingCrop ? language.SENDING_DATA :language.CONFIRM_CUT_VIDEO}}
        </div>
    </div>
    </div>
                `,
    props: {
        duration: {
            type: Number,
            default: 0,
        },
        currentplayingtime: {
            type: Number,
            default: 0,
        },
        playing: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            videoDescribe: '',
            timer: null,
            cropItemHoverIndex: -1,
            timeLineContainer: null,
            sliderLength: 0,

            timeToPixelRatio: 1,
            cropItemToAdd: null, // 用来暂存待添加的项
            cropItemList: [
                // {
                //     startTime: 0,
                //     endTime: 100,
                //     startTimeArr: [hours, minutes, seconds],
                //     endTimeArr: [hours, minutes, seconds],
                //     startTimeIndicatorOffsetX: 0,
                //     endTimeIndicatorOffsetX: 100,
                // }
            ],
            startTimeIndicatorHoverIndex: -1,
            endTimeIndicatorHoverIndex: -1,
            startTimeIndicatorDraggingIndex: -1,
            endTimeIndicatorDraggingIndex: -1,
            currentEditingIndex: -1,
            currentCursorTime: 0,
            currentCursorOffsetX: 0,
            isCursorIn: false,
            isCropping: false,

            language: {
                CROP_CLIP_LIST: '裁剪列表',
                CUT_BEGIN_TIME: '开始时间',
                CUT_END_TIME: '结束时间',
                SENDING_DATA: '裁剪中',
                CONFIRM_CUT_VIDEO: '裁剪',
            },
            playingIndex: -1,
            playingItem: null,
            isSendingCrop: false,
        }
    },

    computed: {
        listLength() {
            return this.cropItemList.length
        },
        durationText() {
            return this.getFormatTime(this.duration)
        },

        disableEditing() {
            return !this.duration || this.duration <= 0
        },

        showNormalCursorTimeHint() {
            return this.isCursorIn &&
                !this.isCropping &&
                !~this.startTimeIndicatorHoverIndex &&
                !~this.endTimeIndicatorHoverIndex
        },
    },

    watch: {
        timeToPixelRatio() {
            this.forceUpdateCropDataList()
        },

        /**
         * 监测播放进度，达到片段末尾就暂停
         */
        currentplayingtime(currentTime) {
            const playingItem = this.playingItem
            if (!playingItem) {
                return
            }
            if (currentTime >= playingItem.endTime) { //标记123
                this.pause()
                this.playingIndex = -1
                this.playingItem = undefined
            }
        },

        isCropping(isCropping) {
            if (isCropping) {
                this.playingItem = null
                this.playingIndex = -1
            }
        },

        duration() {
            // 时长更新后需更新界面
            this.calculateTimeLineData()
            this.onAddClick()
        },
    },

    mounted() {
        // 获取容器距页面左侧距离，用于后续鼠标event的x位置计算
        this.timeLineContainer = this.$refs.timeLineContainer

        this.$nextTick(() => {

            this.calculateTimeLineData()

            this.addListeners()
        })
    },

    methods: {

        /**
         * 界面重新布局后需重新计算offsetX数据
         */
        forceUpdateCropDataList() {
            if (!this.listLength) {
                return
            }
            const cropItemList = this.cropItemList
            const duration = this.duration
            const timeToPixelRatio = this.timeToPixelRatio
            cropItemList.forEach(item => {
                let startTime = item.startTime
                let endTime = item.endTime
                if (!startTime || startTime < 0 || startTime >= duration) {
                    startTime = 0
                }
                if (!endTime || endTime < startTime || endTime > duration) {
                    endTime = duration
                }
                item.startTimeIndicatorOffsetX = startTime / timeToPixelRatio
                item.endTimeIndicatorOffsetX = endTime / timeToPixelRatio
            })
            this.cropItemList = cropItemList.slice(0)
        },

        calculateTimeLineData() {
            if (!this.timeLineContainer) {
                return
            }
            const duration = this.duration

            const rect = this.timeLineContainer.getBoundingClientRect()
            containerLeft = rect.left
            containerWidth = Math.floor(rect.width)

            this.sliderLength = containerWidth
            this.timeToPixelRatio = duration / containerWidth
        },

        getFormatTime(time) {
            const times = simplifySecond(time < 0 ? 0 : time)

            return [
                times.hours,
                times.minutes,
                times.seconds,
            ].join(':')
        },

        isTimeIndicatorHovered(index) {
            return this.startTimeIndicatorDraggingIndex === index ||
                this.startTimeIndicatorHoverIndex === index ||
                this.endTimeIndicatorDraggingIndex === index ||
                this.endTimeIndicatorHoverIndex === index
        },

        computedRangeStyle(item) {
            return 'transform: translateX(' +
                item.startTimeIndicatorOffsetX +
                'px); width:' +
                (item.endTimeIndicatorOffsetX - item.startTimeIndicatorOffsetX) +
                'px'
        },

        computedEndTimeIndicatorStyle(item) {
            return 'transform: translateX(' +
                (item.endTimeIndicatorOffsetX - item.startTimeIndicatorOffsetX) +
                'px)'
        },

        /**
         * 获取标准的裁剪数据格式
         */
        getFormattedCropItem(startTime, endTime) {
            const duration = this.duration
            const timeToPixelRatio = this.timeToPixelRatio
            if (!startTime || startTime < 0 || startTime > duration) {
                startTime = 0
            }
            if (endTime === undefined || endTime < startTime || endTime > duration) {
                endTime = duration
            }

            return {
                startTime: startTime,
                endTime: endTime,
                startTimeArr: getFormatTimeArr(startTime),
                endTimeArr: getFormatTimeArr(endTime),
                startTimeIndicatorOffsetX: startTime / timeToPixelRatio,
                endTimeIndicatorOffsetX: endTime / timeToPixelRatio,
            }
        },

        getDefaultValues() {
            // 默认添加的时间为1/4到 3/4，到边缘时用户鼠标不好选中时间条
            const quarterTime = this.duration / 4
            return this.getFormattedCropItem(quarterTime, quarterTime * 3)
        },

        /**
         * 鼠标点击抬起后开始裁剪
         * @param editingIndex {number} 当前裁剪item位置
         */
        startCropping(editingIndex) {
            // 开始裁剪后默认控制结束时标
            this.endTimeIndicatorDraggingIndex = editingIndex
            this.currentEditingIndex = editingIndex
            this.cropItemHoverIndex = editingIndex
            this.isCropping = true

            // 添加一项后列表项肯定存在了
        },

        stopCropping() {
            this.startTimeIndicatorDraggingIndex = -1
            this.endTimeIndicatorDraggingIndex = -1
            this.currentEditingIndex = -1
            this.cropItemHoverIndex = -1
            this.isCropping = false
        },

        /**
         * 点击时间条新增裁剪
         * @param currentCursorOffsetX
         */
        addNewCropItemInSlider() {
            if (this.listLength < 1) { 
                const currentCursorTime = this.currentCursorTime
                const newCropItem = this.getFormattedCropItem(currentCursorTime, currentCursorTime)
                this.addCropItem(newCropItem)
            }

        },

        /**
         * 将offsetX限定到时间条内
         */
        getFormattedOffsetX(offsetX) {
            if (offsetX < 0) {
                return 0
            }
            if (offsetX >= containerWidth) {
                return containerWidth
            }
            return offsetX
        },

        timeIndicatorCheck(currentCursorOffsetX, mouseEvent) {
            // 在裁剪状态，直接返回
            if (this.isCropping) {
                return
            }

            // 鼠标移动，重设hover状态
            this.startTimeIndicatorHoverIndex = -1
            this.endTimeIndicatorHoverIndex = -1
            this.startTimeIndicatorDraggingIndex = -1
            this.endTimeIndicatorDraggingIndex = -1
            this.cropItemHoverIndex = -1

            this.cropItemList.forEach((item, index) => {
                // 已找到item，后面的再无需查询
                if (~this.cropItemHoverIndex || this.isCropping) {
                    return
                }
                // 标志当前鼠标悬浮在哪个裁剪片段上，高亮此片段
                if (currentCursorOffsetX >= item.startTimeIndicatorOffsetX &&
                    currentCursorOffsetX <= item.endTimeIndicatorOffsetX) {
                    this.cropItemHoverIndex = index
                }

                // 默认始末时间戳在一起时优先选中截止时间戳
                if (isCursorClose(item.endTimeIndicatorOffsetX, currentCursorOffsetX)) {
                    this.endTimeIndicatorHoverIndex = index
                    // 鼠标放下，开始裁剪
                    if (mouseEvent === 'mousedown') {
                        this.endTimeIndicatorDraggingIndex = index
                        this.currentEditingIndex = index
                        this.isCropping = true
                    }
                } else if (isCursorClose(item.startTimeIndicatorOffsetX,
                        currentCursorOffsetX)) {
                    this.startTimeIndicatorHoverIndex = index
                    // 鼠标放下，开始裁剪
                    if (mouseEvent === 'mousedown') {
                        this.startTimeIndicatorDraggingIndex = index
                        this.currentEditingIndex = index
                        this.isCropping = true
                    }
                }
            })
        },

        timeIndicatorMove(currentCursorOffsetX) {
            // 裁剪状态，随动时间戳
            if (this.isCropping) {
                const currentEditingIndex = this.currentEditingIndex
                const startTimeIndicatorDraggingIndex = this.startTimeIndicatorDraggingIndex
                const endTimeIndicatorDraggingIndex = this.endTimeIndicatorDraggingIndex
                const currentCursorTime = this.currentCursorTime

                let currentItem = this.cropItemList[currentEditingIndex]
                // 操作起始位时间戳
                if (startTimeIndicatorDraggingIndex > -1 && currentItem) {
                    // 已到截止位时间戳则直接返回
                    if (currentCursorOffsetX > currentItem.endTimeIndicatorOffsetX) {
                        return
                    }
                    currentItem.startTimeIndicatorOffsetX = currentCursorOffsetX
                    currentItem.startTime = currentCursorTime
                }

                // 操作截止位时间戳
                if (endTimeIndicatorDraggingIndex > -1 && currentItem) {
                    // 已到起始位时间戳则直接返回
                    if (currentCursorOffsetX < currentItem.startTimeIndicatorOffsetX) {
                        return
                    }
                    currentItem.endTimeIndicatorOffsetX = currentCursorOffsetX
                    currentItem.endTime = currentCursorTime
                }
                this.updateCropItem(currentItem, currentEditingIndex)
            }
        },

        addListeners() {
            window.addEventListener('resize', this.calculateTimeLineData.bind(this))

            if (!this.timeLineContainer) {
                return
            }
            let lastMouseDownOffsetX = null
            this.timeLineContainer.addEventListener('mousemove', e => {
                throttle(() => {
                    const currentCursorOffsetX = e.clientX - containerLeft

                    // mousemove范围检测
                    if (currentCursorOffsetX < 0 || currentCursorOffsetX >
                        containerWidth) {
                        this.isCursorIn = false
                        // 鼠标拖拽状态到达边界直接触发mouseup状态
                        if (this.isCropping) {
                            this.stopCropping()
                            this.timeIndicatorCheck(currentCursorOffsetX < 0 ? 0 :
                                containerWidth, 'mouseup')
                        }
                        return
                    } else {
                        this.isCursorIn = true
                    }

                    this.currentCursorTime = currentCursorOffsetX * this
                        .timeToPixelRatio
                    this.currentCursorOffsetX = currentCursorOffsetX

                    this.timeIndicatorCheck(currentCursorOffsetX, 'mousemove')
                    this.timeIndicatorMove(currentCursorOffsetX)

                }, 10, true)()

            })
            this.timeLineContainer.addEventListener('mousedown', e => {
                const currentCursorOffsetX = e.clientX - containerLeft
                // 记录mousedown位置，用于mouseup时检测是否是点击事件
                lastMouseDownOffsetX = currentCursorOffsetX
                this.timeIndicatorCheck(currentCursorOffsetX, 'mousedown')
            })
            this.timeLineContainer.addEventListener('mouseup', e => {

                // 已经处于裁剪状态时，鼠标抬起，则裁剪状态取消
                if (this.isCropping) {
                    this.stopCropping()
                    return
                }

                const currentCursorOffsetX = this.getFormattedOffsetX(e.clientX - containerLeft)
                // mousedown与mouseup位置不一致，则不认为是点击,直接返回
                if (Math.abs(currentCursorOffsetX - lastMouseDownOffsetX) > 3) {
                    return
                }

                // 更新当前鼠标指向的时间
                this.currentCursorTime = currentCursorOffsetX * this.timeToPixelRatio

                // 鼠标点击新增裁剪片段
                if (!this.isCropping) {
                    this.addNewCropItemInSlider()

                    // 新操作位置为数组最后一位
                    this.startCropping(this.cropItemList.length - 1)
                }
            })
        },


        getTargetItem(cropItemListIndex) {
            let currentItem = null
            // index为-1表明编辑的为待添加项, 否则为裁剪列表项
            if (cropItemListIndex === -1) {
                if (!this.cropItemToAdd) {
                    this.cropItemToAdd = this.getDefaultValues()
                }
                currentItem = this.cropItemToAdd
            } else {
                const cropItemList = this.cropItemList.slice(0)
                currentItem = cropItemList[cropItemListIndex]
            }
            return currentItem
        },

        startTimeChange(event, cropItemListIndex, timeArrIndex) {
            const value = Math.floor(+event.target.value)
            const currentItem = this.getTargetItem(cropItemListIndex)

            // 判断输入值超出范围或NaN,恢复原值
            if (value < 0 || value > 59 || value !== value) {
                console.log('不合法的输入值')
            } else {
                // 输出用户自定义值
                currentItem.startTimeArr[timeArrIndex] = String(value).padStart(2, '0')
                currentItem.startTime = restoreTimeFromTimeArr(currentItem.startTimeArr)
                // 开始时间不能大于结束时间
                if (currentItem.startTime > currentItem.endTime) {
                    currentItem.startTime = currentItem.endTime - 1
                    currentItem.startTimeArr = getFormatTimeArr(currentItem.startTime)

                    console.log('起始值必须小于结束值')
                }

                this.updateCropItem(currentItem, cropItemListIndex)
            }
            event.target.value = currentItem.startTimeArr[timeArrIndex]
        },

        endTimeChange(event, cropItemListIndex, timeArrIndex) {
            const value = Math.floor(+event.target.value)
            const currentItem = this.getTargetItem(cropItemListIndex)

            // 判断输入值超出范围或NaN,恢复原值
            if (value < 0 || value > 59 || value !== value) {
                console.log('不合法的输入值')
            } else {
                // 输出用户自定义值
                currentItem.endTimeArr[timeArrIndex] = String(value).padStart(2, '0')
                currentItem.endTime = restoreTimeFromTimeArr(currentItem.endTimeArr)
                // 结束时间不能小于开始时间
                if (currentItem.endTime < currentItem.startTime) {
                    currentItem.endTime = currentItem.startTime + 1
                    currentItem.endTimeArr = getFormatTimeArr(currentItem.endTime)

                    console.log('结束值必须大于起始值')
                }
                // 结束时间不能大于总时长
                const duration = this.duration
                if (currentItem.endTime > duration) {

                    console.log('结束值不能大于总时长')

                    currentItem.endTime = duration
                    currentItem.endTimeArr = getFormatTimeArr(duration)
                }

                this.updateCropItem(currentItem, cropItemListIndex)
            }
            event.target.value = currentItem.endTimeArr[timeArrIndex]
        },
        /**
         * 更新全部裁剪
         */
        updateAllCropItems(cropItemList) {
            this.cropItemList = cropItemList
            this.forceUpdateCropDataList()
        },

        /**
         * 更新单个裁剪
         */
        updateCropItem(item, index) {
            if (index < 0) {
                return
            }
            const newItem = this.getFormattedCropItem(item.startTime, item.endTime)
            this.cropItemList.splice(index, 1, newItem)
        },

        /**
         * 移除单个裁剪
         * @param index
         */
        removeCropItem(index) {
            this.cropItemList.splice(index, 1)
        },
        /**
         * 添加一个空裁剪
         */
        onAddClick() {
            if (this.listLength < 1) {
                // 将待裁剪数据项添加到裁剪列表, 无待裁剪则直接增加一条新数据
                this.addCropItem(this.cropItemToAdd || this.getDefaultValues());
            }
        },


        addCropItem(cropItem) {
            this.cropItemList.push(cropItem)
            // 添加裁剪时置空待裁剪项
            this.cropItemToAdd = null
            this.smoothScrollContainer()
        },

        /**
         * 平滑滚动裁剪列表
         **/
        smoothScrollContainer() {
            if (this.listLength <= 10) {
                return
            }
            const targetScrollHeight = (this.listLength - 10) * 40
            const currentScrollTop = this.$refs.timeItemContainer.scrollTop
            const scrollHeight = targetScrollHeight - currentScrollTop
            const heightRange = scrollHeight / 10

            const scrollFunc = currentHeight => {
                if (currentHeight >= targetScrollHeight) {
                    return
                }
                requestAnimationFrame(() => {
                    this.$refs.timeItemContainer.scrollTo(0, currentHeight)
                    scrollFunc(currentHeight + heightRange)
                })
            }

            scrollFunc(currentScrollTop + heightRange)
        },

        /**
         * 重置
         */
        reset() {
            this.cropItemToAdd = null
            this.cropItemList = []
            this.cropItemHoverIndex = -1
            this.startTimeIndicatorHoverIndex = -1
            this.endTimeIndicatorHoverIndex = -1
            this.startTimeIndicatorDraggingIndex = -1
            this.endTimeIndicatorDraggingIndex = -1
            this.currentEditingIndex = -1
            this.currentCursorTime = 0
            this.currentCursorOffsetX = 0
            this.isCursorIn = false
            this.isCropping = false
            this.playingItem = undefined
            this.playingIndex = -1
            this.isSendingCrop = false
            this.$emit('stop')
        },

        /**
         * 切换片段播放暂停
         * @param index
         */
        togglePlayClip(index) {
            if (this.playingItem) { // 标记123
                this.pause()
                this.playingIndex = -1
                this.playingItem = undefined
            } else {
                this.playSelectedClip(index)
            }
        },

        /**
         * 播放选中片段
         * @param index
         */
        playSelectedClip(index) {
            this.playingItem = this.getTargetItem(index)
            this.playingIndex = index
            if (!this.playingItem) {
                console.log('无裁剪片段')
                return
            }
            this.isCropping = false

            const startTime = this.playingItem.startTime

            this.$emit('play', startTime || 0)
        },

        pause() {
            this.$emit('pause')
        },

        /**
         * 确认裁剪
         */
        confirmCrop() {
            if (this.isSendingCrop) {
                console.log('裁剪中')
                return
            }

            if (!this.listLength || (this.cropItemList[0].startTime === 0 && this.cropItemList[0].endTime === 0)) {
                layer.msg('请添加裁剪片段!')
                return
            }
            if (this.videoDescribe.length === 0) {
                layer.msg('请添加视频描述!')
                return
            }

            let cropItemList = this.cropItemList
            this.isSendingCrop = true
            axios({
                method: 'get',
                url: 'http://www.cubee.vip/video_editing/clip_video/',
                headers: {
                    token: sessionStorage.getItem('token')
                },
                params: {
                    video_code: window.location.search.substring(1).split("=")[1],
                    start_time: cropItemList[0],
                    video_description: this.videoDescribe
                },
            }).then(res => {
                this.isSendingCrop = false
                if (res.data.msg === 'success') {
                    this.monitor(res.data.editing_action_id)
                } else {
                    layer.msg('剪辑失败,请稍后重试...')
                }

            }).catch(err => {
                console.log(err)
            })

        },
        // 监听剪辑状态
        monitor(id) {
            clearInterval(this.timer)
            this.timer = setInterval(() => {
                axios({
                    method: 'get',
                    url: 'http://www.cubee.vip/video_editing/clip_video_status/',
                    headers: {
                        token: sessionStorage.getItem('token')
                    },
                    params: {
                        editing_action_id: id
                    },
                }).then(res => {
                    this.isSendingCrop = false
                    if (res.data.msg === 'success') {
                        clearInterval(this.timer)
                        layer.open({
                            type: 1,
                            title: '提示',
                            area: ['640px', '268px'],
                            content: $('#showDialog'),
                            shade: 0.3,
                            shadeClose: true,
                            closeBtn: 1,
                            resize: false,
                            move:false,
                            btn: ['去媒体库', '留在此页'],
                            btn1: function () {
                                window.location.href = './media.html'
                            }
                        })
                    } else if (res.data.msg === 'error') {
                        layer.msg('剪辑失败,请稍后重试...')
                        clearInterval(this.timer)
                    }

                }).catch(err => {
                    console.log(err)
                })
            }, 1000)
        }
    },
})
let vm = new Vue({
    el: "#app",
    data: {
        videoSrc: '',
        duration: 0,
        playing: false,
        currentTime: 0,
    },
    created() {
        this.getVideoUrl()
    },
    mounted() {
        const videoElement = this.$refs.video
        videoElement.ondurationchange = () => {
            this.duration = videoElement.duration
        }
        videoElement.onplaying = () => {
            this.playing = true
        }
        videoElement.onpause = () => {
            this.playing = false
        }
        videoElement.ontimeupdate = () => {
            this.currentTime = videoElement.currentTime
        }
    },
    methods: {
        seekVideo(seekTime) {
            this.$refs.video.currentTime = seekTime
        },
        playVideo(time) {
            this.seekVideo(time)
            this.$refs.video.play()
        },
        pauseVideo() {
            this.$refs.video.pause()
        },
        stopVideo() {
            this.$refs.video.pause()
            this.$refs.video.currentTime = 0
        },
        // 获取视频url
        getVideoUrl() {
            axios({
                method: 'get',
                url: "http://www.cubee.vip/video/video_code_to_uri/",
                params: {
                    video_code: window.location.search.substring(1).split("=")[1]
                },
                headers: {
                    token: sessionStorage.getItem('token')
                }
            }).then(res => {
                if (res.data.msg = 'success') {
                    var player = new Aliplayer({
                        "id": "myVideo",
                        "source": res.data.data.video_rui,
                        "width": "800px",
                        "height": "450px",
                        "autoplay": false,
                        "isLive": false,
                        "rePlay": false,
                        "playsinline": true,
                        "preload": true,
                        "controlBarVisibility": "always",
                        "useH5Prism": true,
                      })
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }

})