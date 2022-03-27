/* eslint-disable no-param-reassign */
import axios from 'axios';
import parser from './parser.js';
import createUrl from './createUrl.js';

const { CancelToken } = axios;
const source = CancelToken.source();

const addId = (data, state) => {
  data.feedID += 1;
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

const getData = (url, i18nInstance, state) => axios.get(createUrl(url), {
  cancelToken: source.token,
  timeout: 10000,
}).then((response) => {
  if (response.status === 200) {
    return Promise.resolve(parser(response, i18nInstance.t('errors.notContainValid')));
  }
  state.error = i18nInstance.t('errors.unspecific');
  throw new Error(state.error);
}).then((data) => addId(data, state));

const loadRSS = (validatePromise, state, elements, i18nInstance) => validatePromise
  .then((url) => getData(url, i18nInstance, state)).then((data) => {
    if (state.links.includes(state.url)) {
      state.error = i18nInstance.t('errors.alreadyExists');
      throw new Error(i18nInstance.t('errors.alreadyExists'));
    }
    elements.message.textContent = i18nInstance.t('messages.correct');
    state.valid = true;
    state.links.push(state.url);
    state.feeds.push(data.feed);
    state.posts.push(...data.posts);
    state.error = '';
    elements.form.reset();
    elements.input.focus();
    elements.input.removeAttribute('readonly');
    elements.add.disabled = false;
    elements.input.value = '';
    return data;
  })
  .catch((error) => {
    elements.add.disabled = false;
    elements.input.removeAttribute('readonly');
    elements.input.focus();
    state.valid = false;
    let errorMessage = error.message;
    if (errorMessage === 'this must be a valid URL') {
      errorMessage = i18nInstance.t('errors.mustBeValid');
    }
    if (errorMessage === 'Network Error') {
      errorMessage = i18nInstance.t('errors.unspecific');
    }
    state.error = errorMessage;
  });

export { loadRSS, getData };
