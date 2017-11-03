
window.onload = function() {
	let controls = {
		main_container: document.getElementById("main_container"),
		container: document.getElementById("control"),
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
		loopButton: document.getElementById("loop"),
		currentTime: document.getElementById("current"),
		isMouseDown: false,
		oldVolumeValue: 0,
		fullScreen: false
	};	
	
	const timeOffset = 5;
	controls.main_container.style.width = controls.video.width;
	controls.progress.style.width = 0;
	
	controls.video.addEventListener("click", function() {
		if (controls.video.paused) {
			controls.video.play();
			controls.ppButton.firstChild.setAttribute("class", "fa fa-pause");
		}
		else {
			controls.video.pause();
			controls.ppButton.firstChild.setAttribute("class", "fa fa-play");
		}
	});
	controls.fsButton.addEventListener("click", function() {
		if (!controls.fullScreen) {
			controls.fullScreen = true;
			controls.fsButton.firstChild.setAttribute("class", "fa fa-compress");
			
			controls.main_container.style.width = "100%";
			controls.container.style.position = "absolute";
			controls.container.style.zIndex = 2147483647;
			controls.container.style.bottom = 0;
			
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
			controls.fsButton.firstChild.setAttribute("class", "fa fa-expand");
			
			controls.main_container.style.width = controls.video.width;
			controls.container.style.position = "relative";
			controls.container.style.zIndex = 1;
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
			controls.ppButton.firstChild.setAttribute("class", "fa fa-pause");
		}
		else {
			controls.video.pause();
			controls.ppButton.firstChild.setAttribute("class", "fa fa-play");
		}
	});
	
	controls.mlButton.addEventListener("click", function() {
		if (controls.video.currentTime >= timeOffset)
		{
			controls.video.currentTime -= timeOffset;
		}
		else {
			controls.video.currentTime = 0;
		}
	});
	controls.mrButton.addEventListener("click", function() {
		if (controls.video.duration - controls.video.currentTime >= timeOffset)
		{
			controls.video.currentTime += timeOffset;
		}
		else {
			controls.video.currentTime = controls.video.duration;
		}
	});
	
	controls.video.addEventListener("canplay", function() {
		let duration = document.getElementById("duration");
		duration.innerHTML = toTimeFormat(controls.video.duration);
	});
	controls.video.addEventListener("timeupdate", function() {
		let w = controls.progress.style.width;
		w = controls.video.currentTime / controls.video.duration * (controls.currentTime.offsetLeft - controls.progressBar.offsetLeft);
		if (!(controls.isMouseDown)) {
			controls.currentTime.innerHTML = toTimeFormat(controls.video.currentTime);
			controls.progress.style.width = w;
		}
	});
	
	controls.video.addEventListener("ended", function() {
		controls.video.pause();
		controls.ppButton.childNodes[0].setAttribute("class", "fa fa-play");
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
		if (e.pageY > this.offsetTop + this.clientHeight - controls.progressBar.clientHeight) {
			if (controls.volume.value == 0) {
				controls.volume.value = controls.oldVolumeValue;
				controls.volButton.firstChild.setAttribute("class", "fa fa-volume-up");
			}
			else {
				controls.oldVolumeValue = controls.volume.value;
				controls.volume.value = 0;
				controls.volButton.firstChild.setAttribute("class", "fa fa-volume-off");
			}
			controls.video.volume = controls.volume.value / 100;
		}
	});
	
	controls.spButton.addEventListener("click", function() {
		(controls.spSelect.style.display == "none") ?
			(controls.spSelect.style.display = "block") : (controls.spSelect.style.display = "none");
		if (controls.fullScreen)
			controls.spSelect.style.bottom = "0px";
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
			let oldProgress = e.pageX - this.offsetLeft;//controls.progress.clientWidth;
			let oldTime = controls.video.currentTime;
			let w = (e.pageX - this.offsetLeft);
			let ct = w / (controls.currentTime.offsetLeft - this.offsetLeft) * controls.video.duration;				
			
			
			controls.progress.style.width = w;
			controls.currentTime.innerHTML = toTimeFormat(ct);
			
			document.onmousemove = function(e) {
				if (e.pageX > controls.progressBar.offsetLeft && e.pageX < controls.currentTime.offsetLeft) {
					w = ((e.pageX < (controls.currentTime.offsetLeft)) ? (e.pageX) : 
						(controls.currentTime.offsetLeft)) - controls.progressBar.offsetLeft;
					controls.progress.style.width = w;
					ct = w / (controls.currentTime.offsetLeft - controls.progressBar.offsetLeft) * controls.video.duration;				
					controls.currentTime.innerHTML = toTimeFormat(ct);
					controls.progress.style.width = w;
					controls.video.currentTime = ct;
				}
			};
			
			document.addEventListener("mouseup", function(e) {
				if (controls.isMouseDown) {
					controls.isMouseDown = false;
					w = ((e.pageX < (controls.currentTime.offsetLeft)) ? (e.pageX) : 
					(controls.currentTime.offsetLeft)) - controls.progressBar.offsetLeft;
					controls.progress.style.width = w;
					ct = w / (controls.currentTime.offsetLeft - controls.progressBar.offsetLeft) * controls.video.duration;			
					controls.currentTime.innerHTML = toTimeFormat(ct);
					controls.video.currentTime = ct;
					document.onmousemove = null;
					return;
				}
			});
		}		
	});
	
	controls.loopButton.addEventListener("click", function() {
		controls.video.loop = !(controls.video.loop);
		if (controls.video.loop)
			controls.loopButton.style.fontSize = "1.3em";
		else
			controls.loopButton.style.fontSize = "1em";
	});
}



toTimeFormat = function (time) {
	time = Math.floor(time) + 1;
	
	let seconds = time % 60;
	time -= seconds;
	time /= 60;
	let minutes = time % 60;
	time -= minutes;
	time /= 60;
	let hours = time;
	
	return ((hours < 10) ? ("0" + hours.toString()) : (hours.toString())) + ":" +
		   ((minutes < 10) ? ("0" + minutes.toString()) : (minutes.toString())) + ":" +
		   ((seconds < 10) ? ("0" + seconds.toString()) : (seconds.toString()));
}