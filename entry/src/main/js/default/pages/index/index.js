

export default {
    data: {
        menuOptions:[{content: '日期'},{content: '时长'},{content: '观看数'},{content: '热度'},{content: '随机'}],
        pageIndex:1,
        loading:false,
        tabsIndex:0,
        listData:[
            {"articleId":53025,"duration":"01:26:25","heart":"34","id":53025,"imgUrl":"https://www.hentaiasmr.moe/wp-content/uploads/2022/07/rj403255_img_main.jpg","musicUrl":"","pageUrl":"https://www.hentaiasmr.moe/rj403255/","title":"[RJ403255] 【甘々孕ませ性活】貴方を想い性処理までしてくれる敏感体質の歳上メイド!～セックス以外ならどんな事でもして差し上げます♪～","views":"4K"}
        ],
        filter:'',
        searchText: '',
        currentMusic:
        {
//            "articleId":53025,
//            "duration":"01:26:25",
//            "heart":"34","id":53025,
//            "imgUrl":"https://www.hentaiasmr.moe/wp-content/uploads/2022/07/rj403255_img_main.jpg",
//            "musicUrl":"","pageUrl":"https://www.hentaiasmr.moe/rj403255/",
//            "title":"[RJ403255] 【甘々孕ませ性活】貴方を想い性処理までしてくれる敏感体質の歳上メイド!～セックス以外ならどんな事でもして差し上げます♪～",
//            "views":"4K"
        }
    },
    onInit() {

    },
    resetList(){
        if(this.pageIndex != 1){
            this.$set('pageIndex',1)
        }else{
            this.getList(1)
        }
    },
    onReady(){
        this.getList(this.pageIndex)
        this.$watch('pageIndex', (newindex) =>{
            this.getList(newindex)
        })
    },
    getList(index) {
        this.$set('loading',true)
        //https://www.hentaiasmr.moe/
        FeatureAbility.callAbility({
            bundleName:'com.example.playerjs',
            abilityName:'com.example.playerjs.AsmrServiceInternalAbility',
            messageCode:1,
            abilityType:1,
            data: {
                pageIndex:index,
                filter:this.filter,
                search:this.searchText
            },
            syncOption:0
        }).then((result)=>{
            let rj = JSON.parse(result)
            if(this.pageIndex == 1){
                this.$set('listData',rj)
                this.top()
            }else{
                this.listData.push(...rj)
            }
            this.$set('loading',false)
        })

        //https://japaneseasmr.com/
        /*let result = await FeatureAbility.callAbility({
            bundleName:'com.example.playerjs',
            abilityName:'com.example.playerjs.JsAsmrServiceInternalAbility',
            messageCode:1,
            abilityType:1,
            data: {
                pageIndex:index,
                filter:'',
                search:''
            },
            syncOption:0
        })*/


    },
    async itemLongPress(item){
        console.log(item.title)
        //https://www.hentaiasmr.moe/
        /*FeatureAbility.callAbility({
            bundleName:'com.example.playerjs',
            abilityName:'com.example.playerjs.AsmrServiceInternalAbility',
            messageCode:2,
            abilityType:1,
            data: {
                pageUrl:item.pageUrl
            },
            syncOption:0
        }).then((result)=>{
            item.musicUrl = result
            this.currentMusic = item
            this.tabsIndex = 1
        })*/

        /***将从hentaiasmr获取到的列表通过名称在japaneseasmr中搜索获得心的页面链接重新解析**/
        let result = await FeatureAbility.callAbility({
            bundleName:'com.example.playerjs',
            abilityName:'com.example.playerjs.JsAsmrServiceInternalAbility',
            messageCode:1,
            abilityType:1,
            data: {
                pageIndex:1,
                filter:'',
                search:item.title
            },
            syncOption:0
        })

        let list = JSON.parse(result)
        if(list.length > 0){
            //https://japaneseasmr.com/
            FeatureAbility.callAbility({
                bundleName:'com.example.playerjs',
                abilityName:'com.example.playerjs.JsAsmrServiceInternalAbility',
                messageCode:2,
                abilityType:1,
                data: {
                    pageUrl:list[0].pageUrl
                },
                syncOption:0
            }).then((result)=>{
                item.musicUrl = result
                this.$set('currentMusic',item)
                this.$set('tabsIndex',1)
            })
        }

    },
    tabsChange(e){
        this.$set('tabsIndex',e.index)
    },
    scrollBottom(){

    },
    requestItem(){
        if(this.loading) return
        this.$set('pageIndex',this.pageIndex + 1)
    },
    top(){
        this.$element('asmrlist').scrollTop({smooth: true})
    },
    orderSelect(e){

        let value = parseInt(e.newValue,0)
        let filter
        switch (value) {
            case 0: filter = 'latest'
                break;
            case 1: filter = 'longest'
                break;
            case 2: filter = 'most-viewed'
                break;
            case 3: filter = 'popular'
                break;
            case 4: filter = 'random'
                break;
            default: filter = ''
                break;
        }
        this.$set('filter', filter)
        this.resetList()
    },
    searchSubmit(e){
        console.log(JSON.stringify(e))
        this.$set('searchText', e.text.trim())
        this.resetList()
    }
}
