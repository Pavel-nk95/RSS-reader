/* eslint-disable no-param-reassign */
const renderFeeds = (data, nodes) => {
  const list = nodes.feedsList;
  list.innerHTML = '';
  data.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm0');
    h3.textContent = `${item.title}`;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = `${item.description}`;
    li.append(h3);
    li.append(p);
    list.append(li);
  });
};

const renderPosts = (data, nodes, i18nInstance, readPosts) => {
  const list = nodes.postsList;
  list.innerHTML = '';
  data.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    const link = document.createElement('a');
    link.setAttribute('href', `${item.link}`);
    link.setAttribute('target', '_blank');
    link.textContent = `${item.title}`;
    link.classList.add('fw-bold');

    if (readPosts.has(String(item.id))) {
      link.classList.remove('fw-bold');
      link.classList.add('fw-normal');
      link.classList.add('link-secondary');
    }

    const btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.dataset.id = item.id;
    btn.dataset.feedId = item.feedId;
    btn.dataset.bsToggle = 'modal';
    btn.dataset.bsTarget = '#modal';
    btn.textContent = i18nInstance.t('buttons.view');
    li.append(link);
    li.append(btn);
    list.append(li);
  });
};

const renderModal = (nodes, i18nInstance, { title, description, link }) => {
  const {
    modalTitle,
    modalDescription,
    modalBtnClose,
    modalBtnReadAll,
  } = nodes;
  modalTitle.textContent = title;
  modalDescription.innerHTML = description;
  modalBtnClose.textContent = i18nInstance.t('buttons.close');
  modalBtnReadAll.setAttribute('href', link);
  modalBtnReadAll.textContent = i18nInstance.t('buttons.readAll');
};

const render = (nodes, i18nInstance, state) => (path, value) => {
  if (path === 'feeds') {
    renderFeeds(value, nodes);
  }

  if (path === 'posts') {
    renderPosts(value, nodes, i18nInstance, state.ui.readPosts);
  }

  if (path === 'form.state' && value === 'filling') {
    nodes.message.textContent = i18nInstance.t('messages.correct');
    nodes.form.reset();
    nodes.input.focus();
    nodes.input.removeAttribute('readonly');
    nodes.add.disabled = false;
    nodes.message.classList.remove('text-danger');
    nodes.content.classList.remove('visually-hidden');
    nodes.input.classList.remove('is-invalid');
    nodes.message.classList.add('text-success');
    nodes.input.value = '';
  }

  if (path === 'form.state' && value === 'failing') {
    nodes.add.disabled = false;
    nodes.input.removeAttribute('readonly');
    nodes.input.focus();
    nodes.input.classList.add('is-invalid');
    nodes.message.classList.remove('text-success');
    nodes.message.classList.add('text-danger');
  }

  if (path === 'form.state' && value === 'sending') {
    nodes.add.disabled = true;
    nodes.input.setAttribute('readonly', true);
  }

  if (path === 'form.errorName') {
    nodes.message.textContent = i18nInstance.t(`errors.${value}`);
  }

  if (path === 'ui.readPosts') {
    const items = Array.from(value);
    const currentID = items[items.length - 1];
    const currentLink = nodes.postsList.querySelector(
      `[data-id="${currentID}"]`,
    ).previousElementSibling;
    currentLink.classList.remove('fw-bold');
    currentLink.classList.add('fw-normal');
    currentLink.classList.add('link-secondary');
  }

  if (path === 'modal.state' && value) {
    const [currentPost] = state.posts.filter(
      ({ id }) => (id === +state.modal.id),
    );
    renderModal(nodes, i18nInstance, currentPost);
  }
};

export default render;
