document.getElementById('submitCode').addEventListener('click', async () => {
    const code = document.getElementById('codeInput').value;
    if (!code) {
        alert("Please paste some code.");
        return;
    }

    try {
        const response = await fetch('/remove-plagiarism', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        document.getElementById('output').textContent = result.modifiedCode;
        document.getElementById('regenerateCode').style.display = 'inline-block';
        document.getElementById('copyCode').style.display = 'inline-block';
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to process the request. Please try again.");
    }
});
