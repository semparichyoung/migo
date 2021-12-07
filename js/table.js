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
        html += "<div id='tableHeader" + obj.id + "' class='tableItem tableHeader table" + obj.id + "s " + obj.class + "'><span>" + obj.name + "</span></div>";
    }
    html += "</div>";
    this.dom.header.innerHTML = html;
    return this;
};
Content.prototype.generateContent = function() {
    if(this.mapping.length < 1) return;
    if(this.data.length < 1) return;
    var html = "<div id='tableContent'>";
    for (let i = 0; i < this.data.length; i++) {
        html += this.generateList(this.data[i]);
    }
    html += "</div>";
    this.dom.content.innerHTML = html;
    return this;
};
Content.prototype.generateList = function(data) {
    var id = data.title_id;
    var indent = "";
    if(typeof data.season_id == "number") {
        id = data.season_id;
        indent = "<div class='indentLine'></div>";
    }else if(typeof data.episode_id == "number") {
        id = data.episode_id;
        indent = "<div class='indentLine'></div><div class='indentLine2'></div>";
    }
    var html = "<div id='tableList" + id + "' class='tableList'>";
    html += indent;
    for (let i = 0; i < this.mapping.length; i++) {
        const obj = this.mapping[i];
        let key = obj.key;
        if(typeof obj.key == "object") {
            for (let a = 0; a < obj.key.length; a++) {
                const k = obj.key[a];
                if(typeof data[k] != "undefined") {
                    key = k;
                    break;
                }
            }
        }
        html += "<div class='tableItem tableContent table" + obj.id + "s " + obj.class + "'>";
        if (typeof this["generate" + obj.id] == "function") {
            html += this["generate" + obj.id](data);
        }else if(typeof data[key] == "string" || typeof data[key] == "number"){
            html += data[key];
        }
        html += "</div>";
    }
    html += "</div>";
    if (typeof data.seasons == "object" && data.seasons.length > 0) {
        html += "<div id='S" + data.seasons[0].season_id +"' class='tableSeasonsDiv hide'>";
        for (let j = 0; j < data.seasons.length; j++) {
            const season = data.seasons[j];
            html += this.generateList(season);
        }
        html += "</div>";
    }
    if (typeof data.episodes == "object" && data.episodes.length > 0) {
        html += "<div id='E" + data.episodes[0].episode_id + "'class='tableEpisodeDiv hide'>";
        for (let k = 0; k < data.episodes.length; k++) {
            const ep = data.episodes[k];
            html += this.generateList(ep);
        }
        html += "</div>";
    }
    // html += "</div>";
    return html;
};
Content.prototype.generateBtn = function(data) {
    if (typeof data.title_id == "number" && typeof data.seasons == "object" && data.seasons.length > 0) {
        return "<div class='tableBtn triangleBtn' onclick='openDom(this)' for='S" + data.seasons[0].season_id + "'></div>";
    } else if (typeof data.season_id == "number" && typeof data.episodes == "object" && data.episodes.length > 0) {
        return "<div class='horizontalLine'></div><div class='tableBtn plusBtn' onclick='openDom(this)' for='E" + data.episodes[0].episode_id + "'></div>";
    } else if (typeof data.episode_id == "number") {
        return "<div class='horizontalLine'></div><div class='tableBtn'></div>";
    }
    return "<div class='tableBtn'></div>";
};
Content.prototype.generateTitle = function(data) {
    let html = "<div class='tableTitle'>";
    let title = "";
    if(typeof data.title_name == "string") {
        title = data.title_name;
    }else if(typeof data.season_name == "string") {
        title = data.season_name;
    } else if (typeof data.episode_name == "string") {
        title = data.episode_name;
    }
    html += title + "</div>";
    return html;
};
Content.prototype.generateType = function(data) {
    let html = "";
    // let html = "<div class='tableType'>";
    if (typeof data.content_type == "string") {
        html += data.content_type;
    } else if (typeof data.season_id == "number" && typeof data.episode_count == "number") {
        html += "Season";
    } else if (typeof data.episode_id == "number" && typeof data.episode_name == "string") {
        html += "Episode";
    }
    // html += "</div>";
    return html;
}
Content.prototype.generateSeason = function(data) {
    let html = "<span class='tableSeason'>";
    if (typeof data.title_id == "number" && typeof data.seasons == "object") {
        html += data.seasons.length;
    }else if(typeof data.season_id == "number" && typeof data.season_name == "string") {
        html += "S" + data.season_number;
    }else {
        html += "-";
    }
    html += "</span>";
    return html;
};
Content.prototype.generateEpisode = function(data) {
    let html = "<span class='tableEpisode'>";
    if (typeof data.title_id == "number" && typeof data.episode_count == "number") {
        html += data.episode_count;
    } else if (typeof data.season_id == "number" && typeof data.episode_count == "number") {
        html += data.episode_count;
    } else if (typeof data.episode_id == "number" && typeof data.episode_name == "string") {
        html += "EP" + data.episode_number;
    } else {
        html += "-";
    }
    html += "</span>";
    return html;
};
Content.prototype.generatePublish = function (data) {
    let d = new Date(data.publish_timestamp).toString();
    dateAry = d.split(" ");
    dateAry = dateAry.slice(1, 4);
    return "<span class='tablePublish'>" + dateAry.join(" ") + "</span>";
};
Content.prototype.generateProgrammable = function (data) {
    let html = "<div class='programDom'>";
    let active = "";
    if (data.activate) {
        active = " active";
    }
    html += "<div class='programSwitch" + active + "' onclick='activate(this)'></div>";
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
Content.prototype.generate = function(filter) {
    if(this.inited === false) this.init();
    this.filter = filter || "";
    this.filter = this.filter.toLowerCase();
    this.generateHeader();
    this.generateContent();
    return this;
};