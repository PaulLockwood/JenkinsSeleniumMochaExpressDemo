// mocha -t 10000 test001.js

var webdriver = require('selenium-webdriver'),
  test = require('selenium-webdriver/testing'),
  By = webdriver.By,
  until = webdriver.until,
  assert = require('assert'),
  timeoutMilliseconds = 5000;

// == Functions ==
function lookForTextInPageBody(driver, expectedText) {
  return driver.getSource().then(function(text) {
    // console.log('plugh1'); // console.log(text);
    return (text.indexOf(expectedText) > -1)
  });
}

function runGenericTest(driver, baseUrl, url, expectedText) {
  driver.get(baseUrl + url);

  var promise = driver.getTitle();

  //xyzzy - Replace this block with WaitForVisible
  console.log('1 (syncronous code path)');
  driver.wait(function() {
    return driver.getTitle().then(function(title) {
      console.log('2 (inside a promise)');
      //console.log(title);
      return title.length > -1;
    });
  }, timeoutMilliseconds);

  // == Mocha Tests ==
  // Assert that the expected text is on the page
  console.log('3 (syncronous code path)');
  driver.getTitle().then(function() {
    console.log("4 (inside a promise)");
    //var bodyText = driver.findElement(By.tagName('body'));
    var body = driver.findElement(By.tagName('body'));
    body.getText().then(function(bodyText) {
      console.log("5 (inside a promise)");
      var stringFound = bodyText.indexOf(expectedText) > -1;
      assert(stringFound);
    });
  })

  console.log('7 (syncronous code path)');

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

      console.log(curItem.url, curItem.expected);
      runGenericTest(driver, baseUrl, curItem.url, curItem.expected);
    }

  });

  // Test Teardown. Runs after the tests: destroys webdriver
  test.after(function() {
    driver.quit();
  });
  // END == Mocha Tests ==
});