const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('name');
if (name) {
    document.getElementById('greeting').innerHTML = name;
}