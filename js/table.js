function Content() {
    this.inited = false;
    this.mapping = [];
    this.data = [];
    this.evts = [];
    this.dom = {
        header: null,
        content: null
    };
    this.inited = this.init();
}
Content.prototype.init = function() {
    this.dom.header = document.getElementById('mainHeader');
    this.dom.content = document.getElementById('mainContent');
    if (typeof this.dom.header != "object" || this.dom.header === null) return false;
    if (typeof this.dom.content != "object" || this.dom.content === null) return false;
    return true;
}
Content.prototype.setMapping = function (mapping) {
    this.mapping = mapping || [];
    return this;
};
Content.prototype.setData = function (data) {
    this.data = data || [];
    return this;
};
Content.prototype.on = function (evt, callback) {
    if(typeof callback != "function") return false;
    if(typeof this.evts[evt] == "undefined") this.evts[evt] = [];

    this.evts[evt].push(callback);
    return this;
};
Content.prototype.generateHeader = function () {
    if(this.mapping.length < 1) return;
    var html = "<div id='tableHeader'>";
    for (let i = 0; i < this.mapping.length; i++) {
        const obj = this.mapping[i];
        html += "<div id='tableHeader" + obj.id + "' class='tableItem tableHeader'>" + obj.name + "</div>";
    }
    html += "</div>";
    this.dom.header.innerHTML = html;
    return this;
};
Content.prototype.generateContent = function() {
    if(this.mapping.length < 1) return;
    if(this.data.length < 1) return;
    var html = "<div id='tableContent'>";
    var mapLeng = this.mapping.length;
    for (let i = 0; i < this.data.length; i++) {
        html += this.generateList(this.data[i]);

    }
    html += "</div>";
    return this;
};
Content.prototype.generateList = function(data) {
    var html = "<div id='tableList" + data.title_id + "' class='tableList tableList'>";
    for (let i = 0; i < this.mapping.length; i++) {
        const obj = this.mapping[i];
        html += "<div id='tableContent" + map.id + "_" + i + "' class='tableItem tableContent'>";
        if (typeof this["generate" + obj.id] == "function") {
            html += this["generate" + obj.id](data);
        }else if(typeof data[obj.key] == "string" || typeof data[obj.key] == "number"){
            html += data[obj.key];
        }

        html += "</div>";
    }
    if (typeof data.seasons == "object" && data.seasons.length > 0) {
        for (let j = 0; j < data.seasons.length; j++) {
            const season = data.seasons[j];
            html += this.generateList(this.data.seasons[j]);
        }
    }
    return html;
};
Content.prototype.generateBtn = function(data) {
    if (typeof data.title_id == "number" && typeof data.seasons == "object" && data.seasons.length > 0) {
        return "<div class='tablBtns triangleBtn'></div>";
    } else if (typeof data.season_id == "number" && typeof data.episodes == "object" && data.episodes.length > 0) {
        return "<div class='tablBtns plusBtn'></div>";
    }
    return "<div class='tablBtns'></div>";
};
Content.prototype.generateSeason = function(data) {
    let html = "<div class='tableSeason'>";
    if (typeof data.title_id == "number" && typeof data.seasons == "object") {
        html += data.seasons.length;
    }else if(typeof data.season_id == "number" && typeof data.season_name == "string") {
        html += data.season_name;
    }else {
        html += "-";
    }
    html += "</div>";
    return html;
};
Content.prototype.generateEpisode = function(data) {
    let html = "<div class='tableEpisode'>";
    if (typeof data.title_id == "number" && typeof data.episode_count == "number") {
        html += data.episode_count;
    } else if (typeof data.season_id == "number" && typeof data.episode_count == "number") {
        html += data.episode_count;
    } else if (typeof data.episode_id == "number" && typeof data.season_name == "string") {
        html += "EP" + data.episode_number;
    } else {
        html += "-";
    }
    html += "</div>";
    return html;
};
Content.prototype.generatePublish = function (data) {
    let d = new Date(data.publish_timestamp).toString();
    dateAry = d.split(" ");
    dateAry = dateAry.slice(1, 4);
    return "<div class='tablePublish'>" + dateAry.join(" ") + "</div>";
};
Content.prototype.generateProgrammable = function (data) {
    let html = "<div class='programDom'>";
    let active = "";
    if (data.activate) {
        active = " active";
    }
    html += "<div class='programSwitch" + active + "'></div>";
    let programText = "";
    if (typeof data.content_type == "string" && data.content_type == "Movie") {
        programText = "Single Movie";
    } else if (typeof data.content_type == "string" && data.content_type == "Series") {
        programText = "All Seasons";
    } else if (typeof data.season_id == "number") {
        programText = "All Episodes";
    } else if (typeof data.episode_id == "number") {
        programText = "Per Episodes";
    }
    html += "<span class='programText'>" + programText + "</span>";
    html += "</div>";
    return html;
}
Content.prototype.generate = function() {
    if(this.inited === false) this.init();

};