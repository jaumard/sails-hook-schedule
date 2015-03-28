var fs = require('fs-extra');

var appDir = process.env.PWD;

//Config already exist so we don't override
if (!fs.existsSync(appDir + "/../../config/schedule.js"))
{
	//Copy base acl config
	fs.copy(appDir + "/schedule.js", appDir + "/../../config/schedule.js", function (err)
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			console.log("done write schedule.js base config");
		}
	});
}