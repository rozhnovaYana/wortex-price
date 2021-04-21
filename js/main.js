const titles = document.querySelectorAll(".info-block__arrow"),
    hiddenBlocks = document.querySelectorAll(".info-text");


titles.forEach(title => {
    title.addEventListener("click", (e) => {
        const num = e.target.getAttribute('data-title')
        hiddenBlocks.forEach(item => {
            if (item.classList.contains('info-text_active') && item.getAttribute('data-text') !== num) {
                item.classList.remove('info-text_active')
                titles[item.getAttribute("data-text")-1].classList.remove("info-block__arrow_active")
            }
            hiddenBlocks[num - 1].classList.toggle("info-text_active")
            titles[num-1].classList.toggle("info-block__arrow_active")
        }
            
        )
        

    })
})
const costs = {
    EUR: [160, 200, 100, 260, 360, 120, 80, 450, 300, 200, 120],
    USD: [100, 60]
}
const getCurrency = async () => {
    const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json',
        {
            method: "GET"
        })
    if (!response.ok) {
        console.error("Something was wrong")
    } else {
        const data = await response.json()
    return data
    }
    
}
const converter = async() => {
    const data = await getCurrency()
    const eur = +data.find(item => item.cc === "EUR").rate
    const usd = +data.find(item => item.cc === "USD").rate
    const uah = [...costs.EUR.map(item => (+item * eur).toFixed(2)), ...costs.USD.map(item =>(+item * usd).toFixed(2))]
    const costIntArray = [...costs.EUR.map(item => `€${item}`), ...costs.USD.map(item => `$${item}`)]
    hiddenBlocks.forEach(block => {
        const num=block.getAttribute("data-text")
        const costsHTML = block.querySelector(".cost"),
            costInt=block.querySelector(".costInt")
        costsHTML.textContent = uah[num - 1]
        costInt.textContent=costIntArray[num-1]
        const copy = block.querySelector(".copy"),
            copyAlert=document.querySelector(".copy-alert")
        copy.addEventListener("click", () => {
            navigator.clipboard
                .writeText(block.innerText)
                .then(() => {
                    copyAlert.classList.add("copy-alert_active")
                    setTimeout(()=>copyAlert.classList.remove("copy-alert_active"), 2000)
                })
                .catch((e) => {
                   console.error(e)
                });

        })
    })
    
}
converter()

