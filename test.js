const fs = require('fs');

const testCasesDir = process.argv[3] || 'test_cases';

// Reading limits.
const limits = readLimits(process.argv[4] || 'limits.txt');

// Reading test cases.
const testCases = readTestCases(testCasesDir);
if (!testCases.length) {
  console.log('No test cases found');
  return;
}

// Reading the solution.
const fileToBeTested = process.argv[2] || './solution.js';

// Reading the solution.
const solve = require(fileToBeTested);

// Testing.
const report = test(testCases, testCasesDir, limits, solve);

// Printing the report.
printReport(report);

function readLimits(limitsFileName) {
  try {
    const limitsFile = fs
    .readFileSync(
      limitsFileName,
      {
        encoding: 'utf8',
        flag: 'r'
      });

    const limitsTLMatches = limitsFile.match(/TL\=(\d+)/);
    
    return {
      TL: limitsTLMatches[1]
    };
  } catch (e) {
    console.log(
      '>> Failed loading limits file: using default limitations'
    );

    return {
      TL: 1000
    };
  }
}

function readTestCases(testCasesDir) {
  const testCases = [];
  fs.readdirSync(testCasesDir).forEach(file => {
    testCases.push(file);
  });

  testCases.sort();

  return testCases;
}

function test(testCases, testCasesDir, limits, solve) {
  const report = Array(testCases.length);

  testCases.forEach((testCaseFileName, i) => {
    const { res, err } = handleTestCase(testCasesDir, testCaseFileName, limits, solve);

    report[i] = {
      id: i,
      testCaseFileName,
      got: res,
      err: err
    };
  });

  return report;
}

function handleTestCase(testCasesDir, testCaseFileName, limits, solve) {
  const caseContent = fs.readFileSync(`${testCasesDir}/${testCaseFileName}`, 'utf8');

  let res, err;
  try {
    res = solve(caseContent);
  } catch (e) {
    err = e;
  } finally {
    return { res, err };
  }
}

function printReport(report) {
  console.log('\n');
  report.forEach(reportItem => {
    console.log(`> Test case #${reportItem.id} (${reportItem.testCaseFileName}):`);
    console.log('> Got:\n');
    console.log(reportItem.got);
    console.log('\n');
  });
}
