"use strict";

describe('User tests:', function () {
    describe('can list users', function () {
        it('As an administrator, I can change the roles of users.', function () {
            browser.get('/#!');
            var element = browser.findElement(by.id('signin-link'));
//            expect(element.isDisplayed()).toBe(true);
//            expect(element.getText()).toBe('Signin');
            element.click();
            browser.waitForAngular();
            element = browser.findElement(by.id('signin-header'));
//            expect(element.isDisplayed()).toBe(true);
//            expect(element.getText()).toBe('Sign in using your social accounts');
            var username = browser.findElement(by.model('credentials.username'));
            var password = browser.findElement(by.model('credentials.password'));
            username.sendKeys('protractor');
            password.sendKeys('protractor');

//            var submit = browser.findElement(by.tagName('button'));
            // Fill out the form?
//            submit.click();
        });
    });
});