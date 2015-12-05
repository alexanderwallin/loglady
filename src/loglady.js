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
  Loglady.log('() => '.yellow + `${fn}()`.gray.bold);
}

/**
 * Logs an intermediate level message
 *
 * @param  {String} message An intermediate message
 */
Loglady.intermediate = function(message) {
  Loglady.log(message.gray);
}

/**
 * Logs an intro with a given title
 *
 * @param  {String} title A title
 */
Loglady.showIntroHeader = function(title) {
  const bar = '# # # # # # # # # # # # # # # # # # # # #';
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
