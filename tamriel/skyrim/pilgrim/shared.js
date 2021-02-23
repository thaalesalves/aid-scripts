/*
**
**
** VARIABLE DECLARATIONS 
**
**
**/

const LETTER_REGEX = /[0-9]/g;
const DIGIT_REGEX = /\D/g;
const BRACKETED = /\[(.*?)\]/g;
const BRACKETS = /\[|\]/g;
const PUNCTUATION_REMOVE = /[^\w\s]/gi;
const WEAPONS = [
  'sword', 'knife', 'spear', 'hammer', 'axe', 'battleaxe', 'sledgehammer', 'longsword',
];

const CLOTHING = [
  'rags', 'armor', 'dress', 'kilt', 'skirt', 'jerkin', 'shirt', 'clothes', 'robes', 'leathers', 'hooded', 'cuirass', 'chainmail'
];

/*
**
**
** FUNCTION DECLARATIONS
**
**
**/

/**
 * Bracket handler by Gnurro.
 * 
 * Removes backets from input text to handle them as placeholders
 */
const grabAllBrackets = (text) => {
  for (entry of text.match(BRACKETED)) {
    entry = entry.replace(BRACKETS, '');
    if (!state.placeholders) {
      state.placeholders = new Array();
    }

    state.placeholders.push(entry);
  }

  console.log(state.placeholders);
}

/**
 * Function that parses the character's race when they're created. This determines Dagur's behavior towards the player.
 * 
 * @param {string} race
 * @param {string} gender
 */
const parseRace = (character) => {

  let race = character.race.toLowerCase();
  let possibleLines = [
    '"Welcome to the Singing Siren! If you need anything, talk to me. We have warm beds and quality mead!". Toli smiles.\n',
    '"Need a room? We have warm beds and nice mead!". Toli smiles.\n',
  ];

  if (race.includes("orsimer") || race.includes("orc")) {
    race = 'Orsimer/Orc';
    possibleLines.push(
      `"Oh, great. An Orc. Don't bash into my stuff, freak.". You notice disdain in his voice.\n`,
      `"An Orc? Damn brutes. If you so much break a cup, I'll have the guards kick you from the city.". You notice disdain in his voice.\n`
    );
  } if (race.includes("altmer") || race.includes("high elf")) {
    race = 'Altmer/High Elf';
    possibleLines.push(
      '"Greetings, elf. Need a room?"\n',
      `"Good, an Altmer. Now I'm happy.". His speech seems sarcastic.\n`
    );
  } else if (race.includes("dunmer") || race.includes("dark elf")) {
    race = 'Dunmer/Dark Elf';
    possibleLines.push(
      '"What do you want here, elf?"\n',
      '"Another elf? Your kind is not welcome here."\n',
      `"You may stay, but I'm watching you, damn elf. One false movement and I'll have you thrown in the Karth River!"\n`,
      `"What do you want here? Is your kind trying to take over Skyrim? Now a damn Dunmer is Empress!". You notice disdain in his voice.\n`
    );
  } else if (race.includes("bosmer") || race.includes("wood elf")) {
    race = 'Bosmer/Wood Elf';
    possibleLines.push(
      '"Greetings, elf. Need a room?"\n',
      `"Are you... a Bosmer? I've never seen one in real life. You ain't gonna eat me, right?". He seems frightened.\n`,
      `"You're a Bosmer? Is it true that you eat people's flesh?". He seems frightened.\n`,
      `"Oh, a Bosmer? Here! Have this herbal tea, on the house!". He chuckles. "I'm just joking. Please don't eat me.", he says with a nervous laugh.\n`
    );
  } else if (race == 'nord') {
    possibleLines.push(
      `"Welcome, friend! How can I help a ${character.gender == 'male' ? 'brother' : 'sister'} Nord?"\n`,
      `"You must be cold, friend. Here, have a mug of mead on the house.". He hands you a mug of mead.\n`
    );
  } else if (race == 'breton') {
    `"Oh, a midget. How can I help you, friend?", Toli laughs.\n`,
    `"A Breton! Here to visit the beautiful city of Solitude? Welcome!"\n`
  } else if (race == 'imperial') {
    possibleLines.push(
      `"Hello, friend. Here in Solitude we'll make you feel home! We have the best Cyrodilic branch in Skyrim!"\n`,
      `"An Imperial? It's a long way from Cyrodiil, friend. Need a bed to rest?"\n`,
    );
  } else if (race == 'khajiit') {
    possibleLines.push(
      `"Here, kitty kitty kitty.". He laughs out loud. "I'm just joking, friend. What do you need?"\n`,
      `"Oh, a cat on two legs. Don't leave fur in our stuff. We're a hygienic bunch."\n`
    );
  } else if (race == 'argonian') {
    possibleLines.push(
      `"Good day, lizard. How may I help you?"\n`,
      `"A lizard? Nasty.". He seems disgusted at you.\n`
    );
  } else if (race == 'redguard') {
    possibleLines.push(
      `"Good day, friend. Keeping well? Enjoy your stay in Solitude. Talk to me if you need anything."\n`,
      `"A Redguard? You're good people. Strong and foolhardy like us Nords, not a bunrch of milk-drinkers like these damned elves."\n`
    );
  } else {
    possibleLines.push(
      `"Oh, you're a weird one, aren't you?". He laughs. "What race are you, ${character.gender == 'male' ? 'lad' : 'lass'}?"`,
      `"Oh, you're a weird one. What race are you? Doesn't matter, my family and I don't judge. What do you need, friend?". Toli smiles.\n`,
      `"Oh... hello...". Toli looks at you and raises his eyebrow. He's clearly confused because you don't look like any known race. "Do... you... need something?"\n`
      `"Oh... you're on of those... people.". Toli looks at you and raises his eyebrow. He's clearly confused because you don't look like any known race. "Do you... need something?"\n`
    );
  }

  worldEntries.push({
    id: (Math.random() * (0.120 - 0.0200) + 0.0200).toString(),
    keys: `${character.name}`,
    isNotHidden: true,
    entry: character.name + ':['
      + `RACE<${character.name}>:${race};`
      + `APPEARANCE<${character.name}>:${character.appearance.features}/eyes<${character.eyes.eyeColor}>/hair<${character.hair.hairStyle}&${character.hair.hairColor}/height<${character.appearance.height} centimeters>/weight<${character.appearance.weight} kilos>>;`
      + `SUMM<${character.name}>:${character.story}/${character.personality};`
      + ']'
  });

  return possibleLines[Math.floor(Math.random() * possibleLines.length)];
}

/**
 * Simple frunction to capitalize the first letter of a string
 * 
 * @param {string} string 
 */
const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Finds an item in the player's inventory
 * @param {string} itemName 
 */
const findItemInInventory = (itemName) => {
  let loweredName = itemName.toLowerCase().replace(PUNCTUATION_REMOVE, '');
  return getInventory().find(item => {
    return item.name == loweredName;
  });
}

/**
 * Removes an item from player's inventory
 * 
 * @param {string} itemName 
 * @param {integer} itemQuantity 
 */
const removeFromInventory = (itemName, itemQuantity) => {
  let loweredName = itemName.toLowerCase().replace(PUNCTUATION_REMOVE, '');
  let item = findItemInInventory(loweredName);
  if (!(item.quantity == itemQuantity) && (item.quantity > 1 && item.quantity >= itemQuantity)) {
    item.quantity -= itemQuantity;
    return `\nYou have removed ${itemQuantity} ${loweredName} from your inventory.`;
  }

  let index = getInventory().indexOf(item);
  getInventory().splice(index, 1);
  return `\nYou have removed all ${loweredName} from your inventory.`;
}

/**
 * Checks player's inventory and returns what's inside
 */
const checkInventory = () => {

  if (getInventory().length > 0) {
    let items = Object.keys(getInventory()).map((k) => {
      return getInventory()[k].name;
    }).join(', ');

    let itemsWorn = Object.keys(getInventory().filter((item) => {
      return item.status == 'worn';
    })).map((k) => {
      return getInventory()[k].name;
    }).join(', ');

    return `\nYour inventory contains: ${items}. Items equipped: ${itemsWorn}.`;
  }

  return `\nYour inventory is empty.`;
}

/**
 * Returns player's inventory. If the array in undefined, define it
 */
const getInventory = () => {
  if (typeof state.inventory == 'undefined') {
    state.inventory = [];
  }

  return state.inventory;
}

/**
 * Adds item to player's inventory
 * @param {string} itemName 
 * @param {integer} itemQuantity 
 */
const addToInventory = (itemName, itemQuantity) => {

  let loweredName = itemName.toLowerCase().replace(PUNCTUATION_REMOVE, '');
  let item = findItemInInventory(loweredName);
  if (typeof item == 'undefined') {
    item = {
      name: loweredName,
      quantity: itemQuantity,
      status: 'in inventory',
      type: getType(itemName)
    };

    state.inventory.push(item);
  } else {
    item.quantity = item.quantity + itemQuantity;
  }

  return `\nYou have added ${itemQuantity} ${loweredName} to your inventory.`;
}

/**
 * Simple function to make the player equip something.
 * 
 * @param {string} itemName 
 */
const equipItem = (itemName) => {
  let item = findItemInInventory(itemName);
  if (typeof item != 'undefined') {
    if (item.type != 'weapon' && item.type != 'clothing') {
      return `\nThis item is not equippable.`;
    }

    let oldItem = getInventory().find(oldItem => {
      return oldItem.status == 'worn' && oldItem.type == item.type;
    });

    if (typeof oldItem != 'undefined') {
      console.log(`Removing worn status from ${oldItem.name}.`);
      oldItem.status = 'in inventory';
      state.memory.context.replace(` The player is ${oldItem.type == 'weapon' ? 'wielding' : 'wearing'} ${oldItem.name}. `, '');
    }

    console.log(`Removing worn status from ${item.name}.`);
    item.status = 'worn';
    state.memory.context += ` The player is ${item.type == 'weapon' ? 'wielding' : 'wearing'} ${item.name}. `;
    return `\nYou are now ${item.type == 'weapon' ? 'wielding' : 'wearing'} ${item.name}.`;
  }

  return `\nYou do not have \"${itemName}\" in your inventory.`;
}

/**
 * Function to determine item type
 * 
 * @param {string} itemType
 */
const getType = (itemName) => {
  const checker = (input) => {
    return WEAPONS.some(word => input.toLowerCase().includes(word.toLowerCase())) ? 'weapon' :
      CLOTHING.some(word => input.toLowerCase().includes(word.toLowerCase())) ? 'clothing' : 'misc';
  }

  return checker(itemName);
}

/**
 * 
 * 
 * NAME TREATMENT
 * 
 * 
 */
// List the names you wish to replace with random ones in this const.
const BADNAMES = ['Ackerson','Alison','Annah','Anu','Arat','Arrorn','Ashton','Azajaja','Big Red',
'Brot','Brother Gray','Bucklesberg','Captain Dario','Captain Eckard','Captain Hayes','Captain Ian','Captain Illam','Carn',
'Castus','Cloudpeak','Count Gray','Count Grey','Dark Order','David','Delantium','Delerg','Dendrin','Derg',
'Dert','Dessel','Dorna','Dr. Kessel','Dr. Kovas','Drake','Draven','Durge','Ebony Claw','Elam',
'Eldolith','Eliza','Eternals','Father Féval','Father Tomas','Felkan','Flog','Garrick','Grolik',"Gro'tesk",'Haygarth',
'Hessla','Holgard','Isabella',"J'Arel",'Jacob','Jicol','Karth','Kelso',
'Klemto','Klyton','Kralmer','Kyros','Lenay','Lord Rostov','Ludmilla','Magos Cern','Meliodas',
'Merk','Mihrab','Mr. Demar','Mr. Gaange','Mr. Reynolds','Nalin','Nolazir','Null','Nuro','Oalkwardner',
'Olive','Olivia','Oren','Quala','Ragnor','Ral','Rask','Retlad','Roldan','Rolomag','Sheriff Buckly',
'Sir Ignate','Sodran','Svelk','Talia','Teckleville','The Craxil','The Ghoul King','The Great Lich Lord',
'The Nightmare Tyrant','Theo','Trelik','Tulan','Ulivik','Vaughn','Velzix','Wessel','Zalan','Zalmora','Zuzu'];

// This shuffles the arrays.
const shuffle = array =>
    [...Array(array.length)]
        .map((...args) => Math.floor(Math.random() * (args[1] + 1)))
        .reduce((a, rv, i) => ([a[i], a[rv]] = [a[rv], a[i]]) && a, array);

// Generates and saves arrays; ran only once.
function makeArrays() {
  state.mid = [];
  state.end = [];
  list = state.names.map(x => x.substring(1)); // Trim beginning.
  list.forEach(addMid);
}

function addMid(seg) { // Generate array of possible mid-segments.
  while (seg.length > 3) {
    if (state.mid.indexOf(seg.substring(0,4)) === -1) { state.mid.push(seg.substring(0,4)) };
    seg = seg.substring(1);
  }
  state.end.push(seg);
}

function synthName() {
  var name_length = state.names[Math.floor(Math.random() * state.names.length)].length - 1;
  var base = state.names[Math.floor(Math.random() * state.names.length)];
  if (base.length < 3) { return Base; } 
  else {
    var nomen = base.substring(0,3);
    while (nomen.length < name_length)
    {
      mid = shuffle(state.mid).find( x => nomen.substring(nomen.length - 2, nomen.length) == x.substring(0,2))
      if (mid) { nomen += mid.substring(2); }
      else { name_length = 0; } // No valid segments found, just skip ahead.
    }
    var end = shuffle(state.end).find( x => nomen.substring(nomen.length -1, nomen.length) == x.substring(0,1));
    if (end) { nomen += end.substring(1); }
	return nomen;
  }
}

function nameReplace(text) {
  if (!state.names_setup) { setupNamelist(); }
  for (name of BADNAMES) {
    if (text.includes(name)) { text = text.replace(name, synthName()); }
  }
  return text;
}

// This giant list is the list of names that this generator uses as examples to synthesize new names.
// You can replace it with a more specific list, such as names from certain culture.
// To work well, you need at least 100 names on the list.
function setupNamelist() {
 state.names_setup = true;
 state.names = ["Aby","Aage","Aakesh","Aanon","Aarlen","Aaron","Aart","Aasta","Abarden","Abbathor","Abbathorn","Abraham","Abryn",
  "Abu","Acadia","Achard","Acheron","Achim","Achlarg","Ada","Adair","Adalbert","Adanac","Adario","Adeisteen","Adelaide",
  "Adelin","Adelot","Adeen","Aden","Adena","Aderyn","Adeva","Adger","Adia","Adin","Adina","Aditu","Adlay",
  "Adolf","Adolmus","Adoniram","Adraeran","Adriaan","Adriel","Adrienne","Aedha","Aeiran","Ael","Aelgifu","Aelis","Aerdrie",
  "Aeriel","Aerin","Aeris","Aeriss","Aeron","Aeru'in","Aeruin","Aethelweard","Aethon","Aethyr","Afra","Agate","Agatha",
  "Agathon","Agathos","Agenor","Agidius","Agnar","Agora","Agrias","Aguidran","Aguilla","Ahanna","Ahmre","Aicha","Aidan",
  "Aidaron","Aiden","Aidred","Aidro","Aidwin","Aifreda","Aifrida","Aiker","Aikikia","Aikman","Ailcaer","Aileen","Ailric",
  "Ailvar","Aimee","Aimo","Aino","Ainu","Aipheus","Airalyn","Aircristir","Airen","Airis","Airmid","Aisha","Aislinn",
  "Aithne","Aitken","Akebia","Aki","Akira","Aksel","Al","Aladan","Aladar","Aladdin","Alain","Alaine","Alais",
  "Alan","Alana","Alanson","Alardan","Alaric","Alarion","Alaris","Alaron","Alastair","Alastrina","Alastyr","Albaral","Alberich",
  "Alberik","Alberon","Albert","Alberta","Albin","Albion","Albrecht","Albright","Alcan","Alcina","Alda","Aldaren","Aldegond",
  "Alden","Aldert","Aldhelm","Aldis","Aldrich","Aldridge","Aldus","Aldwerth","Aldwin","Aldwulf","Alea","Alec","Alena",
  "Alers","Ales","Alessandra","Alexander","Alexei","Alf","Alfdis","Alfgeir","Alfhid","Alfons","Alford","Alfred","Algernon",
  "Algus","Alhana","Ali","Alia","Alicia","Aliendre","Alienor","Alin","Aline","Alineric","Alisbone","Alison","Alistair",
  "Alister","Allaire","Allard","Allart","Allene","Alliston","Almas","Almer","Almira","Almroth","Almu","Aloise","Alor",
  "Alora","Alorosaz","Aloysius","Alphons","Alrik","Alsop","Althalus","Altin","Alton","Alured","Alvan","Alvey","Alvina",
  "Alvord","Alvred","Alwen","Alwyn","Alya","Alyanna","Alyce","Alyssa","Alyvia","Ama","Amadis","Amain","Amalina",
  "Aman","Amanfea","Amar","Amarah","Amber","Ambros","Amelia","Ames","Amethyst","Amilion","Amin","Amina","Amineh",
  "Ammdar","Amschel","Amundi","Anandra","Anastasia","Anatol","Anatolia","Ancarion","Ancelyn","Anclaiar","Ancla´ar","Andara'an","Andaraan",
  "Andemon","Andni","Andolan","Andre","Andrei","Andrew","Andrus","Aneurin","Anfar","Angelica","Angelina","Angharad","Angheryn",
  "Angmar","Angus","Anici","Anigh","Anika","Anita","Anitra","Anlaf","Anna","Annion","Annora","Anouar","Anseim",
  "Ansel","Anskar","Anson","Antal","Antalya´ar","Antares","Antheirne","Anton","Antone","Antony","Antrim","Anvar","Anya",
  "Anzie","Apad","April","Apthorp","Aquill","Arabel","Arabella","Arabeth","Aradan","Aradh","Aragon","Aragorn","Arakin",
  "Aralik","Aranel","Arania","Arathorn","Aravis","Arawn","Arax","Araz","Archibald","Arcarune","Arctor","Ardal","Arden",
  "Arder","Ardesh","Ardis","Areagne","Arell","Areta","Aretas","Argethlam","Argoeth","Ari","Aria","Ariad","Arian",
  "Arianth","Aribeth","Aric","Arid","Ariel","Aries","Arilyn","Arioch","Arka","Arkadia","Arkron","Arkwright","Arlaith",
  "Arlan","Arlana","Arlean","Arleano","Arlo","Arlya","Armand","Armar","Armin","Armitage","Armo","Armod","Arn",
  "Arnbella","Arnesen","Arnfinn","Arngrim","Arni","Arnlaug","Arno","Arnold","Arnor","Arnora","Arnot","Arnthora","Arnuif",
  "Arnulf","Arnvid","Aron","Arrah","Arronax","Arshavir","Arshel","Artemis","Artemus","Arthol","Arthryn","Arthur","Artnistead",
  "Artreyu","Artur","Arun","Arvid","Arvida","Arving","Arvo","Arwen","Arwin","Aryen","Aryion","Aryon","Aryus",
  "Arzamark","Asa","Asaf","Aschar","Asfrid","Asgard","Asger","Asgerd","Asgrim","Ash","Ashan","Ashane","Ashburton",
  "Ashcar","Ashdown","Ashgaroth","Ashley","Ashlyn","Ashne'e","Ashnici","Ashur","Asiria","Askew","Askold","Aslak","Aslan",
  "Asleif","Aslior","Asperon","Asta","Astar","Astinus","Astnid","Astnild","Astoiphe","Astra","Astraea","Astran","Sigrid",
  "Astrin","Atazra","Athabasca","Athana","Athol","Atiaran","Atli","Atmeh","Atreyu","Atropos","Atticus","Attor","Atul",
  "Aturin","Atyre","Aubrey","Aud","Audrey","Audrianna","Audric","August","Augustus","Aule","Aulius","Aun","Aura",
  "Aurian","Auril","Aurion","Aurora","Avall","Avarath","Avascaen","Avedar","Aveole","Avery","Avon","Avril","Axel",
  "Aya","Ayame","Ayaron","Ayarèn","Ayin","Ayir","Aylin","Aylmer","Ayrie","Azeal","Azeezeh","Azgoth","Azhrarn",
  "Aziz","Azmodeus","Azrean","Azreck","Azriaz","Aztira","Azure","Azuth","Baba","Babacar","Babrak","Babrine","Babylos",
  "Baduk","Baern","Baeron","Baervan","Bag","Bahamut","Baird","Bal","Balain","Baldor","Baldrick","Balduin","Baldur",
  "Baldwin","Balendar","Balfour","Balin","Baliol","Ballard","Balor","Balthasard","Balthazar","Bandobras","Bane","Baraca","Barahir",
  "Barak","Baralan","Baravar","Barbara","Bardach","Bardel","Bardi","Bardsley","Bardwell","Barend","Barent","Baring","Barll",
  "Barlo","Barlow","Barnabas","Barnas","Barnus","Barr","Barret","Barron","Barry","Barstow","Barthel","Bartle","Bartnel",
  "Barton","Baslayan","Bayard","Beams","Beatrix","Bechir","Beck","Bede","Bedegran","Begnus","Beldaran","Beldas","Belerion",
  "Belgarath","Belgarion","Belita","Bella","Belle","Bellin","Bellinus","Belloc","Belrene","Beltane","Belva","Ben","Benekander",
  "Bengt","Benita","Benoist","Beorn","Beowulf","Bera","Bercan","Berek","Berem","Beren","Bergen","Bergthor","Berim",
  "Bern","Berna","Bernhart","Bernt","Berronar","Berryn","Bersi","Berta","Bertil","Bertilde","Bertram","Bertran","Bertrem",
  "Beryl","Besma","Bestagar","Beth","Bevil","Beyash","Beylard","Bhimrao","Bhoskar","Bhupindar","Bidwell","Bilbo","Bile",
  "Bilmar","Bindon","Bion","Bipin","Birath","Birbeck","Birchard","Birger","Birgit","Birket","Bisuneh","Bjarni","Bjorn",
  "Bjornstern","Blackwood","Blade","Blaen","Blair","Blame","Blasco","Blaze","Bledsoe","Blenda","Bleran","Blount","Blunyc",
  "Bninna","Bo","Bodil","Bodvar","Bolthorn","Boner","Booker","Boott","Boris","Bork","Borlace","Bormor","Boromir",
  "Bors","Botho","Botolf","Bourke","Bowie","Boyd","Bracca","Brace","Bracken","Brand","Brandec","Brangwen","Brann",
  "Brannon","Branwell","Branwen","Breanon","Bremen","Brenna","Brenner","Brent","Bress","Bretaine","Breyugar","Brianna","Bridget",
  "Brielle","Brigantu","Brighton","Brinn","Brion","Bristan","Brita","Brithael","Brock","Brockden","Brodhead","Brodribb","Brogan",
  "Bron","Brona","Bronwyn","Bror","Broun","Bruna","Bruno","Brunt","Brynhild","Brynit","Bryoni","Bunnvor","Bupu",
  "Burcan","Buri","Burkard","Buzurg","Byam","Byblos","Byre","Byrna","Byrne","Bysshe","Cabell","Cabillo","Caddor",
  "Caden","Cadfael","Cadmar","Cadrach","Cadwallader","Caecyn","Cael","Caelon","Caer","Cai","Cail","Cairn","Caitlin",
  "Caladon","Calandria","Calbraith","Calder","Cale","Caleb","Calera","Caliban","Callan","Callcott","Calmic","Calrohir","Calumn",
  "Calvert","Camber","Cambree","Camiya","Canina","Caprice","Cardon","Caramon","Carelia","Carey","Caribou","Caris","Carl",
  "Carless","Carli","Carlyle","Caryne","Caron","Carsten","Carvell","Caryl","Cashin","Caspian","Cassandra","Cassaway","Cathal",
  "Catherine","Cathla'in","Cathlain","Cathlin","Cayl","Caylin","Cecilia","Cecily","Cedric","Cedrick","Cedrim","Celadae","Celebdil",
  "Celeborn","Celeren","Celes","Celeste","Celestine","Celia","Celowen","Cemark","Ceomyr","Ceowulf","Cercyon","Ceremon","Cerimon",
  "Cerindar","Cermor","Cernd","Ceryx","Cespar","Cevir","Ceylinn","Chaka","Chalfant","Challen","Chamon","Chanti","Chard",
  "Charissa","Charlene","Charlotte","Chauncey","Chauntea","Chavir","Chaya","Checotah","Chevonne","Chevran","Chichester","Chimaera","Chiodwig",
  "Chiron","Chittenden","Chloe","Christopher","Chronepsis","Chronos","Chrowder","Chuz","Cid","Cilmar","Cinerva","Cirkin","Civar",
  "Claed","Clafin","Claire","Clarinda","Claudia","Cleghorn","Clerihew","Clinch","Clipster","Clopton","Cloud","Clover","Clovis",
  "Cnud","Cnut","Coalter","Cobryn","Coddry","Coel","Coela","Cohn","Colden","Colgan","Colmen","Colon","Colwyn",
  "Coma","Conall","Conan","Congal","Conlan","Conn","Connell","Connidas","Connon","Connop","Conor","Conrad","Constantius",
  "Conwy","Conyasal","Coprates","Cora","Coral","Corbin","Corellon","Coren","Corin","Corinne","Corinth","Cormac","Cornelius",
  "Corrowr","Corry","Corryn","Corwin","Cotton","Cowan","Cowden","Cowper","Coyan","Craigh","Cray","Crewzel","Creydah",
  "Cronyn","Croyble","Crundall","Crynal","Crysania","Cryshandylin","Cryunnos","Cuall","Cuane","Cuddry","Cuhaid","Culiross","Culkin",
  "Cullen","Cullyn","Cuthalion","Cuthbert","Cylarus","Cylie","Cylmar","Cymbeline","Cyndor","Cynoril","Cyria","Cyriel","Cyrilla",
  "Cyrillus","Cyrus","Cyryl","Cythnar","Cyton","Daburn","Daen","Dagar","Dagda","Dagmar","Dagni","Dagny","Dagwyn",
  "Dahil","Daikkah","Daila","Daila'in","Daimhin","Daimon","Daisy","Dakamon","Dakoda","Dalamar","Dall","Dalla","Dallandra",
  "Dalziel","Damar","Damien","Damon","Dana","Danforth","Daniel","Dannun","Dannyn","Danu","Danuvius","Daood","Daphin",
  "Dara","Daragor","Darandriel","Darell","Darien","Dario","Darius","Darkash","Darkboon","Darkspur","Darlis","Daron","Darrell",
  "Darrin","Darvin","Daryan","Dashiell","Dashwood","Dasyani","Dathan","Dathanja","Daugas","David","Davnet","Davros","Dawn",
  "Dayyan","Dekteon","Delevan","Delita","Dell","Dellin","Delmund","Demarest","Demi","Deminar","Demtris","Denethor","Denhain",
  "Denor","Denton","Denzil","Deogol","Derfel","Derian","Dermaria","Derran","Derroll","Derval","Dervilia","Desmona","Devabriel",
  "Devaron","Deveron","Devra","Dexter","Dhakos","Dhan","Dharijor","Dholemtrix","Dhur","Diadra","Diagur","Dian","Diarmud",
  "Diderik","Diehi","Dighton","Dillon","Dimura","Dinham","Dinivan","Dino","Dionetta","Diony","Dirk","Dirrach","Divos",
  "Djamal","Dmitri","Doak","Dolman","Dolyan","Domnu","Donagh","Donal","Donblas","Dongal","Doniol","Donivesh","Donovan",
  "Doral","Dorea","Dorian","Dorin","Dorn","Dornhnall","Dorr","Dorsan","Dorvai","Dotta","Doud","Dougal","Doust",
  "Draco","Dragan","Dragus","Dragutin","Draka","Drake","Drako","Dran","Draoi","Draven","Drax","Drayko","Dred",
  "Dreed","Drexel","Drezael","Drezaem","Drin","Drinda","Drion","Drusilla","Drynn","Dréagg","Duain","Duald","Duana",
  "Duer","Dugal","Dugald","Dugdale","Dulasiri","Dumathoin","Dunbar","Dundas","Dunglas","Dunnabar","Dunstan","Dunwody","Duny",
  "Dunya","Dur-Shuk","Duran","Durek","Durin","Durnik","Durward","Dwarkanath","Dweomer","Dwyer","Dyce","Dyer","Dygardo",
  "Dyke","Dylan","Dymphna","Dynar","Dyneley","Dynera","Dynie","Dytan","Dyvim","E'thane","Eadweard","Eager","Eamon",
  "Eanger","Eardley","Earle","Earnest","Eastman","Ebany","Ebba","Eberhard","Ebony","Echael","Eckert","Eckhard","Ector",
  "Edcyl","Edda","Edeva","Edgar","Edina","Edla","Edmond","Edmondstone","Edric","Edrie","Edson","Eduard","Edwin",
  "Edwina","Edwyn","Eevin","Efiath","Efrem","Egan","Egbert","Egerton","Egil","Egon","Egron","Ehlreth","Ehrman",
  "Eilhard","Eilif","Eilinud","Einar","Eindrini","Eirech","Eirik","Eiron","Eithne","Eivind","Ekaterina","Elaine","Elath",
  "Elbert","Eldath","Eldavon","Eldgrim","Eldid","Eldin","Eldon","Eldred","Eldric","Eldrin","Eldron","Eldìvèn","Eleanor",
  "Eleazar","Electa","Elelil","Elena","Elendil","Eleno'in","Elentari","Elerion","Elessar","Elfnida","Elfnide","Elfnieda","Elford",
  "Elhanan","Eliakini","Eliard","Elinor","Elion","Eliseth","Elispeth","Elisseer","Elistan","Eliwood","Elizabeth","Ella","Ellanath",
  "Ellen","Ellin","Ellingwood","Ellydryr","Ellynor","Elmeric","Elmira","Eloisa","Elora","Elowen","Elrad","Elric","Elrik",
  "Elrodin","Elron","Elrond","Elsa","Elsbeth","Elsdon","Elspeth","Elswyth","Elton","Elu","Elva","Elvalind","Elvarion",
  "Elvin","Elvina","Elvira","Elvrit","Elvérion","Elwell","Elwin","Elwyn","Elysia","Emberyl","Emerynn","Emirah","Emma",
  "Emna","Emory","Endemian","Endicott","Endoray","Endrede","Endsor","Engeihard","Enigma","Enn","Ennorath","Envi","Enzoray",
  "Eolair","Eomer","Eosin","Eowyn","Ephyre","Erana","Erard","Ercan","Erdmann","Erebor","Ergon","Erian","Eric",
  "Erich","Erie","Erik","Erika","Erilyth","Erland","Erlend","Erling","Ernald","Ernan","Ernata","Errine","Ervin",
  "Eryka","Eryn","Esghar","Eslin","Esmeralda","Esmond","Esnar","Essa","Esselin","Estheria","Estrella","Etelka","Ethelbearn",
  "Ethelbert","Ethelburga","Ethelred","Ethelreda","Eudo","Eugene","Eulala","Evadne","Evaine","Evald","Evan","Evarts","Evelina",
  "Evelyn","Everard","Evert","Evind","Evo","Evolyn","Evska","Ewald","Ewen","Ewugan","Eystein","Eyulf","Eyvind",
  "Ezail","Ezellohar","Ezirith","Ezme","Ezrabar","Ezri","Faber","Fabian","Fael","Faelyn","Fahs","Fairfax","Fairtnan",
  "Falathar","Falcon","Falgar","Fali","Falias","Falkiner","Falmalinnar","Falyrias","Fanchon","Fangorn","Fanshaw","Faraday","Farah",
  "Farale","Faramir","Faran","Farathar","Farid","Farith","Farli","Farnham","Farouk","Farquhar","Farrin","Farwehl","Fatima",
  "Fausto","Fawn","Faysal","Fea","Feargus","Fedor","Feike","Felam","Felladin","Fellador","Fellathor","Fellow","Fenella",
  "Fenton","Fenwick","Fera","Ferantay","Ferazhin","Ferdinand","Fergus","Fernand","Feron","Feustmann","Fhinders","Fhorgeir","Fiana",
  "Fiathna","Fielding","Fikir","Filippe","Finarfin","Finbar","Findegil","Findley","Finegan","Fingal","Fingalla","Fingil","Finias",
  "Finn","Finnbogi","Finos","Fiona","Fiorag","Fiori","Firca","Firin","Firon","Firozhan","Fistandantilus","Fistar","Fistor",
  "Fitzedward","Fitzroy","Fizban","Fjolnir","Flandrena","Flare","Flavius","Flint","Floki","Florimund","Flosi","Flygare","Flynn",
  "Fnida","Fomorii","Forbus","Forester","Fornost","Foronte","Fothergill","Francisco","Frayja","Freda","Frederic","Frederica","Frederick",
  "Fredrick","Fredrik","Freeborn","Freeman","Frey","Freya","Freydis","Fridgeir","Frodo","Fryniwyd","Fuad","Fumorak","Furnifold",
  "Fury","Fyodor","Fyodr","Fyza","Gaarn","Gabniela","Gabriel","Gadsby","Gaea","Gael","Gaelinar","Gaena","Gaerdal",
  "Gaillard","Gairdner","Galach","Galadren","Galan","Galanna","Galapas","Galaphon","Galar","Galbard","Galderon","Galdor","Gale",
  "Galeia","Galen","Galfrey","Galion","Galrandar","Galrion","Gama","Gandalf","Ganduil","Ganith","Gannon","Ganvan","Gardi",
  "Garet","Gareth","Garion","Garith","Garl","Garland","Garlenon","Garn","Garon","Garrick","Garrott","Garth","Gartnas",
  "Garvin","Garwood","Gaston","Gavendra","Gavin","Gavina","Gawain","Gealsgiath","Gebhard","Geir","Geirmund","Geirstein","Gelonna",
  "Genevieve","Geoffrey","Georgii","Gerald","Gerard","Gerd","Gerhard","Gerhart","Gerloc","Gerrard","Gerreint","Gerrish","Gertrude",
  "Gervaise","Gesin","Gest","Ghirra","Ghislain","Gholson","Gia","Gibbon","Gilberta","Gilda","Gilden","Gildersleeve","Giles",
  "Gilfanon","Gilian","Gilir","Gilli","Gillion","Gillyn","Gilm","Gilraen","Gilthanas","Gimli","Gird","Girin","Gisgin",
  "Gizur","Gladstone","Glassford","Glebur","Gleda","Gleocyn","Gleridower","Glida","Glogan","Gloisur","Glorfindel","Glugwyn","Glum",
  "Glyn","Glynn","Gnazia","Godfred","Godfrey","Godwin","Goibhniu","Golding","Goldwin","Gollum","Gongalo","Goodhue","Gorbash",
  "Gordalius","Gorias","Gorion","Gorm","Gotthard","Govier","Govind","Gowen","Grace","Graham","Graine","Gralon","Grani",
  "Grania","Gravin","Greegan","Greenleaf","Gregor","Gregory","Grendahl","Greyfell","Grian","Gridley","Griffid","Griffin","Griffith",
  "Griggs","Grim","Grima","Grimhilda","Grimnir","Grindan","Griniing","Grisha","Griswold","Groa","Grover","Grunak","Grunnhild",
  "Gruumsh","Gualat","Gudmund","Gudmundur","Gudrid","Gudris","Gudrun","Guibert","Guida","Guido","Gulian","Gunila","Gunnar",
  "Gunning","Gunther","Gurnarok","Gurney","Gustav","Guthorm","Guthrie","Guthum","Gutzon","Guy","Gwacyn","Gwaihir","Gweddyn",
  "Gwen","Gwenca","Gwenda","Gwendolyn","Gwenevere","Gweniver","Gwildor","Gwoc","Gwomyr","Gwydion","Gwyn","Gwyneth","Gwynfryd",
  "Gwyran","Gwythinn","Gyda","Gylian","Gymir","Haakon","Habib","Hablot","Hack","Haddon","Hadrian","Haestan","Hafez",
  "Hafgrim","Hagar","Haigh","Hakatri","Haki","Hakon","Halbert","Halcyon","Haldane","Haldor","Hale","Halfdan","Haliina",
  "Hall","Halldis","Halldor","Halley","Hallfred","Hallfrid","Hallgerd","Hallkel","Hallock","Halloweii","Hallveig","Halvord","Hamlin",
  "Hamnet","Hanford","Hani","Haninah","Hannibal","Hanoran","Hansine","Hapweth","Harald","Harbaugh","Harcourt","Hardernan","Hardon",
  "Hardwicke","Harek","Harkness","Harlan","Harlo","Harold","Haroon","Harpo","Harren","Harthan","Harthran","Hartpole","Hartwig",
  "Harwood","Hasket","Hassan","Hastein","Hatcher","Hattrick","Hauk","Havard","Havelock","Hayvan","Hazard","Hazel","Haziran",
  "Hazrond","Healdon","Heardred","Heaslip","Heather","Hector","Hedda","Hedin","Hedwig","Heimer","Helena","Helga","Helgi",
  "Helir","Helix","Helm","Helma","Helmi","Heman","Hemming","Hendrik","Hengist","Henna","Henrick","Henry","Geramon",
  "Herdis","Herekin","Hereward","Herijar","Hermione","Heron","Hertha","Heryom","Herzog","Heward","Hhaba'id","Hhabezur","Hickling",
  "Hidohebhi","Hifryn","Hild","Hilda","Hildebrand","Hildegarde","Hildric","Himli","Hisar","Hislop","Hjalmar","Hjalti","Hjeldin",
  "Hjort","Hjorth","Hlif","Hoadley","Hoar","Hobart","Hodgdon","Hogg","Hogni","Holbrook","Holger","Holgi","Hollister",
  "Holly","Homli","Hookham","Horan","Horatio","Hord","Horik","Hormstein","Horsa","Hortensia","Horton","Hoskuld","Hosni",
  "Hossein","Howarth","Howland","Hrafn","Hrapp","Hrefna","Hrethel","Hring","Hroald","Hrodyn","Hrolf","Hrothgar","Hrugan",
  "Hruggek","Hruse","Hrut","Huffatn","Hulbeart","Hulda","Hultz","Humbert","Hunter","Hurd","Hurgal","Hurvin","Hussain",
  "Hustana","Hyarantar","Hyarante","Hyder","Hyfryn","Hygelac","Hylissa","Hynman","Hyrak","Ian","Iana","Ibitz","Ibrahim",
  "Ibrandul","Ica","Icarus","Icava","Ick","Ida","Idarolan","Iden","Idris","Iduna","Iduné","Ies'lorn","Igjaru",
  "Igor","Ikarin","Ilena","Ilermath","Ilia","Iliriya","Illentik","Illuin","Illyana","Ilmare","Ilniora","Ilthoss","Iluvatar",
  "Ilya","Ilyesha","Imajin","Imnar","Imoen","Imphela","Imrador","Imrahan","Imrahim","Imril","Imryr","Inahwen","Indech",
  "Indigo","Indira","Indreju","Indria","Ingald","Ingeborg","Ingen","Ingi","Ingirid","Ingolf","Ingram","Ingrid","Ingunn",
  "Inifael","Inigo","Inisfa'il","Iosaz","Iosef","Irgash","Irial","Irian","Iris","Irma","Irphilin","Irsai","Irvin",
  "Irwick","Isael","Isak","Isambard","Isbeorn","Iscal","Iselore","Isengard","Isengrim","Iserion","Isgrimnur","Ishmael","Isidora",
  "Isiki","Isildur","Isilith","Isleif","Ismail","Isolde","Isorn","Issak","Ithaca","Iuz","Ivan","Ivar","Ivor",
  "Ivy","Iwanda","Iyu'nigato","Izard","Izebel","Izvire","Jace","Jacinth","Jacoby","Jacor","Jade","Jaden","Jadzia",
  "Jael","Jaffar","Jagadis","Jaheira","Jahrec","Jahverbhai","Jalasil","Jalavier","Jaligal","Jamila","Janda'nan","Jandanan","Janix",
  "Janna","Janus","Janvel","Jarak","Jarazal","Jared","Jarek","Jarnagua","Jarriel","Jarvin","Jasara","Jasek","Jaseve",
  "Jasha","Jasmine","Jason","Javair","Javon","Jawaharial","Jayce","Jayden","Jaylidan","Jayna","Jaysen","Jazhara","Jazrel",
  "Jedd","Jeffen","Jehryn","Jelyn","Jenantar","Jenkin","Jennifer","Jens","Jensine","Jephson","Jerec","Jeryth","Jesiper",
  "Jespar","Jesslyn","Jestyn","Jethis","Jevan","Jevist","Jezryanadar","Jhael","Jhaelen","Jhany","Jhardamòr","Jharkor","Jhary",
  "Jihad","Jillian","Jingizu","Jintah","Jiriki","Jirnost","Jocelyn","Jochan","Johannes","John","Jolan","Jomano","Jonaya",
  "Joran","Jordan","Joriel","Jornadesh","Jorunn","Joscelyn","Joseph","Josephine","Josette","Joshua","Jotham","Jovena","Jubini",
  "Jullana","Junius","Juno","Juntalin","Jura","Jurim","Jusif","Juss","Jyresh","K'aarna","Kaarna","Kael","Kaelin",
  "Kaffa","Kai","Kaia","Kailyn","Kaimana","Kaitlinn","Kaja","Kalan","Kalantir","Kalar","Kaldar","Kaleen","Kalen",
  "Kalf","Kalia","Kalina","Kalvan","Kalvaro","Kalyra","Kalysha","Kamril","Kamshir","Kanoa","Kaori","Kaprin","Kara",
  "Karali","Karel","Karelia","Kari","Karim","Karinca","Karine","Karis","Karitsa","Karker","Karl","Karlsefni","Karran",
  "Karya","Kaschak","Kasia","Kaspar","Kasreyn","Kathena","Kathran","Katishimo","Katla","Katnina","Katrin","Katrina","Kavalam",
  "Kavalnir","Kaylianna","Kaylin","Kazairl","Kazalim","Kazir","Keavy","Keelan","Kegan","Keiko","Keldorn","Kelin","Kellin",
  "Kelma'in","Kelson","Kelth","Kelvin","Kemble","Kendall","Kendra","Kendrick","Kenesaw","Kenin","Kenny","Kenobi","Kenrick",
  "Kerik","Kerish","Kermit","Kerrigan","Keshar","Kesrick","Kethios","Ketial","Ketil","Kettali","Kevan","Keven","Kevlin",
  "Keyrnon","Khader","Khalia","Khalid","Khanzadian","Kharas","Khealynn","Khelben","Kheldor","Khelen","Khelin","Khelyn","Khendraja'aro",
  "Khenel","Khezeed","Khindawe","Khirsha","Khlor","Khris","Khyved","Ki'ushapo","Kian","Kiborno","Kiera","Kieran","Kikkasut",
  "Kilas","Kilian","Killion","Kimmuriel","Kimura","Kinloch","Kinson","Kippler","Kira","Kiri","Kirjava","Kirk","Kirren",
  "Kirsopp","Kirsten","Kishin","Kisin","Kitiara","Kjeldor","Kjindar","Klaus","Klean","Klerak","Knud","Knut","Knute",
  "Koabon","Kolbein","Kolchash","Kolskegg","Kolya","Kona","Konrad","Konstantine","Korban","Kord","Koreth","Korgan","Korm",
  "Kormar","Kornag","Korska","Kosh","Kota","Kovelir","Krinn","Krishnalai","Kroh","Krom","Kronos","Kuno","Kurd",
  "Kurn","Kurt","Kurin","Kuros","Kurtulmak","Ky'ishi","Ky'varan","Kyle","Kylindra","Kypros","Kyrie","Kyriel","La'ahl",
  "Lachesis","Lachian","Ladia","Ladoros","Laeli","Laelia","Laerrui","Lahar","Lahsai","Lalely","Lamar","Lambi","Lan",
  "Lana","Lance","Lancelot","Landailyn","Landoris","Landrea","Laneth","Langhorne","Langrian","Langston","Lanthal","Lanthorn","Larad",
  "Lardner","Larisa","Larkin","Larn","Larnea","Lars","Larz","Lashar","Lateia","Lathander","Laurana","Laurelin","Laxton",
  "Lazar","Lazlo","Lea","Leareth","Leathian","Lec","Ledyard","Leela","Legolas","Legrand","Leif","Leighton","Leika",
  "Leila","Leilah","Leli","Lembar","Lenka","Lenox","Leo","Leofric","Leon","Leonard","Leonardo","Leopond","Lesesne",
  "Lestyn","Leta","Letor","Lev","Lewellyri","Lexan","Lexx","Lhuc","Lia","Liana","Liena","Lightfoot","Liliane",
  "Lilin","Lina","Lindar","Linmer","Linnea","Lios","Liphar","Lippard","Liptrot","Lirith","Lithar","Littleton","Livermore",
  "Livia","Ljot","Ljotolf","Lluth","Llyn","Llythin","Lobelia","Lobryn","Lobur","Locke","Lockwood","Loddlaen","Lodica",
  "Lodin","Loella","Logan","Loibur","Loili","Lola","Lonvan","Lore","Loric","Lorin","Lormyr","Lothar","Lothrop",
  "Lott","Lotta","Loudon","Louisa","Lovegood","Lovva","Lovyan","Luas","Lucan","Lucca","Lucia","Lucian","Lucinda",
  "Lucius","Lucrecia","Ludmila","Luella","Lufkin","Lugh","Luhsane","Lum","Lumbar","Luna","Lunar","Lunetta","Lupin",
  "Lurican","Lurue","Luscan","Luther","Luthian","Luvina","Lycias","Lydia","Lylas","Lyle","Lymo","Lyndall","Lyndon",
  "Lynette","Lynis","Lynn","Lypilla","Lyra","Lyrian","Lyrin","Lyron","Lysander","Lyssa","Lythia","Lythian","Lytler",
  "Lyzandra","Lyzette","Lórien","Mabon","Macallan","Macaulay","Macer","Mackim","Macvey","Maddern","Maddock","Madelon","Madhao",
  "Madora","Maec","Maegwin","Mael","Maerraent","Mafka","Magda","Magh","Magill","Magna","Magnus","Magus","Mahion",
  "Mahmud","Mahri","Maia","Maidah","Maidak","Maihar","Makoma","Malach","Malachias","Maladack","Malador","Malak","Malar",
  "Malcoff","Malcolm","Malfar","Malia","Maliforin","Malkil","Malto","Malvin","Malvtha","Mama","Mamba","Mana","Manala",
  "Manaverr","Manfred","Mankey","Mannin","Manon","Mansour","Manton","Manwe","Maoll","March","Marcus","Marena","Margarita",
  "Margery","Mariandor","Marid","Marina","Marion","Marissa","Marisse","Mark","Markham","Maroof","Marques","Marsden","Marshtnan",
  "Marsineh","Marta","Martin","Martus","Mary","Maryn","Mathilda","Mathilde","Matilda","Matthew","Matthias","Maudlin","Maura",
  "Mavis","Maxander","Maxfield","Maximilian","Maximus","Maya","Mayhew","Mazrak","Medar","Medart","Medea","Meder","Medrom",
  "Megan","Meghnad","Mehmet","Mekeesha","Melba","Melchior","Meleri","Meliadoul","Melian","Melisande","Melkor","Mellyora","Melnyth",
  "Melora","Melva","Melvaig","Memor","Men","Menard","Mendolin","Menelvagor","Mennefer","Meoran","Mephistopheles","Merah","Merasye",
  "Meredith","Meriadoc","Merifa","Merivan","Merlin","Merrilee","Merryn","Mervyn","Merwold","Merwolf","Mes'ard","Meta","Methos",
  "Methuen","Michael","Michel","Mideya","Midhat","Midra","Mignon","Miguel","Mikhail","Mila","Milada","Milander","Milandro",
  "Mileaha","Millard","Milo","Mimir","Mina","Minella","Miner","Minna","Minx","Mira","Miragon","Miranda","Mirandros",
  "Miriel","Mirrash","Mirromi","Miryam","Misha","Mishanti","Misin","Mist","Mithrandir","Mithryl","Mitre","Miwa","Mizra",
  "Moda","Modeus","Moffett","Mohammed","Mohieddin","Moina","Moira","Moiriane","Moisur","Molina","Mona","Monach","Montfort",
  "Mora","Moradin","Mord","Moredlin","Morgan","Morgon","Morgwin","Moriana","Morik","Morin","Morley","Morna","Morpheus",
  "Morrigan","Mortos","Mortrock","Morven","Moya","Muammar","Mubur","Muhammed","Muhlwena","Mujibur","Muktar","Munin","Murdo",
  "Murias","Murina","Murrough","Mussa","Mustadio","Mustafa","Mylin","Mylé","Myna","Myra","Myriam","Myrick","Myrmeen",
  "Myrna","Myron","Myrrdyn","Myrrha","Myshella","Mythil","Myvor","N'hadha","Nada","Nadezhda","Nadia","Nadir","Nagai",
  "Nagel","Nagvar","Nahar","Naia","Naidel","Najib","Nakea","Nalia","Nall","Nanorion","Naois","Naomi","Napollo",
  "Narasen","Narcista","Narisa","Narvi","Nasir","Nasser","Natalia","Natasha","Nathalia","Nathalie","Natty","Nazar","Nebron",
  "Nedda","Nedstar","Neelix","Negley","Nemm","Nemuel","Neral","Neri","Nerian","Nerilka","Nerissa","Nerull","Nesbit",
  "Nesta","Nethuan","Neva","Nevaeh","Nevard","Nevena","Nevile","Nevyn","Newall","Newbold","Newman","Neysa","Neza",
  "Nibbidard","Nichol","Nicor","Nienna","Night","Nigil","Nikolai","Nikua","Nila","Nimir","Nimrodel","Nina","Ninian",
  "Niomir","Nira'in","Nirnir","Nita","Nivek","Nivilian","Nizam","Nizar","Nobanion","Nodaran","Noela","Nolan","Nona",
  "Noora","Nor","Nordri","Noreen","Norine","Norle","Norna","Norval","Norvin","Norwood","Nova","Novalis","Novita",
  "Novomira","Nu'endo","Nuada","Nuadi","Nuala","Nuale","Nuanni","Nungo","Nunila","Nura","Nurdoch","Nurgan","Nuri",
  "Nushia","Nyassa","Nylan","Nymara","Nynaeve","Nyra","Nytasa","Oakes","Oalyn","Obed","Oberon","Ocar","Oda",
  "Odar","Odd","Oden","Odilia","Odimus","Odo","Odona","Ofeig","Ogden","Oghma","Ogma","Ogmund","Ogrus",
  "Okander","Olac","Olaf","Oldac","Oldham","Olga","Olissa","Olof","Olorin","Oloru","Olvir","Olya","Omandras",
  "Omar","Omassus","Ombrum","Omer","Onslow","Onufrio","Onund","Onyx","Ooma","Oona","Oonai","Opal","Ophelia",
  "Orah","Orcrist","Ordway","Oriana","Orin","Orion","Orius","Orivaen","Orlandu","Orlata","Orm","Ormsby","Orome",
  "Oron","Orren","Orridge","Orsola","Orson","Osa","Osiris","Oskavar","Ospar","Osric","Oswin","Othello","Othilia",
  "Otho","Othran","Otiluke","Otkel","Otrygg","Ottar","Ottilia","Otto","Overton","Owain","Owen","Owyn","Ozatras",
  "Ozto","Ozur","Padraic","Padrias","Paget","Pala","Palma","Pamar","Pan","Parbha","Pargascor","Parr","Pasca",
  "Paschal","Passmore","Patnas","Pattabhai","Pavel","Pean","Pearl","Pearsall","Peffer","Peiham","Peitar","Peleg","Pelipi",
  "Pellin","Pendleton","Penfield","Pengolod","Penhallow","Penniman","Penrhyn","Pepperell","Pereban","Peredon","Peregrin","Peregrine","Perith",
  "Peronn","Perrin","Persifor","Pestivar","Peter","Pethros","Petra","Petrea","Petronella","Pflarr","Phanuel","Pharatnond","Pharcellus",
  "Phelim","Philo","Philpot","Phimister","Phoenix","Phyrrus","Pia","Picar","Pickman","Pigot","Pike","Pine","Pinkham",
  "Pinkney","Pinkstone","Piotr","Pittheus","Plaisted","Plunimer","Plunkett","Polassar","Pollard","Pollock","Polonius","Polycarp","Pomeroy",
  "Porthios","Powell","Prafulla","Prendergast","Preston","Prichard","Proctor","Prospero","Provida","Psilofyr","Puck","Pue","Pulisk",
  "Pulteney","Purdon","Pyke","Pyros","Pysander","Quaan","Quagel","Qualin","Quan","Quarles","Quasar","Quascar","Quass",
  "Quebba","Quelfinas","Quesan","Queygo","Quiddle","Quinn","Quiss","Quixano","Quora","Quvar","Quvean","Raagon","Raban",
  "Rabind","Rabur","Rach","Rachid","Rackafel","Rackhir","Radagast","Radija","Rae","Rael","Raen","Rafa","Rafael",
  "Rafur","Ragen","Ragna","Ragnal","Ragnar","Ragnhild","Rahaz","Rai","Raikes","Rails","Raimon","Raina","Raine",
  "Raisa","Raistlin","Ralina","Ralmanor","Ralph","Ramen","Ramli","Ramman","Ramona","Ramora","Ramous","Ramza","Ranald",
  "Ranath","Rancor","Rand","Randar","Randoer","Randolf","Randor","Ranfurly","Ranjan","Rankin","Rannuif","Rannveig","Raphael",
  "Rary","Rashiel","Rasputin","Rathack","Rathanos","Rathgar","Rattray","Rauros","Ravenor","Ravi","Rayne","Razamor","Raziel",
  "Razzan","Rebecca","Recoun","Redcliffe","Regalorn","Regnar","Reina","Reis","Relm","Rem","Remi","Remnor","Remus",
  "Renar","Renata","Rendel","Rengoll","Reoc","Resha","Rethral","Reva","Rex","Reyna","Rezah","Rhadry","Rhaederle",
  "Rhaeryn","Rhea","Rhiannon","Rhiow","Rhodhy","Rhona","Rhonda","Rhora","Rhorleif","Rhorvald","Rhundas","Rhymer","Rhynn",
  "Rhys","Riallus","Riamon","Rickard","Ricyn","Rigolio","Rilir","Rinaldus","Ringgold","Risaya","Riss","Rith","Riven",
  "Roach","Roark","Rockhill","Rodefer","Roderic","Rodhan","Rognvald","Roignar","Roland","Rolf","Rollo","Roman","Romelia",
  "Romer","Romney","Ronan","Root","Rorik","Rosalyn","Rosamund","Roscoe","Rose","Rosefyre","Roseline","Roshena","Rosskeen",
  "Roundell","Rowena","Ruadan","Ruan","Rubar","Ruben","Rubrick","Ruby","Rucker","Rudyard","Rufina","Rufus","Ruggles",
  "Ruhollah","Ruinar","Rulian","Rulinian","Rumil","Runa","Runold","Runolf","Runus","Rurik","Rusgar","Ruth","Rutland",
  "Ruwen","Ryana","Rycaro","Rychanna","Rygar","Ryll","Rylla","Rynnyn","Ryodan","Ryoga","Ryoka","Saalem","Sabal",
  "Sabhel","Sabriel","Sabrok","Sacheverall","Sackville","Saddam","Sadler","Sador","Saedd","Saermund","Saeunn","Safrin","Saia",
  "Said","Saifai","Saiwyn","Salina","Salmon","Salter","Sam","Sambrea","Samia","Samira","Sammel","Samuel","Sanfrid",
  "Sano'rye","Sanoreya","Sanoria","Sarcyn","Sardior","Sardul","Sarel","Sarevok","Sargonus","Saria","Sarina","Sarisin","Sariya",
  "Sarrask","Saruman","Sasha","Saska","Saturn","Sauron","Savah","Savion","Sawdon","Sayan","Scenesefa","Scudamore","Scythe",
  "Sebastian","Sebrinth","Sechier","Sedgely","Seersha","Segojan","Sehanine","Seitarin","Selema","Selena","Selene","Selig","Selim",
  "Selina","Selis","Selith","Selune","Selwyn","Semuta","Senith","Senna","Sephia","Sephya","Sepiroth","Seramir","Seraphina",
  "Serena","Serenyi","Sergei","Seriozha","Seryan","Seryl","Seryth","Seth","Sethron","Sevadia","Severin","Sevros","Sevy",
  "Sha'dar","Sha'rell","Shackerley","Shadizad","Shadrach","Shadworth","Shaera","Shaivar","Shaivir","Shala","Shalamar","Shalandain","Shalat",
  "Shalhassan","Shalindra","Shalon","Shalpan","Shamane","Shamir","Shana","Shandalar","Shanell","Shar","Sharada","Sharaq","Shard",
  "Sharif","Sharilla","Sharl","Sharla","Sharmaine","Sharman","Sharna","Sharnira","Sharra","Sharteel","Shaundra","Sharyn","Shayera",
  "Shayla","Shayll","Shayonea","Shea","Sheegoth","Sheeryl","Sheherazad","Shemsin","Sheridan","Sherif","Sherry","Shezael","Shima'onari",
  "Shintaro","Shiza","Shuinn","Shuna","Shurakai","Shurik","Shushila","Shylock","Siandar","Sibert","Sibyl","Sidhe","Siglinde",
  "Sigmund","Signe","Sigred","Sigrid","Sigtrydd","Sigurd","Sigvaldi","Silatasar","Silius","Silma","Silmariel","Silphane","Silvain",
  "Silvan","Silvanus","Silvera","Silveron","Silvia","Silvyn","Simir","Simmu","Sinbad","Sindarin","Sinir","Sinjin","Siranush",
  "Sirisir","Sirli'in","Sirona","Sirranon","Sirwin","Sisimar","Siski","Sivesh","Siveth","Siward","Sjerdi","Skamkel","Skelmar",
  "Skorian","Slade","Slania","Slater","Slava","Sligh","Slingsby","Smedley","Snargg","Snorri","Snyder","Sodorn","Soilir",
  "Soisil","Sokki","Solaris","Solera","Solevig","Solmund","Solomon","Solvi","Sonnet","Sooth","Sora","Sorass","Sorcha",
  "Sorin","Sornovas","Soth","Southall","Sovaz","Soveh","Soyadi","Sparrow","Sprigg","Squall","Srass","Stabyl","Stanwood",
  "Starkad","Starke","Stedman","Stefan","Stehman","Stein","Steinkel","Steinthor","Stelectra","Stenger","Stenwulf","Steponas","Sterndale",
  "Stetson","Stetter","Stiliman","Stilingfleet","Stopford","Storm","Stowna","Strachan","Straygoth","Stroud","Strudwick","Strybyorn","Strykar",
  "Sturla","Sturm","Styx","Sudeha","Suleiman","Sulimo","Sulkas","Sumarlidi","Suras","Surridge","Susin","Susur","Sutan",
  "Svala","Svan","Svante","Svatopluk","Sveata","Sven","Swain","Swartwout","Sydnor","Syllva","Sylvane","Sylvia","Sylvin",
  "Sylvine","Syndarra","Synnyn","Syranita","Syrioll","Tabar","Tabitha","Tabor","Tabu","Tacey","Tachel","Tadashi","Tadeus",
  "Tadia","Tadisha","Tadra","Taennyn","Taeynnyn","Taggart","Tahir","Tailabar","Taina","Takhisis","Taleen","Talen","Taleth",
  "Talia","Taliesin","Talin","Talmora","Talobar","Talona","Taloxi","Taltos","Talus","Tamar","Tamara","Tameryn","Tamias",
  "Tamlin","Tamoreya","Tanina","Tanis","Tanith","Tanyc","Tar","Tara","Taran","Tarcia","Taria","Tarik","Taromas",
  "Taron","Tarran","Taryn","Tas","Tasharra","Tasker","Tatyana","Taurus","Taveli","Taylian","Taylin","Tedra","Tegan",
  "Tekia","Telena","Tell","Tench","Tenna","Tenser","Teoddry","Ter","Teralyn","Teressa","Terix","Teruah","Tesin",
  "Tesla","Tessa","Tevran","Thaal","Thacker","Thaddeus","Thaki","Thal","Thalen","Thalessa","Thalia","Thalna","Tham",
  "Thana","Thane","Thanatos","Thantos","Thar","Tharbad","Tharkesh","Tharn","Thax","Thecla","Theda","Theleb","Theoden",
  "Theodor","Theodoric","Theodosia","Theodric","Theoric","Thera","Therad","Theresa","Therios","Theros","Thesius","Thieras","Thieryn",
  "Thingyr","Thio","Tholan","Thomas","Thomulor","Thora","Thoran","Thorarin","Thorburn","Thord","Thordarson","Thordis","Thorfel",
  "Thorfinn","Thorfinna","Thorgeir","Thorgerd","Thorgest","Thorgils","Thorgrim","Thorgunna","Thorhall","Thorhalla","Thorhild","Thorin","Thorir",
  "Thorkatla","Thorkell","Thorkild","Thormod","Thormodr","Thormond","Thorn","Thorndike","Thornwell","Thorold","Thorolf","Thorsager","Thorstein",
  "Thorunn","Thorvald","Thorvaldur","Thorvar","Thorzyl","Thoth","Thrain","Thrand","Throck","Thule","Thurid","Thylda","Thyra",
  "Thyri","Thyrza","Thyssa","Tiana","Tiffany","Tihan","Tika","Tilford","Tilica","Tilir","Tillinghast","Tilloch","Timon",
  "Tioniel","Tirion","Tisha","Tisheri","Titania","Titia","Titiana","Tivernee","Tiyagar","Tnin","Tobias","Tobis","Todhunter",
  "Tolbert","Tolenka","Topaz","Topham","Torc","Tortbold","Tosti","Tosya","Toulac","Tovi","Trafford","Trebor","Trelane",
  "Trelawny","Trella","Trevel","Trick","Trigg","Trill","Triona","Trir","Tristam","Tristan","Trost","Trotwood","Trowbridge",
  "Truesdell","Tuane","Tufnell","Tugan","Tuilleth","Tulio","Tulkas","Tundine","Tunstall","Tuor","Turan","Turgoz","Turhan",
  "Turin","Turpin","Tuttle","Tuula","Twyla","Tylden","Tyldoran","Tylen","Tylien","Tylynn","Tymar","Tymora","Tymoriel",
  "Tynnyn","Tyr","Tyra","Tyranina","Tyreen","Tyrwhitt","Uamian","Ubriani","Ucarsh","Uda","Uhier","Uhlain","Uhlume",
  "Uholedil","Uinen","Ula","Ulf","Ulgor","Ulis","Uljas","Ulji","Ulmaerr","Ulmo","Ulosh","Ulric","Ulrich",
  "Ultron","Umaiar","Umbar","Umda","Umgalad","Una","Uneitna","Ungon","Unius","Unn","Unrak","Unwin","Upal",
  "Upton","Urabi","Urania","Uranos","Uranus","Uriel","Urish","Urokoz","Ursula","Usher","Uta","Utumno","Uusoae",
  "Uvanimor","Uziel","Vabryn","Vadarin","Vadi","Vaeddyn","Vagn","Vai","Val","Valadan","Valandario","Valandor","Valarindi",
  "Valborg","Valda","Valdain","Valdemar","Valen","Valenka","Valentia","Valerand","Valeria","Valerian","Valeska","Valgar","Valgard",
  "Valgerd","Valiah","Valion","Valisa","Valiss","Valistor","Valkor","Valla","Vallo","Valmar","Valminder","Valor","Valsera",
  "Valurian","Valya","Valynard","Vandrad","Vane","Vanechka","Vanidor","Vanion","Vannevar","Vannyn","Vanya","Vanyar","Vanyel",
  "Varda","Vardis","Varina","Varion","Varken","Varnum","Vasava","Vash","Vasha","Vasilii","Vasin","Vaydin","Vaydir",
  "Vayi","Vecna","Veda","Veldahar","Veldan","Velex","Velior","Venable","Vendor","Veorcyn","Vercyn","Verdina","Vereesa",
  "Verline","Vermund","Verna","Ves","Vespar","Vestein","Veva","Vevina","Vexter","Viasta","Vicarr","Vicat","Vicentia",
  "Viconia","Victor","Vida","Vidkun","Vidron","Vieno","Viera","Vierna","Vigdis","Vigfus","Vilhelm","Vilka","Vilrna",
  "Vinatta","Vincas","Vincent","Vintar","Violet","Vircyn","Vishali","Viveka","Vladimir","Vladislav","Vlaric","Vobur","Voirath",
  "Vokos","Voldor","Volkan","Volney","Volodya","Volund","Vonya","Voranor","Vrashin","Vulpen","Vurog","Vusil","Vyecheslav",
  "Vyner","Wadleigh","Waenwryht","Wager","Waisham","Waivan","Wakeman","Wakkar","Walborg","Walda","Waldan","Waldegrave","Waldemar",
  "Waleran","Walford","Walid","Walker","Wanhim","Waring","Wariv","Wark","Warne","Warrender","Warrigel","Warwick","Waryk",
  "Watson","Watt","Waylan","Wayland","Waylon","Wealin","Wedlake","Weilborn","Weiryn","Wel","Wemick","Wendolyn","Wertha",
  "Westcott","Westen","Weyrn","Wharrom","Whitwell","Whyte","Wicca","Wideman","Wightman","Wildhair","Wilfrid","Wilhelm","Wilhelmina",
  "Wilibald","Will","Willa","William","Willock","Willow","Wilma","Wilmar","Wilner","Wilven","Windham","Winfrey","Winian",
  "Winslow","Winton","Wisp","Wisuth","Wivianne","Wizlow","Woart","Wodan","Wolfgang","Wolmar","Womal","Woodfin","Woodruff",
  "Wooligar","Wortley","Wotan","Wulf","Wulfgar","Wulfric","Wulgar","Wychnor","Wycliffe","Wyllows","Wyly","Wynkyn","Wynne",
  "Wynston","Wyvan","Xaandria","Xaath","Xabian","Xabiel","Xabu","Xain","Xalthan","Xan","Xanaphel","Xanathar","Xander",
  "Xandra","Xandria","Xanthon","Xanthus","Xarek","Xarolith","Xaver","Xavier","Xavin","Xela","Xelmonth","Xena","Xenia",
  "Xenoba","Xera","Xercon","Xerravin","Xiombarg","Xoncarg","Xoran","Xulan","Xyas","Xydra","Xyko","Xylah","Xylia",
  "Xymoya","Xystus","Xythrin","Xytrin","Yacima","Yaheira","Yahira","Yaigin","Yakov","Yalan","Yali","Yalin","Yalniz",
  "Yamari","Yana","Yandell","Yangin","Yanira","Yannul","Yara","Yaraia","Yarali","Yardim","Yardley","Yari","Yarim",
  "Yarin","Yarir","Yaritza","Yartrina","Yasimina","Yasir","Yasmina","Yasser","Yastar","Yatay","Yavana","Yazihane","Yelain",
  "Yeni","Yetne","Yevgenii","Yezade","Ygerna","Ygraine","Yishana","Ynryc","Ynvar","Yoda","Yolanda","Yondalla","York",
  "Yradry","Yreoddyn","Yrrkoon","Yrsa","Yrun","Yryllyn","Ysabel","Ysgerryn","Ysolde","Yuri","Yvain","Yvette","Yvonne",
  "Yvyr","Yénisar","Yérusha","Zabdiel","Zacarias","Zachary","Zachris","Zadock","Zahara","Zahra","Zaidh","Zalazar","Zalbar",
  "Zan","Zandra","Zanifa","Zanthar","Zara","Zaranthe","Zared","Zarimarth","Zarquan","Zathras","Zavel","Zaviv","Zay",
  "Zazumel","Zebalane","Zebulon","Zehir","Zelda","Zemenar","Zenda","Zendrac","Zenith","Zenobia","Zenon","Zepher","Zephyr",
  "Zerika","Zerin","Zeswick","Zhalore","Zhanna","Zharvek","Zhenya","Zhirek","Zhirem","Zhoreb","Zia","Zigmal","Zilar",
  "Zinaida","Zincir","Zion","Ziona","Zircon","Zirzihin","Zita","Zoe","Zolabar","Zoltan","Zona","Zora","Zorashad",
  "Zorayas","Zorlan","Zosia","Zotar","Zumurrud","Zurrog","Zykhiralamshad"];
  makeArrays();
}