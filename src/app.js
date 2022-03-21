/* eslint-disable no-param-reassign */
import './styles/style.scss';
import 'bootstrap/js/src/util/';
import onChange from 'on-change';
import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import ru from './locales/ru.js';
import parser from './parser.js';
import render from './view.js';

const defaultLanguage = 'ru';

const i18nInstance = i18next.createInstance();

const { CancelToken } = axios;
const source = CancelToken.source();

i18nInstance.init({
  lng: defaultLanguage,
  debug: false,
  resources: {
    ru,
  },
});

const elements = {
  container: document.querySelector('div.d-flex'),
  form: document.querySelector('.rss-form'),
  input: document.getElementById('url-input'),
  main: document.querySelector('.main'),
  title: document.querySelector('h1.title'),
  description: document.querySelector('p.lead'),
  label: document.querySelector('label.description'),
  add: document.querySelector('button.add'),
  example: document.querySelector('.text-muted'),
  footerContent: document.querySelector('.footer-content'),
  message: document.querySelector('p.feedback'),
  content: document.querySelector('.content'),
  postsTitle: document.querySelector('.posts-title'),
  feedsTitle: document.querySelector('.feeds-title'),
  postsList: document.querySelector('.posts-list'),
  feedsList: document.querySelector('.feeds-list'),
};

elements.title.textContent = i18nInstance.t('static.title');
elements.description.textContent = i18nInstance.t('static.description');
elements.label.textContent = i18nInstance.t('static.label');
elements.add.textContent = i18nInstance.t('buttons.add');
elements.example.textContent = i18nInstance.t('static.example');
elements.footerContent.textContent = i18nInstance.t('static.footerContent');
elements.input.setAttribute('placeholder', i18nInstance.t('static.placeholder'));
elements.postsTitle.textContent = i18nInstance.t('static.posts');
elements.feedsTitle.textContent = i18nInstance.t('static.feeds');

const state = onChange({
  lng: defaultLanguage,
  processState: 'waiting',
  links: [],
  feeds: [],
  posts: [],
  valid: false,
  error: '',
  url: '',
}, render(elements, i18nInstance));

const schema = yup.string().url().notOneOf(state.links);

const validate = (url) => schema.validate(url);

elements.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const urlStr = formData.get('url');

  validate(urlStr).then((link) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${link}`, {
    cancelToken: source.token,
    timeout: 5000,
  })).then((response) => {
    if (response.statusText === 'OK') return Promise.resolve(parser(response, i18nInstance.t('errors.notContainValid')));
    throw new Error(i18nInstance.t('errors.unspecific'));
  }).then((data) => {
    if (state.links.includes(urlStr)) {
      throw new Error(i18nInstance.t('errors.alreadyExists'));
    }

    let count = 0;
    const posts = data.posts.map((item) => {
      count += 1;
      item.id = count;
      item.feedId = state.feeds.length + 1;
      return item;
    });

    const [feed] = data.feed;
    feed.id = state.feeds.length + 1;

    state.feeds.push(feed);
    state.posts.push(...posts);

    state.valid = true;
    state.links.push(urlStr);
    state.url = urlStr;
    state.error = '';
  })
    .catch((error) => {
      state.valid = false;
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      }
      state.error = error.message === 'this must be a valid URL'
        ? i18nInstance.t('errors.mustBeValid') : error.message;
    });
});
