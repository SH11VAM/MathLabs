// Sound utility functions for division
const completeSound = new Audio('/sound/complete.mp3');
const popSound = new Audio('/sound/pop.mp3');

// Set volume for the sounds
completeSound.volume = 0.3;
popSound.volume = 0.2; // Slightly lower volume for pop sound

// Preload sounds
completeSound.load();
popSound.load();

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