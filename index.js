const searchInput = document.querySelector("div.search-section input.search-input");

const searchButton = document.querySelector("div.search-section button.search-button");

const container = document.querySelector("div.content-wrapper div.content-arti");

const ambilData = async (kata) => {

    try {
        
        container.innerHTML = `<h2 class="loading">Loading...</h2>`

        const resp = await fetch(`https://new-kbbi-api.herokuapp.com/cari/${kata}`);
    
        if(!resp.ok) throw new Error("Can't be found")
        
        const data = await resp.json();

        const pisahKata = (kata) => {
            let str = kata;
            const arr = [];
            
            while(str.length) {
                const lastIndex = str.indexOf("]");
        
                let part = str.slice(0, lastIndex+1);
                if(part[0] == " ") part = part.slice(1)
                arr.push(part)
            
                const restParts = str.slice(lastIndex + 1)
                str = restParts;
            
                if(lastIndex == str.length - 1) str = ""
            }
        
            const hasilFinal = arr.map(e => {
                const firstBracket = e.indexOf("[");
            
                return e.slice(0, firstBracket)
            })
        
            return hasilFinal
        }

        let allHTML = ""

        data.data.forEach((e, i )=> {
            let htmlPrint = ""
            let htmlLi = ""
            const lema = e.lema

            e.arti.forEach(e => {
                const jenisKata = pisahKata(e.kelas_kata).join(" ");
                const deskripsi = e.deskripsi

                htmlLi += `<li><span class="jenis-kata">${jenisKata}</span> ${deskripsi}</li>`
            })

            htmlPrint = 
            `<div class="each-content-arti content-arti-${i+1}">
                <h2>${lema}</h2>
                <ol>${htmlLi}</ol>
            </div>`

            allHTML += htmlPrint
        })


        container.innerHTML = allHTML

    } catch(err){
        container.innerHTML = `<h2 class="tidak-ada">Kata <span>${kata}</span> tidak dapat ditemukan atau <span class="limit">sudah mencapai limit pemakaian</span></h2>`;
    }
}

searchButton.addEventListener("click", e => {
    const valueSearch = searchInput.value;

    if(valueSearch == "") return false

    ambilData(valueSearch)
})

searchInput.addEventListener("keydown", e => {
    const valueSearch = searchInput.value;

    if(valueSearch == "") return false

    if(e.key == "Enter") ambilData(valueSearch)
})
