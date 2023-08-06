pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Frontend') {
            agent any
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }
        stage('Start Frontend Server') {
            steps {
                dir('frontend') {
                    sh 'npx ng serve --open &'
                    sleep 30
                }
            }
        }
		stage('Start Backend Server') {
            steps {
                dir('backend') {
                    bat 'call venv\\Scripts\\activate && pip install -r requirements.txt'
                    bat 'call venv\\Scripts\\activate && python manage.py migrate'
                    bat 'call venv\\Scripts\\activate && python manage.py runserver &'
                }
            }
        }
        
		 stage('Run Cypress Tests') {
		 agent any
            steps {
                dir('frontend') {
                    bat 'npx cypress run'
                }
            }
        }
		
        stage('Test') {
		agent any
            steps {
                dir('backend') {
                    bat 'python manage.py test'
                }
            }
        }
		
    }
	post {
        always {
            dir('frontend') {
                bat 'taskkill /F /IM ng.exe' // Stop the Frontend development server
            }
            dir('backend') {
                bat 'taskkill /F /IM python.exe' // Stop the Django development server
            }
        }
    }
}
