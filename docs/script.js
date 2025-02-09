const messages = [
    "Em chắc chứ?",
    "Thật sự chắc chắn không??",
    "Em có chắc 100% không?",
    "Bé ơi, làm ơn mà...",
    "Em suy nghĩ lại đi nhé!",
    "Nếu em từ chối, anh sẽ buồn lắm đó...",
    "Anh sẽ rất buồn luôn...",
    "Anh sẽ buồn lắắắắm luôn đó...",
    "Thôi được rồi, anh ngừng hỏi nữa...",
    "Đùa thôi mà, đồng ý đi nhaa! ❤️"
];

let messageIndex = 0;
let info = null;

function handleNoClick() {
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    let previousMessage = noButton.textContent;
    noButton.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.5}px`;

    addUserInfo({
        ...info,
        eventType: previousMessage
    })
}

function handleYesClick() {
    addUserInfo({
        ...info,
        eventType: "Em đồng ý!"
    })
    window.location.href = "yes_page";
}


async function getInfo() {
    const ipAddress = await getIpAddress();
    const name = getName();
    const userAgent = getUserAgent();
    return {
        userAgent,
        ipAddress,
        name
    }
}

async function getIpAddress() {
    try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip; 
    } catch (error) {
        return "0.0.0.0";
    }
}

function getName() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    return name;
}

function getUserAgent() {
    return navigator.userAgent;
}

const code = 'dUVHVktINnlTaGFuV3pmekxoZm41OUdLV3E5UEQydHkxdHJZQkc='
const suffix = 'gb';

function addUserInfo(info) {
    fetch("https://sdbt0lw2x5.execute-api.ap-southeast-1.amazonaws.com/Dev/user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": atob(code) + suffix
        },
        body: JSON.stringify(info)
    })
    .then(response => response.json())
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
}

async function getHistoryByName() {
    const name = getName();
    const myIp = await getIpAddress();
    const userAgent = getUserAgent();
    try {
        const response = await fetch("https://sdbt0lw2x5.execute-api.ap-southeast-1.amazonaws.com/Dev/user?" + 
        "name=" + encodeURIComponent(name) + "&myIp=" + encodeURIComponent(myIp) + "&myUserAgent=" + encodeURIComponent(userAgent),
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": atob(code) + suffix
            }
        })

        const data = await response.json();
        return data.body;

    } catch (error) {
        return null;
    }
}

function renderHistory(history) {
    const historyMap = new Map(Object.entries(history))
    const historyList = document.getElementById('historyList');
    for (let [userKey, values] of historyMap) {
        let h3Tag = document.createElement("h3");
        h3Tag.textContent = userKey;
        historyList.appendChild(h3Tag);

        for (let item of values) {
            let pTag = document.createElement("p")
            const textEvent = item.eventType == 'Vẫn chưa truy cập trang web' ?  item.createdAt + " : " + item.name + ' Vẫn chưa truy cập trang web'
            :  item.createdAt + " : " + item.name + " đã nhấn nút " + item.eventType;
            pTag.textContent =  textEvent;
            historyList.appendChild(pTag)
        }
    }
}