
const audioCtx = new AudioContext();
const oscillator = audioCtx.createOscillator();
let volume = audioCtx.createGain();
oscillator.type = "square";
oscillator.connect(volume);
volume.connect(audioCtx.destination);
volume.gain.value = 0;
oscillator.start();

window.addEventListener('mousedown', (e) => {
    volume.gain.value = e.clientY / 1000;
    oscillator.frequency.setValueAtTime(e.clientX, audioCtx.currentTime);
    
    window.addEventListener('mousemove', (e) => { 
        console.log(e.clientY / 1000);
        volume.gain.value = e.clientY / 1000;
        oscillator.frequency.setValueAtTime(e.clientX, audioCtx.currentTime);

    });

    window.addEventListener('mouseup', () => {
      volume.gain.value = 0;
    })
})