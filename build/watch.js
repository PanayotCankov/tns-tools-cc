var fse = require("fs-extra");
var ts = require("typescript");
var path = require("path");
var mkdirp = require("mkdirp");

function isTs(f) {
	var ts = /^.*\.ts$/mig;
	var dts = /^.*\.d\.ts$/mig;
	return ts.test(f) && !dts.test(f);
}

function isApp(f) {
	var app = /^apps\/.*$/mig;
	return app.test(f);
}

function isResource(f) {
	var res = /^.*\.(xml|css|png|jpg|jpeg|expected|js|json)$/mig;
	return res.test(f);
}

console.log("Starting up watcher...");
fse.watch('NativeScript', { persistent: true, recursive: true }, function(event, file) {
	try {
		if (!file) return;
		
		var stats = { source: { file: path.resolve('NativeScript', file) }, destination: {} };
		
		if (isResource(file)) {
			stats.source.type = "res";
		} else if (isTs(file)) {
			stats.source.type = "ts";
		} else {
			console.log(" ×     " + file);
			return;
		}
		
		console.log(" ●→┐   " + stats.source.file);
		
		var base, name, platform, extension;
		
		var platformSpecific = /^(.*\/)(.*)\.(.*)\.(.*)$/mig;
		var platformSpecificResult = platformSpecific.exec(file);
		if (platformSpecificResult) {
			base = platformSpecificResult[1];
			name = platformSpecificResult[2];
			platform = platformSpecificResult[3];
			extension = platformSpecificResult[4];
		}
		
		if (platform == "android" || platform == "ios") {
			stats.platform = platform;
		} else {
			var platformIndependant = /^(.*\/)(.*)\.(.*)$/mig;
			var platformIndependantResult = platformIndependant.exec(file);
			if (platformIndependantResult) {
				base = platformIndependantResult[1];
				name = platformIndependantResult[2];
				extension = platformIndependantResult[3];
			} else {
				// Probably a file without extension
				console.log("Unhandled!");
				return;
			}
		}
		
		if (stats.source.type == "ts") {
			extension = "js";
		}
		
		stats.destination.app = path.resolve(
			"TNSApp/"
			+ (isApp(file) ? "app/" + base.substr(5) : "node_modules/tns-core-modules/" + base)
			+ name
			+ (platform ? "." + platform : "")
			+ (extension ? "." + extension : ""));
			
		stats.destination.ios = path.resolve(
			"TNSApp/platforms/ios/TNSApp/app/"
			+ (isApp(file) ? base.substr(5) : "tns_modules/" + base)
			+ name
			+ (extension ? "." + extension : ""));
	
		stats.destination.android = path.resolve(
			"TNSApp/platforms/android/assets/app/"
			+ (isApp(file) ? base.substr(5) : "tns_modules/" + base)
			+ name
			+ (extension ? "." + extension : ""));
		
		// console.dir(stats);
		var flags = { flag: 'w' }
		
		switch(stats.source.type) {
			case "ts":
				var source = fse.readFileSync(stats.source.file, { encoding: "utf8" });
				var result = ts.transpile(source, { module: ts.ModuleKind.CommonJS });
				console.log("   ☼   Transpile");		
				
				console.log("   ├→○ app: " + stats.destination.app);
				mkdirp.sync(path.dirname(stats.destination.app));
				fse.writeFileSync(stats.destination.app, result, flags, function(err) {
					console.log(err);
				});
				
				console.log("   ├→○ ios: " + stats.destination.ios);
				mkdirp.sync(path.dirname(stats.destination.ios));
				fse.writeFileSync(stats.destination.ios, result, flags, function(err) {
					console.log(err);
				});
				
				console.log("   └→○ android: " + stats.destination.android);
				mkdirp.sync(path.dirname(stats.destination.android));
				fse.writeFileSync(stats.destination.android, result, flags, function(err) {
					console.log(err);
				});
				
				break;
			case "res":
				// console.log("   ☼   Copy");
				console.log("   ├→○ app: " + stats.destination.app);
				mkdirp.sync(path.dirname(stats.destination.app));
				fse.copySync(stats.source.file, stats.destination.app, flags, function(err) {
					console.log("Error coping: " + err);
				});
				
				console.log("   ├→○ ios: " + stats.destination.ios);
				mkdirp.sync(path.dirname(stats.destination.ios));
				fse.copySync(stats.source.file, stats.destination.ios, flags, function(err) {
					console.log("Error coping: " + err);
				});
				
				console.log("   └→○ android: " + stats.destination.android);
				mkdirp.sync(path.dirname(stats.destination.android));
				fse.copySync(stats.source.file, stats.destination.android, flags, function(err) {
					console.log("Error coping: " + err);
				});
				break;
		}
	} catch(e) {
		console.log(e + "\n" + e.stack);
	}
	
});
