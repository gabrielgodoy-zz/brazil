import getStatesData from '../api';
import {addDots} from '../helpers';

let State = (() => {
  /**
   * @param {Object} ufs States Topojson Object
   * @param {Object} svgGroup
   * @return {string|Selection}
   */
  function createState(ufs, svgGroup) {
    return svgGroup.selectAll('.uf')
                   .data(ufs)
                   .enter()
                   .append('g')
                   .attr('class', d => {
                     let stateName = `uf-${d.id.toLowerCase()}`;
                     let regionName = d.properties.region.toLowerCase();
                     return `${stateName} ${regionName} uf`;
                   });
  }

  function addEventListeners(state) {
    state.on("click", stateClick);

    let statesData;

    function stateClick(d) {
      document.querySelector('.state-details').innerHTML = `
      <p class="loading-data">
        <span class="loader"></span> Carregando dados...
      </p>
    `;
      if (!statesData) {
        getStatesData().then(response => {
          let {data: statesData} = response;
          displayStateInSidebar(d, statesData);
        });
      } else {
        displayStateInSidebar(d, statesData);
      }
    }
  }

  function createLabelsData(ufsData, path) {
    return ufsData.map(d => {
      return {
        x: path.centroid(d)[0],
        y: path.centroid(d)[1],
        label: d.properties.name,
        initials: d.id
      };
    });
  }

  /**
   * @param {String} state
   * @param {Object} state.properties
   * @param {String} state.properties.name
   * @param {String} state.properties.capital
   * @param {String} statesData
   * @param {Array} statesData.geonames
   * @param {Number} statesData.population
   */
  function displayStateInSidebar(state, statesData) {
    let lowerCaseState = state.properties.name.toLowerCase();
    let stateDetails = statesData.geonames
                                 .find(stateDetails => {
                                   return lowerCaseState === stateDetails.adminName1.toLowerCase()
                                 });
    insertStateDetails(state, stateDetails, statesData);
  }

  function insertStateDetails(state, stateDetails, statesData) {
    let stateObject = getStateDetails(stateDetails, statesData);

    let stateName = state.properties.name;
    document.querySelector('.state-details').innerHTML = `
      <h3 class="title-sidebar">${stateName}</h3>
      <p>Capital: ${state.properties.capital}</p>
      <p>População: <strong>${addDots(stateObject.population)}</strong></p>
    `
  }

  function createLabels(svgGroup, labelsData) {
    let ufLabels = svgGroup.selectAll('.uf-initial')
                           .data(labelsData)
                           .enter().append('g')
                           .attr('class', 'uf-initial');

    ufLabels.append('text')
            .attr('text-anchor', 'middle')
            .attr('class', d => `uf-initial-text state-${d.initials.toLowerCase()}`)
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .text(d => d.initials)
  }

  function getStateDetails(stateDetails = undefined, statesData) {
    if (stateDetails) {
      return stateDetails;
    } else {
      let brasilia = 'Federal District';
      return statesData.geonames
                       .find(stateDetails => stateDetails.adminName1 === brasilia);
    }
  }

  return {createState, addEventListeners, createLabelsData, createLabels}
})();

export default State;

