
const socket = io();

const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

let peer = new Peer(Math.floor(Math.random() * 9), {
    path: '/peerjs',
    host: '/',
    port: '3000',
    key: 'unique'
});


let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
        
    });

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    });
    let text = $('input');
    $('html').keydown((e) => {
        if(e.which == 13 && text.val().length !== 0){
            socket.emit('msg', text.val());
            text.val('');
        }
    });

    socket.on('create-message', message => {
        $('.messages').append(`<li class="message"><b>user</b><br>${message}</li>`);
        scrollBottom();
    });
});

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});



const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
}


const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    }); 
    videoGrid.append(video);
}

const scrollBottom = () => {
    let d = $('.main_chat_window');
    d.scrollBottom(d.prop("scrollHeight"));
}

const muteUnmute = () => {
    let enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteBtn();
    }else {
        setMuteBtn();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo();
    } else {
      setStopVideo();
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

const setMuteBtn = () => {
    const html = `<i class="fa-solid fa-microphone"></i>
    <span>Mute</span>`;
    document.querySelector('.main_mute_btn').innerHTML = html;
}
const setUnmuteBtn = () => {
    const html = `<i class="unmute fa-solid fa-microphone-slash"></i>
    <span>Mute</span>`;
    document.querySelector('.main_mute_btn').innerHTML = html;
}

const setStopVideo = () => {
    const html = `
    <i class="fa-solid fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fa-solid fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
  }