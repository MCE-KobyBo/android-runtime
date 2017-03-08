        global.console = {
            log: function(msg) {
                android.util.Log.v("~~~~ CONSOLE LOG", msg);

    			__consoleMessage(msg, "log");
            },
            warn: function(msg) {
                android.util.Log.w("~~~~ CONSOLE WARN", msg);

                __consoleMessage(msg, "warn");
            }
        }

onmessage = function(msg) {
    if (msg.data.type == "warn") {
        console.warn(msg.data.msg);
    } else {
        console.log(msg.data.msg)
    }
}