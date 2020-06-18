(function() {

    var cameras = document.querySelectorAll(".camera");

    cameras.forEach(camera => {
        const camId = camera.getAttribute('data-id');
        const photos = document.querySelectorAll(`[data-id='${CSS.escape(camId)}'] .photo`);

        photos.forEach( photo => {
            const photoId = photo.getAttribute('data-id');
            photo.addEventListener('click', event => {
                window.location = `/photos/${camId}/${photoId}`;
            });
        });
    });

    const selectElement = document.querySelector("#camera_option");

    if (selectElement != null) {
        selectElement.addEventListener('change', event => {

            cameras.forEach( camera => {
                camera.style.display = 'block';
            });

            const selectedIndex = selectElement.selectedIndex;
            if (typeof selectedIndex != 'undefined' && selectedIndex != null) {
                if (selectElement.options[selectedIndex].value != "") {
                    cameras.forEach( camera => {
                        if (camera.getAttribute('data-id') != selectElement.options[selectedIndex].value) {
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
    }
})();