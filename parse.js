chrome.runtime.onInstalled.addListener(function() {
	chrome.contextMenus.create({
		id                : 'vk_id',
		title             : 'Copy VK id',
		contexts          : ['link'],
		targetUrlPatterns : ['*://vk.com/*']
	});
	//console.log('ololo');
});
var type = {user:'пользователя', group:'сообщества', application:'приложения'};

function notification (title, message) {
	var not = window.webkitNotifications.createNotification('empty', title, message);
	console.log(not);
	not.show();
	setTimeout(function() {
            not.cancel();
    }, 3000);
}


chrome.contextMenus.onClicked.addListener(function(info) {
	if (info.menuItemId == 'vk_id'){
		var regex = /^https?:\/\/vk.com\/(app\d+|[a-z0-9_\.]*)/;
		var name = info.linkUrl.match(regex)[1];
		var getId = new XMLHttpRequest();
		getId.open('GET', 
			'https://api.vk.com/method/utils.resolveScreenName?screen_name=' + name, true);
		getId.responseType = 'json';
		getId.onload = function(e) {
			var resp = getId.response.response;
			if (resp.type) {
				var ta = document.createElement('textarea');
				ta.innerText = resp.object_id;
				document.body.appendChild(ta);
				ta.select();
				document.execCommand('copy');
				document.body.removeChild(ta);

				notification('Готово','ID ' + type[resp.type] + ' ' + resp.object_id + ' успешно скопирован в буфер обмена.');
			} else {
				notification('Ошибка','Некорректная ссылка.');
			}
		};
		getId.send();
		//console.log (info.linkUrl.match(regex)[1]);
	}
});
