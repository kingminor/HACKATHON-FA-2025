document.querySelectorAll(".group").forEach(el => {
    el.addEventListener("click", (e) => groupClick(e))
})

console.log("linked");

function groupClick(e) {
    let id = e.target.id;

}

function groupManagerTemplate() {
    return `
    <div class="groupManager">
        
    </div>
    `
}