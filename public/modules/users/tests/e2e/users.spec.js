"use strict";

describe('User tests:', function () {
    describe('Administration: ', function () {
        it('As an administrator, I can change the roles of users.', function () {
            browser.get('/#!');
            browser.waitForAngular();
            var link = element(by.id('signin-link'));
            expect(link.isDisplayed()).toBe(true);
            expect(link.getText()).toBe('Signin');

            link.click();
            browser.waitForAngular();
            var header = element(by.id('signin-header'));
            expect(header.isDisplayed()).toBe(true);
            expect(header.getText()).toBe('Sign in using your social accounts');
            var username = element(by.model('credentials.username'));
            var password = element(by.model('credentials.password'));
            var loginButton = element(by.id('signin-button'));
            username.sendKeys('protractor');
            password.sendKeys('protractor');

            loginButton.click();

            browser.waitForAngular();
//
//            console.log("XXXXXXXXXXXXXX")

            var welcome = element(by.id('home-welcome'));
            expect(welcome.isDisplayed()).toBe(true);
            expect(welcome.getText()).toBe('Welcome protractor protractor');

//            console.log("AAAAAAAAAAAAAAAAAAAAAAA")

            var dropdownToggle = element(by.id('admin-dropdown-toggle'));


            expect(dropdownToggle.isDisplayed()).toBe(true);

            var usersEntry = dropdownToggle.element(By.xpath('//option[text() = \'Users\']'));

            usersEntry.click();
            browser.waitForAngular();

            var welcome = element(by.id('home-welcome'));

//            .then(function(options){
//                console.log("XXXXXXXXXX")
//                console.log(options);
//            });
//            dropdownToggle.click();
//
//            browser.waitForAngular();

//            var userAdminLink = element(by.id('user-admin-link'));

//            .then(function(options){
//                console.log("XXXXXXXXXX")
////                console.log(options);
//            });

//            expect(userAdminLink.isDisplayed()).toBe(true);

        });
    });
});