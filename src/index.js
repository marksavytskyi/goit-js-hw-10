import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const countryList = document.querySelector('.country-list');
const countryField = document.querySelector('input#search-box');

countryField.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

async function onSearch(e) {
  if (e.target.value !== '') {
    const fieldValue = e.target.value.trim();

    try {
      return await fetchCountries(fieldValue).then(data => {
        if (data.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          countryList.innerHTML = '';
          return;
        }
        createMarkup(data);
      });
    } catch (error) {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    }
  }
}

function createMarkup(arr) {
  const markup = arr
    .map(el => {
      const {
        name: { official },
        capital,
        population,
        flags: { svg },
        languages,
      } = el;

      if (arr.length === 1) {
        return `<li class="country-item">
        <img src="${svg}" alt="${official}" class="country-img">
        <h2>${official}</h2>
        </li>
        <ul class="content-list">
        <li>
          <h3>Capital:</h3>
          <span class="content-span">${capital}</span>
        </li>
        <li>
          <h3>Population:</h3>
          <span class="content-span">${population}</span>
        </li>
        <li>
          <h3>Languages:</h3>
          <span class="content-span">${Object.values(languages).join(
            ', '
          )}</span>
        </li>
      </ul>`;
      }
      return `<li class="country-item">
        <img src="${svg}" alt="${official}" class="country-img">
        <h2>${official}</h2>
        </li>`;
    })
    .join('');

  countryList.innerHTML = markup;
}
