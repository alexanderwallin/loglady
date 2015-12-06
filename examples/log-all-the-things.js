'use strict';

const loglady = require('../dist/loglady');
var argv = require('yargs')
    .count('verbose')
    .alias('v', 'verbose')
    .argv;

loglady.setVerbose(argv.verbose > 0);

loglady.showIntroHeader('Log all the things!', ' ~ ');

loglady.section('Logging some actions');
loglady.intermediate('Fetching JSON object...');
loglady.action('JSON object:');
loglady.json({
  title: 'Twin Peaks',
  type: 'TV series',
  seasons: [
    {
      id: 1,
      title: 'Season 1',
      episodes: [],
    },
    {
      id: 2,
      title: 'Season 2',
      episodes: [],
    },
  ],
});

loglady.action('Executing commands');
loglady.command('ls -la');
loglady.intermediate(`Let's be verbose list the result:
drwxr-xr-x   14 user  group   476 Dec  6 22:25 .
drwxr-xr-x   17 user  group   578 Dec  4 23:28 ..
-rw-r--r--    1 user  group    78 Dec  5 19:07 .babelrc
-rw-r--r--    1 user  group   207 Dec  4 23:29 .editorconfig
drwxr-xr-x   13 user  group   442 Dec  6 22:25 .git
-rw-r--r--    1 user  group   165 Dec  5 20:41 .gitignore
-rw-r--r--    1 user  group     3 Dec  4 23:29 .yo-rc.json
-rw-r--r--    1 user  group  1903 Dec  6 22:21 README.md
-rw-r--r--    1 user  group    50 Dec  4 23:29 RELEASENOTES.md
drwxr-xr-x    3 user  group   102 Dec  5 19:09 dist
drwxr-xr-x    3 user  group   102 Dec  6 21:53 examples
drwxr-xr-x  266 user  group  9044 Dec  6 22:21 node_modules
-rw-r--r--    1 user  group  1131 Dec  6 22:21 package.json
drwxr-xr-x    3 user  group   102 Dec  4 23:30 src`);

loglady.command('git commit -m "minor fixes (again)"');

loglady.section('Error logging');

try {
  throw new Error("Oops, something went wrong");
}
catch (ex) {
  loglady.error(ex);
}

