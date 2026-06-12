const logo = `
                         ___________
                         \\         /
                          )_______(
                          |"""""""|_.-._,.---------.,_.-._
                          |       | | |               | | ''-.
                          |       |_| |_             _| |_..-'
                          |_______| '-' \`'---------'\` '-'
                          )"""""""(
                         /_________\\\\
                       .-------------.
                      /_______________\\\\
`;

const bids = {};

function findHighestBidder(biddingRecord) {
    let highestBid = 0;
    let winner = "";
    for (const bidder in biddingRecord) {
        const bidAmount = biddingRecord[bidder];
        if (bidAmount > highestBid) {
            highestBid = bidAmount;
            winner = bidder;
        }
    }
    return { winner, highestBid };
}

function updateBidCount() {
    document.getElementById("bidCount").textContent =
        `Bidders recorded: ${Object.keys(bids).length}`;
}

function showError(message) {
    const errorEl = document.getElementById("error");
    errorEl.textContent = message;
    errorEl.hidden = false;
}

function hideError() {
    document.getElementById("error").hidden = true;
}

function submitBid() {
    hideError();
    const name = document.getElementById("name").value.trim();
    const bidValue = document.getElementById("bid").value;
    const bid = parseInt(bidValue, 10);

    if (!name) {
        showError("Please enter your name.");
        return;
    }

    if (Number.isNaN(bid) || bid < 0) {
        showError("Please enter a valid bid amount.");
        return;
    }

    bids[name] = bid;
    updateBidCount();

    document.getElementById("bidForm").hidden = true;
    document.getElementById("afterBid").hidden = false;
}

function addAnotherBidder() {
    document.getElementById("auction").classList.add("clear-screen");
    setTimeout(() => {
        document.getElementById("auction").classList.remove("clear-screen");
        document.getElementById("name").value = "";
        document.getElementById("bid").value = "";
        hideError();
        document.getElementById("bidForm").hidden = false;
        document.getElementById("afterBid").hidden = true;
        document.getElementById("name").focus();
    }, 300);
}

function endAuction() {
    if (Object.keys(bids).length === 0) {
        showError("Add at least one bid before ending the auction.");
        document.getElementById("bidForm").hidden = false;
        document.getElementById("afterBid").hidden = true;
        return;
    }

    const { winner, highestBid } = findHighestBidder(bids);
    document.getElementById("auction").hidden = true;
    document.getElementById("result").hidden = false;
    document.getElementById("winner").textContent =
        `The winner is ${winner} with a bid of $${highestBid}`;
}

function resetAuction() {
    for (const key of Object.keys(bids)) {
        delete bids[key];
    }
    document.getElementById("name").value = "";
    document.getElementById("bid").value = "";
    hideError();
    document.getElementById("bidForm").hidden = false;
    document.getElementById("afterBid").hidden = true;
    document.getElementById("auction").hidden = false;
    document.getElementById("result").hidden = true;
    updateBidCount();
}

document.getElementById("logo").textContent = logo;
updateBidCount();
