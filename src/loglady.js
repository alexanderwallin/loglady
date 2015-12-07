/**
 * Utility for logging categorized and formatted output in
 * cli apps or when debugging.
 *
 * @author Alexander Wallin <office@alexanderwallin.com>
 */

'use strict';

const colors = require('colors');
const prettyjson = require('prettyjson');
const moment = require('moment');

/**
 * Loglady object
 * @type {Object}
 */
let Loglady = {};

Loglady.version = require('../package.json').version;

// Configs
Loglady.logFunc = console.log;
Loglady.isMuted = false;
Loglady.isVerbose = false;
Loglady.showTimestamps = false;
Loglady.timestampFormat = 'HH:mm:ss';
Loglady.ingoreFuncRegex = /^(__|toString|toLocaleString|valueOf|hasOwnProperty|isPrototypeOf|propertyIsEnumerable)/;

// History
Loglady.history = [];

/**
 * Sets muted
 *
 * @param {Boolean} isMuted Muted or ont
 */
Loglady.setMuted = function(isMuted) {
  Loglady.isMuted = isMuted;
}

/**
 * Sets verbose
 *
 * @param {Boolean} isVerbose A boolean
 */
Loglady.setVerbose = function(isVerbose) {
  Loglady.isVerbose = isVerbose;
}

/**
 * Sets the desired log function to use
 *
 * @param {Function} logFunc A log function
 * @throw {Error}            An Error when logFunc is not a function
 */
Loglady.setLogFunc = function(logFunc) {
  if (typeof logFunc !== 'function') {
    throw new Error(`logFunc is not a function: got ${typeof logFunc}`);
  }
  else {
    Loglady.logFunc = logFunc;
  }
}

/**
 * Sets whether to show timestamps
 *
 * @param {Boolean} showTimestamps A boolean
 */
Loglady.setShowTimestamps = function(showTimestamps) {
  Loglady.showTimestamps = showTimestamps;
}

/**
 * Sets timestamp format
 *
 * @param {String} timestampFormat A moment time format
 */
Loglady.setTimestampFormat = function(timestampFormat) {
  Loglady.timestampFormat = timestampFormat;
}

/**
 * Sets the regex to check whether to ignore a function when spying
 * on an object.
 *
 * @param {Regexp} regex A regex
 */
Loglady.setIgnoreFuncRegex = function(regex) {
  Loglady.ingoreFuncRegex = regex;
}

/**
 * Clears the log history.
 */
Loglady.clearHistory = function() {
  Loglady.logVerbose('Loglady: Clearing log history.');
  Loglady.history = [];
}

/**
 * Logs a set of arguments
 *
 * @param  {Array} args Any number of arguments
 */
Loglady.log = function(...args) {
  if (Loglady.showTimestamps) {
    const now = moment().format(Loglady.timestampFormat);
    const nowStr = `${now}  `.gray;

    for (let i in args) {
      if (typeof args[i] === 'string') {
        args[i] = args[i].replace(/\n/g, `\n${nowStr}`);
      }
    }

    args.unshift(nowStr);
  }

  Loglady.logFunc.apply(Loglady.logFunc, args);

  Loglady.history.push({
    timestamp: moment().toJSON(),
    args: args,
  });
}

/**
 * Logs a set of arguments when in verbose mode
 *
 * @param  {Array} args Any number of arguments
 */
Loglady.logVerbose = function(...args) {
  if (Loglady.isVerbose) {
    Loglady.log.apply(Loglady, args);
  }
}

/**
 * Logs an object cast as a boolean
 *
 * @param  {Any} obj Any type of object
 */
Loglady.bool = function(obj) {
  let boolStr = `${!!obj}`.magenta.bold;
  if (typeof obj !== 'boolean')
    boolStr += ` (${obj})`.gray;

  Loglady.log(boolStr);
}

/**
 * Logs a json object prettily
 * @param  {Object} json A json object
 */
Loglady.json = function(json) {
  Loglady.log(prettyjson.render(json, {
    keysColor: 'yellow',
    stringColor: 'white',
  }));
  Loglady.log();
}

/**
 * Logs an error
 *
 * @param  {Object} err An error
 */
Loglady.error = function(err) {
  Loglady.log('Error:'.red.bold);
  Loglady.log(err);
}

/**
 * Pipes a child process stdout to the console
 *
 * @param  {Object} data Child process data
 */
Loglady.pipeStdout = function(data) {
  if (Loglady.isVerbose) {
    process.stdout.write(data.toString());
  }
}

/**
 * Logs a section heading
 *
 * @param  {String} heading A section heading
 */
Loglady.section = function(heading) {
  Loglady.log('\n' + heading.bold.underline + '\n');
}

/**
 * Logs an action within a section
 *
 * @param  {String} heading An action heading
 */
Loglady.action = function(heading) {
  Loglady.log('\n' + heading.white.bold + '\n');
}

/**
 * Logs a command
 *
 * @param  {String} cmd A (terminal/cli/bash) command
 */
Loglady.command = function(cmd) {
  Loglady.log('Running command:'.blue);
  Loglady.log(`  ${cmd}\n`.blue.bold);
}

/**
 * Logs a function call
 *
 * @param  {String} fn A function name/description
 */
Loglady.fncall = function(fn, args = []) {
  Loglady.logVerbose('() => '.yellow + `${fn}(${args.join(', ')})`.gray.bold);
}

/**
 * Logs an intermediate level message
 *
 * @param  {String} message An intermediate message
 */
Loglady.intermediate = function(message) {
  Loglady.logVerbose(message.gray);
}

/**
 * Logs a set of data in a table layout
 *
 * @param  {Array} data A data set
 */
Loglady.table = function(data) {
  if (!data || data.length == 0) {
    Loglady.log('Empty table.');
    return;
  }

  Loglady.json(data);

  const labels = Object.keys(data[0]);
  const colWidth = labels.reduce((label, currValue) => label.length > currValue ? label.length : currValue) + 2;
  const tableWidth = labels.length * colWidth;

  Loglady.log('-'.repeat(tableWidth));
  const headerStr = labels.map(label => {
    return label + ' '.repeat(colWidth - label.length - 2) + '| ';
  }).join('');
  Loglady.log(headerStr);
  Loglady.log('-'.repeat(tableWidth));

  data.forEach(row => {
    const rowStr = Object.keys(row).map(key => {
      const col = `${row[key]}`;
      return col + ' '.repeat(colWidth - col.length);
    }).join('');

    Loglady.log(rowStr);
  });

  Loglady.log();
}

/**
 * Logs an intro with a given title
 *
 * @param  {String} title A title
 */
Loglady.showIntroHeader = function(title, barChar = '# ') {
  const bar = barChar.repeat(Math.round(40 / barChar.length)).trim();
  const titlePadLeft = ' '.repeat((bar.length - title.length) / 2);
  const titlePadRight = ' '.repeat(bar.length - title.length - titlePadLeft.length);

  Loglady.log(bar.red);
  Loglady.log(`${titlePadLeft}${title}${titlePadRight}`.red.bold);
  Loglady.log(bar.red);
  Loglady.log();
}

/**
 * Logs a successful ending
 *
 * @param  {String} msg A success message
 */
Loglady.endWithABang = function(msg) {
  Loglady.log(`
  ──────────▄▄▄▄▄▄▄▄▄▄▄──────────
  ─────▄▄▀▀▀▀──────────▀▀▄▄──────
  ───▄▀───────────────────▀▀▄────
  ──█────────────────────────█───
  ─█─────────────────────▄▀▀▀▀▀█▄
  █▀────────────────────█────▄███
  █─────────────────────█────▀███
  █─────▄▀▀██▀▄─────────█───────█
  █────█──████─█─────────▀▄▄▄▄▄█─
  █────█──▀██▀─█───────────────█─
  █────█───────█──────────────▄▀─
  █────▀▄─────▄▀──▄▄▄▄▄▄▄▄▄───█──
  █──────▀▀▀▀▀────█─█─█─█─█──▄▀──
  ─█──────────────▀▄█▄█▄█▀──▄▀───
  ──█──────────────────────▄▀────
  ───▀▀▀▄──────────▄▄▄▄▄▄▀▀──────
  ────▄▀─────────▀▀──▄▀──────────
  ──▄▀───────────────█───────────
  ─▄▀────────────────█──▄▀▀▀█▀▀▄─
  ─█────█──█▀▀▀▄─────█▀▀────█──█─
  ▄█────▀▀▀────█─────█────▀▀───█─
  █▀▄──────────█─────█▄────────█─
  █──▀▀▀▀▀█▄▄▄▄▀─────▀█▀▀▀▄▄▄▄▀──
  █───────────────────▀▄─────────`.green);

  Loglady.log(`
  ${'- - - - - - - - - - - - - - - - - - - - - - - -'.green}
                     ${'Success!'.green.bold}

  ${'This is what the higher powers have to tell you:'.gray}

  ${msg.italic}
  `);
}

/**
 * Logs an erroneous ending
 *
 * @param  {Object} err An error
 */
Loglady.endInTotalDespair = function(err) {
  Loglady.log(`
  ─────────────────────────────────
  ────────████████████████─────────
  ──────███──────────────███───────
  ─────██──────────────────██──────
  ────██────────────────────██─────
  ───██──────────────────────██────
  ──██───▄▀▀▀▀▄───────▄▀▀▀▄───██───
  ──█──▄▀──────▀▄───▄▀─────▀▄──██──
  ─██──█▄▄▄▄▄▄▄▄█───█▄▄▄▄▄▄▄█───█──
  ─█───████─────█───████────█───██─
  ─█───█────────█───█───────█───██─
  ██────▀▄▄▄▄▄▄▀─────▀▄▄▄▄▄▀─────██
  █───────────────────────────────█
  █───────────────────────────────█
  █───────────────────────────────█
  █─────────▄▄▄▄▄▄▄▄▄▄▄───────────█
  █──────▄▀▀───────────▀──────────█
  ██──────────────────────────────█
  ─██────────────────────────────██
  ─██────────────────────────────██
  ──██──────────────────────────██─
  ───██─────────────────────────█──
  ────███──────────────────────██──
  ──────█──────────────────────█───

            You bad coder.
  `.red);
  console.error(err);
}

/**
 * Intercepts all calls to functions defined on a given object
 * and logs the calls + results when they are invoked.
 *
 * After logging the function call, the result is returned.
 *
 * @param  {Object} obj  An object or instance
 * @param  {String} name (Options) the name of the object/instance
 */
Loglady.spyOn = function(obj, name = null) {
  Loglady.action(`Spying on object ${name ? name : ''}`);

  const protoFuncs = Object.getOwnPropertyNames(Object.getPrototypeOf(obj));
  const propFuncs = Object.getOwnPropertyNames(obj);
  const allFuncs = protoFuncs.concat(propFuncs)
    .sort()
    .filter(fnName => {
      return obj[fnName]
        && typeof obj[fnName] === 'function'
        && Loglady.ingoreFuncRegex.test(fnName) === false;
    });

  for (let fnName of allFuncs) {
    const originalFn = obj[fnName];

    // Wrap the original function inside one that logs its calling
    // context and results, then return the results
    obj[fnName] = (...args) => {
      Loglady.fncall(`${name ? name+'.' : ''}${fnName}`, args);

      const result = originalFn.apply(obj, args);
      Loglady.intermediate(` -> ${result}`);

      return result;
    }
  }
}

module.exports = Loglady;
