// Get the height of the window to calculate volume based on mouse position
let height = window.innerHeight;

// Event listener for mouse down event to start the audio context and oscillator
window.addEventListener('mousedown', (e) => {
  // Create a new audio context
  const audioCtx = new AudioContext();
  // Create an oscillator node to generate sound
  const oscillator = audioCtx.createOscillator();
  // Create a gain node to control the volume
  let volume = audioCtx.createGain();
  
  volume.connect(audioCtx.destination); // Connect the oscillator to the gain node
  oscillator.connect(volume);           // Connect the gain node to the audio context's
  oscillator.frequency.value = 440;     // Set the initial frequency
  oscillator.start();                   // Start the oscillator
  oscillator.type = "sine";             // Waveform type

  // Function to set the frequency based on the mouse's x position
  setFrequency = () => {
    oscillator.frequency.setValueAtTime(e.clientX, audioCtx.currentTime);
  }
  
  // Function to set the volume based on the mouse's y position
  setVolume = () => {
    volume.gain.value = ((height - e.clientY) / height) * 2;
  }
    
  // Event listener for mouse move event to update frequency and volume
  window.addEventListener('mousemove', (e) => {     
    volume.gain.value = ((height - e.clientY) / height) * 2;
    console.log(volume.gain.value);
    oscillator.frequency.setValueAtTime(e.clientX, audioCtx.currentTime);  
  });
  
  // Event listener for mouse up event to stop the oscillator
  window.addEventListener('mouseup', () => {
    oscillator.stop();
  });
});