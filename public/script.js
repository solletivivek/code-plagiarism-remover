let originalCode = '';
let currentNames = [];

document.getElementById('submitCode').addEventListener('click', async () => {
    const code = document.getElementById('codeInput').value;
    if (!code) {
        alert("Please paste some code.");
        return;
    }

    originalCode = code; // Save the original code for regeneration
    try {
        const response = await fetch('/remove-plagiarism', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        const result = await response.json();
        currentNames = result.names; // Save names for regeneration
        document.getElementById('output').textContent = result.modifiedCode;
        document.getElementById('regenerateCode').style.display = 'inline-block';
        document.getElementById('copyCode').style.display = 'inline-block';
    } catch (error) {
        console.error("Error:", error);
    }
});

document.getElementById('regenerateCode').addEventListener('click', async () => {
    try {
        const response = await fetch('/regenerate-names', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: originalCode })
        });
        const result = await response.json();
        currentNames = result.names; // Update names for next regeneration
        document.getElementById('output').textContent = result.modifiedCode;
    } catch (error) {
        console.error("Error:", error);
    }
});

document.getElementById('copyCode').addEventListener('click', () => {
    const code = document.getElementById('output').textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('Code copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
});

document.getElementById('resetCode').addEventListener('click', () => {
    document.getElementById('codeInput').value = '';
    document.getElementById('output').textContent = '';
    document.getElementById('regenerateCode').style.display = 'none';
    document.getElementById('copyCode').style.display = 'none';
    originalCode = '';
    currentNames = [];
});
