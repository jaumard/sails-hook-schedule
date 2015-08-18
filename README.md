# sails-hook-schedule
Hook to manage basic cron job for sails application

Base on node-schedule module https://github.com/node-schedule/node-schedule

##Installation
    npm install sails-hook-schedule
Don't use sudo or config/schedule.js will be create as root user  

##Configure
Create or modify config/schedule.js : 

    module.exports.schedule = {
      sailsInContext : true, //If sails is not as global and you want to have it in your task
      tasks : {
          //Every monday at 1am
          firstTask : {
             cron : "0 1 * * 1",
             task : function (context, sails)
             {
                  console.log("cron ok");
             },
             context : {}
          }
      }
    };
    
That's it :) 
