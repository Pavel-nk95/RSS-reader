import './app.scss';
import 'bootstrap/js/src/util/';

const form = window.document.querySelector('.rss-form');

form.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Good!');
});
