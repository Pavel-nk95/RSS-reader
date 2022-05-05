const findDOMItems = () => (
  {
    container: document.querySelector('div.d-flex'),
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    main: document.querySelector('.main'),
    title: document.querySelector('h1.title'),
    description: document.querySelector('p.lead'),
    add: document.querySelector('button.add'),
    example: document.querySelector('.text-muted'),
    footerContent: document.querySelector('.footer-content'),
    message: document.querySelector('p.feedback'),
    content: document.querySelector('.content'),
    postsTitle: document.querySelector('.posts-title'),
    feedsTitle: document.querySelector('.feeds-title'),
    postsList: document.querySelector('.posts-list'),
    feedsList: document.querySelector('.feeds-list'),
    modal: document.querySelector('.modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalDescription: document.querySelector('.modal-body'),
    modalBtnClose: document.querySelector('.close'),
    modalBtnReadAll: document.querySelector('.read-all'),
  }
);

export default findDOMItems;