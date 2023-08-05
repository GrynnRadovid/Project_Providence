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
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Build Backend') {
            agent any
            steps {
                dir('backend') {
                    sh 'pip install -r requirements.txt'
                    sh 'python manage.py migrate'
                }
            }
        }
        
        stage('Test') {
            steps {
                dir('backend') {
                    sh 'python manage.py test'
                }
            }
        }
    }
}
