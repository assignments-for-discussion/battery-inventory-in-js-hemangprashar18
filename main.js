const assert = require('assert');

const RATED_CAPACITY_AH = 120;

const SOH_THRESHOLD_HEALTHY = 83;
const SOH_THRESHOLD_EXCHANGE = 63;

function countBatteriesByHealth(presentCapacities) {
  const counts = { healthy: 0, exchange: 0, failed: 0 };

  for (const presentCapacity of presentCapacities) {
    const sohPercent = 100 * presentCapacity / RATED_CAPACITY_AH;

    if (sohPercent > SOH_THRESHOLD_HEALTHY) {
      counts.healthy++;
    } else if (sohPercent >= SOH_THRESHOLD_EXCHANGE) {
      counts.exchange++;
    } else {
      counts.failed++;
    }
  }

  return counts;
}

function testBucketingByHealth() {
  console.log('Counting batteries by SoH...');
  const presentCapacities = [113, 116, 80, 95, 92, 70];
  const counts = countBatteriesByHealth(presentCapacities);
  assert(counts["healthy"] == 2);
  assert(counts["exchange"] == 3);
  assert(counts["failed"] == 1);
  console.log("Done counting :)");
}

function testBoundaryConditions() {
  console.log('Testing boundary conditions...');

  const countsAt83 = countBatteriesByHealth([100]); 
  assert(countsAt83.healthy === 1);

  const countsAt63 = countBatteriesByHealth([76]); 
  assert(countsAt63.exchange === 1);

  const countsBelow63 = countBatteriesByHealth([75]); 
  assert(countsBelow63.failed === 1);

  const countsEmpty = countBatteriesByHealth([]);
  assert(countsEmpty.healthy === 0 && countsEmpty.exchange === 0 && countsEmpty.failed === 0);

  console.log("Boundary tests passed :)");
}

testBucketingByHealth();
testBoundaryConditions();
