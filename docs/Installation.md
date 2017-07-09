# Required to run:

    1. Node.js (8.x)
        1. NPM
    3. Redis
    
    (extras but... quite usefull)
    4. SSH Server (putty client)
    5. FTP Server


#  Node & NPM
   1. nvm
  
   
## Running codes
   
### Git clone

```
   1. git clone https://github.com/ibudisteanu/SkyHub-Backend-Node.js
   2. git clone https://github.com/ibudisteanu/SkyHub-Frontend-Vue.js
````
   
### `npm install`
### Backend:
    npm start 
    
### Frontend (Vue.js) version
    npm run build
    npm run start
   
   
# Redis

    TUTORIAL:     https://www.linode.com/docs/databases/redis/deploy-redis-on-ubuntu-or-debian


    1. sudo apt-get install software-properties-common  
    
    2. sudo apt-get update
    3. sudo apt-get install redis-server
    
    4. redis-cli
        127.0.0.1:6379>ping
        >> PONG
    
### Configure Redis `see the tutorial`
### Configure Persistence Options from the tutorial `see the tutorial`
### Basic System Tuning `see the tutorial`

### Distributed Redis `see the tutorial`

## password  
    
    TUTORIAL https://stackoverflow.com/questions/7537905/redis-set-a-password-for-redis

    1. nano /etc/redis/redis.conf
    2.  uncomment # requirepass my_cool_redis_password     by removing the #
    3. 
    
## restart Redis
   `sudo service redis-server restart`
   
## allow redis port firewall

   ### redis.conf
    TUTORIAL https://stackoverflow.com/a/13928537/6516672
    
   1. `nano /etc/redis/redis.conf`
   2. replace `bind 127.0.0.1` with `bind 0.0.0.0`
   3. `service redis-server restart`
   
   ###firewall (probably not required)
   1. `sudo iptables -A INPUT -p tcp --dport 6379 --jump ACCEPT`
   2. `iptables-save`
   
# No-IP DUC

    TUTORIAL: http://www.noip.com/support/knowledgebase/installing-the-linux-dynamic-update-client/