(function() {
    var content = new Content();
    window.content = content;
    content.setMapping(_Mapping);
    content.setData(_Titles);
    content.generate();
})();

function activate(e) {
    e.classList.toggle("active");
}