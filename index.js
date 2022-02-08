const COUNTRY_API = `https://restcountries.com/v3.1/name`
$(document).ready(init)

// searchBtn inputSearch

const state = { countries: []}

function init() {
    $('#searchButton').on('click', searchButton)
}


 function searchButton() {
    const val = $('#inputSearch').val()
    const url = `${COUNTRY_API}/${val}`;
    $.ajax({
        url: url,
        dataType: 'json',
        success: _setCountries,
        error: _error
    })
 }

 function _setCountries(response) {
     const countries = countriesLoad(response[0])
     state.countries = countries;
     
     draw()
 }

 function _error(error) {
     alert('bad request')
 }

 function countriesLoad(data) {
     if (!Array.isArray(data)) return;
     return data.map(function (m) {
         return new CountriesData(m.capital, m.subregion)
     })
 }

 function CountriesData(capital, subregion) {
     this.capital = capital
     this.subregion = subregion
     this.id = generateId(`${capital} ${subregion}`)
 }

 function generateId(str) {
     return btoa(str).substring(0, 10)
 }

 function draw() {
     $('#content').html('')
     const cards = state.countries.map(function (countries) {
         return getCard(countries) 
        })
        $('#content').append(...cards)
 }
    //  for (let index = 0; index < countries.length; index++) {
    //     const countriesCard = getCard(countries[index]);
    //     $('#content').append(countriesCard)

    //  }
    
        

 

 function getCard(data) {
    const mainDiv = document.createElement("div")
    mainDiv.id = data.id
    mainDiv.className = "card";
    mainDiv.style.width = "18rem"
    mainDiv.style.height = "450px"
    mainDiv.style.overflow = "auto"
    const secondaryDiv = document.createElement("div")
    secondaryDiv.className = "card-body"

    
    const p1 = document.createElement("p")
    p1.id = "country"
    p1.innerText = data.capital

    const p2 = document.createElement("p")
    p2.innerText = data.subregion

    
    const moreInfo = document.createElement("button")
    moreInfo.className = "btn btn-primary"
    moreInfo.innerText = "Click for more"
    moreInfo.addEventListener("click", function () {
        getManufacturerCountry(data)
    })
    secondaryDiv.append( p1, p2)
    mainDiv.append( secondaryDiv)
    return mainDiv

}

function getManufacturerCountry(data) {
    const country = data.country;

    $.get(`${COUNTRY_API}/${country}`).done(_setCountryReponse).fail(_setErrorResponse)

    // fetch(`${COUNTRY_API}/${country}`)
    //     .then(_setJsonReponse)
    //     .then(_setCountryReponse)
    //     .catch(_setErrorResponse)
    // this function can be reused!
    function _setJsonReponse(response) {
        return response.json()
    }
    function _setCountryReponse(response) {
        // this function can be divided to more functions 
        console.log(response)
        if (!response[0] || !response[0].flags) return
        console.log(response[0].flags.png)
        // Create Image => JS
        // const flagImage = document.createElement("img")
        // flagImage.src = response[0].flags.png
        // flagImage.height = 100;
        // flagImage.width = 100
        // Create Image => Jquery
        const flagImageJquery = $("<img/>").attr({ src: response[0].flags.png, height: 100, width: 100 })

        // Append image => Jquery
        $(`#${data.id}`).find("#country").append(flagImageJquery)

        // Append Image => JS
        // document.getElementById(data.id).querySelector("#country").append(flagImage)
    }
    function _setErrorResponse(error) {
        if (DOM.alertModal) {
            DOM.alertModal.style.visibility = "visible"
            setTimeout(function () {
                DOM.alertModal.style.visibility = "hidden"
            }, 5000);
        }
    }
}

