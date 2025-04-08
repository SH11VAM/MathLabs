// Sound utility functions
const popSound = new Audio('/sound/pop.mp3');
const completeSound = new Audio('/sound/complete.mp3');

// Set volume for all sounds
popSound.volume = 0.3;
completeSound.volume = 0.3;

// Preload sounds
popSound.load();
completeSound.load();

export const playPopSound = () => {
  try {
    // Reset the audio to start
    popSound.currentTime = 0;
    popSound.play().catch((error) => {
      console.log('Sound playback prevented:', error);
    });
  } catch (error) {
    console.log('Error playing pop sound:', error);
  }
};

export const playCompleteSound = () => {
  try {
    // Reset the audio to start
    completeSound.currentTime = 0;
    completeSound.play().catch((error) => {
      console.log('Sound playback prevented:', error);
    });
  } catch (error) {
    console.log('Error playing complete sound:', error);
  }
}; 