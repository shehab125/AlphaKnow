// Firebase Debug and Diagnostics
class FirebaseDebugger {
    constructor() {
        this.issues = [];
        this.tests = [];
    }

    // Run comprehensive diagnostics
    async runDiagnostics() {
        console.log('🔍 Starting Firebase diagnostics...');
        
        this.issues = [];
        this.tests = [];
        
        // Test 1: SDK Loading
        await this.testSDKLoading();
        
        // Test 2: Configuration
        await this.testConfiguration();
        
        // Test 3: App Initialization
        await this.testAppInitialization();
        
        // Test 4: Service Initialization
        await this.testServiceInitialization();
        
        // Test 5: Network Connectivity
        await this.testNetworkConnectivity();
        
        // Test 6: Firestore Connection
        await this.testFirestoreConnection();
        
        // Test 7: Authentication
        await this.testAuthentication();
        
        // Generate report
        this.generateReport();
    }

    async testSDKLoading() {
        this.tests.push('SDK Loading');
        
        if (typeof firebase === 'undefined') {
            this.issues.push({
                test: 'SDK Loading',
                severity: 'critical',
                message: 'Firebase SDK not loaded',
                solution: 'Check script tags and network connectivity'
            });
            return false;
        }
        
        console.log('✅ Firebase SDK loaded, version:', firebase.SDK_VERSION);
        return true;
    }

    async testConfiguration() {
        this.tests.push('Configuration');
        
        if (!window.FIREBASE || !window.FIREBASE.config) {
            this.issues.push({
                test: 'Configuration',
                severity: 'critical',
                message: 'Firebase configuration not found',
                solution: 'Check firebase-config.js file'
            });
            return false;
        }
        
        const config = window.FIREBASE.config;
        const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket'];
        const missingFields = requiredFields.filter(field => !config[field]);
        
        if (missingFields.length > 0) {
            this.issues.push({
                test: 'Configuration',
                severity: 'critical',
                message: `Missing configuration fields: ${missingFields.join(', ')}`,
                solution: 'Complete Firebase configuration in firebase-config.js'
            });
            return false;
        }
        
        console.log('✅ Firebase configuration valid');
        return true;
    }

    async testAppInitialization() {
        this.tests.push('App Initialization');
        
        if (!window.FIREBASE || !window.FIREBASE.app) {
            this.issues.push({
                test: 'App Initialization',
                severity: 'critical',
                message: 'Firebase app not initialized',
                solution: 'Check firebase-config.js initialization code'
            });
            return false;
        }
        
        console.log('✅ Firebase app initialized');
        return true;
    }

    async testServiceInitialization() {
        this.tests.push('Service Initialization');
        
        if (!window.FIREBASE) {
            this.issues.push({
                test: 'Service Initialization',
                severity: 'critical',
                message: 'Firebase services not available',
                solution: 'Check firebase-config.js service initialization'
            });
            return false;
        }
        
        const services = ['auth', 'db', 'storage'];
        const missingServices = services.filter(service => !window.FIREBASE[service]);
        
        if (missingServices.length > 0) {
            this.issues.push({
                test: 'Service Initialization',
                severity: 'warning',
                message: `Missing services: ${missingServices.join(', ')}`,
                solution: 'Check service initialization in firebase-config.js'
            });
            return false;
        }
        
        console.log('✅ Firebase services initialized');
        return true;
    }

    async testNetworkConnectivity() {
        this.tests.push('Network Connectivity');
        
        try {
            // Test basic network connectivity
            const response = await fetch('https://www.google.com', { mode: 'no-cors' });
            console.log('✅ Basic network connectivity OK');
            return true;
        } catch (error) {
            this.issues.push({
                test: 'Network Connectivity',
                severity: 'warning',
                message: 'Network connectivity issues detected',
                solution: 'Check internet connection and firewall settings'
            });
            return false;
        }
    }

    async testFirestoreConnection() {
        this.tests.push('Firestore Connection');
        
        if (!window.FIREBASE || !window.FIREBASE.db) {
            this.issues.push({
                test: 'Firestore Connection',
                severity: 'critical',
                message: 'Firestore service not available',
                solution: 'Check Firestore initialization'
            });
            return false;
        }
        
        try {
            // Test a simple read operation
            const testDoc = await window.FIREBASE.db.collection('test').doc('diagnostic-test').get();
            console.log('✅ Firestore read test successful');
            
            // Test a simple write operation
            await window.FIREBASE.db.collection('test').doc('diagnostic-test').set({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                diagnostic: true,
                testTime: new Date().toISOString()
            });
            console.log('✅ Firestore write test successful');
            
            return true;
        } catch (error) {
            let solution = 'Check Firebase project configuration and security rules';
            
            if (error.code === 'permission-denied') {
                solution = 'Check Firestore security rules - read/write access denied';
            } else if (error.code === 'unauthenticated') {
                solution = 'Authentication required - check if user is signed in';
            } else if (error.code === 'not-found') {
                solution = 'Firestore database not found - check project ID';
            } else if (error.code === 'invalid-argument') {
                solution = 'Invalid data format - check data structure';
            }
            
            this.issues.push({
                test: 'Firestore Connection',
                severity: 'critical',
                message: `Firestore test failed: ${error.message}`,
                code: error.code,
                solution: solution
            });
            
            return false;
        }
    }

    async testAuthentication() {
        this.tests.push('Authentication');
        
        if (!window.FIREBASE || !window.FIREBASE.auth) {
            this.issues.push({
                test: 'Authentication',
                severity: 'critical',
                message: 'Authentication service not available',
                solution: 'Check auth service initialization'
            });
            return false;
        }
        
        try {
            // Test anonymous authentication
            const userCredential = await window.FIREBASE.auth.signInAnonymously();
            console.log('✅ Anonymous authentication successful:', userCredential.user.uid);
            
            // Sign out
            await window.FIREBASE.auth.signOut();
            console.log('✅ Sign out successful');
            
            return true;
        } catch (error) {
            let solution = 'Check Firebase project configuration and authentication settings';
            
            if (error.code === 'auth/operation-not-allowed') {
                solution = 'Anonymous authentication not enabled - enable it in Firebase console';
            } else if (error.code === 'auth/network-request-failed') {
                solution = 'Network error - check internet connection and firewall';
            }
            
            this.issues.push({
                test: 'Authentication',
                severity: 'warning',
                message: `Authentication test failed: ${error.message}`,
                code: error.code,
                solution: solution
            });
            
            return false;
        }
    }

    generateReport() {
        console.log('\n📊 Firebase Diagnostics Report');
        console.log('================================');
        
        const totalTests = this.tests.length;
        const criticalIssues = this.issues.filter(issue => issue.severity === 'critical');
        const warnings = this.issues.filter(issue => issue.severity === 'warning');
        
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Critical Issues: ${criticalIssues.length}`);
        console.log(`Warnings: ${warnings.length}`);
        
        if (this.issues.length === 0) {
            console.log('🎉 All tests passed! Firebase is working correctly.');
            return;
        }
        
        console.log('\n❌ Issues Found:');
        this.issues.forEach((issue, index) => {
            console.log(`\n${index + 1}. ${issue.test} (${issue.severity.toUpperCase()})`);
            console.log(`   Message: ${issue.message}`);
            if (issue.code) {
                console.log(`   Error Code: ${issue.code}`);
            }
            console.log(`   Solution: ${issue.solution}`);
        });
        
        // Provide summary recommendations
        console.log('\n💡 Recommendations:');
        if (criticalIssues.length > 0) {
            console.log('• Fix critical issues first - they prevent Firebase from working');
        }
        if (warnings.length > 0) {
            console.log('• Address warnings to improve functionality');
        }
        
        // Check for common issues
        const commonIssues = this.identifyCommonIssues();
        if (commonIssues.length > 0) {
            console.log('\n🔍 Common Issues Detected:');
            commonIssues.forEach(issue => {
                console.log(`• ${issue}`);
            });
        }
    }

    identifyCommonIssues() {
        const common = [];
        
        // Check for SDK version issues
        if (typeof firebase !== 'undefined' && firebase.SDK_VERSION) {
            const version = firebase.SDK_VERSION;
            if (version.startsWith('9.0.0')) {
                common.push('Using Firebase SDK 9.0.0 - consider upgrading to 9.22.0+ for better stability');
            }
        }
        
        // Check for configuration issues
        if (window.FIREBASE && window.FIREBASE.config) {
            const config = window.FIREBASE.config;
            if (config.projectId === 'your-project-id') {
                common.push('Using placeholder project ID - replace with actual Firebase project ID');
            }
        }
        
        // Check for security rules issues
        const firestoreIssues = this.issues.filter(issue => 
            issue.test === 'Firestore Connection' && issue.code === 'permission-denied'
        );
        if (firestoreIssues.length > 0) {
            common.push('Firestore security rules blocking access - check rules in Firebase console');
        }
        
        return common;
    }
}

// Create global instance
window.firebaseDebugger = new FirebaseDebugger();

// Auto-run diagnostics if requested
if (window.location.search.includes('debug=firebase')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.firebaseDebugger.runDiagnostics();
        }, 2000);
    });
}
