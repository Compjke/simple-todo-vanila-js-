import { getFromLS, saveInLS, formatDate } from './utils.js';

const input = document.querySelector('[data-text-field]');
const todoForm = document.querySelector('.add-todo-form');
const todoContainer = document.querySelector('.todo-container');
const todoTemplate = document.querySelector('[data-todo-template]');
const searchInput = document.querySelector('.search__input');

let todoList = getFromLS('todos');

todoForm.addEventListener('submit', (e) => {
	e.preventDefault();
	if (!input.value) {
		input.placeholder = 'Type something';
		input.classList.add('error');
		setTimeout(() => {
			input.classList.remove('error');
			input.placeholder = 'Add new todo...';
		}, 2000);
		return;
	}
	// const formData = new FormData(todoForm);
	// const dataObj = Object.fromEntries(formData);
	const newTodo = {
		id: Date.now(),
		text: input.value,
		done: false,
		createdAt: formatDate(new Date()),
	};
	todoList.push(newTodo);
	saveInLS('todos', todoList);
	renderItems();
	input.value = '';
	searchInput.value = '';
});

searchInput.addEventListener('input', (e) => {
	const searchValue = e.target.value.toLowerCase().trim();
	renderFilteredTodos(searchValue);
});

const renderFilteredTodos = (searchValue) => {
	const filteredTodos = todoList.filter((todo) =>
		todo.text.toLowerCase().includes(searchValue)
	);
	renderItems(filteredTodos);
};

const renderItems = (items = todoList) => {
	todoContainer.innerHTML = '';
	if (!items.length) {
		todoContainer.innerHTML = `<p>List is empty<p>`;
		return;
	}
	items.forEach((todo) => {
		const todoEl = createTodoLAyout(todo);
		todoContainer.append(todoEl);
	});
};

function createTodoLAyout(todo) {
	const todoEl = document.importNode(todoTemplate.content, true);
	const todoText = todoEl.querySelector('[data-todo-text]');
	const checkBox = todoEl.querySelector('[data-todo-checkbox]');
	const date = todoEl.querySelector('[data-todo-date]');
	const removeBtn = todoEl.querySelector('[data-todo-remove]');
	checkBox.checked = todo.done;
	todoText.textContent = todo.text;
	date.textContent = todo.createdAt;
	removeBtn.disabled = !todo.done;
	checkBox.addEventListener('change', (e) => {
		todoList = todoList.map((el) => {
			if (el.id === todo.id) {
				el.done = e.target.checked;
			}
			return el;
		});
		saveInLS('todos', todoList);

		if (searchInput.value) {
			renderFilteredTodos(searchInput.value);
		} else {
			renderItems();
		}
	});
	removeBtn.addEventListener('click', (e) => {
		todoList = todoList.filter((el) => el.id !== todo.id);
		saveInLS('todos', todoList);

		if (searchInput.value) {
			renderFilteredTodos(searchInput.value);
		} else {
			renderItems();
		}
	});
	return todoEl;
}

renderItems();
