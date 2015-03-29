# sails-hook-schedule
Hook to manage basic cron job for sails application
Base on node-schedule module https://github.com/node-schedule/node-schedule

##Installation
    npm install sails-hook-schedule
Don't use sudo or config/schedule.js will be create as root user  

##Configure
Create or modify config/schedule.js : 

    module.exports.schedule = {
      //Every monday at 1am
       "0 1 * * 1"   : function ()
       {
            console.log("cron ok");
       }
    };
    
That's it :) 