'use strict';

const parserOpts = require('./parser-opts');

module.exports = {
  parserOpts,

  whatBump: commits => {
    console.log('=== WHATBUMP DEBUG ===');
    console.log('Total commits to analyze:', commits.length);

    let level = 2;
    let breakings = 0;
    let features = 0;

    commits.forEach((commit, index) => {
      console.log(`\nCommit ${index + 1}:`, commit.header);
      console.log('  Type:', commit.type);
      console.log(
        '  Notes length:',
        commit.notes ? commit.notes.length : 'undefined',
      );
      console.log('  Notes:', JSON.stringify(commit.notes, null, 2));

      if (commit.notes && commit.notes.length > 0) {
        breakings += commit.notes.length;
        level = 0;
        console.log('  -> BREAKING CHANGE DETECTED');
      } else if (commit.type === 'feat') {
        features += 1;
        if (level === 2) {
          level = 1;
        }
        console.log('  -> Feature detected');
      }
    });

    console.log('\n=== FINAL RESULT ===');
    console.log('Level:', level, '(0=major, 1=minor, 2=patch)');
    console.log('Breaking changes:', breakings);
    console.log('Features:', features);

    return {
      level: level,
      reason:
        breakings === 1
          ? `There is ${breakings} BREAKING CHANGE and ${features} features`
          : `There are ${breakings} BREAKING CHANGES and ${features} features`,
    };
  },
};
