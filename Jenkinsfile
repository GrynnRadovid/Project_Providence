pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Frontend') {
            agent {
                node {
                    label 'ERGOKREE'
                }
            }
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Build Backend') {
            agent {
                node {
                    label 'ERGOKREE'
                }
            }
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
        
        stage('Deploy') {
            steps {
                // Implement your deployment steps here, such as copying files to the server or using Docker.
            }
        }
    }
}
