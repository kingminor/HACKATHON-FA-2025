const form = document.querySelector('.login');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.querySelector('#username');
    const password = document.querySelector('#password');

    const loginData = {
        username: username.value,
        password: password.value
    }
    
    fetch("https://api.pleaseletus.win/auth/login", {
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
        console.log(data)

        sessionStorage.setItem("personId", data.personId);
        sessionStorage.setItem("role", data.roles[0]);
        sessionStorage.setItem("jwt", data.token);
        sessionStorage.setItem("groupId", data.groupId)

        if(data.roles[0] === 'Admin'){
            window.location.href = "./admin.html";
        }
        else{
            window.location.href = "./home.html";
        }
    })
    .catch(error => console.error(error));
});