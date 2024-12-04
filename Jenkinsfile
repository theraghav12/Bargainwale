pipeline {
    agent any

    environment {
        // Environment variables
        GIT_SSH_COMMAND = 'ssh -o StrictHostKeyChecking=no'
        PATH = "/root/.nvm/versions/node/v20.17.0/bin:${env.PATH}"
        DEPLOY_USER = 'root'  // Username for SSH
        DEPLOY_SERVER = '82.112.238.34'  // Your VPS IP address
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
        
       stage('Deploy to VPS') {
            steps {
                script {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} <<EOF
                    cd /var/www/Finance
                    git pull origin main
                    cd server && npm install
                    cd client && npm run build
                    pm2 restart all
                    sudo systemctl restart nginx
                    EOF
                    """
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
