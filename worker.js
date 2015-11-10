'use strict';

var request = require('request');

module.exports = {
	// Initialize the plugin for a job
	//   config: the config for this job, made by extending the DB config
	//           with any flat-file config
	//   job:    see strider-runner-core for a description of that object
	//   context: currently only defines "dataDir"
	//   cb(err, initializedPlugin)
  init: function (config, job, context, cb) {
		return cb(null, {
			// any extra env variables. Will be available during all phases
			env: {},
			// Listen for events on the internal job emitter.
			//   Look at strider-runner-core for an
			//   enumeration of the events. Emit plugin.[pluginid].myevent to
			//   communicate things up to the browser or to the webapp.
			listen: function (emitter, context) {
				emitter.on('job.status.phase.done', function (id, data) {
					var phase = data.phase;
					// console.log('the ' + phase + ' phase has completed');
					console.log('data:'+JSON.stringify(data));
					var change = job.ref.change;
					var commit = job.ref.commit;
					var project = job.ref.project;
					var branch = job.ref.branch;

				    // console.log(project+':'+branch+':'+change+':'+commit);
					if(phase == 'test' && typeof commit != 'undefined' && typeof change != 'undefined') {
						// console.log('user:'+config.username+ ' pass:'+config.password);
						var vote = -1;
						var msg = 'Test failed! Please check Strider job:'+job._id;
						if(data.exitCode === 0)  {
							vote = 1;
							msg = 'Test succcess!';
						}
						request.post({
	    					'url': 'http://localhost:8080/a/changes/'+project+'~'+branch+'~'+change+'/revisions/'+commit+'/review',
	    					'method':'POST',
	    					'auth': {
	    						'user': 	config.username,
	    						'password': config.password,
	    						'sendImmediately' : false
	    						},
	    					'json': true,
	    					'body': {
								"message": msg,
	    							"labels": {
	      								"Code-Review": vote	    							}
	    						}
	    					}, function (error, response, body) {
	    						console.log('got response');
	        					if (!error && response.statusCode == 200) {
	            					console.log('success:'+body)
	        					} else {
	        						console.log('res:'+response.statusCode+' body:'+body);
	        					}
	    				});
					}
					return true;
				});
			},
			// For each phase that you want to deal with, provide either a
			// shell command [string] or [Object] (as demo'd below)
			// or a fn(context, done(err, didrun))

			//string style
			environment: console.log('during environment'),
			//object style
			prepare: console.log('prepare environment'),
			//function style (calling done is a MUST)
			test: console.log('during test'),
			deploy: console.log('during deploy'),
			cleanup: console.log('during cleanup')
		});
	},
	// this is only used if there is _no_ plugin configuration for a
	// project. See gumshoe for documentation on detection rules.
	autodetect: {
		filename: 'package.json',
		exists: true
	}
};
