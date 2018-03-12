'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

// Ensure environment variables are read.
require('../webConfig/env');

const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const sysFs = require('fs');
const webpack = require('webpack');
const config = require('../webConfig/webpack.config.prod');
const paths = require('../webConfig/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');

const measureFileSizesBeforeBuild =
    FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const useYarn = fs.existsSync(paths.yarnLockFile);

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
    process.exit(1);
}

// First, read the current file sizes in dist directory.
// This lets us display how much they changed later.
measureFileSizesBeforeBuild(paths.appBuild)
    .then(previousFileSizes => {
        // Remove all content but keep the directory so that
        // if you're in it, you don't end up in Trash
        fs.emptyDirSync(paths.appBuild);
        // Merge with the public folder
        copyPublicFolder();
        // Start the webpack dist
        return build(previousFileSizes);
    })
    .then(
        ({stats, previousFileSizes, warnings}) => {
            if (warnings.length) {
                console.log(chalk.yellow('Compiled with warnings.\n'));
                console.log(warnings.join('\n\n'));
                console.log(
                    '\nSearch for the ' +
                    chalk.underline(chalk.yellow('keywords')) +
                    ' to learn moreLink about each warning.'
                );
                console.log(
                    'To ignore, add ' +
                    chalk.cyan('// eslint-disable-next-line') +
                    ' to the line before.\n'
                );
            } else {
                console.log(chalk.green('Compiled successfully.\n'));
            }

            console.log('File sizes after gzip:\n');
            printFileSizesAfterBuild(
                stats,
                previousFileSizes,
                paths.appBuild,
                WARN_AFTER_BUNDLE_GZIP_SIZE,
                WARN_AFTER_CHUNK_GZIP_SIZE
            );

            const appPackage = require(paths.appPackageJson);
            const publicUrl = paths.publicUrl;
            const publicPath = config.output.publicPath;
            const buildFolder = path.relative(process.cwd(), paths.appBuild);
            printHostingInstructions(
                appPackage,
                publicUrl,
                publicPath,
                buildFolder,
                useYarn
            );
        },
        err => {
            console.log(chalk.red('Failed to compile.\n'));
            console.log((err.message || err) + '\n');
            process.exit(1);
        }
    ).then(() => {
    copyHtmlsToViews();//拷贝文件到views里
});

// Create the production dist and print the deployment instructions.
function build(previousFileSizes) {
    console.log('Creating an optimized production dist...');

    let compiler = webpack(config);
    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                return reject(err);
            }
            const messages = formatWebpackMessages(stats.toJson({}, true));
            if (messages.errors.length) {
                return reject(new Error(messages.errors.join('\n\n')));
            }
            if (
                process.env.CI &&
                (typeof process.env.CI !== 'string' ||
                process.env.CI.toLowerCase() !== 'false') &&
                messages.warnings.length
            ) {
                console.log(
                    chalk.yellow(
                        '\nTreating warnings as errors because process.env.CI = true.\n' +
                        'Most CI servers set it automatically.\n'
                    )
                );
                return reject(new Error(messages.warnings.join('\n\n')));
            }
            return resolve({
                stats,
                previousFileSizes,
                warnings: messages.warnings,
            });
        });
    });
}

function copyPublicFolder() {
    fs.copySync(paths.appPublic, paths.appBuild, {
        dereference: true,
        filter: file => file !== paths.appHtml
    });
}


function copyHtmlsToViews() {
    console.log("拷贝html文件到views");
    sysFs.readdir(paths.appBuild, function (err, files) {
        if (err) {
            return console.error(err);
        }
        files.forEach(function (file) {
            var fileArr = file.split('.');
            if (['html', 'htm'].indexOf(fileArr[fileArr.length - 1]) > -1) {
                var oldPath = paths.appBuild +"/"+ file, newPath = paths.appViews +"/"+ file;
                sysFs.rename(oldPath, newPath, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log(file + "移动成功");
                })
            }
        });
    });
}