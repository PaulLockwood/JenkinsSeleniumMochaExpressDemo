// mocha -t 10000 test001.js

var winston = require('winston'),
  webdriver = require('selenium-webdriver'),
  test = require('selenium-webdriver/testing'),
  By = webdriver.By,
  until = webdriver.until,
  assert = require('assert'),
  timeoutMilliseconds = 5000;

// == Enable logging
//winston.level = 'debug';

// == Functions ==
function lookForTextInPageBody(driver, expectedText) {
  return driver.getSource().then(function(text) {
    // winston.debug('plugh1'); // winston.debug(text);
    return (text.indexOf(expectedText) > -1)
  });
}

function runGenericTest(driver, baseUrl, url, expectedText) {
  driver.get(baseUrl + url);

  var promise = driver.getTitle();

  //xyzzy - Replace this block with WaitForVisible
  winston.debug('1 (syncronous code path)');
  driver.wait(function() {
    return driver.getTitle().then(function(title) {
      winston.debug('2 (inside a promise)');
      //winston.debug(title);
      return title.length > -1;
    });
  }, timeoutMilliseconds);

  // == Mocha Tests ==
  // Assert that the expected text is on the page
  winston.debug('3 (syncronous code path)');
  driver.getTitle().then(function() {
    winston.debug("4 (inside a promise)");
    //var bodyText = driver.findElement(By.tagName('body'));
    var body = driver.findElement(By.tagName('body'));
    body.getText().then(function(bodyText) {
      winston.debug("5 (inside a promise)");
      var stringFound = bodyText.indexOf(expectedText) > -1;
      assert(stringFound);
    });
  })

  winston.debug('7 (syncronous code path)');

}
// END == Functions ==


// == Mocha Test Fixture ==
test.describe('Data driven Find Test on Page tests (wip)', function() {
  var driver;

  // Test Setup. Runs before the test: initialize webdriver
  test.before(function() {
    driver = new webdriver.Builder()
      // .forBrowser('firefox')
      .forBrowser('phantomjs')
      .build();
  });

  // Actual test - note - we do multiple test from this single test.it
  test.it('Load page and wait for expected text string(s) to appear', function() {
    var baseUrl = 'http://localhost:3000/';
    var jsonData = [{
      "url": "page1.html",
      "expected": "page1"
    }, {
      "url": "page3.html",
      "expected": "page3"
    }, {
      "url": "page4.html",
      "expected": "page4"
    }];

    for (var i = 0; i < jsonData.length; i++) {
      var curItem = jsonData[i];

      winston.debug(curItem.url, curItem.expected);
      runGenericTest(driver, baseUrl, curItem.url, curItem.expected);
    }

  });

  // Test Teardown. Runs after the tests: destroys webdriver
  test.after(function() {
    driver.quit();
  });
  // END == Mocha Tests ==
});