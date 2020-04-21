function FpsCtrl(fps, callback) {

    this.delay = 1000 / fps;
    this.fps = fps;
    this.time = 0;
    this.frame = -1;
    this.tref = null;
    this.callback = callback;

    this.isPlaying = false;
}

FpsCtrl.prototype.loop = function (timestamp) {
    this.time += SnlFPS.deltaTime;

    if (this.time > this.fps / 60) {
        this.callback(this, {
            time: timestamp,
            frame: this.frame
        });
    }

    if (this.tref !== null)
        this.tref = requestAnimationFrame(this.loop.bind(this))
};

FpsCtrl.prototype.frameRate = function (newfps) {
    if (!arguments.length) return fps;
    this.fps = newfps;
    this.delay = 1000 / this.fps;
    this.frame = -1;
    this.time = null;
};

FpsCtrl.prototype.start = function () {
    if (!this.isPlaying) {
        this.isPlaying = true;
        this.tref = requestAnimationFrame(this.loop.bind(this));
    }
};

FpsCtrl.prototype.pause = function () {
    if (this.isPlaying) {
        cancelAnimationFrame(this.tref);
        this.tref = null;
        this.isPlaying = false;
        this.time = null;
        this.frame = -1;
    }
};

AdvTag.plugin.tag = {};

AdvTag.plugin.exec = {
    array_tag: [],
    master_tag: {},
    current_order_index: -1,
    init: function () {
        for (var order_type in AdvTag.plugin.tag) {
            this.master_tag[order_type] = object(AdvTag.plugin.tag[order_type]);
            this.master_tag[order_type].parent = this.parent
        }

        this.parent.variable.tf["system"] = {};
        this.parent.variable.tf["system"]["backlog"] = [];
    },
    buildTag: function (array_tag, label_name) {
        this.array_tag = array_tag;
        if (label_name) this.nextOrderWithLabel(label_name);
        else this.nextOrderWithLabel("")
    },
    buildTagIndex: function (array_tag, index, auto_next) {
        this.array_tag = array_tag;
        this.nextOrderWithIndex(index,
            undefined, undefined, undefined, auto_next)
    },
    completeTrans: function () {
        this.parent.stat.is_trans = false;
        if (this.parent.stat.is_stop == true) {
            this.parent.layer.showEventLayer();
            this.nextOrder()
        }
    },
    hideNextImg: function () {
        
    },
    showNextImg: function () {
        if (this.parent.stat.flag_glyph == "false") {
            $(".img_next").remove();
            var jtext = this.parent.getMessageInnerLayer();
            jtext.find("p").append("<img class='img_next' src='./tyrano/images/system/nextpage.gif' />")
        } else $(".glyph_image").show()
    },
    nextOrder: function () {
        var that = this;

        if (this.array_tag[this.current_order_index])
            if (this.array_tag[this.current_order_index].name === "p") {
                this.parent.SoundMgr.Stop(this.parent.stat.voiceAlias);
                this.parent.stat.voiceAlias = "";
            }

        if (this.parent.stat.is_strong_stop == true) return false;
        if (this.parent.stat.is_adding_text == true) return false;
        this.current_order_index++;
        if (this.array_tag.length <= this.current_order_index) {
            return false;
        }
        var tag = $.cloneObject(this.array_tag[this.current_order_index]);
        this.parent.stat.current_line = tag.line;
        if (this.parent.is_rider) {
            tag.ks_file = this.parent.stat.current_scenario;
            this.parent.rider.pushConsoleLog(tag)
        } else {
            
        }
        if (tag.name == "call" && tag.pm.storage == "make.ks" || this.parent.stat.current_scenario == "make.ks") {
            if (this.parent.stat.flag_ref_page == true) {
                this.parent.tmp.loading_make_ref = true;
                this.parent.stat.flag_ref_page = false
            }
        } else if (this.parent.stat.flag_ref_page == true) {
            this.parent.stat.flag_ref_page = false;
            this.parent.stat.log_clear = true;
        }
        if (this.checkCond(tag) != true) {
            this.nextOrder();
            return
        }
        if (this.parent.stat.is_hide_message == true) {
            this.parent.layer.showMessageLayers();
            this.parent.stat.is_hide_message = false
        }
        if (this.master_tag[tag.name]) {
            tag.pm = this.convertEntity(tag.pm);
            var err_str = this.checkVital(tag);
            if (this.master_tag[tag.name].log_join) this.parent.stat.log_join = "true";
            else if (tag.name == "text");
            else this.parent.stat.log_join = "false";
            if (this.checkCw(tag));
            if (err_str != "") this.parent.error(err_str);
            else this.master_tag[tag.name].start($.extend(true, $.cloneObject(this.master_tag[tag.name].pm), tag.pm))
        } else if (this.parent.stat.map_macro[tag.name]) {
            tag.pm =
                this.convertEntity(tag.pm);
            var pms = tag.pm;
            var map_obj = this.parent.stat.map_macro[tag.name];
            var back_pm = {};
            back_pm.index = this.parent.exec.current_order_index;
            back_pm.storage = this.parent.stat.current_scenario;
            back_pm.pm = pms;
            this.parent.stat.mp = pms;
            this.parent.pushStack("macro", back_pm);
            this.parent.exec.nextOrderWithIndex(map_obj.index, map_obj.storage)
        } else {
            $.error_message($.lang("tag") + "\uff1a[" + tag.name + "]" + $.lang("not_exists"));
            this.nextOrder()
        }
        
    },
    checkCw: function (tag) {
        var master_tag =
            this.master_tag[tag.name];
        if (master_tag.cw)
            if (this.parent.stat.is_script != true && this.parent.stat.is_html != true && this.parent.stat.checking_macro != true) return true;
            else return false;
        else return false
    },
    nextOrderWithTag: function (target_tags) {
        try {
            this.current_order_index++;
            var tag = this.array_tag[this.current_order_index];
            if (this.checkCond(tag) != true);
            if (target_tags[tag.name] == "")
                if (this.master_tag[tag.name]) {
                    switch (tag.name) {
                        case "elsif":
                        case "else":
                        case "endif":
                            var root = this.parent.getStack("if");
                            if (!root || tag.pm.deep_if !=
                                root.deep) return false
                    }
                    tag.pm = this.convertEntity(tag.pm);
                    this.master_tag[tag.name].start($.extend(true, $.cloneObject(this.master_tag[tag.name].pm), tag.pm));
                    return true
                } else return false;
            else return false
        } catch (e) {
            console.log(this.array_tag);
            return false
        }
    },
    convertEntity: function (pm) {
        var that = this;
        if (pm["*"] == "") pm = $.extend(true, this.parent.stat.mp, $.cloneObject(pm));
        for (key in pm) {
            var val = pm[key];
            var c = "";
            if (val.length > 0) c = val.substr(0, 1);
            if (val.length > 0 && c === "&") pm[key] = this.parent.embScript(val.substr(1,
                val.length));
            else if (val.length > 0 && c === "%") {
                var map_obj = this.parent.getStack("macro");
                if (map_obj) pm[key] = map_obj.pm[val.substr(1, val.length)];
                var d = val.split("|");
                if (d.length == 2)
                    if (map_obj.pm[$.trim(d[0]).substr(1, $.trim(d[0]).length)]) pm[key] = map_obj.pm[$.trim(d[0]).substr(1, $.trim(d[0]).length)];
                    else pm[key] = $.trim(d[1])
            }
        }
        return pm
    },
    checkVital: function (tag) {
        var master_tag = this.master_tag[tag.name];
        var err_str = "";
        if (master_tag.vital);
        else return "";
        var array_vital = master_tag.vital;
        for (var i = 0; i < array_vital.length; i++)
            if (tag.pm[array_vital[i]]) {
                if (tag.pm[array_vital[i]] ==
                    "") err_str += "\u30bf\u30b0\u300c" + tag.name + "\u300d\u306b\u30d1\u30e9\u30e1\u30fc\u30bf\u30fc\u300c" + array_vital[i] + "\u300d\u306f\u5fc5\u9808\u3067\u3059\u3000\n"
            } else err_str += "\u30bf\u30b0\u300c" + tag.name + "\u300d\u306b\u30d1\u30e9\u30e1\u30fc\u30bf\u30fc\u300c" + array_vital[i] + "\u300d\u306f\u5fc5\u9808\u3067\u3059\u3000\n";
        return err_str
    },
    checkCond: function (tag) {
        var pm = tag.pm;
        if (pm.cond) {
            var cond = pm.cond;
            return this.parent.embScript(cond)
        } else return true
    },
    startTag: function (name, pm) {
        this.master_tag[name].start($.extend(true,
            $.cloneObject(this.master_tag[name].pm), pm))
    },
    nextOrderWithLabel: function (label_name, scenario_file) {
        this.parent.stat.is_strong_stop = false;
        if (label_name) {
            if (label_name.indexOf("*") != -1) label_name = label_name.substr(1, label_name.length);
            this.parent.exec.startTag("label", {
                "label_name": label_name,
                "nextorder": "false"
            })
        }
        if (label_name == "*savesnap") {
            var tmpsnap = this.parent.menu.snap;
            var co = tmpsnap.current_order_index;
            var cs = tmpsnap.stat.current_scenario;
            this.nextOrderWithIndex(co, cs, undefined, undefined, "snap");
            return
        }
        var that =
            this;
        var original_scenario = scenario_file;
        label_name = label_name || "";
        scenario_file = scenario_file || this.parent.stat.current_scenario;
        label_name = label_name.replace("*", "");
        if (scenario_file != this.parent.stat.current_scenario && original_scenario != null) {
            this.parent.stat.map_label = this.parent.cache_scenario[scenario_file].map_label;
            that.parent.exec.buildTag(this.parent.cache_scenario[scenario_file].array_s, label_name);
        } else if (label_name == "") {
            this.current_order_index = -1;
            this.nextOrder()
        } else if (this.parent.stat.map_label[label_name]) {
            var label_obj =
                this.parent.stat.map_label[label_name];
            this.current_order_index = label_obj.index;
            this.nextOrder()
        } else {
            $.error_message($.lang("label") + "\uff1a'" + label_name + "'" + $.lang("not_exists"));
            this.nextOrder()
        }
    },
    nextOrderWithIndex: function (index, scenario_file, flag, insert, auto_next) {
        this.parent.stat.is_strong_stop = false;
        var that = this;
        flag = flag || false;
        auto_next = auto_next || "yes";
        scenario_file = scenario_file || this.parent.stat.current_scenario;
        this.current_order_index = index;
        if (auto_next == "yes") this.nextOrder();
        else if (auto_next == "snap") {
            this.parent.stat.is_strong_stop = this.parent.menu.snap.stat.is_strong_stop;
            if (this.parent.stat.is_skip == true &&
                this.parent.stat.is_strong_stop == false) this.parent.exec.nextOrder()
        } else if (auto_next == "stop") this.parent.exec.startTag("s", {
            "val": {}
        })
    },

    CreateChara: function (pm) {
        var id = "";

        var length = this.parent.charaDefine.length;
        for (var iCount = 0; iCount < length; iCount++) {
            if (this.parent.charaDefine[iCount].name === pm.name) {
                id = this.parent.charaDefine[iCount].file;
                break;
            }
        }

        if (AdvCharaMgr.m_Chara[pm.name] === undefined) {
            var Obj = AdvImgLayer.CreateSprite(pm.name, this.parent.charaAni[pm.name][pm.face].sprite, parseInt(pm.posX), parseInt(pm.posY), "Chara", parseFloat(pm.anchorX), parseFloat(pm.anchorY));
            Obj.scale.set(parseFloat(pm.scale) / 100, parseFloat(pm.scale) / 100);
            Obj.rotation = parseFloat(pm.rotate);

            var blurFilter = new PIXI.filters.BlurFilter();
            Obj.filters = [blurFilter];

            var data = {
                eyeIndex: 1,
                mouthIndex: 0,
                eyeAniTime: [1, 0.1, 0.1],
                mouthAniTime: 0.4,
                eyecurrentTime: 0,
                mouthcurrentTime: 0,
                mouthisReverse: false,
                mouthisActive: true,
                eyeInterval: Math.random() * (AdvCharaMgr.EyeIntervalMax - AdvCharaMgr.EyeIntervalMin) + AdvCharaMgr.EyeIntervalMin,
                eyeIntervalCount: 0,
                eyeCasecade: false,
                eyeStep: { l: 0, r: 0 },
                eyeActive: true,
            };

            AdvCharaMgr.m_Chara[pm.name] = {
                "Sprite": Obj,
                "Data": data
            };
        }

        else {
            AdvCharaMgr.m_Chara[pm.name].Sprite.texture.destroy(true);
            AdvCharaMgr.m_Chara[pm.name].Sprite.texture = null;
            AdvCharaMgr.m_Chara[pm.name].Sprite.texture = this.parent.CharaImgMgr.getTexture(this.parent.charaAni[pm.name][pm.face].sprite);

            AdvCharaMgr.m_Chara[pm.name].Sprite.m_ImagePath = this.parent.charaAni[pm.name][pm.face].sprite;
            return;
        }

        AdvCharaMgr.m_Chara[pm.name].Sprite.position.set(parseInt(pm.posX), parseInt(pm.posY));
        AdvCharaMgr.m_Chara[pm.name].Sprite.anchor.set(parseFloat(pm.anchorX), parseFloat(pm.anchorY));
        AdvCharaMgr.m_Chara[pm.name].Sprite.alpha = (parseFloat(pm.opacity) / 100);
        AdvCharaMgr.m_Chara[pm.name].Sprite.scale.set(parseFloat(pm.scale) / 100, parseFloat(pm.scale) / 100);
    },

    pushBackLog: function (str, type) {
        if (this.parent.stat.log_write == false) return;
        type = type || "add";
        var max_back_log = parseInt(this.parent.config["maxBackLogNum"]);
        if (max_back_log < 1) return;
        if (this.parent.stat.log_clear == true) {
            type = "add";
            this.parent.stat.log_clear = false
        }
        if (type == "join") {
            var index = this.parent.variable.tf.system.backlog.length - 1;
            if (index >= 0) {
                var tmp = this.parent.variable.tf["system"]["backlog"][index];
                this.parent.variable.tf["system"]["backlog"][this.parent.variable.tf.system.backlog.length - 1] = { name: str.name, text: tmp.text + "\n" + str.text, voice: str.voice };
            } else this.parent.variable.tf["system"]["backlog"].push(str)
        } else this.parent.variable.tf["system"]["backlog"].push(str);
        this.parent.stat.current_save_str = this.parent.variable.tf["system"]["backlog"][this.parent.variable.tf.system.backlog.length - 1];
        if (max_back_log < this.parent.variable.tf["system"]["backlog"].length) this.parent.variable.tf["system"]["backlog"].shift()
    },
};

AdvTag.plugin.tag.cm = {
    start: function () {

    }
};

AdvTag.plugin.tag.clearfix = {
    start: function () {
        this.parent.exec.nextOrder()
    }
};

AdvTag.plugin.tag.start_keyconfig = {
    start: function () {
        this.parent.stat.enable_keyconfig = true;
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.bg = {
    vital: ["file", "name"],
    pm: {

    },
    start: function (pm) {
        this.parent.stat.bg_map[pm.name] = pm.file;
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.defaultColor = {
    vital: [],
    pm: {
        color: "0xffffff"
    },
    start: function (pm) {
        this.parent.root.app.renderer.backgroundColor = parseInt(pm.color);
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.bg_show = {
    vital: ["name"],
    pm: {
        storage: "",
        method: "crossfade",
        wait: "false",
        time: "0",
        cross: "false",
        anchorX: "0",
        anchorY: "0",
        posX: "0",
        posY: "0",
        RGB: "ffffff",
        blur: "0"
    },
    start: function (pm) {
        if (this.parent.sprites[pm.name] !== undefined) {
            this.parent.exec.nextOrder();
            return;
        }

        var iscross = JSON.parse(pm.cross);
        if (pm.time === "0")
            iscross = false;

        var sprite = new PIXI.Sprite(this.parent.BgImgMgr.getTexture(pm.name));
        this.parent.root.contain.addChild(sprite, "BG");

        var pos = {
            x: parseInt(pm.posX),
            y: parseInt(pm.posY),
        };

        var anchor = {
            x: parseFloat(pm.anchorX),
            y: parseFloat(pm.anchorY),
        };

        sprite.position.set(pos.x, pos.y);
        sprite.anchor.set(anchor.x, anchor.y);

        this.parent.sprites["bg"] = sprite;

        var blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.blur = parseFloat(pm.blur);

        sprite.filters = [blurFilter];

        if (iscross && pm.time !== "0") {
            sprite.alpha = 0;

            var crossfade = new PIXI.Sprite(this.parent.BgImgMgr.getTexture(pm.name));
            this.parent.root.contain.addChild(crossfade, "BG");

            var pos = {
                x: parseInt(pm.posX),
                y: parseInt(pm.posY),
            };

            var anchor = {
                x: parseFloat(pm.anchorX),
                y: parseFloat(pm.anchorY),
            };

            crossfade.position.set(pos.x, pos.y);
            crossfade.anchor.set(anchor.x, anchor.y);

            this.parent.sprites[pm.name + "_cf"] = crossfade;

            var property = {
                opacity: 0
            };

            anime({
                targets: property,
                opacity: 1,
                easing: 'easeInSine',
                duration: parseInt(pm.time),
                update: function () {
                    sprite.alpha = property.opacity;
                },
                complete: function () {
                    sprite.alpha = 1;
                    this.parent.exec.nextOrder();
                },
            });

            var _property = {
                opacity: 1
            };

            anime({
                targets: _property,
                opacity: 0,
                easing: 'easeInSine',
                duration: parseInt(pm.time),
                update: function () {
                    crossfade.alpha = property.opacity;
                },
                complete: function () {
                    crossfade.alpha = 0;
                    Adv.core.sprites[pm.name + "_cf"].destroy();
                    Adv.core.sprites[pm.name + "_cf"] = null;
                    delete Adv.core.sprites[pm.name + "_cf"];
                },
            });
        }

        else {
            if (pm.time !== "0") {
                sprite.alpha = 0;

                var property = {
                    opacity: 0
                };

                anime({
                    targets: property,
                    opacity: 1,
                    easing: 'easeInSine',
                    duration: parseInt(pm.time),
                    update: function () {
                        sprite.alpha = property.opacity;
                    },
                    complete: function () {
                        sprite.alpha = 1;

                        if (pm.wait === "true")
                            Adv.core.exec.nextOrder();
                    },
                });

                if (pm.wait === "false")
                    Adv.core.exec.nextOrder();
            }

            else {
                this.parent.exec.nextOrder();
                return;
            }
        }
    }
};

AdvTag.plugin.tag.bg_move = {
    vital: [],
    pm: {
        name: "bg",
        time: "600",
        anim: "false",
        left: "",
        top: "",
        width: "",
        height: "",
        effect: "",
        scale: "大",
        wait: "true",
        anchorX: "default",
        anchorY: "default",
        posX: "0",
        posY: "0",
        scale: "default",
        opacity: "default",
        RGB: "ffffff"
    },
    start: function (pm) {
        pm.name = "bg";

        if (this.parent.sprites[pm.name] === undefined) {
            alert(pm.name + "は生成されていない背景です。");
            return;
        }

        if (pm.anchorX !== "default") {
            this.parent.sprites[pm.name].anchor.x = parseFloat(pm.anchorX);
        }

        if (pm.anchorY !== "default") {
            this.parent.sprites[pm.name].anchor.y = parseFloat(pm.anchorY);
        }

        if (pm.scale === "default") {
            pm.scale = this.parent.sprites[pm.name].scale.x * 100;
        }

        else {
            pm.scale = parseFloat(pm.scale) / 100;
        }

        if (pm.opacity === "default") {
            pm.opacity = this.parent.sprites[pm.name].alpha;
        }

        else {
            pm.opacity = parseFloat(pm.opacity) / 100;
        }

        if (pm.rotate === "default") {
            pm.rotate = this.parent.sprites[pm.name].rotation * (180 / Math.PI);
        }

        else {
            var rot = parseFloat(pm.rotate);
            if (rot < 0) {
                if (Math.abs(rot) === 360) {
                    rot = -360;
                }

                else {
                    rot = -(360 + rot);
                }
            }

            pm.rotate = rot;
        }

        if (pm.blur === "default") {
            pm.blur = this.parent.sprites[pm.name].filters[0].blur;
        }

        else {
            pm.blur = parseFloat(pm.blur);
        }

        var property = {
            posX: this.parent.sprites[pm.name].position.x,
            posY: this.parent.sprites[pm.name].position.y,
            scale: this.parent.sprites[pm.name].scale.x,
            opacity: this.parent.sprites[pm.name].alpha,
            rotate: this.parent.sprites[pm.name].rotation * (180 / Math.PI),
            blur: this.parent.sprites[pm.name].filters[0].blur
        };

        anime({
            targets: property,
            posX: parseInt(pm.posX) + this.parent.sprites[pm.name].position.x,
            posY: parseInt(pm.posY) + this.parent.sprites[pm.name].position.y,
            scale: parseFloat(pm.scale),
            opacity: parseFloat(pm.opacity),
            rotate: parseInt(pm.rotate),
            blur: parseFloat(pm.blur),
            easing: 'easeInSine',
            duration: parseInt(pm.time),
            update: function () {
                Adv.core.sprites[pm.name].position.set(property.posX, property.posY);
                Adv.core.sprites[pm.name].scale.set(property.scale, property.scale);
                Adv.core.sprites[pm.name].alpha = property.opacity;
                Adv.core.sprites[pm.name].rotation = property.rotate * (Math.PI / 180);
                Adv.core.sprites[pm.name].filters[0].blur = property.blur;
            },
            complete: function () {
                Adv.core.sprites[pm.name].position.set(property.posX, property.posY);
                Adv.core.sprites[pm.name].scale.set(property.scale, property.scale);
                Adv.core.sprites[pm.name].alpha = property.opacity;
                Adv.core.sprites[pm.name].rotation = property.rotate * (Math.PI / 180);
                Adv.core.sprites[pm.name].filters[0].blur = property.blur;
                Adv.core.exec.nextOrder();
            },
        });
    }
};

AdvTag.plugin.tag.label = {
    pm: {
        nextorder: "true"
    },
    start: function (pm) {
        if (this.parent.config.autoRecordLabel == "true") {
            var sf_tmp = "trail_" + this.parent.stat.current_scenario.replace(".ks", "").replace(/\u002f/g, "").replace(/:/g, "").replace(/\./g, "");
            var sf_buff = this.parent.stat.buff_label_name;
            var sf_label = sf_tmp + "_" + pm.label_name;
            if (this.parent.stat.buff_label_name != "") {
                if (!this.parent.variable.sf.record) this.parent.variable.sf.record = {};
                var sf_str = "sf.record." + sf_buff;
                var scr_str = "" + sf_str + " = " + sf_str + "  || 0;" + sf_str +
                    "++;";
                this.parent.evalScript(scr_str)
            }
            if (this.parent.variable.sf.record)
                if (this.parent.variable.sf.record[sf_label]) this.parent.stat.already_read = true;
                else this.parent.stat.already_read = false;
            this.parent.stat.buff_label_name = sf_label
        }
        if (pm.nextorder == "true") this.parent.exec.nextOrder()
    }
};

AdvTag.plugin.tag.resetfont = {
    log_join: "true",
    start: function () {
        this.parent.MesWindow.m_MesTextObj.m_Object.setTagStyle("default", {
            fontFamily: this.parent.ConfigData.MesWindowFont.Name,
            fontSize: this.parent.ConfigData.MesWindowFont.Size + "px",
            fill: "#ffffff",
            align: "left",
            breakWords: true,
            wordWrap: true,
            wordWrapWidth: 550
        });
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.showmenubutton = {
    pm: {},
    start: function (pm) {
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.position = {
    pm: {
        layer: "message0",
        page: "fore",
        left: "",
        top: "",
        width: "",
        height: "",
        color: "",
        opacity: "",
        vertical: "",
        frame: "",
        marginl: "0",
        margint: "0",
        marginr: "0",
        marginb: "0"
    },
    start: function (pm) {
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.layopt = {
    vital: ["layer"],
    pm: {
        layer: "",
        page: "fore",
        visible: "",
        left: "",
        top: "",
        opacity: "",
        autohide: false,
        index: 10
    },
    start: function (pm) {
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.ptext = {
    vital: ["layer", "x", "y"],
    pm: {
        "layer": "0",
        "page": "fore",
        "x": 0,
        "y": 0,
        "vertical": "false",
        "text": "",
        "size": "",
        "face": "",
        "color": "",
        "italic": "",
        "bold": "",
        "align": "left",
        "edge": "",
        "shadow": "",
        "name": "",
        "time": "",
        "width": "",
        "zindex": "9999",
        "overwrite": "false"
    },
    start: function (pm) {
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.chara_new = {
    vital: ["name", "define"],
    pm: {
        name: "",
        storage: "",
        width: "",
        height: "",
        reflect: "false",
        jname: "",
        visible: "false",
        color: "",
        map_face: {}
    },
    start: function (pm) {
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.chara_face = {
    vital: ["name", "face", "storage"],
    pm: {
        name: "",
        face: "",
        storage: ""
    },
    start: function (pm) {
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.p = {
    cw: true,
    start: function () {
        var that = this;
        this.parent.stat.flag_ref_page = true;
        that.parent.stat.is_click_text = true;

        if(this.parent.exec.array_tag[this.parent.exec.current_order_index-1].name === "chara_move")
        {
            if(parseInt(this.parent.exec.array_tag[this.parent.exec.current_order_index-1].pm.again) === -1)
            {
                that.parent.stat.is_click_text = false;
            }
        }

        if (this.parent.stat.is_skip == true) this.parent.exec.nextOrder();
        else if (this.parent.stat.is_auto == true) {
            this.parent.stat.is_wait_auto = true;
            var auto_speed = that.parent.config.autoSpeed;
            if (that.parent.config.autoSpeedWithText != "0") {
                var cnt_text = this.parent.stat.current_message_str.length;
                auto_speed = parseInt(auto_speed) + parseInt(that.parent.config.autoSpeedWithText) * cnt_text;
            }
            setTimeout(function () {
                if (that.parent.stat.voiceAlias === "") {
                    if (that.parent.stat.is_wait_auto == true)
                        if (that.parent.stat.is_auto)
                            that.parent.exec.nextOrder();
                }

                else {
                    if (that.parent.SoundMgr.isPlay(that.parent.stat.voiceAlias)) {
                        (function () {
                            var pwait = function (pwait) {
                                if (that.parent.SoundMgr.isPlay(that.parent.stat.voiceAlias)) {
                                    setTimeout(function () {
                                        pwait(pwait);
                                    }, 30);
                                }

                                else {
                                    that.parent.stat.voiceAlias = "";

                                    if (that.parent.stat.is_wait_auto == true)
                                        if (that.parent.stat.is_auto)
                                            that.parent.exec.nextOrder();
                                }
                            }

                            pwait(pwait);
                        })();
                    }

                    else {
                        that.parent.stat.voiceAlias = "";

                        if (that.parent.stat.is_wait_auto == true)
                            if (that.parent.stat.is_auto)
                                that.parent.exec.nextOrder();
                    }
                }
            }, auto_speed)
        }
    }
};

AdvTag.plugin.tag.chara_config = {
    pm: {
        pos_mode: "",
        effect: "",
        ptext: "",
        time: "",
        memory: "",
        anim: "",
        pos_change_time: "",
        talk_focus: "",
        brightness_value: "",
        blur_value: "",
        talk_anim: "",
        talk_anim_time: "",
        talk_anim_value: ""
    },
    start: function (pm) {
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.chara_ptext = {
    pm: {
        name: "",
        face: ""
    },
    start: function (pm) {

    },
    animChara: function (chara_obj, type, name) {

    }
};

AdvTag.plugin.tag.text = {
    cw: true,
    pm: {
        "val": "",
        "backlog": "add"
    },
    start: function (pm) {

    },
    showMessage: function (message_str, pm) {

    },
    showMessageVertical: function (message_str, pm) {

    },
};

AdvTag.plugin.tag.r = {
    log_join: "true",
    start: function () {
        var that = this;
        that.parent.MesWindow.m_MesText += "\n";
        that.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.chara_show = {
    vital: ["name"],
    pm: {
        name: "",
        page: "fore",
        layer: "0",
        wait: "true",
        left: "0",
        top: "0",
        width: "",
        height: "",
        zindex: "1",
        reflect: "",
        face: "",
        storage: "",
        scale: "100%",
        time: 100,
        eye: "true",
        mouth: "true",
        focus: "false",
        posX: "default",
        posY: "0",
        anchorX: "0.5",
        anchorY: "0",
        opacity: "100%",
        rotate: "0",
        quakeX: "0",
        quakeY: "0",
        quakeT: "300",
        blur: "0",
        zindex: "default",
        mask: "false"
    },
    start: function (pm) {
        var filename = pm.image === undefined ? this.parent.charaAni[pm.name][pm.face].sprite : pm.image;

        var sprite = new PIXI.Sprite(this.parent.CharaImgMgr.getTexture(filename));
        this.parent.root.contain.addChild(sprite, "Chara");

        var scale = parseInt(pm.scale) / 100;

        sprite.scale.set(scale, scale);

        if (pm.posX !== "default")
            sprite.position.x = parseInt(pm.posX);

        sprite.position.y = parseInt(pm.posY);

        var anchor = {
            x: parseFloat(pm.anchorX),
            y: parseFloat(pm.anchorY),
        };

        sprite.anchor.set(anchor.x, anchor.y);

        var blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.blur = parseFloat(pm.blur);

        sprite.filters = [blurFilter];

        var Active = 0xffffff;
        var Passive = 0x808080;

        var mask = JSON.parse(pm.mask) ? Passive : Active;
        sprite.tint = mask;

        this.parent.sprites[pm.name] = sprite;

        var rot = parseFloat(pm.rotate);
        if (rot < 0) {
            if (Math.abs(rot) === 360) {
                rot = -360;
            }

            else {
                rot = -(360 + rot);
            }
        }

        pm.rotate = rot;
        sprite.rotation = pm.rotate * (Math.PI / 180);

        if (parseInt(pm.time) <= 1) {
            sprite.alpha = parseInt(pm.opacity) / 100;
            this.parent.exec.nextOrder();
            return;
        }

        else if (parseInt(pm.opacity) === 0) {
            sprite.alpha = parseInt(pm.opacity) / 100;
            this.parent.exec.nextOrder();
            return;
        }

        sprite.alpha = 0;

        var property = {
            opacity: 0,
        };

        anime({
            targets: property,
            opacity: parseInt(pm.opacity) / 100,
            easing: 'easeInSine',
            duration: parseInt(pm.time),
            update: function () {
                if (sprite)
                    sprite.alpha = property.opacity;
            },
            complete: function () {
                if (sprite)
                    sprite.alpha = property.opacity;

                if (pm.wait == "true")
                    Adv.core.exec.nextOrder();
            }
        });

        if (pm.wait == "false") this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.font = {
    pm: {},
    log_join: "true",
    start: function (pm) {
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.select = {
    pm: {
        color: "black",
        font_color: "",
        storage: null,
        target: null,
        name: "",
        text: "",
        x: "auto",
        y: "",
        width: "",
        height: "",
        size: 30,
        graphic: "",
        enterimg: "",
        clickse: "",
        enterse: "",
        leavese: "",
        face: "",
        posX: "0",
        posY: "0",
        anchorX: "0.5",
        anchorY: "0.5",
        blur: "0",
        text: ""
    },
    start: function (pm) {
        if (this.parent.selects === undefined)
            this.parent.selects = [];

        var sprite = new PIXI.Sprite(this.parent.CommonImgMgr.getTexture(pm.image));
        this.parent.root.contain.addChild(sprite, "select");

        if (pm.posX !== "default")
            sprite.position.x = parseInt(pm.posX);

        sprite.position.y = parseInt(pm.posY);

        var anchor = {
            x: parseFloat(pm.anchorX),
            y: parseFloat(pm.anchorY),
        };

        sprite.anchor.set(anchor.x, anchor.y);

        var blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.blur = parseFloat(pm.blur);

        sprite.filters = [blurFilter];

        var text = new PIXI.Text(pm.text, new PIXI.TextStyle({
            fill: ['#ffffff']
        }));
        text.anchor.set(0.5, 0.5);

        sprite.addChild(text);

        this.parent.selects.push({ pm: pm, sprite: sprite });

        if (this.parent.exec.array_tag[this.parent.exec.current_order_index + 1] !== undefined && this.parent.exec.array_tag[this.parent.exec.current_order_index + 1].name === "select") {
            this.parent.exec.nextOrder();
        }

        else {
            var that = this;
            for (var i = 0; i < this.parent.selects.length; i++) {
                this.parent.selects[i].sprite.interactive = true;
                this.parent.selects[i].sprite.buttonMode = true;

                this.parent.selects[i].sprite.on('pointerdown', function () {
                    console.log("test");
                    that.parent.root.contain.selectActivate(false);

                    var pm = null;

                    for (var i = 0; i < Adv.core.selects.length; i++) {
                        if (Adv.core.selects[i].sprite === this) {
                            pm = JSON.parse(JSON.stringify(Adv.core.selects[i].pm));
                        }
                        Adv.core.selects[i].sprite.destroy(true);
                        Adv.core.selects[i].sprite = null;
                        Adv.core.selects[i] = null;
                    }

                    Adv.core.selects = [];

                    if (pm.inherit === "false")
                        Adv.core.end();

                    Adv.core.exec.nextOrderWithLabel(pm.target, pm.scenario);
                });
            }

            this.parent.root.contain.selectActivate(true);
        }
    },

    setEvent: function (btn, pm) {

    },
};

AdvTag.plugin.tag.endlink = {
    pm: {
        color: "black",
        font_color: "",
        storage: null,
        target: null,
        name: "",
        text: "",
        x: "auto",
        y: "",
        width: "",
        height: "",
        size: 30,
        graphic: "",
        enterimg: "",
        clickse: "",
        enterse: "",
        leavese: "",
        face: ""
    },
    start: function (pm) {
        this.parent.exec.nextOrder();
    },
};

AdvTag.plugin.tag.autostart = {
    start: function (pm) {
        this.parent.stat.is_auto = true;
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.s = {
    start: function (pm) {
        this.parent.stat.is_strong_stop = true;
    }
};

AdvTag.plugin.tag.jump = {
    pm: {
        storage: null,
        target: null,
        countpage: true
    },
    start: function (pm) {

    }
};

AdvTag.plugin.tag.end = {
    start: function (pm) {
        this.parent.endStorage();
    }
};

AdvTag.plugin.tag.chara_mod = {
    vital: ["name"],
    pm: {
        name: "",
        face: "",
        reflect: "",
        storage: "",
        time: "1500",
        cross: "false",
        wait: "true",
        mask: "false",
        focus: "false",
        eye: "",
        mouth: "",
    },
    start: function (pm) {
        var temp = pm.name;
        if (this.parent.sprites[pm.name] === undefined) {
            if (pm.image === undefined) {
                pm.name = this.parent.charaAni[pm.name][pm.face].sprite;
            }

            if (this.parent.sprites[pm.name] === undefined) {
                alert(pm.name + "は生成されていないキャラクターです。");
                return;
            }
        }

        if (pm.cross === "true") {
            this.parent.sprites[pm.name].alpha = 0;

            var crossfade = new PIXI.Sprite(this.parent.CharaImgMgr.getTexture(this.parent.sprites[pm.name].texture.baseTexture.resource.url));
            this.parent.root.contain.addChild(crossfade, "Chara");

            var pos = {
                x: this.parent.sprites[pm.name].position.x,
                y: this.parent.sprites[pm.name].position.y
            };

            var anchor = {
                x: this.parent.sprites[pm.name].anchor.x,
                y: this.parent.sprites[pm.name].anchor.y
            };

            var scale = {
                x: this.parent.sprites[pm.name].scale.x,
                y: this.parent.sprites[pm.name].scale.y
            };

            crossfade.position.set(pos.x, pos.y);
            crossfade.anchor.set(anchor.x, anchor.y);
            crossfade.scale.set(scale.x, scale.y);
            crossfade.anchor.alpha = 1;

            this.parent.sprites[pm.name + "_cf"] = crossfade;

            this.parent.sprites[pm.name].texture.destroy(true);
            this.parent.sprites[pm.name].texture = null;

            if (this.parent.charaAni.length !== 0)
                this.parent.sprites[pm.name].texture = this.parent.CharaImgMgr.getTexture(this.parent.charaAni[temp][pm.face].sprite);
            else
                this.parent.sprites[pm.name].texture = this.parent.CharaImgMgr.getTexture(pm.face);

            var property = {
                opacity: 0
            };

            anime({
                targets: property,
                opacity: 1,
                easing: 'easeInSine',
                duration: parseInt(pm.time),
                update: function () {
                    if(Adv.core.sprites[pm.name])
                        Adv.core.sprites[pm.name].alpha = property.opacity;
                },
                complete: function () {
                    if(Adv.core.sprites[pm.name])
                        Adv.core.sprites[pm.name].alpha = 1;

                    if (pm.wait == "true")
                        Adv.core.exec.nextOrder();
                },
            });

            var _property = {
                opacity: 1
            };

            anime({
                targets: _property,
                opacity: 0,
                easing: 'easeInSine',
                duration: parseInt(pm.time),
                update: function () {
                    if (Adv.core.sprites[pm.name + "_cf"])
                        Adv.core.sprites[pm.name + "_cf"].alpha = _property.opacity;
                },
                complete: function () {
                    if (Adv.core.sprites[pm.name + "_cf"]) {
                        Adv.core.sprites[pm.name + "_cf"].alpha = 0;
                        Adv.core.sprites[pm.name + "_cf"].destroy();
                        Adv.core.sprites[pm.name + "_cf"] = null;
                        delete Adv.core.sprites[pm.name + "_cf"];
                    }
                },
            });
        }

        else {
            if(pm.time !== "0")
            {
                this.parent.sprites[pm.name].texture = this.parent.CharaImgMgr.getTexture(pm.face);
                var sprite = this.parent.sprites[pm.name];
                sprite.alpha = 0;

                var property = {
                    opacity: 0
                };
                
                anime({
                    targets: property,
                    opacity: 1,
                    easing: 'easeInSine',
                    duration: parseInt(pm.time),
                    update: function() {
                        if(sprite)
                            sprite.alpha = property.opacity;
                    },
                    complete: function() {
                        if(sprite)
                            sprite.alpha = 1;

                        if (pm.wait == "true")
                            Adv.core.exec.nextOrder();
                    },
                });
            }

            else
            {
                if (this.parent.charaAni.length !== 0)
                    this.parent.sprites[pm.name].texture = this.parent.CharaImgMgr.getTexture(this.parent.charaAni[temp][pm.face].sprite);
                else
                    this.parent.sprites[pm.name].texture = this.parent.CharaImgMgr.getTexture(pm.face);
            }
        }

            if (pm.wait == "false") this.parent.exec.nextOrder();
        }
    };

    AdvTag.plugin.tag.chara_move = {
        vital: ["name"],
        pm: {
            name: "",
            time: "600",
            anim: "false",
            left: "",
            top: "",
            width: "",
            height: "",
            effect: "",
        scale: "大",
        wait: "true",
        anchorX: "default",
        anchorY: "default",
        posX: "0",
        posY: "0",
        scale: "default",
        opacity: "default",
        rotate: "default",
        quakeX: "0",
        quakeY: "0",
        quakeT: "300",
        blur: "default",
        zindex: "default",
        again: "1",
        random: "false"
    },
    start: function (pm) {
        if (this.parent.sprites[pm.name] === undefined) {
            if (pm.image === undefined) {
                for (var i = 0; i < Adv.core.charaDefine.length; i++) {
                    if (Adv.core.charaDefine[i].name === pm.name) {
                        pm.name = Adv.core.charaDefine[i].file;
                        break;
                    }
                }
            }

            if (this.parent.sprites[pm.name] === undefined) {
                alert(pm.name + "は生成されていないキャラクターです。");
                return;
            }
        }

        if (pm.anchorX !== "default") {
            this.parent.sprites[pm.name].anchor.x = parseFloat(pm.anchorX);
        }

        if (pm.anchorY !== "default") {
            this.parent.sprites[pm.name].anchor.y = parseFloat(pm.anchorY);
        }

        if (pm.scale === "default") {
            pm.scale = this.parent.sprites[pm.name].scale.x * 100;
        }

        else {
            pm.scale = parseFloat(pm.scale) / 100;
        }

        if (pm.opacity === "default") {
            pm.opacity = this.parent.sprites[pm.name].alpha;
        }

        else {
            pm.opacity = parseFloat(pm.opacity) / 100;
        }

        if (pm.rotate === "default") {
            pm.rotate = this.parent.sprites[pm.name].rotation * (180 / Math.PI);
        }

        else {
            var rot = parseFloat(pm.rotate);
            if (rot < 0) {
                if (Math.abs(rot) === 360) {
                    rot = -360;
                }
            }

            pm.rotate = rot;
        }

        if (pm.blur === "default") {
            pm.blur = this.parent.sprites[pm.name].filters[0].blur;
        }

        else {
            pm.blur = parseFloat(pm.blur);
        }

        var property = {
            x: this.parent.sprites[pm.name].position.x,
            y: this.parent.sprites[pm.name].position.y,
            scale: this.parent.sprites[pm.name].scale.x,
            alpha: this.parent.sprites[pm.name].alpha,
            rotation: this.parent.sprites[pm.name].rotation * (180 / Math.PI),
            blur: this.parent.sprites[pm.name].filters[0].blur
        };

        var again = 0;
        var that = this;

        var option_anime = {
            x: parseInt(pm.posX) + that.parent.sprites[pm.name].position.x,
            y: parseInt(pm.posY) + that.parent.sprites[pm.name].position.y,
            scale: parseFloat(pm.scale),
            alpha: parseFloat(pm.opacity),
            rotation: parseInt(pm.rotate),
            blur: parseFloat(pm.blur),
        };

        var easingNames = [
            'easeInQuad',
            'easeInCubic',
            'easeInQuart',
            'easeInQuint',
            'easeInSine',
            'easeInExpo',
            'easeInCirc',
            'easeInBack',
            'easeInBounce',
            'easeInOutQuad',
            'easeInOutCubic',
            'easeInOutQuart',
            'easeInOutQuint',
            'easeInOutSine',
            'easeInOutExpo',
            'easeInOutCirc',
            'easeInOutBack',
            'easeInOutBounce',
            'easeOutQuad',
            'easeOutCubic',
            'easeOutQuart',
            'easeOutQuint',
            'easeOutSine',
            'easeOutExpo',
            'easeOutCirc',
            'easeOutBack',
            'easeOutBounce'
        ];

        var max = easingNames.length;
        var min = 0;

        min = Math.ceil(min);
        max = Math.floor(max);

        var idx = Math.floor(Math.random() * (max - min)) + min;
        var easing = JSON.parse(pm.random) ? easingNames[idx] : "easeInSine";
        var loop = parseInt(pm.again);
        var completeCount = 0;
        
        var isLast = false;

        if(Adv.core.exec.array_tag[Adv.core.exec.current_order_index+1].name === "p")
        {
            console.log(pm.name)
            isLast = true;
        }

        if(loop === 1)
        {
            loop = false;
        }

        else if(loop === -1)
        {
            loop = true;
            that.parent.stat.is_click_text = false;

            if(isLast)
                pm.wait = "false";
        }

        if (pm.time === "0") {
            Adv.core.sprites[pm.name].position.x = option_anime.x;
            Adv.core.sprites[pm.name].position.y = option_anime.y;
            Adv.core.sprites[pm.name].alpha = option_anime.alpha;
            Adv.core.sprites[pm.name].scale.set(option_anime.scale, option_anime.scale);
            Adv.core.sprites[pm.name].rotation = option_anime.rotation * (Math.PI / 180);
            Adv.core.sprites[pm.name].filters[0].blur = option_anime.blur;

            this.parent.exec.nextOrder();
            return;
        }

        else {
            anime({
                targets: property,
                x: parseInt(pm.posX) + that.parent.sprites[pm.name].position.x,
                y: parseInt(pm.posY) + that.parent.sprites[pm.name].position.y,
                scale: parseFloat(pm.scale),
                alpha: parseFloat(pm.opacity),
                rotation: parseInt(pm.rotate),
                blur: parseFloat(pm.blur),
                easing: 'easeInSine',
                loop: loop,
                direction: 'alternate',
                duration: parseInt(pm.time),
                update: function (e) {
                    if(loop)
                    {
                        if(that.parent.stat.is_click_text)
                        {
                            if(completeCount % 2 === 1)
                                this.remaining = 0;
                            else
                                this.remaining = 2;

                            loop = false;
                        }
                    }
                    
                    if (Adv.core.sprites[pm.name]) {
                        Adv.core.sprites[pm.name].position.x = property.x;
                        Adv.core.sprites[pm.name].position.y = property.y;
                        Adv.core.sprites[pm.name].alpha = property.alpha;
                        Adv.core.sprites[pm.name].scale.set(property.scale, property.scale);
                        Adv.core.sprites[pm.name].rotation = property.rotation * (Math.PI / 180);
                        Adv.core.sprites[pm.name].filters[0].blur = property.blur;
                    }
                },

                loopComplete: function(e)
                {
                    if(this.remaining === 0 && isLast)
                    {
                        that.parent.stat.is_click_text = false;
                        Adv.core.exec.nextOrder();
                    }

                    completeCount++;
                },
                complete: function (e) {
                    if (pm.wait === "true")
                        Adv.core.exec.nextOrder();
                }
            });
        }

        if (pm.wait === "false") this.parent.exec.nextOrder();
        
        if(isLast)
            Adv.core.stat.flag_ref_page = false;
    }
};
AdvTag.plugin.tag.wait = {
    pm: {
        time: 2000
    },
    start: function (pm) {
        var that = this;
        this.parent.stat.is_wait = "true";

        (function () {
            setTimeout(function () {
                that.parent.stat.is_wait = "false";
                that.parent.exec.nextOrder();
            }, parseInt(pm.time))
        })();
    }
};

AdvTag.plugin.tag.quake = {
    pm: {
        count: "2",
        time: 1000,
        x: "0",
        y: "0",
        wait: "false"
    },
    start: function (pm) {
        var property = {
            x: 0,
            y: 0
        };

        var xMax = parseInt(pm.x);
        var yMax = parseInt(pm.y);

        var x = [];
        var y = [];

        var length = parseInt(pm.count);
        for (var i = 0; i < length; i++) {
            x.push(xMax);
            x.push(-xMax);

            y.push(yMax);
            y.push(-yMax);
        }

        x.push(0);
        y.push(0);

        if (pm.time === "0") {
            this.parent.root.contain.root.position.x = 0;
            this.parent.root.contain.root.position.y = 0;

            Adv.core.exec.nextOrder();
        }

        else {
            var that = this;
            anime({
                targets: property,
                x: x,
                y: y,
                easing: 'easeInSine',
                duration: parseInt(pm.time),
                update: function () {
                    that.parent.root.contain.root.position.x = property.x;
                    that.parent.root.contain.root.position.y = property.y;
                },

                complete: function () {
                    that.parent.root.contain.root.position.x = 0;
                    that.parent.root.contain.root.position.y = 0;

                    if (pm.wait === "true")
                        Adv.core.exec.nextOrder();
                }
            });

            if (pm.wait === "false")
                Adv.core.exec.nextOrder();
        }
    }
};

AdvTag.plugin.tag.chara_hide = {
    vital: ["name"],
    pm: {
        name: "",
        page: "fore",
        layer: "0",
        wait: "true",
        left: "0",
        top: "0",
        width: "",
        height: "",
        zindex: "1",
        reflect: "",
        face: "",
        storage: "",
        time: 100
    },
    start: function (pm) {

        if (this.parent.sprites[pm.name] === undefined) {
            if (pm.image === undefined) {
                for (var i = 0; i < Adv.core.charaDefine.length; i++) {
                    if (Adv.core.charaDefine[i].name === pm.name) {
                        pm.name = Adv.core.charaDefine[i].file;
                        break;
                    }
                }
            }

            if (this.parent.sprites[pm.name] === undefined) {
                alert(pm.name + "は生成されていないキャラクターです。");
                return;
            }
        }

        if (pm.time === "0") {
            if (this.parent.sprites[pm.name]) {
                this.parent.sprites[pm.name].destroy();
                this.parent.sprites[pm.name] = null;
                delete this.parent.sprites[pm.name];
            }

            this.parent.exec.nextOrder();
            return;
        }

        var property = {
            opacity: this.parent.sprites[pm.name].alpha,
        };

        anime({
            targets: property,
            opacity: 0,
            easing: 'easeInSine',
            duration: parseInt(pm.time),
            update: function () {
                Adv.core.sprites[pm.name].alpha = property.opacity;
            },
            complete: function () {
                Adv.core.sprites[pm.name].alpha = 0;
                Adv.core.sprites[pm.name].destroy();
                Adv.core.sprites[pm.name] = null;
                delete Adv.core.sprites[pm.name];

                if (pm.wait === "true")
                    Adv.core.exec.nextOrder();
            },
        });

        if (pm.wait === "false") this.parent.exec.nextOrder();
    }
}

AdvTag.plugin.tag.scroll = {
    vital: ["direct"],
    pm: {
        name: "",
        direct: "",
        speed: "2000",
        move: "999999",
        anchorX: "default",
        anchorY: "default",
        posX: "0",
        posY: "0"
    },
    start: function (pm) {

    }
};

AdvTag.plugin.tag.playbgm = {
    vital: ["name"],
    pm: {
        name: "",
        loop: "true",
        volume: "100",
        laterTime: "0"
    },
    start: function (pm) {
        var that = this;

        if (pm.laterTime === "0") {
            this.parent.SoundMgr.Play(pm.name, JSON.parse(pm.loop), parseInt(pm.volume) / 100);
            this.parent.exec.nextOrder();
        }

        else {
            setTimeout(function () {
                that.parent.SoundMgr.Play(pm.name, JSON.parse(pm.loop), parseInt(pm.volume) / 100);
                if (pm.wait !== "false")
                    that.parent.exec.nextOrder();
            }, parseInt(pm.laterTime));

            if (pm.wait === "false")
                that.parent.exec.nextOrder();
        }
    }
};

AdvTag.plugin.tag.playse = {
    vital: ["name"],
    pm: {
        name: "",
        loop: "false",
        volume: "100",
        clear: "false",
        laterTime: "0",
        wait: "false"
    },
    start: function (pm) {
        var that = this;

        if (pm.laterTime === "0") {
            this.parent.SoundMgr.Play(pm.name, JSON.parse(pm.loop), parseInt(pm.volume) / 100);
            this.parent.exec.nextOrder();
        }

        else {
            setTimeout(function () {
                that.parent.SoundMgr.Play(pm.name, JSON.parse(pm.loop), parseInt(pm.volume) / 100);
                if (pm.wait !== "false")
                    that.parent.exec.nextOrder();
            }, parseInt(pm.laterTime));

            if (pm.wait === "false")
                that.parent.exec.nextOrder();
        }
    }
};

AdvTag.plugin.tag.playvoice = {
    vital: ["name"],
    pm: {
        name: "",
        loop: "false",
        volume: "100",
        clear: "false",
        laterTime: "0",
        wait: "false"
    },
    start: function (pm) {
        this.parent.stat.voiceAlias = pm.name;
        var that = this;

        if (pm.laterTime === "0") {
            this.parent.SoundMgr.Play(pm.name, JSON.parse(pm.loop), parseInt(pm.volume) / 100);
            this.parent.exec.nextOrder();
        }

        else {
            setTimeout(function () {
                that.parent.SoundMgr.Play(pm.name, JSON.parse(pm.loop), parseInt(pm.volume) / 100);
                if (pm.wait !== "false")
                    that.parent.exec.nextOrder();
            }, parseInt(pm.laterTime));

            if (pm.wait === "false")
                that.parent.exec.nextOrder();
        }
    }
};

AdvTag.plugin.tag.window = {
    pm: {
        x: "320",
        y: "770",
        visible: "true",
        fontSize: "25",
        cursor: "true",
        name: "true"
    },
    start: function (pm) {
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.fade = {
    pm: {
        time: "1000",
        a: ",",
        r: ",",
        g: ",",
        b: ",",
        start_rgb: "0xffffff",
        end_rgb: "0xffffff",
        wait: "true"
    },
    start: function (pm) {
        var srgb = {
            r: (parseInt(pm.start_rgb) & 0xFF0000) >> 16,
            g: (parseInt(pm.start_rgb) & 0x00FF00) >> 8,
            b: (parseInt(pm.start_rgb) & 0x0000FF)
        };

        var ergb = {
            r: (parseInt(pm.end_rgb) & 0xFF0000) >> 16,
            g: (parseInt(pm.end_rgb) & 0x00FF00) >> 8,
            b: (parseInt(pm.end_rgb) & 0x0000FF)
        };

        var splitA = pm.start_rgb === undefined ? pm.a.split(",") : [parseInt(pm.start_alpha) / 100, parseInt(pm.end_alpha) / 100];
        var jsonA = { s: 0, e: 0 };
        var defalutValue = pm.start_rgb === undefined ? "" : 255;
        var alphaAvg = pm.start_rgb === undefined ? 255 : 1;

        if (splitA[0] === defalutValue) {
            jsonA.s = this.parent.root.contain.containers["fader"].children[0].fill.alpha * 255;
        }

        else {
            jsonA.s = parseFloat(splitA[0]);
        }

        if (splitA[1] === defalutValue) {
            jsonA.e = this.parent.root.contain.containers["fader"].children[0].fill.alpha * 255;
        }

        else {
            jsonA.e = parseFloat(splitA[1]);
        }

        var splitR = pm.start_rgb === undefined ? pm.r.split(",") : [srgb.r, ergb.r];
        var jsonR = { s: 0, e: 0 };

        if (splitR[0] === defalutValue) {
            jsonR.s = (this.parent.root.contain.containers["fader"].children[0].fill.color & 0xFF0000) >> 16;
        }

        else {
            jsonR.s = parseInt(splitR[0]);
        }

        if (splitR[1] === defalutValue) {
            jsonR.e = (this.parent.root.contain.containers["fader"].children[0].fill.color & 0xFF0000) >> 16;
        }

        else {
            jsonR.e = parseInt(splitR[1]);
        }

        var splitG = pm.start_rgb === undefined ? pm.g.split(",") : [srgb.g, ergb.g];
        var jsonG = { s: 0, e: 0 };

        if (splitG[0] === defalutValue) {
            jsonG.s = (this.parent.root.contain.containers["fader"].children[0].fill.color & 0x00FF00) >> 8;
        }

        else {
            jsonG.s = parseInt(splitG[0]);
        }

        if (splitG[1] === defalutValue) {
            jsonG.e = (this.parent.root.contain.containers["fader"].children[0].fill.color & 0x00FF00) >> 8;
        }

        else {
            jsonG.e = parseInt(splitG[1]);
        }

        var splitB = pm.start_rgb === undefined ? pm.b.split(",") : [srgb.b, ergb.b];
        var jsonB = { s: 0, e: 0 };

        if (splitB[0] === defalutValue) {
            jsonB.s = this.parent.root.contain.containers["fader"].children[0].fill.color & 0x0000FF;
        }

        else {
            jsonB.s = parseInt(splitB[0]);
        }

        if (splitB[1] === defalutValue) {
            jsonB.e = this.parent.root.contain.containers["fader"].children[0].fill.color & 0x0000FF;
        }

        else {
            jsonB.e = parseInt(splitB[1]);
        }

        var property = {
            r: jsonR.s,
            g: jsonG.s,
            b: jsonB.s,
            a: jsonA.s
        };

        if (pm.time === "0") {
            this.parent.root.contain.containers["fader"].children[0].clear();
            this.parent.root.contain.containers["fader"].children[0].beginFill((property.r << 16 | property.g << 8 | property.b), property.a / alphaAvg);
            this.parent.root.contain.containers["fader"].children[0].drawRect(0, 0, this.parent.root.size[0], this.parent.root.size[1]);
            this.parent.root.contain.containers["fader"].children[0].endFill();

            Adv.core.exec.nextOrder();
        }

        else {
            var that = this;
            anime({
                targets: property,
                r: jsonR.e,
                g: jsonG.e,
                b: jsonB.e,
                a: jsonA.e,
                easing: 'easeInSine',
                duration: parseInt(pm.time),
                update: function () {
                    that.parent.root.contain.containers["fader"].children[0].clear();
                    that.parent.root.contain.containers["fader"].children[0].beginFill((property.r << 16 | property.g << 8 | property.b), property.a / alphaAvg);
                    that.parent.root.contain.containers["fader"].children[0].drawRect(0, 0, that.parent.root.size[0], that.parent.root.size[1]);
                    that.parent.root.contain.containers["fader"].children[0].endFill();
                },
                complete: function () {
                    that.parent.root.contain.containers["fader"].children[0].clear();
                    that.parent.root.contain.containers["fader"].children[0].beginFill((jsonR.e << 16 | jsonG.e << 8 | jsonB.e), jsonA.e / alphaAvg);
                    that.parent.root.contain.containers["fader"].children[0].drawRect(0, 0, that.parent.root.size[0], that.parent.root.size[1]);
                    that.parent.root.contain.containers["fader"].children[0].endFill();

                    if (pm.wait === "true")
                        Adv.core.exec.nextOrder();
                },
            });

            if (pm.wait === "false")
                Adv.core.exec.nextOrder();
        }


    }
};

AdvTag.plugin.tag.root = {
    pm: {
        blur: "defalut",
        time: "100",
        quakeX: "0",
        quakeY: "0",
        quakeT: "300",
        fadeRGB: "default",
        fadeAlpha: "default"
    },
    start: function (pm) {

    }
};

AdvTag.plugin.tag.stopbgm = {
    vital: ["name"],
    pm: {
        name: "",
    },
    start: function (pm) {
        this.parent.SoundMgr.Stop(pm.name);
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.stopse = {
    vital: ["name"],
    pm: {
        name: ""
    },
    start: function (pm) {
        this.parent.SoundMgr.Stop(pm.name);
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.stopvoice = {
    vital: ["name"],
    pm: {
        name: ""
    },
    start: function (pm) {
        this.parent.SoundMgr.Stop(pm.name);
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.btns = {
    pm: {
        skip: "true",
        auto: "true",
        log: "true",
    },
    start: function (pm) {
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.spine = {
    pm: {
        name: "",
        animation: "",
        posX: "0",
        posY: "0",
        scale: "100",
        time: "1000",
        opacity: "0",
        posX: "0",
        posY: "0",
        anchorX: "0.5",
        anchorY: "0",
        opacity: "100%",
        mask: "false",
        blur: "0",
        wait: "true",
        loop: "false",
        laterTime: "0",
        aniLaterTime: "0",
        wait: "false"
    },

    start: function (pm) {
        var that = this;
        if (pm.laterTime === "0") {
            var sprite = new PIXI.spine.Spine(this.parent.SpineMgr.getData(pm.name));
            this.parent.sprites[pm.name] = sprite;

            if (pm.aniLaterTime === "0") {
                sprite.state.setAnimation(0, pm.animation, JSON.parse(pm.loop));
                sprite.state.tracks[0].listener = {
                    complete: function (trackEntry, count) {
                        if (pm.wait === "true")
                            that.parent.exec.nextOrder();
                    }
                }
            }

            else {
                setTimeout(() => {
                    sprite.state.setAnimation(0, pm.animation, JSON.parse(pm.loop));
                    sprite.state.tracks[0].listener = {
                        complete: function (trackEntry, count) {
                            if (pm.wait === "true")
                                that.parent.exec.nextOrder();
                        }
                    }

                    if (pm.wait === "false")
                        that.parent.exec.nextOrder();
                }, parseInt(pm.aniLaterTime));
            }

            this.parent.root.contain.addChild(sprite, "Chara");

            var scale = parseInt(pm.scale) / 100;

            sprite.scale.set(scale, scale);

            if (pm.posX !== "default")
                sprite.position.x = parseInt(pm.posX);

            sprite.position.y = parseInt(pm.posY);

            var anchor = {
                x: parseFloat(pm.anchorX),
                y: parseFloat(pm.anchorY),
            };

            var blurFilter = new PIXI.filters.BlurFilter();
            blurFilter.blur = parseFloat(pm.blur);

            sprite.filters = [blurFilter];

            var Active = 0xffffff;
            var Passive = 0x808080;

            var mask = JSON.parse(pm.mask) ? Passive : Active;
            sprite.tint = mask;

            this.parent.sprites[pm.name] = sprite;

            if (pm.aniLaterTime === "0" && pm.wait === "false")
                this.parent.exec.nextOrder();
        }

        else {
            var that = this;
            setTimeout(() => {
                var sprite = new PIXI.spine.Spine(this.parent.SpineMgr.getData(pm.name));
                that.parent.sprites[pm.name] = sprite;

                if (pm.aniLaterTime === "0") {
                    sprite.state.setAnimation(0, pm.animation, JSON.parse(pm.loop));
                    sprite.state.tracks[0].listener = {
                        complete: function (trackEntry, count) {
                            if (pm.wait === "true")
                                that.parent.exec.nextOrder();
                        }
                    }

                    if (pm.wait === "false")
                        that.parent.exec.nextOrder();
                }

                else {
                    setTimeout(() => {
                        sprite.state.setAnimation(0, pm.animation, JSON.parse(pm.loop));
                        sprite.state.tracks[0].listener = {
                            complete: function (trackEntry, count) {
                                if (pm.wait === "true")
                                    that.parent.exec.nextOrder();
                            }
                        }

                        if (pm.wait === "false")
                            that.parent.exec.nextOrder();
                    }, parseInt(pm.aniLaterTime));
                }

                this.parent.root.contain.addChild(sprite, "Chara");

                var scale = parseInt(pm.scale) / 100;

                sprite.scale.set(scale, scale);

                if (pm.posX !== "default")
                    sprite.position.x = parseInt(pm.posX);

                sprite.position.y = parseInt(pm.posY);

                var anchor = {
                    x: parseFloat(pm.anchorX),
                    y: parseFloat(pm.anchorY),
                };

                var blurFilter = new PIXI.filters.BlurFilter();
                blurFilter.blur = parseFloat(pm.blur);

                sprite.filters = [blurFilter];

                var Active = 0xffffff;
                var Passive = 0x808080;

                var mask = JSON.parse(pm.mask) ? Passive : Active;
                sprite.tint = mask;

                that.parent.sprites[pm.name] = sprite;

                if (pm.aniLaterTime === "0" && pm.wait === "false")
                    that.parent.exec.nextOrder();
            }, parseInt(pm.laterTime));
        }
    }
};

AdvTag.plugin.tag.spine_move = {
    vital: ["name"],
    pm: {
        name: "",
        time: "600",
        anim: "false",
        left: "",
        top: "",
        width: "",
        height: "",
        effect: "",
        scale: "大",
        wait: "true",
        anchorX: "default",
        anchorY: "default",
        posX: "0",
        posY: "0",
        scale: "default",
        opacity: "default",
        rotate: "default",
        quakeX: "0",
        quakeY: "0",
        quakeT: "300",
        blur: "default",
        zindex: "default"
    },
    start: function (pm) {
        if (this.parent.sprites[pm.name] === undefined) {
            if (pm.image === undefined) {
                for (var i = 0; i < Adv.core.charaDefine.length; i++) {
                    if (Adv.core.charaDefine[i].name === pm.name) {
                        pm.name = Adv.core.charaDefine[i].file;
                        break;
                    }
                }
            }

            if (this.parent.sprites[pm.name] === undefined) {
                alert(pm.name + "は生成されていないキャラクターです。");
                return;
            }
        }

        if (pm.scale === "default") {
            pm.scale = this.parent.sprites[pm.name].scale.x * 100;
        }

        else {
            pm.scale = parseFloat(pm.scale) / 100;
        }

        if (pm.opacity === "default") {
            pm.opacity = this.parent.sprites[pm.name].alpha;
        }

        else {
            pm.opacity = parseFloat(pm.opacity) / 100;
        }

        if (pm.rotate === "default") {
            pm.rotate = this.parent.sprites[pm.name].rotation * (180 / Math.PI);
        }

        else {
            var rot = parseFloat(pm.rotate);
            if (rot < 0) {
                if (Math.abs(rot) === 360) {
                    rot = -360;
                }

                else {
                    rot = -(360 + rot);
                }
            }

            pm.rotate = rot;
        }

        if (pm.blur === "default") {
            pm.blur = this.parent.sprites[pm.name].filters[0].blur;
        }

        else {
            pm.blur = parseFloat(pm.blur);
        }

        var property = {
            posX: this.parent.sprites[pm.name].position.x,
            posY: this.parent.sprites[pm.name].position.y,
            scale: this.parent.sprites[pm.name].scale.x,
            opacity: this.parent.sprites[pm.name].alpha,
            rotate: this.parent.sprites[pm.name].rotation * (180 / Math.PI),
            blur: this.parent.sprites[pm.name].filters[0].blur
        };

        anime({
            targets: property,
            posX: parseInt(pm.posX) + this.parent.sprites[pm.name].position.x,
            posY: parseInt(pm.posY) + this.parent.sprites[pm.name].position.y,
            scale: parseFloat(pm.scale),
            opacity: parseFloat(pm.opacity),
            rotate: parseInt(pm.rotate),
            blur: parseFloat(pm.blur),
            easing: 'easeInSine',
            duration: parseInt(pm.time),
            update: function () {
                Adv.core.sprites[pm.name].position.set(property.posX, property.posY);
                Adv.core.sprites[pm.name].scale.set(property.scale, property.scale);
                Adv.core.sprites[pm.name].alpha = property.opacity;
                Adv.core.sprites[pm.name].rotation = property.rotate * (Math.PI / 180);
                Adv.core.sprites[pm.name].filters[0].blur = property.blur;
            },
            complete: function () {
                Adv.core.sprites[pm.name].position.set(property.posX, property.posY);
                Adv.core.sprites[pm.name].scale.set(property.scale, property.scale);
                Adv.core.sprites[pm.name].alpha = property.opacity;
                Adv.core.sprites[pm.name].rotation = property.rotate * (Math.PI / 180);
                Adv.core.sprites[pm.name].filters[0].blur = property.blur;
                Adv.core.exec.nextOrder();
            },
        });
    }
};

AdvTag.plugin.tag.spine_mod = {
    vital: ["name"],
    pm: {
        name: "",
        face: "",
        reflect: "",
        storage: "",
        time: "1500",
        cross: "false",
        wait: "true",
        mask: "false",
        focus: "false",
        eye: "",
        mouth: "",
        loop: "false"
    },
    start: function (pm) {
        this.parent.sprites[pm.name].state.setAnimation(0, pm.animation, JSON.parse(pm.loop))
        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.spine_hide = {
    vital: ["name"],
    pm: {
        name: "",
        face: "",
        reflect: "",
        storage: "",
        time: "1500",
        cross: "false",
        wait: "true",
        mask: "false",
        focus: "false",
        eye: "",
        mouth: "",
    },
    start: function (pm) {
        this.parent.sprites[pm.name].destroy(true);
        this.parent.sprites[pm.name] = null;
        delete this.parent.sprites[pm.name];

        this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.playvideo = {
    vital: ["name"],
    pm: {
        laterTime: "0",
        play_laterTime: "0",
        posX: "0",
        posY: "0",
        scale: "100",
        blur: "0",
        time: "0",
        loop: "false",
        wait: "true",
        alpha: "100",
        auto: "true",
        skip: "false"
    },
    start: function (pm) {
        var videoSprite = new PIXI.Sprite(this.parent.VideoMgr.getTexture(pm.name));
        videoSprite.position.set(parseInt(pm.posX), parseInt(pm.posY));
        videoSprite.scale.set(parseInt(pm.scale) / 100, parseInt(pm.scale) / 100);
        videoSprite.anchor.set(0.5, 0.5);

        this.parent.root.contain.addChild(videoSprite, "Chara");

        this.parent.VideoMgr.appendEndCbk(pm.name, function () {
            if (pm.wait === "true" && pm.skip === "false")
                Adv.core.exec.nextOrder();
        });

        this.parent.sprites[name] = videoSprite;

        var blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.blur = parseFloat(pm.blur);

        videoSprite.filters = [blurFilter];
        videoSprite.alpha = 0;

        videoSprite.texture.baseTexture.source.loop = JSON.parse(pm.loop);

        Adv.core.stat.videoSkip = JSON.parse(pm.skip);

        if (JSON.parse(pm.auto)) {
            videoSprite.texture.baseTexture.source.play();
        }

        else {
            videoSprite.texture.baseTexture.source.pause();
        }

        if (pm.play_laterTime !== "0") {
            setTimeout(() => {
                videoSprite.texture.baseTexture.source.play();
            }, parseInt(pm.play_laterTime));
        }

        if (pm.time === "0") {
            if (pm.laterTime === "0")
                videoSprite.alpha = 1;
            else {
                setTimeout(() => {
                    videoSprite.alpha = 1;
                }, parseInt(pm.laterTime));
            }
        }

        else {
            if (pm.laterTime === "0") {
                var property = {
                    alpha: 0,
                };

                anime({
                    targets: property,
                    alpha: parseInt(pm.alpha) / 100,
                    easing: 'easeInSine',
                    duration: parseInt(pm.time),
                    update: function () {
                        if (videoSprite)
                            videoSprite.alpha = property.alpha;
                    },
                    complete: function () {
                        if (videoSprite)
                            videoSprite.alpha = property.alpha;
                    }
                });
            }

            else {
                setTimeout(() => {

                    var property = {
                        alpha: 0,
                    };

                    anime({
                        targets: property,
                        alpha: parseInt(pm.alpha) / 100,
                        easing: 'easeInSine',
                        duration: parseInt(pm.time),
                        update: function () {
                            if (videoSprite)
                                videoSprite.alpha = property.alpha;
                        },
                        complete: function () {
                            if (videoSprite)
                                videoSprite.alpha = property.alpha;
                        }
                    });
                }, parseInt(pm.laterTime));
            }

        }

        if (pm.wait === "false")
            Adv.core.exec.nextOrder();
    }
};

AdvTag.plugin.tag.effects_stop = {
    vital: ["effect", "label"],
    pm: {
        effect: "",
        time: "1000",
        wait: "false"
    },
    start: function (pm) {

        Adv.core.effects_stop[pm.label] = true;
        var effect = Adv.core.effects[pm.label].parent;

        var property = {
            alpha: effect.alpha
        };

        anime({
            targets: property,
            alpha: 0,
            easing: 'easeInSine',
            duration: parseInt(pm.time),
            update: function () {
                if (effect)
                    effect.alpha = property.alpha;
            },
            complete: function () {
                if (effect)
                    effect.alpha = property.alpha;

                Adv.core.effects_stop[pm.label] = null;
                delete Adv.core.effects_stop[pm.label];

                Adv.core.effects[pm.label].Destroy();
                Adv.core.effects[pm.label] = null;
                delete Adv.core.effects[pm.label];

                if (pm.wait == "true")
                    Adv.core.exec.nextOrder();
            }
        });

        if (pm.wait == "true")
            Adv.core.exec.nextOrder();
    }
};

AdvTag.plugin.tag.effects = {
    vital: ["effect", "label"],
    pm: {
        label: "",
        effect: "",
        time: "1000",
        wait: "false",
        color: "0xffffff",
        alpha: "100",
    },
    start: function (pm) {
        var effect = null;

        switch (pm.effect) {
            case "sakura":
                effect = new Blossoms(this.parent.CharaImgMgr.getTexture("sakura"), function () { console.log("test") });

                for (var i = 0; i < effect.m_img.length; i++) {
                    effect.m_img[i].tint = parseInt(pm.color);
                    effect.m_img[i].alpha = parseInt(pm.alpha) / 100;
                }
                break;

            case "snow":
                effect = new Snow(function () { console.log("test") });

                for (var i = 0; i < effect.m_img.length; i++) {
                    effect.m_img[i].tint = parseInt(pm.color);
                    effect.m_img[i].alpha = parseInt(pm.alpha) / 100;
                }
                break;

            case "rain":
                effect = new Rain(function () { console.log("test") });
                effect.color = parseInt(pm.color);
                effect.alpha = (parseInt(pm.alpha) / 100);
                break;
        }



        this.parent.root.contain.addChild(effect.parent, "Chara");
        Adv.core.effects[pm.label] = effect;
        Adv.core.effects_stop[pm.label] = false;
        effect.parent.alpha = 0;

        var property = {
            alpha: 0,
        };

        if (pm.time === "0") {
            effect.parent.alpha = 1;
            Adv.core.exec.nextOrder();
        }

        else {
            anime({
                targets: property,
                alpha: 1,
                easing: 'easeInSine',
                duration: parseInt(pm.time),
                update: function () {
                    if (Adv.core.effects_stop[pm.label])
                        return;

                    if (effect.parent)
                        effect.parent.alpha = property.alpha;
                },
                complete: function () {
                    if (Adv.core.effects_stop[pm.label]) {
                        if (pm.wait === "true")
                            Adv.core.exec.nextOrder();

                        return;
                    }

                    if (effect.parent)
                        effect.parent.alpha = property.alpha;

                    if (pm.wait === "true")
                        Adv.core.exec.nextOrder();
                }
            });

            if (pm.wait === "false")
                Adv.core.exec.nextOrder();
        }
    }
};

AdvTag.plugin.tag.text_show = {
    vital: ["text"],
    pm: {
        text: "",
        time: "1000",
        wait: "false",
        posX: "0",
        posY: "0",
        size: "50",
        strokeThickness: "5",
        stroke: "0xffffff",
        fill: "0x000000",
        alpha: "100",
    },
    start: function (pm) {
        var message = pm.text.replace(/\\n/g, "\n");
        var messages = [];
        var temp = message.split("\n");
        for(var i=0; i<temp.length;i++)
        {
            if(temp[i].length !== 0)
                messages.push(temp[i]);
        }

        var size = parseInt(pm.size);
        var texts = [];

        var parent = new PIXI.Sprite(null);
        parent.anchor.x = 0.5;
        parent.anchor.y = 0.5;
        var padding = size * 0.15;

        for (var i = 0; i < messages.length; i++) {
            texts[i] = [];

            height = Math.max(height, messages[i].length);
            for (var j = 0; j < messages[i].length; j++) {
                texts[i][j] = new PIXI.Text(messages[i][j], {
                    strokeThickness: parseFloat(pm.strokeThickness),
                    stroke: parseInt(pm.stroke),
                    fontSize: size,
                    fill: parseInt(pm.fill),
                    fontFamily: "Yu Mincho"
                });

                texts[i][j].anchor.x = 0.5;
                texts[i][j].anchor.y = 0.5;
                texts[i][j].position.x = -(i * size) - (padding * i);
                texts[i][j].position.y = j * size;

                parent.addChild(texts[i][j]);

                if (messages[i][j] === "。" || messages[i][j] === "、") {
                    texts[i][j].anchor.set(0, 1)
                }
                
                else if(Adv.core.regexp.indexOf(messages[i][j]) !== -1)
                {
                    texts[i][j].rotation = 90 * (Math.PI / 180);
                }
            }
        }

        var width = Math.abs(texts[texts.length-1][texts[texts.length-1].length-1].position.x) + texts[0][0].width;
        var height = Math.abs(texts[texts.length-1][texts[texts.length-1].length-1].position.y) + texts[0][0].height;
        
        for (var i = 0; i < messages.length; i++) {
            for (var j = 0; j < messages[i].length; j++) {
                texts[i][j].position.x += (width / 2) - (texts[0][0].width/2);
                texts[i][j].position.y -= (height / 2) - (texts[0][0].height/2);
            }
        }
        

        var paddingX = 10;
        var paddingY = 10;
        var rect = drawRectPath(width, height, paddingX, paddingY, 0,0,120);
        rect.sprite.position.set( parseInt(pm.posX), parseInt(pm.posY));
        rect.sprite.alpha = 0;
        this.parent.root.contain.addChild(rect.sprite, "fader");
        rect.sprite.addChild(parent);

        var blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.blur = 0;
        
        rect.sprite.filters = [blurFilter];

        var sha = new jsSHA("SHA-256", "TEXT");
        sha.update(pm.text);

        var key = sha.getHash("B64");
        Adv.core.texts[key] = rect.sprite;

        parent.position.x = rect.offset.x;
        parent.position.y = rect.offset.y;

        var property = {
            alpha: 0,
        };

        if(pm.alpha !== "0" && pm.time !== "0")
        {
            anime({
                targets: property,
                alpha: parseInt(pm.alpha) / 100,
                easing: 'easeInSine',
                duration: parseInt(pm.time),
                update: function () {
                    if (rect.sprite)
                        rect.sprite.alpha = property.alpha;
                },
                complete: function () {
                    if (rect.sprite)
                        rect.sprite.alpha = property.alpha;
    
                    if (pm.wait === "true")
                        Adv.core.exec.nextOrder();
                }
            });

            if (pm.wait === "false")
                Adv.core.exec.nextOrder();
        }
        
        else
        {
            Adv.core.texts[key].alpha = parseFloat(pm.alpha) / 100;
            Adv.core.exec.nextOrder();
        }
    }
};

AdvTag.plugin.tag.text_move = {
    vital: ["text"],
    pm: {
        text: "",
        name: "",
        time: "600",
        anim: "false",
        left: "",
        top: "",
        width: "",
        height: "",
        effect: "",
        scale: "大",
        wait: "true",
        anchorX: "default",
        anchorY: "default",
        posX: "0",
        posY: "0",
        scale: "default",
        opacity: "default",
        rotate: "default",
        quakeX: "0",
        quakeY: "0",
        quakeT: "300",
        blur: "default",
        zindex: "default",
        again: "1",
        random: "false",
        fill: "default",
        stroke: "default"
    },
    start: function (pm) {
        var sha = new jsSHA("SHA-256", "TEXT");
        sha.update(pm.text);
        
        var key = sha.getHash("B64");
        pm.name = key;
        if(Adv.core.texts[key] === undefined){
            alert(pm.text + "は生成されていないテキストです。");
            return;
        }

        if (pm.anchorX !== "default") {
            this.parent.texts[pm.name].anchor.x = parseFloat(pm.anchorX);
        }

        if (pm.anchorY !== "default") {
            this.parent.texts[pm.name].anchor.y = parseFloat(pm.anchorY);
        }

        if (pm.scale === "default") {
            pm.scale = this.parent.texts[pm.name].scale.x * 100;
        }

        else {
            pm.scale = parseFloat(pm.scale) / 100;
        }

        if (pm.opacity === "default") {
            pm.opacity = this.parent.texts[pm.name].alpha;
        }

        else {
            pm.opacity = parseFloat(pm.opacity) / 100;
        }

        if (pm.rotate === "default") {
            pm.rotate = this.parent.texts[pm.name].rotation * (180 / Math.PI);
        }

        else {
            var rot = parseFloat(pm.rotate);
            if (rot < 0) {
                if (Math.abs(rot) === 360) {
                    rot = -360;
                }
            }

            pm.rotate = rot;
        }

        if (pm.blur === "default") {
            pm.blur = this.parent.texts[pm.name].filters[0].blur;
        }

        else {
            pm.blur = parseFloat(pm.blur);
        }

        var property = {
            x: this.parent.texts[pm.name].position.x,
            y: this.parent.texts[pm.name].position.y,
            scale: this.parent.texts[pm.name].scale.x,
            alpha: this.parent.texts[pm.name].alpha,
            rotation: this.parent.texts[pm.name].rotation * (180 / Math.PI),
            blur: this.parent.texts[pm.name].filters[0].blur,
            fill: Adv.core.texts[pm.name].children[0].children[0].style.fill.replace("0x", "#"),
            stroke: Adv.core.texts[pm.name].children[0].children[0].style.stroke.replace("0x", "#")
        };

        var again = 0;
        var that = this;

        var option_anime = {
            x: parseInt(pm.posX) + that.parent.texts[pm.name].position.x,
            y: parseInt(pm.posY) + that.parent.texts[pm.name].position.y,
            scale: parseFloat(pm.scale),
            alpha: parseFloat(pm.opacity),
            rotation: parseInt(pm.rotate),
            blur: parseFloat(pm.blur),
            fill: pm.fill.replace("0x", "#"),
            stroke: pm.stroke.replace("0x", "#")
        };

        var easingNames = [
            'easeInQuad',
            'easeInCubic',
            'easeInQuart',
            'easeInQuint',
            'easeInSine',
            'easeInExpo',
            'easeInCirc',
            'easeInBack',
            'easeInBounce',
            'easeInOutQuad',
            'easeInOutCubic',
            'easeInOutQuart',
            'easeInOutQuint',
            'easeInOutSine',
            'easeInOutExpo',
            'easeInOutCirc',
            'easeInOutBack',
            'easeInOutBounce',
            'easeOutQuad',
            'easeOutCubic',
            'easeOutQuart',
            'easeOutQuint',
            'easeOutSine',
            'easeOutExpo',
            'easeOutCirc',
            'easeOutBack',
            'easeOutBounce'
        ];

        var max = easingNames.length;
        var min = 0;

        min = Math.ceil(min);
        max = Math.floor(max);

        var idx = Math.floor(Math.random() * (max - min)) + min;
        var easing = JSON.parse(pm.random) ? easingNames[idx] : "easeInSine";
        var loop = parseInt(pm.again);
        loop = loop === 1 ? false : loop;

        if (pm.time === "0") {
            Adv.core.texts[pm.name].position.x = option_anime.x;
            Adv.core.texts[pm.name].position.y = option_anime.y;
            Adv.core.texts[pm.name].alpha = option_anime.alpha;
            Adv.core.texts[pm.name].scale.set(option_anime.scale, option_anime.scale);
            Adv.core.texts[pm.name].rotation = option_anime.rotation * (Math.PI / 180);
            Adv.core.texts[pm.name].filters[0].blur = option_anime.blur;

            var length = Adv.core.texts[pm.name].children[0].children.length;
            for(var i=0; i<length; i++)
            {
                Adv.core.texts[pm.name].children[0].children[i].style.fill = option_anime.fill;
                Adv.core.texts[pm.name].children[0].children[i].style.stroke = option_anime.stroke;
            }
            
            this.parent.exec.nextOrder();
            return;
        }

        else {
            anime({
                targets: property,
                x: parseInt(pm.posX) + that.parent.texts[pm.name].position.x,
                y: parseInt(pm.posY) + that.parent.texts[pm.name].position.y,
                scale: parseFloat(pm.scale),
                alpha: parseFloat(pm.opacity),
                rotation: parseInt(pm.rotate),
                blur: parseFloat(pm.blur),
                fill: pm.fill.replace("0x", "#"),
                stroke: pm.stroke.replace("0x", "#"),
                easing: 'easeInSine',
                loop: loop,
                direction: 'alternate',
                duration: parseInt(pm.time),
                update: function (e) {
                    if (Adv.core.texts[pm.name]) {
                        Adv.core.texts[pm.name].position.x = property.x;
                        Adv.core.texts[pm.name].position.y = property.y;
                        Adv.core.texts[pm.name].alpha = property.alpha;
                        Adv.core.texts[pm.name].scale.set(property.scale, property.scale);
                        Adv.core.texts[pm.name].rotation = property.rotation * (Math.PI / 180);
                        Adv.core.texts[pm.name].filters[0].blur = property.blur;

                        var fill = property.fill.replace("rgba(", "");
                        fill = fill.replace(")", "")
                        fill = fill.split(",");

                        var stroke = property.stroke.replace("rgba(", "");
                        stroke = stroke.replace(")", "")
                        stroke = stroke.split(",");

                        var length = Adv.core.texts[pm.name].children[0].children.length;
                        for(var i=0; i<length; i++)
                        {
                            
                            var f_red = Number(fill[0]).toString(16);
                            if(f_red.length === 1)
                            {
                                f_red = "0" + f_red;
                            }

                            var f_green = Number(fill[1]).toString(16);
                            if(f_green.length === 1)
                            {
                                f_green = "0" + f_green;
                            }

                            var f_blue = Number(fill[2]).toString(16);
                            if(f_blue.length === 1)
                            {
                                f_blue = "0" + f_blue;
                            }

                            var s_red = Number(stroke[0]).toString(16);
                            if(s_red.length === 1)
                            {
                                s_red = "0" + s_red;
                            }

                            var s_green = Number(stroke[1]).toString(16);
                            if(s_green.length === 1)
                            {
                                s_green = "0" + s_green;
                            }

                            var s_blue = Number(stroke[2]).toString(16);
                            if(s_blue.length === 1)
                            {
                                s_blue = "0" + s_blue;
                            }

                            Adv.core.texts[pm.name].children[0].children[i].style.fill = "#" + f_red + f_green + f_blue;
                            Adv.core.texts[pm.name].children[0].children[i].style.stroke = "#" + s_red + s_green + s_blue;
                        }
                    }
                },

                complete: function (e) {
                    if (pm.wait === "true")
                        Adv.core.exec.nextOrder();
                }
            });
        }

        if (pm.wait === "false") this.parent.exec.nextOrder();
    }
};

AdvTag.plugin.tag.text_hide = {
    vital: ["text"],
    pm: {
        text: "",
        wait: "false",
        time: "1000"
    },
    start: function (pm) {
        var sha = new jsSHA("SHA-256", "TEXT");
        sha.update(pm.text);
        
        var key = sha.getHash("B64");
        
        if(Adv.core.texts[key])
        {
            if(pm.time === "0")
            {
                Adv.core.texts[key].alpha = 0;
                Adv.core.texts[key].destroy();
                Adv.core.texts[key] = null;
                delete Adv.core.texts[key];

                Adv.core.exec.nextOrder();
            }

            else
            {
                var property = {
                    alpha: Adv.core.texts[key].alpha,
                };
    
                anime({
                    targets: property,
                    alpha: 0,
                    easing: 'easeInSine',
                    duration: parseInt(pm.time),
                    update: function () {
                        Adv.core.texts[key].alpha = property.alpha;
                    },
                    complete: function () {
                        Adv.core.texts[key].alpha = property.alpha;
        
                        Adv.core.texts[key].destroy();
                        Adv.core.texts[key] = null;
                        delete Adv.core.texts[key];

                        if (pm.wait === "true")
                            Adv.core.exec.nextOrder();
                    }
                });
        
                if (pm.wait === "false")
                    Adv.core.exec.nextOrder();
            }
        }

        else
        {
            Adv.core.exec.nextOrder();
        }
    }
};

AdvTag.plugin.tag.test = {
    vital: ["name"],
    pm: {
        name: "",
        package: "",
    },
    start: function (pm) {
        var alias = pm.package.substr(pm.package.lastIndexOf("/") + 1);

        this.parent.animations[pm.name] = {
            mouthT: 0,
            eyeT: 0,
            mouthIdx: 0,
            eyeIdx: 0,
            casecade: false,
            interval: 3,
            intervalCt: 0,
            eye: null,
            mouth: null,
            eyeTime: [1, 0.1, 0.1],
            eTexture: [this.parent.CharaImgMgr.getTexture(alias + "_" + "eye01"), this.parent.CharaImgMgr.getTexture(alias + "_" + "eye02"), this.parent.CharaImgMgr.getTexture(alias + "_" + "eye03")],
            mTexture: [this.parent.CharaImgMgr.getTexture(alias + "_" + "mou01"), this.parent.CharaImgMgr.getTexture(alias + "_" + "mou02"), this.parent.CharaImgMgr.getTexture(alias + "_" + "mou03")]
        };

        var parent = new PIXI.Sprite();
        var chara = new PIXI.Sprite(this.parent.CharaImgMgr.getTexture(alias + "_" + "chara"));
        var eye = new PIXI.Sprite(this.parent.animations[pm.name].eTexture[0]);
        var mouth = new PIXI.Sprite(this.parent.animations[pm.name].mTexture[0]);

        this.parent.animations[pm.name].eye = eye;
        this.parent.animations[pm.name].mouth = mouth;

        parent.anchor.set(0.5, 0.5);
        chara.anchor.set(0.5, 0.5);
        eye.anchor.set(0.5, 0.5);
        mouth.anchor.set(0.5, 0.5);

        parent.position.set(this.parent.root.app.screen.width / 2, this.parent.root.app.screen.height / 2)

        parent.addChild(chara);
        parent.addChild(eye);
        parent.addChild(mouth);
        this.parent.root.contain.addChild(parent, "Chara");

        this.parent.sprites[pm.name] = parent;
    }
};

function Rect(size, rot, parent)
{
    var rect = {
        w: 147,
        h: 232
    };

    var width = size.w + 20;
    var height = size.h + 20;

    var rotate = rot;

    var hukidasi = {
        w: 20,
        h: 50
    };
    
    var _path = [];
    
    switch (rotate) {
        case 135:
            var start = hukidasi.w / 2;
            _path.push(0, height);
            _path.push(0, start);
            _path.push(-hukidasi.h / 2, -hukidasi.h / 2);
            _path.push(start, 0);
            _path.push(width, 0);
            _path.push(width, height);
            _path.push(0, height);
            break;
    
        case 45:
            var start = hukidasi.w / 2;
            _path.push(0, 0);
            _path.push(width - start, 0);
            _path.push(width + (hukidasi.h / 2), -hukidasi.h / 2);
            _path.push(width, start);
            _path.push(width, height);
            _path.push(0, height);
            break;
    
        case 315:
            var start = hukidasi.w / 2;
            _path.push(width, 0);
            _path.push(width, height - start);
            _path.push(width + (hukidasi.h / 2), height + hukidasi.h / 2);
            _path.push(width - start, height);
            _path.push(0, height);
            _path.push(0, 0);
            break;
    
        case 225:
            var start = hukidasi.w / 2;
            _path.push(width, height);
            _path.push(start, height);
            _path.push(-hukidasi.h / 2, height + hukidasi.h / 2);
            _path.push(0, height - start);
            _path.push(0, 0);
            _path.push(width, 0);
            break;
    
        default:
            // 上
            if (rotate <= 135 && rotate > 45) {
                parent.position.x = size.w - 5;
                parent.position.y = hukidasi.h + 5;

                var _rot = 135 - rotate;
                var max = 90;
    
                var start = (width * (_rot / max)) - (hukidasi.w / 2);
                if (start < 0) {
                    start = 0;
                }
    
                else if (start + hukidasi.w > width) {
                    start = width - hukidasi.w;
                }
    
                _path.push(0, 0);
    
                if (start !== 0)
                    _path.push(start, 0);
    
                _path.push(start + (hukidasi.w / 2), -hukidasi.h);
                _path.push(start + hukidasi.w, 0);
                _path.push(width, 0);
                _path.push(width, height);
                _path.push(0, height);
                _path.push(0, 0);
            }
    
            // 右
            else if (45 >= rotate || 315 <= rotate) {
                parent.position.x = size.w - 5;
                parent.position.y = 5;
                var _rot = rotate > 45 ? (360 - rotate) + 45 : 45 - rotate;
                var max = 90;
    
                var start = (height * (_rot / max)) - (hukidasi.w / 2);
                if (start < 0) {
                    start = 0;
                }
    
                else if (start + hukidasi.h > height) {
                    start = height - hukidasi.w;
                }
                _path.push(width, 0);
    
                if (start !== 0)
                    _path.push(width, start);
    
                _path.push(width + hukidasi.h, start + (hukidasi.w / 2));
                _path.push(width, start + (hukidasi.w));
                _path.push(width, height);
                _path.push(0, height);
                _path.push(0, 0);
                _path.push(width, 0);
            }
    
            // 下
            else if (rotate >= 225 && 315 >= rotate) {
                parent.position.y = 5;
                var _rot = rotate - 225;
                var max = 90;
    
                var start = (width * (_rot / max)) + (hukidasi.w / 2);
                _path.push(width, height);
                _path.push(start, height);
                _path.push(start - (hukidasi.w / 2), height + hukidasi.h);
                _path.push(start - (hukidasi.w), height);
                _path.push(0, height);
                _path.push(0, 0);
                _path.push(width, 0);
                _path.push(width, height);
            }
    
            // 左
            else if (rotate <= 225 && 135 <= rotate) {
                parent.position.y = 5;
                parent.position.x = size.w + hukidasi.w;

                var _rot = rotate - 135;
                var max = 90;
    
                var start = (height * (_rot / max)) + (hukidasi.w / 2);
                if (start - hukidasi.w < 0) {
                    start = hukidasi.w;
                }
    
                else if (start + hukidasi.w > height) {
                    start = height
                }
    
                _path.push(0, height);
    
                if (start !== height)
                    _path.push(0, start);
    
                _path.push(0 - hukidasi.h, start - (hukidasi.w / 2));
                _path.push(0, start - (hukidasi.w));
                _path.push(0, 0);
                _path.push(width, 0);
                _path.push(width, height);
                _path.push(0, height);
            }
            break;
    }
    
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 0x000000, 1);
    graphics.beginFill(0xffffff);
    graphics.drawPolygon(_path);
    graphics.endFill();
    
    var sprite = new PIXI.Sprite(this.parent.root.app.renderer.generateTexture(graphics));    
    sprite.addChild(parent);

    sprite.interactive = true;
    sprite.buttonMode = true;
    return sprite;
}




var Xy = function (_x, _y) {
    this.x = _x;
    this.y = _y;
};
/**
 * another から this へコピー
 */
Xy.prototype.assign$ = function (another) {
    this.x = another.x;
    this.y = another.y;
};

/**
 * another との距離
 */
Xy.prototype.distanceTo = function (another) {
    var dx = this.x - another.x;
    var dy = this.y - another.y;
    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * このオブジェクトが長方形のサイズを表すものとして、対角線の長さ
 */
Xy.prototype.diagonal = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

/**
 * 符号反転
 */
Xy.prototype.negate = function () {
    return new Xy(-this.x, -this.y);
};

/**
 * 継ぎ足し
 * 次の形式のどちらでもok
 *  var resultA = p1.add(10, 12);  // 形式1 / 数字を入力
 *  var resultB = p2.add(p3); // 形式2 / bn2dオブジェクトを入力
 */
Xy.prototype.add = function (a1, a2) {
    if (typeof a1 === typeof this) {
        a2 = a1.y;
        a1 = a1.x;
    }

    return new Xy(this.x + a1, this.y + a2);
};

/**
 * 拡大縮小
 */
Xy.prototype.scale = function (sx, sy) {
    if (arguments.length == 1) {
        sy = sx;
    }
    return new Xy(this.x * sx, this.y * sy);
};
// Xy ここまで


/**
 * w, h の長方形に外接する楕円のデータ．
 * 焦点は長方形の左右の辺上にあるものとする．
 *
 *   this.ps_[0] => 最初の点の座標
 *   this.ps_[1] => 次の点
 *     :
 *   this.ps_[bnEllipse.RESOLUTION - 1] => 最後の点
 *
 *   this.ds_[0] => 最後の点から最初の点への距離をあらかじめ測っておく
 *   this.ds_[1] => 最初の点から次の点への距離
 *     :
 *   this.ds_[bn.Ellipse.RESOLUTION - 1]
 */
var OuterEllipse = function (w, h) {
    this.inner_ = new Xy(w, h); // テキストを入れたい箱の大きさ
    this.ps_ = [];
    this.ds_ = [];
    this.L_ = 0;
};

// 楕円データを作る際に，1周をどんだけ細かくするか
// static
OuterEllipse.RESOLUTION = 180;

// ps_ や ds_ を作り上げる
OuterEllipse.prototype.requireData_ = function () {
    if (this.ps_.length) {
        return this.ps_;
    }

    var halfbox = this.inner_.scale(1.0, 0.5); // 半分の高さ
    var quadbox = this.inner_.scale(0.5, 0.5); // タテヨコとも半分にしたもの
    //var a = (halfbox.diagonal() + halfbox.y) / 2;
    //var b = Math.sqrt(a * a - quadbox.x * quadbox.x);
    var a = this.inner_.x;
    var b = this.inner_.y;
    // ここで a => 楕円の長軸，b => 楕円の短軸 が求まった

    var prev_p = new Xy(a, 0);

    var round = Math.PI * 2;
    var step = round / OuterEllipse.RESOLUTION;
    for (var deg = 0; deg < round; deg += step) {
        var x = a * Math.cos(deg);
        var y = -b * Math.sin(deg);

        var p = new Xy(x, y);
        this.ps_.push(p);

        var d = prev_p.distanceTo(p);
        this.ds_.push(d);
        this.L_ += d;

        prev_p = p;
    }

    // 最後に，ゴール地点からスタート地点までの距離を測って ds_[0] に上書き
    var d = prev_p.distanceTo(this.ps_[0]);
    this.ds_[0] = d;
    this.L_ += d;

    return this.ps_;
};

// アイテムの個数
OuterEllipse.prototype.count = function () {
    return this.requireData_().length;
};

// bn2dオブジェクトを得る
OuterEllipse.prototype.at = function (p) {
    return (this.requireData_())[p];
};

// 点pと，その一つ前の点との距離
OuterEllipse.prototype.delta = function (p) {
    this.requireData_();
    return this.ds_[p];
};

// 外周の長さ
OuterEllipse.prototype.L = function () {
    this.requireData_();
    return this.L_;
};

/**
 * @param cxt  obj of canvas.getContext('2d')
 * @param ox   left boundary of text box
 * @param oy   top boundary of text box
 * @param w    width of text box
 * @param h    height of text box
 *  -- optional --
 * @param spikes  spikes count. 4 ~ 20 is good.
 * @param depth   spike depth.  -1.0 ~ 1.0 is nice.
 * @param rot     rotation ...   0 ~ 359.
 * @param hige    arrow length.  0.5 is pretty cool.
 */

var drawRectPath = function(w, h, paddingX, paddingY, spikes, depth, rot, hige)
{
    var cxt = new PIXI.Graphics();

    //graphics.lineStyle(2, 0x000000, 1);
    cxt.beginFill(0xffffff);

    if (!spikes) spikes = 1;
    if (!depth) depth = 0;
    if (!rot) rot = 0;
    if (!hige) hige = 0;

    rot %= 360;
    rot /= (360 / OuterEllipse.RESOLUTION);
    rot = Math.floor(rot);

    var cx = 0;
    var cy = 0;

    var tempW = w;
    var tempH = h;

    w += paddingX;
    h += paddingY;

    var alt_dep = 1 + Math.abs(depth);
    var data = (depth > 0)
        ? new OuterEllipse(w, h, rot)
        : new OuterEllipse(w * alt_dep, h * alt_dep, rot);

    var t = 0;
    var t2 = 0;
    var step = data.L() / spikes;
    var count = 0;

    var start = rot;
    var i = start;
    var prev_i = i;
    var last = data.count() + rot;
    var offset = {x: 0, y: 0};

    rot *= 2;

    data.ps_ = [];

    switch(rot)
    {
        case 45:

        break;

        case 135:

        break;

        case 225:

        break;

        case 315:

        break;

        default :
            var per = 0;
            var direct = "";

            if(rot > 315 || rot < 45)
            {
                direct = "right";
                per = ((360 - (rot - 45)) % 90) / 90;
            }

            else
            {
                per = ((rot - 45) % 90) / 90;

                if(rot > 45 && rot < 135)
                    direct = "top";
                else if(rot > 135 && rot < 225)
                    direct = "left";
                else if(rot > 225 && rot < 315)
                    direct = "bottom";
            }

            switch(direct)
            {
                case "left":
                    var r = 10;
                    //var stop = h - ((h * per) - r);
                    var stop = ((h * per) + r);

                    var size = 80;
                    var x1 = 0;
                    var y1 = stop - r;
                    var d = r * 2;
                    var a = rot;
                    
                    data.ps_.push(new Xy(0, h));
                    data.ps_.push(new Xy(0, stop));
                    data.ps_.push(new Xy(x1 + (size * Math.cos( a * (Math.PI / 180) )), y1 - (r * Math.sin( a * (Math.PI / 180) ) )));
                    data.ps_.push(new Xy(0, stop - r - r));
                    data.ps_.push(new Xy(0, 0));
                    data.ps_.push(new Xy(w, 0));
                    data.ps_.push(new Xy(w, h));
                    data.ps_.push(new Xy(0, h));
                    
                    start = 2;

                    last = data.ps_.length;
                    
                    /*
                    cxt.lineTo(0, h);
                    cxt.lineTo(0, stop);
                    cxt.quadraticCurveTo(x1 + (size * Math.cos( a * (Math.PI / 180) )), y1 - (r * Math.sin( a * (Math.PI / 180) ) ), 0, stop - r - r);
                    cxt.lineTo(0, 0);
                    cxt.lineTo(w, 0);
                    cxt.lineTo(w, h);
                    cxt.lineTo(0, h);
                    cxt.endFill();
                    return {
                        sprite: new PIXI.Sprite(this.parent.root.app.renderer.generateTexture(cxt))
                    }*/
                break;

                case "right":
                    var r = 10;
                    var stop = (h * per) - r;

                    var size = 80;
                    var x1 = w;
                    var y1 = stop + r;
                    var d = r * 2;
                    var a = rot;

                    data.ps_.push(new Xy(w, 0));
                    data.ps_.push(new Xy(w, stop));
                    data.ps_.push(new Xy(x1 + (size * Math.cos( a * (Math.PI / 180) )), y1 - (r * Math.sin( a * (Math.PI / 180) ) )));
                    data.ps_.push(new Xy(w, stop + r + r));
                    data.ps_.push(new Xy(w, h));
                    data.ps_.push(new Xy(0, h));
                    data.ps_.push(new Xy(0, 0));
                    start = 2;

                    last = data.ps_.length;
                break;

                case "top":
                    8/*
                    var r = 10;
                    var stop = (w * per) - r;

                    var size = 80;
                    var x1 = stop + r;
                    var y1 = 0;
                    var d = r * 2;
                    var a = rot;

                    data.ps_.push(new Xy(0, 0));
                    data.ps_.push(new Xy(stop, 0));
                    data.ps_.push(new Xy(x1 + (r * Math.cos( a * (Math.PI / 180) )), y1 - (size * Math.sin( a * (Math.PI / 180) ) )));
                    data.ps_.push(new Xy(stop + r + r, 0));
                    data.ps_.push(new Xy(w, 0));
                    data.ps_.push(new Xy(w, h));
                    data.ps_.push(new Xy(0, h));
                    data.ps_.push(new Xy(0, 0));
                    start = 2;

                    last = data.ps_.length;
                    */
                    var r = 5;
                    var size = 80;
                    var x1 = w/2;
                    var y1 = h/2;
                    var d = r * 2;
                    var a = rot;
                    var stop = x1 + (x1 * Math.cos( a * (Math.PI / 180) )) - r;
                    var y = (y1 * Math.cos( a * (Math.PI / 180) )) / 2 + r;

                    data.ps_.push(new Xy(0, 0));
                    data.ps_.push(new Xy(stop, 0));
                    data.ps_.push(new Xy(x1 + ((x1 + size) * Math.cos( a * (Math.PI / 180) )), y1 - ((y1 + y + size ) * Math.sin( a * (Math.PI / 180) ) )));
                    data.ps_.push(new Xy(stop + r + r, 0));
                    data.ps_.push(new Xy(w, 0));
                    data.ps_.push(new Xy(w, h));
                    data.ps_.push(new Xy(0, h));
                    data.ps_.push(new Xy(0, 0));

                    start = 2;

                    last = data.ps_.length;
                break;

                case "bottom":
                    var r = 5;
                    var size = 40;
                    var x1 = w/2;
                    var y1 = h/2;
                    var d = r * 2;
                    var a = rot;
                    var stop = x1 + (x1 * Math.cos( a * (Math.PI / 180) )) + r;
                    var y = (y1 * Math.cos( a * (Math.PI / 180) )) / 2 + r;

                    data.ps_.push(new Xy(w, h));
                    data.ps_.push(new Xy(stop, h));
                    data.ps_.push(new Xy(x1 + ((x1 + size) * Math.cos( a * (Math.PI / 180) )), y1 - ((y1 + y + size ) * Math.sin( a * (Math.PI / 180) ) )));
                    data.ps_.push(new Xy(stop - r - r, h));
                    data.ps_.push(new Xy(0, h));
                    data.ps_.push(new Xy(0, 0));
                    data.ps_.push(new Xy(w, 0));

                    start = 2;

                    last = data.ps_.length;
                break;
            }
        break;
    }

    i = 0;

    while (i <= last) {

        var n = i % data.count();
        var p = data.at(n);
        var d = data.delta(n);

        t += d;
        t2 += d;

        if (i == start) {
            // ふきだしにヒゲや o o o をつける？
            /*
            if (typeof hige == 'string') {
                // o o o をつける
                var p1 = p.scale(1.2);
                var rad = h / 10;
                for (var k = 0; k < hige.length; k++) {
                    cxt.moveTo(cx + p1.x + rad, cy + p1.y); // subpathをここにやらないとへんな線が...
                    cxt.arc(cx + p1.x, cy + p1.y, rad, 0, Math.PI * 2, false);
                    rad /= 2;
                    p1 = p1.scale(1.2);
                }

                cxt.moveTo(cx + p.x, cy + p.y);

            } else if (hige) {
                // 数値ならヒゲをつける
                //var p1 = data.at((start + 2) % data.count());
                //var d = p.scale(1 + hige);

                //cxt.moveTo(cx + p.x, cy + p.y);
                var p1 = data.at(n+1);
                cxt.quadraticCurveTo(
                    p.x, p.y,
                    p1.x, p1.y);
                i += 2;

            } else {
                cxt.moveTo(cx + p.x, cy + p.y);
            }
            */

            var p1 = data.at(n+1);
            cxt.quadraticCurveTo(
                p.x, p.y,
                p1.x, p1.y);
            i += 1;

            prev_i = i;

        } else if (depth == 0) {
            // spike の深さが 0 なら，綺麗な楕円を描くだけ
            cxt.lineTo(cx + p.x, cy + p.y);

        }

        i++;
    }

    cxt.endFill();

    //var sprite = new PIXI.Sprite(this.parent.root.app.renderer.generateTexture(cxt));
    var sprite = new PIXI.Sprite(null);

    switch(direct)
    {
        case "left":
            var tail = (sprite.width - w);
            var body = sprite.width - tail;

            offset.x = tail + (body/2);
            //offset.y = 0;
            offset.y = h / 2;
        break;

        case "right":
            var tail = (sprite.width - w);
            var body = sprite.width - tail;

            offset.x = (body/2);
            //offset.y = 0;
            offset.y = h / 2;
        break;

        case "top":
            var tail = (sprite.height- h);
            var body = sprite.height - tail;

            offset.x = w / 2;
            offset.y = (body / 2) + tail;
        break;

        case "bottom":
            var tail = (sprite.height - h);
            var body = sprite.height - tail;

            offset.x = w/2;
            offset.y = body/2;
        break;

        default:

        break;
    }
    return {
        sprite: sprite,
        offset: {
            x: 0,
            y: 0
        }
    }
};

var drawBalloonPath = function (w, h, spikes, depth, rot, hige) {
    var cxt = new PIXI.Graphics();

    //graphics.lineStyle(2, 0x000000, 1);
    cxt.beginFill(0xffffff);

    if (!spikes) spikes = 1;
    if (!depth) depth = 0;
    if (!rot) rot = 0;
    if (!hige) hige = 0;

    rot %= 360;
    rot /= (360 / OuterEllipse.RESOLUTION);
    rot = Math.floor(rot);

    var cx = w / 2;
    var cy = h / 2;

    var alt_dep = 1 + Math.abs(depth);
    var data = (depth > 0)
        ? new OuterEllipse(w, h, rot)
        : new OuterEllipse(w * alt_dep, h * alt_dep, rot);

    var t = 0;
    var t2 = 0;
    var step = data.L() / spikes;
    var count = 0;

    var start = rot;
    var i = start;
    var prev_i = i;
    var last = data.count() + rot;
    while (i <= last) {

        var n = i % data.count();
        var p = data.at(n);
        var d = data.delta(n);

        t += d;
        t2 += d;

        if (i == start) {
            // ふきだしにヒゲや o o o をつける？
            if (typeof hige == 'string') {
                // o o o をつける
                var p1 = p.scale(1.2);
                var rad = h / 10;
                for (var k = 0; k < hige.length; k++) {
                    cxt.moveTo(cx + p1.x + rad, cy + p1.y); // subpathをここにやらないとへんな線が...
                    cxt.arc(cx + p1.x, cy + p1.y, rad, 0, Math.PI * 2, false);
                    rad /= 2;
                    p1 = p1.scale(1.2);
                }

                cxt.moveTo(cx + p.x, cy + p.y);

            } else if (hige) {
                // 数値ならヒゲをつける
                var p1 = data.at((start + 2) % data.count());
                var d = p.scale(1 + hige);

                cxt.moveTo(cx + p.x, cy + p.y);
                cxt.quadraticCurveTo(
                    cx + d.x, cy + d.y,
                    cx + p1.x, cy + p1.y);
                i += 2;

            } else {
                cxt.moveTo(cx + p.x, cy + p.y);
            }

            prev_i = i;

        } else if (depth == 0) {
            // spike の深さが 0 なら，綺麗な楕円を描くだけ
            cxt.lineTo(cx + p.x, cy + p.y);

        } else if ((data.L() - t2) < 10 && i < last) {
            // t2 が data.L() に近い = つまりもうすぐ周を終える．
            // どうせだから i == last になるまで何もしない．

        } else if (t >= step || i == last) {
            // spike の深さがあるなら，
            // ここまで辿った円周の距離 t が step に達する毎に
            // トゲトゲ (あるいはモコモコ) を描く
            var alt_i = Math.floor((i + prev_i) / 2);
            alt_i = alt_i % data.count();
            var alt_p = data.at(alt_i);
            var alt_x = (depth > 0) ? alt_p.x * alt_dep : alt_p.x / alt_dep;
            var alt_y = (depth > 0) ? alt_p.y * alt_dep : alt_p.y / alt_dep;

            cxt.quadraticCurveTo(
                cx + alt_x,
                cy + alt_y,
                cx + p.x,
                cy + p.y);

            t -= step;
            prev_i = i;
        }

        i++;
    }

    cxt.endFill();

    return {
        sprite: new PIXI.Sprite(this.parent.root.app.renderer.generateTexture(cxt))
    }
}