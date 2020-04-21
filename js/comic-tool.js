var FPS = function (root) {
    this.FPSText = new PIXI.Text("FPS: ", {
        fontFamily: 'Snippet',
        fontSize: 25,
        fill: 'red',
        color: "0xff0000"
    });
    this.FPSText.position.set(670, 30);
    this.FPSText.anchor.set(0, 0.5);
    this.root = root;
    this.root.app.stage.addChild(this.FPSText);

    this.cur = 0;

};

FPS.prototype.update = function () {
    var deltatime = this.root.app.ticker.deltaMS / 1000;
    this.cur += deltatime / 5;
    this.FPSText.text = "FPS: " + Math.floor(this.root.app.ticker.FPS);

    this.root._fps.push(Math.floor(this.root.app.ticker.FPS));
};

new Howl({
    src: [""],
    onload: () => {

    },
    onloaderror: () => {

    }
});


var _zip = null;
var resources = {};

var tool = function () {
    this.target = document.body;
    this.app = null;
    this.contain = null;
    this._fps = [];
    this.per = 1;
    this.size = [640 * this.per, 960 * this.per];
    this.checksum = [];
    this.ratio = this.size[0] / this.size[1];
    this.titleText = null;
    this.fps = null;
};

tool.prototype.init = function (propy) {
    if (!propy)
        propy = {};

    if (propy.width)
        this.size[0] = propy.width;

    if (propy.height)
        this.size[1] = propy.height;

    this.app = new PIXI.Application({ width: this.size[0], height: this.size[1], antialias: true, backgroundColor: 0x000000, resolution: 1 });

    if (propy.target)
        this.target = propy.target;

    this.target.appendChild(this.app.view);
    this.app.view.style.border = "solid 5px blue";
    this.app.ticker.maxFPS = 30;


    this.app.stage = new PIXI.display.Stage();

    this.app.stage.sortableChildren = true;
    this.app.stage.interactive = true;
    this.app.stage.on('click', function () {
        if (Adv.core.stat.flag_ref_page && Adv.core.stat.is_click_text) {
            Adv.core.stat.flag_ref_page = false;
            Adv.core.exec.nextOrder();
        }

        if (!Adv.core.stat.is_click_text) {
            Adv.core.stat.is_click_text = true;
        }

        if (Adv.core.stat.videoSkip) {
            Adv.core.stat.videoSkip = false;
            Adv.core.exec.nextOrder();
        }
    });

    this.titleText = new PIXI.Text("Scenario Title", {
        fontFamily: 'Snippet',
        fontSize: 50,
        fill: 'white',
        align: 'center',
    });

    this.titleText.position.set(this.size[0] / 2, this.size[1] / 2);
    this.titleText.anchor.set(0.5, 0.5);
    this.app.stage.addChild(this.titleText);

    Adv.core.init(this);

    this.contain = new container(this);
    this.contain.init();

    this.app.ticker.add(function (delta) {
        this.fps.update();

        if (Adv.core.isActive()) {
            var bg_progress = Adv.core.BgImgMgr.progreess();
            var chara_progress = Adv.core.CharaImgMgr.progreess();
            var sound_progress = Adv.core.SoundMgr.progreess();
            var spine_progress = Adv.core.SpineMgr.progreess();
            var common_progress = Adv.core.CommonImgMgr.progreess();
            var video_progress = Adv.core.VideoMgr.progreess();


            bg_progress = isNaN(bg_progress) ? 0 : bg_progress;
            chara_progress = isNaN(chara_progress) ? 0 : chara_progress;
            sound_progress = isNaN(sound_progress) ? 0 : sound_progress;
            spine_progress = isNaN(spine_progress) ? 0 : spine_progress;
            common_progress = isNaN(common_progress) ? 0 : common_progress;
            video_progress = isNaN(video_progress) ? 0 : video_progress;

            var percent = (bg_progress + chara_progress + sound_progress + spine_progress + common_progress + video_progress) / 6;
            if (Adv.core.isStart) {
                this.titleText.text = "2/2 Loading... " + parseInt(percent) + "%"
            }

            else {
                this.titleText.text = "";
            }
        }

        var activeInstancesLength = activeInstances.length;
        if (activeInstancesLength) {
            var i = 0;
            while (i < activeInstancesLength) {
                var activeInstance = activeInstances[i];

                if (activeInstance === undefined) {
                    i++;
                    continue;
                }

                if (!activeInstance.paused) {
                    activeInstance.tick(this.app.ticker.lastTime);
                } else {
                    var instanceIndex = activeInstances.indexOf(activeInstance);
                    if (instanceIndex > -1) {
                        activeInstances.splice(instanceIndex, 1);
                        activeInstancesLength = activeInstances.length;
                    }
                }
                i++;
            }
        }

        if (Adv.core.isLoadDone()) {
            var deltatime = this.app.ticker.deltaMS / 1000;
            this.charaAni(deltatime);
            Adv.core.Update(deltatime);
        }
    }.bind(this));

    window.onresize = this.resize.bind(this);

    this.fps = new FPS(this);
};

tool.prototype.setSize = function (propy) {

};

tool.prototype.charaAni = function (del) {
    for (var name in Adv.core.animations) {
        Adv.core.animations[name].mouthT += del;

        var limit = 0.4 / 3;
        if (limit < Adv.core.animations[name].mouthT) {
            Adv.core.animations[name].mouthT = 0;

            Adv.core.animations[name].mouthIdx++;

            if (Adv.core.animations[name].mouthIdx === 3) {
                Adv.core.animations[name].mouthIdx = 0;
            }

            else if (Adv.core.animations[name].mouthIdx < 0) {
                Adv.core.animations[name].mouthIdx = 0;
            }

            Adv.core.animations[name].mouth.texture = Adv.core.animations[name].mTexture[Adv.core.animations[name].mouthIdx];
        }

        if (Adv.core.animations[name].eyeIdx !== 0) {
            limit = Adv.core.animations[name].eyeTime[Adv.core.animations[name].eyeIdx] / 3;
            Adv.core.animations[name].eyeT += del;

            if (limit < Adv.core.animations[name].eyeT) {
                Adv.core.animations[name].eyeT = 0;
                Adv.core.animations[name].eyeIdx++;

                if (Adv.core.animations[name].eyeIdx === 3) {
                    Adv.core.animations[name].eyeIdx = 0;

                    if (Adv.core.animations[name].casecade)
                        Adv.core.animations[name].casecade = false;
                    else
                        Adv.core.animations[name].casecade = Math.floor(Math.random() * (10 - 0) + 0) > 7 ? true : false;

                    if (Adv.core.animations[name].casecade)
                        Adv.core.animations[name].interval = 0.1;
                }
            }

            Adv.core.animations[name].eye.texture = Adv.core.animations[name].eTexture[Adv.core.animations[name].eyeIdx];
        }

        else {
            Adv.core.animations[name].intervalCt += del;

            if (Adv.core.animations[name].interval < Adv.core.animations[name].intervalCt) {
                Adv.core.animations[name].intervalCt = 0;
                Adv.core.animations[name].interval = 3;

                Adv.core.animations[name].eyeIdx++;
                Adv.core.animations[name].eye.texture = Adv.core.animations[name].eTexture[Adv.core.animations[name].eyeIdx];
            }
        }
    }
}

tool.prototype.packageLocalLoad = function (evt) {
    var file = evt.target.files[0];

    if (!file.name.match('data.*'))
        return;

    var that = this;
    var reader = new FileReader();
    reader.onload = function() {
        JSZip.loadAsync(reader.result).then(function (zip) {
            _zip = zip;

            for (var name in zip.files) {
                if (zip.files[name].dir)
                    continue;

                resources[name] = null;
            }

            _zip.folder("").forEach(function (relativePath, file) {
                if (file.dir)
                    return;

                file.async("arraybuffer").then(function (content) {
                    resources[relativePath] = content;

                    var isReady = true;
                    for (var name in resources) {
                        if (resources[name] === null)
                            isReady = false;
                    }

                    if (isReady) {
                        init();
                    }
                });
            });
        });
    };

    reader.onprogress = function (e) {
        var progress = (e.loaded / e.total) * 100;
        that.titleText.text = "1/2 Loading... " + parseInt(progress) + "%"
    };

    reader.readAsArrayBuffer(file);
}

tool.prototype.packageLoad = function (path) {
    if (location.protocol === "file:") {
        document.getElementById("local").style.display = "";
        return;
    }

    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.responseType = "arraybuffer";
    xhr.open("GET", path);
    xhr.onload = function (e) {

        JSZip.loadAsync(xhr.response).then(function (zip) {
            _zip = zip;

            for (var name in zip.files) {
                if (zip.files[name].dir)
                    continue;

                resources[name] = null;
            }

            _zip.folder("").forEach(function (relativePath, file) {
                if (file.dir)
                    return;

                file.async("arraybuffer").then(function (content) {
                    resources[relativePath] = content;

                    var isReady = true;
                    for (var name in resources) {
                        if (resources[name] === null)
                            isReady = false;
                    }

                    if (isReady) {
                        init();
                    }
                });
            });
        });
    };

    xhr.onprogress = function (e) {
        var progress = (e.loaded / e.total) * 100;
        that.titleText.text = "1/2 Loading... " + parseInt(progress) + "%"
    };

    xhr.send();
};

function init() {
    var query = QueryString.parse(location.search.substr(1));
    var filename = "/script/main.ssk";

    Adv.core.regexp = ["「", "」", "『", "』", "【", "】", "―", "ー", "…", "：", ":"];


    var scripts = {};
    var list = [];
    for (var name in resources) {
        if (name.indexOf("script/") !== -1) {
            var last = name.lastIndexOf("/");
            var filename = name.substr(last + 1, name.length).replace(".ssk", "");
            scripts[filename] = uintToString(new Uint8Array(resources[name]));
        }
    }

    Adv.core.StartAdv(scripts);
    window.comicTool.balance();
}

function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function uintToString(uintArray) {
    var encodedString = String.fromCharCode.apply(null, uintArray),
        decodedString = decodeURIComponent(escape(encodedString));
    return decodedString;
}

tool.prototype.balance = function () {
    var sum = 0;
    for (var i = 0; i < this._fps.length; i++) {
        sum += this._fps[i];
    }

    var avg = sum / this._fps.length;

    if (avg < 15) {
        this.per -= 0.1;
        this.size = [640 * this.per, 960 * this.per];
        this.ratio = this.size[0] / this.size[1];

        this.resize();
        this.contain.root.scale.set(this.per, this.per);
        this.contain.containers.bg.scale.set(this.per, this.per);
        this.app.renderer.resize(this.size[0], this.size[1]);
        this.checksum.push(1);
    }

    else if (avg > 24 && this.checksum.length !== 0) {
        this.per += 0.1;

        if (this.per > 1) {
            this.per = 1;
        }

        this.size = [640 * this.per, 960 * this.per];
        this.ratio = this.size[0] / this.size[1];

        this.resize();
        this.contain.root.scale.set(this.per, this.per);
        this.contain.containers.bg.scale.set(this.per, this.per);
        this.app.renderer.resize(this.size[0], this.size[1]);
        this.checksum.pop();
    }

    this._fps = [];
    setTimeout(this.balance.bind(this), 500);
};

tool.prototype.resize = function () {
    if (window.innerWidth / window.innerHeight >= this.ratio) {
        var w = window.innerHeight * this.ratio;
        var h = window.innerHeight;
    } else {
        var w = window.innerWidth;
        var h = window.innerWidth / this.ratio;
    }
    this.app.view.style.width = (w - 10) + 'px';
    this.app.view.style.height = (h - 10) + 'px';

    this.app.view.style.position = "absolute";
    this.app.view.style.left = ((window.innerWidth / 2) - (w / 2)) + "px";
    this.app.view.style.top = ((window.innerHeight / 2) - (h / 2)) + "px";
}

tool.prototype.lerp = function (start, end, amt) {
    return start + (end - start) * amt;
};

var QueryString = {
    parse: function (text, sep, eq, isDecode) {
        text = text || location.search.substr(1);
        sep = sep || '&';
        eq = eq || '=';
        var decode = (isDecode) ? decodeURIComponent : function (a) { return a; };
        return text.split(sep).reduce(function (obj, v) {
            var pair = v.split(eq);
            obj[pair[0]] = decode(pair[1]);
            return obj;
        }, {});
    },
    stringify: function (value, sep, eq, isEncode) {
        sep = sep || '&';
        eq = eq || '=';
        var encode = (isEncode) ? encodeURIComponent : function (a) { return a; };
        return Object.keys(value).map(function (key) {
            return key + eq + encode(value[key]);
        }).join(sep);
    },
};

window.engine = (function () {
    function play() {

    }
    return play;
})();

window.raf = 1;
window.comicTool = new tool();