
const audioCtx = new AudioContext();
const oscillator = audioCtx.createOscillator();
height = window.innerHeight;
let volume = audioCtx.createGain();
oscillator.type = "square";
oscillator.connect(volume);
volume.connect(audioCtx.destination);
oscillator.frequency.value = 440;
volume.gain.value = 0;
oscillator.start();

window.addEventListener('mousedown', (e) => {
    oscillator.frequency.setValueAtTime(e.clientX, audioCtx.currentTime);
})
    
window.addEventListener('mousemove', (e) => { 
  // get mouse distance from bottom of window
  
  volume.gain.value = ((height - e.clientY) / height) * 2;
  console.log(volume.gain.value);
    oscillator.frequency.setValueAtTime(e.clientX, audioCtx.currentTime);

});

window.addEventListener('mouseup', () => {
  volume.gain.value = 0;
});