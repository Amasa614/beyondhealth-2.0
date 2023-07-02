document.addEventListener('DOMContentLoaded', function() {
  const API_KEY = "process.env.MY_API_KEY";
  const submitButton = document.querySelector('#submit');
  const outputText = document.getElementById('myOutput');
  const differentialButton = document.querySelector('#differential');
  const clinicalButton = document.querySelector('#clinical');
  const copyButton = document.querySelector('#copy');
  const downloadPdfButton = document.querySelector('#downloadPdf');
  const ratingContainer = document.querySelector('#rating-container');
  const ratingButtons = document.querySelectorAll('.rating-button');

  let selectedMode = ''; // Variable to store the selected mode: 'differential' or 'clinical'
  let copiedText = ''; // Variable to store the copied text
  let rating = null; // Variable to store the rating

  function startLoading() {
    submitButton.disabled = true; // Disable the button
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Generating...`;
  }

  function stopLoading() {
    submitButton.disabled = false; // Enable the button
    submitButton.innerHTML = `Generate <i class="bi bi-robot"></i>`;
  }

  function generateResults() {
    const inputText = document.getElementById('myInput').value;

    let prompt = ''; // Variable to store the prompt based on the selected mode

    if (selectedMode === 'differential') {
      prompt = `Write a detailed Differential diagnosis and include 3 real medical references for: ${inputText}`;
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

    startLoading(); // Start the loading animation

    fetch('https://api.openai.com/v1/chat/completions', options)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (outputText) {
          const formattedOutput = formatOutput(data.choices[0].message.content);
          outputText.innerHTML = '<div contenteditable="true">' + formattedOutput + '</div>';
          copiedText = formattedOutput; // Store the copied text

          // Show the "Download as PDF" button
          downloadPdfButton.style.display = 'block';

          // Show the "Copy" button
          copyButton.style.display = 'block';
        }
      })
      .catch(error => {
        console.error(error);
        // Handle any errors that occur during the API request
      })
      .finally(() => {
        stopLoading(); // Stop the loading animation
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

  copyButton.addEventListener('click', () => {
    if (copiedText) {
      navigator.clipboard.writeText(copiedText)
        .then(() => {
          console.log('Text copied!');
        })
        .catch(error => {
          console.error('Error copying text:', error);
        });
    }
  });

  ratingButtons.forEach(button => {
    button.addEventListener('click', () => {
      rating = button.dataset.rating;
      ratingButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
    });
  });

  downloadPdfButton.addEventListener('click', async () => {
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFLib.PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    const fontSize = 12;
    const text = outputText.textContent;
    const lines = text.split('<br>').map(line => line.trim());
  
    page.setFontSize(fontSize);
  
    let currentY = height - 50;
    for (const line of lines) {
      const textWidth = page.getTextWidth(line);
      const textHeight = fontSize;
      
      if (currentY - textHeight < 50) {
        page = pdfDoc.addPage();
        currentY = height - 50;
      }
      
      page.drawText(line, {
        x: (width - textWidth) / 2,
        y: currentY,
      });
      
      currentY -= textHeight;
    }
  
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  
    // Create a download link and trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'my_document.pdf';
    link.click();
  });
});

