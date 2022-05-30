import onChange from 'on-change';
import i18next from 'i18next';
import * as yup from 'yup';
import ru from './locales/ru.js';
import render from './view.js';
import findNodes from './nodes.js';
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

  const nodes = findNodes(i18nInstance);

  const state = {
    form: {
      state: 'process',
      errorName: '',
    },
    modal: {
      id: null,
      state: false,
    },
    links: [],
    feeds: [],
    posts: [],
    ui: {
      readPosts: new Set(),
    },
  };

  const watchedState = onChange(state, render(nodes, i18nInstance, state));

  const schema = yup.string().url();

  const findCurrentErrorName = (error) => {
    const map = {
      isAlreadyExists: 'alreadyExists',
      isNotContainValid: 'notContainValid',
      isParsingError: 'mustBeValid',
      isNetworkError: 'networkError',
      default: 'unspecific',
    };
    const currentKey = Object.keys(map).find((key) => (error[key]));
    if (!currentKey) {
      return map.default;
    }
    const currentErrorName = map[currentKey];
    return currentErrorName;
  };

  nodes.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const feedUrl = formData.get('url');

    schema.notOneOf(state.links).validate(feedUrl)
      .then((url) => loader(url, watchedState))
      .then(() => update(watchedState, delay))
      .catch((error) => {
        const currentError = { ...error };
        const { type } = currentError;
        if (type === 'notOneOf') {
          currentError.isAlreadyExists = true;
        }
        if (type === 'url') {
          currentError.isParsingError = true;
        }
        const errorName = findCurrentErrorName(currentError);
        watchedState.form.state = 'failing';
        watchedState.form.errorName = errorName;
      });
  });

  nodes.postsList.addEventListener('click', (event) => {
    const { target } = event;
    if (target.dataset.bsToggle === 'modal') {
      const { id } = target.dataset;
      watchedState.ui.readPosts.add(id);
      watchedState.modal.id = id;
      watchedState.modal.state = true;
    }
  });

  nodes.modal.addEventListener('click', (event) => {
    const { target } = event;
    if (target.dataset.bsDismiss === 'modal') {
      watchedState.modal.state = false;
    }
  });
};
