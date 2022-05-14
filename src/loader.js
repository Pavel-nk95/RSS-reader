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
      timeout: 10000,
    })
    .then((response) => {
      const data = parser(response.data.contents);
      state.feedID += 1;
      const [feed] = data.feed;
      feed.feedId = state.feedID;

      const posts = data.posts.map((item) => {
        state.postID += 1;
        item.id = state.postID;
        item.feedId = state.feedID;
        return item;
      });
      state.valid = true;
      state.links.push(state.currentUrl);
      state.feeds.push(feed);
      state.posts.push(...posts);
      state.error = '';
      state.process = 'filling';
    }).catch((error) => {
      throw new Error('not contain valid');
    });
};

export default loader;
