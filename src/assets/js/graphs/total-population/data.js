import * as d3 from 'd3';

export default function getData() {
  let data = require('./../../../data/population-projection/age-groups-total.csv');
  return formatData(data);
}

function formatData(ageGroups) {
  let parseTime = d3.timeParse('%Y');
  return ageGroups.map(ageGroup => {
    return {
      ageGroup: ageGroup['age-group'],
      years: Object.keys(ageGroup).map(year => {
        return {
          year: parseTime(year),
          population: Number(ageGroup[year].replace(/\./g, ''))
        }
      }).filter(yearDetails => yearDetails.year !== null)
    }
  })
}
