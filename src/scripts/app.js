const sqlite3 = require('sqlite3');
let data = []
const tableBody = document.getElementById('table-body')
const mainPage = document.getElementById('main-page')
const tableWrapper = document.getElementById('table-wrapper')
const actionsPage = document.getElementById('actions-page')
const emptyNotice = document.getElementById('empty-notice')
const name = document.getElementById('name')
const brand = document.getElementById('brand')
const sku = document.getElementById('sku')
const price = document.getElementById('price')
const count = document.getElementById('count')
let editMode = false
let editId = 0

const db = new sqlite3.Database('./database.sqlite');
console.log('Connected db:', db)

db.all("SELECT * FROM stocks", [], (err, stocks) => {
	if (!stocks) db.run("CREATE TABLE stocks (id INT, name TEXT, brand TEXT, sku TEXT, price INT, count INT)")
	else data = stocks
	createdAppHook()
});

function openCreateForm () {
	mainPage.style.display = 'none'
	actionsPage.style.display = 'block'
}

function addData () {	
	if (validate()) {
		document.getElementById('audio_error').play();
		return
	}
	
	const newItem = {
		id: editMode ? editId : data.length + 1,
		name: name.value,
		brand: brand.value,
		sku: sku.value,
		price: price.value,
		count: count.value,
	}
	console.log(editId, editMode)
	 if (editMode) {
		 db.run(`
			  UPDATE stocks
			  SET name = ?, brand = ?, sku = ?, price = ?, count = ?
			  WHERE id = ?;
		 `, [newItem.name, newItem.brand, newItem.sku, newItem.price, newItem.count, newItem.id])
		 const currentId = data.find(i => i.id === editId)
		 data.splice(currentId, 1, newItem)
		 editTableLine(editId, newItem)
		 editMode = false
		 editId = 0
	 } else {
		 db.run(`INSERT INTO stocks (id, name, brand, sku, price, count) VALUES ("${newItem.id}", "${newItem.name}", "${newItem.brand}", "${newItem.sku}", "${newItem.price}", "${newItem.count}");`)
		 data.push(newItem)
		 createdTableLine(newItem)
	 }
	renderMainPage()
}

function createdAppHook () {
	actionsPage.style.display = 'none'
	if (!data.length) {
		tableWrapper.style.display = 'none'
		emptyNotice.style.height = '50vh'
	} else {
		emptyNotice.style.setProperty('display', 'none', 'important')
		data.forEach(i => {
			createdTableLine(i)
		})
	}
	document.querySelector('#openCreatorItem').addEventListener('click', () => {
		openCreateForm()
	})
	document.querySelector('#btnAdd').addEventListener('click', () => {
		addData()
	})
	document.querySelector('#btnCancelAdd').addEventListener('click', () => {
		cancelAddItem()
	})
	// Псевдоожидание
	setTimeout(() => {
		document.getElementById('spinner').classList.add('display-none')
		document.getElementById('app').classList.remove('display-none')
	}, 1000)
}

function createdTableLine (item) {
	const el = document.createElement('tr');
	el.id = 'row_' + item.id
	el.classList.add('table__row')
	el.innerHTML = `
		<th scope="row">
			${item.id}
		</th>
		<td>
			${item.name}
		</td>
		<td>
			${item.brand}
		</td>
		<td>
			${item.sku || '-'}
		</td>
		<td>
			${item.price}
		</td>
		<td>
			${item.count}
		</td>
		<svg id="edit-el-${item.id}" class="svg_edit" 
		viewBox="0 0 24 24" 
		fill="none" 
		xmlns="http://www.w3.org/2000/svg"
		>
		<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
		<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
		<g id="SVGRepo_iconCarrier"> <path d="M11.4001 18.1612L11.4001 18.1612L18.796 10.7653C17.7894 10.3464 16.5972 9.6582 15.4697 8.53068C14.342 7.40298 13.6537 6.21058 13.2348 5.2039L5.83882 12.5999L5.83879 12.5999C5.26166 13.1771 4.97307 13.4657 4.7249 13.7838C4.43213 14.1592 4.18114 14.5653 3.97634 14.995C3.80273 15.3593 3.67368 15.7465 3.41556 16.5208L2.05445 20.6042C1.92743 20.9852 2.0266 21.4053 2.31063 21.6894C2.59466 21.9734 3.01478 22.0726 3.39584 21.9456L7.47918 20.5844C8.25351 20.3263 8.6407 20.1973 9.00498 20.0237C9.43469 19.8189 9.84082 19.5679 10.2162 19.2751C10.5343 19.0269 10.823 18.7383 11.4001 18.1612Z" fill="#096969FF"></path> <path d="M20.8482 8.71306C22.3839 7.17735 22.3839 4.68748 20.8482 3.15178C19.3125 1.61607 16.8226 1.61607 15.2869 3.15178L14.3999 4.03882C14.4121 4.0755 14.4246 4.11268 14.4377 4.15035C14.7628 5.0875 15.3763 6.31601 16.5303 7.47002C17.6843 8.62403 18.9128 9.23749 19.85 9.56262C19.8875 9.57563 19.9245 9.58817 19.961 9.60026L20.8482 8.71306Z" fill="#096969FF"></path> </g></svg>
		<svg id="delete-el-${item.id}" class="svg_trash" 
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 448 512"
			>
			<path
					d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
		</svg>
	`;
	tableBody.append(el)
	document.querySelector(`#edit-el-${item.id}`).addEventListener('click', editData.bind(item));
	document.querySelector(`#delete-el-${item.id}`).addEventListener('click', deleteTableLine.bind(item));
}
function editTableLine (id, item) {
	const el = document.getElementById('row_' + id);
	el.innerHTML = `
		<th scope="row">
			${item.id}
		</th>
		<td>
			${item.name}
		</td>
		<td>
			${item.brand}
		</td>
		<td>
			${item.sku || '-'}
		</td>
		<td>
			${item.price}
		</td>
		<td>
			${item.count}
		</td>
		<svg id="edit-el-${item.id}" class="svg_edit" 
		viewBox="0 0 24 24" 
		fill="none" 
		xmlns="http://www.w3.org/2000/svg"
		>
		<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
		<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
		<g id="SVGRepo_iconCarrier"> <path d="M11.4001 18.1612L11.4001 18.1612L18.796 10.7653C17.7894 10.3464 16.5972 9.6582 15.4697 8.53068C14.342 7.40298 13.6537 6.21058 13.2348 5.2039L5.83882 12.5999L5.83879 12.5999C5.26166 13.1771 4.97307 13.4657 4.7249 13.7838C4.43213 14.1592 4.18114 14.5653 3.97634 14.995C3.80273 15.3593 3.67368 15.7465 3.41556 16.5208L2.05445 20.6042C1.92743 20.9852 2.0266 21.4053 2.31063 21.6894C2.59466 21.9734 3.01478 22.0726 3.39584 21.9456L7.47918 20.5844C8.25351 20.3263 8.6407 20.1973 9.00498 20.0237C9.43469 19.8189 9.84082 19.5679 10.2162 19.2751C10.5343 19.0269 10.823 18.7383 11.4001 18.1612Z" fill="#096969FF"></path> <path d="M20.8482 8.71306C22.3839 7.17735 22.3839 4.68748 20.8482 3.15178C19.3125 1.61607 16.8226 1.61607 15.2869 3.15178L14.3999 4.03882C14.4121 4.0755 14.4246 4.11268 14.4377 4.15035C14.7628 5.0875 15.3763 6.31601 16.5303 7.47002C17.6843 8.62403 18.9128 9.23749 19.85 9.56262C19.8875 9.57563 19.9245 9.58817 19.961 9.60026L20.8482 8.71306Z" fill="#096969FF"></path> </g></svg>
		<svg id="delete-el-${item.id}" class="svg_trash" 
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 448 512"
			>
			<path
					d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
		</svg>
	`;
	document.querySelector(`#edit-el-${item.id}`).addEventListener('click', () => {
		openCreateForm()
		editData(item)
	});
	document.querySelector(`#delete-el-${item.id}`).addEventListener('click', deleteTableLine.bind(item));
}
function editData () {
	openCreateForm()
	name.value = this.name
	brand.value = this.brand
	sku.value = this.sku
	price.value = this.price
	count.value = this.count
	editMode = true
	editId = this.id
}
function deleteTableLine (e) {
	db.run(`DELETE FROM stocks WHERE id=${this.id};`)
	document.getElementById(`row_${this.id}`).remove()
	data.splice(data.findIndex(i => i.id === this.id), 1)
	if (!data.length) {
		tableWrapper.style.display = 'none'
		emptyNotice.style.height = '50vh'
		emptyNotice.style.removeProperty('display')
		emptyNotice.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'display-6')
	} else emptyNotice.style.setProperty('display', 'none', 'important')
	e.stopPropagation()
}

function validate () {
	let hasError = false

	if (!name.value) {
		name.classList.add('is-invalid')
		hasError = true
	} else name.classList.remove('is-invalid')
	if (!brand.value) {
		brand.classList.add('is-invalid')
		hasError = true
	} else brand.classList.remove('is-invalid')
	if (!price.value) {
		price.classList.add('is-invalid')
		hasError = true
	} else price.classList.remove('is-invalid')
	if (!count.value) {
		count.classList.add('is-invalid')
		hasError = true
	} else count.classList.remove('is-invalid')
	return hasError
}

function cancelAddItem () {
	renderMainPage()
}

function renderMainPage () {
	actionsPage.style.display = 'none'
	mainPage.style.display = 'block'
	if (tableWrapper.style.display === 'none' && data.length) {
		emptyNotice.classList = []
		emptyNotice.style.display = 'none'
		tableWrapper.style.display = 'block'
	}
	clearInputs()
}
function clearInputs () {
	name.value = ''
	brand.value = ''
	sku.value = ''
	price.value = ''
	count.value = ''
	name.classList.remove('is-invalid')
	brand.classList.remove('is-invalid')
	sku.classList.remove('is-invalid')
	price.classList.remove('is-invalid')
	count.classList.remove('is-invalid')
}