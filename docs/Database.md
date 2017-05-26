# Description of the Redis SkyHub DB

We need to understand that **Redis is a HASHING database**. So in order to accomplish optimization, we need **every time to know what to ask from the DATABASE**, by this way we will have **O(1) complexity**

## FORUMS, TOPICS called COMMON OBJECTS

These are a complex models which will contain information about their objects. 

**They have `only one direct parent` and can have `unlimited grand-parents`**

Grand-parent = a parent of another parent of the object. It can be unlimited
 
 
1. Title, Description, Icon, Cover etc,
2. Direct Parent of another forum - **parentId**
3. Materialized Parents - a list of all indirect grand-parents

For instance:

Science      =>    Physics =>  Computer Science => Software Engineering => C++
           
           
|         Name         |  Forum1 |  Forum2 |      Forum3      |        Forum4        |  Forum5 |  Topic1 in C++ |     Topic 2 in Computer Science    | Topic3 in Software Engineering |
|:--------------------:|:-------:|:-------:|:----------------:|:--------------------:|:-------:|:--------------:|:----------------------------------:|--------------------------------|
|                      | Science | Physics | Computer Science | Software Engineering |   C++   | C++ is Awesome | Quantum Computing close to reality | New IDEs for Node.js           |
|          ID          |    1    |    2    |         3        |           4          |    5    |     Top102     |               Top1333              | Top1553                        |
|        Parent        |   NULL  |    1    |         2        |           3          |    4    |        5       |                  3                 | 4                              |
| Materialized Parents |   NULL  |    1    |        1,2       |         1,2,3        | 1,2,3,4 |    1,2,3,4,5   |                1,2,3               | 1,2,3,4                        |
           
           
## Knowing the most POPULAR topics/forums ##
           
In order to calculate which are the best topics on Frontpage or Any Forum (eq: Science), we will keep another table **popularity for Parent X**

                
Frontpage => Children for Id = NULL (**topics where Parent or Materialized Parents include Id=NULL**)                
                
| Popularity Index | Topic Id |             Topic Name             | Popularity Coefficient |
|------------------|:--------:|:----------------------------------:|:----------------------:|
| 1                |  Top1333 | Quantum Computing close to reality |          55.3          |
| 2                |  Top1553 |        New IDEs for Node.js        |          22.1          |
| 3                |  Top102  |           C++ is Awesome           |          13.2          |        


Software Engineering => Children for Id = 4 (**topics where Parent or Materialized Parents include Id=4*)                
                
| Popularity Index | Topic Id |      Topic Name      | Popularity Coefficient |
|------------------|:--------:|:--------------------:|:----------------------:|
| 1                |  Top1553 | New IDEs for Node.js |          22.1          |
| 2                |  Top102  |    C++ is Awesome    |          13.2          |