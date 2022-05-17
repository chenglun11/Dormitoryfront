layui.define(['ztree', 'jquery','axios'], function (exports) {
    "use strict";
    let MOD_NAME = 'selectOrg',
        $ = layui.jquery,
        axios = layui.axios,
        ztree = layui.ztree;
    let selectOrg = function () {
        this.v = '1.1.0';
    };

    /**
     * 初始化ztree
     */
    selectOrg.prototype.render = function (opt) {
        let elem = $(opt.elem);
        let tableDone = opt.done || function(){};
        opt.height = opt.height || 315;
        //最小宽度
        opt.width = opt.width || 300;
        elem.off('click').on('click', function(e) {
            e.stopPropagation();
            if($('div.treeSelect').length >= 1){
                return false;
            }
            let t = elem.offset().top + elem.outerHeight()+"px";
            let l = elem.offset().left +"px";
            let treeBox = '<div class="treeSelect layui-anim layui-anim-upbit" style="left:'+l+';top:'+t+';border: 1px solid #d2d2d2;background-color: #fff;box-shadow: 0 2px 4px rgba(0,0,0,.12);padding:10px 10px 0 10px;position: absolute;z-index:66666666;margin: 5px 0;border-radius: 2px;min-width:'+opt.width+'px;max-height: 300px;overflow: auto;">';
            if(opt.checked){
                treeBox += '<div><button type="button" style="float: right" class="layui-btn layui-btn-normal layui-btn-sm tree-sure">确定</button></div>';
            }
            treeBox += '<div class="ztree" id="ztree_xx">';
            treeBox += '</div>';
            treeBox = $(treeBox);
            $('body').append(treeBox);

            /*let zNodes =[
                { id:1, pId:0, name:"信息工程学院", open:true},
                { id:11, pId:1, name:"计科系"},
                { id:50, pId:11, name:"软件工程"},
                { id:70, pId:50, name:"01班"},
                { id:12, pId:1, name:"网络工程系"},
                { id:13, pId:1, name:"电子系"},
                { id:2, pId:0, name:"工商管理学院", open:true},
                { id:21, pId:2, name:"电商系"},
                { id:22, pId:2, name:"工管系"},
                { id:23, pId:2, name:"外贸系"},
            ];*/

            let setting = {
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback:{
                    onClick:function (event, treeId, treeNode) {
                        if(!opt.checked){
                            $('.treeSelect').remove();
                            opt.done([treeNode]);
                        }
                    }
                },
                check:{
                    enable: opt.checked
                }
            };


            axios.get('org/tree').then(function (response) {
                ztree.init($("#ztree_xx"), setting,response.data);

                let treeObj = ztree.getZTreeObj("ztree_xx");
                if(opt.checked){
                    //初始化checked
                    opt.selected.forEach(v=>{
                        let checkNodes = treeObj.getNodesByParam("id",v,null);
                        treeObj.checkNode(checkNodes[0],true);
                    })
                    //确定事件
                    $('.tree-sure').click(function () {
                        let arr = treeObj.getCheckedNodes(true);
                        opt.done(arr);
                        opt.selected = arr.map(item=>item.id);
                        treeBox.remove();
                    });
                }

            }).catch(function (error) {
                console.log(error);
            });

            /*ztree.init($("#ztree"), setting, zNodes);*/



            $(document).mouseup(function(e){
                let userSet_con = $(''+opt.elem+',.treeSelect');
                if(!userSet_con.is(e.target) && userSet_con.has(e.target).length === 0){
                    treeBox.remove();
                }
            });

        }); //elem end
    }
    exports(MOD_NAME, new selectOrg());
})