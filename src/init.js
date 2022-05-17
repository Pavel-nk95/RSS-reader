import onChange from 'on-change';
import i18next from 'i18next';
import * as yup from 'yup';
import ru from './locales/ru.js';
import render from './view.js';
import findDOMItems from './nodes.js';
import loader from './loader.js';
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
  elements.input.setAttribute(
    'placeholder',
    i18nInstance.t('static.placeholder'),
  );
  elements.postsTitle.textContent = i18nInstance.t('static.posts');
  elements.feedsTitle.textContent = i18nInstance.t('static.feeds');

  const state = {
    process: 'filling',
    modal: {
      id: null,
      state: false,
    },
    links: [],
    feeds: [],
    posts: [],
    valid: false,
    currentError: '',
    ui: {
      readPosts: new Set(),
    },
  };

  const watchedState = onChange(state, render(elements, i18nInstance, state));

  const schema = yup.string().url();

  const validate = (url) => {
    if (state.links.includes(url)) {
      return new Promise(() => {
        const error = new Error;
        error.isAlreadyExists = true;
        throw error;
      });
    }
    return schema.validate(url);
  };

  const generateErrorMessage = (error) => {
    if (error.isAlreadyExists) {
      return i18nInstance.t('errors.alreadyExists');
    }
    if (error.isNotContainValid) {
      return i18nInstance.t('errors.notContainValid');
    }
    if (error.isParsingError) {
      return i18nInstance.t('errors.mustBeValid');
    }
    return i18nInstance.t('errors.unspecific');
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const urlStr = formData.get('url');

    validate(urlStr)
      .then((url) => loader(url, watchedState))
      .then(() => update(watchedState, delay))
      .catch((error) => {
        if (error.name === 'ValidationError') {
          error.isParsingError = true;
        }
        const errorMessage = generateErrorMessage(error);
        watchedState.process = 'failing';
        watchedState.valid = false;
        watchedState.currentError = errorMessage;
      });
  });

  elements.postsList.addEventListener('click', (event) => {
    const { target } = event;
    if (target.tagName === 'BUTTON') {
      const { id } = target.dataset;
      watchedState.ui.readPosts.add(id);
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
