/**
 * Schedule hook
 * https://www.npmjs.org/package/node-schedule
 */

module.exports = function (sails)
{

	/**
	 * Module dependencies.
	 */
	var hookLoader = require('sails-util-mvcsloader')(sails);
	var schedule   = require('node-schedule');

	var reloadTask = function (taskName, taskInfos)
	{
		var task = sails.hooks.schedule.tasks[taskName];
		if (task)
		{
			sails.hooks.schedule.stopTask(taskName);
		}

		if (Array.isArray(taskInfos.task))
		{
			for (var i = 0; i < taskInfos.task.length; i++)
			{
				taskInfos.task[i] = eval(taskInfos.task[i]);
			}
		}
		else if (typeof taskInfos.task == "string")
		{
			taskInfos.task = [eval(taskInfos.task)];
		}

		sails.hooks.schedule.tasks[taskName] = schedule.scheduleJob(taskInfos.cron, function ()
		{
			if (typeof taskInfos.sailsInContext == "undefined")
			{
				taskInfos.sailsInContext = sails.config.schedule.sailsInContext;
			}
			var sailsContext = taskInfos.sailsInContext ? sails : null;

			if (Array.isArray(taskInfos.task))
			{
				taskInfos.task.forEach(function (t)
				{
					if (t)
					{
						t(taskInfos.context, sailsContext);
					}
					else
					{
						sails.log.error("sails-hook-schedule function not present", taskInfos);
					}
				});
			}
			else
			{
				if (taskInfos.task)
				{
					taskInfos.task(taskInfos.context, sailsContext);
				}
				else
				{
					sails.log.error("sails-hook-schedule function not present", taskInfos);
				}
			}
		});
	};

	/**
	 * Expose hook definition
	 */

	return {
		tasks              : {}, // Run when sails loads-- be sure and call `next()`.
		reloadTasks        : function (next)
		{
			Object.keys(sails.config.schedule.tasks).forEach(function (key)
			{
				var val = sails.config.schedule.tasks[key];
				reloadTask(key, val);

			});

			sails.models.crontask.find().then(function (dbTasks)
			{
				dbTasks.forEach(function (dbTask)
				{
					reloadTask(dbTask.name, dbTask);
				});
				next();
			}).catch(function (error)
			{
				next(error);
				sails.log.error(error);
			});
		},
		initialize         : function (next)
		{
			var scope = this;
			hookLoader.injectAll({
				models : __dirname + '/api/models' // Path to your hook's services
			}, function (err)
			{
				if (err)
				{
					next(err);
				}
				else
				{
					if (sails.config.schedule == undefined)
					{
						err = new Error("Schedule module need config/schedule.js file");
						next(err);
					}
					else
					{

						sails.after('hook:orm:loaded', function ()
						{
							scope.reloadTasks(next);
						});
					}
				}
			});

		},
		stopTask           : function (taskName)
		{
			if (this.tasks[taskName])
			{
				this.tasks[taskName].cancel();
			}
		},
		startTask          : function (taskName)
		{
			var task = this.tasks[taskName];
			if (task)
			{
				task.schedule(sails.config.schedule.tasks[taskName].cron);
			}
		},
		getTask            : function (taskName, next)
		{
			sails.models.crontask.findOneByName(taskName).then(function (task)
			{
				task = task || null;
				next(null, task);
			}).catch(function (error)
			{
				next(error);
			});
		},
		createOrUpdateTask : function (task, next)
		{
			sails.models.crontask.findOneByName(task.name).then(function (results)
			{
				if (results)
				{
					sails.models.crontask.update(results.id, task).then(function (results)
					{
						if (results.length == 1)
						{
							reloadTask(results[0].name, results[0]);
							next(null, results[0]);
						}
						else
						{
							next(new Error("No task to update, maybe it's a config.schedule task ?", "no_task"));
						}
					}).catch(function (error)
					{
						next(error);
					});
				}
				else
				{
					sails.models.crontask.create(task).then(function (result)
					{
						reloadTask(result.name, result);
						next(null, result);
					}).catch(function (error)
					{
						next(error);
					});
				}
			}).catch(function (error)
			{
				sails.log.error(error);
				next(error);
			});
		},
		deleteAllTasks     : function (next)
		{
			var scope = this;
			sails.models.crontask.destroy({}).then(function (results)
			{
				results.forEach(function (task)
				{
					scope.stopTask(task.name);
					delete scope.tasks[task.name];

				});
				next(null, results);
			}).catch(function (error)
			{
				sails.log.error(error);
				next(error);
			});
		},
		deleteTask         : function (taskName, next)
		{
			var scope = this;
			sails.models.crontask.destroy({name : taskName}).then(function (results)
			{
				if (results.length == 1)
				{
					scope.stopTask(results[0].name);
					delete scope.tasks[results[0].name];
					next(null, results[0]);
				}
				else
				{
					next(new Error("No task to delete, maybe it's a config.schedule task ?", "no_task"));
				}
			}).catch(function (error)
			{
				sails.log.error(error);
				next(error);
			});
		}
	};
};
