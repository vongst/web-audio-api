/**
 * Creates an AudioContext instance.
 * @returns {AudioContext} The created AudioContext.
 */
function createAudioContext() {
  return new (window.AudioContext || window.webkitAudioContext)();
}

/**
 * Loads and decodes an audio file into an AudioBuffer.
 * @param {AudioContext} audioContext - The AudioContext instance.
 * @param {string} audioFileURL - The URL of the audio file to load.
 * @returns {Promise<AudioBuffer|null>} A Promise that resolves to the loaded AudioBuffer or null if there was an error.
 */
async function loadAudioFile(audioContext, audioFileURL) {
  try {
    const response = await fetch(audioFileURL);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.error(`Error loading audio file: ${error.message}`);
    return null;
  }
}

/**
 * Creates audio controls for a given audio file.
 * @param {AudioContext} audioContext - The AudioContext instance.
 * @param {string} audioFileURL - The URL of the audio file.
 * @param {AudioBuffer} audioBuffer - The AudioBuffer containing the audio data.
 * @returns {HTMLElement} The container element with audio controls.
 */
function createAudioControls(audioContext, audioFileURL, audioBuffer) {
  const container = document.createElement("div");
  const fileName = document.createElement("p");
  fileName.textContent = audioFileURL;

  const { playButton, stopButton } = createControlButtons(
    audioContext,
    audioBuffer
  );

  let sourceNode; // Declare sourceNode variable

  // Event listener for the play button
  playButton.addEventListener("click", () => {
    if (!playButton.disabled) {
      sourceNode = playAudio(
        audioContext,
        audioBuffer,
        playButton,
        stopButton,
        sourceNode
      );
    }
  });

  // Event listener for the stop button
  stopButton.addEventListener("click", () => {
    if (!stopButton.disabled) {
      stopAudio(sourceNode, playButton, stopButton);
    }
  });

  // Append buttons to the container
  container.appendChild(fileName);
  container.appendChild(playButton);
  container.appendChild(stopButton);

  return container;
}

/**
 * Creates play and stop buttons for audio controls.
 * @param {AudioContext} audioContext - The AudioContext instance.
 * @param {AudioBuffer} audioBuffer - The AudioBuffer containing the audio data.
 * @returns {{playButton: HTMLElement, stopButton: HTMLElement}} An object containing play and stop buttons.
 */
function createControlButtons(audioContext, audioBuffer) {
  const playButton = createButton("Play");
  const stopButton = createButton("Stop");
  stopButton.disabled = true;

  return { playButton, stopButton };
}

/**
 * Helper function to create a button element with the specified text.
 * @param {string} text - The text content of the button.
 * @returns {HTMLElement} The created button element.
 */
function createButton(text) {
  const button = document.createElement("button");
  button.textContent = text;
  return button;
}

/**
 * Plays audio from an AudioBuffer.
 * @param {AudioContext} audioContext - The AudioContext instance.
 * @param {AudioBuffer} audioBuffer - The AudioBuffer containing the audio data.
 * @param {HTMLElement} playButton - The play button element.
 * @param {HTMLElement} stopButton - The stop button element.
 * @param {AudioBufferSourceNode} sourceNode - The source node for the audio playback.
 * @returns {AudioBufferSourceNode} The source node for the audio playback.
 */
function playAudio(
  audioContext,
  audioBuffer,
  playButton,
  stopButton,
  sourceNode
) {
  sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = audioBuffer;
  sourceNode.connect(audioContext.destination);
  sourceNode.start();
  playButton.disabled = true;
  stopButton.disabled = false;
  return sourceNode;
}

/**
 * Stops audio playback.
 * @param {AudioBufferSourceNode} sourceNode - The source node for the audio playback.
 * @param {HTMLElement} playButton - The play button element.
 * @param {HTMLElement} stopButton - The stop button element.
 * @returns {null} Returns null to indicate that the sourceNode has stopped.
 */
function stopAudio(sourceNode, playButton, stopButton) {
  if (sourceNode) {
    sourceNode.stop();
  }
  playButton.disabled = false;
  stopButton.disabled = true;
  return null;
}

/**
 * An array of audio file URLs.
 * @type {string[]}
 */
const audioFiles = [
  "https://ia600905.us.archive.org/19/items/FREE_background_music_dhalius/BackgroundMusica2.ogg",
  "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg",
  "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Lotus.ogg",
];

/**
 * Initializes audio controls when the page is loaded.
 */
document.addEventListener("DOMContentLoaded", async () => {
  const audioContext = createAudioContext();

  for (const audioFileURL of audioFiles) {
    const audioBuffer = await loadAudioFile(audioContext, audioFileURL);
    if (audioBuffer) {
      const audioControl = createAudioControls(
        audioContext,
        audioFileURL,
        audioBuffer
      );
      document.getElementById("audioControls").appendChild(audioControl);
    }
  }
});
