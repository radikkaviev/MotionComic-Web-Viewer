$.trans = function(method, time, mode, callback) {
    
    var _map_conv_method = {
        "corssfade":"fadeIn",
        "explode":"zoomIn",
        "slide":"slideInLeft",
        "blind":"bounceIn",
        "bounce":"bounceIn",
        "clip":"flipInX",
        "drop":"slideInLeft",
        "fold":"fadeIn",
        "puff":"fadeIn",
        "scale":"zoomIn",
        "shake":"fadeIn",
        "size":"zoomIn"
    }
    
    if(method=="crossfade") {
        method = "fadeIn";
    }else if(_map_conv_method[method]){
        method = _map_conv_method[method];
    }
    
    var div = document.createElement("div");
    div.setAttribute("id", "animation");
    
    document.body.appendChild(div);
    
    if(mode === "hide")
    {
        div.style.opacity = 1;
        
        method = $.replaceAll(method,"In","Out");
        $("#animation").velocity( method, { 
            duration:  parseInt(time),
            complete: function(){
                if(callback)
                    callback();
            }
        });
    }
    
    else
    {
        div.style.opacity = 0;
        
        $("#animation").velocity( method, { 
            duration:  parseInt(time),
            complete: function(){
                if(callback)
                    callback();
            }
        });
    }
};