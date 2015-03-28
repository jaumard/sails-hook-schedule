# sails-hook-schedule
Hook to manage basic cron job for sails application

##Installation
    npm install sails-hook-schedule
or

    sudo npm install sails-hook-schedule  

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