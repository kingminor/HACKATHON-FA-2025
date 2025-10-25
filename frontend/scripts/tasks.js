import {authFetchPost} from "./auth-helper.js";

async function init() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    const form = document.querySelector("form");
    console.log(form);
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const description = form.querySelector("#description");
        const points = form.querySelector("#points");

        const options = {
            body: JSON.stringify({
                name: description.value,
                points: Number(points.value),
            })
        }

        const response = await authFetchPost(`https://api.pleaseletus.win/person/${userId}/tasks`, options);

        //const resJSON = await response.json()

        //console.log(resJSON);
        window.location.href = "./admin.html";
    })
}

init();