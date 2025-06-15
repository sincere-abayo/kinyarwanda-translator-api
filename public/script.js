// Kinyarwanda Translator JavaScript Code
class KinyarwandaTranslator {
    constructor() {
        // this.apiBase = 'http://localhost:3000';
        this.apiBase = 'https://kinyarwanda-translator-api.onrender.com'; // Use the deployed API URL
        this.initializeElements();
        this.attachEventListeners();
        this.checkApiStatus();
        this.updateLanguageLabels();
    }

    initializeElements() {
        // Language selectors
        this.sourceLanguage = document.getElementById('sourceLanguage');
        this.targetLanguage = document.getElementById('targetLanguage');
        this.swapLanguagesBtn = document.getElementById('swapLanguages');

        // Text areas
        this.sourceText = document.getElementById('sourceText');
        this.translatedText = document.getElementById('translatedText');

        // Buttons
        this.translateBtn = document.getElementById('translateBtn');
        this.clearTextBtn = document.getElementById('clearText');
        this.copyTextBtn = document.getElementById('copyText');
        this.speakSourceBtn = document.getElementById('speakSource');
        this.speakTargetBtn = document.getElementById('speakTarget');

        // Labels and indicators
        this.sourceLanguageLabel = document.getElementById('sourceLanguageLabel');
        this.targetLanguageLabel = document.getElementById('targetLanguageLabel');
        this.charCount = document.getElementById('charCount');
        this.qualityBadge = document.getElementById('qualityBadge');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.apiStatus = document.getElementById('apiStatus');
        this.apiStatusText = document.getElementById('apiStatusText');

        // Toast
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');

        // Quick phrases
        this.quickPhrases = document.querySelectorAll('.quick-phrase');

        // Language mapping
        this.languageNames = {
            'en': 'English',
            'rw': 'Kinyarwanda',
            'fr': 'French',
            'sw': 'Swahili'
        };
    }

    attachEventListeners() {
        // Translation
        this.translateBtn.addEventListener('click', () => this.translate());
        this.sourceText.addEventListener('input', () => this.updateCharCount());
        this.sourceText.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.translate();
            }
        });

        // Language controls
        this.sourceLanguage.addEventListener('change', () => this.updateLanguageLabels());
        this.targetLanguage.addEventListener('change', () => this.updateLanguageLabels());
        this.swapLanguagesBtn.addEventListener('click', () => this.swapLanguages());

        // Text controls
        this.clearTextBtn.addEventListener('click', () => this.clearText());
        this.copyTextBtn.addEventListener('click', () => this.copyTranslation());

        // Speech synthesis
        this.speakSourceBtn.addEventListener('click', () => this.speakText(this.sourceText.value, this.sourceLanguage.value));
        this.speakTargetBtn.addEventListener('click', () => this.speakText(this.translatedText.textContent, this.targetLanguage.value));

        // Quick phrases
        this.quickPhrases.forEach(phrase => {
            phrase.addEventListener('click', () => {
                const text = phrase.getAttribute('data-text');
                this.sourceText.value = text;
                this.updateCharCount();
                this.translate();
            });
        });
    }

    async checkApiStatus() {
        try {
            const response = await fetch(`${this.apiBase}/health`);
            if (response.ok) {
                this.updateApiStatus(true, 'Connected');
            } else {
                this.updateApiStatus(false, 'Error');
            }
        } catch (error) {
            this.updateApiStatus(false, 'Offline');
        }
    }

    updateApiStatus(isOnline, status) {
        if (isOnline) {
            this.apiStatus.className = 'w-3 h-3 bg-green-500 rounded-full animate-pulse';
        } else {
            this.apiStatus.className = 'w-3 h-3 bg-red-500 rounded-full';
        }
        this.apiStatusText.textContent = status;
    }

    updateLanguageLabels() {
        const sourceLang = this.sourceLanguage.value;
        const targetLang = this.targetLanguage.value;
        
        this.sourceLanguageLabel.textContent = this.languageNames[sourceLang];
        this.targetLanguageLabel.textContent = this.languageNames[targetLang];

        // Prevent same language selection
        if (sourceLang === targetLang) {
            if (sourceLang === 'en') {
                this.targetLanguage.value = 'rw';
            } else {
                this.targetLanguage.value = 'en';
            }
            this.updateLanguageLabels();
        }
    }

    swapLanguages() {
        const sourceValue = this.sourceLanguage.value;
        const targetValue = this.targetLanguage.value;
        const sourceText = this.sourceText.value;
        const translatedText = this.translatedText.textContent;

        // Swap language selections
        this.sourceLanguage.value = targetValue;
        this.targetLanguage.value = sourceValue;

        // Swap text content
        this.sourceText.value = translatedText === 'Translation will appear here' ? '' : translatedText;
        
        this.updateLanguageLabels();
        this.updateCharCount();
        this.clearTranslation();

        this.showToast('Languages swapped!', 'info');
    }

    updateCharCount() {
        const count = this.sourceText.value.length;
        this.charCount.textContent = `${count}/500`;
        
        if (count > 450) {
            this.charCount.className = 'text-sm text-red-500';
        } else if (count > 350) {
            this.charCount.className = 'text-sm text-yellow-500';
        } else {
            this.charCount.className = 'text-sm text-gray-500';
        }

        // Enable/disable translate button
        this.translateBtn.disabled = count === 0;
        if (count === 0) {
            this.translateBtn.className = 'flex-1 bg-gray-300 text-gray-500 py-3 px-6 rounded-xl font-semibold cursor-not-allowed';
        } else {
            this.translateBtn.className = 'flex-1 bg-gradient-to-r from-rwanda-blue to-rwanda-green text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold';
        }
    }

    async translate() {
        const text = this.sourceText.value.trim();
        if (!text) {
            this.showToast('Please enter text to translate', 'error');
            return;
        }

        this.showLoading(true);
        this.translateBtn.disabled = true;

        try {
            const response = await fetch(`${this.apiBase}/api/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    source: this.sourceLanguage.value,
                    target: this.targetLanguage.value
                })
            });

            const data = await response.json();

            if (data.success) {
                this.displayTranslation(data.translatedText, data.translationQuality);
                this.showToast('Translation completed!', 'success');
            } else {
                throw new Error(data.error || 'Translation failed');
            }

        } catch (error) {
            console.error('Translation error:', error);
            this.showToast(`Translation failed: ${error.message}`, 'error');
            this.displayError('Translation failed. Please try again.');
        } finally {
            this.showLoading(false);
            this.translateBtn.disabled = false;
        }
    }

    displayTranslation(translatedText, quality) {
        this.translatedText.innerHTML = `<p class="text-gray-800">${translatedText}</p>`;
        
        // Enable action buttons
        this.copyTextBtn.disabled = false;
        this.speakTargetBtn.disabled = false;
        this.copyTextBtn.className = 'flex-1 bg-gray-100 text-gray-600 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-semibold';
        this.speakTargetBtn.className = 'px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-200';

        // Show quality badge if available
        if (quality && quality > 0) {
            this.showQualityBadge(quality);
        }
    }

    displayError(message) {
        this.translatedText.innerHTML = `
            <div class="flex items-center justify-center h-full text-red-500">
                <div class="text-center">
                    <i class="fas fa-exclamation-triangle text-3xl mb-2"></i>
                    <p>${message}</p>
                </div>
            </div>
        `;
    }

    showQualityBadge(quality) {
        let badgeClass, badgeText;
        
        if (quality >= 80) {
            badgeClass = 'bg-green-100 text-green-800';
            badgeText = 'High Quality';
        } else if (quality >= 60) {
            badgeClass = 'bg-yellow-100 text-yellow-800';
            badgeText = 'Good Quality';
        } else {
            badgeClass = 'bg-red-100 text-red-800';
            badgeText = 'Low Quality';
        }

        this.qualityBadge.className = `px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`;
        this.qualityBadge.textContent = badgeText;
        this.qualityBadge.classList.remove('hidden');
    }

    showLoading(show) {
        if (show) {
            this.loadingSpinner.classList.remove('hidden');
            this.translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Translating...';
        } else {
            this.loadingSpinner.classList.add('hidden');
            this.translateBtn.innerHTML = '<i class="fas fa-language mr-2"></i>Translate';
        }
    }

    clearText() {
        this.sourceText.value = '';
        this.updateCharCount();
        this.clearTranslation();
        this.sourceText.focus();
    }

    clearTranslation() {
        this.translatedText.innerHTML = `
            <div class="flex items-center justify-center h-full text-gray-400">
                <div class="text-center">
                    <i class="fas fa-language text-3xl mb-2"></i>
                    <p>Translation will appear here</p>
                </div>
            </div>
        `;
        
        // Disable action buttons
        this.copyTextBtn.disabled = true;
        this.speakTargetBtn.disabled = true;
        this.copyTextBtn.className = 'flex-1 bg-gray-100 text-gray-600 py-3 px-6 rounded-xl font-semibold disabled:opacity-50';
        this.speakTargetBtn.className = 'px-4 py-3 bg-gray-100 text-gray-600 rounded-xl disabled:opacity-50';
        
        // Hide quality badge
        this.qualityBadge.classList.add('hidden');
    }

    async copyTranslation() {
        const text = this.translatedText.textContent;
        if (!text || text === 'Translation will appear here') return;

        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Translation copied to clipboard!', 'success');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Translation copied to clipboard!', 'success');
        }
    }

    speakText(text, language) {
        if (!text || text === 'Translation will appear here') return;

        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            
            // Set language based on selection
            const langMap = {
                'en': 'en-US',
                'fr': 'fr-FR',
                'rw': 'en-US', // Fallback to English for Kinyarwanda
                'sw': 'sw-KE'
            };
            
            utterance.lang = langMap[language] || 'en-US';
            utterance.rate = 0.8;
            utterance.pitch = 1;

            speechSynthesis.speak(utterance);
            this.showToast('Speaking...', 'info');
        } else {
            this.showToast('Speech synthesis not supported', 'error');
        }
    }

    showToast(message, type = 'success') {
        const iconMap = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'info': 'fas fa-info-circle'
        };

        const colorMap = {
            'success': 'bg-green-500',
            'error': 'bg-red-500',
            'info': 'bg-blue-500'
        };

        this.toast.className = `fixed top-4 right-4 ${colorMap[type]} text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-50`;
        this.toastMessage.innerHTML = `<i class="${iconMap[type]} mr-2"></i>${message}`;

        // Show toast
        this.toast.style.transform = 'translateX(0)';

        // Hide toast after 3 seconds
        setTimeout(() => {
            this.toast.style.transform = 'translateX(100%)';
        }, 3000);
    }
}

// Initialize the translator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KinyarwandaTranslator();
});
