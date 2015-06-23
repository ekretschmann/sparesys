'use strict';

(function () {
    describe('ModeSelectorService', function () {
        //Initialize global variables
        var Service;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));



        beforeEach(inject(function (_ModeSelectorService_) {
            Service = _ModeSelectorService_;
        }));

        it('should return the one with the lowest hrt if forward and reverse are equal', function () {
            var card = {check: 'mixed', modes:['images', 'reverse', 'forward'],
                history: [
                    {when: 10, assessment: 1, mode: 'forward', hrt: 6},
                    {when: 10, assessment: 2, mode: 'forward', hrt: 1},
                    {when: 20, assessment: 1, mode: 'images', hrt: 5},
                    {when: 20, assessment: 1, mode: 'images', hrt: 2},
                    {when: 30, assessment: 1, mode: 'reverse', hrt: 3}
                ]};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.mode).toBe('images');
        });

        it('should return the one with the lowest hrt if forward and reverse are equal', function () {
            var card = {check: 'mixed', modes:['images', 'reverse', 'forward'],
                history: [
                    {when: 10, assessment: 1, mode: 'forward', hrt: 6},
                    {when: 10, assessment: 1, mode: 'forward', hrt: 1},
                    {when: 20, assessment: 1, mode: 'images', hrt: 5},
                    {when: 20, assessment: 1, mode: 'images', hrt: 2},
                    {when: 30, assessment: 1, mode: 'reverse', hrt: 3}
                ]};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.mode).toBe('forward');
        });

        it('should return the one with the lowest hrt if forward and reverse are equal', function () {
            var card = {check: 'mixed', modes:['images', 'reverse', 'forward'],
                history: [
                    {when: 10, assessment: 1, mode: 'forward', hrt: 3},
                    {when: 20, assessment: 1, mode: 'images', hrt: 2},
                    {when: 30, assessment: 1, mode: 'reverse', hrt: 3}
                ]};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.mode).toBe('images');
        });


        it('should return the one with the lowest hrt if forward and reverse are equal', function () {
            var card = {check: 'mixed', modes:['images', 'reverse', 'forward'],
                history: [
                    {when: 10, assessment: 1, mode: 'forward', hrt: 1},
                    {when: 20, assessment: 1, mode: 'reverse', hrt: 2},
                    {when: 30, assessment: 2, mode: 'images', hrt: 3}
                ]};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.mode).toBe('forward');
        });

        it('should return the one with the lowest hrt if forward and reverse are equal', function () {
            var card = {check: 'mixed', modes:['images', 'reverse', 'forward'],
                history: [
                    {when: 10, assessment: 1, mode: 'forward', hrt: 2},
                    {when: 20, assessment: 1, mode: 'reverse', hrt: 1},
                    {when: 30, assessment: 2, mode: 'images'}
                ]};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.mode).toBe('reverse');
        });

        it('should return reverse when reverse had 0 assessment and other modes were higher', function () {
            var card = {check: 'mixed', modes:['images', 'reverse', 'forward'],
                history: [
                    {when: 10, assessment: 1, mode: 'forward'},
                    {when: 20, assessment: 0, mode: 'reverse'},
                    {when: 30, assessment: 2, mode: 'images'}
                ]};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.mode).toBe('reverse');
        });

        it('should return forward when forward had 0 assessment and other modes were higher', function () {
            var card = {check: 'mixed', modes:['images', 'reverse', 'forward'],
            history: [
                {when: 10, assessment: 1, mode: 'reverse'},
                {when: 20, assessment: 0, mode: 'forward'},
                {when: 30, assessment: 2, mode: 'images'}
            ]};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.mode).toBe('forward');
        });

        it('should return images when there is images and reverse mode with no history', function () {
            var card = {check: 'mixed', modes:['images', 'reverse']};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.mode).toBe('images');
        });

        it('should return forward when there is forward mode with no history', function () {
            var card = {check: 'mixed', modes:['images', 'reverse', 'forward']};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.mode).toBe('forward');
        });

        it('should return forward when there is forward mode with empty history', function () {
            var card = {check: 'mixed', modes:['images', 'reverse', 'forward'], history:[]};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.mode).toBe('forward');
        });

        it('should return images when only mode is images', function () {
            var card = {check: 'mixed', modes:['images'], history:[{hrt:1000}]};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.mode).toBe('images');
        });


        it('should return reverse when only mode is forward', function () {
            var card = {check: 'mixed', modes:['reverse'], history:[{hrt:1000}]};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.mode).toBe('reverse');
        });

        it('should return forward when only mode is forward', function () {
            var card = {check: 'mixed', modes:['forward'], history:[{hrt:1000}]};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.mode).toBe('forward');
        });

        it('should return auto when check is mixed with any hrt > 5 days', function () {
            var card = {check: 'mixed', modes:['forward'], history:[{hrt:1000*3600*24*5+1}, {hrt:1000}]};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.assess).toBe('auto');
        });

        it('should return auto when check is mixed with last hrt > 5 days', function () {
            var card = {check: 'mixed', modes:['forward'], history:[{hrt:1000*3600*24*5+1}]};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.assess).toBe('auto');
        });

        it('should return self when check is mixed with last hrt < 5 days', function () {
            var card = {check: 'mixed', modes:['forward'], history:[{hrt:1000*3600*24*5-1}]};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.assess).toBe('self');
        });

        it('should return self when check is mixed with empty history', function () {
            var card = {check: 'mixed', modes:['forward'], history:[]};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.assess).toBe('self');
        });

        it('should return self when check is mixed with no history', function () {
            var card = {check: 'mixed', modes:['forward']};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.assess).toBe('self');
        });

        it('should return auto when check on card is computer', function () {
            var card = {check: 'computer', modes:['forward']};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.assess).toBe('auto');
        });

        it('should return self when check on card is self', function () {
            var card = {check: 'self', modes:['forward']};
            var params = Service.getRepetitionParametersNew(card);
            expect(params.assess).toBe('self');
        });



        //var testRewards = [
        //    {_id: '4', name: 'Rock', type: 'Item', defaulthealthpoints: 3},
        //    {_id: '3', name: 'Soil', type: 'Item'},
        //    {_id: '2', name: 'Water', type: 'Item'},
        //    {_id: '1', name: 'Sapling', type: 'Item'},
        //    {_id: '102', name: 'Making Fire', type: 'Skill', enables: ['2', '3', '4']},
        //    {_id: '101', name: 'Building a House', type: 'Skill', enables: ['1', '2', '3', '102']}
        //];





    });
})();
