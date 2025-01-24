function calculateTip() {
    const bill = parseFloat(document.getElementById('bill').value);
    const tipPercentage = parseInt(document.getElementById('tip').value);
    const people = parseInt(document.getElementById('people').value);

    const finalBill = (bill * (1 + tipPercentage / 100)) / people;
    document.getElementById('result').textContent = `The total amount for each person is $${finalBill.toFixed(2)}`;
}
