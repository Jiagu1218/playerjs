import mediaLibrary from '@ohos.multimedia.mediaLibrary'
import request from '@ohos.request'
import prompt from '@system.prompt'
import file from '@system.file'

function downloadFile(url){
    if(url.length > 0){
        request.download({
            url: url,
            enableMetered:true
        }).then((task)=>{
            task.on('progress',(receiveSize,totalSize)=>{
                if(receiveSize>=totalSize){
                    //下载完成  API6默认在'internal://cache/'路径下
                    let filename = url.substr(url.lastIndexOf('/')+1)
                    saveFile(filename)

                }
            })
        }).catch((error)=>{
            prompt.showToast({message: '文件下载失败'+error.message, duration:3000});
        })
    }else{
        prompt.showToast({message: '链接错误', duration:3000});
    }
}

function saveFile(filename){
    //https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-medialibrary-0000001281001130#ZH-CN_TOPIC_0000001281001130__storemediaassetdeprecated
    //获取媒体库的实例，用于访问和修改用户等个人媒体数据信息（如音频、视频、图片、文档等）
    let media = mediaLibrary.getMediaLibrary()
    let option = mediaAssetOption(filename)
    media.storeMediaAsset(option,(err,res) => {
        file.delete({
            uri: option.src,
            fail: function(data, code) {
                prompt.showToast({message: '缓存文件删除失败', duration:3000});
                console.error('call fail callback fail, code: ' + code + ', data: ' + data);
            },
        })
        if (err) {
            prompt.showToast({message: '文件保存失败' + err.message, duration:3000});
            return;
        }
        prompt.showToast({message: '文件已保存到'+res, duration:3000});
    })
}

function mediaAssetOption(filename){
    let mimeType = 'file*';
    let extend = filename.substr(filename.lastIndexOf('.') + 1)
    switch (extend){
        case 'mp3': mimeType = 'audio/mpeg'
            break;
        case 'ogg':
        case 'oggv': mimeType = 'video/ogg'
            break;
        case 'mpeg':
        case 'mpg':
        case 'mpe': mimeType = 'video/mpeg'
            break;
        case 'wav': mimeType = 'video/x-wav'
            break;
        case 'm4a': mimeType = 'video/x-m4a'
            break;
        case 'mp4': mimeType = 'video/mp4'
            break;
        case 'wmv': mimeType = 'video/x-ms-wmv'
            break;
        case 'webm': mimeType = 'video/x-ms-webm'
            break;
        case 'avi': mimeType = 'video/x-msvideo'
            break;
        case 'flv': mimeType = 'video/x-flv'
            break;
        case 'jpg':
        case 'jpeg': mimeType = 'image/jpeg'
            break;
        case 'png': mimeType = 'image/png'
            break;
        case 'gif': mimeType = 'image/gif'
            break;
        case 'svg': mimeType = 'image/svg+xml'
            break;
        case 'bmp': mimeType = 'image/bmp'
            break;
        case 'webp': mimeType = 'image/webp'
            break;
        default: mimeType = 'file*';
    }
    return {
        src: 'internal://cache/' + filename,
        mimeType: mimeType
    }
}

export {downloadFile}