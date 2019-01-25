#!/usr/bin/env node

const chalk = require('chalk');
const read = require('node-readability');
const sanitizer = require('sanitizer');
const keyword = require('gramophone');
const program = require('commander');
const fs = require('fs');

let urlvalue = "";
let ngramsvalue;

function usage() {
  console.log(`
    ${chalk.red('Missing the --url parameter.')}
    ${chalk.yellow('Usage:')} ${chalk.green('keywordsextract --url https://en.wikipedia.org/wiki/Search_engine_optimization')}
  `);
}

function stripHTML(html) {
  let clean = sanitizer.sanitize(html, function(str) {
    return str;
  });

  clean = clean.replace(/<(?:.|\n)*?>/gm, "");
  clean = clean.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/ig, "\n");
  return clean.trim();
}

program
  .option('--url, [url]', 'The url')
  .option('--n, [ngrams]', 'Words')
  .parse(process.argv);

if (program.url) {
  urlvalue = program.url;
} else {
  process.exit(usage());
}

if (program.ngrams) {
  ngramsvalue = program.ngrams
} else {
  ngramsvalue = 2, 3;
}

read(urlvalue, function(err, article, title, meta) {
  const title1 = article.title;
  const total = stripHTML(article.title + " " + article.content);
  const extraction_result = keyword.extract(total, {
    stem: true,
    ngrams: [2, 3]
  });

  console.log(extraction_result);

  fs.writeFile(title1 + ".txt", extraction_result, function(err) {
    if (err) {
      return console.log(err);
    }

    console.log(title1 + ".txt file was saved!");
  });
});
