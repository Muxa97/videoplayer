
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
		currentTime: document.getElementById("current"),
		isMouseDown: false,
		oldVolumeValue: 0,
		fullScreen: false
	};	
	
	controls.video.addEventListener("click", function() {
		if (controls.video.paused) {
			controls.video.play();
			controls.ppButton.style.backgroundImage = "url('src/icons/pause.jpg')";
		}
		else {
			controls.video.pause();
			controls.ppButton.getElementById("playpause").style.backgroundImage = "url('src/icons/play.jpg')";
		}
	});
	controls.fsButton.addEventListener("click", function() {
		if (!controls.fullScreen) {
			controls.fullScreen = true;
			controls.fsButton.style.backgroundImage = "url('src/icons/normalScreen.jpg')";
			
			let contr = document.getElementById("control");
			contr.style.position = "absolute";
			contr.style.zIndex = 2147483647;
			contr.style.bottom = 0;
			
			if(controls.video.requestFullScreen) {
				controls.video.requestFullScreen();
			} else if(controls.video.mozRequestFullScreen) {
				controls.video.mozRequestFullScreen();
			} else if(controls.video.webkitRequestFullScreen) {
				controls.video.webkitRequestFullScreen();
			}
		}
		else
		{
			controls.fullScreen = false;
			controls.fsButton.style.backgroundImage = "url('src/icons/fullScreen.jpg')";
			
			let contr = document.getElementById("control");
			contr.style.position = "relative";
			contr.style.zIndex = 1;
			
			if(controls.video.exitFullscreen) {
				controls.video.exitFullscreen();
			} else if(controls.video.mozExitFullscreen) {
				controls.video.mozExitFullscreen();
			} else if(controls.video.webkitExitFullscreen) {
				controls.video.webkitExitFullscreen();
			}
		}
	});
	
	controls.ppButton.addEventListener("click", function() {
		if (controls.video.paused) {
			controls.video.play();
			controls.ppButton.style.backgroundImage = "url('src/icons/pause.jpg')";
		}
		else {
			controls.video.pause();
			controls.ppButton.style.backgroundImage = "url('src/icons/play.jpg')";
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
		w = controls.video.currentTime / controls.video.duration * (controls.currentTime.offsetLeft - controls.progressBar.offsetLeft);
		if (!controls.isMouseDown) {
			controls.currentTime.innerHTML = toTimeFormat(controls.video.currentTime);
			controls.progress.style.width = Math.floor(w);
		}
	});
	
	controls.video.addEventListener("ended", function() {
		controls.video.pause();
		controls.ppButton.style.backgroundImage = "url('src/icons/play.jpg')";
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
	controls.volButton.addEventListener("click", function(e) {
		if (e.pageY > this.offsetTop) {
			if (controls.volume.value == 0) {
				controls.volume.value = controls.oldVolumeValue;
				controls.volButton.style.backgroundImage = "url('src/icons/volume.jpg')";
			}
			else {
				controls.oldVolumeValue = controls.volume.value;
				controls.volume.value = 0;
				controls.volButton.style.backgroundImage = "url('src/icons/muted.jpg')";
			}
			controls.video.volume = controls.volume.value / 100;
		}
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

	controls.progressBar.addEventListener("mousedown", function(e) {
		if (e.pageX < controls.currentTime.offsetLeft) {
			controls.isMouseDown = true;
			let oldProgress = controls.progress.clientWidth;
			let oldTime = controls.video.currentTime;
			var w = (e.pageX - this.offsetLeft);
			var ct = w / (controls.currentTime.offsetLeft - this.offsetLeft) * controls.video.duration;				
			
			
			controls.progress.style.width = w;
			controls.currentTime.innerHTML = toTimeFormat(ct);
			
			controls.progressBar.onmousemove = function(e) {
				w = ((e.pageX < (controls.currentTime.offsetLeft)) ? (e.pageX) : 
					(controls.currentTime.offsetLeft)) - controls.progressBar.offsetLeft;
				controls.progress.style.width = w;
				ct = w / (controls.currentTime.offsetLeft - controls.progressBar.offsetLeft) * controls.video.duration;				
				controls.currentTime.innerHTML = toTimeFormat(ct);
				controls.progress.style.width = w;
				controls.video.currentTime = ct;
			}
			
			controls.progressBar.onmouseup = function(e) {
				if (controls.isMouseDown) {
					controls.isMouseDown = false;
					controls.progress.style.width = w;
					controls.video.currentTime = ct;
					controls.progressBar.onmousemove = null;
					return;
				}
			}
			
			controls.progressBar.addEventListener("mouseout", function(e) {
				if (controls.isMouseDown && 
				 (e.pageY < controls.progressBar.offsetTop || e.pageY > controls.progressBar.offsetTop + controls.progressBar.clientHeight || 
				 e.pageX < controls.progressBar.offsetLeft || e.pageX > controls.currentTime.offsetLeft)) {
					controls.isMouseDown = false;
					controls.progress.style.width = oldProgress;
					controls.video.currentTime = oldTime;
					controls.progressBar.onmousemove = null;
					return;
				}
			});
		}		
	});
	
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
	
}
// Выход из полноэкранного режима
 