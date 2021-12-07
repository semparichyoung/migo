(function() {
    var content = new Content();
    content.setMapping(_Mapping);
    content.setData(_Titles);
    content.generate();
})();

function activate(e) {
    e.classList.toggle("active");
}
function openDom(e) {
    var dom = document.getElementById(e.getAttribute("for"));
    dom.classList.toggle("hide");
    e.classList.toggle("extend");
}