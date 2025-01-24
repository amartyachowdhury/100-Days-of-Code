function generateBandName() {
    var city = document.getElementById("city").value;
    var pet = document.getElementById("pet").value;
    var result = city + " " + pet;
    document.getElementById("result").innerText = "Your band name could be " + result;
}
