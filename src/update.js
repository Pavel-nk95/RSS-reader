/* eslint-disable no-param-reassign */
import { differenceBy, sortBy } from 'lodash';
import axios from 'axios';
import parser from './parser.js';
import createUrl from './createUrl.js';

const update = (state, delay) => {
  setTimeout(() => {
    Promise.all(
      state.links.map((url) => (
        Promise.resolve(url)
          .then((link) => axios.get(createUrl(link)))
          .then((response) => {
            const { posts } = parser(response.data.contents);
            const newPosts = differenceBy(posts, state.posts, 'title');
            if (newPosts.length !== 0) {
              state.posts.push(...newPosts);
              state.posts = sortBy(state.posts, ['feedId', 'id']);
            }
          })
      )),
    ).finally(() => {
      update(state, delay);
    });
  }, delay);
};

export default update;
