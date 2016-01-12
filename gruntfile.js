module.exports = function(grunt) {
	
	grunt.initConfig({
		options: {
			get tnsCoreModules() {
				return grunt.file.expand({ cwd: "./NativeScript/bin/dist/" }, ["tns-core-modules-*.tgz"])[0];
			}
		},
		clean: {
			'tnsapp': 'TNSApp/'	
		},
		exec: {
			'clone-NativeScript': {
				cmd: 'git clone git@github.com:NativeScript/NativeScript.git || true'
			},
			'clone-cross-platform-modules-dev': {
				cmd: 'git clone git@github.com:NativeScript/cross-platform-modules-dev.git || true'
			},
			'make-tnsapp': {
				cmd: [
					'tns create TNSApp',
					'tns platform add ios --path TNSApp',
					'tns platform add android --path TNSApp',
					'tns prepare ios --path TNSApp',
					'tns prepare android --path TNSApp'
				].join(' && ')
			},
			'build-modules': {
				cmd: [
					'npm install',
					'grunt'
				].join(' && '),
				cwd: 'NativeScript'
			},
			'deploy-modules': {
				cmd: [
					'npm install',
					'grunt --platform=Cross --destination=../TNSApp/ --modulespath=../NativeScript/bin/dist/<%= options.tnsCoreModules %> --appFiles="../NativeScript/bin/dist/tns-samples-*.tgz,../NativeScript/bin/dist/tns-template-*.tgz,\\!../NativeScript/bin/dist/tns-samples-*-ts-*.tgz,\\!../NativeScript/bin/dist/tns-template-*-ts-*.tgz"'
				].join(' && '),
				cwd: 'cross-platform-modules-dev'
			},
			'tns-run-ios': {
				cmd: 'tns run ios --emulator --device iPhone\\ 6 --path TNSApp'
			},
			'tns-run-android': {
				cmd: 'tns run android --path TNSApp'
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-contrib-clean');
	
	grunt.registerTask('deploy-bootstrap', function() {
		var fs = require('fs');
		
		var packJson = '{ "nativescript": { "id": "org.nativescript.TNSApp", "tns-ios": { "version": "1.4.0" }, "tns-android": { "version": "1.4.0" }}}';
		fs.writeFileSync('TNSApp/package.json', packJson);
		
		var app = (grunt.option("app") || "tests/app") + "/app.js";
		
		var appPackJson = '{ "main": "' + app + '" }';
		fs.writeFileSync('TNSApp/app/package.json', appPackJson);
	});
	
	grunt.registerTask('install', [
		'exec:clone-NativeScript',
		'exec:clone-cross-platform-modules-dev',
		'clean:tnsapp',
		'exec:make-tnsapp',
		'exec:build-modules',
		'exec:deploy-modules',
		'deploy-bootstrap'
	]);
	
	grunt.registerTask('ios', [
		'deploy-bootstrap',
		'exec:tns-run-ios'
	]);
	
	grunt.registerTask('android', [
		'deploy-bootstrap',
		'exec:tns-run-android'
	]);
	
	grunt.registerTask('watch', function() {
		this.async();
		require("./build/watch");
	});
}

