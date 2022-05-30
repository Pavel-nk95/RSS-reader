/* eslint-disable no-param-reassign */
import axios from 'axios';
import parser from './parser.js';
import createUrl from './createUrl.js';

const { CancelToken } = axios;
const source = CancelToken.source();
const loader = (url, state) => {
  state.form.state = 'sending';
  return axios
    .get(createUrl(url), {
      cancelToken: source.token,
      timeout: 5000,
    })
    .then((response) => {
      const { feed, posts } = parser(response.data.contents);
      state.links.push(url);
      state.feeds.push(feed);
      state.posts.push(...posts);
      state.form.state = 'filling';
    }).catch((error) => {
      const currentError = { ...error };
      if (error.isAxiosError) {
        currentError.isNetworkError = true;
      }
      throw currentError;
    });
};

export default loader;
