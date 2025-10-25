const form = document.querySelector('.login');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.querySelector('#username');
    const password = document.querySelector('#password');

    const loginData = {
        username: username.value,
        password: password.value
    }
    
    fetch("http://localhost:5094/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if(!response.ok) throw new Error("Login Failed!");
        return response.json();
    })
    .then(data => {
        console.log("JWT Token: ", data.token);

        sessionStorage.setItem("jwt", data.token);
    })
    .catch(error => console.error(error));
});