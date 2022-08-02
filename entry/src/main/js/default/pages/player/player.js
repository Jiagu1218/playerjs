import router from '@system.router';
import media from '@ohos.multimedia.media'

export default {
    props:['music'],
    data(){
        return {
            //定时任务id
            intervalId:-1,
            item:this.music,
            audio:media.createAudioPlayer(),
            status: {
                playing:false,
                loop:false,
                percent:0,
                max:100
            }
        }
    },
    onInit() {
        console.log('player onInit')
        this.$watch('music',(newValue)=>{this.item = newValue})
        this.$watch('item',(newMusic)=>{
            let state = this.audio.state
            if(state != 'idle'){
                //空闲
                this.audio.stop()
            }
        })

        this.title = "Hello World";


    },
    onAttached(){
        console.log('player onAttached')
        this.audio.on("dataLoad",()=>{
            if(this.audio.state == 'idle'){
                this.audio.play()
            }
        })
        this.audio.on("play",()=>{
            console.debug("播放")
            this.status.playing = true
            this.status.max = this.audio.duration%1000
            this.intervalId=setInterval(()=>{
//                this.status.percent = this.audio.currentTime%1000
                this.status.percent = ((this.audio.currentTime) / (this.audio.duration)) * 100
            },1000)
        })
        this.audio.on("finish",()=>{
            clearInterval(this.intervalId)
            this.status.playing = false
            this.audio.reset()
        })
        this.audio.on("pause",()=>{
            clearInterval(this.intervalId)
            this.status.playing = false
        })
        this.audio.on('stop',()=>{
            clearInterval(this.intervalId)
            this.status.playing = false
            this.audio.reset()
        })
        this.audio.on('reset',()=>{
            clearInterval(this.intervalId)
            this.status.playing = false
//            this.audio.release();
        })
        this.audio.on("error",(error)=>{
            console.info(`audio error called, errName is ${error.name}`);      //打印错误类型名称
            console.info(`audio error called, errCode is ${error.code}`);      //打印错误码
            console.info(`audio error called, errMessage is ${error.message}`);//打印错误类型详细描述
        })
    },
    onShow(){

    },
    sliderChange(e){

        if(e.mode == 'end'){  /*当前动作 start 开始  move 移动中   end 结束*/
            console.log("value",e.value)  /*当前slider的进度值*/

        }
    },
    progressSwift(e){
        console.log("direction",e.direction)
        console.log("distance",e.distance)
    },
    startPlay(url){
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
        //        this.status.playing = true
    },
    stopPlay(){
        this.audio.stop()
        //        this.status.playing = false
    },
    pausedPlay(){
        this.audio.pause()
        //        this.status.playing = false
    },
    goBack(){
        router.back()
    },
    audioPlayer(url){

    },
    setLoop(){
        this.audio.loop = !this.status.loop
        this.status.loop = this.audio.loop
    },
    onDestroy(){
        clearInterval(this.intervalId)
        console.log('销毁')
        this.stopPlay()
        this.audio.release()
    }
}
