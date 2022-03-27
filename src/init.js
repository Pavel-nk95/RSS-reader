import onChange from 'on-change';
import i18next from 'i18next';
import * as yup from 'yup';
import ru from './locales/ru.js';
import render from './view.js';
import findDOMItems from './nodes.js';
import { loadRSS } from './loader.js';
import update from './update.js';

const delay = 5000;

export default () => {
  const i18nInstance = i18next.createInstance();

  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  });

  const elements = findDOMItems();

  elements.title.textContent = i18nInstance.t('static.title');
  elements.description.textContent = i18nInstance.t('static.description');
  elements.add.textContent = i18nInstance.t('buttons.add');
  elements.example.textContent = i18nInstance.t('static.example');
  elements.footerContent.textContent = i18nInstance.t('static.footerContent');
  elements.input.setAttribute('placeholder', i18nInstance.t('static.placeholder'));
  elements.postsTitle.textContent = i18nInstance.t('static.posts');
  elements.feedsTitle.textContent = i18nInstance.t('static.feeds');

  const state = {
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

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const urlStr = formData.get('url');
    watchedState.url = urlStr;
    elements.add.disabled = true;
    elements.input.setAttribute('readonly', true);
    const validatePromise = validate(urlStr);

    loadRSS(validatePromise, watchedState, elements, i18nInstance);
    update(watchedState, delay, i18nInstance);
  });

  elements.postsList.addEventListener('click', (event) => {
    const { target } = event;
    if (target.tagName === 'BUTTON') {
      const { id } = target.dataset;
      watchedState.ui.readPosts.push(id);
      watchedState.modal.id = id;
      watchedState.modal.state = true;
    }
  });

  elements.modal.addEventListener('click', (event) => {
    const { target } = event;
    if (target.dataset.bsDismiss === 'modal') {
      watchedState.modal.state = false;
    }
  });
};
