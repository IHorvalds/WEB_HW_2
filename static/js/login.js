// import Swal from "sweetalert2";

(function(){
    const register_or_login_span = document.getElementById("register_or_login");
    const register_or_login_switch = document.getElementById("switch_button");
    const emailInput = document.querySelector("[name='email']");
    const passInput = document.querySelector("[name='password']");
    const nameInput = document.querySelector("[name='name']");
    const genderInput = document.querySelector("[name='gender']");
    const usernameInput = document.querySelector("[name='username']");
    const nameLabel = document.querySelector("[for='name']");
    const genderLabel = document.querySelector("[for='gender']");
    const usernameLabel = document.querySelector("[for='username']");
    const privacyInput = document.querySelector(".privacy_policy");
    const send_button = document.getElementById("send");
    const form = document.querySelector(".login_card");


    function getCookie(name) { // Nu e scrisa de mine. Originalul e aici https://javascript.info/cookie
        let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
      }
    const jwt_token = getCookie('auth-token');

    if (jwt_token) {
        // window.location = "/photos";
        fetch('/auth/login', { 
            method: "POST"
        })
        .then((response) => {
            if (response.ok) {
                response.json()
                .then( data => {
                    localStorage.setItem('name', data.name);
                    window.location = "/photos";
                }).finally();
            }
        }).finally();
    }

    var is_login = true;
    register_or_login_span.innerText = (is_login) ? "Login" : "Register";
    register_or_login_switch.innerText = (is_login) ? "Need an account?" : "Already have an account?";
    nameInput.style.display = (is_login) ? "none" : "";
    nameLabel.style.display = (is_login) ? "none" : "";
    genderInput.style.display = (is_login) ? "none" : "";
    genderLabel.style.display = (is_login) ? "none" : "";
    privacyInput.style.display = (is_login) ? "none" : "";
    usernameInput.style.display = (is_login) ? "none" : "";
    usernameLabel.style.display = (is_login) ? "none" : "";
    send_button.innerText =  (is_login) ? "Login" : "Register";

    register_or_login_switch.addEventListener('click', e => {
        is_login = !is_login;
        register_or_login_span.innerText = (is_login) ? "Login" : "Register";
        register_or_login_switch.innerText = (is_login) ? "No account? Click here to register!" : "Already have an account?";
        nameInput.style.display = (is_login) ? "none" : "";
        nameLabel.style.display = (is_login) ? "none" : "";
        genderInput.style.display = (is_login) ? "none" : "";
        genderLabel.style.display = (is_login) ? "none" : "";
        privacyInput.style.display = (is_login) ? "none" : "";
        usernameInput.style.display = (is_login) ? "none" : "";
        usernameLabel.style.display = (is_login) ? "none" : "";
        send_button.innerText =  (is_login) ? "Login" : "Register";
    })


    send_button.addEventListener('click', e => {
        e.preventDefault();

        const formData = new FormData(form);
        const emailRegex = new RegExp("^[a-zA-Z0-9]+([-_\\.][a-zA-Z0-9]){0,}@[a-zA-Z0-9]+([\\.][a-zA-Z0-9]+){1,}$");
        const passRegex = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[_@$!%*#?&\\(\\)\\^\\[\\]]).{8,64}$");

        if (!emailRegex.test(formData.get('email'))) {
            emailInput.style.borderColor = "#c92435";
            return;
        }

        if (!passRegex.test(formData.get('password'))) {
            passInput.style.borderColor = "#c92435";
            return;
        }

        if (is_login) {

            formData.delete('gender');
            formData.delete('name');
            formData.delete('username');

            fetch('/auth/login', { 
                method: "POST",
                body: formData
            })
            .then((response) => {
                if (response.ok) {
                    response.json()
                    .then( data => {
                        localStorage.setItem('name', data.name);
                        Swal.fire(`Hello, ${data.name}!`, `Welcome back!.`, 'success');
                        setTimeout( () => {
                            window.location = "/photos";
                        }, 1500);
                    }).finally();
                } else {
                    
                    console.log("Error", response.status);
                }
            });
            
        } else {
            if (formData.get('privacy_check')) {
                fetch('/auth/register', { 
                    method: "POST",
                    body: formData 
                })
                .then((response) => {
                    if (response.ok) {
                        response.json()
                        .then(data => {
                            console.log('logged in ', data);
                            Swal.fire(`Hello, ${data.name}!`, `Welcome to the family!.`, 'success');
                            setTimeout( () => {
                                window.location = "/photos";
                            }, 1500);
                        });
                        
                    } else {
                        Swal.fire('Oops?', `Something went wrong. Status Code: ${response.status}.`, 'error');
                        console.log('Error', response.status);
                    }
                });
            } else {
                Swal.fire('Wait!', 'You have to agree to the privacy policy to register.', 'error');
                // alert("You have to agree to the privacy policy to register.");
            }

        }

    });

    emailInput.addEventListener('keyup', e => {
        const formData = new FormData(form);
        const emailRegex = new RegExp("^[a-zA-Z0-9]+([-_\\.][a-zA-Z0-9]){0,}@[a-zA-Z0-9]+([\\.][a-zA-Z0-9]+){1,}$");
        if (!emailRegex.test(formData.get('email'))) {
            emailInput.style.borderColor = "#c92435";
        } else {
            emailInput.style.borderColor = "";
        }
    });


    passInput.addEventListener('keyup', e => {
        const formData = new FormData(form);
        const passRegex = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[_@$!%\\*#\\?&\\(\\)\\^\[\\]]).{8,64}$");
        if (!passRegex.test(formData.get('password'))) {
            passInput.style.borderColor = "#c92435";
        } else {
            passInput.style.borderColor = "";
        }
    });

    window.addEventListener('keydown', e => {
        if (e.keyCode == '13') {
            send_button.click();
        }
    })

})();