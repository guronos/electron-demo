var sqlite3 = require('sqlite3');
let data = []
const tableBody = document.getElementById('table-body')
const mainPage = document.getElementById('main-page')
const tableWrapper = document.getElementById('table-wrapper')
const actionsPage = document.getElementById('actions-page')
const emptyNotice = document.getElementById('empty-notice')
const name = document.getElementById('name')
const brend = document.getElementById('brend')
const sku = document.getElementById('sku')
const price = document.getElementById('price')
const count = document.getElementById('count')


var db = new sqlite3.Database('./database.sqlite');
console.log('Connected db:', db)
	
db.all("SELECT * FROM stocks", [], (err, stocks) => {
	if (!stocks) db.run("CREATE TABLE stocks (id INT, name TEXT, brend TEXT, sku TEXT, price INT, count INT)")
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
		id: data.length + 1,
		name: name.value,
		brend: brend.value,
		sku: sku.value,
		price: price.value,
		count: count.value,
	}
	db.run(`INSERT INTO stocks (id, name, brend, sku, price, count) VALUES ("${newItem.id}", "${newItem.name}", "${newItem.brend}", "${newItem.sku}", "${newItem.price}", "${newItem.count}");`)
	data.push(newItem)
	createdTableLine(newItem)
	renderMainPage()
}

function clearInputs () {
	name.value = ''
	brend.value = ''
	sku.value = ''
	price.value = ''
	count.value = ''
	name.classList.remove('is-invalid')
	brend.classList.remove('is-invalid')
	sku.classList.remove('is-invalid')
	price.classList.remove('is-invalid')
	count.classList.remove('is-invalid')
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
			${item.brend}
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
		<svg class="svg_trash"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 448 512">
			<path
					d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
		</svg>
	`;
	el.onclick = deleteTableLine.bind(item)
	tableBody.append(el)
}

function deleteTableLine () {
	console.log(this)
	db.run(`DELETE FROM stocks WHERE id=${this.id};`)
	document.getElementById(`row_${this.id}`).remove()
	data.splice(data.findIndex(i => i.id === this.id), 1)
	if (!data.length) {
		tableWrapper.style.display = 'none'
		emptyNotice.style.height = '50vh'
		emptyNotice.style.removeProperty('display')
		emptyNotice.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'display-6')
	} else emptyNotice.style.setProperty('display', 'none', 'important')

}

function validate () {
	let hasError = false

	if (!name.value) {
		name.classList.add('is-invalid')
		hasError = true
	} else name.classList.remove('is-invalid')
	if (!brend.value) {
		brend.classList.add('is-invalid')
		hasError = true
	} else brend.classList.remove('is-invalid')
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