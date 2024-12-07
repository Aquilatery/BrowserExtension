document.getElementById("extractButton").addEventListener("click", async () => {
	const languageCode = document.getElementById("language").value.trim().toLowerCase(); // Convert language code to lowercase

	if (!languageCode) {
		showResult("Please enter a language code.", true);
		return;
	}

	try {
		const [tab] = await chrome.tabs.query({
			active: true,
			currentWindow: true
		});
		const [result] = await chrome.scripting.executeScript({
			target: {
				tabId: tab.id
			},
			func: extractCaptions,
			args: [languageCode],
		});

		if (result?.result) {
			showResult(result.result);
		} else {
			showResult("No subtitles found or unable to process.", true);
		}
	} catch (error) {
		showResult(`Error: ${error.message}`, true);
	}
});

function showResult(message, isError = false) {
	const resultElement = document.getElementById("result");
	resultElement.textContent = message;
	resultElement.className = isError ? "error" : "";
}

async function extractCaptions(languageCode) {
	const htmlContent = document.documentElement.innerHTML;
	const match = htmlContent.match(/"captionTracks":\[(.+?)\]/);

	if (match) {
		const captionJson = `[${match[1]}]`;
		try {
			const captionTracks = JSON.parse(captionJson);
			const selectedCaption = captionTracks.find(
				(caption) => caption.languageCode?.toLowerCase() === languageCode // Checking in lowercase
			);

			if (selectedCaption) {
				const baseUrl = `${selectedCaption.baseUrl}&fmt=vtt`;
				const response = await fetch(baseUrl);
				const captionsContent = await response.text();
				return captionsContent;
			} else {
				return `No subtitles found for language code ${languageCode}.`;
			}
		} catch (error) {
			return `Error processing JSON: ${error.message}`;
		}
	} else {
		return "No caption data found.";
	}
}