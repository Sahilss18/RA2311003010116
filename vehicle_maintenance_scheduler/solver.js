function knapsack(vehicles, maxHours) {
    const dp = new Array(maxHours + 1).fill(0);

    for (let v of vehicles) {
        for (let w = maxHours; w >= v.Duration; w--) {
            dp[w] = Math.max(dp[w], dp[w - v.Duration] + v.Impact);
        }
    }

    return dp[maxHours];
}

module.exports = knapsack;