import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());
app.use(express.static('public'));

const port = 3000;

// Sample API to get random names (placeholder)
const RANDOM_NAME_API = 'https://random-word-api.herokuapp.com/word?number=10';

// Helper function to replace variable names
function replaceVariableNames(code, names) {
    const varRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g; // Match all identifiers
    let i = 0;
    return code.replace(varRegex, (match) => {
        // Skip keywords like "if", "else", etc.
        const keywords = ['if', 'else', 'for', 'while', 'return', 'function', 'var', 'let', 'const'];
        if (keywords.includes(match)) return match;
        const newVar = names[i % names.length];
        i++;
        return newVar;
    });
}

// Route to handle plagiarism removal
app.post('/remove-plagiarism', async (req, res) => {
    const { code } = req.body;
    try {
        const nameResponse = await fetch(RANDOM_NAME_API);
        if (!nameResponse.ok) {
            throw new Error('Failed to fetch names');
        }

        const names = await nameResponse.json();
        const modifiedCode = replaceVariableNames(code, names);

        res.json({ modifiedCode, names });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error removing plagiarism" });
    }
});


// Route to handle regeneration of names
app.post('/regenerate-names', async (req, res) => {
    const { code } = req.body;
    try {
        const nameResponse = await fetch(RANDOM_NAME_API);
        const names = await nameResponse.json();

        // Replace variable names with new random names
        const modifiedCode = replaceVariableNames(code, names);

        res.json({ modifiedCode, names });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error regenerating names" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
