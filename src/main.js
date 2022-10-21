import "./css/index.css"
import iMask, { Masked } from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) ellipse")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccBgColor03 = document.querySelector(".cc-bg svg > g g:nth-child(3) ellipse")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
    const colors = {
        visa: ["#F16529", "#FF3C21", "#FFA724"],
        mastercard: ["#FFC632", "#FD294F", "#F73A67"],
        elo: ["#FF5C41", "#81BBDC", "#E3CF64"],
        hipercard: ["#FF5C41", "#6D0303", "#360909"],
        default: ["black", "gray"],
    }

    
    ccBgColor01.setAttribute("fill", colors[type][0])
    ccBgColor02.setAttribute("fill", colors[type][1])
    ccBgColor03.setAttribute("fill", colors[type][2])
    ccLogo.setAttribute("src", `cc-${type}.svg`)
}

setCardType("default")

globalThis.setCardType = setCardType


// Mask that limits the cvc input to only numbers, up to 4 digits
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
    mask: "0000",
}
const securityCodeMasked = iMask(securityCode, securityCodePattern)


const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        YY: {
            mask: iMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2),
        },
        MM: {
            mask: iMask.MaskedRange,
            from: 1,
            to: 12
        },
    }
}
const expirationDateMasked = iMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex:/(^4011|431274|438935|451416|457393|4576|457631|457632|504175|50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|627780|636297|636368|636369|(6503[1-3])|(6500(3[5-9]|4[0-9]|5[0-1]))|(6504(0[5-9]|1[0-9]|2[0-9]|3[0-9]))|(650(48[5-9]|49[0-9]|50[0-9]|51[1-9]|52[0-9]|53[0-7]))|(6505(4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-8]))|(6507(0[0-9]|1[0-8]))|(6507(2[0-7]))|(650(90[1-9]|91[0-9]|920))|(6516(5[2-9]|6[0-9]|7[0-9]))|(6550(0[0-9]|1[1-9]))|(6550(2[1-9]|3[0-9]|4[0-9]|5[0-8]))|(506(699|77[0-8]|7[1-6][0-9))|(509([0-9][0-9][0-9])))$/,
            cardtype: "elo",
        },
        {
            mask: "0000 0000 0000 0000",
            regex:/^4\d{0,15}/,
            cardtype: "visa",
        },
        {
            mask: "0000 0000 0000 0000",
            regex:/(^5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard",
        },
        {
            mask: "000000 0000 0000 0000",
            regex: /(^606282\d{0,10}(\d{0,3})?)|(3841\d{0,15})$/,
            cardtype: "hipercard",
        },
        {
            mask: "000000 0000 0000 0000",
            cardtype: "default",
        },
    ],
    dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, "")
        const foundMask = dynamicMasked.compiledMasks.find(function(item) {
            return number.match(item.regex)
        })
        console.log(foundMask)

        return foundMask
    }
}

const cardNumberMasked = iMask(cardNumber, cardNumberPattern)


// Adding event listener for the button
const addButon = document.querySelector("#add-card")

addButon.addEventListener("click", () => {
    alert("Cartão adcionado.")
})

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
})


/* CARD HOLDER NAME DYNAMICALLY CHANGING ACCORDING TO USER INPUT */ 

const cardHolder = document.querySelector("#card-holder")

cardHolder.addEventListener("input", () => {
    const ccHolder = document.querySelector(".cc-holder .value")

    ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

/* SECURITY CARD NUMBER DYNAMICALLY CHANGING ACCORDING TO USER INPUT */ 

securityCodeMasked.on("accept", () => {
    updateSecurityCode(securityCodeMasked.value);
})

function updateSecurityCode(code){
    const ccSecurity = document.querySelector(".cc-security .value")

    ccSecurity.innerText = code.length === 0 ? "123" : code
}


/* CARD NUMBER DYNAMICALLY CHANGING ACCORDING TO USER INPUT */ 

cardNumberMasked.on("accept", () => {
    const cardType = cardNumberMasked.masked.currentMask.cardtype
    setCardType(cardType)
    updateCardNumber(cardNumberMasked.value);
})

function updateCardNumber(number) {
    const ccNumber = document.querySelector(".cc-number");
    ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;
}


/* EXPIRATION DATE DYNAMICALLY CHANGING ACCORDING TO USER INPUT */ 

expirationDateMasked.on("accept", () => {
    updateExpirationDate(expirationDateMasked.value);
})

function updateExpirationDate(date){
    const ccExpiration = document.querySelector(".cc-expiration .value")

    ccExpiration.innerText = date.length === 0 ? "02/32" : date
}


