var fs = require('fs-extra');

var appDir = process.env.PWD;

//Config already exist so we don't override
if (!fs.existsSync(appDir + "/../../config/acl.js"))
{
	//Copy base acl config
	fs.copy(appDir + "/acl.js", appDir + "/../../config/acl.js", function (err)
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			console.log("done write acl.js base config");

		}
	});
}