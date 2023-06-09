document.addEventListener('DOMContentLoaded', function() {
    
const API_KEY = "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";
const submitButton = document.querySelector('#submit');
const outputText = document.getElementById('myOutput');
const differentialButton = document.querySelector('#differential');
const clinicalButton = document.querySelector('#clinical');

let selectedMode = ''; // Variable to store the selected mode: 'differential' or 'clinical'

function generateResults() {
  const inputText = document.getElementById('myInput').value;

  let prompt = ''; // Variable to store the prompt based on the selected mode

  if (selectedMode === 'differential') {
    prompt = `Write a detailed Differential diagnosis and include 3 medical references for: ${inputText}`;
  } else if (selectedMode === 'clinical') {
    prompt = `Write a detailed clinical plan for ${inputText}`;
  } else {
    prompt = inputText; // No mode selected, use the input as is
  }

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.3
    })
  };

  outputText.textContent = ''; // Clear the output text

  fetch('https://api.openai.com/v1/chat/completions', options)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (outputText) {
        const formattedOutput = formatOutput(data.choices[0].message.content);
        outputText.innerHTML = formattedOutput;
        outputText.innerHTML = formattedOutput;
        outputContainer.style.display = 'block';
      }
    })
    .catch(error => {
      console.error(error);
      // Handle any errors that occur during the API request
    });
}

function formatOutput(output) {
  // Add line breaks between paragraphs
  output = output.replace(/\n/g, "<br>");

  // Apply formatting based on specific patterns
  output = output.replace(/\*\*(.*?)\*\*/g, "<span class='text-bold'>$1</span>");
  output = output.replace(/_(.*?)_/g, "<span class='text-italic'>$1</span>");

  return output;
}

const myInput = document.getElementById('myInput');

myInput.addEventListener('input', () => {
  myInput.style.height = 'auto'; // Reset the height to auto
  myInput.style.height = `${myInput.scrollHeight}px`; // Set the height to match the content
});

myInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    myInput.value += '\n';
  }
});

submitButton.addEventListener('click', generateResults);

// Event listeners for mode selection buttons

differentialButton.addEventListener('click', () => {
  selectedMode = 'differential';
});

clinicalButton.addEventListener('click', () => {
  selectedMode = 'clinical';
});

});