pipeline {
    agent any

    environment {
        // Environment variables
        GIT_SSH_COMMAND = 'ssh -o StrictHostKeyChecking=no'
        PATH = "/root/.nvm/versions/node/v20.17.0/bin:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Checkout the code from GitHub
                    git branch: 'main', credentialsId: 'bargainwale', url: 'git@github.com:rishvant/Bargainwale.git'
                }
            }
        }
        
        stage('Install Dependencies - Server') {
            steps {
                script {
                    // Navigate to the server folder and install dependencies
                    dir('server') {
                        sh 'npm install'
                    }
                }
            }
        }
        
        stage('Install Dependencies - Client') {
            steps {
                script {
                    // Navigate to the client folder and install dependencies
                    dir('client') {
                        sh 'npm install'
                    }
                }
            }
        }
        
        stage('Build Client') {
            steps {
                script {
                    // Build the client (for production)
                    dir('client') {
                        sh 'npm run build'
                    }
                }
            }
        }
        
        stage('Restart Server') {
            steps {
                script {
                    // Restart PM2 to apply changes on the server
                    dir('server') {
                        sh 'pm2 restart server'
                    }
                }
            }
        }
        
        stage('Restart Nginx') {
            steps {
                script {
                    // Restart Nginx to serve the newly built client
                    sh 'sudo systemctl restart nginx'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
