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
    onHide(){

    },
    onInit() {
        console.log('player onInit')
        this.$watch('music',(newMusic)=>{
            this.$set('item',newMusic )
        })
        this.$watch('item',(newItem)=>{
            let state = this.audio.state
            if(state != 'idle'){
                //空闲
                this.audio.stop()
            }
        })
    },
    computed:{

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
            this.$set('status.playing', true)
            this.$set('status.max', this.audio.duration%1000)
            this.intervalId=setInterval(()=>{
                let percent = ((this.audio.currentTime) / (this.audio.duration)) * 100
                this.$set('status.percent',percent)
//                this.status.percent = this.audio.currentTime%1000
            },1000)
        })
        this.audio.on("finish",()=>{
            clearInterval(this.intervalId)
            this.$set('status.playing',false)
            this.audio.reset()
        })
        this.audio.on("pause",()=>{
            clearInterval(this.intervalId)
            this.$set('status.playing',false)
        })
        this.audio.on('stop',()=>{
            clearInterval(this.intervalId)
            this.$set('status.playing',false)
            this.audio.reset()
        })
        this.audio.on('reset',()=>{
            clearInterval(this.intervalId)
            this.$set('status.playing',false)
        })
        this.audio.on("error",(error)=>{
            console.info(`audio error called, errName is ${error.name}`);      //打印错误类型名称
            console.info(`audio error called, errCode is ${error.code}`);      //打印错误码
            console.info(`audio error called, errMessage is ${error.message}`);//打印错误类型详细描述
        })
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

    },
    stopPlay(){
        this.audio.stop()
    },
    pausedPlay(){
        this.audio.pause()
    },
    setLoop(){
        this.audio.loop = !this.status.loop
        this.$set('status.loop', this.audio.loop)
    },
    onDestroy(){
        clearInterval(this.intervalId)
        console.log('销毁')
        this.stopPlay()
        this.audio.release()
    }
}
