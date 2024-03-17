import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.css',
})
export class GameBoardComponent implements OnInit {
  //REEGLID - võrdleme kaheksat ruutu ümber iseenda ->
  // 1. Iga ruut, millel on üks või mitte ühtegi naabrit, sureb justkui üksinduse tõttu(muutub falseks).
  // 2. Iga nelja või enama naabriga ruut sureb justkui ülerahvastatuse tõttu(muutub falseks).
  // 3. Iga kahe või kolme naabriga ruut jääb ellu.
  // 4. Iga ruut millel on 3 naabrit, ärkab ellu(muutub trueks).

  gridWidth = 70;
  gridHeight = 30;
  grid: boolean[][] | undefined;
  isPaused = false;
  newGridWidth: number = this.gridWidth;
  newGridHeight: number = this.gridHeight;
  slow: number = 100;
  normal: number = 50;
  fast: number = 10;
  selectedSpeed: number = this.normal;
  intervalId: any;
  probabilities = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
  selectedProbability: number = 0.5;
  isLoading: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.initializeGrid();
    this.startInterval();
  }

  startInterval() {
    this.intervalId = setInterval(() => {
      if (!this.isPaused) {
        this.isLoading = false;
        this.updateGrid();
      }
    }, this.selectedSpeed);
  }

  applyChanges() {
    this.isLoading = true;
    this.gridWidth = this.newGridWidth;
    this.gridHeight = this.newGridHeight;
    this.initializeGrid();
    clearInterval(this.intervalId);
    this.startInterval();
    this.isPaused = false;
  }

  getAliveCellPercentage(): number {
    if (!this.grid) {
      return 0;
    }
    const totalCells = this.grid.reduce((acc, row) => acc + row.length, 0); // kõik ruudud kokku arvutatuna
    const aliveCells = this.grid.flat().filter((cell) => cell).length; // true ruutude arv kokku
    const percentage = (aliveCells / totalCells) * 100; // arvuta protsent
    return parseFloat(percentage.toFixed(1)); // ümardab arvu 1 kohaliseks pärast koma
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }

  initializeGrid() {
    // seadistame algseisu ruudustikus
    this.grid = [];
    // arvutame kogu arvu ruute
    const totalCells = this.newGridHeight * this.newGridWidth;
    // arvutame ruutude arvu mis peaksid olema elus arvestades etteantud tõenäosust
    const aliveCellsCount = Math.round(totalCells * this.selectedProbability);

    // täidame ruudustiku surnud (false) ruutudega
    for (let i = 0; i < this.newGridHeight; i++) {
      // käime läbi iga rea (kui mitu rida on kõrgusesse)
      this.grid[i] = []; // määrame array igale reale ruudustikus
      for (let j = 0; j < this.newGridWidth; j++) {
        // käime läbi iga veeru rea kohta (mitu veergu on laiusesse)
        this.grid[i][j] = false; // määrame nad kõik false-ks
      }
    }

    // Määrame suvaliselt ruute alive-ks (trueks) kuni õige arv käes mis peab olema true
    let cellsSet = 0; // määrame muutujasse arvu ruute mis on alive-ks(trueks) muudetud
    while (cellsSet < aliveCellsCount) {
      // niikaua kuni see true ruute on vähem kui peab olema...
      const randomX = Math.floor(Math.random() * this.newGridHeight); // muutujad mis on ruudustiku mõõtmetes.
      const randomY = Math.floor(Math.random() * this.newGridWidth); //math.random genereerib kas 1 või 0 ja siis korrutatuna ridade või veergudega
      // math.floor et ümaradad täisarvuni
      if (!this.grid[randomX][randomY]) {
        // vaatame kas antud ruut antud random indeksiga on false, kui on siis jätkame et seda muuta trueks
        this.grid[randomX][randomY] = true; // määrame ruudu trueks
        cellsSet++; // lisame arvu juurde mitu ruutu on trueks muudetud
      }
    }
  }

  updateGrid() {
    // uuendab ruudustikku vastavalt GOL reeglitele
    if (!this.grid) return; // kontrolli kas ruudustik on seadistatud
    const newGrid: boolean[][] = []; // uus tühi array et salvestada uuendatud seis ruudustikust
    for (let i = 0; i < this.gridHeight; i++) {
      // käime läbi iga rida ruudustikus
      newGrid[i] = []; // määrame arraysse iga uue rea
      for (let j = 0; j < this.gridWidth; j++) {
        // käime läbi iga veeru antud rea kohta
        const neighbors = this.countNeighbors(i, j); // iga 8 ruudu kohta ümber ringi kutsume countNeighbors funktsiooni
        if (this.grid[i][j]) {
          // see if lause vaatab hetke seisu originaal ruudustikus grid
          // kui see ruut on elus (true) siis...
          newGrid[i][j] = neighbors === 2 || neighbors === 3; // ... määrame uues ruudustikus uue ruudu saatuse vastavalt GOL reeglitele
          // ehk siis ruut jääb ellu kui tal on 2 või 3 elus naabrit muidu see sureb
        } else {
          // kui see ruut aga pole elus (false)...
          // siis määrame ruudu uues ruudustikus vastavalt elus naabritele
          newGrid[i][j] = neighbors === 3; // uus ruut ärkab ellu kui tal on 3 elus naabrit
        }
      }
    }
    this.grid = newGrid; // määrame ruudustiku grid uue ruudustikuga vastavalt mängu reeglitele
  }

  countNeighbors(x: number, y: number): number {
    // loeb ümber ruudu olevaid elus (true) ruute
    if (!this.grid) return 0; // kontrolli kas ruudustik on seadistatud
    let count = 0; // loeb palju elus ruute on
    for (let i = -1; i <= 1; i++) {
      // see forloop käib läbi 3 ruutu nii ülevalt, alt kui ka sama ruudu pealt
      for (let j = -1; j <= 1; j++) {
        // sama asi aga veeru kohta ülevalt alla
        if (i === 0 && j === 0) continue; // liigume edasi kui ta on mõlemat pidi 0 ehk siis ennast(sama ruut kust pealt loeme) ei loe
        const newX = x + i; // need read arvutavad lahtri indeksid, et kontrollida elavate naabrite olemasolu võrreldes praeguse lahtri asukohaga
        const newY = y + j;
        if (
          newX >= 0 &&
          newX < this.gridHeight && // see tingimus kontrollib, kas arvutatud indeksid (uusX, uusY) jäävad ruudustiku piiridesse->
          newY >= 0 && //ja kas nende indeksite lahter on olemas ja elus.  Kui kõik tingimused on täidetud, ->
          newY < this.gridWidth && // tähendab see, et nende indeksite juures on elav naaber, seega loendusmuutujat suurendatakse
          this.grid[newX] &&
          this.grid[newX][newY]
        ) {
          count++;
        }
      }
    }
    return count; // tagastame arvu elus ruute ümber hetkel loetud ruudu
  }

  toggleCell(x: number, y: number) {
    // kasutame lülitamaks ruutu sisse või välja (true or false)
    if (!this.grid) return; // kontrolli kas ruudustik on seadistatud
    this.grid[x][y] = !this.grid[x][y]; // lülitame kas ruudu sisse või välja nendel koordinaatidel
  }
}
