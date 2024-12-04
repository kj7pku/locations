import * as mongoose from 'mongoose';

const stateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    counties: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'County'
    }
});

const countySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cities: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'City'
    },
    state: {
    //    type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: 'State'
    }
});

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    county: {
     //   type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: 'County'
    }
});

const State = mongoose.model('State', stateSchema);
const County = mongoose.model('County', countySchema);
const City = mongoose.model('City', citySchema);

//module.exports = { State, County, City };
export {State, County, City};