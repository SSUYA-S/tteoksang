# Tteoksang Porting Manual

## 개발환경
- IntelliJ IDEA 2023.3 Community
- openjdk 17.0.2 2022-01-18
    - Spring Boot: 3.2.1
- nodeJS 18.19
    - React: 18.2.0
- python 3.11.7
    - FastAPI: 0.109.2
- AWS EC2 Ubuntu 20.04.6 LTS (GNU/Linux 5.15.0-1051-aws x86_64)
---
## EC2 설정
### 서버 시간 변경
```
sudo timedatectl set-timezone Asia/Seoul
```

### 미러서버 변경
```
sudo sed -i 's/ap-northeast-2.ec2.archive.ubuntu.com/mirror.kakao.com/g' /etc/apt/sources.list
```

### 패키지 목록 업데이트 및 패키지 업데이트
```
sudo apt-get -y update && sudo apt-get -y upgrade
```

### Swap 영역 할당
```
sudo fallocate -l 4G /swapfile
```
```
sudo chmod 600 /swapfile
```
```
sudo mkswap /swapfile
```
```
sudo swapon /swapfile
```
```
sudo echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```
---

## Docker
### Docker 설치전 필요 패키지 설치
```
sudo apt-get -y install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
```

### GPC Key 인증
```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```
### apt 명령어에 Docker repository 등록
```
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

### 패키지 리스트 갱신
```
sudo apt-get -y update
```

### Docker 패키지 설치
```
sudo apt-get -y install docker-ce docker-ce-cli containerd.io
```
### Docker Compose 설치
```
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```
```
sudo chmod +x /usr/local/bin/docker-compose
```
---

## Jenkins
### Jenkins 컨테이너 생성
```
docker pull jenkins/jenkins:jdk17
```

```
docker run -d --restart always --env JENKINS_OPTS=--httpPort=8080 -v /etc/localtime:/etc/localtime:ro -e TZ=Asia/Seoul -p 8080:8080 -v /jenkins:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -v /usr/local/bin/docker-compose:/usr/local/bin/docker-compose --name jenkins -u root jenkins/jenkins:jdk17
```
### Jenkins 플러그인 미러서버 변경
```
sudo docker stop jenkins
```

```
sudo mkdir /jenkins/update-center-rootCAs
```

```
sudo wget https://cdn.jsdelivr.net/gh/lework/jenkins-update-center/rootCA/update-center.crt -O /jenkins/update-center-rootCAs/update-center.crt
```

```
sudo sed -i 's#https://updates.jenkins.io/update-center.json#https://raw.githubusercontent.com/lework/jenkins-update-center/master/updates/tencent/update-center.json#' /jenkins/hudson.model.UpdateCenter.xml
```

```
sudo docker restart jenkins
```

### 첫 젠킨스 접근
```
docker exec -it jenkins /bin/bash
```

```
cd /var/jenkins_home/secrets
```

```
cat initialAdminPassword
```

- 위의 명령어를 통해 초기 비밀번호를 확인 후 localhost:8080으로 접속하여 사용

### Jenkins 기본 플러그인 설치
- Install suggested plugins 사용

### 관리자 계정 설정
- 주어진 입력 폼에 맞춰 관리자 계정 생성

### Jenkins 내부에 Docker, Docker Compose 설치
```
docker exec -it jenkins /bin/bash
```

```
apt-get update && apt-get -y install apt-transport-https ca-certificates curl gnupg2 software-properties-common && curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg > /tmp/dkey; apt-key add /tmp/dkey && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") $(lsb_release -cs) stable" && apt-get update && apt-get -y install docker-ce
```

```
groupadd -f docker
```

```
usermod -aG docker jenkins
```

```
chown root:docker /var/run/docker.sock
```

```
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

### 추가 플러그인 설치 목록
```
SSH Agent

Docker
Docker Commons
Docker Pipeline
Docker API

Generic Webhook Trigger

GitLab
GitLab API
GitLab Authentication
GitHub Authentication

NodeJS
Gradle
```

### Credential 설정
#### GitLab Credential
- 사용할 gitlab에 접근하기 위한 계정 정보
- Kind : Username with password 선택
- Username : Gitlab 계정 아이디 입력
- Password : Gitlab 계정 비밀번호 입력 **(토큰 발행시, API 토큰 입력)**
- ID : Credential을 구분하기 위한 별칭

#### GitLab API Token
- GitLab이 제공하는 API를 사용하기 위한 토큰
- Kind : Gitlab API token 선택
- API tokens : Gitlab 계정 토큰 입력
    - 사용하는 gitlab repo > settings > AccessTokens > Add new Tokens 을 통해 생성
- ID : Credential을 구분하기 위한 별칭

#### Webhook
- Jenkins에서 Jenkins 관리 > System > GitLab
    - Enable authentication for '/project' end-point 체크
    - Name: 해당 연결에 대한 이름 지정
    - GitLab host URL: 사용하는 repo의 host URL. SSAFY 기준 https://lab.ssafy.com
    - Credentials: 위에서 설정한 GitLab API Token ID
    - Test Connetion을 통해 확인후 저장
- 사용할 Pipeline 생성 후 build trigger 설정
    - pipeline > configure > General > Build Triggers
    - Build when a change is pushed to Gitlab 체크
    - Push Events 체크
    - Opened Merge Request Events 체크
    - Approved Merge Request (EE-only) 체크
    - Comments 체크
    - 하단 고급 > Secret token Generate 후 복사
- Gitlab repo > Settings > Webhooks > Add new webhook
    - URL: http://(젠킨스주소)/project/(pipeline 이름)
    - Secret Token: 위에서 저장한 secret token

#### Docker Hub Token
- docker hub 계정 생성
- 우측 상단 계정명 > Account Settings
- Security > New Access Token
    - 모든 Access 권한을 지정한 후 Generate후 복사
- Jenkins 관리 > Credentials
    - Kind : Username with password
    - Username : DockerHub에서 사용하는 계정 아이디 입력
    - Password : 위에서 저장한 Access Token 입력
    - ID : Credential을 구분하기 위한 별칭

#### Ubuntu Credential 추가
- Jenkins 관리 > Credentials
    - Kind: SSH Username with private key
    - Username: SSH 원격 서버 호스트에서 사용하는 계정명
    - ID: Credential을 구분하기 위한 별칭
    - Enter directly를 체크하고 private key의 값 입력후 create

#### Secret File 추가
- 아래에 설명할 .env 저장
- Jenkins 관리 > Credentials
    - Kind: Secret file
    - File: 저장할 파일 선택

#### .env
- 배포용 .env 파일.
```
# DB
DB_NAME=[DB 이름]
USER_NAME=[DB 유저명]
USER_PASSWORD=[DB 유저 비밀번호]
DB_URL=[DB 접속 URL]

# MongoDB
MONGO_DB_ROOT_USER_NAME=[MONGODB 유저명]
MONGO_DB_ROOT_USER_PASSWORD=[MONGO DB 유저 비밀번호]

# MongoExpress
MONGO_EXPRESS_USER_NAME=[MONGO EXPRESS 유저명]
MONGO_EXPRESS_USER_PASSWORDMONGO=[MONGO EXPRESS 유저 비밀번호

# Initializer
HOST_NAME=[MONGODB 컨테이너 명]

# Backend MongoDB Host
MONGO_HOST=[MONGODB 컨테이너 명]

# Redis
REDIS_SENTINEL_HOST=[master node 컨테이너 명]
REDIS_SENTINEL_NODE1_PORT=[port 번호 1]
REDIS_SENTINEL_NODE2_PORT=[port 번호 2]
REDIS_SENTINEL_NODE3_PORT=[port 번호 3]
REDIS_MASTER=[master 이름]
REDIS_PASSWORD=[redis 비밀번호]

# Google
GOOGLE_CLIENT_ID=[구글 클라이언트 아이디]
GOOGLE_CLIENT_SECRET=[구글 클라이언트 키값]
GOOGLE_REDIRECT_URL=[구글 로그인 리다이렉션 url]
AUTH_REDIRECT_URL=[인증 리다이렉션 url]

# JWT
JWT_KEY=[JWT 생성을 위한 키]

# DATA
KAMIS_CERT_KEY=[농산물 정보 API key]
KAMIS_CERT_ID=[key 발급 id]

# FRONTEND
VITE_REACT_GOOGLE_LOGIN_URL=h[구글 로그인 리다이렉션 url]
VITE_REACT_API_URL=[api 호출 url]
VITE_REACT_WEBSOCKET_URL=[웹소켓 핸드쉐이크 url]
VITE_TURN_PERIOD_SEC=[프론트 1턴 시간]

# GAME_TURN_PERIOD (초 단위)
TURN_PERIOD_SEC=20=[백엔드 1턴 시간]
#반기 결산 휴식 주기(초 단위)
HALF_YEAR_BREAK_SEC=10=[결산에 필요한 시간]

#게임 - 턴 기준 주기
EVENT_ARISE_TURN_PERIOD=[이벤트 발생 주기]
QUARTER_YEAR_TURN_PERIOD=[계절 주기]
BUYABLE_PRODUCT_TURN_PERIOD=[구매 가능 작물 변경 주기]

#실행될 처음 턴
EVENT_ARISE_INITIAL_TURN=[초기 이벤트 발생 턴]
NEWS_PUBLISH_INITIAL_TURN=[초기 뉴스 발행 턴]

# GAME_EVENT_DATE (cron =" * * * * * *": "초 분 시 일 월 요일", 요일: 0~6=SUN ~ SAT)
SEASON_START_DATE=[시즌 시작일]
SEASON_YEAR_PERIOD=[한 시즌 주기]

#GAME_CONSTANT
RENT_FEE=[임대료]

#KAFKA
KAFKA_BOOTSTRAP_SERVERS=[카프카 서버 url]
KAFKA_CONSUMER_GROUP_ID=[백엔드 서버 group id]
KAFKA_TOPIC_LOG [카프카 topic]

#DATA SPRING
DATA_KAFKA_BOOTSTRAP_SERVERS=[데이터서버 기준 카프카 서버 url]
DATA_KAFKA_CONSUMER_GROUP_ID=[데이터 서버 group id]
DATA_KAFKA_TOPIC=[카프카 topic]
LOG_PATH=[로그 저장 기본 경로]
AIRFLOW_URL=[airlfow url]

#DATA_SERVER
DATA_SERVER_URL=[데이터 서버 api요청 url]
#http://localhost:8080
```
---

### 빌드용 tools 설정
- Jenkins > Jenkins 관리 > Tools
- > Gradle installations > Add Gradle
    - name: Tool을 구분하기 위한 별칭
    - version: backend에서 사용중인 Gradle version
- > NodeJS installations > Add NodeJS
    - name: Tool을 구분하기 위한 별칭
    - version: frontend에서 사용중인 NodeJs version

---

### 파이프라인 설정
```
pipeline {
    agent any
    
    environment {
        frontendImageName = 'ssuyas/tteoksang_frontend'
        backendImageName = 'ssuyas/tteoksang_backend'
        loggerImageName = 'ssuyas/tteoksang_logger'
        registryCredential = 'ssuyas-DockerHub'
        
        releaseServerAccount = 'ubuntu'
        releaseServerUri = 'j10a510a.p.ssafy.io'
        dataServerUri = 'j10a510.p.ssafy.io'
    }
    
    tools {
        gradle 'gradle8.5'
        nodejs 'nodejs18.19'
    }
        
    stages {
        stage('Git Clone') {
            steps {
                git branch: 'infra/deploy',
                    credentialsId: 'leemy08-GitLab	',
                    url: 'https://lab.ssafy.com/s10-bigdata-dist-sub2/S10P22A510'
            }
        }
        
        stage("Replace logback-spring.xml To Server") {
            steps {
                dir('backend') {
                    withCredentials([file(credentialsId:'logback-spring.xml', variable: 'xml')]) {
                        sh 'rm -rf ./src/main/resources/logback-spring.xml'
                        sh 'cp -f ${xml} ./src/main/resources/'
                    }
                }
            }
        }
        
        stage('Backend Jar Build') {
            steps {
                dir ('backend') {
                    sh 'gradle clean bootjar'
                }
            }
        }
        
        stage('Backend Image Build & DockerHub Push') {
            steps {
                dir('backend') {
                    script {
                        docker.withRegistry('', registryCredential) {
                            sh "docker buildx create --use --name mybuilder"
                            sh "docker buildx build --platform linux/amd64,linux/arm64 -t $backendImageName:$BUILD_NUMBER --push ."
                            sh "docker buildx build --platform linux/amd64,linux/arm64 -t $backendImageName:latest --push ."
                        }
                    }
                }
            }
        }
        
        stage('Logger Jar Build') {
            steps {
                dir ('data') {
                    sh 'gradle clean bootjar'
                }
            }
        }
        
        stage('Logger Image Build & DockerHub Push') {
            steps {
                dir('data') {
                    script {
                        docker.withRegistry('', registryCredential) {
                            sh "docker buildx create --use --name mybuilder"
                            sh "docker buildx build --platform linux/amd64,linux/arm64 -t $loggerImageName:$BUILD_NUMBER --push ."
                            sh "docker buildx build --platform linux/amd64,linux/arm64 -t $loggerImageName:latest --push ."
                        }
                    }
                }
            }
        }
        
        stage("Copy docker-compose To Data Server") {
            steps {
                dir('docker-compose') {
                    sshagent(credentials: ['ubuntu']) {
                    sh '''
                    scp -o StrictHostKeyChecking=no -r ./hadoop/docker-compose.yml $releaseServerAccount@$dataServerUri:/home/ubuntu/docker
                    '''
                    }
                }
            }
        }
        
        stage('hadoop Jar Build') {
            steps {
                dir ('hadoop') {
                    sh 'gradle clean jar'
                }
            }
        }
        
        stage("Copy Hadoop jar To Data Server") {
            steps {
                dir('hadoop') {
                    sshagent(credentials: ['ubuntu']) {
                    sh '''
                    scp -o StrictHostKeyChecking=no -r ./build/libs/hadoop-1.0-WELCOME.jar $releaseServerAccount@$dataServerUri:/home/ubuntu/docker/jars/hadoop.jar
                    '''
                    }
                }
            }
        }
        
        stage('Node Build') {
            steps {
                dir ('frontend') {
                    withCredentials([file(credentialsId:'dotenv', variable: 'dotenv')]) {
                        sh 'cp ${dotenv} ../'
                        sh 'npm add @rollup/rollup-linux-x64-gnu'
                        sh 'npm add @esbuild/linux-x64 --omit=optional'
                        sh 'npm install'
                        sh 'npm run build'
                    }
                }
            }
        }
        
        stage('Front Image Build & DockerHub Push') {
            steps {
                dir('frontend') {
                    script {
                        docker.withRegistry('', registryCredential) {
                            sh "docker buildx create --use --name mybuilder"
                            sh "docker buildx build --platform linux/amd64,linux/arm64 -t $frontendImageName:$BUILD_NUMBER --push ."
                            sh "docker buildx build --platform linux/amd64,linux/arm64 -t $frontendImageName:latest --push ."
                        }
                    }
                }
            }
        }
        
        stage("Copy SQL To Server") {
            steps {
                dir('docker-compose') {
                    sshagent(credentials: ['ubuntu']) {
                    sh '''
                    scp -o StrictHostKeyChecking=no -r ./initdb.d $releaseServerAccount@$releaseServerUri:/home/ubuntu/docker
                    '''
                    }
                }
            }
        }
        
        stage("Copy Event Data To Server") {
            steps {
                dir('docker-compose') {
                    sshagent(credentials: ['ubuntu']) {
                    sh '''
                    scp -o StrictHostKeyChecking=no -r ./mongodb/filtered_season_event.json $releaseServerAccount@$releaseServerUri:/home/ubuntu/docker/event.json
                    '''
                    }
                }
            }
        }
        
        stage("Copy backend & frontend docker-compose To Server") {
            steps {
                dir('docker-compose') {
                    sshagent(credentials: ['ubuntu']) {
                    sh '''
                    scp -o StrictHostKeyChecking=no -r ./deploy/docker-compose.yml $releaseServerAccount@$releaseServerUri:/home/ubuntu/docker/docker-compose.yml
                    '''
                    }
                }
            }
        }
        
        stage("Copy db docker-compose To Server") {
            steps {
                dir('docker-compose') {
                    sshagent(credentials: ['ubuntu']) {
                    sh '''
                    scp -o StrictHostKeyChecking=no -r ./deploy/docker-compose-db.yml $releaseServerAccount@$releaseServerUri:/home/ubuntu/docker/docker-compose-db.yml
                    '''
                    }
                }
            }
        }
        
        stage('Copy .env To Server') {
            steps {
                withCredentials([file(credentialsId: 'dotenv', variable: 'dotenv')]) {
                    sshagent(credentials: ['ubuntu']) {
                        sh 'scp -o StrictHostKeyChecking=no -r ${dotenv}  $releaseServerAccount@$releaseServerUri:/home/ubuntu/docker/.env'
                        sh 'scp -o StrictHostKeyChecking=no -r ${dotenv}  $releaseServerAccount@$dataServerUri:/home/ubuntu/docker/.env'
                    }
                }
            }
        }
        
        stage('Service Stop') {
            steps {
                script {
                    sshagent(credentials: ['ubuntu']) {
                        // 컨테이너가 실행 중인지 확인
                        def containerStatus = sh(script: 'ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "sudo docker ps -q --filter name=TteoksangFrontend --filter name=TteoksangBacktend | wc -l"', returnStdout: true).trim()
        
                        if (containerStatus.toInteger() > 0) {
                            // 컨테이너가 실행 중인 경우에만 작업 수행
                            sh 'ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "cd /home/ubuntu/docker; sudo docker-compose -f docker-compose.yml down"'
                        }
        
                        // 이미지가 존재하는지 확인
                        def frontendImageExist = sh(script: 'ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "sudo docker images -q $frontendImageName:latest | wc -l"', returnStdout: true).trim()
                        def backendImageExist = sh(script: 'ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "sudo docker images -q $backendImageName:latest | wc -l"', returnStdout: true).trim()
        
                        if (frontendImageExist.toInteger() > 0) {
                            // 프론트엔드 이미지가 존재하는 경우에만 삭제
                            sh 'ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "sudo docker rmi $frontendImageName:latest"'
                        }
        
                        if (backendImageExist.toInteger() > 0) {
                            // 백엔드 이미지가 존재하는 경우에만 삭제
                            sh 'ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "sudo docker rmi $backendImageName:latest"'
                        }
                    }
                }
            }
        }
        
        stage('Service Start') {
            steps {
                script {
                    sshagent(credentials: ['ubuntu']) {
                        sh 'ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "cd /home/ubuntu/docker; sudo docker-compose up -d"'
                    }
                }
            }
        }
    }
}
```

---

## 실행

### Google OAuth2 사용을 위한 설정

- [https://cloud.google.com/](https://cloud.google.com/) 접속 및 로그인
- 우측 상단 ‘콘솔’ 클릭
- 프로젝트 선택 → 새 프로젝트 → 만들기

  <img width="700" alt="image" src="/exec/image/Untitled 6.png" style="border: 1px solid darkgray;">

- 생성한 프로젝트 선택
- API 및 서비스 > 사용자 인증 정보 > 사용자 인증 정보 만들기 > OAuth 클라이언트 ID > 동의 화면 구성

  <img width="700" alt="image" src="/exec/image/Untitled 7.png" style="border: 1px solid darkgray;">

  .

  <img width="800" alt="image" src="/exec/image/Untitled 8.png" style="border: 1px solid darkgray;">

- User Type은 ‘외부’ 선택 후 ‘만들기’ 클릭

  <img width="700" alt="image" src="/exec/image/Untitled 9.png" style="border: 1px solid darkgray;">


- [OAuth 동의 화면]
    - 앱 이름, 사용자 지원 이메일, 앱 도메인, 개발자 연락처 정보 입력 후 ‘저장 후 계속’ 버튼 클릭

      <img width="700" alt="image" src="/exec/image/Untitled 10.png" style="border: 1px solid darkgray;">

- [범위]
    - ‘범위 추가 또는 삭제’ 버튼 클릭 → email, profile, openId 선택 후 아래 ‘업데이트’ 버튼 클릭

      <img width="700" alt="image" src="/exec/image/Untitled 11.png" style="border: 1px solid darkgray;">

    - 저장 후 계속 버튼 클릭

      <img width="700" alt="image" src="/exec/image/Untitled 12.png" style="border: 1px solid darkgray;">

- [테스트 사용자]
    - 테스트 사용자 필요 시 테스트 사용자 추가 후 ‘저장 후 계속’ 버튼 클릭

      <img width="700" alt="image" src="/exec/image/Untitled 13.png" style="border: 1px solid darkgray;">

- 좌측 ‘사용자 인증 정보’ 클릭 → 사용자 인증 정보 만들기 > OAuth 클라이언트 ID

  <img width="700" alt="image" src="/exec/image/Untitled 14.png" style="border: 1px solid darkgray;">

- 애플리케이션 유형, 이름, 승인된 리디렉션 URI 작성 후 ‘만들기’ 버튼 클릭
    - 애플리케이션 유형 : 웹 애플리케이션
    - **승인된 리디렉션 URI : (도메인)**/login/oauth2/code/google

      → .env의 `GOOGLE_REDIRECT_URL`

  <img width="700" alt="image" src="/exec/image/Untitled 15.png" style="border: 1px solid darkgray;">

- 클라이언트 ID, 클라이언트 보안 비밀번호 별도 저장 (비밀번호는 추후 재확인 불가)
    - 클라이언트 ID → .env의 `GOOGLE_CLIENT_ID`
    - 클라이언트 보안 비밀번호 → .env의 `GOOGLE_CLIENT_SECRET`

  <img width="800" alt="image" src="/exec/image/Untitled 16.png">

---

## 실행
### 빌드 없이 실행
- 위의 과정을 모두 진행 한 후

```
sudo docker-compose up -d
```

### CI/CD 실행
- 위 과정을 모두 진행 한 후, Jenkins에서 빌드 수행


## 시연 시나리오
- [프로젝트 README.md 참고](../README.md)
