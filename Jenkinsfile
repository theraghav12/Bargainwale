pipeline {
    agent any

    environment {
        DEPLOY_USER = 'root'
        DEPLOY_SERVER = '82.112.238.34'
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
                    ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} '
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
