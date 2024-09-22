// Get the height of the window to calculate volume based on mouse position
let height = window.innerHeight;
let width = window.innerWidth;

let freqMin = 261;                  // Minimum frequency for the oscillator
let freqMax = 494;                  // Maximum frequency for the oscillator
let freqRange = freqMax - freqMin;  // Range of frequencies
let mouseDown = false;

// Event listener for mouse down event to start the audio context and oscillator
window.addEventListener('mousedown', (e) => {
  mouseDown = true;
  startPlaying(e);
});

// Event listener for touch start event to start the audio context and oscillator
window.addEventListener('touchstart', (e) => {
  startPlaying(e);
});

getCoords = (e) => {
  if(e.type == 'touchmove' || e.type == 'touchstart'){
    clientY = e.touches[0].clientY;
    clientX = e.touches[0].clientX;
    console.log(clientX)
  }
  else if(e.type == 'mousemove' || e.type == 'mousedown'){
    clientY = e.clientY;
    clientX = e.clientX;
    console.log(clientX)
  }

  return [clientX, clientY]
}

startPlaying = (e) => {
    // Create a new audio context
    const audioCtx = new AudioContext();
    // Create an oscillator node to generate sound
    const oscillator = audioCtx.createOscillator();
    // Create a gain node to control the volume
    let volume = audioCtx.createGain();

    const [clientX, clientY] = getCoords(e)
    
    console.log(((freqRange / 100) * ((clientX / width) * 100)) + freqMin);
    // Set the initial frequency of the oscillator
    oscillator.frequency.setValueAtTime(
      (((freqRange / 100) * ((clientX / width) * 100)) + freqMin), audioCtx.currentTime); 
    
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
      const [clientX, clientY] = getCoords(e)
      // calculate Frequency based on mouse.x as a percentage of window width
      let freq = ((freqRange / 100) * ((clientX / width) * 100)) + freqMin;
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
       * So we need to invert it to get the volume to be louder when the mouse is at the top of the 
       * window
       */
      const [clientX, clientY] = getCoords(e)
      volume.gain.value = ((height - clientY) / height) * 2;
    }
      
    // Event listener for mouse move event to update frequency and volume
    window.addEventListener('mousemove', (e) => {
      if (mouseDown == true) {
        setVolume(e);
        setFrequency(e);
      };
       
    });
  
    // Move event handler for mobile devices
    window.addEventListener('touchmove', (e) => {
      setVolume(e);
      setFrequency(e);
    });

    function fadeOut() {
      let stopTime = audioCtx.currentTime + 0.5;
      // Fade out the volume
      volume.gain.setTargetAtTime(0, stopTime - 0.25, 0.01);
      // End the oscillator after the stopTime
      oscillator.stop(stopTime);
    }
    
    // Event listener for mouse up event to stop the oscillator
    window.addEventListener('mouseup', () => {
      mouseDown = false;
      fadeOut();
    });
  
    // Touch event handler for movile devices
    window.addEventListener('touchend', () => {
      fadeOut();
    });
}

// update height and width on window resize
window.addEventListener('resize', () => {
  height = window.innerHeight;
  width = window.innerWidth;
});