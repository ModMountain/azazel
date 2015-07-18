var Path = require('path');
var FS = require('fs-extra');

// Figure out the name of the application
var appName = process.argv[2];
if (!appName) {
	console.error("Please provide a name for your application.");
	return;
}

// Main application directory
FS.mkdirsSync(appName);
process.chdir(appName);

// Copy all the default stuff
var pathToDefaults = Path.join(process.argv[1], "..", "..", "lib", "defaults");
FS.readdirSync(pathToDefaults).forEach(function(file) {
	if (file === "default-app.ts") FS.copySync(Path.join(pathToDefaults, file), appName + ".ts");
	else FS.copySync(Path.join(pathToDefaults, file), file);	
});

