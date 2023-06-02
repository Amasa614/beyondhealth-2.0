const API_KEY = "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"
const submitButton = document.querySelector('#submit')

async function getMessage() {
    console.log('clicked')
    const options = {
        method: 'POST',
        headers: {
            'Authorization':`Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify ({
            model: "gpt-3.5-turbo",
            messages:[{role: "user", content:"Hello"}],
            max_tokens: 750
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.error(error)

    }
}



submitButton.addEventListener('click', getMessage)

