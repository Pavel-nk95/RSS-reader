/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import './styles/style.scss';
import 'bootstrap/js/src/util/';
import 'bootstrap/js/src/modal.js';
import onChange from 'on-change';
import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import ru from './locales/ru.js';
import parser from './parser.js';
import render from './view.js';
import elements from './elements.js';

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

elements.title.textContent = i18nInstance.t('static.title');
elements.description.textContent = i18nInstance.t('static.description');
elements.label.textContent = i18nInstance.t('static.label');
elements.add.textContent = i18nInstance.t('buttons.add');
elements.example.textContent = i18nInstance.t('static.example');
elements.footerContent.textContent = i18nInstance.t('static.footerContent');
elements.input.setAttribute('placeholder', i18nInstance.t('static.placeholder'));
elements.postsTitle.textContent = i18nInstance.t('static.posts');
elements.feedsTitle.textContent = i18nInstance.t('static.feeds');

const state = {
  lng: defaultLanguage,
  feedID: 0,
  postID: 0,
  modal: {
    id: '',
    state: false,
  },
  links: [],
  feeds: [],
  posts: [],
  valid: false,
  error: '',
  url: '',
  ui: {
    readPosts: [],
  },
};

const watchedState = onChange(state, render(elements, i18nInstance, state));

const schema = yup.string().url().notOneOf(watchedState.links);

const validate = (url) => schema.validate(url);

const addIDNum = (data, startCount) => {
  if (startCount === 0) {
    watchedState.feedID = 0;
    watchedState.postID = 0;
  }
  watchedState.feedID += 1;
  const [feed] = data.feed;
  feed.feedId = watchedState.feedID;

  const posts = data.posts.map((item) => {
    watchedState.postID += 1;
    item.id = watchedState.postID;
    item.feedId = watchedState.feedID;
    return item;
  });
  return { feed, posts };
};

const getData = (link, startCount = null) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`, {
  cancelToken: source.token,
  timeout: 10000,
}).then((response) => {
  if (response.statusText === 'OK') return Promise.resolve(parser(response, i18nInstance.t('errors.notContainValid')));
  watchedState.valid = false;
  throw new Error(i18nInstance.t('errors.unspecific'));
}).then((data) => addIDNum(data, startCount));

const addNewRSS = (link) => getData(link).then((data) => {
  if (watchedState.links.includes(watchedState.url)) {
    watchedState.valid = false;
    throw new Error(i18nInstance.t('errors.alreadyExists'));
  }
  watchedState.valid = true;
  watchedState.links.push(watchedState.url);
  watchedState.feeds.push(data.feed);
  watchedState.posts.push(...data.posts);
  watchedState.error = '';
  elements.form.reset();
  elements.input.focus();
  return data;
});

elements.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const urlStr = formData.get('url');
  watchedState.url = urlStr;

  validate(urlStr).then((link) => addNewRSS(link)).then(() => {
    setTimeout(function request() {
      if (watchedState.valid) {
        Promise.all(watchedState.links.map((url) => getData(url, 0))).then((data) => {
          const { posts } = data;
          const difference = _.differenceBy(posts, watchedState.posts, 'title');
          watchedState.posts.push(...difference);
          watchedState.posts = _.sortBy(watchedState.posts, ['feedId', 'id']);
          setTimeout(request, delay);
        });
      }
    }, delay);
  }).catch((error) => {
    watchedState.valid = false;
    const errorMessage = error.message === 'this must be a valid URL'
      ? i18nInstance.t('errors.mustBeValid') : error.message;
    watchedState.error = errorMessage;
  });
});

elements.postsList.addEventListener('click', (event) => {
  const { target } = event;
  const { id } = target.dataset;
  watchedState.ui.readPosts.push(id);
  watchedState.modal.id = id;
  watchedState.modal.state = true;
});

elements.modal.addEventListener('click', (event) => {
  const { target } = event;
  if (target.dataset.bsDismiss === 'modal') {
    watchedState.modal.state = false;
  }
});
