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
                    bat 'cmd /c "start /B npx ng serve --open"'
                    timeout 10
                }
            }
        }
		stage('Start Backend Server') {
            steps {
                dir('backend') {
                    bat 'call venv\\Scripts\\activate && pip install -r requirements.txt'
                    bat 'call venv\\Scripts\\activate && python manage.py migrate'
                    bat 'cmd /c "start /B call venv\\Scripts\\activate && python manage.py runserver"'
					timeout 10
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
                bat 'powershell "Stop-Process -Id (Get-NetTCPConnection -LocalPort 4200).OwningProcess -Force"' // Stop the Frontend development server
            }
            dir('backend') {
                bat 'powershell "Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force"' // Stop the Django development server
            }
        }
    }
}
