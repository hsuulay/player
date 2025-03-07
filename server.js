const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for cross-origin requests
app.use(cors());

// Proxy endpoint to fetch and filter iframe content
app.get('/proxy', async (req, res) => {
    try {
        // Get the iframe URL from the query parameter
        const iframeUrl = req.query.url;
        if (!iframeUrl) {
            return res.status(400).send('URL parameter is required.');
        }

        // Fetch the iframe content
        const response = await axios.get(iframeUrl);
        const html = response.data;

        // Parse the HTML using Cheerio
        const $ = cheerio.load(html);

        // Remove ad-related elements (example: elements with class "ad" or "advertisement")
        $('.ad, .advertisement, [id*="ad"], [class*="popup"]').remove();

        // Return the filtered HTML to the client
        res.send($.html());
    } catch (error) {
        console.error('Error fetching or processing iframe content:', error);
        res.status(500).send('An error occurred while processing the request.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
