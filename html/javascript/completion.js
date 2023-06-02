
const API_KEY = "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";
const submitButton = document.querySelector('#submit');
const outputText = document.getElementById('myOutput');

function typeWriter(text, delay) {
  return new Promise(resolve => {
    const encodedText = he.encode(text); // Encode the entire message using HTML entities
    let index = 0;
    const interval = setInterval(() => {
      outputText.textContent += encodedText[index];
      index++;
      if (index >= encodedText.length) {
        clearInterval(interval);
        resolve();
      }
    }, delay);
  });
}


async function generateResults() {
  const inputText = document.getElementById('myInput').value;
  console.log("Input Text:", inputText);

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: inputText }],
      max_tokens: 750
    })
  };

  outputText.textContent = ''; // Clear the output text

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();
    console.log("API Response:", data);
    const message = data.choices[0].message.content;
    console.log("Response Message:", message);

    await typeWriter(message, 50); // Type out the message with a delay of 50ms per character
  } catch (error) {
    console.error(error);
    // Handle any errors that occur during the API request
  }
}

submitButton.addEventListener('click', generateResults);

