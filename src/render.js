/* eslint no-param-reassign: "error" */

const render = (elements) => (path, value, prevValue) => {
  console.log(path, value);
  if (path === 'form.valid') {
    if (!prevValue) {
      elements.message.classList.remove('text-danger');
    }
    if (value) {
      elements.input.classList.remove('is-invalid');
      elements.message.classList.add('text-success');
      elements.message.textContent = 'RSS успешно загружен';
    }
  }
  if (path === 'form.error' && value !== '') {
    elements.input.classList.add('is-invalid');
    elements.message.classList.remove('text-success');
    elements.message.classList.add('text-danger');
    elements.message.textContent = value;
  }
  elements.form.reset();
  elements.input.focus();
};

export default render;
