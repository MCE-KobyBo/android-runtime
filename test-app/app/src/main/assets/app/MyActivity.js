/* 
	// demonstrates how to extend class in TypeScript with prebuilt Java proxy
	
	declare module android {
		export module app {
			export class Activity {
				onCreate(bundle: android.os.Bundle);			
			}
		}
		export module os {
			export class Bundle {}
		}
	}
	
	@JavaProxy("com.tns.NativeScriptActivity")
	class MyActivity extends android.app.Activity
	{
		onCreate(bundle: android.os.Bundle) 
		{
			super.onCreate(bundle);
		}
	}
*/
var MyActivity = (function (_super) {
    __extends(MyActivity, _super);
    function MyActivity() {
        _super.apply(this, arguments);
    }
    MyActivity.prototype.onCreate = function (bundle) {
        _super.prototype.onCreate.call(this, bundle);

//    	require("./tests/testsWithContext").run(this);
//    	execute(); //run jasmine
        require("globals");
    	var layout = new android.widget.LinearLayout(this);
    	layout.setOrientation(1);
    	this.setContentView(layout);

    	var textView = new android.widget.TextView(this);
    	textView.setText("It's a button!");
    	layout.addView(textView);

    	var button = new android.widget.Button(this);
    	button.setText("Get delayed (4) response");
    	layout.addView(button);
    	var counter = 0;

    	var button2 = new android.widget.Button(this);
    	button2.setText("Get Image");
    	layout.addView(button2);

    	var button3 = new android.widget.Button(this);
    	button3.setText("Get 404");
    	layout.addView(button3);

    	var button4 = new android.widget.Button(this);
    	button4.setText("Post");
    	layout.addView(button4);

    	var Color = android.graphics.Color;
    	var colors = [Color.BLUE, Color.RED, Color.MAGENTA, Color.YELLOW, Color.parseColor("#FF7F50")];
    	var taps = 0;

//    	var dum = com.tns.tests.DummyClass.null;
        var http = require("http");

    	button.onClick(function() {
            http.request({ url: "https://httpbin.org/delay/4", method: "GET", headers: { "XHCustom-Header": "My custom header1", "Agent-String": "Android"} }).then(function (response) {
                //// Argument (response) is HttpResponse!
                //// Content property of the response is HttpContent!
                var str = response.content.toString();
            }, function (e) {
                //// Argument (e) is Error!
            });
    	});

    	button2.onClick(function() {
            http.getImage("http://httpbin.org/image/jpeg", "myImage.jpeg").then(function (r) {
            }, function (e) {
                //// Argument (e) is Error!
                console.log(e);
            });
        });

        button3.onClick(function() {
            http.request({ url: "http://httpbin.org/asdasd", method: "GET"}).then(function (r) {
            }, function (e) {
                //// Argument (e) is Error!
                console.log(e);
            });
        });

        button4.onClick(function() {
            http.request({
            url: "http://httpbin.org/post",
            method: "POST",
            content: JSON.stringify({
                name: "Test Name",
                age: 17,
                occupation: "Student",
                class: "B",
                id: "123123123123cadas",
                additionalData: {
                    var1: "var1 value",
                    var2: 2
                }
            })}).then(function (r) {
            }, function (e) {
                //// Argument (e) is Error!
                console.log(e);
            });
        });

    };
    MyActivity = __decorate([
        JavaProxy("com.tns.NativeScriptActivity")
    ], MyActivity);
    return MyActivity;
})(android.app.Activity);

android.widget.Button.prototype.onClick = function(impl) {
    this.setOnClickListener(new android.view.View.OnClickListener({
        onClick: impl
    }));
}
