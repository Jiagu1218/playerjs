import media from '@ohos.multimedia.media'
import {downloadFile} from '../../common/js/download'
import prompt from '@system.prompt'

export default {
    props:['music'],
    data(){
        return {
            //定时任务id
            intervalId:-1,
            musicList:new Array(),
            item:this.music,
            audio:null,
            status: {
                playing:false,
                loop:false,
                percent:0,
                sliderValue:0,
                max:100,
                listIndex:-1
            }
        }
    },
    onHide(){

    },
    onInit() {
        console.log('player onInit')
        this.$watch('music',(newMusic)=>{
            if(!this.musicList.some((music)=> music.articleId == newMusic.articleId)){
                this.musicList.push(newMusic);
            }
            if(!this.status.playing){
                this.$set('item',newMusic)
            }
        })
        this.$watch('item',(newItem)=>{
            //查找在列表中的位置
            this.$set('status.listIndex', this.musicList.findIndex((music)=>music.articleId == newItem.articleId))
            if(this.audio != null){
                this.audio.reset()
            }
            if(this.status.playing){
                this.startPlay(newItem.musicUrl)
            }
        })
    },
    computed:{
    },
    onAttached(){
    },
    initAudio(){
        let audio = media.createAudioPlayer()
        audio.on("dataLoad",()=>{
            if(audio.state == 'idle'){
                audio.play()
            }
        })
        audio.on("play",()=>{
            console.debug("播放")
            this.$set('status.playing', true)
            this.$set('status.max', audio.duration)

            this.intervalId=setInterval(()=>{
                this.$set('status.sliderValue',audio.currentTime)
            },1000)
        })
        audio.on("finish",()=>{
            audio.reset()
        })
        audio.on("pause",()=>{
            clearInterval(this.intervalId)
            this.$set('status.playing',false)
        })
        audio.on('stop',()=>{
            audio.reset()
        })
//        audio.on('timeUpdate',(seekDoneTime)=>{
//            if (typeof (seekDoneTime) == 'undefined') {
//                console.info('audio seek fail');
//                return;
//            }
//            console.log('audio seek success. seekDoneTime: ' + seekDoneTime);
//        })
        audio.on('reset',()=>{
            clearInterval(this.intervalId)
            this.$set('status.playing',false)

//            audio.release()
//            audio = null
//            this.$set('audio',null)
        })
        audio.on("error",(error)=>{
            console.info(`audio error called, errName is ${error.name}`);      //打印错误类型名称
            console.info(`audio error called, errCode is ${error.code}`);      //打印错误码
            console.info(`audio error called, errMessage is ${error.message}`);//打印错误类型详细描述
        })
        this.$set('audio', audio)
    },
    sliderChange(e){
        if(e.mode == 'end'){  /*当前动作 start 开始  move 移动中   end 结束*/
            console.log("value",e.value)  /*当前slider的进度值*/
            this.audio.seek(Math.floor(e.value))
        }
    },
    progressSwift(e){
        console.log("direction",e.direction)
        console.log("distance",e.distance)
    },
    async startPlay(url){
        if(this.audio == null){
            this.initAudio()
        }
        let state = this.audio.state

        if(state == 'paused'){
            //空闲
            this.audio.play()
            return
        }else if(state == 'idle'){
            this.audio.src = url
            this.audio.play()
            return
        }else if(state == 'stopped'){
            this.audio.reset()
            return
        }else if(state == 'playing'){
            this.audio.src = url
            this.audio.play()
            return
        }
    },
    stopPlay(){
        this.audio.stop()
    },
    pausedPlay(){
        this.audio.pause()
    },
    setLoop(){
        if(this.audio==null){
            this.initAudio()
        }
        this.audio.loop = !this.status.loop
        this.$set('status.loop', this.audio.loop)
    },
    onDestroy(){
        clearInterval(this.intervalId)
        console.log('销毁')
        this.stopPlay()
        this.audio.release()
    },
    download(url){
        downloadFile(url)
    },
    pre(){
        if(this.status.listIndex<1){
            prompt.showToast({message: '已经是第一首了'})
        }else{
            let music = this.musicList[this.status.listIndex-1]
            this.$set('item',music)
        }
    },
    next(){
        if(this.status.listIndex>=this.musicList.length-1){
            prompt.showToast({message: '已经是最后一首了'})
        }else{
            let music = this.musicList[this.status.listIndex+1]
            this.$set('item', music)
        }
    }
}
