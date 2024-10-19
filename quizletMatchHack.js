// Scroll down the page to make sure all the words are loaded.
window.scrollTo(0, document.body.scrollHeight)

// Select all elements with the class TermText.
const terms = Array.from(document.querySelectorAll('.TermText'));

// Initialize an empty object to hold the pairs.
const pairs = {};

// Loop through the array and create pairs.
for (let i = 0; i < terms.length; i += 2) {
    // Get the word and the definition.
    const word = terms[i].textContent.trim();
    const definition = terms[i + 1] ? terms[i + 1].textContent.trim() : null;

    // Only add the pair if both values are present.
    if (word && definition) {
        pairs[definition] = word;
    }
}

// console.log(pairs)

let windowObjectReference = null;
const windowFeatures = "left=150,top=150,width=400,height=400";

// Get the current URL.
const currentUrl = window.location.href;

// Use regex to extract the ID from the URL in any format.
const match = currentUrl.match(/(?:\/id\/|\D)(\d+)(?:\/|$)/);

// Check if the ID was found.
if (match && match[1]) {
    const id = match[1]; // This will capture the numeric ID like '894032428' or '703256873'.

    // Open a smaller window for the game.
    if (windowObjectReference === null || windowObjectReference.closed) {
        windowObjectReference = window.open(`https://quizlet.com/${id}/match`, "quizletHack", windowFeatures);
        windowObjectReference.focus();
    }

    setTimeout(function () {
        // Select the button that start the game.
        const button = windowObjectReference.document.querySelector('button[aria-label="Commencer le jeu"]');

        // Check if the button exists and then click it.
        if (button) {
            button.click();
        } else {
            console.error("Button not found");
        }
    }, 5000);

    setTimeout(async function () {
        try {
            // Wait for tiles to load.
            const tiles = Array.from(windowObjectReference.document.querySelectorAll('.FormattedText'));

            // Function to simulate real mouse interaction.
            async function simulateMouseOverAndClick(element) {
                const rect = element.getBoundingClientRect();

                // Simulate mouse movement over the tile.
                element.dispatchEvent(new MouseEvent('mousemove', {
                    clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2, bubbles: true
                }));

                // Simulate mouse down and up (to mimic a full click).
                element.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true}));
                element.dispatchEvent(new PointerEvent('pointerup', {bubbles: true}));

                // Finally, trigger the click.
                element.click();

                // Small delay to mimic human interaction.
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            // Match each tile.
            for (const tile of tiles) {
                const firstTileWithContent = tile.firstChild.firstChild;
                for (const key in pairs) {
                    // Return the value for the current key.
                    const value = pairs[key];

                    // Find word for text in tile.
                    if (firstTileWithContent.textContent === key.toString()) {
                        // console.log(`First click: ${firstTileWithContent.textContent}`);
                        await simulateMouseOverAndClick(tile);

                        // Find corresponding tile.
                        for (const secondTile of tiles) {
                            const secondTileWithContent = secondTile.firstChild.firstChild;

                            if (secondTileWithContent.textContent === value) {
                                // console.log(`Second click: ${secondTileWithContent.textContent}`);
                                await simulateMouseOverAndClick(secondTile);
                                break;
                            }
                        }

                        // Delay between each match, only if needed.
                        // await new Promise(resolve => setTimeout(resolve, 1000));
                        break;
                    }
                }
            }
        } catch (error) {
            console.error(error.message);
        }
    }, 5500);
} else {
    console.error("ID not found in the URL");
}