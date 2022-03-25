/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import './styles/style.scss';
import 'bootstrap/js/src/util/';
import onChange from 'on-change';
import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import ru from './locales/ru.js';
import parser from './parser.js';
import render from './view.js';

const defaultLanguage = 'ru';

const delay = 15000;

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
  postID: 0,
  feedID: 0,
  links: [],
  feeds: [],
  posts: [],
  valid: false,
  error: '',
  url: '',
}, render(elements, i18nInstance));

const schema = yup.string().url().notOneOf(state.links);

const validate = (url) => schema.validate(url);

const getData = (link) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`, {
  cancelToken: source.token,
  timeout: 10000,
}).then((response) => {
  if (response.statusText === 'OK') return Promise.resolve(parser(response, i18nInstance.t('errors.notContainValid')));
  state.valid = false;
  throw new Error(i18nInstance.t('errors.unspecific'));
});

const addIDNum = (data) => {
  state.feedID += 1;
  const [feed] = data.feed;
  feed.feedId = state.feedID;

  const posts = data.posts.map((item) => {
    state.postID += 1;
    item.id = state.postID;
    item.feedId = state.feedID;
    return item;
  });

  return { feed, posts };
};

const addNewRSS = (link) => getData(link).then((data) => addIDNum(data)).then((data) => {
  if (state.links.includes(state.url)) {
    state.valid = false;
    throw new Error(i18nInstance.t('errors.alreadyExists'));
  }
  state.valid = true;
  state.links.push(state.url);
  state.feeds.push(data.feed);
  state.posts.push(...data.posts);
  state.error = '';
  return data;
});

elements.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const urlStr = formData.get('url');
  state.url = urlStr;

  validate(urlStr).then((link) => addNewRSS(link)).then(() => {
    if (state.valid) {
      setTimeout(function request() {
        // TODO
        let feedID = 0;
        Promise.all(state.links.map((url) => getData(url))).then((data) => {
          const posts = data.map((item) => item.posts).flatMap((posts) => {
            feedID += 1;
            return posts.map((item) => {
              item.feedId = feedID;
              return item;
            });
          });
          console.log(posts);
          const difference = _.differenceBy(posts, state.posts, 'title');
          const result = difference.map((item) => {
            const postID = state.posts.filter((el) => el.feedId === item.feedId).length + 1;
            item.id = postID;
            return item;
          });
          state.posts.push(...result);
          setTimeout(request, delay);
        });
      }, delay);
    }
  }).catch((error) => {
    state.valid = false;
    console.log(state.valid);
    if (axios.isCancel(error)) {
      console.log('Request canceled', error.message);
    }
    state.error = error.message === 'this must be a valid URL'
      ? i18nInstance.t('errors.mustBeValid') : error.message;
  });
});
