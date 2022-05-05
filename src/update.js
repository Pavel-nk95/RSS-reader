/* eslint-disable no-param-reassign */
import _ from 'lodash';
import axios from 'axios';
import parser from './parser.js';
import createUrl from './createUrl.js';

const update = (state, delay) => {
  const request = () => {
    Promise.all(
      state.links.map((url) => (
        Promise.resolve(url)
          .then((link) => axios.get(createUrl(link)))
          .then((response) => parser(response))
          .then((data) => {
            const posts = data.posts.map((item) => {
              state.postID += 1;
              item.id = state.postID;
              item.feedId = state.feedID;
              return item;
            });
            const difference = _.differenceBy(posts, state.posts, 'title');
            state.posts.push(...difference);
            state.posts = _.sortBy(state.posts, ['feedId', 'id']);
          })
      )),
    ).finally(() => {
      setTimeout(request, delay);
    });
  };
  request();
};

export default update;
