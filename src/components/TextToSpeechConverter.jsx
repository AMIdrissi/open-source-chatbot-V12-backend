import React, { useState } from 'react';

const TextToSpeechConverter = () => {
  const [textInput, setTextInput] = useState('');

  const convertToSpeech = async () => {
    // Check if there is text to convert
    if (!textInput.trim()) {
      alert('Please enter text to convert.');
      return;
    }

    // Replace with your Eleven Labs API key
    const elevenLabsApiKey = 'YOUR_ELEVEN_LABS_API_KEY';

    // Replace with the actual Eleven Labs API endpoint
    const apiUrl = 'https://api.eleven-labs.com/v1/your-endpoint';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${elevenLabsApiKey}`,
        },
        body: JSON.stringify({
          text: textInput,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the API returns audio data, you can play it using an audio element
        const audioUrl = data.audioUrl; // Replace with the actual property from the API response
        const audioElement = new Audio(audioUrl);
        audioElement.play();
      } else {
        console.error(
          'Error converting text to speech:',
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      <textarea
        rows="4"
        cols="50"
        placeholder="Enter text to convert"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
      ></textarea>
      <br />
      <button onClick={convertToSpeech}>Convert to Speech</button>
    </div>
  );
};

export default TextToSpeechConverter;
