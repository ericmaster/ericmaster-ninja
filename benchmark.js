const numItems = 10000;
const iterations = 100;

function benchmarkInline() {
  let count = 0;
  for (let i = 0; i < numItems; i++) {
    // Mimic the exact syntax in the code
    [1, 2, 3, 4, 5].map(n => {
       count += n;
    });
  }
  return count; // Prevent DCE
}

const SKILL_LEVELS = [1, 2, 3, 4, 5];
function benchmarkPreallocated() {
  let count = 0;
  for (let i = 0; i < numItems; i++) {
    SKILL_LEVELS.map(n => {
       count += n;
    });
  }
  return count; // Prevent DCE
}

function runBenchmark() {
  console.log('Warming up...');
  for (let i = 0; i < 500; i++) {
    benchmarkPreallocated();
    benchmarkInline();
  }

  // Prevent GC pauses from skewing results by forcing GC before testing
  // Alternate testing to remove CPU boosting effects
  let timeInline = 0;
  let timePre = 0;

  for (let i = 0; i < iterations; i++) {
    global.gc(); // Force GC
    const startPre = performance.now();
    benchmarkPreallocated();
    timePre += performance.now() - startPre;

    global.gc(); // Force GC
    const startInline = performance.now();
    benchmarkInline();
    timeInline += performance.now() - startInline;
  }

  console.log(`Inline Allocation Time: ${timeInline.toFixed(2)} ms`);
  console.log(`Preallocated Array Time: ${timePre.toFixed(2)} ms`);

  const improvement = ((timeInline - timePre) / timeInline) * 100;
  console.log(`Improvement: ${improvement.toFixed(2)}% faster`);
}

runBenchmark();