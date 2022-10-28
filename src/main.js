import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccIconFlag = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardFlag(flag) {
  const colors = {
    visa: ["#2D57F2", "#436D99"],
    mastercard: ["#C69347", "#DF6F29"],
    default: ["black", "gray"],
  }
  ccBgColor01.setAttribute("fill", colors[flag][0])
  ccBgColor02.setAttribute("fill", colors[flag][1])
  ccIconFlag.setAttribute("src", "/cc-" + [flag] + ".svg")
}

// Security Code / CVV

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

// expiration date

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

// card Holder

const cardHolder = document.querySelector("#card-holder")
const cardHolderRegex = /[^a-zà-ú\s]/i
cardHolder.addEventListener("input", () => {
  cardHolder.value = cardHolder.value.replace(cardHolderRegex, "")
  attCardHolder()
})

// card number

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardFlag: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardFlag: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardFlag: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const inputNumber = (dynamicMasked.value + appended).replace(/\D/g, "")
    const cardFlagMask = dynamicMasked.compiledMasks.find((item) => {
      return inputNumber.match(item.regex)
    })
    return cardFlagMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

// Att Card Image

securityCodeMasked.on("accept", () => {
  const securityCodeCC = document.querySelector(".cc-security .value")
  attCard(securityCodeCC, securityCodeMasked, "123")
})

expirationDateMasked.on("accept", () => {
  const expirationDateCC = document.querySelector(".cc-expiration .value")
  attCard(expirationDateCC, expirationDateMasked, "02/32")
})

function attCardHolder() {
  attCard(
    document.querySelector(".cc-holder .value"),
    cardHolder,
    "FULANO DA SILVA"
  )
}

cardNumberMasked.on("accept", () => {
  const cardNumberCC = document.querySelector(".cc-number")
  attCard(cardNumberCC, cardNumberMasked, "1234 5678 9012 3456")
  setCardFlag(cardNumberMasked.masked.currentMask.cardFlag)
})

function attCard(cardCC, cardMasked, defaultValue) {
  cardCC.innerText =
    cardMasked.value.length > 0 ? cardMasked.value : defaultValue
}
// button

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {})
document.querySelector("form").addEventListener("submit", (event) => {
  alert("Esta foi uma demonstração, obrigado por participar!")
})
