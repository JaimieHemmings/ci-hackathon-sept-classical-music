// Get the height of the window to calculate volume based on mouse position
let height = window.innerHeight;
let width = window.innerWidth;

let freqMax = 2000;

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
  oscillator.start();                   // Start the oscillator
  oscillator.type = "sine";             // Waveform type

  /**
   * Function to set the frequency based on the mouse's x position
   * @param {Event} e - The mouse event
   * @returns {void}
   */
  setFrequency = (e) => {

    // calculate Frequency based on mouse.x as a percentage of window width
    let freq = (freqMax / 100) * ((e.clientX / width) * 100);
    console.log(freq);
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
  }

  /**
   * Function to set the volume based on the mouse's y position
   * @param {Event} e - The mouse event
   * @returns {void}
   */
  setVolume = (e) => {
    /**
     * Weird bit of math here as by default the mouse.y position is from the top of the window
     * So we need to invert it to get the volume to be louder when the mouse is at the top of the * window
     */
    volume.gain.value = ((height - e.clientY) / height) * 2;
  }
    
  // Event listener for mouse move event to update frequency and volume
  window.addEventListener('mousemove', (e) => {     
    setVolume(e);
    setFrequency(e); 
  });
  
  // Event listener for mouse up event to stop the oscillator
  window.addEventListener('mouseup', () => {
    oscillator.stop();
  });
});

// update height and width on window resize
window.addEventListener('resize', () => {
  height = window.innerHeight;
  width = window.innerWidth;
});