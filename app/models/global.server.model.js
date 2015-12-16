'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Reward Schema
 */
var GlobalSchema = new Schema({
    rewardlocations: {
        type: [String],
        default: ''
    }
});

mongoose.model('Global', GlobalSchema);
