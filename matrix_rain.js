function matrix_rain(id) {
    var font_size = 18;
    var font = "courier";
    var text = "";
    var drop_full_speed = 40;
    var drop_min_size = 15;
    var drop_max_size = 50;
    var drop_min_slowdown = 0.9;
    var drop_head_size = 2;
    var drop_tail_opacity = 0.6;
    var bottom_fade_rows = 5;

    var canvas = document.getElementById(id);
    var c = canvas.getContext("2d");
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    var rows = h / font_size;
    var cols = w / font_size;
    var last = window.performance.now();
    var drops = [];
    canvas.width = w;
    canvas.height = h;
    c.font = font_size + "px " + font;
    init_all_drops();

    function on_resize() {
        //TBD
    }
    window.addEventListener("resize", on_resize);

    function animate() {
        var delta_seconds = prepare_new_frame();
        for (var col = 0; col < cols; col++) {
            var drop_length = drops[col]["len"];
            var drop_y = drops[col]["y"];
            for (var i = 0; i < drop_length; i++) {
                var row = Math.floor(drop_y - i);
                var opacity = (i < drop_head_size ? 1 : drop_tail_opacity) - (i / drop_length);
                if (row > rows - bottom_fade_rows) {
                    opacity *= (rows - row) / bottom_fade_rows;
                }
                var char = text.charAt(col * rows + row);
                c.fillStyle = "rgba(0, 0, 0, " + opacity + ")";
                c.fillText(char, col * font_size, row * font_size);
            }
            drops[col]["y"] += delta_seconds * drop_full_speed * drops[col]["speed"];
            if ((drop_y - drop_length) > rows) {
                drops[col] = new_drop();
            }
        }
    }

    function prepare_new_frame() {
        var now = window.performance.now();
        var delta_seconds = Math.min(1, (now - last) / 1000);
        setTimeout(animate, 100);
        last = now;
        c.clearRect(0, 0, w, h);
        return delta_seconds;
    }

    function new_drop() {
        return {
            "y": Math.random() * -1 * drop_max_size,
            "len": Math.random() * drop_max_size + drop_min_size,
            "speed": Math.min(drop_min_slowdown, Math.random())
        };
    }

    function init_all_drops() {
        for (var i = 0; i < cols; i++) {
            drops[i] = new_drop();
        }
    }

    function set_text(new_text) {
        var target = cols * rows;
        var repeat = Math.max(1,  Math.ceil(target / new_text.length));
        text = new_text.repeat(repeat);
        var max = text.length - target;
        var rnd = Math.floor(Math.random()*max);
        text = text.slice(rnd, rnd + target);
        return this;
    }

    prepare_new_frame();
    return {"set_text": set_text};
}
