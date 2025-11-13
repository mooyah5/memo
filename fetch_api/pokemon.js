async function fetchPikachu() {
  try {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
    if (!res.ok) {
      console.error('Fetch error: ', res.status, res.statusText);
      return;
    }
    console.log('content-type: ', res.headers.get('Content-Type'));
    return await res.json()

  } catch (error) {
    console.error('Fetch error:', error)
  }
}

async function printPikachuInfo() {
  const pikachuInfo = await fetchPikachu();
  console.log('Pikachu info:', pikachuInfo);
  pikachuInfo.stats.forEach((stat, idx) => {
    console.log(`${idx + 1}. ${stat.stat.name}: ${stat.base_stat}`);
  })
}

printPikachuInfo()