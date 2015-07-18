var program = require('commander');

program
	.version('0.0.1')
	.command('new [name]', 'create a new Azazel project')
	.parse(process.argv);