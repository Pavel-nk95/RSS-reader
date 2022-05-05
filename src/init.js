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
    currentError: '',
    currentUrl: '',
    ui: {
      readPosts: [],
    },
  };

  const watchedState = onChange(state, render(elements, i18nInstance, state));

  const schema = yup.string().url();

  const validate = (url) => {
    if (state.links.includes(url)) {
      return new Promise(() => {
        throw new Error('already exists');
      });
    }
    return schema.validate(url);
  };

  const generateErrorMessage = (message) => {
    switch (message) {
      case 'this must be a valid URL':
        return i18nInstance.t('errors.mustBeValid');
      case 'not contain valid':
        return i18nInstance.t('errors.notContainValid');
      case 'already exists':
        return i18nInstance.t('errors.alreadyExists');
      case 'not empty':
        return i18nInstance.t('messages.notEmpty');
      default:
        return i18nInstance.t('errors.unspecific');
    }
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const urlStr = formData.get('url');
    watchedState.currentUrl = urlStr;

    validate(urlStr)
      .then((url) => loader(url, watchedState))
      .then(() => update(watchedState, delay))
      .catch((error) => {
        const errorMessage = generateErrorMessage(error.message);
        watchedState.process = 'failing';
        watchedState.valid = false;
        watchedState.currentError = errorMessage;
      });
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
