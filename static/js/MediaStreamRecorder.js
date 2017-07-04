// Last time updated: 2017-05-11 12:16:53 PM UTC

function MediaStreamRecorder(mediaStream){if(!mediaStream)throw"MediaStream is mandatory.";this.start=function(timeSlice){var Recorder;"undefined"!=typeof MediaRecorder?Recorder=MediaRecorderWrapper:(IsChrome||IsOpera||IsEdge)&&(this.mimeType.indexOf("video")!==-1?Recorder=WhammyRecorder:this.mimeType.indexOf("audio")!==-1&&(Recorder=StereoAudioRecorder)),"image/gif"===this.mimeType&&(Recorder=GifRecorder),"audio/wav"!==this.mimeType&&"audio/pcm"!==this.mimeType||(Recorder=StereoAudioRecorder),this.recorderType&&(Recorder=this.recorderType),mediaRecorder=new Recorder(mediaStream),mediaRecorder.blobs=[];var self=this;mediaRecorder.ondataavailable=function(data){mediaRecorder.blobs.push(data),self.ondataavailable(data)},mediaRecorder.onstop=this.onstop,mediaRecorder.onStartedDrawingNonBlankFrames=this.onStartedDrawingNonBlankFrames,mediaRecorder=mergeProps(mediaRecorder,this),mediaRecorder.start(timeSlice)},this.onStartedDrawingNonBlankFrames=function(){},this.clearOldRecordedFrames=function(){mediaRecorder&&mediaRecorder.clearOldRecordedFrames()},this.stop=function(){mediaRecorder&&mediaRecorder.stop()},this.ondataavailable=function(blob){console.log("ondataavailable..",blob)},this.onstop=function(error){console.warn("stopped..",error)},this.save=function(file,fileName){if(!file){if(!mediaRecorder)return;return void ConcatenateBlobs(mediaRecorder.blobs,mediaRecorder.blobs[0].type,function(concatenatedBlob){invokeSaveAsDialog(concatenatedBlob)})}invokeSaveAsDialog(file,fileName)},this.pause=function(){mediaRecorder&&(mediaRecorder.pause(),console.log("Paused recording.",this.mimeType||mediaRecorder.mimeType))},this.resume=function(){mediaRecorder&&(mediaRecorder.resume(),console.log("Resumed recording.",this.mimeType||mediaRecorder.mimeType))},this.recorderType=null,this.mimeType="video/webm",this.disableLogs=!1;var mediaRecorder}function MultiStreamRecorder(arrayOfMediaStreams){function getMixedAudioStream(){self.audioContext=new AudioContext;var audioSources=[],audioTracksLength=0;if(arrayOfMediaStreams.forEach(function(stream){stream.getAudioTracks().length&&(audioTracksLength++,audioSources.push(self.audioContext.createMediaStreamSource(stream)))}),audioTracksLength)return self.audioDestination=self.audioContext.createMediaStreamDestination(),audioSources.forEach(function(audioSource){audioSource.connect(self.audioDestination)}),self.audioDestination.stream}function getMixedVideoStream(){arrayOfMediaStreams.forEach(function(stream){if(stream.getVideoTracks().length){var video=getVideo(stream);video.width=self.video.width,video.height=self.video.height,videos.push(video)}});var capturedStream;"captureStream"in canvas?capturedStream=canvas.captureStream():"mozCaptureStream"in canvas?capturedStream=canvas.mozCaptureStream():self.disableLogs||console.error("Upgrade to latest Chrome or otherwise enable this flag: chrome://flags/#enable-experimental-web-platform-features");var videoStream=new MediaStream;return capturedStream.getVideoTracks().forEach(function(track){videoStream.addTrack(track)}),videoStream}function getVideo(stream){var video=document.createElement("video");return video.src=URL.createObjectURL(stream),video.play(),video}function drawVideosToCanvas(){if(!isStoppedRecording){var videosLength=videos.length;canvas.width=videosLength>1?2*videos[0].width:videos[0].width,canvas.height=videosLength>2?2*videos[0].height:videos[0].height,videos.forEach(function(video,idx){if(1===videosLength)return void context.drawImage(video,0,0,video.width,video.height);if(2===videosLength){var x=0,y=0;return 1===idx&&(x=video.width),void context.drawImage(video,x,y,video.width,video.height)}if(3===videosLength){var x=0,y=0;return 1===idx&&(x=video.width),2===idx&&(y=video.height),void context.drawImage(video,x,y,video.width,video.height)}if(4===videosLength){var x=0,y=0;return 1===idx&&(x=video.width),2===idx&&(y=video.height),3===idx&&(x=video.width,y=video.height),void context.drawImage(video,x,y,video.width,video.height)}}),setTimeout(drawVideosToCanvas,self.frameInterval)}}arrayOfMediaStreams instanceof MediaStream&&(arrayOfMediaStreams=[arrayOfMediaStreams]);var self=this;this.mimeType||(this.mimeType="video/webm"),this.frameInterval||(this.frameInterval=10),this.video||(this.video={}),this.video.width||(this.video.width=360),this.video.height||(this.video.height=240),this.start=function(timeSlice){isStoppedRecording=!1;var mixedVideoStream=getMixedVideoStream(),mixedAudioStream=getMixedAudioStream();mixedAudioStream&&mixedAudioStream.getAudioTracks().forEach(function(track){mixedVideoStream.addTrack(track)}),self.previewStream&&"function"==typeof self.previewStream&&self.previewStream(mixedVideoStream),mediaRecorder=new MediaStreamRecorder(mixedVideoStream);for(var prop in self)"function"!=typeof self[prop]&&(mediaRecorder[prop]=self[prop]);mediaRecorder.ondataavailable=function(blob){self.ondataavailable(blob)},mediaRecorder.onstop=self.onstop,drawVideosToCanvas(),mediaRecorder.start(timeSlice)},this.stop=function(callback){isStoppedRecording=!0,mediaRecorder&&mediaRecorder.stop(function(blob){callback(blob)})};var mediaRecorder,videos=[],isStoppedRecording=!1,canvas=document.createElement("canvas"),context=canvas.getContext("2d");canvas.style="opacity:0;position:absolute;z-index:-1;top: -100000000;left:-1000000000;",(document.body||document.documentElement).appendChild(canvas),this.pause=function(){mediaRecorder&&mediaRecorder.pause()},this.resume=function(){mediaRecorder&&mediaRecorder.resume()},this.clearRecordedData=function(){videos=[],context.clearRect(0,0,canvas.width,canvas.height),isStoppedRecording=!1,mediaRecorder=null,mediaRecorder&&mediaRecorder.clearRecordedData()},this.addStream=function(stream){if(stream instanceof Array&&stream.length)return void stream.forEach(this.addStream);if(arrayOfMediaStreams.push(stream),mediaRecorder){if(stream.getVideoTracks().length){var video=getVideo(stream);video.width=self.video.width,video.height=self.video.height,videos.push(video)}if(stream.getAudioTracks().length&&self.audioContext){var audioSource=self.audioContext.createMediaStreamSource(stream);audioSource.connect(self.audioDestination)}}},this.ondataavailable=function(blob){self.disableLogs||console.log("ondataavailable",blob)},this.onstop=function(){}}function mergeProps(mergein,mergeto){for(var t in mergeto)"function"!=typeof mergeto[t]&&(mergein[t]=mergeto[t]);return mergein}function dropFirstFrame(arr){return arr.shift(),arr}function invokeSaveAsDialog(file,fileName){if(!file)throw"Blob object is required.";if(!file.type)try{file.type="video/webm"}catch(e){}var fileExtension=(file.type||"video/webm").split("/")[1];if(fileName&&fileName.indexOf(".")!==-1){var splitted=fileName.split(".");fileName=splitted[0],fileExtension=splitted[1]}var fileFullName=(fileName||Math.round(9999999999*Math.random())+888888888)+"."+fileExtension;if("undefined"!=typeof navigator.msSaveOrOpenBlob)return navigator.msSaveOrOpenBlob(file,fileFullName);if("undefined"!=typeof navigator.msSaveBlob)return navigator.msSaveBlob(file,fileFullName);var hyperlink=document.createElement("a");hyperlink.href=URL.createObjectURL(file),hyperlink.target="_blank",hyperlink.download=fileFullName,navigator.mozGetUserMedia&&(hyperlink.onclick=function(){(document.body||document.documentElement).removeChild(hyperlink)},(document.body||document.documentElement).appendChild(hyperlink));var evt=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!0});hyperlink.dispatchEvent(evt),navigator.mozGetUserMedia||URL.revokeObjectURL(hyperlink.href)}function bytesToSize(bytes){var k=1e3,sizes=["Bytes","KB","MB","GB","TB"];if(0===bytes)return"0 Bytes";var i=parseInt(Math.floor(Math.log(bytes)/Math.log(k)),10);return(bytes/Math.pow(k,i)).toPrecision(3)+" "+sizes[i]}function isMediaRecorderCompatible(){var isOpera=!!window.opera||navigator.userAgent.indexOf(" OPR/")>=0,isChrome=!!window.chrome&&!isOpera,isFirefox="undefined"!=typeof window.InstallTrigger;if(isFirefox)return!0;if(!isChrome)return!1;var verOffset,ix,nAgt=(navigator.appVersion,navigator.userAgent),fullVersion=""+parseFloat(navigator.appVersion),majorVersion=parseInt(navigator.appVersion,10);return isChrome&&(verOffset=nAgt.indexOf("Chrome"),fullVersion=nAgt.substring(verOffset+7)),(ix=fullVersion.indexOf(";"))!==-1&&(fullVersion=fullVersion.substring(0,ix)),(ix=fullVersion.indexOf(" "))!==-1&&(fullVersion=fullVersion.substring(0,ix)),majorVersion=parseInt(""+fullVersion,10),isNaN(majorVersion)&&(fullVersion=""+parseFloat(navigator.appVersion),majorVersion=parseInt(navigator.appVersion,10)),majorVersion>=49}function MediaRecorderWrapper(mediaStream){function isMediaStreamActive(){if("active"in mediaStream){if(!mediaStream.active)return!1}else if("ended"in mediaStream&&mediaStream.ended)return!1;return!0}var self=this;this.start=function(timeSlice,__disableLogs){if(self.mimeType||(self.mimeType="video/webm"),self.mimeType.indexOf("audio")!==-1&&mediaStream.getVideoTracks().length&&mediaStream.getAudioTracks().length){var stream;navigator.mozGetUserMedia?(stream=new MediaStream,stream.addTrack(mediaStream.getAudioTracks()[0])):stream=new MediaStream(mediaStream.getAudioTracks()),mediaStream=stream}self.mimeType.indexOf("audio")!==-1&&(self.mimeType=IsChrome?"audio/webm":"audio/ogg"),self.dontFireOnDataAvailableEvent=!1;var recorderHints={mimeType:self.mimeType};self.disableLogs||__disableLogs||console.log("Passing following params over MediaRecorder API.",recorderHints),mediaRecorder&&(mediaRecorder=null),IsChrome&&!isMediaRecorderCompatible()&&(recorderHints="video/vp8");try{mediaRecorder=new MediaRecorder(mediaStream,recorderHints)}catch(e){mediaRecorder=new MediaRecorder(mediaStream)}"canRecordMimeType"in mediaRecorder&&mediaRecorder.canRecordMimeType(self.mimeType)===!1&&(self.disableLogs||console.warn("MediaRecorder API seems unable to record mimeType:",self.mimeType)),mediaRecorder.ignoreMutedMedia=self.ignoreMutedMedia||!1;var firedOnDataAvailableOnce=!1;mediaRecorder.ondataavailable=function(e){if(!self.dontFireOnDataAvailableEvent&&e.data&&e.data.size&&!(e.data.size<26800)&&!firedOnDataAvailableOnce){firedOnDataAvailableOnce=!0;var blob=self.getNativeBlob?e.data:new Blob([e.data],{type:self.mimeType||"video/webm"});self.ondataavailable(blob),self.dontFireOnDataAvailableEvent=!0,mediaRecorder&&"recording"===mediaRecorder.state&&mediaRecorder.stop(),mediaRecorder=null,self.start(timeSlice,"__disableLogs")}},mediaRecorder.onerror=function(error){self.disableLogs||("InvalidState"===error.name?console.error("The MediaRecorder is not in a state in which the proposed operation is allowed to be executed."):"OutOfMemory"===error.name?console.error("The UA has exhaused the available memory. User agents SHOULD provide as much additional information as possible in the message attribute."):"IllegalStreamModification"===error.name?console.error("A modification to the stream has occurred that makes it impossible to continue recording. An example would be the addition of a Track while recording is occurring. User agents SHOULD provide as much additional information as possible in the message attribute."):"OtherRecordingError"===error.name?console.error("Used for an fatal error other than those listed above. User agents SHOULD provide as much additional information as possible in the message attribute."):"GenericError"===error.name?console.error("The UA cannot provide the codec or recording option that has been requested.",error):console.error("MediaRecorder Error",error)),mediaRecorder&&"inactive"!==mediaRecorder.state&&"stopped"!==mediaRecorder.state&&mediaRecorder.stop()};try{mediaRecorder.start(36e5)}catch(e){mediaRecorder=null}setTimeout(function(){mediaRecorder&&"recording"===mediaRecorder.state&&mediaRecorder.requestData()},timeSlice)},this.stop=function(callback){mediaRecorder&&"recording"===mediaRecorder.state&&(mediaRecorder.requestData(),setTimeout(function(){self.dontFireOnDataAvailableEvent=!0,mediaRecorder&&"recording"===mediaRecorder.state&&mediaRecorder.stop(),mediaRecorder=null,self.onstop()},2e3))},this.pause=function(){mediaRecorder&&"recording"===mediaRecorder.state&&mediaRecorder.pause()},this.ondataavailable=function(blob){console.log("recorded-blob",blob)},this.resume=function(){if(this.dontFireOnDataAvailableEvent){this.dontFireOnDataAvailableEvent=!1;var disableLogs=self.disableLogs;return self.disableLogs=!0,this.record(),void(self.disableLogs=disableLogs)}mediaRecorder&&"paused"===mediaRecorder.state&&mediaRecorder.resume()},this.clearRecordedData=function(){mediaRecorder&&(this.pause(),this.dontFireOnDataAvailableEvent=!0,this.stop())},this.onstop=function(){};var mediaRecorder;!function looper(){if(mediaRecorder)return isMediaStreamActive()===!1?void self.stop():void setTimeout(looper,1e3)}()}function StereoAudioRecorder(mediaStream){this.start=function(timeSlice){timeSlice=timeSlice||1e3,mediaRecorder=new StereoAudioRecorderHelper(mediaStream,this),mediaRecorder.record(),timeout=setInterval(function(){mediaRecorder.requestData()},timeSlice)},this.stop=function(){mediaRecorder&&(mediaRecorder.stop(),clearTimeout(timeout),this.onstop())},this.pause=function(){mediaRecorder&&mediaRecorder.pause()},this.resume=function(){mediaRecorder&&mediaRecorder.resume()},this.ondataavailable=function(){},this.onstop=function(){};var mediaRecorder,timeout}function StereoAudioRecorderHelper(mediaStream,root){function interleave(leftChannel,rightChannel){for(var length=leftChannel.length+rightChannel.length,result=new Float32Array(length),inputIndex=0,index=0;index<length;)result[index++]=leftChannel[inputIndex],result[index++]=rightChannel[inputIndex],inputIndex++;return result}function mergeBuffers(channelBuffer,recordingLength){for(var result=new Float32Array(recordingLength),offset=0,lng=channelBuffer.length,i=0;i<lng;i++){var buffer=channelBuffer[i];result.set(buffer,offset),offset+=buffer.length}return result}function writeUTFBytes(view,offset,string){for(var lng=string.length,i=0;i<lng;i++)view.setUint8(offset+i,string.charCodeAt(i))}function convertoFloat32ToInt16(buffer){for(var l=buffer.length,buf=new Int16Array(l);l--;)buf[l]=65535*buffer[l];return buf.buffer}var deviceSampleRate=44100;ObjectStore.AudioContextConstructor||(ObjectStore.AudioContextConstructor=new ObjectStore.AudioContext),deviceSampleRate=ObjectStore.AudioContextConstructor.sampleRate;var scriptprocessornode,volume,audioInput,context,leftchannel=[],rightchannel=[],recording=!1,recordingLength=0,sampleRate=root.sampleRate||deviceSampleRate,mimeType=root.mimeType||"audio/wav",isPCM=mimeType.indexOf("audio/pcm")>-1,numChannels=root.audioChannels||2;this.record=function(){recording=!0,leftchannel.length=rightchannel.length=0,recordingLength=0},this.requestData=function(){if(!isPaused){if(0===recordingLength)return void(requestDataInvoked=!1);requestDataInvoked=!0;var internalLeftChannel=leftchannel.slice(0),internalRightChannel=rightchannel.slice(0),internalRecordingLength=recordingLength;leftchannel.length=rightchannel.length=[],recordingLength=0,requestDataInvoked=!1;var leftBuffer=mergeBuffers(internalLeftChannel,internalRecordingLength),interleaved=leftBuffer;if(2===numChannels){var rightBuffer=mergeBuffers(internalRightChannel,internalRecordingLength);interleaved=interleave(leftBuffer,rightBuffer)}if(isPCM){var blob=new Blob([convertoFloat32ToInt16(interleaved)],{type:"audio/pcm"});return console.debug("audio recorded blob size:",bytesToSize(blob.size)),void root.ondataavailable(blob)}var buffer=new ArrayBuffer(44+2*interleaved.length),view=new DataView(buffer);writeUTFBytes(view,0,"RIFF"),view.setUint32(4,44+2*interleaved.length-8,!0),writeUTFBytes(view,8,"WAVE"),writeUTFBytes(view,12,"fmt "),view.setUint32(16,16,!0),view.setUint16(20,1,!0),view.setUint16(22,numChannels,!0),view.setUint32(24,sampleRate,!0),view.setUint32(28,sampleRate*numChannels*2,!0),view.setUint16(32,2*numChannels,!0),view.setUint16(34,16,!0),writeUTFBytes(view,36,"data"),view.setUint32(40,2*interleaved.length,!0);for(var lng=interleaved.length,index=44,volume=1,i=0;i<lng;i++)view.setInt16(index,interleaved[i]*(32767*volume),!0),index+=2;var blob=new Blob([view],{type:"audio/wav"});console.debug("audio recorded blob size:",bytesToSize(blob.size)),root.ondataavailable(blob)}},this.stop=function(){recording=!1,this.requestData(),audioInput.disconnect(),this.onstop()};var context=ObjectStore.AudioContextConstructor;ObjectStore.VolumeGainNode=context.createGain();var volume=ObjectStore.VolumeGainNode;ObjectStore.AudioInput=context.createMediaStreamSource(mediaStream);var audioInput=ObjectStore.AudioInput;audioInput.connect(volume);var bufferSize=root.bufferSize||2048;if(0===root.bufferSize&&(bufferSize=0),context.createJavaScriptNode)scriptprocessornode=context.createJavaScriptNode(bufferSize,numChannels,numChannels);else{if(!context.createScriptProcessor)throw"WebAudio API has no support on this browser.";scriptprocessornode=context.createScriptProcessor(bufferSize,numChannels,numChannels)}bufferSize=scriptprocessornode.bufferSize,console.debug("using audio buffer-size:",bufferSize);var requestDataInvoked=!1;window.scriptprocessornode=scriptprocessornode,1===numChannels&&console.debug("All right-channels are skipped.");var isPaused=!1;this.pause=function(){isPaused=!0},this.resume=function(){isPaused=!1},this.onstop=function(){},scriptprocessornode.onaudioprocess=function(e){if(recording&&!requestDataInvoked&&!isPaused){var left=e.inputBuffer.getChannelData(0);if(leftchannel.push(new Float32Array(left)),2===numChannels){var right=e.inputBuffer.getChannelData(1);rightchannel.push(new Float32Array(right))}recordingLength+=bufferSize}},volume.connect(scriptprocessornode),scriptprocessornode.connect(context.destination)}function WhammyRecorder(mediaStream){this.start=function(timeSlice){timeSlice=timeSlice||1e3,mediaRecorder=new WhammyRecorderHelper(mediaStream,this);for(var prop in this)"function"!=typeof this[prop]&&(mediaRecorder[prop]=this[prop]);mediaRecorder.record(),timeout=setInterval(function(){mediaRecorder.requestData()},timeSlice)},this.stop=function(){mediaRecorder&&(mediaRecorder.stop(),clearTimeout(timeout),this.onstop())},this.onstop=function(){},this.clearOldRecordedFrames=function(){mediaRecorder&&mediaRecorder.clearOldRecordedFrames()},this.pause=function(){mediaRecorder&&mediaRecorder.pause()},this.resume=function(){mediaRecorder&&mediaRecorder.resume()},this.ondataavailable=function(){};var mediaRecorder,timeout}function WhammyRecorderHelper(mediaStream,root){function drawFrames(){if(isPaused)return lastTime=(new Date).getTime(),void setTimeout(drawFrames,500);if(!isStopDrawing){if(requestDataInvoked)return setTimeout(drawFrames,100);var duration=(new Date).getTime()-lastTime;if(!duration)return drawFrames();lastTime=(new Date).getTime(),!self.isHTMLObject&&video.paused&&video.play(),context.drawImage(video,0,0,canvas.width,canvas.height),isStopDrawing||whammy.frames.push({duration:duration,image:canvas.toDataURL("image/webp")}),isOnStartedDrawingNonBlankFramesInvoked||isBlankFrame(whammy.frames[whammy.frames.length-1])||(isOnStartedDrawingNonBlankFramesInvoked=!0,root.onStartedDrawingNonBlankFrames()),setTimeout(drawFrames,10)}}function isBlankFrame(frame,_pixTolerance,_frameTolerance){var localCanvas=document.createElement("canvas");localCanvas.width=canvas.width,localCanvas.height=canvas.height;var matchPixCount,endPixCheck,maxPixCount,context2d=localCanvas.getContext("2d"),sampleColor={r:0,g:0,b:0},maxColorDifference=Math.sqrt(Math.pow(255,2)+Math.pow(255,2)+Math.pow(255,2)),pixTolerance=_pixTolerance&&_pixTolerance>=0&&_pixTolerance<=1?_pixTolerance:0,frameTolerance=_frameTolerance&&_frameTolerance>=0&&_frameTolerance<=1?_frameTolerance:0,image=new Image;image.src=frame.image,context2d.drawImage(image,0,0,canvas.width,canvas.height);var imageData=context2d.getImageData(0,0,canvas.width,canvas.height);matchPixCount=0,endPixCheck=imageData.data.length,maxPixCount=imageData.data.length/4;for(var pix=0;pix<endPixCheck;pix+=4){var currentColor={r:imageData.data[pix],g:imageData.data[pix+1],b:imageData.data[pix+2]},colorDifference=Math.sqrt(Math.pow(currentColor.r-sampleColor.r,2)+Math.pow(currentColor.g-sampleColor.g,2)+Math.pow(currentColor.b-sampleColor.b,2));colorDifference<=maxColorDifference*pixTolerance&&matchPixCount++}return!(maxPixCount-matchPixCount<=maxPixCount*frameTolerance)}function dropBlackFrames(_frames,_framesToCheck,_pixTolerance,_frameTolerance){var localCanvas=document.createElement("canvas");localCanvas.width=canvas.width,localCanvas.height=canvas.height;for(var context2d=localCanvas.getContext("2d"),resultFrames=[],checkUntilNotBlack=_framesToCheck===-1,endCheckFrame=_framesToCheck&&_framesToCheck>0&&_framesToCheck<=_frames.length?_framesToCheck:_frames.length,sampleColor={r:0,g:0,b:0},maxColorDifference=Math.sqrt(Math.pow(255,2)+Math.pow(255,2)+Math.pow(255,2)),pixTolerance=_pixTolerance&&_pixTolerance>=0&&_pixTolerance<=1?_pixTolerance:0,frameTolerance=_frameTolerance&&_frameTolerance>=0&&_frameTolerance<=1?_frameTolerance:0,doNotCheckNext=!1,f=0;f<endCheckFrame;f++){var matchPixCount,endPixCheck,maxPixCount;if(!doNotCheckNext){var image=new Image;image.src=_frames[f].image,context2d.drawImage(image,0,0,canvas.width,canvas.height);var imageData=context2d.getImageData(0,0,canvas.width,canvas.height);matchPixCount=0,endPixCheck=imageData.data.length,maxPixCount=imageData.data.length/4;for(var pix=0;pix<endPixCheck;pix+=4){var currentColor={r:imageData.data[pix],g:imageData.data[pix+1],b:imageData.data[pix+2]},colorDifference=Math.sqrt(Math.pow(currentColor.r-sampleColor.r,2)+Math.pow(currentColor.g-sampleColor.g,2)+Math.pow(currentColor.b-sampleColor.b,2));colorDifference<=maxColorDifference*pixTolerance&&matchPixCount++}}!doNotCheckNext&&maxPixCount-matchPixCount<=maxPixCount*frameTolerance||(checkUntilNotBlack&&(doNotCheckNext=!0),resultFrames.push(_frames[f]))}return resultFrames=resultFrames.concat(_frames.slice(endCheckFrame)),resultFrames.length<=0&&resultFrames.push(_frames[_frames.length-1]),resultFrames}this.record=function(timeSlice){this.width||(this.width=320),this.height||(this.height=240),this.video&&this.video instanceof HTMLVideoElement&&(this.width||(this.width=video.videoWidth||video.clientWidth||320),this.height||(this.height=video.videoHeight||video.clientHeight||240)),this.video||(this.video={width:this.width,height:this.height}),this.canvas&&this.canvas.width&&this.canvas.height||(this.canvas={width:this.width,height:this.height}),canvas.width=this.canvas.width,canvas.height=this.canvas.height,this.video&&this.video instanceof HTMLVideoElement?(this.isHTMLObject=!0,video=this.video.cloneNode()):(video=document.createElement("video"),video.src=URL.createObjectURL(mediaStream),video.width=this.video.width,video.height=this.video.height),video.muted=!0,video.play(),lastTime=(new Date).getTime(),whammy=new Whammy.Video(root.speed,root.quality),console.log("canvas resolutions",canvas.width,"*",canvas.height),console.log("video width/height",video.width||canvas.width,"*",video.height||canvas.height),drawFrames()},this.clearOldRecordedFrames=function(){whammy.frames=[]};var requestDataInvoked=!1;this.requestData=function(){if(!isPaused){if(!whammy.frames.length)return void(requestDataInvoked=!1);requestDataInvoked=!0;var internalFrames=whammy.frames.slice(0);whammy.frames=dropBlackFrames(internalFrames,-1),whammy.compile(function(whammyBlob){root.ondataavailable(whammyBlob),console.debug("video recorded blob size:",bytesToSize(whammyBlob.size))}),whammy.frames=[],requestDataInvoked=!1}};var isOnStartedDrawingNonBlankFramesInvoked=!1,isStopDrawing=!1;this.stop=function(){isStopDrawing=!0,this.requestData(),this.onstop()};var video,lastTime,whammy,canvas=document.createElement("canvas"),context=canvas.getContext("2d"),self=this,isPaused=!1;this.pause=function(){isPaused=!0},this.resume=function(){isPaused=!1},this.onstop=function(){}}function GifRecorder(mediaStream){function doneRecording(){endTime=Date.now();var gifBlob=new Blob([new Uint8Array(gifEncoder.stream().bin)],{type:"image/gif"});self.ondataavailable(gifBlob),gifEncoder.stream().bin=[]}if("undefined"==typeof GIFEncoder)throw"Please link: https://cdn.webrtc-experiment.com/gif-recorder.js";this.start=function(timeSlice){function drawVideoFrame(time){return isPaused?void setTimeout(drawVideoFrame,500,time):(lastAnimationFrame=requestAnimationFrame(drawVideoFrame),void 0===typeof lastFrameTime&&(lastFrameTime=time),void(time-lastFrameTime<90||(video.paused&&video.play(),context.drawImage(video,0,0,imageWidth,imageHeight),gifEncoder.addFrame(context),lastFrameTime=time)))}timeSlice=timeSlice||1e3;var imageWidth=this.videoWidth||320,imageHeight=this.videoHeight||240;canvas.width=video.width=imageWidth,canvas.height=video.height=imageHeight,gifEncoder=new GIFEncoder,gifEncoder.setRepeat(0),gifEncoder.setDelay(this.frameRate||this.speed||200),gifEncoder.setQuality(this.quality||1),gifEncoder.start(),startTime=Date.now(),lastAnimationFrame=requestAnimationFrame(drawVideoFrame),timeout=setTimeout(doneRecording,timeSlice)},this.stop=function(){lastAnimationFrame&&(cancelAnimationFrame(lastAnimationFrame),clearTimeout(timeout),doneRecording(),this.onstop())},this.onstop=function(){};var isPaused=!1;this.pause=function(){isPaused=!0},this.resume=function(){isPaused=!1},this.ondataavailable=function(){},this.onstop=function(){};var self=this,canvas=document.createElement("canvas"),context=canvas.getContext("2d"),video=document.createElement("video");video.muted=!0,video.autoplay=!0,video.src=URL.createObjectURL(mediaStream),video.play();var startTime,endTime,lastFrameTime,gifEncoder,timeout,lastAnimationFrame=null}"undefined"!=typeof MediaStreamRecorder&&(MediaStreamRecorder.MultiStreamRecorder=MultiStreamRecorder);var browserFakeUserAgent="Fake/5.0 (FakeOS) AppleWebKit/123 (KHTML, like Gecko) Fake/12.3.4567.89 Fake/123.45";!function(that){"undefined"==typeof window&&("undefined"==typeof window&&"undefined"!=typeof global?(global.navigator={userAgent:browserFakeUserAgent,getUserMedia:function(){}},that.window=global):"undefined"==typeof window,"undefined"==typeof document&&(that.document={},document.createElement=document.captureStream=document.mozCaptureStream=function(){return{}}),"undefined"==typeof location&&(that.location={protocol:"file:",href:"",hash:""}),"undefined"==typeof screen&&(that.screen={width:0,height:0}))}("undefined"!=typeof global?global:window);var AudioContext=window.AudioContext;"undefined"==typeof AudioContext&&("undefined"!=typeof webkitAudioContext&&(AudioContext=webkitAudioContext),"undefined"!=typeof mozAudioContext&&(AudioContext=mozAudioContext)),"undefined"==typeof window&&(window={});var AudioContext=window.AudioContext;"undefined"==typeof AudioContext&&("undefined"!=typeof webkitAudioContext&&(AudioContext=webkitAudioContext),"undefined"!=typeof mozAudioContext&&(AudioContext=mozAudioContext));var URL=window.URL;"undefined"==typeof URL&&"undefined"!=typeof webkitURL&&(URL=webkitURL),"undefined"!=typeof navigator?("undefined"!=typeof navigator.webkitGetUserMedia&&(navigator.getUserMedia=navigator.webkitGetUserMedia),"undefined"!=typeof navigator.mozGetUserMedia&&(navigator.getUserMedia=navigator.mozGetUserMedia)):navigator={getUserMedia:function(){},userAgent:browserFakeUserAgent};var IsEdge=!(navigator.userAgent.indexOf("Edge")===-1||!navigator.msSaveBlob&&!navigator.msSaveOrOpenBlob),IsOpera=!1;"undefined"!=typeof opera&&navigator.userAgent&&navigator.userAgent.indexOf("OPR/")!==-1&&(IsOpera=!0);var IsChrome=!IsEdge&&!IsEdge&&!!navigator.webkitGetUserMedia,MediaStream=window.MediaStream;"undefined"==typeof MediaStream&&"undefined"!=typeof webkitMediaStream&&(MediaStream=webkitMediaStream),"undefined"!=typeof MediaStream&&("getVideoTracks"in MediaStream.prototype||(MediaStream.prototype.getVideoTracks=function(){if(!this.getTracks)return[];var tracks=[];return this.getTracks.forEach(function(track){track.kind.toString().indexOf("video")!==-1&&tracks.push(track)}),tracks},MediaStream.prototype.getAudioTracks=function(){if(!this.getTracks)return[];var tracks=[];return this.getTracks.forEach(function(track){track.kind.toString().indexOf("audio")!==-1&&tracks.push(track)}),tracks}),"stop"in MediaStream.prototype||(MediaStream.prototype.stop=function(){this.getAudioTracks().forEach(function(track){track.stop&&track.stop()}),this.getVideoTracks().forEach(function(track){track.stop&&track.stop()})})),"undefined"!=typeof location&&0===location.href.indexOf("file:")&&console.error("Please load this HTML file on HTTP or HTTPS.");var ObjectStore={AudioContext:AudioContext},ObjectStore={AudioContext:window.AudioContext||window.webkitAudioContext};"undefined"!=typeof MediaStreamRecorder&&(MediaStreamRecorder.MediaRecorderWrapper=MediaRecorderWrapper),"undefined"!=typeof MediaStreamRecorder&&(MediaStreamRecorder.StereoAudioRecorder=StereoAudioRecorder),"undefined"!=typeof MediaStreamRecorder&&(MediaStreamRecorder.StereoAudioRecorderHelper=StereoAudioRecorderHelper),"undefined"!=typeof MediaStreamRecorder&&(MediaStreamRecorder.WhammyRecorder=WhammyRecorder),"undefined"!=typeof MediaStreamRecorder&&(MediaStreamRecorder.WhammyRecorderHelper=WhammyRecorderHelper),"undefined"!=typeof MediaStreamRecorder&&(MediaStreamRecorder.GifRecorder=GifRecorder);var Whammy=function(){function WhammyVideo(duration,quality){this.frames=[],duration||(duration=1),this.duration=1e3/duration,this.quality=quality||.8}function processInWebWorker(_function){var blob=URL.createObjectURL(new Blob([_function.toString(),"this.onmessage =  function (e) {"+_function.name+"(e.data);}"],{type:"application/javascript"})),worker=new Worker(blob);return URL.revokeObjectURL(blob),worker}function whammyInWebWorker(frames){function ArrayToWebM(frames){var info=checkFrames(frames);if(!info)return[];for(var clusterMaxDuration=3e4,EBML=[{id:440786851,data:[{data:1,id:17030},{data:1,id:17143},{data:4,id:17138},{data:8,id:17139},{data:"webm",id:17026},{data:2,id:17031},{data:2,id:17029}]},{id:408125543,data:[{id:357149030,data:[{data:1e6,id:2807729},{data:"whammy",id:19840},{data:"whammy",id:22337},{data:doubleToString(info.duration),id:17545}]},{id:374648427,data:[{id:174,data:[{data:1,id:215},{data:1,id:29637},{data:0,id:156},{data:"und",id:2274716},{data:"V_VP8",id:134},{data:"VP8",id:2459272},{data:1,id:131},{id:224,data:[{data:info.width,id:176},{data:info.height,id:186}]}]}]}]}],frameNumber=0,clusterTimecode=0;frameNumber<frames.length;){var clusterFrames=[],clusterDuration=0;do clusterFrames.push(frames[frameNumber]),clusterDuration+=frames[frameNumber].duration,frameNumber++;while(frameNumber<frames.length&&clusterDuration<clusterMaxDuration);var clusterCounter=0,cluster={id:524531317,data:getClusterData(clusterTimecode,clusterCounter,clusterFrames)};EBML[1].data.push(cluster),clusterTimecode+=clusterDuration}return generateEBML(EBML)}function getClusterData(clusterTimecode,clusterCounter,clusterFrames){return[{data:clusterTimecode,id:231}].concat(clusterFrames.map(function(webp){var block=makeSimpleBlock({discardable:0,frame:webp.data.slice(4),invisible:0,keyframe:1,lacing:0,trackNum:1,timecode:Math.round(clusterCounter)});return clusterCounter+=webp.duration,{data:block,id:163}}))}function checkFrames(frames){if(!frames[0])return void postMessage({error:"Something went wrong. Maybe WebP format is not supported in the current browser."});for(var width=frames[0].width,height=frames[0].height,duration=frames[0].duration,i=1;i<frames.length;i++)duration+=frames[i].duration;return{duration:duration,width:width,height:height}}function numToBuffer(num){for(var parts=[];num>0;)parts.push(255&num),num>>=8;return new Uint8Array(parts.reverse())}function strToBuffer(str){return new Uint8Array(str.split("").map(function(e){return e.charCodeAt(0)}))}function bitsToBuffer(bits){var data=[],pad=bits.length%8?new Array(9-bits.length%8).join("0"):"";bits=pad+bits;for(var i=0;i<bits.length;i+=8)data.push(parseInt(bits.substr(i,8),2));return new Uint8Array(data);
}function generateEBML(json){for(var ebml=[],i=0;i<json.length;i++){var data=json[i].data;"object"==typeof data&&(data=generateEBML(data)),"number"==typeof data&&(data=bitsToBuffer(data.toString(2))),"string"==typeof data&&(data=strToBuffer(data));var len=data.size||data.byteLength||data.length,zeroes=Math.ceil(Math.ceil(Math.log(len)/Math.log(2))/8),sizeToString=len.toString(2),padded=new Array(7*zeroes+7+1-sizeToString.length).join("0")+sizeToString,size=new Array(zeroes).join("0")+"1"+padded;ebml.push(numToBuffer(json[i].id)),ebml.push(bitsToBuffer(size)),ebml.push(data)}return new Blob(ebml,{type:"video/webm"})}function makeSimpleBlock(data){var flags=0;if(data.keyframe&&(flags|=128),data.invisible&&(flags|=8),data.lacing&&(flags|=data.lacing<<1),data.discardable&&(flags|=1),data.trackNum>127)throw"TrackNumber > 127 not supported";var out=[128|data.trackNum,data.timecode>>8,255&data.timecode,flags].map(function(e){return String.fromCharCode(e)}).join("")+data.frame;return out}function parseWebP(riff){for(var VP8=riff.RIFF[0].WEBP[0],frameStart=VP8.indexOf("*"),i=0,c=[];i<4;i++)c[i]=VP8.charCodeAt(frameStart+3+i);var width,height,tmp;return tmp=c[1]<<8|c[0],width=16383&tmp,tmp=c[3]<<8|c[2],height=16383&tmp,{width:width,height:height,data:VP8,riff:riff}}function getStrLength(string,offset){return parseInt(string.substr(offset+4,4).split("").map(function(i){var unpadded=i.charCodeAt(0).toString(2);return new Array(8-unpadded.length+1).join("0")+unpadded}).join(""),2)}function parseRIFF(string){for(var offset=0,chunks={};offset<string.length;){var id=string.substr(offset,4),len=getStrLength(string,offset),data=string.substr(offset+4+4,len);offset+=8+len,chunks[id]=chunks[id]||[],"RIFF"===id||"LIST"===id?chunks[id].push(parseRIFF(data)):chunks[id].push(data)}return chunks}function doubleToString(num){return[].slice.call(new Uint8Array(new Float64Array([num]).buffer),0).map(function(e){return String.fromCharCode(e)}).reverse().join("")}var webm=new ArrayToWebM(frames.map(function(frame){var webp=parseWebP(parseRIFF(atob(frame.image.slice(23))));return webp.duration=frame.duration,webp}));postMessage(webm)}return WhammyVideo.prototype.add=function(frame,duration){if("canvas"in frame&&(frame=frame.canvas),"toDataURL"in frame&&(frame=frame.toDataURL("image/webp",this.quality)),!/^data:image\/webp;base64,/gi.test(frame))throw"Input must be formatted properly as a base64 encoded DataURI of type image/webp";this.frames.push({image:frame,duration:duration||this.duration})},WhammyVideo.prototype.compile=function(callback){var webWorker=processInWebWorker(whammyInWebWorker);webWorker.onmessage=function(event){return event.data.error?void console.error(event.data.error):void callback(event.data)},webWorker.postMessage(this.frames)},{Video:WhammyVideo}}();"undefined"!=typeof MediaStreamRecorder&&(MediaStreamRecorder.Whammy=Whammy),function(){window.ConcatenateBlobs=function(blobs,type,callback){function readAsArrayBuffer(){if(!blobs[index])return concatenateBuffers();var reader=new FileReader;reader.onload=function(event){buffers.push(event.target.result),index++,readAsArrayBuffer()},reader.readAsArrayBuffer(blobs[index])}function concatenateBuffers(){var byteLength=0;buffers.forEach(function(buffer){byteLength+=buffer.byteLength});var tmp=new Uint16Array(byteLength),lastOffset=0;buffers.forEach(function(buffer){var reusableByteLength=buffer.byteLength;reusableByteLength%2!=0&&(buffer=buffer.slice(0,reusableByteLength-1)),tmp.set(new Uint16Array(buffer),lastOffset),lastOffset+=reusableByteLength});var blob=new Blob([tmp.buffer],{type:type});callback(blob)}var buffers=[],index=0;readAsArrayBuffer()}}(),"undefined"!=typeof module&&(module.exports=MediaStreamRecorder),"function"==typeof define&&define.amd&&define("MediaStreamRecorder",[],function(){return MediaStreamRecorder});