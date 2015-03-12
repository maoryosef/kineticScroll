(function(window) {
	window.onload = function(e) {
		var draggable = document.getElementById("dragged");
		for (var i = 0; i < 50; i++) {
			var el = document.createElement("div");
			el.className = "item";
			el.innerText = i + 1;
			draggable.appendChild(el);
		}
	};
}(window));