pipeline {
    agent any

    environment {
        // Environment variables
        GIT_SSH_COMMAND = 'ssh -o StrictHostKeyChecking=no'
        PATH = "/root/.nvm/versions/node/v20.17.0/bin:${env.PATH}"
        // DEPLOY_USER = 'root'  // Username for SSH
        // DEPLOY_SERVER = '82.112.238.34'  // Your VPS IP address
    }

    stages {
        stage('Prepare Environment') {
            steps {
                script {
                    // Fetch SSH credentials securely from Jenkins
                    def deployCreds = credentials('bargainwale') // Replace with your SSH credential ID
                    // def vpsIp = credentials('vps-ip') // Optional: If you also have the VPS IP as a credential
                    env.DEPLOY_USER = deployCreds.username
                    env.DEPLOY_KEY = deployCreds.password  // The private key will be stored as a password
                    // env.DEPLOY_SERVER = vpsIp ?: '82.112.238.34'  // Default to the original IP if not provided in credentials
                }
            }
        }
        
        stage('Checkout') {
            steps {
                script {
                    // Checkout the code from GitHub
                    git branch: 'main', credentialsId: 'bargainwale', url: 'git@github.com:rishvant/Bargainwale.git'
                }
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Server Dependencies') {
                    steps {
                        script {
                            dir('server') {
                                sh 'npm install'
                            }
                        }
                    }
                }

                stage('Client Dependencies') {
                    steps {
                        script {
                            dir('client') {
                                sh 'npm install'
                            }
                        }
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
                    ssh -i ${DEPLOY_KEY} -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} '
                    cd /var/www/Finance
                    git pull origin main
                    cd server && npm install
                    cd client && npm run build
                    pm2 restart all
                    sudo systemctl restart nginx
                    '
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
