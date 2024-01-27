# How to Deploy NRIMD Front2HPC

current version: 3.1

Section 1-5 is how to Deploy NRIMD from scratch and Section 6 is how to restart a shutdown deployed NRIMD project.

For the whole tutorial, $NRIMD_HOME is your home directory for NRIMD Front2HPC, $NRIMD_DATA_DIR is your job save directory (include uploaded trajectories, jobs results and examples).

## 1. Install Dependent Softwares 
### 1.1 REMO
```
cd $NRIMD_HOME
wget https://seq2fun.dcmb.med.umich.edu/REMO/REMO.v3.tar
tar -xjf REMO.v3.tar.bz2
```
### 1.2 DSSP
we afford the package in $NRIMD_HOME/packages/hssp-3.1.5.tar.gz 
you also can download in https://github.com/cmbi/xssp/releases 
before installing, you need 2 dependencies in your linux: automake, libboost 
if there are not the dependencies, you can install it as follow: 
```
$ sudo apt-get install automake
$ sudo apt-get install libboost-all-dev
```
now install dssp
```
$ cd $DSSP_HOME 
$ tar -zxvf $NRIMD_HOME/extradata/packages/hssp-3.1.5.tar.gz
$ cd hssp-3.1.5
$ ./autogen.sh
$ ./configure #./configure --prefix=$your_path
$ make -j 8
$ make mkhssp
$ sudo make install
```
finally, check DSSP executable path 
```
$ whereis mkdssp 
$ ls /usr/local/bin/mkhss 
```
default path is /usr/local/bin/mkhss 

### 1.3 CNA
we afford the package in $NRIMD_HOME/packages/CNA.zip
now CNA url is https://cpclab.uni-duesseldorf.de/data/_uploaded/software/visualCNA_1.1.tar.gz, but it has a gui and we don't test it
for a convenient installation, we suggest using the package we afford
install according to following:
```
$ cd $NRIMD_HOME
$ unzip $NRIMD_HOME/packages/CNA.zip
$ cd CNA
$ make install
```
it will cost some time, maybe 40~60 minutes, please wait patiently 
after installing CNA successfully, you need replace $DSSP_EXE with your $DSSP_EXE (my path is /usr/local/bin/mkhss) at line5 in $NRIMD_HOME/algorithm/cna/CNA.sh:
```
...line4
DSSP_EXE="/usr/local/bin/mkhssp" 
...line6
```
### 1.4 R
```
$ sudo apt-get install r-base-core
$ install.packages("bio3d", dependencies=TRUE)
```

## 2.Backend
### 2.1 install miniconda (usually have)
```
$ wget https://repo.anaconda.com/miniconda/Miniconda3-py38_23.10.0-1-Linux-x86_64.sh
$ bash Miniconda3-py38_23.10.0-1-Linux-x86_64.sh
> yes
> yes
> yes
$ source ~/.bashrc
```
### 2.2 install python dependencies (use new version)
```
$ pip install django django-cors-headers djangorestframework django-filter django-apscheduler apscheduler scikit-learn numpy pandas joblib torch django-environ
```
### 2.3 create NRIMD backend
``` 
$ cd $NRIMD_HOME
$ mkdir NRIMD3
$ cd NRIMD3
$ django-admin startproject backend
$ cd backend
$ python manage.py startapp nrimd

```

### 2.4 config settings.py 
now you need configure settings.py $NRIMD_HOME/NRIMD3/backend/backend/settings.py
#### 2.4.1 set some constants
```
import os
import environ
NRIMD_DATA_DIR = '/media/volume/sdb/jobs/' # the path to save job data
PV_PDB_DIR = '/home/exouser/NRIproject/NRIMD3/frontend/public/pdbs/' # dir must be in the ***/frontend/public/
FROM_EMAIL = 'nrimdserver@gmail.com'
WEBSITE = 'https://nrimd.luddy.iupui.edu'
NRI_COMPUTE_LOCALHOST = False
OTHER_METHODS_COMPUTE_LOCALHOST = True
REMO_DIR = '/home/exouser/NRIproject/REMO/REMO.pl'
CNA_DIR = "/home/exouser/NRIproject/CNA"
```
#### 2.4.2 change ALLOWED_HOSTS, INSTALLED_APPS and MIDDLEWARE correspondingly
```
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'nrimd',
    'django_apscheduler',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```
#### 2.4.3 finally set email configurations



here is tutorial for how to send email to users according to https://www.sitepoint.com/django-send-email/ by gmail

+ create .env in the same level of settings.py: EMAIL_HOST=smtp.gmail.com 
```
EMAIL_HOST_USER=nrimdserver@gmail.com 
EMAIL_HOST_PASSWORD=XXXXXXXX
EMAIL_HOST=smtp.gmail.com
```
+ the put below to $NRIMD_HOME/NRIMD3/backend/backend/settings.py

```
env = environ.Env()
environ.Env.read_env()
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = env('EMAIL_HOST')
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD') #past the key or password app here
EMAIL_PORT = 587
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'default from email'                         
```

+ 
Test email
```
$ cd $NRIMD_HOME/NRIMD3/backend/
$ python manage.py shell
>>>from django.core.mail import send_mail
>>>from django.conf import settings send_mail('A cool subject', 'A stunning message', settings.EMAIL_HOST_USER, ['wang.juexin@gmail.com']) 
```
### 2.5 replace folds and set examples 
#### 2.5.1 replace nrimd folder with backend/nrimd folder we afford
#### 2.5.2 create directories
```
mkdir($NRIMD_DATA_DIR/jobs)
mkdir($NRIMD_DATA_DIR/aa_trajs)
mkdir($NRIMD_DATA_DIR/ca_trajs)
```
#### 2.5.3 move serveral example files
move backend/sod_example and backend/psh_example to $NRIMD_DATA_DIR
move backend/example_aa_traj $NRIMD_DATA_DIR/aa_trajs/example_aa_traj.pdb

### 2.6 Start backend
```
python manage.py migrate
python manage.py makemigrations
python manage.py migrate
```

## 3. Frontend 

### 3.1 create frontend project
``` 
$ sudo apt install nodejs npm yarn
$ npx create-react-app frontend
```

### 3.2 install dependencies
``` 
$ cd frontend  
$ npm i antd redux react-redux react-router-dom axios less less-loader moment react-cookie-consent recharts echarts-for-react --save  
$ npm install bio-pv --save

```
### 3.3 eject and configure
#### 3.3.1 eject
``` 
$ git init  
$ git config user.name heyi21  
$ git config user.email heyi21@mails.jlu.edu.cn  
$ git add .  
$ git commit -m 'beforeEject'  
$ npm run eject
```
#### 3.3.2 configure less  
add this to "frontend/config/webpack.config.js" after line 545, 
```
{
  test: /\.less$/,
    use: getStyleLoaders(
      {
        //not config now
      },
      'less-loader'
    ),
},
```
now can write less, attend if you want change antd css style,  
you should add " @import '~antd/dist/antd.css'; " to first line of less file

#### 3.3.3 configure cross domain (can not set)
replace config/webpackDevServer.config.js line 103 with this 
```
proxy: {
  '/api': {
    target: 'http://127.0.0.1:8000',
    changeOrigin: true, //if cross domain
    pathRewrite: { '^/api': '/' }
  }
},
```
now backend 'http://127.0.0.1:8000' has a new name '^/api',  
if you want create yourself axios request, you should set axiosOption=  {baseURL: '/api',...}, but now we provided it

### 3.4 replace folders

replace src folder and public folder with we afford

### 3.5 start
```
npm run start
```

#### 4.1 Deploy nginx (HTTPS)
```
$ sudo apt install net-tools
$ netstat -anpt|grep 80
$ apt install nginx-full
$ cd /etc/nginx/
$ cp -a /home/exouser/nrimd.luddy.iupui.edu.key.2023_12_18 /etc/nginx/certs/nrimd_luddy_iupui_edu.key 
#cert is  etc/nginx/certs/nrimd_luddy_iupui_edu.pem;
```

#### 4.2 Deploy nginx
vi /usr/local/nginx/conf/nginx.conf

```
server {
        listen 80 ;
        listen 443 ssl ;
        server_name nrimd.luddy.iupui.edu;

        ssl_certificate /etc/nginx/certs/nrimd_luddy_iupui_edu.pem;
        ssl_certificate_key /etc/nginx/certs/nrimd_luddy_iupui_edu.key;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
        ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
        ssl_prefer_server_ciphers on;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;
        add_header Strict-Transport-Security "max-age=31536000";
        error_page 497 https://$host$request_uri;
        if ($scheme = 'http'){
            return 301 https://$host$request_uri;
        }
        location / {
          proxy_pass http://127.0.0.1:3000;
        }
        location /api/ {
             #proxy_set_header Host $host;
             proxy_set_header   X-real-ip $remote_addr;
             proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_pass http://127.0.0.1:8000/;
        }
}

```
```
$ nginx -s reload
```

## 5. HPC:
### 5.1 communicate NRIMD frontend to HPC backend

You will need an account on BR200; this account should sign the “SSH key agreement” and be able to login without DUO (https://kb.iu.edu/d/brcc#access)
Example steps to submit a job to BR200 from the external server:
SCP the files/data/job script that you need for the job to BR200 (https://kb.iu.edu/d/agye)
```
scp job.slurm username@bigred200.uits.iu.edu:/path/to/workdir
scp -r other-files username@bigred200.uits.iu.edu:/path/to/workdir
```
ssh username@bigred200.uits.iu.edu sbatch /path/to/workdir/job.slurm
SCP the output files back to your server

Access BigRed 200
https://kb.iu.edu/d/brcc#access

Access Carbonate
https://kb.iu.edu/d/aolp

Set up key
https://kb.iu.edu/d/aews

git clone -b webserver --single-branch https://github.com/juexinwang/NRI-MD.git

### 5.2 crontab
set up crontab:
```
# crontab -e
```
Every 5 minutes to check the status. (NRI-MD_daemon_communication.py)
```
# */5 * * * * /home/exouser/anaconda3/bin/python /home/exouser/NRIproject/Front2HPC/NRI-MD_daemon_communication.py >> /media/volume/sdb/daemonlog.txt 2>&1
```
Delete results in 14 days, but run every week
```
# 0 0 * * 0 find /media/volume/sdb/jobs/files -mtime +14 -type f -delete
# 0 0 * * 0 find /home/exouser/NRIproject/Front2HPC/pv/pdbs/ -mtime +14 -type f -delete
```
delete on every sunday, details in NRI-MD_daemon_communication.py

Moniter open ports
```
sudo netstat -tulpn | grep LISTEN
```


### 5.3 kernel
URL of slurm

[https://kb.iu.edu/d/awrz](https://kb.iu.edu/d/awrz)

[https://kb.iu.edu/d/avjk](https://kb.iu.edu/d/avjk)

```
#!/bin/bash
#SBATCH -J job_name
#SBATCH -p gpu
#SBATCH -o filename_%j.txt
#SBATCH -e filename_%j.err
#SBATCH --nodes=1
#SBATCH --gpus-per-node 1
#SBATCH --time=02:00:00
#Load any modules that your program needs
module load deeplearning
#Run your program
srun python main.py
ssh [soicwang@bigred200.uits.iu.edu](mailto:soicwang@bigred200.uits.iu.edu)
scp t1.slurm [soicwang@bigred200.uits.iu.edu](mailto:soicwang@bigred200.uits.iu.edu):~/t1
ssh [soicwang@bigred200.uits.iu.edu](mailto:soicwang@bigred200.uits.iu.edu) sbatch /N/u/soicwang/BigRed200/t1/t1.slurm
```



## 6 Restart of the project
this section is for how to restart a shutdown deployed NRIMD project
### 6.1 backend
```
screen 
conda activate nrimd
cd /home/exouser/NRIproject/NRIMD3/backend/
python manage.py runserver
Ctrl + AD 
```
### 6.2 frontend
```
screen 
cd /home/exouser/NRIproject/NRIMD3/frontend/
npm run start
Ctrl + AD 
```



