$(function () {
  let token = window.location.search.substring(1).split("=")[1]
  var checkId = []
  var tabIndex = 0
  layui.use(['element', 'form', 'laypage'], function () {
    var element = layui.element
    var form = layui.form
    var laypage = layui.laypage
    // 全选
    form.on('checkbox(check-All)', function (data) {
      if (data.elem.checked) {
        $('.check_All_item').each((index, item) => {
          var flag = true
          checkId.forEach(items => {
            if (items === $(item).val()) {
              flag = false
            }
          })
          if (flag) {
            checkId.push($(item).val())
          }
        })
      } else {
        checkId = []
      }
      
      $('.check_All_item').prop('checked', data.elem.checked)
      form.render('checkbox')
    })

    // 单个勾选
    form.on('checkbox(check_All_item)', function (data) {
      if (data.elem.checked) {
        checkId.push(data.value)
      } else {
        checkId.splice(checkId.indexOf(data.value), 1)
      }
      $('#check-All').prop('checked', $('.check_All_item').length === $(
        '.check_All_item:checked').length)
      form.render('checkbox')
    })

    // tab栏切换
    element.on('tab(tab)', function (data) {
      if (tabIndex == data.index) {
        return
      }
      tabIndex = data.index
      // 取消勾选
      $('#check-All').prop('checked', false)
      $('.check_All_item').prop('checked', false)
      form.render('checkbox')
      checkId = []
    })

    // 获取全部数据
    getAllMessage()

    function getAllMessage() {
      $.ajax({
        type: 'GET',
        url: "http://www.cube.vip/account/message/",
        dataType: "json",
        async: false,
        headers: {
          token: token
        },
        data: {
          has_read: 'all',
          number: 7,
          pege: 1
        },
        success: function (res) {
          if (res.msg === 'success') {
              // 全部分页
              laypage.render({
                elem: 'allPage',
                limit: 7,
                count: res.data.count,
                theme: '#FF914D',
                jump: function (obj, first) {
                  // 取消勾选
                  $('#check-All').prop('checked', false)
                  $('.check_All_item').prop('checked', false)
                  form.render('checkbox')
                  checkId = []
                  //首次不执行
                  if (!first) {
                    
                    getPageAllMessage(obj.curr,obj.limit)
                  }
                }
              })
            var str = ''
            res.data.posts.forEach(item => {
              if (item.has_read === 'True') {
                str += `
                      <div class="item">
                        <div class="layui-form checkItem">
                            <input type="checkbox" lay-skin="primary" value="${item.message_id}" class="check_All_item"  lay-filter="check_All_item">
                        </div>
                        <div class="messageTitle marginLeft" data-id="${item.message_id}" data-flag="${item.has_read}">
                            ${item.message_title}
                        </div>
                        <div class="messageTime">
                           ${item.datetime}
                        </div>
                    </div>
                      `
              } else {
                str += `
                      <div class="item">
                        <div class="layui-form checkItem">
                            <input type="checkbox" lay-skin="primary" value="${item.message_id}" class="check_All_item"  lay-filter="check_All_item">
                        </div>
                        <div class="messageIcon"></div> 
                        <div class="messageTitle"  data-id="${item.message_id}" data-flag="${item.has_read}">
                        ${item.message_title}
                        </div>
                        <div class="messageTime">
                        ${item.datetime}
                        </div>
                    </div>
                      `
              }

            })
            $('.allContent').html(str)
            form.render('checkbox')
          }
        }
      })
    }

    // 获取全部分页数据
    function getPageAllMessage(page,num) {
      $.ajax({
        type: 'GET',
        url: "http://www.cube.vip/account/message/",
        dataType: "json",
        async: false,
        headers: {
          token: token
        },
        data: {
          has_read: 'all',
          number: num,
          pege: page
        },
        success: function (res) {
          if (res.msg === 'success') {
            var str = ''
            res.data.posts.forEach(item => {
              if (item.has_read === 'True') {
                str += `
                      <div class="item">
                        <div class="layui-form checkItem">
                            <input type="checkbox" lay-skin="primary" value="${item.message_id}" class="check_All_item"  lay-filter="check_All_item">
                        </div>
                        <div class="messageTitle marginLeft"  data-id="${item.message_id}" data-flag="${item.has_read}">
                            ${item.message_title}
                        </div>
                        <div class="messageTime">
                           ${item.datetime}
                        </div>
                    </div>
                      `
              } else {
                str += `
                      <div class="item">
                        <div class="layui-form checkItem">
                            <input type="checkbox" lay-skin="primary" value="${item.message_id}" class="check_All_item"  lay-filter="check_All_item">
                        </div>
                        <div class="messageIcon"></div> 
                        <div class="messageTitle "  data-id="${item.message_id}" data-flag="${item.has_read}">
                        ${item.message_title}
                        </div>
                        <div class="messageTime">
                        ${item.datetime}
                        </div>
                    </div>
                      `
              }

            })
            $('.allContent').html(str)
            form.render('checkbox')
          }
        }
      })
    }


     // 获取已读数据
     getReadMessage()

     function getReadMessage() {
       $.ajax({
         type: 'GET',
         url: "http://www.cube.vip/account/message/",
         dataType: "json",
         async: false,
         headers: {
           token: token
         },
         data: {
           has_read: 'read',
           number: 7,
           pege: 1
         },
         success: function (res) {
           if (res.msg === 'success') {
              $('#readNum').html('('+res.data.count+')')
               // 全部分页
               laypage.render({
                 elem: 'readPage',
                 limit: 7,
                 count: res.data.count,
                 theme: '#FF914D',
                 jump: function (obj, first) {
                   // 取消勾选
                   $('#check-All').prop('checked', false)
                   $('.check_All_item').prop('checked', false)
                   form.render('checkbox')
                   checkId = []
                   //首次不执行
                   if (!first) {
                     
                     getPageReadMessage(obj.curr,obj.limit)
                   }
                 }
               })
             var str = ''
             res.data.posts.forEach(item => {
               if (item.has_read === 'True') {
                 str += `
                       <div class="item">
                         <div class="layui-form checkItem">
                             <input type="checkbox" lay-skin="primary" value="${item.message_id}" class="check_All_item"  lay-filter="check_All_item">
                         </div>
                         <div class="messageTitle marginLeft"  data-id="${item.message_id}" data-flag="${item.has_read}">
                             ${item.message_title}
                         </div>
                         <div class="messageTime">
                            ${item.datetime}
                         </div>
                     </div>
                       `
               } else {
                 str += `
                       <div class="item">
                         <div class="layui-form checkItem">
                             <input type="checkbox" lay-skin="primary" value="${item.message_id}" class="check_All_item"  lay-filter="check_All_item">
                         </div>
                         <div class="messageIcon"></div> 
                         <div class="messageTitle "  data-id="${item.message_id}" data-flag="${item.has_read}">
                         ${item.message_title}
                         </div>
                         <div class="messageTime">
                         ${item.datetime}
                         </div>
                     </div>
                       `
               }
 
             })
             $('.readContent').html(str)
             form.render('checkbox')
           }
         }
       })
     }
 
     // 获取已读分页数据
     function getPageReadMessage(page,num) {
       $.ajax({
         type: 'GET',
         url: "http://www.cube.vip/account/message/",
         dataType: "json",
         async: false,
         headers: {
           token: token
         },
         data: {
           has_read: 'read',
           number: num,
           pege: page
         },
         success: function (res) {
           if (res.msg === 'success') {
             var str = ''
             res.data.posts.forEach(item => {
               if (item.has_read === 'True') {
                 str += `
                       <div class="item">
                         <div class="layui-form checkItem">
                             <input type="checkbox" lay-skin="primary" value="${item.message_id}" class="check_All_item"  lay-filter="check_All_item">
                         </div>
                         <div class="messageTitle marginLeft"  data-id="${item.message_id}" data-flag="${item.has_read}">
                             ${item.message_title}
                         </div>
                         <div class="messageTime">
                            ${item.datetime}
                         </div>
                     </div>
                       `
               } else {
                 str += `
                       <div class="item">
                         <div class="layui-form checkItem">
                             <input type="checkbox" lay-skin="primary" value="${item.message_id}" class="check_All_item"  lay-filter="check_All_item">
                         </div>
                         <div class="messageIcon"></div> 
                         <div class="messageTitle "  data-id="${item.message_id}" data-flag="${item.has_read}">
                         ${item.message_title}
                         </div>
                         <div class="messageTime">
                         ${item.datetime}
                         </div>
                     </div>
                       `
               }
 
             })
             $('.readContent').html(str)
             form.render('checkbox')
           }
         }
       })
     }

      // 获取未读数据
      getUnReadMessage()

      function getUnReadMessage() {
        $.ajax({
          type: 'GET',
          url: "http://www.cube.vip/account/message/",
          dataType: "json",
          async: false,
          headers: {
            token: token
          },
          data: {
            has_read: 'unread',
            number: 7,
            pege: 1
          },
          success: function (res) {
            if (res.msg === 'success') {
              $('#unreadNum').html('('+res.data.count+')')
                // 全部分页
                laypage.render({
                  elem: 'unreadPage',
                  limit: 7,
                  count: res.data.count,
                  theme: '#FF914D',
                  jump: function (obj, first) {
                    // 取消勾选
                    $('#check-All').prop('checked', false)
                    $('.check_All_item').prop('checked', false)
                    form.render('checkbox')
                    checkId = []
                    //首次不执行
                    if (!first) {
                      getPageUnReadMessage(obj.curr,obj.limit)
                    }
                  }
                })
              var str = ''
              res.data.posts.forEach(item => {
                if (item.has_read === 'True') {
                  str += `
                        <div class="item">
                          <div class="layui-form checkItem">
                              <input type="checkbox" lay-skin="primary" value="${item.message_id}" class="check_All_item"  lay-filter="check_All_item">
                          </div>
                          <div class="messageTitle marginLeft"  data-id="${item.message_id}" data-flag="${item.has_read}">
                              ${item.message_title}
                          </div>
                          <div class="messageTime">
                             ${item.datetime}
                          </div>
                      </div>
                        `
                } else {
                  str += `
                        <div class="item">
                          <div class="layui-form checkItem">
                              <input type="checkbox" lay-skin="primary" value="${item.message_id}" class="check_All_item"  lay-filter="check_All_item">
                          </div>
                          <div class="messageIcon"></div> 
                          <div class="messageTitle "  data-id="${item.message_id}" data-flag="${item.has_read}">
                          ${item.message_title}
                          </div>
                          <div class="messageTime">
                          ${item.datetime}
                          </div>
                      </div>
                        `
                }
  
              })
              $('.unreadContent').html(str)
              form.render('checkbox')
            }
          }
        })
      }
  
      // 获取未读分页数据
      function getPageUnReadMessage(page,num) {
        $.ajax({
          type: 'GET',
          url: "http://www.cube.vip/account/message/",
          dataType: "json",
          async: false,
          headers: {
            token: token
          },
          data: {
            has_read: 'unread',
            number: num,
            pege: page
          },
          success: function (res) {
            if (res.msg === 'success') {
              var str = ''
              res.data.posts.forEach(item => {
                if (item.has_read === 'True') {
                  str += `
                        <div class="item">
                          <div class="layui-form checkItem">
                              <input type="checkbox" lay-skin="primary" value="${item.message_id}" class="check_All_item"  lay-filter="check_All_item">
                          </div>
                          <div class="messageTitle marginLeft"  data-id="${item.message_id}" data-flag="${item.has_read}">
                              ${item.message_title}
                          </div>
                          <div class="messageTime">
                             ${item.datetime}
                          </div>
                      </div>
                        `
                } else {
                  str += `
                        <div class="item">
                          <div class="layui-form checkItem">
                              <input type="checkbox" lay-skin="primary" value="${item.message_id}" class="check_All_item"  lay-filter="check_All_item">
                          </div>
                          <div class="messageIcon"></div> 
                          <div class="messageTitle "  data-id="${item.message_id}" data-flag="${item.has_read}">
                          ${item.message_title}
                          </div>
                          <div class="messageTime">
                          ${item.datetime}
                          </div>
                      </div>
                        `
                }
  
              })
              $('.unreadContent').html(str)
              form.render('checkbox')
            }
          }
        })
      }

      // 查看详情
      $('.layui-tab-item').on('click','.messageTitle',function(){
        window.location.href = 'http://www.cube.vip/html/message.html?id=' + $(this).attr('data-id') +
        '&key=' + token
         
      })

      // 删除
      $('#delete').on('click',function(){
          if(checkId.length<=0){
            layer.msg('请勾选数据!')
          } else {
            $.ajax({
              type:'POST',
              url: "http://www.cube.vip/account/message_detail/",
              dataType: "json",
              async: false,
              headers: {
                  token: token
              },
              data:{
                has_delete: JSON.stringify(checkId)
              },
              success:function(res){
                  if(res.msg==='success') {
                    layer.msg('删除成功!')
                    // 获取全部数据
                    getAllMessage()
                    // 获取已读数据
                    getReadMessage()
                    // 获取未读数据
                    getUnReadMessage()
                  } else {
                    layer.msg('删除失败,请重试!')
                  }
              }
          })
          }
      })

  })
})