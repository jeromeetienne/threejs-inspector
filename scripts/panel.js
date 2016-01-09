console.log("in panel.js: start running");

function superonclick(){
        // var jsCode = "inspect($$('head script[data-soak=main]')[0])"
//         // var jsCode = 'alert("sss")'
        // chrome.devtools.inspectedWindow.eval(jsCode, function(result, isException) {
        //         console.log('result of eval', arguments)
        // })
//
        // jsCode = 'console.log("ddd");'
        // 
        // chrome.devtools.inspectedWindow.eval(jsCode, {
        //         useContentScriptContext : true
        // })

        chrome.devtools.inspectedWindow.eval('('+injected_script.toString()+')();');
}


document.querySelector('button').addEventListener('click', function() {
        console.log('detecting click on a button')
        superonclick();
}, false);

console.log("in panel.js: stop running");
