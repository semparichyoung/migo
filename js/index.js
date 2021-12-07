(function() {
    var content = new Content();
    content.setMapping(_Mapping);
    content.setData(_Titles);
    content.generate();
    document.getElementById("searchInput").onchange = function (e) {
        // console.log(e.target.value);
        var search = e.target.value;
        var doms = document.getElementsByClassName("tableTitle");
        for (let i = 0; i < doms.length; i++) {
            const dom = doms[i];
            if(dom.innerText.toLowerCase().indexOf(search.toLowerCase()) < 0) {
                // console.log(dom.parentNode);
                dom.parentNode.parentNode.classList.add("hide");
            }else {
                dom.parentNode.parentNode.classList.remove("hide");
            }
        }
    };
})();

function activate(e) {
    e.classList.toggle("active");
}
function openDom(e) {
    var dom = document.getElementById(e.getAttribute("for"));
    dom.classList.toggle("hide");
    e.classList.toggle("extend");
}
