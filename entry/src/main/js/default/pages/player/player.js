import media from '@ohos.multimedia.media'
import {downloadFile} from '../../common/js/download'

export default {
    props:['music'],
    data(){
        return {
            //定时任务id
            intervalId:-1,
            item:this.music,
            audio:null,
            status: {
                playing:false,
                loop:false,
                percent:0,
                sliderValue:0,
                max:100
            }
        }
    },
    onHide(){

    },
    onInit() {
        console.log('player onInit')
        this.$watch('music',(newMusic)=>{
            this.$set('item',newMusic )
        })
        this.$watch('item',(newItem)=>{
            if (this.audio != null){
                this.$set('status.sliderValue',0)
                let state = this.audio.state
                if(state != 'idle'){
                    //空闲
                    this.audio.stop()
                }
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
//                let percent = ((audio.currentTime) / (audio.duration)) * 100
//                this.$set('status.percent',percent)
                this.$set('status.sliderValue',audio.currentTime)
                //this.status.percent = this.audio.currentTime%1000
            },1000)
        })
        audio.on("finish",()=>{
            clearInterval(this.intervalId)
            this.$set('status.playing',false)
            audio.reset()
        })
        audio.on("pause",()=>{
            clearInterval(this.intervalId)
            this.$set('status.playing',false)
        })
        audio.on('stop',()=>{
            clearInterval(this.intervalId)
            this.$set('status.playing',false)
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
            audio.release()
            audio = null
            this.$set('audio',null)
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
    startPlay(url){
        if(this.audio == null){
            this.initAudio()
        }
        let state = this.audio.state
        if(state=='playing'){
            //播放中
            return
        }else if(state == 'idle'){
            //空闲
            this.audio.src = url
//            this.audio.src = 'https://cdn-132.anonfiles.com/X4d7E31ey6/d375d590-1659380371/RJ405681.mp3'
        }
        this.audio.play()

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
    }
}
