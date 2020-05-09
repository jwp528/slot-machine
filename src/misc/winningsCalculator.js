import valueTable from './valueTable'

// checks if there's any winnings from the line given to it
const checkLine = (line) => {
  const results = {
    winnings: 0,
    label: ''
  }

  const match = line.every(reel => reel.label === line[0].label)

  if (match) {
    results.winnings += valueTable[line[0].label]
    results.label = line[0].label
  }

  return results
}

// check if all values are the same
const allMatch = (reels) => {
  const results = {
    matches: false,
    label: ''
  }
  results.matches = reels.every(reel => reel.label === reels[0].label)

  if (results.matches) { results.label = reels[0].label }

  return results
}

// calculates winnings from rows
const getRowWinnings = reels => {
  const results = {
    winnings: 0,
    label: []
  }

  // check row one (indices 1, 2, and 3 respectively)
  const row1 = []
  for (let i = 0; i < 3; ++i) {
    row1.push(reels[i])
  }

  const line1 = checkLine(row1)
  results.winnings += line1.winnings
  if (line1.label !== '') { results.label.push(line1.label) }

  // check row two (4, 5, 6)
  const row2 = []
  for (let i = 3; i < 6; ++i) {
    row2.push(reels[i])
  }

  const line2 = checkLine(row2)
  results.winnings += line2.winnings
  if (line2.label !== '') results.label.push(line2.label)

  // check row three (7, 8, 9)
  const row3 = []
  for (let i = 6; i < 9; ++i) {
    row3.push(reels[i])
  }
  const line3 = checkLine(row3)
  results.winnings += line3.winnings
  if (line3.label !== '') results.label.push(line3.label)

  return results
}

// calculates winnings from columns
const getColumnWinnings = reels => {
  const results = {
    winnings: 0,
    label: []
  }

  // check column 1
  const col1 = []
  reels.forEach((reel, index) => {
    if (index % 3 === 1) {
      col1.push(reel)
    }
  })
  const line1 = checkLine(col1)
  results.winnings += line1.winnings
  if (line1.label !== '') results.label.push(line1.label)

  // check column 2
  const col2 = []
  reels.forEach((reel, index) => {
    if (index % 3 === 2) {
      col2.push(reel)
    }
  })

  const line2 = checkLine(col2)
  results.winnings += line2.winnings
  if (line2.label !== '') { results.label.push(line2.label) }

  // check column 3
  const col3 = []
  reels.forEach((reel, index) => {
    if (index % 3 === 0) {
      col3.push(reel)
    }
  })

  const line3 = checkLine(col3)
  results.winnings += line3.winnings
  if (line3.label !== '') { results.label.push(line3.label) }

  return results
}

// calculates winnings from diagnals
const getDiagnalWinnings = (reels) => {
  const results = {
    winnings: 0,
    label: []
  }

  // check \ diagonal
  const diag1 = [
    reels[0],
    reels[4],
    reels[8]
  ]

  const line1 = checkLine(diag1)
  results.winnings += line1.winnings
  if (line1.label !== '') { results.label.push(line1.label) }

  // check / diagonal
  const diag2 = [
    reels[2],
    reels[4],
    reels[6]
  ]

  const line2 = checkLine(diag2)
  results.winnings += line2.winnings
  if (line2.label !== '') { results.label.push(line2.label) }

  return results
}

// this is only checked if the above checks have returned 0
const getLucky = (reels) => {
  const results = {
    winnings: 0,
    label: []
  }
  const lucky = reels.some(reel => reel.label === 'shamrock')

  if (lucky) {
    results.winnings += valueTable.lucky
    results.label.push('lucky')
  }

  return results
}

const readResults = (reels) => {
  const results = {
    winnings: 0,
    label: ''
  }
  const wholeBoard = allMatch(reels)
  if (wholeBoard.matches) {
    results.winnings += valueTable.wholeBoard[wholeBoard.label]
    results.label = `BIG WINNER! ${wholeBoard.label}`
    return results
  }

  const rows = getRowWinnings(reels)
  results.winnings += rows.winnings
  if (rows.label.length) { results.label += (results.label !== '') ? ', ' + rows.label.join(', ') : rows.label.join(', ') }

  const cols = getColumnWinnings(reels)
  results.winnings += cols.winnings
  if (cols.label.length) { results.label += (results.label !== '') ? ', ' + cols.label.join(', ') : cols.label.join(', ') }

  const diags = getDiagnalWinnings(reels)
  results.winnings += diags.winnings
  if (diags.label.length) { results.label += (results.label !== '') ? ', ' + diags.label.join(', ') : diags.label.join(', ') }

  if (!results.winnings) {
    const lucky = getLucky(reels)
    results.winnings += lucky.winnings
    if (lucky.label.length) { results.label += lucky.label.join(', ') }
  }

  return results
}

export default {
  readResults
}
