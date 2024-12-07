document.addEventListener('DOMContentLoaded', function() {
	// When the page is loaded, first get the theme from local storage
	const savedTheme = localStorage.getItem('theme');
	const currentTheme = savedTheme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
	applyTheme(currentTheme);

	// Get the language preference from local storage, or use the browser's language if none is found
	let currentLanguage = localStorage.getItem('language');
	if (!currentLanguage) {
		currentLanguage = navigator.language.slice(0, 2); // Get the browser language (e.g., 'en', 'tr')
		localStorage.setItem('language', currentLanguage); // Save it for the first time
	}
	document.getElementById("language").value = currentLanguage;

	// Get the subtitle format from local storage
	const savedFormat = localStorage.getItem('format');
	const currentFormat = savedFormat || 'vtt'; // Default format is 'vtt'
	document.getElementById("format").value = currentFormat;

	// Theme change handler
	document.getElementById("theme").value = currentTheme;
	document.getElementById("theme").addEventListener("change", function() {
		const selectedTheme = this.value;
		localStorage.setItem('theme', selectedTheme); // Save the theme preference to local storage
		applyTheme(selectedTheme);
	});

	// Language change handler
	document.getElementById("language").addEventListener("change", function() {
		const selectedLanguage = this.value;
		localStorage.setItem('language', selectedLanguage); // Save the language preference to local storage
	});

	// Subtitle format change handler
	document.getElementById("format").addEventListener("change", function() {
		const selectedFormat = this.value;
		localStorage.setItem('format', selectedFormat); // Save the format preference to local storage
	});

	// Click event to fetch subtitles
	document.getElementById("extractButton").addEventListener("click", async () => {
		const languageCode = document.getElementById("language").value.trim().toLowerCase(); // Selected language code
		const format = document.getElementById("format").value; // Selected subtitle format

		if (!languageCode) {
			showResult("Please select a language.", true);
			return;
		}

		if (!format) {
			showResult("Please select a subtitle format.", true);
			return;
		}

		try {
			const [tab] = await chrome.tabs.query({
				active: true,
				currentWindow: true
			});

			// Using executeScript to run the content script correctly
			const result = await chrome.scripting.executeScript({
				target: {
					tabId: tab.id
				},
				func: extractCaptions,
				args: [languageCode, format],
			});

			if (result?.[0]?.result) {
				showResult(result[0].result);
			} else {
				showResult("No subtitles found or unable to process.", true);
			}
		} catch (error) {
			showResult(`Error: ${error.message}`, true);
		}
	});
});

function applyTheme(theme) {
	const body = document.body;
	if (theme === 'dark') {
		body.classList.add('dark');
	} else {
		body.classList.remove('dark');
	}
}

function showResult(message, isError = false) {
	const resultElement = document.getElementById("result");
	resultElement.textContent = message;
	resultElement.className = isError ? "error" : "";
}

// Extract subtitles
async function extractCaptions(languageCode, format) {
	const htmlContent = document.documentElement.innerHTML;
	const match = htmlContent.match(/"captionTracks":\[(.+?)\]/);

	if (match) {
		const captionJson = `[${match[1]}]`;
		try {
			const captionTracks = JSON.parse(captionJson);
			const selectedCaption = captionTracks.find(
				(caption) => caption.languageCode?.toLowerCase() === languageCode // Check in lowercase
			);

			if (selectedCaption) {
				const baseUrl = `${selectedCaption.baseUrl}&fmt=${format}`;
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