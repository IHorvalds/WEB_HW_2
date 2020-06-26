(function() {

    // delete buttons
    var delete_buttons = document.querySelectorAll(".delete_message");

    delete_buttons.forEach( button => {
        const mesgId = button.getAttribute('data-id');

        button.addEventListener('click', event => {
            fetch(`/messages/${mesgId}`, { 
                method: "DELETE"
            })
            .then((response) => {
                if (response.ok) {
                    var toRemove = document.getElementById(mesgId);
                    var toRemoveParent = toRemove.parentNode;
                    toRemoveParent.removeChild(toRemove); 
                } else {
                    console.log("Error", response.status);
                }
            });
        });
    });

    // publish new message
    const publishButton = document.querySelector('#publish_button');
    const form = document.querySelector('.new_mesg');

    const mood0 = document.querySelector("#mood0");
    const mood1 = document.querySelector("#mood1");
    const mood2 = document.querySelector("#mood2");
    const mood3 = document.querySelector("#mood3");


    function setMood(moodButton) {
        var mood = moodButton.firstElementChild;
        mood.checked = true;
    }

    mood0.addEventListener('click', e => {
        setMood(mood0);
    });

    mood1.addEventListener('click', e => {
        setMood(mood1);
    });

    mood2.addEventListener('click', e => {
        setMood(mood2);
    });

    mood3.addEventListener('click', e => {
        setMood(mood3);
    });

    publishButton.addEventListener('click', event => {
        event.preventDefault();

        const titleInput = document.querySelector("[name='title']");
        const contentInput = document.querySelector("[name='content']");
        const moodInput = document.querySelector("[name='mood']:checked");
        const formData = new FormData(form);

        if (!moodInput) {
            alert("You must tell everyone how you feel! Don't you want to be social?");
            return;
        } else if (titleInput.value == undefined || titleInput.value == "") {
            alert("Your message must have a title");
            return;
        } else if (contentInput.value == undefined || contentInput.value == "") {
            alert("Your message can't be empty");
            return;
        } else {
            fetch(`/messages/`, { 
                method: "POST",
                body: formData
            })
            .then((response) => {
                if (response.ok) {
                    titleInput.value = "";
                    contentInput.value = "";
                    moodInput.checked = false;
                    location.reload();
                } else {
                    console.log("Error", response.status);
                }
            });
        }

    });
})();