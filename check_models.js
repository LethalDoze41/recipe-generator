const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("Querying models from:", url.replace(apiKey, "HIDDEN_KEY"));

fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Error:", data.error);
        } else if (data.models) {
            console.log("Available models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name} (${m.displayName})`);
                }
            });
        } else {
            console.log("No models found or unexpected response:", data);
        }
    })
    .catch(error => console.error("Fetch error:", error));
