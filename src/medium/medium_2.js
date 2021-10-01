import mpg_data from "./data/mpg_data.js";
import {getStatistics} from "./medium_1.js";

/*
This section can be done by using the array prototype functions.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
see under the methods section
*/

function getArrays(rawArray, keys) {
    const newArray = [];
    for (let i = 0; i < rawArray.length; i++) {
        for (let j = 0; j < keys.length; j++) {
            newArray.push(rawArray[i][keys[j]]);
        }
    }
    return newArray;
}
 
function getHybridCount(rawArray) {
    let count = 0;
    for (let i = 0; i < rawArray.length; i++) {
        if (rawArray[i].hybrid) count++;
    }
    return count;
}

const mpgArray = getArrays(mpg_data, ['city_mpg', 'highway_mpg']);
const yearArray = getArrays(mpg_data, ['year']);
const hybridCount = getHybridCount(mpg_data);

/**
 * This object contains data that has to do with every car in the `mpg_data` object.
 *
 *
 * @param {allCarStats.avgMpg} Average miles per gallon on the highway and in the city. keys `city` and `highway`
 *
 * @param {allCarStats.allYearStats} The result of calling `getStatistics` from medium_1.js on
 * the years the cars were made.
 *
 * @param {allCarStats.ratioHybrids} ratio of cars that are hybrids
 */
export const allCarStats = {
    avgMpg: getStatistics(mpgArray).mean,
    allYearStats: getStatistics(yearArray),
    ratioHybrids: hybridCount/mpg_data.length,
};

/**
 * HINT: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 *
 * @param {moreStats.makerHybrids} Array of objects where keys are the `make` of the car and
 * a list of `hybrids` available (their `id` string). Don't show car makes with 0 hybrids. Sort by the number of hybrids
 * in descending order.
 *
 *[{
 *     "make": "Buick",
 *     "hybrids": [
 *       "2012 Buick Lacrosse Convenience Group",
 *       "2012 Buick Lacrosse Leather Group",
 *       "2012 Buick Lacrosse Premium I Group",
 *       "2012 Buick Lacrosse"
 *     ]
 *   },
 *{
 *     "make": "BMW",
 *     "hybrids": [
 *       "2011 BMW ActiveHybrid 750i Sedan",
 *       "2011 BMW ActiveHybrid 750Li Sedan"
 *     ]
 *}]
 *
 *
 *
 *
 * @param {moreStats.avgMpgByYearAndHybrid} Object where keys are years and each year
 * an object with keys for `hybrid` and `notHybrid`. The hybrid and notHybrid
 * should be an object with keys for `highway` and `city` average mpg.
 *
 * Only years in the data should be keys.
 *
 * {
 *     2020: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *     2021: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *
 * }
 */

function compare(a, b) {
    if ( a.hybrids.length < b.hybrids.length ){
        return 1;
    }
    if ( a.hybrids.length > b.hybrids.length ){
        return -1;
    }
    return 0;
}

function getHybridMakes(rawArray) {
    const makerHybridDict = {};
    for (let i = 0; i < rawArray.length; i++) {
        if (rawArray[i].hybrid) {
            if (rawArray[i].make in makerHybridDict) {
                makerHybridDict[rawArray[i].make].push(rawArray[i].id);
            } else {
                makerHybridDict[rawArray[i].make] = [rawArray[i].id];
            }
        }
    }
    const res = []
    for (const [key, value] of Object.entries(makerHybridDict)) {
        res.push({make: key, hybrids: value});
    }
    res.sort(compare)
    return res;
}

function getIfHybridByYear(rawArray) {
    const yearArrays = {};
    for (let i = 0; i < rawArray.length; i++) {
        const hybridKey = (rawArray[i].hybrid) ? "hybrid" : "nothybrid";
        const oppositeKey = (!rawArray[i].hybrid) ? "hybrid" : "nothybrid";
        const year = rawArray[i].year;
        const cityMpg = rawArray[i].city_mpg;
        const highwayMpg = rawArray[i].highway_mpg;
        if (year in yearArrays && hybridKey in yearArrays[year]) {
            yearArrays[year][hybridKey].city.push(cityMpg);
            yearArrays[year][hybridKey].highway.push(highwayMpg);
        } else {
            yearArrays[year] = {};
            yearArrays[year][hybridKey] = {};
            yearArrays[year][hybridKey]['city'] = [cityMpg];
            yearArrays[year][hybridKey]['highway']= [highwayMpg];
            yearArrays[year][oppositeKey] = {};
            yearArrays[year][oppositeKey]['city'] = [];
            yearArrays[year][oppositeKey]['highway']= [];
        }
    }
    for (const [year, value] of Object.entries(yearArrays)) {
        yearArrays[year].hybrid.city = getStatistics(yearArrays[year].hybrid.city).mean;
        yearArrays[year].hybrid.highway = getStatistics(yearArrays[year].hybrid.highway).mean;
        yearArrays[year].nothybrid.city = getStatistics(yearArrays[year].nothybrid.city).mean;
        yearArrays[year].nothybrid.highway = getStatistics(yearArrays[year].nothybrid.highway).mean;
    }
    return yearArrays;
}

const allMakerHybrids = getHybridMakes(mpg_data);
const avgMpgYearlyType = getIfHybridByYear(mpg_data);
console.log(avgMpgYearlyType)

export const moreStats = {
    makerHybrids: allMakerHybrids,
    avgMpgByYearAndHybrid: undefined
};
