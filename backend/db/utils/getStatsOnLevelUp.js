const getStatsOnLevelUp = (character, level) => {
  let baseHP = 30;
  for (let i = 1; i < level; i++) {
    baseHP += 10 + (i + 1) * 2;
  }

  let baseExp = 0;
  for (let i = 1; i < level + 1; i++) {
    baseExp += i * 100;
  }

  //fix
  let basePP = 1;
  for (let i = 1; i < level; i++) {
    basePP += 2 + (i + 1);
  }
  let baseMP = basePP;
  if (character.charClass === 'Warrior') {
    baseHP += level * 5;
    basePP += level * 5;
  }
  if (character.charClass === 'Hunter') {
    basePP += level * 10;
  }
  if (character.charClass === 'Mage') {
    baseMP += level * 10;
  }
  if (character.charClass === 'Druid') {
    baseHP += level * 5;
    baseMP += level * 5;
  }

  let newHP = level > character.level ? baseHP : character.maxHealth;
  return [newHP, baseExp, basePP, baseMP];
};

exports.getStatsOnLevelUp = getStatsOnLevelUp;
