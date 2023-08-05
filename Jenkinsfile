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
        
        stage('Build Backend') {
            agent any
            steps {
                dir('backend') {
                    bat 'call venv\\Scripts\\activate && pip install -r requirements.txt && python manage.py runserver'
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
}
