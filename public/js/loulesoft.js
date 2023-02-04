$(document).ready(() => {
	const socket = io()

	$('#modal-link').click(() => {
		$('.modal-body').html('')
		$.get('/api/services', (results = {}) => {
			let data = results.data
			if (!data || !data.services) return

			data.services.forEach((service) => {
				$('.modal-body').append(`
                <div>
                    <span class="service-cost">R$ ${service.cost}</span>
                    <span class="service-title">${service.title}</span>
                    <button class="${service.joined ? 'joined-button' : 'join-button'} btn btn-info btn-sm" data-id="${service._id}">
                        ${service.joined ? 'Iremos contatá-lo!!' : 'Tenho Interesse'}
                    </button>
                    <div class="service-description">
                        ${service.description}
                    </div>
                </div>
                `)
			})
		}).then(() => {
			addJoinButtonListener()
		})
	})

	$('#chatForm').submit(() => {
		let text = $('#chat-input').val(),
			userName = $('#chat-user-name').val(),
			userId = $('#chat-user-id').val(),
			userTo = $('#users-list').val()
        
		socket.emit('message', {
			content: text,
			userName: userName,
			userId: userId,
			userTo: userTo
		})
		$('#chat-input').val('')
		return false
	})

	socket.on('message', (message) => {
		displayMessage(message)
	})

	socket.on('load-all-users', data => {
		data.forEach(user => {
			displayUser(user)
		})
	})

	socket.on('load-all-messages', data => {
		data.forEach(message => {
			displayMessage(message)
		})
	})

	$('#users-list').change(() => {
		$('#chat ul').html('')
		socket.emit('load-all-messages-again', data => {
			data.forEach(message => {
				displayMessage(message)
			})
		})
	})
})

let addJoinButtonListener = () => {
	$('.join-button').click((event) => {
		let $button = $(event.target),
			serviceId = $button.data('id')
        
		$.get(`/api/services/${serviceId}/join`, (results = {}) => {
			let data = results.data
			if (data && data.success) {
				$button
					.text('Iremos contatá-lo!!')
					.addClass('joined-button')
					.removeClass('join-button')
			} else {
				$button.text('É presciso estar logado!!')
			}
		})
	})
}

let displayMessage = (message) => {
	let userId = $('#chat-user-id').val()
	let userType = $('#chat-user-type').val()
	let userSelected = $('#users-list').val()

	if ((userId === message.user && userType !== 'admin') || userId === message.userTo
        || (userType === 'admin' && userSelected === message.user.toString())
        || (userType === 'admin' && userSelected === message.userTo)) {
		$('#chat ul').prepend($('<li>').html(`
            <div class="message ${getCurrentUserClass(message.user)}">
                <span class="user-name">
                ${message.userName}:
                </span>
                ${message.content}
            </div>
        `))
	}
}

let displayUser = (user) => {
	$('#users-list').append(`
        <option value="${user._id.toString()}">${user.name.first}</option>
    `)
}

let getCurrentUserClass = (id) => {
	let userId = $('#chat-user-id').val()
	if (userId === id) return 'current-user'
	else return ''
}
