/* eslint-disable no-param-reassign */
import _ from 'lodash';
import { getData } from './loader.js';

const update = (state, delay, i18nInstance) => {
  setTimeout(function request() {
    if (state.valid) {
      console.log(delay);
      Promise.all(state.links.map((url) => getData(url, i18nInstance, state))).then((data) => {
        const { posts } = data;
        const difference = _.differenceBy(posts, state.posts, 'title');
        state.posts.push(...difference);
        state.posts = _.sortBy(state.posts, ['feedId', 'id']);
        setTimeout(request, delay);
      });
    }
  }, delay);
};

export default update;
