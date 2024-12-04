import mongoose from 'mongoose';
import csv from 'csv-parser';
import fs from 'fs';
import {City, County, State} from "./models/stateCountyCity.js";

mongoose.connect('mongodb://localhost/my_database')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

async function Main(stateName, countyName, cityName) {
    try {
        const state = await State.findOneAndUpdate(
            {name: stateName},
            {$setOnInsert: {name: stateName}},
            {upsert: true, new: true}
        ).then(async (state) => {
            try {
                const county = await County.findOneAndUpdate(
                    {name: countyName},
                    {
                        $setOnInsert:
                            [
                                {name: countyName},
                                {state: state.id}
                            ]
                    },
                    {upsert: true, new: true}
                ).then(async (county, state) => {
                    try {
                        const city = await City.findOneAndUpdate(
                            {name: cityName},
                            {
                                $setOnInsert:
                                    [
                                        {name: cityName},
                                        {county: county.id}
                                    ]
                            },
                            {upsert: true, new: true}
                        ).then(async (city, county, state) => {
                            try {
                                await State.findOneAndUpdate(
                                    {_id: state._id},
                                    {$push: {counties: County.id}},
                                );
                            } catch (error) {
                                console.error(error);
                            }
                            try {
                                await County.findOneAndUpdate(
                                    {_id: county._id, state: State.id},
                                    {$push: {cities: City._id}},
                                )
                            } catch (error) {
                                console.error(error);
                            }
                        })(city, county, state)
                    } catch (error) {
                        console.error(error);
                    }
                })(county, state)
            } catch (error) {
                console.error(error);
            }
        })(state)
    } catch (error) {
        console.error(error);
    }
}

fs.createReadStream('uscities.csv')
    .pipe(csv())
    .on('data', (row) => {
        const stateName = row.state_name;
        const countyName = row.county_name;
        const cityName = row.city;

        Main(stateName, countyName, cityName);
    })
    .on('end', () => {
        console.log('CSV file successfully processed!');
    });