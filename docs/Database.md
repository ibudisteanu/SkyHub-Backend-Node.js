# Description of the Redis SkyHub DB

We need to understand that **Redis is a HASHING database**.

In order to accomplish the optimization (getting all the BENEFITS of Redis and hashing), we need **every time to know what to ask the DATABASE**, by this way we will have **O(1) complexity for all queries** . In case we need to ask for multiple items, the running complexity will be O(1) * N, where N is the number of items = O(n) - liniar

## FORUMS, TOPICS called COMMON OBJECTS

### The purpose is to enable NESTED objects (like a forum includes other sub-forums that may have other sub-sub-forms, etc...)

These are complex models which will store in the Redis Database the required information about their objects (like Title, Description, Author, etc).

**They have `only one direct parent` and can have `unlimited grand-parents`**

```Grand-parent = a parent of (any other parent of the object). It can be unlimited. A parent of another parent is a GrandParent```
 
 
1. Title, Description, Icon, Cover etc, (common information)
2. Direct Parent of another forum - **parentId**
3. Materialized Parents - a list of all indirect grand-parents and parent

For instance:

                         Science  =>  Physics => Computer Science => Software Engineering => C++
           
           
|         Name         |  Forum1 |  Forum2 |      Forum3      |        Forum4        |  Forum5 |  Topic1 in C++ |     Topic 2 in Computer Science    | Topic3 in Software Engineering |
|:--------------------:|:-------:|:-------:|:----------------:|:--------------------:|:-------:|:--------------:|:----------------------------------:|--------------------------------|
|                      | Science | Physics | Computer Science | Software Engineering |   C++   | C++ is Awesome | Quantum Computing close to reality | New IDEs for Node.js           |
|          ID          |    1    |    2    |         3        |           4          |    5    |     Top102     |               Top1333              | Top1553                        |
|        Parent        |   NULL  |    1    |         2        |           3          |    4    |        5       |                  3                 | 4                              |
| Materialized Parents |   NULL  |    1    |        1,2       |         1,2,3        | 1,2,3,4 |    1,2,3,4,5   |                1,2,3               | 1,2,3,4                        |
           
           
## Knowing the most POPULAR topics/forums using POPULARITY TABLE ##
           
In order to calculate which are the best topics on the Front-page or Any Forum (eq: Science), we will keep another table **popularity for Parent X**

                
FrontPage => Children for Id = NULL (**topics where Parent or Materialized Parents include Id=NULL**)
                
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

### Keeping the POPULARITY TABLE

Each time, there is an event (Vote, Comment) that **MAY CHANGE the POPULARITY COEFFICIENT**, a function will be triggered that will recalculate the POPULARITY Coefficient and Update all the POPULARITY TABLES that contains that element. So for this, we will get and update all the POPULARITY tables for each MATERIALIZED PARENT thus **updating the new position of the Topic based on its popularity in  its materialized grand-parents & parent**.


### How to Read the popularity and show the most popular topics

1. O(1) Read the POPULARITY TABLE for parent = NULL (Frontend), it will return `Top1333, Top1553, Top 102`, where N = the number of returned results 
2. O(1) * N, read each topic returned from (1) and render it to the frontpage.


#### REAL COMPLEXITY (PROS AND CONS)

PROS:
1. For Front-page with an Infinite Scroll which shows the TOP 8 topics. The DB calculations is HASH O(1) for POPULARITY TABLE of Front-page + HASH O(1) * N (where N = 8 Topics). Thus the **final complexity is O(9)**, but it includes 9 finding operations with the complexity of O(1)

CONS:

1. An event that has been triggered needs to make multiple updates namely to all materialized Parents. Let's suppose, there is an event on `Topic1553 New IDEs for Node.js`. This Topic has 4 Materialized Parents namely `1,2,3,4`. So when the event has been triggered (new vote), the coefficient is being recalculated and then, the updating algorithm must update **4 DIFFERENT POPULARITY TABLES for ALL 4 PARENTS.** So, the EVENT TRIGGERING UPDATE complexity is **O(1) * number of MATERIALIZED PARENTS**, so, in this case O(4).


#### REDIS DOCUMENTATION

   1. https://redislabs.com/ebook/part-1-getting-started/chapter-1-getting-to-know-redis/1-3-hello-redis/1-3-1-voting-on-articles/
   2. https://redislabs.com/ebook/part-1-getting-started/chapter-1-getting-to-know-redis/1-3-hello-redis/1-3-2-posting-and-fetching-articles/
   3. https://redislabs.com/ebook/part-1-getting-started/chapter-1-getting-to-know-redis/1-3-hello-redis/1-3-3-voting-on-articles/