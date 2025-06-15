class ConversationTester {
    constructor() {
        this.apiBase = 'http://localhost:3000';
        this.testResults = [];
        this.currentTestIndex = 0;
        this.totalTests = 0;
        
        // Test data organized by difficulty and category
        this.testData = this.initializeTestData();
        this.initializeUI();
    }

    initializeTestData() {
        return {
            // EASY LEVEL
            easy: {
                basic_greetings: [
                    { en: "Hello", expected_rw: "Muraho" },
                    { en: "Thank you", expected_rw: "Murakoze" },
                    { en: "Good morning", expected_rw: "Mwaramutse" },
                    { en: "How are you?", expected_rw: "Mumeze mute?" },
                    { en: "Goodbye", expected_rw: "Murabeho" }
                ],
                simple_words: [
                    { en: "Water", expected_rw: "Amazi" },
                    { en: "Food", expected_rw: "Ibiryo" },
                    { en: "House", expected_rw: "Inzu" },
                    { en: "School", expected_rw: "Ishuri" },
                    { en: "Friend", expected_rw: "Inshuti" }
                ]
            },

            // MEDIUM LEVEL - Casual Conversations
            medium: {
                meeting_someone: [
                    { en: "Hi there! I don't think we've met before.", category: "introduction" },
                    { en: "Hello! You're right, I'm Sarah. Nice to meet you!", category: "introduction" },
                    { en: "I'm David. Are you from around here?", category: "introduction" },
                    { en: "Actually, I just moved here last month from Canada.", category: "introduction" }
                ],
                coffee_shop: [
                    { en: "Good morning! Could I get a large coffee with milk, please?", category: "service" },
                    { en: "Of course! Would you like sugar with that?", category: "service" },
                    { en: "Just a little bit, thanks. How much will that be?", category: "service" },
                    { en: "That'll be $3.50. Will you be drinking it here or taking it to go?", category: "service" }
                ],
                making_plans: [
                    { en: "Hey, what are you doing this weekend?", category: "social" },
                    { en: "Nothing special planned yet. Why, do you have something in mind?", category: "social" },
                    { en: "I was thinking we could go to that new restaurant downtown.", category: "social" },
                    { en: "That sounds great! What time works for you?", category: "social" }
                ],
                family_talk: [
                    { en: "Did you finish your homework already?", category: "family" },
                    { en: "Almost done, Mom. I just have math left to do.", category: "family" },
                    { en: "Do you need any help with it?", category: "family" },
                    { en: "Maybe later if I get stuck on the hard problems.", category: "family" }
                ]
            },

            // HARD LEVEL - Complex Conversations
            hard: {
                workplace: [
                    { en: "How's the presentation coming along?", category: "professional" },
                    { en: "Pretty well, but I'm still working on the final slides.", category: "professional" },
                    { en: "Do you need me to review anything before tomorrow's meeting?", category: "professional" },
                    { en: "That would be really helpful, thanks!", category: "professional" }
                ],
                shopping: [
                    { en: "Excuse me, how much are these tomatoes per pound?", category: "commerce" },
                    { en: "They're $2.50 per pound, but I can give you three pounds for $7.", category: "commerce" },
                    { en: "That's a good deal! Are they locally grown?", category: "commerce" },
                    { en: "Yes, they're from my farm just outside the city.", category: "commerce" }
                ],
                directions: [
                    { en: "Excuse me, could you help me find the nearest subway station?", category: "navigation" },
                    { en: "Sure! Go straight down this street for two blocks, then turn left.", category: "navigation" },
                    { en: "Is it the blue line that goes to downtown?", category: "navigation" },
                    { en: "Yes, exactly. You can't miss it - there's a big sign.", category: "navigation" }
                ],
                cultural_exchange: [
                    { en: "What's your favorite traditional food from your country?", category: "cultural" },
                    { en: "Probably ugali with vegetables. It's simple but very satisfying.", category: "cultural" },
                    { en: "That sounds delicious! Is it difficult to make?", category: "cultural" },
                    { en: "Not at all! I could teach you sometime if you're interested.", category: "cultural" }
                ]
            },

            // REVERSE TESTING
            reverse: {
                kinyarwanda_to_english: [
                    { rw: "Muraho", expected_en: "Hello" },
                    { rw: "Murakoze cyane", expected_en: "Thank you very much" },
                    { rw: "Mumeze mute?", expected_en: "How are you?" },
                    { rw: "Ndagukunda", expected_en: "I love you" },
                    { rw: "Mfite ikibazo", expected_en: "I have a problem" }
                ]
            },

            // MULTILINGUAL CHAINS
            chains: {
                round_trip: [
                    { text: "Hello, how are you today?", path: "en→rw→en" },
                    { text: "I am very happy to meet you", path: "en→fr→rw→en" },
                    { text: "The weather is beautiful today", path: "en→sw→en" }
                ]
            }
        };
    }

    initializeUI() {
        // Create test interface if it doesn't exist
        if (!document.getElementById('test-interface')) {
            this.createTestInterface();
        }
        this.attachEventListeners();
    }

    createTestInterface() {
        const testHTML = `
            <div id="test-interface" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden">
                <div class="flex items-center justify-center min-h-screen p-4">
                    <div class="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                        <!-- Header -->
                        <div class="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h2 class="text-2xl font-bold">🧪 Conversation Translation Tester</h2>
                                    <p class="opacity-90">Comprehensive testing suite for translation quality</p>
                                </div>
                                <button id="closeTest" class="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg">
                                    <i class="fas fa-times text-xl"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Test Controls -->
                        <div class="p-6 border-b">
                            <div class="flex flex-wrap gap-4 mb-4">
                                <button id="runAllTests" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    <i class="fas fa-play mr-2"></i>Run All Tests
                                </button>
                                <button id="runEasyTests" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                    🟢 Easy Tests
                                </button>
                                <button id="runMediumTests" class="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                                    🟡 Medium Tests
                                </button>
                                <button id="runHardTests" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                                    🔴 Hard Tests
                                </button>
                                <button id="exportResults" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                                    <i class="fas fa-download mr-2"></i>Export Results
                                </button>
                            </div>

                            <!-- Progress Bar -->
                            <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
                                <div id="progressBar" class="bg-blue-600 h-3 rounded-full transition-all duration-300" style="width: 0%"></div>
                            </div>
                            <div id="progressText" class="text-sm text-gray-600">Ready to start testing...</div>
                        </div>

                        <!-- Results Area -->
                        <div class="flex-1 overflow-hidden">
                            <div class="flex h-96">
                                <!-- Test Results -->
                                <div class="flex-1 p-6 overflow-y-auto">
                                    <h3 class="text-lg font-semibold mb-4">📊 Test Results</h3>
                                    <div id="testResults" class="space-y-3">
                                        <div class="text-gray-500 text-center py-8">
                                            <i class="fas fa-flask text-4xl mb-4"></i>
                                            <p>No tests run yet. Click a test button to start!</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Statistics -->
                                <div class="w-80 bg-gray-50 p-6 border-l overflow-y-auto">
                                    <h3 class="text-lg font-semibold mb-4">📈 Statistics</h3>
                                    <div id="testStats" class="space-y-4">
                                        <div class="bg-white p-4 rounded-lg">
                                            <div class="text-2xl font-bold text-blue-600" id="totalTestsCount">0</div>
                                            <div class="text-sm text-gray-600">Total Tests</div>
                                        </div>
                                        <div class="bg-white p-4 rounded-lg">
                                            <div class="text-2xl font-bold text-green-600" id="passedTestsCount">0</div>
                                            <div class="text-sm text-gray-600">Passed</div>
                                        </div>
                                        <div class="bg-white p-4 rounded-lg">
                                            <div class="text-2xl font-bold text-red-600" id="failedTestsCount">0</div>
                                            <div class="text-sm text-gray-600">Failed</div>
                                        </div>
                                        <div class="bg-white p-4 rounded-lg">
                                            <div class="text-2xl font-bold text-purple-600" id="avgQualityScore">0%</div>
                                            <div class="text-sm text-gray-600">Avg Quality</div>
                                        </div>
                                    </div>

                                    <!-- Category Breakdown -->
                                    <div class="mt-6">
                                        <h4 class="font-semibold mb-3">Category Performance</h4>
                                        <div id="categoryStats" class="space-y-2 text-sm">
                                            <!-- Will be populated dynamically -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Test Trigger Button -->
            <button id="openTestInterface" class="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40">
                <i class="fas fa-flask text-xl"></i>
            </button>
        `;

        document.body.insertAdjacentHTML('beforeend', testHTML);
    }

    attachEventListeners() {
        document.getElementById('openTestInterface').addEventListener('click', () => {
            document.getElementById('test-interface').classList.remove('hidden');
        });

        document.getElementById('closeTest').addEventListener('click', () => {
            document.getElementById('test-interface').classList.add('hidden');
        });

        document.getElementById('runAllTests').addEventListener('click', () => this.runAllTests());
        document.getElementById('runEasyTests').addEventListener('click', () => this.runTestsByDifficulty('easy'));
        document.getElementById('runMediumTests').addEventListener('click', () => this.runTestsByDifficulty('medium'));
        document.getElementById('runHardTests').addEventListener('click', () => this.runTestsByDifficulty('hard'));
        document.getElementById('exportResults').addEventListener('click', () => this.exportResults());
    }

    async runAllTests() {
        this.testResults = [];
        this.currentTestIndex = 0;
        
        const allTests = this.flattenTestData();
        this.totalTests = allTests.length;
        
        this.updateProgress(0, `Starting ${this.totalTests} tests...`);
        this.clearResults();

        for (let i = 0; i < allTests.length; i++) {
            const test = allTests[i];
            this.updateProgress((i / allTests.length) * 100, `Testing: ${test.text.substring(0, 50)}...`);
            
            const result = await this.runSingleTest(test);
            this.testResults.push(result);
            this.displayTestResult(result);
            this.updateStatistics();
            
            // Small delay to prevent API rate limiting
            await this.delay(100);
        }

        this.updateProgress(100, `Completed ${this.totalTests} tests!`);
        this.generateSummaryReport();
    }

        async runTestsByDifficulty(difficulty) {
        this.testResults = [];
        this.currentTestIndex = 0;
        
        const tests = this.getTestsByDifficulty(difficulty);
        this.totalTests = tests.length;
        
        this.updateProgress(0, `Starting ${difficulty} tests...`);
        this.clearResults();

        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            this.updateProgress((i / tests.length) * 100, `Testing: ${test.text.substring(0, 50)}...`);
            
            const result = await this.runSingleTest(test);
            this.testResults.push(result);
            this.displayTestResult(result);
            this.updateStatistics();
            
            await this.delay(100);
        }

        this.updateProgress(100, `Completed ${tests.length} ${difficulty} tests!`);
        this.generateSummaryReport();
    }

    getTestsByDifficulty(difficulty) {
        const tests = [];
        const difficultyData = this.testData[difficulty];
        
        if (!difficultyData) return tests;

        Object.keys(difficultyData).forEach(category => {
            difficultyData[category].forEach(testItem => {
                if (testItem.en) {
                    tests.push({
                        text: testItem.en,
                        source: 'en',
                        target: 'rw',
                        expected: testItem.expected_rw || null,
                        category: testItem.category || category,
                        difficulty: difficulty
                    });
                }
                if (testItem.rw) {
                    tests.push({
                        text: testItem.rw,
                        source: 'rw',
                        target: 'en',
                        expected: testItem.expected_en || null,
                        category: testItem.category || category,
                        difficulty: difficulty
                    });
                }
            });
        });

        return tests;
    }

    flattenTestData() {
        const allTests = [];
        
        // Add easy tests
        allTests.push(...this.getTestsByDifficulty('easy'));
        
        // Add medium tests
        allTests.push(...this.getTestsByDifficulty('medium'));
        
        // Add hard tests
        allTests.push(...this.getTestsByDifficulty('hard'));
        
        // Add reverse tests
        const reverseData = this.testData.reverse;
        Object.keys(reverseData).forEach(category => {
            reverseData[category].forEach(testItem => {
                if (testItem.rw) {
                    allTests.push({
                        text: testItem.rw,
                        source: 'rw',
                        target: 'en',
                        expected: testItem.expected_en || null,
                        category: 'reverse',
                        difficulty: 'reverse'
                    });
                }
            });
        });

        // Add chain tests
        const chainData = this.testData.chains;
        Object.keys(chainData).forEach(category => {
            chainData[category].forEach(testItem => {
                allTests.push({
                    text: testItem.text,
                    source: 'en',
                    target: 'rw',
                    expected: null,
                    category: 'chain',
                    difficulty: 'chain',
                    path: testItem.path
                });
            });
        });

        return allTests;
    }

    async runSingleTest(test) {
        const startTime = Date.now();
        
        try {
            const response = await fetch(`${this.apiBase}/api/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: test.text,
                    source: test.source,
                    target: test.target
                })
            });

            const data = await response.json();
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            if (data.success) {
                const result = {
                    id: this.currentTestIndex++,
                    originalText: test.text,
                    translatedText: data.translatedText,
                    expected: test.expected,
                    source: test.source,
                    target: test.target,
                    category: test.category,
                    difficulty: test.difficulty,
                    quality: data.translationQuality || 0,
                    match: data.match || 0,
                    responseTime: responseTime,
                    status: 'success',
                    timestamp: new Date().toISOString(),
                    path: test.path || null
                };

                // Calculate accuracy if expected result is provided
                if (test.expected) {
                    result.accuracy = this.calculateAccuracy(data.translatedText, test.expected);
                    result.passed = result.accuracy > 70; // 70% threshold
                } else {
                    result.passed = true; // No expected result to compare
                    result.accuracy = null;
                }

                return result;
            } else {
                return {
                    id: this.currentTestIndex++,
                    originalText: test.text,
                    translatedText: null,
                    expected: test.expected,
                    source: test.source,
                    target: test.target,
                    category: test.category,
                    difficulty: test.difficulty,
                    quality: 0,
                    responseTime: responseTime,
                    status: 'failed',
                    error: data.error || 'Translation failed',
                    passed: false,
                    accuracy: 0,
                    timestamp: new Date().toISOString()
                };
            }
        } catch (error) {
            const endTime = Date.now();
            return {
                id: this.currentTestIndex++,
                originalText: test.text,
                translatedText: null,
                expected: test.expected,
                source: test.source,
                target: test.target,
                category: test.category,
                difficulty: test.difficulty,
                quality: 0,
                responseTime: endTime - startTime,
                status: 'error',
                error: error.message,
                passed: false,
                accuracy: 0,
                timestamp: new Date().toISOString()
            };
        }
    }

    calculateAccuracy(actual, expected) {
        if (!actual || !expected) return 0;
        
        const actualWords = actual.toLowerCase().split(/\s+/);
        const expectedWords = expected.toLowerCase().split(/\s+/);
        
        // Simple word matching accuracy
        let matches = 0;
        const maxLength = Math.max(actualWords.length, expectedWords.length);
        
        actualWords.forEach(word => {
            if (expectedWords.includes(word)) {
                matches++;
            }
        });
        
        return Math.round((matches / maxLength) * 100);
    }

    displayTestResult(result) {
        const resultsContainer = document.getElementById('testResults');
        
        // Clear placeholder if it exists
        if (resultsContainer.querySelector('.text-gray-500')) {
            resultsContainer.innerHTML = '';
        }

        const statusIcon = result.passed ? '✅' : '❌';
        const statusColor = result.passed ? 'text-green-600' : 'text-red-600';
        const qualityColor = result.quality >= 80 ? 'text-green-600' : 
                           result.quality >= 60 ? 'text-yellow-600' : 'text-red-600';

        const resultHTML = `
            <div class="border rounded-lg p-4 ${result.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center space-x-2">
                        <span class="text-lg">${statusIcon}</span>
                        <span class="font-medium ${statusColor}">
                            ${result.difficulty.toUpperCase()} - ${result.category}
                        </span>
                        <span class="text-xs bg-gray-200 px-2 py-1 rounded">
                            ${result.source} → ${result.target}
                        </span>
                    </div>
                    <div class="text-right text-xs text-gray-500">
                        <div>${result.responseTime}ms</div>
                        ${result.quality ? `<div class="${qualityColor}">Q: ${result.quality}%</div>` : ''}
                    </div>
                </div>
                
                <div class="space-y-2 text-sm">
                    <div>
                        <span class="font-medium text-gray-700">Original:</span>
                        <span class="ml-2">${result.originalText}</span>
                    </div>
                    
                    ${result.translatedText ? `
                        <div>
                            <span class="font-medium text-gray-700">Translation:</span>
                            <span class="ml-2">${result.translatedText}</span>
                        </div>
                    ` : ''}
                    
                    ${result.expected ? `
                        <div>
                            <span class="font-medium text-gray-700">Expected:</span>
                            <span class="ml-2">${result.expected}</span>
                            ${result.accuracy !== null ? `
                                <span class="ml-2 text-xs ${result.accuracy > 70 ? 'text-green-600' : 'text-red-600'}">
                                    (${result.accuracy}% match)
                                </span>
                            ` : ''}
                        </div>
                    ` : ''}
                    
                    ${result.error ? `
                        <div class="text-red-600">
                            <span class="font-medium">Error:</span>
                            <span class="ml-2">${result.error}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        resultsContainer.insertAdjacentHTML('afterbegin', resultHTML);
    }

    updateProgress(percentage, message) {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = message;
    }

    updateStatistics() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        
        const qualityScores = this.testResults
            .filter(r => r.quality > 0)
            .map(r => r.quality);
        const avgQuality = qualityScores.length > 0 ? 
            Math.round(qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length) : 0;

        document.getElementById('totalTestsCount').textContent = totalTests;
        document.getElementById('passedTestsCount').textContent = passedTests;
        document.getElementById('failedTestsCount').textContent = failedTests;
        document.getElementById('avgQualityScore').textContent = `${avgQuality}%`;

        // Update category stats
        this.updateCategoryStats();
    }

    updateCategoryStats() {
        const categoryStats = {};
        
        this.testResults.forEach(result => {
            if (!categoryStats[result.category]) {
                categoryStats[result.category] = { total: 0, passed: 0 };
            }
            categoryStats[result.category].total++;
            if (result.passed) {
                categoryStats[result.category].passed++;
            }
        });

        const categoryStatsContainer = document.getElementById('categoryStats');
        categoryStatsContainer.innerHTML = '';

        Object.keys(categoryStats).forEach(category => {
            const stats = categoryStats[category];
            const percentage = Math.round((stats.passed / stats.total) * 100);
            const color = percentage >= 80 ? 'text-green-600' : 
                         percentage >= 60 ? 'text-yellow-600' : 'text-red-600';

            categoryStatsContainer.innerHTML += `
                <div class="flex justify-between items-center">
                    <span class="capitalize">${category}:</span>
                    <span class="${color} font-medium">${stats.passed}/${stats.total} (${percentage}%)</span>
                </div>
            `;
        });
    }

    clearResults() {
        const resultsContainer = document.getElementById('testResults');
        resultsContainer.innerHTML = `
            <div class="text-gray-500 text-center py-8">
                <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
                <p>Running tests...</p>
            </div>
        `;
    }

    generateSummaryReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const successRate = Math.round((passedTests / totalTests) * 100);
        
        const avgResponseTime = Math.round(
            this.testResults.reduce((sum, r) => sum + r.responseTime, 0) / totalTests
        );

        const report = {
            summary: {
                totalTests,
                passedTests,
                failedTests: totalTests - passedTests,
                successRate: `${successRate}%`,
                avgResponseTime: `${avgResponseTime}ms`,
                testDate: new Date().toISOString()
            },
            results: this.testResults,
            recommendations: this.generateRecommendations()
        };

        console.log('🧪 TEST SUMMARY REPORT', report);
        
        // Store results for export
        this.lastReport = report;
    }

    generateRecommendations() {
        const recommendations = [];
        
        // Analyze failure patterns
        const failedTests = this.testResults.filter(r => !r.passed);
        const categoryFailures = {};
        
        failedTests.forEach(test => {
            if (!categoryFailures[test.category]) {
                categoryFailures[test.category] = 0;
            }
            categoryFailures[test.category]++;
        });

        // Generate specific recommendations
        Object.keys(categoryFailures).forEach(category => {
            const failures = categoryFailures[category];
            if (failures > 2) {
                recommendations.push(`High failure rate in ${category} category (${failures} failures) - Consider improving context handling for ${category} conversations`);
            }
        });

        // Check response times
        const slowTests = this.testResults.filter(r => r.responseTime > 2000);
        if (slowTests.length > 0) {
            recommendations.push(`${slowTests.length} tests had slow response times (>2s) - Consider API optimization`);
        }

        // Check quality scores
        const lowQualityTests = this.testResults.filter(r => r.quality > 0 && r.quality < 60);
        if (lowQualityTests.length > 0) {
            recommendations.push(`${lowQualityTests.length} tests had low quality scores (<60%) - Translation accuracy needs improvement`);
        }

        return recommendations;
    }

        exportResults() {
        if (!this.lastReport) {
            alert('No test results to export. Please run tests first.');
            return;
        }

        const dataStr = JSON.stringify(this.lastReport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `translation-test-results-${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Also create a readable summary
        this.exportReadableSummary();
    }

    exportReadableSummary() {
        const report = this.lastReport;
        const summary = `
KINYARWANDA TRANSLATION TEST REPORT
===================================
Generated: ${new Date().toLocaleString()}

SUMMARY STATISTICS
------------------
Total Tests: ${report.summary.totalTests}
Passed: ${report.summary.passedTests}
Failed: ${report.summary.failedTests}
Success Rate: ${report.summary.successRate}
Average Response Time: ${report.summary.avgResponseTime}

CATEGORY BREAKDOWN
------------------
${this.getCategoryBreakdownText()}

FAILED TESTS ANALYSIS
--------------------
${this.getFailedTestsAnalysis()}

RECOMMENDATIONS
---------------
${report.recommendations.map(rec => `• ${rec}`).join('\n')}

DETAILED RESULTS
================
${this.getDetailedResultsText()}
        `;

        const summaryBlob = new Blob([summary], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(summaryBlob);
        link.download = `translation-test-summary-${new Date().toISOString().split('T')[0]}.txt`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    getCategoryBreakdownText() {
        const categoryStats = {};
        
        this.testResults.forEach(result => {
            if (!categoryStats[result.category]) {
                categoryStats[result.category] = { total: 0, passed: 0 };
            }
            categoryStats[result.category].total++;
            if (result.passed) {
                categoryStats[result.category].passed++;
            }
        });

        return Object.keys(categoryStats).map(category => {
            const stats = categoryStats[category];
            const percentage = Math.round((stats.passed / stats.total) * 100);
            return `${category.toUpperCase()}: ${stats.passed}/${stats.total} (${percentage}%)`;
        }).join('\n');
    }

    getFailedTestsAnalysis() {
        const failedTests = this.testResults.filter(r => !r.passed);
        
        if (failedTests.length === 0) {
            return "🎉 No failed tests! All translations passed.";
        }

        return failedTests.map(test => {
            return `❌ ${test.category} (${test.source}→${test.target}): "${test.originalText}"
   Expected: ${test.expected || 'N/A'}
   Got: ${test.translatedText || 'ERROR'}
   Error: ${test.error || 'Translation quality below threshold'}`;
        }).join('\n\n');
    }

    getDetailedResultsText() {
        return this.testResults.map(result => {
            const status = result.passed ? '✅ PASS' : '❌ FAIL';
            return `${status} | ${result.difficulty.toUpperCase()} | ${result.category}
Original: ${result.originalText}
Translation: ${result.translatedText || 'FAILED'}
Quality: ${result.quality}% | Time: ${result.responseTime}ms
${result.expected ? `Expected: ${result.expected}` : ''}
${result.error ? `Error: ${result.error}` : ''}
---`;
        }).join('\n');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the tester when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.conversationTester = new ConversationTester();
});
