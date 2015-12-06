'use strict';

const prettyjson = require('prettyjson');

/**
 * Loglady object
 * @type {Object}
 */
let Loglady = {};

Loglady.logFunc = console.log;
Loglady.isMuted = false;
Loglady.isVerbose = false;

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
 * Logs a set of arguments
 *
 * @param  {Array} args Any number of arguments
 */
Loglady.log = function(...args) {
  Loglady.logFunc.apply(Loglady.logFunc, args);
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
  Loglady.log('\n' + heading.bold.underline);
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
  Loglady.section('Running command:');
  Loglady.log('\t' + cmd.blue.bold + '\n');
}

/**
 * Logs a function call
 *
 * @param  {String} fn A function name/description
 */
Loglady.fncall = function(fn) {
  Loglady.logVerbose('() => '.yellow + `${fn}()`.gray.bold);
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

module.exports = Loglady;
