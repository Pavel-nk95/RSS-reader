import './app.scss';
import 'bootstrap/js/src/util/';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import render from './render.js';
import parser from './parser';

i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru: {
      translation: {
        error: {
          unspecific: 'Что то пошло не так',
          'RSS already exists': 'RSS уже существует',
          'Resource does not contain valid rss': 'Ресурс не содержит валидный RSS',
          'this must be a valid URL': 'Ссылка должна быть валидным URL',
        },
      },
    },
  },
});

const elements = {
  form: document.querySelector('.rss-form'),
  message: document.querySelector('.feedback'),
  input: document.querySelector('#url-input'),
};

const state = onChange({
  links: [],
  feeds: [],
  posts: [],
  form: {
    valid: false,
    error: '',
    url: '',
  },
}, render(elements));

const schema = yup.string().url().notOneOf(state.links);

const validate = (url) => schema.validate(url);

elements.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const urlStr = formData.get('url');

  validate(urlStr).then((link) => axios.get(`https://hexlet-allorigins.herokuapp.com/raw?url=${link}`))
    .then((response) => Promise.resolve(parser(response)))
    .then(() => {
      if (state.links.includes(urlStr)) {
        throw new Error('RSS already exists');
      }
      state.links.push(urlStr);
      state.form.valid = true;
      state.form.url = urlStr;
      state.form.error = '';
    })
    .catch((error) => {
      state.form.valid = false;
      state.form.error = i18next.t([`error.${error.message}`, 'error.unspecific']);
    });
});
