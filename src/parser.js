import { uniqueId } from 'lodash';

const generateData = (node, feedId) => {
  const title = node.querySelector('title').textContent;
  const link = node.querySelector('link').textContent;
  const description = node.querySelector('description').textContent;
  return {
    title,
    link,
    description,
    feedId,
  };
};

const parser = (content) => {
  const domParser = new DOMParser();
  const data = domParser.parseFromString(content, 'application/xml');
  const error = data.querySelector('parsererror');
  if (error) {
    const currentError = new Error();
    currentError.isNotContainValid = true;
    throw currentError;
  }
  const channel = data.querySelector('channel');
  const items = Array.from(channel.querySelectorAll('item'));
  const feedId = +uniqueId();
  const posts = items.map((item, id) => ({
    ...generateData(item, feedId),
    id: id + 1,
  }));
  const feed = generateData(channel, feedId);
  return { posts, feed };
};

export default parser;
