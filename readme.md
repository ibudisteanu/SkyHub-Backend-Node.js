# SkyHub back-end in Express, Node.js & DB using Redis

# Online Versions:

1. myskyhub.ddns.net:8080 for Vue.js Frontend
2. myskyhub.ddns.net:4000 for Express Backend with Redis Database

**Gitter** - for communications with the SkyHub contributors:
 
1. https://gitter.im/SkyHub/SkyHubRomania 
2. https://gitter.im/SkyHub/Lobby

## Installation

1. Install Node.js : https://nodejs.org/en/download/
2. Install Redis DB : https://redis.io/download (you can also skip this step by using the skyhub demo DB)
3. gitclone repository https://github.com/ibudisteanu/SkyHub-Backend-Node.js.git . You can also install and clone using Git Windows

4. Open cmd/Terminal
    1.    `cd location\clone_repository\`
    
In case you have problems and encounter errors installing SkyHub, please contact us in the Gitter!!           

## Running backend

1. `npm start`

Using webpack (not working currently, it is a to do) 

webpack
webpack --watch


### CODES - EXAMPLES

https://github.com/expressjs/express/tree/master/examples

**DB ORM - jugglingdb - REDIS**

https://github.com/1602/jugglingdb


# TO DOs

##### Working functions

1. Login    
    1. Sessions Managment
2. Registration
    1. Facebook & Google integration
3. REST
    1. HTTP requests
    2. Socket.io
        1. JWT Authentication - it has been obsolete, now we use sessions
4. Forums                
    1. Add Forum
    2. Get Top Forums
5. Topics
    1. Add Topic     
    2. Get Top Topics
6. Replies  
    1. Add Reply     
    2. Get Top Replies
7. Efficient Sorting Algorithm 
8. URL Slugs
            
## To DOs        
    
0. Webpack
    1. Aliases for absolute locations   
    

1. Forums
    2. Edit Forum
    3. Delete Forum    
1. Topics
    2. Edit Topic
    3. Delete Topic    
5. Replies    
    5.2 Edit Reply
    5.3 Delete Reply   
6. Voting
    1. Add Voting (Up and Downs)
    2. Unvote
    3. Keeping Voting in the DB
    
    