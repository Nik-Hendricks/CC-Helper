chrome.runtime.onInstalled.addListener(() => {
    
    chrome.action.setBadgeText({
        text: "OFF",
    });

    chrome.action.setBadgeBackgroundColor({
        color: "#FF0000",
    });
});

const url1 = 'https://www.callcentric.com'
const url2 = 'https://my.callcentric.com'




chrome.action.onClicked.addListener(async (tab) => {
    console.log(tab)
    if (tab.url.startsWith(url1) || tab.url.startsWith(url2)) {
        get_clients(0)   
        client_query();
    }
});



function get_clients(start, obj){
    //now fetch
    chrome.cookies.getAll({"url": 'https://my.callcentric.com'}, (cookie) => {
        fetch(`https://my.callcentric.com/agent_clients.php?start_value=${start}&search=&sort=num+A`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie.map(c => `${c.name}=${c.value}`).join('; ')
            }
        }).then(res => res.text()).then(data => {
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { evt: "dom", data: data }, (res) => {
                    var i = 0;
                    if(obj){
                        obj = obj;
                    }else{
                        obj = {
                            client_count: 0,
                            clients: []
                        };
                    }
                    res.result.forEach((el) => {
                        if(el.type == "TR" && el.text.includes("Add funds to user balance")){
                            if(i == 0){
                                obj.client_count = el.text.split("Total clients:")[1].split(',')[0]
                            }else{
                                var name = el.text.slice(11, el.text.length - 1).split('active')[0].split(',').join('');
                                obj.clients.push({first: name.split(' ')[1], last: name.split(' ')[0], active: el.text.includes("active")})
                            }
                            i++;
                        }
                    })
    
                    if(obj.clients.length < obj.client_count){
                        get_clients(obj.clients.length, obj)
                    }else{
                        console.log(obj)
                    }
    
                });
            });
        })
    })
}

function client_query(){
    chrome.cookies.getAll({"url": 'https://my.callcentric.com'}, (cookie) => {
        var form_data = new FormData();
        form_data.append("go", "login");
        form_data.append('backref', 'https://my.callcentric.com/home.php')
        form_data.append("l_login", "");
        form_data.append("l_passwd", "");



        fetch(`https://www.callcentric.com/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookie.map(c => `${c.name}=${c.value}`).join('; '),
                'credentials': "include",
            },
            body: form_data
        }).then(res => res.text()).then(data => {
            console.log(data)
        })
    })
}
   
