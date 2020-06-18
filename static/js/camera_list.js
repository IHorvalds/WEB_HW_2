(function() {

    var cameras = document.querySelectorAll(".camera");

    cameras.forEach( camera => {
        const camId = camera.getAttribute('id');

        camera.addEventListener('click', event => {
            window.location = `/cameras/${camId}`;
        });
    });

    const cameraFilter = document.querySelector("#camera_filter");

    function contains(s1, s2) {
        s1 = s1.toLowerCase().split("");
        s2 = s2.toLowerCase().split("");
        return s2.every( char => s1.includes(char));
    }

    if (cameraFilter != null) {
        cameraFilter.addEventListener('change', event => {

            cameras.forEach( camera => {
                camera.style.display = 'block';
            });

            const selectedIndex = cameraFilter.value;
            if (typeof selectedIndex != 'undefined' && selectedIndex != null) {
                if (cameraFilter.value != "") {
                    cameras.forEach( camera => {
                        if (!contains(camera.getElementsByTagName('h4')[0].textContent, cameraFilter.value)) {
                            camera.style.display = 'none';
                        }
                    });
                } else {
                    cameras.forEach( camera => {
                        camera.style.display = 'block';
                    });
                }
            }
        });

        document.addEventListener('keyup', event => {
            if (event.keyCode === 13) {
                cameras.forEach( camera => {
                    camera.style.display = 'block';
                });
    
                const selectedIndex = cameraFilter.value;
                if (typeof selectedIndex != 'undefined' && selectedIndex != null) {
                    if (cameraFilter.value != "") {
                        cameras.forEach( camera => {
                            if (!contains(camera.getElementsByTagName('h4')[0].textContent, cameraFilter.value)) {
                                camera.style.display = 'none';
                            }
                        });
                    } else {
                        cameras.forEach( camera => {
                            camera.style.display = 'block';
                        });
                    }
                }
            }
        });
    }
})();