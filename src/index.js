import listOfCountriesTpl from '../src/templates/listOfCountries.hbs';
import countryInfoTpl from '../src/templates/countryInfo.hbs';
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

function makeListOfCountries(arrayOfCountries) {
  return arrayOfCountries.reduce((acc, country) => {
    return acc + listOfCountriesTpl(country);
  }, '');
}

function addListToHTML(arrayOfCountries) {
  const list = makeListOfCountries(arrayOfCountries);
  refs.list.innerHTML = list;
}

function showChosenCountry(country) {
  const countyCard = countryInfoTpl(country[0]);
  refs.containerInfo.innerHTML = countyCard;
}

function resetCountries() {
  refs.list.innerHTML = '';
  refs.containerInfo.innerHTML = '';
}

function onInputText(event) {
  const searchString = event.target.value.trim();
  if (searchString === '') {
    resetCountries();
    return;
  }

  fetchCountries(searchString)
    .then(response => {
      if (response.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        resetCountries();
        return;
      }

      if (response.length > 2 && response.length <= 10) {
        refs.containerInfo.innerHTML = '';
        addListToHTML(response);
      } else {
        refs.list.innerHTML = '';
        showChosenCountry(response);
      }
    })
    .catch(() => {
      Notify.failure('Oops, there is no country with that name');
    });
}

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  containerInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputText, DEBOUNCE_DELAY));
