/* eslint-disable no-param-reassign */
import axios from 'axios';
import parser from './parser.js';
import createUrl from './createUrl.js';

const { CancelToken } = axios;
const source = CancelToken.source();
const loader = (url, state) => {
  state.process = 'sending';
  return axios
    .get(createUrl(url), {
      cancelToken: source.token,
      timeout: 5000,
    })
    .then((response) => {
      const { feed, posts } = parser(response.data.contents);
      state.valid = true;
      state.links.push(url);
      state.feeds.push(feed);
      state.posts.push(...posts);
      state.error = '';
      state.process = 'filling';
    }).catch((err) => {
      const error = new Error();
      if (err.request || err.response) {
        // @ts-ignore
        error.networkError = true;
      } else {
        // @ts-ignore
        error.isNotContainValid = true;
      }
      throw error;
    });
};

export default loader;
