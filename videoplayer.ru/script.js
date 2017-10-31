
window.onload = function() {
	var controls = {
		video: document.getElementById("myvideo"),
		ppButton: document.getElementById("playpause"),
		mlButton: document.getElementById("moveL"),
		mrButton: document.getElementById("moveR"),
		fsButton: document.getElementById("fullScreen"),
		progress: document.getElementById("total"),
		progressBar: document.getElementById("progressbar"),
		volume: document.getElementById("volumeValue"),
		volButton: document.getElementById("volume"),
		spButton: document.getElementById("speed"),
		spSelect: document.getElementById("speedSelect"),
		currentTime: document.getElementById("current")
	};
	
	controls.video.addEventListener("click", function() {
		if (controls.video.paused) {
			controls.video.play();
			document.getElementById("playpause").style.backgroundImage = "url('src/icons/pause.jpg')";
		}
		else {
			controls.video.pause();
			document.getElementById("playpause").style.backgroundImage = "url('src/icons/play.jpg')";
		}
	});
	controls.fsButton.addEventListener("click", function() {
		if (controls.video.width == 960) {
			controls.fsButton.style.backgroundImage = "url('src/icons/normalScreen.jpg')";
			launchFullScreen(controls.video);
		}
		else
		{
			controls.fsButton.style.backgroundImage = "url('src/icons/fullScreen.jpg')";
			controls.video.width = 960;
			controls.video.height = 540;
		}
	});
	
	controls.ppButton.addEventListener("click", function() {
		if (controls.video.paused) {
			controls.video.play();
			document.getElementById("playpause").style.backgroundImage = "url('src/icons/pause.jpg')";
		}
		else {
			controls.video.pause();
			document.getElementById("playpause").style.backgroundImage = "url('src/icons/play.jpg')";
		}
	});
	
	controls.mlButton.addEventListener("click", function() {
	var video = document.getElementById("myvideo");
		if (controls.video.currentTime >= 5)
		{
			controls.video.currentTime -= 5;
		}
		else {
			controls.video.currentTime = 0;
		}
	});
	controls.mrButton.addEventListener("click", function() {
		if (controls.video.duration - controls.video.currentTime >= 5)
		{
			controls.video.currentTime += 5;
		}
		else {
			controls.video.currentTime = controls.video.duration;
		}
	});
	
	controls.video.addEventListener("canplay", function() {
		var duration = document.getElementById("duration");
		duration.innerHTML = toTimeFormat(controls.video.duration);
	});
	controls.video.addEventListener("timeupdate", function() {
		var w = controls.progress.style.width;
		controls.currentTime.innerHTML = toTimeFormat(controls.video.currentTime);
		w = controls.video.currentTime / controls.video.duration * 85;
		controls.progress.style.width = Math.floor(w) + '%';
	});
	
	controls.volume.addEventListener("input", function() {		
		controls.video.volume = controls.volume.value / 100;
	});
	controls.volButton.addEventListener("mouseover", function() {
		controls.volume.style.display = "inline-block";
	});
	controls.volButton.addEventListener("mouseout", function () {
		controls.volume.style.display = "none";
	});
	
	controls.spButton.addEventListener("click", function() {
		controls.spSelect.style.display = "block";
	});
	
	controls.spSelect.addEventListener("change", function() {
		controls.video.playbackRate = controls.spSelect.value;
		controls.spSelect.style.display = "none";
	});
	
	controls.spSelect.addEventListener("blur", function() {
		controls.spSelect.style.display = "none";
	});

	controls.progressBar.onmousedown = function(e) {
		var w = (e.pageX - this.offsetLeft);
		var ct = w / (this.clientWidth * 0.85) * controls.video.duration;
		
		controls.progressBar.onmousemove = function(e) {
			w = ((e.pageX < (controls.progressBar.clientWidth * 0.85 + controls.progressBar.offsetLeft)) ? (e.pageX) : 
				(controls.progressBar.clientWidth * 0.85 + controls.progressBar.offsetLeft)) - controls.progressBar.offsetLeft;
			controls.progress.style.width = w;
			ct = w / (this.clientWidth * 0.85) * controls.video.duration;				
			controls.currentTime.innerHTML = toTimeFormat(ct);
		}
		
		controls.progressBar.onmouseup = function(e) {
			controls.progress.style.width = w;
			controls.video.currentTime = ct;
			controls.progressBar.onmousemove = null;
			return;
		}		
	}
}

toTimeFormat = function (time) {
	time = Math.floor(time) + 1;
	
	var seconds = time % 60;
	time -= seconds;
	time /= 60;
	var minutes = time % 60;
	time -= minutes;
	time /= 60;
	var hours = time;
	
	return ((hours < 10) ? ("0" + hours.toString()) : (hours.toString())) + ":" +
		   ((minutes < 10) ? ("0" + minutes.toString()) : (minutes.toString())) + ":" +
		   ((seconds < 10) ? ("0" + seconds.toString()) : (seconds.toString()));
}

//Запустить отображение в полноэкранном режиме
function launchFullScreen(element) {
	if(element.requestFullScreen) {
		element.requestFullScreen();
	} else if(element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if(element.webkitRequestFullScreen) {
		element.webkitRequestFullScreen();
	}
}
// Выход из полноэкранного режима
function cancelFullscreen() {
	if(document.cancelFullScreen) {
		document.cancelFullScreen();
	} else if(document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if(document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen();
	}
}